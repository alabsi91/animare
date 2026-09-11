import type { AutoPauseOptions, GroupTimelineObject, SingleObject, TimelineObject } from '../types.js';

/**
 * Uses the IntersectionObserver API to automatically pauses the animation when the element is not visible.
 *
 * Plays the timeline when the element becomes visible, even if the timeline was not playing before.
 *
 * @example
 *   const myTimeline = animare.timeline(...params);
 *
 *   // The element to track when entering and exiting the viewport
 *   const element = document.getElementById('element');
 *
 *   const unsubscribe = autoPause(myTimeline, element);
 *
 *   unsubscribe(); // Disconnect the intersection observer
 *
 * @param timeline - The animation object returned by animare.
 * @param element - The HTML element to track when entering and exiting the viewport.
 * @param options - The options for the intersection observer.
 * @returns A function to remove the intersection observer and stop tracking visibility.
 */
export function autoPause<Name extends string>(
  timeline: TimelineObject<Name> | GroupTimelineObject | SingleObject,
  element: Element,
  observerOptions?: AutoPauseOptions
): () => void {
  const isForcePlay = observerOptions?.forcePlay ?? true;
  let isPausedByMe = false;

  const observer = new IntersectionObserver(entries => {
    if (!timeline) {
      console.error('[autoPause] The timeline is not defined.');
      return;
    }

    // entries are in chronological order, only the latest state matters
    const latestEntry = entries.at(-1);
    if (!latestEntry) return;

    const isVisible = latestEntry.isIntersecting;

    observerOptions?.onVisibilityChange?.(isVisible);

    // enter the viewport
    if (isVisible) {
      // resume if paused
      if (isPausedByMe && timeline.timelineInfo.isPaused) {
        isPausedByMe = false;
        timeline.resume();
        return;
      }

      // play anyway, unless the user paused it or it is already running
      if (isForcePlay && !timeline.timelineInfo.isPaused && !timeline.timelineInfo.isPlaying) timeline.play();

      return;
    }

    // exit the viewport
    if (timeline.timelineInfo.isPlaying) {
      isPausedByMe = true;
      timeline.pause();
    }
  }, observerOptions);

  // Start observing the target element
  if (element) observer.observe(element);

  return () => observer.disconnect();
}
