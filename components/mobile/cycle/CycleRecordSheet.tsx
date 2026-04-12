"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MoonStar, Flame, BedDouble, HeartPulse } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import TimePicker from "./TimePicker";
import type { CycleDayItem, CycleRecordFormValue } from "./config";

interface CycleRecordSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: CycleDayItem;
  onSave: (form: CycleRecordFormValue) => void;
}

const sheetStyles: Record<
  ThemeName,
  {
    overlay: string;
    sheet: string;
    title: string;
    label: string;
    input: string;
    option: string;
    optionActive: string;
    submit: string;
    helper: string;
  }
> = {
  couple: {
    overlay: "bg-black/40",
    sheet: "bg-white border-t border-pink-100",
    title: "text-rose-950",
    label: "text-rose-700",
    input:
      "bg-pink-50/70 border-pink-100 text-rose-900 placeholder:text-pink-300 focus:border-pink-300 focus:ring-pink-100",
    option: "bg-pink-50 text-pink-700 border-pink-100",
    optionActive: "bg-rose-500 text-white border-rose-500",
    submit: "bg-rose-500 text-white shadow-rose-200",
    helper: "text-rose-400",
  },
  cute: {
    overlay: "bg-black/45",
    sheet: "bg-[#fff7fb] border-t border-orange-100",
    title: "text-orange-950",
    label: "text-orange-700",
    input:
      "bg-white border-orange-100 text-orange-900 placeholder:text-orange-300 focus:border-orange-300 focus:ring-orange-100",
    option: "bg-white text-orange-700 border-orange-100",
    optionActive: "bg-orange-400 text-white border-orange-400",
    submit: "bg-orange-400 text-white shadow-orange-200",
    helper: "text-orange-400",
  },
  minimal: {
    overlay: "bg-black/50",
    sheet: "bg-white border-t border-gray-200",
    title: "text-gray-950",
    label: "text-gray-700",
    input:
      "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-100",
    option: "bg-white text-gray-700 border-gray-200",
    optionActive: "bg-gray-950 text-white border-gray-950",
    submit: "bg-gray-950 text-white shadow-gray-200",
    helper: "text-gray-500",
  },
  night: {
    overlay: "bg-black/70",
    sheet: "bg-slate-900 border-t border-slate-700",
    title: "text-slate-50",
    label: "text-slate-300",
    input:
      "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-violet-400 focus:ring-violet-900",
    option: "bg-slate-800 text-slate-300 border-slate-700",
    optionActive: "bg-violet-600 text-white border-violet-500",
    submit: "bg-violet-600 text-white shadow-violet-950/40",
    helper: "text-slate-400",
  },
};

const moods = [
  ["平稳", MoonStar],
  ["疲惫", BedDouble],
  ["烦躁", Flame],
  ["敏感", HeartPulse],
] as const;

const stressOptions = ["轻松", "一般", "中等", "偏高", "很大"] as const;

const calculateSleepDuration = (sleepAt: string, wakeAt: string) => {
  if (!sleepAt || !wakeAt) return "";

  const [sleepHour, sleepMinute] = sleepAt.split(":").map(Number);
  const [wakeHour, wakeMinute] = wakeAt.split(":").map(Number);

  let sleepMinutes = sleepHour * 60 + sleepMinute;
  let wakeMinutes = wakeHour * 60 + wakeMinute;

  if (wakeMinutes <= sleepMinutes) {
    wakeMinutes += 24 * 60;
  }

  const duration = wakeMinutes - sleepMinutes;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
};

export default function CycleRecordSheet({
  isOpen,
  onClose,
  selectedDay,
  onSave,
}: CycleRecordSheetProps) {
  const { theme } = useTheme();
  const styles = sheetStyles[theme];
  const preset = selectedDay.sheetPreset;
  const [selectedMood, setSelectedMood] = useState(preset.mood);
  const [selectedFlow, setSelectedFlow] = useState(preset.flow);
  const [note, setNote] = useState(preset.note);
  const [sleepAt, setSleepAt] = useState("");
  const [wakeAt, setWakeAt] = useState("");
  const [stress, setStress] = useState("一般");
  const [symptomsText, setSymptomsText] = useState("");
  const [isPeriodRecord, setIsPeriodRecord] = useState(selectedDay.tag === "period");

  const isPeriodDay = isPeriodRecord;
  const isLogDay = selectedDay.tag === "log" || (!selectedDay.tag && selectedDay.hasRecord);
  const calculatedSleep = useMemo(
    () => calculateSleepDuration(sleepAt, wakeAt),
    [sleepAt, wakeAt]
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedMood(preset.mood);
      setSelectedFlow(preset.flow);
      setNote(preset.note);
      setSleepAt(selectedDay.detail.metrics.find((item) => item.label === "入睡")?.value ?? "");
      setWakeAt(selectedDay.detail.metrics.find((item) => item.label === "起床")?.value ?? "");
      setStress(selectedDay.detail.metrics.find((item) => item.label === "压力")?.value ?? "一般");
      setSymptomsText(selectedDay.detail.symptoms.filter((item) => item !== "未记录").join("、"));
      setIsPeriodRecord(selectedDay.tag === "period");
    }
  }, [isOpen, preset, selectedDay]);

  const handleSave = () => {
    onSave({
      mood: selectedMood,
      flow: selectedFlow,
      note,
      sleepAt,
      wakeAt,
      stress,
      symptomsText,
      isPeriodRecord,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={cn("fixed inset-0 z-100", styles.overlay)}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 210 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-101 mx-auto h-[78vh] max-w-[480px] overflow-y-auto rounded-t-4xl p-6 pb-safe",
              styles.sheet
            )}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className={cn("text-sm", styles.helper)}>静态记录面板</p>
                <h3 className={cn("mt-1 text-xl font-bold", styles.title)}>
                  编辑 {selectedDay.label}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400"
                type="button"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className={cn("mb-3 text-sm font-medium", styles.label)}>
                  今天有没有来姨妈
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPeriodRecord(false)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                      !isPeriodRecord ? styles.optionActive : styles.option
                    )}
                  >
                    没有
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPeriodRecord(true)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                      isPeriodRecord ? styles.optionActive : styles.option
                    )}
                  >
                    来了
                  </button>
                </div>
                <p className={cn("mt-2 text-xs leading-5", styles.helper)}>
                  如果这一天实际来姨妈了，就按真实情况记录；这样可以覆盖预测提前或推迟的情况。
                </p>
              </div>

              <div>
                <p className={cn("mb-3 text-sm font-medium", styles.label)}>
                  今天的状态
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {moods.map(([label, Icon]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedMood(label)}
                      className={cn(
                        "flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                        selectedMood === label
                          ? styles.optionActive
                          : styles.option
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {isPeriodDay && (
                <div>
                  <p className={cn("mb-3 text-sm font-medium", styles.label)}>
                    流量感受
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {["轻", "中等", "偏多"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedFlow(item)}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                          selectedFlow === item
                            ? styles.optionActive
                            : styles.option
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <TimePicker
                  label="几点睡的"
                  value={sleepAt}
                  onChange={setSleepAt}
                  styles={styles}
                />
                <TimePicker
                  label="几点起的"
                  value={wakeAt}
                  onChange={setWakeAt}
                  styles={styles}
                />
              </div>

              <div className={cn("rounded-2xl border p-4", styles.soft)}>
                <p className={cn("text-xs", styles.sub)}>自动计算睡眠时长</p>
                <p className="mt-2 text-base font-semibold">
                  {calculatedSleep || "请选择入睡和起床时间"}
                </p>
              </div>

              <div>
                <p className={cn("mb-3 text-sm font-medium", styles.label)}>
                  压力
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {stressOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStress(item)}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                        stress === item
                          ? styles.optionActive
                          : styles.option
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={cn("mb-3 block text-sm font-medium", styles.label)}>
                  {isPeriodDay ? "症状感受" : "身体感受"}
                </label>
                <textarea
                  value={symptomsText}
                  onChange={(e) => setSymptomsText(e.target.value)}
                  rows={3}
                  placeholder={isPeriodDay ? "比如：腹痛、腰酸、疲惫……" : "比如：轻微腹胀、腰酸、食欲波动、犯困……"}
                  className={cn(
                    "w-full rounded-3xl border px-4 py-3 outline-none transition-all focus:ring-2 resize-none",
                    styles.input
                  )}
                />
              </div>

              <div>
                <label className={cn("mb-3 block text-sm font-medium", styles.label)}>
                  备注
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={5}
                  placeholder="比如：今天有点腰酸、下午犯困、想吃甜的……"
                  className={cn(
                    "w-full rounded-3xl border px-4 py-3 outline-none transition-all focus:ring-2 resize-none",
                    styles.input
                  )}
                />
                <p className={cn("mt-2 text-xs", styles.helper)}>
                  {isPeriodDay
                    ? "经期日期可以同时编辑流量、睡眠、压力和症状。"
                    : isLogDay
                      ? "普通记录可以编辑睡眠、压力和身体感受。"
                      : "这里只做静态交互演示，暂时不会真实保存。"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-sm font-medium",
                    styles.option
                  )}
                >
                  先不记了
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-semibold",
                    styles.submit
                  )}
                >
                  保存这次记录
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
