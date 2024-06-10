import Animation from '../animation';
import { AnimationTiming, Direction } from '../types';

import type { AnimationGlobalValues, AnimationPreparedValues, AnimationValues } from '../types';

export const defaultValues: Omit<AnimationPreparedValues, 'name' | 'to'> = {
  from: 0,
  duration: 350,
  delay: 0,
  delayCount: 1,
  playCount: 1,
  direction: Direction.Forward,
  timing: AnimationTiming.AfterPrevious,
  ease: t => t,
};

export function isAlternateDirection(direction: Direction): direction is Direction.Alternate | Direction.AlternateReverse {
  return direction === Direction.Alternate || direction === Direction.AlternateReverse;
}

export function isReverseDirection(direction: Direction): direction is Direction.Reverse | Direction.AlternateReverse {
  return direction === Direction.Reverse || direction === Direction.AlternateReverse;
}

export function validateAnimationValues(animation: AnimationValues, ignore: (keyof AnimationValues)[] = []) {
  if (!('name' in ignore) && !animation.name) {
    throw new Error('Animation `name` is required');
  }

  if (!('to' in ignore) && typeof animation.to !== 'number') {
    throw new Error('The `to` value is required');
  }

  if (!('duration' in ignore) && typeof animation.duration === 'number' && animation.duration < 0) {
    throw new Error('The `duration` value cannot be a negative value.');
  }

  if (!('playCount' in ignore) && typeof animation.playCount === 'number' && animation.playCount < 0) {
    throw new Error('The `playCount` value cannot be a negative value.');
  }

  if (!('delayCount' in ignore) && typeof animation.delayCount === 'number' && animation.delayCount < 0) {
    throw new Error('The `delayCount` value cannot be a negative value.');
  }

  if (
    !('playCount' in ignore) &&
    !('delayCount' in ignore) &&
    typeof animation.playCount === 'number' &&
    typeof animation.delayCount === 'number' &&
    animation.delayCount > animation.playCount
  ) {
    throw new Error('The `delayCount` value cannot be greater than the `playCount` value.');
  }
}

/**
 * - Set the default values for a single animation.
 * - If a value is optional and not passed, the default value from the global values will be used, else a default value will be used.
 */
export function setDefaultValues(animation: AnimationValues, globalValues: AnimationGlobalValues): AnimationPreparedValues {
  const playCount = animation.playCount ?? globalValues.playCount ?? defaultValues.playCount;

  const results: AnimationPreparedValues = {
    name: animation.name,
    to: animation.to,
    from: animation.from ?? globalValues.from ?? defaultValues.from,
    duration: animation.duration ?? globalValues.duration ?? defaultValues.duration,
    delay: animation.delay ?? globalValues.delay ?? defaultValues.delay,
    playCount,
    delayCount: typeof animation.delay === 'number' ? animation.delayCount ?? globalValues.delayCount ?? playCount : 0,
    direction: animation.direction ?? globalValues.direction ?? defaultValues.direction,
    timing: animation.timing ?? globalValues.timing ?? defaultValues.timing,
    ease: animation.ease ?? globalValues.ease ?? defaultValues.ease,
  };

  return results;
}

export function prepareAnimationsValues(
  animations: AnimationValues[],
  globalValues: AnimationGlobalValues,
): AnimationPreparedValues[] {
  const results: AnimationPreparedValues[] = [];

  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];

    const isFirst = i === 0;
    const hasTiming = typeof animation.timing !== 'undefined';
    const isNotFromStart = hasTiming && animation.timing !== AnimationTiming.FromStart;

    validateAnimationValues(animation);

    if (isFirst) {
      // first animation always should play from the start.
      if (isNotFromStart) console.warn(`The timing value in the first animation must be "${AnimationTiming.FromStart}".`);

      animation.timing = AnimationTiming.FromStart;
    }

    results.push(setDefaultValues(animation, globalValues));
  }

  return results;
}

export function prepareTimelineValues(options: AnimationGlobalValues) {
  if (options.timelinePlayCount === 0) {
    console.warn('The `timelinePlayCount` with the value `0` will make the timeline not play.');
  }

  return {
    timelinePlayCount: options.timelinePlayCount ?? 1,
    autoPlay: options.autoPlay ?? true,
  };
}

export function calculateTimeline(animations: AnimationPreparedValues[]) {
  const timelines: Animation[] = [];

  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];
    const previousTimeline: Animation | undefined = timelines[i - 1];

    const isFirst = i === 0;
    if (isFirst && animation.timing !== AnimationTiming.FromStart) {
      throw new Error(`The timing value in the first animation must be "${AnimationTiming.FromStart}".`);
    }

    timelines.push(new Animation(animation, previousTimeline, i));
  }

  return timelines;
}

export function calculateTimelineDuration(timelines: Animation[]) {
  const timelineDuration = Math.max(...timelines.map(t => t.endPoint));
  return timelineDuration === Infinity ? Number.MAX_SAFE_INTEGER : timelineDuration;
}
