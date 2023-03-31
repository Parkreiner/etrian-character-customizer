import { useState } from "react";
import { clamp } from "@/utils/math";
import { CharacterColors, ColorCategory } from "@/typesConstants/colors";
import { CategoryIndices } from "./localTypes";

import * as Tabs from "@/components/Tabs";
import ColorPanels from "./ColorPanels";
import ColorTab from "./ColorTab";

type ExternalProps = {
  syncKey: string;
  colors: CharacterColors;
  onColorChange: (newColors: CharacterColors) => void;
};

const initialIndices: CategoryIndices = {
  hair: 0,
  eyes: 0,
  skin: 0,
  misc: 0,
};

type CoreProps = Omit<ExternalProps, "syncKey">;

function ColorMenusCore({ colors, onColorChange }: CoreProps) {
  const [activeCategory, setActiveCategory] = useState<ColorCategory>("skin");
  const [categoryIndices, setCategoryIndices] = useState(initialIndices);

  const onHexChange = (newHexColor: string) => {
    const activeIndex = categoryIndices[activeCategory];
    const newTuple = colors[activeCategory].map((oldHex, index) => {
      return index === activeIndex ? newHexColor : oldHex;
    });

    onColorChange({ ...colors, [activeCategory]: newTuple });
  };

  const changeIndex = (newIndex: number) => {
    if (activeCategory === "misc") {
      const normalized = Number.isNaN(newIndex) ? 0 : newIndex;
      const clamped = clamp(normalized, 0, colors.misc.length);

      if (clamped === categoryIndices.misc) return;
      return setCategoryIndices({ ...categoryIndices, misc: clamped });
    }

    const shouldUpdate =
      (newIndex === 0 || newIndex === 1) &&
      newIndex !== categoryIndices[activeCategory];

    if (!shouldUpdate) return;
    setCategoryIndices({ ...categoryIndices, [activeCategory]: newIndex });
  };

  const hasMisc = colors.misc.length > 0;

  return (
    <Tabs.Root
      className="flex w-[500px] flex-col items-center bg-teal-600 p-4"
      value={activeCategory}
      defaultValue="skin"
      onValueChange={(value) => setActiveCategory(value)}
    >
      <Tabs.List aria-label="Change color categories">
        <ColorTab tabType="skin">S</ColorTab>
        <ColorTab tabType="eyes">E</ColorTab>
        <ColorTab tabType="hair">H</ColorTab>
        {hasMisc && <ColorTab tabType="misc">M</ColorTab>}
      </Tabs.List>

      <ColorPanels
        categoryIndices={categoryIndices}
        onCategoryIndexChange={changeIndex}
        onHexChange={onHexChange}
      />
    </Tabs.Root>
  );
}

export default function RemountOnKeyChange({
  syncKey,
  ...delegated
}: ExternalProps) {
  return <ColorMenusCore key={syncKey} {...delegated} />;
}
