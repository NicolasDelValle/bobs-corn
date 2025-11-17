/**
 * Custom React hooks
 */

import { useState, useEffect, useCallback } from "react";
import type { ApiError } from "@/types";

export function useApi<T>(endpoint: string, autoFetch = false) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<ApiError | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setData(null);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [fetch, autoFetch]);

  return { data, loading, error, refetch: fetch };
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
