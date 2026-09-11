import type { Vec1, Vec1Object, Vec2, Vec2Object, Vec3, Vec3Object, Vec4, Vec4Object } from '../types.js';

export function isObjectVector(vector: Vec1 | Vec2 | Vec3 | Vec4): vector is Vec1Object | Vec2Object | Vec3Object | Vec4Object {
  return typeof vector === 'object' && !Array.isArray(vector);
}

/**
 * - Returns a number between `0` and `1`
 */
export function normalizePercentage(percentage: number) {
  return percentage < 0 ? 0 : percentage > 1 ? 1 : percentage;
}
