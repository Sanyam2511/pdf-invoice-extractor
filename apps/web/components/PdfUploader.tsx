'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PdfUploaderProps {
  onFileChange: (file: File) => void;
}

export function PdfUploader({ onFileChange }: PdfUploaderProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onFileChange(file);

    const formData = new FormData();
    formData.append('invoice', file); 

    try {
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const result = await response.json();
      console.log('File uploaded successfully:', result);

    } catch (error) {
      console.error('Error uploading file:', error);
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