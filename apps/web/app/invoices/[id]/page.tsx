'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Invoice } from '@/lib/types';
import { DataPanel } from '@/components/DataPanel'; 
import { toast } from 'sonner';

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLineItems, setShowLineItems] = useState(false); // Add this state

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
    return <div className="p-8">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="p-8">Invoice not found.</div>;
  }

  return (
    <div className="flex-grow">
        <DataPanel
          initialData={invoice}
          originalFile={null} 
          invoiceId={id as string}
          showLineItems={showLineItems}
          onToggleLineItems={setShowLineItems}
        />
    </div>
  );
}