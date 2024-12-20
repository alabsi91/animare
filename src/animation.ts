import { Direction, Timing } from './types.js';
import { isAlternateDirection, isReverseDirection, validateAnimationValues } from './utils/helpers.js';
import { clamp, normalizePercentage } from './utils/utils.js';

import type { AnimationInfo, AnimationPreparedOptions } from './types.js';

export default class Animation {
  /** The index of the animation. */
  #index: number;

  /** The start time of the animation, without accounting for delays, in milliseconds. */
  #start: number;

  /** The end time of the animation, without accounting for delays and repeats, in milliseconds. */
  #end: number;

  /** The starting point in time, in milliseconds. */
  #startPoint: number;

  /** The end point in time, including delays and repeats, in milliseconds. */
  endPoint: number;

  /** The starting value of the animation, relative to its direction. */
  #startValue: number;

  /** The current animated value. */
  #value: number;

  /** The ending value of the animation, relative to its direction. */
  #endValue: number;

  /** The number of remaining times to apply the delay. */
  #delayCount: number;

  /** The current lap of the alternate direction. */
  #alternateLap: 0 | 1 = 0;

  /** The number of remaining times the animation should play. */
  #playCount: number;

  /** The current animation progress, from `0` to `1`, excluding delays. */
  #progress: number = 0;

  /** The overall progress, from `0` to `1`, including delays and repeats. */
  #overallProgress: number = 0;

  /** The elapsed time of the animation, in milliseconds. */
  #elapsedTime: number = 0;

  /** Indicates whether the animation has finished. */
  #isFinished: boolean = false;

  /** Indicates whether the animation is currently playing. */
  #isPlaying: boolean = false;

  /** Indicates whether the animation is in reverse. */
  #isReverse: boolean;

  /** Indicates whether the animation alternates direction. */
  #isAlternate: boolean;

  /** The reference to the prepared animation values. */
  animationRef: AnimationPreparedOptions;

  #previousTimelineRef: Animation | undefined;

  #isProgressAt(progress: number, tolerance = 0.001): boolean {
    return Math.abs(this.#progress - progress) < tolerance;
  }

  #isTimeAt(time: number, tolerance = 5): boolean {
    return Math.abs(this.#elapsedTime - time) < tolerance;
  }

  // preserve info object reference
  #infoRef: AnimationInfo = Object.create(null);

  get info(): AnimationInfo {
    return Object.assign(this.#infoRef, {
      name: this.animationRef.name,
      index: this.#index,
      value: this.#value,
      progress: this.#progress,
      overallProgress: this.#overallProgress,
      elapsedTime: this.#elapsedTime,
      isFinished: this.#isFinished,
      delayCount: this.#delayCount,
      playCount: this.#playCount,
      isPlaying: this.#isPlaying,
      isProgressAt: this.#isProgressAt.bind(this),
      isTimeAt: this.#isTimeAt.bind(this),
    });
  }

  constructor(animation: AnimationPreparedOptions, previousTimeline: Animation | undefined, index: number) {
    this.#index = index;
    this.animationRef = animation;
    this.#previousTimelineRef = previousTimeline;

    this.Setup();
  }

  public Setup() {
    this.#isFinished = false;
    this.#isPlaying = false;
    this.#elapsedTime = 0;
    this.#progress = 0;
    this.#overallProgress = 0;
    this.#alternateLap = 0;
    this.#playCount = 0;
    this.#delayCount = 0;

    this.#isAlternate = isAlternateDirection(this.animationRef.direction);
    this.#isReverse = isReverseDirection(this.animationRef.direction);

    this.#startValue = this.#isReverse ? this.animationRef.to : this.animationRef.from;
    this.#value = this.#isReverse ? this.animationRef.to : this.animationRef.from;
    this.#endValue = this.#isReverse ? this.animationRef.from : this.animationRef.to;

    const offset = this.animationRef.offset;
    const delay = this.animationRef.delayCount === 0 ? 0 : this.animationRef.delay;
    const overallDuration = this.animationRef.duration * this.animationRef.playCount + delay * this.animationRef.delayCount;

    // ensure that the first animation is always `Timing.FromStart`
    const timing = this.#index === 0 ? Timing.FromStart : this.animationRef.timing;

    switch (timing) {
      case Timing.FromStart:
        this.#startPoint = offset;
        break;
      case Timing.AfterPrevious:
        if (!this.#previousTimelineRef) throw new Error('The previous animation is not defined.');
        this.#startPoint = this.#previousTimelineRef.endPoint + offset;
        break;
      case Timing.WithPrevious:
        if (!this.#previousTimelineRef) throw new Error('The previous animation is not defined.');
        this.#startPoint = this.#previousTimelineRef.#startPoint + offset;
        break;
    }

    this.endPoint = this.#startPoint + overallDuration;
    this.#start = this.#startPoint + delay;
    this.#end = this.#start + this.animationRef.duration;
  }

  public Update(elapsedTime: number) {
    // technically disabled
    if (this.animationRef.playCount === 0) return;

    // the current time is after this animation (finished)
    if (elapsedTime >= this.endPoint) {
      this.#isPlaying = false;
      this.#isFinished = true;

      this.#playCount = this.animationRef.playCount;
      this.#delayCount = this.animationRef.delayCount;

      this.#progress = 1;
      this.#overallProgress = 1;
      this.#elapsedTime = this.endPoint - this.#startPoint;

      const isReverse = this.animationRef.direction === Direction.Reverse || this.animationRef.direction === Direction.Alternate;
      this.#value = isReverse ? this.animationRef.from : this.animationRef.to;

      return;
    }

    // the current time is before this animation (not started yet)
    if (elapsedTime < this.#startPoint) {
      this.#isPlaying = false;
      this.#isFinished = false;

      this.#playCount = 0;
      this.#delayCount = 0;

      this.#progress = 0;
      this.#overallProgress = 0;
      this.#elapsedTime = 0;

      this.#value = this.#isReverse ? this.animationRef.to : this.animationRef.from;
      return;
    }

    // the current time is in this animation (playing)
    this.#isPlaying = true;
    this.#overallProgress = normalizePercentage((elapsedTime - this.#startPoint) / (this.endPoint - this.#startPoint));
    this.#calculateValues(elapsedTime);
  }

  /**
   * Set or update the animation values.
   *
   * ⚠️ **Warning** ⚠️ This method will throw an error if the animation values are invalid.
   */
  public Set(animation: Partial<AnimationPreparedOptions>) {
    Object.assign(this.animationRef, animation);
    validateAnimationValues(this.animationRef);
  }

  #calculateValues(elapsedTime: number): void {
    const withDelayCount = this.animationRef.delayCount;

    const withoutDelayLength = this.animationRef.duration;
    const withoutDelayTotalLength = withoutDelayLength * (this.animationRef.playCount - withDelayCount);

    const withDelayLength = this.animationRef.duration + this.animationRef.delay;
    const withDelayTotalLength = withDelayLength * withDelayCount + this.animationRef.delay * withDelayCount;

    const totalLength = withDelayTotalLength + withoutDelayTotalLength;

    const targetLength = totalLength * this.#overallProgress;

    // falls under with delay parts
    if (withDelayTotalLength && targetLength <= withDelayTotalLength) {
      const at = clamp(Math.floor(targetLength / withDelayLength), 0, withDelayCount - 1);
      const delay = withDelayCount === 0 ? 0 : this.animationRef.delay;

      this.#start = this.#startPoint + withDelayLength * at + delay;
      this.#delayCount = at + 1;
      this.#playCount = at + 1;

      // falls under without delay parts
    } else {
      const remainingLength = targetLength - withDelayTotalLength;
      const at = withDelayCount + clamp(Math.floor(remainingLength / withoutDelayLength), 0, this.animationRef.playCount - 1);

      this.#start = this.#startPoint + withDelayTotalLength + withoutDelayLength * (at - withDelayCount);
      this.#delayCount = withDelayCount;
      this.#playCount = at + 1;
    }

    this.#end = this.#start + this.animationRef.duration;

    this.#elapsedTime = elapsedTime - this.#start;
    this.#progress = normalizePercentage(this.#elapsedTime / (this.#end - this.#start));

    const internalProgress = this.#calculateProgress();
    this.#value = this.#startValue + (this.#endValue - this.#startValue) * this.animationRef.ease(internalProgress);
  }

  /** - Calculate the internal progress relative to the direction. */
  #calculateProgress(): number {
    if (!this.#isAlternate) return this.#progress;

    const progress = (this.#progress <= 0.5 ? this.#progress : this.#progress - 0.5) * 2;
    this.#alternateLap = this.#progress <= 0.5 ? 0 : 1;

    // first lap
    if (this.#alternateLap === 0) {
      this.#startValue = this.#isReverse ? this.animationRef.to : this.animationRef.from;
      this.#endValue = this.#isReverse ? this.animationRef.from : this.animationRef.to;
      return progress;
    }

    // second lap
    this.#startValue = this.#isReverse ? this.animationRef.from : this.animationRef.to;
    this.#endValue = this.#isReverse ? this.animationRef.to : this.animationRef.from;
    return progress;
  }
}
