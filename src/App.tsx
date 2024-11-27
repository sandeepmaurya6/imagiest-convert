import React, { useState, useCallback } from 'react';
import { FileWithPreview, ConversionStatus } from './types';
import { DropZone } from './components/DropZone';
import { FilePreview } from './components/FilePreview';
import { ConversionButton } from './components/ConversionButton';
import { convertToWebP } from './utils/file-utils';

function App() {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [conversionStatus, setConversionStatus] = useState<ConversionStatus>({
    isConverting: false,
    error: null,
    convertedUrl: null,
  });

  const handleFileAccepted = useCallback((acceptedFile: FileWithPreview) => {
    setFile(acceptedFile);
    setConversionStatus({
      isConverting: false,
      error: null,
      convertedUrl: null,
    });
  }, []);

  const handleRemoveFile = useCallback(() => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    if (conversionStatus.convertedUrl) {
      URL.revokeObjectURL(conversionStatus.convertedUrl);
    }
    setFile(null);
    setConversionStatus({
      isConverting: false,
      error: null,
      convertedUrl: null,
    });
  }, [file, conversionStatus.convertedUrl]);

  const handleConvert = async () => {
    if (!file) return;

    setConversionStatus({
      isConverting: true,
      error: null,
      convertedUrl: null,
    });

    try {
      const webpUrl = await convertToWebP(file);
      setConversionStatus({
        isConverting: false,
        error: null,
        convertedUrl: webpUrl,
      });
    } catch (error) {
      setConversionStatus({
        isConverting: false,
        error: 'Failed to convert image',
        convertedUrl: null,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PNG to WebP Converter</h1>
          <p className="mt-2 text-gray-600">
            Convert your PNG images to WebP format for better web performance
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {!file && <DropZone onFileAccepted={handleFileAccepted} />}
          
          {file && (
            <>
              <FilePreview file={file} onRemove={handleRemoveFile} />
              
              <div className="mt-6 flex justify-center">
                <ConversionButton
                  onConvert={handleConvert}
                  isConverting={conversionStatus.isConverting}
                  convertedUrl={conversionStatus.convertedUrl}
                />
              </div>

              {conversionStatus.error && (
                <p className="mt-4 text-center text-red-600">
                  {conversionStatus.error}
                </p>
              )}
            </>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Supports PNG files up to 10MB</p>
          <p className="mt-1">Converted files will be in WebP format</p>
        </div>
      </div>
    </div>
  );
}

export default App;