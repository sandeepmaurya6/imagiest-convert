export interface FileWithPreview extends File {
  preview?: string;
}

export interface ConversionStatus {
  isConverting: boolean;
  error: string | null;
  convertedUrl: string | null;
}