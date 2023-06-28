export function toTitleCase(str: string) {
  return str
    .split(/ +/g)
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
