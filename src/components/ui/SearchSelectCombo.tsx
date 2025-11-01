// import React, { useState, useRef, useEffect } from "react";

// interface SearchSelectComboOption {
//     _id: string | number;
//     value: string;
// }

// type SearchSelectComboValue = string | SearchSelectComboOption | null;

// interface SearchSelectComboProps {
//     label: string;
//     options: SearchSelectComboOption[] | string[]; // Can accept both types
//     value: SearchSelectComboValue;
//     onChange: (value: SearchSelectComboValue) => void;
//     placeholder?: string;
//     name: string;
//     mode?: "simple" | "object"; // simple = string only, object = {_id, value}
//     onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // ✅ Added
//     onBlur?: () => void; // ✅ Added
//     autoFocus?: boolean; // ✅ Added
// }

// const SearchSelectCombo: React.FC<SearchSelectComboProps> = ({
//     label,
//     options,
//     value,
//     onChange,
//     placeholder = "Type or select...",
//     name,
//     mode = "simple",
//     onKeyDown, // ✅ Added
//     onBlur, // ✅ Added
//     autoFocus = false, // ✅ Added
// }) => { const [isOpen, setIsOpen] = useState(false);
//     const [inputValue, setInputValue] = useState("");
//     const [filteredOptions, setFilteredOptions] = useState<(SearchSelectComboOption | string)[]>(options);
//     const dropdownRef = useRef<HTMLDivElement>(null);
//     const inputRef = useRef<HTMLInputElement>(null); // ✅ Added ref

//     // ✅ Auto-focus effect
//     useEffect(() => {
//         if (autoFocus && inputRef.current) {
//             inputRef.current.focus();
//         }
//     }, [autoFocus]);

//     // Set input value based on mode
//     useEffect(() => {
//         if (mode === "object" && value && typeof value === "object") {
//             setInputValue(value.value);
//         } else if (mode === "simple" && typeof value === "string") {
//             setInputValue(value);
//         } else if (!value) {
//             setInputValue("");
//         }
//     }, [value, mode]);

//     // Filter options based on input
//     useEffect(() => {
//         if (inputValue) {
//             const filtered = options.filter((option) => {
//                 const optionValue = typeof option === "string" ? option : option.value;
//                 return optionValue.toLowerCase().includes(inputValue.toLowerCase());
//             });
//             setFilteredOptions(filtered);
//         } else {
//             setFilteredOptions(options);
//         }
//     }, [inputValue, options]);

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (
//                 dropdownRef.current &&
//                 !dropdownRef.current.contains(event.target as Node)
//             ) {
//                 setIsOpen(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newValue = e.target.value;
//         setInputValue(newValue);
//         setIsOpen(true);

//         if (mode === "simple") {
//             onChange(newValue);
//         } else {
//             onChange({ _id: "", value: newValue });
//         }
//     };

//     const handleSelect = (option: SearchSelectComboOption | string) => {
//         if (typeof option === "string") {
//             setInputValue(option);
//             onChange(option);
//         } else {
//             setInputValue(option.value);
//             onChange(option);
//         }
//         setIsOpen(false);
//     };

//     const handleInputFocus = () => {
//         setIsOpen(true);
//     };

//     // ✅ Handle blur with delay to allow dropdown clicks
//     const handleInputBlur = () => {
//         setTimeout(() => {
//             onBlur?.();
//         }, 200);
//     };

//     // ✅ Handle keydown
//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Escape') {
//             setIsOpen(false);
//         }
//         onKeyDown?.(e);
//     };

//     const getDisplayValue = (option: SearchSelectComboOption | string): string => {
//         return typeof option === "string" ? option : option.value;
//     };

//     return (
//         <div className="relative" ref={dropdownRef}>
//             {label && ( // ✅ Only render if label exists
//                 <label
//                     htmlFor={name}
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                     {label}
//                 </label>
//             )}
//             <div className="relative">
//                 <input
//                     ref={inputRef} // ✅ Added ref
//                     id={name}
//                     type="text"
//                     value={inputValue}
//                     onChange={handleInputChange}
//                     onFocus={handleInputFocus}
//                     onBlur={handleInputBlur} // ✅ Added blur handler
//                     onKeyDown={handleKeyDown} // ✅ Added keydown handler
//                     placeholder={placeholder}
//                     className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                     autoComplete="off"
//                 />
//                 <button
//                     type="button"
//                     onClick={() => setIsOpen(!isOpen)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     tabIndex={-1} // ✅ Prevent focus on button
//                 >
//                     <i
//                         className={`fas fa-chevron-down transition-transform duration-200 ${
//                             isOpen ? "rotate-180" : ""
//                         }`}
//                     />
//                 </button>
//             </div>

//             {/* Dropdown */}
//             {isOpen && (
//                 <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
//                     {filteredOptions.length > 0 ? (
//                         <ul className="py-1">
//                             {filteredOptions.map((option, index) => {
//                                 const displayValue = getDisplayValue(option);
//                                 const optionId = typeof option === "object" ? option._id : index;
                                
//                                 return (
//                                     <li
//                                         key={optionId}
//                                         onClick={() => handleSelect(option)}
//                                         className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors text-gray-700 hover:text-blue-600"
//                                     >
//                                         {displayValue}
//                                     </li>
//                                 );
//                             })}
//                         </ul>
//                     ) : (
//                         <div className="px-4 py-3 text-sm text-gray-500">
//                             <p className="flex items-center gap-2">
//                                 <i className="fas fa-info-circle" />
//                                 No matches found. Current value: "{inputValue}"
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };
// export default SearchSelectCombo;



import React, { useState, useRef, useEffect } from "react";

interface SearchSelectComboOption {
    _id: string | number;
    value: string;
}

type SearchSelectComboValue = string | SearchSelectComboOption | null;

interface SearchSelectComboProps {
    label?: string;
    options: SearchSelectComboOption[] | string[];
    value: SearchSelectComboValue;
    onChange: (value: SearchSelectComboValue) => void;
    onSelectOption?: (value: string) => void; // ✅ New: triggered only on selection
    placeholder?: string;
    name: string;
    mode?: "simple" | "object";
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    autoFocus?: boolean;
}

const SearchSelectCombo: React.FC<SearchSelectComboProps> = ({
    label = "",
    options,
    value,
    onChange,
    onSelectOption, // ✅ New prop
    placeholder = "Type or select...",
    name,
    mode = "simple",
    onKeyDown,
    onBlur,
    autoFocus = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<(SearchSelectComboOption | string)[]>(options);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    useEffect(() => {
        if (mode === "object" && value && typeof value === "object") {
            setInputValue(value.value);
        } else if (mode === "simple" && typeof value === "string") {
            setInputValue(value);
        } else if (!value) {
            setInputValue("");
        }
    }, [value, mode]);

    useEffect(() => {
        if (inputValue) {
            const filtered = options.filter((option) => {
                const optionValue = typeof option === "string" ? option : option.value;
                return optionValue.toLowerCase().includes(inputValue.toLowerCase());
            });
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    }, [inputValue, options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setIsOpen(true);

        // ✅ Only call onChange (for typing), not onSelectOption
        if (mode === "simple") {
            onChange(newValue);
        } else {
            onChange({ _id: "", value: newValue });
        }
    };

    const handleSelect = (option: SearchSelectComboOption | string) => {
        const selectedValue = typeof option === "string" ? option : option.value;
        
        setInputValue(selectedValue);
        setIsOpen(false);

        // ✅ Call both onChange and onSelectOption
        if (typeof option === "string") {
            onChange(option);
            onSelectOption?.(option); // ✅ Trigger save
        } else {
            onChange(option);
            onSelectOption?.(option.value); // ✅ Trigger save
        }
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            onBlur?.();
        }, 200);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
        onKeyDown?.(e);
    };

    const getDisplayValue = (option: SearchSelectComboOption | string): string => {
        return typeof option === "string" ? option : option.value;
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={inputRef}
                    id={name}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    autoComplete="off"
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                >
                    <i
                        className={`fas fa-chevron-down transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>
            </div>

            {/* ✅ Fixed dropdown with proper z-index and positioning */}
            {isOpen && (
                <div className="fixed z-[9999] mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                    style={{
                        width: inputRef.current?.offsetWidth || 'auto',
                        top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom + window.scrollY : 0,
                        left: inputRef.current ? inputRef.current.getBoundingClientRect().left + window.scrollX : 0,
                    }}
                >
                    {filteredOptions.length > 0 ? (
                        <ul className="py-1">
                            {filteredOptions.map((option, index) => {
                                const displayValue = getDisplayValue(option);
                                const optionId = typeof option === "object" ? option._id : index;
                                
                                return (
                                    <li
                                        key={optionId}
                                        onMouseDown={() => handleSelect(option)} // ✅ Use onMouseDown to trigger before onBlur
                                        className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors text-gray-700 hover:text-blue-600"
                                    >
                                        {displayValue}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                            <p className="flex items-center gap-2">
                                <i className="fas fa-info-circle" />
                                No matches found. Current value: "{inputValue}"
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchSelectCombo;