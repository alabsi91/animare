import animare from './animare.js';

/**
 * - `timeout` is an implementation of a “high priority” `setTimeout`.
 * - The `setTimeout` function sets a timer which executes a function on the next event cycle once the timer expires.
 * - This means, the final delay will depend on the current status of the event loop.
 * @example
 * ```js
 * import { timeout } from 'animare';
 *
 * const myTimeout = timeout(() => {
 *  console.log('timeout');
 * }, 1000);
 *
 * myTimeout.clear(); // clear timeout
 * ```
 */
export function timeout(callback: () => void, ms = 0) {
  if (typeof callback !== 'function') throw new Error('\n\n⛔ [animare] ➡️ [timeout] : `callback` must be a function. !!\n');
  if (typeof ms !== 'number') throw new Error('\n\n⛔ [animare] ➡️ [timeout] : `ms` must be a number. !!\n');
  if (ms < 0) throw new Error('\n\n⛔ [animare] ➡️ [timeout] : `ms` must be a positive number. !!\n');

  let clear: (() => void) | null = animare({ to: 1, duration: ms }, (_, { isFinished }) => {
    if (isFinished) callback();
  }).pause;

  return {
    /** - Cancel the timeout */
    clear: () => {
      if (!clear) return;
      clear(); // cancel timeout
      clear = null; // for garbage collection
    },
  };
}
