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

    const topOffset = NaN;
    const leftOffset = NaN;

    slider.style.top = `${topOffset}px`;
    slider.style.left = `${leftOffset}px`;
  }, [hue]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div>
        <label htmlFor={textId}>Hue</label>
        {/* Ranges aren't 0-360 to make it easy to do hue wrap-arounds */}
        <input
          id={textId}
          type="number"
          min="-1"
          max="361"
          step="1"
          value={hue}
          onChange={(e) => {
            const eventHue = e.target.valueAsNumber;
            const dispatchedHue = eventHue < 0 ? 360 : eventHue % 361;
            onHueChange(dispatchedHue);
          }}
        />
        °
      </div>

      <div ref={sliderRef} style={{ position: "absolute" }}></div>
    </div>
  );
}
