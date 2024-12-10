import { ImagePlus } from 'lucide-react';

export function ConverterHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-primary/5 rounded-xl">
          <ImagePlus className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Free File Converter</h1>
          <p className="text-muted-foreground">Convert and optimize your files with ease</p>
        </div>
      </div>
      
      <div className="prose prose-sm max-w-none text-muted-foreground">
        <p>
          Convert, compress, and optimize your files directly in your browser. 
          No upload limits, no registration required, and your files never leave your device.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 list-none p-0">
          <li>✓ Free unlimited conversions</li>
          <li>✓ Batch processing up to 20 files</li>
          <li>✓ High-quality optimization</li>
          <li>✓ 100% private & secure</li>
          <li>✓ No file upload needed</li>
          <li>✓ Process files offline</li>
        </ul>
      </div>
    </div>
  );
}