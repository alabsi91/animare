import{r as a}from"./index.DhYZZe0J.js";var u={exports:{}},s={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var l=a,m=Symbol.for("react.element"),_=Symbol.for("react.fragment"),c=Object.prototype.hasOwnProperty,y=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d={key:!0,ref:!0,__self:!0,__source:!0};function p(o,e,n){var r,t={},i=null,f=null;n!==void 0&&(i=""+n),e.key!==void 0&&(i=""+e.key),e.ref!==void 0&&(f=e.ref);for(r in e)c.call(e,r)&&!d.hasOwnProperty(r)&&(t[r]=e[r]);if(o&&o.defaultProps)for(r in e=o.defaultProps,e)t[r]===void 0&&(t[r]=e[r]);return{$$typeof:m,type:o,key:i,ref:f,props:t,_owner:y.current}}s.Fragment=_;s.jsx=p;s.jsxs=p;u.exports=s;var x=u.exports;function E(o){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];const[n,r]=a.useState();return a.useEffect(()=>{n&&(n.clearEvents(),n.timelineInfo.isPlaying&&n.pause());const t=o();return r(t),()=>{t.clearEvents(),t.timelineInfo.isPlaying&&t.pause()}},e),n}export{x as j,E as u};
