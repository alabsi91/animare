type ViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function generateEasingFunctionFromString(path: string) {
  const viewBox = { x: 0, y: 0, width: 1, height: 1 };
  const points = getPointsFromPathString(path, viewBox);
  const curves = preparePointsForAnimation(points, viewBox);

  return (t: number) => {
    // Special case start and end.
    if (t === 0) return curves[0][1]; // The Y-coordinate of the first point of the first curve
    if (t === 1) return curves[curves.length - 1][7]; // The Y-coordinate of the end point of the last curve

    let from = 0;
    for (let i = 0; i < curves.length; i++) {
      const [p0x, p0y, c0x, c0y, c1x, c1y, p1x, p1y] = curves[i];
      if (t >= from && t <= p1x) {
        from = p1x;
        return solvePositionYFromT(p0x, p0y, c0x, c0y, c1x, c1y, p1x, p1y, t);
      }
    }

    return 0;
  };
}

/**
 * - Convert to relative value ->
 * - Flip the Y points ->
 * - Store only Cubic curves with starting, control, and ending points (without the first M command).
 */
function preparePointsForAnimation(array: number[][], viewBox: ViewBox): number[][] {
  const relativePoints = convertPointsToRelativeValues(array, viewBox);

  const results: number[][] = [];

  let x = 0;
  let y = 0;
  for (let i = 0; i < relativePoints.length; i++) {
    const curve = relativePoints[i];

    const c1x = curve[0];
    const c1y = 1 - curve[1];

    if (!i) {
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

/** - Converts a path string to two dimensional array `[[M], ...[C]]` */
function getPointsFromPathString(path: string, viewBox: ViewBox): number[][] {
  const x = viewBox.x;
  const y = viewBox.y;
  const height = viewBox.height;
  const width = viewBox.width;

  // get numbers from the string and convert them from percentage values.
  const pathData = path
    .match(/-?[0-9.]+/g)
    ?.map((v, i) => (i % 2 === 0 ? parseFloat(v) * width + x : parseFloat(v) * height + y));

  const points: number[][] = [];

  if (!pathData) return points;

  points.push([pathData[0], pathData[1]]); // M points

  // C points
  for (let i = 2; i < pathData.length; i += 6) {
    points.push([pathData[i], pathData[i + 1], pathData[i + 2], pathData[i + 3], pathData[i + 4], pathData[i + 5]]);
  }

  return points;
}

/** Converts the values in a two-dimensional array to percentage values (ranging from 0 to 1). */
function convertPointsToRelativeValues(array: number[][], { x, y, width, height }: ViewBox): number[][] {
  const result: number[][] = [];

  for (let i = 0; i < array.length; i++) {
    const curve = array[i];
    const newCurve: number[] = [];

    for (let j = 0; j < curve.length; j++) {
      if (j % 2 === 0) {
        newCurve.push((curve[j] - x) / width);
        continue;
      }

      newCurve.push((curve[j] - y) / height);
    }

    result.push(newCurve);
  }

  return result;
}

/** Computes the Y-coordinate of a point on the curve given its X-coordinate.*/
function solvePositionYFromT(
  p0x: number,
  p0y: number,
  c0x: number,
  c0y: number,
  c1x: number,
  c1y: number,
  p1x: number,
  p1y: number,
  t: number,
): number {
  // Desired precision on the computation.
  const epsilon = 1e-6;

  // A binary search algorithm is used to determine the Y-coordinate value
  // corresponding to a specified position on the X-coordinate.
  let start = 0,
    end = 1,
    target = (start + end) / 2,
    times = 0;

  while (target >= start && target <= 1) {
    const { x, y } = findPointFromT(p0x, p0y, c0x, c0y, c1x, c1y, p1x, p1y, target);

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

/** Computes the point (x, y) on the curve for a given time `t` [0 to 1] */
function findPointFromT(
  p0x: number,
  p0y: number,
  c0x: number,
  c0y: number,
  c1x: number,
  c1y: number,
  p1x: number,
  p1y: number,
  t: number,
) {
  const point = { x: 0, y: 0 },
    mt = 1 - t,
    mt2 = mt * mt,
    mt3 = mt2 * mt;

  point.x = p0x * mt3 + c0x * 3 * mt2 * t + c1x * 3 * mt * t * t + p1x * t ** 3;
  point.y = p0y * mt3 + c0y * 3 * mt2 * t + c1y * 3 * mt * t * t + p1y * t ** 3;

  return point;
}
