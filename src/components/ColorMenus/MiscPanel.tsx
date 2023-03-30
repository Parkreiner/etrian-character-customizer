import { NonMiscPanelProps } from "./localTypes";

type MiscProps = {
  [key in keyof NonMiscPanelProps]: key extends "selectedIndex"
    ? number
    : NonMiscPanelProps[key];
};

export default function MiscPanel({}: MiscProps) {
  return null;
}
