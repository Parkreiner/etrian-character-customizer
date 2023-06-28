import { ColorCategory } from "@/typesConstants/colors";

export type UiTab = Exclude<ColorCategory, "leftEye" | "rightEye"> | "eyes";
export const uiTabs = [
  "skin",
  "hair",
  "eyes",
  "misc",
] as const satisfies readonly UiTab[];
