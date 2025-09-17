    // // components/SearchSelect.tsx
    // import React, { useState, useRef, useEffect } from 'react';


    // // types/index.ts
    // export interface SelectOption {
    // value: string;
    // label: string;
    // }

    // export interface SearchSelectProps {
    // options: SelectOption[];
    // placeholder?: string;
    // searchPlaceholder?: string;
    // onSelect: (option: SelectOption | null) => void;
    // selectedValue?: string;
    // className?: string;
    // }


    // const SearchSelect: React.FC<SearchSelectProps> = ({
    // options,
    // placeholder = "Select an option",
    // searchPlaceholder = "Search...",
    // onSelect,
    // selectedValue,
    // className = ""
    // }) => {
    // const [isOpen, setIsOpen] = useState(false);
    // const [searchTerm, setSearchTerm] = useState("");
    // const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
    // const dropdownRef = useRef<HTMLDivElement>(null);

    // // Filter options based on search term
    // const filteredOptions = options.filter(option =>
    //     option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     option.value.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // // Handle click outside to close dropdown
    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    //         setIsOpen(false);
    //     }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => document.removeEventListener('mousedown', handleClickOutside);
    // }, []);

    // // Set selected option when selectedValue changes
    // useEffect(() => {
    //     if (selectedValue) {
    //     const option = options.find(opt => opt.value === selectedValue);
    //     setSelectedOption(option || null);
    //     } else {
    //     setSelectedOption(null);
    //     }
    // }, [selectedValue, options]);

    // const handleSelect = (option: SelectOption) => {
    //     setSelectedOption(option);
    //     onSelect(option);
    //     setIsOpen(false);
    //     setSearchTerm("");
    // };

    // const handleInputClick = () => {
    //     setIsOpen(true);
    //     setSearchTerm("");
    // };

    // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearchTerm(e.target.value);
    // };

    // return (
    //     <div className={`relative ${className}`} ref={dropdownRef}>
    //     {/* Selected value display */}
    //     <div
    //         className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 transition-colors"
    //         onClick={handleInputClick}
    //     >
    //         {selectedOption ? (
    //         <span className="text-gray-800">{selectedOption.label}</span>
    //         ) : (
    //         <span className="text-gray-500">{placeholder}</span>
    //         )}
    //         <span className="absolute right-3 top-3 text-gray-400">▼</span>
    //     </div>

    //     {/* Dropdown */}
    //     {isOpen && (
    //         <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
    //         {/* Search input */}
    //         <div className="p-2 border-b border-gray-200">
    //             <input
    //             type="text"
    //             placeholder={searchPlaceholder}
    //             value={searchTerm}
    //             onChange={handleSearchChange}
    //             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //             autoFocus
    //             />
    //         </div>

    //         {/* Options list */}
    //         <div className="py-1">
    //             {filteredOptions.length > 0 ? (
    //             filteredOptions.map((option) => (
    //                 <div
    //                 key={option.value}
    //                 className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${
    //                     selectedOption?.value === option.value ? 'bg-blue-50 text-blue-600' : ''
    //                 }`}
    //                 onClick={() => handleSelect(option)}
    //                 >
    //                 {option.label}
    //                 </div>
    //             ))
    //             ) : (
    //             <div className="px-4 py-2 text-gray-500 text-center">
    //                 No options found
    //             </div>
    //             )}
    //         </div>
    //         </div>
    //     )}
    //     </div>
    // );
    // };

    // export default SearchSelect;




    // components/SearchSelect.tsx
import React, { useState, useRef, useEffect } from 'react';


// types/index.ts
export interface SearchSelectProps {
  options: string[]; // Changed from SelectOption[] to string[]
  placeholder?: string;
  searchPlaceholder?: string;
  onSelect: (option: string | null) => void; // Changed to accept string | null
  selectedValue?: string;
  className?: string;
}
const SearchSelect: React.FC<SearchSelectProps> = ({
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  onSelect,
  selectedValue,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set selected option when selectedValue changes
  useEffect(() => {
    if (selectedValue) {
      const option = options.find(opt => opt === selectedValue);
      setSelectedOption(option || null);
    } else {
      setSelectedOption(null);
    }
  }, [selectedValue, options]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected value display */}
      <div
        className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 transition-colors"
        onClick={handleInputClick}
      >
        {selectedOption ? (
          <span className="text-gray-800">{selectedOption}</span>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <span className="absolute right-3 top-3 text-gray-400">▼</span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Options list */}
          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                    selectedOption === option ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSelect;