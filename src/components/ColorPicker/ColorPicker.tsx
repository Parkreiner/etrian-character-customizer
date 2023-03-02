import { useState } from "react";
import { SkinColorOption, SKIN_COLOR_PRESETS } from "@/typesConstants/colors";
import SkinColorPicker from "./SkinColorPicker";
import TabGroup from "@/components/TabGroup";
import { Character } from "@/typesConstants/characters";

const tabs = ["skin", "hair", "eyes"] as const;
type Tab = (typeof tabs)[number];

const defaultSkinColor = [
  { red: 155, green: 118, blue: 85 },
  { red: 94, green: 74, blue: 64 },
] as const satisfies SkinColorOption;

type Props = {
  character: Character;
};

function ColorPicker({}: Omit<Props, "character">) {
  const [activeTab, setActiveTab] = useState<Tab>("skin");
  const [activeColor, setActiveColor] =
    useState<SkinColorOption>(defaultSkinColor);

  const resetColors = () => {
    setActiveColor(defaultSkinColor);
  };

  return (
    <>
      <section className="w-1/4 flex-grow-[2]">
        <div>
          <TabGroup
            options={tabs}
            selected={activeTab}
            onTabChange={setActiveTab}
          />

          <section className="bg-teal-600">
            {activeTab === "skin" && (
              <SkinColorPicker
                activeColor={activeColor}
                defaultColor={defaultSkinColor}
                colorOptions={SKIN_COLOR_PRESETS}
                onColorChange={setActiveColor}
              />
            )}

            {activeTab === "hair" && <div>Hair!</div>}
            {activeTab === "eyes" && <div>Eyes!</div>}
          </section>
        </div>

        <button
          className="m-auto block rounded-full bg-teal-200 px-4 py-2"
          onClick={resetColors}
        >
          Reset all colors
        </button>
      </section>
    </>
  );
}

export default function ColorPickerWrapper({ character, ...delegated }: Props) {
  return <ColorPicker key={character.id} {...delegated} />;
}
