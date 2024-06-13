import { useEffect } from 'react';
import { autoPause } from '../plugins';

import type { SingleObject, TimelineObject } from '../types';

/**
 * Automatically pauses the animation when the element is not visible.
 *
 * Uses the IntersectionObserver API.
 *
 * Plays the timeline when the element becomes visible, even if the timeline was not playing before.
 *
 * Pauses the timeline when the element is not visible.
 *
 * @param timeline - The animation object returned by animare.
 * @param element - The HTML element to track when entering and exiting the viewport.
 * @param deps - The dependencies for the effect.
 * @returns A function to remove the intersection observer and stop tracking visibility.
 *
 * @example
 * import animare from 'animare';
 * import { useAnimare, useAutoPause } from 'animare/react';
 *
 * function MyComponent() {
 *   // The element to track when entering and exiting the viewport
 *   const elementRef = useRef(null);
 *
 *   const myTimeline = useAnimare(() => {
 *     return animare.timeline(...params);
 *   });
 *
 *   useAutoPause(myTimeline, elementRef.current, []);
 *
 *   // or you can pass in the observer options
 *   useAutoPause(myTimeline, elementRef.current, { threshold: 0.2 }, []);
 * }
 * }
 */
export function useAutoPause<Name extends string>(
  timeline: TimelineObject<Name> | SingleObject,
  element: Element | null,
  deps?: React.DependencyList,
): void;
export function useAutoPause<Name extends string>(
  timeline: TimelineObject<Name> | SingleObject,
  element: Element | null,
  observerOptions?: IntersectionObserverInit,
  deps?: React.DependencyList,
): void;
export function useAutoPause<Name extends string>(
  timeline: TimelineObject<Name> | SingleObject,
  element: Element | null,
  observerOptionsOrDeps?: IntersectionObserverInit | React.DependencyList,
  deps: React.DependencyList = [],
): void {
  const dependencies = Array.isArray(observerOptionsOrDeps) ? observerOptionsOrDeps : deps;

  useEffect(() => {
    if (!timeline || !element) return;

    const observerOptions = (Array.isArray(observerOptionsOrDeps) ? {} : observerOptionsOrDeps) as IntersectionObserverInit;

    return autoPause(timeline, element, observerOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeline, element, ...dependencies]);
}
