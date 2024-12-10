import { convertImage } from './image-converter';
import { convertVideo } from './video-converter';
import { FORMAT_CATEGORIES, type ConversionFormat } from '@/lib/constants';

export async function convertFile(
  file: File,
  format: ConversionFormat,
  targetSizeKB?: number
) {
  // Determine if it's an image or video format
  const category = Object.entries(FORMAT_CATEGORIES).find(([_, { formats }]) =>
    Object.keys(formats).includes(format)
  )?.[0];

  if (category === 'images') {
    return convertImage(file, format, targetSizeKB);
  } else if (category === 'videos') {
    return convertVideo(file, format as 'mp4-to-mp3' | 'mov-to-mp4');
  }

  throw new Error('Unsupported format');
}