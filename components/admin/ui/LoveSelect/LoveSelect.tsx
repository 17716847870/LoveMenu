import React, { useState, useRef, useEffect, useMemo } from 'react';

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
  multiple = false,
  searchable = false,
  placeholder = '请选择',
  onChange,
  className = '',
  allowClear = false,
  disabled = false,
}: LoveSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 过滤选项
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchable, searchValue]);

  // 获取显示的标签
  const displayValue = useMemo(() => {
    if (multiple) {
      if (!Array.isArray(value) || value.length === 0) return null;
      return value.map((v) => options.find((o) => o.value === v)).filter(Boolean) as Option[];
    } else {
      if (!value) return null;
      return options.find((o) => o.value === value) || null;
    }
  }, [value, multiple, options]);

  // 处理选项点击
  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  // 处理删除标签
  const handleRemoveTag = (e: React.MouseEvent, tagValue: string) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      onChange?.(value.filter((v) => v !== tagValue));
    } else {
      onChange?.('');
    }
  };

  // 处理清空
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : '');
  };

  const isSelected = (optionValue: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className={`relative w-full ${className} ${disabled ? 'cursor-not-allowed' : ''}`} ref={containerRef}>
      {/* 触发器 / 输入框 */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          min-h-10 px-3 py-1.5 border rounded-xl flex items-center justify-between
          transition-all duration-200
          ${disabled ? 'bg-[#fff5f8] border-[#fce7f3]' : 'bg-white cursor-pointer'}
          ${isOpen && !disabled
            ? 'border-pink-300 ring-2 ring-pink-500/20' 
            : !disabled ? 'border-[#f3d6e4] hover:border-[#ff6fa5]' : ''}
        `}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {multiple && Array.isArray(displayValue) && displayValue.length > 0 ? (
            (displayValue as Option[]).map((option) => (
              <span
                key={option.value}
                className="bg-[#ffe3ef] text-[#ff4d8d] rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1 group transition-colors hover:text-[#ff2d7a]"
              >
                {option.label}
                <span
                  onClick={(e) => !disabled && handleRemoveTag(e, option.value)}
                  className={`rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px] leading-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-pink-200'}`}
                >
                  ×
                </span>
              </span>
            ))
          ) : !multiple && displayValue ? (
            <span className={`text-sm ml-1 truncate ${disabled ? 'text-[#cfa4b4]' : 'text-gray-700'}`}>
              {(displayValue as Option).label}
            </span>
          ) : (
            <span className="text-gray-400 text-sm ml-1">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2 shrink-0">
          {((multiple && Array.isArray(value) && value.length > 0) || (!multiple && value)) && allowClear && !disabled && (
            <span
              onClick={handleClear}
              className="text-gray-300 hover:text-pink-500 cursor-pointer p-1 rounded-full hover:bg-pink-50 transition-all"
              title="清空"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </span>
          )}
          <span className={`transition-transform duration-200 flex items-center justify-center ${disabled ? 'text-[#e5c5d1]' : 'text-gray-400'} ${isOpen ? 'rotate-180 text-pink-500' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </span>
        </div>
      </div>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.08)] overflow-hidden border border-pink-50 animate-in fade-in zoom-in-95 duration-100">
          {searchable && (
            <div className="p-2 border-b border-pink-50">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="搜索..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:border-pink-200 focus:bg-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          
          <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-pink-100 scrollbar-track-transparent">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const selected = isSelected(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`
                      px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between
                      ${selected 
                        ? 'bg-[#ffe3ef] text-[#ff4d8d] font-medium' 
                        : 'text-gray-700 hover:bg-[#fff0f6]'}
                    `}
                  >
                    <span>{option.label}</span>
                    {selected && (
                      <span className="text-[#ff4d8d]">✓</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                无匹配选项
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
