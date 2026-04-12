"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CycleHeaderProps {
  titleClass: string;
  subClass: string;
  cardClass: string;
}

export default function CycleHeader({
  titleClass,
  subClass,
  cardClass,
}: CycleHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 pb-4 backdrop-blur-xl">
      <div className="grid grid-cols-[44px_1fr_44px] items-center">
        <button
          onClick={() => router.back()}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border",
            cardClass
          )}
          aria-label="返回"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <p className={cn("text-xs uppercase tracking-[0.28em]", subClass)}>
            Cycle Record
          </p>
          <h1 className={cn("mt-1 text-lg font-semibold", titleClass)}>
            姨妈日历
          </h1>
        </div>

        <div className="h-11 w-11" aria-hidden="true" />
      </div>
    </header>
  );
}
