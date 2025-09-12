export interface LineItem {
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
  discount?: number; 
  vat?: number; 
}

export interface Vendor {
  name: string;
  address: string;
  taxId: string;
  customerCode?: string;
  contactName?: string;
}

export interface InvoiceDetails {
  number: string;
  date: string;
  currency: string;
  subtotal: number;
  taxPercent: number;
  total: number;
  poNumber: string;
  poDate: string;
}

export interface Invoice {
  vendor: Vendor;
  invoice: InvoiceDetails;
  lineItems: LineItem[];
}