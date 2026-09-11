import { Timing } from '../types.js';
import timeline from './timeline.js';

import type {
  AnimationGroupOptions,
  AnimationOptions,
  AnimationOptionsParameter,
  Direction,
  EaseFunction,
  GroupOnUpdateCallback,
  GroupTimelineObject,
  PartialExcept,
} from '../types.js';

/**
 * Allows for a different input method where you can use an object with arrays of values for each property instead of an array of
 * animation values.
 *
 * You can also use a single value as a default for all animations.
 *
 * ⚠️ **WARNING** ⚠️ All values must have the same length as the `to` value.
 *
 * 💁 Animation names become their index. For example, `myAnimation.updateValues([{ name: '0', duration: 5000 }])`.
 *
 * @example
 *   animare.group({ from: 50, to: [100, 200, 300], delay: [500, 600, 700] }, info => {
 *     console.log(info[0].value);
 *   });
 *
 * @param animation - An object containing the animation options.
 * @param callback - A callback function that is called on each animation frame.
 * @returns An object that contains a collection of useful methods and events.
 */
export default function group(animation: AnimationGroupOptions, callback: GroupOnUpdateCallback): GroupTimelineObject {
  if (animation.to === undefined) throw new Error('[group] The `to` value is required');

  animation.to = typeof animation.to === 'number' ? [animation.to] : animation.to;
  const length = animation.to.length;

  const isNumber = (value: unknown): value is number => typeof value === 'number';
  const isDirection = (value: unknown): value is Direction => typeof value === 'object' && !Array.isArray(value);
  const isTiming = (value: unknown): value is Timing => typeof value === 'object' && !Array.isArray(value);
  const isEase = (value: unknown): value is EaseFunction => typeof value === 'function';

  const fill = <T>(value: T) => Array.from({ length }, () => value);

  const prepared = {
    to: animation.to,
    from: isNumber(animation.from) ? fill(animation.from) : animation.from,
    offset: isNumber(animation.offset) ? fill(animation.offset) : animation.offset,
    delay: isNumber(animation.delay) ? fill(animation.delay) : animation.delay,
    delayCount: isNumber(animation.delayCount) ? fill(animation.delayCount) : animation.delayCount,
    playCount: isNumber(animation.playCount) ? fill(animation.playCount) : animation.playCount,
    direction: isDirection(animation.direction) ? fill(animation.direction) : animation.direction,
    timing: isTiming(animation.timing) ? fill(animation.timing) : animation.timing,
    duration: isNumber(animation.duration) ? fill(animation.duration) : animation.duration,
    ease: isEase(animation.ease) ? fill(animation.ease) : animation.ease,
  };

  const animationOptions = Array.from<AnimationOptions>({ length });

  for (let index = 0; index < length; index++) {
    animationOptions[index] = {
      name: index.toString(),
      to: prepared.to[index],
      from: Array.isArray(prepared.from) ? prepared.from[index] : prepared.from,
      offset: Array.isArray(prepared.offset) ? prepared.offset[index] : prepared.offset,
      delay: Array.isArray(prepared.delay) ? prepared.delay[index] : prepared.delay,
      delayCount: Array.isArray(prepared.delayCount) ? prepared.delayCount[index] : prepared.delayCount,
      playCount: Array.isArray(prepared.playCount) ? prepared.playCount[index] : prepared.playCount,
      direction: Array.isArray(prepared.direction) ? prepared.direction[index] : prepared.direction,
      timing: index === 0 ? Timing.FromStart : Array.isArray(prepared.timing) ? prepared.timing[index] : prepared.timing,
      duration: Array.isArray(prepared.duration) ? prepared.duration[index] : prepared.duration,
      ease: Array.isArray(prepared.ease) ? prepared.ease[index] : prepared.ease,
    };
  }

  const timelineReturnObject = timeline(animationOptions as AnimationOptionsParameter<`${number}`>, callback, {
    autoPlay: animation.autoPlay,
    timelinePlayCount: animation.timelinePlayCount,
    timelineSpeed: animation.timelineSpeed,
  });

  const timelineUpdateValues = timelineReturnObject.updateValues;

  const updateValues: GroupTimelineObject['updateValues'] = newValues => {
    const mapped: PartialExcept<AnimationOptions<`${number}`>, 'name'>[] = [];

    for (const [index, newValue] of newValues.entries()) {
      if (typeof newValue.index !== 'number') throw new Error('[updateValues] Animation index is required.');
      mapped[index] = { name: `${newValue.index}`, ...newValue };
    }

    timelineUpdateValues(mapped);
  };

  const groupReturnObject = Object.assign(timelineReturnObject, { updateValues });

  return groupReturnObject;
}

export type Group = typeof group;
