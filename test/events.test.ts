import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import animare, { Event } from 'animare';

import { advance } from './harness.ts';

function createTimeline() {
  return animare.timeline([{ name: 'a', to: 1, duration: 100 }], () => {}, { autoPlay: false });
}

describe('listeners', () => {
  it('on() calls the listener until unsubscribed', () => {
    const timeline = createTimeline();
    let calls = 0;
    const unsubscribe = timeline.on(Event.Play, () => calls++);

    timeline.play();
    advance(0);
    assert.equal(unsubscribe(), true);
    assert.equal(unsubscribe(), false);
    timeline.play();
    advance(0);

    assert.equal(calls, 1);
  });

  it('once() calls the listener one time', () => {
    const timeline = createTimeline();
    let calls = 0;
    timeline.once(Event.Play, () => calls++);

    timeline.play();
    advance(0);
    timeline.play();
    advance(0);

    assert.equal(calls, 1);
  });

  it('once() can be unsubscribed before it fires', () => {
    const timeline = createTimeline();
    let calls = 0;
    const unsubscribe = timeline.once(Event.Play, () => calls++);

    assert.equal(unsubscribe(), true);
    timeline.play();
    advance(0);

    assert.equal(calls, 0);
  });

  it('clearEvents() removes every listener', () => {
    const timeline = createTimeline();
    let calls = 0;
    timeline.on(Event.Play, () => calls++);
    timeline.once(Event.Complete, () => calls++);

    timeline.clearEvents();
    timeline.play();
    advance(0);
    advance(100);

    assert.equal(calls, 0);
  });

  it('emits in order', () => {
    const timeline = createTimeline();
    const events: Event[] = [];
    for (const event of Object.values(Event)) {
      timeline.on(event, () => {
        events.push(event);
      });
    }

    timeline.play();
    advance(0);
    timeline.pause();
    timeline.resume();
    advance(50);
    timeline.stop();

    assert.deepEqual(events, [Event.Play, Event.Pause, Event.Resume, Event.Complete, Event.Stop]);
  });
});

describe('async', () => {
  it('resolves without any on() listener', async () => {
    const timeline = createTimeline();
    const completed = timeline.onCompleteAsync();

    timeline.play();
    advance(0);
    advance(100);

    await completed;
  });

  it('shares one promise between concurrent awaiters', async () => {
    const timeline = createTimeline();
    const first = timeline.onPlayAsync();
    const second = timeline.onPlayAsync();

    assert.equal(first, second);

    timeline.play();
    advance(0);
    await Promise.all([first, second]);

    assert.notEqual(timeline.onPlayAsync(), first);
  });

  it('still resolves after clearEvents()', async () => {
    const timeline = createTimeline();
    const paused = timeline.onPauseAsync();

    timeline.clearEvents();
    timeline.play();
    timeline.pause();

    await paused;
  });

  it('covers every event', async () => {
    const timeline = animare.timeline([{ name: 'a', to: 1, duration: 100 }], () => {}, {
      autoPlay: false,
      timelinePlayCount: 2,
    });

    const played = timeline.onPlayAsync();
    const paused = timeline.onPauseAsync();
    const resumed = timeline.onResumeAsync();
    const repeated = timeline.onRepeatAsync();
    const completed = timeline.onCompleteAsync();
    const stopped = timeline.onStopAsync();

    timeline.play();
    advance(0);
    timeline.pause();
    timeline.resume();
    advance(100);
    advance(100);
    advance(100);
    timeline.stop();

    await Promise.all([played, paused, resumed, repeated, completed, stopped]);
  });
});
