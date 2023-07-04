/**
 * @todo This file is getting big and involved enough that it probably makes
 * sense to split it off into a separate top-level directory once I'm done
 */
import { useCallback, useEffect, useRef, useState } from "react";

import {
  ColorTuple,
  HAIR_EYE_COLOR_PRESETS,
  SKIN_COLOR_PRESETS,
  MISC_COLOR_PRESETS,
} from "@/typesConstants/colors";
import { ArrowKey, isArrowKey } from "@/utils/keyboard";
import { clamp } from "@/utils/math";

import Card from "@/components/Card/";
import ColorButton from "./ColorButton";
import { UiTab } from "./localTypes";

type Props = {
  activeTab: UiTab;
  onHexPresetChange: (hex1: string, hex2: string) => void;
};

export function mapKeyToGridIndex(
  itemCount: number,
  gridCount: number,
  currentIndex: number,
  arrowKey: ArrowKey
): number {
  const rowIndex = Math.floor(currentIndex / gridCount);
  const colIndex = currentIndex % gridCount;
  const lastRowIndex = Math.floor(itemCount / gridCount);
  const lastColIndex = Math.floor(itemCount / lastRowIndex);

  let offsetRowIndex = rowIndex;
  let offsetColIndex = colIndex;
  switch (arrowKey) {
    // Only ArrowLeft seems to be 100% working right now; all other arrows have
    // issues if you're dealing with a grid that has blanks
    case "ArrowLeft": {
      offsetColIndex = colIndex === 0 ? gridCount - 1 : colIndex - 1;
      break;
    }

    case "ArrowRight": {
      offsetColIndex = colIndex === gridCount - 1 ? 0 : colIndex + 1;
      break;
    }

    case "ArrowUp": {
      offsetRowIndex = rowIndex === 0 ? lastRowIndex : rowIndex - 1;
      break;
    }

    case "ArrowDown": {
      offsetRowIndex = rowIndex === lastRowIndex ? 0 : rowIndex + 1;
      break;
    }

    default: {
      throw new Error("Unknown input received.");
    }
  }

  const lastItemIndex = itemCount - 1;
  const computedIndex = lastColIndex * offsetRowIndex + offsetColIndex;
  return Math.min(computedIndex, lastItemIndex);
}

function usePresetsKeyboardNav<Element extends HTMLElement>(
  numPresets: number
) {
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // Pretty sure I can get away with just using a ref value for the column
  // count, since the value will only ever be used within effects
  const gridColumnCountRef = useRef(0);
  const gridContainerRef = useRef<Element>(null);
  const updateInfoRef = useRef({ activePresetIndex, numPresets });

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

  useEffect(() => {
    updateInfoRef.current = { activePresetIndex, numPresets };
  }, [numPresets, activePresetIndex]);

  // Effect for listening to keyboard input; must run after column resize effect
  useEffect(() => {
    const gridContainer = gridContainerRef.current;
    if (gridContainer === null) return;

    const handleKeyInput = (event: KeyboardEvent) => {
      const { key } = event;
      if (!isArrowKey(key)) return;

      event.preventDefault();
      const { activePresetIndex, numPresets } = updateInfoRef.current;

      if (numPresets === 0) {
        return;
      }

      const newIndex = mapKeyToGridIndex(
        numPresets,
        gridColumnCountRef.current,
        activePresetIndex,
        key
      );

      setActivePresetIndex(newIndex);
    };

    gridContainer.addEventListener("keydown", handleKeyInput);
    return () => gridContainer.removeEventListener("keydown", handleKeyInput);
  }, []);

  /**
   * @todo Effect is only for debugging - delete once fully done (and tested!)
   */
  useEffect(() => {
    const gridContainer = gridContainerRef.current;
    if (gridContainer === null) return;

    const intervalId = window.setInterval(() => {
      gridContainer.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight" })
      );
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  const safeSetActivePresetIndex = useCallback(
    (newIndex: number) => {
      setActivePresetIndex((current) => {
        if (!Number.isInteger(newIndex) || newIndex < 0) return current;
        return clamp(newIndex, 0, numPresets - 1);
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
      {colorTuples.map(([hex1, hex2], index) => {
        const selected = index === activePresetIndex;

        return (
          <li key={`${hex1}-${hex2}`} className="mx-auto block">
            <ColorButton
              primaryHex={hex1}
              secondaryHex={hex2}
              selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                onHexPresetChange(hex1, hex2);
                setActivePresetIndex(index);
              }}
            />
          </li>
        );
      })}
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
