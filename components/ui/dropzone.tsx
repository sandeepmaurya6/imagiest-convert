'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface DropzoneProps {
  onFilesDrop: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
  accept?: string;
  text?: string;
}

export function Dropzone({
  onFilesDrop,
  className,
  disabled = false,
  accept,
  text
}: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesDrop(acceptedFiles);
  }, [onFilesDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    accept: accept ? {
      [accept === '.webp' ? 'image/webp' : 'image/png']: [accept]
    } : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive ? 'border-primary bg-secondary/50' : 'border-muted-foreground/25 hover:border-primary',
        disabled && 'opacity-50 cursor-not-allowed hover:border-muted-foreground/25',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {text || 'Drop files here or click to select'}
        </p>
      </div>
    </div>
  );
}