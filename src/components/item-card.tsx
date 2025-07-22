import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpRight,
  Bookmark,
  Calendar,
  ExternalLink,
  FolderPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddToCollection } from "@/components/collections/add-to-collection";

type LayoutType = "compact" | "grid" | "row";

interface ItemCardProps {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  date?: string;
  isBookmarked: boolean;
  onBookmark: (id: number) => void;
  layoutType: LayoutType;
}

// Standard animation settings to ensure consistency
const standardAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { type: "spring", stiffness: 300, damping: 30 },
};

// Hover animations for interactive elements
const hoverAnimation = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  description,
  url,
  category,
  date,
  isBookmarked,
  onBookmark,
  layoutType = "grid",
}) => {
  // Get styling based on layout type
  const styles = useMemo(() => {
    switch (layoutType) {
      case "compact":
        return {
          card: "h-[240px] group border-neutral-200 dark:border-neutral-800 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 focus-within:ring-2 focus-within:ring-primary/40",
          container: "gap-1",
          title:
            "text-sm font-bold text-foreground transition-colors duration-200",
          badge: "text-xs px-2 py-0 h-5 mt-1",
          description:
            "text-xs text-muted-foreground min-h-[2.5rem] line-clamp-5",
          date: "text-xs text-muted-foreground/70",
          button: "text-xs py-1 h-7",
          bookmarkBtn: "h-7 w-7",
          icon: "h-3.5 w-3.5",
          headerPadding: "p-3 pb-1",
          contentPadding: "px-3 py-1.5",
          footerPadding: "px-3 pb-3 pt-1.5",
          headerHeight: "h-[72px]",
          contentHeight: "h-[100px]",
          footerHeight: "h-[68px]",
        };
      case "row":
        return {
          card: "h-[240px] md:h-[140px] group border-neutral-200 dark:border-neutral-800 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 focus-within:ring-2 focus-within:ring-primary/40",
          container: "md:flex-row md:gap-4 gap-2",
          title:
            "text-base md:text-lg font-bold text-foreground transition-colors duration-200",
          badge: "text-xs md:text-sm",
          description:
            "text-sm text-muted-foreground line-clamp-2 md:line-clamp-2",
          date: "text-xs text-muted-foreground/70",
          button: "text-sm",
          bookmarkBtn: "h-9 w-9",
          icon: "h-4 w-4",
          headerPadding: "p-4 md:pb-2",
          contentPadding: "px-4 py-2",
          footerPadding: "p-4 md:pt-2",
          headerHeight: "md:h-full",
          contentHeight: "md:h-full",
          footerHeight: "md:h-full",
        };
      case "grid":
      default:
        return {
          card: "h-[320px] group border-neutral-200 dark:border-neutral-800 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 focus-within:ring-2 focus-within:ring-primary/40",
          container: "gap-3",
          title:
            "text-lg font-bold text-foreground transition-colors duration-200",
          badge: "text-xs",
          description:
            "text-sm text-muted-foreground min-h-[4.5rem] line-clamp-5",
          date: "text-xs text-muted-foreground/70",
          button: "text-sm",
          bookmarkBtn: "h-10 w-10",
          icon: "h-4 w-4",
          headerPadding: "p-4 pb-2",
          contentPadding: "px-4 py-2",
          footerPadding: "px-4 pt-2 pb-4",
          headerHeight: "h-[100px]",
          contentHeight: "h-[140px]",
          footerHeight: "h-[80px]",
        };
    }
  }, [layoutType]);

  return (
    <motion.div
      layout
      {...standardAnimations}
      className={styles.container}
      whileHover={hoverAnimation}
    >
      <Card className={cn(`overflow-hidden relative`, styles.card)}>
        <div
          className={cn(
            "flex flex-col h-full",
            layoutType === "row" ? "md:flex-row md:items-center" : "",
          )}
        >
          <CardHeader
            className={cn(
              styles.headerPadding,
              styles.headerHeight,
              layoutType === "row" ? "md:w-2/5 md:pr-0" : "",
              "transition-all duration-300",
            )}
          >
            {layoutType === "compact" ? (
              // Compact layout - Title and badge stacked vertically
              <div className="flex flex-col">
                <CardTitle className={styles.title}>{title}</CardTitle>
                <Badge
                  variant="secondary"
                  className={cn(
                    "shrink-0 transition-all duration-300 w-fit",
                    styles.badge,
                  )}
                >
                  {category}
                </Badge>
              </div>
            ) : (
              // Grid and Row layouts - Title and badge side by side
              <div className="flex justify-between items-start gap-2">
                <CardTitle className={styles.title}>{title}</CardTitle>
                <Badge
                  variant="secondary"
                  className={cn(
                    "shrink-0 transition-all duration-300",
                    styles.badge,
                  )}
                >
                  {category}
                </Badge>
              </div>
            )}
            {layoutType === "row" && (
              <div className="flex items-center mt-1 text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1 opacity-70" />
                <span className={styles.date}>Added: {date}</span>
              </div>
            )}
          </CardHeader>

          <CardContent
            className={cn(
              "flex-grow",
              styles.contentPadding,
              styles.contentHeight,
              layoutType === "row" ? "md:w-2/5 md:px-0" : "",
              "transition-all duration-300",
            )}
          >
            <p className={cn("text-muted-foreground", styles.description)}>
              {description}
            </p>
            {layoutType !== "row" && (
              <motion.div
                className="flex items-center mt-2 text-muted-foreground"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Calendar
                  className={cn(
                    "mr-1",
                    layoutType === "compact" ? "h-3 w-3" : "h-3.5 w-3.5",
                  )}
                />
                <span className={styles.date}>Added: {date}</span>
              </motion.div>
            )}
          </CardContent>

          <CardFooter
            className={cn(
              "flex gap-2 items-center",
              styles.footerPadding,
              styles.footerHeight,
              layoutType === "row" ? "md:w-1/5 md:justify-end" : "",
              "transition-all duration-300 mt-auto",
            )}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                whileTap={{ scale: 0.95 }}
                key={`bookmark-${isBookmarked}-${layoutType}`}
                className="flex-shrink-0"
              >
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isBookmarked ? "default" : "outline"}
                        size={layoutType === "compact" ? "sm" : "icon"}
                        onClick={() => onBookmark(id)}
                        aria-label={
                          isBookmarked
                            ? "Remove from bookmarks"
                            : "Add to bookmarks"
                        }
                        className={cn(
                          "transition-all duration-300 flex-shrink-0",
                          styles.bookmarkBtn,
                          isBookmarked
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600"
                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600",
                        )}
                      >
                        <Bookmark
                          className={cn(
                            styles.icon,
                            "transition-transform duration-300",
                            isBookmarked ? "scale-110" : "",
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>

              {/* Add to Collection Button */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                whileTap={{ scale: 0.95 }}
                key={`collection-${layoutType}`}
                className="flex-shrink-0"
              >
                <AddToCollection
                  resource={{
                    id,
                    name: title,
                    description,
                    url,
                    category,
                    date: date || "",
                  }}
                  variant="outline"
                  size={layoutType === "compact" ? "sm" : "icon"}
                />
              </motion.div>
            </AnimatePresence>

            <Button
              asChild
              className={cn(
                "w-full group overflow-hidden relative",
                styles.button,
                "transition-all duration-300",
              )}
              variant="outline"
              size={layoutType === "compact" ? "sm" : "default"}
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
                aria-label={`Visit ${title} resource`}
              >
                <span className="relative z-10 flex items-center">
                  {layoutType === "compact" ? "View" : "View Resource"}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    {layoutType === "compact" ? (
                      <ArrowUpRight
                        className={cn("ml-1", styles.icon)}
                        aria-hidden="true"
                      />
                    ) : (
                      <ExternalLink
                        className={cn(
                          "ml-1.5",
                          styles.icon === "h-5 w-5" ? "h-4 w-4" : styles.icon,
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </span>
                <span className="absolute inset-0 bg-primary/10 dark:bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </a>
            </Button>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};

export default ItemCard;
