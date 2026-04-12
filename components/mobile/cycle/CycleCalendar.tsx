import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { cycleWeekdays, CycleCalendarMonth, CycleDayItem } from "./config";

interface CycleCalendarProps {
  month: CycleCalendarMonth;
  activeDate: string;
  setActiveDate: (value: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  hasPrevMonth: boolean;
  hasNextMonth: boolean;
  styles: Record<string, string>;
}

export default function CycleCalendar({
  month,
  activeDate,
  setActiveDate,
  onPrevMonth,
  onNextMonth,
  hasPrevMonth,
  hasNextMonth,
  styles,
}: CycleCalendarProps) {
  return (
    <section className={cn("rounded-[28px] border p-4 shadow-xl", styles.card)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className={cn("text-sm", styles.sub)}>月历记录</p>
          <h3 className={cn("mt-1 text-xl font-semibold", styles.title)}>
            {month.label}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            disabled={!hasPrevMonth}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-opacity disabled:opacity-40",
              styles.soft
            )}
            aria-label="查看上个月"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            disabled={!hasNextMonth}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-opacity disabled:opacity-40",
              styles.soft
            )}
            aria-label="查看下个月"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {cycleWeekdays.map((day) => (
          <div key={day} className={cn("pb-1", styles.sub)}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {month.days.map((item: CycleDayItem) => {
          const isActive = activeDate === item.fullDate;
          return (
            <button
              key={item.fullDate}
              onClick={() => setActiveDate(item.fullDate)}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-2xl border text-sm transition-all",
                styles.soft,
                item.tag && styles[item.tag],
                item.isToday && styles.ring,
                isActive && styles.activeDate,
                isActive && "scale-[1.06] -translate-y-0.5"
              )}
              type="button"
              aria-label={item.label}
            >
              <span className={cn("font-medium", !item.current && styles.mute)}>
                {item.day}
              </span>
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
              {item.hasRecord && (
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white/80" />
              )}
              {isActive && (
                <span className="absolute inset-x-3 bottom-2 h-0.5 rounded-full bg-current opacity-80" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
