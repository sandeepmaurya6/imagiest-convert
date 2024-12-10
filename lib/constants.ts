export const MAX_FILES = 20;

export const FORMAT_CATEGORIES = {
  images: {
    label: 'Images',
    maxSizeMB: 50,
    formats: {
      'webp-to-png': {
        label: 'WebP to PNG',
        accept: '.webp',
        dropzoneText: 'Drop WebP files here or click to select'
      },
      'png-to-webp': {
        label: 'PNG to WebP',
        accept: '.png',
        dropzoneText: 'Drop PNG files here or click to select'
      },
      'png-optimize': {
        label: 'PNG Optimizer',
        accept: '.png',
        dropzoneText: 'Drop PNG files here to optimize'
      },
      'jpeg-optimize': {
        label: 'JPEG Optimizer',
        accept: '.jpg,.jpeg',
        dropzoneText: 'Drop JPEG files here to optimize'
      }
    }
  },
  videos: {
    label: 'Videos',
    maxSizeMB: 500,
    formats: {
      'mp4-to-mp3': {
        label: 'MP4 to MP3',
        accept: '.mp4',
        dropzoneText: 'Drop MP4 files here or click to select'
      },
      'mov-to-mp4': {
        label: 'MOV to MP4',
        accept: '.mov',
        dropzoneText: 'Drop MOV files here or click to select'
      }
    }
  }
} as const;

export type FormatCategory = keyof typeof FORMAT_CATEGORIES;
export type ConversionFormat = {
  [K in FormatCategory]: keyof typeof FORMAT_CATEGORIES[K]['formats'];
}[FormatCategory];