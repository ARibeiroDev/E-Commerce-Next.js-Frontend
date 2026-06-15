"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const STATUSES = [
  "ALL",
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "REFUND_REQUESTED",
  "CANCELLED",
  "REFUNDED",
];

interface OrdersFilterBarProps {
  activeStatus: string;
  searchQuery: string;
  onParamChange: (key: string, value: string) => void;
}

export default function OrdersFilterBar({
  activeStatus,
  searchQuery,
  onParamChange,
}: OrdersFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync local input with URL if URL changes externally
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onParamChange("search", localSearch);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [localSearch, searchQuery, onParamChange]);

  return (
    <nav className="flex flex-col md:flex-row gap-4 items-center justify-between  dark:bg-stone-800 p-2 rounded-xl border border-gray-200 dark:border-stone-700">
      <div className="flex flex-wrap gap-1 w-full md:w-auto">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => onParamChange("status", status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeStatus === status
                ? "bg-white dark:bg-stone-900 shadow-sm"
                : "hover:text-stone-500 dark:hover:text-gray-400"
            }`}
          >
            {status.includes("_") ? status.replace("_", " ") : status}
          </button>
        ))}
      </div>

      <div className="relative w-full md:w-130">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 " />
        <input
          type="text"
          placeholder="Search by ID, Name or Phone..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg outline-none focus:ring-2 focus:ring-stone-500 transition-shadow"
        />
      </div>
    </nav>
  );
}
