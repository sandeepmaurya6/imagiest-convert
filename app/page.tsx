'use client';

import { useState } from 'react';
import { Dropzone } from '@/components/ui/dropzone';
import { ConversionList } from '@/components/conversion-list';
import { convertImage, downloadAllAsZip, type ConversionFormat } from '@/lib/imageConverter';
import { ConverterHeader } from '@/components/converter/header';
import { FormatSelector } from '@/components/converter/format-selector';
import { OptimizationSettings } from '@/components/converter/optimization-settings';
import { useConversions } from '@/hooks/use-conversions';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Play, X } from 'lucide-react';
import { truncateFilename } from '@/lib/utils';
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  const { conversions, addConversions, updateConversion, clearConversions } = useConversions();
  const [isConverting, setIsConverting] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState<ConversionFormat>('webp-to-png');
  const [targetSizeKB, setTargetSizeKB] = useState<number>(100);

  const handleFilesDrop = (files: File[]) => {
    setPendingFiles(files);
    setProgress(0);
  };

  const clearFiles = () => {
    setPendingFiles([]);
    setProgress(0);
  };

  const startConversion = async () => {
    const newConversions = pendingFiles.map(file => ({
      id: Math.random().toString(36).slice(2),
      name: file.name,
      url: '',
      status: 'converting' as const
    }));

    addConversions(newConversions);
    setIsConverting(true);
    setProgress(0);

    try {
      for (let i = 0; i < pendingFiles.length; i++) {
        const file = pendingFiles[i];
        const conversionId = newConversions[i].id;

        try {
          const result = await convertImage(file, format, format === 'png-optimize' ? targetSizeKB : undefined);
          updateConversion(conversionId, {
            url: result.url,
            name: result.name,
            blob: result.blob,
            status: 'completed'
          });
        } catch (error) {
          updateConversion(conversionId, {
            status: 'error',
            error: (error as Error).message
          });
        }
        
        const newProgress = Math.round(((i + 1) / pendingFiles.length) * 100);
        setProgress(newProgress);
      }
    } finally {
      setIsConverting(false);
      setPendingFiles([]);
      setProgress(0);
    }
  };

  const handleDownloadAll = async () => {
    const completedConversions = conversions
      .filter(conv => conv.status === 'completed' && conv.blob)
      .map(({ name, blob }) => ({ name, blob: blob! }));

    if (completedConversions.length > 0) {
      await downloadAllAsZip(completedConversions);
    }
  };

  const hasCompletedConversions = conversions.some(conv => conv.status === 'completed');
  const hasPendingFiles = pendingFiles.length > 0;

  const getAcceptedFileType = () => {
    switch (format) {
      case 'webp-to-png':
        return '.webp';
      case 'png-to-webp':
      case 'png-optimize':
        return '.png';
      default:
        return '';
    }
  };

  const getDropzoneText = () => {
    switch (format) {
      case 'webp-to-png':
        return 'Drop WebP files here or click to select';
      case 'png-to-webp':
        return 'Drop PNG files here or click to select';
      case 'png-optimize':
        return 'Drop PNG files here to optimize';
      default:
        return 'Drop files here or click to select';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <ConverterHeader />
        
        <div className="mb-6 flex items-center gap-4">
          <FormatSelector
            value={format}
            onChange={(newFormat) => {
              setFormat(newFormat);
              setPendingFiles([]);
            }}
            disabled={isConverting || hasPendingFiles}
          />
          
          {format === 'png-optimize' && (
            <OptimizationSettings
              onTargetSizeChange={setTargetSizeKB}
              disabled={isConverting}
            />
          )}
        </div>

        <Dropzone
          onFilesDrop={handleFilesDrop}
          className="mb-8"
          disabled={isConverting}
          accept={getAcceptedFileType()}
          text={getDropzoneText()}
        />

        {(hasPendingFiles || conversions.length > 0) && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {hasPendingFiles ? 'Selected Files' : 'Conversions'}
              </h2>
              <div className="flex gap-2">
                {hasPendingFiles ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={clearFiles}
                      disabled={isConverting}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Files
                    </Button>
                    <Button
                      onClick={startConversion}
                      disabled={isConverting}
                      className="min-w-[160px]"
                    >
                      {isConverting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          {progress}%
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Conversion
                        </>
                      )}
                    </Button>
                  </>
                ) : hasCompletedConversions && (
                  <>
                    <Button
                      variant="outline"
                      onClick={clearConversions}
                      disabled={isConverting}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                    <Button
                      onClick={handleDownloadAll}
                      disabled={isConverting}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {hasPendingFiles ? (
              <div className="space-y-4">
                {pendingFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-4 bg-card rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {truncateFilename(file.name)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ConversionList items={conversions} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}