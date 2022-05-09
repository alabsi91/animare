export const ease = {
  /** - ease in functions */
  in: {
    /** - **easeInBack:** check out [easings.net](https://easings.net/#easeInBack) to learn more.*/
    back: (x: number): number => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return c3 * x * x * x - c1 * x * x;
    },
    /** - **easeInBounce:** check out [easings.net](https://easings.net/#easeInBounce) to learn more.*/
    bounce: (x: number): number => 1 - ease.out.bounce(1 - x),
    /** - **easeInCric:** check out [easings.net](https://easings.net/#easeInCric) to learn more.*/
    circ: (x: number): number => 1 - Math.sqrt(1 - Math.pow(x, 2)),
    /** - **easeInCubic:** check out [easings.net](https://easings.net/#easeInCubic) to learn more.*/
    cubic: (x: number): number => x * x * x,
    /** - **easeInElastic:** check out [easings.net](https://easings.net/#easeInElastic) to learn more.*/
    elastic: (x: number): number => {
      const c4 = (2 * Math.PI) / 3;
      return x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
    },
    /** - **easeInExpo:** check out [easings.net](https://easings.net/#easeInExpo) to learn more.*/
    expo: (x: number): number => (x === 0 ? 0 : Math.pow(2, 10 * x - 10)),
    /** - **easeInSine:** check out [easings.net](https://easings.net/#easeInSine) to learn more.*/
    sine: (x: number): number => 1 - Math.cos((x * Math.PI) / 2),
    /** - **easeInQuad:** check out [easings.net](https://easings.net/#easeInQuad) to learn more.*/
    quad: (x: number): number => x * x,
    /** - **easeInQuart:** check out [easings.net](https://easings.net/#easeInQuart) to learn more.*/
    quart: (x: number): number => x * x * x * x,
    /** - **easeInQuint:** check out [easings.net](https://easings.net/#easeInQuint) to learn more.*/
    quint: (x: number): number => x * x * x * x * x,
  },

  /** - ease out functions */
  out: {
    /** - **easeOutBack:** check out [easings.net](https://easings.net/#easeOutBack) to learn more.*/
    back: (x: number): number => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
    /** - **easeOutBounce:** check out [easings.net](https://easings.net/#easeOutBounce) to learn more.*/
    bounce: (x: number): number => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (x < 1 / d1) {
        return n1 * x * x;
      } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
      } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
      } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
      }
    },
    /** - **easeOutCric:** check out [easings.net](https://easings.net/#easeOutCric) to learn more.*/
    circ: (x: number): number => Math.sqrt(1 - Math.pow(x - 1, 2)),
    /** - **easeOutCubic:** check out [easings.net](https://easings.net/#easeOutCubic) to learn more.*/
    cubic: (x: number): number => 1 - Math.pow(1 - x, 3),
    /** - **easeOutElastic:** check out [easings.net](https://easings.net/#easeOutElastic) to learn more.*/
    elastic: (x: number): number => {
      const c4 = (2 * Math.PI) / 3;
      return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    },
    /** - **easeOutExpo:** check out [easings.net](https://easings.net/#easeOutExpo) to learn more.*/
    expo: (x: number): number => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    /** - **easeOutSine:** check out [easings.net](https://easings.net/#easeOutSine) to learn more.*/
    sine: (x: number): number => Math.sin((x * Math.PI) / 2),
    /** - **easeOutQuad:** check out [easings.net](https://easings.net/#easeOutQuad) to learn more.*/
    quad: (x: number): number => 1 - (1 - x) * (1 - x),
    /** - **easeOutQuart:** check out [easings.net](https://easings.net/#easeOutQuart) to learn more.*/
    quart: (x: number): number => 1 - Math.pow(1 - x, 4),
    /** - **easeOutQuint:** check out [easings.net](https://easings.net/#easeOutQuint) to learn more.*/
    quint: (x: number): number => 1 - Math.pow(1 - x, 5),
  },

  /** - ease in out functions */
  inOut: {
    /** - **easeInOutBack:** check out [easings.net](https://easings.net/#easeInOutBack) to learn more.*/
    back: (x: number): number => {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return x < 0.5
        ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
        : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    },
    /** - **easeInOutBounce:** check out [easings.net](https://easings.net/#easeInOutBounce) to learn more.*/
    bounce: (x: number): number => (x < 0.5 ? (1 - ease.out.bounce(1 - 2 * x)) / 2 : (1 + ease.out.bounce(2 * x - 1)) / 2),
    /** - **easeInOutCric:** check out [easings.net](https://easings.net/#easeInOutCric) to learn more.*/
    circ: (x: number): number =>
      x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
    /** - **easeInOutCubic:** check out [easings.net](https://easings.net/#easeInOutCubic) to learn more.*/
    cubic: (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    /** - **easeInOutElastic:** check out [easings.net](https://easings.net/#easeInOutElastic) to learn more.*/
    elastic: (x: number): number => {
      const c5 = (2 * Math.PI) / 4.5;
      return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
        ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
    },
    /** - **easeInOutExpo:** check out [easings.net](https://easings.net/#easeInOutExpo) to learn more.*/
    expo: (x: number): number =>
      x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
    /** - **easeInOutSine:** check out [easings.net](https://easings.net/#easeInOutSine) to learn more.*/
    sine: (x: number): number => -(Math.cos(Math.PI * x) - 1) / 2,
    /** - **easeInOutQuad:** check out [easings.net](https://easings.net/#easeInOutQuad) to learn more.*/
    quad: (x: number): number => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
    /** - **easeInOutQuart:** check out [easings.net](https://easings.net/#easeInOutQuart) to learn more.*/
    quart: (x: number): number => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2),
    /** - **easeInOutQuint:** check out [easings.net](https://easings.net/#easeInOutQuint) to learn more.*/
    quint: (x: number): number => (x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2),
  },

  /** - default easing function. */
  linear: (x: number): number => x,
  /**
   * - defines a [cubic Bézier curve](https://developer.mozilla.org/en-US/docs/Glossary/Bezier_curve).
   * - similar to CSS's **cubic-bezier** easing  function.
   * **Syntax:** `cubicBezier(x1, y1, x2, y2)`
   */
  cubicBezier: (X1: number, Y1: number, X2: number, Y2: number) => ease.custom(`M 0 0 C ${X1} ${Y1} ${X2} ${Y2} 1 1`),
  /**
   * - takes svg path d attribute as a string.
   * - **custom ease:** check out [Animare Ease Visualizer](https://animare-ease-visualizer.netlify.app/) to learn more.
   */
  custom: (d: string): ((x: number) => number) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    const pathLength = path.getTotalLength();
    return (x: number): number => {
      let start = 0;
      let end = pathLength;
      let target = (start + end) / 2;
      let result = x;
      while (target >= start && target <= pathLength) {
        const pos = path.getPointAtLength(target);
        if (Math.abs(pos.x - x) <= (x === 1 ? 0 : 0.001)) {
          result = pos.y;
          return result;
        } else if (pos.x >= x) {
          end = target;
        } else {
          start = target;
        }
        target = (start + end) / 2;
      }
      return result;
    };
  },
};