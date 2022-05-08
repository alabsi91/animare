export enum DIRECTION {
  normal = 'normal',
  reverse = 'reverse',
  alternate = 'alternate',
  'alternate-reverse' = 'alternate-reverse',
}

export enum TIMELINE_TYPE {
  wait = 'wait',
  immediate = 'immediate',
}

export interface animareOptions extends nextOptions {
  /**
   * - Auto start the animation if true.
   * - **Initial Value** `true`
   */
  autoPlay?: boolean;
}

export interface nextOptions {
  /**
   * - start from the current value/s.
   * **Initial Value** `0 | [0, 0 , ...]`
   */
  from?: number | number[];

  /**
   * - end at the current value/s.
   * **Required**
   */
  to: number | number[];

  /**
   * - playing behaviour of the next animation in the timeline.
   * - `wait` - wait for the all animations in the previous animations to be completed.
   * - `immediate` - play the next animation immediately after the previous animation completes.
   * - **Initial Value** `immediate`
   */
  type?: keyof typeof TIMELINE_TYPE;

  /**
   * - the duration the animation/s will take to change the number/s (in milliseconds).
   * - **Initial Value** `350`
   */
  duration?: number | number[];

  /**
   * - Delay time before starting (in milliseconds).
   * - **Initial Value** `0`
   */
  delay?: number | number[];

  /**
   * - Apply delay once if there is a repeated animation (in milliseconds).
   * - **Initial Value** `false`
   */
  delayOnce?: boolean | boolean[];

  /**
   * - Easing functions specify the rate of change of the number over time.
   * - Check [easings.net](https://easings.net/) to learn more.
   * - **Initial Value** `(x: number) => number`
   */
  ease?: ((x: number) => number) | ((x: number) => number)[];

  /**
   * - Repeat count after the first play.
   * - `-1` for infinite.
   * - **Initial Value** `0`
   */
  repeat?: number | number[];

  /**
   * - Animation direction.
   * - **Initial Value** `normal`
   */
  direction?: keyof typeof DIRECTION | (keyof typeof DIRECTION)[];
}

export type cbInfo = {
  /**
   * - True only at first frame of the animation.
   */
  isFirstFrame?: boolean;

  /**
   * - True only when the animation is finished.
   */
  isFinished?: boolean;

  /**
   * - Animations progresses an array of numbers between 0 and 1 representing the progress of the animation.
   * - Reset on every repeat cycle.
   */
  progress?: number[];

  /**
   * - overall animation progress a number between 0 and 1 including repeats , delays and timeline repeats.
   * - returns `-1` if the timeline infinitely repeats.
   */
  timelineProgress?: number;

  /**
   * - The current timeline index that the animations are playing on.
   */
  timelineIndex?: number[];

  /**
   * - A descending numbers representing the current repeat cycle.
   */
  repeatCount?: number[];

  /**
   * - A descending number representing the current repeat cycle.
   */
  timelineRepeatCount?: number[];

  /**
   * - The current alternate cycle that the animations are playing on.
   * - for direction type `alternate` or `alternate-reverse`
   */
  alternateCycle?: number[];

  /**
   * - The current refresh rate.
   */
  fps?: number;

  /**
   * - The progress time in milliseconds of overall animation.
   */
  time?: number;

  /**
   * - Play the animation forwards.
   * - **Note**: `play` will match the `direction` property.
   * - If the animation is already playing or paused, it will be restarted.
   * - If `autoPlay` is set to `true` it will be started automatically.
   * - If you want the animation to play backwards, use `.reverse()` method.
   */
  play: () => void;

  /**
   * - Play the animation backwards.
   * - **Note**: `reverse` will reverse the `direction` property.
   * - `normal` will become `reverse` and `reverse` will become `normal`.
   * - `alternate` will become `alternate-reverse` and `alternate-reverse` will become `alternate`.
   * - If the animation is already playing or paused, it will be restarted.
   * - If `autoPlay` is set to `true` it will play forwards automatically.
   * - If you want the animation to play forwards, use `.play()` method.
   */
  reverse: () => void;

  /**
   * - Pause the animation at any given point when called.
   */
  pause: () => void;

  /**
   * - Stop the animation at the beginning or at the end.
   */
  stop: (stopAtStart?: boolean) => void;

  /**
   * - Change the animation's initial options.
   */
  setOptions: (options: animareOptions, animationIndex?: number) => void;

  /**
   * - Get animation's current options object.
   */
  getOptions: (animationIndex?: number) => animareOptions;
};

export interface timelineOptions {
  /**
   * - Repeat count after the first timeLine play.
   * - infinite if replay is set to `-1` .
   * - **Initial Value** `0`
   */
  repeat?: number;

  /**
   * - Timeline animation speed.
   * - This will affect all animations duration in the timeline relative to speed value.
   * - **Initial Value** `1`
   */
  speed?: number;
}

export interface returnedObject {
  /**
   * - Play the animation forwards.
   * - **Note**: `play` will match the `direction` property.
   * - If the animation is already playing or paused, it will be restarted.
   * - If `autoPlay` is set to `true` it will be started automatically.
   * - If you want the animation to play backwards, use `.reverse()` method.
   */
  play: () => void;

  /**
   * - Play the animation backwards.
   * - **Note**: `reverse` will reverse the `direction` property.
   * - `normal` will become `reverse` and `reverse` will become `normal`.
   * - `alternate` will become `alternate-reverse` and `alternate-reverse` will become `alternate`.
   * - If the animation is already playing or paused, it will be restarted.
   * - If `autoPlay` is set to `true` it will play forwards automatically.
   * - If you want the animation to play forwards, use `.play()` method.
   */
  reverse: () => void;

  /**
   * - Stop the animation at the beginning or at the end.
   */
  stop: (stopAtStart?: boolean) => void;

  /**
   * - Pause the animation at any given point when called.
   */
  pause: () => void;

  /**
   * - Resume the animation from the paused state.
   * - If the animation is not paused, it will be played.
   */
  resume: () => void;

  /**
   * - Listen to the animation's start event.
   * - **Note**: `onStart` will not be called for `autoPlay` animation too.
   * - A callback function will be called when the animation is started.
   * - Returns a function to stop listening to the start event.
   */
  onStart: (callback: Function) => Function;

  /**
   * - Listen to the animation's finish event.
   * - A callback function will be called when the animation is finished.
   * - Returns a function to stop listening to the progress event.
   */
  onFinish: (callback: Function) => Function;

  /**
   * - Async function that resolves when the animation is finished.
   */
  onFinishAsync: () => Promise<unknown> | undefined;

  /**
   * - Listen to the animation's progress event.
   * - 1st argument accepts a number as current time in milliseconds or a string representing the progress "e.g. `'50%'`".
   * - 2nd argument is a callback function that will be called when the animation reaches the progress point.
   * - 3rd argument is the repeat count that the event will be fired at. set to `0` by default.
   * - Returns a function to stop listening to the progress event.
   */
  onProgress: (at: number, callback: Function) => Function;

  /**
   * - Async function that resolves when the animation reaches the progress point.
   * - 1st argument accepts a number as current time in milliseconds or a string representing the progress "e.g. `'50%'`".
   * - 2nd argument is the repeat count that the event will be fired at. set to `0` by default.
   */
  onProgressAsync: (at: number) => Promise<unknown> | undefined;

  setTimelineOptions: (options: timelineOptions) => void;

  /**
   * - Change the animation's initial options.
   */
  setOptions: (options: animareOptions, animationIndex?: number) => void;

  /**
   * - Get animation's current options object.
   */
  getOptions: (animationIndex?: number) => animareOptions;

  /**
   * - Play sequence of animations.
   * - Accepts same options as animare function.
   * - [duration] , [ease] and [type] will be inherited from the previous animation in the timeline if not specified.
   * - [from] will be when the previous animation stoped if not specified.
   */
  next: (options: nextOptions) => returnedObject;
}

export interface Ilisteners {
  onStart: { id: string; cb: Function }[];
  onFinish: { id: string; cb: Function }[];
  onProgress: { at: number | string; id: string; cb: Function }[];
}
