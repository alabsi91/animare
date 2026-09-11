import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import animare, { Direction, Event } from 'animare';

import { advance } from './harness.ts';

describe('single', () => {
  it('passes the animation info to the callback', () => {
    const values: number[] = [];
    const single = animare.single({ to: 100, duration: 100, autoPlay: false }, info => {
      values.push(info.value);
    });

    single.play();
    advance(0);
    advance(50);
    advance(50);

    assert.deepEqual(values, [0, 50, 100]);
    assert.equal(single.animationsInfo.value, 100);
    assert.equal(single.animationsInfo.isFinished, true);
  });

  it('repeats the animation playCount times', () => {
    const single = animare.single({ to: 1, duration: 100, playCount: 2, autoPlay: false }, () => {});

    assert.equal(single.timelineInfo.duration, 200);
  });

  it('repeats forever with a negative playCount', () => {
    const single = animare.single({ to: 1, duration: 100, playCount: -1 }, () => {});

    advance(0);
    for (let step = 0; step < 10; step++) advance(100);

    assert.equal(single.timelineInfo.isPlaying, true);
    assert.equal(single.timelineInfo.playCount, 6);
  });

  it('updates the playCount the same way it was created', () => {
    const single = animare.single({ to: 1, duration: 100, playCount: 2, autoPlay: false }, () => {});
    let repeats = 0;
    single.on(Event.Repeat, () => repeats++);

    single.updateValues({ playCount: 3 });
    assert.equal(single.timelineInfo.duration, 300);

    single.play();
    advance(0);
    for (let step = 0; step < 10; step++) advance(100);

    assert.equal(repeats, 0);
    assert.equal(single.animationsInfo.playCount, 3);
    assert.equal(single.timelineInfo.isFinished, true);

    single.updateValues({ playCount: -1 });
    single.play();
    advance(0);
    for (let step = 0; step < 10; step++) advance(100);

    assert.equal(single.timelineInfo.isPlaying, true);
    assert.equal(single.timelineInfo.playCount, 6);
  });

  it('goes back and forth forever with alternate and a negative playCount', () => {
    const values: number[] = [];
    animare.single({ to: 100, duration: 500, direction: Direction.Alternate, playCount: -1 }, info => {
      values.push(info.value);
    });

    advance(0);
    for (let step = 0; step < 7; step++) advance(250);

    assert.deepEqual(values, [0, 50, 100, 100, 50, 0, 0, 50]);
  });

  it('switches from infinite to finite while playing', () => {
    const single = animare.single({ to: 1, duration: 100, playCount: -1 }, () => {});

    advance(0);
    for (let step = 0; step < 6; step++) advance(50);
    single.updateValues({ playCount: 1 });
    for (let step = 0; step < 3; step++) advance(50);

    assert.equal(single.timelineInfo.isFinished, true);
  });

  it('updates other values', () => {
    const single = animare.single({ to: 1, duration: 100, autoPlay: false }, () => {});

    single.updateValues({ duration: 500, to: 10 });
    single.play();
    advance(0);
    advance(250);

    assert.equal(single.timelineInfo.duration, 500);
    assert.equal(single.animationsInfo.value, 5);
  });
});
