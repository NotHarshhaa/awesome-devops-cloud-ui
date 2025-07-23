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
  Share2,
  Eye,
  Image as ImageIcon,
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
  imageUrl?: string;
  isBookmarked: boolean;
  isRead?: boolean;
  viewCount?: number;
  onBookmark: (id: number) => void;
  onMarkAsRead?: (id: number) => void;
  onShare?: (id: number, title: string, url: string) => void;
  onView?: (id: number) => void;
  layoutType: LayoutType;
  isLoading?: boolean;
  className?: string;
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

const ItemCard: React.FC<ItemCardProps> = React.memo(
  ({
    id,
    title,
    description,
    url,
    category,
    date,
    imageUrl,
    isBookmarked,
    isRead = true,
    viewCount = 0,
    onBookmark,
    onMarkAsRead,
    onShare,
    onView,
    layoutType = "grid",
    isLoading = false,
    className,
  }) => {
    // Track if card has been viewed during this session
    const [hasViewed, setHasViewed] = React.useState(false);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        window.open(url, "_blank", "noopener,noreferrer");
        if (onView && !hasViewed) {
          onView(id);
          setHasViewed(true);
        }
      }
    };

    // Handle view tracking
    const handleView = () => {
      if (onView && !hasViewed) {
        onView(id);
        setHasViewed(true);
      }
    };

    // Handle sharing
    const handleShare = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (onShare) {
        onShare(id, title, url);
      } else if (navigator.share) {
        navigator
          .share({
            title,
            text: description,
            url,
          })
          .catch(console.error);
      } else {
        navigator.clipboard
          .writeText(url)
          .then(() => alert("Link copied to clipboard!"))
          .catch(console.error);
      }
    };

    const styles = useMemo(() => {
      switch (layoutType) {
        case "compact":
          return {
            card: "min-h-[220px] w-full group border-neutral-200 dark:border-neutral-800 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 focus-within:ring-2 focus-within:ring-primary/40",
            container: "gap-1",
            title:
              "text-sm font-bold text-foreground transition-colors duration-200",
            badge: "text-xs px-2 py-0 h-5 mt-1",
            description:
              "text-xs text-muted-foreground min-h-[2.5rem] line-clamp-3",
            date: "text-xs text-muted-foreground/70",
            button: "text-xs py-1 h-7",
            bookmarkBtn: "h-7 w-7",
            icon: "h-3.5 w-3.5",
            headerPadding: "p-3 pb-1",
            contentPadding: "px-3 py-1.5",
            footerPadding: "px-3 pb-3 pt-1.5",
            headerHeight: "min-h-[60px]",
            contentHeight: "min-h-[80px]",
            footerHeight: "min-h-[60px]",
          };
        case "row":
          return {
            card: "min-h-[140px] w-full group border-neutral-200 dark:border-neutral-800 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 focus-within:ring-2 focus-within:ring-primary/40",
            container: "md:flex-row md:gap-4 gap-2",
            title:
              "text-base md:text-lg font-bold text-foreground transition-colors duration-200",
            badge: "text-xs md:text-sm",
            description:
              "text-sm text-muted-foreground line-clamp-2 md:line-clamp-2",
            date: "text-xs text-muted-foreground/70",
            button: "text-sm whitespace-nowrap",
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
            card: "min-h-[280px] w-full group border-neutral-200 dark:border-neutral-800 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 focus-within:ring-2 focus-within:ring-primary/40",
            container: "gap-3",
            title:
              "text-lg font-bold text-foreground transition-colors duration-200",
            badge: "text-xs",
            description:
              "text-sm text-muted-foreground min-h-[3rem] line-clamp-3",
            date: "text-xs text-muted-foreground/70",
            button: "text-sm whitespace-nowrap",
            bookmarkBtn: "h-10 w-10",
            icon: "h-4 w-4",
            headerPadding: "p-4 pb-2",
            contentPadding: "px-4 py-2",
            footerPadding: "px-4 pt-2 pb-4",
            headerHeight: "min-h-[80px]",
            contentHeight: "min-h-[100px]",
            footerHeight: "min-h-[80px]",
          };
      }
    }, [layoutType]);

    // Skeleton loading state
    if (isLoading) {
      return (
        <motion.div layout {...standardAnimations} className={styles.container}>
          <Card className={cn(`overflow-hidden relative`, styles.card, className)}>
            <div className="animate-pulse flex flex-col h-full">
              <div className={cn(styles.headerPadding, "space-y-2")}>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className={cn(styles.contentPadding, "space-y-2")}>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
              <div className={cn(styles.footerPadding, "flex gap-2 mt-auto")}>
                <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-9 flex-grow bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </Card>
        </motion.div>
      );
    }

    return (
      <motion.div
        layout
        {...standardAnimations}
        className={styles.container}
        whileHover={hoverAnimation}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="article"
        aria-label={`${title} - ${category}`}
      >
        <Card
          className={cn(
            `overflow-hidden relative flex flex-col h-full`,
            styles.card,
            !isRead && "border-l-4 border-l-primary",
            className
          )}
        >
          <div
            className={cn(
              "flex flex-col h-full",
              layoutType === "row" ? "md:flex-row md:items-center" : "",
            )}
          >
            {/* Image Section - Only show if imageUrl is provided */}
            {imageUrl && (
              <div
                className={cn(
                  "w-full h-24 bg-gray-100 dark:bg-gray-800 relative overflow-hidden",
                  layoutType === "row" ? "md:h-full md:w-1/4" : "",
                )}
              >
                <img
                  src={imageUrl}
                  alt={`${title} thumbnail`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNCAxN2w0LTRNMTQgN2w0LTRNMTcgOGwtMS43MzIgMS43MzJtLTYuNTM2IDYuNTM2TDcgMTgiLz48Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMiAyaDIwdjIwSDJ6Ii8+PC9zdmc+";
                    target.className =
                      "w-full h-full object-contain p-8 opacity-40";
                  }}
                />
                <div className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1">
                  <ImageIcon className="h-3 w-3" />
                </div>
              </div>
            )}

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
                  className="flex items-center mt-2 text-muted-foreground justify-between"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center">
                    <Calendar
                      className={cn(
                        "mr-1",
                        layoutType === "compact" ? "h-3 w-3" : "h-3.5 w-3.5",
                      )}
                    />
                    <span className={styles.date}>Added: {date}</span>
                  </div>

                  {viewCount > 0 && (
                    <div className="flex items-center">
                      <Eye
                        className={cn(
                          "mr-1",
                          layoutType === "compact" ? "h-3 w-3" : "h-3.5 w-3.5",
                        )}
                      />
                      <span className={styles.date}>{viewCount}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>

            <CardFooter
              className={cn(
                "flex items-center",
                styles.footerPadding,
                styles.footerHeight,
                layoutType === "row" ? "md:w-1/5 md:justify-end md:ml-auto" : "",
                "transition-all duration-300 mt-auto",
                {
                  "justify-between": layoutType === "compact",
                  "flex-wrap sm:flex-nowrap gap-2": layoutType !== "compact"
                }
              )}
            >
              <div className={cn(
                "flex items-center", 
                {
                  "gap-1": layoutType === "compact",
                  "gap-2": layoutType !== "compact",
                  "md:justify-end": layoutType === "row"
                }
              )}>
                <AnimatePresence mode="popLayout">
                  {/* Bookmark Button */}
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
                            size={layoutType === "row" ? "icon" : "sm"}
                            onClick={(e) => {
                              e.stopPropagation();
                              onBookmark(id);
                            }}
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
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size={layoutType === "row" ? "icon" : "sm"}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Your collection logic here
                            }}
                            aria-label="Add to collection"
                            className={cn(
                              "transition-all duration-300 flex-shrink-0",
                              styles.bookmarkBtn,
                            )}
                          >
                            <FolderPlus className={styles.icon} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Add to collection</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>

                  {/* Share Button */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0"
                  >
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size={layoutType === "row" ? "icon" : "sm"}
                            onClick={handleShare}
                            aria-label="Share this resource"
                            className={cn(
                              "transition-all duration-300 flex-shrink-0",
                              styles.bookmarkBtn,
                            )}
                          >
                            <Share2 className={styles.icon} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Share resource</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>

                  {/* View Button */}
                  {layoutType === "compact" && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0"
                    >
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleView}
                              aria-label="View resource"
                              className={cn(
                                "transition-all duration-300 flex-shrink-0 relative",
                                styles.bookmarkBtn,
                              )}
                              asChild
                            >
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center"
                              >
                                <ArrowUpRight className={styles.icon} />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">View resource</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* View Resource Button for non-compact layouts */}
              {layoutType !== "compact" && (
                <Button
                  asChild
                  className={cn(
                    "group overflow-hidden relative",
                    styles.button,
                    "transition-all duration-300",
                    layoutType === "row" 
                      ? "md:w-auto md:min-w-[100px] md:h-9 md:px-3" 
                      : "flex-1"
                  )}
                  variant="outline"
                  size={layoutType === "row" ? "sm" : "default"}
                  onClick={handleView}
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center justify-center w-full",
                      layoutType === "row" && "md:justify-between"
                    )}
                    aria-label={`Visit ${title} resource`}
                  >
                    <span className={cn(
                      "relative z-10 flex items-center gap-1",
                      layoutType === "row" ? "md:justify-between w-full" : "justify-center"
                    )}>
                      <span className="flex items-center gap-1">
                        {layoutType === "row" ? "View" : "View Resource"}
                        <ExternalLink
                          className={styles.icon}
                          aria-hidden="true"
                        />
                      </span>
                      {viewCount > 0 && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] px-1 min-w-[1.2rem] h-4",
                            layoutType === "row" ? "" : "ml-2"
                          )}
                        >
                          {viewCount}
                        </Badge>
                      )}
                    </span>
                    <span className="absolute inset-0 bg-primary/10 dark:bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  </a>
                </Button>
              )}
            </CardFooter>
          </div>
        </Card>
      </motion.div>
    );
  },
);

export default ItemCard;
