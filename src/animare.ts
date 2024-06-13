import group from './variants/group';
import single from './variants/single';
import timeline from './variants/timeline';

import type { AnimationOptionsParam, OnUpdateCallback, TimelineGlobalOptions, TimelineObject } from './types';

export function animare<Name extends string>(
  animations: AnimationOptionsParam<Name>,
  callback: OnUpdateCallback<AnimationOptionsParam<Name>>,
  globalValues: TimelineGlobalOptions = {},
): TimelineObject<Name> {
  return timeline<Name>(animations, callback, globalValues);
}

animare.timeline = timeline;
animare.single = single;
animare.group = group;
