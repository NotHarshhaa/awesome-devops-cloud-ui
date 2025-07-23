import { useEffect, useState, useRef, useCallback } from "react";

interface DebounceOptions {
  delay: number;
  maxWait?: number;
  leading?: boolean;
}

// Original version - debounces a value
export function useDebounce<T>(value: T, options: number | DebounceOptions): T {
  const {
    delay,
    maxWait,
    leading = false,
  } = typeof options === "number"
    ? { delay: options, maxWait: undefined, leading: false }
    : options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const maxTimeoutRef = useRef<NodeJS.Timeout>();
  const lastCallRef = useRef<number>(Date.now());
  const hasSetInitialValue = useRef<boolean>(false);

  useEffect(() => {
    // Handle leading edge
    if (leading && !hasSetInitialValue.current) {
      setDebouncedValue(value);
      hasSetInitialValue.current = true;
      lastCallRef.current = Date.now();
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set up new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      lastCallRef.current = Date.now();
    }, delay);

    // Handle maxWait
    if (maxWait && !maxTimeoutRef.current) {
      const timeoutDuration = Math.max(
        0,
        maxWait - (Date.now() - lastCallRef.current),
      );
      maxTimeoutRef.current = setTimeout(() => {
        setDebouncedValue(value);
        lastCallRef.current = Date.now();
        maxTimeoutRef.current = undefined;
      }, timeoutDuration);
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
    };
  }, [value, delay, maxWait, leading]);

  return debouncedValue;
}

// New version - debounces a function
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [callback, delay],
  );
}
