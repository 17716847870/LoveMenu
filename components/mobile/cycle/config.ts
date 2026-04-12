import { ThemeName } from "@/types";

export type CycleTag = "" | "period" | "fertile" | "ovulation" | "predicted" | "log";

export interface CycleMetricItem { label: string; value: string }
export interface CycleRecordDetail {
  title: string;
  subtitle: string;
  summary: string;
  metrics: CycleMetricItem[];
  symptoms: string[];
  primaryAction: string;
  secondaryAction: string;
}
export interface CycleSheetPreset { mood: string; flow: string; note: string }
export interface CycleRecordFormValue {
  mood: string;
  flow: string;
  note: string;
  sleepAt: string;
  wakeAt: string;
  stress: string;
  symptomsText: string;
  isPeriodRecord: boolean;
}
export interface CycleDayItem {
  fullDate: string;
  label: string;
  day: number;
  current: boolean;
  tag: CycleTag;
  isToday?: boolean;
  hasRecord: boolean;
  detail: CycleRecordDetail;
  sheetPreset: CycleSheetPreset;
}
export interface CycleCalendarMonth {
  key: string;
  label: string;
  days: CycleDayItem[];
}
export interface CycleOverviewData {
  title: string;
  subtitle: string;
  cards: { label: string; value: string; note: string }[];
}

export const cycleWeekdays = ["一", "二", "三", "四", "五", "六", "日"];
export const cycleOverview: CycleOverviewData = {
  title: "本周期记录",
  subtitle: "页面已按真实记录结构组织，接接口时只替换数据即可。",
  cards: [
    { label: "本次周期", value: "29 天", note: "近三次记录推算" },
    { label: "预计下次", value: "4 月 27 日 - 5 月 1 日", note: "可能提前或推迟" },
    { label: "经期长度", value: "5 天", note: "最近平均经期" },
    { label: "稳定性", value: "中等波动", note: "对应 medium" },
  ],
};

const pad = (n: number) => String(n).padStart(2, "0");
const fullDate = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
const label = (y: number, m: number, d: number) => `${m} 月 ${d} 日`;
const monthKey = (y: number, m: number) => `${y}-${pad(m)}`;
const weekdayMonday = (date: Date) => (date.getDay() + 6) % 7;

const detail = (
  title: string,
  subtitle: string,
  summary: string,
  metrics: Array<[string, string]>,
  symptoms: string[],
  primaryAction: string,
  secondaryAction: string
): CycleRecordDetail => ({
  title,
  subtitle,
  summary,
  metrics: metrics.map(([label, value]) => ({ label, value })),
  symptoms,
  primaryAction,
  secondaryAction,
});

const normalDetail = (text: string) =>
  detail(
    "普通日期",
    "暂无记录",
    "这一天没有特殊标签，适合直接新增日常记录。",
    [["日期", text], ["周期状态", "普通"], ["记录", "暂无"], ["建议", "可补记录"]],
    ["未记录"],
    "新增今日记录",
    "查看整月走势"
  );

const fertileDetail = (text: string, recorded = false) =>
  detail(
    recorded ? "易孕期记录" : "易孕期",
    recorded ? "已记录" : "窗口提示",
    recorded ? "今天已经补充了观察记录。" : "当前处于易孕期窗口内，更适合做观察记录。",
    [["日期", text], ["窗口开始", "4 月 9 日"], ["窗口结束", "4 月 14 日"], ["记录", recorded ? "已记录" : "暂无"]],
    recorded ? ["轻微腹胀", "体温变化"] : ["窗口内", "待观察"],
    recorded ? "编辑今日记录" : "新增观察记录",
    "查看窗口说明"
  );

const predictedDetail = (text: string, windowLabel = "4 月 27 日 - 5 月 1 日") =>
  detail(
    "预测经期窗口",
    "可能提前或推迟",
    "经期开始日是预测值，可能会提前或延后几天。这里更适合展示预测窗口而不是单一日期。",
    [["日期", text], ["预测窗口", windowLabel], ["中心日", "4 月 29 日"], ["波动", "±2 天"]],
    ["预测中", "提前或推迟都正常"],
    "新增今日记录",
    "查看预测说明"
  );

const periodDetail = (text: string, index: number, recorded: boolean) =>
  detail(
    `经期第 ${index} 天`,
    recorded ? "已记录" : "待补记录",
    recorded ? "这一天已经记录了经量和身体感受。" : "这是经期中的日期，适合展示经量、疼痛和护理信息。",
    [["日期", text], ["流量", recorded ? (index === 1 ? "中等" : "偏少") : "待记录"], ["腹痛", recorded ? (index === 1 ? "轻微" : "几乎没有") : "待记录"], ["记录", recorded ? "已记录" : "暂无"]],
    recorded ? ["腹痛", "疲惫"] : ["经期中", "待记录"],
    recorded ? "编辑今日记录" : "新增今日记录",
    "查看护理建议"
  );

const recordDetail = (text: string) =>
  detail(
    "今日记录",
    "已记录",
    "今天已经有一条日常记录，页面直接展示记录内容。",
    [["日期", text], ["睡眠", "6.5h"], ["压力", "中等"], ["熬夜", "有一点"]],
    ["轻微腹胀", "腰酸", "食欲波动"],
    "编辑今日记录",
    "补充备注"
  );

const ovulationDetail = (text: string) =>
  detail(
    "排卵日",
    "重点日期",
    "这是窗口中心日，适合展示观察数据和状态提示。",
    [["日期", text], ["状态", "排卵日"], ["窗口", "4/9 - 4/14"], ["记录", "已记录"]],
    ["透明分泌物", "轻微腹胀"],
    "编辑今日记录",
    "查看周期说明"
  );

const overrides: Record<string, Partial<CycleDayItem>> = {
  "2026-03-30": { tag: "period", hasRecord: true, detail: periodDetail("3 月 30 日", 2, true), sheetPreset: { mood: "疲惫", flow: "中等", note: "白天有点没精神。" } },
  "2026-03-31": { tag: "period", hasRecord: true, detail: periodDetail("3 月 31 日", 3, true), sheetPreset: { mood: "平稳", flow: "轻", note: "状态比前一天稳定。" } },
  "2026-04-09": { tag: "fertile", detail: fertileDetail("4 月 9 日"), sheetPreset: { mood: "平稳", flow: "轻", note: "进入窗口开始观察。" } },
  "2026-04-10": { tag: "fertile", hasRecord: true, detail: fertileDetail("4 月 10 日", true), sheetPreset: { mood: "平稳", flow: "轻", note: "今天有一点腹胀。" } },
  "2026-04-11": { tag: "fertile", detail: fertileDetail("4 月 11 日"), sheetPreset: { mood: "平稳", flow: "轻", note: "" } },
  "2026-04-12": { tag: "fertile", detail: fertileDetail("4 月 12 日"), sheetPreset: { mood: "平稳", flow: "轻", note: "" } },
  "2026-04-13": { tag: "ovulation", hasRecord: true, detail: ovulationDetail("4 月 13 日"), sheetPreset: { mood: "敏感", flow: "轻", note: "今天感觉身体有些变化。" } },
  "2026-04-14": { tag: "fertile", detail: fertileDetail("4 月 14 日"), sheetPreset: { mood: "平稳", flow: "轻", note: "" } },
  "2026-04-15": { tag: "predicted", detail: predictedDetail("4 月 15 日", "4 月 27 日 - 5 月 1 日"), sheetPreset: { mood: "平稳", flow: "轻", note: "进入预测窗口。" } },
  "2026-04-16": { tag: "predicted", detail: predictedDetail("4 月 16 日", "4 月 27 日 - 5 月 1 日"), sheetPreset: { mood: "平稳", flow: "轻", note: "" } },
  "2026-04-17": { tag: "predicted", detail: predictedDetail("4 月 17 日", "4 月 27 日 - 5 月 1 日"), sheetPreset: { mood: "平稳", flow: "轻", note: "" } },
  "2026-04-18": { tag: "predicted", detail: predictedDetail("4 月 18 日", "4 月 27 日 - 5 月 1 日"), sheetPreset: { mood: "平稳", flow: "轻", note: "" } },
  "2026-04-19": { tag: "predicted", detail: predictedDetail("4 月 19 日", "4 月 27 日 - 5 月 1 日"), sheetPreset: { mood: "平稳", flow: "轻", note: "" } },
  "2026-04-24": { tag: "log", isToday: true, hasRecord: true, detail: recordDetail("4 月 24 日"), sheetPreset: { mood: "疲惫", flow: "轻", note: "下午有点犯困，晚上腰有点酸。" } },
  "2026-04-29": { tag: "period", detail: detail("预计经期中心日", "预测值，可能提前或推迟", "当前预测中心日是 4 月 29 日，但实际开始可能落在 4 月 27 日到 5 月 1 日之间。", [["日期", "4 月 29 日"], ["预测窗口", "4 月 27 日 - 5 月 1 日"], ["中心日", "4 月 29 日"], ["波动", "±2 天"]], ["预测中", "提前或推迟都正常"], "新增今日记录", "查看预测说明"), sheetPreset: { mood: "疲惫", flow: "中等", note: "今天是预测中心日。" } },
  "2026-04-30": { tag: "period", hasRecord: true, detail: periodDetail("4 月 30 日", 1, true), sheetPreset: { mood: "疲惫", flow: "中等", note: "今天开始了，肚子有一点疼。" } },
  "2026-05-01": { tag: "period", detail: periodDetail("5 月 1 日", 2, false), sheetPreset: { mood: "疲惫", flow: "中等", note: "" } },
  "2026-05-02": { tag: "period", detail: periodDetail("5 月 2 日", 3, false), sheetPreset: { mood: "平稳", flow: "轻", note: "" } },
  "2026-05-03": { tag: "period", detail: periodDetail("5 月 3 日", 4, false), sheetPreset: { mood: "平稳", flow: "轻", note: "" } },
};

const buildDay = (y: number, m: number, d: number, current: boolean): CycleDayItem => {
  const fd = fullDate(y, m, d);
  const base: CycleDayItem = {
    fullDate: fd,
    label: label(y, m, d),
    day: d,
    current,
    tag: "",
    hasRecord: false,
    detail: normalDetail(label(y, m, d)),
    sheetPreset: { mood: "平稳", flow: "轻", note: "" },
  };
  return { ...base, ...overrides[fd] };
};

const buildMonth = (y: number, m: number): CycleCalendarMonth => {
  const first = new Date(y, m - 1, 1);
  const daysInMonth = new Date(y, m, 0).getDate();
  const startPad = weekdayMonday(first);
  const cells: CycleDayItem[] = [];
  for (let i = startPad; i > 0; i--) {
    const prev = new Date(y, m - 1, 1 - i);
    cells.push(buildDay(prev.getFullYear(), prev.getMonth() + 1, prev.getDate(), false));
  }
  for (let d = 1; d <= daysInMonth; d++) cells.push(buildDay(y, m, d, true));
  while (cells.length < 35) {
    const nextIndex = cells.length - (startPad + daysInMonth) + 1;
    const next = new Date(y, m - 1, daysInMonth + nextIndex);
    cells.push(buildDay(next.getFullYear(), next.getMonth() + 1, next.getDate(), false));
  }
  return { key: monthKey(y, m), label: `${y} 年 ${m} 月`, days: cells };
};

export const cycleCalendarMonths: CycleCalendarMonth[] = [
  buildMonth(2025, 12),
  buildMonth(2026, 1),
  buildMonth(2026, 2),
  buildMonth(2026, 3),
  buildMonth(2026, 4),
  buildMonth(2026, 5),
  buildMonth(2026, 6),
];

export const cycleStyles: Record<ThemeName, Record<string, string>> = {
  couple: { page: "bg-pink-50", card: "bg-white border-pink-100 text-rose-900", soft: "bg-pink-50 border-pink-100", title: "text-rose-950", sub: "text-rose-500", btn: "bg-rose-500 text-white", mute: "text-pink-200", period: "bg-rose-500 text-white", fertile: "bg-pink-100 text-pink-700", ovulation: "bg-fuchsia-500 text-white", predicted: "bg-amber-100 text-amber-700", log: "bg-sky-100 text-sky-700", ring: "ring-2 ring-rose-300", activeDate: "ring-2 ring-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,0.12)] z-10", entry: "bg-white border-pink-100 shadow-sm hover:shadow-md", entryText: "text-rose-900", entrySub: "text-rose-500", entryIcon: "bg-pink-100 text-pink-600", entryAction: "text-pink-500" },
  cute: { page: "bg-[#fff8fb]", card: "bg-[#fffdf9] border-orange-100 text-orange-900", soft: "bg-orange-50 border-orange-100", title: "text-orange-950", sub: "text-orange-500", btn: "bg-orange-400 text-white", mute: "text-orange-200", period: "bg-orange-400 text-white", fertile: "bg-yellow-100 text-yellow-700", ovulation: "bg-violet-500 text-white", predicted: "bg-pink-100 text-pink-700", log: "bg-cyan-100 text-cyan-700", ring: "ring-2 ring-orange-300", activeDate: "ring-2 ring-orange-500 shadow-[0_0_0_4px_rgba(251,146,60,0.15)] z-10", entry: "bg-white border-2 border-orange-100 shadow-[4px_4px_0px_0px_rgba(255,237,213,1)]", entryText: "text-orange-900", entrySub: "text-orange-500", entryIcon: "bg-orange-100 text-orange-600", entryAction: "text-orange-500" },
  minimal: { page: "bg-gray-50", card: "bg-white border-gray-200 text-gray-800", soft: "bg-gray-50 border-gray-200", title: "text-gray-950", sub: "text-gray-500", btn: "bg-gray-950 text-white", mute: "text-gray-300", period: "bg-gray-950 text-white", fertile: "bg-gray-100 text-gray-700", ovulation: "bg-gray-700 text-white", predicted: "bg-stone-100 text-stone-700", log: "bg-slate-100 text-slate-700", ring: "ring-2 ring-gray-400", activeDate: "ring-2 ring-gray-900 shadow-[0_0_0_4px_rgba(17,24,39,0.08)] z-10", entry: "bg-white border border-gray-200", entryText: "text-gray-900", entrySub: "text-gray-500", entryIcon: "bg-gray-100 text-gray-700", entryAction: "text-gray-700" },
  night: { page: "bg-slate-950", card: "bg-slate-900 border-slate-700 text-slate-100", soft: "bg-slate-800 border-slate-700", title: "text-slate-50", sub: "text-slate-400", btn: "bg-violet-600 text-white", mute: "text-slate-700", period: "bg-rose-500 text-white", fertile: "bg-sky-500/15 text-sky-300 border border-sky-500/30", ovulation: "bg-violet-500 text-white", predicted: "bg-amber-500/15 text-amber-300 border border-amber-500/30", log: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30", ring: "ring-2 ring-violet-400", activeDate: "ring-2 ring-violet-400 shadow-[0_0_0_4px_rgba(139,92,246,0.14)] z-10", entry: "bg-slate-900 border border-slate-700 shadow-lg", entryText: "text-slate-100", entrySub: "text-slate-400", entryIcon: "bg-slate-800 text-violet-300", entryAction: "text-violet-300" },
};
