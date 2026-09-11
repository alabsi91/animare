import { bounce, elastic, spring, wobble } from './ease.js';

import type { Ease_in_out_inOut } from './types.js';

const easeIn: Ease_in_out_inOut = {
  back: (c1 = 1.70158) => {
    return t => (c1 + 1) * t * t * t - c1 * t * t;
  },
  bounce: (bounces, bounciness) => {
    const bounceOut = bounce(bounces, bounciness);
    return t => 1 - bounceOut(1 - t);
  },
  circ: t => 1 - Math.sqrt(1 - Math.pow(t, 2)),
  cubic: t => t * t * t,
  elastic: (amplitude, period) => {
    const elasticOut = elastic(amplitude, period);
    return t => 1 - elasticOut(1 - t);
  },
  expo: t => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  sine: t => 1 - Math.cos((t * Math.PI) / 2),
  quad: t => t * t,
  quart: t => t * t * t * t,
  quint: t => t * t * t * t * t,
  poly: n => t => Math.pow(t, n),
  wobble,
  spring: options => {
    const springOut = spring(options);
    return t => 1 - springOut(1 - t);
  },
};

export default easeIn;
