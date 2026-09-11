import animare from 'animare';
import { useEffect } from 'react';

/**
 * A game loop that executes a callback function on each animation frame.
 *
 * @example
 *   import { useLoop } from 'animare/react';
 *
 *   useLoop(delta => {
 *     // do something
 *   }, []);
 *
 * @param onUpdateCallback - The callback function to be executed on each animation frame. It receives the delta time since the
 *   last frame as a parameter.
 */
export function useLoop(onUpdateCallback: (delta: number) => void, dependencies: React.DependencyList = []) {
  useEffect(() => {
    const stop = animare.loop(onUpdateCallback);
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
