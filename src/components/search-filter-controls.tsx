"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  X,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Check,
  RefreshCw,
  BookmarkPlus,
  Star,
  Clock,
  History,
  Tag,
  Plus,
} from "lucide-react";
import { useDebounceCallback } from "@/hooks/use-debounce";
import { useMediaQuery } from "@/hooks/use-media-query";
import type React from "react";

import Sort, { SortOption } from "@/components/sort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onSaveSearch?: (name: string) => void;
  recentSearches?: { name: string; query: string; categories: string[] }[];
  onSelectRecentSearch?: (search: {
    query: string;
    categories: string[];
  }) => void;
  advancedFilters?: {
    name: string;
    options: { label: string; value: string }[];
    value: string[];
    onChange: (value: string[]) => void;
    icon?: React.ReactNode;
    description?: string;
  }[];
  suggestedFilters?: {
    name: string;
    value: string[];
    onApply: () => void;
    icon?: React.ReactNode;
  }[];
  recentlyUsed?: {
    name: string;
    type: string;
    value: string;
    onSelect: () => void;
  }[];
  onResetFilters?: () => void;
}

export function SearchFilterControls(props: SearchFilterControlsProps) {
  const {
    searchQuery = "",
  setSearchQuery,
    categoryOptions = [],
    selectedCategories = [],
  setSelectedCategories,
  sortOption,
  onSortChange,
    className,
    isLoading = false,
    onSaveSearch,
    recentSearches = [],
    onSelectRecentSearch,
    advancedFilters = [],
    suggestedFilters = [],
    recentlyUsed = [],
    onResetFilters,
  } = props;
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<string>("filters");
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(props.searchQuery);
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  // Use debounced search to avoid excessive re-renders
  const debouncedSearchChange = useDebounceCallback((value: string) => {
    setSearchQuery(value);
  }, 300);

  useEffect(() => {
    setLocalSearchQuery(props.searchQuery);
  }, [props.searchQuery]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalSearchQuery(value);
      debouncedSearchChange(value);
    },
    [debouncedSearchChange],
  );

  const handleClearSearch = useCallback(() => {
    setLocalSearchQuery("");
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [setSearchQuery]);

  const handleClearCategories = useCallback(() => {
    setSelectedCategories([]);
  }, [setSelectedCategories]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Clear search on Escape
      if (e.key === "Escape" && localSearchQuery) {
        e.preventDefault();
        handleClearSearch();
      }
      // Focus search on Ctrl+K or /
      if (
        (e.ctrlKey && e.key === "k") ||
        (!e.ctrlKey && !e.metaKey && e.key === "/")
      ) {
        if (document.activeElement !== searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    },
    [handleClearSearch, localSearchQuery],
  );

  // Add keyboard listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown as any);
    return () => document.removeEventListener("keydown", handleKeyDown as any);
  }, [handleKeyDown]);

  const hasFilters = useMemo(() => {
    const hasAdvancedFilters =
      Array.isArray(advancedFilters) &&
      advancedFilters.some((filter) => filter?.value?.length > 0);
    return (
      (searchQuery || "").trim() !== "" ||
      (selectedCategories || []).length > 0 ||
      hasAdvancedFilters
    );
  }, [searchQuery, selectedCategories, advancedFilters]);

  const totalFilterCount = useMemo(() => {
    let count = 0;
    if ((searchQuery || "").trim() !== "") count++;
    count += (selectedCategories || []).length;
    if (Array.isArray(advancedFilters)) {
      advancedFilters.forEach((filter) => {
        count += filter?.value?.length || 0;
      });
    }
    return count;
  }, [searchQuery, selectedCategories, advancedFilters]);

  const handleSaveSearch = useCallback(() => {
    if (props.onSaveSearch && searchName.trim()) {
      props.onSaveSearch(searchName);
      setSearchName("");
      setIsSaveDialogOpen(false);
    }
  }, [props.onSaveSearch, searchName]);

  const handleReset = useCallback(() => {
    handleClearSearch();
    handleClearCategories();
    if (props.onResetFilters) props.onResetFilters();
  }, [handleClearSearch, handleClearCategories, props.onResetFilters]);

  return (
    <motion.div
      className={cn("w-full", props.className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mobile Layout */}
      <div className="flex w-full flex-col gap-4 sm:hidden">
        <div className="relative flex items-center gap-2 z-30">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
        <Input
          type="text"
              placeholder="Search items... (Press '/' to focus)"
              value={localSearchQuery}
          onChange={handleSearchChange}
              className="w-full pl-8 pr-8"
              disabled={props.isLoading}
              ref={searchInputRef}
            />
            {localSearchQuery.trim() !== "" && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={handleClearSearch}
                disabled={isLoading}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            disabled={props.isLoading}
            aria-label="Advanced filters"
            className="relative"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {totalFilterCount > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                variant="secondary"
              >
                {totalFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 pt-1"
            >
          <MultiSelect
                options={props.categoryOptions}
                value={props.selectedCategories}
                onValueChange={props.setSelectedCategories}
            placeholder="Filter by category"
                className="w-full z-40"
                disabled={props.isLoading}
              />

              {advancedFilters.map((filter) => (
                <div key={filter.name}>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    {filter.name}
                  </p>
                  <MultiSelect
                    options={filter.options}
                    value={filter.value}
                    onValueChange={filter.onChange}
                    placeholder={`Select ${filter.name.toLowerCase()}`}
            className="w-full"
                    disabled={isLoading}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between gap-2 mt-1">
                <Sort
                  sortOption={sortOption}
                  onSortChange={onSortChange}
                  disabled={isLoading}
                />

                <div className="flex items-center gap-2">
                  {hasFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="text-xs h-8 px-2"
                      disabled={isLoading}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                  )}

                  {isLoading && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  )}

                  {onSaveSearch && hasFilters && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsSaveDialogOpen(true)}
                            className="h-8 w-8"
                            disabled={isLoading}
                          >
                            <BookmarkPlus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Save this search</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
        </div>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:flex-row sm:items-center sm:flex-wrap sm:gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search items... (/ to focus, Esc to clear)"
            value={localSearchQuery}
            onChange={handleSearchChange}
            className="w-[240px] md:w-[280px] pl-8 pr-8"
            disabled={isLoading}
            ref={searchInputRef}
          />
          {localSearchQuery.trim() !== "" && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleClearSearch}
              disabled={isLoading}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {Array.isArray(props.recentSearches) &&
          props.recentSearches.length > 0 &&
          props.onSelectRecentSearch && (
            <Popover
              open={showRecentSearches}
              onOpenChange={setShowRecentSearches}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs gap-1"
                  disabled={props.isLoading}
                >
                  Recent
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-2" align="start">
                <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
                  {props.recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 text-xs"
                      onClick={() => {
                        if (props.onSelectRecentSearch) {
                          props.onSelectRecentSearch(search);
                          setShowRecentSearches(false);
                        }
                      }}
                    >
                      <span className="truncate">{search.name}</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

        <div className="flex items-center gap-2 flex-wrap">
          <MultiSelect
            options={props.categoryOptions}
            value={props.selectedCategories}
            onValueChange={props.setSelectedCategories}
            placeholder="Filter by category"
            className="w-[220px] z-40"
            disabled={props.isLoading}
          />

          <Popover
            open={filterPopoverOpen}
            onOpenChange={setFilterPopoverOpen}
            modal={false}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs gap-1 relative"
                disabled={props.isLoading}
              >
                <Filter className="h-3.5 w-3.5" />
                More Filters
                {Array.isArray(props.advancedFilters) &&
                  props.advancedFilters.some((f) => f?.value?.length > 0) && (
                    <Badge
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                      variant="secondary"
                    >
                      {props.advancedFilters.reduce(
                        (acc, f) => acc + (f?.value?.length || 0),
                        0,
                      )}
                    </Badge>
                  )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[320px] p-0 z-50"
              align="start"
              sideOffset={5}
            >
              <div className="border-b">
                <div className="flex">
                  <button
                    onClick={() => setActiveFilterTab("filters")}
                    className={`flex-1 px-3 py-2 text-xs font-medium ${
                      activeFilterTab === "filters"
                        ? "border-b-2 border-primary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Filters
                  </button>
                  <button
                    onClick={() => setActiveFilterTab("suggested")}
                    className={`flex-1 px-3 py-2 text-xs font-medium ${
                      activeFilterTab === "suggested"
                        ? "border-b-2 border-primary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Suggested
                  </button>
                  <button
                    onClick={() => setActiveFilterTab("recent")}
                    className={`flex-1 px-3 py-2 text-xs font-medium ${
                      activeFilterTab === "recent"
                        ? "border-b-2 border-primary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Recent
                  </button>
                </div>
              </div>

              <div className="p-3 max-h-[400px] overflow-y-auto">
                {activeFilterTab === "filters" && (
                  <div className="space-y-4">
                    {Array.isArray(props.advancedFilters) &&
                    props.advancedFilters.length > 0 ? (
                      props.advancedFilters.map((filter) => (
                        <div key={filter.name} className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            {filter?.icon || (
                              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                            <p className="text-xs font-medium">
                              {filter?.name}
                            </p>
                          </div>
                          {filter?.description && (
                            <p className="text-xs text-muted-foreground mb-1.5">
                              {filter.description}
                            </p>
                          )}
                          <MultiSelect
                            options={filter?.options || []}
                            value={filter?.value || []}
                            onValueChange={filter?.onChange || (() => {})}
                            placeholder={`Select ${(filter?.name || "").toLowerCase()}`}
                            className="w-full z-40"
                            disabled={props.isLoading}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground">
                          No advanced filters available
                        </p>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilterPopoverOpen(false)}
                        className="text-xs"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                )}

                {activeFilterTab === "suggested" && (
                  <div className="space-y-2">
                    {Array.isArray(props.suggestedFilters) &&
                    props.suggestedFilters.length > 0 ? (
                      props.suggestedFilters.map((filter, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start text-xs h-9 px-3"
                          onClick={() => {
                            filter?.onApply?.();
                            setFilterPopoverOpen(false);
                          }}
                        >
                          {filter?.icon || (
                            <Star className="h-3.5 w-3.5 mr-2 text-yellow-500" />
                          )}
                          <span>{filter?.name || ""}</span>
                          {Array.isArray(filter?.value) &&
                            filter.value.length > 0 && (
                              <Badge className="ml-auto" variant="secondary">
                                {filter.value.length}
                              </Badge>
                            )}
                        </Button>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground">
                          No suggested filters available
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeFilterTab === "recent" && (
                  <div className="space-y-2">
                    {Array.isArray(props.recentlyUsed) &&
                    props.recentlyUsed.length > 0 ? (
                      props.recentlyUsed.map((item, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-xs h-9 px-3"
                          onClick={() => {
                            item?.onSelect?.();
                            setFilterPopoverOpen(false);
                          }}
                        >
                          {item?.type === "search" ? (
                            <Search className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          ) : (
                            <Tag className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          )}
                          <span className="truncate">{item?.name || ""}</span>
                          <span className="ml-auto text-[10px] text-muted-foreground">
                            {item?.value || ""}
                          </span>
                        </Button>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <Clock className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No recent activity
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Recent searches and filters will appear here
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Sort
            sortOption={props.sortOption}
            onSortChange={props.onSortChange}
            disabled={props.isLoading}
          />

          {props.isLoading && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Loading...</span>
            </div>
          )}

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs gap-1.5"
              disabled={props.isLoading}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}

          {props.onSaveSearch && hasFilters && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsSaveDialogOpen(true)}
                    className="h-8 w-8"
                    disabled={props.isLoading}
                  >
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Save this search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Save Search Dialog */}
      {props.onSaveSearch && (
        <Popover open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
          <PopoverContent
            className="w-80 z-50"
            align={isSmallScreen ? "center" : "end"}
            sideOffset={5}
          >
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">
                  Save Filter Configuration
                </h4>
                <p className="text-sm text-muted-foreground">
                  Give your search filters a name to quickly access them later.
                </p>
              </div>
              <div className="grid gap-2">
                <Input
                  id="search-name"
                  placeholder="My filter preset"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="col-span-2 h-8"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveSearch();
                  }}
                />

                <div className="bg-muted/30 rounded-md p-2 mt-1">
                  <p className="text-xs font-medium mb-1.5">Current filters:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {props.searchQuery && (
                      <Badge variant="outline" className="text-[10px]">
                        Search:{" "}
                        {props.searchQuery.length > 15
                          ? props.searchQuery.substring(0, 15) + "..."
                          : props.searchQuery}
                      </Badge>
                    )}
                    {Array.isArray(props.selectedCategories) &&
                      props.selectedCategories.map((cat) => (
                        <Badge
                          key={cat}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {(Array.isArray(props.categoryOptions) &&
                            props.categoryOptions.find((o) => o?.value === cat)
                              ?.label) ||
                            cat}
                        </Badge>
                      ))}
                    {Array.isArray(props.advancedFilters) &&
                      props.advancedFilters.flatMap((filter) =>
                        Array.isArray(filter?.value)
                          ? filter.value.map((v) => (
                              <Badge
                                key={`${filter?.name || ""}-${v}`}
                                variant="outline"
                                className="text-[10px]"
                              >
                                {filter?.name || ""}:{" "}
                                {(Array.isArray(filter?.options) &&
                                  filter.options.find((o) => o?.value === v)
                                    ?.label) ||
                                  v}
                              </Badge>
                            ))
                          : [],
                      )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsSaveDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSearch}
                  disabled={!searchName.trim()}
                  className="flex-1"
                >
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Filter Summary - Shows on both desktop and mobile when filters are applied */}
      {hasFilters && (
        <motion.div
          className="flex flex-wrap gap-2 mt-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {props.searchQuery && props.searchQuery.trim() !== "" && (
            <Badge
              variant="secondary"
              className="text-xs py-1 px-2 gap-1 backdrop-blur-sm bg-background/80"
            >
              <Search className="h-3 w-3 mr-1 text-muted-foreground" />
              {props.searchQuery}
              <button
                onClick={handleClearSearch}
                className="ml-1 text-muted-foreground hover:text-foreground"
                disabled={props.isLoading}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {Array.isArray(props.selectedCategories) &&
            props.selectedCategories.map((category) => {
              const categoryLabel =
                (Array.isArray(props.categoryOptions) &&
                  props.categoryOptions.find(
                    (option) => option?.value === category,
                  )?.label) ||
                category;

              return (
                <Badge
                  key={category}
                  variant="secondary"
                  className="text-xs py-1 px-2 gap-1 backdrop-blur-sm bg-background/80"
                >
                  <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                  {categoryLabel}
                  <button
                    onClick={() => {
                      props.setSelectedCategories(
                        props.selectedCategories.filter((c) => c !== category),
                      );
                    }}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                    disabled={props.isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}

          {Array.isArray(props.advancedFilters) &&
            props.advancedFilters.flatMap((filter) =>
              Array.isArray(filter?.value)
                ? filter.value.map((value) => {
                    const valueLabel =
                      (Array.isArray(filter?.options) &&
                        filter.options.find((option) => option?.value === value)
                          ?.label) ||
                      value;

                    return (
                      <Badge
                        key={`${filter?.name || ""}-${value}`}
                        variant="secondary"
                        className="text-xs py-1 px-2 gap-1 backdrop-blur-sm bg-background/80"
                      >
                        {filter?.icon || (
                          <Filter className="h-3 w-3 mr-1 text-muted-foreground" />
                        )}
                        <span className="font-medium">
                          {filter?.name || ""}:
                        </span>{" "}
                        {valueLabel}
                        <button
                          onClick={() => {
                            filter?.onChange?.(
                              filter.value.filter((v) => v !== value),
                            );
                          }}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })
                : [],
            )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Save current filter state as a suggested filter if that functionality exists
              if (props.onSaveSearch) {
                setIsSaveDialogOpen(true);
              } else {
                // Just close the popover
                setFilterPopoverOpen(false);
              }
            }}
            className="h-6 text-[10px] px-2 border border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 rounded-full"
            disabled={props.isLoading}
          >
            <Plus className="h-3 w-3 mr-1" />
            Save filters
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
