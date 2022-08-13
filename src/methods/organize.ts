import { colorToArr } from './colorToRgbArray';
import { DIRECTION } from './types';

type organizeOptions<T extends number | string = number> = {
  /** number or a color string. */
  to: T;
  /** number or a color string. */
  from?: T;
  duration?: number;
  delay?: number;
  delayOnce?: boolean;
  repeat?: number;
  direction?: keyof typeof DIRECTION;
  ease?: (x: number) => number;
};

/**
 * - A helper function to organize the options for the animation.
 * @param animatedValuesOptions - options: `{name: {from: number, to: number, ...}, ...}`
 * @param defaults - changes the default values for each option.
 * @example
 * ```javascript
 * import animare, { organize } from 'animare';
 *
 * const { from, to, duration, get } = organize({
 *  opacity: { to: 1 },
 *  width: { from: 50, to: 100, duration: 1000 },
 *  color: { from: 'red', to: 'orange', duration: 1500 },
 * });
 *
 * animare({ from, to, duration }, values => {
 *  const { opacity, width, color } = get(values);
 *  // ...
 * });
 * ```
 */
export function organize<T extends { [key in keyof T]: organizeOptions<T[key]['to'] extends string ? string : number> }>(
  animatedValuesOptions: T,
  defaults: Omit<organizeOptions, 'to'> = {}
) {
  defaults.from ??= 0;
  defaults.duration ??= 350;
  defaults.delay ??= 0;
  defaults.delayOnce ??= false;
  defaults.repeat ??= 0;
  defaults.direction ??= 'normal';
  defaults.ease ??= x => x;

  const typeColor: { [key in keyof T]: { from: number[]; to: number[] } } = Object.create(null);

  const ent = Object.entries<organizeOptions<T[keyof T]['to'] extends string ? string : number>>(animatedValuesOptions),
    from = ent.map(e => {
      if (typeof e[1].from === 'string') {
        if (typeof animatedValuesOptions[e[0] as keyof T].to === 'number')
          throw new Error(`\n\n⛔ [animare] ➡️ [organize] ➡️ [${e[0]}] \`to\` should match the type of \`from\`\n\n`);
        return 0;
      }
      return e[1].from ?? defaults.from;
    }) as number[],
    to = ent.map(e => {
      if (typeof e[1].to === 'string') {
        if (typeof animatedValuesOptions[e[0] as keyof T].from === 'number')
          throw new Error(`\n\n⛔ [animare] ➡️ [organize] ➡️ [${e[0]}] \`from\` should match the type of \`to\`\n\n`);

        typeColor[e[0] as keyof T] = {
          from: colorToArr((animatedValuesOptions[e[0] as keyof T].from as string) ?? '#ffffff'),
          to: colorToArr(animatedValuesOptions[e[0] as keyof T].to as string),
        };
        return 1;
      }
      return e[1].to;
    }) as number[],
    duration = ent.map(e => e[1].duration ?? defaults.duration) as number[],
    delay = ent.map(e => e[1].delay ?? defaults.delay) as number[],
    delayOnce = ent.map(e => e[1].delayOnce ?? defaults.delayOnce) as boolean[],
    repeat = ent.map(e => e[1].repeat ?? defaults.repeat) as number[],
    direction = ent.map(e => e[1].direction ?? defaults.direction) as (keyof typeof DIRECTION)[],
    ease = ent.map(e => e[1].ease ?? defaults.ease) as ((x: number) => number)[],
    names = Object.keys(animatedValuesOptions) as (keyof T)[];

  const get = (valuesArray: number[]) => {
    if (valuesArray.length !== names.length)
      throw new Error('\n\n⛔ [animare] ➡️ [organize] ➡️ [get] : passed `valuesArray` length does not match !!\n\n');

    const res: { [key in keyof T]: T[key]['to'] } = Object.create(null);
    for (let i = 0; i < valuesArray.length; i++) {
      // pass a color string as rgb
      if (typeColor[names[i]]) {
        res[names[i]] = animateColor(typeColor[names[i]].from, typeColor[names[i]].to, valuesArray[i]) as any;
        continue;
      }

      res[names[i]] = valuesArray[i] as any; // pass a number value
    }
    return res;
  };

  const indexOf = (valueName: keyof T) => {
    for (let i = 0; i < names.length; i++) if (names[i] === valueName) return i;
  };

  const copy = (patchValuesOptions?: Partial<{ [key in keyof T]: organizeOptions }>, patchDefaults?: typeof defaults) => {
    if (!patchValuesOptions && !patchDefaults) return organize(animatedValuesOptions, defaults);

    if (!patchValuesOptions) return organize(animatedValuesOptions, { ...defaults, ...patchDefaults });

    const newOb = { ...animatedValuesOptions };
    const patchKeys = Object.keys(patchValuesOptions) as (keyof T)[];
    for (let i = 0; i < patchKeys.length; i++) {
      const key = patchKeys[i];
      if (key in newOb) newOb[key] = { ...newOb[key], ...patchValuesOptions[key] };
    }

    return organize(newOb, { ...defaults, ...patchDefaults });
  };

  return {
    from,
    to,
    duration,
    delay,
    delayOnce,
    repeat,
    direction,
    ease,
    /** - Get the index of the value name. */
    indexOf,
    /**
     * - Takes an array of numbers and retruns an object
     * - with the same keys as the original object, but with the values of the array.
     */
    get,
    /** - Creates a new copy with patched options.*/
    copy,
  };
}

function animateColor(fromColor: number[], toColor: number[], progress: number) {
  const r = fromColor[0] + (toColor[0] - fromColor[0]) * progress,
    g = fromColor[1] + (toColor[1] - fromColor[1]) * progress,
    b = fromColor[2] + (toColor[2] - fromColor[2]) * progress,
    a = (fromColor[3] ?? 1) + ((toColor[3] ?? 1) - (fromColor[3] ?? 1)) * progress;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
