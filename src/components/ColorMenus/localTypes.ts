import { FunctionComponent } from "react";
import { ColorCategory } from "@/typesConstants/colors";

export type CategoryIndices = {
  [key in ColorCategory]: key extends "misc" ? number : 0 | 1;
};

export type NonMiscPanelProps = {
  selectedIndex: 0 | 1;
  onIndexChange: (newIndex: number) => void;
  onColorChange: (newHex: string) => void;
};

export type NonMiscPanel = FunctionComponent<NonMiscPanelProps>;
