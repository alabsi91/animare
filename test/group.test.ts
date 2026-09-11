import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import animare, { Timing } from 'animare';

import { advance } from './harness.ts';

describe('group', () => {
  it('expands scalar values and keeps array values per index', () => {
    const group = animare.group({ to: [10, 20], duration: [100, 200], from: 5, autoPlay: false }, () => {});

    assert.equal(group.animationsInfo.length, 2);
    assert.equal(group.timelineInfo.duration, 300);

    group.play();
    advance(0);
    assert.equal(group.animationsInfo[0].value, 5);
    assert.equal(group.animationsInfo[1].value, 5);

    advance(300);
    assert.equal(group.animationsInfo[0].value, 10);
    assert.equal(group.animationsInfo[1].value, 20);
  });

  it('names animations by their index', () => {
    const group = animare.group({ to: [1, 2], autoPlay: false }, () => {});

    assert.equal(group.animationsInfo['0'].name, '0');
    assert.equal(group.animationsInfo['1'].name, '1');
  });

  it('accepts a single number for to', () => {
    const group = animare.group({ to: 7, autoPlay: false }, () => {});

    assert.equal(group.animationsInfo.length, 1);
  });

  it('accepts timing per index', () => {
    const group = animare.group(
      { to: [1, 2], duration: 100, timing: [Timing.FromStart, Timing.WithPrevious], autoPlay: false },
      () => {}
    );

    assert.equal(group.timelineInfo.duration, 100);
  });

  it('updates values by index', () => {
    const group = animare.group({ to: [1, 2], duration: 100, autoPlay: false }, () => {});

    group.updateValues([{ index: 1, duration: 50 }]);

    assert.equal(group.timelineInfo.duration, 150);
    assert.throws(() => group.updateValues([{ duration: 50 } as never]));
  });

  it('requires to', () => {
    assert.throws(() => animare.group({ duration: 100 } as never, () => {}));
  });
});
