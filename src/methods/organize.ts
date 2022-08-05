import { DIRECTION } from "./types";

type organizeOptions = {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  delayOnce?: boolean;
  repeat?: number;
  direction?: keyof typeof DIRECTION;
  ease?: (x: number) => number;
};

/**
 * - A helper function to organize the options for the animation.
 * @param ob - options: `{name: {from: number, to: number, ...}, ...}`
 * @param defaults - changes the default values for each option.
 */
export function organize<T extends { [key in keyof T]: organizeOptions }>(ob: T, defaults: Omit<organizeOptions, 'to'> = {}) {
  defaults.from ??= 0;
  defaults.duration ??= 350;
  defaults.delay ??= 0;
  defaults.delayOnce ??= false;
  defaults.repeat ??= 0;
  defaults.direction ??= 'normal';
  defaults.ease ??= x => x;

  const ent = Object.entries<organizeOptions>(ob),
    from = ent.map(e => e[1].from ?? defaults.from),
    to = ent.map(e => e[1].to),
    duration = ent.map(e => e[1].duration ?? defaults.duration),
    delay = ent.map(e => e[1].delay ?? defaults.delay),
    delayOnce = ent.map(e => e[1].delayOnce ?? defaults.delayOnce),
    repeat = ent.map(e => e[1].repeat ?? defaults.repeat),
    direction = ent.map(e => e[1].direction ?? defaults.direction),
    ease = ent.map(e => e[1].ease ?? defaults.ease),
    names = Object.keys(ob) as (keyof T)[];

  const get = (animareArray: number[]) => {
    const res: Record<keyof T, number> = Object.create(null);
    for (let i = 0; i < animareArray.length; i++) res[names[i]] = animareArray[i];
    return res;
  };

  const patch = (patchOb?: Partial<T>) => organize(Object.assign({}, ob, patchOb));

  return {
    from,
    to,
    duration,
    delay,
    delayOnce,
    repeat,
    direction,
    ease,
    /**
     * - Takes an array of numbers and retruns an object
     * - with the same keys as the original object, but with the values of the array.
     */
    get,
    /** - Creates a new copy with patched options.*/
    patch,
  };
}
