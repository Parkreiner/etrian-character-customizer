import { FunctionComponent } from "react";
import { ColorCategory, ColorTuple } from "@/typesConstants/colors";

export type CategoryIndices = {
  [key in ColorCategory]: key extends "misc" ? number : 0 | 1;
};

export type NonMiscPanelProps = {
  colors: ColorTuple;
  selectedIndex: 0 | 1;
  onIndexChange: (newIndex: number) => void;
  onHexChange: (newHex: string) => void;
};

export type MiscProps = {
  [key in keyof NonMiscPanelProps]: key extends "selectedIndex"
    ? number
    : key extends "colors"
    ? string[]
    : NonMiscPanelProps[key];
};

export type NonMiscPanel = FunctionComponent<NonMiscPanelProps>;
