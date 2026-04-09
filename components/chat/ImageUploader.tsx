import { ChangeEvent } from "react";
import { Button } from "../ui/Button";

type ImageUploaderProps = {
  onSelect?: (file: File) => void;
};

export const ImageUploader = ({ onSelect }: ImageUploaderProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSelect?.(file);
    }
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--color-muted)]">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <Button variant="secondary" size="sm">
        上传图片
      </Button>
    </label>
  );
};
