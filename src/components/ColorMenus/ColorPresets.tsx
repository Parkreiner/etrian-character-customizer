import {
  ColorTuple,
  HAIR_EYE_COLOR_PRESETS,
  SKIN_COLOR_PRESETS,
  MISC_COLOR_PRESETS,
} from "@/typesConstants/colors";

import Card from "@/components/Card/";
import ColorButton from "./ColorButton";
import { UiTab } from "./localTypes";
import usePresetsKeyboardNav from "./usePresetsKeyboardNav";

type ExternalProps = {
  activeTab: UiTab;
  onHexPresetChange: (hex1: string, hex2: string) => void;
};

type CoreProps = Omit<ExternalProps, "activeTab"> & {
  colorTuples: readonly ColorTuple[];
};

const colorPresets = {
  eyes: HAIR_EYE_COLOR_PRESETS,
  hair: HAIR_EYE_COLOR_PRESETS,
  skin: SKIN_COLOR_PRESETS,
  misc: MISC_COLOR_PRESETS,
} as const satisfies Record<UiTab, readonly ColorTuple[]>;

function ColorPresetsCore({ colorTuples, onHexPresetChange }: CoreProps) {
  const {
    gridContainerRef,
    activeButtonRef,
    activePresetIndex,
    setActivePresetIndex,
  } = usePresetsKeyboardNav<HTMLUListElement>(colorTuples.length);

  return (
    <ul
      ref={gridContainerRef}
      className="mt-1 grid w-full max-w-[400px] grid-cols-3 justify-between gap-3"
    >
      {colorTuples.map(([hex1, hex2], index) => {
        const selected = index === activePresetIndex;

        return (
          <li key={`${hex1}-${hex2}`} className="mx-auto block">
            <ColorButton
              ref={selected ? activeButtonRef : undefined}
              primaryHex={hex1}
              secondaryHex={hex2}
              selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                onHexPresetChange(hex1, hex2);
                setActivePresetIndex(index);
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default function ColorPresets({
  activeTab,
  onHexPresetChange,
}: ExternalProps) {
  const selectedList = colorPresets[activeTab];

  return (
    <Card title={`Presets (${activeTab})`} striped gapSize="small">
      {selectedList.length > 0 ? (
        <ColorPresetsCore
          key={activeTab}
          colorTuples={selectedList}
          onHexPresetChange={onHexPresetChange}
        />
      ) : (
        <p className="mt-1 rounded-md bg-teal-950/60 px-2 py-3 text-center text-sm font-medium text-teal-100">
          No color presets available.
        </p>
      )}
    </Card>
  );
}
