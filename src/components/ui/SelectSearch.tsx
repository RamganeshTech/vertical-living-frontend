// // src/components/SelectSearch.tsx
// import React, { useState, useRef, useEffect } from 'react';

// type Option = {
//   label: string;
//   value: string;
// };

// type SelectSearchProps = {
//   options: Option[];
//   placeholder?: string;
//   onSelect?: (option: Option) => void;
// };

// const SelectSearch: React.FC<SelectSearchProps> = ({ options, placeholder = 'Select an option', onSelect }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedOption, setSelectedOption] = useState<Option | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Filter options based on the search term
//   const filteredOptions = options.filter((option) =>
//     option.label.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Handle clicks outside component
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleSelect = (option: Option) => {
//     setSelectedOption(option);
//     setIsOpen(false);
//     setSearchTerm('');
//     if (onSelect) onSelect(option);
//   };

//   return (
//     <div className="relative w-64" ref={containerRef}>
//       <div
//         className="bg-white border border-gray-300 rounded-md px-4 py-2 cursor-pointer hover:border-blue-500 transition-colors"
//         onClick={() => setIsOpen((prev) => !prev)}
//       >
//         {selectedOption ? selectedOption.label : placeholder}
//       </div>

//       {isOpen && (
//         <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
//           <input
//             type="text"
//             className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-0"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             autoFocus
//           />
//           <ul className="max-h-60 overflow-y-auto">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((option) => (
//                 <li
//                   key={option.value}
//                   className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition-colors"
//                   onClick={() => handleSelect(option)}
//                 >
//                   {option.label}
//                 </li>
//               ))
//             ) : (
//               <li className="px-4 py-2 text-gray-400">No options found.</li>
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SelectSearch;