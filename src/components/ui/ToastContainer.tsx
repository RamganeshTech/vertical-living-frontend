// "use client"

// import type React from "react"
// import { useToast } from "../hooks/use-toast"

// export const ToastContainer: React.FC = () => {
//   const { toasts, removeToast } = useToast()

//   if (toasts.length === 0) return null

//   return (
//     <div className="fixed top-4 right-4 z-50 space-y-2">
//       {toasts.map((toast) => (
//         <div
//           key={toast.id}
//           className={`p-4 rounded-lg shadow-lg max-w-sm ${
//             toast.variant === "destructive"
//               ? "bg-red-50 border border-red-200 text-red-800"
//               : "bg-green-50 border border-green-200 text-green-800"
//           }`}
//         >
//           <div className="flex justify-between items-start">
//             <div>
//               <h4 className="font-semibold">{toast.title}</h4>
//               <p className="text-sm mt-1">{toast.description}</p>
//             </div>
//             <button onClick={() => removeToast(toast.id)} className="ml-4 text-gray-400 hover:text-gray-600">
//               <i className="fas fa-times"></i>
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }
