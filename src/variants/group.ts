import timeline from './timeline';
import { Timing } from '../types';

import type {
  AnimationGroupOptions,
  AnimationOptions,
  AnimationOptionsParam,
  Direction,
  EaseFn,
  GroupOnUpdateCallback,
} from '../types';

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
export default function group(animation: AnimationGroupOptions, callback: GroupOnUpdateCallback) {
  if (typeof animation.to === 'undefined') throw new Error('[group] The `to` value is required');

  animation.to = typeof animation.to === 'number' ? [animation.to] : animation.to;
  const length = animation.to.length;

  const isNumber = (value: unknown): value is number => typeof value === 'number';
  const isDirection = (value: unknown): value is Direction => typeof value === 'object' && !Array.isArray(value);
  const isTiming = (value: unknown): value is Timing => typeof value === 'object' && !Array.isArray(value);
  const isEase = (value: unknown): value is EaseFn => typeof value === 'function';

  const fill = <T>(value: T) => new Array<T>(length).fill(value);

  const prepared = {
    to: animation.to,
    from: isNumber(animation.from) ? fill(animation.from) : animation.from,
    delay: isNumber(animation.delay) ? fill(animation.delay) : animation.delay,
    delayCount: isNumber(animation.delayCount) ? fill(animation.delayCount) : animation.delayCount,
    playCount: isNumber(animation.playCount) ? fill(animation.playCount) : animation.playCount,
    direction: isDirection(animation.direction) ? fill(animation.direction) : animation.direction,
    timing: isTiming(animation.timing) ? fill(animation.timing) : animation.timing,
    duration: isNumber(animation.duration) ? fill(animation.duration) : animation.duration,
    ease: isEase(animation.ease) ? fill(animation.ease) : animation.ease,
  };

  const animationOptions: AnimationOptions[] = new Array(length);

  for (let i = 0; i < length; i++) {
    animationOptions[i] = {
      name: i.toString(),
      to: prepared.to[i],
      from: Array.isArray(prepared.from) ? prepared.from[i] : prepared.from,
      delay: Array.isArray(prepared.delay) ? prepared.delay[i] : prepared.delay,
      delayCount: Array.isArray(prepared.delayCount) ? prepared.delayCount[i] : prepared.delayCount,
      playCount: Array.isArray(prepared.playCount) ? prepared.playCount[i] : prepared.playCount,
      direction: Array.isArray(prepared.direction) ? prepared.direction[i] : prepared.direction,
      timing: i === 0 ? Timing.FromStart : Array.isArray(prepared.timing) ? prepared.timing[i] : prepared.timing,
      duration: Array.isArray(prepared.duration) ? prepared.duration[i] : prepared.duration,
      ease: Array.isArray(prepared.ease) ? prepared.ease[i] : prepared.ease,
    };
  }

  return timeline(animationOptions as AnimationOptionsParam<`${number}`>, callback, {
    autoPlay: animation.autoPlay,
    timelinePlayCount: animation.timelinePlayCount,
  });
}

export type Group = typeof group;
