import{u as c,j as e}from"./useAnimare.K1gqI4ev.js";import{a as p,D as d}from"./animare.0tbHUgDI.js";import{u as m}from"./useAutoPause.CTsnzgmu.js";import{r as l}from"./index.DhYZZe0J.js";import{E as f}from"./ExampleFrame.BhR4DmqM.js";import"./ExampleFrame_module.a49b6180.D0zKF7Sg.js";function S(){const r=l.useRef(null),a=l.useRef(null),i=c(()=>{const t=r.current.querySelector("span");return p.single({to:100,duration:1e3,direction:d.Alternate,autoPlay:!1,playCount:-1},n=>{if(a.current&&(a.current.value=n.progress.toString()),!t)return;const s=n.value;t.style.marginLeft=`${s}%`,t.style.translate=`-${s}%`})},[r]);m(i,r.current,{forcePlay:!1});const u=t=>{const o=t.target,n=parseFloat(o.value);i.updateValues({duration:n})};return e.jsx(f,{title:"Update Values",slider:a,timeline:i,children:e.jsxs("div",{ref:r,style:{paddingInline:10},children:[e.jsx("span",{style:x}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10,width:"100%"},children:[e.jsx("p",{children:"Duration"}),e.jsx("input",{style:{flex:1,maxWidth:460,accentColor:"var(--secondary)"},onPointerUp:u,type:"range",min:50,max:5e3,defaultValue:1e3})]})]})})}const x={display:"block",width:100,height:100,backgroundColor:"var(--secondary)",color:"#fff",textAlign:"center",fontSize:"0.8rem",fontWeight:"bold",paddingInline:"0.5rem",borderRadius:"50%",margin:"10px 10px 10px 0%",whiteSpace:"nowrap"};export{S as default};