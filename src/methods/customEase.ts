type Point = {
  x: number;
  y: number;
};
type S_Point = { c1: Point; p1: Point };
type C_Point = { p0: Point; c0: Point; c1: Point; p1: Point };

function Bezier(p0: Point, c0: Point, c1: Point, p1: Point, t: number) {
  const point = { x: 0, y: 0 },
    mt = 1 - t,
    mt2 = mt * mt,
    mt3 = mt2 * mt;

  point.x = p0.x * mt3 + c0.x * 3 * mt2 * t + c1.x * 3 * mt * t * t + p1.x * t ** 3;
  point.y = p0.y * mt3 + c0.y * 3 * mt2 * t + c1.y * 3 * mt * t * t + p1.y * t ** 3;

  return point;
}

export function parsePath(path: string): C_Point[] {
  const reg_s = /S[\s|,]?(?<c1x>-?\d\.?\d*)[\s|,](?<c1y>-?\d\.?\d*)[\s|,](?<p1x>-?\d\.?\d*)[\s|,](?<p1y>-?\d\.?\d*)/g;
  const reg_c =
    /M[\s|,]?((?<p0x>-?\d\.?\d*)[\s|,](?<p0y>-?\d\.?\d*))[\s|,]C[\s|,|-]?(?<c0x>-?\d\.?\d*)[\s|,](?<c0y>-?\d\.?\d*)[\s|,](?<c1x>-?\d\.?\d*)[\s|,](?<c1y>-?\d\.?\d*)[\s|,](?<p1x>-?\d\.?\d*)[\s|,](?<p1y>-?\d\.?\d*)/;

  // check if the path string is valid
  if (!reg_c.test(path) || (path.includes('S') && !reg_s.test(path))) {
    throw new Error('\n\n⛔ [animare] ➡️ [ease] ➡️ [custom] : invalid path string. !!\n\n');
  }

  const s_curves = [...path.matchAll(reg_s)].map(e =>
    e.groups ? { c1: { x: +e.groups.c1x, y: +e.groups.c1y }, p1: { x: +e.groups.p1x, y: +e.groups.p1y } } : e
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

export function customEase(d: string, samples = 800) {
  const points = parsePath(d);
  const values = new Float32Array(samples);
  let count = 0;

  for (let e = 0; e < points.length; e++) {
    const { p0, c0, c1, p1 } = points[e];

    for (let i = p0.x * samples; i < p1.x * samples; i++) {
      const point = i / samples;
      const dist = (p1.x - 0) * samples;

      let start = 0,
        end = 1,
        target = (start + end) / 2,
        times = 0,
        result: number | null = 0;

      while (target >= start && target <= 1) {
        const pos = Bezier(p0, c0, c1, p1, target);

        times++;

        if (times > 15) {
          result = null;
          break;
        }

        if (Math.abs(pos.x - point) <= 0.001) {
          result = pos.y;
          break;
        }

        if (pos.x >= point) end = target;
        else start = target;

        target = (start + end) / 2;
      }

      if (result !== null && count <= dist) {
        values[count] = result;
        count++;
      }
    }
  }

  values[0] = points[0].p0.y;
  values[samples - 1] = points[points.length - 1].p1.y;

  const length = values.length;

  return (t: number) => values[Math.floor(t * length)] ?? values[length - 1];
}
