import React from 'react';
import { Download } from 'lucide-react';
import clsx from 'clsx';

interface ConversionButtonProps {
  onConvert: () => void;
  isConverting: boolean;
  convertedUrl: string | null;
}

export const ConversionButton: React.FC<ConversionButtonProps> = ({
  onConvert,
  isConverting,
  convertedUrl,
}) => {
  if (convertedUrl) {
    return (
      <a
        href={convertedUrl}
        download="converted.webp"
        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Download className="h-5 w-5 mr-2" />
        Download WebP
      </a>
    );
  }

  return (
    <button
      onClick={onConvert}
      disabled={isConverting}
      className={clsx(
        'inline-flex items-center px-4 py-2 rounded-lg transition-colors',
        isConverting
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      )}
    >
      {isConverting ? 'Converting...' : 'Convert to WebP'}
    </button>
  );
};