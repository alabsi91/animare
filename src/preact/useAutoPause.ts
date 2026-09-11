import { autoPause } from 'animare/plugins';
import { useEffect } from 'preact/hooks';

import type { AutoPauseOptions, GroupTimelineObject, SingleObject, TimelineObject } from '../types';

/**
 * Automatically pauses the animation when the element is not visible.
 *
 * Uses the IntersectionObserver API.
 *
 * Plays the timeline when the element becomes visible, even if the timeline was not playing before.
 *
 * Pauses the timeline when the element is not visible.
 *
 * @example
 *   import animare from 'animare';
 *   import { useAnimare, useAutoPause } from 'animare/react';
 *
 *   function MyComponent() {
 *   // The element to track when entering and exiting the viewport
 *   const elementRef = useRef(null);
 *
 *   const myTimeline = useAnimare(() => {
 *   return animare.timeline(...params);
 *   });
 *
 *   useAutoPause(myTimeline, elementRef.current, []);
 *
 *   // or you can pass in the observer options
 *   useAutoPause(myTimeline, elementRef.current, { threshold: 0.2 }, []);
 *   }
 *   }
 *
 * @param timeline - The animation object returned by animare.
 * @param element - The HTML element to track when entering and exiting the viewport.
 * @param dependencies - The dependencies for the effect.
 * @returns A function to remove the intersection observer and stop tracking visibility.
 */
export function useAutoPause<Name extends string>(
  timeline: TimelineObject<Name> | GroupTimelineObject | SingleObject,
  element: Element | null,
  dependencies?: React.DependencyList
): void;
export function useAutoPause<Name extends string>(
  timeline: TimelineObject<Name> | GroupTimelineObject | SingleObject,
  element: Element | null,
  observerOptions?: AutoPauseOptions,
  dependencies?: React.DependencyList
): void;
export function useAutoPause<Name extends string>(
  timeline: TimelineObject<Name> | GroupTimelineObject | SingleObject,
  element: Element | null,
  observerOptionsOrDependencies?: AutoPauseOptions | React.DependencyList,
  dependencies: React.DependencyList = []
): void {
  const effectDependencies = Array.isArray(observerOptionsOrDependencies) ? observerOptionsOrDependencies : dependencies;

  useEffect(() => {
    if (!timeline || !element) return;

    const observerOptions = (
      Array.isArray(observerOptionsOrDependencies) ? {} : observerOptionsOrDependencies
    ) as IntersectionObserverInit;

    return autoPause(timeline, element, observerOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeline, element, ...effectDependencies]);
}
