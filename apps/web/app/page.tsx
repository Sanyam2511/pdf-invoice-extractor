'use client';

import { useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PdfViewer } from '@/components/PdfViewer';
import { PdfUploader } from '@/components/PdfUploader';

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <main className="h-screen bg-background text-foreground">
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
          <div className="flex h-full items-center justify-center p-6">
            <Card className="w-full h-full">
              <CardHeader>
                <CardTitle>Extracted Data</CardTitle>
              </CardHeader>
              <CardContent>
                <PdfUploader onFileChange={setSelectedFile} />
                <p className="mt-6">The editable form will be here.</p>
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}