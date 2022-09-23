var b;(function(n){n.normal="normal",n.reverse="reverse",n.alternate="alternate",n["alternate-reverse"]="alternate-reverse"})(b||(b={}));var B;(function(n){n.wait="wait",n.immediate="immediate"})(B||(B={}));function Le(n,ve){var ae,ie,oe,se,le,ue,fe,de,ye;if(typeof n!="object"||Array.isArray(n))throw new Error(`

\u26D4 [animare] : expects an object as the first argument. 

`);n.to=Array.isArray(n.to)?n.to:[n.to];const Te={...n};(ae=n.from)!==null&&ae!==void 0||(n.from=0),(ie=n.delay)!==null&&ie!==void 0||(n.delay=0),(oe=n.delayOnce)!==null&&oe!==void 0||(n.delayOnce=!1),(se=n.duration)!==null&&se!==void 0||(n.duration=350),(le=n.direction)!==null&&le!==void 0||(n.direction=b.normal),(ue=n.repeat)!==null&&ue!==void 0||(n.repeat=0),(fe=n.ease)!==null&&fe!==void 0||(n.ease=e=>e),(de=n.autoPlay)!==null&&de!==void 0||(n.autoPlay=!0),(ye=n.type)!==null&&ye!==void 0||(n.type=B.immediate),typeof n.from=="function"&&(n.from=n.to.map((e,t)=>n.from(t))),typeof n.delay=="function"&&(n.delay=n.to.map((e,t)=>n.delay(t))),typeof n.duration=="function"&&(n.duration=n.to.map((e,t)=>n.duration(t))),typeof n.repeat=="function"&&(n.repeat=n.to.map((e,t)=>n.repeat(t)));const me=e=>{if(typeof e.from!="number"&&!Array.isArray(e.from)||Array.isArray(e.from)&&e.from.some(t=>typeof t!="number"))throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [options] : \`from\` must be a number or an array of numbers. !!

`);if(typeof e.to!="number"&&!Array.isArray(e.to)||Array.isArray(e.to)&&e.to.some(t=>typeof t!="number"))throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [options] : \`to\` must be a number or an array of numbers. !!

`);if(typeof e.delay!="number"&&!Array.isArray(e.delay)||Array.isArray(e.delay)&&e.delay.some(t=>typeof t!="number"||t<0)||typeof e.delay=="number"&&e.delay<0)throw new Error("\n\n\u26D4 [animare] \u27A1\uFE0F [options] : `delay` must be a number or an array of numbers greater than or equal to `0`. !!\n\n");if(typeof e.delayOnce!="boolean"&&!Array.isArray(e.delayOnce)||Array.isArray(e.delayOnce)&&e.delayOnce.some(t=>typeof t!="boolean"))throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [options] : \`delayOnce\` must be a boolean or an array of booleans. !!

`);if(typeof e.duration!="number"&&!Array.isArray(e.duration)||Array.isArray(e.duration)&&e.duration.some(t=>typeof t!="number"||t<0)||typeof e.duration=="number"&&e.duration<0)throw new Error("\n\n\u26D4 [animare] \u27A1\uFE0F [options] : `duration` must be a number or an array of numbers greater than or equal to `0` !!\n\n");if(typeof e.direction=="string"&&!Object.keys(b).includes(e.direction)||Array.isArray(e.direction)&&e.direction.some(t=>typeof t!="string"&&!Object.keys(b).includes(t)))throw new Error("\n\n\u26D4 [animare] \u27A1\uFE0F [options] : `direction` must be a string or an array of strings and one of the following: "+Object.values(b).join(", ")+` !!

`);if(typeof e.repeat!="number"&&!Array.isArray(e.repeat)||Array.isArray(e.repeat)&&e.repeat.some(t=>typeof t!="number"))throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [options] : \`repeat\` must be a number or an array of numbers. !!

`);if(typeof e.ease!="function"&&!Array.isArray(e.ease)||Array.isArray(e.ease)&&e.ease.some(t=>typeof t!="function"))throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [options] : \`ease\` must be a function or an array of functions. !!

`);if(typeof e.autoPlay<"u"&&typeof e.autoPlay!="boolean")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [options] : \`autoPlay\` must be a boolean. !!

`);if(typeof ve!="function")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [callback] must be a function. !!

`)};me(n);let g=[],Y,J,L,ce,D,re,c=!1,Z,K,S,Q,T=Array.isArray(n.repeat)?[...n.repeat]:[...n.to].fill(n.repeat),h={repeat:0,speed:1},w=new Array(n.to.length).fill(h.repeat);const be=new Array(n.to.length).fill(0),P=new Array(n.to.length).fill(1),z=new Set,ne=[],i=[{options:{...n},userInput:Te}],f=new Array(n.to.length).fill(0),j={onProgress:[],onStart:[],onFinish:[]},he=new Set,R={isExist:!1,add:()=>{R.isExist||(document.addEventListener("visibilitychange",R.handle,!1),R.isExist=!0)},remove:()=>{document.removeEventListener("visibilitychange",R.handle,!1),R.isExist=!1},handle:()=>{document.visibilityState==="hidden"&&(Q=performance.now())}},pe=e=>{R.add(),g=new Array(n.to.length).fill(e),J=Y=e,j.onStart.forEach(t=>{let{cb:u}=t;return u()}),ce=!0,V(e),ce=!1},V=e=>{if(Q){const a=performance.now()-Q;g=g.map(v=>v+a),J=J+a,Q=null}const t=[];for(let r=0;r<n.to.length;r++){var u,p,E,x,q,F,M,o;if(z.has(r)){t.push(ne[r]);continue}const a=i[f[r]].options,v=Array.isArray(a.direction)?(u=a.direction[r])!==null&&u!==void 0?u:b.normal:a.direction,I=Array.isArray(a.repeat)?(p=a.repeat[r])!==null&&p!==void 0?p:0:a.repeat,N=Array.isArray(a.delayOnce)?(E=a.delayOnce[r])!==null&&E!==void 0?E:!1:a.delayOnce,U=Array.isArray(a.ease)?(x=a.ease[r])!==null&&x!==void 0?x:X=>X:a.ease,G=(P[r]===2||N&&T[r]<I||N&&w[r]<h.repeat?0:Array.isArray(a.delay)?(q=a.delay[r])!==null&&q!==void 0?q:0:a.delay)*h.speed;let C=v===b.reverse||v===b["alternate-reverse"]&&P[r]===1||v===b.alternate&&P[r]===2;C=c?v!=null&&v.includes(b.alternate)?C:!C:C;let W=Array.isArray(a.duration)?(F=a.duration[r])!==null&&F!==void 0?F:a.duration[a.duration.length-1]:a.duration;W=(v.includes(b.alternate)?W/2:W)*h.speed;const ee=C?a.to[r]:Array.isArray(a.from)?(M=a.from[r])!==null&&M!==void 0?M:0:a.from,Ce=C?Array.isArray(a.from)?(o=a.from[r])!==null&&o!==void 0?o:0:a.from:a.to[r];if(e-g[r]-G<0){var d;t.push((d=ne[r])!==null&&d!==void 0?d:ee);continue}let H=(e-(g[r]+G))/W;H=H>=1||Number.isNaN(H)?1:H;const Oe=ee+(Ce-ee)*U(H);if(t.push(Oe),be[r]=H,H===1&&(ne[r]=Oe),e-(g[r]+G)<W)continue;if(v!=null&&v.includes(b.alternate)&&P[r]===1){g[r]=e,P[r]=2;continue}if(I>0&&T[r]>0){T[r]--,g[r]=e,P[r]=1;continue}if(I===-1){T[r]===-1&&(T[r]=-2),g[r]=e,P[r]=1;continue}if((c&&f[r]>0||!c&&f[r]<i.length-1)&&i[c?f[r]-1:f[r]+1].options.type===B.immediate){var A;c?f[r]--:f[r]++;const ge=i[f[r]].options;T[r]=Array.isArray(ge.repeat)?(A=ge.repeat[r])!==null&&A!==void 0?A:0:ge.repeat,P[r]=1,g[r]=e;continue}const Se=c&&f[r]===0||!c&&f[r]===i.length-1;if(Se&&(h.repeat>0&&w[r]>0||h.repeat===-1&&Se)){var O;if((i==null||(O=i[c?i.length-1:0])===null||O===void 0?void 0:O.options.type)===B.immediate){var l;h.repeat!==-1&&w[r]--,w[r]===-1&&(w[r]=-2);const X=i[c?i.length-1:0].options;T[r]=Array.isArray(X.repeat)?(l=X.repeat[r])!==null&&l!==void 0?l:0:X.repeat,f[r]=c?i.length-1:0,P[r]=1,z.delete(r),g[r]=e;continue}}z.add(r)}t.length!==n.to.length&&console.warn(`

\u26A0\uFE0F [animare] \u27A1\uFE0F callbackParams length is not equal to to length 

`);const y=isFinite(Math.round(1e3/(e-Y)))?Math.round(1e3/(e-Y)):0;Y=e;const k=z.size===n.to.length&&f.every(r=>c?r===0:r===i.length-1)&&T.every(r=>r===0)&&w.every(r=>r===0),s=~~(e-J),m=L===-1?-1:+(s/L>1?1:s/L).toFixed(3);if(ve(t,{fps:y,isFirstFrame:ce,isFinished:k,isReversePlay:c,time:s,timelineProgress:m,progress:be,timelineIndex:f,repeatCount:T,timelineRepeatCount:w,alternateCycle:P,play:$,reverse:Ae,pause:Ee,stop:Pe,getOptions:xe,setOptions:te}),m!==-1){for(let r=0;r<j.onProgress.length;r++){const a=j.onProgress[r],{at:v,cb:I,id:N}=a;m>=v&&!he.has(N)&&(I(),he.add(N))}if(K){const{at:r,resolve:a}=K;if(m>=r){const v=new Promise(I=>setTimeout(I,0));a(v),K=null}}}if(z.size!==n.to.length&&!re){S=requestAnimationFrame(V);return}if(new Set(f).size!==1&&console.warn(`

\u26A0\uFE0F [animare] \u27A1\uFE0F [timelineAt] array elements are not the same !!

`),c&&f[0]>0||!c&&f[0]<i.length-1){if(i[c?f[0]-1:f[0]+1].options.type!==B.wait)return;f.fill(c?f[0]-1:f[0]+1);const a=i[f[0]].options.repeat;T=Array.isArray(a)?[...a]:[...n.to].fill(a),P.fill(1),z.clear(),g.fill(e),S=requestAnimationFrame(V);return}if(h.repeat>0&&w[0]>0||h.repeat===-1){if(i[c?i.length-1:0].options.type!==B.wait)return;h.repeat!==-1&&w.fill(w[0]-1),w[0]===-1&&w.fill(-2);const a=i[c?i.length-1:0].options;T=Array.isArray(a.repeat)?[...a.repeat]:[...a.to].fill(a.repeat),c?f.fill(i.length-1):f.fill(0),P.fill(1),z.clear(),g.fill(e),S=requestAnimationFrame(V);return}if(j.onFinish.forEach(r=>{let{cb:a}=r;return a()}),Z){const r=new Promise(a=>setTimeout(a,0));Z(r),Z=null}S=null,R.remove(),z.clear()},_=()=>{let e=0;if(h.repeat===-1||i.some(o=>Array.isArray(o.options.repeat)?o.options.repeat.some(d=>d===-1):o.options.repeat===-1))return e=-1,e;const u=c?[...i].reverse():i,p=[];for(let o=0;o<n.to.length;o++){const d=[];for(let A=0;A<h.repeat+1;A++)for(let O=0;O<u.length;O++){var E,x,q,F;const{options:l}=u[O],y=l.type===B.wait,k=Array.isArray(l.delay)?(E=l.delay[o])!==null&&E!==void 0?E:0:l.delay,s=Array.isArray(l.duration)?(x=l.duration[o])!==null&&x!==void 0?x:l.duration[l.duration.length-1]:l.duration,m=(Array.isArray(l.repeat)?(q=l.repeat[o])!==null&&q!==void 0?q:0:l.repeat)+1,r=Array.isArray(l.delayOnce)?(F=l.delayOnce[o])!==null&&F!==void 0?F:!1:l.delayOnce,a=(r&&A===0?s*m+k:r&&A>0?s*m:(k+s)*m)*h.speed;y?d.push(a):d[d.length-1]!==void 0?d[d.length-1]+=a:d.push(a)}p.push(d)}const M=[];for(let o=0;o<p[0].length;o++){const d=[];for(let A=0;A<p.length;A++)d.push(p[A][o]);M.push(d)}return e=M.map(o=>Math.max(...o)).reduce((o,d)=>o+d,0),e+=25*h.repeat,e},we=e=>{S&&cancelAnimationFrame(S);const t=i[e?i.length-1:0].options;T=Array.isArray(t.repeat)?[...t.repeat]:[...t.to].fill(t.repeat),ne.length=0,w=[...n.to].fill(h.repeat),P.fill(1),z.clear(),he.clear(),Y=0,re=!1,D=null,Q=null},$=function(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0;we(!1),e&&te(e,t),c=!1,f.fill(0),L=_(),S=requestAnimationFrame(pe)},Ae=function(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0;we(!0),e&&te(e,t),c=!0,f.fill(i.length-1),L=_(),S=requestAnimationFrame(pe)},Ee=()=>{!S||D||(cancelAnimationFrame(S),D=performance.now(),R.remove())},je=()=>{if(!D){$();return}const t=performance.now()-D;g=g.map(u=>u+t),J=J+t,D=null,Q=null,re=!1,S=requestAnimationFrame(V),R.add()},Pe=function(){(arguments.length>0&&arguments[0]!==void 0?arguments[0]:!0)?$():Ae(),re=!0,S=null,R.remove()},qe=e=>{var t,u,p,E,x,q,F;if(typeof e!="object")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [next] \u27A1\uFE0F [options] : expects an object as the first argument. 

`);if(!Array.isArray(e.to)&&typeof e.to!="number"||Array.isArray(e.to)&&e.to.some(l=>typeof l!="number"))throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [next] \u27A1\uFE0F [options] : \`to\` must be a number or an array of numbers. !!

`);e.to=Array.isArray(e.to)?e.to:[e.to],typeof e.from=="function"&&(e.from=e.to.map((l,y)=>e.from(y))),typeof e.delay=="function"&&(e.delay=e.to.map((l,y)=>e.delay(y))),typeof e.duration=="function"&&(e.duration=e.to.map((l,y)=>e.duration(y))),typeof e.repeat=="function"&&(e.repeat=e.to.map((l,y)=>e.repeat(y)));const M={...e},o={...i[i.length-1]};if(o.options.to.length!==e.to.length)throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [next] \u27A1\uFE0F [options] : \`to\` must have the same length as the previous animation. !!

`);if(typeof e.from>"u")if(Array.isArray(o.options.direction)){const l=[];for(let y=0;y<n.to.length;y++){var d,A;const k=(d=o.options.direction[y])!==null&&d!==void 0?d:b.normal,s=k===b.reverse,m=k===b.alternate,r=Array.isArray(o.options.from)?(A=o.options.from[y])!==null&&A!==void 0?A:0:o.options.from;l[y]=m||s?r:o.options.to[0]}e.from=l}else{var O;const l=o.options.direction,y=l===b.reverse,k=l===b.alternate;(O=e.from)!==null&&O!==void 0||(e.from=k||y?o.options.from:o.options.to)}return(t=e.duration)!==null&&t!==void 0||(e.duration=o.options.duration),(u=e.ease)!==null&&u!==void 0||(e.ease=o.options.ease),(p=e.type)!==null&&p!==void 0||(e.type=o.options.type),(E=e.repeat)!==null&&E!==void 0||(e.repeat=[...e.to].fill(0)),(x=e.direction)!==null&&x!==void 0||(e.direction=b.normal),(q=e.delay)!==null&&q!==void 0||(e.delay=0),(F=e.delayOnce)!==null&&F!==void 0||(e.delayOnce=!1),me(e),i.some(l=>Array.isArray(l.options.repeat)?l.options.repeat.some(y=>y===-1):l.options.repeat===-1)&&console.warn(`

\u26A0\uFE0F [animare] \u27A1\uFE0F [next] Some animations are blocked by infinite repeat !!

`),i.push({options:e,userInput:M}),S&&(L=_()),Fe},ke=e=>{if(typeof e!="object")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [setTimelineOptions] \u27A1\uFE0F [options] : expects an object as the first argument. !!

`);if(e.repeat&&typeof e.repeat!="number")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [setTimelineOptions] \u27A1\uFE0F [options] : \`repeat\` must be a number. !!

`);h={...h,...e},w=[...n.to].fill(h.repeat),S&&(L=_())},Ie=e=>{if(typeof e!="function")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [onStart] : first param must be a callback function. !!

`);const t="onStart_".concat(Math.random()*100);return j.onStart.push({cb:e,id:t}),()=>{j.onStart=j.onStart.filter(u=>u.id!==t)}},Me=e=>{if(typeof e!="function")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [onFinish] : accepts a callback function only. !!

`);const t="onFinish_".concat(Math.random());return j.onFinish.push({cb:e,id:t}),()=>{j.onFinish=j.onFinish.filter(u=>u.id!==t)}},Re=()=>{if(!Z)return new Promise(e=>{Z=e})},De=(e,t)=>{if(typeof e!="number")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [onProgress] :  accepts a number as the first argument. !!

`);if(e<0||e>1)throw new Error("\n\n\u26D4 [animare] \u27A1\uFE0F [onProgress] : first param must be a number between `0` and `1`. !!\n\n");if(typeof t!="function")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [onProgress] :  accepts a callback function only. !!

`);const u="onProgress_".concat(Math.random());return j.onProgress.push({at:e,cb:t,id:u}),()=>{j.onProgress=j.onProgress.filter(p=>p.id!==u)}},ze=e=>{if(typeof e!="number")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [onProgressAsync] : accepta a number as the first argument. !!

`);if(e<0||e>1)throw new Error("\n\n\u26D4 [animare] \u27A1\uFE0F [onProgressAsync] :  first argument must be a number between `0` and `1`. !!\n\n");if(!K)return new Promise(t=>{K={at:e,resolve:t}})},te=function(e){var t;let u=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0;if(typeof e!="object"||Array.isArray(e))throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [setOptions] : expects an object as the first argument. !!

`);if(typeof u!="number")throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [setOptions] : expects a number as the second argument. !!

`);if(u<0||u>=i.length)throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [setOptions] : second argument \`index\` is out of range. !!

`);const p=e.to!==void 0,E=e.duration!==void 0,x=e.delay!==void 0,q=e.repeat!==void 0,F=i?.[u+1],M=[];p&&(e.to=Array.isArray(e.to)?e.to:[e.to]);const o=(t=e.to)!==null&&t!==void 0?t:i[u].options.to;if(typeof e.from=="function"&&(e.from=o.map((s,m)=>e.from(m))),typeof e.delay=="function"&&(e.delay=o.map((s,m)=>e.delay(m))),typeof e.duration=="function"&&(e.duration=o.map((s,m)=>e.duration(m))),typeof e.repeat=="function"&&(e.repeat=o.map((s,m)=>e.repeat(m))),F){p&&F.userInput.from===void 0&&(F.options.from=e.to);for(let s=u+1;s<i.length;s++){const m=i[s];e.ease&&!m.userInput.ease&&(m.options.ease=e.ease),E&&typeof m.userInput.duration>"u"&&(m.options.duration=e.duration,M.push(s))}}if(E||x)for(let s=0;s<f.length;s++){var d,A,O,l,y,k;if(!(f[s]===u||M.includes(f[s])))continue;const r=i[u].options,a=Array.isArray(r.duration)?(d=r.duration[s])!==null&&d!==void 0?d:r.duration[r.duration.length-1]:r.duration,v=E?Array.isArray(e.duration)?(A=e.duration[s])!==null&&A!==void 0?A:e.duration[e.duration.length-1]:e.duration:a,I=Array.isArray(r.delayOnce)?(O=r.delayOnce[s])!==null&&O!==void 0?O:!1:r.delayOnce,N=Array.isArray(r.repeat)?(l=r.repeat[s])!==null&&l!==void 0?l:0:r.repeat,U=i[f[s]].options.delay,G=x&&f[s]===u?e.delay:U,C=P[s]===2||I&&T[s]<N||I&&w[s]<h.repeat?0:Array.isArray(U)?(y=U[s])!==null&&y!==void 0?y:0:U,W=P[s]===2||I&&T[s]<N||I&&w[s]<h.repeat?0:Array.isArray(G)?(k=G[s])!==null&&k!==void 0?k:0:G,ee=(performance.now()-(g[s]+C))/a;g[s]=performance.now()-v*ee-W,D&&(g[s]=D-v*((D-(g[s]+C))/a)-W)}i[u].options={...i[u].options,...e},i[u].userInput={...i[u].userInput,...e},(E||x||q)&&(L=_()),me(i[u].options)},xe=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;if(e>i.length-1)throw new Error(`

\u26D4 [animare] \u27A1\uFE0F [getOptions] : first argument \`index\` is out of range. !!

`);return i[e].options},Fe={play:$,reverse:Ae,pause:Ee,resume:je,stop:Pe,next:qe,setTimelineOptions:ke,onStart:Ie,onFinish:Me,onFinishAsync:Re,onProgress:De,onProgressAsync:ze,setOptions:te,getOptions:xe};return n.autoPlay&&$(),Fe}export{Le as a};
