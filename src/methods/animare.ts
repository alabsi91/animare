import { animareOnUpdate, animareOptions, DIRECTION, Ilisteners, animareReturnedObject, TIMELINE_TYPE } from './types.js';

export default function animare(options: animareOptions, callback: animareOnUpdate) {
  if (typeof options !== 'object' || Array.isArray(options))
    throw new Error('\n\n⛔ [animare] : expects an object as the first argument. \n\n');

  options.to = Array.isArray(options.to) ? options.to : [options.to];
  /** - save user's inputs for later to determine default values. */
  const userInput = { ...options };
  options.from ??= 0;
  options.delay ??= 0;
  options.delayOnce ??= false;
  options.duration ??= 350;
  options.direction ??= DIRECTION.normal;
  options.repeat ??= 0;
  options.ease ??= t => t;
  options.autoPlay ??= true;
  options.type ??= TIMELINE_TYPE.immediate;

  type toMap = (index: number) => number;
  if (typeof options.from === 'function') options.from = options.to.map((_, i) => (options.from as toMap)(i));
  if (typeof options.delay === 'function') options.delay = options.to.map((_, i) => (options.delay as toMap)(i));
  if (typeof options.duration === 'function') options.duration = options.to.map((_, i) => (options.duration as toMap)(i));
  if (typeof options.repeat === 'function') options.repeat = options.to.map((_, i) => (options.repeat as toMap)(i));

  const checkInputs = (options: animareOptions) => {
    if (
      (typeof options.from !== 'number' && !Array.isArray(options.from)) ||
      (Array.isArray(options.from) && options.from.some(e => typeof e !== 'number'))
    )
      throw new Error('\n\n⛔ [animare] ➡️ [options] : `from` must be a number or an array of numbers. !!\n\n');

    if (
      (typeof options.to !== 'number' && !Array.isArray(options.to)) ||
      (Array.isArray(options.to) && options.to.some(e => typeof e !== 'number'))
    )
      throw new Error('\n\n⛔ [animare] ➡️ [options] : `to` must be a number or an array of numbers. !!\n\n');

    if (
      (typeof options.delay !== 'number' && !Array.isArray(options.delay)) ||
      (Array.isArray(options.delay) && options.delay.some(e => typeof e !== 'number' || e < 0)) ||
      (typeof options.delay === 'number' && options.delay < 0)
    )
      throw new Error(
        '\n\n⛔ [animare] ➡️ [options] : `delay` must be a number or an array of numbers greater than or equal to `0`. !!\n\n'
      );

    if (
      (typeof options.delayOnce !== 'boolean' && !Array.isArray(options.delayOnce)) ||
      (Array.isArray(options.delayOnce) && options.delayOnce.some(e => typeof e !== 'boolean'))
    )
      throw new Error('\n\n⛔ [animare] ➡️ [options] : `delayOnce` must be a boolean or an array of booleans. !!\n\n');

    if (
      (typeof options.duration !== 'number' && !Array.isArray(options.duration)) ||
      (Array.isArray(options.duration) && options.duration.some(e => typeof e !== 'number' || e < 0)) ||
      (typeof options.duration === 'number' && options.duration < 0)
    )
      throw new Error(
        '\n\n⛔ [animare] ➡️ [options] : `duration` must be a number or an array of numbers greater than or equal to `0` !!\n\n'
      );

    if (
      (typeof options.direction === 'string' && !Object.keys(DIRECTION).includes(options.direction)) ||
      (Array.isArray(options.direction) &&
        options.direction.some(e => typeof e !== 'string' && !Object.keys(DIRECTION).includes(e)))
    )
      throw new Error(
        '\n\n⛔ [animare] ➡️ [options] : `direction` must be a string or an array of strings and one of the following: ' +
          Object.values(DIRECTION).join(', ') +
          ' !!\n\n'
      );

    if (
      (typeof options.repeat !== 'number' && !Array.isArray(options.repeat)) ||
      (Array.isArray(options.repeat) && options.repeat.some(e => typeof e !== 'number'))
    )
      throw new Error('\n\n⛔ [animare] ➡️ [options] : `repeat` must be a number or an array of numbers. !!\n\n');

    if (
      (typeof options.ease !== 'function' && !Array.isArray(options.ease)) ||
      (Array.isArray(options.ease) && options.ease.some(e => typeof e !== 'function'))
    )
      throw new Error('\n\n⛔ [animare] ➡️ [options] : `ease` must be a function or an array of functions. !!\n\n');

    if (typeof options.autoPlay !== 'undefined' && typeof options.autoPlay !== 'boolean')
      throw new Error('\n\n⛔ [animare] ➡️ [options] : `autoPlay` must be a boolean. !!\n\n');

    if (typeof callback !== 'function') throw new Error('\n\n⛔ [animare] ➡️ [callback] must be a function. !!\n\n');
  };
  checkInputs(options);

  /** - start time of each animation. */
  let start: number[] = [],
    /** - used to calulate fps. */
    fpsTimeStamp: number,
    /** - start time used to calculate overall progress. */
    excuteTimeStamp: number,
    /** - duration of the excute function. */
    excuteDuration: number,
    /** - is the first frame of the animation. */
    isFirstFrame: boolean,
    /** - time when the animation was paused. */
    pausedAt: number | null,
    /** - to play one frame only for stop method. */
    isStoped: boolean,
    /** - is the animation playing backward ? */
    isReversePlay = false,
    /** - to resolve the promise when the animation is finished for `onFinishAsync` . */
    resolveAsyncOnFinish: ((value: PromiseLike<never>) => void) | null,
    /** - to resolve the promise for `onProgressAsync` event. */
    resolveAsyncOnProgress: { at: number; resolve: (value: PromiseLike<never>) => void } | null,
    /** - requestAnimationFrame ID used to cancel the animation.*/
    reqId: number | null,
    /** - to correct start time when the browser pauses the animation. */
    diff: number | null,
    /** - initial repeat count used during animation's execution. */
    repeatCount = Array.isArray(options.repeat) ? [...options.repeat] : [...options.to].fill(options.repeat as number),
    /** - timeline options. */
    tlOptions = { repeat: 0, speed: 1 }, // ? maybe add more options in the future? like timeline direction.
    /** - the number of repeats is left in the timeline. */
    tlRepeatCount = new Array<number>(options.to.length).fill(tlOptions.repeat);

  /** - the progress of each animated value. */
  const progresses = new Array<number>(options.to.length).fill(0),
    /** - the alternate cycle of each animated value. */
    alternateCycle = new Array<1 | 2>(options.to.length).fill(1),
    /** - finished animated values indexes will be stored here.*/
    finished = new Set<number>(),
    /** - if the animated value not changing (delayed or finished) last known value of it will be used as a placeholder. */
    lastKnownValue: number[] = [],
    /** - array of animations. */
    timeline = [{ options: { ...options }, userInput }],
    /** - in which timeline every animated value is at. */
    timelineAt = new Array<number>(options.to.length).fill(0),
    /** - to save animation's events listeners. */
    listeners: Ilisteners = {
      onProgress: [], // save progress listeners at, callback, repeatAt, and id.
      onStart: [], // save start listeners callback and id.
      onFinish: [], // save finish listeners callback and id.
    },
    /** - save progress listerners IDES or asyncsOnProgress times to prevent multiple calls.*/
    progressTimeSet = new Set<string>();

  /** - to correct progress when the browser is pausing the animation.
   * ! ⚠️ this may not work perfectly in all browsers especially `Safari`. */
  const visibilitychange = {
    isExist: false,
    add: () => {
      if (visibilitychange.isExist) return;
      document.addEventListener('visibilitychange', visibilitychange.handle, false);
      visibilitychange.isExist = true;
    },
    remove: () => {
      document.removeEventListener('visibilitychange', visibilitychange.handle, false);
      visibilitychange.isExist = false;
    },
    handle: () => {
      if (document.visibilityState === 'hidden') diff = performance.now();
    },
  };

  const startAnim = (timeStamp: number) => {
    visibilitychange.add(); // add visibilitychange listener.

    start = new Array<number>((options.to as number[]).length).fill(timeStamp);
    excuteTimeStamp = fpsTimeStamp = timeStamp;

    listeners.onStart.forEach(({ cb }) => cb()); // fire onStart event listeners.

    isFirstFrame = true;
    excute(timeStamp); // start the animation.
    isFirstFrame = false;
  };

  const excute = (now: number) => {
    // correct the timeStamp if the browser is paused the animation.
    if (diff) {
      const now = performance.now();
      const delta = now - diff;
      start = start.map(s => s + delta);
      excuteTimeStamp = excuteTimeStamp + delta;
      diff = null;
    }

    const callbackParams: number[] = [];

    for (let i = 0; i < (options.to as number[]).length; i++) {
      // skip finished animation
      if (finished.has(i)) {
        callbackParams.push(lastKnownValue[i]); // put a value until animation starts
        continue;
      }

      /** - store current animation's options from `timeline`. */
      const op = timeline[timelineAt[i]].options,
        /** - current animated value direction. */
        direction = Array.isArray(op.direction) ? op.direction[i] ?? DIRECTION.normal : (op.direction as DIRECTION),
        /** - current animated value repeat. */
        repeat = Array.isArray(op.repeat) ? op.repeat[i] ?? 0 : (op.repeat as number),
        /** - is current animated value will be delayed only at the first play. */
        delayOnce = Array.isArray(op.delayOnce) ? op.delayOnce[i] ?? false : (op.delayOnce as boolean),
        /** - current animated value easing function. */
        ease = Array.isArray(op.ease) ? op.ease[i] ?? ((x: number): number => x) : (op.ease as (x: number) => number),
        /** - if `delayOnce` is true, apply the delay only aat the first repeat.*/
        delay =
          (alternateCycle[i] === 2 || (delayOnce && repeatCount[i] < repeat) || (delayOnce && tlRepeatCount[i] < tlOptions.repeat)
            ? 0
            : Array.isArray(op.delay)
            ? op.delay[i] ?? 0
            : (op.delay as number)) * tlOptions.speed;

      /** if the `direction` is `reversed` or `alternate-reverse` at the first cycle, or `alternate` at the second cycle. */
      let isReversed =
        direction === DIRECTION.reverse ||
        (direction === DIRECTION['alternate-reverse'] && alternateCycle[i] === 1) ||
        (direction === DIRECTION.alternate && alternateCycle[i] === 2);
      // reverse timeline play.
      isReversed = isReversePlay ? (direction?.includes(DIRECTION.alternate) ? isReversed : !isReversed) : isReversed;

      /** - if the `direction` is type `alternate` the `duration` will be divided by 2 to match overall duration. */
      let duration = Array.isArray(op.duration) ? op.duration[i] ?? op.duration[op.duration.length - 1] : (op.duration as number);
      duration = (direction.includes(DIRECTION.alternate) ? duration / 2 : duration) * tlOptions.speed;

      /** - if the animation is reversed then `from` will be replaced with `to`. */
      const from = isReversed ? (op.to as number[])[i] : Array.isArray(op.from) ? op.from[i] ?? 0 : (op.from as number),
        /** - if the animation is reversed then `to` will be replaced with `from` */
        to = isReversed ? (Array.isArray(op.from) ? op.from[i] ?? 0 : (op.from as number)) : (op.to as number[])[i];

      // wait for delay
      if (now - start[i] - delay < 0) {
        // put a value until animation starts to keep callbackParams at the same length as [to].
        callbackParams.push(lastKnownValue[i] ?? from);
        continue;
      }

      /** - `p` is the current animated value progress (0➡️1) */
      let p = (now - (start[i] + delay)) / duration;
      p = p >= 1 || Number.isNaN(p) ? 1 : p; // correct the progress if it is over 100 percent or the duration is 0.
      const x = from + (to - from) * ease(p); // calculate the animated value
      callbackParams.push(x);
      progresses[i] = p;
      if (p === 1) lastKnownValue[i] = x; // save the last known value for the next animation.

      // wait for duration
      if (now - (start[i] + delay) < duration) continue;

      // * alternate
      if (direction?.includes(DIRECTION.alternate) && alternateCycle[i] === 1) {
        start[i] = now; // reset timer.
        alternateCycle[i] = 2;
        continue;
      }

      // * repeat
      if (repeat > 0 && repeatCount[i] > 0) {
        repeatCount[i]--;
        start[i] = now; // reset timer.
        alternateCycle[i] = 1; // reset alternate cycle
        continue;
      }

      // * infinite repeat
      if (repeat === -1) {
        if (repeatCount[i] === -1) repeatCount[i] = -2; // this to trigger [delayOnce] in infinite repeat.
        start[i] = now; // reset timer.
        alternateCycle[i] = 1; // reset alternate cycle
        continue;
      }

      // * play next timeline only timeline type `IMMEDIATE`
      if ((isReversePlay && timelineAt[i] > 0) || (!isReversePlay && timelineAt[i] < timeline.length - 1)) {
        const nextTimelineType = timeline[isReversePlay ? timelineAt[i] - 1 : timelineAt[i] + 1].options.type;

        if (nextTimelineType === TIMELINE_TYPE.immediate) {
          isReversePlay ? timelineAt[i]-- : timelineAt[i]++; // switch to next timeline.

          // reset repeat count.
          const op = timeline[timelineAt[i]].options;
          repeatCount[i] = Array.isArray(op.repeat) ? op.repeat[i] ?? 0 : (op.repeat as number);

          alternateCycle[i] = 1; // reset alternate cycle
          start[i] = now; // reset timer.

          continue;
        }
      }

      // * repeat the timeline only timeline type `IMMEDIATE`
      const isTimelineFinished =
        (isReversePlay && timelineAt[i] === 0) || (!isReversePlay && timelineAt[i] === timeline.length - 1);
      if (
        isTimelineFinished &&
        ((tlOptions.repeat > 0 && tlRepeatCount[i] > 0) || (tlOptions.repeat === -1 && isTimelineFinished))
      ) {
        // check next timeline type.
        if (timeline?.[isReversePlay ? timeline.length - 1 : 0]?.options.type === TIMELINE_TYPE.immediate) {
          if (tlOptions.repeat !== -1) tlRepeatCount[i]--;
          if (tlRepeatCount[i] === -1) tlRepeatCount[i] = -2; // this to trigger [delayOnce] in infinite repeat.

          // reset repeat count.
          const op = timeline[isReversePlay ? timeline.length - 1 : 0].options;
          repeatCount[i] = Array.isArray(op.repeat) ? op.repeat[i] ?? 0 : (op.repeat as number);

          timelineAt[i] = isReversePlay ? timeline.length - 1 : 0;
          alternateCycle[i] = 1; // reset alternate cycle
          finished.delete(i); // reset finished
          start[i] = now; // reset timer.
          continue;
        }
      }

      // finished... no repeat or timeline
      finished.add(i);
    }

    // ! [calbackParams] and [to] should be the same length.
    if (callbackParams.length !== (options.to as number[]).length)
      console.warn(`\n\n⚠️ [animare] ➡️ callbackParams length is not equal to to length \n\n`);

    // * callback info
    // calculate frame per second.
    const fps = isFinite(Math.round(1000 / (now - fpsTimeStamp))) ? Math.round(1000 / (now - fpsTimeStamp)) : 0;
    fpsTimeStamp = now;
    /** - true only when all animations are finished. */
    const isFinished =
      finished.size === (options.to as number[]).length &&
      timelineAt.every(t => (isReversePlay ? t === 0 : t === timeline.length - 1)) &&
      repeatCount.every(x => x === 0) &&
      tlRepeatCount.every(x => x === 0);
    /** - time passed since the animation started. */
    const time = ~~(now - excuteTimeStamp);
    /** - overall progress including timeline and repeats. -1 if infinite repeat detected. */
    const progress = excuteDuration === -1 ? -1 : +(time / excuteDuration > 1 ? 1 : time / excuteDuration).toFixed(3);

    // * callback
    callback(callbackParams, {
      fps,
      isFirstFrame,
      isFinished,
      isReversePlay,
      time,
      timelineProgress: progress,
      progress: progresses,
      timelineIndex: timelineAt,
      repeatCount,
      timelineRepeatCount: tlRepeatCount,
      alternateCycle,
      play,
      reverse,
      pause,
      stop,
      getOptions,
      setOptions,
    });

    // * fire onProgress listeners.
    if (progress !== -1) {
      for (let i = 0; i < listeners.onProgress.length; i++) {
        const listener = listeners.onProgress[i];
        const { at, cb, id } = listener;

        if (progress >= at && !progressTimeSet.has(id)) {
          cb();
          progressTimeSet.add(id); // prevent firing the same listener twice.
        }
      }
      // resolve onProgress promise.
      if (resolveAsyncOnProgress) {
        const { at, resolve } = resolveAsyncOnProgress;
        // time of the progress.
        if (progress >= at) {
          const sleep = new Promise<never>(resolve => setTimeout(resolve, 0));
          resolve(sleep);
          resolveAsyncOnProgress = null;
        }
      }
    }

    // * if not finished or not stopped keep going
    if (finished.size !== (options.to as number[]).length && !isStoped) {
      reqId = requestAnimationFrame(excute);
      return;
    }

    // ! at this point [timelineAt] array elements should all have the same value.
    if (new Set(timelineAt).size !== 1) console.warn('\n\n⚠️ [animare] ➡️ [timelineAt] array elements are not the same !!\n\n');

    // * play the next animation in the timeline type `WAIT` only.
    if ((isReversePlay && timelineAt[0] > 0) || (!isReversePlay && timelineAt[0] < timeline.length - 1)) {
      // play only timeline type `wait`.
      const timelineType = timeline[isReversePlay ? timelineAt[0] - 1 : timelineAt[0] + 1].options.type;
      if (timelineType !== TIMELINE_TYPE.wait) return;

      // tell all animations to switch to the next timeline.
      timelineAt.fill(isReversePlay ? timelineAt[0] - 1 : timelineAt[0] + 1);
      // reset repeat count
      const nextRepeat = timeline[timelineAt[0]].options.repeat;
      repeatCount = Array.isArray(nextRepeat) ? [...nextRepeat] : [...(options.to as number[])].fill(nextRepeat as number);

      alternateCycle.fill(1); // reset alternate cycle
      finished.clear(); // reset finished animations.
      start.fill(now); // reset timer.
      reqId = requestAnimationFrame(excute); // start the timeline.
      return;
    }

    // * repeat the timeline only timeline type `wait`
    if ((tlOptions.repeat > 0 && tlRepeatCount[0] > 0) || tlOptions.repeat === -1) {
      const timelineType = timeline[isReversePlay ? timeline.length - 1 : 0].options.type;
      if (timelineType !== TIMELINE_TYPE.wait) return;
      if (tlOptions.repeat !== -1) tlRepeatCount.fill(tlRepeatCount[0] - 1);
      if (tlRepeatCount[0] === -1) tlRepeatCount.fill(-2); // this to trigger delay once in infinite repeat.

      // reset repeat count.
      const op = timeline[isReversePlay ? timeline.length - 1 : 0].options;
      repeatCount = Array.isArray(op.repeat) ? [...op.repeat] : [...(op.to as number[])].fill(op.repeat as number);

      // reset timeline.
      isReversePlay ? timelineAt.fill(timeline.length - 1) : timelineAt.fill(0);
      alternateCycle.fill(1); // reset alternate cycle
      finished.clear(); // reset finished animations.
      start.fill(now); // reset timer.
      reqId = requestAnimationFrame(excute); // start the timeline.
      return;
    }

    // * fire onFinishe event listeners.
    listeners.onFinish.forEach(({ cb }) => cb());
    if (resolveAsyncOnFinish) {
      const sleep = new Promise<never>(resolve => setTimeout(resolve, 0));
      resolveAsyncOnFinish(sleep);
      resolveAsyncOnFinish = null;
    }

    reqId = null;

    // remove visibility listener on finish.
    visibilitychange.remove();

    finished.clear(); // reset finished animations.
  };

  /** - caluculate the duration of overall animation including timelines and repeats.*/
  const calculateTime = () => {
    // ! maybe doesn't work if frame rate drops. to be tested.
    let time = 0;

    // if infinite repeat detected return -1.
    const isInfinitive =
      tlOptions.repeat === -1 ||
      timeline.some(x => (Array.isArray(x.options.repeat) ? x.options.repeat.some(r => r === -1) : x.options.repeat === -1));

    if (isInfinitive) {
      time = -1;
      return time;
    }

    const tl = isReversePlay ? [...timeline].reverse() : timeline;

    const results = [];
    for (let v = 0; v < (options.to as number[]).length; v++) {
      const groups = [];
      for (let r = 0; r < tlOptions.repeat + 1; r++) {
        for (let t = 0; t < tl.length; t++) {
          const { options } = tl[t],
            isWait = options.type === TIMELINE_TYPE.wait,
            delay = Array.isArray(options.delay) ? options.delay[v] ?? 0 : (options.delay as number),
            duration = Array.isArray(options.duration)
              ? options.duration[v] ?? options.duration[options.duration.length - 1]
              : (options.duration as number),
            repeat = (Array.isArray(options.repeat) ? options.repeat[v] ?? 0 : (options.repeat as number)) + 1,
            delayOnce = Array.isArray(options.delayOnce) ? options.delayOnce[v] ?? false : options.delayOnce,
            length =
              (delayOnce && r === 0
                ? duration * repeat + delay
                : delayOnce && r > 0
                ? duration * repeat
                : (delay + duration) * repeat) * tlOptions.speed;

          if (isWait) {
            groups.push(length);
          } else if (groups[groups.length - 1] !== undefined) {
            groups[groups.length - 1] += length;
          } else {
            groups.push(length);
          }
        }
      }
      results.push(groups);
    }

    const waitAndImmediate = [];
    for (let i = 0; i < results[0].length; i++) {
      const g = [];
      for (let t = 0; t < results.length; t++) g.push(results[t][i]);
      waitAndImmediate.push(g);
    }

    time = waitAndImmediate.map(e => Math.max(...e)).reduce((a, b) => a + b, 0);
    time += 25 * tlOptions.repeat; // add some buffer.

    return time;
  };

  const reset = (reverse: boolean) => {
    // cancel the animation if it is already running.
    if (reqId) cancelAnimationFrame(reqId);
    // reset repeat count.
    const op = timeline[reverse ? timeline.length - 1 : 0].options;
    repeatCount = Array.isArray(op.repeat) ? [...op.repeat] : [...(op.to as number[])].fill(op.repeat as number);

    // reset last known position.
    lastKnownValue.length = 0;
    // reset timeline repeat count.
    tlRepeatCount = [...(options.to as number[])].fill(tlOptions.repeat);
    // reset alternate cycle
    alternateCycle.fill(1);
    // reset finished animations.
    finished.clear();
    // reset onProgress listeners.
    progressTimeSet.clear();
    // reset atFrame counter.
    fpsTimeStamp = 0;
    // reset isStoped vairable that is used in stop() method to play one frame at the end or at the start.
    isStoped = false;
    // reset paused state.
    pausedAt = null;
    // reset difference between start and now.
    diff = null;
  };

  const play: animareReturnedObject['play'] = (op, i = 0) => {
    reset(false);
    if (op) setOptions(op, i);
    // play forward.
    isReversePlay = false;
    timelineAt.fill(0);

    // start the animation.
    excuteDuration = calculateTime();
    reqId = requestAnimationFrame(startAnim);
  };

  const reverse: animareReturnedObject['reverse'] = (op, i = 0) => {
    reset(true);
    if (op) setOptions(op, i);
    // reverse the direction.
    isReversePlay = true;
    timelineAt.fill(timeline.length - 1);
    // start the animation.
    excuteDuration = calculateTime();
    reqId = requestAnimationFrame(startAnim);
  };

  const pause: animareReturnedObject['pause'] = () => {
    if (!reqId || pausedAt) return; // exit if animation is not running or already paused.
    cancelAnimationFrame(reqId);
    pausedAt = performance.now();
    visibilitychange.remove();
  };

  const resume: animareReturnedObject['resume'] = () => {
    // if the animation is not paused, play it.
    if (!pausedAt) {
      play();
      return;
    }
    // else resume the animation.
    const now = performance.now();
    const delta = now - pausedAt;
    start = start.map(s => s + delta);
    excuteTimeStamp = excuteTimeStamp + delta;
    pausedAt = null;
    diff = null;
    isStoped = false;
    reqId = requestAnimationFrame(excute);
    visibilitychange.add();
  };

  const stop: animareReturnedObject['stop'] = (stopAtStart = true) => {
    stopAtStart ? play() : reverse();
    isStoped = true;
    reqId = null;

    // remove visibility listener on stop.
    visibilitychange.remove();
  };

  const next: animareReturnedObject['next'] = op => {
    if (typeof op !== 'object')
      throw new Error('\n\n⛔ [animare] ➡️ [next] ➡️ [options] : expects an object as the first argument. \n\n');
    if ((!Array.isArray(op.to) && typeof op.to !== 'number') || (Array.isArray(op.to) && op.to.some(t => typeof t !== 'number')))
      throw new Error('\n\n⛔ [animare] ➡️ [next] ➡️ [options] : `to` must be a number or an array of numbers. !!\n\n');

    op.to = Array.isArray(op.to) ? op.to : [op.to];

    if (typeof op.from === 'function') op.from = op.to.map((_, i) => (op.from as toMap)(i));
    if (typeof op.delay === 'function') op.delay = op.to.map((_, i) => (op.delay as toMap)(i));
    if (typeof op.duration === 'function') op.duration = op.to.map((_, i) => (op.duration as toMap)(i));
    if (typeof op.repeat === 'function') op.repeat = op.to.map((_, i) => (op.repeat as toMap)(i));

    const userInput = { ...op };

    const previousTimeline = { ...timeline[timeline.length - 1] };

    if ((previousTimeline.options.to as number[]).length !== op.to.length)
      throw new Error(
        '\n\n⛔ [animare] ➡️ [next] ➡️ [options] : `to` must have the same length as the previous animation. !!\n\n'
      );

    // * inherit options from previous animation if not specified.
    // if from is not specified, use the last known value based on the direction from the previous animation.
    if (typeof op.from === 'undefined') {
      // case previous animation direction is an array.
      if (Array.isArray(previousTimeline.options.direction)) {
        const from = [];
        for (let i = 0; i < (options.to as number[]).length; i++) {
          const prevDirection = previousTimeline.options.direction[i] ?? DIRECTION.normal;
          const isPrevReverse = prevDirection === DIRECTION.reverse;
          const isPrevAlternate = prevDirection === DIRECTION.alternate;
          const prevFrom = Array.isArray(previousTimeline.options.from)
            ? previousTimeline.options.from[i] ?? 0
            : (previousTimeline.options.from as number);
          from[i] = isPrevAlternate || isPrevReverse ? prevFrom : (previousTimeline.options.to as number[])[0];
        }
        op.from = from;
        // case previous animation direction is a single value (string).
      } else {
        const prevDirection = previousTimeline.options.direction as DIRECTION;
        const isPrevReverse = prevDirection === DIRECTION.reverse;
        const isPrevAlternate = prevDirection === DIRECTION.alternate;
        op.from ??= isPrevAlternate || isPrevReverse ? previousTimeline.options.from : previousTimeline.options.to;
      }
    }
    op.duration ??= previousTimeline.options.duration;
    op.ease ??= previousTimeline.options.ease;
    op.type ??= previousTimeline.options.type;

    // * set to default if not specified.
    op.repeat ??= [...op.to].fill(0);
    op.direction ??= DIRECTION.normal;
    op.delay ??= 0;
    op.delayOnce ??= false;

    // check user input.
    checkInputs(op);

    // check if the next animation in the timeline is reachable.
    if (timeline.some(t => (Array.isArray(t.options.repeat) ? t.options.repeat.some(r => r === -1) : t.options.repeat === -1)))
      console.warn('\n\n⚠️ [animare] ➡️ [next] Some animations are blocked by infinite repeat !!\n\n');

    timeline.push({ options: op, userInput });

    // recalculate animation duration, if the animation is already running.
    // this is necessary if autoPlay is true.
    if (reqId) excuteDuration = calculateTime();

    return returned;
  };

  const setTimelineOptions: animareReturnedObject['setTimelineOptions'] = op => {
    if (typeof op !== 'object')
      throw new Error('\n\n⛔ [animare] ➡️ [setTimelineOptions] ➡️ [options] : expects an object as the first argument. !!\n\n');
    if (op.repeat && typeof op.repeat !== 'number')
      throw new Error('\n\n⛔ [animare] ➡️ [setTimelineOptions] ➡️ [options] : `repeat` must be a number. !!\n\n');
    tlOptions = { ...tlOptions, ...op };
    tlRepeatCount = [...(options.to as number[])].fill(tlOptions.repeat);
    if (reqId) excuteDuration = calculateTime();
  };

  const onStart: animareReturnedObject['onStart'] = cb => {
    if (typeof cb !== 'function')
      throw new Error('\n\n⛔ [animare] ➡️ [onStart] : first param must be a callback function. !!\n\n');

    const id = `onStart_${Math.random() * 100}`;
    listeners.onStart.push({ cb, id });

    // return a function to remove the listener.
    return () => {
      listeners.onStart = listeners.onStart.filter(listener => listener.id !== id);
    };
  };

  const onFinish: animareReturnedObject['onFinish'] = cb => {
    if (typeof cb !== 'function') throw new Error('\n\n⛔ [animare] ➡️ [onFinish] : accepts a callback function only. !!\n\n');

    const id = `onFinish_${Math.random()}`;
    listeners.onFinish.push({ cb, id });

    // return a function to remove the listener.
    return () => {
      listeners.onFinish = listeners.onFinish.filter(listener => listener.id !== id);
    };
  };

  const onFinishAsync: animareReturnedObject['onFinishAsync'] = () => {
    if (resolveAsyncOnFinish) return;
    return new Promise<never>(resolve => {
      resolveAsyncOnFinish = resolve;
    });
  };

  const onProgress: animareReturnedObject['onProgress'] = (at, cb) => {
    if (typeof at !== 'number')
      throw new Error('\n\n⛔ [animare] ➡️ [onProgress] :  accepts a number as the first argument. !!\n\n');
    if (at < 0 || at > 1)
      throw new Error('\n\n⛔ [animare] ➡️ [onProgress] : first param must be a number between `0` and `1`. !!\n\n');
    if (typeof cb !== 'function') throw new Error('\n\n⛔ [animare] ➡️ [onProgress] :  accepts a callback function only. !!\n\n');

    const id = `onProgress_${Math.random()}`;
    listeners.onProgress.push({ at, cb, id });

    // return a function to remove the listener.
    return () => {
      listeners.onProgress = listeners.onProgress.filter(listener => listener.id !== id);
    };
  };

  const onProgressAsync: animareReturnedObject['onProgressAsync'] = at => {
    if (typeof at !== 'number')
      throw new Error('\n\n⛔ [animare] ➡️ [onProgressAsync] : accepta a number as the first argument. !!\n\n');
    if (at < 0 || at > 1)
      throw new Error('\n\n⛔ [animare] ➡️ [onProgressAsync] :  first argument must be a number between `0` and `1`. !!\n\n');

    if (resolveAsyncOnProgress) return;

    return new Promise<never>(resolve => {
      resolveAsyncOnProgress = { at, resolve };
    });
  };

  const setOptions: animareReturnedObject['setOptions'] = (op, index = 0) => {
    if (typeof op !== 'object' || Array.isArray(op))
      throw new Error('\n\n⛔ [animare] ➡️ [setOptions] : expects an object as the first argument. !!\n\n');
    if (typeof index !== 'number')
      throw new Error('\n\n⛔ [animare] ➡️ [setOptions] : expects a number as the second argument. !!\n\n');
    if (index < 0 || index >= timeline.length)
      throw new Error('\n\n⛔ [animare] ➡️ [setOptions] : second argument `index` is out of range. !!\n\n');

    const isTo = op.to !== undefined, // is [to] entered.
      isDuration = op.duration !== undefined, // is [duration] entered.
      isDelay = op.delay !== undefined, // is [delay] entered.
      isRepeat = op.repeat !== undefined, // is [repeat] entered.
      nextTl = timeline?.[index + 1], // the next timeLine that come after index.
      tlDurationChanged = []; // timeline index that affected by duration change.
    if (isTo) op.to = Array.isArray(op.to) ? op.to : [op.to as number];

    const mapOver = (op.to ?? timeline[index].options.to) as number[];
    if (typeof op.from === 'function') op.from = mapOver.map((_, i) => (op.from as toMap)(i));
    if (typeof op.delay === 'function') op.delay = mapOver.map((_, i) => (op.delay as toMap)(i));
    if (typeof op.duration === 'function') op.duration = mapOver.map((_, i) => (op.duration as toMap)(i));
    if (typeof op.repeat === 'function') op.repeat = mapOver.map((_, i) => (op.repeat as toMap)(i));

    if (nextTl) {
      // reset inherited options for the next animations.
      // for example, if you changed the duration of a timeline the next timeline that doesn't has an entered one it will inherit it.
      if (isTo && nextTl.userInput.from === undefined) nextTl.options.from = op.to;

      for (let i = index + 1; i < timeline.length; i++) {
        const nextAnim = timeline[i];
        if (op.ease && !nextAnim.userInput.ease) nextAnim.options.ease = op.ease;
        if (isDuration && typeof nextAnim.userInput.duration === 'undefined') {
          nextAnim.options.duration = op.duration;
          tlDurationChanged.push(i);
        }
      }
    }

    // adjust start time for current mounted animation or the animation that is affected by duration change.
    if (isDuration || isDelay) {
      for (let i = 0; i < timelineAt.length; i++) {
        /** - check if the currently playing animation is affected by duration change. */
        const isMounted = timelineAt[i] === index || tlDurationChanged.includes(timelineAt[i]);
        // if the timeline is not playing ignore it.
        if (!isMounted) continue;
        /** - animation options before the change for targeted timeline. */
        const oldOp = timeline[index].options,
          /** - the duration before the change. */
          oldDuration = Array.isArray(oldOp.duration)
            ? oldOp.duration[i] ?? oldOp.duration[oldOp.duration.length - 1]
            : (oldOp.duration as number),
          /** - the new entered duration. */
          duration = isDuration
            ? Array.isArray(op.duration)
              ? op.duration[i] ?? op.duration[op.duration.length - 1]
              : (op.duration as number)
            : oldDuration,
          /** - the delay before the change. */
          delayOnce = Array.isArray(oldOp.delayOnce) ? oldOp.delayOnce[i] ?? false : oldOp.delayOnce,
          /** - repeat counts before the change. */
          repeat = Array.isArray(oldOp.repeat) ? oldOp.repeat[i] ?? 0 : (oldOp.repeat as number),
          /** - the delay before the change as an array or a number */
          opDelay = timeline[timelineAt[i]].options.delay,
          /** - the new entered delay or the same one. */
          currentDelay = isDelay && timelineAt[i] === index ? op.delay : opDelay,
          /** - the calculated delay before the change.*/
          oldDelay =
            alternateCycle[i] === 2 ||
            (delayOnce && repeatCount[i] < repeat) ||
            (delayOnce && tlRepeatCount[i] < tlOptions.repeat)
              ? 0
              : Array.isArray(opDelay)
              ? opDelay[i] ?? 0
              : (opDelay as number),
          /** - the calculated new delay. */
          delay =
            alternateCycle[i] === 2 ||
            (delayOnce && repeatCount[i] < repeat) ||
            (delayOnce && tlRepeatCount[i] < tlOptions.repeat)
              ? 0
              : Array.isArray(currentDelay)
              ? currentDelay[i] ?? 0
              : (currentDelay as number);

        // re-adjust the start time.
        const p = (performance.now() - (start[i] + oldDelay)) / oldDuration;
        start[i] = performance.now() - duration * p - delay;
        // if the animation is paused, re-adjust the start time.
        if (pausedAt) start[i] = pausedAt - duration * ((pausedAt - (start[i] + oldDelay)) / oldDuration) - delay;
      }
    }

    // update the options.
    timeline[index].options = { ...timeline[index].options, ...op };
    timeline[index].userInput = { ...timeline[index].userInput, ...op };
    // recalculate the progress of the animation.
    if (isDuration || isDelay || isRepeat) excuteDuration = calculateTime();
    // check user input for errors.
    checkInputs(timeline[index].options);
  };

  const getOptions: animareReturnedObject['getOptions'] = (index = 0): animareOptions => {
    if (index > timeline.length - 1)
      throw new Error('\n\n⛔ [animare] ➡️ [getOptions] : first argument `index` is out of range. !!\n\n');
    return timeline[index].options;
  };

  const returned: animareReturnedObject = {
    play,
    reverse,
    pause,
    resume,
    stop,
    next,
    setTimelineOptions,
    onStart,
    onFinish,
    onFinishAsync,
    onProgress,
    onProgressAsync,
    setOptions,
    getOptions,
  };

  if (options.autoPlay) play();

  return returned;
}
