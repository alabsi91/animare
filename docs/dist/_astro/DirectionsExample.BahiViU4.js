import{u as m,j as e}from"./useAnimare.K1gqI4ev.js";import{a as x,D as t}from"./animare.BqJ0QUF9.js";import{r as c}from"./index.DhYZZe0J.js";import{E as f}from"./ExampleFrame.Cu_UF9fG.js";import"./ExampleFrame_module.a49b6180.D0zKF7Sg.js";function A(){const a=c.useRef(null),l=c.useRef(null),p=m(()=>{const s=a.current.querySelectorAll("span");return x.group({to:Array(s.length).fill(100),duration:1500,direction:[t.Forward,t.Reverse,t.Alternate,t.AlternateReverse],autoPlay:!1},(d,u)=>{l.current&&(l.current.value=u.progress.toString());for(let r=0;r<s.length;r++){const i=s[r];if(!i)return;const o=d[r].value;i.style.marginLeft=`${o}%`,i.style.translate=`-${o}%`}})},[a]);return e.jsx(f,{title:"Direction",slider:l,timeline:p,children:e.jsxs("div",{ref:a,style:{paddingInline:10},children:[e.jsx("span",{style:n,children:"Forward"}),e.jsx("span",{style:{...n,margin:"10px 10px 10px 100%",translate:"-100%"},children:"Reverse"}),e.jsx("span",{style:n,children:"Alternate"}),e.jsx("span",{style:{...n,margin:"10px 10px 10px 100%",translate:"-100%"},children:"AlternateReverse"})]})})}const n={display:"block",width:130,backgroundColor:"var(--secondary)",color:"#fff",textAlign:"center",fontSize:"0.8rem",fontWeight:"bold",paddingInline:"0.5rem",borderRadius:"0.2rem",margin:"10px 10px 10px 0%",whiteSpace:"nowrap"};export{A as default};