import {
  animareOptions,
  CallbackOptions,
  DIRECTION,
  Ilisteners,
  nextOptions,
  returnedObject,
  timelineOptions,
  TIMELINE_TYPE,
} from './types';

export function animare(options: animareOptions, callback: (values: number[], info: CallbackOptions) => void) {
  if (typeof options !== 'object' || Array.isArray(options)) throw new Error('animare: expects an object as the first argument.');

  options.to = Array.isArray(options.to) ? options.to : [options.to];
  const userInput = { ...options };
  options.from ??= 0;
  options.delay ??= 0;
  options.delayOnce ??= false;
  options.duration ??= 350;
  options.direction ??= DIRECTION.normal;
  options.repeat ??= 0;
  options.ease ??= x => x;
  options.autoPlay ??= true;
  options.type ??= TIMELINE_TYPE.immediate;

  const checkInputs = (options: animareOptions) => {
    if (
      (typeof options.from !== 'number' && !Array.isArray(options.from)) ||
      (Array.isArray(options.from) && options.from.some(e => typeof e !== 'number'))
    )
      throw new Error('animare: [from] must be a number or an array of numbers');

    if (
      (typeof options.to !== 'number' && !Array.isArray(options.to)) ||
      (Array.isArray(options.to) && options.to.some(e => typeof e !== 'number'))
    )
      throw new Error('animare: [to] must be a number or an array of numbers');

    if (
      (typeof options.delay !== 'number' && !Array.isArray(options.delay)) ||
      (Array.isArray(options.delay) && options.delay.some(e => typeof e !== 'number' || e < 0)) ||
      (typeof options.delay === 'number' && options.delay < 0)
    )
      throw new Error('animare: [delay] must be a number or an array of numbers greater than or equal to 0');

    if (
      (typeof options.delayOnce !== 'boolean' && !Array.isArray(options.delayOnce)) ||
      (Array.isArray(options.delayOnce) && options.delayOnce.some(e => typeof e !== 'boolean'))
    )
      throw new Error('animare: [delayOnce] must be a boolean or an array of booleans');

    if (
      (typeof options.duration !== 'number' && !Array.isArray(options.duration)) ||
      (Array.isArray(options.duration) && options.duration.some(e => typeof e !== 'number' || e < 0)) ||
      (typeof options.duration === 'number' && options.duration < 0)
    )
      throw new Error('animare: [duration] must be a number or an array of numbers greater than or equal to 0');

    if (
      (typeof options.direction === 'string' && !Object.keys(DIRECTION).includes(options.direction)) ||
      (Array.isArray(options.direction) &&
        options.direction.some(e => typeof e !== 'string' && !Object.keys(DIRECTION).includes(e)))
    )
      throw new Error(
        'animare: [direction] must be a string or an array of strings and one of the following: ' +
          Object.values(DIRECTION).join(', ')
      );

    if (
      (typeof options.repeat !== 'number' && !Array.isArray(options.repeat)) ||
      (Array.isArray(options.repeat) && options.repeat.some(e => typeof e !== 'number'))
    )
      throw new Error('animare: [repeat] must be a number or an array of numbers');

    if (
      (typeof options.ease !== 'function' && !Array.isArray(options.ease)) ||
      (Array.isArray(options.ease) && options.ease.some(e => typeof e !== 'function'))
    )
      throw new Error('animare: [ease] must be a function or an array of functions');

    if (typeof options.autoPlay !== 'undefined' && typeof options.autoPlay !== 'boolean')
      throw new Error('animare: [autoPlay] must be a boolean');

    if (typeof callback !== 'function') throw new Error('animare: [callback] must be a function');
  };
  checkInputs(options);

  let start: number[] = [], // start time of each animation.
    fpsTimeStamp: number, // used to calulate fps.
    excuteTimeStamp: number, // start time of the excute function.
    excuteDuration: number, // duration of the excute function.
    isFirstFrame: boolean, // is the first frame of the animation
    pausedAt: number | null, // time when the animation was paused.
    isStoped: boolean, // to play one frame only for stop method.
    progresses = [...options.to].fill(0), // progress of each animation.
    isReversePlay = false, // is the animation playing backward?
    resolveAsyncOnFinish: any, // to resolve the promise when the animation is finished.
    resolveAsyncOnProgress: any, // to resolve the promise for onProgressAsync event.
    reqId: number | null, // requestAnimationFrame id used to cancel the animation.
    diff: number | null, //
    timer: number; // timer to detect when the browser is pausing the animation.

  // create initial repeat count from [repeat]
  // if [repeat] is not an array, create an array with the same length as [to]
  let repeatCount = Array.isArray(options.repeat) ? [...options.repeat] : [...options.to].fill(options.repeat as number);

  const alternateCycle = [...options.to].fill(1);

  // finished animations indexes will be stored here.
  const finished = new Set();
  // used to fill the animation value when it's finished and other animations still playing to keep the passed array of values at the same length
  const lastKnownValue = [...options.to];

  const timeline = [
    {
      options: { ...options },
      // cb: callback, // ? you can't change the callback function for now at least.
      userInput, // used to know how to set the default values when the user changes the options using setOptions method.
    },
  ];

  const timelineAt = [...options.to].fill(0);

  let tlOptions = { repeat: 0, speed: 1 }, // ? maybe add more options in the future? like timeline direction.
    tlRepeatCount = [...options.to].fill(tlOptions.repeat); // number of repeats left on the timeline is not set yet.

  const listeners: Ilisteners = {
    onProgress: [], // save progress listeners at, callback, repeatAt, and id.
    onStart: [], // save start listeners callback and id.
    onFinish: [], // save finish listeners callback and id.
  };

  const progressTimeSet = new Set(); // save progress listerners id's or asyncsOnProgress times to prevent multiple calls.

  const startAnim = (timeStamp: number) => {
    start = [...(options.to as number[])].fill(timeStamp);
    excuteTimeStamp = fpsTimeStamp = timeStamp;
    // fire onStart event listeners.
    listeners.onStart.forEach(({ cb }) => cb());
    isFirstFrame = true;
    excute(timeStamp);
    isFirstFrame = false;
  };

  const excute = (now: number) => {
    // correct the timeStamp if the browser is pausing the animation.
    if (diff) {
      const now = performance.now();
      const delta = now - diff;
      start = start.map(s => s + delta);
      excuteTimeStamp = excuteTimeStamp + delta;
      diff = null;
    }

    // to detect when the browser is pausing the animation.
    // ! I'm not sure 60ms is gonna be enough for all browsers.
    clearTimeout(timer);
    timer = setTimeout(() => {
      diff = now;
    }, 60);

    const callbackParams = [];

    for (let i = 0; i < (options.to as number[]).length; i++) {
      // skip finished animation
      if (finished.has(i)) {
        callbackParams.push(lastKnownValue[i]); // put a value until animation starts
        continue;
      }
      // get animation options from the current timeline.
      const op = timeline[timelineAt[i]].options;
      // if [direction] is an array pick the value at the current index , if doesn't exist use `normal`.
      // if [direction] is a single value (string), use that value for all animations.
      const direction = Array.isArray(op.direction) ? op.direction[i] ?? DIRECTION.normal : op.direction;
      // decide if the animation will play backward.
      // if the [direction] is `reversed`, `alternate-reverse` at the first cycle, or `alternate` at the second cycle.
      let isReversed =
        direction === DIRECTION.reverse ||
        (direction === DIRECTION['alternate-reverse'] && alternateCycle[i] === 1) ||
        (direction === DIRECTION.alternate && alternateCycle[i] === 2);
      // reverse timeline play.
      isReversed = isReversePlay ? (direction?.includes(DIRECTION.alternate) ? isReversed : !isReversed) : isReversed;
      // if [repeat] is an array pick the value at the current index , if doesn't exist use 0.
      // if [repeat] is a number, use that value for all animations.
      const repeat = Array.isArray(op.repeat) ? op.repeat[i] ?? 0 : (op.repeat as number);
      // if [delayOnce] is an array pick the value at the current index , if doesn't exist use false.
      // if [delayOnce] is a single value (boolean), use that value for all animations.
      const delayOnce = Array.isArray(op.delayOnce) ? op.delayOnce[i] ?? false : op.delayOnce;
      // if [delay] is an array pick the value at the current index , if doesn't exist use 0.
      // if [delay] is a number, use that value for all animations.
      // if [delayOnce] is true, apply the delay only in the first repeat.
      const delay =
        (alternateCycle[i] === 2 || (delayOnce && repeatCount[i] < repeat!) || (delayOnce && tlRepeatCount[i] < tlOptions.repeat)
          ? 0
          : Array.isArray(op.delay)
          ? op.delay[i] ?? 0
          : op.delay)! * tlOptions.speed;

      // if [duration] is an array pick the value at the current index , if doesn't exist pick the last one.
      // if [duration] is a number, use that value for all animations.
      let duration = Array.isArray(op.duration) ? op.duration[i] ?? op.duration.at(-1) : op.duration;
      // if [direction] is type `alternate` the [duration] will be divided by 2 to match overall duration.
      duration = (direction?.includes(DIRECTION.alternate) ? duration! / 2 : duration)! * tlOptions.speed;
      // if [ease] is an array, pick the value at the current index, if doesn't exist pick the last one.
      // if [ease] a single value (function), use it for all animations.
      const ease = Array.isArray(op.ease) ? op.ease[i] ?? (x => x) : op.ease;
      // if [from] is an array pick the value at the current index , if doesn't exist use 0.
      // if [from] is a number, use that value for all animations.
      // if the animation is reversed then [from] will be replaced with [to].
      const from = isReversed ? (op.to as number[])[i] : Array.isArray(op.from) ? op.from[i] ?? 0 : op.from;
      // if the animation is reversed then [to] will be replaced with [from]
      const to = isReversed ? (Array.isArray(op.from) ? op.from[i] ?? 0 : op.from) : (op.to as number[])[i];

      // wait for delay
      if (now - start[i] - delay < 0) {
        // put a value until animation starts to keep callbackParams at the same length as [to].
        callbackParams.push(from);
        continue;
      }

      // calculate progress and params
      let p = (now - (start[i] + delay)) / duration;
      p = p >= 1 || Number.isNaN(p) ? 1 : p; // correct the progress if it is over 100 percent or the duration is 0.
      const x = from! + (to! - from!) * ease!(p);
      callbackParams.push(x);
      progresses[i] = p;
      if (p === 1) lastKnownValue[i] = x; // save the last known value for the next animation.

      if (now - (start[i] + delay) < duration) continue; // wait for duration

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
          // reset repeat count
          let nextRepeat = timeline[timelineAt[i]].options.repeat;
          nextRepeat = Array.isArray(nextRepeat) ? nextRepeat[i] ?? 0 : nextRepeat;

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
        if (timeline?.at(isReversePlay ? -1 : 0)?.options.type === TIMELINE_TYPE.immediate) {
          if (tlOptions.repeat !== -1) tlRepeatCount[i]--;
          if (tlRepeatCount[i] === -1) tlRepeatCount[i] = -2; // this to trigger [delayOnce] in infinite repeat.

          // reset repeat count.
          const op = timeline.at(isReversePlay ? -1 : 0)!.options;
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
      console.warn(`callbackParams length is not equal to to length.`);

    // * callback info
    // calculate frame per second.
    const fps = isFinite(Math.round(1000 / (now - fpsTimeStamp))) ? Math.round(1000 / (now - fpsTimeStamp)) : 0;
    fpsTimeStamp = now;
    // true only when all animations are finished.
    const isFinished =
      finished.size === (options.to as number[]).length &&
      timelineAt.every(t => (isReversePlay ? t === 0 : t === timeline.length - 1)) &&
      repeatCount.every(x => x === 0) &&
      tlRepeatCount.every(x => x === 0);
    // time passed since the animation started.
    const time = ~~(now - excuteTimeStamp);
    // overall progress including timeline and repeats. -1 if infinite repeat detected.
    const progress = excuteDuration === -1 ? -1 : +(time / excuteDuration > 1 ? 1 : time / excuteDuration).toFixed(3);

    // * callback
    callback(callbackParams as number[], {
      fps,
      isFirstFrame,
      isFinished,
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
        if (progress >= at && !progressTimeSet.has(time)) {
          progressTimeSet.add(time);
          resolve();
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
    if (new Set(timelineAt).size !== 1) console.warn('[timelineAt] array elements are not the same.');

    // * play the next animation in the timeline type `WAIT` only.
    if ((isReversePlay && timelineAt[0] > 0) || (!isReversePlay && timelineAt[0] < timeline.length - 1)) {
      // play only timeline type `wait`.
      const timelineType = timeline[isReversePlay ? timelineAt[0] - 1 : timelineAt[0] + 1].options.type;
      if (timelineType !== TIMELINE_TYPE.wait) return;

      // tell all animations to switch to the next timeline.
      timelineAt.fill(isReversePlay ? timelineAt[0] - 1 : timelineAt[0] + 1);
      // reset repeat count
      const nextRepeat = timeline[timelineAt[0]].options.repeat as number | number[];
      repeatCount = Array.isArray(nextRepeat) ? [...nextRepeat] : [...(options.to as number[])].fill(nextRepeat);

      alternateCycle.fill(1); // reset alternate cycle
      finished.clear(); // reset finished animations.
      start.fill(now); // reset timer.
      reqId = requestAnimationFrame(excute); // start the timeline.
      return;
    }

    // * repeat the timeline only timeline type `wait`
    if ((tlOptions.repeat > 0 && tlRepeatCount[0] > 0) || tlOptions.repeat === -1) {
      const timelineType = timeline.at(isReversePlay ? -1 : 0)!.options.type;
      if (timelineType !== TIMELINE_TYPE.wait) return;
      if (tlOptions.repeat !== -1) tlRepeatCount.fill(tlRepeatCount[0] - 1);
      if (tlRepeatCount[0] === -1) tlRepeatCount.fill(-2); // this to trigger delay once in infinite repeat.

      // reset repeat count.
      const op = timeline.at(isReversePlay ? -1 : 0)!.options;
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
      resolveAsyncOnFinish();
      resolveAsyncOnFinish = null;
    }

    reqId = null;

    finished.clear(); // reset finished animations.
  };

  // caluculate the duration of overall animation with timeline and repeats.
  const calculateTime = () => {
    // ! over complicated it's gonna be an easier way to do this.
    // ! maybe doesn't work if frame rate drops. to be tested.
    // ! if delayOnce is an array this will be wrong.
    let time = 0;

    // if infinite repeat detected return -1.
    const isInfinitive =
      tlOptions.repeat === -1 ||
      timeline.some(x => (Array.isArray(x.options.repeat) ? x.options.repeat.some(r => r === -1) : x.options.repeat === -1));

    if (isInfinitive) {
      time = -1;
      return time;
    }

    /* 

    first calculate the duration of each animation in the timeline with its repeat count considering if delayOnce is true.
    create two arrays of that: with delay and without dela.
    
    then group timelines with type `immediate` together over timeline repaet count,
        then sum the duration of each animation with the next in the same group onsidering if delayOnce is true,
        then take the longest duration of each group.

    then group timeline with type `wait` together over timeline repaet count onsidering if delayOnce is true,
        then take the longest duration of the group

    now we sum the two groups together and we have the total duration of the animation.

    */

    // reverse timeline for reverse play.
    const tl = isReversePlay ? [...timeline].reverse() : timeline;

    // * calculate the duration of each animation in the timeline with its repeat count considering if delayOnce is true.
    // ============ ===============
    // ============= ==============
    //    ^ column      ^ column
    const columns = []; // the length is timeline.length, each array length is animated values length.
    const columnsWithoutDelay = []; // if delayOnce is true the delay added only once.
    for (let t = 0; t < tl.length; t++) {
      const column = [];
      const columnWithoutDelay = [];
      for (let i = 0; i < (options.to as number[]).length; i++) {
        const { options } = tl[t];
        const delay = Array.isArray(options.delay) ? options.delay[i] ?? 0 : (options.delay as number);
        const duration = Array.isArray(options.duration)
          ? options.duration[i] ?? options.duration.at(-1)
          : (options.duration as number);
        const repeat = (Array.isArray(options.repeat) ? options.repeat[i] ?? 0 : (options.repeat as number)) + 1;
        const delayOnce = Array.isArray(options.delayOnce) ? options.delayOnce[i] ?? false : options.delayOnce;
        const withDelay = (delayOnce ? duration * repeat + delay : (delay + duration) * repeat) * tlOptions.speed;
        column.push(withDelay);
        columnWithoutDelay.push(duration * repeat * tlOptions.speed);
      }
      columns.push(column);
      columnsWithoutDelay.push(columnWithoutDelay);
    }

    // * group timelines types over timeline repaet count
    const immediateGroups: [number, boolean][][] = []; // group timeline with type `immediate` together.
    const waitGroups = []; // group timeline type `wait` longest duration together
    for (let i = 0; i < tlOptions.repeat + 1; i++) {
      for (let t = 0; t < tl.length; t++) {
        const next = t + 1 >= tl.length ? 0 : t + 1;
        const isLastIteration = i === tlOptions.repeat && t === tl.length - 1;
        const op = tl[next];
        // for immediate
        if (op.options.type === TIMELINE_TYPE.immediate) {
          const delayOnce = tl[t].options.delayOnce;
          const nextDelayOnce = tl[next].options.delayOnce;
          const firstDelayOnce = tl[0].options.delayOnce;
          const isDelayOnce = i > 0 && (Array.isArray(delayOnce) ? delayOnce[0] : (delayOnce as boolean)); // if the timeline repeating and the delayOnce is true.
          const isNextDelayOnce =
            (t + 1 >= tl.length && (Array.isArray(firstDelayOnce) ? firstDelayOnce[0] : (firstDelayOnce as boolean))) ||
            (i > 0 && (Array.isArray(nextDelayOnce) ? nextDelayOnce[0] : (nextDelayOnce as boolean)));
          const putNext = isLastIteration && t + 1 < tl.length ? true : !isLastIteration; // if the timeline is the last iteration put the next timeline or not.

          // put next with the last group if after each other.
          if (immediateGroups?.at(-1)?.at(-1)?.[0] === t) {
            if (putNext) immediateGroups.at(-1)?.push([next, isNextDelayOnce]);
            // create new group
          } else if (putNext) {
            immediateGroups.push([
              [t, isDelayOnce],
              [next, isNextDelayOnce],
            ]);
            // put single value if last iteration.
          } else {
            immediateGroups.push([[t, isDelayOnce]]);
          }
        }

        // for wait
        const isNextWait = tl[next].options.type === TIMELINE_TYPE.wait;
        const isCurrentWait = tl[t].options.type === TIMELINE_TYPE.wait || (i === 0 && t === 0); // treat first animation at first play as wait.
        if (isCurrentWait && isNextWait) {
          const cl = i > 0 && tl[t].options.delayOnce ? columnsWithoutDelay[t] : columns[t];
          waitGroups.push(Math.max(...cl));
        }
      }
    }

    // * sum animations in each group of type `immediate` together.
    const mixed = []; // array of the max value of sum of each group.
    for (let i = 0; i < immediateGroups.length; i++) {
      const group = immediateGroups[i];
      let last = null;
      for (let g = 0; g < group.length; g = g + 2) {
        const a = group[g][0]; // timeline index
        const b = group[g + 1]?.[0]; // next timeline index
        const columnA = group[g][1] ? columnsWithoutDelay : columns;
        const columnB = group[g + 1]?.[1] ? columnsWithoutDelay : columns;
        const ab = b !== undefined ? columnA[a].map((num, i) => num + columnB[b][i]) : columnA[a];
        last = last ? last.map((num, i) => num + ab[i]) : ab;
      }
      mixed.push(Math.max(...last!));
    }

    // * sum the two groups together.
    const overall = [...mixed, ...waitGroups].reduce((a, b) => a + b);

    time = overall;
    time += 25 * tlOptions.repeat; // add some buffer.

    return time;
  };

  const reset = (reverse: boolean) => {
    // cancel the animation if it is already running.
    if (reqId) cancelAnimationFrame(reqId);
    // reset repeat count.
    const op = timeline.at(reverse ? -1 : 0)!.options;
    repeatCount = Array.isArray(op.repeat) ? [...op.repeat] : [...(op.to as number[])].fill(op.repeat as number);

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
    diff = null;
  };

  const play = () => {
    reset(false);
    // play forward.
    isReversePlay = false;
    timelineAt.fill(0);

    // start the animation.
    excuteDuration = calculateTime();
    reqId = requestAnimationFrame(startAnim);
  };

  const reverse = () => {
    reset(true);
    // reverse the direction.
    isReversePlay = true;
    timelineAt.fill(timeline.length - 1);
    // start the animation.
    excuteDuration = calculateTime();
    reqId = requestAnimationFrame(startAnim);
  };

  const pause = () => {
    if (reqId) cancelAnimationFrame(reqId);
    pausedAt = performance.now();
  };

  const resume = () => {
    if (pausedAt) {
      const now = performance.now();
      const delta = now - pausedAt;
      start = start.map(s => s + delta);
      excuteTimeStamp = excuteTimeStamp + delta;
      pausedAt = null;
      diff = null;
      isStoped = false;
      reqId = requestAnimationFrame(excute);
      return;
    }
    // if the animation is not paused, play it.
    play();
  };

  const stop = (stopAtStart = true) => {
    stopAtStart ? play() : reverse();
    isStoped = true;
    reqId = null;
  };

  const next = (op: nextOptions) => {
    if (typeof op !== 'object') throw new Error('animare: next() expects an object as the first argument.');
    if ((!Array.isArray(op.to) && typeof op.to !== 'number') || (Array.isArray(op.to) && op.to.some(t => typeof t !== 'number')))
      throw new Error('animare: next() [to] must be a number or an array of numbers.');

    op.to = Array.isArray(op.to) ? op.to : [op.to];

    const userInput = { ...op };

    const previousTimeline = { ...timeline.at(-1) };

    if ((previousTimeline.options!.to as number[]).length !== op.to.length)
      throw new Error('animare: next() [to] must have the same length as the previous animation.');

    // * inherit options from previous animation if not specified.
    // if from is not specified, use the last known value based on the direction from the previous animation.
    if (typeof op.from === 'undefined') {
      // case previous animation direction is an array.
      if (Array.isArray(previousTimeline.options!.direction)) {
        const from = [];
        for (let i = 0; i < (options.to as number[]).length; i++) {
          const prevDirection = previousTimeline.options!.direction[i] ?? DIRECTION.normal;
          const isPrevReverse = prevDirection === DIRECTION.reverse;
          const isPrevAlternate = prevDirection === DIRECTION.alternate;
          const prevFrom = Array.isArray(previousTimeline.options!.from)
            ? previousTimeline.options!.from[i] ?? 0
            : (previousTimeline.options!.from as number);
          from[i] = isPrevAlternate || isPrevReverse ? prevFrom : (previousTimeline.options!.to as number[])[0];
        }
        op.from = from;
        // case previous animation direction is a single value (string).
      } else {
        const prevDirection = previousTimeline.options!.direction;
        const isPrevReverse = prevDirection === DIRECTION.reverse;
        const isPrevAlternate = prevDirection === DIRECTION.alternate;
        op.from ??= isPrevAlternate || isPrevReverse ? previousTimeline.options!.from : previousTimeline.options!.to;
      }
    }
    op.duration ??= previousTimeline.options!.duration;
    op.ease ??= previousTimeline.options!.ease;
    op.type ??= previousTimeline.options!.type;

    // * set to default if not specified.
    op.repeat ??= [...op.to].fill(0);
    op.direction ??= DIRECTION.normal;
    op.delay ??= 0;
    op.delayOnce ??= false;

    // check user input.
    checkInputs(op);

    // check if the next animation in the timeline is reachable.
    if (timeline.some(t => (Array.isArray(t.options.repeat) ? t.options.repeat.some(r => r === -1) : t.options.repeat === -1)))
      console.warn('animare: next() Some animations are blocked by infinite repeat.');

    timeline.push({ options: op, userInput });

    return returned;
  };

  const setTimelineOptions = (op: timelineOptions) => {
    if (typeof op !== 'object') throw new Error('animare: setTimelineOptions() expects an object as the first argument.');
    if (op.repeat && typeof op.repeat !== 'number') throw new Error('animare: setTimelineOptions() [repeat] must be a number.');
    tlOptions = { ...tlOptions, ...op };
    tlRepeatCount = [...(options.to as number[])].fill(tlOptions.repeat);
    if (reqId) excuteDuration = calculateTime();
  };

  const onStart = (cb: Function): Function => {
    if (typeof cb !== 'function') throw new Error('[onStart] param must be a callback function');

    const id = `onStart_${Math.random() * 100}`;
    listeners.onStart.push({ cb, id });

    // return a function to remove the listener.
    return () => {
      listeners.onStart = listeners.onStart.filter(listener => listener.id !== id);
    };
  };

  const onFinish = (cb: Function): Function => {
    if (typeof cb !== 'function') throw new Error('animare: [onFinish] accept a callback function only');

    const id = `onFinish_${Math.random()}`;
    listeners.onFinish.push({ cb, id });

    // return a function to remove the listener.
    return () => {
      listeners.onFinish = listeners.onFinish.filter(listener => listener.id !== id);
    };
  };

  const onFinishAsync = () => {
    if (resolveAsyncOnFinish) return;
    return new Promise(resolve => {
      resolveAsyncOnFinish = resolve;
    });
  };

  const onProgress = (at: number, cb: Function): Function => {
    if (typeof at !== 'number') throw new Error('animare: [onProgress] accept a number as the first argument.');
    if (at < 0 || at > 1) throw new Error('animare: [onProgress] [at] must be between 0 and 1');
    if (typeof cb !== 'function') throw new Error('animare: [onFinish] accept a callback function only');

    const id = `onProgress_${Math.random()}`;
    listeners.onProgress.push({ at, cb, id });

    // return a function to remove the listener.
    return () => {
      listeners.onProgress = listeners.onProgress.filter(listener => listener.id !== id);
    };
  };

  const onProgressAsync = (at: number) => {
    if (typeof at !== 'number') throw new Error('animare: [onProgress] accept a number as the first argument.');
    if (at < 0 || at > 1) throw new Error('animare: [onProgress] first argument must be a number between 0 and 1');

    if (resolveAsyncOnProgress) return;

    return new Promise(resolve => {
      resolveAsyncOnProgress = { at, resolve };
    });
  };

  const setOptions = (op: animareOptions, index = 0) => {
    if (typeof op !== 'object' || Array.isArray(op))
      throw new Error('animare: setOptions() expects an object as the first argument.');
    if (typeof index !== 'number') throw new Error('animare: setOptions() expects a number as the second argument.');
    if (index < 0 || index >= timeline.length) throw new Error('animare: setOptions() [index] is out of range.');

    const isTo = op.to !== undefined; // is [to] entered.
    const isDuration = op.duration !== undefined; // is [duration] entered.
    const isDelay = op.delay !== undefined; // is [delay] entered.
    const isRepeat = op.repeat !== undefined; // is [repeat] entered.
    const nextTl = timeline?.[index + 1]; // the next timeLine that come after index.
    const tlDurationChanged = []; // timeline index that affected by duration change.
    if (isTo) op.to = Array.isArray(op.to) ? op.to : [op.to];

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
        // check if the currently playing animation is affected by duration change.
        const isMounted = timelineAt[i] === index || tlDurationChanged.includes(timelineAt[i]);
        const OldOp = timeline[index].options; // animation options before the change for targeted timeline.
        const oldDuration = Array.isArray(OldOp.duration)
          ? OldOp.duration[i] ?? OldOp.duration.at(-1)
          : (OldOp.duration as number); // duration before the change.
        const duration = isDuration
          ? Array.isArray(op.duration)
            ? op.duration[i] ?? op.duration.at(-1)
            : (op.duration as number)
          : oldDuration; // new entered duration.
        const delayOnce = Array.isArray(OldOp.delayOnce) ? OldOp.delayOnce[i] ?? false : OldOp.delayOnce;
        const repeat = Array.isArray(OldOp.repeat) ? OldOp.repeat[i] ?? 0 : (OldOp.repeat as number);
        const opDelay = timeline[timelineAt[i]].options.delay;
        const currentDelay = isDelay && timelineAt[i] === index ? op.delay : opDelay;
        const oldDelay =
          alternateCycle[i] === 2 || (delayOnce && repeatCount[i] < repeat) || (delayOnce && tlRepeatCount[i] < tlOptions.repeat)
            ? 0
            : Array.isArray(opDelay)
            ? opDelay[i] ?? 0
            : (opDelay as number);
        const delay =
          alternateCycle[i] === 2 || (delayOnce && repeatCount[i] < repeat) || (delayOnce && tlRepeatCount[i] < tlOptions.repeat)
            ? 0
            : Array.isArray(currentDelay)
            ? currentDelay[i] ?? 0
            : (currentDelay as number);
        // readjust the start time.
        if (isMounted) {
          const p = (performance.now() - (start[i] + oldDelay)) / oldDuration;
          start[i] = performance.now() - duration * p - delay;
          // if the animation is paused, readjust the start time.
          if (pausedAt) start[i] = pausedAt - duration * ((pausedAt - (start[i] + oldDelay)) / oldDuration) - delay;
        }
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

  const getOptions = (index = 0): animareOptions => {
    if (index > timeline.length - 1) throw new Error('animare: getOptions() index out of range.');
    return timeline[index].options;
  };

  const returned: returnedObject = {
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
