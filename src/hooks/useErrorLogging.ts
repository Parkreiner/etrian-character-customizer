import { useCallback, useEffect } from "react";
import { handleError } from "@/utils/errors";

export function useErrorLoggingCallback() {
  return useCallback((...values: readonly unknown[]) => {
    handleError(values);
  }, []);
}

export function useErrorLoggingEffect(value: unknown) {
  useEffect(() => {
    if (value === undefined || value === null) return;
    handleError(value);
  }, [value]);
}
