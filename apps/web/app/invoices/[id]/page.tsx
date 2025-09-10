'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Invoice } from '@/lib/types';
import { InvoiceForm } from '@/components/InvoiceForm';
import { toast } from 'sonner';

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchInvoice = async () => {
        try {
          const response = await fetch(`/api/invoices/${id}`);
          if (!response.ok) {
            throw new Error('Invoice not found');
          }
          const data = await response.json();
          setInvoice(data);
        } catch (error) {
          toast.error("Failed to load invoice data.");
          router.push('/invoices');
        } finally {
          setIsLoading(false);
        }
      };
      fetchInvoice();
    }
  }, [id, router]);

  if (isLoading) {
    return <div className="container mx-auto p-8">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="container mx-auto p-8">Invoice not found.</div>;
  }
  
  return (
    <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Edit Invoice</h1>
        <InvoiceForm
          initialData={invoice}
          originalFile={null} 
          invoiceId={id as string} 
        />
    </div>
  );
}