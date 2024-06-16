import Animation from '../animation';
import { AnimationTiming, Direction } from '../types';

import type { TimelineGlobalOptions, AnimationPreparedOptions, AnimationOptions, RemoveFunction } from '../types';

export const defaultValues = {
  from: 0,
  duration: 350,
  delay: 0,
  delayCount: 1,
  playCount: 1,
  direction: Direction.Forward,
  timing: AnimationTiming.AfterPrevious,
  ease: (t: number) => t,
};

/**
 * Returns `true` if the animation is an alternate or alternate-reverse direction
 */
export function isAlternateDirection(direction: Direction): direction is Direction.Alternate | Direction.AlternateReverse {
  return direction === Direction.Alternate || direction === Direction.AlternateReverse;
}

/**
 * Returns `true` if the animation is an reverse or alternate-reverse direction
 */
export function isReverseDirection(direction: Direction): direction is Direction.Reverse | Direction.AlternateReverse {
  return direction === Direction.Reverse || direction === Direction.AlternateReverse;
}

export function validateAnimationValues(animation: AnimationOptions) {
  if (!animation.name) throw new Error('Animation `name` is required');

  if (typeof animation.to !== 'number') throw new Error('The `to` value is required');

  if (typeof animation.duration === 'number' && animation.duration < 0)
    throw new Error('The `duration` value cannot be a negative value.');

  if (typeof animation.playCount === 'number' && animation.playCount < 0)
    throw new Error('The `playCount` value cannot be a negative value.');

  if (typeof animation.delayCount === 'number' && animation.delayCount < 0)
    throw new Error('The `delayCount` value cannot be a negative value.');

  if (
    typeof animation.playCount === 'number' &&
    typeof animation.delayCount === 'number' &&
    animation.delayCount > animation.playCount
  )
    throw new Error('The `delayCount` value cannot be greater than the `playCount` value.');
}

/**
 * - Set the default values for a single animation.
 * - If a value is optional and not passed, the default value from the global values will be used, else a default value will be used.
 */
export function setDefaultValues(
  animation: AnimationOptions,
  globalValues: TimelineGlobalOptions,
  index: number,
): AnimationPreparedOptions {
  // call functions with the current index
  const perValue = <T>(value: T): RemoveFunction<T> => (typeof value === 'function' ? value(index) : value);

  const from = perValue(animation.from) ?? globalValues.from ?? defaultValues.from,
    duration = perValue(animation.duration) ?? globalValues.duration ?? defaultValues.duration,
    delay = perValue(animation.delay) ?? globalValues.delay ?? defaultValues.delay,
    playCount = perValue(animation.playCount) ?? globalValues.playCount ?? defaultValues.playCount,
    delayCount = typeof delay === 'number' ? perValue(animation.delayCount) ?? globalValues.delayCount ?? playCount : 0,
    direction = perValue(animation.direction) ?? globalValues.direction ?? defaultValues.direction,
    timing = perValue(animation.timing) ?? globalValues.timing ?? defaultValues.timing;

  const results: AnimationPreparedOptions = {
    name: animation.name,
    to: animation.to,
    from,
    duration,
    delay,
    playCount,
    delayCount,
    direction,
    timing,
    ease: animation.ease ?? globalValues.ease ?? defaultValues.ease,
  };

  return results;
}

export function prepareAnimationsValues(
  animations: AnimationOptions[],
  globalValues: TimelineGlobalOptions,
): AnimationPreparedOptions[] {
  const results: AnimationPreparedOptions[] = [];

  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];

    const withDefaultValues = setDefaultValues(animation, globalValues, i);

    // first animation always should play from the start.
    if (i === 0) withDefaultValues.timing = AnimationTiming.FromStart;

    validateAnimationValues(withDefaultValues);

    results.push(withDefaultValues);
  }

  return results;
}

export function prepareTimelineValues(options: TimelineGlobalOptions) {
  if (options.timelinePlayCount === 0) {
    console.warn('The `timelinePlayCount` with the value `0` will make the timeline not play.');
  }

  return {
    timelinePlayCount: options.timelinePlayCount ?? 1,
    autoPlay: options.autoPlay ?? true,
  };
}

/**
 * Create `Animation` classes and return them in an array
 */
export function calculateTimeline(animations: AnimationPreparedOptions[]) {
  const timelines: Animation[] = [];

  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];
    const previousTimeline: Animation | undefined = timelines[i - 1];

    // should not throw, because we already forced it to be `AnimationTiming.FromStart`
    if (i === 0 && animation.timing !== AnimationTiming.FromStart) {
      throw new Error(`The timing value in the first animation must be "${AnimationTiming.FromStart}".`);
    }

    timelines.push(new Animation(animation, previousTimeline, i));
  }

  return timelines;
}

/** Returns the overall duration of the timeline */
export function calculateTimelineDuration(timelines: Animation[]) {
  const timelineDuration = Math.max(...timelines.map(t => t.endPoint));
  return timelineDuration === Infinity ? Number.MAX_SAFE_INTEGER : timelineDuration;
}