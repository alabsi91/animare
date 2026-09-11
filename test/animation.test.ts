import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import animare, { Direction, Timing } from 'animare';

import { advance, assertClose } from './harness.ts';

import type { AnimationOptions, TimelineGlobalOptions } from 'animare';

/** Creates a paused timeline and returns it. Use `advance` to move it. */
function createTimeline(animations: AnimationOptions[], globalOptions: TimelineGlobalOptions = {}) {
  const [first, ...rest] = animations;
  const timeline = animare.timeline([first, ...rest], () => {}, { autoPlay: false, ...globalOptions });
  timeline.play();
  advance(0);
  return timeline;
}

describe('delay and repeat', () => {
  it('applies the delay before every play by default', () => {
    // [0-500 delay][500-1500 play 1][1500-2000 delay][2000-3000 play 2]
    const timeline = createTimeline([{ name: 'a', to: 100, duration: 1000, delay: 500, playCount: 2 }]);
    const info = timeline.animationsInfo.a;

    assert.equal(timeline.timelineInfo.duration, 3000);

    advance(1400);
    assertClose(info.progress, 0.9);
    assertClose(info.value, 90);
    assert.equal(info.playCount, 1);
    assert.equal(info.delayCount, 1);

    advance(300);
    assert.equal(info.progress, 0);
    assert.equal(info.value, 0);
    assert.equal(info.playCount, 2);
    assert.equal(info.delayCount, 2);

    advance(800);
    assertClose(info.progress, 0.5);
    assertClose(info.value, 50);
  });

  it('applies the delay only delayCount times', () => {
    // [0-50 delay][50-150 play 1][150-250 play 2][250-350 play 3]
    const timeline = createTimeline([{ name: 'a', to: 100, duration: 100, delay: 50, playCount: 3, delayCount: 1 }]);
    const info = timeline.animationsInfo.a;

    assert.equal(timeline.timelineInfo.duration, 350);

    advance(175);
    assertClose(info.progress, 0.25);
    assert.equal(info.playCount, 2);
    assert.equal(info.delayCount, 1);
  });

  it('ignores a delayCount higher than playCount', () => {
    const timeline = createTimeline([{ name: 'a', to: 100, duration: 100, delay: 50, playCount: 2, delayCount: 5 }]);

    assert.equal(timeline.timelineInfo.duration, 300);

    timeline.updateValues([{ name: 'a', playCount: 1 }]);
    assert.equal(timeline.timelineInfo.duration, 150);
  });

  it('reports the play duration as elapsed time when finished', () => {
    const timeline = createTimeline([{ name: 'a', to: 100, duration: 100, playCount: 3 }]);
    const info = timeline.animationsInfo.a;

    advance(300);
    assert.equal(info.isFinished, true);
    assert.equal(info.progress, 1);
    assert.equal(info.value, 100);
    assert.equal(info.elapsedTime, 100);
    assert.equal(info.playCount, 3);
    assert.equal(info.isTimeAt(100), true);
  });
});

describe('direction', () => {
  /** Samples the value every 250 ms over `playCount` plays of 500 ms. */
  const valuesAt = (direction: Direction, playCount: number) => {
    const timeline = createTimeline([{ name: 'a', to: 100, duration: 500, direction, playCount }]);
    const info = timeline.animationsInfo.a;
    const values = [info.value];

    for (let step = 0; step < playCount * 2; step++) {
      advance(250);
      values.push(info.value);
    }

    return values;
  };

  it('forward', () => assert.deepEqual(valuesAt(Direction.Forward, 1), [0, 50, 100]));
  it('reverse', () => assert.deepEqual(valuesAt(Direction.Reverse, 1), [100, 50, 0]));

  it('alternate flips on every play, each play takes the full duration', () => {
    assert.deepEqual(valuesAt(Direction.Alternate, 1), [0, 50, 100]);
    assert.deepEqual(valuesAt(Direction.Alternate, 2), [0, 50, 100, 50, 0]);
    assert.deepEqual(valuesAt(Direction.Alternate, 3), [0, 50, 100, 50, 0, 50, 100]);
  });

  it('alternate-reverse starts backwards', () => {
    assert.deepEqual(valuesAt(Direction.AlternateReverse, 1), [100, 50, 0]);
    assert.deepEqual(valuesAt(Direction.AlternateReverse, 2), [100, 50, 0, 50, 100]);
  });
});

describe('timing', () => {
  it('positions animations relative to each other', () => {
    const timeline = createTimeline([
      { name: 'a', to: 1, duration: 100 },
      { name: 'b', to: 1, duration: 100 },
      { name: 'c', to: 1, duration: 100, timing: Timing.WithPrevious, offset: 50 },
      { name: 'd', to: 1, duration: 100, timing: Timing.FromStart, offset: 300 },
    ]);

    assert.equal(timeline.timelineInfo.duration, 400);

    advance(175);
    const { a, b, c, d } = timeline.animationsInfo;

    assert.equal(a.isFinished, true);
    assertClose(b.progress, 0.75);
    assertClose(c.progress, 0.25);
    assert.equal(d.isPlaying, false);
    assert.equal(d.progress, 0);
  });

  it('plays the animation earlier with a negative offset', () => {
    const timeline = createTimeline([
      { name: 'a', to: 1, duration: 100 },
      { name: 'b', to: 1, duration: 100, offset: -50 },
    ]);

    assert.equal(timeline.timelineInfo.duration, 150);

    advance(75);
    assertClose(timeline.animationsInfo.b.progress, 0.25);
  });

  it('skips an animation with playCount 0', () => {
    const timeline = createTimeline([
      { name: 'a', to: 1, duration: 100, playCount: 0 },
      { name: 'b', to: 1, duration: 100 },
    ]);

    assert.equal(timeline.timelineInfo.duration, 100);

    advance(50);
    assert.equal(timeline.animationsInfo.a.value, 0);
    assert.equal(timeline.animationsInfo.a.isPlaying, false);
    assertClose(timeline.animationsInfo.b.progress, 0.5);
  });
});

describe('options', () => {
  it('resolves per-index functions and global defaults', () => {
    const timeline = createTimeline(
      [
        { name: 'a', to: 10, duration: index => (index + 1) * 100 },
        { name: 'b', to: 10, duration: index => (index + 1) * 100 },
      ],
      { from: 5 }
    );

    assert.equal(timeline.timelineInfo.duration, 300);
    assert.equal(timeline.animationsInfo.a.value, 5);
    assert.equal(timeline.animationsInfo.b.value, 5);
  });

  it('applies the easing function', () => {
    const timeline = createTimeline([{ name: 'a', to: 100, duration: 100, ease: t => t * t }]);

    advance(50);
    assertClose(timeline.animationsInfo.a.value, 25);
  });

  it('throws on invalid values', () => {
    const create = (animation: AnimationOptions) => () => animare.timeline([animation], () => {}, { autoPlay: false });

    assert.throws(create({ name: 'a', to: 1, duration: -1 }));
    assert.throws(create({ name: 'a', to: 1, delay: -1 }));
    assert.throws(create({ name: 'a', to: 1, playCount: -1 }));
    assert.throws(create({ name: 'a' } as AnimationOptions));
    assert.throws(create({ to: 1 } as AnimationOptions));
  });
});
