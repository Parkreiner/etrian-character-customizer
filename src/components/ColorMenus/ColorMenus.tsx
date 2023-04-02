/**
 * @file Contains all the core logic for managing colors for a character.
 *
 * This is a complicated component, and while I tried to split it up, all those
 * attempts seemed to make things worse, not just for performance, but also for
 * readability. If you're using VSCode, consider collapsing the function
 * and array/object definitions to make things a bit more navigable.
 *
 * At the very least, *using* the component should be simple. You only have to
 * worry about what you're passing in to satisfy ExternalProps.
 */
import { useState } from "react";
import { clamp } from "@/utils/math";
import { UiTab } from "./localTypes";
import { baseTabInfo } from "./localConstants";
import {
  CharacterColors,
  ColorCategory,
  ColorTuple,
} from "@/typesConstants/colors";

import ColorPicker from "@/components/ColorPicker";
import ControlsContainer, {
  TabContentInfo,
} from "@/components/ControlsContainer";

type ExternalProps = {
  /**
   * A key for linking a character to the ColorsMenu component.
   *
   * Whenever the key changes, the entire ColorsMenu component will reset to its
   * default state, using the current character's starting colors as the
   * component's new starting colors.
   */
  characterKey: string;

  colors: CharacterColors;
  onColorChange: (newColors: CharacterColors) => void;
};

type CategoryIndices = {
  [key in ColorCategory]: key extends "misc" ? number : 0 | 1;
};

const initialIndices: CategoryIndices = {
  skin: 0,
  hair: 0,
  leftEye: 0,
  rightEye: 0,
  misc: 0,
};

type CoreProps = Omit<ExternalProps, "characterKey">;

function ColorMenusCore({ colors, onColorChange }: CoreProps) {
  const [activeCategory, setActiveCategory] = useState<ColorCategory>("skin");
  const [activeIndices, setActiveIndices] = useState(initialIndices);
  const [eyesLinked, setEyesLinked] = useState(true);

  const toggleLink = () => setEyesLinked((current) => !current);

  const onHexChange = (newHexColor: string) => {
    const activeIndex = activeIndices[activeCategory];
    const updateBothEyes =
      eyesLinked &&
      (activeCategory === "leftEye" || activeCategory === "rightEye");

    const skipUpdate =
      (updateBothEyes &&
        newHexColor === colors.leftEye[activeIndex] &&
        newHexColor === colors.rightEye[activeIndex]) ||
      newHexColor === colors[activeCategory][activeIndex];

    if (skipUpdate) return;
    const newTuple = colors[activeCategory].map((oldHex, index) => {
      return index === activeIndex ? newHexColor : oldHex;
    });

    if (updateBothEyes) {
      // This is really ugly, but it's just a limitation of the built-in
      // Array.map method typing. It can't preserve tuple lengths
      onColorChange({
        ...colors,
        leftEye: newTuple as unknown as ColorTuple,
        rightEye: newTuple as unknown as ColorTuple,
      });
    } else {
      // I have no idea why TypeScript isn't complaining here; the operation is
      // safe, but it should be detecting that this is mixing arrays/tuples
      onColorChange({ ...colors, [activeCategory]: newTuple });
    }
  };

  const onCategoryIndexChange = (newIndex: number) => {
    if (activeCategory === "misc") {
      const normalized =
        Number.isInteger(newIndex) && newIndex >= 0 ? newIndex : 0;

      const clamped = clamp(normalized, 0, colors.misc.length);
      const skipUpdate = clamped === activeIndices.misc;

      if (skipUpdate) return;
      return setActiveIndices({ ...activeIndices, misc: clamped });
    }

    const skipUpdate =
      newIndex === activeIndices[activeCategory] ||
      (newIndex !== 0 && newIndex !== 1);

    if (skipUpdate) return;
    setActiveIndices({ ...activeIndices, [activeCategory]: newIndex });
  };

  const onTabChange = (newTab: UiTab) => {
    const newCategory = newTab === "eyes" ? "leftEye" : newTab;
    setActiveCategory(newCategory);
  };

  const activeTab: UiTab =
    activeCategory === "leftEye" || activeCategory === "rightEye"
      ? "eyes"
      : activeCategory;

  const fullTabInfo = baseTabInfo.map((info) => {
    if (info.value !== "misc") return info;
    return { ...info, display: colors.misc.length > 0 };
  });

  const contentInfo: TabContentInfo<UiTab>[] = [
    {
      value: "skin",
      content: (
        <fieldset>
          <button type="button" onClick={() => onCategoryIndexChange(0)}>
            Skin 1
          </button>

          <button type="button" onClick={() => onCategoryIndexChange(1)}>
            Skin 2
          </button>

          <ColorPicker
            hexColor={colors.skin[activeIndices.skin]}
            onHexChange={onHexChange}
          />
        </fieldset>
      ),
    },
    {
      value: "hair",
      content: <p>Here's some hair!</p>,
    },
    {
      value: "eyes",
      content: (
        <fieldset>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("leftEye");
              onCategoryIndexChange(0);
            }}
          >
            Left eye 1
          </button>

          <br />

          <button
            type="button"
            onClick={() => {
              setActiveCategory("leftEye");
              onCategoryIndexChange(1);
            }}
          >
            Left eye 2
          </button>

          <br />

          <button
            type="button"
            onClick={() => {
              setActiveCategory("rightEye");
              onCategoryIndexChange(0);
            }}
          >
            Right eye 1
          </button>

          <br />

          <button
            type="button"
            onClick={() => {
              setActiveCategory("rightEye");
              onCategoryIndexChange(1);
            }}
          >
            Right eye 2
          </button>

          <br />

          <label>
            Link eyes?
            <input type="checkbox" checked={eyesLinked} onChange={toggleLink} />
          </label>

          {/**
           * This condition is redundant at runtime, but necessary to
           * provide type narrowing to TypeScript at compile-time
           */}
          {(activeCategory === "leftEye" || activeCategory === "rightEye") && (
            <ColorPicker
              hexColor={colors[activeCategory][activeIndices[activeCategory]]}
              onHexChange={onHexChange}
            />
          )}
        </fieldset>
      ),
    },
  ];

  return (
    <ControlsContainer<UiTab>
      value={activeTab}
      onValueChange={onTabChange}
      ariaLabel="Select which part you want to customize"
      tabInfo={fullTabInfo}
      tabContent={contentInfo}
    />
  );
}

export default function RemountOnKeyChange({
  characterKey,
  ...delegated
}: ExternalProps) {
  return <ColorMenusCore key={characterKey} {...delegated} />;
}
