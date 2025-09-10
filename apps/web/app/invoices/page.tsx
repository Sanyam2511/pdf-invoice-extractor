'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Invoice } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type InvoiceWithId = Invoice & { _id: string; fileId: string; fileName: string; };

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceWithId[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        const url = `/api/invoices${searchTerm ? `?q=${searchTerm}` : ''}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error(error);
        toast.error('Could not fetch invoices.');
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchInvoices();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDelete = async (invoiceId: string) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) {
      return;
    }

    toast.info("Deleting invoice...");
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }

      setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice._id !== invoiceId));
      toast.success("Invoice deleted successfully!");

    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error("Failed to delete invoice.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button onClick={() => router.push('/')}>Create New Invoice</Button>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Search by vendor or invoice number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
            ) : invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell>{invoice.vendor.name}</TableCell>
                  <TableCell>{invoice.invoice.number}</TableCell>
                  <TableCell>{invoice.invoice.date}</TableCell>
                  <TableCell>{invoice.invoice.total} {invoice.invoice.currency}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => router.push(`/invoices/${invoice._id}`)} >
                      Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(invoice._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center">No invoices found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}