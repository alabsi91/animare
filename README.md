# animare

# Still under development documentation and examples are incomplete and subject to change.

### Features

- Light animation library for modern JavaScript.
- Based on `requestAnimationFrame()` method which generates smooth animation and transitions.
- Matching the monitor refresh rate of the device. _Tested on 60Hz and 144Hz monitors._
- Contains most popular easing timing functions with the ability to provide your own, check [easings.net](https://easings.net/) to
  learn more.
- Animate multiple values with different easing function for each at once.

### Syntax

- `animare(options: object, callback: (values: number[], animationInfo: object) => void) : methods`

### Example

```javascript
import { animare } from 'animare';

const square = document.getElementById('square');

const animationOptions = {
  from: [0, 1],
  to: [90, 2],
  duration: 500,
  direction: 'normal',
  autoplay: false,
  ease: ['linear', 'easeInOutBack'],
};

const animationCallback = ([rotate, scale]) => {
  square.style.transform = `rotate(${rotate}deg) scale(${scale})`;
  // ...
};

const myAnimation = animare(animationOptions, animationCallback);

myAnimation.play();
```

### How to animate colors

- you can ether use `rgb` values as an array of numbers or you can use `colorToArr()` method to convert colors from `string` to
  array of numbers which represents `rgba` values.

- `colorToArr()` method takes a `string` and returns an array of number `[r, g, b, a]`.
- `colorToArr()` accept following formats: `rgb(r, g, b) , rgba(r, g, b, a) , hex (e.g. "#ffffff ") , color name (e.g. "red")`

#### Example for colors animation

```javascript
import { animare, colorToArr } from 'animare';

const circle = document.getElementById('circle');

const animationOptions = {
  from: colorToArr('brown'), // return [163, 54, 54]
  to: colorToArr('#000000'), // return [0, 0, 0]
  duration: 1000,
  ease: 'easeInSine',
};

const animationCallback = ([r, g, b]) => {
  circle.style.backgroundColor = `rgb(${r} ${g} ${b})`;
};

animare(animationOptions, animationCallback); // auto play
```

### Options _[Object]_

#### from: _[ number | numbers[] ]_ _[optional]_

- Animation will start form value/s.
- Takes one number or array of numbers, if a value not provided will be set to `0 | 0[]` by default.
- **Initial Value** `0 | [0, 0 , ...]`

#### to: _[ number | numbers[] ]_

- Animation will ends at this value/s.
- takes one number or array of numbers.

#### duration: _[number]_ _[optional]_

- Animation duration in milliseconds.
- **Initial Value** `350`.

#### delay: _[number]_ _[optional]_

- Delay time before starting the animation (in milliseconds).
- **Initial Value** `0`.

#### direction: _['alternate' | 'alternate-reverse' | 'normal' | 'reverse']_

- Animation direction.
- **Initial Value** `normal`

#### autoPlay?: _[boolean]_ _[optional]_;

- Auto start the animation if true.
- **Initial Value** `true`

#### repeat: _[Number]_ _[optional]_

- Repeat count after the first play.
- infinite if repeat value is set to `-1`.
- **Initial Value** `0`.

#### ease: _[ String | (x) => x ]_ _[optional]_

- Easing functions specify the rate of change of the number over time.
- Takes a String or a Function.
- **Initial Value** `"linear" | "linear"[]`.
- Avaliable Easing functions :
  `"linear", "easeInSine", "easeOutSine", "easeInOutSine", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint", "easeInExpo", "easeOutExpo", "easeInOutExpo", "easeInCirc", "easeOutCirc", "easeInOutCirc", "easeInBack", "easeOutBack", "easeInOutBack", "easeInElastic", "easeOutElastic", "easeInOutElastic", "easeInBounce", "easeOutBounce", "easeInOutBounce"`
- Check [easings.net](https://easings.net/) to learn more.
- If you want to provide your own timing-function make sure that the function takes one parameter and returns one value.

```javascript
function easeInQuad(x) {
  return x * x;
}
```

### Callback _`(numbers[], object) => void`_

- Takes two parameters:
  - `numbers[]`: An array of numbers which represents the current value of the animation.
  - `object`: An object which contains the animation information.

|       info       |   type   |                        description                        |
| :--------------: | :------: | :-------------------------------------------------------: |
|   isFirstFrame   | boolean  |      True only at first frame of every repeat cycle       |
|   isLastFrame    | boolean  |       True only at last frame of every repeat cycle       |
|    isFinished    | boolean  |         True only when the animation is finished          |
|     progress     |  number  |               Animation progress percentage               |
| timeLineProgress |  number  |  Animation progress percentage relative to the timeline   |
|   repeatCount    |  number  |                 The current repeat cycle                  |
|  alternateCycle  |  number  |                The current alternate cycle                |
|       fps        |  number  |             The current animation frame rate              |
|       time       |  number  |             The current time in milliseconds              |
|   timeLineTime   |  number  | The current time in milliseconds relative to the timeline |
|       play       | Function |                    check out _Methods_                    |
|     reverse      | Function |                    check out _Methods_                    |
|      pause       | Function |                    check out _Methods_                    |
|       stop       | Function |                    check out _Methods_                    |
|    setOptions    | Function |                    check out _Methods_                    |
|    getOptions    | Function |                    check out _Methods_                    |

### Methods

- The animare returns an object which contains the following methods:

#### play : `(startAt?: number | string) => void`

- Play the animation matching the `direction` option property.
- the parameter is optional and if not provided will start the animation from the beginning.
- Takes a number for time in milliseconds or a string for progress percentage _e.g. `'50%'`_.
- If the animation is already playing or paused, it will restart it.
- If you want the animation to play backwards, use `reverse()` method.

#### reverse : `(startAt?: number | string) => void`

- Play the animation reversing the `direction` option property.
- the parameter is optional and if not provided will start the animation from the end.
- Takes a number for time in milliseconds or a string for progress percentage e.g. `'50%'`.
- If the animation is already playing or paused, it will restart it.
- If you want the animation to play forwards, use `play()` method.

#### stop : `(stopAt?: number | string, isReversed?: boolean) => void`

- Stop or skip to specific time or progress percentage.
- Takes a number for time in milliseconds or a string for progress percentage e.g. `'50%'`.
- If the parameter is not passed, the animation will stop at the last frame.

#### pause : `() => void`

- Pause the animation at any given point when called.

#### resume : `() => void`

- Resume the animation from the paused or stopped state.

#### next : `(options: object, callback: (numbers[], object) => void) => methods`

- Play sequence of animations.
- Accepts same options as animare function.
- The options will be inherited from the main animations if not specified.
- [from] will be set to [to] of the previous animation if not specified.

#### onStart : `(callback: Function) => Function`

- Listen to the animation's start event.
- A callback function will be called when the animation is started.
- Returns a function to stop listening to the start event.
- **Note**: `onStart` will not be called for `autoPlay` animations.

#### onFinish : `(callback: Function) => Function`

- Listen to the animation's finish event.
- A callback function will be called when the animation is finished.
- Returns a function to stop listening to the progress event.

#### asyncOnFinish : `() => Promise<void>`

- Async function that resolves when the animation is finished.

#### onProgress : `(at: number | string, callback: Function, atRepeat?: number) => Function`

- Listen to the animation's progress event.
- 1st argument accepts a number as current time in milliseconds or a string representing the progress "e.g. `'50%'`".
- 2nd argument is a callback function that will be called when the animation reaches the progress point.
- 3rd argument is the repeat count that the event will be fired at. set to `0` by default.
- Returns a function to stop listening to the progress event.

#### asyncOnProgress : `(at: number | string, atRepeat?: number) => Promise<void>`

- Async function that resolves when the animation reaches the progress point.
- 1st argument accepts a number as current time in milliseconds or a string representing the progress "e.g. `'50%'`".
- 2nd argument is the repeat count that the event will be fired at. set to `0` by default.

#### setOptions : `(options: animareOptions) => void`

- Change the animation's initial options.

#### getOptions : `() => animareOptions`

- Get the animation's current options object.
