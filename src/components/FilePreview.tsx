import React from 'react';
import { X } from 'lucide-react';
import { FileWithPreview } from '../types';
import { formatFileSize } from '../utils/file-utils';

interface FilePreviewProps {
  file: FileWithPreview;
  onRemove: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  return (
    <div className="relative mt-4 p-4 bg-white rounded-lg shadow">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
      >
        <X className="h-5 w-5 text-gray-500" />
      </button>
      <div className="flex items-center space-x-4">
        <img
          src={file.preview}
          alt="Preview"
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <p className="font-medium text-gray-900">{file.name}</p>
          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
        </div>
      </div>
    </div>
  );
};