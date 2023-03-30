import { useState } from "react";
import { CharacterColors } from "@/typesConstants/colors";
import ColorPicker from "../ColorPicker";

type Props = {
  syncKey: string;
  colors: CharacterColors;
  changeCharacterColors: (replacementColors: CharacterColors) => void;
};

type CoreProps = Omit<Props, "syncKey">;
type ColorCategory = keyof CharacterColors;

function ColorMenus({ colors, changeCharacterColors }: CoreProps) {
  const [colorCategory, setColorCategory] = useState<ColorCategory>("skin");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const hexColor = colors[colorCategory][categoryIndex] ?? "#000000";

  const onColorChange = (newHexColor: string) => {
    const newColors = {
      ...colors,
      [colorCategory]: colors[colorCategory].map((oldHex, index) => {
        return index === categoryIndex ? newHexColor : oldHex;
      }),
    };

    changeCharacterColors(newColors);
  };

  return (
    <div className="flex w-[500px] flex-col items-center bg-teal-600 p-4">
      <ColorPicker hexColor={hexColor} onHexChange={onColorChange} />

      <div
        className="mt-12 h-[250px] w-[250px]"
        style={{ backgroundColor: hexColor }}
      />
    </div>
  );
}

export default function RemountOnSyncChange({ syncKey, ...delegated }: Props) {
  return <ColorMenus key={syncKey} {...delegated} />;
}
