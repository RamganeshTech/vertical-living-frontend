import{r as w,j as e,I as _,B as v,t as f,d as V,m as $,e as F,g as R,a as q,n as D}from"./index-Bp58Hj9Q.js";import{C as z}from"./Card-CcBYg6qB.js";import{A as Q,S as U}from"./AssignStaff--dWpVw8S.js";import{R as B}from"./ResetStageButton-DnFRz2AD.js";import W from"./MaterialOverviewLoading-DJzlKxep.js";import{S as K}from"./ShareDocumentWhatsapp-D5J7m5cD.js";import{u as H,a as Y,b as J}from"./materialArrivalNewApi-DjoO8a1m.js";import{N as E}from"./constants-BhfkdIAq.js";import"./getAllUsersApi-DLOj95NN.js";import"./Skeleton-OQa7E2V5.js";import"./documentationApi-Bzf-WBuk.js";import"./requirementFormApi-D2YIsqAi.js";const X=({projectId:s,context:l,label:i,generateLink:d,isPending:a,data:n})=>{const[r,m]=w.useState(""),[o,g]=w.useState(!1);w.useEffect(()=>{typeof n=="string"&&m(n)},[n]);const u=async()=>{try{await navigator.clipboard.writeText(r),g(!0),setTimeout(()=>g(!1),1500)}catch{f({title:"Error",description:"Failed to copy link",variant:"destructive"})}},x=()=>{const c=encodeURIComponent(`Hey, please check this ${l} link:\`${r}`);window.open(`https://wa.me/?text=${c}`,"_blank")},p=async()=>{var c,N;try{const t=await d({projectId:s});t!=null&&t.shareableUrl&&(m(t.shareableUrl),f({title:"Link generated",description:"You can now share the link",variant:"default"}))}catch(t){f({title:"Error",description:((N=(c=t==null?void 0:t.response)==null?void 0:c.data)==null?void 0:N.message)||(t==null?void 0:t.message)||"Failed to generate link",variant:"destructive"})}};return e.jsxs("div",{className:"bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm w-full max-w-xl",children:[e.jsx("div",{className:"flex items-center justify-between mb-3",children:e.jsxs("h3",{className:"text-lg font-semibold text-blue-800 flex items-center gap-2",children:[e.jsx("i",{className:"fas fa-link"})," ",i||"Generate Shareable Link"]})}),r?e.jsxs("div",{className:"flex flex-col sm:flex-row gap-2 items-center",children:[e.jsx(_,{readOnly:!0,value:r,className:"flex-1 text-sm cursor-default"}),e.jsxs(v,{onClick:u,variant:"outline",className:"flex gap-2",children:[e.jsx("i",{className:`fas ${o?"fa-check-circle":"fa-copy"}`}),o?"Copied":"Copy"]}),e.jsxs(v,{onClick:x,className:"bg-green-500 hover:bg-green-600 text-white flex gap-2",children:[e.jsx("i",{className:"fab fa-whatsapp"}),"Share"]})]}):e.jsx(v,{onClick:p,disabled:a,className:"bg-blue-600 hover:bg-blue-700 text-white",children:a?"Generating...":"Generate Link"})]})},Z=async({formId:s,projectId:l,deadLine:i,api:d})=>{const{data:a}=await d.put(`/materialarrivalcheck/deadline/${l}/${s}`,{deadLine:i});if(!a.ok)throw new Error(a.message);return a.data},ee=async({projectId:s,api:l})=>{const{data:i}=await l.put(`/materialarrivalcheck/completionstatus/${s}`);if(!i.ok)throw new Error(i.message);return i.data},se=()=>{const s=["owner","staff","CTO"],{role:l}=V(),i=R(l),d=$();return F({mutationFn:async({formId:a,projectId:n,deadLine:r})=>{if(!l||!s.includes(l))throw new Error("not allowed to make this api call");if(!i)throw new Error("API instance missing");return await Z({formId:a,projectId:n,deadLine:r,api:i})},onSuccess:(a,n)=>{d.invalidateQueries({queryKey:["ordering-material",n.formId]})}})},ae=()=>{const s=["owner","staff","CTO"],{role:l}=V(),i=R(l),d=$();return F({mutationFn:async({projectId:a})=>{if(!l||!s.includes(l))throw new Error("not allowed to make this api call");if(!i)throw new Error("API instance missing");return await ee({projectId:a,api:i})},onSuccess:(a,{projectId:n})=>{d.invalidateQueries({queryKey:["material-arrival",n]})}})},te=({item:s,projectId:l,index:i})=>{var o,g,u;const{mutateAsync:d,isPending:a}=H(),[n,r]=w.useState(!1),m=async()=>{var x,p;try{await d({projectId:l,fieldId:s.customId,toggle:!(s!=null&&s.isVerified)}),f({title:"Success",description:"Verification status updated."})}catch(c){f({title:"Error",description:((p=(x=c==null?void 0:c.response)==null?void 0:x.data)==null?void 0:p.message)||c.message||"Failed to update",variant:"destructive"})}};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:`grid grid-cols-5 gap-4 px-4 py-4 hover:bg-gray-50 transition-colors duration-200 ${i%2===0?"bg-white":"bg-gray-25"}`,children:[e.jsx("div",{className:"flex items-center",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold",children:i+1}),e.jsx("span",{className:"font-medium text-gray-800 truncate",children:s.customId||"N/A"})]})}),e.jsx("div",{className:"flex items-center",children:e.jsx("div",{className:"bg-gray-100 px-3 py-1 rounded-full",children:e.jsx("span",{className:"font-semibold text-gray-700",children:s.quantity})})}),e.jsx("div",{className:"flex items-center",children:s!=null&&s.image?e.jsxs("div",{className:"relative group cursor-pointer",onClick:()=>r(!0),children:[e.jsx("div",{className:"w-45 h-45 border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200",children:e.jsx("img",{src:((o=s==null?void 0:s.image)==null?void 0:o.url)||E,alt:s.image.originalName||"Material Image",className:"w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"})}),e.jsx("div",{className:"absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center",children:e.jsx("div",{className:"opacity-0 group-hover:opacity-100 transition-opacity duration-200"})})]}):e.jsx("div",{className:"w-45 h-45 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50",children:e.jsxs("div",{className:"text-center",children:[e.jsx("i",{className:"fa-solid fa-image text-gray-400 text-lg mb-1"}),e.jsx("p",{className:"text-xs text-gray-400",children:"No Image"})]})})}),e.jsx("div",{className:"flex items-center",children:e.jsxs("div",{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${s.isVerified?"bg-green-100 text-green-700 border border-green-200":"bg-gray-100 text-gray-600 border border-gray-200"}`,children:[e.jsx("i",{className:`fa-solid ${s.isVerified?"fa-check-circle":"fa-clock"} text-xs`}),s.isVerified?"Verified":"Pending"]})}),e.jsx("div",{className:"flex items-center",children:e.jsxs(v,{onClick:m,disabled:a,size:"sm",className:`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${s.isVerified?"bg-orange-500 hover:bg-orange-600 text-white":"bg-green-500 hover:bg-green-600 text-white"}`,children:[a?e.jsx("i",{className:"fa-solid fa-spinner fa-spin"}):e.jsx("i",{className:`fa-solid ${s.isVerified?"fa-times":"fa-check"}`}),s.isVerified?"Unverify":"Verify"]})})]}),n&&s.image&&e.jsx("div",{className:"fixed inset-0 bg-black/70  flex items-center justify-center z-50 p-4",onClick:()=>r(!1),children:e.jsxs("div",{className:"relative w-[80vw] h-[80vh] max-w-4xl",children:[e.jsx("button",{onClick:()=>r(!1),className:"absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10",children:e.jsx("i",{className:"fa-solid fa-times text-2xl"})}),e.jsx("img",{src:((g=s==null?void 0:s.image)==null?void 0:g.url)||E,alt:((u=s==null?void 0:s.image)==null?void 0:u.originalName)||"Material Image",className:"w-full h-full object-contain rounded-lg shadow-2xl",onClick:x=>x.stopPropagation()}),e.jsxs("div",{className:"absolute bottom-0 left-0 right-0 bg-black  text-white p-4 rounded-b-lg",children:[e.jsx("p",{className:"text-sm font-medium",children:s.image.originalName||"Material Image"}),e.jsx("p",{className:"text-xs text-gray-300",children:"Click outside to close"})]})]})})]})},ue=()=>{var M,A,S,I,L,P;const{projectId:s,organizationId:l}=q(),{isMobile:i,openMobileSidebar:d}=D(),{data:a,isLoading:n,error:r,isError:m,refetch:o}=Y(s),{mutateAsync:g,isPending:u}=J(),{mutateAsync:x,isPending:p}=se(),{mutateAsync:c,isPending:N}=ae();if(n)return e.jsx(W,{});const{timer:t,generatedLink:T}=a||{},G=async()=>{var h,y;try{await c({projectId:s}),f({description:"Completion status updated successfully",title:"Success"})}catch(b){f({title:"Error",description:((y=(h=b==null?void 0:b.response)==null?void 0:h.data)==null?void 0:y.message)||(b==null?void 0:b.message)||"Failed to update completion status",variant:"destructive"})}},j=((M=a==null?void 0:a.materialArrivalList)==null?void 0:M.length)||0,k=((S=(A=a==null?void 0:a.materialArrivalList)==null?void 0:A.filter(h=>h.isVerified))==null?void 0:S.length)||0,O=j-k,C=j>0?Math.round(k/j*100):0;return e.jsxs("div",{className:"w-full h-full flex flex-col p-2 ",children:[e.jsxs("div",{className:"flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 pb-3 ",children:[e.jsxs("h2",{className:"text-2xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center",children:[i&&e.jsx("button",{onClick:d,className:"mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100",title:"Open Menu",children:e.jsx("i",{className:"fa-solid fa-bars"})}),e.jsx("i",{className:"fa-solid fa-receipt mr-2"}),e.jsx("span",{className:"hidden sm:inline",children:"Material Checking"}),e.jsx("span",{className:"sm:hidden",children:"Material Check"})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-2 w-full sm:w-auto",children:[e.jsxs(v,{isLoading:N,onClick:G,className:"bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto whitespace-nowrap",children:[e.jsx("i",{className:"fa-solid fa-circle-check mr-2"}),"Mark as Complete"]}),e.jsx(B,{projectId:s,stageNumber:9,stagePath:"materialarrivalcheck"}),!r&&e.jsx(K,{projectId:s,stageNumber:"9",className:"w-full sm:w-fit",isStageCompleted:a==null?void 0:a.status}),e.jsx(Q,{stageName:"MaterialArrivalModel",projectId:s,organizationId:l,currentAssignedStaff:(a==null?void 0:a.assignedTo)||null})]})]}),m&&e.jsx("div",{className:"flex-1 flex items-center justify-center",children:e.jsxs("div",{className:"max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center",children:[e.jsx("div",{className:"text-red-600 font-semibold mb-2",children:"⚠️ Error Occurred"}),e.jsx("p",{className:"text-red-500 text-sm mb-4",children:((L=(I=r==null?void 0:r.response)==null?void 0:I.data)==null?void 0:L.message)||"Failed to load material arrival data"}),e.jsx(v,{onClick:()=>o(),className:"bg-red-600 text-white hover:bg-red-700",children:"Retry"})]})}),!m&&e.jsxs("div",{className:"flex-1 min-h-0 overflow-y-auto space-y-4 sm:space-y-6",children:[e.jsxs(z,{className:"p-4 w-full shadow border-l-4 border-blue-600 bg-white",children:[e.jsxs("div",{className:"flex items-center gap-3 text-blue-700 text-sm font-medium mb-2",children:[e.jsx("i",{className:"fa-solid fa-clock text-blue-500 text-lg"}),e.jsx("span",{children:"Stage Timings"})]}),e.jsx(U,{stageName:"materialarrivalcheck",completedAt:t==null?void 0:t.completedAt,projectId:s,formId:a==null?void 0:a._id,deadLine:t==null?void 0:t.deadLine,startedAt:t==null?void 0:t.startedAt,refetchStageMutate:o,deadLineMutate:x,isPending:p})]}),e.jsxs("section",{className:"w-full  rounded-xl shadow-lg border border-gray-200 overflow-hidden",children:[e.jsxs("div",{className:" bg-gradient-to-r from-slate-800 to-gray-900 p-6 text-white",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-12 h-12  bg-opacity-20 rounded-lg flex items-center justify-center",children:e.jsx("i",{className:"fa-solid fa-boxes-stacked text-2xl text-white"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-bold",children:"Material Verification Center"}),e.jsx("p",{className:"text-gray-300 text-sm mt-1",children:"Review and verify material arrivals"})]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("div",{className:"text-2xl font-bold",children:j}),e.jsx("div",{className:"text-gray-300 text-sm",children:"Total Items"})]})]}),j>0&&e.jsxs("div",{className:"mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4",children:[e.jsx("div",{className:"bg-slate-600 bg-opacity-10 rounded-lg p-4 backdrop-blur-sm",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-emerald-500 bg-opacity-30 rounded-full flex items-center justify-center",children:e.jsx("i",{className:"fa-solid fa-check text-emerald-300 text-lg"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-2xl font-bold text-white",children:k}),e.jsx("div",{className:"text-gray-300 text-sm",children:"Verified"})]})]})}),e.jsx("div",{className:"bg-slate-600 bg-opacity-10 rounded-lg p-4 backdrop-blur-sm",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-amber-500 bg-opacity-30 rounded-full flex items-center justify-center",children:e.jsx("i",{className:"fa-solid fa-clock text-amber-300 text-lg"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-2xl font-bold text-white",children:O}),e.jsx("div",{className:"text-gray-300 text-sm",children:"Pending"})]})]})}),e.jsx("div",{className:"bg-slate-600 bg-opacity-10 rounded-lg p-4 backdrop-blur-sm",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-indigo-500 bg-opacity-30 rounded-full flex items-center justify-center",children:e.jsx("i",{className:"fa-solid fa-chart-line text-indigo-300 text-lg"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"text-2xl font-bold text-white",children:[C,"%"]}),e.jsx("div",{className:"text-gray-300 text-sm",children:"Progress"})]})]})})]}),j>0&&e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"flex items-center justify-between text-sm text-gray-300 mb-2",children:[e.jsx("span",{children:"Verification Progress"}),e.jsxs("span",{children:[C,"% Complete"]})]}),e.jsx("div",{className:"w-full bg-white bg-opacity-20 rounded-full h-2",children:e.jsx("div",{className:"bg-emerald-400 h-2 rounded-full transition-all duration-500 ease-out",style:{width:`${C}%`}})})]})]}),e.jsx("div",{className:"bg-gray-50 border-b border-gray-200",children:e.jsx("div",{className:"overflow-x-auto",children:e.jsx("div",{className:"min-w-[800px]",children:e.jsxs("div",{className:"grid grid-cols-5 gap-4 px-6 py-4 font-semibold text-gray-700 text-sm",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("i",{className:"fa-solid fa-hashtag text-blue-500"}),e.jsx("span",{children:"Custom ID"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("i",{className:"fa-solid fa-calculator text-blue-500"}),e.jsx("span",{children:"Quantity"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("i",{className:"fa-solid fa-image text-blue-500"}),e.jsx("span",{children:"Image"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("i",{className:"fa-solid fa-shield-check text-blue-500"}),e.jsx("span",{children:"Status"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("i",{className:"fa-solid fa-cog text-blue-500"}),e.jsx("span",{children:"Action"})]})]})})})}),e.jsx("div",{className:"overflow-x-auto",children:e.jsx("div",{className:"min-w-[800px]",children:((P=a==null?void 0:a.materialArrivalList)==null?void 0:P.length)>0?e.jsx("div",{className:"divide-y divide-gray-100",children:a.materialArrivalList.map((h,y)=>e.jsx(te,{item:h,projectId:s,index:y},h._id))}):e.jsx("div",{className:"p-12 text-center bg-gray-50",children:e.jsxs("div",{className:"max-w-md mx-auto",children:[e.jsx("div",{className:"w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner",children:e.jsx("i",{className:"fa-solid fa-box-open text-3xl text-gray-400"})}),e.jsx("h3",{className:"text-xl font-semibold text-gray-600 mb-3",children:"No Materials Found"}),e.jsx("p",{className:"text-gray-500 mb-4",children:"Material data will appear here once available. Check back later or contact your administrator."}),e.jsxs("div",{className:"flex items-center justify-center gap-2 text-sm text-gray-400",children:[e.jsx("i",{className:"fa-solid fa-info-circle"}),e.jsx("span",{children:"Materials are automatically synced from your project"})]})]})})})})]}),e.jsx("section",{className:"mt-4",children:e.jsx(X,{projectId:s,context:"Material",stage:"materialarrival",data:T,isPending:u,generateLink:g})})]})]})};export{ue as default};
