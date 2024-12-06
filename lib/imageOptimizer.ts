export interface OptimizationSettings {
  targetSizeKB: number;
  quality: number;
  scale: number;
}

export async function getImageSize(blob: Blob): Promise<number> {
  return blob.size / 1024; // Convert to KB
}

export async function optimizeImage(
  file: File,
  targetSizeKB: number,
  initialQuality = 1.0,
  initialScale = 1.0
): Promise<{ blob: Blob; settings: OptimizationSettings }> {
  let quality = initialQuality;
  let scale = initialScale;
  let attempt = 0;
  const maxAttempts = 20;

  const originalImage = await createImageBitmap(file);
  let currentBlob: Blob;
  let currentSize: number;
  let lastSize = Infinity;
  
  // Calculate initial file size
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  canvas.width = originalImage.width;
  canvas.height = originalImage.height;
  ctx.drawImage(originalImage, 0, 0);
  
  const initialBlob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
  });
  
  const initialSize = await getImageSize(initialBlob);
  
  // If original size is already smaller than target, return as is
  if (initialSize <= targetSizeKB) {
    return {
      blob: initialBlob,
      settings: {
        targetSizeKB,
        quality: 1.0,
        scale: 1.0,
      },
    };
  }

  // Calculate reduction ratio needed
  const targetRatio = targetSizeKB / initialSize;
  
  // Initial aggressive reduction based on target ratio
  quality = Math.min(1.0, Math.max(0.1, Math.sqrt(targetRatio)));
  scale = Math.min(1.0, Math.max(0.1, Math.sqrt(targetRatio)));

  do {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Apply scaling
    canvas.width = Math.max(1, Math.floor(originalImage.width * scale));
    canvas.height = Math.max(1, Math.floor(originalImage.height * scale));

    // Apply image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw image with current scale
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    // Convert to blob with current quality
    currentBlob = await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob!),
        'image/png',
        quality
      );
    });

    currentSize = await getImageSize(currentBlob);

    // If we're not making progress, make bigger adjustments
    if (Math.abs(currentSize - lastSize) < 1 && currentSize > targetSizeKB) {
      quality *= 0.7;
      scale *= 0.7;
    } else if (currentSize > targetSizeKB) {
      // Adjust parameters based on how far we are from target
      const ratio = targetSizeKB / currentSize;
      const adjustment = Math.max(0.5, Math.min(0.9, ratio));
      
      if (quality > 0.1) {
        quality *= adjustment;
      }
      if (quality <= 0.1 && scale > 0.1) {
        scale *= adjustment;
      }
    }

    lastSize = currentSize;
    attempt++;
  } while (currentSize > targetSizeKB && attempt < maxAttempts && (quality > 0.1 || scale > 0.1));

  // If we still haven't reached target size, make one final aggressive attempt
  if (currentSize > targetSizeKB) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Calculate final dimensions based on target size ratio
    const finalScale = Math.sqrt(targetSizeKB / currentSize);
    canvas.width = Math.max(1, Math.floor(originalImage.width * finalScale));
    canvas.height = Math.max(1, Math.floor(originalImage.height * finalScale));

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    currentBlob = await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob!),
        'image/png',
        0.1
      );
    });
  }

  return {
    blob: currentBlob,
    settings: {
      targetSizeKB,
      quality,
      scale,
    },
  };
}