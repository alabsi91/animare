import { animare } from '../animare';
import { AnimationTiming } from '../types';

import type { AnimationGroupValues, AnimationValues, AnimationValuesParam, CallbackInfo, TimelineInfo } from '../types';

/**
 * Allows for a different input method where you can use an object with arrays of values for each property instead of an array of animation values.
 *
 * You can also use a single value as a default for all animations.
 *
 * ⚠️ **WARNING** ⚠️ All values must have the same length as the `to` value.
 *
 * 💁 Animation names become their index. For example, `myAnimation.updateValues([{ name: '0', duration: 5000 }])`.
 *
 * @param animation - An object containing the animation options.
 * @param callback - A callback function that is called on each animation frame.
 * @returns An object that contains a collection of useful methods and events.
 *
 * @example
 * animare.group({ from: 50, to: [100, 200, 300], delay: [500, 600, 700] }, info => {
 *  console.log(info[0].value);
 * });
 */
export default function group(
  animation: AnimationGroupValues,
  callback: (info: CallbackInfo<`${number}`>, timelineInfo: TimelineInfo) => void,
) {
  if (typeof animation.to === 'undefined') throw new Error('[group] The `to` value is required');

  animation.to = typeof animation.to === 'number' ? [animation.to] : animation.to;
  const length = animation.to.length;

  const fill = <V>(value: V[] | V | undefined): V[] | undefined => {
    if (typeof value === 'undefined') return value as undefined;

    if (Array.isArray(value)) {
      if (value.length !== length) throw new Error('[group] All values should have the same length as the `to` value.');
      return value;
    }

    return new Array(length).fill(value);
  };

  const prepared = {
    to: animation.to,
    from: fill(animation.from),
    delay: fill(animation.delay),
    delayCount: fill(animation.delayCount),
    playCount: fill(animation.playCount),
    direction: fill(animation.direction),
    timing: fill(animation.timing),
    duration: fill(animation.duration),
    ease: fill(animation.ease),
  };

  const animationOptions: AnimationValues[] = new Array(length);

  for (let i = 0; i < length; i++) {
    animationOptions[i] = {
      name: i.toString(),
      to: prepared.to[i],
      from: prepared.from ? prepared.from[i] : undefined,
      delay: prepared.delay ? prepared.delay[i] : undefined,
      delayCount: prepared.delayCount ? prepared.delayCount[i] : undefined,
      playCount: prepared.playCount ? prepared.playCount[i] : undefined,
      direction: prepared.direction ? prepared.direction[i] : undefined,
      timing: i === 0 ? AnimationTiming.FromStart : prepared.timing?.[i],
      duration: prepared.duration ? prepared.duration[i] : undefined,
      ease: prepared.ease ? prepared.ease[i] : undefined,
    };
  }

  return animare(animationOptions as AnimationValuesParam<`${number}`>, callback, {
    autoPlay: animation.autoPlay,
    timelinePlayCount: animation.timelinePlayCount,
  });
}

export type Group = typeof group;
