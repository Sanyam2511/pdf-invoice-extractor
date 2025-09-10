'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PdfUploaderProps {
  onFileChange: (file: File) => void;
}

export function PdfUploader({ onFileChange }: PdfUploaderProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="pdf-upload">Upload PDF Invoice</Label>
      <Input 
        id="pdf-upload" 
        type="file" 
        accept="application/pdf"
        onChange={handleFileChange} 
      />
    </div>
  );
}