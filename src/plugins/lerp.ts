import { isObjectVector } from '../utils/utils';

import type { Vec, Vec1Array, Vec1Object, Vec2Array, Vec2Object, Vec3Array, Vec3Object, Vec4Array, Vec4Object } from '../types';

export function lerp(start: number, end: number, t: number): number;

export function lerp(start: Vec1Array, end: Vec1Array, t: number): Vec1Array;
export function lerp(start: Vec2Array, end: Vec2Array, t: number): Vec2Array;
export function lerp(start: Vec3Array, end: Vec3Array, t: number): Vec3Array;
export function lerp(start: Vec4Array, end: Vec4Array, t: number): Vec4Array;

export function lerp(start: Vec1Object, end: Vec1Object, t: number): Vec1Object;
export function lerp(start: Vec2Object, end: Vec2Object, t: number): Vec2Object;
export function lerp(start: Vec3Object, end: Vec3Object, t: number): Vec3Object;
export function lerp(start: Vec4Object, end: Vec4Object, t: number): Vec4Object;

/**
 * Linearly interpolates between two values.
 *
 * ⚠️ **WARNING** ⚠️ This function throws an error if the values are invalid.
 *
 * @param start - The start value or vector.
 * @param end - The end value or vector.
 * @param t - The interpolation factor (0.0 to 1.0).
 * @returns The interpolated value or vector.
 */
export function lerp(start: Vec, end: Vec, t: number): Vec {
  // Single number interpolation
  if (typeof start === 'number' && typeof end === 'number') {
    return start + t * (end - start);
  }

  // Array-based vector interpolation
  if (Array.isArray(start) && Array.isArray(end)) {
    return start.map((s, i) => s + t * (end[i] - s)) as Vec1Array | Vec2Array | Vec3Array;
  }

  // Object-based vector interpolation
  if (isObjectVector(start) && isObjectVector(end)) {
    const result: Vec4Object = Object.assign({});
    for (const key in start) {
      if (key in start && key in end) {
        const k = key as keyof Vec1Object; // x | y | z | w
        result[k] = start[k] + t * (end[k] - start[k]);
      }
    }
    return result;
  }

  throw new Error('Invalid input types for lerp function');
}
