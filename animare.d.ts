type colorNames =
  | 'aliceblue'
  | 'antiquewhite'
  | 'aqua'
  | 'aquamarine'
  | 'azure'
  | 'beige'
  | 'bisque'
  | 'black'
  | 'blanchedalmond'
  | 'blue'
  | 'blueviolet'
  | 'brown'
  | 'burlywood'
  | 'cadetblue'
  | 'chartreuse'
  | 'chocolate'
  | 'coral'
  | 'cornflowerblue'
  | 'cornsilk'
  | 'crimson'
  | 'cyan'
  | 'darkblue'
  | 'darkcyan'
  | 'darkgoldenrod'
  | 'darkgray'
  | 'darkgreen'
  | 'darkkhaki'
  | 'darkmagenta'
  | 'darkolivegreen'
  | 'darkorange'
  | 'darkorchid'
  | 'darkred'
  | 'darksalmon'
  | 'darkseagreen'
  | 'darkslateblue'
  | 'darkslategray'
  | 'darkturquoise'
  | 'darkviolet'
  | 'deeppink'
  | 'deepskyblue'
  | 'dimgray'
  | 'dodgerblue'
  | 'firebrick'
  | 'floralwhite'
  | 'forestgreen'
  | 'fuchsia'
  | 'gainsboro'
  | 'ghostwhite'
  | 'gold'
  | 'goldenrod'
  | 'gray'
  | 'green'
  | 'greenyellow'
  | 'honeydew'
  | 'hotpink'
  | 'indianred'
  | 'indigo'
  | 'ivory'
  | 'khaki'
  | 'lavender'
  | 'lavenderblush'
  | 'lawngreen'
  | 'lemonchiffon'
  | 'lightblue'
  | 'lightcoral'
  | 'lightcyan'
  | 'lightgoldenrodyellow'
  | 'lightgrey'
  | 'lightgreen'
  | 'lightpink'
  | 'lightsalmon'
  | 'lightseagreen'
  | 'lightskyblue'
  | 'lightslategray'
  | 'lightsteelblue'
  | 'lightyellow'
  | 'lime'
  | 'limegreen'
  | 'linen'
  | 'magenta'
  | 'maroon'
  | 'mediumaquamarine'
  | 'mediumblue'
  | 'mediumorchid'
  | 'mediumpurple'
  | 'mediumseagreen'
  | 'mediumslateblue'
  | 'mediumspringgreen'
  | 'mediumturquoise'
  | 'mediumvioletred'
  | 'midnightblue'
  | 'mintcream'
  | 'mistyrose'
  | 'moccasin'
  | 'navajowhite'
  | 'navy'
  | 'oldlace'
  | 'olive'
  | 'olivedrab'
  | 'orange'
  | 'orangered'
  | 'orchid'
  | 'palegoldenrod'
  | 'palegreen'
  | 'paleturquoise'
  | 'palevioletred'
  | 'papayawhip'
  | 'peachpuff'
  | 'peru'
  | 'pink'
  | 'plum'
  | 'powderblue'
  | 'purple'
  | 'rebeccapurple'
  | 'red'
  | 'rosybrown'
  | 'royalblue'
  | 'saddlebrown'
  | 'salmon'
  | 'sandybrown'
  | 'seagreen'
  | 'seashell'
  | 'sienna'
  | 'silver'
  | 'skyblue'
  | 'slateblue'
  | 'slategray'
  | 'snow'
  | 'springgreen'
  | 'steelblue'
  | 'tan'
  | 'teal'
  | 'thistle'
  | 'tomato'
  | 'turquoise'
  | 'violet'
  | 'wheat'
  | 'white'
  | 'whitesmoke'
  | 'yellow'
  | 'yellowgreen'
  | (string & {});

interface animareOptions extends nextOptions {
  /**
   * - Auto start the animation if true.
   * - **Initial Value** `true`
   */
  autoPlay?: boolean;
  duration?: number;
  delay?: number;
}

interface nextOptions {
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
  duration?: number | string;

  /**
   * - Delay time before starting (in milliseconds).
   * - **Initial Value** `0`
   */
  delay?: number | string;

  /**
   * - Applay delay once if there is a repeated animation.
   * - **Initial Value** `false`
   */
  delayOnce?: boolean;

  /**
   * - Easing functions specify the rate of change of the number over time.
   * - Takes a string or Function.
   * - Check [easings.net](https://easings.net/) to learn more.
   * - **Initial Value** `linear`
   */
  ease?: ((x: number) => number) | ((x: number) => number)[];

  /**
   * - Repeat count after the first play.
   * - infinite if replay is set to `-1` .
   * - **Initial Value** `0`
   */
  repeat?: number;

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
   * - True only at last frame of every repeat cycle.
   */
  isLastFrame?: boolean;

  /**
   * - True only when the animation is finished.
   */
  isFinished?: boolean;

  /**
   * - Animation progress a number between 0 and 100 relative to current playing animation in the timeline.
   * - Reset on every repeat cycle.
   */
  progress?: number;

  /**
   * - Animation progress a number between 0 and 100 relative to the timeline.
   * - Reset on every repeat cycle.
   */
  timelineProgress?: number;

  /**
   * - The current animation index in the timeline.
   */
  timelineIndex?: number;

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
   * - The current time in milliseconds relative to current playing animation in the timeline.
   * - Reset on every repeat cycle.
   */
  time?: number;

  /**
   * - The current passed time in milliseconds relative to animation timeline.
   * - Reset on every repeat cycle.
   */
  timeLineTime?: number;

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
   * - Pause the animation at any given point when called.
   */
  pause: () => void;

  /**
   * - Change the animation's initial options.
   */
  setOptions: (options: animareOptions, animationIndex?: number) => void;

  /**
   * - Get animation's current options object.
   */
  getOptions: (animationIndex?: number) => animareOptions;
};

interface timelineOptions {
  /**
   * - Repeat count after the first timeLine play.
   * - infinite if replay is set to `-1` .
   * - **Initial Value** `0`
   */
  repeat?: number;

  /**
   * - Timeline animation speed.
   * - This will affect all animations duration in the timeline relative to speed value.
   * - `1` normal duration (normal speed), `2` half duration (double the speed) and `-2` double duration (half the speed).
   * - **Initial Value** `1`
   */
  speed?: number;
}

interface toReturnedObject extends returnedObject {
  setTimelineOptions: (options: timelineOptions) => void;
}

interface returnedObject {
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
   * - For second parameter, takes a boolean to specify the direction of the animation. `false` for forwards, `true` for backwards.
   * - If the parameter is not passed, the animation will stop at the last frame.
   */
  stop: (stopAt?: number | string, isDirectionReversed?: boolean) => void;

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
  setOptions: (options: animareOptions, animationIndex?: number) => void;

  /**
   * - Get animation's current options object.
   */
  getOptions: (animationIndex?: number) => animareOptions;

  /**
   * - Play sequence of animations.
   * - Accepts same options as animare function.
   * - [duration] and [ease] be inherited from the previous animation in the time line if not specified.
   * - [from] will be set to [to] of the previous animation if not specified.
   */
  next: (options: nextOptions, callback: (variables: number[], CallbackOptions: CallbackOptions) => void) => toReturnedObject;
}

export function animare(
  options: animareOptions,
  callback: (variables: number[], CallbackOptions: CallbackOptions) => void
): returnedObject;

export function colorToArr(color: colorNames): number[];

interface base_eases {
  back: (progress: number) => number;
  bounce: (progress: number) => number;
  circ: (progress: number) => number;
  cubic: (progress: number) => number;
  elastic: (progress: number) => number;
  expo: (progress: number) => number;
  sine: (progress: number) => number;
  quad: (progress: number) => number;
  quart: (progress: number) => number;
  quint: (progress: number) => number;
}

interface ease {
  in: base_eases;
  out: base_eases;
  inOut: base_eases;
  linear: (progress: number) => number;
  cubicBezier: (X1: number, Y1: number, X2: number, Y2: number) => (progress: number) => number;
  /**
   * - Check [Animare Ease Visualizer](https://animare-ease-visualizer.netlify.app/) to learn more.
   */
  custom: (path: string) => (progress: number) => number;
}

export const ease: ease;
