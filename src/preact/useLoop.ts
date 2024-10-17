import { useEffect } from 'preact/hooks';

import animare from 'animare';

/**
 * A game loop that executes a callback function on each animation frame.
 *
 * @param onUpdateCallback - The callback function to be executed on each animation frame. It receives the delta time since the last frame as a parameter.
 *
 * @example
 * import { useLoop } from 'animare/react';
 *
 * useLoop(delta => {
 *   // do something
 * }, []);
 *
 */
export function useLoop(onUpdateCallback: (delta: number) => void, deps: React.DependencyList = []) {
  useEffect(() => {
    const stop = animare.loop(onUpdateCallback);
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
