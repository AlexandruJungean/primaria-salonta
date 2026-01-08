'use client';

import { useState, useCallback } from 'react';
import type { DocumentCategory } from '@/lib/cloudflare/r2-client';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  filename?: string;
  error?: string;
}

interface UseUploadOptions {
  category: DocumentCategory;
  year?: number;
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: string) => void;
}

export function useUpload(options: UseUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  const upload = useCallback(async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', options.category);
      if (options.year) {
        formData.append('year', options.year.toString());
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 'Upload eșuat';
        setError(errorMsg);
        options.onError?.(errorMsg);
        return { success: false, error: errorMsg };
      }

      setProgress({ loaded: file.size, total: file.size, percentage: 100 });

      const successResult: UploadResult = {
        success: true,
        url: data.url,
        key: data.key,
        filename: data.filename,
      };

      setResult(successResult);
      options.onSuccess?.(successResult);

      return successResult;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Eroare la upload';
      setError(errorMsg);
      options.onError?.(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsUploading(false);
    }
  }, [options]);

  const uploadWithPresignedUrl = useCallback(async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      // 1. Obține URL pre-signed
      const presignedResponse = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          category: options.category,
          contentType: file.type,
          fileSize: file.size,
          year: options.year,
        }),
      });

      const presignedData = await presignedResponse.json();

      if (!presignedResponse.ok) {
        throw new Error(presignedData.error || 'Nu s-a putut genera URL-ul de upload');
      }

      // 2. Upload direct în R2
      const uploadResponse = await fetch(presignedData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload eșuat');
      }

      setProgress({ loaded: file.size, total: file.size, percentage: 100 });

      const successResult: UploadResult = {
        success: true,
        url: presignedData.publicUrl,
        key: presignedData.fileKey,
        filename: file.name,
      };

      setResult(successResult);
      options.onSuccess?.(successResult);

      return successResult;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Eroare la upload';
      setError(errorMsg);
      options.onError?.(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsUploading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(null);
    setError(null);
    setResult(null);
  }, []);

  return {
    upload,
    uploadWithPresignedUrl,
    isUploading,
    progress,
    error,
    result,
    reset,
  };
}

