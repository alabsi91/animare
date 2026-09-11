import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ease } from 'animare/plugins';

import { assertClose } from './harness.ts';

import type { EaseFunction } from 'animare';

const samples = Array.from({ length: 1001 }, (_, index) => index / 1000);

describe('endpoints', () => {
  const easings: Record<string, EaseFunction> = {
    linear: ease.linear,
    'steps()': ease.steps(),
    'cubicBezier()': ease.cubicBezier(0.25, 0.1, 0.25, 1),
    'fromPoints()': ease.fromPoints([0, 0.5, 1]),
    'custom()': ease.custom('M0,1 C0.5,1,0.5,0,1,0'),
  };

  for (const variant of ['in', 'out', 'inOut'] as const) {
    const group = ease[variant];
    Object.assign(easings, {
      [`${variant}.sine`]: group.sine,
      [`${variant}.quad`]: group.quad,
      [`${variant}.cubic`]: group.cubic,
      [`${variant}.quart`]: group.quart,
      [`${variant}.quint`]: group.quint,
      [`${variant}.expo`]: group.expo,
      [`${variant}.circ`]: group.circ,
      [`${variant}.poly(3)`]: group.poly(3),
      [`${variant}.back()`]: group.back(),
      [`${variant}.bounce()`]: group.bounce(),
      [`${variant}.elastic()`]: group.elastic(),
      [`${variant}.wobble()`]: group.wobble(),
      [`${variant}.spring()`]: group.spring(),
    });
  }

  for (const [name, easing] of Object.entries(easings)) {
    it(`${name} goes from 0 to 1`, () => {
      assertClose(easing(0), 0, 1e-9);
      assertClose(easing(1), 1, 1e-9);
    });
  }
});

describe('bounce', () => {
  it('matches the classic bounce by default', () => {
    const classic = (t: number) => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) return n1 * t * t;
      if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
      if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    };

    const bounce = ease.out.bounce();
    for (const t of samples) assertClose(bounce(t), classic(t), 1e-12);
  });

  it('touches the ground once per rebound', () => {
    const bounce = ease.out.bounce(2, 0.5);
    const groundHits = samples.filter(t => t > 0 && Math.abs(bounce(t) - 1) < 1e-3).length;

    assert.ok(groundHits >= 3);
    assertClose(ease.out.bounce(0)(0.5), 0.25);
  });
});

describe('elastic', () => {
  it('matches the classic elastic by default', () => {
    const c4 = (2 * Math.PI) / 3;
    const c5 = (2 * Math.PI) / 4.5;
    const classic = {
      in: (t: number) => (t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4)),
      out: (t: number) => (t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1),
      inOut: (t: number) =>
        t === 0
          ? 0
          : t === 1
            ? 1
            : t < 0.5
              ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
              : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1,
    };

    for (const variant of ['in', 'out', 'inOut'] as const) {
      const elastic = ease[variant].elastic();
      for (const t of samples) assertClose(elastic(t), classic[variant](t), 1e-12);
    }
  });

  it('overshoots more with a higher amplitude', () => {
    const peak = (easing: EaseFunction) => Math.max(...samples.map(t => easing(t)));

    assert.ok(peak(ease.out.elastic(2)) > peak(ease.out.elastic(1)));
    assert.equal(peak(ease.out.elastic(0.5)), peak(ease.out.elastic(1)));
  });
});

describe('spring', () => {
  it('treats velocity 0 as no initial velocity', () => {
    assert.notEqual(ease.out.spring({ velocity: 0 })(0.3), ease.out.spring({ velocity: 0.1 })(0.3));
  });

  it('mirrors in and inOut from out', () => {
    const out = ease.out.spring();
    const inSpring = ease.in.spring();
    const inOut = ease.inOut.spring();

    assertClose(inSpring(0.3), 1 - out(0.7));
    assertClose(inOut(0.25), (1 - out(0.5)) / 2);
    assertClose(inOut(0.5), 0.5);
  });
});

describe('others', () => {
  it('steps', () => {
    assert.deepEqual([0, 0.1, 0.3, 0.6, 1].map(ease.steps(4)), [0, 1 / 4, 2 / 4, 3 / 4, 1]);
    assert.deepEqual([0, 0.1, 0.3, 0.6, 1].map(ease.steps(4, false)), [0, 0, 1 / 4, 2 / 4, 1]);
  });

  it('cubicBezier', () => {
    assertClose(ease.cubicBezier(0.25, 0.1, 0.25, 1)(0.5), 0.8024, 1e-3);
    assert.equal(ease.cubicBezier(0, 0, 1, 1), ease.cubicBezier(0.5, 0.5, 0.5, 0.5));
    assert.throws(() => ease.cubicBezier(-1, 0, 0.5, 1));
  });

  it('fromPoints', () => {
    const easing = ease.fromPoints([0, 0.5, 1]);

    assert.equal(easing(0.4), 0.5);
    assert.equal(easing(0.9), 1);
    assert.throws(() => ease.fromPoints('nope' as unknown as number[]));
  });

  it('custom', () => {
    assertClose(ease.custom('M0,1 C0.5,1,0.5,0,1,0')(0.5), 0.5, 1e-4);
  });

  it('wobble(0) does not overshoot', () => {
    assert.ok(samples.every(t => ease.in.wobble(0)(t) <= 1 + 1e-9));
  });
});
