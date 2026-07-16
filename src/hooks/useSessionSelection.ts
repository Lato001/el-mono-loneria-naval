import { useEffect, useState } from "react";

export interface UseSessionSelection {
  selected: Set<string>;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  hydrated: boolean;
}

function readFromStorage(storageKey: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function writeToStorage(storageKey: string, set: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify([...set]));
  } catch {
    /* swallow: in-memory only */
  }
}

export function useSessionSelection(key: string): UseSessionSelection {
  const [selected, setSelected] = useState<Set<string>>(() =>
    readFromStorage(key),
  );

  useEffect(() => {
    writeToStorage(key, selected);
  }, [key, selected]);

  const isSelected = (id: string) => selected.has(id);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const remove = (id: string) =>
    setSelected((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const clear = () => setSelected(new Set());

  // hydrated is always true for Vite SPA: lazy useState reads sessionStorage
  // synchronously before first render, so the selection is available immediately.
  return { selected, isSelected, toggle, remove, clear, count: selected.size, hydrated: true };
}
