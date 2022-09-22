import cubicBezier from './cubicBezier.js';
import { customEase } from './customEase.js';
import { EasingFn } from './types.js';

export const ease = {
  /** - ease in functions */
  in: {
    /** - **easeInBack:** check out [easings.net](https://easings.net/#easeInBack) to learn more.*/
    back: (c1 = 1.70158): EasingFn => {
      return (t: number): number => {
        const c3 = c1 + 1;
        return c3 * t * t * t - c1 * t * t;
      };
    },
    /** - **easeInBounce:** check out [easings.net](https://easings.net/#easeInBounce) to learn more.*/
    bounce: (t: number): number => 1 - ease.out.bounce(1 - t),
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
    poly: (n: number): EasingFn => {
      return (t: number) => Math.pow(t, n);
    },
  },

  /** - ease out functions */
  out: {
    /** - **easeOutBack:** check out [easings.net](https://easings.net/#easeOutBack) to learn more.*/
    back: (c1 = 1.70158): EasingFn => {
      return (t: number): number => {
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      };
    },
    /** - **easeOutBounce:** check out [easings.net](https://easings.net/#easeOutBounce) to learn more.*/
    bounce: (t: number): number => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) return n1 * t * t;
      if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
      if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    },
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
    poly: (n: number): EasingFn => {
      return (t: number) => 1 - Math.pow(1 - t, n);
    },
  },

  /** - ease in out functions */
  inOut: {
    /** - **easeInOutBack:** check out [easings.net](https://easings.net/#easeInOutBack) to learn more.*/
    back: (c1 = 1.70158): EasingFn => {
      return (t: number): number => {
        const c2 = c1 * 1.525;
        return t < 0.5
          ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
          : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
      };
    },
    /** - **easeInOutBounce:** check out [easings.net](https://easings.net/#easeInOutBounce) to learn more.*/
    bounce: (t: number): number => (t < 0.5 ? (1 - ease.out.bounce(1 - 2 * t)) / 2 : (1 + ease.out.bounce(2 * t - 1)) / 2),
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
    poly: (n: number): EasingFn => {
      return (t: number) => (t < 0.5 ? Math.pow(2, n - 1) * Math.pow(t, n) : 1 - Math.pow(-2 * t + 2, n) / 2);
    },
  },

  /**
   * A simple elastic interaction, similar to a spring oscillating back and forth.
   *
   * Default bounciness is `1`, which overshoots a little bit once.
   * `0` bounciness doesn't overshoot at all,
   * and bounciness of `N > 1` will overshoot about `N` times.
   *
   */
  wobble(bounciness = 1): EasingFn {
    const p = bounciness * Math.PI;
    return (t: number): number => 1 - Math.pow(Math.cos((t * Math.PI) / 2), 3) * Math.cos(t * p);
  },

  /** - default easing function. */
  linear: (t: number): number => t,

  /**
   * - defines a [cubic Bézier curve](https://developer.mozilla.org/en-US/docs/Glossary/Bezier_curve).
   * - similar to CSS's **cubic-bezier** easing  function.
   * **Syntax:** `cubicBezier(X1: number, Y1: number, X2: number, Y2: number)`
   * @example
   * ```js
   * import animare, { ease } from 'animare';
   *
   * animare({ to: 100, ease: ease.cubicBezier(0.25, 0.1, 0.25, 1) }, onUpdate);
   *
   * // ...
   * ```
   */
  cubicBezier,
  // cubicBezier: (X1: number, Y1: number, X2: number, Y2: number) => ease.custom(`M 0 0 C ${X1} ${Y1} ${X2} ${Y2} 1 1`),

  /**
   * - takes SVG path d attribute as a string and the samples number as a second param.
   * - ⚠️ **Warning:** accepts strings only made with [Animare Ease Visualizer](https://animare-ease-visualizer.netlify.app/) tool.
   * - Use [Animare Ease Visualizer](https://animare-ease-visualizer.netlify.app/) tool to create easing function.
   */
  custom: customEase,

  /**
   * - Custom easing function from array of points.
   * - Use [Animare Ease Visualizer](https://animare-ease-visualizer.netlify.app/) tool to create easing function.
   * - **Syntax:** `ease.fromPoints(values: Float32List)`
   * @example
   * ```js
   * import animare, { ease } from 'animare';
   * // custom easing function generated by Animare Ease Visualizer tool
   * import myEase from './myEase.js';
   *
   * animare({ to: 100, ease: ease.fromPoints(myEase) }, onUpdate);
   *
   * // ...
   *```
   */
  fromPoints: (values: Float32List): EasingFn => {
    if (!(values instanceof Float32Array) && !Array.isArray(values))
      throw new Error('\n\n⛔ [animare] ➡️ [ease] ➡️ [fromPoints] : first param must be an Array or Float32Array. !!\n\n');

    const length = values.length;

    return (t: number) => values[Math.floor(t * length)] ?? values[length - 1];
  },

  /**
   * - Create a staircase easing function.
   * @param steps - The number of steps.
   * @param start - Step at the beginning or at the end of each interval ?
   * @example
   * ```js
   * import animare, { ease } from 'animare';
   *
   * animare({ to: 100, ease: ease.steps(5) }, onUpdate);
   *
   * // ...
   *
   * ```
   */
  steps(steps = 10, start = true): EasingFn {
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
    const trunc = start ? Math.ceil : Math.floor;
    return (progress: number) => trunc(clamp(progress, 0, 1) * steps) / steps;
  },

  /**
   * - ⚠️ The spring easing function will only look smooth at certain durations, with certain parameters.
   * @example
   * ```js
   * import animare, { ease } from 'animare';
   *
   * animare({
   *  to: 100,
   *  ease: ease.spring({ mass: 1, stiffness: 100, damping: 10, velocity: 0, duration: 1000 })
   * }, onUpdate);
   *
   * // ...
   * ```
   */
  spring: ({ mass = 1, stiffness = 100, damping = 10, velocity = 0, duration = 1000 } = {}): EasingFn => {
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
    return (time: number) => {
      if (time === 0 || time === 1) return time;

      mass = clamp(mass, 0.1, 1000);
      stiffness = clamp(stiffness, 0.1, 1000);
      damping = clamp(damping, 0.1, 1000);
      velocity = clamp(velocity, 0.1, 1000);

      const w0 = Math.sqrt(stiffness / mass),
        zeta = damping / (2 * Math.sqrt(stiffness * mass)),
        wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0,
        a = 1,
        b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

      let progress = duration ? (duration * time) / 1000 : time;

      progress =
        zeta < 1
          ? Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress))
          : (a + b * progress) * Math.exp(-progress * w0);

      return 1 - progress;
    };
  },
};
