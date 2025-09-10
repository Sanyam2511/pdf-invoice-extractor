'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic'; 
import { toast } from "sonner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PdfUploader } from '@/components/PdfUploader';
import { InvoiceForm } from '@/components/InvoiceForm';
import { Invoice } from '@/lib/types';

const PdfViewer = dynamic(() => import('@/components/PdfViewer').then(mod => mod.PdfViewer), {
  ssr: false,
  loading: () => <p className="text-center">Loading PDF Viewer...</p>, 
});


export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExtract = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setExtractedData(null);
    toast.info("AI extraction has started...", {
      description: "This may take a moment. Please wait.",
    });

    const formData = new FormData();
    formData.append('invoice', selectedFile);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Error: ${response.statusText}`);
      }

      const result = await response.json();
      setExtractedData(result);
      toast.success("Extraction Successful!", {
        description: "The invoice data has been populated in the form.",
      });
    } catch (error: any) {
      console.error('Extraction failed:', error);
      toast.error("Extraction Failed", {
        description: error.message || "Could not extract data from the PDF.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <Card className="w-full h-full">
              <CardHeader>
                <CardTitle>PDF Viewer</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)]">
                {selectedFile ? (
                  <PdfViewer file={selectedFile} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Upload a PDF to view it here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full flex-col p-6 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload & Extract</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <PdfUploader onFileChange={setSelectedFile} />
                <Button onClick={handleExtract} disabled={!selectedFile || isLoading}>
                  {isLoading ? 'Extracting...' : 'Extract with AI'}
                </Button>
              </CardContent>
            </Card>
            <Card className="flex-grow overflow-auto">
              <CardHeader>
                <CardTitle>Extracted Data</CardTitle>
              </CardHeader>
              <CardContent>
                {extractedData ? (
                  <InvoiceForm 
                    initialData={extractedData} 
                    originalFile={selectedFile} 
                  />
                ) : (
                  <p className="text-muted-foreground">Data will appear here after extraction.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}