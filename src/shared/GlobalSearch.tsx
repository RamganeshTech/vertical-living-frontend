
// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//     MAIN_PATH_ICON, 
//     MAIN_PATH_LABEL, 
//     ORGANIZATION_ICONS, 
//     ORGANIZATION_LABELS, 
//     PROJECTS_ICONS, 
//     PROJECTS_LABELS 
// } from '../constants/constants';

// interface GlobalSearchProps {
//     organizationId?: string;
// }

// const GlobalSearch: React.FC<GlobalSearchProps> = ({ organizationId }) => {
//     const [query, setQuery] = useState('');
//     const [isFocused, setIsFocused] = useState(false);
//     const searchContainerRef = useRef<HTMLDivElement>(null);
//     const navigate = useNavigate();

//     // 1. Build the Unified Search Index
//     const searchIndex = useMemo(() => {
//         if (!organizationId) return [];

//         const allPaths: Record<string, string> = {
//             PROJECTS: `/organizations/${organizationId}/projects`,
//             DETAILS: `/organizations/${organizationId}`,
//             ALLORGS: `/organizations/${organizationId}/all-organizations`,
//             INVITECTO: `/organizations/${organizationId}/invitecto`,
//             INVITESTAFFS: `/organizations/${organizationId}/invitestaff`,
//             ROLESPERMISSIONS: `/organizations/${organizationId}/dashboard`,
//             PLAN: `/organizations/${organizationId}/subscriptionplan`,
//             PROFILE: `/organizations/${organizationId}/userprofile`,
//             MODULAR: `/organizations/${organizationId}/modularunits`,
//             ORGANIZATION: `/organizations/${organizationId}`,
//             SHORTLIST: `/organizations/${organizationId}/projects/shortlistdesign`,
//             COMMONORDER: `/organizations/${organizationId}/projects/commonorder`,
//             SUBCONTRACT: `/organizations/${organizationId}/projects/subcontractmain`,
//             TOOLMANAGEMENT: `/organizations/${organizationId}/projects/toolhub`,
//             CAD: `/organizations/${organizationId}/projects/cadmain`,
//             HR: `/organizations/${organizationId}/projects/hr`,
//             LOGISTICS: `/organizations/${organizationId}/projects/logistics`,
//             PROCUREMENT: `/organizations/${organizationId}/projects/procurement`,
//             ACCOUNTING: `/organizations/${organizationId}/projects/accounting`,
//             DESIGNLAB: `/organizations/${organizationId}/projects/designlabmain`,
//             CUTLIST: `/organizations/${organizationId}/projects/cutlistmain`,
//             PINCODE: `/organizations/${organizationId}/projects/pincodemain`,
//             PINCODEPROJECTSASSIGNMENT: `/organizations/${organizationId}/projects/pincodeprojectmain`,
//             LEADCOLLECTION: `/organizations/${organizationId}/projects/publicleadcollection`,
//             COSTCALCULATIONLEADFORM: `/organizations/${organizationId}/projects/publiccostcalculation`,
//             RATECONIGPRESALES: `/organizations/${organizationId}/projects/rateconfigpresales`,
//             RATECONIG: `/organizations/${organizationId}/projects/rateconfig`,
//             RATECONIGSTAFF: `/organizations/${organizationId}/projects/labourrateconfig`,
//             RATECONIGMATERIALWITHSTAFF: `/organizations/${organizationId}/projects/materialwithlabourrate`,
//             CALCULATOR: `/organizations/${organizationId}/projects/calculator`,
//             PRESALESQUOTE: `/organizations/${organizationId}/projects/presalesquote`,
//             INTERNALQUOTE: `/organizations/${organizationId}/projects/internalquote`,
//             QUOTEVARIENT: `/organizations/${organizationId}/projects/quotevariant`,
//             "QUOTES (CLIENT)": `/organizations/${organizationId}/projects/clientquotes`,
//             WORKLIBRARY: `/organizations/${organizationId}/projects/worklibrary`,
//             STAFFTASK: `/organizations/${organizationId}/projects/stafftask`,
//             SINGLESTAFFTASK: `/organizations/${organizationId}/projects/associatedstafftask`,
//             MATERIALINVENTORY: `/organizations/${organizationId}/projects/materialinventory`,
//         };

//         const resolveLabel = (key: string): string => {
//             if (ORGANIZATION_LABELS[key]) return ORGANIZATION_LABELS[key];
//             if (PROJECTS_LABELS[key]) return PROJECTS_LABELS[key];
//             if (MAIN_PATH_LABEL[key.toLowerCase()]) return MAIN_PATH_LABEL[key.toLowerCase()];
//             return key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase());
//         };

//         const resolveIcon = (key: string): string => {
//             if (ORGANIZATION_ICONS[key]) return ORGANIZATION_ICONS[key];
//             if (PROJECTS_ICONS[key]) return PROJECTS_ICONS[key];
            
//             const indirectKey = MAIN_PATH_ICON[key.toLowerCase()];
//             if (indirectKey && PROJECTS_ICONS[indirectKey]) return PROJECTS_ICONS[indirectKey];

//             return "fa-solid fa-layer-group text-xl"; 
//         };

//         // Enforce Proper Title Case
//         const toTitleCase = (str: string) => {
//             return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//         };

//         return Object.entries(allPaths).map(([key, pathUrl]) => ({
//             id: key,
//             title: toTitleCase(resolveLabel(key)), 
//             icon: resolveIcon(key),
//             path: pathUrl
//         }));
//     }, [organizationId]);

//     // 2. Default Suggestions (Shown when input is empty)
//     const defaultSuggestions = useMemo(() => {
//         const defaultKeys = ['PROJECTS', 'RATECONIG', 'INTERNALQUOTE', 'QUOTEVARIENT', 'ORGANIZATION'];
//         return searchIndex.filter(item => defaultKeys.includes(item.id));
//     }, [searchIndex]);

//     // 3. Filtered Results (Shown when user is typing)
//     const filteredResults = useMemo(() => {
//         if (!query.trim()) return [];
//         return searchIndex.filter(item => 
//             item.title.toLowerCase().includes(query.toLowerCase()) || 
//             item.id.toLowerCase().includes(query.toLowerCase())
//         );
//     }, [query, searchIndex]);

//     // 4. Handle closing the search when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
//                 setIsFocused(false);
//             }
//         };

//         if (isFocused) {
//             document.addEventListener('mousedown', handleClickOutside);
//         }
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [isFocused]);

//     const handleNavigation = (path: string) => {
//         navigate(path);
//         setIsFocused(false);
//         setQuery('');
//     };

//     const displayResults = query.trim().length > 0 ? filteredResults : defaultSuggestions;

//     return (
//         <>
//             {/* Dark Overlay Background */}
//             {isFocused && (
//                 <div className="fixed inset-0 bg-black/40 backdrop-blur-sm !z-[9998] transition-opacity duration-300" />
//             )}

//             {/* Search Container 
//                 FIX 1: Using explicit 'w-[...]' classes for flawless width animation instead of max-w
//             */}
//             <div 
//                 ref={searchContainerRef} 
//                 className={`relative !z-[9999] ml-2 md:ml-4 transition-all duration-300 ease-in-out origin-left ${
//                     isFocused 
//                         ? 'w-[90vw] sm:w-[500px] md:w-[600px] lg:w-[700px]' 
//                         : 'w-[200px] sm:w-[250px] md:w-[280px]'
//                 }`}
//             >
                
//                 {/* Search Bar */}
//                 <div className={`relative flex items-center w-full h-10 bg-gray-100 border transition-all duration-300 ${
//                     isFocused 
//                         ? 'bg-white border-blue-500 shadow-lg rounded-lg ring-1 ring-blue-500' 
//                         : 'border-transparent rounded-lg hover:bg-gray-200'
//                 }`}>
//                     <div className="grid place-items-center h-full w-10 text-gray-500">
//                         <i className={`fa-solid ${isFocused ? 'fa-magnifying-glass text-blue-500' : 'fa-search'} text-sm transition-colors`}></i>
//                     </div>

//                     <input
//                         className="peer h-full w-full outline-none text-sm text-gray-700 pr-9 bg-transparent placeholder-gray-500 font-medium"
//                         type="text"
//                         placeholder="Search modules, settings..."
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         onFocus={() => setIsFocused(true)}
//                         autoComplete="off"
//                     />
                    
//                     {/* Quick clear button */}
//                     {query && (
//                         <button 
//                             onClick={() => setQuery('')}
//                             className="absolute right-2 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
//                         >
//                             <i className="fa-solid fa-xmark text-sm"></i>
//                         </button>
//                     )}
//                 </div>

//                 {/* Suggestions Dropdown Card */}
//                 {isFocused && (
//                     <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white shadow-2xl border border-gray-100 rounded-xl overflow-hidden max-h-[65vh] overflow-y-auto">
//                         {displayResults.length > 0 ? (
//                             <div className="p-4">
//                                 <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
//                                     {query.trim().length > 0 ? (
//                                         <><i className="fa-solid fa-list-ul"></i> Search Results</>
//                                     ) : (
//                                         <><i className="fa-solid fa-bolt text-yellow-500"></i> Suggested Modules</>
//                                     )}
//                                 </div>
                                
//                                 {/* FIX 2: Grid Layout with Vertical Cards 
//                                     This guarantees the labels are visible and won't get squashed.
//                                 */}
//                                 <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
//                                     {displayResults.map((result) => (
//                                         <li 
//                                             key={result.id}
//                                             onClick={() => handleNavigation(result.path)}
//                                             className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all duration-200 text-center"
//                                         >
//                                             <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:border-blue-300 shadow-sm transition-colors">
//                                                 <i className={`${result.icon} text-lg text-gray-500 group-hover:text-blue-600`}></i>
//                                             </div>
//                                             <span className="font-semibold text-xs text-gray-700 group-hover:text-blue-900 line-clamp-2 w-full">
//                                                 {result.title}
//                                             </span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         ) : (
//                             <div className="px-4 py-12 text-sm text-center text-gray-500 flex flex-col items-center gap-4">
//                                 <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-inner">
//                                     <i className="fa-solid fa-magnifying-glass-minus text-2xl text-gray-300"></i>
//                                 </div>
//                                 <div>
//                                     <span className="block font-semibold text-gray-700 text-base mb-1">No results found for "{query}"</span>
//                                     <span className="text-xs text-gray-400">Check for spelling errors or try a different term.</span>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };

// export default GlobalSearch;


// SECODN VERSION

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    MAIN_PATH_ICON, 
    MAIN_PATH_LABEL, 
    ORGANIZATION_ICONS, 
    ORGANIZATION_LABELS, 
    PROJECTS_ICONS, 
    PROJECTS_LABELS, 
    SIDEBAR_LABELS
} from '../constants/constants';
import { getOrganizationPaths } from '../Pages/Organization/OrganizationChildren';
import { getProjectPaths } from '../Pages/Projects/Projects';

interface GlobalSearchProps {
    organizationId?: string;
}


// This combines both for the Global Search
export const getAllAppPaths = (organizationId: string | undefined): Record<string, string> => {
    if (!organizationId) return {};
    return {
        ...getOrganizationPaths(organizationId),
        ...getProjectPaths(organizationId)
    };
};




const GlobalSearch: React.FC<GlobalSearchProps> = ({ organizationId }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();


    
    // 1. Build the Unified Search Index
    const searchIndex = useMemo(() => {
        if (!organizationId) return [];

        // const allPaths: Record<string, string> = {
        //     PROJECTS: `/organizations/${organizationId}/projects`,
        //     DETAILS: `/organizations/${organizationId}`,
        //     ALLORGS: `/organizations/${organizationId}/all-organizations`,
        //     INVITECTO: `/organizations/${organizationId}/invitecto`,
        //     INVITESTAFFS: `/organizations/${organizationId}/invitestaff`,
        //     ROLESPERMISSIONS: `/organizations/${organizationId}/dashboard`,
        //     PLAN: `/organizations/${organizationId}/subscriptionplan`,
        //     PROFILE: `/organizations/${organizationId}/userprofile`,
        //     MODULAR: `/organizations/${organizationId}/modularunits`,
        //     ORGANIZATION: `/organizations/${organizationId}`,
        //     SHORTLIST: `/organizations/${organizationId}/projects/shortlistdesign`,
        //     COMMONORDER: `/organizations/${organizationId}/projects/commonorder`,
        //     SUBCONTRACT: `/organizations/${organizationId}/projects/subcontractmain`,
        //     TOOLMANAGEMENT: `/organizations/${organizationId}/projects/toolhub`,
        //     CAD: `/organizations/${organizationId}/projects/cadmain`,
        //     HR: `/organizations/${organizationId}/projects/hr`,
        //     LOGISTICS: `/organizations/${organizationId}/projects/logistics`,
        //     PROCUREMENT: `/organizations/${organizationId}/projects/procurement`,
        //     ACCOUNTING: `/organizations/${organizationId}/projects/accounting`,
        //     DESIGNLAB: `/organizations/${organizationId}/projects/designlabmain`,
        //     CUTLIST: `/organizations/${organizationId}/projects/cutlistmain`,
        //     PINCODE: `/organizations/${organizationId}/projects/pincodemain`,
        //     PINCODEPROJECTSASSIGNMENT: `/organizations/${organizationId}/projects/pincodeprojectmain`,
        //     LEADCOLLECTION: `/organizations/${organizationId}/projects/publicleadcollection`,
        //     COSTCALCULATIONLEADFORM: `/organizations/${organizationId}/projects/publiccostcalculation`,
        //     RATECONIGPRESALES: `/organizations/${organizationId}/projects/rateconfigpresales`,
        //     RATECONIG: `/organizations/${organizationId}/projects/rateconfig`,
        //     RATECONIGSTAFF: `/organizations/${organizationId}/projects/labourrateconfig`,
        //     RATECONIGMATERIALWITHSTAFF: `/organizations/${organizationId}/projects/materialwithlabourrate`,
        //     CALCULATOR: `/organizations/${organizationId}/projects/calculator`,
        //     PRESALESQUOTE: `/organizations/${organizationId}/projects/presalesquote`,
        //     INTERNALQUOTE: `/organizations/${organizationId}/projects/internalquote`,
        //     QUOTEVARIENT: `/organizations/${organizationId}/projects/quotevariant`,
        //     "QUOTES (CLIENT)": `/organizations/${organizationId}/projects/clientquotes`,
        //     WORKLIBRARY: `/organizations/${organizationId}/projects/worklibrary`,
        //     STAFFTASK: `/organizations/${organizationId}/projects/stafftask`,
        //     SINGLESTAFFTASK: `/organizations/${organizationId}/projects/associatedstafftask`,
        //     MATERIALINVENTORY: `/organizations/${organizationId}/projects/materialinventory`,
        // };


        const allPaths = getAllAppPaths(organizationId);

        const resolveLabel = (key: string): string => {
            if (ORGANIZATION_LABELS[key]) return ORGANIZATION_LABELS[key];
            if (PROJECTS_LABELS[key]) return PROJECTS_LABELS[key];
            if (SIDEBAR_LABELS[key]) return SIDEBAR_LABELS[key]; // <--- 2. ADD THIS CHECK
            if (MAIN_PATH_LABEL[key.toLowerCase()]) return MAIN_PATH_LABEL[key.toLowerCase()];
            return key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase());
        };

        const resolveIcon = (key: string): string => {
            if (ORGANIZATION_ICONS[key]) return ORGANIZATION_ICONS[key];
            if (PROJECTS_ICONS[key]) return PROJECTS_ICONS[key];
            
            const indirectKey = MAIN_PATH_ICON[key.toLowerCase()];
            if (indirectKey && PROJECTS_ICONS[indirectKey]) return PROJECTS_ICONS[indirectKey];

            return "fa-solid fa-layer-group text-xl"; 
        };

        // Enforce Proper Title Case
        const toTitleCase = (str: string) => {
            return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        };

        return Object.entries(allPaths).map(([key, pathUrl]) => ({
            id: key,
            title: toTitleCase(resolveLabel(key)), 
            icon: resolveIcon(key),
            path: pathUrl
        }));
    }, [organizationId]);

    // 2. Default Suggestions
    const defaultSuggestions = useMemo(() => {
        const defaultKeys = ['PROJECTS', 'RATECONIG', 'INTERNALQUOTE', 'QUOTEVARIENT', 'ORGANIZATION'];
        return searchIndex.filter(item => defaultKeys.includes(item.id));
    }, [searchIndex]);

    // 3. Filtered Results
    const filteredResults = useMemo(() => {
        if (!query.trim()) return [];
        return searchIndex.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) || 
            item.id.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, searchIndex]);

    // 4. Handle closing the search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        if (isFocused) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFocused]);

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsFocused(false);
        setQuery('');
    };

    const displayResults = query.trim().length > 0 ? filteredResults : defaultSuggestions;

    return (
        <>
            {/* Dark Overlay Background - High Z-Index */}
            {isFocused && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm !z-[9998] transition-opacity duration-300" />
            )}

            {/* Search Container - Explicit width animation preserved */}
            <div 
                ref={searchContainerRef} 
                className={`relative !z-[9999] ml-2 md:ml-4 transition-all duration-300 ease-in-out origin-left ${
                    isFocused 
                        ? 'w-[90vw] sm:w-[500px] md:w-[600px] lg:w-[700px]' 
                        : 'w-[200px] sm:w-[250px] md:w-[280px]'
                }`}
            >
                
                {/* Search Bar - Custom Tailwind Colors Used */}
                <div className={`relative flex items-center w-full h-10 transition-all duration-300 ${
                    isFocused 
                        ? 'bg-white border border-ash-dark shadow-lg rounded-lg ring-1 ring-brand-main' 
                        : 'bg-brand-ash border border-transparent rounded-lg hover:bg-brand-ash'
                }`}>
                    <div className="grid place-items-center h-full w-10 text-text-muted">
                        <i className={`fa-solid ${isFocused ? 'fa-magnifying-glass text-primary' : 'fa-search'} text-sm transition-colors`}></i>
                    </div>

                    <input
                        className={`peer h-full w-full outline-none text-sm text-text-main pr-9 ${isFocused ? "bg-brand-surface" : " bg-brand-ash"} placeholder-text-muted font-medium`}
                        type="text"
                        placeholder="Search modules, internal quote , rate config..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        autoComplete="off"
                    />
                    
                    {/* Quick clear button */}
                    {query && (
                        <button 
                            onClick={() => setQuery('')}
                            className="absolute right-2 text-text-muted cursor-pointer hover:text-text-main p-1.5 rounded-full hover:bg-headingBg transition-colors flex items-center justify-center"
                        >
                            <i className="fa-solid fa-xmark text-sm"></i>
                        </button>
                    )}
                </div>

                {/* Suggestions Dropdown Card */}
                {isFocused && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-brand-surface shadow-2xl border border-brand-ash rounded-xl overflow-hidden max-h-[65vh] overflow-y-auto">
                        {displayResults.length > 0 ? (
                            <div className="p-4">
                                <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                                    {query.trim().length > 0 ? (
                                        <><i className="fa-solid fa-list-ul text-yellow-500"></i> Search Results</>
                                    ) : (
                                        <><i className="fa-solid fa-bolt text-yellow-500"></i> Suggested Modules</>
                                    )}
                                </div>
                                
                                {/* FIX: Horizontal Layout (Icon Left, Label Right) 
                                    Columns reduced to 2 or 3 to give text more horizontal breathing room 
                                */}
                                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {displayResults.map((result) => (
                                        <li 
                                            key={result.id}
                                            onClick={() => handleNavigation(result.path)}
                                            className="group flex items-center gap-3 p-3 rounded-xl border border-ash-dark bg-brand-surface hover:bg-brand-ash hover:border-primary hover:shadow-sm cursor-pointer transition-all duration-200"
                                        >
                                            {/* Left side: Icon */}
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-surface border border-ash-dark flex items-center justify-center group-hover:border-primary shadow-sm transition-colors">
                                                <i className={`${result.icon} text-lg text-text-muted group-hover:text-primary`}></i>
                                            </div>
                                            
                                            {/* Right side: Label */}
                                            <div className="flex-1 overflow-hidden">
                                                <span className="block font-semibold text-sm text-text-main group-hover:text-primary truncate w-full transition-colors">
                                                    {result.title}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="px-4 py-12 text-sm text-center text-text-muted flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-whiteBg border border-ash-dark flex items-center justify-center shadow-inner">
                                    <i className="fa-solid fa-magnifying-glass-minus text-2xl text-text-muted opacity-50"></i>
                                </div>
                                <div>
                                    <span className="block font-semibold text-text-main text-base mb-1">No results found for "{query}"</span>
                                    <span className="text-xs">Check for spelling errors or try a different term.</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default GlobalSearch;