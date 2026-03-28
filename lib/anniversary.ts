import { Lunar } from 'lunar-javascript';

export type RepeatType = 'once' | 'weekly' | 'monthly' | 'quarterly' | 'halfyear' | 'yearly';
export type CalendarType = 'solar' | 'lunar';

interface AnniversaryConfig {
  calendarType: CalendarType;
  month: number;       // 国历月 or 农历月
  day: number;         // 国历日 or 农历日
  weekday?: number | null; // 0=周日 1=周一 ... 6=周六，仅 weekly 使用
  repeatType: RepeatType;
  advanceDays: number; // 提前几天提醒
}

/**
 * 将农历年月日转换为公历 Date（北京时间 10:00）
 */
function lunarToSolar(year: number, month: number, day: number): Date {
  const lunar = Lunar.fromYmd(year, month, day);
  const solar = lunar.getSolar();
  // 北京时间 10:00 = UTC 02:00
  return new Date(Date.UTC(solar.getYear(), solar.getMonth() - 1, solar.getDay(), 2, 0, 0));
}

/**
 * 构造北京时间 10:00 的 UTC Date
 */
function bjTime10(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 2, 0, 0));
}

/**
 * 获取某月的最后一天
 */
function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 计算从 baseDate 起，下一次触发的公历日期（考虑 advanceDays 提前量）
 * 返回的是「发送提醒邮件」的时间，即 触发日期 - advanceDays
 */
export function calcNextRemindAt(config: AnniversaryConfig, baseDate: Date = new Date()): Date | null {
  const now = baseDate;
  const nowYear = now.getUTCFullYear();
  const nowMonth = now.getUTCMonth() + 1;
  const nowDay = now.getUTCDate();

  const { calendarType, month, day, weekday, repeatType, advanceDays } = config;

  // 候选触发日期（公历），先算出「事件日期」，再减去 advanceDays
  const candidates: Date[] = [];

  if (repeatType === 'weekly') {
    // 每周：找从今天起，下一个符合 weekday 的日期
    const targetWeekday = weekday ?? 1; // 默认周一
    const todayWeekday = now.getUTCDay(); // 0=周日
    let daysAhead = (targetWeekday - todayWeekday + 7) % 7;
    if (daysAhead === 0) daysAhead = 7; // 今天就是目标星期，取下周
    const eventDate = new Date(Date.UTC(nowYear, nowMonth - 1, nowDay + daysAhead, 2, 0, 0));
    // weekly 不需要提前，直接就是提醒日
    candidates.push(eventDate);
  } else if (repeatType === 'once' || repeatType === 'yearly') {
    // 单次/每年：遍历今年和明年
    for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
      const year = nowYear + yearOffset;
      let eventDate: Date;
      if (calendarType === 'lunar') {
        eventDate = lunarToSolar(year, month, day);
      } else {
        const actualDay = Math.min(day, lastDayOfMonth(year, month));
        eventDate = bjTime10(year, month, actualDay);
      }
      // 提前 advanceDays 天发提醒
      const remindDate = new Date(eventDate.getTime() - advanceDays * 86400000);
      if (remindDate.getTime() > now.getTime()) {
        candidates.push(remindDate);
        break;
      }
    }
  } else if (repeatType === 'monthly') {
    // 每月：遍历本月、下月、下下月
    for (let offset = 0; offset <= 2; offset++) {
      let year = nowYear;
      let mon = nowMonth + offset;
      if (mon > 12) { mon -= 12; year += 1; }
      const actualDay = Math.min(day, lastDayOfMonth(year, mon));
      const eventDate = bjTime10(year, mon, actualDay);
      const remindDate = new Date(eventDate.getTime() - advanceDays * 86400000);
      if (remindDate.getTime() > now.getTime()) {
        candidates.push(remindDate);
        break;
      }
    }
  } else if (repeatType === 'quarterly') {
    // 每季度：未来 4 个季度
    for (let offset = 0; offset <= 4; offset++) {
      let year = nowYear;
      let mon = month + offset * 3;
      while (mon > 12) { mon -= 12; year += 1; }
      const actualDay = Math.min(day, lastDayOfMonth(year, mon));
      const eventDate = calendarType === 'lunar'
        ? lunarToSolar(year, mon, day)
        : bjTime10(year, mon, actualDay);
      const remindDate = new Date(eventDate.getTime() - advanceDays * 86400000);
      if (remindDate.getTime() > now.getTime()) {
        candidates.push(remindDate);
        break;
      }
    }
  } else if (repeatType === 'halfyear') {
    // 每半年：未来 4 个半年
    for (let offset = 0; offset <= 4; offset++) {
      let year = nowYear;
      let mon = month + offset * 6;
      while (mon > 12) { mon -= 12; year += 1; }
      const actualDay = Math.min(day, lastDayOfMonth(year, mon));
      const eventDate = calendarType === 'lunar'
        ? lunarToSolar(year, mon, day)
        : bjTime10(year, mon, actualDay);
      const remindDate = new Date(eventDate.getTime() - advanceDays * 86400000);
      if (remindDate.getTime() > now.getTime()) {
        candidates.push(remindDate);
        break;
      }
    }
  }

  return candidates[0] ?? null;
}

/**
 * 渲染邮件内容中的模板变量
 * 支持：{title} {date} {days} {content}
 */
export function renderEmailContent(
  template: string,
  vars: { title: string; date: string; days?: number; content?: string }
): string {
  return template
    .replace(/\{title\}/g, vars.title)
    .replace(/\{date\}/g, vars.date)
    .replace(/\{days\}/g, String(vars.days ?? ''))
    .replace(/\{content\}/g, vars.content ?? '');
}
