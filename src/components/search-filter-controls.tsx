"use client";

import Sort, { SortOption } from "@/components/sort";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { motion } from "framer-motion";
import type React from "react";
import { useCallback } from "react";

interface SearchFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryOptions: { label: string; value: string }[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export function SearchFilterControls({
  searchQuery,
  setSearchQuery,
  categoryOptions,
  selectedCategories,
  setSelectedCategories,
  sortOption,
  onSortChange,
}: SearchFilterControlsProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery],
  );

  return (
    <motion.div
      className="w-full"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delay: 0.2,
          },
        },
      }}
    >
      {/* Mobile Layout */}
      <div className="flex w-full flex-col gap-4 sm:hidden">
        <Input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full"
        />
        <div className="flex w-full flex-col gap-4">
          <MultiSelect
            options={categoryOptions}
            value={selectedCategories}
            onValueChange={setSelectedCategories}
            placeholder="Filter by category"
            className="w-full"
          />
          <Sort sortOption={sortOption} onSortChange={onSortChange} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-3">
        <div className="w-[280px]">
          <Input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <MultiSelect
            options={categoryOptions}
            value={selectedCategories}
            onValueChange={setSelectedCategories}
            placeholder="Filter by category"
            className="w-[180px]"
          />
          <Sort sortOption={sortOption} onSortChange={onSortChange} />
        </div>
      </div>
    </motion.div>
  );
}
