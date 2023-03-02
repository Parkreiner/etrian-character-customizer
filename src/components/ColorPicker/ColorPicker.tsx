import { useState } from "react";
import {
  SkinColorOption,
  SKIN_COLOR_PRESETS,
} from "../../typesConstants/colors";
import SkinColorPicker from "./SkinColorPicker";
import TabGroup from "../TabGroup";

const tabs = ["skin", "hair", "eyes"] as const;
type Tab = (typeof tabs)[number];

const defaultSkinColor = [
  { red: 155, green: 118, blue: 85 },
  { red: 94, green: 74, blue: 64 },
] as const satisfies SkinColorOption;

type Props = {};

export default function ColorPicker({}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("skin");
  const [activeColor, setActiveColor] =
    useState<SkinColorOption>(defaultSkinColor);

  const resetState = () => {
    setActiveColor(defaultSkinColor);
  };

  return (
    <section className="mx-auto mt-12 w-1/4 bg-teal-600">
      <TabGroup
        options={tabs}
        activeOption={activeTab}
        onTabChange={setActiveTab}
      />

      <section>
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

      <section className="grid flex-row place-items-center bg-teal-700 px-6 py-4">
        <button
          className="rounded-full bg-teal-200 px-4 py-2"
          onClick={resetState}
        >
          Default colors
        </button>
      </section>
    </section>
  );
}
