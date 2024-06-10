import { bounce, wobble } from './ease';

import type { EaseFn } from '../types';

const easeOut = {
  /** - **easeOutBack:** check out [easings.net](https://easings.net/#easeOutBack) to learn more.*/
  back: (c1 = 1.70158): EaseFn => {
    return (t: number): number => {
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
  },

  /** - **easeOutBounce:** check out [easings.net](https://easings.net/#easeOutBounce) to learn more.*/
  bounce,

  /** - **easeOutCric:** check out [easings.net](https://easings.net/#easeOutCric) to learn more.*/
  circ: (t: number): number => Math.sqrt(1 - Math.pow(t - 1, 2)),

  /** - **easeOutCubic:** check out [easings.net](https://easings.net/#easeOutCubic) to learn more.*/
  cubic: (t: number): number => 1 - Math.pow(1 - t, 3),

  /** - **easeOutElastic:** check out [easings.net](https://easings.net/#easeOutElastic) to learn more.*/
  elastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  /** - **easeOutExpo:** check out [easings.net](https://easings.net/#easeOutExpo) to learn more.*/
  expo: (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),

  /** - **easeOutSine:** check out [easings.net](https://easings.net/#easeOutSine) to learn more.*/
  sine: (t: number): number => Math.sin((t * Math.PI) / 2),

  /** - **easeOutQuad:** check out [easings.net](https://easings.net/#easeOutQuad) to learn more.*/
  quad: (t: number): number => 1 - (1 - t) * (1 - t),

  /** - **easeOutQuart:** check out [easings.net](https://easings.net/#easeOutQuart) to learn more.*/
  quart: (t: number): number => 1 - Math.pow(1 - t, 4),

  /** - **easeOutQuint:** check out [easings.net](https://easings.net/#easeOutQuint) to learn more.*/
  quint: (t: number): number => 1 - Math.pow(1 - t, 5),

  /** -  A power function. Position is equal to the Nth power of elapsed time. */
  poly: (n: number): EaseFn => {
    return (t: number) => 1 - Math.pow(1 - t, n);
  },

  /**
   * Creates a simple elastic interaction, similar to a spring oscillating back and forth.
   *
   * The default bounciness is `1`, which overshoots a little bit once.
   * A bounciness of `0` doesn't overshoot at all,
   * and a bounciness of `N > 1` will overshoot about `N` times.
   */
  wobble(bounciness = 1): EaseFn {
    return out(wobble(bounciness));
  },
};

/** Runs an easing function backwards. */
function out(easing: EaseFn): EaseFn {
  return t => 1 - easing(1 - t);
}

export default easeOut;
