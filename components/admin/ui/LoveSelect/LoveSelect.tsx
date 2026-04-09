"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

export type Option = {
  label: string;
  value: string;
};

export type LoveSelectProps = {
  options: Option[];
  value?: string | string[];
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  onChange?: (value: string | string[]) => void;
  className?: string;
  allowClear?: boolean;
  disabled?: boolean;
};

export default function LoveSelect({
  options,
  value,
  placeholder = "请选择",
  onChange,
  className = "",
  disabled = false,
}: LoveSelectProps) {
  const handleValueChange = (newValue: string) => {
    onChange?.(newValue);
  };

  const validOptions = options.filter((opt) => opt.value !== "");
  const stringValue = typeof value === "string" ? value : undefined;
  const selectedOption = validOptions.find((opt) => opt.value === stringValue);
  const displayValue = validOptions.some((opt) => opt.value === stringValue)
    ? stringValue
    : undefined;

  return (
    <Select
      value={displayValue}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder={placeholder}>
          {selectedOption?.label || placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {validOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
