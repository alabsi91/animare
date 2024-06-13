import type { SpringParams, EaseFn } from './types';

export function spring({ mass = 1, stiffness = 100, damping = 10, velocity = 0, duration = 1000 }: SpringParams = {}): EaseFn {
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
}

export function steps(steps = 10, start = true): EaseFn {
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
  const trunc = start ? Math.ceil : Math.floor;
  return (progress: number) => trunc(clamp(progress, 0, 1) * steps) / steps;
}

export function fromPoints(values: Float32List): EaseFn {
  if (!(values instanceof Float32Array) && !Array.isArray(values))
    throw new Error('\n\n⛔ [animare] ➡️ [ease] ➡️ [fromPoints] : first param must be an Array or Float32Array. !!\n\n');

  const length = values.length;

  return (t: number) => values[Math.floor(t * length)] ?? values[length - 1];
}

export function wobble(bounciness = 1): EaseFn {
  const p = bounciness * Math.PI;
  return (t: number): number => 1 - Math.pow(Math.cos((t * Math.PI) / 2), 3) * Math.cos(t * p);
}

export function bounce(t: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
}

export function linear(t: number) {
  return t;
}
