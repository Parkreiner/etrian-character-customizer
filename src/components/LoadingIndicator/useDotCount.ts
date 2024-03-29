import { useState, useEffect } from "react";
import { maxLoadingDots } from "./localConstants";

export default function useDotCount() {
  const [visibleDots, setVisibleDots] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setVisibleDots((currentDots) => (currentDots + 1) % (maxLoadingDots + 1));
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  return visibleDots;
}
