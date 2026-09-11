import type { PercentageString } from '../types.js';

/** - Returns `true` if the value is a valid number, not `NaN` and finite. */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);
}

/**
 * - Parse a percentage string into a floating point percentage. E.g. `50%` => `0.5`
 * - Returns `0` on parsing error.
 */
export function percentageStringToNumber(percentageString: PercentageString): number {
  const percentage = parseFloat(percentageString);
  const isNumber = isValidNumber(percentage);
  if (!isNumber) return 0;
  return percentage / 100;
}

/**
 * - Returns a number between `0` and `1`
 */
export function normalizePercentage(percentage: number) {
  return percentage < 0 ? 0 : percentage > 1 ? 1 : percentage;
}

export function clamp(value: number, min: number, max: number) {
  return value < min ? min : value > max ? max : value;
}
