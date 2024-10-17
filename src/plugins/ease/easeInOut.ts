import { bounce, wobble } from './ease.js';

import type { Ease_in_out_inOut, EaseFn } from './types.js';

const easeInOut: Ease_in_out_inOut = {
  back: (c1 = 1.70158) => {
    return t => {
      const c2 = c1 * 1.525;
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    };
  },
  bounce: t => (t < 0.5 ? (1 - bounce(1 - 2 * t)) / 2 : (1 + bounce(2 * t - 1)) / 2),
  circ: t => (t < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2),
  cubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  elastic: t => {
    const c5 = (2 * Math.PI) / 4.5;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
          : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
  },
  expo: t => (t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2),
  sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  quad: t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  quart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
  quint: t => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
  poly: n => {
    return t => (t < 0.5 ? Math.pow(2, n - 1) * Math.pow(t, n) : 1 - Math.pow(-2 * t + 2, n) / 2);
  },
  wobble(bounciness = 1) {
    return inOut(wobble(bounciness));
  },
};

/**
 * Makes any easing function symmetrical. The easing function will run
 * forwards for half of the duration, then backwards for the rest of the
 * duration.
 */
function inOut(easing: EaseFn): EaseFn {
  return t => {
    if (t < 0.5) return easing(t * 2) / 2;
    return 1 - easing((1 - t) * 2) / 2;
  };
}

export default easeInOut;
