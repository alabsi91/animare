/** - Converts a path string to two dimensional array `[[M], ...[C]]` */
function parsePointsFromPathString(path: string): number[][] {
  const pathData = path.match(/-?[0-9.]+/g)?.map(value => Number.parseFloat(value));

  const points: number[][] = [];

  if (!pathData) return points;

  points.push([pathData[0], pathData[1]]); // M points

  // C points
  for (let index = 2; index < pathData.length; index += 6) {
    points.push([
      pathData[index],
      pathData[index + 1],
      pathData[index + 2],
      pathData[index + 3],
      pathData[index + 4],
      pathData[index + 5],
    ]);
  }

  return points;
}

/**
 * - Convert to relative value ->
 * - Flip the Y points ->
 * - Store only Cubic curves with starting, control, and ending points (without the first M command).
 */
function preparePointsForAnimation(array: number[][]): number[][] {
  const results: number[][] = [];

  let x = 0;
  let y = 0;
  for (const [index, curve] of array.entries()) {
    const c1x = curve[0];
    const c1y = 1 - curve[1];

    if (!index) {
      x = c1x;
      y = c1y;
      continue;
    }

    const c2x = curve[2];
    const c2y = 1 - curve[3];
    const px = curve[4];
    const py = 1 - curve[5];

    results.push([x, y, c1x, c1y, c2x, c2y, px, py]);

    x = px;
    y = py;
  }

  return results;
}

export function generateEasingFunctionFromString(path: string) {
  const points = parsePointsFromPathString(path);
  const curves = preparePointsForAnimation(points);

  const epsilon = 1e-6; // Desired precision on the computation.

  return (t: number) => {
    // Special case start and end.
    if (t === 0) return curves[0][1]; // The Y-coordinate of the first point of the first curve
    if (t === 1) return curves.at(-1)![7]; // The Y-coordinate of the end point of the last curve

    for (const [p0x, p0y, c0x, c0y, c1x, c1y, p1x, p1y] of curves) {
      if (t > p1x) continue; // t is outside the range of the current curve

      // A binary search algorithm is used to determine the Y-coordinate value
      // corresponding to a specified position on the X-coordinate.
      let start = 0,
        end = 1,
        target = (start + end) / 2,
        times = 0;

      while (target >= start && target <= 1) {
        // Compute the point (x, y) on the curve for a given time `target` [0 to 1]
        const mt = 1 - target,
          mt2 = mt * mt,
          mt3 = mt2 * mt;

        const x = p0x * mt3 + c0x * 3 * mt2 * target + c1x * 3 * mt * target * target + p1x * target ** 3;
        const y = p0y * mt3 + c0y * 3 * mt2 * target + c1y * 3 * mt * target * target + p1y * target ** 3;

        // If the point cannot be found within 50 attempts, a safe loop break will be triggered.
        if (++times > 50) return y;

        // Return the located Y-coordinate value.
        if (Math.abs(x - t) <= epsilon) return y;

        if (x >= t) end = target;
        else start = target;

        target = (start + end) / 2;
      }

      return 0;
    }

    return 0;
  };
}
