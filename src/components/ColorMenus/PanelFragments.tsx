import { NonMiscPanel, MiscProps } from "./localTypes";

export function MiscPanel({}: MiscProps) {
  return <div>Misc.</div>;
}

export const SkinPanel: NonMiscPanel = ({}) => {
  return <div>Skin</div>;
};

export const EyesPanel: NonMiscPanel = ({}) => {
  return <div>Eyes</div>;
};

export const HairPanel: NonMiscPanel = ({}) => {
  return <div>Hair</div>;
};
