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

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/**
 * Extends the source object by adding properties from one or more other objects.
 *
 * - **Mutates the source object in place** and maintains the same object reference.
 * - **Note**: Properties that already exist in the source object will not be overwritten.
 *
 * @param sourceObj - The source object to extend.
 * @param objs - One or more objects whose properties will be added to the source object.
 * @returns The extended source object with new typed properties.
 *
 * @example
 * ```ts
 * const sourceObj = { a: 1 }; // will be mutated in place
 *
 * // result has type `{ a: number; b: number; c: number; }`
 * const result = extendObject(sourceObj, { b: 2 }, { c: 3 });
 *
 * console.log(sourceObj === result); // same reference, returns `true`
 * ```
 */
export function extendObject<T extends object, U extends object[]>(sourceObj: T, ...objs: U) {
  const result = sourceObj as U[number];
  for (let i = 0; i < objs.length; i++) {
    const obj = objs[i] as U[number];
    for (const key in obj) result[key] = obj[key];
  }
  return result as T & UnionToIntersection<U[number]>;
}
