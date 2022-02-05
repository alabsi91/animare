import { easing } from './easingFunctions';
const isDevMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export function animare(options, callback) {
  options = options ?? {};
  options.duration = options.duration ?? 350;
  options.autoPlay = options.autoPlay ?? true;
  options.repeat = options.repeat ?? 0;
  options.delay = options.delay ?? 0;
  options.direction = options.direction ?? 'normal';
  options.easingFunction = options.easingFunction ?? easing.linear;

  const checkInputs = () => {
    // check if [to] exists, because it's required.
    if (!options.to) throw new Error('[to] is required');

    // check if [to] is a number or an array of numbers
    if (Array.isArray(options.to)) {
      if (!options.to.every(e => typeof e === 'number')) throw new Error('[to] must be a number or an array of numbers');
    } else if (typeof options.to !== 'number') throw new Error('[to] must be a number or an array of numbers');

    // check if [from] is a number or an array of numbers and [to] has the same length.
    if (Array.isArray(options.from)) {
      if (!options.from.every(e => typeof e === 'number')) throw new Error('[from] must be a number or an array of numbers');
      if (options.from.length !== options.to.length) throw new Error('[from] and [to] must have the same length');
    } else if (options.from && typeof options.from !== 'number')
      throw new Error('[from] must be a number or an array of numbers');

    // check if [duration] is a number and greater than -1
    if (typeof options.duration !== 'number' || options.duration < 0)
      throw new Error('[duration] must be a number greater than -1');

    // check if [delay] is a number and greater than -1
    if (typeof options.delay !== 'number' || options.delay < 0) throw new Error('[delay] must be a number greater than -1');

    // check if [repeat] is a number
    if (typeof options.repeat !== 'number') throw new Error('[repeat] must be a number');

    // check if [autoPlay] is a boolean
    if (typeof options.autoPlay !== 'boolean') throw new Error('[autoPlay] must be a boolean');

    // check if [direction] one of the following:
    if (!['normal', 'reverse', 'alternate', 'alternate-reverse'].includes(options.direction))
      throw new Error('[direction] must be a string and one of the following: normal, reverse, alternate, alternate-reverse');

    // check if [easingFunction] string is one of easing functions
    if (typeof options.easingFunction === 'string' && !easing.hasOwnProperty(options.easingFunction)) {
      throw new Error(
        '[easingFunction] must be a string, array of strings, function or array of functions, and for a string value one of the following: ' +
          Object.keys(easing).join(', ')
      );
    }
    // check if [easingFunction] is an array and if one of the elements is a string and one of the elements is a function.
    if (Array.isArray(options.easingFunction)) {
      options.easingFunction.forEach(e => {
        if (typeof e === 'string' && !easing.hasOwnProperty(e)) {
          throw new Error(
            '[easingFunction] must be a string, array of strings, function or array of functions, and for a string value one of the following: ' +
              Object.keys(easing).join(', ')
          );
        }
      });
    }
  };

  if (isDevMode) checkInputs(); // check if inputs are valid only in development mode.

  // when the animation direction is 'alternate' or 'alternate-reverse',
  // the overall duration will represent the both the forward and backward animation duration
  if (options.direction.includes('alternate')) options.duration = options.duration / 2;

  const sleep = time => new Promise(e => setTimeout(e, time));

  let start = null; // start time of the animation.
  let atFrame = 1; // frame counter.

  let repeatCount = options.repeat; // number of repeats left.
  let alternateCycle = 1; // 1 for the first cycle, 2 for the second cycle.

  let isFirstFrame = true; // true when the animation is in the first frame.
  let isLastFrame = false; // true when the animation is in the last frame.

  let isStopped = false; // this will stop the animation.
  let stoppedAt = null; // time or progress when the animation was stopped.
  let isPaused = false; // this will pause the animation.
  let pausedAt = null; // time when the animation was paused.
  let isKilled = false; // to check if the animation was killed to prevent overlapping.
  let isReversed = false; // which direction the animation is going depending on [to] and [from].
  let isReversedAlternate = false; // to reverse play animation in alternate direction.

  let resolveAsyncOnFinish = null; // to resolve the promise when the animation is finished.
  let resolveAsyncOnProgress = null; // to resolve the promise when the animation reaches the progress.

  const progressTimeSet = new Set(); // save progress listerners id's or asyncsOnProgress times to prevent multiple calls.

  const listenrs = {
    onProgress: [], // save progress listeners at, callback, repeatAt, and id.
    onStart: [], // save start listeners callback and id.
    onFinish: [], // save finish listeners callback and id.
  };

  // set [from] option to default value `0` if not set, and check if it is valid.
  if (options.from === undefined) options.from = Array.isArray(options.to) ? new Array(options.to.length).fill(0) : 0;

  // setup [easingFunction] to default value/s if needed.
  const setupEasingFunction = ({ easingFunction }) => {
    const isEaseArray = Array.isArray(easingFunction);
    const isEaseFunction = typeof easingFunction === 'function';
    const isEaseString = typeof easingFunction === 'string';
    const isToArray = Array.isArray(options.to);

    if (isEaseArray && isToArray) {
      // convert easing strings to function.
      options.easingFunction = easingFunction.map(e => (typeof e === 'string' ? easing[e] : e));
      // fill the rest of the array with linear functions to match the length of [to].
      if (easingFunction.length !== options.to.length)
        options.easingFunction = easingFunction.concat(new Array(options.to.length - easingFunction.length).fill(easing.linear));
      // take the first easing function from its array if [to] is not an array
    } else if (isEaseArray && !isToArray) {
      options.easingFunction = typeof easingFunction[0] === 'string' ? easing[easingFunction[0]] : easingFunction[0];
      // create new array filled with linear functions to match the length of [to].
    } else if (!isEaseArray && isToArray) {
      if (isEaseFunction) {
        options.easingFunction = new Array(options.to.length).fill(easingFunction);
      } else if (isEaseString) options.easingFunction = new Array(options.to.length).fill(easing[easingFunction]);
    }
  };
  setupEasingFunction(options);

  const repeatPlay = async () => {
    if (options.repeat === 0) return; // exit if the user didn't set any repeats.

    // exit if no repeats left and reset the repeat count for future use.
    if (repeatCount === 0) {
      repeatCount = options.repeat;
      isReversedAlternate = false;
      return;
    }

    if (repeatCount < 0) progressTimeSet.clear(); // if the repeat is infinite, clear the progressSet on every repeat.

    repeatCount = repeatCount < 0 ? -1 : repeatCount - 1; // decrement the repeat count if it's not infinite.

    if (options.delay) await sleep(options.delay); // delay between repeats.

    // play alternate instead of forward or backward.
    if (options.direction.includes('alternate')) {
      alternateAndRepeat(true);
      return;
    }

    isReversed ? backward() : forward(); // play the next repeat if direction is normal or reverse.
  };

  const startAnim = timeStamp => {
    if (alternateCycle !== 2) isFirstFrame = true;
    start = timeStamp;
    excute(timeStamp, true);
    isFirstFrame = false;
  };

  const fireOnFinishEvent = isLastFrame => {
    // for async onFinish.
    if (resolveAsyncOnFinish && isLastFrame) {
      resolveAsyncOnFinish();
      resolveAsyncOnFinish = null;
    }

    // for onFinish listeners.
    if (listenrs.onFinish.length > 0) {
      listenrs.onFinish.forEach(l => {
        const { cb } = l;
        if (isLastFrame) cb();
      });
    }
  };

  const fireOnProgressEvent = (progress, time) => {
    // for async onProgress.
    if (resolveAsyncOnProgress) {
      const { at, resolve, atRepeat } = resolveAsyncOnProgress;

      if (typeof at === 'string') {
        const percent = parseInt(at);
        if (progress >= percent && atRepeat === repeatCount && !progressTimeSet.has(progress)) {
          progressTimeSet.add(progress);
          resolve();
          resolveAsyncOnProgress = null;
        }
      }

      if (time >= at && !progressTimeSet.has(time)) {
        progressTimeSet.add(time);
        resolve();
        resolveAsyncOnProgress = null;
      }
    }

    // for onProgress listeners.
    if (listenrs.onProgress.length > 0) {
      listenrs.onProgress.forEach(l => {
        const { at, cb, id, atRepeat } = l;

        if (typeof at === 'string') {
          const percent = parseInt(at);
          if (progress >= percent && atRepeat === repeatCount && !progressTimeSet.has(id)) {
            cb();
            progressTimeSet.add(id);
          }
        }

        if (time >= at && !progressTimeSet.has(id)) {
          cb();
          progressTimeSet.add(id);
        }
      });
    }
  };

  const excute = now => {
    const p = (now - start) / options.duration; // p as progress

    // is the animation finished?
    if (repeatCount === 0 && p > 1) {
      isLastFrame = options.direction.includes('alternate') ? alternateCycle === 2 : true;
      fireOnFinishEvent(isLastFrame);
    }

    // calculate frame per second.
    const fps = Math.round(atFrame / ((performance.now() - start) / 1000));
    atFrame += 1;

    // calculate time passed.
    let time = now - start > options.duration ? options.duration : Math.round(now - start);
    time = options.direction.includes('alternate') && alternateCycle === 2 ? time + options.duration : time;

    // calculate progress.
    let progress = options.direction.includes('alternate') ? (alternateCycle === 1 ? p / 2 : p / 2 + 0.5) : p;
    progress = Math.max(0, Math.min(100, Math.round(progress * 100)));

    // fire onProgress event.
    fireOnProgressEvent(progress, time);

    // passed information to the animation callback.
    const callbackInfo = { isFirstFrame, isLastFrame, progress, repeatCount, alternateCycle, fps, time };

    // excute the animation callback for array of values.
    if (Array.isArray(options.to)) {
      const values = [];
      options.from.forEach((f, i) => {
        let x = f + (options.to[i] - f) * options.easingFunction[i](p);
        x = now - start >= options.duration ? options.to[i] : x; // correct the value if it is over the duration
        values.push(x);
      });
      callback(values, callbackInfo);
      // excute the animation callback for single value.
    } else {
      let x = options.from + (options.to - options.from) * options.easingFunction(p);
      x = now - start >= options.duration ? options.to : x;
      callback([x], callbackInfo);
    }

    if (isPaused || isStopped || isKilled) return; // exit if paused or stopped or killed.

    !(now - start >= options.duration)
      ? requestAnimationFrame(excute) // continue to the next frame.
      : alternateAndRepeat(); // play alternate or repeat or stop.
  };

  const alternateAndRepeat = (initiate, at) => {
    if (initiate) {
      progressTimeSet.clear();

      isReversedAlternate
        ? options.direction === 'alternate'
          ? backward(at)
          : forward(at)
        : options.direction === 'alternate'
        ? forward(at)
        : backward(at);
      return;
    }

    if (options.direction === 'alternate' && alternateCycle === 1) {
      isReversedAlternate ? forward() : backward();
      alternateCycle = 2;
    } else if (options.direction === 'alternate-reverse' && alternateCycle === 1) {
      !isReversedAlternate ? forward() : backward();
      alternateCycle = 2;
    } else {
      alternateCycle = 1;
      repeatPlay();
    }
  };

  const init = async at => {
    isKilled = true;
    await sleep(8);
    isKilled = false;
    isStopped = false;
    isPaused = false;
    isLastFrame = false;
    atFrame = 1;

    if (at === undefined) {
      requestAnimationFrame(startAnim);
      return;
    }

    if (typeof at === 'string') {
      const percent = parseInt(at);

      if (percent === 0) {
        requestAnimationFrame(startAnim);
        return;
      }

      if (options.direction.includes('alternate')) {
        alternateCycle = percent * 2 > 100 ? 2 : 1;
        const p = Math.abs(percent * 2 - (percent * 2 > 100 ? 100 : 0)) / 100;
        start = performance.now() - options.duration * p;
      } else {
        start = performance.now() - options.duration * (percent / 100);
      }

      excute(start);
      if (alternateCycle !== 2) isFirstFrame = false;

      return;
    }

    if (typeof at === 'number') {
      if (options.direction.includes('alternate')) {
        alternateCycle = at > options.duration ? 2 : 1;
        start = performance.now() - (alternateCycle === 2 ? at + options.duration : at);
      }
      start = performance.now() - at;
      excute(start);
    }
  };

  const forward = at => {
    if (isReversed) {
      const temp = options.to;
      options.to = options.from;
      options.from = temp;
      isReversed = false;
    }

    init(at);
  };

  const backward = at => {
    if (!isReversed) {
      const temp = options.to;
      options.to = options.from;
      options.from = temp;
      isReversed = true;
    }

    isLastFrame = false;

    init(at);
  };

  const pause = () => {
    isPaused = true;
    pausedAt = performance.now();
  };

  const resume = () => {
    if (isPaused) {
      isPaused = false;
      progressTimeSet.clear();
      start += performance.now() - pausedAt;
      pausedAt = null;
      if (listenrs.onStart.length > 0) listenrs.onStart.forEach(item => item.cb());
      requestAnimationFrame(excute);
    } else if (isStopped) {
      isStopped = false;
      if (listenrs.onStart.length > 0) listenrs.onStart.forEach(item => item.cb());
      init(stoppedAt);
    } else {
      play();
    }
  };

  const play = async at => {
    isReversedAlternate = false;
    isPaused = false;
    isStopped = false;
    isLastFrame = false;
    alternateCycle = 1;
    repeatCount = options.repeat;
    progressTimeSet.clear();

    if (options.delay) await sleep(options.delay);

    if (listenrs.onStart.length > 0) listenrs.onStart.forEach(item => item.cb());

    if (options.direction.includes('reverse')) {
      backward(at);
      return;
    }

    forward(at);
  };

  const stop = (at = '100%') => {
    isStopped = true;
    stoppedAt = at;
    alternateCycle = 1;

    if (isReversed) {
      const temp = options.to;
      options.to = options.from;
      options.from = temp;
      isReversed = false;
    }

    if (typeof at === 'string') {
      const percent = parseInt(at);
      const p = options.direction.includes('alternate')
        ? Math.abs(percent * 2 - (percent * 2 > 100 ? 100 : 0)) / 100
        : percent / 100;
      start = percent === 100 ? 0 : performance.now() - options.duration * p;
    } else if (typeof at === 'number') {
      start = performance.now() - at;
    }

    requestAnimationFrame(excute);
  };

  const reverse = async at => {
    isReversedAlternate = true;
    isPaused = false;
    isStopped = false;
    isLastFrame = false;
    alternateCycle = 1;
    repeatCount = options.repeat;
    progressTimeSet.clear();

    if (options.delay) await sleep(options.delay);

    if (listenrs.onStart.length > 0) listenrs.onStart.forEach(item => item.cb());

    if (options.direction.includes('reverse')) {
      forward(at);
      return;
    }

    backward(at);
  };

  const setOptions = ob => {
    const isOldAlternate = options.direction.includes('alternate');
    const isNewAlternate = ob.direction?.includes('alternate');
    const isDuration = typeof ob.duration === 'number';
    const isFrom = ob.from !== undefined;
    const isTo = ob.to !== undefined;

    if (ob.direction) {
      if (isNewAlternate && !isOldAlternate) {
        if (isDuration) {
          ob.duration = ob.duration / 2;
        } else options.duration = options.duration / 2;
      } else if (!isNewAlternate && isOldAlternate) {
        if (isDuration) {
          ob.duration = ob.duration * 2;
        } else options.duration = options.duration * 2;
      }
    } else if (isDuration) {
      ob.duration = isOldAlternate ? ob.duration / 2 : ob.duration * 2;
    }

    if (isDuration) {
      start = isPaused
        ? pausedAt - ob.duration * ((pausedAt - start) / options.duration)
        : performance.now() - ob.duration * ((performance.now() - start) / options.duration);
    }

    if (typeof ob.repeat === 'number') repeatCount = ob.repeat;

    if (options.from === undefined && isTo && !isFrom) options.from = Array.isArray(ob.to) ? new Array(ob.to.length).fill(0) : 0;

    if (isTo && isFrom && isReversed) {
      const temp = ob.to;
      ob.to = ob.from;
      ob.from = temp;
    } else if (isTo && !isFrom && isReversed) {
      ob.from = ob.to;
      delete ob.to;
    } else if (!isTo && isFrom && isReversed) {
      ob.to = ob.from;
      delete ob.from;
    }

    options = { ...options, ...ob };

    if (isDevMode) checkInputs();

    if (ob.easingFunction) setupEasingFunction(ob);
  };

  const onProgress = (at, cb, atRepeat = 0) => {
    if ((typeof at !== 'number' && typeof at !== 'string') || typeof cb !== 'function' || typeof atRepeat !== 'number') {
      if (isDevMode)
        throw new Error(
          '[onProgress] first param must be a number or string, second param must be a callback function, third param must be a number'
        );
      return;
    }
    const id = `onProgress_${Math.random() * 100}`;
    listenrs.onProgress.push({ at, cb, atRepeat, id });

    return () => {
      listenrs.onProgress = listenrs.onProgress.filter(item => item.id !== id);
    };
  };

  const asyncOnProgress = (at, atRepeat = 0) => {
    if ((typeof at !== 'number' && typeof at !== 'string') || typeof atRepeat !== 'number') {
      if (isDevMode)
        throw new Error('[asyncOnProgress] first param must be a number or string, the second param must be a number');
      return;
    }
    if (resolveAsyncOnProgress) return;
    return new Promise(resolve => {
      resolveAsyncOnProgress = { at, atRepeat, resolve };
    });
  };

  const onStart = cb => {
    if (typeof cb !== 'function') {
      if (isDevMode) throw new Error('[onStart] param must be a callback function');
      return;
    }
    const id = `onStart_${Math.random() * 100}`;
    listenrs.onStart.push({ cb, id });

    return () => {
      listenrs.onStart = listenrs.onStart.filter(item => item.id !== id);
    };
  };

  const onFinish = cb => {
    if (typeof cb !== 'function') {
      if (isDevMode) throw new Error('[onFinish] accept a callback function only');
      return;
    }

    const id = `onFinish_${Math.random() * 100}`;
    listenrs.onFinish.push({ cb, id });

    return () => {
      listenrs.onFinish = listenrs.onFinish.filter(item => item.id !== id);
    };
  };

  const asyncOnFinish = () => {
    if (resolveAsyncOnFinish) return;
    return new Promise(resolve => {
      resolveAsyncOnFinish = resolve;
    });
  };

  if (options.autoPlay) play();

  return {
    play,
    reverse,
    stop,
    pause,
    resume,
    onStart,
    onFinish,
    asyncOnFinish,
    onProgress,
    asyncOnProgress,
    setOptions,
    options,
  };
}
