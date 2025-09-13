'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Invoice, LineItem, Vendor } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, Trash2, User, MessageSquare, FileText, Sigma, Grip, Info, Sparkle, UserRound,
  MapPin, Building, Mail, Database, Ban, Check, Hash, Euro, AlertCircle, Grid2X2
} from 'lucide-react';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';


interface DataPanelProps {
  initialData: Partial<Invoice>;
  originalFile: File | null;
  invoiceId?: string;
  showLineItems: boolean;
  onToggleLineItems: (show: boolean) => void;
}

const defaultInvoice: Invoice = {
  vendor: { name: '', address: '', taxId: '', customerCode: '', contactName: '' },
  invoice: { number: '', date: '', currency: '', subtotal: 0, total: 0, taxPercent: 0, poNumber: '', poDate: '', locale: '' },
  lineItems: [],
};

export function DataPanel({ initialData, originalFile, invoiceId, showLineItems, onToggleLineItems }: DataPanelProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Invoice>(defaultInvoice);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const dummyLineItems = [
      { description: 'Nylon casing 400/5 Current Transformer Bur...', unitPrice: 100, quantity: 1, total: 2760.00, discount: 8, vat: 2 },
      { description: 'Nylon casing 400/5 Current Transformer Bur...', unitPrice: 100, quantity: 1, total: 2760.00, discount: 8, vat: 2 },
      { description: 'Nylon casing 400/5 Current Transformer Bur...', unitPrice: 100, quantity: 1, total: 2760.00, discount: 8, vat: 2 },
      { description: 'Nylon casing 400/5 Current Transformer Bur...', unitPrice: 100, quantity: 1, total: 2760.00, discount: 8, vat: 2 },
      { description: 'Nylon casing 400/5 Current Transformer Bur...', unitPrice: 100, quantity: 1, total: 2760.00, discount: 8, vat: 2 },
      { description: 'Nylon casing 400/5 Current Transformer Bur...', unitPrice: 100, quantity: 1, total: 2760.00, discount: 8, vat: 2 }
    ];
    
    setFormData({
      ...defaultInvoice,
      ...initialData,
      vendor: { ...defaultInvoice.vendor, ...(initialData.vendor || {}) },
      invoice: { ...defaultInvoice.invoice, ...(initialData.invoice || {}) },
      lineItems: (initialData.lineItems && initialData.lineItems.length > 0) ? 
        (initialData.lineItems || []).map(item => ({
          description: item.description || '', unitPrice: item.unitPrice || 0, quantity: item.quantity || 0,
          total: item.total || 0, discount: item.discount || 0, vat: item.vat || 0,
        })) : dummyLineItems,
    });
  }, [initialData]);

  const handleInputChange = (section: 'vendor' | 'invoice', field: keyof Vendor | keyof Invoice['invoice'], value: string | number) => { setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } })); };
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
      <div className="flex-shrink-0 border-b">
        <div className="p-6 pb-4 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold truncate" title={originalFile?.name || "Invoice"}>
                {originalFile?.name || "Invoice"}
              </h2>
              <p className="text-sm text-gray-500">sohamshah@newtech.com</p>
            </div>
            <Badge variant="outline" className="text-gray-900 font-semibold border-blue-400 bg-blue-50 py-1 px-3 rounded-md">
              <Info className="h-5 w-5 text-blue-500 m-1"/>
              Needs Review
            </Badge>
          </div>
        </div>
        <div className="px-6 py-4 bg-white">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" title="Download"><Download className="h-5 w-5 text-gray-900" /></Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" title="Assign User"><User className="h-5 w-5 text-gray-900" /></Button>
              <Button variant="outline" size="icon" title="Comment"><MessageSquare className="h-5 w-5 text-gray-900" /></Button>
              <Button variant="outline" size="icon" className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 rounded-lg" title="Reject"><Ban className="h-5 w-5" /></Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg" onClick={handleSave} disabled={isSaving}>{isSaving ? (invoiceId ? 'Updating...' : 'Saving...') : <><Check className="h-5 w-5 " /> {invoiceId ? 'Update' : 'Approve'}</>}</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto  bg-white">
        <Accordion type="multiple" defaultValue={['customer-info', 'invoice-details', 'summary', 'line-items']} className="w-full">
          
          <AccordionItem value="customer-info" className="border-b">
            <div className=" bg-slate-100">
              <AccordionTrigger className="pl-0 pr-2 py-2 text-base hover:no-underline relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-amber-700" />
                <div className="flex items-center gap-2 w-full pl-3">
                  <UserRound className="h-5 w-5 text-gray-500"/>
                  <span className="font-semibold">Customer Information</span>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent className="p-4 pt-1">
              <div className="grid grid-cols-[auto,1fr] items-center gap-x-4 gap-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-normal"><Sparkle className="h-4 w-4"/> Customer Name</div>
                  <Input className="border-none shadow-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none" placeholder="Firma Mustermann GmbH" value={formData.vendor.name || ''} onChange={(e) => handleInputChange('vendor', 'name', e.target.value)} />
                  
                  <div className="contents">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-normal bg-gray-100 -mx-4 px-4 py-3.5"><Sparkle className="h-4 w-4"/> Address</div>
                      <div className="bg-gray-100 -mr-4 pr-4 py-1">
                          <Select><SelectTrigger className="!h-10 !min-h-10 !max-h-10 border-none bg-gray-100 shadow-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none" style={{height: '40px !important', minHeight: '40px !important', maxHeight: '40px !important', padding: '8px 12px !important'}}><SelectValue placeholder="Richard Sanchez" /></SelectTrigger><SelectContent><SelectItem value="rs">Richard Sanchez</SelectItem></SelectContent></Select>
                      </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-normal"><Sparkle className="h-4 w-4"/> Vendor Address</div>
                  <Input className="border-none shadow-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none" placeholder="215 E Tasman Dr." value={formData.vendor.address || ''} onChange={(e) => handleInputChange('vendor', 'address', e.target.value)} />
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-normal"><Sparkle className="h-4 w-4"/> Postal Code</div>
                  <Input className="border-none shadow-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none" placeholder="478392" value={formData.vendor.taxId || ''} onChange={(e) => handleInputChange('vendor', 'taxId', e.target.value)} />
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-normal"><Database className="h-4 w-4"/> Customer Code<span className="text-red-400">*</span></div>
                  <Select><SelectTrigger className="border-red-300 text-red-400"><SelectValue placeholder="Add Code" className='text-red-400'/></SelectTrigger><SelectContent><SelectItem value="code1">Code 1</SelectItem></SelectContent></Select>
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-normal"><Sparkle className="h-4 w-4"/> Customer Name</div>
                  <Input placeholder="Add details" value={formData.vendor.contactName || ''} onChange={(e) => handleInputChange('vendor', 'contactName', e.target.value)} />
              </div>
            </AccordionContent>
        </AccordionItem>
          
          <AccordionItem value="invoice-details" className="border-b">
            <div className=" bg-slate-100">
              <AccordionTrigger className="pl-0 pr-2 py-2 text-base hover:no-underline relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-lime-600" />
                <div className="flex items-center gap-2 w-full pl-3">
                  <UserRound className="h-5 w-5 text-gray-500"/>
                  <span className="font-semibold">Invoice</span>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent className="p-4 pt-1">
              <div className="grid grid-cols-[auto,1fr] items-center gap-x-4 gap-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-normal"><Sparkle className="h-4 w-4"/> PO Number</div>
                  <Input className="border-none shadow-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none" placeholder="90038195" value={formData.invoice.poNumber || ''} onChange={(e) => handleInputChange('invoice', 'poNumber', e.target.value)} />
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-normal"><Sparkle className="h-4 w-4"/> PO Date</div>
                  <Input className="border-none shadow-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none" placeholder="31.10.2009" value={formData.invoice.poDate || ''} onChange={(e) => handleInputChange('invoice', 'poDate', e.target.value)} />
              </div>
          </AccordionContent>
          </AccordionItem>

          <AccordionItem value="summary" className="border-b">
             <div className=" bg-slate-100">
              <AccordionTrigger className="pl-0 pr-2 py-2 text-base hover:no-underline relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-pink-600" />
                <div className="flex items-center gap-2 w-full pl-3">
                  <UserRound className="h-5 w-5 text-gray-500"/>
                  <span className="font-semibold">Summary</span>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent className="p-4 pt-1">
                <div className="grid grid-cols-[auto,1fr,auto] items-center gap-x-4 gap-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-normal"><Sparkle className="h-4 w-4"/>Document Type</div>
                  <Input className="border-none shadow-none focus:ring-0 focus:border-none" placeholder="Rechnung" value={formData.invoice.number || ''} onChange={(e) => handleInputChange('invoice', 'number', e.target.value)} />
                  <div className="w-5"></div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-normal"><Sparkle className="h-4 w-4"/>Currency Short Form</div>
                  <Input className="border-none shadow-none focus:ring-0 focus:border-none" placeholder="€ EUR - Euro" value={formData.invoice.currency || ''} onChange={(e) => handleInputChange('invoice', 'currency', e.target.value)}/>
                  <div className="w-5"></div>
                  
                  <div className="flex items-center gap-2 text-sm text-red-600 font-normal"><Sparkle className="h-4 w-4"/>Sub Total</div>
                  <Input className="border-none shadow-none focus:ring-0 focus:border-none" type="number" placeholder="400" value={formData.invoice.subtotal || 0} onChange={(e) => handleInputChange('invoice', 'subtotal', parseFloat(e.target.value) || 0)}/>
                  <Info className="h-5 w-5 text-red-600"/>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-normal"><Sparkle className="h-4 w-4"/>Locale</div>
                  <Input className="border-none shadow-none focus:ring-0 focus:border-none" placeholder="€ EUR - Euro" value={formData.invoice.locale || ''} onChange={(e) => handleInputChange('invoice', 'locale', e.target.value)}/>
                  <div className="w-5"></div>
                </div>
              </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="line-items" className="border-none">
            <div className="bg-slate-100">
              <div className="pl-0 pr-2 py-2 text-base relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-blue-600" />
                <div className="flex items-center justify-between w-full pl-3">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-5 w-5 text-gray-500"/>
                    <span className="font-semibold">Line Items</span>
                    <div className="flex items-center justify-center bg-blue-100 border-blue-400 text-black text-sm font-medium rounded px-2 py-0.5 min-w-[24px] h-6"><Grid2X2 className="h-5 w-5 m-1 text-blue-600"/>
                      {formData.lineItems.length}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      console.log('Toggle clicked, current state:', showLineItems);
                      onToggleLineItems && onToggleLineItems(!showLineItems);
                    }}
                    className="cursor-pointer p-1"
                  >
                    <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${showLineItems ? 'bg-blue-600' : 'bg-gray-400'}`}>
                      <div 
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                          showLineItems ? 'left-7' : 'left-1'
                        }`}
                      ></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}