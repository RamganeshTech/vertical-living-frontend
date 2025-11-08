// components/SearchSelect.tsx
import React, { useState, useRef, useEffect } from 'react';
// types/select.ts
export interface SelectOption {
  value: string;
  label: string;
  email?: string;
  [key: string]: any; // Allow additional properties
}

export interface SearchSelectProps {
  options: SelectOption[] | string[]; // Accept both object and string arrays
  placeholder?: string;
  searchPlaceholder?: string;
  onValueChange: (value: string | null) => void;
  value?: string;
  className?: string;
  searchBy?: 'name' | 'email' | 'both' ; // Control what to search by
  displayFormat?: 'simple' | 'detailed'; // Control display format
  enabled?:boolean,
}
// Helper function to normalize options
const normalizeOptions = (options: SelectOption[] | string[]): SelectOption[] => {
  if (options.length === 0) return [];
  
  // If options are strings, convert to SelectOption format
  if (typeof options[0] === 'string') {
    return (options as string[]).map(option => ({
      value: option,
      label: option
    }));
  }
  
  return options as SelectOption[];
};

// Helper function to get searchable text
const getSearchableText = (option: SelectOption, searchBy: 'name' | 'email' | 'both'): string => {
  switch (searchBy) {
    case 'email':
      return option.email || option.label;
    case 'both':
      return `${option.label} ${option.email || ''}`.toLowerCase();
    case 'name':
    default:
      return option.label;
  }
};

const SearchSelectNew: React.FC<SearchSelectProps> = ({
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  onValueChange,
  value,
  className = "",
  searchBy = 'name', // Default to search by name only
  displayFormat = 'detailed', // Default to detailed display
  enabled = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to always work with SelectOption[]
  const normalizedOptions = normalizeOptions(options);

  // Filter options based on search term and searchBy preference
  const filteredOptions = normalizedOptions.filter(option =>
    getSearchableText(option, searchBy)?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set selected option when value changes
  useEffect(() => {
    if (value) {
      const option = normalizedOptions.find(opt => opt.value === value);
      setSelectedOption(option || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, normalizedOptions]);

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    onValueChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputClick = () => {
    if(enabled){
      setIsOpen(true);
      setSearchTerm("");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSelection = () => {
    setSelectedOption(null);
    onValueChange(null);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected value display */}
      <div
        className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 transition-colors flex justify-between items-center"
        onClick={handleInputClick}
      >
        <div className="flex-1 min-w-0">
          {selectedOption ? (
            <div className="flex flex-col truncate">
              <span className="text-gray-800 font-medium truncate">
                {selectedOption.label}
              </span>
              {displayFormat === 'detailed' && selectedOption.email && (
                <span className="text-gray-500 text-sm truncate">
                  {selectedOption.email}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-500 truncate">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
          {selectedOption && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="text-gray-400 hover:text-gray-600 text-lg font-bold w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200"
              title="Clear selection"
            >
              ×
            </button>
          )}
          <span className="text-gray-400 text-xs">▼</span>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
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
                  key={option.value}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedOption?.value === option.value ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                  {displayFormat === 'detailed' && option.email && (
                    <div className="text-sm text-gray-500 mt-1">{option.email}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSelectNew;