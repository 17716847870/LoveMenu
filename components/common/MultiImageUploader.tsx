"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import { useMessage } from "@/components/ui/Message";

interface ImageItem {
  id: string;
  localUrl: string;
  remoteUrl?: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

interface UploadResponse {
  url: string;
  name: string;
  size: number;
}

export interface ImageUploaderProps {
  value?: string | string[];
  onChange: (urls: string | string[]) => void;
  mode?: "single" | "multiple";
  path?: string;
  accept?: string;
  maxSize?: number;
  maxCount?: number;
  disabled?: boolean;
  showTitle?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  mode = "single",
  path = "uploads",
  accept = "image/jpeg,image/png,image/gif,image/webp",
  maxSize = 5,
  maxCount = 9,
  disabled = false,
  showTitle = true,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const message = useMessage();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const isMultiple = mode === "multiple";

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleOnChange = useCallback((urls: string | string[]) => {
    onChangeRef.current(urls);
  }, []);

  useEffect(() => {
    const existingUrls = isMultiple
      ? (value as string[]) || []
      : value
        ? [value as string]
        : [];

    if (existingUrls.length > 0) {
      const existingImages = existingUrls.map((url, index) => ({
        id: `existing-${index}`,
        localUrl: url,
        remoteUrl: url,
        progress: 100,
        status: "success" as const,
      }));

      const remoteUrls = existingImages.map((img) => img.remoteUrl);
      const currentRemoteUrls = images
        .filter((img) => img.status === "success" && img.remoteUrl)
        .map((img) => img.remoteUrl);

      if (JSON.stringify(remoteUrls) !== JSON.stringify(currentRemoteUrls)) {
        setImages(existingImages);
      }
    } else if (
      images.length > 0 &&
      !images.some((img) => img.status === "uploading")
    ) {
      images.forEach((img) => {
        if (!img.remoteUrl) {
          URL.revokeObjectURL(img.localUrl);
        }
      });
      setImages([]);
      setPreviewIndex(null);
    }
  }, [value, isMultiple, images]);

  useEffect(() => {
    if (images.length === 0) {
      return;
    }

    const allSuccessful = images.every((img) => img.status === "success");
    const anyUploading = images.some((img) => img.status === "uploading");

    if (allSuccessful && !anyUploading) {
      const successfulUrls = images
        .filter((img) => img.status === "success" && img.remoteUrl)
        .map((img) => img.remoteUrl!);

      if (successfulUrls.length > 0) {
        const finalUrls = isMultiple ? successfulUrls : successfulUrls[0];
        handleOnChange(finalUrls);
      }
    }
  }, [images, isMultiple, handleOnChange]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log("handleFileChange 被调用, files:", files);
    if (!files.length) return;

    if (!isMultiple && files.length > 1) {
      message.warning("单文件模式只能选择一个文件");
      files.splice(1);
    }

    if (isMultiple && images.length + files.length > maxCount) {
      message.warning(`最多只能上传 ${maxCount} 张图片`);
      files.splice(maxCount - images.length);
    }

    const newImages: ImageItem[] = files.map((file, index) => {
      const id = `img-${Date.now()}-${index}`;
      const localUrl = URL.createObjectURL(file);
      return {
        id,
        localUrl,
        progress: 0,
        status: "uploading" as const,
      };
    });

    setImages((prev) => {
      if (isMultiple) {
        return [...prev, ...newImages];
      } else {
        prev.forEach((img) => URL.revokeObjectURL(img.localUrl));
        return newImages;
      }
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > maxSize * 1024 * 1024) {
        message.error(`${file.name} 超过 ${maxSize}MB 限制`);
        setImages((prev) =>
          prev.map((img) =>
            img.id === newImages[i].id
              ? {
                  ...img,
                  status: "error" as const,
                  error: `超过 ${maxSize}MB 限制`,
                }
              : img
          )
        );
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", path);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setImages((prev) =>
              prev.map((img) =>
                img.id === newImages[i].id ? { ...img, progress } : img
              )
            );
          }
        };

        const result = await new Promise<UploadResponse>((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.data) {
                  resolve(response.data);
                } else {
                  reject(new Error(response.message || "上传失败"));
                }
              } catch {
                reject(new Error("解析响应失败"));
              }
            } else {
              try {
                const error = JSON.parse(xhr.responseText);
                reject(new Error(error.message || "上传失败"));
              } catch {
                reject(new Error(`上传失败: ${xhr.status}`));
              }
            }
          };

          xhr.onerror = () => reject(new Error("网络错误"));
          xhr.ontimeout = () => reject(new Error("上传超时"));

          xhr.open("POST", "/api/upload");
          xhr.send(formData);
        });

        console.log("上传成功, result:", result);
        setImages((prev) =>
          prev.map((img) =>
            img.id === newImages[i].id
              ? {
                  ...img,
                  remoteUrl: result.url,
                  progress: 100,
                  status: "success" as const,
                }
              : img
          )
        );
      } catch (error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === newImages[i].id
              ? {
                  ...img,
                  status: "error" as const,
                  error: error instanceof Error ? error.message : "上传失败",
                }
              : img
          )
        );
        message.error(error instanceof Error ? error.message : "上传失败");
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id);
    if (imageToRemove && !imageToRemove.remoteUrl?.startsWith("http")) {
      URL.revokeObjectURL(imageToRemove.localUrl);
    }

    const newImages = images.filter((img) => img.id !== id);
    setImages(newImages);

    const successfulUrls = newImages
      .filter((img) => img.status === "success" && img.remoteUrl)
      .map((img) => img.remoteUrl!);

    if (isMultiple) {
      handleOnChange(successfulUrls);
    } else {
      handleOnChange(successfulUrls[0] || "");
    }
  };

  const handleAddClick = () => {
    const canUpload = isMultiple
      ? !disabled && images.length < maxCount
      : !disabled && images.length === 0;

    if (canUpload && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    if (isMultiple && images.length + files.length > maxCount) {
      message.warning(`最多只能上传 ${maxCount} 张图片`);
      files.splice(maxCount - images.length);
    }

    const validFiles = files.filter((file) => {
      const isValidType = accept
        .split(",")
        .some((type) => file.type.includes(type.split("/")[1]));
      if (!isValidType) {
        message.error(`${file.name} 格式不支持`);
        return false;
      }
      if (file.size > maxSize * 1024 * 1024) {
        message.error(`${file.name} 超过 ${maxSize}MB 限制`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      validFiles.forEach((file) => dataTransfer.items.add(file));
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        fileInputRef.current.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handlePreview = (index: number) => {
    if (images[index]?.status === "success") {
      setPreviewIndex(index);
    }
  };

  const closePreview = () => {
    setPreviewIndex(null);
  };

  const goToPrevious = () => {
    if (previewIndex !== null && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  const goToNext = () => {
    if (previewIndex !== null && previewIndex < images.length - 1) {
      setPreviewIndex(previewIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (previewIndex === null) return;

      if (e.key === "Escape") {
        closePreview();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    if (previewIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [previewIndex]);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (!img.remoteUrl) {
          URL.revokeObjectURL(img.localUrl);
        }
      });
    };
  }, [images]);

  const displayUrls = images.map((img) => img.localUrl);

  const showGridUploadButton = isMultiple && images.length < maxCount;
  const showFullUploadButton = !isMultiple && images.length === 0;

  return (
    <div className="space-y-3">
      {showTitle && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {isMultiple
              ? `图片（${images.filter((i) => i.status === "success").length}/${maxCount}）`
              : "图片"}
          </span>
          <span className="text-xs text-gray-400">
            支持 JPG、PNG、GIF、WebP 格式，最大 {maxSize}MB
          </span>
        </div>
      )}

      <div
        className={`grid gap-3 ${isMultiple ? "grid-cols-3 md:grid-cols-4" : "grid-cols-1"}`}
      >
        {displayUrls.map((url, index) => {
          const image = images[index];
          const isUploading = image?.status === "uploading";
          const isError = image?.status === "error";
          const progress = image?.progress || 0;
          const isSuccess = image?.status === "success";

          return (
            <div
              key={image?.id || index}
              className="relative group aspect-square"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={url}
                  alt={`图片 ${index + 1}`}
                  className={`w-full h-full object-cover cursor-pointer transition-transform ${isSuccess ? "hover:scale-105" : ""}`}
                  onClick={() => handlePreview(index)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />

                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                    <div className="w-3/4 h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-white text-xs mt-1">{progress}%</span>
                  </div>
                )}

                {isError && (
                  <div className="absolute inset-0 bg-red-500/50 flex flex-col items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-white mb-1" />
                    <span className="text-white text-xs text-center px-2">
                      {image.error || "上传失败"}
                    </span>
                  </div>
                )}

                {isSuccess && !isUploading && (
                  <>
                    <div className="absolute top-1 right-1">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handlePreview(index)}
                        className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                      >
                        <ZoomIn size={20} className="text-gray-700" />
                      </button>
                    </div>
                  </>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRemove(image?.id || "")}
                    disabled={disabled || isUploading}
                    className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
                  >
                    <X size={18} />
                  </button>
                </div>

                {isMultiple && images.length > 1 && !disabled && (
                  <div className="absolute top-1 left-1 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                    {index + 1}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {showGridUploadButton && (
          <div
            onClick={handleAddClick}
            className={`
              relative aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
              ${
                disabled
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                  : "border-pink-300 hover:border-pink-400 hover:bg-pink-50"
              }
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="w-8 h-8 text-pink-400 mb-1" />
            <span className="text-xs text-gray-500">添加图片</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        multiple={isMultiple}
        className="hidden"
        disabled={disabled}
      />

      {!isMultiple && images.length === 0 && (
        <button
          type="button"
          onClick={handleAddClick}
          className={`
            w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              disabled
                ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                : "border-pink-300 hover:border-pink-400 hover:bg-pink-50"
            }
          `}
        >
          <Upload className="w-10 h-10 mx-auto text-pink-400 mb-2" />
          <p className="text-sm text-gray-600">点击上传图片</p>
          <p className="text-xs text-gray-400 mt-1">
            支持 JPG、PNG、GIF、WebP 格式，最大 {maxSize}MB
          </p>
        </button>
      )}

      {previewIndex !== null && images[previewIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closePreview}
        >
          <button
            type="button"
            onClick={closePreview}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X size={24} className="text-white" />
          </button>

          {isMultiple && previewIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
          )}

          {isMultiple && previewIndex < images.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          )}

          <img
            src={
              images[previewIndex].remoteUrl || images[previewIndex].localUrl
            }
            alt={`预览 ${previewIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.png";
            }}
          />

          {isMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full">
              <span className="text-white text-sm">
                {previewIndex + 1} / {images.length}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
