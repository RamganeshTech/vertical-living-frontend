// // components/NavigationDropdown.tsx
// import React, { useEffect, useRef } from "react";

// export interface NavigationItem {
//     label: string;
//     icon: string;
//     path: string;
//     onClick: () => void;
// }

// export interface NavigationSection {
//     title: string;
//     items: NavigationItem[];
// }

// interface NavigationDropdownProps {
//     isOpen: boolean;
//     onClose: () => void;
//     sections: NavigationSection[];
// }

// const NavigationDropdown: React.FC<NavigationDropdownProps> = ({
//     isOpen,
//     onClose,
//     sections,
// }) => {
//     const dropdownRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (
//                 dropdownRef.current &&
//                 !dropdownRef.current.contains(event.target as Node)
//             ) {
//                 onClose();
//             }
//         };

//         if (isOpen) {
//             document.addEventListener("mousedown", handleClickOutside);
//         }

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [isOpen, onClose]);

//     if (!isOpen) return null;

//     // Helper function to split items into chunks of 6
//     const chunkItems = (items: NavigationItem[], chunkSize = 6) => {
//         const chunks: NavigationItem[][] = [];
//         for (let i = 0; i < items.length; i += chunkSize) {
//             chunks.push(items.slice(i, i + chunkSize));
//         }
//         return chunks;
//     };

//     return (
//         <>
//             {/* Background Overlay */}
//             <div className="fixed inset-0 bg-black/10 bg-opacity-30 z-40" />


//             {/* Dropdown Panel */}
//             <div
//                 ref={dropdownRef}
//                 className={`fixed left-1/2 top-[90px] -translate-x-1/2 z-50 max-w-6xl bg-white rounded-lg shadow-xl transition-all duration-300 transform ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
//                     }`}
//             >

//                 <div className="relative p-2 max-h-[400px] overflow-y-auto">
//                     <button
//                         onClick={onClose}
//                         className="absolute cursor-pointer top-3 right-4 text-gray-500 hover:text-gray-700"
//                         title="Close"
//                     >
//                         <i className="fas fa-xmark text-xl"></i>
//                     </button>

//                     <div className="p-6 max-h-[400px] overflow-y-auto">
//                         {sections.map((section, idx) => {
//                             const chunks = chunkItems(section.items, 6);
//                             return (
//                                 <div key={idx} className="mb-0">
//                                     <h3 className="text-sm font-semibold text-gray-500 mb-3">
//                                         {section.title}
//                                     </h3>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
//                                         {chunks.map((chunk, colIdx) => (
//                                             <div key={colIdx} className="space-y-2">
//                                                 {chunk.map((item, index) => (
//                                                     <button
//                                                         key={index}
//                                                         onClick={item.onClick}
//                                                         className="flex cursor-pointer items-center px-1 py-1.5 rounded-md w-full text-sm text-gray-700 hover:bg-gray-100 transition"
//                                                     >
//                                                         <i className={`${item.icon} mr-2 text-[14px] w-4`}></i>
//                                                         <span className="">{item.label}</span>
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>


//         </>
//     );
// };

// export default NavigationDropdown;




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

interface NavigationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    sections: NavigationSection[];
    noOfRows?: number
}


// ✅ Helper function to chunk items (6 per column)
const chunkItems = <T,>(items: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
        chunks.push(items.slice(i, i + chunkSize));
    }
    return chunks;
};

const NavigationDropdown: React.FC<NavigationDropdownProps> = ({
    isOpen,
    onClose,
    sections,
    noOfRows = 6
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClose = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }
        document.addEventListener("keydown", handleClose)
        return () => document.removeEventListener("keydown", handleClose)

    }, [onClose])

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
                <div className="relative p-2 max-h-[400px] overflow-y-auto">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute cursor-pointer top-3 right-4 text-gray-500 hover:text-gray-700"
                        title="Close"
                    >
                        <i className="fas fa-xmark text-xl"></i>
                    </button>

                    {/* <h3 className="text-sm font-semibold text-gray-500 mb-3">
                    {sections[0].title}
                  </h3> */}


                    <div className="p-6 max-h-[400px] overflow-y-auto">
                        {sections.map((section, idx) => {
                            const chunks = chunkItems(section.items, noOfRows);
                            return (
                                <div key={idx} className="mb-2">
                                    {/* Section Title */}
                                    <h3 className="text-sm font-semibold text-gray-500 mb-3">
                                        {section.title}
                                    </h3>

                                    {/* Auto-sizing columns (6 items per column) */}
                                    <div className="flex gap-8">
                                        {chunks.map((chunk, colIdx) => (
                                            <div key={colIdx} className="flex flex-col space-y-2">
                                                {chunk.map((item, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={item.onClick}
                                                        className="flex cursor-pointer items-center px-2 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition w-44 text-left"
                                                    >
                                                        <i
                                                            className={`${item.icon} mr-2 text-[14px] w-4`}
                                                        ></i>
                                                        <span>{item.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavigationDropdown;
