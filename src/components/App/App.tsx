import * as Tooltip from "@radix-ui/react-tooltip";
import PortraitPicker from "@/components/PortraitPicker";
import CharacterPreview from "@/components/CharacterPreview";
import ColorPicker from "@/components/ColorPicker";

export default function App() {
  return (
    <Tooltip.Provider delayDuration={500}>
      <div className="mx-auto flex h-full max-w-[1400px] items-center">
        <div className="flex max-h-[800px] flex-row items-center justify-center gap-x-10">
          <PortraitPicker />
          <CharacterPreview />
          <ColorPicker character={{ id: "temp" }} />
        </div>
      </div>
    </Tooltip.Provider>
  );
}
