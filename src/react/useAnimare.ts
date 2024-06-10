import { useEffect, useState } from 'react';

import type { ReturnObj, SingleReturnObj } from '../types';

/**
 * `useAnimare` custom React hook.
 *
 * @example
 *
 * import { useAnimare } from 'animare/react';
 *
 * useAnimare(() => {
 *   return animare(...params);
 *   // or
 *   return animare.single(...params);
 * }, []);
 *
 */
export function useAnimare<Name extends string>(callback: () => ReturnObj<Name>, deps: React.DependencyList): ReturnObj<Name>;
export function useAnimare(callback: () => SingleReturnObj, deps: React.DependencyList): SingleReturnObj;
export function useAnimare<Name extends string, R extends ReturnObj<Name> | SingleReturnObj>(
  callback: () => R,
  deps: React.DependencyList = [],
): R {
  const [animation, setAnimation] = useState<R>();

  useEffect(() => {
    // clean previous
    if (animation) {
      animation.clearEvents();
      if (animation.timelineInfo.isPlaying) animation.pause();
    }

    // set new
    const newAnimation = callback();
    setAnimation(newAnimation);

    // clean current
    return () => {
      newAnimation.clearEvents();
      if (newAnimation.timelineInfo.isPlaying) newAnimation.pause();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return animation as R;
}
