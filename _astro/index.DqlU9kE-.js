let C=function(e){return e.Forward="forward",e.Reverse="reverse",e.Alternate="alternate",e.AlternateReverse="alternate-reverse",e}({}),_=function(e){return e.AfterPrevious="after-previous",e.WithPrevious="with-previous",e.FromStart="from-start",e}({}),g=function(e){return e.Play="play",e.Resume="resume",e.Pause="pause",e.Stop="stop",e.Complete="complete",e.Repeat="repeat",e}({});function be(e){return e}class ${#t=Object.assign({});#n=null;#l=null;#e=null;#i=null;#r=null;#a=null;#o(t,i){return this.#t[t]?this.#t[t].delete(i):!1}on(t,i){return this.#t[t]||(this.#t[t]=new Set),this.#t[t].add(i),()=>this.#o(t,i)}once(t,i){const r=this.on(t,()=>{i(),r()});return()=>this.#o(t,i)}emit(t){if(this.#t[t]){if(this.#t[t].forEach(i=>i()),t===g.Play){this.#n?.(),this.#n=null;return}if(t===g.Resume){this.#l?.(),this.#l=null;return}if(t===g.Pause){this.#e?.(),this.#e=null;return}if(t===g.Complete){this.#r?.(),this.#r=null;return}if(t===g.Repeat){this.#a?.(),this.#a=null;return}t===g.Stop&&(this.#i?.(),this.#i=null)}}clear(){this.#t=Object.assign({})}onPlayAsync(){if(this.#n===null)return new Promise(t=>{this.#n=t})}onResumeAsync(){if(this.#l===null)return new Promise(t=>{this.#l=t})}onPauseAsync(){if(this.#e===null)return new Promise(t=>{this.#e=t})}onStopAsync(){if(this.#i===null)return new Promise(t=>{this.#i=t})}onCompleteAsync(){if(this.#r===null)return new Promise(t=>{this.#r=t})}onRepeatAsync(){if(this.#a===null)return new Promise(t=>{this.#a=t})}}function k(e){return typeof e=="number"&&!Number.isNaN(e)&&Number.isFinite(e)}function H(e){const t=parseFloat(e);return k(t)?t/100:0}function E(e){return e<0?0:e>1?1:e}function O(e,t,i){return e<t?t:e>i?i:e}function L(e){const t=e;for(var i=arguments.length,r=new Array(i>1?i-1:0),o=1;o<i;o++)r[o-1]=arguments[o];for(let s=0;s<r.length;s++){const n=r[s];for(const l in n)t[l]=n[l]}return t}function Ce(e){return typeof e=="object"&&!Array.isArray(e)}class J{#t;#n;#l;#e;#i;#r;#a;#o;#y=0;#h;#s=0;#m=0;#f=0;#p=!1;#d=!1;#u;#g;#c;#w(t){let i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:.001;return Math.abs(this.#s-t)<i}#P(t){let i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:5;return Math.abs(this.#f-t)<i}get info(){return{name:this.animationRef.name,index:this.#t,value:this.#r,progress:this.#s,overallProgress:this.#m,elapsedTime:this.#f,isFinished:this.#p,delayCount:this.#o,playCount:this.#h,isPlaying:this.#d,isProgressAt:this.#w.bind(this),isTimeAt:this.#P.bind(this)}}constructor(t,i,r){this.#t=r,this.animationRef=t,this.#c=i,this.Setup()}Setup(){this.#g=K(this.animationRef.direction),this.#u=Q(this.animationRef.direction),this.#h=0,this.#o=0,this.#i=this.#u?this.animationRef.to:this.animationRef.from,this.#r=this.#u?this.animationRef.to:this.animationRef.from,this.#a=this.#u?this.animationRef.from:this.animationRef.to;const t=this.animationRef.offset,i=this.animationRef.delayCount===0?0:this.animationRef.delay,r=this.animationRef.duration*this.animationRef.playCount+i*this.animationRef.delayCount;switch(this.#t===0?_.FromStart:this.animationRef.timing){case _.FromStart:this.#e=t;break;case _.AfterPrevious:if(!this.#c)throw new Error("The previous animation is not defined.");this.#e=this.#c.endPoint+t;break;case _.WithPrevious:if(!this.#c)throw new Error("The previous animation is not defined.");this.#e=this.#c.#e+t;break}this.endPoint=this.#e+r,this.#n=this.#e+i,this.#l=this.#n+this.animationRef.duration}Update(t){if(this.animationRef.playCount!==0){if(t>=this.endPoint){this.#d=!1,this.#p=!0,this.#h=this.animationRef.playCount,this.#o=this.animationRef.delayCount,this.#s=1,this.#m=1,this.#f=this.endPoint-this.#e;const i=this.animationRef.direction===C.Reverse||this.animationRef.direction===C.Alternate;this.#r=i?this.animationRef.from:this.animationRef.to;return}if(t<this.#e){this.#d=!1,this.#p=!1,this.#h=0,this.#o=0,this.#s=0,this.#m=0,this.#f=0,this.#r=this.#u?this.animationRef.to:this.animationRef.from;return}this.#d=!0,this.#m=E((t-this.#e)/(this.endPoint-this.#e)),this.#_(t)}}Set(t){L(this.animationRef,t),j(this.animationRef)}#_(t){const i=this.animationRef.delayCount,r=this.animationRef.duration,o=r*(this.animationRef.playCount-i),s=this.animationRef.duration+this.animationRef.delay,n=s*i+this.animationRef.delay*i,a=(n+o)*this.#m;if(n&&a<=n){const u=O(Math.floor(a/s),0,i-1),d=i===0?0:this.animationRef.delay;this.#n=this.#e+s*u+d,this.#o=u+1,this.#h=u+1}else{const u=a-n,d=i+O(Math.floor(u/r),0,this.animationRef.playCount-1);this.#n=this.#e+n+r*(d-i),this.#o=i,this.#h=d+1}this.#l=this.#n+this.animationRef.duration,this.#f=t-this.#n,this.#s=E(this.#f/(this.#l-this.#n));const c=this.#A();this.#r=this.#i+(this.#a-this.#i)*this.animationRef.ease(c)}#A(){if(!this.#g)return this.#s;const t=(this.#s<=.5?this.#s:this.#s-.5)*2;return this.#y=this.#s<=.5?0:1,this.#y===0?(this.#i=this.#u?this.animationRef.to:this.animationRef.from,this.#a=this.#u?this.animationRef.from:this.animationRef.to,t):(this.#i=this.#u?this.animationRef.from:this.animationRef.to,this.#a=this.#u?this.animationRef.to:this.animationRef.from,t)}}const b={from:0,duration:350,delay:0,offset:0,delayCount:1,playCount:1,direction:C.Forward,timing:_.AfterPrevious,ease:e=>e};function K(e){return e===C.Alternate||e===C.AlternateReverse}function Q(e){return e===C.Reverse||e===C.AlternateReverse}function j(e){if(!e.name)throw new Error("Animation `name` is required");if(typeof e.to!="number")throw new Error("The `to` value is required");if(typeof e.duration=="number"&&e.duration<0)throw new Error("The `duration` value cannot be a negative value.");if(typeof e.delay=="number"&&e.delay<0)throw new Error("The `delay` value cannot be a negative value.");if(typeof e.playCount=="number"&&e.playCount<0)throw new Error("The `playCount` value cannot be a negative value.");if(typeof e.delayCount=="number"&&e.delayCount<0)throw new Error("The `delayCount` value cannot be a negative value.");if(typeof e.playCount=="number"&&typeof e.delayCount=="number"&&e.delayCount>e.playCount)throw new Error("The `delayCount` value cannot be greater than the `playCount` value.")}function Z(e,t,i){const r=w=>typeof w=="function"?w(i):w,o=r(e.from)??t.from??b.from,s=r(e.duration)??t.duration??b.duration,n=r(e.delay)??t.delay??b.delay,l=r(e.offset)??t.offset??b.offset,a=r(e.playCount)??t.playCount??b.playCount,c=typeof n=="number"?r(e.delayCount)??t.delayCount??a:0,u=r(e.direction)??t.direction??b.direction,d=r(e.timing)??t.timing??b.timing;return{name:e.name,to:e.to,from:o,duration:s,delay:n,offset:l,playCount:a,delayCount:c,direction:u,timing:d,ease:e.ease??t.ease??b.ease}}function Y(e,t){const i=[];for(let r=0;r<e.length;r++){const o=e[r],s=Z(o,t,r);r===0&&(s.timing=_.FromStart),j(s),i.push(s)}return i}function G(e){return e.timelinePlayCount===0&&console.warn("The `timelinePlayCount` with the value `0` will make the timeline not play."),{timelinePlayCount:e.timelinePlayCount??1,autoPlay:e.autoPlay??!0}}function X(e){const t=[];for(let i=0;i<e.length;i++){const r=e[i],o=t[i-1];if(i===0&&r.timing!==_.FromStart)throw new Error(`The timing value in the first animation must be "${_.FromStart}".`);t.push(new J(r,o,i))}return t}function D(e){const t=Math.max(...e.map(i=>i.endPoint));return t===1/0?Number.MAX_SAFE_INTEGER:t}function v(e,t){let i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const r=G(i),o=Y(e,i),s=new $,n={__startTime:0,__pauseTime:0,__lastFrameTime:0,__animations:[],__requestAnimationId:null,__startProgress:0,progress:0,duration:0,elapsedTime:0,isPlaying:!1,isPaused:!1,isFinished:!1,isFirstFrame:!0,playCount:1,fps:60,isProgressAt(h){let f=arguments.length>1&&arguments[1]!==void 0?arguments[1]:.001;return Math.abs(this.progress-h)<f},isTimeAt(h){let f=arguments.length>1&&arguments[1]!==void 0?arguments[1]:5;return Math.abs(this.elapsedTime-h)<f}};n.__animations=X(o),n.duration=D(n.__animations);const l={isRegistered:!1,hiddenTime:0,add(){this.isRegistered||(document.addEventListener("visibilitychange",this.handle),this.isRegistered=!0)},remove(){document.removeEventListener("visibilitychange",this.handle),this.isRegistered=!1},handle(){if(document.visibilityState==="hidden"){l.hiddenTime=performance.now();return}document.visibilityState==="visible"&&(n.__startTime+=performance.now()-l.hiddenTime,l.hiddenTime=0)}},a=Object.create(null);a.length=e.length;const c=(h,f)=>{n.elapsedTime=h-n.__startTime+n.__startProgress*n.duration,n.progress=E(n.elapsedTime/n.duration),n.fps=Math.round(1e3/(h-n.__lastFrameTime||16.66)),n.__lastFrameTime=h;for(let m=0;m<n.__animations.length;m++){const A=n.__animations[m];A.Update(n.elapsedTime);const P=A.info;a[P.name]=P,a[P.index]=P}if(n.progress!==1){if(t(a,n),f)return;n.__requestAnimationId=requestAnimationFrame(c);return}if(n.playCount===r.timelinePlayCount){n.isFinished=!0,n.isPlaying=!1,l.remove(),t(a,n),s.emit(g.Complete),n.__requestAnimationId=null;return}f||(t(a,n),s.emit(g.Repeat),n.__requestAnimationId=requestAnimationFrame(m=>{n.__startTime=m,n.__lastFrameTime=m,n.playCount++,n.__startProgress=0,c(m)}))},u=function(h){let f=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;if(r.timelinePlayCount===0||f===0){console.warn("[seek] Cannot seek the timeline because the `playCount` is set to 0.");return}if(r.timelinePlayCount>0&&typeof f=="number"&&f>r.timelinePlayCount){console.warn("[seek] Cannot seek the timeline because the param `playCount` is greater than the `timelinePlayCount`.");return}if(n.duration===0){console.warn("[seek] Cannot seek the timeline because the `duration` is 0.");return}if(typeof h=="number"&&(h<0&&(h=0,console.warn("[seek] The `startFrom` param cannot be a negative value.")),h>n.duration&&(h=n.duration,console.warn("[seek] The `startFrom` param cannot be greater than the duration of the timeline.")),h=O(h/n.duration,0,1)),typeof h=="string"&&(h=H(h),h<0&&(h=0,console.warn("[seek] The `startFrom` param cannot be a negative percentage.")),h>1&&(h=1,console.warn("[seek] The `startFrom` param percentage cannot be greater than 1."))),n.isPlaying){const m=performance.now();n.__startTime=m,n.__lastFrameTime=m}n.playCount=f,n.__startProgress=h},d=function(){let h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0,f=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;n.isPlaying&&n.__requestAnimationId!==null&&(cancelAnimationFrame(n.__requestAnimationId),n.__requestAnimationId=null),u(h,f),n.__requestAnimationId=requestAnimationFrame(m=>{n.__startTime=m,n.__lastFrameTime=m,n.progress=n.__startProgress,n.isPlaying=n.progress!==1,n.isFinished=n.progress===1,n.isPaused=!1,n.isFirstFrame=!0,l.add(),s.emit(g.Play),c(m),n.isFirstFrame=!1})},p=()=>{if(n.isPlaying&&n.__requestAnimationId!==null){console.warn("[playOneFrame] The timeline is already playing.");return}const h=performance.now();n.__startTime=h,n.__lastFrameTime=h,n.progress=n.__startProgress,n.isPlaying=!1,n.isFinished=n.progress===1,n.isPaused=!1,n.isFirstFrame=!1,c(h,!0)},w=()=>{if(!n.isPlaying){console.warn("[pause] The timeline is not playing.");return}if(n.isPaused){console.warn("[pause] The timeline is already paused.");return}if(!n.__requestAnimationId){console.error("[pause] `__requestAnimationId` is null.");return}cancelAnimationFrame(n.__requestAnimationId),n.__requestAnimationId=null,n.__pauseTime=performance.now(),n.isPaused=!0,n.isPlaying=!1,l.remove(),s.emit(g.Pause)},q=()=>{if(n.isPlaying){console.warn("[resume] The timeline is already playing.");return}if(!n.isPaused){console.warn("[resume] The timeline is not paused, playing from the start."),d();return}n.__startTime+=performance.now()-n.__pauseTime,n.__pauseTime=0,n.isPaused=!1,n.isPlaying=!0,l.add(),s.emit(g.Resume),n.__requestAnimationId=requestAnimationFrame(c)},R=function(){let h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:n.duration,f=arguments.length>1&&arguments[1]!==void 0?arguments[1]:r.timelinePlayCount;n.isPlaying&&n.__requestAnimationId!==null&&(cancelAnimationFrame(n.__requestAnimationId),n.__requestAnimationId=null,n.isPlaying=!1),u(h,f),p(),s.emit(g.Stop)},M=h=>{for(let f=0;f<h.length;f++){const m=h[f];if(!m.name)throw new Error("[updateValues] Animation name is required.");const A=n.__animations.find(P=>P.animationRef.name===m.name);if(!A)throw new Error(`[updateValues] Animation with name '${m.name}' not found.`);A.Set(m)}for(let f=0;f<a.length;f++)n.__animations[f].Setup();n.duration=D(n.__animations)};return r.autoPlay&&d(),{timelineInfo:n,animationsInfo:a,updateValues:M,play:d,playOneFrame:p,resume:q,pause:w,stop:R,seek:u,on:s.on.bind(s),once:s.once.bind(s),onCompleteAsync:s.onCompleteAsync.bind(s),onPlayAsync:s.onPlayAsync.bind(s),onResumeAsync:s.onResumeAsync.bind(s),onPauseAsync:s.onPauseAsync.bind(s),onStopAsync:s.onStopAsync.bind(s),onRepeatAsync:s.onRepeatAsync.bind(s),clearEvents:s.clear.bind(s)}}function ee(e,t){if(typeof e.to>"u")throw new Error("[group] The `to` value is required");e.to=typeof e.to=="number"?[e.to]:e.to;const i=e.to.length,r=u=>typeof u=="number",o=u=>typeof u=="object"&&!Array.isArray(u),s=u=>typeof u=="object"&&!Array.isArray(u),n=u=>typeof u=="function",l=u=>new Array(i).fill(u),a={to:e.to,from:r(e.from)?l(e.from):e.from,offset:r(e.offset)?l(e.offset):e.offset,delay:r(e.delay)?l(e.delay):e.delay,delayCount:r(e.delayCount)?l(e.delayCount):e.delayCount,playCount:r(e.playCount)?l(e.playCount):e.playCount,direction:o(e.direction)?l(e.direction):e.direction,timing:s(e.timing)?l(e.timing):e.timing,duration:r(e.duration)?l(e.duration):e.duration,ease:n(e.ease)?l(e.ease):e.ease},c=new Array(i);for(let u=0;u<i;u++)c[u]={name:u.toString(),to:a.to[u],from:Array.isArray(a.from)?a.from[u]:a.from,offset:Array.isArray(a.offset)?a.offset[u]:a.offset,delay:Array.isArray(a.delay)?a.delay[u]:a.delay,delayCount:Array.isArray(a.delayCount)?a.delayCount[u]:a.delayCount,playCount:Array.isArray(a.playCount)?a.playCount[u]:a.playCount,direction:Array.isArray(a.direction)?a.direction[u]:a.direction,timing:u===0?_.FromStart:Array.isArray(a.timing)?a.timing[u]:a.timing,duration:Array.isArray(a.duration)?a.duration[u]:a.duration,ease:Array.isArray(a.ease)?a.ease[u]:a.ease};return v(c,t,{autoPlay:e.autoPlay,timelinePlayCount:e.timelinePlayCount})}function te(e,t){const i=typeof e.playCount=="number"&&e.playCount<0,r=[{...e,name:"single",playCount:i?1:e.playCount}],o={autoPlay:e.autoPlay??!0,timelinePlayCount:i?-1:1},s=v(r,a=>t(a[0]),o),n=s.updateValues;return L(s,{updateValues:a=>n([{name:"single",...a}]),animationsInfo:s.animationsInfo[0]})}function x(e,t){let i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};return v(e,t,i)}x.timeline=v;x.single=te;x.group=ee;const ne=4,ie=.001,re=1e-7,se=10,F=11,I=1/(F-1),z=(e,t)=>1-3*t+3*e,B=(e,t)=>3*t-6*e,U=e=>3*e,S=(e,t,i)=>((z(t,i)*e+B(t,i))*e+U(t))*e,W=(e,t,i)=>3*z(t,i)*e*e+2*B(t,i)*e+U(t);function ae(e,t,i,r,o){let s,n,l=0;do n=t+(i-t)/2,s=S(n,r,o)-e,s>0?i=n:t=n;while(Math.abs(s)>re&&++l<se);return n}function oe(e,t,i,r){for(let o=0;o<ne;++o){const s=W(t,i,r);if(s===0)return t;const n=S(t,i,r)-e;t-=n/s}return t}const ue=e=>e;function le(e,t,i,r){if(!(0<=e&&e<=1&&0<=i&&i<=1))throw new Error(`/n/n⛔ [animare] ➡️ [ease] ➡️ [cubicBezier] : bezier x values must be in [0, 1] range. !!

`);if(e===t&&i===r)return ue;const o=typeof Float32Array=="function"?new Float32Array(F):new Array(F);for(let n=0;n<F;++n)o[n]=S(n*I,e,i);function s(n){let l=0,a=1;const c=F-1;for(;a!==c&&o[a]<=n;++a)l+=I;--a;const u=(n-o[a])/(o[a+1]-o[a]),d=l+u*I,p=W(d,e,i);return p>=ie?oe(n,d,e,i):p===0?d:ae(n,l,l+I,e,i)}return n=>n===0||n===1?n:S(s(n),t,r)}function he(e){const t=e.match(/-?[0-9.]+/g)?.map(parseFloat),i=[];if(!t)return i;i.push([t[0],t[1]]);for(let r=2;r<t.length;r+=6)i.push([t[r],t[r+1],t[r+2],t[r+3],t[r+4],t[r+5]]);return i}function fe(e){const t=[];let i=0,r=0;for(let o=0;o<e.length;o++){const s=e[o],n=s[0],l=1-s[1];if(!o){i=n,r=l;continue}const a=s[2],c=1-s[3],u=s[4],d=1-s[5];t.push([i,r,n,l,a,c,u,d]),i=u,r=d}return t}function me(e){const t=he(e),i=fe(t),r=1e-6;return o=>{if(o===0)return i[0][1];if(o===1)return i[i.length-1][7];let s=0;for(let n=0;n<i.length;n++){const[l,a,c,u,d,p,w,q]=i[n];if(o<s||o>w)continue;s=w;let R=0,M=1,y=(R+M)/2,h=0;for(;y>=R&&y<=1;){const f=1-y,m=f*f,A=m*f,P=l*A+c*3*m*y+d*3*f*y*y+w*y**3,V=a*A+u*3*m*y+p*3*f*y*y+q*y**3;if(++h>50||Math.abs(P-o)<=r)return V;P>=o?M=y:R=y,y=(R+M)/2}return 0}return 0}}function ce(){let{mass:e=1,stiffness:t=100,damping:i=10,velocity:r=0,duration:o=1e3}=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const s=(n,l,a)=>Math.min(Math.max(n,l),a);return n=>{if(n===0||n===1)return n;e=s(e,.1,1e3),t=s(t,.1,1e3),i=s(i,.1,1e3),r=s(r,.1,1e3);const l=Math.sqrt(t/e),a=i/(2*Math.sqrt(t*e)),c=a<1?l*Math.sqrt(1-a*a):0,u=1,d=a<1?(a*l+-r)/c:-r+l;let p=o?o*n/1e3:n;return p=a<1?Math.exp(-p*a*l)*(u*Math.cos(c*p)+d*Math.sin(c*p)):(u+d*p)*Math.exp(-p*l),1-p}}function de(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:10,t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;const i=(o,s,n)=>Math.min(Math.max(o,s),n),r=t?Math.ceil:Math.floor;return o=>r(i(o,0,1)*e)/e}function pe(e){if(!(e instanceof Float32Array)&&!Array.isArray(e))throw new Error(`

⛔ [animare] ➡️ [ease] ➡️ [fromPoints] : first param must be an Array or Float32Array. !!

`);const t=e.length;return i=>e[Math.floor(i*t)]??e[t-1]}function N(){const t=(arguments.length>0&&arguments[0]!==void 0?arguments[0]:1)*Math.PI;return i=>1-Math.pow(Math.cos(i*Math.PI/2),3)*Math.cos(i*t)}function T(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375}function ye(e){return e}const ge={back:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1.70158;return t=>(e+1)*t*t*t-e*t*t},bounce:e=>1-T(1-e),circ:e=>1-Math.sqrt(1-Math.pow(e,2)),cubic:e=>e*e*e,elastic:e=>{const t=2*Math.PI/3;return e===0?0:e===1?1:-Math.pow(2,10*e-10)*Math.sin((e*10-10.75)*t)},expo:e=>e===0?0:Math.pow(2,10*e-10),sine:e=>1-Math.cos(e*Math.PI/2),quad:e=>e*e,quart:e=>e*e*e*e,quint:e=>e*e*e*e*e,poly:e=>t=>Math.pow(t,e),wobble:N},we={back:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1.70158;return t=>{const i=e*1.525;return t<.5?Math.pow(2*t,2)*((i+1)*2*t-i)/2:(Math.pow(2*t-2,2)*((i+1)*(t*2-2)+i)+2)/2}},bounce:e=>e<.5?(1-T(1-2*e))/2:(1+T(2*e-1))/2,circ:e=>e<.5?(1-Math.sqrt(1-Math.pow(2*e,2)))/2:(Math.sqrt(1-Math.pow(-2*e+2,2))+1)/2,cubic:e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,elastic:e=>{const t=2*Math.PI/4.5;return e===0?0:e===1?1:e<.5?-(Math.pow(2,20*e-10)*Math.sin((20*e-11.125)*t))/2:Math.pow(2,-20*e+10)*Math.sin((20*e-11.125)*t)/2+1},expo:e=>e===0?0:e===1?1:e<.5?Math.pow(2,20*e-10)/2:(2-Math.pow(2,-20*e+10))/2,sine:e=>-(Math.cos(Math.PI*e)-1)/2,quad:e=>e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2,quart:e=>e<.5?8*e*e*e*e:1-Math.pow(-2*e+2,4)/2,quint:e=>e<.5?16*e*e*e*e*e:1-Math.pow(-2*e+2,5)/2,poly:e=>t=>t<.5?Math.pow(2,e-1)*Math.pow(t,e):1-Math.pow(-2*t+2,e)/2,wobble(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1;return Pe(N(e))}};function Pe(e){return t=>t<.5?e(t*2)/2:1-e((1-t)*2)/2}const _e={back:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1.70158;return t=>1+(e+1)*Math.pow(t-1,3)+e*Math.pow(t-1,2)},bounce:T,circ:e=>Math.sqrt(1-Math.pow(e-1,2)),cubic:e=>1-Math.pow(1-e,3),elastic:e=>{const t=2*Math.PI/3;return e===0?0:e===1?1:Math.pow(2,-10*e)*Math.sin((e*10-.75)*t)+1},expo:e=>e===1?1:1-Math.pow(2,-10*e),sine:e=>Math.sin(e*Math.PI/2),quad:e=>1-(1-e)*(1-e),quart:e=>1-Math.pow(1-e,4),quint:e=>1-Math.pow(1-e,5),poly:e=>t=>1-Math.pow(1-t,e),wobble:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1;return Ae(N(e))}};function Ae(e){return t=>1-e(1-t)}const Re={in:ge,out:_e,inOut:we,linear:ye,cubicBezier:le,custom:me,fromPoints:pe,steps:de,spring:ce};export{C as D,_ as T,x as a,be as c,Re as e,Ce as i};
