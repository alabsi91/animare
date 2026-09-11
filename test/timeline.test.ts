import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import animare, { Event } from 'animare';

import { advance, assertClose, getDocumentListenerCount, setVisibility } from './harness.ts';

import type { TimelineGlobalOptions } from 'animare';

/** One animation from 0 to 100 over 1000 ms, paused. `values` collects every frame. */
function createTimeline(globalOptions: TimelineGlobalOptions = {}, duration = 1000) {
  const values: number[] = [];
  const timeline = animare.timeline(
    [{ name: 'a', to: 100, duration }],
    info => {
      values.push(info.a.value);
    },
    { autoPlay: false, ...globalOptions }
  );

  return { timeline, values, info: timeline.timelineInfo };
}

describe('play', () => {
  it('plays from start to end and completes', () => {
    const { timeline, values, info } = createTimeline({}, 100);
    const events: string[] = [];
    timeline.on(Event.Play, () => {
      events.push('play');
    });
    timeline.on(Event.Complete, () => {
      events.push('complete');
    });

    timeline.play();
    assert.equal(info.isPlaying, true);
    assert.equal(info.isFinished, false);

    advance(0);
    advance(50);
    advance(50);
    assert.deepEqual(values, [0, 50, 100]);
    assert.deepEqual(events, ['play', 'complete']);
    assert.equal(info.isFinished, true);
    assert.equal(info.isPlaying, false);

    advance(50);
    assert.equal(values.length, 3);
  });

  it('starts from a percentage or a time', () => {
    const { timeline, values } = createTimeline();

    timeline.play('50%');
    advance(0);
    timeline.play(250);
    advance(0);

    assert.deepEqual(values, [50, 25]);
  });

  it('lands the first frame exactly on the start point', () => {
    const { timeline, values } = createTimeline();

    timeline.play('50%');
    advance(7);

    assert.deepEqual(values, [50]);
  });

  it('restarts when called while playing', () => {
    const { timeline, values } = createTimeline();

    timeline.play();
    advance(0);
    advance(500);
    timeline.play();
    advance(0);

    assert.deepEqual(values, [0, 50, 0]);
  });

  it('auto plays by default', () => {
    let frames = 0;
    animare.timeline([{ name: 'a', to: 1, duration: 100 }], () => frames++);
    advance(0);

    assert.equal(frames, 1);
  });

  it('reports isFirstFrame only on the first callback', () => {
    const flags: boolean[] = [];
    const timeline = animare.timeline(
      [{ name: 'a', to: 1, duration: 100 }],
      (_, info) => {
        flags.push(info.isFirstFrame);
      },
      { autoPlay: false }
    );

    timeline.play();
    advance(0);
    advance(50);
    advance(50);

    assert.deepEqual(flags, [true, false, false]);
  });

  it('completes a timeline with 0 duration', () => {
    const { timeline, values, info } = createTimeline({}, 0);

    timeline.play();
    advance(0);

    assert.deepEqual(values, [100]);
    assert.equal(info.progress, 1);
    assert.equal(info.isFinished, true);
  });

  it('measures fps', () => {
    const { timeline, info } = createTimeline();

    timeline.play();
    advance(0);
    advance(20);

    assert.equal(info.fps, 50);
  });
});

describe('pause and resume', () => {
  it('keeps the position', () => {
    const { timeline, values, info } = createTimeline();
    const events: string[] = [];
    timeline.on(Event.Pause, () => {
      events.push('pause');
    });
    timeline.on(Event.Resume, () => {
      events.push('resume');
    });

    timeline.play();
    advance(0);
    advance(300);
    timeline.pause();
    assert.equal(info.isPaused, true);
    assert.equal(info.isPlaying, false);

    advance(1000);
    timeline.resume();
    advance(0);
    advance(100);

    assert.deepEqual(values, [0, 30, 30, 40]);
    assert.deepEqual(events, ['pause', 'resume']);
  });

  it('works before the first frame renders', () => {
    const { timeline, values, info } = createTimeline();

    timeline.play();
    timeline.pause();
    advance(500);
    assert.deepEqual(values, []);
    assert.equal(info.isPaused, true);

    timeline.resume();
    advance(0);
    advance(100);

    assert.deepEqual(values, [0, 10]);
  });

  it('resumes from a seek point', () => {
    const { timeline, values } = createTimeline();

    timeline.play();
    advance(0);
    advance(200);
    timeline.pause();
    timeline.seek('50%');
    timeline.resume();
    advance(0);

    assert.deepEqual(values, [0, 20, 50]);
  });

  it('renders the paused position with playOneFrame and stays paused', () => {
    const { timeline, values, info } = createTimeline();

    timeline.play();
    advance(0);
    advance(300);
    timeline.pause();
    timeline.playOneFrame();
    timeline.seek('60%');
    timeline.playOneFrame();

    assert.deepEqual(values, [0, 30, 30, 60]);
    assert.equal(info.isPaused, true);

    timeline.resume();
    advance(0);
    assert.equal(values.at(-1), 60);
  });

  it('plays from the start when not paused', () => {
    const { timeline, values } = createTimeline();

    timeline.resume();
    advance(0);

    assert.deepEqual(values, [0]);
  });
});

describe('stop', () => {
  it('jumps to the end', () => {
    const { timeline, values, info } = createTimeline();
    let isStopped = false;
    timeline.on(Event.Stop, () => (isStopped = true));

    timeline.play();
    advance(0);
    advance(300);
    const listenersWhilePlaying = getDocumentListenerCount('visibilitychange');
    timeline.stop();

    assert.deepEqual(values, [0, 30, 100]);
    assert.equal(info.isPlaying, false);
    assert.equal(info.isFinished, true);
    assert.equal(isStopped, true);
    assert.equal(getDocumentListenerCount('visibilitychange'), listenersWhilePlaying - 1);
  });

  it('stops at a given point', () => {
    const { timeline, values, info } = createTimeline();

    timeline.play();
    advance(0);
    timeline.stop('50%');
    advance(500);

    assert.deepEqual(values, [0, 50]);
    assert.equal(info.isFinished, false);
  });

  it('cancels a play that has not rendered yet', () => {
    const { timeline, values, info } = createTimeline();

    timeline.play();
    timeline.stop('50%');
    advance(500);

    assert.deepEqual(values, [50]);
    assert.equal(info.isPlaying, false);
  });

  it('clears the paused state', () => {
    const { timeline, values, info } = createTimeline();

    timeline.play();
    advance(0);
    advance(300);
    timeline.pause();
    timeline.stop();
    assert.equal(info.isPaused, false);

    timeline.resume();
    advance(0);

    assert.deepEqual(values, [0, 30, 100, 0]);
  });
});

describe('repeat', () => {
  it('repeats timelinePlayCount times', () => {
    const { timeline, values, info } = createTimeline({ timelinePlayCount: 2 }, 100);
    const events: string[] = [];
    timeline.on(Event.Repeat, () => {
      events.push('repeat');
    });
    timeline.on(Event.Complete, () => {
      events.push('complete');
    });

    timeline.play();
    advance(0);
    advance(100);
    assert.deepEqual(events, ['repeat']);
    assert.equal(info.playCount, 1);

    advance(50);
    assert.equal(info.playCount, 2);
    advance(100);

    assert.deepEqual(values, [0, 100, 0, 100]);
    assert.deepEqual(events, ['repeat', 'complete']);
  });

  it('repeats forever with -1', () => {
    const { timeline, info } = createTimeline({ timelinePlayCount: -1 }, 100);

    timeline.play();
    advance(0);
    for (let step = 0; step < 10; step++) advance(100);

    assert.equal(info.isPlaying, true);
    assert.equal(info.playCount, 6);
  });

  it('finishes the current play when the limit drops below the live play count', () => {
    const { timeline, info } = createTimeline({ timelinePlayCount: -1 }, 100);
    let completes = 0;
    timeline.on(Event.Complete, () => {
      completes++;
    });

    timeline.play();
    advance(0);
    for (let step = 0; step < 6; step++) advance(50);
    assert.equal(info.playCount, 3);

    timeline.updateTimelineOptions({ timelinePlayCount: 1 });
    advance(50);
    advance(50);
    advance(50);

    assert.equal(info.isFinished, true);
    assert.equal(info.playCount, 1);
    assert.equal(completes, 1);
  });

  it('never plays with 0', () => {
    const { timeline, values, info } = createTimeline({ timelinePlayCount: 0 }, 100);

    timeline.play();
    for (let step = 0; step < 5; step++) advance(50);

    assert.deepEqual(values, []);
    assert.equal(info.isPlaying, false);
  });
});

describe('speed', () => {
  it('scales time', () => {
    const { timeline, values } = createTimeline({ timelineSpeed: 2 });

    timeline.play();
    advance(0);
    advance(250);

    assert.deepEqual(values, [0, 50]);
  });

  it('can change while playing without jumping', () => {
    const { timeline, values } = createTimeline();

    timeline.play();
    advance(0);
    advance(300);
    timeline.updateTimelineOptions({ timelineSpeed: 2 });
    advance(100);

    assert.deepEqual(values, [0, 30, 50]);
  });

  it('can change while paused without jumping', () => {
    const { timeline, values } = createTimeline();

    timeline.play();
    advance(0);
    advance(300);
    timeline.pause();
    advance(1000);
    timeline.updateTimelineOptions({ timelineSpeed: 2 });
    timeline.resume();
    advance(0);

    assert.deepEqual(values, [0, 30, 30]);
  });

  it('rejects zero and negative values', () => {
    const { timeline } = createTimeline();

    assert.throws(() => timeline.updateTimelineOptions({ timelineSpeed: 0 }));
    assert.throws(() => animare.timeline([{ name: 'a', to: 1 }], () => {}, { timelineSpeed: -1 }));
  });
});

describe('hidden tab', () => {
  it('does not count the hidden time, at any speed', () => {
    const { timeline, values } = createTimeline({ timelineSpeed: 2 });

    timeline.play();
    advance(0);
    advance(100);
    setVisibility('hidden');
    advance(500);
    setVisibility('visible');
    advance(0);

    assert.deepEqual(values, [0, 20, 20]);
  });

  it('starts from the beginning when played while hidden', () => {
    const { timeline, values } = createTimeline();

    setVisibility('hidden');
    timeline.play();
    advance(500);
    setVisibility('visible');
    advance(0);
    advance(100);

    assert.deepEqual(values, [0, 10]);
  });
});

describe('updateValues', () => {
  it('keeps the relative position while playing', () => {
    const { timeline, values, info } = createTimeline();

    timeline.play();
    advance(0);
    advance(500);
    timeline.updateValues([{ name: 'a', duration: 2000 }]);
    assert.equal(info.duration, 2000);

    advance(100);
    assertClose(values.at(-1)!, 55);
  });

  it('keeps the relative position while paused', () => {
    const { timeline, values } = createTimeline();

    timeline.play();
    advance(0);
    advance(500);
    timeline.pause();
    timeline.updateValues([{ name: 'a', duration: 2000 }]);
    timeline.resume();
    advance(0);

    assert.deepEqual(values, [0, 50, 50]);
  });

  it('leaves the values untouched when the update is invalid', () => {
    const { timeline, info } = createTimeline();

    assert.throws(() => timeline.updateValues([{ name: 'a', duration: -1 }]));
    assert.equal(info.duration, 1000);
  });

  it('throws for an unknown or missing name', () => {
    const { timeline } = createTimeline();

    assert.throws(() => timeline.updateValues([{ name: 'nope' as 'a', duration: 10 }]));
    assert.throws(() => timeline.updateValues([{ duration: 10 } as never]));
  });
});
