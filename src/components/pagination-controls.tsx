import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems?: number;
  handlePageChange: (pageNumber: number) => void;
  handleItemsPerPageChange: (value: string) => void;
  itemsPerPageOptions: number[];
  showQuickNav?: boolean;
  showItemCount?: boolean;
  compact?: boolean;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  handlePageChange,
  handleItemsPerPageChange,
  itemsPerPageOptions,
  showQuickNav = false,
  showItemCount = true,
  compact = false,
  className = "",
}: PaginationControlsProps) {
  const [goToPage, setGoToPage] = useState<string>("");
  const [itemRange, setItemRange] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  // Memoize the visible page numbers to reduce re-renders
  const getVisiblePageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let pages = [];

    // Always show first page
    pages.push(1);

    if (currentPage <= 4) {
      // Near the beginning
      pages.push(2, 3, 4, 5);
      pages.push("ellipsis-end");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Near the end
      pages.push("ellipsis-start");
      pages.push(
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
      );
      pages.push(totalPages);
    } else {
      // Middle case
      pages.push("ellipsis-start");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("ellipsis-end");
      pages.push(totalPages);
    }

    return pages;
  };

  // Calculate the current range of items being displayed
  useEffect(() => {
    if (totalItems) {
      const start = (currentPage - 1) * itemsPerPage + 1;
      const end = Math.min(currentPage * itemsPerPage, totalItems);
      setItemRange({ start, end });
    }
  }, [currentPage, itemsPerPage, totalItems]);

  // Handle direct page navigation
  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
      setGoToPage("");
    }
  };

  // Keyboard shortcut for page navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === "ArrowLeft" && currentPage > 1) {
          handlePageChange(currentPage - 1);
        } else if (e.key === "ArrowRight" && currentPage < totalPages) {
          handlePageChange(currentPage + 1);
        } else if (e.key === "Home") {
          handlePageChange(1);
        } else if (e.key === "End") {
          handlePageChange(totalPages);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, handlePageChange]);

  const visiblePageNumbers = getVisiblePageNumbers();

  return (
    <motion.div
      className={`flex flex-col gap-4 ${compact ? "md:flex-row" : "lg:flex-row"} items-center justify-between ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
        {showItemCount && totalItems && (
          <Badge
            variant="outline"
            className="bg-background/80 backdrop-blur-sm"
          >
            <span className="text-xs text-muted-foreground">
              {totalItems > 0
                ? `Showing ${itemRange.start}-${itemRange.end} of ${totalItems}`
                : "No items"}
            </span>
          </Badge>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline-block">
            Items per page:
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-[70px] h-8 text-xs">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((number) => (
                <SelectItem
                  key={number}
                  value={number.toString()}
                  className="text-xs"
                >
                  {number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                aria-label="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">First page (Alt+Home)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Previous page (Alt+←)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Number buttons - only shown on larger screens */}
        <AnimatePresence>
          <div className="hidden md:flex items-center">
            {visiblePageNumbers.map((page, index) => {
              if (page === "ellipsis-start" || page === "ellipsis-end") {
                return (
                  <span key={`${page}-${index}`} className="mx-1">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </span>
                );
              }

              return (
                <motion.div
                  key={`page-${page}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 mx-0.5 ${currentPage === page ? "pointer-events-none" : ""}`}
                    onClick={() => handlePageChange(page as number)}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {/* Current page indicator for mobile */}
        <div className="flex md:hidden items-center">
          <Badge
            variant="outline"
            className="bg-background/60 backdrop-blur-sm h-8 px-3"
          >
            <span className="text-xs">
              {currentPage} / {totalPages}
            </span>
          </Badge>
        </div>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Next page (Alt+→)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Last page (Alt+End)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Quick navigation - optional */}
        {showQuickNav && (
          <div className="hidden sm:flex items-center ml-2 gap-2">
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGoToPage();
                }
              }}
              className="w-16 h-8 text-xs"
              placeholder="Go to"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleGoToPage}
              disabled={!goToPage}
            >
              Go
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
