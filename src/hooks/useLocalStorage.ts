import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for persisting state in localStorage with proper error handling and TypeScript support
 * @param {string} key - localStorage key
 * @param {T} initialValue - Default value
 * @returns {[T, Function, Function]} Array containing current value, setter function, and reset function
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initialize from localStorage on component mount
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const item = window.localStorage.getItem(key);

      if (item) {
        try {
          const parsedItem = JSON.parse(item);
          setStoredValue(parsedItem);
        } catch (parseError) {
          console.error(
            `Error parsing localStorage item '${key}':`,
            parseError
          );
          // If parsing fails, reset to initialValue
          window.localStorage.setItem(key, JSON.stringify(initialValue));
        }
      } else {
        // Initialize localStorage if item doesn't exist
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch (error) {
      console.error(`Error accessing localStorage for key '${key}':`, error);
    }
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error saving to localStorage for key '${key}':`, error);
      }
    },
    [key, storedValue]
  );

  // Function to reset storage to initial value
  const resetToInitial = useCallback(() => {
    setStoredValue(initialValue);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(initialValue));
    }
  }, [key, initialValue]);

  return [storedValue, setValue, resetToInitial];
}
