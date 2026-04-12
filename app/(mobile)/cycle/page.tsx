"use client";

import { useMemo, useState } from "react";
import { Droplets, CalendarDays, CircleDot } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import CycleHeader from "@/components/mobile/cycle/CycleHeader";
import CycleOverview from "@/components/mobile/cycle/CycleOverview";
import CycleCalendar from "@/components/mobile/cycle/CycleCalendar";
import CycleDetailCard from "@/components/mobile/cycle/CycleDetailCard";
import CycleRecordSheet from "@/components/mobile/cycle/CycleRecordSheet";
import {
  cycleCalendarMonths,
  cycleStyles,
} from "@/components/mobile/cycle/config";
import type {
  CycleDayItem,
  CycleRecordFormValue,
} from "@/components/mobile/cycle/config";

export default function CyclePage() {
  const { theme } = useTheme();
  const styles = cycleStyles[theme];
  const [activeMonthIndex, setActiveMonthIndex] = useState(4);
  const [activeDate, setActiveDate] = useState("2026-04-24");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editedDays, setEditedDays] = useState<Record<string, CycleDayItem>>({});
  const today = "2026-04-24";

  const currentMonth = cycleCalendarMonths[activeMonthIndex];
  const monthDays = useMemo(
    () => currentMonth.days.map((item) => editedDays[item.fullDate] ?? item),
    [currentMonth.days, editedDays]
  );

  const selectedDay = useMemo(() => {
    const inCurrentMonth = monthDays.find((item) => item.fullDate === activeDate);
    if (inCurrentMonth) return inCurrentMonth;
    return monthDays.find((item) => item.current) ?? monthDays[0];
  }, [activeDate, monthDays]);

  const canRecordSelectedDay = selectedDay.fullDate <= today;

  const handleSelectDate = (value: string) => {
    setActiveDate(value);
    const monthIndex = cycleCalendarMonths.findIndex((month) =>
      month.days.some((item) => item.fullDate === value && item.current)
    );
    if (monthIndex >= 0) setActiveMonthIndex(monthIndex);
  };

  const goPrevMonth = () => {
    if (activeMonthIndex === 0) return;
    const nextIndex = activeMonthIndex - 1;
    setActiveMonthIndex(nextIndex);
    const fallback = cycleCalendarMonths[nextIndex].days.find((item) => item.current) ?? cycleCalendarMonths[nextIndex].days[0];
    setActiveDate(fallback.fullDate);
  };

  const goNextMonth = () => {
    if (activeMonthIndex === cycleCalendarMonths.length - 1) return;
    const nextIndex = activeMonthIndex + 1;
    setActiveMonthIndex(nextIndex);
    const fallback = cycleCalendarMonths[nextIndex].days.find((item) => item.current) ?? cycleCalendarMonths[nextIndex].days[0];
    setActiveDate(fallback.fullDate);
  };

  const handleSaveRecord = (form: CycleRecordFormValue) => {
    const isPeriodRecord = form.isPeriodRecord;
    const metrics =
      isPeriodRecord
        ? [
            { label: "日期", value: selectedDay.label },
            { label: "流量", value: form.flow || "待记录" },
            {
              label: "睡眠",
              value:
                form.sleepAt && form.wakeAt
                  ? `${form.sleepAt} - ${form.wakeAt}`
                  : "待记录",
            },
            { label: "压力", value: form.stress || "一般" },
          ]
        : [
            { label: "日期", value: selectedDay.label },
            { label: "入睡", value: form.sleepAt || "待记录" },
            { label: "起床", value: form.wakeAt || "待记录" },
            { label: "压力", value: form.stress || "一般" },
          ];

    const nextDay: CycleDayItem = {
      ...selectedDay,
      tag: isPeriodRecord ? "period" : selectedDay.tag === "period" ? "log" : selectedDay.tag,
      hasRecord: true,
      detail: {
        ...selectedDay.detail,
        title: isPeriodRecord ? "真实经期记录" : selectedDay.detail.title,
        subtitle: "已记录",
        summary:
          form.note ||
          (isPeriodRecord
            ? "今天按真实来姨妈记录，已覆盖原预测状态。"
            : "今天已经补充了日常状态记录。"),
        metrics,
        symptoms: form.symptomsText
          ? form.symptomsText.split(/[、,，\s]+/).filter(Boolean)
          : ["已记录"],
        primaryAction: "编辑今日记录",
        secondaryAction: isPeriodRecord ? "查看护理建议" : "补充备注",
      },
      sheetPreset: {
        mood: form.mood,
        flow: form.flow,
        note: form.note,
      },
    };

    setEditedDays((current) => ({
      ...current,
      [selectedDay.fullDate]: nextDay,
    }));
    setIsSheetOpen(false);
  };

  return (
    <>
      <div className={cn("min-h-screen pb-28 transition-colors duration-300", styles.page)}>
        <div className="mx-auto max-w-[480px] px-4 pt-4">
          <CycleHeader
            titleClass={styles.title}
            subClass={styles.sub}
            cardClass={styles.card}
          />

          <main className="flex flex-col gap-4">
            <CycleOverview styles={styles} />

            <CycleCalendar
              month={{ ...currentMonth, days: monthDays }}
              activeDate={selectedDay.fullDate}
              setActiveDate={handleSelectDate}
              onPrevMonth={goPrevMonth}
              onNextMonth={goNextMonth}
              hasPrevMonth={activeMonthIndex > 0}
              hasNextMonth={activeMonthIndex < cycleCalendarMonths.length - 1}
              styles={styles}
            />

            <div className="flex flex-wrap gap-2 text-xs">
              <span className={cn("flex items-center gap-1 rounded-full border px-3 py-1.5", styles.period)}>
                <Droplets className="h-3.5 w-3.5" />经期
              </span>
              <span className={cn("flex items-center gap-1 rounded-full border px-3 py-1.5", styles.fertile)}>
                <CalendarDays className="h-3.5 w-3.5" />易孕期
              </span>
              <span className={cn("flex items-center gap-1 rounded-full border px-3 py-1.5", styles.ovulation)}>
                <CircleDot className="h-3.5 w-3.5" />排卵日
              </span>
              <span className={cn("flex items-center gap-1 rounded-full border px-3 py-1.5", styles.log)}>
                <CircleDot className="h-3.5 w-3.5" />已记录
              </span>
            </div>

            <CycleDetailCard
              selectedDay={selectedDay}
              styles={styles}
              onOpenSheet={() => setIsSheetOpen(true)}
              canOpenSheet={canRecordSelectedDay}
            />

            {!canRecordSelectedDay && (
              <p className={cn("px-1 text-xs leading-5", styles.sub)}>
                未来日期仅用于查看预测；经期开始属于预测窗口，可能会提前或推迟，暂时不能新增或编辑记录。
              </p>
            )}
          </main>
        </div>
      </div>

      <CycleRecordSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        selectedDay={selectedDay}
        onSave={handleSaveRecord}
      />
    </>
  );
}
