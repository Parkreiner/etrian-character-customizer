import ColorPicker from "../ColorPicker";
import { NonMiscPanel, MiscProps } from "./localTypes";

export function MiscPanel({}: MiscProps) {
  return <div>Misc.</div>;
}

export const SkinPanel: NonMiscPanel = ({
  colors,
  selectedIndex,
  onHexChange,
  onIndexChange,
}) => {
  return (
    <div>
      <button onClick={() => onIndexChange(0)}>Skin 1</button>
      <button onClick={() => onIndexChange(1)}>Skin 2</button>

      <ColorPicker hexColor={colors[selectedIndex]} onHexChange={onHexChange} />
    </div>
  );
};

export const EyesPanel: NonMiscPanel = ({}) => {
  return <div>Eyes</div>;
};

export const HairPanel: NonMiscPanel = ({}) => {
  return <div>Hair</div>;
};
