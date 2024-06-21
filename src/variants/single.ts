import timeline from './timeline';
import { extendObject } from '../utils/utils';

import type {
  AnimationOptionsParam,
  SingleAnimationOptions,
  SingleAnimationOptionsWithoutFn,
  SingleObject,
  SingleOnUpdateCallback,
} from '../types';

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
export default function single(animation: SingleAnimationOptions, onUpdateCallback: SingleOnUpdateCallback): SingleObject {
  const isInfinite = typeof animation.playCount === 'number' && animation.playCount < 0;

  const animationOptions = [
    {
      ...animation,
      name: 'single',
      playCount: isInfinite ? 1 : animation.playCount,
    },
  ] as AnimationOptionsParam;

  const timelineOptions = {
    autoPlay: animation.autoPlay ?? true,
    timelinePlayCount: isInfinite ? -1 : 1,
  };

  const timelineReturnObj = timeline(animationOptions, info => onUpdateCallback(info[0]), timelineOptions);

  const timelineUpdateValues = timelineReturnObj.updateValues;

  const updateValues = (newValues: Partial<SingleAnimationOptionsWithoutFn>) => {
    if ('autoPlay' in newValues) {
      timelineReturnObj.updateTimelineOptions({ autoPlay: newValues.autoPlay });
      delete newValues.autoPlay;
    }

    if ('playCount' in newValues) {
      timelineReturnObj.updateTimelineOptions({ timelinePlayCount: newValues.playCount });
      delete newValues.playCount;
    }

    timelineUpdateValues([{ name: 'single', ...newValues }]);
  };

  const singleReturnObj = extendObject(timelineReturnObj, {
    updateValues,
    animationsInfo: timelineReturnObj.animationsInfo[0],
  });

  return singleReturnObj;
}

export type Single = typeof single;
