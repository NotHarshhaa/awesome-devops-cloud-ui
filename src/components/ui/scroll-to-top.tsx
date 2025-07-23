"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ChevronUp, Home, MoveUp, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ScrollToTopProps {
  /**
   * The threshold (in pixels) at which the button appears
   * @default 300
   */
  threshold?: number;

  /**
   * Position of the button
   * @default "bottom-right"
   */
  position?: "bottom-right" | "bottom-left" | "bottom-center";

  /**
   * Whether to show the scroll progress indicator
   * @default true
   */
  showProgress?: boolean;

  /**
   * Whether to show small indicator dots around the progress circle
   * @default true
   */
  showIndicatorDots?: boolean;

  /**
   * Additional classes to apply to the button
   */
  className?: string;

  /**
   * The duration of the scroll animation in milliseconds
   * @default 500
   */
  scrollDuration?: number;

  /**
   * Number of pixels to offset from the edge of the screen
   * @default 4
   */
  offset?: number;
}

export function ScrollToTop({
  threshold = 300,
  position = "bottom-right",
  showProgress = true,
  showIndicatorDots = true,
  className,
  scrollDuration = 500,
  offset = 4,
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hovering, setHovering] = useState(false);

  // Calculate scroll position and progress
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
    );
    const windowHeight = window.innerHeight;
    const scrollable = documentHeight - windowHeight;

    // Determine if the button should be visible
    if (scrollY > threshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    // Calculate scroll progress (0 to 1)
    if (scrollable > 0) {
      setScrollProgress(Math.min(scrollY / scrollable, 1));
    }
  }, [threshold]);

  // Smooth scroll implementation with customizable duration
  const scrollToTop = () => {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);

      // Easing function for smooth acceleration/deceleration
      const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

      window.scrollTo(0, startPosition * (1 - ease(progress)));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  useEffect(() => {
    // Set up scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initialize scroll position on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Set position classes based on the position prop
  const positionClasses = {
    "bottom-right": `bottom-${offset} right-${offset}`,
    "bottom-left": `bottom-${offset} left-${offset}`,
    "bottom-center": `bottom-${offset} left-1/2 -translate-x-1/2`,
  }[position];

  // Animated button with progress indicator
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(`fixed ${positionClasses} z-50`, className)}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div className="relative inline-block">
            {/* Progress ring */}
            {showProgress && (
              <svg
                className="absolute inset-0 -m-1 h-[calc(100%+0.5rem)] w-[calc(100%+0.5rem)]"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  className="text-muted-foreground/20"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  strokeDasharray="264"
                  strokeDashoffset={264 - 264 * scrollProgress}
                  className="text-primary"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  initial={{ strokeDashoffset: 264 }}
                  animate={{
                    strokeDashoffset: 264 - 264 * scrollProgress,
                  }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                />
                {/* Small arrow indicators along the circle */}
                {showIndicatorDots && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: scrollProgress > 0.05 ? 1 : 0 }}
                  >
                    <circle
                      cx="50"
                      cy="15"
                      r="2"
                      fill="currentColor"
                      className="text-primary"
                    />
                    <circle
                      cx="75"
                      cy="25"
                      r="2"
                      fill="currentColor"
                      className="text-primary"
                    />
                    <circle
                      cx="85"
                      cy="50"
                      r="2"
                      fill="currentColor"
                      className="text-primary"
                    />
                    <circle
                      cx="75"
                      cy="75"
                      r="2"
                      fill="currentColor"
                      className="text-primary"
                    />
                    <circle
                      cx="50"
                      cy="85"
                      r="2"
                      fill="currentColor"
                      className="text-primary"
                    />
                    <circle
                      cx="25"
                      cy="75"
                      r="2"
                      fill="currentColor"
                      className="text-primary"
                    />
                    <circle
                      cx="15"
                      cy="50"
                      r="2"
                      fill="currentColor"
                      className="text-primary"
                    />
                    <circle
                      cx="25"
                      cy="25"
                      r="2"
                      fill="currentColor"
                      className="text-primary"
                    />
                  </motion.g>
                )}
              </svg>
            )}

            {/* Button with hover effect */}
            <Button
              onClick={scrollToTop}
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full bg-primary shadow-lg border",
                "hover:bg-primary hover:text-primary-foreground dark:hover:text-background",
                "transition-all duration-300 z-10 relative",
                "hover:scale-110 active:scale-95",
                "backdrop-blur-sm",
              )}
              aria-label="Scroll to top"
            >
              <motion.div
                animate={hovering ? { y: -2 } : { y: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <ArrowUpCircle className="h-5 w-5 text-white dark:text-primary-foreground" />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <MoveUp className="h-3 w-3 text-white dark:text-primary-foreground" />
                </motion.div>
              </motion.div>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
