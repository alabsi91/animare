type requestFrameEasing =
  | 'linear'
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInOutSine'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInCirc'
  | 'easeOutCirc'
  | 'easeInOutCirc'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack'
  | 'easeInElastic'
  | 'easeOutElastic'
  | 'easeInOutElastic'
  | 'easeInBounce'
  | 'easeOutBounce'
  | 'easeInOutBounce';

interface animareOptions {
  /**
   * - Animation will starts form this number/s.
   * - takes one number or array of numbers.
   * **Initial Value** `0 | [0, 0 , ...]`
   */
  from?: number | number[];

  /**
   * - Animation will ends at this number/s.
   * - takes one number or array of numbers.
   */
  to: number | number[];

  /**
   * - the duration the function will take to change the number/s (in milliseconds).
   * - **Initial Value** `350`
   */
  duration?: number;

  /**
   * - Delay time before starting (in milliseconds).
   * - **Initial Value** `0`
   */
  delay?: number;

  /**
   * - Easing functions specify the rate of change of the number over time.
   * - Takes a string or Function.
   * - Check [easings.net](https://easings.net/) to learn more.
   * - **Initial Value** `linear`
   */
  easingFunction?: requestFrameEasing | requestFrameEasing[] | ((x: number) => number) | ((x: number) => number)[];

  /**
   * - Repeat count after the first play.
   * - infinite if replay is set to `-1` .
   * - **Initial Value** `0`
   */
  repeat?: number;

  /**
   * - Auto start the animation if true.
   * - **Initial Value** `true`
   */
  autoPlay?: boolean;

  /**
   * - Animation direction.
   * - **Initial Value** `normal`
   */
  direction?: 'alternate' | 'alternate-reverse' | 'normal' | 'reverse';
}

export type CallbackOptions = {
  /**
   * - True only at first frame of every repeat cycle.
   */
  isFirstFrame?: boolean;

  /**
   * - True only at last frame.
   */
  isLastFrame?: boolean;

  /**
   * - Animation progress a number between 0 and 100.
   * - Reset on every repeat cycle.
   */
  progress?: number;

  /**
   * - A descending number representing the current repeat cycle.
   */
  repeatCount?: number;

  /**
   * - The current alternate cycle.
   */
  alternateCycle?: 1 | 2;

  /**
   * - The current refresh rate.
   */
  fps?: number;

  /**
   * - The current time in milliseconds.
   * - Reset on every repeat cycle.
   */
  time?: number;
};

interface returnObject {
  /**
   * - Play the animation forwards.
   * - **Note**: `play` will match the `direction` property.
   * - Takes a number for time in milliseconds or a string for progress percentage e.g. `'50%'`.
   * - If the animation is already playing or paused, it will restart it.
   * - If `autoPlay` is set to `true` it will be started automatically.
   * - If you want the animation to play backwards, use `.reverse()` method.
   */
  play: (startAt?: number | string) => void;

  /**
   * - Play the animation backwards.
   * - **Note**: `reverse` will reverse the `direction` property.
   * - `normal` will become `reverse` and `reverse` will become `normal`.
   * - `alternate` will become `alternate-reverse` and `alternate-reverse` will become `alternate`.
   * - Takes a number for time in milliseconds or a string for progress percentage e.g. `'50%'`.
   * - If the animation is already playing or paused, it will restart it.
   * - If `autoPlay` is set to `true` it will play forwards automatically.
   * - If you want the animation to play forwards, use `.play()` method.
   */
  reverse: (startAt?: number | string) => void;

  /**
   * - Stop or skip to specific time or progress percentage.
   * - Takes a number for time in milliseconds or a string for progress percentage e.g. `'50%'`.
   * - If the parameter is not passed, the animation will stop at the last frame.
   */
  stop: (stopAt?: number | string) => void;

  /**
   * - Pause the animation at any given point when called.
   */
  pause: () => void;

  /**
   * - Resume the animation from the paused or stopped state.
   */
  resume: () => void;

  /**
   * - Listen to the animation's start event.
   * - **Note**: `onStart` will not be called for `autoPlay` animations.
   * - A callback function will be called when the animation is started.
   * - Returns a function to stop listening to the progress event.
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
  asyncOnFinish: () => Promise<void>;

  /**
   * - Listen to the animation's progress event.
   * - 1st argument accepts a number as current time in milliseconds or a string representing the progress "e.g. `'50%'`".
   * - 2nd argument is a callback function that will be called when the animation reaches the progress point.
   * - 3rd argument is the repeat count that the event will be fired at. set to `0` by default.
   * - Returns a function to stop listening to the progress event.
   */
  onProgress: (at: number | string, callback: Function, atRepeat?: number) => Function;

  /**
   * - Async function that resolves when the animation reaches the progress point.
   * - 1st argument accepts a number as current time in milliseconds or a string representing the progress "e.g. `'50%'`".
   * - 2nd argument is the repeat count that the event will be fired at. set to `0` by default.
   */
  asyncOnProgress: (at: number | string, atRepeat?: number) => Promise<void>;

  /**
   * - Change the animation's initial options.
   */
  setOptions: (options: animareOptions) => void;

  /**
   * - Access the animation's current options object.
   */
  options: animareOptions;
}

export function animare(
  options: animareOptions,
  callback: (variables: number[], CallbackOptions: CallbackOptions) => void
): returnObject;

export function colorToArr(color: string): number[];
