/**
 * Produces an array representing an array of numbers. Range is inclusive on the
 * start bound, but exclusive on the end bound.
 *
 * If both bounds are provided, bound1 will be treated as the start, and bound2
 * will be the end. If only bound1 is provided, it will be treated as the end,
 * and the start bound will become 0.
 */
export function range(bound1: number, bound2?: number): number[] {
  const startBound = bound2 === undefined ? 0 : bound1;
  const endBound = bound2 ?? bound1;

  const output: number[] = [];
  for (let i = startBound; i < endBound; i++) {
    output.push(i);
  }

  return output;
}

/**
 * Guarantees that a number is within the range defined by min and max.
 * If any of the arguments are NaN, NaN will be returned.
 */
export function clamp(newValue: number, min: number, max: number): number {
  return Math.max(min, Math.min(newValue, max));
}
