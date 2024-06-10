import { bounce, wobble } from './ease';

import type { EaseFn } from '../types';

const easeInOut = {
  /** - **easeInOutBack:** check out [easings.net](https://easings.net/#easeInOutBack) to learn more.*/
  back: (c1 = 1.70158): EaseFn => {
    return (t: number): number => {
      const c2 = c1 * 1.525;
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    };
  },

  /** - **easeInOutBounce:** check out [easings.net](https://easings.net/#easeInOutBounce) to learn more.*/
  bounce: (t: number): number => (t < 0.5 ? (1 - bounce(1 - 2 * t)) / 2 : (1 + bounce(2 * t - 1)) / 2),

  /** - **easeInOutCric:** check out [easings.net](https://easings.net/#easeInOutCric) to learn more.*/
  circ: (t: number): number =>
    t < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,

  /** - **easeInOutCubic:** check out [easings.net](https://easings.net/#easeInOutCubic) to learn more.*/
  cubic: (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),

  /** - **easeInOutElastic:** check out [easings.net](https://easings.net/#easeInOutElastic) to learn more.*/
  elastic: (t: number): number => {
    const c5 = (2 * Math.PI) / 4.5;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
          : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
  },

  /** - **easeInOutExpo:** check out [easings.net](https://easings.net/#easeInOutExpo) to learn more.*/
  expo: (t: number): number =>
    t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,

  /** - **easeInOutSine:** check out [easings.net](https://easings.net/#easeInOutSine) to learn more.*/
  sine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,

  /** - **easeInOutQuad:** check out [easings.net](https://easings.net/#easeInOutQuad) to learn more.*/
  quad: (t: number): number => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),

  /** - **easeInOutQuart:** check out [easings.net](https://easings.net/#easeInOutQuart) to learn more.*/
  quart: (t: number): number => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),

  /** - **easeInOutQuint:** check out [easings.net](https://easings.net/#easeInOutQuint) to learn more.*/
  quint: (t: number): number => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),

  /** -  A power function. Position is equal to the Nth power of elapsed time. */
  poly: (n: number): EaseFn => {
    return (t: number) => (t < 0.5 ? Math.pow(2, n - 1) * Math.pow(t, n) : 1 - Math.pow(-2 * t + 2, n) / 2);
  },

  /**
   * Creates a simple elastic interaction, similar to a spring oscillating back and forth.
   *
   * The default bounciness is `1`, which overshoots a little bit once.
   * A bounciness of `0` doesn't overshoot at all,
   * and a bounciness of `N > 1` will overshoot about `N` times.
   */
  wobble(bounciness = 1): EaseFn {
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
