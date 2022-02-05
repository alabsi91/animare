# Request Animation Number

### Features

- Light animation library for modern JavaScript.

- Based on ` requestAnimationFrame()` method which generates smooth animation and transitions.

- Matches animation speed on different screens refresh rates. _Tested on 60Hz and 145Hz_

- Animate anything takes a value as number.

  > E.g. scrolling , width, color ...

- Contains most popular Easing functions with the ability to provide your own.

  > E.g. Ease In, Ease Out, Ease In Out, .... and more

- Check [easings.net](https://easings.net/) to learn more.

### Syntax

- `requestNum(options: object, callback: (...animatedNumbers: number[]) => void)`

### Example

```javascript
import { requestNum } from 'request-animation-number';

const element = document.getElementById('square');

const animationOptions = {
  from: [0, 1],
  to: [90, 2],
  duration: 500,
  easingFunction: 'easeInOutBack',
};

requestNum(animationOptions, (rotate, scale) => {
  element.style.transform = `rotate(${rotate}deg) scale(${scale})`;
  // ...
});
```

### How to animate colors

- you can ether use `rgb` values as an array of numbers or you can use `colorToArr()` method to convert colors from `string` to
  array of numbers which represents `rgba` values.

- `colorToArr()` method takes a `string` and returns an array of number as `[r, g, b, a]`.
- `colorToArr()` accept following formats: `rgb(r, g, b) , rgba(r, g, b, a) , hex (e.g. "#ffffff ") , color name (e.g. "red")`

#### Example for colors animation

```javascript
import { requestNum, colorToArr } from 'request-animation-number';

const element = document.getElementById('circle');

const animationOptions = {
  from: colorToArr('brown'), // returns [163, 54, 54]
  to: colorToArr('#000000'), // returns [0, 0, 0]
  duration: 1000,
  easingFunction: 'easeInSine',
};

requestNum(animationOptions, (r, g, b) => {
  element.style.backgroundColor = `rgb(${r} ${g} ${b})`;
});
```

### Sequential animation

- `requestNum()` is an asynchronous function.

- You can use `await` to create sequences of animation by waiting for the first animation to end then starting the next.

#### Example for sequential animation

```javascript
import { requestNum } from 'request-animation-number';

async function animate() {
  const circle1 = document.getElementById('circle1');
  const circle2 = document.getElementById('circle2');

  await requestNum({ to: 350 }, left => (circle1.style.left = left + 'px'));

  requestNum({ to: 350 }, right => (circle2.style.right = right + 'px'));
}

animate();
```

- Note that if `replay` set to `-1` it will repeat infinitely.

#### Another way to make sequential animation without using asynchronous function

```javascript
import { requestNum } from 'request-animation-number';

function animate() {
  const circle1 = document.getElementById('circle1');
  const circle2 = document.getElementById('circle2');

  requestNum({ to: 350 }, left => {
    circle1.style.left = left + 'px';

    // detect when the animation ends
    if (left === 350) {
      requestNum({ to: 350 }, right => (circle2.style.right = right + 'px'));
      // ...
    }
  });
}

animate();
```

### Options _[Object]_

#### from: _[ Number | Numbers[] ]_ _[optional]_

- Animation will starts form this number/s.
- Takes one number or array of numbers or if a value not provided will be set to `0` by default.
- **Initial Value** `0 | [0, 0 , ...]`

#### to: _[ Number | Numbers[] ]_

- Animation will ends at this number/s.
- takes one number or array of numbers.

#### duration: _[Number]_ _[optional]_

- The duration the function will take to change the number/s (in milliseconds).
- **Initial Value** `350`.

#### delay: _[Number]_ _[optional]_

- Delay time before starting the animation (in milliseconds).
- **Initial Value** `0`.

#### easingFunction: _[ String | Function ]_ _[optional]_

- Easing functions specify the rate of change of the number over time.
- Takes a String or Function.
- **Initial Value** `"linear"`.
- Avaliable Easing functions :
  `"linear", "easeInSine", "easeOutSine", "easeInOutSine", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint", "easeInExpo", "easeOutExpo", "easeInOutExpo", "easeInCirc", "easeOutCirc", "easeInOutCirc", "easeInBack", "easeOutBack", "easeInOutBack", "easeInElastic", "easeOutElastic", "easeInOutElastic", "easeInBounce", "easeOutBounce", "easeInOutBounce"`
- Check [easings.net](https://easings.net/) to learn more.
- If you want to provide your own timing-function make sure that the function takes one parameter and returns one value.

```javascript
function easeInQuad(x) {
  return x * x;
}
```

#### yoyo: _[boolean]_ _[optional]_

- Animate back to the starting point if `true`.
- **Initial Value** `false`.

#### yoyoDuration: _[Number]_ _[optional]_

- The duration to go back to starting point (in milliseconds).
- **Initial Value** `duration`.

#### yoyoDelay: _[Number]_ _[optional]_

- Delay time before starting the yoyo animation (in milliseconds).
- **Initial Value** `delay`.

#### replay: _[Number]_ _[optional]_

- Replay count after the first play.
- infinite if replay value is set to `-1`.
- **Initial Value** `0`.
