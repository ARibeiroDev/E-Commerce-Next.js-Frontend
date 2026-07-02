"use client";

import { useState, useEffect } from "react";
import { Category } from "@/lib/api/categories";

type FiltersBarProps = {
  search: string;
  selectedCategory: string; // For state
  categories: Category[]; // For dropdown list
  sortBy: "createdAt" | "basePrice" | "title";
  orderBy: "asc" | "desc";
  handleFilterChange: (
    key: string,
    value: string | number | { sortBy: string; orderBy: string },
  ) => void;
};

const FiltersBar = ({
  search,
  selectedCategory,
  categories,
  sortBy,
  orderBy,
  handleFilterChange,
}: FiltersBarProps) => {
  const [searchInput, setSearchInput] = useState(search);

  // Keeps input synced with URL-driven state
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== search) {
        handleFilterChange("title", searchInput);
      }
    }, 300); // 0.3 seconds
    return () => clearTimeout(timeout);
  }, [searchInput, handleFilterChange, search]);

  return (
    <search>
      <form
        className="flex flex-col lg:flex-row gap-4 mb-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex-1 flex flex-col">
          <label htmlFor="search" className="sr-only">
            Search Products
          </label>
          <input
            id="search"
            type="text"
            placeholder="e.g. jeans"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="category" className="sr-only">
            Filter by Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => handleFilterChange("categoryId", e.target.value)}
            className="border rounded px-3 py-2 dark:bg-stone-700"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="sort" className="sr-only">
            Sort Products
          </label>
          <select
            id="sort"
            value={`${sortBy}-${orderBy}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              handleFilterChange("sort", { sortBy: field, orderBy: order });
            }}
            className="border rounded px-3 py-2 dark:bg-stone-700"
          >
            <option value="basePrice-asc">Price: Low to High</option>
            <option value="basePrice-desc">Price: High to Low</option>
            <option value="title-asc">Name: A-Z</option>
            <option value="title-desc">Name: Z-A</option>
            <option value="createdAt-asc">Date: Oldest</option>
            <option value="createdAt-desc">Date: Newest</option>
          </select>
        </div>
      </form>
    </search>
  );
};

export default FiltersBar;
