import{j as e}from"./index-DLaY3p7d.js";const p=({variant:o="primary",size:s="md",children:l,isLoading:t=!1,className:n="",disabled:r,...a})=>{const c="inline-flex cursor-pointer items-center justify-center font-medium transition-colors focus:outline-none",i={primary:"bg-blue-600 hover:bg-blue-700 text-white shadow-sm",secondary:"bg-blue-100 hover:bg-blue-200 text-blue-700",outline:"border border-blue-200 hover:bg-blue-50 text-blue-600",danger:"border border-red-200 hover:bg-red-500 text-red-600",ghost:"hover:bg-gray-100 text-gray-700",link:"text-blue-600 hover:underline p-0 h-auto"},d={sm:"text-xs px-2.5 py-1.5 rounded-lg",md:"text-sm px-4 py-2 rounded-xl",lg:"text-base px-6 py-3 rounded-xl",icon:"p-2 rounded-lg"},u=`
    ${c} 
    ${i[o]} 
    ${d[s]} 
    ${r?"opacity-50 cursor-not-allowed":""} 
    ${t?"opacity-80 cursor-wait":""}
    ${n}
  `.trim();return e.jsxs("button",{className:u,disabled:r||t,...a,children:[t&&e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-current",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),l]})};export{p as B};
