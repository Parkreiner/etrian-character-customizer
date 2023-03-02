import { RgbColor } from "../typesConstants/colors";

export function toRgbString(color: RgbColor) {
  const { red, green, blue } = color;
  return `rgb(${red}, ${green}, ${blue})`;
}
