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
    if (typeof options.to !== 'number' && !Array.isArray(options.to)) throw new Error('[to] is required');

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

  let reqId = null; // request id for the animation frame.
  let start = null; // start time of the animation.
  let def = 0; // used to correct the animation progress when playing at a specific time.
  let atFrame = 1; // frame counter.

  let repeatCount = options.repeat; // number of repeats left.
  let alternateCycle = 1; // 1 for the first cycle, 2 for the second cycle.

  let isFirstFrame = true; // true when the animation is in the first frame.
  let isLastFrame = false; // true when the animation is in the last frame.

  let isStopped = true; // this will stop the animation.
  let stoppedAt = null; // time or progress when the animation was stopped.
  let isPaused = false; // this will pause the animation.
  let isFinished = false; // true when the animation is finished.
  let pausedAt = null; // time when the animation was paused.
  let isReversed = false; // which direction the animation is going depending on [to] and [from].
  let isReversedAlternate = false; // to reverse play animation in alternate direction.
  let resolveAsyncOnFinish = null; // to resolve the promise when the animation is finished.
  let resolveAsyncOnProgress = null; // to resolve the promise when the animation reaches the progress.

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
      if (easingFunction.length < options.to.length)
        options.easingFunction = easingFunction.concat(new Array(options.to.length - easingFunction.length).fill(easing.linear));
      // remove unnecessary functions.
      if (options.to.length > easingFunction.length) easingFunction.length = options.to.length;
      // take the first easing function from its array if [to] is not an array
    } else if (isEaseArray && !isToArray) {
      options.easingFunction = typeof easingFunction[0] === 'string' ? easing[easingFunction[0]] : easingFunction[0];
      // create new array filled with linear functions to match the length of [to].
    } else if (!isEaseArray && isToArray) {
      if (isEaseFunction) {
        options.easingFunction = new Array(options.to.length).fill(easingFunction);
      } else if (isEaseString) options.easingFunction = new Array(options.to.length).fill(easing[easingFunction]);
    } else if (!isEaseArray && !isToArray) {
      options.easingFunction = isEaseFunction ? easingFunction : easing[easingFunction];
    }
  };
  setupEasingFunction(options);

  const timeLine = [{ options: { ...options }, cb: callback, id: 'default', userInput: { ...options } }];
  const timeLinePlayed = new Set(); // to check if the animation is played.
  let isTimeLineReversed = false; // to play the timeline in reverse direction.

  let timeLineOptions = { repeat: 0, speed: 1 };
  let timeLineRepeatCount = timeLineOptions.repeat; // number of repeats left on the timeline.

  const progressTimeSet = new Set(); // save progress listerners id's or asyncsOnProgress times to prevent multiple calls.

  const listenrs = {
    onProgress: [], // save progress listeners at, callback, repeatAt, and id.
    onStart: [], // save start listeners callback and id.
    onFinish: [], // save finish listeners callback and id.
  };

  const fireTimeLine = () => {
    if (isStopped || isPaused) return;

    // when all the animations in the timeline are finished.
    if (timeLinePlayed.size === timeLine.length) {
      timeLinePlayed.clear();
      progressTimeSet.clear();
      isReversed = false;
      options = { ...timeLine[0].options }; // reset options to the default animation.
      callback = timeLine[0].cb;

      // repeat the timeline if needed.
      if (timeLineRepeatCount === 0) {
        timeLineRepeatCount = timeLineOptions.repeat;
        isTimeLineReversed = false;
        return;
      }

      timeLineRepeatCount = timeLineRepeatCount < 0 ? -1 : timeLineRepeatCount - 1;
      isTimeLineReversed ? reverse() : play();

      return;
    }

    // play the next animation in the timeline.
    const i = isTimeLineReversed ? timeLine.length - timeLinePlayed.size - 1 : timeLinePlayed.size;
    const e = timeLine[i];
    options = { ...e.options };
    callback = e.cb;
    repeatCount = options.repeat;
    setupEasingFunction(options);
    timeLinePlayed.add(e.id);
    isReversed = false;
    isTimeLineReversed ? (options.direction.includes('alternate') ? play() : reverse()) : play();
  };

  const repeatPlay = async () => {
    // exit if the user didn't set any repeats.
    if (options.repeat === 0) {
      fireTimeLine(); // play the next animation in the timeline.
      return;
    }

    // exit if no repeats left and reset the repeat count for future use.
    if (repeatCount === 0) {
      repeatCount = options.repeat;
      isReversedAlternate = false;
      fireTimeLine(); // play the next animation in the timeline.
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
    isFirstFrame = alternateCycle === 1;
    start = timeStamp;
    excute(timeStamp, true);
    isFirstFrame = false;
  };

  const fireOnFinishEvent = isLastFrame => {
    // exit if there are animations didn't finish yet in the timeLine.
    if (timeLinePlayed.size !== timeLine.length) return;

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

      // percentage of the progress.
      if (typeof at === 'string') {
        const percent = parseInt(at);
        if (progress >= percent && atRepeat === repeatCount && !progressTimeSet.has(progress)) {
          progressTimeSet.add(progress);
          resolve();
          resolveAsyncOnProgress = null;
        }
      }

      // time of the progress.
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

        // percentage of the progress.
        if (typeof at === 'string') {
          const percent = parseInt(at);
          if (progress >= percent && atRepeat === repeatCount && !progressTimeSet.has(id)) {
            cb();
            progressTimeSet.add(id);
          }
        }

        // time of the progress.
        if (time >= at && !progressTimeSet.has(id)) {
          cb();
          progressTimeSet.add(id);
        }
      });
    }
  };

  const minMax = (value, min, max) => Math.max(min, Math.min(max, Math.round(value)));

  const excute = now => {
    now = now + def;
    let p = (now - start) / options.duration; // p as progress
    p = p >= 1 || Number.isNaN(p) ? 1 : p; // correct the progress if it is over 100 percent or the duration is 0.

    const isAlternate = options.direction.includes('alternate');

    const timelineIndex = timeLinePlayed.size - 1; // current animation index in the timeline.

    // calculate frame per second.
    const fps = Math.round(atFrame / ((performance.now() - start) / 1000));
    atFrame += 1;

    // calculate time passed.
    let time = now - start > options.duration ? options.duration : Math.round(now - start);
    time = isAlternate && alternateCycle === 2 ? time + options.duration : time;

    // calculate progress.
    let progress = isAlternate ? (alternateCycle === 1 ? p / 2 : p / 2 + 0.5) : p;
    progress = minMax(Math.round(progress * 100), 0, 100);
    let timeLineProgress = progress / timeLine.length + ((timeLinePlayed.size - 1) / timeLine.length) * 100;
    timeLineProgress = minMax(timeLineProgress, 0, 100);

    // calculate passed time in the timeline.
    let d = 0;
    for (let i = 0; i < timeLinePlayed.size - 1; i++) {
      const e = timeLine[i].options.duration;
      d = timeLinePlayed.size === 1 ? 0 : d + e;
    }
    const timeLineTime = d + time;

    if (p >= 1) isLastFrame = isAlternate ? alternateCycle === 2 : true;

    isFinished = repeatCount === 0 && p >= 1 && isLastFrame && timeLinePlayed.size === timeLine.length;

    // passed information to the animation callback.
    const callbackInfo = {
      isFirstFrame,
      isLastFrame,
      isFinished,
      progress,
      repeatCount,
      alternateCycle,
      fps,
      time,
      timeLineTime,
      timeLineProgress,
      timelineIndex,
      play,
      reverse,
      pause,
      setOptions,
      getOptions,
    };

    // excute the animation callback for array of values.
    if (Array.isArray(options.to)) {
      const values = [];
      options.from.forEach((f, i) => {
        let x = f + (options.to[i] - f) * options.easingFunction[i](p);
        values.push(x);
      });
      callback(values, callbackInfo);
      // excute the animation callback for single value.
    } else {
      let x = options.from + (options.to - options.from) * options.easingFunction(p);
      callback([x], callbackInfo);
    }

    // is the animation finished?
    if (repeatCount === 0 && p >= 1) fireOnFinishEvent(isLastFrame);

    // fire onProgress event.
    fireOnProgressEvent(timeLineProgress, timeLineTime);

    // exit if paused or stopped.
    if (isPaused || isStopped) {
      cancelAnimationFrame(reqId);
      return;
    }

    !(now - start >= options.duration)
      ? (reqId = requestAnimationFrame(excute)) // continue to the next frame.
      : alternateAndRepeat(); // play alternate or repeat or stop.
  };

  const alternateAndRepeat = (initiate, at) => {
    if (initiate) {
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

  const initAt = at => {
    // if percentage is given -> convert [at] to time.
    if (typeof at === 'string') {
      const percent = parseInt(at); // convert percentage from string to number.
      // calculate the time of all the animations in the timeline.
      const overAllDuration = timeLine.reduce(
        (acc, e) => (e.options.direction.includes('alternate') ? acc + e.options.duration * 2 : acc + e.options.duration),
        0
      );
      at = Math.floor((percent / 100) * overAllDuration); // convert [at] to time.
    }

    let overallTime = 0; // calculate the overall time that passed [at].

    // loop configs if reversed loop from the end else from the start.
    let i = isTimeLineReversed ? timeLine.length - 1 : 0;
    let condition = isTimeLineReversed ? i >= 0 && i < timeLine.length : i < timeLine.length;

    for (i; condition; i = isTimeLineReversed ? i - 1 : i + 1) {
      const e = timeLine[i];
      options = { ...e.options };
      callback = e.cb;
      // reverse the direction if timeLine is reversed.
      if (isTimeLineReversed) {
        const temp = options.to;
        options.to = options.from;
        options.from = temp;
        isReversed = true;
      }

      repeatCount = options.repeat; // reset repeat count.
      setupEasingFunction(options); // setup easing function.
      timeLinePlayed.add(e.id); // add to the played timeLine.

      overallTime += options.direction.includes('alternate') ? options.duration * 2 : options.duration;

      // in case of direction is alternate or alternate-reverse.
      if (options.direction.includes('alternate')) {
        const remainingTime = Math.abs(overallTime - at - options.duration * 2);
        alternateCycle = remainingTime > options.duration ? 2 : 1;
        start = performance.now();
        def = Math.abs(alternateCycle === 2 ? remainingTime - options.duration : remainingTime);
        if (alternateCycle === 2 && !isTimeLineReversed) {
          if (!isReversed) {
            const temp = options.to;
            options.to = options.from;
            options.from = temp;
            isReversed = true;
          }
        } else if (alternateCycle === 2 && isTimeLineReversed) {
          if (isReversed) {
            const temp = options.to;
            options.to = options.from;
            options.from = temp;
            isReversed = false;
          }
        }
      } else {
        start = performance.now();
        def = Math.abs(overallTime - at - options.duration);
      }

      if (overallTime >= at) break; // break to countinue the animation from [at] time.
    }

    excute(start);
  };

  const init = async at => {
    cancelAnimationFrame(reqId);
    isFirstFrame = alternateCycle === 1;
    isLastFrame = false;
    atFrame = 1;
    def = 0;

    // if at not provided start from the beginning and exit.
    if (at === undefined || at === 0 || at === '0%') {
      reqId = requestAnimationFrame(startAnim);
      return;
    }

    initAt(at);

    isFirstFrame = false;
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
      isStopped = false;
      progressTimeSet.clear();
      start += performance.now() - pausedAt;
      pausedAt = null;
      if (listenrs.onStart.length > 0) listenrs.onStart.forEach(item => item.cb());
      reqId = requestAnimationFrame(excute);
    } else if (isStopped) {
      isPaused = false;
      isStopped = false;
      if (listenrs.onStart.length > 0) listenrs.onStart.forEach(item => item.cb());
      init(stoppedAt);
    } else {
      play();
    }
  };

  const play = async at => {
    isStopped = false;
    isPaused = false;
    isReversedAlternate = false;
    alternateCycle = 1;
    repeatCount = options.repeat;

    if (timeLinePlayed.size === 0) {
      const first = timeLine[0];
      options = { ...first.options };
      callback = first.cb;
      setupEasingFunction(options);
      repeatCount = options.repeat;
      timeLinePlayed.add(first.id);
    }

    if (options.delay) await sleep(options.delay);

    if (listenrs.onStart.length > 0 && timeLinePlayed.size === 1) listenrs.onStart.forEach(item => item.cb());

    if (options.direction.includes('reverse')) {
      backward(at);
      return;
    }

    forward(at);
  };

  const stop = async (at = '100%', reversed = false) => {
    reversed ? reverse(at) : play(at);
    cancelAnimationFrame(reqId);
    isStopped = true;
    stoppedAt = at;
  };

  const reverse = async at => {
    isReversedAlternate = true;
    isTimeLineReversed = true;
    isStopped = false;
    isPaused = false;
    alternateCycle = 1;
    repeatCount = options.repeat;

    if (timeLinePlayed.size === 0) {
      const last = timeLine[timeLine.length - 1];
      options = { ...last.options };
      callback = last.cb;
      setupEasingFunction(options);
      repeatCount = options.repeat;
      timeLinePlayed.add(last.id);
    }

    if (options.delay) await sleep(options.delay);

    if (listenrs.onStart.length > 0 && timeLinePlayed.size === 1) listenrs.onStart.forEach(item => item.cb());

    if (options.direction.includes('reverse')) {
      forward(at);
      return;
    }

    backward(at);
  };

  const setOptions = (op, index = 0) => {
    if (index > timeLine.length - 1) {
      if (isDevMode) console.warn('[setOptions] Index param is out of range');
      return;
    }

    // add or subtract the duration and delay from the previous animation option in the timeLine.
    if (index > 0) {
      const previous = timeLine[index - 1];

      const previousDuration = previous.options.direction.includes('alternate')
        ? previous.options.duration * 2
        : previous.options.duration;

      if (typeof op.duration === 'string') op.duration = Math.abs(previousDuration + parseInt(op.duration));
      if (typeof op.delay === 'string') op.delay = Math.abs(previous.options.delay + parseInt(op.delay));
    }

    const timelineOptions = timeLine[index].options;
    const isOldAlternate = timelineOptions.direction.includes('alternate');
    const isNewAlternate = op.direction?.includes('alternate');
    const isDuration = typeof op.duration === 'number';
    const isEasing = typeof op.easing !== 'undefined';
    const isFrom = op.from !== undefined;
    const isTo = op.to !== undefined;
    const isMounted = timeLinePlayed.size - 1 === index || (timeLinePlayed.size === 0 && index === 0);

    const after = timeLine[index + 1];
    if (after) {
      if (isTo && after.userInput.from === undefined) after.options.from = op.to;
      // loop through the timeLine and update the duration and easing function of the next animation.
      for (let i = index + 1; i < timeLine.length; i++) {
        const nextAnim = timeLine[i];
        if (isEasing && nextAnim.userInput.easingFunction === undefined) nextAnim.options.easingFunction = op.easingFunction;
        if (isDuration && nextAnim.userInput.duration === undefined)
          nextAnim.options.duration = nextAnim.options.direction?.includes('alternate') ? op.duration / 2 : op.duration;
      }
    }

    // set the duration depending on the direction.
    if (op.direction) {
      if (isNewAlternate && !isOldAlternate) {
        isDuration ? (op.duration = op.duration / 2) : (timeLine[index].options.duration = timeLine[index].options.duration / 2);
        // if mounted
        options.duration = isMounted ? options.duration / 2 : options.duration;
        //
      } else if (!isNewAlternate && isOldAlternate) {
        isDuration ? (op.duration = op.duration * 2) : (timeLine[index].options.duration = timeLine[index].options.duration * 2);
        // if mounted
        options.duration = isMounted ? options.duration * 2 : options.duration;
      }
    } else if (isDuration) {
      op.duration = isOldAlternate ? op.duration / 2 : op.duration;
    }

    if (isMounted) {
      // apply new duration to the current animation.
      if (isDuration) {
        start = isPaused
          ? pausedAt - op.duration * ((pausedAt - start) / options.duration)
          : performance.now() - op.duration * ((performance.now() - start) / options.duration);
      }

      // apply [repeat] to the current animation.
      if (typeof op.repeat === 'number') repeatCount = op.repeat;

      // set [from] to default values.
      if (options.from === undefined && isTo && !isFrom)
        options.from = Array.isArray(op.to) ? new Array(op.to.length).fill(0) : 0;

      const fromTo = {};
      if (isTo && isFrom && isReversed) {
        fromTo.to = op.from;
        fromTo.from = op.to;
      } else if (isTo && !isFrom && isReversed) {
        fromTo.from = op.to;
      } else if (!isTo && isFrom && isReversed) {
        fromTo.to = op.from;
      }

      options = { ...options, ...op, ...fromTo };
      if (isDevMode) checkInputs();
      if (op.easingFunction) setupEasingFunction(op);
    }

    timeLine[index].options = { ...timelineOptions, ...op };
    timeLine[index].userInput = { ...timeLine[index].userInput, ...op };
  };

  const getOptions = (index = 0) => {
    if (index > timeLine.length - 1) {
      if (isDevMode) console.warn('[getOptions] Index param is out of range');
      return;
    }
    return timeLine[index].options;
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

  const next = (op, cb) => {
    const userInput = { ...op };

    const last = timeLine[timeLine.length - 1];
    op.from = op.from ?? last.options.to; // take [from] value from last timeLine item if not provided.
    op.direction = op.direction ?? 'normal';
    op.easingFunction = op.easingFunction ?? last.options.easingFunction; // easing function inherited if not provided.
    op.delay = op.delay ?? 0;
    op.repeat = op.repeat ?? 0;
    cb = cb ?? last.cb; // callback inherited if not provided.
    op.autoPlay = false; // autoPlay is false by default.

    const lastDuration = last.options.direction.includes('alternate') ? last.options.duration * 2 : last.options.duration;
    if (typeof op.duration === 'string') op.duration = Math.abs(lastDuration + parseInt(op.duration));
    if (typeof op.delay === 'string') op.delay = Math.abs(last.options.delay + parseInt(op.delay));

    const isLastAlternate = last.options?.direction.includes('alternate');
    const isNewAlternate = op.direction?.includes('alternate');
    const isDuration = typeof op.duration === 'number';

    // inherit duration depending on direction.
    if (isDuration && isNewAlternate) {
      op.duration = op.duration / 2;
    } else if (!isDuration && isNewAlternate && isLastAlternate) {
      op.duration = last.options.duration;
    } else if (!isDuration && !isNewAlternate && isLastAlternate) {
      op.duration = last.options.duration * 2;
    } else if (!isDuration && isNewAlternate && !isLastAlternate) {
      op.duration = last.options.duration / 2;
    } else op.duration = op.duration ?? last.options.duration;

    timeLine.push({ options: op, cb, id: `to${Math.random() * 100}`, userInput });

    return { ...returned, setTimeLineOptions };
  };

  const setTimeLineOptions = ob => {
    if (typeof ob !== 'object') {
      if (isDevMode) throw new Error('[setTimeLineOptions] param must be an object');
      return;
    }

    if (ob.repeat !== undefined) timeLineRepeatCount = ob.repeat;
    if (ob.speed !== undefined) {
      timeLine.forEach(item => {
        item.options.duration = ob.speed < 0 ? item.options.duration * -ob.speed : item.options.duration / ob.speed;
      });
    }
    timeLineOptions = { ...timeLineOptions, ...ob };
  };

  if (options.autoPlay) play();

  const returned = {
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
    getOptions,
    next,
  };
  return returned;
}
