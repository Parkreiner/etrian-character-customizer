import { useId, useLayoutEffect, useRef } from "react";

type Props = {
  hue: number;
  onHueChange: (newHue: number) => void;
};

export default function HueWheel({ hue, onHueChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const hookId = useId();
  const textId = `${hookId}-text`;

  useLayoutEffect(() => {
    const container = containerRef.current;
    const slider = sliderRef.current;
    if (!container || !slider) return;

    const radius = container.offsetWidth / 2;
    const yVector = radius * Math.sin(hue);
    const xVector = radius * Math.cos(hue);

    console.log({ xVector, yVector });

    const topOffset = NaN;
    const leftOffset = NaN;

    slider.style.top = `${topOffset}px`;
    slider.style.left = `${leftOffset}px`;
  }, [hue]);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-col items-center text-yellow-50">
        <label htmlFor={textId} className="font-bold">
          Hue
        </label>
        <span>
          {/* Ranges are a little funky to make hue wrap-arounds easier */}
          <input
            id={textId}
            className="no-arrow h-16 bg-teal-600 text-right text-[72px] font-extrabold hover:ring-red-900"
            type="number"
            min="-1"
            max="360"
            step="1"
            value={hue}
            onChange={(e) => {
              const eventHue = e.target.valueAsNumber;
              const dispatchedHue = eventHue < 0 ? 359 : eventHue % 360;
              onHueChange(dispatchedHue);
            }}
          />
          <span className="text-[72px]">°</span>
        </span>
      </div>

      <div ref={sliderRef} style={{ position: "absolute" }}></div>
    </div>
  );
}
