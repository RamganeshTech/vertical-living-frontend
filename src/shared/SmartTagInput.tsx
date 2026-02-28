// import React, { memo, useEffect, useState } from "react";

// type SmartTagInputProps = {
//   tags: string[];
//   setState: React.Dispatch<React.SetStateAction<string[]>>;

//   /** Optional: static suggestions for local filtering */
//   suggestions?: string[];

//   /** Optional: async fetcher for suggestions via API */
//   suggestionFetcher?: (searchTerm: string) => Promise<string[]>;

//   /** Disable suggestion list completely */
//   disableSuggestion?: boolean;
// };

// const SmartTagInput: React.FC<SmartTagInputProps> = ({
//   tags,
//   setState,
//   suggestions = [],
//   suggestionFetcher,
//   disableSuggestion = false,
// }) => {
//   const [input, setInput] = useState("");
//   const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   // ⏱️ Track latest debounce input separately
//   const [debouncedInput, setDebouncedInput] = useState<string>("");

//   // 👉 Debounce logic: After 500ms of no typing, update debouncedInput
//   useEffect(() => {
//     if (disableSuggestion) return;

//     const handler = setTimeout(() => {
//       setDebouncedInput(input.trim());
//     }, 500);

//     return () => {
//       clearTimeout(handler); // Cleanup previous timer
//     };
//   }, [input, disableSuggestion]);

//   // 🔁 Trigger suggestion fetch after debounce input has settled
//   useEffect(() => {
//     if (disableSuggestion || !debouncedInput) {
//       setFilteredSuggestions([]);
//       return;
//     }

//     if (suggestionFetcher) {
//       setLoading(true);
//       suggestionFetcher(debouncedInput)
//         .then((res) => {
//           const filtered = res.filter((tag) => !tags.includes(tag));
//           setFilteredSuggestions(filtered);
//         })
//         .catch(console.error)
//         .finally(() => setLoading(false));
//     } else {
//       const localFiltered = suggestions
//         .filter(
//           (tag) =>
//             tag.toLowerCase().includes(debouncedInput.toLowerCase()) &&
//             !tags.includes(tag)
//         )
//         .slice(0, 10);
//       setFilteredSuggestions(localFiltered);
//     }
//   }, [debouncedInput, suggestionFetcher, suggestions, tags, disableSuggestion]);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if ((e.key === "Enter" || e.key === ",") && input.trim()) {
//       e.preventDefault();
//       if (!tags.includes(input.trim())) {
//         setState([...tags, input.trim()]);
//       }
//       setInput("");
//     } else if (e.key === "Backspace" && !input) {
//       setState(tags.slice(0, -1));
//     }
//   };

//   const handleSuggestionClick = (suggestedTag: string) => {
//     if (!tags.includes(suggestedTag)) {
//       setState([...tags, suggestedTag]);
//     }
//     setInput(""); // clear input
//     setFilteredSuggestions([]); // clear suggestions
//   };

//   const removeTag = (indexToRemove: number) => {
//     setState(tags.filter((_, index) => index !== indexToRemove));
//   };

//   return (
//     <div className="relative w-full">
//       {/* Input & selected tags */}
//       <div className="flex flex-wrap items-center border-b-1 border-[#565656] p-2 gap-2 rounded">
//         {tags.map((tag, index) => (
//           <div
//             key={index}
//             className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1"
//           >
//             {tag}
//             <span
//               className="cursor-pointer ml-1 text-xs"
//               onClick={() => removeTag(index)}
//             >
//               ×
//             </span>
//           </div>
//         ))}
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           className="input flex-1 outline-none text-sm border-none"
//           placeholder="Type and press Enter"
//         />
//       </div>

//       {/* Suggestions List */}
//       {!disableSuggestion && filteredSuggestions.length > 0 && (
//         <div className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded shadow max-h-40 overflow-auto text-sm">
//           {filteredSuggestions.map((suggestion, index) => (
//             <div
//               key={index}
//               onClick={() => handleSuggestionClick(suggestion)}
//               className="p-2 hover:bg-gray-100 cursor-pointer"
//             >
//               {suggestion}
//             </div>
//           ))}
//           {loading && (
//             <div className="p-2 text-gray-400 text-xs italic">Loading...</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default memo(SmartTagInput);




import React, { memo, useEffect, useState } from "react";

type SmartTagInputProps = {
    tags: string[];
    setState: React.Dispatch<React.SetStateAction<string[]>>;

    suggestions?: string[];
    inputClassName?: string;
    suggestionFetcher?: (searchTerm: string) => Promise<string[]>;
    disableSuggestion?: boolean;
};

const SmartTagInput: React.FC<SmartTagInputProps> = ({
    tags,
    setState,
    suggestions = [],
    suggestionFetcher,
    inputClassName,
    disableSuggestion = false,
}) => {
    const [input, setInput] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedInput, setDebouncedInput] = useState("");



    // ✅ Debounce: only update "debouncedInput" after 500ms pause
    useEffect(() => {
        if (disableSuggestion) return;

        const handler = setTimeout(() => {
            setDebouncedInput(input.trim());
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [input, disableSuggestion]);

    useEffect(()=>{
         if (!input) {
              setFilteredSuggestions([]);
            return;
        }
    }, [input])

    // ✅ Suggestions Effect
    useEffect(() => {
        if (disableSuggestion) return;

        if (!debouncedInput) {
            //   setFilteredSuggestions([]);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);

                if (suggestionFetcher) {
                    const res = await suggestionFetcher(debouncedInput);
                    const filtered = res.filter((tag) => !tags.includes(tag));

                    setFilteredSuggestions(filtered);
                    // setFilteredSuggestions(
                    //   res.filter((tag) => !tags.includes(tag))
                    // );
                } else {
                    const localFiltered = suggestions
                        .filter(
                            (tag) =>
                                tag.toLowerCase().includes(debouncedInput.toLowerCase()) &&
                                !tags.includes(tag)
                        )
                        .slice(0, 10);
                    setFilteredSuggestions(localFiltered);
                }
            } catch (err) {
                console.error("Suggestion fetch error:", err);
                setFilteredSuggestions([]);
            } finally {
                setLoading(false);
            }
        };


        fetchData();
    }, [debouncedInput, disableSuggestion,]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && input.trim()) {
            e.preventDefault();
            if (!tags.includes(input.trim())) {
                setState([...tags, input.trim()]);
            }
            setInput("");
        } else if (e.key === "Backspace" && !input) {
            setState(tags.slice(0, -1));
        }
    };

    const handleSuggestionClick = (suggestedTag: string) => {
        if (!tags.includes(suggestedTag)) {
            setState([...tags, suggestedTag]);
        }
        setInput("");
        setFilteredSuggestions([]);
    };

    const removeTag = (indexToRemove: number) => {
        setState(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className={`${inputClassName} relative w-full`}>
            <div className={`flex flex-wrap items-center border-b-1 border-[#565656] p-2 gap-2 rounded`}>
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1"
                    >
                        {tag}
                        <span
                            className="cursor-pointer ml-1 text-xs"
                            onClick={() => removeTag(index)}
                        >
                            ×
                        </span>
                    </div>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input flex-1 outline-none text-sm border-none"
                    placeholder="Type and press Enter"
                />
            </div>

            {!disableSuggestion && filteredSuggestions?.length > 0 && (
                <div className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded shadow max-h-40 overflow-auto text-sm">
                    {filteredSuggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-2 py-4 hover:bg-gray-100 cursor-pointer"
                        >
                            <i className="fa-solid fa-arrow-trend-up hover:bg-gray-50 p-3 rounded-full"></i>                            {suggestion}
                        </div>
                    ))}
                    {loading && (
                        <div className="p-8 place-items-center">
                            <div className="p-2  text-gray-400 text-xs italic animate-spin rounded-full h-5 w-5 border-3 border-b-transparent border-black">

                            </div>
                        </div>

                    )}
                </div>
            )}
        </div>
    );
};

export default memo(SmartTagInput);