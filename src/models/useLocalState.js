import { useState } from "react";

export function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  const set = (value) => {
    setState(value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to persist state to localStorage:", error);
    }
  };

  return [state, set];
}
