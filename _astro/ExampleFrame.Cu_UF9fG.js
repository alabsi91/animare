import{j as t}from"./useAnimare.K1gqI4ev.js";import{r as s}from"./index.DhYZZe0J.js";import{s as m}from"./ExampleFrame_module.a49b6180.D0zKF7Sg.js";import{E as u}from"./animare.BqJ0QUF9.js";function g(e){const i=s.useRef(null),l=s.useRef(null);e.slider.current=l.current,s.useEffect(()=>{e.timeline&&(e.timeline.on(u.Play,()=>{a(!1)}),e.timeline.on(u.Pause,()=>{a(!0)}),e.timeline.on(u.Complete,()=>{a(!0)}))},[e.timeline]);const a=n=>{if(i.current){if(n){i.current.style.d='path("M20,20 L80,50 L20,80 L20,80 Z M65,20 L80,20 L80,20 L65,20 Z")';return}i.current.style.d='path("M20,20 L35,20 L35,80 L20,80 Z M65,20 L80,20 L80,80 L65,80 Z")'}};function c(){if(e.timeline.timelineInfo.isPlaying){e.timeline.pause();return}const n=l.current?.value??"0",r=e.timeline.timelineInfo.isFinished?0:e.timeline.timelineInfo.duration*parseFloat(n);e.timeline.play(r)}function o(n){const r=n.target,f=parseFloat(r.value);e.timeline.seek(e.timeline.timelineInfo.duration*f),e.timeline.timelineInfo.isPlaying||e.timeline.playOneFrame()}return t.jsxs("div",{className:m.wrapper,children:[t.jsx("span",{children:e.title}),e.children,t.jsxs("div",{className:m.controlsContainer,children:[t.jsx("button",{onClick:c,children:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",height:"24px",viewBox:"0 0 100 100",width:"24px",children:t.jsx("path",{ref:i,d:"M20,20 L80,50 L20,80 L20,80 Z M65,20 L80,20 L80,20 L65,20 Z"})})}),t.jsx("input",{ref:l,className:m.slider,onChange:o,type:"range",min:"0",max:"1",defaultValue:"0",step:.001})]})]})}export{g as E};
