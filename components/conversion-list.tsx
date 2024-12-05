'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { downloadImage } from '@/lib/imageConverter';
import { truncateFilename } from '@/lib/utils';

interface ConversionItem {
  id: string;
  name: string;
  url: string;
  blob?: Blob;
  status: 'converting' | 'completed' | 'error';
  error?: string;
}

interface ConversionListProps {
  items: ConversionItem[];
}

export function ConversionList({ items }: ConversionListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 bg-card rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {truncateFilename(item.name)}
              </p>
              {item.error && (
                <p className="text-sm text-destructive">{item.error}</p>
              )}
            </div>
          </div>
          
          {item.status === 'converting' && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )}
          
          {item.status === 'completed' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => downloadImage(item.url, item.name)}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}