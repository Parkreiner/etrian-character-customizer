type RgbInput = {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
};

export function toRgba(color: RgbInput) {
  const { red, green, blue } = color;
  const alpha = color.alpha ?? 1;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
