// A fake browser clock and frame loop so the library can run under node's test runner.
// Import this file before `animare` in every test.

type FrameCallback = (frameTime: number) => void;
type Listener = () => void;

let currentTime = 1000;
let nextFrameId = 1;
let pendingFrames = new Map<number, FrameCallback>();
const documentListeners = new Map<string, Set<Listener>>();

export const fakeDocument = {
  visibilityState: 'visible' as DocumentVisibilityState,

  addEventListener(eventName: string, listener: Listener) {
    let listeners = documentListeners.get(eventName);

    if (!listeners) {
      listeners = new Set();
      documentListeners.set(eventName, listeners);
    }

    listeners.add(listener);
  },

  removeEventListener(eventName: string, listener: Listener) {
    documentListeners.get(eventName)?.delete(listener);
  },

  dispatch(eventName: string) {
    const listeners = documentListeners.get(eventName) ?? [];
    for (const listener of listeners) listener();
  },
};

Object.assign(globalThis, {
  document: fakeDocument,
  performance: { now: () => currentTime },
  requestAnimationFrame: (callback: FrameCallback) => {
    const frameId = nextFrameId++;
    pendingFrames.set(frameId, callback);
    return frameId;
  },
  cancelAnimationFrame: (frameId: number) => {
    pendingFrames.delete(frameId);
  },
});

// the library warns on misuse, which some tests do on purpose
console.warn = () => {};

/** Moves the clock forward and runs every frame that was requested before this call. */
export function advance(milliseconds: number) {
  currentTime += milliseconds;

  // browsers do not run frames in hidden tabs
  if (fakeDocument.visibilityState === 'hidden') return;

  // frames requested while running go into a fresh map for the next call
  const frames = pendingFrames;
  pendingFrames = new Map();
  for (const frame of frames.values()) frame(currentTime);
}

export function setVisibility(state: DocumentVisibilityState) {
  fakeDocument.visibilityState = state;
  fakeDocument.dispatch('visibilitychange');
}

export function getPendingFrameCount() {
  return pendingFrames.size;
}

export function getDocumentListenerCount(eventName: string) {
  return documentListeners.get(eventName)?.size ?? 0;
}

export function assertClose(actual: number, expected: number, tolerance = 1e-6) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`Expected ${actual} to be within ${tolerance} of ${expected}`);
  }
}
