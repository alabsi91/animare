import { animare } from './animare';
import single from './variants/single';
import group from './variants/group';
import loop from './variants/loop';

animare.single = single;
animare.group = group;
animare.loop = loop;

export default animare;

export { ease } from './ease/index';

import scrollAnimation from './plugins/scrollAnimation';
export { scrollAnimation };

import lerp from './utils/lerp';
export { lerp };

export { vecToRGB, vecToHSL } from './utils/vecToColor';

export * from './types';
