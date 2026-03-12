import Image from "next/image";
import { cn } from "../../utils/format";

type AvatarProps = {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
};

export const Avatar = ({ src, alt, size = 40, className }: AvatarProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full bg-[var(--color-accent)]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-[var(--color-muted)]">
          {alt.slice(0, 1)}
        </div>
      )}
    </div>
  );
};
