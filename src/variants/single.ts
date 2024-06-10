import { animare } from '../animare';
import { extendObject } from '../utils/utils';

import type { AnimationValuesParam, SingleAnimationValue, SingleOnUpdateCallback, SingleReturnObj } from '../types';

/**
 * Play a single animation.
 *
 * @param animation - animation options
 * @param onUpdateCallback - a callback function that is called on each animation frame
 * @returns an object that contains a bunch of useful methods and events
 *
 * @example
 * // Play a single animation with infinite repetition
 * const methods = animare.single({ to: 100, playCount: -1 }, info => console.log(info));
 */
export default function single(animation: SingleAnimationValue, onUpdateCallback: SingleOnUpdateCallback): SingleReturnObj {
  const isInfinite = typeof animation.playCount === 'number' && animation.playCount < 0;

  const animationOptions = [
    {
      ...animation,
      name: 'single',
      playCount: isInfinite ? 1 : animation.playCount,
    },
  ] as AnimationValuesParam;

  const timelineOptions = {
    autoPlay: animation.autoPlay ?? true,
    timelinePlayCount: isInfinite ? -1 : 1,
  };

  const timelineReturnObj = animare(animationOptions, info => onUpdateCallback(info[0]), timelineOptions);

  const timelineUpdateValues = timelineReturnObj.updateValues;

  const singleReturnObj = extendObject(timelineReturnObj, {
    updateValues: (newValues: Partial<SingleAnimationValue>) => timelineUpdateValues([{ name: 'single', ...newValues }]),
    animationsInfo: timelineReturnObj.animationsInfo[0],
  });

  return singleReturnObj;
}

export type Single = typeof single;
