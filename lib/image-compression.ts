import sharp from 'sharp';

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'original';
}

export interface CompressionResult {
  buffer: Buffer;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  format: string;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 80,
  format: 'webp',
};

/**
 * Comprimă și optimizează o imagine
 */
export async function compressImage(
  input: Buffer | ArrayBuffer,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const inputBuffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  const originalSize = inputBuffer.length;

  // Obține metadata imaginii originale
  const metadata = await sharp(inputBuffer).metadata();
  const originalFormat = metadata.format || 'unknown';

  // Calculează dimensiunile noi păstrând aspect ratio
  let width = metadata.width || opts.maxWidth!;
  let height = metadata.height || opts.maxHeight!;

  if (width > opts.maxWidth! || height > opts.maxHeight!) {
    const aspectRatio = width / height;
    
    if (width > opts.maxWidth!) {
      width = opts.maxWidth!;
      height = Math.round(width / aspectRatio);
    }
    
    if (height > opts.maxHeight!) {
      height = opts.maxHeight!;
      width = Math.round(height * aspectRatio);
    }
  }

  // Procesează imaginea
  let sharpInstance = sharp(inputBuffer)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .rotate(); // Auto-rotate bazat pe EXIF

  // Elimină metadata EXIF (privacy)
  sharpInstance = sharpInstance.withMetadata({
    orientation: undefined,
  });

  // Aplică formatul și calitatea
  let outputBuffer: Buffer;
  let outputMimeType: string;
  let outputFormat: string;

  switch (opts.format) {
    case 'webp':
      outputBuffer = await sharpInstance.webp({ quality: opts.quality }).toBuffer();
      outputMimeType = 'image/webp';
      outputFormat = 'webp';
      break;
    case 'jpeg':
      outputBuffer = await sharpInstance.jpeg({ quality: opts.quality, mozjpeg: true }).toBuffer();
      outputMimeType = 'image/jpeg';
      outputFormat = 'jpeg';
      break;
    case 'png':
      outputBuffer = await sharpInstance.png({ compressionLevel: 9 }).toBuffer();
      outputMimeType = 'image/png';
      outputFormat = 'png';
      break;
    case 'original':
    default:
      // Păstrează formatul original dar optimizează
      if (originalFormat === 'png') {
        outputBuffer = await sharpInstance.png({ compressionLevel: 9 }).toBuffer();
        outputMimeType = 'image/png';
        outputFormat = 'png';
      } else if (originalFormat === 'webp') {
        outputBuffer = await sharpInstance.webp({ quality: opts.quality }).toBuffer();
        outputMimeType = 'image/webp';
        outputFormat = 'webp';
      } else {
        // Default to JPEG for other formats
        outputBuffer = await sharpInstance.jpeg({ quality: opts.quality, mozjpeg: true }).toBuffer();
        outputMimeType = 'image/jpeg';
        outputFormat = 'jpeg';
      }
  }

  // Obține dimensiunile finale
  const outputMetadata = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    mimeType: outputMimeType,
    originalSize,
    compressedSize: outputBuffer.length,
    width: outputMetadata.width || width,
    height: outputMetadata.height || height,
    format: outputFormat,
  };
}

/**
 * Comprimă imagine pentru galerie (mai mare, calitate bună)
 */
export async function compressGalleryImage(input: Buffer | ArrayBuffer): Promise<CompressionResult> {
  return compressImage(input, {
    maxWidth: 1920,
    maxHeight: 1440,
    quality: 85,
    format: 'webp',
  });
}

/**
 * Comprimă imagine pentru thumbnail/preview
 */
export async function compressThumbnail(input: Buffer | ArrayBuffer): Promise<CompressionResult> {
  return compressImage(input, {
    maxWidth: 400,
    maxHeight: 300,
    quality: 75,
    format: 'webp',
  });
}

/**
 * Comprimă imagine pentru featured image (știri, evenimente)
 */
export async function compressFeaturedImage(input: Buffer | ArrayBuffer): Promise<CompressionResult> {
  return compressImage(input, {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 85,
    format: 'webp',
  });
}

/**
 * Verifică dacă un fișier este o imagine
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/') && 
    ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'].includes(mimeType);
}

/**
 * Calculează procentul de compresie
 */
export function getCompressionRatio(originalSize: number, compressedSize: number): number {
  return Math.round((1 - compressedSize / originalSize) * 100);
}

/**
 * Formatează dimensiunea fișierului pentru display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
