'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { Button } from './button';

interface DropzoneProps {
  onFilesDrop: (files: File[]) => void;
  className?: string;
  accept?: string;
  text?: string;
  disabled?: boolean;
}

export function Dropzone({
  onFilesDrop,
  className,
  accept,
  text = 'Drop files here or click to select',
  disabled = false,
}: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesDrop(acceptedFiles);
    },
    [onFilesDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { 
      [accept.includes('image/') ? accept : `image/${accept.replace('.', '')}`]: accept.split(',')
    } : undefined,
    disabled,
    maxFiles: 20,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center transition-colors hover:bg-muted/50',
        isDragActive && 'border-primary bg-muted/50',
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        <Upload className="h-8 w-8 text-primary" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{text}</p>
          <Button variant="default" size="lg" className="bg-primary hover:bg-primary/90">
            Select Files
          </Button>
          <p className="text-xs text-muted-foreground">
            Maximum 20 files, {accept?.split(',').join(' or ')} files only
          </p>
        </div>
      </div>
    </div>
  );
}