import { ColorCategory } from "@/typesConstants/colors";

export type UiTab = Exclude<ColorCategory, "leftEye" | "rightEye"> | "eyes";
