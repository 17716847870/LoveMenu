"use client";

import React, { useRef } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useMessage } from "@/components/ui/Message";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  path?: string;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  path = "dishes",
  accept = "image/jpeg,image/png,image/gif,image/webp",
  maxSize = 5,
  disabled = false,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const message = useMessage();
  const { upload, isUploading, progress } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      message.error(`图片大小不能超过 ${maxSize}MB`);
      return;
    }

    try {
      const result = await upload(file, { path });
      onChange(result.url);
    } catch (error) {
      console.error("Upload failed:", error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-gray-200"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              disabled
                ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                : "border-pink-300 hover:border-pink-400 hover:bg-pink-50"
            }
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
              <p className="text-sm text-gray-600">上传中... {progress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 mx-auto text-pink-400 mb-2" />
              <p className="text-sm text-gray-600">点击上传图片</p>
              <p className="text-xs text-gray-400 mt-1">
                支持 JPG、PNG、GIF、WebP 格式，最大 {maxSize}MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}
