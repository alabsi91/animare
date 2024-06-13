import { isObjectVector } from '../utils/utils';

import type { Vec3Array, Vec3Object, Vec4Array, Vec4Object } from '../types';

/**
 * Converts vector to RGB string
 *
 * @param vec - The vector to convert
 * @returns - The RGB string
 *
 * @example
 * const color1: Vec4Array = [255, 0, 0, 1]; // or { x: 255, y: 0, z: 0, w: 1 } as Vec4Object
 * const color2: Vec4Array = [0, 0, 255, 1]; // or { x: 0, y: 0, z: 255, w: 1 } as Vec4Object
 * const resultColor = lerp(color1, color2, progress);
 * const rgbString = vecToRGB(resultColor);
 */
export function vecToRGB(vec: Vec3Array | Vec4Array | Vec3Object | Vec4Object): string {
  const isObject = isObjectVector(vec);

  const r = isObject ? vec.x : vec[0];
  const g = isObject ? vec.y : vec[1];
  const b = isObject ? vec.z : vec[2];
  const a = isObject ? ('w' in vec ? vec.w : undefined) : vec[3];

  if (typeof a === 'number') return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)} / ${Math.round(a * 100)}%)`;

  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
}

/**
 * Converts vector to HSL string
 *
 * @param vec - The vector to convert
 * @returns - The HSL string
 *
 * @example
 * const color1: Vec3Array = [50, 100, 50]; // or { x: 50, y: 100, z: 50 } as Vec3Object
 * const color2: Vec3Array = [200, 100, 50]; // or { x: 200, y: 100, z: 50 } as Vec3Object
 * const resultColor = lerp(color1, color2, progress);
 * const hslString = vecToHSL(resultColor);
 */
export function vecToHSL(vec: Vec3Array | Vec4Array | Vec3Object | Vec4Object): string {
  const isObject = isObjectVector(vec);

  const h = isObject ? vec.x : vec[0];
  const s = isObject ? vec.y : vec[1];
  const l = isObject ? vec.z : vec[2];
  const a = isObject ? ('w' in vec ? vec.w : undefined) : vec[3];

  if (typeof a === 'number') return `hsl(${Math.round(h)}deg ${Math.round(s)}% ${Math.round(l)}% / ${Math.round(a * 100)}%)`;

  return `hsl(${Math.round(h)}deg ${Math.round(s)}% ${Math.round(l)}%)`;
}

/**
 * Converts vector to HWB string
 *
 * @param vec - The vector to convert
 * @returns - The HWB string
 *
 * @example
 * const color1: Vec3Array = [50, 100, 50]; // or { x: 50, y: 100, z: 50 } as Vec3Object
 * const color2: Vec3Array = [200, 100, 50]; // or { x: 200, y: 100, z: 50 } as Vec3Object
 * const resultColor = lerp(color1, color2, progress);
 * const hslString = vecToHWB(resultColor);
 */
export function vecToHWB(vec: Vec3Array | Vec4Array | Vec3Object | Vec4Object): string {
  const isObject = isObjectVector(vec);

  const h = isObject ? vec.x : vec[0];
  const s = isObject ? vec.y : vec[1];
  const l = isObject ? vec.z : vec[2];
  const a = isObject ? ('w' in vec ? vec.w : undefined) : vec[3];

  if (typeof a === 'number') return `hwb(${Math.round(h)}deg ${Math.round(s)}% ${Math.round(l)}% / ${Math.round(a * 100)}%)`;

  return `hwb(${Math.round(h)}deg ${Math.round(s)}% ${Math.round(l)}%)`;
}
