/**
 * React hook for resilient file uploads with progress tracking.
 * Wraps uploadEngine for easy use in components.
 */

import { useState, useCallback, useRef } from "react";
import {
  uploadFiles,
  uploadSingle,
  type UploadConfig,
  type UploadProgress,
  type UploadResult,
} from "@/lib/uploadEngine";

interface UseUploadOptions extends UploadConfig {
  /** Called when all uploads complete */
  onComplete?: (results: UploadResult[]) => void;
  /** Called on any failure */
  onError?: (errors: { name: string; error: string }[]) => void;
}

interface UseUploadReturn {
  /** Upload multiple files */
  upload: (files: File[], pathPrefix?: string) => Promise<UploadResult[]>;
  /** Upload a single file */
  uploadOne: (file: File, pathPrefix?: string) => Promise<UploadResult>;
  /** Per-file progress */
  fileProgress: UploadProgress[];
  /** Overall progress 0-100 */
  overallProgress: number;
  /** Whether any upload is in progress */
  isUploading: boolean;
  /** Reset state */
  reset: () => void;
}

export function useUpload(options: UseUploadOptions): UseUploadReturn {
  const [fileProgress, setFileProgress] = useState<UploadProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const abortRef = useRef(false);

  const upload = useCallback(
    async (files: File[], pathPrefix?: string): Promise<UploadResult[]> => {
      setIsUploading(true);
      abortRef.current = false;

      const config: UploadConfig = {
        ...options,
        ...(pathPrefix ? { pathPrefix } : {}),
      };

      try {
        const result = await uploadFiles(files, config, (progress, overall) => {
          if (abortRef.current) return;
          setFileProgress([...progress]);
          setOverallProgress(overall);
        });

        if (result.failed.length > 0) {
          options.onError?.(result.failed);
        }

        if (result.successful.length > 0) {
          options.onComplete?.(result.successful);
        }

        return result.successful;
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  const uploadOne = useCallback(
    async (file: File, pathPrefix?: string): Promise<UploadResult> => {
      setIsUploading(true);

      const config: UploadConfig = {
        ...options,
        ...(pathPrefix ? { pathPrefix } : {}),
      };

      try {
        const result = await uploadSingle(file, config, (progress) => {
          setOverallProgress(progress);
          setFileProgress([
            {
              fileId: "single",
              fileName: file.name,
              status: progress === 100 ? "success" : "uploading",
              progress,
              retryCount: 0,
            },
          ]);
        });

        options.onComplete?.([result]);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err.message : "Upload failed";
        options.onError?.([{ name: file.name, error }]);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    abortRef.current = true;
    setFileProgress([]);
    setOverallProgress(0);
    setIsUploading(false);
  }, []);

  return {
    upload,
    uploadOne,
    fileProgress,
    overallProgress,
    isUploading,
    reset,
  };
}
