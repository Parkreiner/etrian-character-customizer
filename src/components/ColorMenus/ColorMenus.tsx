import { useState } from "react";
import { Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";
import ColorPicker from "../ColorPicker";

type Props = {
  colors: CharacterColors;
  changeCharacterColors: (replacementColors: CharacterColors) => void;
  selectedCharacter: Character | null;
};

type ColorCategory = keyof CharacterColors;

function ColorMenus({
  colors,
  changeCharacterColors,
}: Omit<Props, "selectedCharacter">) {
  const [colorCategory, setColorCategory] = useState<ColorCategory>("skin");
  const [categoryOption, setCategoryOption] = useState(0);
  const hexColor = colors[colorCategory][categoryOption] ?? "#000000";

  const onColorChange = (newHexColor: string) => {
    const newColors = {
      ...colors,
      [colorCategory]: colors[colorCategory].map((oldHex, index) => {
        return index === categoryOption ? newHexColor : oldHex;
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

export default function WithUnmountBehavior({
  selectedCharacter,
  ...delegated
}: Props) {
  const key = selectedCharacter?.id ?? "";
  return <ColorMenus key={key} {...delegated} />;
}
