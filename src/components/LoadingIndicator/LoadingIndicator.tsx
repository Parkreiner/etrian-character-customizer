/**
 * @file A basic loading indicator for the top-level app.
 */
import { useEffect, useState } from "react";
import { range } from "@/utils/math";

const maxDots = 3;
const dotRange = range(1, maxDots + 1);

export default function LoadingIndicator() {
  const [visibleDots, setVisibleDots] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setVisibleDots((currentDots) => (currentDots + 1) % (maxDots + 1));
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center text-lg text-neutral-900">
      <div className="mb-4 h-[200px] w-[200px] rounded-full bg-teal-700">
        {/**
         * @todo Add tree-like SVG here once I make one.
         */}
      </div>

      <p className="pl-4">
        Loading
        {dotRange.map((dotNum) => (
          <span key={dotNum} style={{ opacity: dotNum <= visibleDots ? 1 : 0 }}>
            .
          </span>
        ))}
      </p>
    </div>
  );
}
