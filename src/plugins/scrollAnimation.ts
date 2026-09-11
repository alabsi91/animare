import { ScrollAxis, ScrollElementEdge } from '../types.js';
import { normalizePercentage } from './utilities.js';

import type { ScrollAnimationOptions } from '../types.js';

/**
 * Makes the scroll progress control the timeline.
 *
 * @example
 *   const myAnimation = animare( ... );
 *
 *   // The element to track when entering and exiting the viewport
 *   const element = document.getElementById('element');
 *
 *   const unsubscribe = scrollAnimation({
 *   timeline: myAnimation,
 *   element: element
 *   });
 *
 *   unsubscribe(); // Removes the scroll event listener
 *
 * @param options - The options for configuring the scroll-controlled animation.
 * @returns A function to remove the scroll event listener.
 */
export function scrollAnimation<Name extends string>(options: ScrollAnimationOptions<Name>) {
  const element = options.root ?? document;
  const handler = () => onScroll(options);

  element.addEventListener('scroll', handler, { passive: true });

  // sync with the current scroll position, no scroll event fires on subscribe
  handler();

  return () => element.removeEventListener('scroll', handler);
}

function onScroll<Name extends string>({
  timeline,
  element,
  root = document.documentElement,
  axis = ScrollAxis.Vertical,
  start = ScrollElementEdge.Top,
  end = ScrollElementEdge.Bottom,
  startOffset = 0,
  endOffset = 0,
}: ScrollAnimationOptions<Name>) {
  const isVertical = axis === ScrollAxis.Vertical;

  const viewportSize = isVertical ? root.clientHeight : root.clientWidth;
  const scrollPosition = isVertical ? root.scrollTop : root.scrollLeft;

  const startPosition = calcElementPosition(element, root, start) + startOffset;
  const endPosition = calcElementPosition(element, root, end) + endOffset;

  const isEntered = startPosition <= scrollPosition + viewportSize;
  const isExited = endPosition < scrollPosition;

  let percentage: number;
  if (!isEntered) {
    percentage = 0;
  } else if (isExited) {
    percentage = 1;
  } else {
    const distance = viewportSize - (startPosition - endPosition);
    percentage = normalizePercentage((scrollPosition + viewportSize - startPosition) / distance);
  }

  timeline.seek(timeline.timelineInfo.duration * percentage);
  if (!timeline.timelineInfo.isPlaying) timeline.playOneFrame();
}

function calcElementPosition(element: HTMLElement, root: HTMLElement, edge: ScrollElementEdge): number {
  if (edge === ScrollElementEdge.Top) return element.offsetTop - root.offsetTop;
  if (edge === ScrollElementEdge.Bottom) return element.offsetTop - root.offsetTop + element.offsetHeight;
  if (edge === ScrollElementEdge.Left) return element.offsetLeft - root.offsetLeft;
  if (edge === ScrollElementEdge.Right) return element.offsetLeft - root.offsetLeft + element.offsetWidth;

  return element.offsetTop;
}
