import type { EaseFn } from '../types';

type Point = {
  x: number;
  y: number;
};
type S_Point = { c1: Point; p1: Point }; // for S (Several Bezier curves) points
type C_Point = { p0: Point; c0: Point; c1: Point; p1: Point }; // for C (Cubic Bezier curves) points

/**
 * Calculates the point on a cubic Bezier curve at a given time.
 *
 * The cubic Bezier curve is defined by four points:
 * @param p0 - The starting point of the curve.
 * @param c0 - The first control point.
 * @param c1 - The second control point.
 * @param p1 - The ending point of the curve.
 * @param t - A number between 0 and 1 representing the position on the curve.
 * @returns The point on the curve at the given time.
 */

function Bezier(p0: Point, c0: Point, c1: Point, p1: Point, t: number): Point {
  const point = { x: 0, y: 0 },
    mt = 1 - t,
    mt2 = mt * mt,
    mt3 = mt2 * mt;

  point.x = p0.x * mt3 + c0.x * 3 * mt2 * t + c1.x * 3 * mt * t * t + p1.x * t ** 3;
  point.y = p0.y * mt3 + c0.y * 3 * mt2 * t + c1.y * 3 * mt * t * t + p1.y * t ** 3;

  return point;
}

/**
 * Converts a string representation of a path into an array of objects,
 * each representing a cubic Bézier curve with a set of points.
 *
 * @param path - The string representation of the path.
 * @returns An array of objects, each containing the points of a cubic Bézier curve.
 */

function parsePath(path: string): C_Point[] {
  const reg_s = /S[\s|,]?(?<c1x>-?\d\.?\d*)[\s|,](?<c1y>-?\d\.?\d*)[\s|,](?<p1x>-?\d\.?\d*)[\s|,](?<p1y>-?\d\.?\d*)/g;
  const reg_c =
    /M[\s|,]?((?<p0x>-?\d\.?\d*)[\s|,](?<p0y>-?\d\.?\d*))[\s|,]C[\s|,|-]?(?<c0x>-?\d\.?\d*)[\s|,](?<c0y>-?\d\.?\d*)[\s|,](?<c1x>-?\d\.?\d*)[\s|,](?<c1y>-?\d\.?\d*)[\s|,](?<p1x>-?\d\.?\d*)[\s|,](?<p1y>-?\d\.?\d*)/;

  // check if the path string is valid
  if (!reg_c.test(path) || (path.includes('S') && !reg_s.test(path))) {
    throw new Error('\n\n⛔ [animare] ➡️ [ease] ➡️ [custom] : invalid path string. !!\n\n');
  }

  // reset regex
  reg_s.lastIndex = 0;
  reg_c.lastIndex = 0;

  // parse S curves
  const s_curves = [...path.matchAll(reg_s)].map(e =>
    e.groups ? { c1: { x: +e.groups.c1x, y: +e.groups.c1y }, p1: { x: +e.groups.p1x, y: +e.groups.p1y } } : e,
  ) as S_Point[];

  // get first point c curve.
  const c_curve_match = reg_c.exec(path)?.groups;
  if (!c_curve_match) throw new Error('\n\n⛔ [animare] ➡️ [ease] ➡️ [custom] : invalid path string. !!\n\n');

  const c_curve: C_Point = {
    p0: { x: +c_curve_match.p0x, y: +c_curve_match.p0y },
    c0: { x: +c_curve_match.c0x, y: +c_curve_match.c0y },
    c1: { x: +c_curve_match.c1x, y: +c_curve_match.c1y },
    p1: { x: +c_curve_match.p1x, y: +c_curve_match.p1y },
  };

  const results: [C_Point, ...S_Point[]] = [c_curve, ...s_curves];

  // Normalizes and converts S points to C points.
  for (let i = 1; i < results.length; i++) {
    const prev = results[i - 1];
    results[i] = {
      p0: prev.p1,
      c0: { x: (prev.p1.x - prev.c1.x) * 2 + prev.c1.x, y: (prev.p1.y - prev.c1.y) * 2 + prev.c1.y },
      c1: results[i].c1,
      p1: results[i].p1,
    };
  }

  return results as C_Point[];
}

export function customEase(d: string, samples = 800): EaseFn {
  const curvesPoints = parsePath(d);
  const values = new Float32Array(samples); // in this array the results will be saved.
  let count = 0; // To accurately save the results, we need to track the index of the `values` array.

  // loop over curves points
  for (let e = 0; e < curvesPoints.length; e++) {
    const { p0, c0, c1, p1 } = curvesPoints[e]; // extarct curves's points
    const dist = p1.x * samples; // The distance between the starting point of the path and the end of the curve.

    // For every curve, there are a number of samples that depict the passage of time along the x-axis.
    // By iterating through these samples, we can determine the corresponding y-axis value for each point in time
    for (let i = p0.x * samples; i < dist; i++) {
      const pointX = i / samples; // The x-axis on the curve represents the progression of time.

      // a binary search algorithm to locate the y-axis value for a given progress on the x-axis.
      let start = 0,
        end = 1,
        target = (start + end) / 2,
        times = 0,
        result: number | null = 0;

      while (target >= start && target <= 1) {
        const pos = Bezier(p0, c0, c1, p1, target);

        times++;
        // If the point is not found after 15 attempts, a safe loop break will occur.
        if (times > 15) {
          result = null;
          break;
        }

        if (Math.abs(pos.x - pointX) <= 0.001) {
          result = pos.y;
          break;
        }

        if (pos.x >= pointX) end = target;
        else start = target;

        target = (start + end) / 2;
      }

      // save the result to `values` array
      if (result !== null && count <= dist) {
        values[count] = result;
        count++;
      }
    }
  }

  // To ensure that the starting point on the y-axis of the first curve is consistent.
  values[0] = curvesPoints[0].p0.y;
  // To ensure that the ending point on the y-axis of the last curve is consistent.
  values[samples - 1] = curvesPoints[curvesPoints.length - 1].p1.y;

  const length = values.length;
  return (t: number) => values[Math.floor(t * length)] ?? values[length - 1];
}
