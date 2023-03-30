/**
 * @file This is a very weird component designed to get around some of the
 * compile-time limitations of TypeScript.
 *
 * The big problem is that hair/skin/eyes are defined as fixed-length tuples,
 * but misc is defined as an arbitrary-length array. Normally this is fine, but
 * when you try to do weird, polymorphic behavior, you have to do *something* to
 * separate everything dealing with misc from everything else.
 *
 * The two return statements in this component are basically the same, and this
 * could be removed in favor of doing the logic inline without anything breaking
 * at runtime. But since the types are different, TS will break at compile time.
 *
 * There should never be styling added to this component; all it does is
 * determine which Panel component to render.
 */
import { ColorCategory } from "@/typesConstants/colors";
import { NonMiscPanel, CategoryIndices } from "./localTypes";

import SkinPanel from "./SkinPanel";
import EyesPanel from "./EyesPanel";
import HairPanel from "./HairPanel";
import MiscPanel from "./MiscPanel";

type NonMiscCategory = Exclude<ColorCategory, "misc">;

const nonMiscPanels = {
  skin: SkinPanel,
  eyes: EyesPanel,
  hair: HairPanel,
} as const satisfies Record<NonMiscCategory, NonMiscPanel>;

type ContentProps = {
  activeCategory: ColorCategory;
  categoryIndices: CategoryIndices;
  onCategoryIndexChange: (newIndex: number) => void;
  onHexChange: (newHex: string) => void;
};

export default function PanelContent({
  activeCategory,
  categoryIndices,
  onCategoryIndexChange,
  onHexChange,
}: ContentProps) {
  if (activeCategory === "misc") {
    return (
      <MiscPanel
        selectedIndex={categoryIndices.misc}
        onIndexChange={onCategoryIndexChange}
        onColorChange={onHexChange}
      />
    );
  }

  const NonMiscComponent = nonMiscPanels[activeCategory];
  return (
    <NonMiscComponent
      selectedIndex={categoryIndices[activeCategory]}
      onIndexChange={onCategoryIndexChange}
      onColorChange={onHexChange}
    />
  );
}
