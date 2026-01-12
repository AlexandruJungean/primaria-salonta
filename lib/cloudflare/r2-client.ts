/**
 * Cloudflare R2 Client pentru upload și gestionare documente
 * 
 * Structura folderelor în R2:
 * primaria-salonta-docs/
 * ├── hotarari/
 * │   └── 2025/
 * │       └── hclms-263-30-12-2025.pdf
 * ├── sedinte/
 * │   └── 2025/
 * │       └── proces-verbal-30-12-2025.pdf
 * ├── buget/
 * │   └── 2025/
 * │       └── buget-initial-2025.pdf
 * ├── stiri/
 * │   └── 2025/
 * │       └── imagine-stire.jpg
 * └── declaratii/
 *     └── 2025/
 *         └── declaratie-avere-nume.pdf
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configurare client R2 (compatibil S3)
const R2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'primaria-salonta-docs';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

// Tipuri de fișiere permise
export const ALLOWED_MIME_TYPES = {
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
  ],
  images: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
};

// Limite de dimensiune (în bytes)
export const MAX_FILE_SIZE = {
  document: 50 * 1024 * 1024, // 50 MB
  image: 10 * 1024 * 1024,    // 10 MB
};

/**
 * Categorii de foldere pentru documente
 */
export type DocumentCategory = 
  | 'hotarari'
  | 'sedinte'
  | 'stiri'
  | 'buget'
  | 'declaratii'
  | 'programe'
  | 'formulare'
  | 'autorizatii'
  | 'certificate'
  | 'dispozitii'
  | 'licitatii'
  | 'transparenta'
  | 'cariera'
  | 'altele';

/**
 * Generează un key unic pentru fișier în R2
 */
export function generateFileKey(
  category: DocumentCategory,
  filename: string,
  year?: number
): string {
  // Sanitizează numele fișierului
  const sanitizedName = filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Adaugă timestamp pentru unicitate
  const timestamp = Date.now();
  const ext = sanitizedName.split('.').pop();
  const baseName = sanitizedName.replace(`.${ext}`, '');
  
  const currentYear = year || new Date().getFullYear();
  
  return `${category}/${currentYear}/${baseName}-${timestamp}.${ext}`;
}

/**
 * Obține URL-ul public pentru un fișier
 */
export function getPublicUrl(fileKey: string): string {
  if (PUBLIC_URL) {
    return `${PUBLIC_URL}/${fileKey}`;
  }
  // Fallback la endpoint-ul R2 direct
  return `${process.env.R2_ENDPOINT}/${BUCKET_NAME}/${fileKey}`;
}

/**
 * Upload fișier în R2
 */
export async function uploadFile(
  file: Buffer | Uint8Array,
  filename: string,
  category: DocumentCategory,
  contentType: string,
  year?: number
): Promise<{ success: boolean; url?: string; key?: string; error?: string }> {
  try {
    const fileKey = generateFileKey(category, filename, year);
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file,
      ContentType: contentType,
      // Cache pentru 1 an (documentele nu se schimbă)
      CacheControl: 'public, max-age=31536000',
    });
    
    await R2.send(command);
    
    const publicUrl = getPublicUrl(fileKey);
    
    return {
      success: true,
      url: publicUrl,
      key: fileKey,
    };
  } catch (error) {
    console.error('R2 Upload Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Șterge fișier din R2
 */
export async function deleteFile(fileKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });
    
    await R2.send(command);
    
    return { success: true };
  } catch (error) {
    console.error('R2 Delete Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

/**
 * Generează URL pre-signed pentru upload direct din browser
 */
export async function getUploadPresignedUrl(
  filename: string,
  category: DocumentCategory,
  contentType: string,
  year?: number,
  expiresIn: number = 3600 // 1 oră
): Promise<{ success: boolean; uploadUrl?: string; fileKey?: string; publicUrl?: string; error?: string }> {
  try {
    const fileKey = generateFileKey(category, filename, year);
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
    });
    
    const uploadUrl = await getSignedUrl(R2, command, { expiresIn });
    const publicUrl = getPublicUrl(fileKey);
    
    return {
      success: true,
      uploadUrl,
      fileKey,
      publicUrl,
    };
  } catch (error) {
    console.error('R2 Presigned URL Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate URL',
    };
  }
}

/**
 * Listează fișierele dintr-un folder
 */
export async function listFiles(
  prefix: string,
  maxKeys: number = 1000
): Promise<{ success: boolean; files?: Array<{ key: string; size: number; lastModified: Date }>; error?: string }> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: maxKeys,
    });
    
    const response = await R2.send(command);
    
    const files = (response.Contents || []).map((obj: { Key?: string; Size?: number; LastModified?: Date }) => ({
      key: obj.Key!,
      size: obj.Size || 0,
      lastModified: obj.LastModified || new Date(),
    }));
    
    return { success: true, files };
  } catch (error) {
    console.error('R2 List Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'List failed',
    };
  }
}

/**
 * Verifică dacă un fișier există
 */
export async function fileExists(fileKey: string): Promise<boolean> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });
    
    await R2.send(command);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validează fișierul înainte de upload
 */
export function validateFile(
  file: { size: number; type: string },
  allowedTypes: 'documents' | 'images' | 'all' = 'all'
): { valid: boolean; error?: string } {
  // Verifică tipul MIME
  let allowedMimeTypes: string[] = [];
  if (allowedTypes === 'documents') {
    allowedMimeTypes = ALLOWED_MIME_TYPES.documents;
  } else if (allowedTypes === 'images') {
    allowedMimeTypes = ALLOWED_MIME_TYPES.images;
  } else {
    allowedMimeTypes = [...ALLOWED_MIME_TYPES.documents, ...ALLOWED_MIME_TYPES.images];
  }
  
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipul fișierului nu este permis. Tipuri acceptate: ${allowedMimeTypes.join(', ')}`,
    };
  }
  
  // Verifică dimensiunea
  const maxSize = ALLOWED_MIME_TYPES.images.includes(file.type) 
    ? MAX_FILE_SIZE.image 
    : MAX_FILE_SIZE.document;
  
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `Fișierul este prea mare. Dimensiunea maximă: ${maxSizeMB} MB`,
    };
  }
  
  return { valid: true };
}

export { R2, BUCKET_NAME };

