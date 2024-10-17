import { Event } from '../types.js';

import type { EventCallback, EventUnsubscribe } from '../types.js';

export default class EventManager {
  #registeredEvents: Record<Event, Set<EventCallback>> = Object.assign({});

  #onPlayPromise: ((value?: unknown) => void) | null = null;
  #onResumePromise: ((value?: unknown) => void) | null = null;
  #onPausePromise: ((value?: unknown) => void) | null = null;
  #onStopPromise: ((value?: unknown) => void) | null = null;
  #onCompletePromise: ((value?: unknown) => void) | null = null;
  #onRepeatPromise: ((value?: unknown) => void) | null = null;

  #remove(event: Event, callback: EventCallback): boolean {
    if (!this.#registeredEvents[event]) return false;
    return this.#registeredEvents[event].delete(callback);
  }

  /**
   * Attaches an event listener to the timeline.
   *
   * @param event - The event to listen for.
   * @param callback - The callback function to be executed when the event is triggered.
   * @returns A function to unsubscribe the event listener.
   *
   * @example
   * const unsubscribe = on(Event.Play, () => {
   *   // do something
   * });
   *
   * unsubscribe(); // To remove the event listener
   */
  public on(event: Event, callback: EventCallback): EventUnsubscribe {
    if (!this.#registeredEvents[event]) this.#registeredEvents[event] = new Set();

    this.#registeredEvents[event].add(callback);

    return () => this.#remove(event, callback);
  }

  /**
   * Attaches an event listener to the timeline that will be triggered only once.
   *
   * @param event - The event to listen for.
   * @param callback - The callback function to be executed when the event is triggered.
   * @returns A function to unsubscribe the event listener.
   *
   * @example
   * const unsubscribe = once(Event.Play, () => {
   *   // do something
   * });
   *
   * unsubscribe(); // To remove the event listener
   */
  public once(event: Event, callback: EventCallback): EventUnsubscribe {
    const remove = this.on(event, () => {
      callback();
      remove();
    });

    return () => this.#remove(event, callback);
  }

  public emit(event: Event) {
    if (!this.#registeredEvents[event]) return;

    this.#registeredEvents[event].forEach(callback => callback());

    if (event === Event.Play) {
      this.#onPlayPromise?.();
      this.#onPlayPromise = null;
      return;
    }

    if (event === Event.Resume) {
      this.#onResumePromise?.();
      this.#onResumePromise = null;
      return;
    }

    if (event === Event.Pause) {
      this.#onPausePromise?.();
      this.#onPausePromise = null;
      return;
    }

    if (event === Event.Complete) {
      this.#onCompletePromise?.();
      this.#onCompletePromise = null;
      return;
    }

    if (event === Event.Repeat) {
      this.#onRepeatPromise?.();
      this.#onRepeatPromise = null;
      return;
    }

    if (event === Event.Stop) {
      this.#onStopPromise?.();
      this.#onStopPromise = null;
    }
  }

  /** Removes all event listeners. */
  public clear() {
    this.#registeredEvents = Object.assign({});
  }

  /**
   * Waits until the timeline starts playing.
   * @example
   * await onPlayAsync();
   */
  public onPlayAsync() {
    if (this.#onPlayPromise !== null) return;
    return new Promise(resolve => {
      this.#onPlayPromise = resolve;
    });
  }

  /**
   * Waits until the timeline resumes.
   * @example
   * await onResumeAsync();
   */
  public onResumeAsync() {
    if (this.#onResumePromise !== null) return;
    return new Promise(resolve => {
      this.#onResumePromise = resolve;
    });
  }

  /**
   * Waits until the timeline pauses.
   * @example
   * await onPauseAsync();
   */
  public onPauseAsync() {
    if (this.#onPausePromise !== null) return;
    return new Promise(resolve => {
      this.#onPausePromise = resolve;
    });
  }

  /**
   * Waits until the timeline stops.
   * @example
   * await onStopAsync();
   */
  public onStopAsync() {
    if (this.#onStopPromise !== null) return;
    return new Promise(resolve => {
      this.#onStopPromise = resolve;
    });
  }

  /**
   * Waits until the timeline completes.
   * @example
   * await onCompleteAsync();
   */
  public onCompleteAsync() {
    if (this.#onCompletePromise !== null) return;
    return new Promise(resolve => {
      this.#onCompletePromise = resolve;
    });
  }

  /**
   * Waits until the timeline repeats.
   * @example
   * await onRepeatAsync();
   */
  public onRepeatAsync() {
    if (this.#onRepeatPromise !== null) return;
    return new Promise(resolve => {
      this.#onRepeatPromise = resolve;
    });
  }
}
