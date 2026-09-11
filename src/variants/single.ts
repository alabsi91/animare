import timeline from './timeline.js';

import type {
  AnimationOptionsParameter,
  SingleAnimationOptions,
  SingleAnimationOptionsWithoutFunction,
  SingleObject,
  SingleOnUpdateCallback,
} from '../types.js';

/**
 * Play a single animation.
 *
 * @example
 *   // Play a single animation with infinite repetition
 *   const methods = animare.single({ to: 100, playCount: -1 }, info => console.log(info));
 *
 * @param animation - Animation options
 * @param onUpdateCallback - A callback function that is called on each animation frame
 * @returns An object that contains a bunch of useful methods and events
 */
export default function single(animation: SingleAnimationOptions, onUpdateCallback: SingleOnUpdateCallback): SingleObject {
  const isInfinite = typeof animation.playCount === 'number' && animation.playCount < 0;

  const animationOptions = [
    {
      ...animation,
      name: 'single',
      playCount: isInfinite ? 1 : animation.playCount,
    },
  ] as AnimationOptionsParameter;

  const timelineOptions = {
    autoPlay: animation.autoPlay ?? true,
    timelinePlayCount: isInfinite ? -1 : 1,
  };

  const timelineReturnObject = timeline(animationOptions, info => onUpdateCallback(info[0]), timelineOptions);

  const timelineUpdateValues = timelineReturnObject.updateValues;

  const updateValues = (newValues: Partial<SingleAnimationOptionsWithoutFunction>) => {
    if ('autoPlay' in newValues) {
      timelineReturnObject.updateTimelineOptions({ autoPlay: newValues.autoPlay });
      delete newValues.autoPlay;
    }

    if ('playCount' in newValues) {
      timelineReturnObject.updateTimelineOptions({ timelinePlayCount: newValues.playCount });
      delete newValues.playCount;
    }

    timelineUpdateValues([{ name: 'single', ...newValues }]);
  };

  const singleReturnObject = Object.assign(timelineReturnObject, {
    updateValues,
    animationsInfo: timelineReturnObject.animationsInfo[0],
  });

  return singleReturnObject;
}

export type Single = typeof single;
