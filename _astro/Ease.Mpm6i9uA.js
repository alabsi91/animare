import{u as T,j as h}from"./useAnimare.K1gqI4ev.js";import{c as k,T as A,a as C}from"./animare.BqJ0QUF9.js";import{r as N}from"./index.DhYZZe0J.js";import{e as y}from"./index.ChPNCYSA.js";import{s as g}from"./Ease_module.88ee4c48.DdJqKbV4.js";function E(t,n,e){const c=e?.forcePlay??!0,a=new IntersectionObserver(r=>{if(t)for(let f=0;f<r.length;f++){const o=r[f].isIntersecting;if(e?.onVisibilityChange?.(o),!t){console.error("[autoPause] The timeline is not defined.");return}if(o){if(t.timelineInfo.isPaused)return t.resume();c&&t.play();return}t.timelineInfo.isPlaying&&t.pause()}},e);return n&&a.observe(n),()=>a.disconnect()}function I(t,n,e){let c=arguments.length>3&&arguments[3]!==void 0?arguments[3]:[];const a=Array.isArray(e)?e:c;N.useEffect(()=>{if(!t||!n)return;const r=Array.isArray(e)?{}:e;return E(t,n,r)},[t,n,...a])}const u=200,p=5,R="#f46036",w=1,F="#fff";function S(t){if(!t)return y.linear;const n=/\(.*\)$/,e=t.replace(n,"").split(".");if(e.length===2){const i=e[1],o=t.match(n);if(!o)return y[i];const s=o[0].substring(1,o[0].length-1).split(",").filter(m=>m!=="").map(m=>{const l=parseFloat(m);return isNaN(l)?m:l});return y[i](...s)}const c=e[1],a=e[2],r=t.match(n);if(!r)return y[c][a];const f=r[0].substring(1,r[0].length-1).split(",").filter(i=>i!=="").map(i=>{const o=parseFloat(i);return isNaN(o)?i:o});return y[c][a](...f)}function U({title:t="Linear",padding:n=10,duration:e=2e3,easing:c}){const a=N.useRef(null),r=n/2+1,f=T(()=>{const i=k([{name:"x",from:p+r,to:u-p-r},{name:"y",from:u-p-r,to:p+r,ease:S(c)},{name:"empty",to:0,duration:1e3,timing:A.AfterPrevious}]),o={autoPlay:!1,timelinePlayCount:-1,duration:e,timing:A.FromStart},s=a.current?.getContext("2d"),m=2*Math.PI,l=[],b=(d,j)=>{if(s){j.progress===0&&(l.length=0),s.clearRect(0,0,u,u),l.push({x:d.x.value,y:d.y.value});for(let x=0;x<l.length;x++){const P=l[x],v=l[x+1]??P;s.beginPath(),s.moveTo(P.x,P.y),s.lineTo(v.x,v.y),s.strokeStyle=F,s.lineWidth=w,s.stroke()}s.beginPath(),s.arc(d.x.value,d.y.value,p,0,m),s.fillStyle=R,s.fill()}};return C.timeline(i,b,o)});return I(f,a.current),h.jsxs("div",{className:g.wrapper+" not-content",children:[h.jsxs("div",{className:g.container,children:[h.jsx("div",{className:g.frame,style:{width:u-n,height:u-n}}),h.jsx("canvas",{ref:a,width:u,height:u,className:g.canvas})]}),h.jsx("p",{className:g.title,children:t})]})}export{U as default};
