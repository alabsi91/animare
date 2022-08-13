export const colorsNames = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgrey: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370d8',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#d87093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
};

function HEX_RGB(hex: string) {
  const isValidHex = (h: string) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(h),
    getChunksFromString = (st: string, chunkSize: number) => st.match(new RegExp(`.{${chunkSize}}`, 'g')),
    convertHexUnitTo256 = (hexStr: string) => parseInt(hexStr.repeat(2 / hexStr.length), 16);

  if (!isValidHex(hex)) throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid HEX color format !!\n\n');

  const chunkSize = Math.floor((hex.length - 1) / 3),
    hexArr = getChunksFromString(hex.slice(1), chunkSize) as string[],
    [r, g, b, a] = hexArr.map(convertHexUnitTo256),
    alpha = Math.round(a / 255);

  return [r, g, b, !isNaN(alpha) ? alpha : 1];
}

function HSL_RGB(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
}

/**
 * - converts a color to array of RGB values.
 * - the color could be a string of a`hex`, `rgb`, `hsl` or a `named color`.
 *@example
 * ```js
 * import { colorToArr } from 'animare';
 *
 * colorToArr('#ff0000');           // 👉 [255, 0, 0]
 * colorToArr('rgb(255, 0, 0)');    // 👉 [255, 0, 0]
 * colorToArr('hsl(0, 100%, 50%)'); // 👉 [255, 0, 0]
 * colorToArr('red');               // 👉 [255, 0, 0]
 * ```
 */
export function colorToArr(colorStr: keyof typeof colorsNames): number[];
export function colorToArr(colorStr: string): number[];
export function colorToArr(colorStr: string): number[] {
  colorStr = colorStr.toLowerCase().trim();
  const isRgba = colorStr.startsWith('rgba'),
    isRgb = colorStr.startsWith('rgb'),
    isHex = colorStr.startsWith('#'),
    isNamedColor = Object.prototype.hasOwnProperty.call(colorsNames, 'colorStr'),
    isHsla = colorStr.startsWith('hsla'),
    isHsl = colorStr.startsWith('hsl');

  const regex = /\(([^)]+)/;

  if (isRgba) {
    const match = colorStr.match(regex)?.[1];
    if (!match) throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid RGBA color format !!\n\n');
    const colorValues = match.split(',');
    if (colorValues.length !== 4) throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid RGBA color format !!\n\n');
    const [r, g, b, a] = colorValues.map(v => +v);
    if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
      throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid RGBA color format !!\n\n');
    return [r, g, b, a];
  }

  if (isRgb) {
    const match = colorStr.match(regex)?.[1];
    if (!match) throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid RGB color format !!\n\n');
    const colorValues = match.split(',');
    if (colorValues.length !== 3) throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid RGB color format !!\n\n');
    const [r, g, b] = colorValues.map(v => +v);
    if (isNaN(r) || isNaN(g) || isNaN(b)) throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid RGB color format !!\n\n');
    return [r, g, b, 1];
  }

  if (isHex) return HEX_RGB(colorStr);

  if (isNamedColor) return HEX_RGB(colorsNames[colorStr as keyof typeof colorsNames]);

  if (isHsla) {
    const match = colorStr.match(regex)?.[1];
    if (!match) throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid HSLA color format !!\n\n');
    const colorValues = match.split(',');
    if (colorValues.length !== 4) throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid HSLA color format !!\n\n');
    const [h, s, l, a] = colorValues.map(v => +v.replace('%', '').replace('deg', ''));
    console.log('a :', a);
    if (isNaN(h) || isNaN(s) || isNaN(l) || isNaN(a))
      throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid HSLA color format !!\n\n');
    return [...HSL_RGB(h, s, l), isNaN(a / 100) ? 0 : a / 100];
  }

  if (isHsl) {
    const match = colorStr.match(regex)?.[1];
    if (!match) throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid HSL color format !!\n\n');
    const colorValues = match.split(',');
    if (colorValues.length !== 3) throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid HSL color format !!\n\n');
    const [h, s, l] = colorValues.map(v => +v.replace('%', '').replace('deg', ''));
    if (isNaN(h) || isNaN(s) || isNaN(l)) throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid HSL color format !!\n\n');
    return HSL_RGB(h, s, l);
  }

  throw new Error('\n\n⛔ [animare] ➡️ [colorToArr] : Invalid color format !!\n\n');
}
