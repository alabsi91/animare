import { bounce, wobble } from './ease';

import type { EaseFn } from '../types';

const easeIn = {
  /** - **easeInBack:** check out [easings.net](https://easings.net/#easeInBack) to learn more.*/
  back: (c1 = 1.70158): EaseFn => {
    return (t: number): number => {
      const c3 = c1 + 1;
      return c3 * t * t * t - c1 * t * t;
    };
  },

  /** - **easeInBounce:** check out [easings.net](https://easings.net/#easeInBounce) to learn more.*/
  bounce: (t: number): number => 1 - bounce(1 - t),

  /** - **easeInCric:** check out [easings.net](https://easings.net/#easeInCric) to learn more.*/
  circ: (t: number): number => 1 - Math.sqrt(1 - Math.pow(t, 2)),

  /** - **easeInCubic:** check out [easings.net](https://easings.net/#easeInCubic) to learn more.*/
  cubic: (t: number): number => t * t * t,

  /** - **easeInElastic:** check out [easings.net](https://easings.net/#easeInElastic) to learn more.*/
  elastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },

  /** - **easeInExpo:** check out [easings.net](https://easings.net/#easeInExpo) to learn more.*/
  expo: (t: number): number => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),

  /** - **easeInSine:** check out [easings.net](https://easings.net/#easeInSine) to learn more.*/
  sine: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),

  /** - **easeInQuad:** check out [easings.net](https://easings.net/#easeInQuad) to learn more.*/
  quad: (t: number): number => t * t,

  /** - **easeInQuart:** check out [easings.net](https://easings.net/#easeInQuart) to learn more.*/
  quart: (t: number): number => t * t * t * t,

  /** - **easeInQuint:** check out [easings.net](https://easings.net/#easeInQuint) to learn more.*/
  quint: (t: number): number => t * t * t * t * t,

  /** -  A power function. Position is equal to the Nth power of elapsed time. */
  poly: (n: number): EaseFn => {
    return (t: number) => Math.pow(t, n);
  },

  /**
   * Creates a simple elastic interaction, similar to a spring oscillating back and forth.
   *
   * The default bounciness is `1`, which overshoots a little bit once.
   * A bounciness of `0` doesn't overshoot at all,
   * and a bounciness of `N > 1` will overshoot about `N` times.
   */
  wobble,
};

export default easeIn;
