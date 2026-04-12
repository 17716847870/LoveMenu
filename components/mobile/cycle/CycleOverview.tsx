import { CalendarDays, Droplets, MoonStar } from "lucide-react";
import { cn } from "@/lib/utils";
import { cycleOverview } from "./config";

interface CycleOverviewProps {
  styles: Record<string, string>;
}

export default function CycleOverview({ styles }: CycleOverviewProps) {
  const icons = [CalendarDays, Droplets, MoonStar, CalendarDays] as const;

  return (
    <section className={cn("rounded-[28px] border p-4 shadow-xl", styles.card)}>
      <p className={cn("text-sm", styles.sub)}>{cycleOverview.subtitle}</p>
      <h2 className={cn("mt-1 text-2xl font-semibold", styles.title)}>
        {cycleOverview.title}
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        {cycleOverview.cards.map((item, index) => {
          const Icon = icons[index];
          return (
            <div key={item.label} className={cn("rounded-2xl border p-3", styles.soft)}>
              <div className="flex items-center justify-between">
                <p className={styles.sub}>{item.label}</p>
                <Icon className={cn("h-4 w-4", styles.sub)} />
              </div>
              <p className="mt-2 text-xl font-semibold">{item.value}</p>
              <p className={cn("mt-1 text-xs leading-5", styles.sub)}>{item.note}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
