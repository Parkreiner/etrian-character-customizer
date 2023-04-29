import { useEffect, useId, useLayoutEffect, useRef } from "react";
import useSquareDimensions from "./useSquareDimensions";

type Props = {
  hue: number;
  onHueChange: (newHue: number) => void;
};

const RADIAN_CONVERSION_FACTOR = Math.PI / 180;

const cardinalDirections = {
  ArrowRight: 0,
  ArrowUp: 90,
  ArrowLeft: 180,
  ArrowDown: 270,
} as const satisfies Record<string, number>;

function isArrowKey(value: unknown): value is keyof typeof cardinalDirections {
  return (
    typeof value === "string" &&
    (value as keyof typeof cardinalDirections) in cardinalDirections
  );
}

export default function ColorHueWheel({ hue, onHueChange }: Props) {
  const instanceId = useId();

  const { size: containerSize, ref: containerRef } =
    useSquareDimensions<HTMLDivElement>();

  const { size: sliderSize, ref: sliderRef } =
    useSquareDimensions<HTMLButtonElement>();

  useLayoutEffect(() => {
    const slider = sliderRef.current;
    if (!slider || containerSize === null || sliderSize === null) return;

    const radians = hue * RADIAN_CONVERSION_FACTOR;
    const containerRadius = containerSize / 2;
    const yMagnitude = containerRadius * Math.sin(radians);
    const xMagnitude = containerRadius * Math.cos(radians);

    const sliderRadius = sliderSize / 2;
    const topOffset = containerRadius - yMagnitude - sliderRadius;
    const leftOffset = containerRadius + xMagnitude - sliderRadius;

    slider.style.top = `${topOffset}px`;
    slider.style.left = `${leftOffset}px`;
  }, [hue, containerSize, sliderSize, sliderRef]);

  const hueRef = useRef(hue);
  const onHueChangeRef = useRef(onHueChange);

  useEffect(() => {
    hueRef.current = hue;
    onHueChangeRef.current = onHueChange;
  }, [hue, onHueChange]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider === null) return;

    const onKeypress = (event: KeyboardEvent) => {
      const { key } = event;
      if (slider !== document.activeElement || !isArrowKey(key)) {
        return;
      }

      // Have to do this to prevent other elements from scrolling around; only
      // doing it when the key is definitely an arrow key
      event.preventDefault();

      const targetDegree = cardinalDirections[key];
      if (hueRef.current === targetDegree) {
        return;
      }

      const offset = targetDegree - hueRef.current < 0 ? -1 : 1;
      const newHue = hueRef.current + offset;
      const adjustedHue = newHue < 0 ? 359 : newHue % 360;
      onHueChangeRef.current(adjustedHue);
    };

    slider.addEventListener("keydown", onKeypress);
    return () => slider.removeEventListener("keydown", onKeypress);
  }, [sliderRef]);

  const textId = `${instanceId}-text`;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-fit flex-col items-center justify-center rounded-full border-2 border-black p-4 text-yellow-50"
    >
      <label htmlFor={textId} className="mb-1 font-semibold">
        Hue
      </label>

      <div className="flex align-top leading-none">
        {/* Min/max are a little funky to make hue wrap-arounds easier */}
        <input
          id={textId}
          className="no-arrow h-16 bg-teal-900 text-right text-[72px] font-bold hover:ring-red-500"
          type="number"
          min="-1"
          max="360"
          step="1"
          value={hue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const eventHue = e.target.valueAsNumber;
            const adjustedHue = eventHue < 0 ? 359 : eventHue % 360;
            onHueChangeRef.current(adjustedHue);
          }}
        />
        <span className="h-fit text-[72px]">°</span>
      </div>

      <button
        ref={sliderRef}
        className="absolute w-4 rounded-full bg-yellow-400"
      />
    </div>
  );
}
