'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Invoice, LineItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

interface InvoiceFormProps {
  initialData: Partial<Invoice>;
  originalFile: File | null;
  invoiceId?: string; 
}

const defaultInvoice: Invoice = {
  vendor: { name: '', address: '', taxId: '' },
  invoice: { number: '', date: '', currency: '', subtotal: 0, total: 0, taxPercent: 0, poNumber: '', poDate: '' },
  lineItems: [],
};

export function InvoiceForm({ initialData, originalFile, invoiceId }: InvoiceFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Invoice>({
    ...defaultInvoice,
    ...initialData,
    vendor: { ...defaultInvoice.vendor, ...(initialData.vendor || {}) },
    invoice: { ...defaultInvoice.invoice, ...(initialData.invoice || {}) },
    lineItems: initialData.lineItems || [],
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      ...defaultInvoice,
      ...initialData,
      vendor: { ...defaultInvoice.vendor, ...(initialData.vendor || {}) },
      invoice: { ...defaultInvoice.invoice, ...(initialData.invoice || {}) },
      lineItems: initialData.lineItems || [],
    });
  }, [initialData]);

  const handleInputChange = (section: 'vendor' | 'invoice', field: keyof Invoice['vendor'] | keyof Invoice['invoice'], value: string | number) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };
  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedLineItems = formData.lineItems.map((item, i) => i === index ? { ...item, [field]: value } : item);
    setFormData((prev) => ({ ...prev, lineItems: updatedLineItems }));
  };
  const addLineItem = () => {
    setFormData((prev) => ({ ...prev, lineItems: [...prev.lineItems, { description: '', unitPrice: 0, quantity: 0, total: 0 }] }));
  };
  const removeLineItem = (index: number) => {
    const updatedLineItems = formData.lineItems.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, lineItems: updatedLineItems }));
  };

  const handleSave = async () => {
    if (!formData.vendor.name || !formData.invoice.number) {
      toast.error("Validation Failed", {
        description: "Please make sure 'Vendor Name' and 'Invoice Number' are filled out.",
      });
      return;
    }
    
    setIsSaving(true);
    toast.info(invoiceId ? "Updating invoice..." : "Saving invoice...");

    const url = invoiceId 
      ? `/api/invoices/${invoiceId}` 
      : '/api/invoices';
    const method = invoiceId ? 'PUT' : 'POST';

    const payload = invoiceId ? formData : {
      ...formData,
      fileId: `${Date.now()}-${originalFile?.name}`,
      fileName: originalFile?.name,
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${method === 'POST' ? 'save' : 'update'} invoice`);
      }

      toast.success(`Invoice ${method === 'POST' ? 'saved' : 'updated'} successfully!`);
      router.push('/invoices');
      router.refresh(); 

    } catch (error: any) {
      console.error(`Error ${method === 'POST' ? 'saving' : 'updating'} invoice:`, error);
      toast.error(`Failed to ${method === 'POST' ? 'save' : 'update'} invoice.`, { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Vendor Details</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1"><Label htmlFor="vendor-name">Name</Label><Input id="vendor-name" value={formData.vendor.name || ''} onChange={(e) => handleInputChange('vendor', 'name', e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="vendor-taxId">Tax ID</Label><Input id="vendor-taxId" value={formData.vendor.taxId || ''} onChange={(e) => handleInputChange('vendor', 'taxId', e.target.value)} /></div>
          <div className="space-y-1 sm:col-span-2"><Label htmlFor="vendor-address">Address</Label><Input id="vendor-address" value={formData.vendor.address || ''} onChange={(e) => handleInputChange('vendor', 'address', e.target.value)} /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1"><Label htmlFor="invoice-number">Invoice Number</Label><Input id="invoice-number" value={formData.invoice.number || ''} onChange={(e) => handleInputChange('invoice', 'number', e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="invoice-date">Date</Label><Input id="invoice-date" value={formData.invoice.date || ''} onChange={(e) => handleInputChange('invoice', 'date', e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="invoice-total">Total Amount</Label><Input id="invoice-total" type="number" value={formData.invoice.total || 0} onChange={(e) => handleInputChange('invoice', 'total', parseFloat(e.target.value) || 0)} /></div>
          <div className="space-y-1"><Label htmlFor="invoice-currency">Currency</Label><Input id="invoice-currency" value={formData.invoice.currency || ''} onChange={(e) => handleInputChange('invoice', 'currency', e.target.value)} /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {formData.lineItems.map((item, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-grow space-y-1"><Label>Description</Label><Input value={item.description || ''} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} /></div>
              <div className="space-y-1 w-24"><Label>Quantity</Label><Input type="number" value={item.quantity || 0} onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} /></div>
              <div className="space-y-1 w-24"><Label>Price</Label><Input type="number" value={item.unitPrice || 0} onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} /></div>
              <Button variant="outline" size="icon" onClick={() => removeLineItem(index)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" onClick={addLineItem} className="w-full mt-4">Add Line Item</Button>
        </CardContent>
      </Card>
      <Button onClick={handleSave} className="w-full" disabled={isSaving}>
        {isSaving ? (invoiceId ? 'Updating...' : 'Saving...') : (invoiceId ? 'Update Invoice' : 'Save Invoice')}
      </Button>
    </div>
  );
}