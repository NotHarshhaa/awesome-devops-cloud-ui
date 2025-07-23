import { Resource } from "@/hooks/use-readme";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useCallback, useState } from "react";
import ItemCard from "./item-card";
import { FileX2 } from "lucide-react";

type LayoutType = "compact" | "grid" | "row";

interface ItemGridProps {
  items: Resource[];
  bookmarkedItems: number[];
  readItems?: number[];
  viewCounts?: Record<number, number>;
  onBookmark: (id: number) => void;
  onMarkAsRead?: (id: number) => void;
  onShare?: (id: number, title: string, url: string) => void;
  onView?: (id: number) => void;
  layoutType: LayoutType;
  isLoading?: boolean;
}

// Standard animations for grid and containers
const standardAnimations = {
  container: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.2,
        delayChildren: 0.05,
        staggerChildren: 0.03,
      },
    },
    exit: { opacity: 0 },
  },
  emptyState: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  },
};

export function ItemGrid({
  items,
  bookmarkedItems,
  readItems = [],
  viewCounts = {},
  onBookmark,
  onMarkAsRead,
  onShare,
  onView,
  layoutType = "grid",
  isLoading = false,
}: ItemGridProps) {
  // Get the appropriate grid class based on layout type
  const getGridClasses = useCallback(() => {
    switch (layoutType) {
      case "compact":
        return "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 p-2 sm:p-1 w-full";
      case "grid":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 p-2 sm:p-1 w-full max-w-[1600px] mx-auto";
      case "row":
        return "grid-cols-1 gap-6 max-w-5xl mx-auto p-2 sm:p-1 w-full";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 p-2 sm:p-1 w-full max-w-[1600px] mx-auto";
    }
  }, [layoutType]);

  // Loading state - display skeleton cards
  if (isLoading) {
    return (
      <motion.div
        key="loading-grid"
        className={`grid ${getGridClasses()} min-h-[200px]`}
        {...standardAnimations.container}
        layout
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={`skeleton-${index}`}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <ItemCard
              id={-1}
              title=""
              description=""
              url=""
              category=""
              date=""
              isBookmarked={false}
              onBookmark={() => {}}
              layoutType={layoutType}
              isLoading={true}
              className="h-full"
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // No items state
  if (items.length === 0) {
    return (
      <motion.div
        {...standardAnimations.emptyState}
        className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-lg border border-border/40 bg-muted/5 min-h-[200px]"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
          <div className="relative bg-muted/10 w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center border border-border/40">
            <FileX2 className="w-7 sm:w-8 h-7 sm:h-8 text-muted-foreground/70" />
          </div>
        </motion.div>
        <h3 className="text-base sm:text-lg font-medium mt-4 text-foreground/90">
          No Matching Results
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1 text-center max-w-sm">
          Try adjusting your search or filter settings to find what you're
          looking for.
        </p>
      </motion.div>
    );
  }

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.div
          key={`grid-${layoutType}`}
          className={`grid ${getGridClasses()}`}
          {...standardAnimations.container}
          layout
        >
          {items.map((item) => (
            <motion.div
              key={`${item.id}-${layoutType}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ItemCard
                id={item.id}
                title={item.name}
                description={item.description}
                url={item.url}
                category={item.category}
                date={item.date}
                imageUrl={item.imageUrl}
                isBookmarked={bookmarkedItems.includes(item.id)}
                isRead={readItems ? !readItems.includes(item.id) : true}
                viewCount={viewCounts ? viewCounts[item.id] || 0 : 0}
                onBookmark={onBookmark}
                onMarkAsRead={onMarkAsRead}
                onShare={onShare}
                onView={onView}
                layoutType={layoutType}
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}
