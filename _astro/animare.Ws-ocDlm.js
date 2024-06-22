let C=function(e){return e.Forward="forward",e.Reverse="reverse",e.Alternate="alternate",e.AlternateReverse="alternate-reverse",e}({}),g=function(e){return e.AfterPrevious="after-previous",e.WithPrevious="with-previous",e.FromStart="from-start",e}({}),p=function(e){return e.Play="play",e.Resume="resume",e.Pause="pause",e.Stop="stop",e.Complete="complete",e.Repeat="repeat",e}({}),Q=function(e){return e.Vertical="y",e.Horizontal="x",e}({}),Y=function(e){return e.Top="top",e.Bottom="bottom",e.Left="left",e.Right="right",e}({});function Z(e){return e}class D{#t=Object.assign({});#i=null;#l=null;#e=null;#n=null;#r=null;#a=null;#o(i,n){return this.#t[i]?this.#t[i].delete(n):!1}on(i,n){return this.#t[i]||(this.#t[i]=new Set),this.#t[i].add(n),()=>this.#o(i,n)}once(i,n){const r=this.on(i,()=>{n(),r()});return()=>this.#o(i,n)}emit(i){if(this.#t[i]){if(this.#t[i].forEach(n=>n()),i===p.Play){this.#i?.(),this.#i=null;return}if(i===p.Resume){this.#l?.(),this.#l=null;return}if(i===p.Pause){this.#e?.(),this.#e=null;return}if(i===p.Complete){this.#r?.(),this.#r=null;return}if(i===p.Repeat){this.#a?.(),this.#a=null;return}i===p.Stop&&(this.#n?.(),this.#n=null)}}clear(){this.#t=Object.assign({})}onPlayAsync(){if(this.#i===null)return new Promise(i=>{this.#i=i})}onResumeAsync(){if(this.#l===null)return new Promise(i=>{this.#l=i})}onPauseAsync(){if(this.#e===null)return new Promise(i=>{this.#e=i})}onStopAsync(){if(this.#n===null)return new Promise(i=>{this.#n=i})}onCompleteAsync(){if(this.#r===null)return new Promise(i=>{this.#r=i})}onRepeatAsync(){if(this.#a===null)return new Promise(i=>{this.#a=i})}}function M(e){return typeof e=="number"&&!Number.isNaN(e)&&Number.isFinite(e)}function N(e){const i=parseFloat(e);return M(i)?i/100:0}function I(e){return e<0?0:e>1?1:e}function q(e,i,n){return e<i?i:e>n?n:e}function v(e){const i=e;for(var n=arguments.length,r=new Array(n>1?n-1:0),l=1;l<n;l++)r[l-1]=arguments[l];for(let s=0;s<r.length;s++){const t=r[s];for(const f in t)i[f]=t[f]}return i}function k(e){return typeof e=="object"&&!Array.isArray(e)}class x{#t;#i;#l;#e;#n;#r;#a;#o;#p=0;#m;#s=0;#h=0;#f=0;#c=!1;#y=!1;#u;#g;#d;#P(i){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:.001;return Math.abs(this.#s-i)<n}#_(i){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:5;return Math.abs(this.#f-i)<n}get info(){return{name:this.animationRef.name,index:this.#t,value:this.#r,progress:this.#s,overallProgress:this.#h,elapsedTime:this.#f,isFinished:this.#c,delayCount:this.#o,playCount:this.#m,isPlaying:this.#y,isProgressAt:this.#P.bind(this),isTimeAt:this.#_.bind(this)}}constructor(i,n,r){this.#t=r,this.animationRef=i,this.#d=n,this.Setup()}Setup(){this.#g=z(this.animationRef.direction),this.#u=U(this.animationRef.direction),this.#m=0,this.#o=0,this.#n=this.#u?this.animationRef.to:this.animationRef.from,this.#r=this.#u?this.animationRef.to:this.animationRef.from,this.#a=this.#u?this.animationRef.from:this.animationRef.to;const i=this.animationRef.offset,n=this.animationRef.delayCount===0?0:this.animationRef.delay,r=this.animationRef.duration*this.animationRef.playCount+n*this.animationRef.delayCount;switch(this.#t===0?g.FromStart:this.animationRef.timing){case g.FromStart:this.#e=i;break;case g.AfterPrevious:if(!this.#d)throw new Error("The previous animation is not defined.");this.#e=this.#d.endPoint+i;break;case g.WithPrevious:if(!this.#d)throw new Error("The previous animation is not defined.");this.#e=this.#d.#e+i;break}this.endPoint=this.#e+r,this.#i=this.#e+n,this.#l=this.#i+this.animationRef.duration}Update(i){if(this.animationRef.playCount!==0){if(i>=this.endPoint){this.#y=!1,this.#c=!0,this.#m=this.animationRef.playCount,this.#o=this.animationRef.delayCount,this.#s=1,this.#h=1,this.#f=this.endPoint-this.#e;const n=this.animationRef.direction===C.Reverse||this.animationRef.direction===C.Alternate;this.#r=n?this.animationRef.from:this.animationRef.to;return}if(i<this.#e){this.#y=!1,this.#c=!1,this.#m=0,this.#o=0,this.#s=0,this.#h=0,this.#f=0,this.#r=this.#u?this.animationRef.to:this.animationRef.from;return}this.#y=!0,this.#h=I((i-this.#e)/(this.endPoint-this.#e)),this.#C(i)}}Set(i){v(this.animationRef,i),E(this.animationRef)}#C(i){const n=this.animationRef.delayCount,r=this.animationRef.duration,l=r*(this.animationRef.playCount-n),s=this.animationRef.duration+this.animationRef.delay,t=s*n+this.animationRef.delay*n,a=(t+l)*this.#h;if(t&&a<=t){const y=q(Math.floor(a/s),0,n-1),c=n===0?0:this.animationRef.delay;this.#i=this.#e+s*y+c,this.#o=y+1,this.#m=y+1}else{const y=a-t,c=n+q(Math.floor(y/r),0,this.animationRef.playCount-1);this.#i=this.#e+t+r*(c-n),this.#o=n,this.#m=c+1}this.#l=this.#i+this.animationRef.duration,this.#f=i-this.#i,this.#s=I(this.#f/(this.#l-this.#i));const h=this.#A();this.#r=this.#n+(this.#a-this.#n)*this.animationRef.ease(h)}#A(){if(!this.#g)return this.#s;const i=(this.#s<=.5?this.#s:this.#s-.5)*2;return this.#p=this.#s<=.5?0:1,this.#p===0?(this.#n=this.#u?this.animationRef.to:this.animationRef.from,this.#a=this.#u?this.animationRef.from:this.animationRef.to,i):(this.#n=this.#u?this.animationRef.from:this.animationRef.to,this.#a=this.#u?this.animationRef.to:this.animationRef.from,i)}}const _={from:0,duration:350,delay:0,offset:0,delayCount:1,playCount:1,direction:C.Forward,timing:g.AfterPrevious,ease:e=>e};function z(e){return e===C.Alternate||e===C.AlternateReverse}function U(e){return e===C.Reverse||e===C.AlternateReverse}function E(e){if(!e.name)throw new Error("Animation `name` is required");if(typeof e.to!="number")throw new Error("The `to` value is required");if(typeof e.duration=="number"&&e.duration<0)throw new Error("The `duration` value cannot be a negative value.");if(typeof e.delay=="number"&&e.delay<0)throw new Error("The `delay` value cannot be a negative value.");if(typeof e.playCount=="number"&&e.playCount<0)throw new Error("The `playCount` value cannot be a negative value.");if(typeof e.delayCount=="number"&&e.delayCount<0)throw new Error("The `delayCount` value cannot be a negative value.");if(typeof e.playCount=="number"&&typeof e.delayCount=="number"&&e.delayCount>e.playCount)throw new Error("The `delayCount` value cannot be greater than the `playCount` value.")}function $(e,i,n){const r=A=>typeof A=="function"?A(n):A,l=r(e.from)??i.from??_.from,s=r(e.duration)??i.duration??_.duration,t=r(e.delay)??i.delay??_.delay,f=r(e.offset)??i.offset??_.offset,a=r(e.playCount)??i.playCount??_.playCount,h=typeof t=="number"?r(e.delayCount)??i.delayCount??a:0,y=r(e.direction)??i.direction??_.direction,c=r(e.timing)??i.timing??_.timing;return{name:e.name,to:e.to,from:l,duration:s,delay:t,offset:f,playCount:a,delayCount:h,direction:y,timing:c,ease:e.ease??i.ease??_.ease}}function W(e,i){const n=s=>typeof s<"u",r=s=>typeof s=="function"?s(i):s,l={};return n(e.from)&&(l.from=r(e.from)),n(e.duration)&&(l.duration=r(e.duration)),n(e.delay)&&(l.delay=r(e.delay)),n(e.offset)&&(l.offset=r(e.offset)),n(e.playCount)&&(l.playCount=r(e.playCount)),n(e.delayCount)&&(l.delayCount=r(e.delayCount)),n(e.direction)&&(l.direction=r(e.direction)),n(e.timing)&&(l.timing=r(e.timing)),n(e.to)&&(l.to=e.to),n(e.ease)&&(l.ease=e.ease),l}function B(e,i){const n=[];for(let r=0;r<e.length;r++){const l=e[r],s=$(l,i,r);r===0&&(s.timing=g.FromStart),E(s),n.push(s)}return n}function G(e){if(e.timelinePlayCount===0&&console.warn("The `timelinePlayCount` with the value `0` will make the timeline not play."),typeof e.timelineSpeed=="number"&&(e.timelineSpeed===0||e.timelineSpeed<0))throw new Error("The `timelineSpeed` value cannot be a negative value or a zero.");return{timelinePlayCount:e.timelinePlayCount??1,autoPlay:e.autoPlay??!0,timelineSpeed:e.timelineSpeed??1}}function H(e){const i=[];for(let n=0;n<e.length;n++){const r=e[n],l=i[n-1];if(n===0&&r.timing!==g.FromStart)throw new Error(`The timing value in the first animation must be "${g.FromStart}".`);i.push(new x(r,l,n))}return i}function S(e){const i=Math.max(...e.map(n=>n.endPoint));return i===1/0?Number.MAX_SAFE_INTEGER:i}function w(e,i){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const r=G(n),l=B(e,n),s=new D,t={__startTime:0,__pauseTime:0,__lastFrameTime:0,__animations:[],__requestAnimationId:null,__startProgress:0,progress:0,duration:0,elapsedTime:0,speed:r.timelineSpeed,isPlaying:!1,isPaused:!1,isFinished:!1,isFirstFrame:!0,playCount:1,fps:60,isProgressAt(o){let m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:.001;return Math.abs(this.progress-o)<m},isTimeAt(o){let m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:5;return Math.abs(this.elapsedTime-o)<m}};t.__animations=H(l),t.duration=S(t.__animations);const f={isRegistered:!1,hiddenTime:0,add(){this.isRegistered||(document.addEventListener("visibilitychange",this.handle),this.isRegistered=!0)},remove(){document.removeEventListener("visibilitychange",this.handle),this.isRegistered=!1},handle(){if(document.visibilityState==="hidden"){f.hiddenTime=performance.now();return}document.visibilityState==="visible"&&(t.__startTime+=performance.now()-f.hiddenTime,f.hiddenTime=0)}},a=Object.create(null);a.length=e.length;const h=(o,m)=>{o*=t.speed,t.elapsedTime=o-t.__startTime+t.__startProgress*t.duration,t.progress=I(t.elapsedTime/t.duration),t.fps=Math.round(1e3/(o-t.__lastFrameTime)*t.speed),isFinite(t.fps)||(t.fps=60),t.__lastFrameTime=o;for(let d=0;d<t.__animations.length;d++){const R=t.__animations[d];R.Update(t.elapsedTime);const b=R.info;a[b.name]=b,a[b.index]=b}if(t.progress!==1){if(i(a,t),m)return;t.__requestAnimationId=requestAnimationFrame(h);return}if(t.playCount===r.timelinePlayCount){t.isFinished=!0,t.isPlaying=!1,f.remove(),i(a,t),s.emit(p.Complete),t.__requestAnimationId=null;return}m||(i(a,t),s.emit(p.Repeat),t.__requestAnimationId=requestAnimationFrame(d=>{t.__startTime=d*t.speed,t.__lastFrameTime=d*t.speed,t.playCount++,t.__startProgress=0,h(d)}))},y=function(o){let m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:t.playCount;if(r.timelinePlayCount===0||m===0){console.warn("[seek] Cannot seek the timeline because the `playCount` is set to 0.");return}if(r.timelinePlayCount>0&&typeof m=="number"&&m>r.timelinePlayCount){console.warn("[seek] Cannot seek the timeline because the param `playCount` is greater than the `timelinePlayCount`.");return}if(t.duration===0){console.warn("[seek] Cannot seek the timeline because the `duration` is 0.");return}if(typeof o=="number"&&(o<0&&(o=0,console.warn("[seek] The `startFrom` param cannot be a negative value.")),o>t.duration&&(o=t.duration,console.warn("[seek] The `startFrom` param cannot be greater than the duration of the timeline.")),o=q(o/t.duration,0,1)),typeof o=="string"&&(o=N(o),o<0&&(o=0,console.warn("[seek] The `startFrom` param cannot be a negative percentage.")),o>1&&(o=1,console.warn("[seek] The `startFrom` param percentage cannot be greater than 1."))),t.isPlaying){const d=performance.now()*t.speed;t.__startTime=d,t.__lastFrameTime=d}t.playCount=m,t.__startProgress=o},c=function(){let o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0,m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;t.isPlaying&&t.__requestAnimationId!==null&&(cancelAnimationFrame(t.__requestAnimationId),t.__requestAnimationId=null),y(o,m),t.__requestAnimationId=requestAnimationFrame(d=>{t.__startTime=d*t.speed,t.__lastFrameTime=d*t.speed,t.progress=t.__startProgress,t.isPlaying=t.progress!==1,t.isFinished=t.progress===1,t.isPaused=!1,t.isFirstFrame=!0,f.add(),s.emit(p.Play),h(d),t.isFirstFrame=!1})},T=()=>{if(t.isPlaying&&t.__requestAnimationId!==null){console.warn("[playOneFrame] The timeline is already playing.");return}const o=performance.now();t.__startTime=o*t.speed,t.__lastFrameTime=o*t.speed,t.progress=t.__startProgress,t.isPlaying=!1,t.isFinished=t.progress===1,t.isPaused=!1,t.isFirstFrame=!1,h(o,!0)},A=()=>{if(!t.isPlaying){console.warn("[pause] The timeline is not playing.");return}if(t.isPaused){console.warn("[pause] The timeline is already paused.");return}if(!t.__requestAnimationId){console.error("[pause] `__requestAnimationId` is null.");return}cancelAnimationFrame(t.__requestAnimationId),t.__requestAnimationId=null,t.__pauseTime=performance.now(),t.isPaused=!0,t.isPlaying=!1,f.remove(),s.emit(p.Pause)},u=()=>{if(t.isPlaying){console.warn("[resume] The timeline is already playing.");return}if(!t.isPaused){console.warn("[resume] The timeline is not paused, playing from the start."),c();return}t.__startTime+=(performance.now()-t.__pauseTime)*t.speed,t.__pauseTime=0,t.isPaused=!1,t.isPlaying=!0,f.add(),s.emit(p.Resume),t.__requestAnimationId=requestAnimationFrame(h)},F=function(){let o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:t.duration,m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:r.timelinePlayCount;t.isPlaying&&t.__requestAnimationId!==null&&(cancelAnimationFrame(t.__requestAnimationId),t.__requestAnimationId=null,t.isPlaying=!1),y(o,m),T(),s.emit(p.Stop)},P=o=>{for(let m=0;m<o.length;m++){const d=o[m];if(!d.name)throw new Error("[updateValues] Animation name is required.");const R=t.__animations.findIndex(L=>L.animationRef.name===d.name);if(R===-1)throw new Error(`[updateValues] Animation with name '${d.name}' not found.`);const b=W(d,R);t.__animations[R].Set(b)}for(let m=0;m<a.length;m++)t.__animations[m].Setup();if(t.isPlaying){const m=t.progress;t.duration=S(t.__animations),y(t.duration*m);return}t.duration=S(t.__animations)},j=o=>{if(o.timelinePlayCount===0&&console.warn("The `timelinePlayCount` with the value `0` will make the timeline not play."),typeof o.timelineSpeed=="number"&&(o.timelineSpeed===0||o.timelineSpeed<0))throw new Error("The `timelineSpeed` value cannot be a negative value or a zero.");v(r,o);const m=t.progress;t.speed=r.timelineSpeed,t.isPlaying&&y(m*t.duration)};return r.autoPlay&&c(),{timelineInfo:t,animationsInfo:a,updateValues:P,updateTimelineOptions:j,play:c,playOneFrame:T,resume:u,pause:A,stop:F,seek:y,on:s.on.bind(s),once:s.once.bind(s),onCompleteAsync:s.onCompleteAsync.bind(s),onPlayAsync:s.onPlayAsync.bind(s),onResumeAsync:s.onResumeAsync.bind(s),onPauseAsync:s.onPauseAsync.bind(s),onStopAsync:s.onStopAsync.bind(s),onRepeatAsync:s.onRepeatAsync.bind(s),clearEvents:s.clear.bind(s)}}function X(e,i){if(typeof e.to>"u")throw new Error("[group] The `to` value is required");e.to=typeof e.to=="number"?[e.to]:e.to;const n=e.to.length,r=u=>typeof u=="number",l=u=>typeof u=="object"&&!Array.isArray(u),s=u=>typeof u=="object"&&!Array.isArray(u),t=u=>typeof u=="function",f=u=>new Array(n).fill(u),a={to:e.to,from:r(e.from)?f(e.from):e.from,offset:r(e.offset)?f(e.offset):e.offset,delay:r(e.delay)?f(e.delay):e.delay,delayCount:r(e.delayCount)?f(e.delayCount):e.delayCount,playCount:r(e.playCount)?f(e.playCount):e.playCount,direction:l(e.direction)?f(e.direction):e.direction,timing:s(e.timing)?f(e.timing):e.timing,duration:r(e.duration)?f(e.duration):e.duration,ease:t(e.ease)?f(e.ease):e.ease},h=new Array(n);for(let u=0;u<n;u++)h[u]={name:u.toString(),to:a.to[u],from:Array.isArray(a.from)?a.from[u]:a.from,offset:Array.isArray(a.offset)?a.offset[u]:a.offset,delay:Array.isArray(a.delay)?a.delay[u]:a.delay,delayCount:Array.isArray(a.delayCount)?a.delayCount[u]:a.delayCount,playCount:Array.isArray(a.playCount)?a.playCount[u]:a.playCount,direction:Array.isArray(a.direction)?a.direction[u]:a.direction,timing:u===0?g.FromStart:Array.isArray(a.timing)?a.timing[u]:a.timing,duration:Array.isArray(a.duration)?a.duration[u]:a.duration,ease:Array.isArray(a.ease)?a.ease[u]:a.ease};const y=w(h,i,{autoPlay:e.autoPlay,timelinePlayCount:e.timelinePlayCount,timelineSpeed:e.timelineSpeed}),c=y.updateValues;return v(y,{updateValues:u=>{const F=[];for(let P=0;P<u.length;P++){if(typeof u[P].index!="number")throw new Error("[updateValues] Animation index is required.");F[P]={name:`${u[P].index}`,...u[P]}}c(F)}})}function J(e,i){const n=typeof e.playCount=="number"&&e.playCount<0,r=[{...e,name:"single",playCount:n?1:e.playCount}],l={autoPlay:e.autoPlay??!0,timelinePlayCount:n?-1:1},s=w(r,h=>i(h[0]),l),t=s.updateValues;return v(s,{updateValues:h=>{"autoPlay"in h&&(s.updateTimelineOptions({autoPlay:h.autoPlay}),delete h.autoPlay),"playCount"in h&&(s.updateTimelineOptions({timelinePlayCount:h.playCount}),delete h.playCount),t([{name:"single",...h}])},animationsInfo:s.animationsInfo[0]})}function O(e,i){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};return w(e,i,n)}O.timeline=w;O.single=J;O.group=X;export{C as D,p as E,Y as S,g as T,O as a,Q as b,Z as c,k as i,I as n};
