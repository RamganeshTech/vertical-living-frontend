import{r as l,j as r}from"./index-DyM6T-eT.js";const v=({content:i,type:u="info",position:s="top",className:d=""})=>{const[b,a]=l.useState(!1),[t,n]=l.useState(!1),o=l.useRef(null);l.useEffect(()=>{const e=y=>{t&&o.current&&!o.current.contains(y.target)&&(n(!1),a(!1))};return document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}},[t]);const c=()=>{t||a(!0)},f=()=>{t||a(!1)},m=()=>{n(!t),a(!t)},x=e=>{e.stopPropagation(),n(!1),a(!1)},g=()=>u==="info"?"?":"!",p=()=>{const e="absolute z-50 transform";switch(s){case"top":return`${e} bottom-full left-1/2 -translate-x-1/2 -translate-y-1 mb-1`;case"bottom":return`${e} top-full left-1/2 -translate-x-1/2 translate-y-1 mt-1`;case"left":return`${e} right-full top-1/2 -translate-y-1/2 -translate-x-1 mr-1`;case"right":return`${e} left-full top-1/2 -translate-y-1/2 translate-x-1 ml-1`;default:return`${e} bottom-full left-1/2 -translate-x-1/2 -translate-y-1 mb-1`}},h=()=>`
      w-4 h-4 rounded-full flex items-center justify-center 
      font-medium cursor-pointer transition-all duration-200 
      border border-blue-500 bg-transparent hover:bg-blue-50
      text-xs
     ${t?"bg-blue-50 ring-1 ring-blue-400 text-blue-600":"text-blue-500 hover:text-blue-600"}`;return r.jsxs("div",{className:"inline-block relative mx-1",ref:o,children:[r.jsx("button",{className:h(),onMouseEnter:c,onMouseLeave:f,onClick:m,"aria-label":"More information",type:"button",children:g()}),(b||t)&&r.jsx("div",{className:p(),children:r.jsxs("div",{className:`
            bg-white text-gray-700 px-2 py-1 rounded-md shadow-lg border border-gray-200
            text-xs leading-relaxed break-words whitespace-normal
            
!min-w-[100px] sm:!min-w-[150px] md:!min-w-[200px]
!max-w-[400px] sm:!max-w-[500px] md:!max-w-[600px]
 ${d}
            ${t?"border-blue-300 ring-1 ring-blue-200":""}
          `,children:[r.jsxs("div",{className:"flex items-start gap-1",children:[r.jsx("div",{className:"flex-1 break-words",children:i}),t&&r.jsx("button",{className:`\r
                                    cursor-pointer\r
                    flex-shrink-0 w-3 h-3 md:w-3.5 md:h-3.5\r
                    bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700\r
                    rounded flex items-center justify-center \r
                    text-[10px] font-bold transition-colors border-0\r
                  `,onClick:x,"aria-label":"Close tooltip",type:"button",children:"×"})]}),r.jsx("div",{className:`
              absolute w-1.5 h-1.5 bg-white border border-gray-200 transform rotate-45
              ${s==="top"?"top-full left-1/2 -translate-x-1/2 -translate-y-0.5 border-t-0 border-l-0":""}
              ${s==="bottom"?"bottom-full left-1/2 -translate-x-1/2 translate-y-0.5 border-b-0 border-r-0":""}
              ${s==="left"?"left-full top-1/2 -translate-y-1/2 -translate-x-0.5 border-b-0 border-l-0":""}
              ${s==="right"?"right-full top-1/2 -translate-y-1/2 translate-x-0.5 border-t-0 border-r-0":""}
            `})]})})]})};export{v as I};
