'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Invoice, LineItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, Printer, Trash2, XCircle, CheckCircle, AlertCircle, User, MessageSquare,
  FileText, Sigma, Grip, Hash, MapPin, Building, Mail
} from 'lucide-react';

interface DataPanelProps {
  initialData: Partial<Invoice>;
  originalFile: File | null;
  invoiceId?: string;
}

const defaultInvoice: Invoice = {
  vendor: { name: '', address: '', taxId: '' },
  invoice: { number: '', date: '', currency: '', subtotal: 0, total: 0, taxPercent: 0, poNumber: '', poDate: '' },
  lineItems: [],
};

export function DataPanel({ initialData, originalFile, invoiceId }: DataPanelProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Invoice>(defaultInvoice);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      ...defaultInvoice,
      ...initialData,
      vendor: { ...defaultInvoice.vendor, ...(initialData.vendor || {}) },
      invoice: { ...defaultInvoice.invoice, ...(initialData.invoice || {}) },
      lineItems: (initialData.lineItems || []).map(item => ({
          description: item.description || '',
          unitPrice: item.unitPrice || 0,
          quantity: item.quantity || 0,
          total: item.total || 0,
          discount: item.discount || 0,
          vat: item.vat || 0,
      })),
    });
  }, [initialData]);

  const handleInputChange = (section: 'vendor' | 'invoice', field: keyof Invoice['vendor'] | keyof Invoice['invoice'], value: string | number) => { setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } })); };
  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => { const updatedLineItems = formData.lineItems.map((item, i) => i === index ? { ...item, [field]: value } : item); setFormData((prev) => ({ ...prev, lineItems: updatedLineItems })); };
  const addLineItem = () => { setFormData((prev) => ({ ...prev, lineItems: [...prev.lineItems, { description: '', unitPrice: 0, quantity: 0, total: 0, discount: 0, vat: 0 }] })); };
  const removeLineItem = (index: number) => { const updatedLineItems = formData.lineItems.filter((_, i) => i !== index); setFormData((prev) => ({ ...prev, lineItems: updatedLineItems })); };
  
  const handleSave = async () => {
    if (!formData.vendor.name || !formData.invoice.number) {
      toast.error("Validation Failed", { description: "Please make sure 'Vendor Name' and 'Invoice Number' are filled out." });
      return;
    }
    
    setIsSaving(true);
    toast.info(invoiceId ? "Updating invoice..." : "Saving invoice...");

    const url = invoiceId ? `/api/invoices/${invoiceId}` : '/api/invoices';
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
    <div className="flex flex-col h-full bg-white text-black">
      {/* Panel Header */}
      <div className="flex-shrink-0 p-6 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold truncate" title={originalFile?.name || "Invoice"}>{originalFile?.name || "Invoice"}</h2>
            <p className="text-sm text-gray-500">johndoe@abctech.com</p>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50 font-semibold">Needs Review</Badge>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button variant="outline" size="icon" title="Download"><Download className="h-5 w-5 text-gray-600" /></Button>
          <Button variant="outline" size="icon" title="Assign User"><User className="h-5 w-5 text-gray-600" /></Button>
          <Button variant="outline" size="icon" title="Comment"><MessageSquare className="h-5 w-5 text-gray-600" /></Button>
          <Button variant="outline" size="icon" className="ml-auto text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700" title="Reject"><XCircle className="h-5 w-5" /></Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (invoiceId ? 'Updating...' : 'Saving...') : <><CheckCircle className="h-5 w-5 mr-2" /> {invoiceId ? 'Update' : 'Approve'}</>}
          </Button>
        </div>
      </div>

      {/* Form Area with Scrolling */}
      <div className="flex-grow overflow-auto p-6 bg-gray-50">
        <Accordion type="multiple" defaultValue={['customer-info', 'invoice-details', 'summary', 'line-items']} className="w-full space-y-4">
          
          <AccordionItem value="customer-info" className="border rounded-lg bg-white">
            <AccordionTrigger className="p-4 text-base hover:no-underline data-[state=open]:border-b">
              <div className="flex items-center gap-3 w-full">
                <div className="w-1 h-6 rounded-full bg-orange-400" />
                <User className="h-5 w-5 text-gray-500"/>
                <span className="font-semibold">Customer Information</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-2">
                <div className="grid grid-cols-[1fr,2fr] items-center gap-x-8 gap-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600"><User className="h-4 w-4"/> Customer Name</div>
                    <Input placeholder="Firma Mustermann GmbH" value={formData.vendor.name || ''} onChange={(e) => handleInputChange('vendor', 'name', e.target.value)} />
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="h-4 w-4"/> Address</div>
                    <Select><SelectTrigger><SelectValue placeholder="Richard Sanchez" /></SelectTrigger><SelectContent><SelectItem value="rs">Richard Sanchez</SelectItem></SelectContent></Select>

                    <div className="flex items-center gap-2 text-sm text-gray-600"><Building className="h-4 w-4"/> Vendor Address</div>
                    <Input placeholder="215 E Tasman Dr." value={formData.vendor.address || ''} onChange={(e) => handleInputChange('vendor', 'address', e.target.value)} />

                    <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="h-4 w-4"/> Postal Code</div>
                    <Input placeholder="478392" value={formData.vendor.taxId || ''} onChange={(e) => handleInputChange('vendor', 'taxId', e.target.value)} />
                </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="invoice-details" className="border rounded-lg bg-white">
            <AccordionTrigger className="p-4 text-base hover:no-underline data-[state=open]:border-b">
              <div className="flex items-center gap-3 w-full">
                <div className="w-1 h-6 rounded-full bg-purple-400" />
                <FileText className="h-5 w-5 text-gray-500"/>
                <span className="font-semibold">Invoice</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-2">
                <div className="grid grid-cols-[1fr,2fr] items-center gap-x-8 gap-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600"><Hash className="h-4 w-4"/> PO Number</div>
                    <Input placeholder="90038195" value={formData.invoice.poNumber || ''} onChange={(e) => handleInputChange('invoice', 'poNumber', e.target.value)} />
                    <div className="flex items-center gap-2 text-sm text-gray-600"><Hash className="h-4 w-4"/> PO Date</div>
                    <Input placeholder="31.10.2009" value={formData.invoice.poDate || ''} onChange={(e) => handleInputChange('invoice', 'poDate', e.target.value)} />
                </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="summary" className="border rounded-lg bg-white">
             <AccordionTrigger className="p-4 text-base hover:no-underline data-[state=open]:border-b">
              <div className="flex items-center gap-3 w-full">
                <div className="w-1 h-6 rounded-full bg-red-400" />
                <Sigma className="h-5 w-5 text-gray-500"/>
                <span className="font-semibold">Summary</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-2">
                <div className="grid grid-cols-[1fr,2fr] items-center gap-x-8 gap-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">Document Type</div>
                    <Input placeholder="Rechnung" value={formData.invoice.number || ''} onChange={(e) => handleInputChange('invoice', 'number', e.target.value)} />
                    <div className="flex items-center gap-2 text-sm text-gray-600">Currency Short Form</div>
                    <Input placeholder="€ EUR - Euro" value={formData.invoice.currency || ''} onChange={(e) => handleInputChange('invoice', 'currency', e.target.value)}/>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">Sub Total</div>
                    <Input type="number" placeholder="400" value={formData.invoice.subtotal || 0} onChange={(e) => handleInputChange('invoice', 'subtotal', parseFloat(e.target.value) || 0)}/>
                </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="line-items" className="border rounded-lg bg-white">
            <AccordionTrigger className="p-4 text-base hover:no-underline data-[state=open]:border-b">
              <div className="flex items-center gap-3 w-full">
                <div className="w-1 h-6 rounded-full bg-blue-400" />
                <Grip className="h-5 w-5 text-gray-500"/>
                <span className="font-semibold">Line Items</span>
                <Badge variant="secondary" className="ml-auto">{formData.lineItems.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-24">Qty</TableHead>
                      <TableHead className="w-28">Unit Price</TableHead>
                      <TableHead className="w-28">Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell><Input value={item.description || ''} onChange={e => handleLineItemChange(index, 'description', e.target.value)} /></TableCell>
                        <TableCell><Input type="number" value={item.quantity || 0} onChange={e => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} /></TableCell>
                        <TableCell><Input type="number" value={item.unitPrice || 0} onChange={e => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} /></TableCell>
                        <TableCell><Input type="number" value={item.total || 0} onChange={e => handleLineItemChange(index, 'total', parseFloat(e.target.value) || 0)} /></TableCell>
                        <TableCell><Button variant="ghost" size="icon" onClick={() => removeLineItem(index)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="outline" onClick={addLineItem} className="w-full mt-4">Add Line Item</Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}