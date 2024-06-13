import type { SingleObject, TimelineObject } from '../types';

/**
 * Uses the IntersectionObserver API to automatically pauses the animation when the element is not visible.
 *
 * Plays the timeline when the element becomes visible, even if the timeline was not playing before.
 *
 * @param timeline - The animation object returned by animare.
 * @param element - The HTML element to track when entering and exiting the viewport.
 * @param observerOptions - The options for the intersection observer.
 * @returns A function to remove the intersection observer and stop tracking visibility.
 *
 * @example
 * const myTimeline = animare.timeline(...params);
 *
 * // The element to track when entering and exiting the viewport
 * const element = document.getElementById('element');
 *
 * const unsubscribe = autoPause(myTimeline, element);
 *
 * unsubscribe(); // Disconnect the intersection observer
 */
export function autoPause<Name extends string>(
  timeline: TimelineObject<Name> | SingleObject,
  element: Element,
  observerOptions?: IntersectionObserverInit,
): () => void {
  const observer = new IntersectionObserver(entries => {
    if (!timeline) return;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const isVisible = entry.isIntersecting;

      if (isVisible) timeline.play();
      else if (timeline.timelineInfo.isPlaying) timeline.pause();
    }
  }, observerOptions);

  // Start observing the target element
  if (element) observer.observe(element);

  return () => observer.disconnect();
}
