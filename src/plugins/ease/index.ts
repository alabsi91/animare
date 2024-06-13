import cubicBezier from './cubicBezier.js';
import { generateEasingFunctionFromString } from './customEase.js';
import { fromPoints, linear, spring, steps } from './ease.js';
import easeIn from './easeIn.js';
import easeInOut from './easeInOut.js';
import easeOut from './easeOut.js';

import type { Ease } from './types.js';

export const ease: Ease = {
  in: easeIn,
  out: easeOut,
  inOut: easeInOut,
  linear,
  cubicBezier,
  custom: generateEasingFunctionFromString,
  fromPoints,
  steps,
  spring,
};
