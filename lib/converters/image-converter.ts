import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { optimizeImage } from './image-optimizer';

interface ConversionResult {
  name: string;
  url: string;
  blob: Blob;
}

export async function convertImage(
  file: File,
  format: string,
  targetSizeKB?: number
): Promise<ConversionResult> {
  return new Promise(async (resolve, reject) => {
    try {
      if (format === 'png-optimize' || format === 'jpeg-optimize') {
        const { blob } = await optimizeImage(file, targetSizeKB || 100, format as 'png-optimize' | 'jpeg-optimize');
        const url = URL.createObjectURL(blob);
        resolve({
          name: file.name,
          url,
          blob
        });
        return;
      }

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
            
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const newFileName = `${baseName}${fileExtension}`;
            
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
    } catch (error) {
      reject(error);
    }
  });
}