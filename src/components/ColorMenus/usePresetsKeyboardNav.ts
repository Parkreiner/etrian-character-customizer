import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowKey, isArrowKey } from "@/utils/keyboard";
import { clamp } from "@/utils/math";

export function mapKeyToGridIndex(
  itemCount: number,
  gridCount: number,
  currentIndex: number,
  arrowKey: ArrowKey
): number {
  /**
   * Guard clause serves two purposes here:
   * 1. It spares us all the calculations if there are no items somehow
   * 2. You can safely tack on (|| gridCount) to itemsOnLastRow, because the
   *    clause ensures that if the remainder operation produces zero, that's
   *    because the last row definitely has (gridCount) number of items
   */
  if (itemCount === 0) {
    return 0;
  }

  const rowIndex = Math.floor(currentIndex / gridCount);
  const colIndex = currentIndex % gridCount;
  const maxRowIndex = Math.floor(itemCount / gridCount);
  const maxColIndex = Math.floor(itemCount / maxRowIndex);

  const itemsOnLastRow = (itemCount % gridCount) % gridCount;
  const itemsInCurrentColumn =
    maxRowIndex + 1 - (colIndex > itemsOnLastRow - 1 ? 1 : 0);

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
      const base = rowIndex === maxRowIndex ? itemsOnLastRow : gridCount;
      offsetColIndex = colIndex === base - 1 ? 0 : colIndex + 1;
      break;
    }

    case "ArrowUp": {
      offsetRowIndex = rowIndex === 0 ? itemsInCurrentColumn - 1 : rowIndex - 1;
      break;
    }

    case "ArrowDown": {
      offsetRowIndex = rowIndex === itemsInCurrentColumn - 1 ? 0 : rowIndex + 1;
      break;
    }
  }

  const lastItemIndex = itemCount - 1;
  const computedIndex = maxColIndex * offsetRowIndex + offsetColIndex;
  return clamp(computedIndex, 0, lastItemIndex);
}

export default function usePresetsKeyboardNav<Element extends HTMLElement>(
  numPresets: number
) {
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // gridColumnCount does not need to be accessed in render logic
  const gridColumnCountRef = useRef(0);
  const gridContainerRef = useRef<Element>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Since I have to move the render state to mutable state, I figured I'd just
  // use one object
  const updateInfoRef = useRef({ activePresetIndex, numPresets });
  useEffect(() => {
    updateInfoRef.current = { activePresetIndex, numPresets };
  }, [numPresets, activePresetIndex]);

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

  // Makes sure that the selected element scrolls into view (but only if the
  // parent has focus)
  useEffect(() => {
    const gridContainer = gridContainerRef.current;
    if (gridContainer === null) return;

    if (gridContainer.contains(document.activeElement)) {
      activeButtonRef.current?.focus();
    }
  }, [activePresetIndex]);

  // Not exposing the raw state dispatch because that spells trouble
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
    setActivePresetIndex: safeSetActivePresetIndex,
  } as const;
}
