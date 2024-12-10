'use client';

import { FORMAT_CATEGORIES, type ConversionFormat } from '@/lib/constants';

interface PageHeaderProps {
  format: ConversionFormat;
}

export function PageHeader({ format }: PageHeaderProps) {
  const getFormatTitle = () => {
    const categoryEntry = Object.entries(FORMAT_CATEGORIES).find(([_, { formats }]) =>
      Object.keys(formats).includes(format)
    );
    
    if (!categoryEntry) return '';
    
    const formatDetails = categoryEntry[1].formats[format as keyof typeof categoryEntry[1]['formats']];
    return formatDetails.label;
  };

  return (
    <div className="text-center max-w-2xl mx-auto mb-8">
      <h1 className="text-3xl font-bold mb-4">
        Free {getFormatTitle()} Converter
      </h1>
      <p className="text-slate-600">
        Convert, compress, and optimize your files directly in your browser.
        No upload limits, no registration required, and your files never leave your device.
      </p>
    </div>
  );
}