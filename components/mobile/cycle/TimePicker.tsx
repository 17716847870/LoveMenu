import { cn } from "@/lib/utils";

interface TimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  styles: Record<string, string>;
}

const hours = Array.from({ length: 24 }, (_, index) => index);
const minutes = Array.from({ length: 60 }, (_, index) => index);

const pad = (value: number) => String(value).padStart(2, "0");

export default function TimePicker({
  label,
  value,
  onChange,
  styles,
}: TimePickerProps) {
  const [hourValue = "", minuteValue = ""] = value.split(":");

  const handleHourChange = (nextHour: string) => {
    if (nextHour === "") {
      onChange("");
      return;
    }

    onChange(`${nextHour}:${minuteValue || "00"}`);
  };

  const handleMinuteChange = (nextMinute: string) => {
    if (hourValue === "") {
      return;
    }

    onChange(`${hourValue}:${nextMinute || "00"}`);
  };

  return (
    <div>
      <label className={cn("mb-3 block text-sm font-medium", styles.label)}>
        {label}
      </label>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <select
          value={hourValue}
          onChange={(e) => handleHourChange(e.target.value)}
          className={cn(
            "w-full rounded-2xl border px-4 py-3 outline-none transition-all focus:ring-2",
            styles.input
          )}
        >
          <option value="">小时</option>
          {hours.map((hour) => (
            <option key={hour} value={pad(hour)}>
              {pad(hour)}
            </option>
          ))}
        </select>

        <span className={cn("text-sm font-medium", styles.sub ?? styles.label)}>
          :
        </span>

        <select
          value={minuteValue}
          onChange={(e) => handleMinuteChange(e.target.value)}
          disabled={hourValue === ""}
          className={cn(
            "w-full rounded-2xl border px-4 py-3 outline-none transition-all focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
            styles.input
          )}
        >
          <option value="">分钟</option>
          {minutes.map((minute) => (
            <option key={minute} value={pad(minute)}>
              {pad(minute)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
