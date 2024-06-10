import { Event } from './types';
import EventManager from './utils/EventManager';
import { calculateTimeline, calculateTimelineDuration, prepareAnimationsValues, prepareTimelineValues } from './utils/helpers';
import { clamp, normalizePercentage, percentageStringToNumber } from './utils/utils';

import type {
  AnimationGlobalValues,
  AnimationValues,
  AnimationValuesParam,
  CallbackInfo,
  PercentageString,
  PrivateTimelineInfo,
  ReturnObj,
  TimelineInfo,
} from './types';
import type { Group } from './variants/group';
import type { Loop } from './variants/loop';
import type { Single } from './variants/single';

export function animare<Name extends string>(
  animations: AnimationValuesParam<Name>,
  callback: (info: CallbackInfo<Name>, timelineInfo: TimelineInfo) => void,
  globalValues: AnimationGlobalValues = {},
): ReturnObj<Name> {
  const timelineOptions = prepareTimelineValues(globalValues);
  const preparedValues = prepareAnimationsValues(animations, globalValues);

  const eventManager = new EventManager();

  const timelineInfo: TimelineInfo & PrivateTimelineInfo = {
    __startTime: 0,
    __pauseTime: 0,
    __lastFrameTime: 0,
    __animations: [],
    __requestAnimationId: null,
    __startProgress: 0,

    progress: 0,
    duration: 0,
    elapsedTime: 0,

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

  // calculate timeline
  timelineInfo.__animations = calculateTimeline(preparedValues);
  timelineInfo.duration = calculateTimelineDuration(timelineInfo.__animations);

  /**
   * Syncs the frame time to account for browser behavior that may pause animations in inactive tabs.
   */
  const visibilitychange = {
    isRegistered: false,
    hiddenTime: 0,
    add() {
      if (this.isRegistered) return;
      document.addEventListener('visibilitychange', this.handle, false);
      this.isRegistered = true;
    },
    remove() {
      document.removeEventListener('visibilitychange', this.handle, false);
      this.isRegistered = false;
    },
    handle() {
      if (document.visibilityState === 'hidden') {
        this.hiddenTime = performance.now();
        return;
      }

      if (document.visibilityState === 'visible') {
        timelineInfo.__startTime += performance.now() - this.hiddenTime;
        this.hiddenTime = 0;
      }
    },
  };

  const callbackAnimationInfo: CallbackInfo<Name> = Object.create(null);
  callbackAnimationInfo.length = animations.length;

  const executePerFrame = (now: number, oneFrame?: boolean) => {
    timelineInfo.elapsedTime = now - timelineInfo.__startTime + timelineInfo.__startProgress * timelineInfo.duration; // Time passed since the start
    timelineInfo.progress = normalizePercentage(timelineInfo.elapsedTime / timelineInfo.duration);
    timelineInfo.fps = Math.round(1000 / (now - timelineInfo.__lastFrameTime || 16.66));
    timelineInfo.__lastFrameTime = now;

    for (let i = 0; i < timelineInfo.__animations.length; i++) {
      const animation = timelineInfo.__animations[i];

      animation.Update(timelineInfo.elapsedTime);
      const info = animation.info as CallbackInfo<Name>[Name];

      callbackAnimationInfo[info.name] = info;
      callbackAnimationInfo[info.index] = info;
    }

    // didn't reach the end? -> continue
    if (timelineInfo.progress !== 1) {
      callback(callbackAnimationInfo, timelineInfo);
      if (oneFrame) return; // stop. we play only one frame
      timelineInfo.__requestAnimationId = requestAnimationFrame(executePerFrame);
      return;
    }

    // reached the end what to do next?

    // finished? -> stop
    if (timelineInfo.playCount === timelineOptions.timelinePlayCount) {
      timelineInfo.isFinished = true;
      timelineInfo.isPlaying = false;
      visibilitychange.remove();
      callback(callbackAnimationInfo, timelineInfo);
      eventManager.emit(Event.Complete);
      timelineInfo.__requestAnimationId = null;
      return;
    }

    if (oneFrame) return; // stop. we play only one frame

    // repeat? -> restart
    timelineInfo.playCount++;
    timelineInfo.__startTime = now;
    timelineInfo.__startProgress = 0;
    callback(callbackAnimationInfo, timelineInfo);
    eventManager.emit(Event.Repeat);
    timelineInfo.__requestAnimationId = requestAnimationFrame(executePerFrame);
  };

  const seek = (seekTo: number | PercentageString, playCount: number = 1) => {
    // disabled timeline
    if (timelineOptions.timelinePlayCount === 0 || playCount === 0) {
      console.warn('[seek] Cannot seek the timeline because the `playCount` is set to 0.');
      return;
    }

    if (timelineOptions.timelinePlayCount > 0 && typeof playCount === 'number' && playCount > timelineOptions.timelinePlayCount) {
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
      const now = performance.now();
      timelineInfo.__startTime = now;
      timelineInfo.__lastFrameTime = now;
    }

    timelineInfo.playCount = playCount;
    timelineInfo.__startProgress = seekTo;
  };

  const play = (startFrom: number | PercentageString = 0, playCount: number = 1) => {
    // timeline is already playing? -> reset
    if (timelineInfo.isPlaying && timelineInfo.__requestAnimationId !== null) {
      cancelAnimationFrame(timelineInfo.__requestAnimationId);
      timelineInfo.__requestAnimationId = null;
    }

    seek(startFrom, playCount); // sets the start progress and play count

    timelineInfo.__requestAnimationId = requestAnimationFrame(now => {
      timelineInfo.__startTime = now;
      timelineInfo.__lastFrameTime = now;
      timelineInfo.progress = timelineInfo.__startProgress;

      timelineInfo.isPlaying = timelineInfo.progress !== 1;
      timelineInfo.isFinished = timelineInfo.progress === 1;
      timelineInfo.isPaused = false;
      timelineInfo.isFirstFrame = true;

      visibilitychange.add(); // add if not already added

      eventManager.emit(Event.Play);

      executePerFrame(now);

      timelineInfo.isFirstFrame = false;
    });
  };

  const playOneFrame = () => {
    // timeline is already playing? -> reset
    if (timelineInfo.isPlaying && timelineInfo.__requestAnimationId !== null) {
      console.warn('[playOneFrame] The timeline is already playing.');
      return;
    }

    const now = performance.now();
    timelineInfo.__startTime = now;
    timelineInfo.__lastFrameTime = now;
    timelineInfo.progress = timelineInfo.__startProgress;

    timelineInfo.isPlaying = false;
    timelineInfo.isFinished = timelineInfo.progress === 1;
    timelineInfo.isPaused = false;
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
    timelineInfo.__pauseTime = performance.now();
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

    timelineInfo.__startTime += performance.now() - timelineInfo.__pauseTime;
    timelineInfo.__pauseTime = 0;
    timelineInfo.isPaused = false;
    timelineInfo.isPlaying = true;
    visibilitychange.add();
    eventManager.emit(Event.Resume);
    timelineInfo.__requestAnimationId = requestAnimationFrame(executePerFrame);
  };

  const stop = (
    stopAt: number | PercentageString = timelineInfo.duration,
    playCount: number = timelineOptions.timelinePlayCount,
  ) => {
    // timeline is already playing? -> cancel
    if (timelineInfo.isPlaying && timelineInfo.__requestAnimationId !== null) {
      cancelAnimationFrame(timelineInfo.__requestAnimationId);
      timelineInfo.__requestAnimationId = null;
      timelineInfo.isPlaying = false;
    }

    seek(stopAt, playCount);

    playOneFrame();

    eventManager.emit(Event.Stop);
  };

  const updateValues = (newValues: Partial<AnimationValues<Name>>[]) => {
    for (let i = 0; i < newValues.length; i++) {
      const newValuesItem = newValues[i];
      if (!newValuesItem.name) throw new Error('[updateValues] Animation name is required.');

      const anim = timelineInfo.__animations.find(a => a.animationRef.name === newValuesItem.name);
      if (!anim) throw new Error(`[updateValues] Animation with name '${newValuesItem.name}' not found.`);

      anim.Set(newValuesItem);
    }

    for (let i = 0; i < callbackAnimationInfo.length; i++) timelineInfo.__animations[i].Setup();

    timelineInfo.duration = calculateTimelineDuration(timelineInfo.__animations);
  };

  if (timelineOptions.autoPlay) play();

  const returnObj: ReturnObj<Name> = {
    timelineInfo,
    animationsInfo: callbackAnimationInfo,
    updateValues,
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

  return returnObj;
}

animare.group = null as unknown as Group;
animare.loop = null as unknown as Loop;
animare.single = null as unknown as Single;
