import{u as l,j as t}from"./useAnimare.K1gqI4ev.js";import{a as u}from"./animare.BqJ0QUF9.js";import{e as c}from"./index.ChPNCYSA.js";import{l as p}from"./lerp.C7Iu0PC9.js";import{v as f}from"./vecToColor.CBt2Hv5V.js";import{r as d}from"./index.DhYZZe0J.js";import{E as x}from"./ExampleFrame.Cu_UF9fG.js";import"./ExampleFrame_module.a49b6180.D0zKF7Sg.js";function R(){const r=d.useRef(null),a=l(()=>{const o=document.querySelector(".animate-color-element"),n=[255,0,0],i=[0,255,0];return u.single({from:0,to:1,duration:1e3,ease:c.linear,autoPlay:!1},e=>{if(!o)return;const s=p(n,i,e.value),m=f(s);o.style.backgroundColor=m,r.current&&(r.current.value=e.progress.toString())})});return t.jsx(x,{title:"Animate Color",slider:r,timeline:a,children:t.jsx("div",{className:"animate-color-element",style:{backgroundColor:"red",width:"100px",height:"100px",borderRadius:"50%",margin:"30px auto"}})})}export{R as default};
