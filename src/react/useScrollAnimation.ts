import { useEffect } from 'react';

import scrollAnimation from '../plugins/scrollAnimation';

import type { ScrollAnimationOptions } from '../types';

/**
 *
 * Makes the scroll progress control the timeline.
 *
 * @param options — The options for configuring the scroll-controlled animation.
 * @returns — A function to remove the scroll event listener.
 *
 * @example
 * const scrollAnim = useAnimare(() => {
 *    // ...
 * });
 *
 * useScrollAnimation({
 *  timeline: scrollAnim,
 *  element: document.querySelector<HTMLDivElement>('.block')!,
 *  start: ScrollElementEdge.Bottom,
 *  end: ScrollElementEdge.Top,
 *  startOffset: 100,
 * });
 */
export function useScrollAnimation<Name extends string>(options: ScrollAnimationOptions<Name>, deps: React.DependencyList = []) {
  useEffect(() => {
    const unSub = scrollAnimation(options);
    return unSub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.timeline, ...deps]);
}
