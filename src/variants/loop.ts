/**
 * A game loop that executes a callback function on each animation frame.
 *
 * @param onUpdateCallback - The callback function to be executed on each animation frame. It receives the delta time since the last frame as a parameter.
 * @returns A stop function that can be used to stop the loop.
 *
 * @example
 * const stop = loop(delta => {
 *   // do something
 * });
 *
 * stop(); // To stop the loop
 */
export default function loop(onUpdateCallback: (delta: number) => void) {
  let requestFrameId = 0;
  let lastFrameTime = 0;

  const execute = (now: number) => {
    const delta = now - lastFrameTime; // Time between the current and previous frame
    lastFrameTime = now;

    onUpdateCallback(delta);

    requestFrameId = requestAnimationFrame(execute);
  };

  const stop = () => cancelAnimationFrame(requestFrameId);

  requestFrameId = requestAnimationFrame(execute);

  return stop;
}

export type Loop = typeof loop;
