"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMessage } from "@/components/ui/Message";

export interface UploadResponse {
  url: string;
  name: string;
  size: number;
  contentType: string;
}

export function useImageUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const message = useMessage();

  const uploadMutation = useMutation({
    mutationFn: async (params: {
      file: File;
      path?: string;
      filename?: string;
    }): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append("file", params.file);
      if (params.path) {
        formData.append("path", params.path);
      }
      if (params.filename) {
        formData.append("filename", params.filename);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "上传失败");
      }

      return response.json().then((res) => res.data);
    },
    onSuccess: () => {
      setUploadProgress(100);
      message.success("图片上传成功");
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const upload = async (
    file: File,
    options?: { path?: string; filename?: string }
  ) => {
    setUploadProgress(0);

    const fakeProgress = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(fakeProgress);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const result = await uploadMutation.mutateAsync({ file, ...options });
      clearInterval(fakeProgress);
      setUploadProgress(100);
      return result;
    } catch (error) {
      clearInterval(fakeProgress);
      throw error;
    }
  };

  return {
    upload,
    isUploading: uploadMutation.isPending,
    progress: uploadProgress,
    error: uploadMutation.error,
  };
}
