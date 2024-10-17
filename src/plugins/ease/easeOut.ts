import { bounce, wobble } from './ease.js';

import type { Ease_in_out_inOut, EaseFn } from './types.js';

const easeOut: Ease_in_out_inOut = {
  back: (c1 = 1.70158) => {
    return t => {
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
  },
  bounce,
  circ: t => Math.sqrt(1 - Math.pow(t - 1, 2)),
  cubic: t => 1 - Math.pow(1 - t, 3),
  elastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  expo: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  sine: t => Math.sin((t * Math.PI) / 2),
  quad: t => 1 - (1 - t) * (1 - t),
  quart: t => 1 - Math.pow(1 - t, 4),
  quint: t => 1 - Math.pow(1 - t, 5),
  poly: n => t => 1 - Math.pow(1 - t, n),
  wobble: (bounciness = 1) => out(wobble(bounciness)),
};

/** Runs an easing function backwards. */
function out(easing: EaseFn): EaseFn {
  return t => 1 - easing(1 - t);
}

export default easeOut;
