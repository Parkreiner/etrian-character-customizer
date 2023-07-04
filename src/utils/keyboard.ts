/**
 * @file Collection of functions and types for making it easier to deal with
 * keyboard input.
 */

export const arrowKeys = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
] as const;
export type ArrowKey = (typeof arrowKeys)[number];

export function isArrowKey(value: unknown): value is ArrowKey {
  return typeof value === "string" && arrowKeys.includes(value as ArrowKey);
}
