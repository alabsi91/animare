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

    // same mapping as on creation: a negative playCount repeats the timeline forever, otherwise the animation repeats
    if (typeof newValues.playCount === 'number') {
      const isInfinite = newValues.playCount < 0;
      timelineReturnObject.updateTimelineOptions({ timelinePlayCount: isInfinite ? -1 : 1 });
      newValues = { ...newValues, playCount: isInfinite ? 1 : newValues.playCount };
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
