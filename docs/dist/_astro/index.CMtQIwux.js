import{r as O}from"./index.DhYZZe0J.js";var z={exports:{}},T={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var K=O,Q=Symbol.for("react.element"),Z=Symbol.for("react.fragment"),Y=Object.prototype.hasOwnProperty,G=K.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,X={key:!0,ref:!0,__self:!0,__source:!0};function U(e,t,i){var r,o={},s=null,n=null;i!==void 0&&(s=""+i),t.key!==void 0&&(s=""+t.key),t.ref!==void 0&&(n=t.ref);for(r in t)Y.call(t,r)&&!X.hasOwnProperty(r)&&(o[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)o[r]===void 0&&(o[r]=t[r]);return{$$typeof:Q,type:e,key:s,ref:n,props:o,_owner:G.current}}T.Fragment=Z;T.jsx=U;T.jsxs=U;z.exports=T;var Oe=z.exports;let b=function(e){return e.Forward="forward",e.Reverse="reverse",e.Alternate="alternate",e.AlternateReverse="alternate-reverse",e}({}),P=function(e){return e.AfterPrevious="after-previous",e.WithPrevious="with-previous",e.FromStart="from-start",e}({}),g=function(e){return e.Play="play",e.Resume="resume",e.Pause="pause",e.Stop="stop",e.Complete="complete",e.Repeat="repeat",e}({});function xe(e){return e}class ee{#n=Object.assign({});#t=null;#i=null;#e=null;#r=null;#s=null;#o=null;#u(t,i){return this.#n[t]?this.#n[t].delete(i):!1}on(t,i){return this.#n[t]||(this.#n[t]=new Set),this.#n[t].add(i),()=>this.#u(t,i)}once(t,i){const r=this.on(t,()=>{i(),r()});return()=>this.#u(t,i)}emit(t){if(this.#n[t]){if(this.#n[t].forEach(i=>i()),t===g.Play){this.#t?.(),this.#t=null;return}if(t===g.Resume){this.#i?.(),this.#i=null;return}if(t===g.Pause){this.#e?.(),this.#e=null;return}if(t===g.Complete){this.#s?.(),this.#s=null;return}if(t===g.Repeat){this.#o?.(),this.#o=null;return}t===g.Stop&&(this.#r?.(),this.#r=null)}}clear(){this.#n=Object.assign({})}onPlayAsync(){if(this.#t===null)return new Promise(t=>{this.#t=t})}onResumeAsync(){if(this.#i===null)return new Promise(t=>{this.#i=t})}onPauseAsync(){if(this.#e===null)return new Promise(t=>{this.#e=t})}onStopAsync(){if(this.#r===null)return new Promise(t=>{this.#r=t})}onCompleteAsync(){if(this.#s===null)return new Promise(t=>{this.#s=t})}onRepeatAsync(){if(this.#o===null)return new Promise(t=>{this.#o=t})}}function te(e){return typeof e=="number"&&!Number.isNaN(e)&&Number.isFinite(e)}function ne(e){const t=parseFloat(e);return te(t)?t/100:0}function x(e){return e<0?0:e>1?1:e}function N(e,t,i){return e<t?t:e>i?i:e}function k(e){const t=e;for(var i=arguments.length,r=new Array(i>1?i-1:0),o=1;o<i;o++)r[o-1]=arguments[o];for(let s=0;s<r.length;s++){const n=r[s];for(const l in n)t[l]=n[l]}return t}class ie{#n;#t;#i;#e;#r;#s;#o;#u;#y=0;#m;#a=0;#f=0;#c=0;#p=!1;#d=!1;#l;#g;#h;#_(t){let i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:.001;return Math.abs(this.#a-t)<i}#P(t){let i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:5;return Math.abs(this.#c-t)<i}get info(){return{name:this.animationRef.name,index:this.#n,value:this.#s,progress:this.#a,overallProgress:this.#f,elapsedTime:this.#c,isFinished:this.#p,delayCount:this.#u,playCount:this.#m,isPlaying:this.#d,isProgressAt:this.#_.bind(this),isTimeAt:this.#P.bind(this)}}constructor(t,i,r){this.#n=r,this.animationRef=t,this.#h=i,this.Setup()}Setup(){this.#g=re(this.animationRef.direction),this.#l=se(this.animationRef.direction),this.#m=0,this.#u=0,this.#r=this.#l?this.animationRef.to:this.animationRef.from,this.#s=this.#l?this.animationRef.to:this.animationRef.from,this.#o=this.#l?this.animationRef.from:this.animationRef.to;const t=this.animationRef.delayCount===0?0:this.animationRef.delay,i=this.animationRef.duration*this.animationRef.playCount+t*this.animationRef.delayCount;switch(this.#n===0?P.FromStart:this.animationRef.timing){case P.FromStart:this.#t=t,this.#i=this.#t+this.animationRef.duration,this.#e=0,this.endPoint=i;break;case P.AfterPrevious:if(!this.#h)throw new Error("The previous animation is not defined.");this.#t=this.#h.endPoint+t,this.#i=this.#t+this.animationRef.duration,this.#e=this.#h.endPoint,this.endPoint=this.#e+i;break;case P.WithPrevious:if(!this.#h)throw new Error("The previous animation is not defined.");this.#t=this.#h.#e+t,this.#i=this.#t+this.animationRef.duration,this.#e=this.#h.#e,this.endPoint=this.#e+i;break}}Update(t){if(this.animationRef.playCount!==0){if(t>=this.endPoint){this.#d=!1,this.#p=!0,this.#m=this.animationRef.playCount,this.#u=this.animationRef.delayCount,this.#a=1,this.#f=1,this.#c=this.endPoint-this.#e,this.#s=this.animationRef.direction===b.Reverse||this.animationRef.direction===b.Alternate?this.animationRef.from:this.animationRef.to;return}if(t<this.#e){this.#d=!1,this.#p=!1,this.#m=0,this.#u=0,this.#a=0,this.#f=0,this.#c=0,this.#s=this.#l?this.animationRef.to:this.animationRef.from;return}this.#d=!0,this.#f=x((t-this.#e)/(this.endPoint-this.#e)),this.#w(t)}}Set(t){k(this.animationRef,t),B(this.animationRef)}#w(t){const i=this.animationRef.delayCount,r=this.animationRef.duration,o=r*(this.animationRef.playCount-i),s=this.animationRef.duration+this.animationRef.delay,n=s*i+this.animationRef.delay*i,a=(n+o)*this.#f;if(n&&a<=n){const u=N(Math.floor(a/s),0,i-1),d=i===0?0:this.animationRef.delay;this.#u=u+1,this.#m=u+1,this.#t=this.#e+s*u+d}else{const u=a-n,d=i+N(Math.floor(u/r),0,this.animationRef.playCount-1);this.#u=i,this.#m=d+1,this.#t=this.#e+n+r*(d-i)}this.#i=this.#t+this.animationRef.duration,this.#c=t-this.#t,this.#a=x(this.#c/(this.#i-this.#t));const f=this.#A();this.#s=this.#r+(this.#o-this.#r)*this.animationRef.ease(f)}#A(){if(!this.#g)return this.#a;const t=(this.#a<=.5?this.#a:this.#a-.5)*2;return this.#y=this.#a<=.5?0:1,this.#y===0?(this.#r=this.#l?this.animationRef.to:this.animationRef.from,this.#o=this.#l?this.animationRef.from:this.animationRef.to,t):(this.#r=this.#l?this.animationRef.from:this.animationRef.to,this.#o=this.#l?this.animationRef.to:this.animationRef.from,t)}}const A={from:0,duration:350,delay:0,delayCount:1,playCount:1,direction:b.Forward,timing:P.AfterPrevious,ease:e=>e};function re(e){return e===b.Alternate||e===b.AlternateReverse}function se(e){return e===b.Reverse||e===b.AlternateReverse}function B(e){if(!e.name)throw new Error("Animation `name` is required");if(typeof e.to!="number")throw new Error("The `to` value is required");if(typeof e.duration=="number"&&e.duration<0)throw new Error("The `duration` value cannot be a negative value.");if(typeof e.playCount=="number"&&e.playCount<0)throw new Error("The `playCount` value cannot be a negative value.");if(typeof e.delayCount=="number"&&e.delayCount<0)throw new Error("The `delayCount` value cannot be a negative value.");if(typeof e.playCount=="number"&&typeof e.delayCount=="number"&&e.delayCount>e.playCount)throw new Error("The `delayCount` value cannot be greater than the `playCount` value.")}function ae(e,t,i){const r=p=>typeof p=="function"?p(i):p,o=r(e.from)??t.from??A.from,s=r(e.duration)??t.duration??A.duration,n=r(e.delay)??t.delay??A.delay,l=r(e.playCount)??t.playCount??A.playCount,a=typeof n=="number"?r(e.delayCount)??t.delayCount??l:0,f=r(e.direction)??t.direction??A.direction,u=r(e.timing)??t.timing??A.timing;return{name:e.name,to:e.to,from:o,duration:s,delay:n,playCount:l,delayCount:a,direction:f,timing:u,ease:e.ease??t.ease??A.ease}}function oe(e,t){const i=[];for(let r=0;r<e.length;r++){const o=e[r],s=ae(o,t,r);r===0&&(s.timing=P.FromStart),B(s),i.push(s)}return i}function ue(e){return e.timelinePlayCount===0&&console.warn("The `timelinePlayCount` with the value `0` will make the timeline not play."),{timelinePlayCount:e.timelinePlayCount??1,autoPlay:e.autoPlay??!0}}function le(e){const t=[];for(let i=0;i<e.length;i++){const r=e[i],o=t[i-1];if(i===0&&r.timing!==P.FromStart)throw new Error(`The timing value in the first animation must be "${P.FromStart}".`);t.push(new ie(r,o,i))}return t}function V(e){const t=Math.max(...e.map(i=>i.endPoint));return t===1/0?Number.MAX_SAFE_INTEGER:t}function q(e,t){let i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const r=ue(i),o=oe(e,i),s=new ee,n={__startTime:0,__pauseTime:0,__lastFrameTime:0,__animations:[],__requestAnimationId:null,__startProgress:0,progress:0,duration:0,elapsedTime:0,isPlaying:!1,isPaused:!1,isFinished:!1,isFirstFrame:!0,playCount:1,fps:60,isProgressAt(h){let m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:.001;return Math.abs(this.progress-h)<m},isTimeAt(h){let m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:5;return Math.abs(this.elapsedTime-h)<m}};n.__animations=le(o),n.duration=V(n.__animations);const l={isRegistered:!1,hiddenTime:0,add(){this.isRegistered||(document.addEventListener("visibilitychange",this.handle),this.isRegistered=!0)},remove(){document.removeEventListener("visibilitychange",this.handle),this.isRegistered=!1},handle(){if(document.visibilityState==="hidden"){l.hiddenTime=performance.now();return}document.visibilityState==="visible"&&(n.__startTime+=performance.now()-l.hiddenTime,l.hiddenTime=0)}},a=Object.create(null);a.length=e.length;const f=(h,m)=>{n.elapsedTime=h-n.__startTime+n.__startProgress*n.duration,n.progress=x(n.elapsedTime/n.duration),n.fps=Math.round(1e3/(h-n.__lastFrameTime||16.66)),n.__lastFrameTime=h;for(let c=0;c<n.__animations.length;c++){const w=n.__animations[c];w.Update(n.elapsedTime);const _=w.info;a[_.name]=_,a[_.index]=_}if(n.progress!==1){if(t(a,n),m)return;n.__requestAnimationId=requestAnimationFrame(f);return}if(n.playCount===r.timelinePlayCount){n.isFinished=!0,n.isPlaying=!1,l.remove(),t(a,n),s.emit(g.Complete),n.__requestAnimationId=null;return}m||(t(a,n),s.emit(g.Repeat),n.__requestAnimationId=requestAnimationFrame(c=>{n.__startTime=c,n.__lastFrameTime=c,n.playCount++,n.__startProgress=0,f(c)}))},u=function(h){let m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;if(r.timelinePlayCount===0||m===0){console.warn("[seek] Cannot seek the timeline because the `playCount` is set to 0.");return}if(r.timelinePlayCount>0&&typeof m=="number"&&m>r.timelinePlayCount){console.warn("[seek] Cannot seek the timeline because the param `playCount` is greater than the `timelinePlayCount`.");return}if(n.duration===0){console.warn("[seek] Cannot seek the timeline because the `duration` is 0.");return}if(typeof h=="number"&&(h<0&&(h=0,console.warn("[seek] The `startFrom` param cannot be a negative value.")),h>n.duration&&(h=n.duration,console.warn("[seek] The `startFrom` param cannot be greater than the duration of the timeline.")),h=N(h/n.duration,0,1)),typeof h=="string"&&(h=ne(h),h<0&&(h=0,console.warn("[seek] The `startFrom` param cannot be a negative percentage.")),h>1&&(h=1,console.warn("[seek] The `startFrom` param percentage cannot be greater than 1."))),n.isPlaying){const c=performance.now();n.__startTime=c,n.__lastFrameTime=c}n.playCount=m,n.__startProgress=h},d=function(){let h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0,m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;n.isPlaying&&n.__requestAnimationId!==null&&(cancelAnimationFrame(n.__requestAnimationId),n.__requestAnimationId=null),u(h,m),n.__requestAnimationId=requestAnimationFrame(c=>{n.__startTime=c,n.__lastFrameTime=c,n.progress=n.__startProgress,n.isPlaying=n.progress!==1,n.isFinished=n.progress===1,n.isPaused=!1,n.isFirstFrame=!0,l.add(),s.emit(g.Play),f(c),n.isFirstFrame=!1})},p=()=>{if(n.isPlaying&&n.__requestAnimationId!==null){console.warn("[playOneFrame] The timeline is already playing.");return}const h=performance.now();n.__startTime=h,n.__lastFrameTime=h,n.progress=n.__startProgress,n.isPlaying=!1,n.isFinished=n.progress===1,n.isPaused=!1,n.isFirstFrame=!1,f(h,!0)},C=()=>{if(!n.isPlaying){console.warn("[pause] The timeline is not playing.");return}if(n.isPaused){console.warn("[pause] The timeline is already paused.");return}if(!n.__requestAnimationId){console.error("[pause] `__requestAnimationId` is null.");return}cancelAnimationFrame(n.__requestAnimationId),n.__requestAnimationId=null,n.__pauseTime=performance.now(),n.isPaused=!0,n.isPlaying=!1,l.remove(),s.emit(g.Pause)},E=()=>{if(n.isPlaying){console.warn("[resume] The timeline is already playing.");return}if(!n.isPaused){console.warn("[resume] The timeline is not paused, playing from the start."),d();return}n.__startTime+=performance.now()-n.__pauseTime,n.__pauseTime=0,n.isPaused=!1,n.isPlaying=!0,l.add(),s.emit(g.Resume),n.__requestAnimationId=requestAnimationFrame(f)},R=function(){let h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:n.duration,m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:r.timelinePlayCount;n.isPlaying&&n.__requestAnimationId!==null&&(cancelAnimationFrame(n.__requestAnimationId),n.__requestAnimationId=null,n.isPlaying=!1),u(h,m),p(),s.emit(g.Stop)},M=h=>{for(let m=0;m<h.length;m++){const c=h[m];if(!c.name)throw new Error("[updateValues] Animation name is required.");const w=n.__animations.find(_=>_.animationRef.name===c.name);if(!w)throw new Error(`[updateValues] Animation with name '${c.name}' not found.`);w.Set(c)}for(let m=0;m<a.length;m++)n.__animations[m].Setup();n.duration=V(n.__animations)};return r.autoPlay&&d(),{timelineInfo:n,animationsInfo:a,updateValues:M,play:d,playOneFrame:p,resume:E,pause:C,stop:R,seek:u,on:s.on.bind(s),once:s.once.bind(s),onCompleteAsync:s.onCompleteAsync.bind(s),onPlayAsync:s.onPlayAsync.bind(s),onResumeAsync:s.onResumeAsync.bind(s),onPauseAsync:s.onPauseAsync.bind(s),onStopAsync:s.onStopAsync.bind(s),onRepeatAsync:s.onRepeatAsync.bind(s),clearEvents:s.clear.bind(s)}}function he(e,t){if(typeof e.to>"u")throw new Error("[group] The `to` value is required");e.to=typeof e.to=="number"?[e.to]:e.to;const i=e.to.length,r=u=>typeof u=="number",o=u=>typeof u=="object"&&!Array.isArray(u),s=u=>typeof u=="object"&&!Array.isArray(u),n=u=>typeof u=="function",l=u=>new Array(i).fill(u),a={to:e.to,from:r(e.from)?l(e.from):e.from,delay:r(e.delay)?l(e.delay):e.delay,delayCount:r(e.delayCount)?l(e.delayCount):e.delayCount,playCount:r(e.playCount)?l(e.playCount):e.playCount,direction:o(e.direction)?l(e.direction):e.direction,timing:s(e.timing)?l(e.timing):e.timing,duration:r(e.duration)?l(e.duration):e.duration,ease:n(e.ease)?l(e.ease):e.ease},f=new Array(i);for(let u=0;u<i;u++)f[u]={name:u.toString(),to:a.to[u],from:Array.isArray(a.from)?a.from[u]:a.from,delay:Array.isArray(a.delay)?a.delay[u]:a.delay,delayCount:Array.isArray(a.delayCount)?a.delayCount[u]:a.delayCount,playCount:Array.isArray(a.playCount)?a.playCount[u]:a.playCount,direction:Array.isArray(a.direction)?a.direction[u]:a.direction,timing:u===0?P.FromStart:Array.isArray(a.timing)?a.timing[u]:a.timing,duration:Array.isArray(a.duration)?a.duration[u]:a.duration,ease:Array.isArray(a.ease)?a.ease[u]:a.ease};return q(f,t,{autoPlay:e.autoPlay,timelinePlayCount:e.timelinePlayCount})}function me(e,t){const i=typeof e.playCount=="number"&&e.playCount<0,r=[{...e,name:"single",playCount:i?1:e.playCount}],o={autoPlay:e.autoPlay??!0,timelinePlayCount:i?-1:1},s=q(r,a=>t(a[0]),o),n=s.updateValues;return k(s,{updateValues:a=>n([{name:"single",...a}]),animationsInfo:s.animationsInfo[0]})}function j(e,t){let i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};return q(e,t,i)}j.timeline=q;j.single=me;j.group=he;function Ne(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];const[i,r]=O.useState();return O.useEffect(()=>{i&&(i.clearEvents(),i.timelineInfo.isPlaying&&i.pause());const o=e();return r(o),()=>{o.clearEvents(),o.timelineInfo.isPlaying&&o.pause()}},t),i}const ce=4,fe=.001,de=1e-7,pe=10,F=11,I=1/(F-1),W=(e,t)=>1-3*t+3*e,$=(e,t)=>3*t-6*e,J=e=>3*e,S=(e,t,i)=>((W(t,i)*e+$(t,i))*e+J(t))*e,H=(e,t,i)=>3*W(t,i)*e*e+2*$(t,i)*e+J(t);function ye(e,t,i,r,o){let s,n,l=0;do n=t+(i-t)/2,s=S(n,r,o)-e,s>0?i=n:t=n;while(Math.abs(s)>de&&++l<pe);return n}function ge(e,t,i,r){for(let o=0;o<ce;++o){const s=H(t,i,r);if(s===0)return t;const n=S(t,i,r)-e;t-=n/s}return t}const _e=e=>e;function Pe(e,t,i,r){if(!(0<=e&&e<=1&&0<=i&&i<=1))throw new Error(`/n/n⛔ [animare] ➡️ [ease] ➡️ [cubicBezier] : bezier x values must be in [0, 1] range. !!

`);if(e===t&&i===r)return _e;const o=typeof Float32Array=="function"?new Float32Array(F):new Array(F);for(let n=0;n<F;++n)o[n]=S(n*I,e,i);function s(n){let l=0,a=1;const f=F-1;for(;a!==f&&o[a]<=n;++a)l+=I;--a;const u=(n-o[a])/(o[a+1]-o[a]),d=l+u*I,p=H(d,e,i);return p>=fe?ge(n,d,e,i):p===0?d:ye(n,l,l+I,e,i)}return n=>n===0||n===1?n:S(s(n),t,r)}function we(e){const t=e.match(/-?[0-9.]+/g)?.map(parseFloat),i=[];if(!t)return i;i.push([t[0],t[1]]);for(let r=2;r<t.length;r+=6)i.push([t[r],t[r+1],t[r+2],t[r+3],t[r+4],t[r+5]]);return i}function Ae(e){const t=[];let i=0,r=0;for(let o=0;o<e.length;o++){const s=e[o],n=s[0],l=1-s[1];if(!o){i=n,r=l;continue}const a=s[2],f=1-s[3],u=s[4],d=1-s[5];t.push([i,r,n,l,a,f,u,d]),i=u,r=d}return t}function be(e){const t=we(e),i=Ae(t),r=1e-6;return o=>{if(o===0)return i[0][1];if(o===1)return i[i.length-1][7];let s=0;for(let n=0;n<i.length;n++){const[l,a,f,u,d,p,C,E]=i[n];if(o<s||o>C)continue;s=C;let R=0,M=1,y=(R+M)/2,h=0;for(;y>=R&&y<=1;){const m=1-y,c=m*m,w=c*m,_=l*w+f*3*c*y+d*3*m*y*y+C*y**3,L=a*w+u*3*c*y+p*3*m*y*y+E*y**3;if(++h>50||Math.abs(_-o)<=r)return L;_>=o?M=y:R=y,y=(R+M)/2}return 0}return 0}}function Re(){let{mass:e=1,stiffness:t=100,damping:i=10,velocity:r=0,duration:o=1e3}=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const s=(n,l,a)=>Math.min(Math.max(n,l),a);return n=>{if(n===0||n===1)return n;e=s(e,.1,1e3),t=s(t,.1,1e3),i=s(i,.1,1e3),r=s(r,.1,1e3);const l=Math.sqrt(t/e),a=i/(2*Math.sqrt(t*e)),f=a<1?l*Math.sqrt(1-a*a):0,u=1,d=a<1?(a*l+-r)/f:-r+l;let p=o?o*n/1e3:n;return p=a<1?Math.exp(-p*a*l)*(u*Math.cos(f*p)+d*Math.sin(f*p)):(u+d*p)*Math.exp(-p*l),1-p}}function Ce(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:10,t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;const i=(o,s,n)=>Math.min(Math.max(o,s),n),r=t?Math.ceil:Math.floor;return o=>r(i(o,0,1)*e)/e}function Me(e){if(!(e instanceof Float32Array)&&!Array.isArray(e))throw new Error(`

⛔ [animare] ➡️ [ease] ➡️ [fromPoints] : first param must be an Array or Float32Array. !!

`);const t=e.length;return i=>e[Math.floor(i*t)]??e[t-1]}function D(){const t=(arguments.length>0&&arguments[0]!==void 0?arguments[0]:1)*Math.PI;return i=>1-Math.pow(Math.cos(i*Math.PI/2),3)*Math.cos(i*t)}function v(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375}function Fe(e){return e}const Ie={back:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1.70158;return t=>(e+1)*t*t*t-e*t*t},bounce:e=>1-v(1-e),circ:e=>1-Math.sqrt(1-Math.pow(e,2)),cubic:e=>e*e*e,elastic:e=>{const t=2*Math.PI/3;return e===0?0:e===1?1:-Math.pow(2,10*e-10)*Math.sin((e*10-10.75)*t)},expo:e=>e===0?0:Math.pow(2,10*e-10),sine:e=>1-Math.cos(e*Math.PI/2),quad:e=>e*e,quart:e=>e*e*e*e,quint:e=>e*e*e*e*e,poly:e=>t=>Math.pow(t,e),wobble:D},Se={back:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1.70158;return t=>{const i=e*1.525;return t<.5?Math.pow(2*t,2)*((i+1)*2*t-i)/2:(Math.pow(2*t-2,2)*((i+1)*(t*2-2)+i)+2)/2}},bounce:e=>e<.5?(1-v(1-2*e))/2:(1+v(2*e-1))/2,circ:e=>e<.5?(1-Math.sqrt(1-Math.pow(2*e,2)))/2:(Math.sqrt(1-Math.pow(-2*e+2,2))+1)/2,cubic:e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,elastic:e=>{const t=2*Math.PI/4.5;return e===0?0:e===1?1:e<.5?-(Math.pow(2,20*e-10)*Math.sin((20*e-11.125)*t))/2:Math.pow(2,-20*e+10)*Math.sin((20*e-11.125)*t)/2+1},expo:e=>e===0?0:e===1?1:e<.5?Math.pow(2,20*e-10)/2:(2-Math.pow(2,-20*e+10))/2,sine:e=>-(Math.cos(Math.PI*e)-1)/2,quad:e=>e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2,quart:e=>e<.5?8*e*e*e*e:1-Math.pow(-2*e+2,4)/2,quint:e=>e<.5?16*e*e*e*e*e:1-Math.pow(-2*e+2,5)/2,poly:e=>t=>t<.5?Math.pow(2,e-1)*Math.pow(t,e):1-Math.pow(-2*t+2,e)/2,wobble(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1;return ve(D(e))}};function ve(e){return t=>t<.5?e(t*2)/2:1-e((1-t)*2)/2}const Te={back:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1.70158;return t=>1+(e+1)*Math.pow(t-1,3)+e*Math.pow(t-1,2)},bounce:v,circ:e=>Math.sqrt(1-Math.pow(e-1,2)),cubic:e=>1-Math.pow(1-e,3),elastic:e=>{const t=2*Math.PI/3;return e===0?0:e===1?1:Math.pow(2,-10*e)*Math.sin((e*10-.75)*t)+1},expo:e=>e===1?1:1-Math.pow(2,-10*e),sine:e=>Math.sin(e*Math.PI/2),quad:e=>1-(1-e)*(1-e),quart:e=>1-Math.pow(1-e,4),quint:e=>1-Math.pow(1-e,5),poly:e=>t=>1-Math.pow(1-t,e),wobble:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1;return qe(D(e))}};function qe(e){return t=>1-e(1-t)}const je={in:Ie,out:Te,inOut:Se,linear:Fe,cubicBezier:Pe,custom:be,fromPoints:Me,steps:Ce,spring:Re};export{P as A,b as D,j as a,xe as c,je as e,Oe as j,Ne as u};
