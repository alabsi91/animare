import{r as i}from"./index.DhYZZe0J.js";function c(r,s,e){const u=e?.forcePlay??!0;let n=!1;const t=new IntersectionObserver(f=>{if(r)for(let a=0;a<f.length;a++){const o=f[a].isIntersecting;if(e?.onVisibilityChange?.(o),!r){console.error("[autoPause] The timeline is not defined.");return}if(o){if(r.timelineInfo.isPaused&&n){n=!1,r.resume();return}u&&!r.timelineInfo.isPaused&&r.play();return}r.timelineInfo.isPlaying&&(n=!0,r.pause())}},e);return s&&t.observe(s),()=>t.disconnect()}function P(r,s,e){let u=arguments.length>3&&arguments[3]!==void 0?arguments[3]:[];const n=Array.isArray(e)?e:u;i.useEffect(()=>{if(!r||!s)return;const t=Array.isArray(e)?{}:e;return c(r,s,t)},[r,s,...n])}export{P as u};