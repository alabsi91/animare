import { scrollAnimation } from 'animare/plugins';
import { useEffect } from 'preact/hooks';

import type { ScrollAnimationOptions } from '../types.js';

/**
 * Makes the scroll progress control the timeline.
 *
 * @example
 *   const scrollAnim = useAnimare(() => {
 *     // ...
 *   });
 *
 *   useScrollAnimation({
 *     timeline: scrollAnim,
 *     element: document.querySelector<HTMLDivElement>('.block')!,
 *     start: ScrollElementEdge.Bottom,
 *     end: ScrollElementEdge.Top,
 *     startOffset: 100,
 *   });
 *
 * @param options — The options for configuring the scroll-controlled animation.
 * @returns — A function to remove the scroll event listener.
 */
export function useScrollAnimation<Name extends string>(
  options: ScrollAnimationOptions<Name>,
  dependencies: React.DependencyList = []
) {
  useEffect(() => {
    // `useAnimare` returns undefined on the first render
    if (!options.timeline) return;

    const unSub = scrollAnimation(options);
    return unSub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.timeline, ...dependencies]);
}
