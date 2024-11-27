import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { FileWithPreview } from '../types';
import { isValidPngFile } from '../utils/file-utils';

interface DropZoneProps {
  onFileAccepted: (file: FileWithPreview) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileAccepted }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && isValidPngFile(file)) {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        onFileAccepted(fileWithPreview);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-blue-500"
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-4 text-lg text-gray-700">
        {isDragActive
          ? 'Drop your PNG file here...'
          : 'Drag & drop your PNG file here, or click to select'}
      </p>
      <p className="mt-2 text-sm text-gray-500">PNG files only</p>
    </div>
  );
};