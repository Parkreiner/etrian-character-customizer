import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowKey, isArrowKey } from "@/utils/keyboard";
import { clamp } from "@/utils/math";

export function mapKeyToGridIndex(
  itemCount: number,
  gridCount: number,
  currentIndex: number,
  arrowKey: ArrowKey
): number {
  if (itemCount === 0) {
    return 0;
  }

  const rowIndex = Math.floor(currentIndex / gridCount);
  const colIndex = currentIndex % gridCount;
  const lastRowIndex = Math.floor(itemCount / gridCount);
  const lastColIndex = Math.floor(itemCount / lastRowIndex);

  /**
   * @todo Still need to fix logic for ArrowUp/ArrowDown so that they can deal
   * with grids that have blanks
   */
  // Have to do some funky logic for some branches to account for when the grid
  // has blanks
  let offsetRowIndex = rowIndex;
  let offsetColIndex = colIndex;
  switch (arrowKey) {
    case "ArrowLeft": {
      offsetColIndex = colIndex === 0 ? gridCount - 1 : colIndex - 1;
      break;
    }

    case "ArrowRight": {
      const itemsOnLastRow = itemCount % gridCount || gridCount;
      const base = rowIndex === lastRowIndex ? itemsOnLastRow : gridCount;
      offsetColIndex = colIndex === base - 1 ? 0 : colIndex + 1;
      break;
    }

    case "ArrowUp": {
      const itemsInColumn = null;
      offsetRowIndex = rowIndex === 0 ? lastRowIndex : rowIndex - 1;
      break;
    }

    case "ArrowDown": {
      offsetRowIndex = rowIndex === lastRowIndex ? 0 : rowIndex + 1;
      break;
    }
  }

  const lastItemIndex = itemCount - 1;
  const computedIndex = lastColIndex * offsetRowIndex + offsetColIndex;
  return clamp(computedIndex, 0, lastItemIndex);
}

export default function usePresetsKeyboardNav<Element extends HTMLElement>(
  numPresets: number
) {
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // Pretty sure I can get away with just using a ref value for the column
  // count, since the value will only ever be used within effects
  const gridColumnCountRef = useRef(0);
  const gridContainerRef = useRef<Element>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    const gridContainer = gridContainerRef.current;
    if (gridContainer === null) return;

    if (gridContainer.contains(document.activeElement)) {
      activeButtonRef.current?.focus();
    }
  }, [activePresetIndex]);

  /**
   * @todo Effect is only for debugging - delete once fully done (and tested!)
   */
  useEffect(() => {
    const gridContainer = gridContainerRef.current;
    if (gridContainer === null) return;

    const intervalId = window.setInterval(() => {
      const newEvent = new KeyboardEvent("keydown", { key: "ArrowUp" });
      gridContainer.dispatchEvent(newEvent);
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
    activeButtonRef,
    activePresetIndex,

    // Not exposing the raw state dispatch because that spells trouble
    setActivePresetIndex: safeSetActivePresetIndex,
  } as const;
}
