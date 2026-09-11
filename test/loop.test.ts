import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import animare from 'animare';

import { advance, getPendingFrameCount } from './harness.ts';

describe('loop', () => {
  it('passes the time since the previous frame', () => {
    const deltas: number[] = [];
    const stop = animare.loop(delta => {
      deltas.push(delta);
    });

    advance(16);
    advance(20);
    stop();

    assert.deepEqual(deltas, [16, 20]);
  });

  it('stops requesting frames', () => {
    const stop = animare.loop(() => {});

    advance(16);
    stop();
    advance(16);

    assert.equal(getPendingFrameCount(), 0);
  });
});
