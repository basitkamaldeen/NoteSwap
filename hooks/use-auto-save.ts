import { useEffect } from "react";

export function useAutoSave(callback: () => void, deps: any[], delay = 2000) {
  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, deps);
}
