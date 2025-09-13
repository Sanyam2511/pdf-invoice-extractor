'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from "sonner";
import { Invoice, LineItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PdfUploader } from '@/components/PdfUploader';
import { DataPanel } from '@/components/DataPanel';
import { Database, Info } from 'lucide-react';

const PdfViewer = dynamic(() => import('@/components/PdfViewer').then(mod => mod.PdfViewer), {
  ssr: false,
  loading: () => <p className="text-center p-4">Loading PDF Viewer...</p>,
});

const defaultLineItems = [
  { description: 'Nylon casing 400/5 Current Transformer Bur...', unitPrice: 100, quantity: 1, total: 2760.00, discount: 8, vat: 2 },
  { description: 'Nylon casing 400/5 Current Transformer Bur...', unitPrice: 100, quantity: 1, total: 2760.00, discount: 8, vat: 2 },
  { description: 'Nylon casing 400/5 Current Transformer Bur...', unitPrice: 100, quantity: 1, total: 2760.00, discount: 8, vat: 2 },
  { description: 'Nylon casing 400/5 Current Transformer Bur...', unitPrice: 100, quantity: 1, total: 2760.00, discount: 8, vat: 2 },
  { description: 'Nylon casing 400/5 Current Transformer Bur...', unitPrice: 100, quantity: 1, total: 2760.00, discount: 8, vat: 2 },
  { description: 'Nylon casing 400/5 Current Transformer Bur...', unitPrice: 100, quantity: 1, total: 2760.00, discount: 8, vat: 2 }
];

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLineItems, setShowLineItems] = useState(false); // Changed from true to false

  const handleExtract = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setExtractedData(null);
    toast.info("AI extraction has started...", { description: "This may take a moment. Please wait." });
    const formData = new FormData();
    formData.append('invoice', selectedFile);
    try {
      const response = await fetch('/api/extract', { method: 'POST', body: formData });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Error: ${response.statusText}`);
      }
      const result = await response.json();
      setExtractedData(result);
      toast.success("Extraction Successful!", { description: "The invoice data has been populated in the form." });
    } catch (error: any) {
      console.error('Extraction failed:', error);
      toast.error("Extraction Failed", { description: error.message || "Could not extract data from the PDF." });
    } finally {
      setIsLoading(false);
    }
  };

  const LineItemsTable = ({ items }: { items: LineItem[] }) => (
    <div className="bg-white border-t border-gray-300 w-full">
      <div className="p-4">
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="flex items-center rounded-lg border border-red-400 overflow-hidden">
            <div className="flex items-center gap-1.5 bg-red-100 px-3 py-2.5 w-18">
              <Info className="h-4 w-4 text-red-500"/>
              <span className="text-red-600 font-semibold text-xs">Subtotal</span>
            </div>
            <div className="bg-white px-3 py-1.5 w-16 border-l border-red-200">
              <span className="font-bold text-gray-800 text-sm">$ 400</span>
            </div>
          </div>
          
          <div className="flex items-center rounded-lg border border-gray-400 overflow-hidden">
            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-2.5 w-10">
              <span className="text-gray-600 font-medium text-xs">Tax</span>
            </div>
            <div className="bg-white px-3 py-1.5 w-12 border-l border-gray-200">
              <span className="font-bold text-gray-800 text-sm">10%</span>
            </div>
          </div>
          
          <div className="flex items-center rounded-lg border border-red-400 overflow-hidden">
            <div className="flex items-center gap-1.5 bg-red-100 px-3 py-2.5 w-18">
              <Info className="h-4 w-4 text-red-500"/>
              <span className="text-red-600 font-semibold text-xs">Total</span>
            </div>
            <div className="bg-white px-3 py-1.5 w-16 border-l border-red-200">
              <span className="font-bold text-gray-800 text-sm">$ 440</span>
            </div>
          </div>
        </div>
        
        <div className="w-full border border-gray-300 rounded overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
  <tr className="bg-gray-50">
    <th className="border border-gray-300 p-2 text-left font-medium text-gray-600 w-[40px]">#</th>
    <th className="border border-gray-300 p-2 text-left font-medium text-gray-600 w-[120px]">Code</th>
    <th className="border border-gray-300 p-2 text-left font-medium text-gray-600 w-[286px]">Description</th>
    <th className="border border-gray-300 p-2 text-left font-medium text-gray-600 w-[64px]">Qty</th>
    <th className="border border-gray-300 p-2 text-left font-medium text-gray-600 w-[120px]">Unit Price</th>
    <th className="border border-gray-300 p-2 text-left font-medium text-gray-600 w-[106px]">Discount</th>
    <th className="border border-gray-300 p-2 text-left font-medium text-gray-600 w-[80px]">VAT</th>
    <th className="border border-gray-300 p-2 text-left font-medium text-gray-600 w-[120px]">Total</th>
  </tr>
</thead>
<tbody>
  {items.map((item, index) => (
    <tr key={index} className="bg-white">
      <td className="border border-gray-300 p-2 font-medium text-left w-[40px]">{index + 1}</td>
      <td className="border border-gray-300 p-2 w-[120px] bg-slate-100 text-gray-600">
        <div className="flex items-center justify-between gap-1">
          <span>H126744</span>
          <Database className="h-4 w-4 text-gray-400"/>
        </div>
      </td>
      <td className="border border-gray-300 p-2 text-gray-800 text-left w-[286px]">{item.description}</td>
      <td className="border border-gray-300 w-[64px] p-2 text-left">{String(item.quantity).padStart(2, '0')}</td>
      <td className="border border-gray-300 p-2 text-left w-[120px]">$ {item.unitPrice}</td>
      <td className="border border-gray-300 p-2 text-left w-[106px]">{item.discount}%</td>
      <td className="border border-gray-300 p-2 text-left w-[80px]">{item.vat}%</td>
      <td className="border border-gray-300 p-2 text-left font-medium w-[120px]">$ {item.total.toFixed(2)}</td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex-grow grid grid-cols-1 md:grid-cols-5" style={{ height: 'calc(100vh - 4rem)'}}>
      
      <div className="flex flex-col text-center bg-gray-100 md:col-span-3">
        <div className="flex-shrink-0 p-4 border-b font-semibold text-gray-600 text-sm">
          PDF CONTROLS
        </div>
        <div className="flex-grow bg-gray-200 overflow-y-auto flex flex-col">
          <div className="flex justify-center p-8 pb-4">
            {selectedFile 
              ? <PdfViewer file={selectedFile} /> 
              : <div className="flex items-center justify-center h-full text-muted-foreground"><p>Upload a PDF to view it here.</p></div>
            }
          </div>
          {selectedFile && showLineItems && (
            <div className="flex-grow">
              <LineItemsTable items={extractedData?.lineItems && extractedData.lineItems.length > 0 ? extractedData.lineItems : defaultLineItems} />
            </div>
          )}
        </div>
      </div>

      
      <div className="md:col-span-2 border-l border-gray-200 flex flex-col">
          {extractedData ? (
            <DataPanel 
              initialData={extractedData} 
              originalFile={selectedFile} 
              showLineItems={showLineItems}
              onToggleLineItems={setShowLineItems}
            />
          ) : (
            <div className="p-6 flex-grow flex flex-col bg-gray-50">
              <div className="w-full max-w-sm text-center">
                <h2 className="text-xl font-semibold mb-4">Upload & Extract</h2>
                <div className="space-y-4">
                  <PdfUploader onFileChange={setSelectedFile} />
                  <Button onClick={handleExtract} disabled={!selectedFile || isLoading} className="w-full">
                      {isLoading ? 'Extracting...' : 'Extract with AI'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Upload an invoice to begin the automated extraction process.
                </p>
              </div>
            </div>
          )}
      </div>
    </main>
  );
}