import {
  ColorTuple,
  HAIR_EYE_COLOR_PRESETS,
  SKIN_COLOR_PRESETS,
  MISC_COLOR_PRESETS,
} from "@/typesConstants/colors";

import Card from "../Card/";
import ColorButton from "./ColorButton";
import { UiTab } from "./localTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowKey, isArrowKey } from "@/utils/keyboard";
import { clamp } from "@/utils/math";

type Props = {
  activeTab: UiTab;
  onHexPresetChange: (hex1: string, hex2: string) => void;
};

function mapKeyToNewIndex(
  colorCount: number,
  gridCount: number,
  arrowKey: ArrowKey
): number {
  return 0;
}

function usePresetsKeyboardNav<Element extends HTMLElement>(
  numPresets: number
) {
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // Pretty sure I can get away with just using a ref value for the column
  // count, since the value will only ever be used within effects
  const gridColumnCountRef = useRef(0);
  const gridContainerRef = useRef<Element>(null);
  const numPresetsRef = useRef(numPresets);

  useEffect(() => {
    numPresetsRef.current = numPresets;
  }, [numPresets]);

  // Effect for updating the number of columns as the element resizes
  useEffect(() => {
    const gridContainer = gridContainerRef.current;
    if (gridContainer === null) return;

    const updateColumnCountOnResize = () => {
      const gridStyling = window.getComputedStyle(gridContainer);
      const count = gridStyling
        .getPropertyValue("grid-template-columns")
        .split(" ").length;

      gridColumnCountRef.current = count;
    };

    const observer = new ResizeObserver(updateColumnCountOnResize);
    observer.observe(gridContainer);
    return () => observer.disconnect();
  }, []);

  // Effect for listening to keyboard input; must run after column resize effect
  useEffect(() => {
    const gridContainer = gridContainerRef.current;
    if (gridContainer === null) return;

    const handleKeyInput = (event: KeyboardEvent) => {
      const { key } = event;
      if (!isArrowKey(key)) return;

      event.preventDefault();
      if (numPresetsRef.current === 0) {
        return;
      }

      const newIndex = mapKeyToNewIndex(
        numPresetsRef.current,
        gridColumnCountRef.current,
        key
      );

      setActivePresetIndex(newIndex);
    };

    gridContainer.addEventListener("keydown", handleKeyInput);
    return () => gridContainer.removeEventListener("keydown", handleKeyInput);
  }, []);

  const safeSetActivePresetIndex = useCallback(
    (newIndex: number) => {
      setActivePresetIndex((current) => {
        if (!Number.isInteger(newIndex) || newIndex < 0) return current;
        return clamp(newIndex, 0, numPresets);
      });
    },
    [numPresets]
  );

  return {
    gridContainerRef,
    activePresetIndex,
    setActivePresetIndex: safeSetActivePresetIndex,
  } as const;
}

const colorPresets = {
  eyes: HAIR_EYE_COLOR_PRESETS,
  hair: HAIR_EYE_COLOR_PRESETS,
  skin: SKIN_COLOR_PRESETS,
  misc: MISC_COLOR_PRESETS,
} as const satisfies Record<UiTab, readonly ColorTuple[]>;

type PresetsListProps = Omit<Props, "activeTab"> & {
  colorTuples: readonly ColorTuple[];
};

/**
 * @todo Make empty state for when colors aren't available
 * @todo Extract out the arrow key logic into a separate utils file
 * @todo Also need to figure out how tab indexing and keyboard navigation even
 * work here.
 */
function ColorPresetList({ colorTuples, onHexPresetChange }: PresetsListProps) {
  const { gridContainerRef, activePresetIndex, setActivePresetIndex } =
    usePresetsKeyboardNav<HTMLUListElement>(colorTuples.length);

  return (
    <ul
      ref={gridContainerRef}
      className="mt-1 grid w-full max-w-[400px] grid-cols-3 justify-between gap-3"
    >
      {colorTuples.map(([hex1, hex2], index) => (
        <li key={`${hex1}-${hex2}`} className="mx-auto block">
          <ColorButton
            primaryHex={hex1}
            secondaryHex={hex2}
            selected={index === activePresetIndex}
            onClick={() => {
              onHexPresetChange(hex1, hex2);
              setActivePresetIndex(index);
            }}
          />
        </li>
      ))}
    </ul>
  );
}

export default function ColorPresets({ activeTab, onHexPresetChange }: Props) {
  const selectedList = colorPresets[activeTab];

  return (
    <Card title={`Presets (${activeTab})`} striped gapSize="small">
      {selectedList.length > 0 ? (
        <ColorPresetList
          key={activeTab}
          colorTuples={selectedList}
          onHexPresetChange={onHexPresetChange}
        />
      ) : (
        <p className="mt-1 rounded-md bg-teal-950/60 px-2 py-3 text-center text-sm font-medium text-teal-100">
          No color presets available.
        </p>
      )}
    </Card>
  );
}
