import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export type ConversionFormat = 'webp-to-png' | 'png-to-webp';

interface ConversionResult {
  name: string;
  url: string;
  blob: Blob;
}

export async function convertImage(file: File, format: ConversionFormat): Promise<ConversionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        const mimeType = format === 'webp-to-png' ? 'image/png' : 'image/webp';
        const fileExtension = format === 'webp-to-png' ? '.png' : '.webp';
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to convert image'));
            return;
          }
          
          const newFileName = file.name.replace(/\.(webp|png)$/i, fileExtension);
          resolve({
            name: newFileName,
            url: URL.createObjectURL(blob),
            blob
          });
        }, mimeType, 0.8);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function downloadImage(url: string, fileName: string) {
  saveAs(url, fileName);
}

export async function downloadAllAsZip(conversions: Array<{ name: string; blob: Blob }>) {
  const zip = new JSZip();
  
  conversions.forEach(({ name, blob }) => {
    zip.file(name, blob);
  });
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, 'converted-images.zip');
}