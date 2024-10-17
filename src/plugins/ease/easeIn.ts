import { bounce, wobble } from './ease.js';

import type { Ease_in_out_inOut } from './types.js';

const easeIn: Ease_in_out_inOut = {
  back: (c1 = 1.70158) => {
    return t => (c1 + 1) * t * t * t - c1 * t * t;
  },
  bounce: t => 1 - bounce(1 - t),
  circ: t => 1 - Math.sqrt(1 - Math.pow(t, 2)),
  cubic: t => t * t * t,
  elastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  expo: t => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  sine: t => 1 - Math.cos((t * Math.PI) / 2),
  quad: t => t * t,
  quart: t => t * t * t * t,
  quint: t => t * t * t * t * t,
  poly: n => t => Math.pow(t, n),
  wobble,
};

export default easeIn;
