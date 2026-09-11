import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import animare from 'animare';
import { autoPause, lerp, scrollAnimation, vecToHSL, vecToRGB } from 'animare/plugins';

import { advance, assertClose } from './harness.ts';

describe('lerp', () => {
  it('interpolates numbers, arrays and objects', () => {
    assert.equal(lerp(0, 10, 0.5), 5);
    assert.deepEqual(lerp([0, 10], [10, 20], 0.5), [5, 15]);
    assert.deepEqual(lerp({ x: 0, y: 10 }, { x: 10, y: 20 }, 0.5), { x: 5, y: 15 });
    assert.throws(() => lerp(0 as never, [1] as never, 0.5));
  });
});

describe('colors', () => {
  it('formats rgb and hsl with optional alpha', () => {
    assert.equal(vecToRGB([255, 0.4, 0]), 'rgb(255 0 0)');
    assert.equal(vecToRGB([255, 0, 0, 0.5]), 'rgb(255 0 0 / 50%)');
    assert.equal(vecToRGB({ x: 1, y: 2, z: 3, w: 1 }), 'rgb(1 2 3 / 100%)');
    assert.equal(vecToHSL([200, 100, 50]), 'hsl(200deg 100% 50%)');
    assert.equal(vecToHSL({ x: 200, y: 100, z: 50, w: 0.25 }), 'hsl(200deg 100% 50% / 25%)');
  });
});

describe('autoPause', () => {
  type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void;

  const observers: { callback: ObserverCallback; observed: unknown[]; isDisconnected: boolean }[] = [];

  class FakeIntersectionObserver {
    constructor(callback: ObserverCallback) {
      observers.push({ callback, observed: [], isDisconnected: false });
    }

    observe(element: unknown) {
      observers.at(-1)!.observed.push(element);
    }

    disconnect() {
      observers.at(-1)!.isDisconnected = true;
    }
  }

  Object.assign(globalThis, { IntersectionObserver: FakeIntersectionObserver });

  const element = {} as Element;

  const setup = (options?: Parameters<typeof autoPause>[2]) => {
    const values: number[] = [];
    const timeline = animare.timeline(
      [{ name: 'a', to: 100, duration: 1000 }],
      info => {
        values.push(info.a.value);
      },
      { autoPlay: false }
    );
    const unsubscribe = autoPause(timeline, element, options);
    const observer = observers.at(-1)!;
    const setVisible = (isVisible: boolean) => observer.callback([{ isIntersecting: isVisible }]);

    return { timeline, values, unsubscribe, setVisible, observer };
  };

  it('observes the element and disconnects on unsubscribe', () => {
    const { unsubscribe, observer } = setup();

    assert.deepEqual(observer.observed, [element]);
    unsubscribe();
    assert.equal(observer.isDisconnected, true);
  });

  it('plays when visible, pauses when hidden, resumes when visible again', () => {
    const { timeline, values, setVisible } = setup();

    setVisible(true);
    advance(0);
    advance(300);
    assert.equal(timeline.timelineInfo.isPlaying, true);

    setVisible(false);
    assert.equal(timeline.timelineInfo.isPaused, true);
    advance(500);

    setVisible(true);
    advance(0);
    assert.deepEqual(values, [0, 30, 30]);
  });

  it('does not restart a timeline that is already playing', () => {
    const { timeline, values, setVisible } = setup();

    timeline.play();
    advance(0);
    advance(300);
    setVisible(true);
    advance(0);

    assert.deepEqual(values, [0, 30, 30]);
  });

  it('respects a pause made by the user', () => {
    const { timeline, setVisible } = setup();

    timeline.play();
    advance(0);
    timeline.pause();
    setVisible(true);

    assert.equal(timeline.timelineInfo.isPaused, true);
  });

  it('uses the latest entry when entries are batched', () => {
    const { timeline, observer } = setup();

    timeline.play();
    advance(0);
    observer.callback([{ isIntersecting: false }, { isIntersecting: true }]);

    assert.equal(timeline.timelineInfo.isPlaying, true);
    assert.equal(timeline.timelineInfo.isPaused, false);
  });

  it('does not play when forcePlay is off', () => {
    const visibility: boolean[] = [];
    const { timeline, setVisible } = setup({
      forcePlay: false,
      onVisibilityChange: isVisible => {
        visibility.push(isVisible);
      },
    });

    setVisible(true);

    assert.equal(timeline.timelineInfo.isPlaying, false);
    assert.deepEqual(visibility, [true]);
  });
});

describe('scrollAnimation', () => {
  const setup = () => {
    const listeners = new Set<() => void>();
    const root = {
      clientHeight: 500,
      clientWidth: 500,
      scrollTop: 0,
      scrollLeft: 0,
      offsetTop: 0,
      offsetLeft: 0,
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    };
    const element = { offsetTop: 1000, offsetHeight: 200, offsetLeft: 0, offsetWidth: 0 };

    const values: number[] = [];
    const timeline = animare.timeline(
      [{ name: 'a', to: 100, duration: 1000 }],
      info => {
        values.push(info.a.value);
      },
      { autoPlay: false }
    );

    const unsubscribe = scrollAnimation({
      timeline,
      element: element as unknown as HTMLElement,
      root: root as unknown as HTMLElement,
    });

    const scrollTo = (scrollTop: number) => {
      root.scrollTop = scrollTop;
      for (const listener of listeners) listener();
    };

    return { values, scrollTo, unsubscribe, listeners };
  };

  it('syncs on subscribe and follows the scroll position', () => {
    const { values, scrollTo } = setup();

    assert.deepEqual(values, [0]);

    scrollTo(700);
    assertClose(values.at(-1)!, (100 * 200) / 700);

    scrollTo(1300);
    assert.equal(values.at(-1), 100);

    scrollTo(0);
    assert.equal(values.at(-1), 0);
  });

  it('removes the listener on unsubscribe', () => {
    const { unsubscribe, listeners } = setup();

    assert.equal(listeners.size, 1);
    unsubscribe();
    assert.equal(listeners.size, 0);
  });
});
