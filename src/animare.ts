import group from './variants/group.js';
import loop from './variants/loop.js';
import single from './variants/single.js';
import timeline from './variants/timeline.js';

import type { AnimationOptionsParameter, OnUpdateCallback, TimelineGlobalOptions, TimelineObject } from './types.js';

export function animare<Name extends string>(
  animations: AnimationOptionsParameter<Name>,
  callback: OnUpdateCallback<AnimationOptionsParameter<Name>>,
  globalValues: TimelineGlobalOptions = {}
): TimelineObject<Name> {
  return timeline<Name>(animations, callback, globalValues);
}

animare.timeline = timeline;
animare.single = single;
animare.group = group;
animare.loop = loop;
