import type Animation from './animation';

export enum Direction {
  /** Play the animation in the normal direction. */
  Forward = 'forward',

  /** Play the animation in reverse direction. */
  Reverse = 'reverse',

  /** Alternate the animation direction on each iteration, starting with normal. */
  Alternate = 'alternate',

  /** Alternate the animation direction on each iteration, starting with reverse. */
  AlternateReverse = 'alternate-reverse',
}

export enum AnimationTiming {
  /** Play the animation after the previous one finishes. */
  AfterPrevious = 'after-previous',

  /** Play the animation simultaneously with the previous one. */
  WithPrevious = 'with-previous',

  /** Play the animation from the start of the timeline. */
  FromStart = 'from-start',
}

export enum Event {
  /** Event triggered when the animation starts playing. */
  Play = 'play',

  /** Event triggered when the animation resumes. */
  Resume = 'resume',

  /** Event triggered when the animation is paused. */
  Pause = 'pause',

  /** Event triggered when the animation stops. */
  Stop = 'stop',

  /** Event triggered when the animation completes. */
  Complete = 'complete',

  /** Event triggered when the animation is repeated. */
  Repeat = 'repeat',
}

export enum ScrollAxis {
  /** Track the element scroll vertically on the `y` axis. */
  Vertical = 'y',

  /** Track the element scroll horizontally on the `x` axis. */
  Horizontal = 'x',
}

export enum ScrollElementEdge {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

/**
 * **Note:** This function does nothing, used only for type checking.
 */
export function createAnimations<Name extends string>(animations: AnimationOptionsParam<Name>) {
  return animations;
}

// utils
export type RemoveFunction<T> = T extends (index: number) => unknown ? never : T;

type RemoveFunctionType<T> = {
  [K in keyof T]: K extends 'ease'
    ? Extract<T[K], unknown[]> extends never
      ? T[K]
      : Exclude<T[K], (index: number) => unknown>
    : T[K] extends undefined
      ? T[K]
      : RemoveFunction<T[K]>;
};

/** Extends the types of properties in the given type `T` to allow arrays and functions, except for the 'to' property which only allows arrays. */
type AllowArray<T> = {
  [K in keyof T]: K extends 'ease'
    ? T[K] | Exclude<T[K], undefined>[]
    : T[K] | Exclude<T[K], undefined | ((i: number) => unknown)>[];
};

// ...

export type EventCallback = () => void;

export type EventUnsubscribe = () => boolean;

export type EaseFn = (t: number) => number;

export type PercentageString = `${number}%`;

export type AnimationOptions<Name extends string = string> = {
  /**
   * The name of the animation, used to identify the animation in the timeline.
   * **Required**
   */
  readonly name: Name;

  /**
   * The ending value of the animation.
   * **Required**
   */
  to: number;

  /**
   * The starting value of the animation.
   * @default 0
   */
  from?: number | ((index: number) => number);

  /**
   * The duration of the animation in milliseconds.
   * @default 350
   */
  duration?: number | ((index: number) => number);

  /**
   * This property specifies the delay before the animation starts, in milliseconds, and can accept negative values.
   * It acts as an animation offset within the timeline, allowing you to delay the animation or make it start earlier by using negative values.
   * @default 0
   */
  delay?: number | ((index: number) => number);

  /**
   * The number of times the delay should be applied on each animation play.
   *
   * For example, with `delayCount: 1` and `playCount: 4`, the delay will be applied only once on the first play.
   *
   * A value higher than `playCount` will be ignored.
   * @default playCount
   */
  delayCount?: number | ((index: number) => number);

  /**
   * The number of times the animation should play.
   * A value of `0` means this animation will be ignored.
   * @default 1
   */
  playCount?: number | ((index: number) => number);

  /**
   * The direction in which the animation should play.
   * @default Direction.Forward
   */
  direction?: Direction | ((index: number) => Direction);

  /**
   * The position of the animation in the timeline, determining when it should start relative to the timeline.
   * @default AnimationTiming.AfterPrevious
   */
  timing?: AnimationTiming | ((index: number) => AnimationTiming);

  /**
   * The easing function for the animation, defining the rate of change of the animated value over time.
   * @default ease.linear
   */
  ease?: EaseFn;
};

export type AnimationOptionsWithoutFn<Name extends string = string> = RemoveFunctionType<AnimationOptions<Name>>;

export type FirstAnimationOptions<Name extends string = string> = Omit<AnimationOptions<Name>, 'timing'>;

export type AnimationOptionsParam<Name extends string = string> = [FirstAnimationOptions<Name>, ...AnimationOptions<Name>[]];

export type TimelineOptions = {
  /**
   * The number of times the timeline should play.
   *
   * Use `-1` for infinite plays.
   */
  timelinePlayCount?: number;

  /** Indicates whether the animation should start playing automatically. */
  autoPlay?: boolean;
};

export type TimelineGlobalOptions = Omit<AnimationOptionsWithoutFn, 'name' | 'to'> & TimelineOptions;

export type AnimationPreparedOptions = Required<AnimationOptionsWithoutFn>;

export type AnimationInfo<Name extends string = string> = {
  /** The name of the animation. */
  name: Name;

  /** The index of the animation in the timeline. */
  index: number;

  /** The animated value over time. */
  value: number;

  /** The progress of the animation, excluding any delays. */
  progress: number;

  /** The overall progress of the animation, including delays and repeats. */
  overallProgress: number;

  /** The elapsed time of the animation in milliseconds. */
  elapsedTime: number;

  /** The current delay count, starting from `0` (not started) up to the specified delay count. */
  delayCount: number;

  /** The current play count, starting from `0` (not started) up to the specified play count. */
  playCount: number;

  /** Indicates whether the animation has finished. */
  isFinished: boolean;

  /** Indicates whether the animation is currently playing, not considering any delays. */
  isPlaying: boolean;

  /**
   * Checks if a given progress value is within the current progress.
   * @param progress - The progress value to check, between `0` and `1`.
   * @param tolerance - The allowable tolerance for the check. Default is `0.001`.
   * @returns `true` if the progress is within the specified tolerance, otherwise `false`.
   */
  isProgressAt(progress: number, tolerance?: number): boolean;

  /**
   * Checks if a given time value is within the current elapsed time.
   * @param time - The time value to check, in milliseconds.
   * @param tolerance - The allowable tolerance for the check, in milliseconds. Default is `5` ms.
   * @returns `true` if the time is within the specified tolerance, otherwise `false`.
   */
  isTimeAt(time: number, tolerance?: number): boolean;
};

export type CallbackInfo<Name extends string = string> = {
  [key: number]: AnimationInfo<Name>;
  length: number;
} & { [key in Name]: AnimationInfo<Name> };

export type TimelineInfo = {
  /** The current elapsed time in milliseconds. */
  elapsedTime: number;

  /** The total duration of the timeline in milliseconds. */
  duration: number;

  /** The current progress of the timeline, typically a value between `0` and `1`. */
  progress: number;

  /** Indicates whether the timeline is currently paused. */
  isPaused: boolean;

  /** Indicates whether the timeline is currently playing. */
  isPlaying: boolean;

  /** Indicates whether the timeline has finished. */
  isFinished: boolean;

  /**
   * - Indicates if this is the first update callback call.
   * - It does not indicate if the animation is started from `0` progress.
   * - Useful for initialization purposes.
   */
  isFirstFrame: boolean;

  /** The current play count of the timeline. */
  playCount: number;

  /** The frames per second. */
  fps: number;

  /**
   * Checks if a given progress value is within the current progress.
   * @param progress - The progress value to check, between `0` and `1`.
   * @param tolerance - The allowable tolerance for the check. Default is `0.001`.
   * @returns `true` if the progress is within the specified tolerance, otherwise `false`.
   */
  isProgressAt(progress: number, tolerance?: number): boolean;

  /**
   * Checks if a given time value is within the current elapsed time.
   * @param time - The time value to check, in milliseconds.
   * @param tolerance - The allowable tolerance for the check, in milliseconds. Default is `5` ms.
   * @returns `true` if the time is within the specified tolerance, otherwise `false`.
   */
  isTimeAt(time: number, tolerance?: number): boolean;
};

export type PrivateTimelineInfo = {
  /** The start time of the animation in milliseconds. */
  __startTime: number;

  /** The time of the last frame in milliseconds. */
  __lastFrameTime: number;

  /** The starting progress of the timeline. */
  __startProgress: number;

  /** The list of animations included in the timeline. */
  __animations: Animation[];

  /** The request animation id. */
  __requestAnimationId: number | null;

  /** The time when the timeline was paused in milliseconds. */
  __pauseTime: number;
};

export type OnUpdateCallback<T extends AnimationOptions[]> = (
  info: CallbackInfo<T[number]['name']>,
  timelineInfo: TimelineInfo,
) => void;

export type TimelineObject<Name extends string = string> = {
  /**
   * Retrieves information about the timeline.
   *
   * Returns the same object that is passed to the `onUpdate` callback.
   *
   * ⚠️ **Warning** ⚠️ This object values will be updated on every frame update if the timeline is playing.
   *
   * @example
   * timelineInfo.isPaused;
   */
  timelineInfo: TimelineInfo;

  /**
   * Retrieves information about all animations.
   *
   * Returns the same object that is passed to the `onUpdate` callback.
   *
   * ⚠️ **Warning** ⚠️ This object values will be updated on every frame update if the timeline is playing.
   *
   * @example
   * animations[0].progress; // Accessing the first animation by index
   * animations['myFirstAnimation'].value; // Accessing the first animation by name
   */
  animationsInfo: CallbackInfo<Name>;

  /**
   * Updates animations values.
   *
   * The `name` property is **required** to target a specific animation for updating.
   *
   * ⚠️ **Warning** ⚠️ This method will throw an error if the some of the values are invalid.
   *
   * **Note:** Updating the animation values while the timeline is playing might result in flickering.
   *
   * @param newValues - An array of objects containing the new values.
   *
   * @example
   * updateValues([{
   *   name: 'myAnimation', // Animation name to update
   *   duration: 500
   * }]);
   */
  updateValues: (newValues: Partial<AnimationOptionsWithoutFn<Name>>[]) => void;

  /**
   * Plays the timeline.
   *
   * - Accepts an optional `startFrom` parameter that can be a `time` in milliseconds or a percentage value.
   * - Optionally, you can specify a `playCount` to seek to a specific repeat count.
   *
   * @param startFrom - The point to start from, specified as a `time` in milliseconds or a percentage value.
   * @param playCount - The repeat count to seek to before playing.
   *
   * @example
   * play(); // Play from the start
   * play(500); // Play from 500 milliseconds
   * play('50%'); // Play from 50% of the timeline duration
   * play('50%', 2); // Play from 50% of the timeline duration on the second repeat
   */
  play: (startFrom?: number | PercentageString, playCount?: number) => void;

  /**
   * Plays only one frame of the timeline.
   *
   * - If the timeline is already playing, this method does nothing.
   * - It will not trigger `play` events.
   *
   * @example
   * seek("50%");
   * playOneFrame();
   */
  playOneFrame: () => void;

  /**
   * Resumes the timeline from a paused state.
   *
   * - If the timeline is not paused, it will start playing from the beginning.
   * - If the timeline is already playing, this method does nothing.
   */
  resume: () => void;

  /**
   * Pauses the timeline.
   *
   * - If the timeline is already paused, it remains paused.
   * - If the timeline is not playing, it will not be paused.
   */
  pause: () => void;

  /**
   * Stops the timeline from playing.
   *
   * - If no parameters are passed, the animation will skip to the end and stop.
   * - You can pass parameters to stop at a specific point in the timeline.
   * - If the timeline is not currently playing, it plays only one frame at the specified stop point.
   *
   * @param stopAt - The point to stop at, specified as a `time` in milliseconds or a percentage string.
   * @param playCount - The repeat count to stop at.
   * @example
   * stop(); // Skip to the end and stop
   * stop("50%"); // Skip to 50% of the timeline and stop
   */
  stop: (stopAt?: number | PercentageString, playCount?: number) => void;

  /**
   * Seeks the timeline to a specified `time` or `percentage` value.
   *
   * - If the timeline is not playing, it will not start playing.
   *
   * @param seekTo - The point to seek to, specified as a `time` in milliseconds or a percentage value.
   * @param playCount - The repeat count to seek to before playing.
   *
   * @example
   * seek(500); // Seek to 500 milliseconds
   * seek('50%'); // Seek to 50% of the timeline duration
   * seek('50%', 2); // Seek to 50% of the timeline duration on the second repeat
   */
  seek: (seekTo: number | PercentageString, playCount?: number) => void;

  /**
   * Attaches an event listener to the timeline.
   *
   * @param event - The event to listen for.
   * @param callback - The callback function to be executed when the event is triggered.
   * @returns A function to unsubscribe the event listener.
   *
   * @example
   * const unsubscribe = on(Event.Play, () => {
   *   // do something
   * });
   *
   * unsubscribe(); // To remove the event listener
   */
  on: (event: Event, callback: EventCallback) => EventUnsubscribe;

  /**
   * Attaches an event listener to the timeline that will be triggered only once.
   *
   * @param event - The event to listen for.
   * @param callback - The callback function to be executed when the event is triggered.
   * @returns A function to unsubscribe the event listener.
   *
   * @example
   * const unsubscribe = once(Event.Play, () => {
   *   // do something
   * });
   *
   * unsubscribe(); // To remove the event listener
   */
  once: (event: Event, callback: EventCallback) => EventUnsubscribe;

  /**
   * Waits until the timeline completes.
   * @example
   * await onCompleteAsync();
   */
  onCompleteAsync: () => Promise<unknown> | undefined;

  /**
   * Waits until the timeline starts playing.
   * @example
   * await onPlayAsync();
   */
  onPlayAsync: () => Promise<unknown> | undefined;

  /**
   * Waits until the timeline resumes.
   * @example
   * await onResumeAsync();
   */
  onResumeAsync: () => Promise<unknown> | undefined;

  /**
   * Waits until the timeline pauses.
   * @example
   * await onPauseAsync();
   */
  onPauseAsync: () => Promise<unknown> | undefined;

  /**
   * Waits until the timeline stops.
   * @example
   * await onStopAsync();
   */
  onStopAsync: () => Promise<unknown> | undefined;

  /**
   * Waits until the timeline repeats.
   * @example
   * await onRepeatAsync();
   */
  onRepeatAsync: () => Promise<unknown> | undefined;

  /** Removes all attached event listeners. */
  clearEvents: () => void;
};

export type SingleAnimationOptions = Omit<AnimationOptionsWithoutFn, 'name' | 'timing'> & { autoPlay?: boolean };
export type SingleAnimationOptionsWithoutFn = RemoveFunctionType<SingleAnimationOptions>;
export type SingleOnUpdateCallback = (info: Omit<AnimationInfo, 'name' | 'index'>) => void;
export type SingleObject = Omit<TimelineObject, 'updateValues' | 'animationsInfo'> & {
  /**
   * Updates the animation values.
   *
   * ⚠️ **Warning** ⚠️ This method will throw an error if the some of the values are invalid.
   *
   * **Note:** Updating the animation values while the timeline is playing might result in flickering.
   *
   * @param newValues - An object containing the new values.
   *
   * @example
   * updateValues({ duration: 500 });
   */
  updateValues: (newValues: Partial<AnimationOptionsWithoutFn>) => void;
  /**
   * Retrieves information about the animation.
   *
   * Returns the same object that is passed to the `onUpdate` callback.
   *
   * ⚠️ **Warning** ⚠️ This object values will be updated on every frame update if the timeline is playing.
   *
   * @example
   * animations.progress; // Accessing the animation progress
   * animations.value; // Accessing the animation value
   */
  animationsInfo: AnimationInfo;
};

export type AnimationGroupOptions = Omit<AllowArray<AnimationOptions>, 'name'> & TimelineOptions;
export type GroupOnUpdateCallback = (info: CallbackInfo<`${number}`>, timelineInfo: TimelineInfo) => void;

export type AutoPauseOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  forcePlay?: boolean;
  onVisibilityChange?: (isVisible: boolean) => void;
};

export type ScrollAnimationOptions<Name extends string = string> = {
  /**
   * The returned animation object.
   *
   * **Required**
   */
  timeline: TimelineObject<Name> | SingleObject;

  /**
   * The HTML element to track when entering and exiting the viewport.
   *
   * **Required**
   */
  element: HTMLElement;

  /**
   * The root element that has the scrollable area.
   *
   * @default document.documentElement
   */
  root?: HTMLElement;

  /**
   * The scroll axis to track.
   *
   * @default ScrollAxis.Vertical
   */
  axis?: ScrollAxis;

  /**
   * Start the animation when the element edge enters the scroll area.
   *
   * @default ScrollElementEdge.Top
   */
  start?: ScrollElementEdge;

  /**
   * End the animation when the element edge exits the scroll area.
   *
   * @default ScrollElementEdge.Bottom
   */
  end?: ScrollElementEdge;

  /**
   * The offset to start the animation.
   *
   * @default 0
   */
  startOffset?: number;

  /**
   * The offset to end the animation.
   *
   * @default 0
   */
  endOffset?: number;
};

export type Vec1Array = [number];
export type Vec2Array = [number, number];
export type Vec3Array = [number, number, number];
export type Vec4Array = [number, number, number, number];

export type Vec1Object = {
  x: number;
};

export type Vec2Object = {
  x: number;
  y: number;
};

export type Vec3Object = {
  x: number;
  y: number;
  z: number;
};

export type Vec4Object = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export type Vec1 = Vec1Array | Vec1Object | number;
export type Vec2 = Vec2Array | Vec2Object;
export type Vec3 = Vec3Array | Vec3Object;
export type Vec4 = Vec4Array | Vec4Object;
export type Vec = Vec1 | Vec2 | Vec3 | Vec4;
