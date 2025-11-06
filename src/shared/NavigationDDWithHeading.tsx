// import React, { useEffect, useRef } from "react";

// export interface NavigationItem {
//   label: string;
//   icon: string;
//   path: string;
//   onClick: () => void;
// }

// export interface NavigationSection {
//   title: string;
//   items: NavigationItem[];
// }

// interface NavigationDDWithHeadingProps {
//   isOpen: boolean;
//   onClose: () => void;
//   sections: NavigationSection[];
//   heading: string;
//   subHeading?: string;
//   noOfRows?: number;
// }

// // ✅ Helper function to chunk items (6 per column)
// const chunkItems = <T,>(items: T[], chunkSize: number): T[][] => {
//   const chunks: T[][] = [];
//   for (let i = 0; i < items.length; i += chunkSize) {
//     chunks.push(items.slice(i, i + chunkSize));
//   }
//   return chunks;
// };

// const NavigationDDWithHeading: React.FC<NavigationDDWithHeadingProps> = ({
//   isOpen,
//   onClose,
//   sections,
//   heading,
//   subHeading,
//   noOfRows = 6,
// }) => {
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     document.addEventListener("keydown", onClose);
//     return () => document.removeEventListener("keydown", onClose);
//   }, [onClose]);

//   return (
//     <>
//       {/* Background Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/10 bg-opacity-30 z-40"
//           onClick={onClose}
//         />
//       )}

//       {/* Dropdown Panel */}
//       <div
//         ref={dropdownRef}
//         className={`fixed left-1/2 top-[90px] -translate-x-1/2 z-50 max-w-6xl bg-white rounded-lg shadow-xl transition-all duration-300 transform ${
//           isOpen
//             ? "translate-y-0 opacity-100 visible"
//             : "-translate-y-5 opacity-0 invisible"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between border-b px-6 py-4">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800">{heading}</h2>
//             {subHeading && (
//               <p className="text-sm text-gray-500">{subHeading}</p>
//             )}
//           </div>

//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 cursor-pointer"
//             title="Close"
//           >
//             <i className="fas fa-xmark text-xl"></i>
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 max-h-[400px] overflow-y-auto">
//           {sections.map((section, idx) => {
//             const chunks = chunkItems(section.items, noOfRows);
//             return (
//               <div key={idx} className="mb-6">
//                 {/* Section Title */}
//                 <h3 className="text-sm font-semibold text-gray-500 mb-3">
//                   {section.title}
//                 </h3>

//                 {/* Auto-sizing columns (6 items per column) */}
//                 <div className="flex gap-8">
//                   {chunks.map((chunk, colIdx) => (
//                     <div key={colIdx} className="flex flex-col space-y-2">
//                       {chunk.map((item, index) => (
//                         <button
//                           key={index}
//                           onClick={item.onClick}
//                           className="flex items-center px-2 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition w-44 text-left"
//                         >
//                           <i
//                             className={`${item.icon} mr-2 text-[14px] w-4`}
//                           ></i>
//                           <span>{item.label}</span>
//                         </button>
//                       ))}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// };

// export default NavigationDDWithHeading;



import React, { useEffect, useRef } from "react";

export interface NavigationItem {
    label: string;
    icon: string;
    path: string;
    onClick: () => void;
}

export interface NavigationSection {
    title: string;
    items: NavigationItem[];
}

interface NavigationDDWithHeadingProps {
    isOpen: boolean;
    onClose: () => void;
    sections: NavigationSection[];
    heading: string;
    subHeading?: string;
}

const NavigationDDWithHeading: React.FC<NavigationDDWithHeadingProps> = ({
    isOpen,
    onClose,
    sections,
    heading,
    subHeading,
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClose = (e:KeyboardEvent)=>{
            if(e.key === "Escape"){
                onClose()
            }
        }
        document.addEventListener("keydown", handleClose);
        return () => document.removeEventListener("keydown", handleClose);
    }, [onClose]);

    return (
        <>
            {/* Background Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/10 bg-opacity-30 z-40"
                    onClick={onClose}
                />
            )}

            {/* Dropdown Panel */}
            <div
                ref={dropdownRef}
                className={`fixed left-1/2 top-[90px] -translate-x-1/2 z-50 max-w-6xl bg-white rounded-lg shadow-xl transition-all duration-300 transform ${isOpen
                        ? "translate-y-0 opacity-100 visible"
                        : "-translate-y-5 opacity-0 invisible"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-b-[#9a9c9e] px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{heading}</h2>
                        {subHeading && (
                            <p className="text-sm text-gray-500">{subHeading}</p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        title="Close"
                    >
                        <i className="fas fa-xmark text-xl"></i>
                    </button>
                </div>

                {/* Content */}
                <div
                    className="p-6 max-h-[400px] max-w-full overflow-x-auto overflow-y-auto"
                    style={{ whiteSpace: "nowrap" }}
                >
                    {sections.map((section, idx) => (
                        <div
                            key={idx}
                            className="inline-block align-top mr-6 vertical-section"
                            style={{ verticalAlign: "top", whiteSpace: "normal" }}
                        >
                            {/* Section Title */}
                            <h3 className="text-sm font-semibold text-gray-500 mb-3">
                                {section.title}
                            </h3>

                            {/* Items */}
                            <div className="flex flex-col gap-2">
                                {section.items.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={item.onClick}
                                        className="flex cursor-pointer items-center px-2 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition w-44 text-left"
                                    >
                                        <i className={`${item.icon} mr-2 text-[14px] w-4`}></i>
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default NavigationDDWithHeading;


[
    {
        title: "Sales Transaitons",
        items: [
            { label: "Invocie", icon: "fas fa-wallet", path: "/expenses", onClick: () => { } },
            { label: "RetailInvoce", icon: "fas fa-file-invoice", path: "/bills", onClick: () => { } },
            // ...
        ],
    }
]