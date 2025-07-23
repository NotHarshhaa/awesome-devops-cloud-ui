import { useState, useEffect } from "react";

/**
 * Custom hook for detecting if a media query matches.
 * @param query The media query to match against
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with the current match state if in browser, false otherwise (for SSR)
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is defined (browser environment)
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Guard against SSR
    if (typeof window === "undefined") return undefined;

    // Create media query list
    const mediaQueryList = window.matchMedia(query);

    // Update state with initial value
    setMatches(mediaQueryList.matches);

    // Define listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    mediaQueryList.addEventListener("change", listener);

    // Cleanup function
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]); // Re-run if the query changes

  return matches;
}
