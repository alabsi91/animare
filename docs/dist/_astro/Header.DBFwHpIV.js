import{u as s,j as r,a as i,D as A,e as a,A as c}from"./index.CMtQIwux.js";import{r as w}from"./index.DhYZZe0J.js";import{s as n}from"./index.afc51ad6.Dendk-JF.js";let y=0;const p=500,$="animare";function T(){const u=s(()=>{const o=document.querySelector(`.${n.logo} svg`);return i.single({from:1,to:.9,duration:500,direction:A.Alternate,ease:a.out.quart,autoPlay:!1},({value:t})=>{o.style.transform=`scale(${t})`})}),g=s(()=>{const o=document.querySelectorAll(`.${n.logoTitle} span`);return i.group({to:new Array(o.length).fill([0,1]).flat(),from:t=>t%2===0?40:0,duration:1200,delay:t=>p+~~(t/2)*50,ease:new Array(o.length).fill([a.out.expo,a.linear]).flat(),timing:c.FromStart,autoPlay:!1},t=>{for(let e=0;e<t.length;e+=2)o[e/2].style.transform=`translateX(${t[e]}px)`,o[e/2].style.opacity=t[e+1].value+""})}),d=s(()=>{const o=document.querySelectorAll(`.${n.logoTitle} span`);return i.group({to:new Array(o.length).fill([0,1,0]).flat(),from:t=>t%3===0?-40:t%3===1?0:2,delay:t=>p+~~(t/3)*50,duration:800,ease:new Array(o.length).fill([a.out.expo,a.out.expo,a.linear]).flat(),timing:c.FromStart,autoPlay:!1},t=>{for(let e=0;e<t.length;e+=3)o[e/3].style.transform=`translateX(${t[e]}px)`,o[e/3].style.opacity=t[e+1].value+"",o[e/3].style.filter=`blur(${t[e+2].value}px)`})}),x=s(()=>{const o=document.querySelectorAll(`.${n.logoTitle} span`);return i.group({to:new Array(o.length).fill(1),duration:t=>1e3+t*50,delay:t=>p+t*50,ease:a.spring({mass:2,damping:12,stiffness:70,velocity:9,duration:2500}),timing:c.FromStart,autoPlay:!1},t=>o.forEach((e,f)=>e.style.transform=`scale(${t[f].value})`))}),h=s(()=>{const o=document.querySelectorAll(`.${n.logoTitle} span`),t=o[0].parentElement;return t.style.overflow="hidden",i.group({to:new Array(o.length*3).fill(0),from:e=>e%3===0?.55:e%3===1?1.1:180,duration:750,delay:e=>p+~~(e/3)*50,ease:a.out.expo,timing:c.FromStart,autoPlay:!1},(e,{isFinished:f})=>{for(let l=0;l<e.length;l+=3)o[l/3].style.transform=`translateX(${e[l].value}em) translateY(${e[l+1].value}em) rotateZ(${e[l+2].value}deg)`;f&&t.style.removeProperty("overflow")})}),m=[g,d,x,h];return w.useEffect(()=>{const o=m[Math.floor(Math.random()*m.length)];o&&(o.play(),u.play())},[u]),r.jsxs("div",{className:n.logo+" not-content",children:[r.jsxs("svg",{onClick:()=>{m[y%m.length].play(),u.play(),y++},xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 500 500",enableBackground:"new 0 0 500 500",xmlSpace:"preserve",x:"0px",y:"0px",children:[r.jsx("path",{d:"M250-0.006C111.926-0.006,0,111.932,0,250.006c0,138.062,111.926,250,250,250   c138.062,0,250-111.938,250-250C500,111.932,388.062-0.006,250-0.006z M250,469.371c-120.961,0-219.365-98.404-219.365-219.365   S129.039,30.629,250,30.629c120.955,0,219.365,98.416,219.365,219.377S370.955,469.371,250,469.371z"}),r.jsx("polygon",{points:"173.005,250.006 173.005,349.953 361.28,250.006 173.005,150.059  "})]}),r.jsx("h1",{className:n.logoTitle,children:[...$].map((o,t)=>r.jsx("span",{children:o},t))})]})}export{T as default};
