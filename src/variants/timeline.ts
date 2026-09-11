import { Event } from '../types.js';
import EventManager from '../utils/EventManager.js';
import {
  calculateTimeline,
  calculateTimelineDuration,
  prepareAnimationsPartialOptions,
  prepareAnimationsValues,
  prepareTimelineValues,
} from '../utils/helpers.js';
import { clamp, normalizePercentage, percentageStringToNumber } from '../utils/utilities.js';

import type {
  AnimationOptions,
  AnimationOptionsParameter,
  CallbackInfo,
  OnUpdateCallback,
  PartialExcept,
  PercentageString,
  PrivateTimelineInfo,
  TimelineGlobalOptions,
  TimelineInfo,
  TimelineObject,
  TimelineOptions,
} from '../types.js';

export default function timeline<Name extends string>(
  animations: AnimationOptionsParameter<Name>,
  callback: OnUpdateCallback<AnimationOptionsParameter<Name>>,
  globalValues: TimelineGlobalOptions = {}
): TimelineObject<Name> {
  const timelineOptions = prepareTimelineValues(globalValues);
  const preparedValues = prepareAnimationsValues(animations, globalValues);

  const eventManager = new EventManager();

  const calculatedAnimations = calculateTimeline(preparedValues);

  const timelineInfo: TimelineInfo & PrivateTimelineInfo = {
    __startTime: 0,
    __pauseTime: 0,
    __lastFrameTime: 0,
    __animations: calculatedAnimations,
    __requestAnimationId: null,
    __startProgress: 0,

    progress: 0,
    duration: calculateTimelineDuration(calculatedAnimations),
    elapsedTime: 0,
    speed: timelineOptions.timelineSpeed,

    isPlaying: false,
    isPaused: false,
    isFinished: false,
    isFirstFrame: true,

    playCount: 1,
    fps: 60,

    isProgressAt(progress: number, tolerance = 0.001): boolean {
      return Math.abs(this.progress - progress) < tolerance;
    },
    isTimeAt(time: number, tolerance = 5): boolean {
      return Math.abs(this.elapsedTime - time) < tolerance;
    },
  };

  /** Syncs the frame time to account for browser behavior that may pause animations in inactive tabs. */
  const visibilitychange = {
    isRegistered: false,
    hiddenTime: 0,
    add: () => {
      if (visibilitychange.isRegistered) return;
      document.addEventListener('visibilitychange', visibilitychange.handle);
      visibilitychange.isRegistered = true;

      // registered while the tab is already hidden, count the hidden time from now on
      if (document.visibilityState === 'hidden') visibilitychange.hiddenTime = performance.now();
    },
    remove: () => {
      document.removeEventListener('visibilitychange', visibilitychange.handle);
      visibilitychange.isRegistered = false;
    },
    handle: () => {
      if (document.visibilityState === 'hidden') {
        visibilitychange.hiddenTime = performance.now();
        return;
      }

      if (document.visibilityState === 'visible') {
        timelineInfo.__startTime += (performance.now() - visibilitychange.hiddenTime) * timelineInfo.speed;
        visibilitychange.hiddenTime = 0;
      }
    },
  };

  const callbackAnimationInfo = Object.create(null) as CallbackInfo<Name>;
  callbackAnimationInfo.length = animations.length;

  // fill `callbackAnimationInfo` with initial values
  for (let index = 0; index < timelineInfo.__animations.length; index++) {
    const info = timelineInfo.__animations[index].info as CallbackInfo<Name>[Name];
    callbackAnimationInfo[info.name] = info;
    callbackAnimationInfo[info.index] = info;
  }

  const notify = () => {
    callback(callbackAnimationInfo, timelineInfo);
    timelineInfo.isFirstFrame = false;
  };

  const executePerFrame = (now: number, isOneFrame?: boolean) => {
    now *= timelineInfo.speed;

    timelineInfo.elapsedTime = now - timelineInfo.__startTime + timelineInfo.__startProgress * timelineInfo.duration; // Time passed since the start
    timelineInfo.progress =
      timelineInfo.duration === 0 ? 1 : normalizePercentage(timelineInfo.elapsedTime / timelineInfo.duration);

    timelineInfo.fps = Math.round((1000 / (now - timelineInfo.__lastFrameTime)) * timelineInfo.speed);
    if (!Number.isFinite(timelineInfo.fps)) timelineInfo.fps = 60;

    timelineInfo.__lastFrameTime = now;

    for (let index = 0; index < timelineInfo.__animations.length; index++) {
      const animation = timelineInfo.__animations[index];

      animation.Update(timelineInfo.elapsedTime);
      const info = animation.info as CallbackInfo<Name>[Name];

      callbackAnimationInfo[info.name] = info;
      callbackAnimationInfo[info.index] = info;
    }

    // didn't reach the end? -> continue
    if (timelineInfo.progress !== 1) {
      notify();
      if (isOneFrame) return; // stop. we play only one frame
      timelineInfo.__requestAnimationId = requestAnimationFrame(executePerFrame);
      return;
    }

    // reached the end what to do next?

    // finished? -> stop
    if (timelineInfo.playCount === timelineOptions.timelinePlayCount) {
      timelineInfo.isFinished = true;
      timelineInfo.isPlaying = false;
      visibilitychange.remove();
      notify();
      eventManager.emit(Event.Complete);
      timelineInfo.__requestAnimationId = null;
      return;
    }

    if (isOneFrame) return; // stop. we play only one frame

    // repeat? -> restart
    notify();
    eventManager.emit(Event.Repeat);

    timelineInfo.__requestAnimationId = requestAnimationFrame(next => {
      timelineInfo.__startTime = next * timelineInfo.speed;
      timelineInfo.__lastFrameTime = next * timelineInfo.speed;
      timelineInfo.playCount++;
      timelineInfo.__startProgress = 0;

      executePerFrame(next);
    });
  };

  const seek = (seekTo: number | PercentageString, playCount: number = timelineInfo.playCount) => {
    // disabled timeline
    if (playCount === 0 || timelineOptions.timelinePlayCount === 0) {
      console.warn('[seek] Cannot seek the timeline because the `playCount` is set to 0.');
      return;
    }

    if (timelineOptions.timelinePlayCount > 0 && playCount > timelineOptions.timelinePlayCount) {
      console.warn('[seek] Cannot seek the timeline because the param `playCount` is greater than the `timelinePlayCount`.');
      return;
    }

    // timeline duration is 0
    if (timelineInfo.duration === 0) {
      console.warn('[seek] Cannot seek the timeline because the `duration` is 0.');
      return;
    }

    // startFrom is a time
    if (typeof seekTo === 'number') {
      if (seekTo < 0) {
        seekTo = 0;
        console.warn('[seek] The `startFrom` param cannot be a negative value.');
      }

      if (seekTo > timelineInfo.duration) {
        seekTo = timelineInfo.duration;
        console.warn('[seek] The `startFrom` param cannot be greater than the duration of the timeline.');
      }

      // time to percentage
      seekTo = clamp(seekTo / timelineInfo.duration, 0, 1);
    }

    // string percentage to percentage number
    if (typeof seekTo === 'string') {
      seekTo = percentageStringToNumber(seekTo);

      if (seekTo < 0) {
        seekTo = 0;
        console.warn('[seek] The `startFrom` param cannot be a negative percentage.');
      }

      if (seekTo > 1) {
        seekTo = 1;
        console.warn('[seek] The `startFrom` param percentage cannot be greater than 1.');
      }
    }

    if (timelineInfo.isPlaying) {
      const now = performance.now() * timelineInfo.speed;
      timelineInfo.__startTime = now;
      timelineInfo.__lastFrameTime = now;
    }

    // while paused the start time is anchored to the pause moment, so `resume` lands on the seek point
    if (timelineInfo.isPaused) {
      timelineInfo.__startTime = timelineInfo.__pauseTime * timelineInfo.speed;
    }

    timelineInfo.playCount = playCount;
    timelineInfo.__startProgress = seekTo;
  };

  const play = (startFrom: number | PercentageString = 0, playCount: number = 1) => {
    if (timelineOptions.timelinePlayCount === 0) {
      console.warn('[play] Cannot play the timeline because the `timelinePlayCount` is set to 0.');
      return;
    }

    // a frame is already scheduled (playing, or a previous `play` that has not rendered yet)? -> cancel it
    if (timelineInfo.__requestAnimationId !== null) {
      cancelAnimationFrame(timelineInfo.__requestAnimationId);
      timelineInfo.__requestAnimationId = null;
    }

    // reset all animations
    for (let index = 0; index < callbackAnimationInfo.length; index++) {
      timelineInfo.__animations[index].Setup();
    }

    seek(startFrom, playCount); // sets the start progress and play count

    // the state is set right away, so `pause` and `stop` work before the first frame renders
    const now = performance.now() * timelineInfo.speed;
    timelineInfo.__startTime = now;
    timelineInfo.__lastFrameTime = now;
    timelineInfo.__pauseTime = 0;
    timelineInfo.progress = timelineInfo.__startProgress;

    timelineInfo.isPlaying = timelineInfo.progress !== 1;
    timelineInfo.isFinished = timelineInfo.progress === 1;
    timelineInfo.isPaused = false;
    timelineInfo.isFirstFrame = true;

    visibilitychange.add(); // add if not already added

    timelineInfo.__requestAnimationId = requestAnimationFrame(frameTime => {
      // the first frame lands exactly on the start point
      timelineInfo.__startTime = frameTime * timelineInfo.speed;
      timelineInfo.__lastFrameTime = frameTime * timelineInfo.speed;

      eventManager.emit(Event.Play);

      executePerFrame(frameTime);
    });
  };

  const playOneFrame = () => {
    if (timelineInfo.isPlaying) {
      console.warn('[playOneFrame] The timeline is already playing.');
      return;
    }

    // while paused, keep the frame time at the pause moment so `resume` continues from the same position
    const now = timelineInfo.isPaused ? timelineInfo.__pauseTime : performance.now();
    timelineInfo.__startTime = now * timelineInfo.speed;
    timelineInfo.__lastFrameTime = now * timelineInfo.speed;
    timelineInfo.progress = timelineInfo.__startProgress;

    timelineInfo.isFinished = timelineInfo.progress === 1;
    timelineInfo.isFirstFrame = false;

    executePerFrame(now, true);
  };

  const pause = () => {
    if (!timelineInfo.isPlaying) {
      console.warn('[pause] The timeline is not playing.');
      return;
    }

    if (timelineInfo.isPaused) {
      console.warn('[pause] The timeline is already paused.');
      return;
    }

    if (!timelineInfo.__requestAnimationId) {
      console.error('[pause] `__requestAnimationId` is null.');
      return;
    }

    cancelAnimationFrame(timelineInfo.__requestAnimationId);
    timelineInfo.__requestAnimationId = null;

    // freeze the position: while paused the start time is anchored to the pause moment
    timelineInfo.__pauseTime = performance.now();
    timelineInfo.__startTime = timelineInfo.__pauseTime * timelineInfo.speed;
    timelineInfo.__startProgress = timelineInfo.progress;

    timelineInfo.isPaused = true;
    timelineInfo.isPlaying = false;
    visibilitychange.remove();
    eventManager.emit(Event.Pause);
  };

  const resume = () => {
    if (timelineInfo.isPlaying) {
      console.warn('[resume] The timeline is already playing.');
      return;
    }

    if (!timelineInfo.isPaused) {
      console.warn('[resume] The timeline is not paused, playing from the start.');
      play();
      return;
    }

    timelineInfo.__startTime += (performance.now() - timelineInfo.__pauseTime) * timelineInfo.speed;
    timelineInfo.__pauseTime = 0;
    timelineInfo.isPaused = false;
    timelineInfo.isPlaying = true;
    visibilitychange.add();
    eventManager.emit(Event.Resume);
    timelineInfo.__requestAnimationId = requestAnimationFrame(executePerFrame);
  };

  const stop = (
    stopAt: number | PercentageString = timelineInfo.duration,
    playCount: number = timelineOptions.timelinePlayCount
  ) => {
    // timeline is already playing? -> cancel
    if (timelineInfo.__requestAnimationId !== null) {
      cancelAnimationFrame(timelineInfo.__requestAnimationId);
      timelineInfo.__requestAnimationId = null;
    }

    timelineInfo.isPlaying = false;
    timelineInfo.isPaused = false;
    timelineInfo.__pauseTime = 0;
    visibilitychange.remove();

    seek(stopAt, playCount);

    playOneFrame();

    eventManager.emit(Event.Stop);
  };

  const updateValues = (newValues: PartialExcept<AnimationOptions<Name>, 'name'>[]) => {
    for (const newValuesItem of newValues) {
      if (!newValuesItem.name) throw new Error('[updateValues] Animation name is required.');

      const animIndex = timelineInfo.__animations.findIndex(a => a.animationRef.name === newValuesItem.name);
      if (animIndex === -1) throw new Error(`[updateValues] Animation with name '${newValuesItem.name}' not found.`);

      const prepared = prepareAnimationsPartialOptions<Name>(newValuesItem, animIndex);
      timelineInfo.__animations[animIndex].Set(prepared);
    }

    for (let index = 0; index < callbackAnimationInfo.length; index++) {
      timelineInfo.__animations[index].Setup();
    }

    const currentProgress = timelineInfo.progress;
    timelineInfo.duration = calculateTimelineDuration(timelineInfo.__animations);

    // keep the relative position if the duration was changed
    if (timelineInfo.isPlaying || timelineInfo.isPaused) seek(timelineInfo.duration * currentProgress);
  };

  const updateTimelineOptions = (newOptions: Partial<TimelineOptions>) => {
    if (newOptions.timelinePlayCount === 0) {
      console.warn('The `timelinePlayCount` with the value `0` will make the timeline not play.');
    }

    if (typeof newOptions.timelineSpeed === 'number' && newOptions.timelineSpeed <= 0) {
      throw new Error('The `timelineSpeed` value cannot be a negative value or a zero.');
    }

    Object.assign(timelineOptions, newOptions);

    const currentProgress = timelineInfo.progress;
    timelineInfo.speed = timelineOptions.timelineSpeed;

    // the start time is stored in speed-scaled units, re-anchor it for the new speed
    if (timelineInfo.isPlaying || timelineInfo.isPaused) seek(currentProgress * timelineInfo.duration);
  };

  if (timelineOptions.autoPlay) play();

  const returnObject: TimelineObject<Name> = {
    timelineInfo,
    animationsInfo: callbackAnimationInfo,
    updateValues,
    updateTimelineOptions,
    play,
    playOneFrame,
    resume,
    pause,
    stop,
    seek,
    on: eventManager.on.bind(eventManager),
    once: eventManager.once.bind(eventManager),
    onCompleteAsync: eventManager.onCompleteAsync.bind(eventManager),
    onPlayAsync: eventManager.onPlayAsync.bind(eventManager),
    onResumeAsync: eventManager.onResumeAsync.bind(eventManager),
    onPauseAsync: eventManager.onPauseAsync.bind(eventManager),
    onStopAsync: eventManager.onStopAsync.bind(eventManager),
    onRepeatAsync: eventManager.onRepeatAsync.bind(eventManager),
    clearEvents: eventManager.clear.bind(eventManager),
  };

  return returnObject;
}
