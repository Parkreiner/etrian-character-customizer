import { useState, Fragment } from "react";
import { clamp } from "@/utils/math";
import { UiTab } from "./localTypes";
import { baseTabInfo } from "./constants";
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
  syncKey: string;
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

type CoreProps = Omit<ExternalProps, "syncKey">;

function ColorMenusCore({ colors, onColorChange }: CoreProps) {
  const [activeCategory, setActiveCategory] = useState<ColorCategory>("skin");
  const [activeIndices, setActiveIndices] = useState(initialIndices);
  const [eyesLinked, setEyesLinked] = useState(true);

  const toggleLink = () => setEyesLinked((current) => !current);

  const onHexChange = (newHexColor: string) => {
    const activeIndex = activeIndices[activeCategory];
    const newTuple = colors[activeCategory].map((oldHex, index) => {
      return index === activeIndex ? newHexColor : oldHex;
    });

    const bothEyesNeedUpdate =
      eyesLinked &&
      (activeCategory === "leftEye" || activeCategory === "rightEye");

    if (bothEyesNeedUpdate) {
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
      const normalized = Number.isNaN(newIndex) ? 0 : newIndex;
      const clamped = clamp(normalized, 0, colors.misc.length);

      const needUpdate = clamped !== activeIndices.misc;
      if (needUpdate) {
        setActiveIndices({ ...activeIndices, misc: clamped });
      }

      return;
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

  const content: TabContentInfo<UiTab>[] = [
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
      value: "eyes",
      content: (
        <Fragment>
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
        </Fragment>
      ),
    },
  ];

  return (
    <ControlsContainer<UiTab>
      value={activeTab}
      onValueChange={onTabChange}
      ariaLabel="Select which part you want to customize"
      tabInfo={fullTabInfo}
      tabContent={content}
    />
  );
}

export default function RemountOnKeyChange({
  syncKey,
  ...delegated
}: ExternalProps) {
  return <ColorMenusCore key={syncKey} {...delegated} />;
}
