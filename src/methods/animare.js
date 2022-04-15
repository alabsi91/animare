const isDevMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const linear = x => x;

export function animare(options, callback) {
  options = options ?? {};
  options.duration = options.duration ?? 350;
  options.autoPlay = options.autoPlay ?? true;
  options.repeat = options.repeat ?? 0;
  options.delay = options.delay ?? 0;
  options.delayOnce = options.delayOnce ?? false;
  options.direction = options.direction ?? 'normal';
  options.ease = options.ease ?? linear;

  // check user input for errors.
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

    // check if [delay] is a number and greater than 0
    if (typeof options.delay !== 'number' || options.delay < 0) throw new Error('[delay] must be a number greater than -1');

    // check if [delayOnce] is a boolean
    if (typeof options.delayOnce !== 'boolean') throw new Error('[delayOnce] must be a boolean');

    // check if [repeat] is a number
    if (typeof options.repeat !== 'number') throw new Error('[repeat] must be a number');

    // check if [autoPlay] is a boolean
    if (typeof options.autoPlay !== 'boolean') throw new Error('[autoPlay] must be a boolean');

    // check if [direction] one of the following:
    if (!['normal', 'reverse', 'alternate', 'alternate-reverse'].includes(options.direction))
      throw new Error('[direction] must be a string and one of the following: normal, reverse, alternate, alternate-reverse');

    // check if [ease] string is one of easing functions
    if (typeof options.ease !== 'function' && !Array.isArray(options.ease)) {
      throw new Error('[ease] must be a function or array of functions.');
    }
    // check if [ease] is an array and if one of the elements is a string and one of the elements is a function.
    if (Array.isArray(options.ease)) {
      options.ease.forEach(e => {
        if (typeof e !== 'function') throw new Error('[ease] must be a function or array of functions.');
      });
    }
  };

  if (isDevMode) checkInputs(); // check if inputs are valid only in development mode.

  // when the animation direction is 'alternate' or 'alternate-reverse',
  // the overall duration will represent the both the forward and backward animation duration
  if (options.direction.includes('alternate')) options.duration = options.duration / 2;

  // delay wating with the ability cancle the waiting.
  let abortController = new AbortController();
  let aborted = false;
  const sleep = time => {
    return new Promise(resolve => {
      if (abortController.signal.aborted) {
        abortController = new AbortController();
      }
      aborted = false;

      const abort = () => {
        aborted = true;
        clearTimeout(timeout);
        resolve();
        abortController.signal.removeEventListener('abort', abort);
      };

      const timeout = setTimeout(() => {
        resolve();
        abortController.signal.removeEventListener('abort', abort);
      }, time);

      abortController.signal.addEventListener('abort', abort);
    });
  };

  let reqId = null, // request id for the animation frame.
    start = null, // start time of the animation.
    def = 0, // used to correct the animation progress when playing at a specific time.
    atFrame = 1, // frame counter used to calulate fps.
    repeatCount = options.repeat, // number of repeats left.
    alternateCycle = 1, // 1 for the first cycle, 2 for the second cycle.
    isFirstFrame = true, // true when the animation is in the first frame.
    isLastFrame = false, // true when the animation is in the last frame.
    isPlaying = false, // is the animation playing.
    isStopped = true, // this will stop the animation.
    stoppedAt = null, // time or progress when the animation was stopped.
    isPaused = false, // this will pause the animation.
    pausedAt = null, // time when the animation was paused.
    isFinished = false, // true when the animation is finished.
    isReversed = false, // which direction the animation is going depending on [to] and [from].
    isReversedAlternate = false, // to reverse play animation in alternate direction.
    resolveAsyncOnFinish = null, // to resolve the promise when the animation is finished.
    resolveAsyncOnProgress = null; // to resolve the promise when the animation reaches the progress.

  // set [from] option to default value `0` if not set, and check if it is valid.
  if (options.from === undefined) options.from = Array.isArray(options.to) ? new Array(options.to.length).fill(0) : 0;

  // setup [ease] to default value/s if needed.
  const setupEase = ({ ease }) => {
    const isEaseArray = Array.isArray(ease);
    const isToArray = Array.isArray(options.to);

    if (isEaseArray && isToArray) {
      // fill the rest of the array with linear functions to match the length of [to].
      if (ease.length < options.to.length)
        options.ease = options.ease.concat(new Array(options.to.length - ease.length).fill(linear));
      // remove unnecessary functions.
      if (options.to.length > ease.length) options.ease.length = options.to.length;
      // take the first easing function from its array if [to] is not an array
    } else if (isEaseArray && !isToArray) {
      options.ease = ease[0];
    }
  };
  setupEase(options);

  // time line
  const timeline = [{ options: { ...options }, cb: callback, id: 'default', userInput: { ...options } }];
  const timelinePlayed = new Set(); // all played animations in the timeline go here.
  let isTimeLineReversed = false, // to play the timeline in reverse direction.
    timelinePlayCount = 0, // to count the number of times the timeline was repeated. used for delayOnce.
    timelineOptions = { repeat: 0, speed: 1 }, // hoping to add more options in the future.
    timelineRepeatCount = timelineOptions.repeat; // number of repeats left on the timeline.

  const progressTimeSet = new Set(); // save progress listerners id's or asyncsOnProgress times to prevent multiple calls.

  const listenrs = {
    onProgress: [], // save progress listeners at, callback, repeatAt, and id.
    onStart: [], // save start listeners callback and id.
    onFinish: [], // save finish listeners callback and id.
  };

  const fireTimeLine = () => {
    if (isStopped || isPaused) return;

    // when all the animations in the timeline are finished.
    if (timelinePlayed.size === timeline.length) {
      // clean preparing next move.
      if (isTimeLineReversed) {
        reset();
        isReversedAlternate = true;
        isTimeLineReversed = true;

        // play get last animation in the timeline.
        const last = timeline[timeline.length - 1];
        options = { ...last.options };
        callback = last.cb;
        setupEase(options);
        timelinePlayed.add(last.id);
      } else {
        reset();
        timelinePlayed.add(timeline[0].id); // first animation in the time line
      }

      if (timelineRepeatCount === 0) {
        // if the timeline is not repeating, finish the animation.
        timelineRepeatCount = timelineOptions.repeat;
        isTimeLineReversed = false;
        isPlaying = false;
        return;
      }

      // repeat the timeline if needed.
      timelineRepeatCount = timelineRepeatCount < 0 ? -1 : timelineRepeatCount - 1;
      timelinePlayCount++;
      isTimeLineReversed ? reverseTimeline(!options.delayOnce) : playTimeline(!options.delayOnce);

      return;
    }

    // play the next animation in the timeline.
    const i = isTimeLineReversed ? timeline.length - timelinePlayed.size - 1 : timelinePlayed.size;
    const e = timeline[i];
    options = { ...e.options };
    callback = e.cb;
    repeatCount = options.repeat;
    setupEase(options);
    timelinePlayed.add(e.id);
    const withDelay = options.delayOnce ? timelinePlayCount === 0 : true;
    isTimeLineReversed
      ? options.direction.includes('alternate')
        ? playTimeline(withDelay)
        : reverseTimeline(withDelay)
      : playTimeline(withDelay);
  };

  const playTimeline = async (withDelay = true) => {
    isStopped = false;
    isReversedAlternate = false;
    alternateCycle = 1;
    repeatCount = options.repeat;
    isReversed = false;

    if (options.delay && withDelay) await sleep(options.delay);

    if (options.direction.includes('reverse')) {
      backward();
      return;
    }

    forward();
  };

  const reverseTimeline = async (withDelay = true) => {
    isStopped = false;
    isReversedAlternate = true;
    isTimeLineReversed = true;
    alternateCycle = 1;
    repeatCount = options.repeat;
    isReversed = false;

    if (options.delay && withDelay) await sleep(options.delay);

    if (options.direction.includes('reverse')) {
      forward();
      return;
    }

    backward();
  };

  const repeat = async () => {
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

    if (options.delay && !options.delayOnce) await sleep(options.delay); // delay between repeats.

    // play alternate instead of forward or backward.
    if (options.direction.includes('alternate')) {
      alternate(true);
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
    if (timelinePlayed.size !== timeline.length) return;

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

  const clamp = (value, min, max) => Math.max(min, Math.min(max, Math.round(value)));

  const excute = now => {
    isPlaying = true;
    now = now + def;
    let p = (now - start) / options.duration; // p as progress
    p = p >= 1 || Number.isNaN(p) ? 1 : p; // correct the progress if it is over 100 percent or the duration is 0.

    const isAlternate = options.direction.includes('alternate');

    const timelineIndex = timelinePlayed.size - 1; // current animation index in the timeline.

    // calculate frame per second.
    const fps = Math.round(atFrame / ((performance.now() - start) / 1000));
    atFrame += 1;

    // calculate time passed.
    let time = now - start > options.duration ? options.duration : Math.round(now - start);
    time = isAlternate && alternateCycle === 2 ? time + options.duration : time;

    // calculate progress.
    let progress = isAlternate ? (alternateCycle === 1 ? p / 2 : p / 2 + 0.5) : p;
    progress = clamp(Math.round(progress * 100), 0, 100);
    let timelineProgress = progress / timeline.length + ((timelinePlayed.size - 1) / timeline.length) * 100;
    timelineProgress = clamp(timelineProgress, 0, 100);

    // calculate passed time in the timeline.
    let d = 0;
    for (let i = 0; i < timelinePlayed.size - 1; i++) {
      const e = timeline[i].options.duration;
      d = timelinePlayed.size === 1 ? 0 : d + e;
    }
    const timelineTime = d + time;

    if (p >= 1) isLastFrame = isAlternate ? alternateCycle === 2 : true;

    isFinished = repeatCount === 0 && p >= 1 && isLastFrame && timelinePlayed.size === timeline.length;

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
      timelineTime,
      timelineProgress,
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
      let easeValue = null;
      const isEaseArray = Array.isArray(options.ease);
      if (!isEaseArray) easeValue = options.ease(p);

      for (let i = 0; i < options.from.length; i++) {
        const f = isReversed ? options.to[i] : options.from[i];
        const t = isReversed ? options.from[i] : options.to[i];
        const x = f + (t - f) * (!isEaseArray ? easeValue : options.ease[i](p));
        values.push(x);
      }

      callback(values, callbackInfo);
      // excute the animation callback for single value.
    } else {
      const f = isReversed ? options.to : options.from;
      const t = isReversed ? options.from : options.to;
      const x = f + (t - f) * options.ease(p);
      callback([x], callbackInfo);
    }

    // is the animation finished?
    if (repeatCount === 0 && p >= 1) fireOnFinishEvent(isLastFrame);

    // fire onProgress event.
    fireOnProgressEvent(timelineProgress, timelineTime);

    // exit if paused or stopped.
    if (isPaused || isStopped) {
      cancelAnimationFrame(reqId);
      isPlaying = false;
      return;
    }

    !(now - start >= options.duration)
      ? (reqId = requestAnimationFrame(excute)) // continue to the next frame.
      : alternate(); // play alternate or repeat or stop.
  };

  const alternate = (initiate, at) => {
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
      repeat();
    }
  };

  const reset = () => {
    abortController.abort();
    cancelAnimationFrame(reqId);
    if (isReversed) {
      const temp = options.to;
      options.to = options.from;
      options.from = temp;
    }
    reqId = null;
    start = null;
    atFrame = 1;
    def = 0;
    isFirstFrame = true;
    isLastFrame = false;
    isFinished = false;
    isReversed = false;
    isReversedAlternate = false;
    resolveAsyncOnFinish = null;
    resolveAsyncOnProgress = null;
    isStopped = true;
    isPlaying = false;
    stoppedAt = null;
    isPaused = false;
    pausedAt = null;
    alternateCycle = 1;
    repeatCount = options.repeat;

    timelinePlayed.clear();
    progressTimeSet.clear();
    options = { ...timeline[0].options }; // reset options to the default animation.
    callback = timeline[0].cb;
    setupEase(options);
    timelineRepeatCount = timelineOptions.repeat;
    isTimeLineReversed = false;
  };

  const initAt = (at, play = true) => {
    // if percentage is given -> convert [at] to time.
    if (typeof at === 'string') {
      const percent = parseInt(at); // convert percentage from string to number.
      // calculate the time of all the animations in the timeline.
      const overAllDuration = timeline.reduce(
        (acc, e) => (e.options.direction.includes('alternate') ? acc + e.options.duration * 2 : acc + e.options.duration),
        0
      );
      at = Math.floor((percent / 100) * overAllDuration); // convert [at] to time.
    }

    let overallTime = 0; // calculate the overall time that passed [at].

    // loop configs, if reversed loop from the end else from the start.
    let i = isTimeLineReversed ? timeline.length - 1 : 0;
    let condition = isTimeLineReversed ? i >= 0 && i < timeline.length : i < timeline.length;

    for (i; condition; i = isTimeLineReversed ? i - 1 : i + 1) {
      const e = timeline[i];
      options = { ...e.options };
      callback = e.cb;
      // reverse the direction if timeLine is reversed.
      if (isTimeLineReversed) isReversed = true;

      repeatCount = options.repeat; // reset repeat count.
      setupEase(options); // setup easing function.
      timelinePlayed.add(e.id); // add to the played timeLine.

      overallTime += options.direction.includes('alternate') ? options.duration * 2 : options.duration;

      // in case of direction is alternate or alternate-reverse.
      if (options.direction.includes('alternate')) {
        const remainingTime = Math.abs(overallTime - at - options.duration * 2);
        alternateCycle = remainingTime > options.duration ? 2 : 1; // in which cycle the animation is in.
        start = performance.now();
        def = Math.abs(alternateCycle === 2 ? remainingTime - options.duration : remainingTime);

        if (alternateCycle === 2 && !isTimeLineReversed && !isReversed) {
          isReversed = true;
        } else if (alternateCycle === 2 && isTimeLineReversed && isReversed) {
          isReversed = false;
        }
      } else {
        start = performance.now();
        def = Math.abs(overallTime - at - options.duration);
      }

      if (overallTime >= at) break; // break to countinue the animation from [at] time.
    }

    if (play) excute(start);
  };

  const init = async at => {
    cancelAnimationFrame(reqId);
    isFirstFrame = alternateCycle === 1;
    isLastFrame = false;
    atFrame = 1;
    def = 0;

    // if at not provided start from the beginning and exit.
    if (at === undefined) {
      reqId = requestAnimationFrame(startAnim);
      return;
    }

    initAt(at);

    isFirstFrame = false;
  };

  const forward = at => {
    isReversed = false;
    init(at);
  };

  const backward = at => {
    isReversed = true;
    isLastFrame = false;
    init(at);
  };

  const stop = (at = '100%', reversed = false) => {
    abortController.abort(); // cancel delays.
    isReversed = reversed;
    isTimeLineReversed = reversed;
    initAt(at, !isPlaying);
    isStopped = true;
    stoppedAt = at;
    timelinePlayed.clear();
    progressTimeSet.clear();
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

  const play = async (at, withDelay = true) => {
    reset();
    isStopped = false;
    timelinePlayCount = 0;

    timelinePlayed.add(timeline[0].id); // first animation in the time line

    if (options.delay && withDelay) await sleep(options.delay);
    // fire onStart event.
    if (listenrs.onStart.length > 0 && timelinePlayed.size === 1) listenrs.onStart.forEach(item => item.cb());

    if (aborted) return;

    if (options.direction.includes('reverse')) {
      backward(at);
      return;
    }

    forward(at);
  };

  const reverse = async (at, withDelay = true) => {
    reset();
    timelinePlayCount = 0;
    isReversedAlternate = true;
    isTimeLineReversed = true;
    isStopped = false;

    // play get last animation in the timeline.
    const last = timeline[timeline.length - 1];
    options = { ...last.options };
    callback = last.cb;
    setupEase(options);
    timelinePlayed.add(last.id);

    if (options.delay && withDelay) await sleep(options.delay);
    // fire onStart event.
    if (listenrs.onStart.length > 0 && timelinePlayed.size === 1) listenrs.onStart.forEach(item => item.cb());

    if (options.direction.includes('reverse')) {
      forward(at);
      return;
    }

    backward(at);
  };

  const setOptions = (op, index = 0) => {
    if (index > timeline.length - 1) {
      if (isDevMode) console.warn('[setOptions] Index param is out of range');
      return;
    }

    // add or subtract the duration and delay from the previous animation option in the timeLine.
    if (index > 0) {
      const previous = timeline[index - 1];

      const previousDuration = previous.options.direction.includes('alternate')
        ? previous.options.duration * 2
        : previous.options.duration;

      // for "+" and "-" duration.
      if (typeof op.duration === 'string') op.duration = Math.abs(previousDuration + parseInt(op.duration));
      if (typeof op.delay === 'string') op.delay = Math.abs(previous.options.delay + parseInt(op.delay));
    }

    const timelineOptions = timeline[index].options; // the options of the animation in the timeLine.
    const isOldAlternate = timelineOptions.direction.includes('alternate'); // is the current direction option is alternate.
    const isNewAlternate = op.direction?.includes('alternate'); // is the entered direction option alternate.
    const isDuration = typeof op.duration === 'number'; // is [duration] entered.
    const isEasing = typeof op.easing !== 'undefined'; // is [easing] entered.
    const isFrom = op.from !== undefined; // is [from] entered.
    const isTo = op.to !== undefined; // is [to] entered.
    const isMounted = timelinePlayed.size - 1 === index || (timelinePlayed.size === 0 && index === 0); // is the animation is currently playing.
    const after = timeline[index + 1]; // the next animation in the timeLine.

    if (after) {
      // if [to] entered and the next animation [from] is a default value.
      if (isTo && after.userInput.from === undefined) after.options.from = op.to;
      // loop through the timeLine and update the duration and easing function of the next animation.
      for (let i = index + 1; i < timeline.length; i++) {
        const nextAnim = timeline[i];
        if (isEasing && nextAnim.userInput.ease === undefined) nextAnim.options.ease = op.ease;
        if (isDuration && nextAnim.userInput.duration === undefined)
          nextAnim.options.duration = nextAnim.options.direction?.includes('alternate') ? op.duration / 2 : op.duration;
      }
    }

    // set the duration depending on the direction.
    if (op.direction) {
      if (isNewAlternate && !isOldAlternate) {
        isDuration ? (op.duration = op.duration / 2) : (timeline[index].options.duration = timeline[index].options.duration / 2);
        // if mounted
        options.duration = isMounted ? options.duration / 2 : options.duration;
        //
      } else if (!isNewAlternate && isOldAlternate) {
        isDuration ? (op.duration = op.duration * 2) : (timeline[index].options.duration = timeline[index].options.duration * 2);
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
      if (op.ease) setupEase(op);
      if (isDevMode) checkInputs();
    }

    timeline[index].options = { ...timelineOptions, ...op };
    timeline[index].userInput = { ...timeline[index].userInput, ...op };
  };

  const getOptions = (index = 0) => {
    if (index > timeline.length - 1) {
      if (isDevMode) console.warn('[getOptions] Index param is out of range');
      return;
    }
    return timeline[index].options;
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

    const last = timeline[timeline.length - 1];
    op.from = op.from ?? last.options.to; // take [from] value from last timeLine item if not provided.
    op.direction = op.direction ?? 'normal';
    op.ease = op.ease ?? last.options.ease; // easing function inherited if not provided.
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

    timeline.push({ options: op, cb, id: `to${Math.random() * 100}`, userInput });
    const isBlocked = timeline.some((e, i) => e.options.repeat === -1 && i !== timeline.length - 1);
    if (isBlocked) console.warn('[next] Some animations are blocked by infinite repeat');

    return { ...returned, setTimelineOptions };
  };

  const setTimelineOptions = ob => {
    if (typeof ob !== 'object' && !Array.isArray(ob)) {
      if (isDevMode) throw new Error('[setTimelineOptions] first param must be an object');
      return;
    }

    ob.repeat = ob.repeat ?? timelineOptions.repeat;
    ob.speed = ob.speed ?? timelineOptions.speed;

    if (typeof ob.repeat !== 'number') {
      if (isDevMode) throw new Error('[setTimelineOptions] repeat must be a number');
      return;
    }

    if (typeof ob.speed !== 'number') {
      if (isDevMode) throw new Error('[setTimelineOptions] speed must be a number');
      return;
    }

    timelineRepeatCount = ob.repeat;

    timeline.forEach(item => {
      item.options.duration = ob.speed < 0 ? item.options.duration * -ob.speed : item.options.duration / ob.speed;
    });
    timelineOptions = { ...timelineOptions, ...ob };
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
