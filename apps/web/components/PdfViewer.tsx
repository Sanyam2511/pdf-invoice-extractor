'use client';

import 'pdfjs-dist/web/pdf_viewer.css';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { Button } from '@/components/ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: File;
}

export function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function goToPrevPage() {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  }

  function goToNextPage() {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages || 1));
  }

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex-grow overflow-auto w-full flex justify-center">
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      <div className="flex items-center gap-4 p-2">
        <Button onClick={goToPrevPage} disabled={pageNumber <= 1}>
          Previous
        </Button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <Button onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}