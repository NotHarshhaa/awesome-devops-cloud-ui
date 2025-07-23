"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isValid, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Grid2X2, Grid3X3, Info, List, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

import { SortOption } from "@/components/sort";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import { Resource } from "@/hooks/use-readme";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useReadStatus } from "@/hooks/use-read-status";
import { useViewCount } from "@/hooks/use-view-count";
import { ItemGrid } from "../item-grid";
import { PaginationControls } from "../pagination-controls";
import { SearchFilterControls } from "../search-filter-controls";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

const ITEMS_PER_PAGE_OPTIONS = [18, 27, 36, 45];

interface Category {
  title: string;
  items: Resource[];
}

interface ItemListProps {
  items: Resource[];
  categories: Category[];
  initialLayoutType?: LayoutType;
}

// Define layout types
type LayoutType = "compact" | "grid" | "row";

export default function ItemList({
  items: initialItems,
  categories,
  initialLayoutType = "grid",
}: ItemListProps) {
  const [filteredItems, setFilteredItems] = useState<Resource[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [layoutType, setLayoutType] = useLocalStorage<LayoutType>(
    "layoutType",
    initialLayoutType,
  );
  const [error, setError] = useState<string | null>(null);
  const { unreadItems: readItems, toggleReadStatus: handleMarkAsRead } =
    useReadStatus();

  const { viewCounts, incrementViewCount: handleView } = useViewCount();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { bookmarkedItems, toggleBookmark } = useBookmarks();

  // Enhanced resource functionality already handled by our custom hooks

  const handleShare = useCallback((id: number, title: string, url: string) => {
    if (navigator.share) {
      navigator
        .share({
          title,
          text: `Check out this resource: ${title}`,
          url,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
        });
    }
  }, []);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.title,
        value: category.title,
      })),
    [categories],
  );

  const sortItems = useCallback(
    (items: Resource[]): Resource[] => {
      return [...items].sort((a, b) => {
        const aBookmarked = bookmarkedItems.includes(a.id);
        const bBookmarked = bookmarkedItems.includes(b.id);
        if (aBookmarked !== bBookmarked) return aBookmarked ? -1 : 1;

        const [field, direction] = sortOption.split("-") as [
          "date" | "name",
          "asc" | "desc",
        ];

        if (field === "name") {
          const nameA = a.name?.toLowerCase() || "";
          const nameB = b.name?.toLowerCase() || "";
          const result = nameA.localeCompare(nameB);
          return direction === "asc" ? result : -result;
        } else {
          const dateA =
            a.date && a.date !== "Unknown" ? parseISO(a.date) : new Date(0);
          const dateB =
            b.date && b.date !== "Unknown" ? parseISO(b.date) : new Date(0);

          if (!isValid(dateA) && !isValid(dateB)) return 0;
          if (!isValid(dateA)) return direction === "asc" ? -1 : 1;
          if (!isValid(dateB)) return direction === "asc" ? 1 : -1;

          return direction === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }
      });
    },
    [bookmarkedItems, sortOption],
  );

  const filterAndSortItems = useCallback(() => {
    setIsFiltering(true);
    setError(null);

    try {
      let filtered = [...initialItems];

      if (debouncedSearchQuery) {
        const lowercaseQuery = debouncedSearchQuery.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            (item.name?.toLowerCase() || "").includes(lowercaseQuery) ||
            (item.description?.toLowerCase() || "").includes(lowercaseQuery),
        );
      }

      if (selectedCategories.length > 0) {
        filtered = filtered.filter((item) =>
          selectedCategories.includes(item.category),
        );
      }

      const sortedItems = sortItems(filtered);

      setFilteredItems(sortedItems);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error filtering items:", err);
      setError("An error occurred while filtering items. Please try again.");
    } finally {
      setIsFiltering(false);
    }
  }, [initialItems, debouncedSearchQuery, selectedCategories, sortItems]);

  useEffect(() => {
    filterAndSortItems();
  }, [filterAndSortItems]);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsLoading(false);
      filterAndSortItems();
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (option: SortOption) => {
      setSortOption(option);

      const sorted = sortItems(
        filteredItems.filter((item) => {
          if (
            selectedCategories.length > 0 &&
            !selectedCategories.includes(item.category)
          ) {
            return false;
          }

          if (debouncedSearchQuery) {
            const lowercaseQuery = debouncedSearchQuery.toLowerCase();
            return (
              (item.name?.toLowerCase() || "").includes(lowercaseQuery) ||
              (item.description?.toLowerCase() || "").includes(lowercaseQuery)
            );
          }

          return true;
        }),
      );

      setFilteredItems(sorted);
    },
    [filteredItems, sortItems, selectedCategories, debouncedSearchQuery],
  );

  // Layout switching handler
  const handleLayoutChange = useCallback((value: string) => {
    if (value) {
      setLayoutType(value as LayoutType);
    }
  }, []);

  // Get grid column classes based on layout type
  const getGridClasses = useCallback(() => {
    switch (layoutType) {
      case "compact":
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      case "grid":
        return "sm:grid-cols-2 lg:grid-cols-3";
      case "row":
        return "grid-cols-1";
      default:
        return "sm:grid-cols-2 lg:grid-cols-3";
    }
  }, [layoutType]);

  // Get item card height based on layout type
  const getCardHeightClass = useCallback(() => {
    switch (layoutType) {
      case "compact":
        return "min-h-[200px]";
      case "grid":
        return "min-h-[250px]";
      case "row":
        return "min-h-[150px] md:min-h-[130px]";
      default:
        return "min-h-[250px]";
    }
  }, [layoutType]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 bg-muted/5 p-4 rounded-lg border border-border/40">
        <SearchFilterControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryOptions={categoryOptions}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          className="w-full sm:w-auto"
          isLoading={isFiltering}
        />

        <div className="flex items-center justify-end w-full sm:w-auto">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TooltipProvider delayDuration={200}>
              <ToggleGroup
                type="single"
                value={layoutType}
                onValueChange={handleLayoutChange}
                className="relative border rounded-md bg-background shadow-sm"
              >
                <motion.div
                  layoutId="activeLayoutIndicator"
                  className="absolute bottom-0 h-0.5 bg-primary"
                  style={{
                    width: "24px",
                    left:
                      layoutType === "compact"
                        ? "6px"
                        : layoutType === "grid"
                          ? "46px"
                          : "86px",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="compact"
                      aria-label="Compact Grid View"
                      className="relative z-20 data-[state=on]:text-primary hover:bg-muted/50 transition-colors"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    Compact Grid
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="grid"
                      aria-label="Grid View"
                      className="relative z-20 data-[state=on]:text-primary hover:bg-muted/50 transition-colors"
                    >
                      <Grid2X2 className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    Standard Grid
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="row"
                      aria-label="Row View"
                      className="relative z-20 data-[state=on]:text-primary hover:bg-muted/50 transition-colors"
                    >
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    List View
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </TooltipProvider>
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${isLoading ? "loading" : "loaded"}-${layoutType}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          layout
        >
          {isLoading ? (
            <ItemGrid
              items={[]}
              bookmarkedItems={[]}
              readItems={readItems}
              viewCounts={viewCounts}
              onBookmark={() => {}}
              onMarkAsRead={handleMarkAsRead}
              onShare={handleShare}
              onView={handleView}
              layoutType={layoutType}
              isLoading={true}
            />
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-3 mb-4">
                <Info className="h-5 w-5 text-red-500" />
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
              <Button
                variant="outline"
                onClick={filterAndSortItems}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : isFiltering ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-muted-foreground">Filtering resources...</p>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-muted/30 p-6 rounded-lg border border-border/60 max-w-md">
                <h3 className="text-lg font-medium mb-2">
                  No matching resources
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search term to find what you're
                  looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          ) : (
            <ItemGrid
              items={currentItems}
              bookmarkedItems={bookmarkedItems}
              readItems={readItems}
              viewCounts={viewCounts}
              onBookmark={toggleBookmark}
              onMarkAsRead={handleMarkAsRead}
              onShare={handleShare}
              onView={handleView}
              layoutType={layoutType}
              isLoading={isLoading}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {filteredItems.length > 0 && !isLoading && !error && !isFiltering && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            handleItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
          />

          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
            {filteredItems.length} items
          </div>
        </div>
      )}
    </div>
  );
}
