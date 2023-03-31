/**
 * @file This component is doing some weird things to make TypeScript happy.
 *
 * The big problem is that hair/skin/eyes are defined as fixed-length tuples,
 * but misc is defined as an arbitrary-length array. Normally this is fine, but
 * when you try to do polymorphic behavior and things don't fully line up, you
 * have to do *something* to separate everything dealing with misc from
 * everything else.
 */
import { ColorCategory, categoryIterable } from "@/typesConstants/colors";
import { NonMiscPanel, CategoryIndices } from "./localTypes";

import { Content as TabsContent } from "@/components/Tabs";
import { SkinPanel, HairPanel, EyesPanel, MiscPanel } from "./PanelFragments";

type NonMiscCategory = Exclude<ColorCategory, "misc">;

const nonMiscPanels = {
  skin: SkinPanel,
  eyes: EyesPanel,
  hair: HairPanel,
} as const satisfies Record<NonMiscCategory, NonMiscPanel>;

type Props = {
  categoryIndices: CategoryIndices;
  onCategoryIndexChange: (newIndex: number) => void;
  onHexChange: (newHex: string) => void;
};

export default function PanelContent({
  categoryIndices,
  onCategoryIndexChange,
  onHexChange,
}: Props) {
  const toContentPanel = (category: ColorCategory, index: number) => {
    let content: JSX.Element;
    if (category === "misc") {
      content = (
        <MiscPanel
          selectedIndex={categoryIndices.misc}
          onIndexChange={onCategoryIndexChange}
          onColorChange={onHexChange}
        />
      );
    } else {
      const Polymorphic = nonMiscPanels[category];
      content = (
        <Polymorphic
          selectedIndex={categoryIndices[category]}
          onIndexChange={onCategoryIndexChange}
          onColorChange={onHexChange}
        />
      );
    }

    return (
      <TabsContent key={index} value={category}>
        {content}
      </TabsContent>
    );
  };

  return <>{categoryIterable.map(toContentPanel)}</>;
}
