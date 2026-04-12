import { cn } from "@/lib/utils";
import { ChevronRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CycleDayItem } from "./config";

interface CycleDetailCardProps {
  selectedDay: CycleDayItem;
  styles: Record<string, string>;
  onOpenSheet: () => void;
  canOpenSheet: boolean;
}

export default function CycleDetailCard({
  selectedDay,
  styles,
  onOpenSheet,
  canOpenSheet,
}: CycleDetailCardProps) {
  const detail = selectedDay.detail;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={selectedDay.fullDate}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.22 }}
        className={cn("rounded-[28px] border p-4 shadow-xl", styles.card)}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={cn("text-sm", styles.sub)}>{selectedDay.label}</p>
            <h3 className="mt-1 text-lg font-semibold">{detail.title}</h3>
            <p className={cn("mt-1 text-sm", styles.sub)}>{detail.subtitle}</p>
            <p className={cn("mt-2 text-sm leading-6", styles.sub)}>{detail.summary}</p>
          </div>
          <button
            type="button"
            onClick={onOpenSheet}
            disabled={!canOpenSheet}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-opacity disabled:cursor-not-allowed disabled:opacity-45",
              styles.soft
            )}
            aria-label="新增记录"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {detail.metrics.map((item) => (
            <div key={item.label} className={cn("rounded-2xl border p-3", styles.soft)}>
              <p className={cn("text-xs", styles.sub)}>{item.label}</p>
              <p className="mt-2 text-base font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {detail.symptoms.map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-full border px-3 py-2 text-center text-sm",
                styles.soft
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onOpenSheet}
            disabled={!canOpenSheet}
            className={cn(
              "flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-45",
              styles.btn
            )}
          >
            <Plus className="h-4 w-4" />
            {detail.primaryAction}
          </button>

          <button
            type="button"
            onClick={onOpenSheet}
            disabled={!canOpenSheet}
            className={cn(
              "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-45",
              styles.soft
            )}
          >
            {detail.secondaryAction}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
