
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


// 1. IMPORT YOUR EXISTING MAPS HERE (Adjust the file paths to match your project structure)
import { PERMISSION_MAPPING as SIDEBAR_PERMISSIONS } from '../Pages/Organization/OrganizationChildren';;
import { PERMISSION_MAPPING as ORG_PERMISSIONS } from '../Pages/Projects/Projects';
import { PERMISSION_MAPPING as PROJECT_PERMISSIONS } from '../Pages/Projects/ProjectDetails';
import { useAuthCheck } from '../Hooks/useAuthCheck';

// // 2. COMBINE THEM INTO ONE MASTER MAP (Does not modify the originals)
// const MASTER_PERMISSION_MAP: Record<string, string | string[]> = {
//     ...SIDEBAR_PERMISSIONS,
//     ...ORG_PERMISSIONS,
//     ...PROJECT_PERMISSIONS
// };

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


    // Fetch user permissions
    const { permission, role } = useAuthCheck();

    // and after modules are fully loaded.
    const MASTER_PERMISSION_MAP = useMemo(() => ({
        ...SIDEBAR_PERMISSIONS,
        ...ORG_PERMISSIONS,
        ...PROJECT_PERMISSIONS
    }), []);

    // 3. THE NEW PERMISSION CHECKER
    const hasPermissionForModule = (moduleKey: string) => {
        // --- RULE 1: ORGANIZATION RESTRICTED MODULES ---
        // ⚠️ REPLACE THESE WITH YOUR TWO ACTUAL MODULE KEYS ⚠️
        const ORG_RESTRICTED_MODULES = ['LEADCOLLECTION', 'COSTCALCULATIONLEADFORM', "ALLORGS"];
        const TARGET_ORG_ID = "684a57015e439b678e8f6918";

        // If the current module is one of the restricted ones...
        if (ORG_RESTRICTED_MODULES.includes(moduleKey)) {
            // ...and the org ID doesn't match, hide it immediately.
            if (organizationId !== TARGET_ORG_ID) {
                return false;
            }
            // If the org ID DOES match, we let it continue down to check permissions/roles below.
        }

        // --- RULE 2: OWNER BYPASS ---
        // Adjust the string to match exactly how 'owner' is spelled in your database (e.g., 'Owner', 'OWNER')
        if (role === 'owner') {
            return true;
        }

        // --- RULE 3: STANDARD PERMISSION CHECK (For non-owners) ---
        const mappedDept = MASTER_PERMISSION_MAP[moduleKey];

        // If no mapping exists, it's a public/open route
        if (!mappedDept) return true;

        const checkDeptHasAnyTrue = (deptName: string) => {
            const userDeptPerms = permission?.[deptName];
            if (!userDeptPerms) return false;

            return Object.values(userDeptPerms).some(val => val === true);
        };

        if (Array.isArray(mappedDept)) {
            return mappedDept.some(dept => checkDeptHasAnyTrue(dept));
        }

        return checkDeptHasAnyTrue(mappedDept);
    };


    // 1. Build the Unified Search Index
    const searchIndex = useMemo(() => {
        if (!organizationId) return [];


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

        return Object.entries(allPaths)
            .filter(([key]) => hasPermissionForModule(key))
            .map(([key, pathUrl]) => ({
                id: key,
                title: toTitleCase(resolveLabel(key)),
                icon: resolveIcon(key),
                path: pathUrl
            }));
    }, [organizationId, permission, role]);

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
                <div className="fixed inset-0 bg-black/40 !backdrop-blur-sm !z-[1000] transition-opacity duration-300" />
            )}

            {/* Search Container - Explicit width animation preserved */}
            <div
                ref={searchContainerRef}
                className={`relative !z-[10001] ml-2 md:ml-4 transition-all duration-300 ease-in-out origin-left ${isFocused
                        ? 'w-[90vw] sm:w-[500px] md:w-[600px] lg:w-[700px]'
                        : 'w-[200px] sm:w-[250px] md:w-[280px]'
                    }`}
            >

                {/* Search Bar - Custom Tailwind Colors Used */}
                <div className={`relative flex items-center w-full h-10 transition-all duration-300 ${isFocused
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