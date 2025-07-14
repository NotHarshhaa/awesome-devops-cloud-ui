import { Resource } from "@/hooks/use-readme";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useCallback } from "react";
import ItemCard from "./item-card";
import { FileX2 } from "lucide-react";

type LayoutType = "compact" | "grid" | "row";

interface ItemGridProps {
  items: Resource[];
  bookmarkedItems: number[];
  onBookmark: (id: number) => void;
  layoutType: LayoutType;
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
  onBookmark,
  layoutType = "grid",
}: ItemGridProps) {
  // Get the appropriate grid class based on layout type
  const getGridClasses = useCallback(() => {
    switch (layoutType) {
      case "compact":
        return "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-1";
      case "grid":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-1";
      case "row":
        return "grid-cols-1 gap-4 max-w-5xl mx-auto p-1";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-1";
    }
  }, [layoutType]);

  // No items state
  if (items.length === 0) {
    return (
      <motion.div
        {...standardAnimations.emptyState}
        className="flex flex-col items-center justify-center p-12 rounded-lg border border-border/40 bg-muted/5"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
          <div className="relative bg-muted/10 w-16 h-16 rounded-full flex items-center justify-center border border-border/40">
            <FileX2 className="w-8 h-8 text-muted-foreground/70" />
          </div>
        </motion.div>
        <h3 className="text-lg font-medium mt-4 text-foreground/90">
          No Matching Results
        </h3>
        <p className="text-muted-foreground text-sm mt-1 text-center max-w-sm">
          Try adjusting your search or filter settings to find what you're looking for.
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
            >
              <ItemCard
                id={item.id}
                title={item.name}
                description={item.description}
                url={item.url}
                category={item.category}
                date={item.date}
                isBookmarked={bookmarkedItems.includes(item.id)}
                onBookmark={onBookmark}
                layoutType={layoutType}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}
