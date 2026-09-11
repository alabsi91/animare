import { Event } from '../types.js';

import type { EventCallback, EventUnsubscribe } from '../types.js';

export default class EventManager {
  #registeredEvents = new Map<Event, Set<EventCallback>>();

  #pendingPromises = new Map<Event, PromiseWithResolvers<void>>();

  #remove(event: Event, callback: EventCallback): boolean {
    return this.#registeredEvents.get(event)?.delete(callback) ?? false;
  }

  /** Returns one shared promise per event. Every caller waits on the same one until the event is emitted. */
  #waitFor(event: Event): Promise<void> {
    const alreadyPending = this.#pendingPromises.get(event);
    if (alreadyPending) return alreadyPending.promise;

    const pending = Promise.withResolvers<void>();
    this.#pendingPromises.set(event, pending);

    return pending.promise;
  }

  /**
   * Attaches an event listener to the timeline.
   *
   * @example
   *   const unsubscribe = on(Event.Play, () => {
   *     // do something
   *   });
   *
   *   unsubscribe(); // To remove the event listener
   *
   * @param event - The event to listen for.
   * @param callback - The callback function to be executed when the event is triggered.
   * @returns A function to unsubscribe the event listener.
   */
  public on(event: Event, callback: EventCallback): EventUnsubscribe {
    let callbacks = this.#registeredEvents.get(event);

    if (!callbacks) {
      callbacks = new Set();
      this.#registeredEvents.set(event, callbacks);
    }

    callbacks.add(callback);

    return () => this.#remove(event, callback);
  }

  /**
   * Attaches an event listener to the timeline that will be triggered only once.
   *
   * @example
   *   const unsubscribe = once(Event.Play, () => {
   *     // do something
   *   });
   *
   *   unsubscribe(); // To remove the event listener
   *
   * @param event - The event to listen for.
   * @param callback - The callback function to be executed when the event is triggered.
   * @returns A function to unsubscribe the event listener.
   */
  public once(event: Event, callback: EventCallback): EventUnsubscribe {
    const remove = this.on(event, () => {
      callback();
      remove();
    });

    return remove;
  }

  public emit(event: Event) {
    const callbacks = this.#registeredEvents.get(event);
    if (callbacks) {
      for (const callback of callbacks) callback();
    }

    const pending = this.#pendingPromises.get(event);
    if (pending) {
      this.#pendingPromises.delete(event);
      pending.resolve();
    }
  }

  /** Removes all event listeners. */
  public clear() {
    this.#registeredEvents.clear();
  }

  /**
   * Waits until the timeline starts playing.
   *
   * @example
   *   await onPlayAsync();
   */
  public onPlayAsync(): Promise<void> {
    return this.#waitFor(Event.Play);
  }

  /**
   * Waits until the timeline resumes.
   *
   * @example
   *   await onResumeAsync();
   */
  public onResumeAsync(): Promise<void> {
    return this.#waitFor(Event.Resume);
  }

  /**
   * Waits until the timeline pauses.
   *
   * @example
   *   await onPauseAsync();
   */
  public onPauseAsync(): Promise<void> {
    return this.#waitFor(Event.Pause);
  }

  /**
   * Waits until the timeline stops.
   *
   * @example
   *   await onStopAsync();
   */
  public onStopAsync(): Promise<void> {
    return this.#waitFor(Event.Stop);
  }

  /**
   * Waits until the timeline completes.
   *
   * @example
   *   await onCompleteAsync();
   */
  public onCompleteAsync(): Promise<void> {
    return this.#waitFor(Event.Complete);
  }

  /**
   * Waits until the timeline repeats.
   *
   * @example
   *   await onRepeatAsync();
   */
  public onRepeatAsync(): Promise<void> {
    return this.#waitFor(Event.Repeat);
  }
}
