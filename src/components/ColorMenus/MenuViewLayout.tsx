import { PropsWithChildren } from "react";
import ColorPicker from "@/components/ColorPicker";
import Card from "@/components/Card";
import ColorButton from "./ColorButton";

import {
  CharacterColors,
  ColorTuple,
  HAIR_EYE_COLOR_PRESETS,
  SKIN_COLOR_PRESETS,
} from "@/typesConstants/colors";
import { UiTab } from "./localTypes";

type Props = PropsWithChildren<{
  tab: UiTab;
  activeHex: string;
  defaultColors?: CharacterColors;
  onHexChange: (newHexColor: string) => void;
  selectHexPreset?: (hex1: string, hex2: string) => void;
}>;

const colorPresets = {
  eyes: HAIR_EYE_COLOR_PRESETS,
  hair: HAIR_EYE_COLOR_PRESETS,
  skin: SKIN_COLOR_PRESETS,
} as const satisfies Record<Exclude<UiTab, "misc">, readonly ColorTuple[]>;

export default function MenuViewLayout({
  tab,
  activeHex,
  onHexChange,
  selectHexPreset,
  children,
}: Props) {
  const canShowPresets =
    tab !== "misc" &&
    selectHexPreset !== undefined &&
    colorPresets[tab].length > 0;

  return (
    <fieldset>
      <Card title={`Options (${tab})`} striped={true}>
        {children}
      </Card>

      <Card title="Color Editor" striped={true}>
        <ColorPicker hexColor={activeHex} onHexChange={onHexChange} />
      </Card>

      {canShowPresets && (
        <Card title="Color Presets" striped={true}>
          <ul className="grid w-full max-w-[400px] grid-cols-3 justify-between gap-3">
            {colorPresets[tab].map(([hex1, hex2], index) => (
              <li key={index}>
                <ColorButton
                  primaryHex={hex1}
                  secondaryHex={hex2}
                  onClick={() => selectHexPreset(hex1, hex2)}
                />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </fieldset>
  );
}
