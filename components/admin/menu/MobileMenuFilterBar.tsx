import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useCategories } from "@/apis/category";

const sortOptions = [
  { label: "最新", value: "newest" },
  { label: "热度", value: "popular" },
  { label: "价格", value: "price" },
];

export default function MobileMenuFilterBar({
  activeCategory,
  onSearch,
  onCategoryChange,
  onSortChange,
}: {
  activeCategory?: string;
  onSearch?: (term: string) => void;
  onCategoryChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSort, setActiveSort] = useState("newest");

  const { data: categories = [] } = useCategories();

  const categoryOptions = [
    { label: "全部", value: "all" },
    ...categories.map((cat) => ({ label: cat.name, value: cat.id })),
  ];

  const currentCategory = activeCategory || "all";

  return (
    <div className="md:hidden flex flex-col gap-3 mb-4 mt-2">
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch?.(searchTerm);
            }
          }}
          placeholder="搜索菜品名称..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm shadow-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categoryOptions.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              console.log(
                "MobileMenuFilterBar - category clicked:",
                cat.value,
                cat.label
              );
              onCategoryChange?.(cat.value);
            }}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentCategory === cat.value
                ? "bg-pink-500 text-white shadow-sm"
                : "bg-white text-gray-600 border border-pink-50 hover:bg-pink-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1 items-center">
        <div className="flex items-center text-xs text-gray-500 mr-1 whitespace-nowrap">
          <SlidersHorizontal size={14} className="mr-1" /> 排序
        </div>
        {sortOptions.map((sort) => (
          <button
            key={sort.value}
            onClick={() => {
              setActiveSort(sort.value);
              onSortChange?.(sort.value);
            }}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs transition-colors ${
              activeSort === sort.value
                ? "bg-pink-100 text-pink-700 font-medium"
                : "bg-gray-50 text-gray-500 border border-gray-100"
            }`}
          >
            {sort.label}
          </button>
        ))}
      </div>
    </div>
  );
}
