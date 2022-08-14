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
   * - **Initial Value** `0 | [0, ...]`
   * @example
   * from: 0          // a single value.
   * from: [0, 0]     // an array of values should have the same length as `to`.
   * from: i => i + 5 // map through `to` array.
   */
  from?: number | number[] | ((index: number) => number);

  /**
   * - end at the current value/s.
   * - **Required**
   * @example
   * to: 1      // a single value.
   * to: [1, 1] // an array of values.
   */
  to: number | number[];

  /**
   * - next animation playing behaviour in the timeline.
   * - `'wait'` - wait for the all animations in the previous animations to be completed.
   * - `'immediate'` - play the next animation immediately after the previous animation completes.
   * - **Initial Value** `'immediate'`
   */
  type?: keyof typeof TIMELINE_TYPE;

  /**
   * - the duration the animation will take to change the value (in milliseconds).
   * - **Initial Value** `350`
   * @example
   * duration: 1000         // a single value applied to all values.
   * duration: [1000, 1000] // an array of values should have the same length as `to`.
   * duration: i => i * 100 // map through `to` array.
   */
  duration?: number | number[] | ((index: number) => number);

  /**
   * - delay time before starting (in milliseconds).
   * - **Initial Value** `0`
   * @example
   * delay: 1000         // a single value applied to all values.
   * delay: [1000, 1000] // an array of values should have the same length as `to`.
   * delay: i => i * 100 // map through `to` array.
   */
  delay?: number | number[] | ((index: number) => number);

  /**
   * - apply delay once if there is a repeated animation.
   * - **Initial Value** `false`
   * @example
   * delayOnce: true          // a single value applied to all values.
   * delayOnce: [true, false] // an array of values should have the same length as `to`.
   */
  delayOnce?: boolean | boolean[];

  /**
   * - easing functions specify the rate of change of the number over time.
   * - Check [easings.net](https://easings.net/) to learn more.
   * - **Initial Value** `ease.linear`
   * @example
   * ease: ease.linear                // a single value applied to all values.
   * ease: [ease.linear, ease.linear] // an array of values should have the same length as `to`.
   * ease: (t) => t * t               // your own easing function.
   */
  ease?: ((x: number) => number) | ((x: number) => number)[];

  /**
   * - repeat count after the first play.
   * - use `-1` for infinite repeats.
   * - **Initial Value** `0`
   * @example
   * repeat: 2          // a single value applied to all values.
   * repeat: -1         // infinite repeats.
   * repeat: [2, 1]     // an array of values should have the same length as `to`.
   * repeat: i => i * 2 // map through `to` array.
   */
  repeat?: number | number[] | ((i: number) => number);

  /**
   * - animation direction.
   * - **Initial Value** `'normal'`
   * @example
   * direction: 'normal'              // a single value applied to all values.
   * direction: ['normal', 'reverse'] // an array of values should have the same length as `to`.
   */
  direction?: keyof typeof DIRECTION | (keyof typeof DIRECTION)[];
}

export type animareCallbackOptions = {
  /**
   * - true only at first the frame of the animation.
   */
  isFirstFrame: boolean;

  /**
   * - true only when the animation is finished.
   */
  isFinished: boolean;

  /**
   * - animated values progress : an array of numbers between 0 and 1.
   * - resets on every repeat cycle.
   */
  progress: number[];

  /**
   * - overall animation's progress a number between 0 and 1 including repeats, delays, and timeline repeats.
   * - returns `-1` if the timeline infinitely repeats.
   */
  timelineProgress: number;

  /**
   * - The current timeline index that the animated value are playing on.
   */
  timelineIndex: number[];

  /**
   * - A descending numbers representing the current repeat cycle for each animated value.
   */
  repeatCount: number[];

  /**
   * - A descending number representing the current repeat cycle for each animated value.
   */
  timelineRepeatCount: number[];

  /**
   * - The current alternate cycle that the animated value is playing on.
   * - for direction type `alternate` or `alternate-reverse`
   */
  alternateCycle: number[];

  /**
   * - The current refresh rate.
   */
  fps?: number;

  /**
   * - The progress time in milliseconds of overall animation.
   */
  time: number;

  /**
   * - Play the animation forwards.
   */
  play: () => void;

  /**
   * - Play the animation backwards.
   */
  reverse: () => void;

  /**
   * - Pause the animation at any given point when called.
   */
  pause: () => void;

  /**
   * - Stop the animation at the beginning or at the end of the timeline.
   * - **Initial Value** `true`
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

export interface animareTimelineOptions {
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

export interface animareReturnedObject {
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
  onStart: (callback: () => void) => () => void;

  /**
   * - Listen to the animation's finish event.
   * - A callback function will be called when the animation is finished.
   * - Returns a function to stop listening to the progress event.
   */
  onFinish: (callback: () => void) => () => void;

  /**
   * - Async function that resolves when the animation is finished.
   */
  onFinishAsync: () => Promise<unknown> | undefined;

  /**
   * - Listen to the animation's progress event.
   * - 1st argument accepts a number as progress percentage between 0 and 1.
   * - 2nd argument is a callback function that will be called when the animation reaches the progress point.
   * - Returns a function to stop listening to the progress event.
   */
  onProgress: (at: number, callback: () => void) => () => void;

  /**
   * - Async function that resolves when the animation reaches the progress point.
   * - 1st argument accepts a number as progress percentage between 0 and 1.
   */
  onProgressAsync: (at: number) => Promise<unknown> | undefined;

  setTimelineOptions: (options: animareTimelineOptions) => void;

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
   * - [duration], [ease], and [type] will be inherited from the previous animation in the timeline if not specified.
   * - [from] will be when the previous animation stoped if not specified.
   */
  next: (options: nextOptions) => animareReturnedObject;
}

export interface Ilisteners {
  onStart: { id: string; cb: () => void }[];
  onFinish: { id: string; cb: () => void }[];
  onProgress: { at: number | string; id: string; cb: () => void }[];
}

export type animareOnUpdate = (values: number[], info: animareCallbackOptions) => void;
