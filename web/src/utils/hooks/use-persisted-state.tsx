"use client";
import { useEffect, useState } from "react";

/**
 * A custom hook that manages a state variable and synchronizes it with localStorage.
 *
 * @param key - The key under which the value is stored in localStorage.
 * @param initialValue - The initial value to be used if no value is found in localStorage.
 * @returns An array containing the current value and a function to update it.
 */

const usePersistedState = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState(() => {
    // Make sure we are in the browser, not server
    if (typeof window === "undefined") return initialValue;

    try {
      const item = localStorage.getItem(key);

      // If item is not found, return initial value
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};

export default usePersistedState;
