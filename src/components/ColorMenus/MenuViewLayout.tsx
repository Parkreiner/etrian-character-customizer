import { PropsWithChildren } from "react";
import { UiTab } from "./localTypes";
import ColorPicker from "@/components/ColorPicker";
import {
  CharacterColors,
  ColorTuple,
  HAIR_EYE_COLOR_PRESETS,
  SKIN_COLOR_PRESETS,
} from "@/typesConstants/colors";
import ColorButton from "./ColorButton";

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

function SectionHeader({ children }: PropsWithChildren) {
  return (
    <div className="mb-3 flex flex-row items-center gap-x-2">
      <h2 className="h-fit text-xs font-semibold uppercase tracking-wider text-teal-50">
        {children}
      </h2>

      <div className="h-0.5 flex-grow bg-teal-50 opacity-80" />
    </div>
  );
}

export default function MenuViewLayout({
  tab,
  activeHex,
  onHexChange,
  selectHexPreset,
  children,
}: Props) {
  return (
    <fieldset>
      <section className="mb-4 rounded-md bg-teal-900 px-4 pb-6 pt-4">
        <SectionHeader>Options ({tab})</SectionHeader>
        {children}
      </section>

      <section className="mb-4 rounded-md bg-teal-900 p-4">
        <SectionHeader>Color Editor</SectionHeader>
        <ColorPicker hexColor={activeHex} onHexChange={onHexChange} />
      </section>

      <section className="rounded-md bg-teal-900 px-4 py-4">
        <SectionHeader>Color Presets</SectionHeader>

        {tab !== "misc" && selectHexPreset !== undefined && (
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
        )}
      </section>
    </fieldset>
  );
}
