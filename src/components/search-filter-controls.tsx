"use client";

import Sort, { SortOption } from "@/components/sort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import type React from "react";
import { useCallback, useMemo } from "react";

interface SearchFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryOptions: { label: string; value: string }[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  className?: string;
  isLoading?: boolean;
}

export function SearchFilterControls({
  searchQuery,
  setSearchQuery,
  categoryOptions,
  selectedCategories,
  setSelectedCategories,
  sortOption,
  onSortChange,
  className,
  isLoading = false,
}: SearchFilterControlsProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery],
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, [setSearchQuery]);

  const handleClearCategories = useCallback(() => {
    setSelectedCategories([]);
  }, [setSelectedCategories]);

  const hasFilters = useMemo(() => {
    return searchQuery.trim() !== "" || selectedCategories.length > 0;
  }, [searchQuery, selectedCategories]);

  return (
    <motion.div
      className={cn("w-full", className)}
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
        <div className="relative">
          <Input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pr-8"
            disabled={isLoading}
          />
          {searchQuery.trim() !== "" && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleClearSearch}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex w-full flex-col gap-4">
          <MultiSelect
            options={categoryOptions}
            value={selectedCategories}
            onValueChange={setSelectedCategories}
            placeholder="Filter by category"
            className="w-full"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between gap-2">
            <Sort
              sortOption={sortOption}
              onSortChange={onSortChange}
              disabled={isLoading}
            />
            {isLoading && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading...</span>
              </div>
            )}
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleClearSearch();
                handleClearCategories();
              }}
              className="ml-auto mt-1 text-xs"
              disabled={isLoading}
            >
              Clear all filters
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-3">
        <div className="w-[280px] relative">
          <Input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pr-8"
            disabled={isLoading}
          />
          {searchQuery.trim() !== "" && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleClearSearch}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <MultiSelect
            options={categoryOptions}
            value={selectedCategories}
            onValueChange={setSelectedCategories}
            placeholder="Filter by category"
            className="w-[180px]"
            disabled={isLoading}
          />
          <Sort
            sortOption={sortOption}
            onSortChange={onSortChange}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Loading...</span>
            </div>
          )}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleClearSearch();
                handleClearCategories();
              }}
              className="text-xs"
              disabled={isLoading}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
