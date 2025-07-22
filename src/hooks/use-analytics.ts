import { useCallback, useEffect } from "react";

/**
 * Types of events that can be tracked
 */
type EventCategory =
  | "resource_interaction"
  | "search"
  | "filter"
  | "bookmark"
  | "navigation"
  | "contribute"
  | "ui_interaction"
  | "collection";

/**
 * Analytics event interface
 */
interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

/**
 * Hook for tracking user interactions
 */
export function useAnalytics() {
  /**
   * Initialize analytics
   */
  useEffect(() => {
    // This would typically initialize your analytics provider
    // For example: Google Analytics, Plausible, etc.
    console.log("Analytics initialized");

    // Return cleanup function
    return () => {
      console.log("Analytics cleanup");
    };
  }, []);

  /**
   * Track a user event
   */
  const trackEvent = useCallback(
    ({
      category,
      action,
      label,
      value,
      nonInteraction = false,
    }: AnalyticsEvent) => {
      // In a real implementation, this would send the event to your analytics provider
      console.log(
        `[Analytics] ${category}: ${action}${label ? ` (${label})` : ""}${value !== undefined ? ` - ${value}` : ""}`,
      );

      // Example of how you would send this to Google Analytics
      if (typeof window !== "undefined" && "gtag" in window) {
        // @ts-ignore - gtag might not be typed
        window.gtag("event", action, {
          event_category: category,
          event_label: label,
          value: value,
          non_interaction: nonInteraction,
        });
      }
    },
    [],
  );

  /**
   * Track a page view
   */
  const trackPageView = useCallback((url: string, title?: string) => {
    // In a real implementation, this would send the pageview to your analytics provider
    console.log(`[Analytics] Pageview: ${url}${title ? ` (${title})` : ""}`);

    // Example of how you would send this to Google Analytics
    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore - gtag might not be typed
      window.gtag(
        "config",
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string,
        {
          page_path: url,
          page_title: title,
        },
      );
    }
  }, []);

  /**
   * Track a resource view
   */
  const trackResourceView = useCallback(
    (resourceId: number, name: string, category: string) => {
      trackEvent({
        category: "resource_interaction",
        action: "view",
        label: `${category} - ${name}`,
        value: resourceId,
      });
    },
    [trackEvent],
  );

  /**
   * Track a bookmark action
   */
  const trackBookmark = useCallback(
    (resourceId: number, name: string, isBookmarked: boolean) => {
      trackEvent({
        category: "bookmark",
        action: isBookmarked ? "add" : "remove",
        label: name,
        value: resourceId,
      });
    },
    [trackEvent],
  );

  /**
   * Track a search action
   */
  const trackSearch = useCallback(
    (query: string, resultCount: number) => {
      trackEvent({
        category: "search",
        action: "query",
        label: query,
        value: resultCount,
      });
    },
    [trackEvent],
  );

  /**
   * Track a filter action
   */
  const trackFilter = useCallback(
    (filterType: string, value: string) => {
      trackEvent({
        category: "filter",
        action: "apply",
        label: `${filterType}: ${value}`,
      });
    },
    [trackEvent],
  );

  /**
   * Track a layout change
   */
  const trackLayoutChange = useCallback(
    (layoutType: string) => {
      trackEvent({
        category: "ui_interaction",
        action: "change_layout",
        label: layoutType,
      });
    },
    [trackEvent],
  );

  return {
    trackEvent,
    trackPageView,
    trackResourceView,
    trackBookmark,
    trackSearch,
    trackFilter,
    trackLayoutChange,
  };
}
