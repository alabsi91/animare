const __vite__fileDeps=["_astro/ui-core.C3qV48Z0.js","_astro/Tabs.astro_astro_type_script_index_0_lang.CCIyraCc.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import"./Tabs.astro_astro_type_script_index_0_lang.CCIyraCc.js";class b extends HTMLElement{constructor(){super();const e=this.querySelector("select");e&&e.addEventListener("change",s=>{s.currentTarget instanceof HTMLSelectElement&&(window.location.pathname=s.currentTarget.value)})}}customElements.define("starlight-lang-select",b);const y="modulepreload",v=function(m){return"/animare/"+m},f={},S=function(e,s,r){let l=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=i?.nonce||i?.getAttribute("nonce");l=Promise.all(s.map(a=>{if(a=v(a),a in f)return;f[a]=!0;const d=a.endsWith(".css"),g=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${g}`))return;const t=document.createElement("link");if(t.rel=d?"stylesheet":y,d||(t.as="script",t.crossOrigin=""),t.href=a,o&&t.setAttribute("nonce",o),document.head.appendChild(t),d)return new Promise((c,n)=>{t.addEventListener("load",c),t.addEventListener("error",()=>n(new Error(`Unable to preload CSS for ${a}`)))})}))}return l.then(()=>e()).catch(i=>{const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i})};class w extends HTMLElement{constructor(){super();const e=this.querySelector("button[data-open-modal]"),s=this.querySelector("button[data-close-modal]"),r=this.querySelector("dialog"),l=this.querySelector(".dialog-frame"),i=n=>{("href"in(n.target||{})||document.body.contains(n.target)&&!l.contains(n.target))&&a()},o=n=>{r.showModal(),document.body.toggleAttribute("data-search-modal-open",!0),this.querySelector("input")?.focus(),n?.stopPropagation(),window.addEventListener("click",i)},a=()=>r.close();e.addEventListener("click",o),e.disabled=!1,s.addEventListener("click",a),r.addEventListener("close",()=>{document.body.toggleAttribute("data-search-modal-open",!1),window.removeEventListener("click",i)}),window.addEventListener("keydown",n=>{const u=document.activeElement instanceof HTMLElement&&(["input","select","textarea"].includes(document.activeElement.tagName.toLowerCase())||document.activeElement.isContentEditable);(n.metaKey===!0||n.ctrlKey===!0)&&n.key==="k"?(r.open?a():o(),n.preventDefault()):n.key==="/"&&!r.open&&!u&&(o(),n.preventDefault())});let d={};try{d=JSON.parse(this.dataset.translations||"{}")}catch{}const c=this.dataset.stripTrailingSlash!==void 0?n=>n.replace(/(.)\/(#.*)?$/,"$1$2"):n=>n;window.addEventListener("DOMContentLoaded",()=>{(window.requestIdleCallback||(u=>setTimeout(u,1)))(async()=>{const{PagefindUI:u}=await S(()=>import("./ui-core.C3qV48Z0.js"),__vite__mapDeps([0,1]));new u({element:"#starlight__search",baseUrl:"/animare",bundlePath:"/animare".replace(/\/$/,"")+"/pagefind/",showImages:!1,translations:d,showSubResults:!0,processResult:h=>{h.url=c(h.url),h.sub_results=h.sub_results.map(p=>(p.url=c(p.url),p))}})})})}}customElements.define("site-search",w);document.documentElement.setAttribute("data-theme","dark");class L extends HTMLElement{constructor(){super(),this.btn=this.querySelector("button"),this.btn.addEventListener("click",()=>this.toggleExpanded());const e=this.closest("nav");e&&e.addEventListener("keyup",s=>this.closeOnEscape(s))}setExpanded(e){this.setAttribute("aria-expanded",String(e)),document.body.toggleAttribute("data-mobile-menu-expanded",e)}toggleExpanded(){this.setExpanded(this.getAttribute("aria-expanded")!=="true")}closeOnEscape(e){e.code==="Escape"&&(this.setExpanded(!1),this.btn.focus())}}customElements.define("starlight-menu-button",L);const k="_top";class E extends HTMLElement{constructor(){super(),this._current=this.querySelector('a[aria-current="true"]'),this.minH=parseInt(this.dataset.minH||"2",10),this.maxH=parseInt(this.dataset.maxH||"3",10);const e=[...this.querySelectorAll("a")],s=t=>{if(t instanceof HTMLHeadingElement){if(t.id===k)return!0;const c=t.tagName[1];if(c){const n=parseInt(c,10);if(n>=this.minH&&n<=this.maxH)return!0}}return!1},r=t=>{if(!t)return null;const c=t;for(;t;){if(s(t))return t;for(t=t.previousElementSibling;t?.lastElementChild;)t=t.lastElementChild;const n=r(t);if(n)return n}return r(c.parentElement)},l=t=>{for(const{isIntersecting:c,target:n}of t){if(!c)continue;const u=r(n);if(!u)continue;const h=e.find(p=>p.hash==="#"+encodeURIComponent(u.id));if(h){this.current=h;break}}},i=document.querySelectorAll("main [id], main [id] ~ *, main .content > *");let o;const a=()=>{o&&o.disconnect(),o=new IntersectionObserver(l,{rootMargin:this.getRootMargin()}),i.forEach(t=>o.observe(t))};a();const d=window.requestIdleCallback||(t=>setTimeout(t,1));let g;window.addEventListener("resize",()=>{o&&o.disconnect(),clearTimeout(g),g=setTimeout(()=>d(a),200)})}set current(e){e!==this._current&&(this._current&&this._current.removeAttribute("aria-current"),e.setAttribute("aria-current","true"),this._current=e)}getRootMargin(){const e=document.querySelector("header")?.getBoundingClientRect().height||0,s=this.querySelector("summary")?.getBoundingClientRect().height||0,r=e+s+32,l=r+53,i=document.documentElement.clientHeight;return`-${r}px 0% ${l-i}px`}}customElements.define("starlight-toc",E);class T extends E{set current(e){super.current=e;const s=this.querySelector(".display-current");s&&(s.textContent=e.textContent)}constructor(){super();const e=this.querySelector("details");if(!e)return;const s=()=>{e.open=!1};e.querySelectorAll("a").forEach(r=>{r.addEventListener("click",s)}),window.addEventListener("click",r=>{e.contains(r.target)||s()}),window.addEventListener("keydown",r=>{if(r.key==="Escape"&&e.open){const l=e.contains(document.activeElement);if(s(),l){const i=e.querySelector("summary");i&&i.focus()}}})}}customElements.define("mobile-starlight-toc",T);export{S as _};
