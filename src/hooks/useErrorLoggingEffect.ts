import { useEffect } from "react";
import { handleError } from "@/utils/errors";

export default function useErrorLoggingEffect(value: unknown) {
  useEffect(() => {
    if (value === undefined || value === null) return;
    handleError(value);
  }, [value]);
}
