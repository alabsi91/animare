const __vite__fileDeps=["_astro/ui-core.Cjlo9aCS.js","_astro/animare.BqJ0QUF9.js","_astro/index.ChPNCYSA.js","_astro/Tabs.astro_astro_type_script_index_0_lang.CCIyraCc.js","_astro/router.DrYAXS1K.js","_astro/index.CTbVEFV3.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{a as S,D as K,T as w}from"./animare.BqJ0QUF9.js";import{e as g}from"./index.ChPNCYSA.js";import"./Tabs.astro_astro_type_script_index_0_lang.CCIyraCc.js";import{a as N,T as G,s as V,n as R}from"./router.DrYAXS1K.js";import{i as W}from"./index.CTbVEFV3.js";const X="_top";class O extends HTMLElement{constructor(){super(),this._current=this.querySelector('a[aria-current="true"]'),this.minH=parseInt(this.dataset.minH||"2",10),this.maxH=parseInt(this.dataset.maxH||"3",10);const e=[...this.querySelectorAll("a")],n=a=>{if(a instanceof HTMLHeadingElement){if(a.id===X)return!0;const l=a.tagName[1];if(l){const i=parseInt(l,10);if(i>=this.minH&&i<=this.maxH)return!0}}return!1},r=a=>{if(!a)return null;const l=a;for(;a;){if(n(a))return a;for(a=a.previousElementSibling;a?.lastElementChild;)a=a.lastElementChild;const i=r(a);if(i)return i}return r(l.parentElement)},o=a=>{for(const{isIntersecting:l,target:i}of a){if(!l)continue;const p=r(i);if(!p)continue;const h=e.find(E=>E.hash==="#"+encodeURIComponent(p.id));if(h){this.current=h;break}}},u=document.querySelectorAll("main [id], main [id] ~ *, main .content > *");let c;const s=()=>{c&&c.disconnect(),c=new IntersectionObserver(o,{rootMargin:this.getRootMargin()}),u.forEach(a=>c.observe(a))};s();const d=window.requestIdleCallback||(a=>setTimeout(a,1));let f;window.addEventListener("resize",()=>{c&&c.disconnect(),clearTimeout(f),f=setTimeout(()=>d(s),200)})}set current(e){e!==this._current&&(this._current&&this._current.removeAttribute("aria-current"),e.setAttribute("aria-current","true"),this._current=e)}getRootMargin(){const e=document.querySelector("header")?.getBoundingClientRect().height||0,n=this.querySelector("summary")?.getBoundingClientRect().height||0,r=e+n+32,o=r+53,u=document.documentElement.clientHeight;return`-${r}px 0% ${o-u}px`}}customElements.define("starlight-toc",O);class j extends O{set current(e){super.current=e;const n=this.querySelector(".display-current");n&&(n.textContent=e.textContent)}constructor(){super();const e=this.querySelector("details");if(!e)return;const n=()=>{e.open=!1};e.querySelectorAll("a").forEach(r=>{r.addEventListener("click",n)}),window.addEventListener("click",r=>{e.contains(r.target)||n()}),window.addEventListener("keydown",r=>{if(r.key==="Escape"&&e.open){const o=e.contains(document.activeElement);if(n(),o){const u=e.querySelector("summary");u&&u.focus()}}})}}customElements.define("mobile-starlight-toc",j);class z extends HTMLElement{constructor(){super(),this.btn=this.querySelector("button"),this.btn.addEventListener("click",()=>this.toggleExpanded());const e=this.closest("nav");e&&e.addEventListener("keyup",n=>this.closeOnEscape(n))}setExpanded(e){this.setAttribute("aria-expanded",String(e)),document.body.toggleAttribute("data-mobile-menu-expanded",e)}toggleExpanded(){this.setExpanded(this.getAttribute("aria-expanded")!=="true")}closeOnEscape(e){e.code==="Escape"&&(this.setExpanded(!1),this.btn.focus())}}customElements.define("starlight-menu-button",z);class J extends HTMLElement{constructor(){super();const e=this.querySelector("select");e&&e.addEventListener("change",n=>{n.currentTarget instanceof HTMLSelectElement&&(window.location.pathname=n.currentTarget.value)})}}customElements.define("starlight-lang-select",J);const Y="modulepreload",Z=function(t){return"/animare/"+t},_={},Q=function(e,n,r){let o=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const u=document.querySelector("meta[property=csp-nonce]"),c=u?.nonce||u?.getAttribute("nonce");o=Promise.all(n.map(s=>{if(s=Z(s),s in _)return;_[s]=!0;const d=s.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${f}`))return;const a=document.createElement("link");if(a.rel=d?"stylesheet":Y,d||(a.as="script",a.crossOrigin=""),a.href=s,c&&a.setAttribute("nonce",c),document.head.appendChild(a),d)return new Promise((l,i)=>{a.addEventListener("load",l),a.addEventListener("error",()=>i(new Error(`Unable to preload CSS for ${s}`)))})}))}return o.then(()=>e()).catch(u=>{const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=u,window.dispatchEvent(c),!c.defaultPrevented)throw u})};class tt extends HTMLElement{constructor(){super();const e=this.querySelector("button[data-open-modal]"),n=this.querySelector("button[data-close-modal]"),r=this.querySelector("dialog"),o=this.querySelector(".dialog-frame"),u=i=>{("href"in(i.target||{})||document.body.contains(i.target)&&!o.contains(i.target))&&s()},c=i=>{r.showModal(),document.body.toggleAttribute("data-search-modal-open",!0),this.querySelector("input")?.focus(),i?.stopPropagation(),window.addEventListener("click",u)},s=()=>r.close();e.addEventListener("click",c),e.disabled=!1,n.addEventListener("click",s),r.addEventListener("close",()=>{document.body.toggleAttribute("data-search-modal-open",!1),window.removeEventListener("click",u)}),window.addEventListener("keydown",i=>{const p=document.activeElement instanceof HTMLElement&&(["input","select","textarea"].includes(document.activeElement.tagName.toLowerCase())||document.activeElement.isContentEditable);(i.metaKey===!0||i.ctrlKey===!0)&&i.key==="k"?(r.open?s():c(),i.preventDefault()):i.key==="/"&&!r.open&&!p&&(c(),i.preventDefault())});let d={};try{d=JSON.parse(this.dataset.translations||"{}")}catch{}const l=this.dataset.stripTrailingSlash!==void 0?i=>i.replace(/(.)\/(#.*)?$/,"$1$2"):i=>i;window.addEventListener("DOMContentLoaded",()=>{(window.requestIdleCallback||(p=>setTimeout(p,1)))(async()=>{const{PagefindUI:p}=await Q(()=>import("./ui-core.Cjlo9aCS.js"),__vite__mapDeps([0,1,2,3,4,5]));new p({element:"#starlight__search",baseUrl:"/animare",bundlePath:"/animare".replace(/\/$/,"")+"/pagefind/",showImages:!1,translations:d,showSubResults:!0,processResult:h=>{h.url=l(h.url),h.sub_results=h.sub_results.map(E=>(E.url=l(E.url),E))}})})})}}customElements.define("site-search",tt);const D=document.querySelector(".logo svg"),m=document.querySelectorAll(".logoTitle span");let C=0;const T=500,et=S.single({from:1,to:.9,duration:500,direction:K.Alternate,ease:g.out.quart,autoPlay:!1},({value:t})=>{D.style.transform=`scale(${t})`}),nt=S.group({to:new Array(m.length).fill([0,1]).flat(),from:t=>t%2===0?40:0,duration:1200,delay:t=>T+~~(t/2)*50,ease:new Array(m.length).fill([g.out.expo,g.linear]).flat(),timing:w.FromStart,autoPlay:!1},t=>{for(let e=0;e<t.length;e+=2)m[e/2].style.transform=`translateX(${t[e].value}px)`,m[e/2].style.opacity=t[e+1].value+""}),rt=S.group({to:new Array(m.length).fill([0,1,0]).flat(),from:t=>t%3===0?-40:t%3===1?0:2,delay:t=>T+~~(t/3)*50,duration:800,ease:new Array(m.length).fill([g.out.expo,g.out.expo,g.linear]).flat(),timing:w.FromStart,autoPlay:!1},t=>{for(let e=0;e<t.length;e+=3)m[e/3].style.transform=`translateX(${t[e].value}px)`,m[e/3].style.opacity=t[e+1].value+"",m[e/3].style.filter=`blur(${t[e+2].value}px)`}),ot=S.group({to:new Array(m.length).fill(1),duration:t=>1e3+t*50,delay:t=>T+t*50,ease:g.spring({mass:2,damping:12,stiffness:70,velocity:9,duration:2500}),timing:w.FromStart,autoPlay:!1},t=>m.forEach((e,n)=>e.style.transform=`scale(${t[n].value})`)),at=S.group({to:new Array(m.length*3).fill(0),from:t=>t%3===0?.55:t%3===1?1.1:180,duration:750,delay:t=>T+~~(t/3)*50,ease:g.out.expo,timing:w.FromStart,autoPlay:!1},(t,{isFirstFrame:e,isFinished:n})=>{if(e){const r=m[0].parentElement;r.style.overflow="hidden"}for(let r=0;r<t.length;r+=3)m[r/3].style.transform=`translateX(${t[r].value}em) translateY(${t[r+1].value}em) rotateZ(${t[r+2].value}deg)`;n&&m[0].parentElement.style.removeProperty("overflow")}),$=[nt,rt,ot,at],st=()=>{$[C%$.length].play(),et.play(),C++};D.addEventListener("click",st);document.documentElement.setAttribute("data-theme","dark");const y="data-astro-transition-persist";function it(t){for(const e of document.scripts)for(const n of t.scripts)if(!n.hasAttribute("data-astro-rerun")&&(!e.src&&e.textContent===n.textContent||e.src&&e.type===n.type&&e.src===n.src)){n.dataset.astroExec="";break}}function ct(t){const e=document.documentElement,n=[...e.attributes].filter(({name:r})=>(e.removeAttribute(r),r.startsWith("data-astro-")));[...t.documentElement.attributes,...n].forEach(({name:r,value:o})=>e.setAttribute(r,o))}function lt(t){for(const e of Array.from(document.head.children)){const n=mt(e,t);n?n.remove():e.remove()}document.head.append(...t.head.children)}function ut(t,e){e.replaceWith(t);for(const n of e.querySelectorAll(`[${y}]`)){const r=n.getAttribute(y),o=t.querySelector(`[${y}="${r}"]`);o&&(o.replaceWith(n),o.localName==="astro-island"&&ft(n)&&(n.setAttribute("ssr",""),n.setAttribute("props",o.getAttribute("props"))))}}const dt=()=>{const t=document.activeElement;if(t?.closest(`[${y}]`)){if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement){const e=t.selectionStart,n=t.selectionEnd;return()=>L({activeElement:t,start:e,end:n})}return()=>L({activeElement:t})}else return()=>L({activeElement:null})},L=({activeElement:t,start:e,end:n})=>{t&&(t.focus(),(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)&&(typeof e=="number"&&(t.selectionStart=e),typeof n=="number"&&(t.selectionEnd=n)))},mt=(t,e)=>{const n=t.getAttribute(y),r=n&&e.head.querySelector(`[${y}="${n}"]`);if(r)return r;if(t.matches("link[rel=stylesheet]")){const o=t.getAttribute("href");return e.head.querySelector(`link[rel=stylesheet][href="${o}"]`)}return null},ft=t=>{const e=t.dataset.astroTransitionPersistProps;return e==null||e==="false"},pt="vtbot-replace-swap",ht=()=>(document.querySelector(`meta[name="${pt}"]`)?.getAttribute("content")??"").split(",").map(t=>t.trim());document.addEventListener(N,t=>{const e=t.swap;t.swap=()=>{const n=l=>{const i=l.body.querySelectorAll("[data-vtbot-replace]"),p=[...i].map(h=>h instanceof HTMLElement&&h.dataset.vtbotReplace);return{elements:[...i],names:new Set(p)}},{elements:r,names:o}=n(document),{elements:u,names:c}=n(t.newDocument),s=[...o].filter(l=>c.has(l));if(s.length===0){e();return}const d=t.newDocument;it(d);const f=ht().map(l=>({key:l,val:document.documentElement.getAttribute(l)}));ct(d),f.forEach(l=>l.val!==null&&document.documentElement.setAttribute(l.key,l.val)),lt(d);const a=dt();s.forEach(l=>{const i=r.find(h=>h.dataset.vtbotReplace===l),p=u.find(h=>h.dataset.vtbotReplace===l);i&&p&&ut(p,i)}),a(),[...document.querySelectorAll("[class*='astro-route-announcer']")].forEach(l=>l.remove())}});const q="div.main-frame",gt=`${q} main`,bt="data-mobile-menu-expanded",yt="starlight-menu-button",A="nav.sidebar",b=`${A} .sidebar-content`,I="starlight-lang-select";function Et(t){const e=c(t.href),n=e.split(""),r=document.querySelectorAll(`${b} a[href^='/']`);if(r.length===0)return null;const o=[...r],u=o.map(s=>c(new URL(s.href,location.href).href));return o[u.map(s=>s.split("").findIndex((d,f)=>d!==n[f])).map((s,d)=>s!==-1?s:Math.min(e.length,u[d].length)+(e.length===u[d].length?1:0)).reduce((s,d,f,a)=>d>a[s]?f:s,0)];function c(s){return s.replace(/\/#/,"#").replace(/\/$/,"")}}function St(){document.querySelectorAll(`${b} [aria-current="page"]`)?.forEach(t=>t.removeAttribute("aria-current"))}function At(t){St(),Et(t)?.setAttribute("aria-current","page")}function U(t,e=!0){const n=document.querySelector(`${b} [aria-current="page"]`);let r=n?.closest("details");for(;r;)r.open=!0,r=r.parentElement?.closest("details");e&&n?.scrollIntoView({block:"center",behavior:"instant"})}function P(t){t.querySelectorAll(b+" .__collapse input").forEach((e,n)=>e.setAttribute("data-vtbot-replace",`vtbot-sms-v0-${n}`)),t.querySelectorAll(b+" :is(starlight-multi-sidebar-tabs, starlight-multi-sidebar-select)").forEach((e,n)=>{e.setAttribute("data-vtbot-replace",`vtbot-sms-${n}`),[...e.children].forEach((r,o)=>{o>0&&[...r.children].forEach((u,c)=>u.setAttribute("data-astro-transition-persist",`vtbot-sms-${n}-${o}-${c}`))})})}const vt="vtbot-starlight-replace-sidebar-content",wt="vtbot-starlight-retain-current-page-marker",F=()=>({replaceSidebarContent:document.querySelector(`head meta[name="${vt}"]`),retainCurrentPageMarker:document.querySelector(`head meta[name="${wt}"]`),mainTransitionScope:document.querySelector('head meta[name="vtbot-main-transition-scope"]')?.content});let{replaceSidebarContent:k,retainCurrentPageMarker:M,mainTransitionScope:v}=F();U();B(window.document);function Tt(t){x(document),x(t.newDocument),kt(),B(t.newDocument),Mt(t),!k&&!M&&At(t.to)}function Lt(t){Rt(t.newDocument)}function qt(t){!M&&U()}function kt(){document.body.hasAttribute(bt)&&document.body.querySelector(yt)?.closest("nav")?.dispatchEvent(new KeyboardEvent("keyup",{key:"Escape",code:"Escape",charCode:27,keyCode:27,shiftKey:!1,ctrlKey:!1,altKey:!1,metaKey:!1}))}function x(t){t.body.querySelector(q)?.setAttribute("data-vtbot-replace","main")}function Mt(t){if(!v)return;e(document,v),e(t.newDocument,v);function e(n,r){const o=n.querySelector(gt);o&&(o.dataset.astroTransitionScope=r)}}function Rt(t){const e=t.querySelector(A);if(!e)document.querySelector(A)?.remove();else{const n=document.querySelector(A);if(!n)document.querySelector(q)?.insertAdjacentElement("beforebegin",e);else{const r=n.querySelector(b),o=e.querySelector(b),u=[...r?.querySelectorAll("a")??[]].map(c=>c.href).join(" ")!==[...o?.querySelectorAll("a")??[]].map(c=>c.href).join(" ");k||u?r&&o?(r.setAttribute("data-vtbot-replace","vtbot-sidebar-content"),o.setAttribute("data-vtbot-replace","vtbot-sidebar-content"),n.removeAttribute("data-vtbot-replace"),e.removeAttribute("data-vtbot-replace")):(n.setAttribute("data-vtbot-replace","vtbot-sidebar-content"),e.setAttribute("data-vtbot-replace","vtbot-sidebar-content"),r?.removeAttribute("data-vtbot-replace"),o?.removeAttribute("data-vtbot-replace")):(P(document),P(t))}}}function B(t){t.querySelectorAll(I).forEach((e,n)=>e.setAttribute("data-vtbot-replace",`vtbot-${I}-${n}`))}document.addEventListener(G,t=>{({replaceSidebarContent:k,retainCurrentPageMarker:M,mainTransitionScope:v}=F());const e=t.loader;t.loader=async()=>{await e(),Tt(t)}});document.addEventListener(N,t=>{Lt(t);const e=t.swap;t.swap=()=>{e(),qt()}});function _t(){const t=document.querySelector('[name="astro-view-transitions-fallback"]');return t?t.getAttribute("content"):"animate"}function H(t){return t.dataset.astroReload!==void 0}(V||_t()!=="none")&&(document.addEventListener("click",t=>{let e=t.target;if(t.composed&&(e=t.composedPath()[0]),e instanceof Element&&(e=e.closest("a, area")),!(e instanceof HTMLAnchorElement)&&!(e instanceof SVGAElement)&&!(e instanceof HTMLAreaElement))return;const n=e instanceof HTMLElement?e.target:e.target.baseVal,r=e instanceof HTMLElement?e.href:e.href.baseVal,o=new URL(r,location.href).origin;H(e)||e.hasAttribute("download")||!e.href||n&&n!=="_self"||o!==location.origin||t.button!==0||t.metaKey||t.ctrlKey||t.altKey||t.shiftKey||t.defaultPrevented||(t.preventDefault(),R(r,{history:e.dataset.astroHistory==="replace"?"replace":"auto",sourceElement:e}))}),document.addEventListener("submit",t=>{let e=t.target;if(e.tagName!=="FORM"||t.defaultPrevented||H(e))return;const n=e,r=t.submitter,o=new FormData(n,r),u=typeof n.action=="string"?n.action:n.getAttribute("action"),c=typeof n.method=="string"?n.method:n.getAttribute("method");let s=r?.getAttribute("formaction")??u??location.pathname;const d=r?.getAttribute("formmethod")??c??"get";if(d==="dialog"||location.origin!==new URL(s,location.href).origin)return;const f={sourceElement:r??n};if(d==="get"){const a=new URLSearchParams(o),l=new URL(s);l.search=a.toString(),s=l.toString()}else f.formData=o;t.preventDefault(),R(s,f)}),W({prefetchAll:!0}));export{Q as _};
