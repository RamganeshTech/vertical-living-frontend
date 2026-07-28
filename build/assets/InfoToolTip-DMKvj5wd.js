import{r as n,j as r}from"./index-BR17hORQ.js";const v=({content:d,type:i="info",position:s="top",className:b=""})=>{const[c,a]=n.useState(!1),[e,l]=n.useState(!1),o=n.useRef(null);n.useEffect(()=>{const t=w=>{e&&o.current&&!o.current.contains(w.target)&&(l(!1),a(!1))};return document.addEventListener("mousedown",t),()=>{document.removeEventListener("mousedown",t)}},[e]);const u=()=>{e||a(!0)},m=()=>{e||a(!1)},x=()=>{l(!e),a(!e)},f=t=>{t.stopPropagation(),l(!1),a(!1)},h=()=>i==="info"?"?":"!",p=()=>{const t="absolute z-50 transform";switch(s){case"top":return`${t} bottom-full left-1/2 -translate-x-1/2 -translate-y-1 mb-1`;case"bottom":return`${t} top-full left-1/2 -translate-x-1/2 translate-y-1 mt-1`;case"left":return`${t} right-full top-1/2 -translate-y-1/2 -translate-x-1 mr-1`;case"right":return`${t} left-full top-1/2 -translate-y-1/2 translate-x-1 ml-1`;default:return`${t} bottom-full left-1/2 -translate-x-1/2 -translate-y-1 mb-1`}},g=()=>`
      w-4 h-4 rounded-full flex items-center justify-center 
      font-medium cursor-pointer transition-all duration-200 
      border-2 border-brand-ash bg-transparent hover:bg-brand-ash
      text-xs
     ${e?"bg-brand-ash/20 ring-1 ring-brand-ash text-text-muted":"text-text-muted hover:text-text-main"}`;return r.jsxs("div",{className:"inline-block relative mx-1",ref:o,children:[r.jsx("button",{className:g(),onMouseEnter:u,onMouseLeave:m,onClick:x,"aria-label":"More information",type:"button",children:h()}),(c||e)&&r.jsx("div",{className:p(),children:r.jsxs("div",{className:`
            bg-brand-surface text-text-main px-2 py-1 rounded-md shadow-lg border border-brand-ash
            text-xs leading-relaxed break-words whitespace-normal
            
!min-w-[100px] sm:!min-w-[150px] md:!min-w-[200px]
!max-w-[400px] sm:!max-w-[500px] md:!max-w-[600px]
 ${b}
            ${e?"border-brand-ash-dark ring-1 ring-brand-ash":""}
          `,children:[r.jsxs("div",{className:"flex items-start gap-1",children:[r.jsx("div",{className:"flex-1 break-words",children:d}),e&&r.jsx("button",{className:`\r
                                    cursor-pointer\r
                    flex-shrink-0 w-3 h-3 md:w-3.5 md:h-3.5\r
                    bg-transparent hover:bg-brand-ash-dark text-text-muted hover:text-text-main\r
                    rounded flex items-center justify-center \r
                    text-[10px] font-bold transition-colors border-0\r
                  `,onClick:f,"aria-label":"Close tooltip",type:"button",children:"×"})]}),r.jsx("div",{className:`
              absolute w-1.5 h-1.5 bg-brand-surface border border-brand-ash transform rotate-45
              ${s==="top"?"top-full left-1/2 -translate-x-1/2 -translate-y-0.5 border-t-0 border-l-0":""}
              ${s==="bottom"?"bottom-full left-1/2 -translate-x-1/2 translate-y-0.5 border-b-0 border-r-0":""}
              ${s==="left"?"left-full top-1/2 -translate-y-1/2 -translate-x-0.5 border-b-0 border-l-0":""}
              ${s==="right"?"right-full top-1/2 -translate-y-1/2 translate-x-0.5 border-t-0 border-r-0":""}
            `})]})})]})};export{v as I};
