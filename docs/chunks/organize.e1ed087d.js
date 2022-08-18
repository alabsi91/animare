const I={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};function H(r){const f=p=>/^#([A-Fa-f0-9]{3,4}){1,2}$/.test(p),o=(p,l)=>p.match(new RegExp(".{".concat(l,"}"),"g")),d=p=>parseInt(p.repeat(2/p.length),16);if(!f(r))throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid HEX color format !!

`);const s=Math.floor((r.length-1)/3),t=o(r.slice(1),s),[c,w,a,y]=t.map(d),i=Math.round(y/255);return[c,w,a,isNaN(i)?1:i]}function R(r,f,o){f/=100,o/=100;const d=c=>(c+r/30)%12,s=f*Math.min(o,1-o),t=c=>o-s*Math.max(-1,Math.min(d(c)-3,Math.min(9-d(c),1)));return[Math.round(255*t(0)),Math.round(255*t(8)),Math.round(255*t(4))]}function F(r){r=r.toLowerCase().trim();const f=r.startsWith("rgba"),o=r.startsWith("rgb"),d=r.startsWith("#"),s=Object.prototype.hasOwnProperty.call(I,"colorStr"),t=r.startsWith("hsla"),c=r.startsWith("hsl"),w=/\(([^)]+)/;if(f){var a;const l=(a=r.match(w))===null||a===void 0?void 0:a[1];if(!l)throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid RGBA color format !!

`);const m=l.split(",");if(m.length!==4)throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid RGBA color format !!

`);const[b,g,h,v]=m.map(N=>+N);if(isNaN(b)||isNaN(g)||isNaN(h)||isNaN(v))throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid RGBA color format !!

`);return[b,g,h,v]}if(o){var y;const l=(y=r.match(w))===null||y===void 0?void 0:y[1];if(!l)throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid RGB color format !!

`);const m=l.split(",");if(m.length!==3)throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid RGB color format !!

`);const[b,g,h]=m.map(v=>+v);if(isNaN(b)||isNaN(g)||isNaN(h))throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid RGB color format !!

`);return[b,g,h,1]}if(d)return H(r);if(s)return H(I[r]);if(t){var i;const l=(i=r.match(w))===null||i===void 0?void 0:i[1];if(!l)throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid HSLA color format !!

`);const m=l.split(",");if(m.length!==4)throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid HSLA color format !!

`);const[b,g,h,v]=m.map(N=>+N.replace("%","").replace("deg",""));if(console.log("a :",v),isNaN(b)||isNaN(g)||isNaN(h)||isNaN(v))throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid HSLA color format !!

`);return[...R(b,g,h),isNaN(v/100)?0:v/100]}if(c){var p;const l=(p=r.match(w))===null||p===void 0?void 0:p[1];if(!l)throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid HSL color format !!

`);const m=l.split(",");if(m.length!==3)throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid HSL color format !!

`);const[b,g,h]=m.map(v=>+v.replace("%","").replace("deg",""));if(isNaN(b)||isNaN(g)||isNaN(h))throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid HSL color format !!

`);return R(b,g,h)}throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [colorToArr] : Invalid color format !!

`)}function $(r){var f,o,d,s,t,c,w;let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};(f=a.from)!==null&&f!==void 0||(a.from=0),(o=a.duration)!==null&&o!==void 0||(a.duration=350),(d=a.delay)!==null&&d!==void 0||(a.delay=0),(s=a.delayOnce)!==null&&s!==void 0||(a.delayOnce=!1),(t=a.repeat)!==null&&t!==void 0||(a.repeat=0),(c=a.direction)!==null&&c!==void 0||(a.direction="normal"),(w=a.ease)!==null&&w!==void 0||(a.ease=n=>n);const y=Object.create(null),i=Object.entries(r),p=i.map(n=>{var e;if(typeof n[1].from=="string"){if(typeof r[n[0]].to=="number")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [organize] \u27A1\uFE0F [`.concat(n[0],"] `to` should match the type of `from`\n\n"));return 0}return(e=n[1].from)!==null&&e!==void 0?e:a.from}),l=i.map(n=>{if(typeof n[1].to=="string"){var e;if(typeof r[n[0]].from=="number")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [organize] \u27A1\uFE0F [`.concat(n[0],"] `from` should match the type of `to`\n\n"));return y[n[0]]={from:F((e=r[n[0]].from)!==null&&e!==void 0?e:"#ffffff"),to:F(r[n[0]].to)},1}return n[1].to}),m=i.map(n=>{var e;return(e=n[1].duration)!==null&&e!==void 0?e:a.duration}),b=i.map(n=>{var e;return(e=n[1].delay)!==null&&e!==void 0?e:a.delay}),g=i.map(n=>{var e;return(e=n[1].delayOnce)!==null&&e!==void 0?e:a.delayOnce}),h=i.map(n=>{var e;return(e=n[1].repeat)!==null&&e!==void 0?e:a.repeat}),v=i.map(n=>{var e;return(e=n[1].direction)!==null&&e!==void 0?e:a.direction}),N=i.map(n=>{var e;return(e=n[1].ease)!==null&&e!==void 0?e:a.ease}),k=Object.keys(r);return{from:p,to:l,duration:m,delay:b,delayOnce:g,repeat:h,direction:v,ease:N,indexOf:n=>{for(let e=0;e<k.length;e++)if(k[e]===n)return e},get:n=>{if(n.length!==k.length)throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [organize] \u27A1\uFE0F [get] : passed \`valuesArray\` length does not match !!

`);const e=Object.create(null);for(let u=0;u<n.length;u++){if(y[k[u]]){e[k[u]]=q(y[k[u]].from,y[k[u]].to,n[u]);continue}e[k[u]]=n[u]}return e},copy:(n,e)=>{if(!n&&!e)return $(r,a);if(!n)return $(r,{...a,...e});const u={...r},T=Object.keys(n);for(let E=0;E<T.length;E++){const A=T[E];A in u&&(u[A]={...u[A],...n[A]})}return $(u,{...a,...e})}}}function q(r,f,o){var d,s,t;const c=r[0]+(f[0]-r[0])*o,w=r[1]+(f[1]-r[1])*o,a=r[2]+(f[2]-r[2])*o,y=((d=r[3])!==null&&d!==void 0?d:1)+(((s=f[3])!==null&&s!==void 0?s:1)-((t=r[3])!==null&&t!==void 0?t:1))*o;return"rgba(".concat(c,", ").concat(w,", ").concat(a,", ").concat(y,")")}export{$ as o};
