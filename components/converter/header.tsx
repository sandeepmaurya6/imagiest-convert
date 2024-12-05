import { ImagePlus } from 'lucide-react';

export function ConverterHeader() {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <ImagePlus className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold">Image Format Converter</h1>
    </div>
  );
}