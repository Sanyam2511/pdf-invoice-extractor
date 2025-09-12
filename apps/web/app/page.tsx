'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from "sonner";
import { Invoice } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PdfUploader } from '@/components/PdfUploader';
import { DataPanel } from '@/components/DataPanel';

const PdfViewer = dynamic(() => import('@/components/PdfViewer').then(mod => mod.PdfViewer), {
  ssr: false,
  loading: () => <p className="text-center p-4">Loading PDF Viewer...</p>,
});

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <main className="flex-grow grid grid-cols-1 md:grid-cols-5" style={{ height: 'calc(100vh - 4rem)'}}>
      
      <div className="flex flex-col text-center bg-gray-100 md:col-span-3">
        <div className="flex-shrink-0 p-4 border-b font-semibold text-gray-600 text-sm">
          PDF CONTROLS
        </div>
        <div className="flex-grow bg-gray-200 p-8 overflow-y-auto flex justify-center">
            {selectedFile 
              ? <PdfViewer file={selectedFile} /> 
              : <div className="flex items-center justify-center h-full text-muted-foreground"><p>Upload a PDF to view it here.</p></div>
            }
        </div>
      </div>

      
      <div className="md:col-span-2 border-l border-gray-200 flex flex-col">
          {extractedData ? (
            <DataPanel initialData={extractedData} originalFile={selectedFile} />
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