import{u as k,j as u}from"./useAnimare.K1gqI4ev.js";import{c as A,T as P,a as R}from"./animare.0tbHUgDI.js";import{u as T}from"./useAutoPause.CTsnzgmu.js";import{r as C}from"./index.DhYZZe0J.js";import{e as f}from"./index.ChPNCYSA.js";import{s as p}from"./Ease_module.88ee4c48.DdJqKbV4.js";const r=200,h=5,E="#f46036",w=1,F="#fff";function S(i){if(!i)return f.linear;const o=/\(.*\)$/,l=i.replace(o,"").split(".");if(l.length===2){const e=l[1],n=i.match(o);if(!n)return f[e];const t=n[0].substring(1,n[0].length-1).split(",").filter(m=>m!=="").map(m=>{const a=parseFloat(m);return isNaN(a)?m:a});return f[e](...t)}const x=l[1],c=l[2],s=i.match(o);if(!s)return f[x][c];const d=s[0].substring(1,s[0].length-1).split(",").filter(e=>e!=="").map(e=>{const n=parseFloat(e);return isNaN(n)?e:n});return f[x][c](...d)}function U({title:i="Linear",padding:o=10,duration:l=2e3,easing:x}){const c=C.useRef(null),s=o/2+1,d=k(()=>{const e=A([{name:"x",from:h+s,to:r-h-s},{name:"y",from:r-h-s,to:h+s,ease:S(x)},{name:"empty",to:0,duration:1e3,timing:P.AfterPrevious}]),n={autoPlay:!1,timelinePlayCount:-1,duration:l,timing:P.FromStart},t=c.current?.getContext("2d"),m=2*Math.PI,a=[],b=(g,j)=>{if(t){j.progress===0&&(a.length=0),t.clearRect(0,0,r,r),a.push({x:g.x.value,y:g.y.value});for(let y=0;y<a.length;y++){const v=a[y],N=a[y+1]??v;t.beginPath(),t.moveTo(v.x,v.y),t.lineTo(N.x,N.y),t.strokeStyle=F,t.lineWidth=w,t.stroke()}t.beginPath(),t.arc(g.x.value,g.y.value,h,0,m),t.fillStyle=E,t.fill()}};return R.timeline(e,b,n)});return T(d,c.current),u.jsxs("div",{className:p.wrapper+" not-content",children:[u.jsxs("div",{className:p.container,children:[u.jsx("div",{className:p.frame,style:{width:r-o,height:r-o}}),u.jsx("canvas",{ref:c,width:r,height:r,className:p.canvas})]}),u.jsx("p",{className:p.title,children:i})]})}export{U as default};