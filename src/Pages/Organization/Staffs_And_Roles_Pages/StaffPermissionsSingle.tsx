
// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useGetSingleUserForRoles, useUpdateUserPermissions } from '../../../apiList/orgApi'; // Ensure useGetUserById is imported
// import { useDebounce } from '../../../Hooks/useDebounce';

// // --- CONSTANTS ---
// const DEPARTMENTS = [
//     'hr',
//     'logistics',
//     'procurement',
//     "design",
//     'commonorder',
//     'accounts',
//     'payments',
//     "billing",
//     'materialquote',
//     "subcontract",
//     "stafftask",

//     "referencedesign",
//     "productinventory"
// ];



// const ACTIONS = ['list', 'create', 'edit', 'delete'];

// const StaffPermissionsSingle = () => {
//     const { userId } = useParams();
//     const navigate = useNavigate();

//     // 1. Hooks
//     const { mutateAsync: updatePermissions, status: saveStatus } = useUpdateUserPermissions();

//     // ⭐ STEP 1: Fetch the existing data from DB
//     const { data: userData, isLoading } = useGetSingleUserForRoles(userId!); 

//     // 2. Local State
//     const [permissions, setPermissions] = useState<any>({});
//     const [isInitialized, setIsInitialized] = useState(false);

//      const handleGlobalSelectAll = () => {
//         setPermissions((prev: any) => {
//             const newPerms = { ...prev };
//             // Loop through only VISIBLE departments
//             visibleDepartments.forEach((dept) => {
//                 newPerms[dept] = {
//                     list: true,
//                     create: true,
//                     edit: true,
//                     delete: true
//                 };
//             });
//             return newPerms;
//         });
//     };

//      const handleGlobalDeselectAll = () => {
//         setPermissions((prev: any) => {
//             const newPerms = { ...prev };
//             visibleDepartments.forEach((dept) => {
//                 newPerms[dept] = {
//                     list: false,
//                     create: false,
//                     edit: false,
//                     delete: false
//                 };
//             });
//             return newPerms;
//         });
//     };
//     // 3. Debounce
//     const debouncedPermissions = useDebounce(permissions, 800);

//     // ⭐ STEP 2: Sync DB Data to Local State (Only Once)
//     useEffect(() => {
//         // If we have data and haven't initialized yet
//         if (userData && !isInitialized) {
//             // Set local state to match DB, or default to {}
//             setPermissions(userData.permission || {});
//             setIsInitialized(true); // Now we are ready to listen for changes
//         }
//     }, [userData, isInitialized]);


//     // 4. AUTO-SAVE EFFECT
//     useEffect(() => {
//         // ⭐ CRITICAL: Don't save if we haven't loaded the initial data yet!
//         // This prevents overwriting the DB with an empty object on refresh.
//         if (!isInitialized) return;

//         // Prevent saving if the debounce fired but values are identical to what we just loaded
//         // (Optional optimization, but good for performance)
//         if (JSON.stringify(debouncedPermissions) === JSON.stringify(userData?.permissions || {})) {
//             return;
//         }

//         const performUpdate = async () => {
//             await updatePermissions({
//                 userId: userId!,
//                 permission: debouncedPermissions 
//             });
//         };

//         performUpdate();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [debouncedPermissions]); // remove userData dependency to avoid loop



//      // 5. ⭐ CALCULATE VISIBLE DEPARTMENTS BASED ON ROLE ⭐
//     const role = userData?.role?.toLowerCase();

//     const visibleDepartments = DEPARTMENTS.filter((dept) => {
//         // 1. Wait for data to load
//         if (!role) return false;

//         // 2. Owner, CTO, and Staff usually get full permission configuration access
//         // (Staff sees everything except "Staff Tasks", which isn't in your DEPARTMENTS list anyway)
//         if (role === 'owner' || role === 'cto' || role === 'staff') {
//             return true; 
//         }

//         // 3. Worker Whitelist (Define what modules a Worker can ever touch)
//         if (role === 'worker') {
//             // Example: Workers might deal with Logistics or Materials
//             return [ 'ordermaterial', 'subcontract', ].includes(dept);
//         }

//         // 4. Client Whitelist
//         if (role === 'client') {
//             // Example: Clients might only deal with Designs or Quotes
//             // return ['design', 'materialquote'].includes(dept);
//             return false
//         }

//         return false;
//     });


//     // --- HANDLERS ---
//     const handleSingleCheck = (dept: string, action: string) => {
//         setPermissions((prev: any) => ({
//             ...prev,
//             [dept]: {
//                 ...(prev[dept] || {}),
//                 [action]: !prev[dept]?.[action]
//             }
//         }));
//     };

//     const handleSelectAll = (dept: string) => {
//         setPermissions((prev: any) => {
//             const currentDept = prev[dept] || {};
//             const allSelected = ACTIONS.every(act => currentDept[act] === true);
//             const newValue = !allSelected;

//             return {
//                 ...prev,
//                 [dept]: {
//                     list: newValue,
//                     create: newValue,
//                     edit: newValue,
//                     delete: newValue
//                 }
//             };
//         });
//     };

//     const isAllSelected = (dept: string) => {
//         const currentDept = permissions[dept] || {};
//         return ACTIONS.every(act => currentDept[act] === true);
//     };

//     // Show loading state while fetching initial data
//     if (isLoading && !isInitialized) {
//         return (
//             <div className="flex h-full items-center justify-center bg-gray-50">
//                 <div className="text-gray-500 flex flex-col items-center">
//                     <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
//                     <span>Loading User Permissions...</span>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col h-full bg-gray-50">
//             {/* --- HEADER --- */}
//             <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
//                 <div className="flex items-center gap-4">
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="text-gray-500 hover:text-gray-800 transition-colors"
//                     >
//                         <i className="fas fa-arrow-left text-xl"></i>
//                     </button>
//                     <div>
//                         <h1 className="text-xl font-bold text-gray-900">Permission Management</h1>
//                         <p className="text-xs text-gray-500">
//                            For: <span className="font-semibold text-gray-700">{userData?.name || 'User'}</span> <span className="font-mono ml-2">({userData?.role})</span>
//                         </p>
//                     </div>
//                 </div>

//                 {/* <div className="flex items-center gap-3">
//                     {saveStatus === 'pending' ? (
//                         <span className="text-xs font-medium text-orange-600 flex items-center bg-orange-50 px-3 py-1 rounded-full animate-pulse">
//                             <i className="fas fa-circle-notch fa-spin mr-2"></i> Saving...
//                         </span>
//                     ) : saveStatus === 'success' ? (
//                         <span className="text-xs font-medium text-green-600 flex items-center bg-green-50 px-3 py-1 rounded-full transition-all duration-500">
//                             <i className="fas fa-check mr-2"></i> Saved
//                         </span>
//                     ) : null}
//                 </div> */}


//                  <div className="flex items-center gap-4">

//                     {/* ⭐ NEW BUTTONS HERE ⭐ */}
//                     {visibleDepartments.length > 0 && (
//                         <div className="flex items-center gap-2 mr-4 border-r pr-4 border-gray-200">
//                             <button 
//                                 onClick={handleGlobalSelectAll}
//                                 className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
//                             >
//                                 Select All
//                             </button>
//                             <button 
//                                 onClick={handleGlobalDeselectAll}
//                                 className="text-xs font-medium bg-gray-50 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
//                             >
//                                 Deselect All
//                             </button>
//                         </div>
//                     )}

//                     {saveStatus === 'pending' ? (
//                         <span className="text-xs font-medium text-orange-600 flex items-center bg-orange-50 px-3 py-1 rounded-full animate-pulse">
//                             <i className="fas fa-circle-notch fa-spin mr-2"></i> Saving...
//                         </span>
//                     ) : saveStatus === 'success' ? (
//                         <span className="text-xs font-medium text-green-600 flex items-center bg-green-50 px-3 py-1 rounded-full transition-all duration-500">
//                             <i className="fas fa-check mr-2"></i> Saved
//                         </span>
//                     ) : null}
//                 </div>

//             </header>

//             {/* --- CONTENT GRID --- */}
//             <main className="flex-1 overflow-y-auto p-6">

//                  {/* Handle Empty State (e.g. if Client has no permission modules) */}
//                 {visibleDepartments.length === 0 && isInitialized && (
//                     <div className="flex flex-col items-center justify-center h-64 text-gray-400">
//                         <i className="fas fa-ban text-4xl mb-3"></i>
//                         <p>No configurable permissions for this role.</p>
//                     </div>
//                 )}


//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
//                     {visibleDepartments.map((dept) => (
//                         <div
//                             key={dept}
//                             className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden"
//                         >
//                             <div
//                                 className={`px-4 py-3 border-b flex justify-between items-center cursor-pointer select-none transition-colors
//                                 ${isAllSelected(dept) ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}
//                                 onClick={() => handleSelectAll(dept)}
//                             >
//                                 <h3 className="font-bold text-sm text-gray-700 capitalize">
//                                     {dept.replace(/([A-Z])/g, ' $1').trim()}
//                                 </h3>
//                                 <div className="relative flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         checked={isAllSelected(dept)}
//                                         readOnly
//                                         className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer pointer-events-none"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="p-4 space-y-3 flex-1">
//                                 {ACTIONS.map((action) => (
//                                     <label
//                                         key={action}
//                                         className="flex items-center justify-between group cursor-pointer"
//                                     >
//                                         <span className="text-sm text-gray-600 capitalize group-hover:text-gray-900 transition-colors">
//                                             {action}
//                                         </span>
//                                         <input
//                                             type="checkbox"
//                                             className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-all"
//                                             checked={permissions[dept]?.[action] || false}
//                                             onChange={() => handleSingleCheck(dept, action)}
//                                         />
//                                     </label>
//                                 ))}
//                             </div>
//                             <div className={`h-1 w-full ${isAllSelected(dept) ? 'bg-blue-500' : 'bg-transparent'}`} />
//                         </div>
//                     ))}
//                 </div>
//             </main>
//         </div>
//     );
// };



// export default StaffPermissionsSingle;


import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSingleUserForRoles, useUpdateUserPermissions } from '../../../apiList/orgApi';
import { useDebounce } from '../../../Hooks/useDebounce';

// --- CONSTANTS ---

// 1. Organization Level Departments
const ORG_MODULES = [
    'hr',
    'logistics',
    'procurement',
    // "commonorder",
    'accounts',
    'payments',
    "billing",

    "vendor", "customer", "invoice",
     "expense", "billtemplate", "purchaseorder",
      "vendorpayment", "salesorder",  "retailinvoice",

    "subcontract",
    "referencedesign",
    "stafftask",
    "design",         // Design Lab (Org level)
    "productinventory",
    "invitecto",
    "invitestaff",

];

// 2. Project Level Stages
const PROJECT_STAGES = [
    "inventory",
    "inviteclient",
    "inviteworker",
    "prerequisites",
    "clientrequirement", // clientrequirement
    "sitemeasurement",
    "sampledesign",
    "workschedule",
    "technicalconsultant",
    "paymentconfirmation", 
    "modularunit",         
    "ordermaterial",       
    "materialarrival",
    "installation",
    "qualitycheck",
    "cleaning",
    "projectdelivery",
];

const ACTIONS = ['list', 'create', 'edit', 'delete'];

// --- UI HELPERS ---
const getDeptStyle = (dept: string) => {
    // Simple hash to color generation or static mapping
    // Keeping it simple for demo, you can expand this switch
    if (PROJECT_STAGES.includes(dept)) {
        return { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: 'fa-project-diagram' };
    }
    switch (dept) {
        case 'hr': return { color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', icon: 'fa-users' };
        case 'accounts': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'fa-file-invoice-dollar' };
        case 'logistics': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: 'fa-truck' };
        default: return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100', icon: 'fa-layer-group' };
    }
};

const StaffPermissionsSingle = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    // Hooks
    const { mutateAsync: updatePermissions, status: saveStatus } = useUpdateUserPermissions();
    const { data: userData, isLoading } = useGetSingleUserForRoles(userId!);

    // Local State
    const [permissions, setPermissions] = useState<any>({});
    const [isInitialized, setIsInitialized] = useState(false);

    // Debounce
    const debouncedPermissions = useDebounce(permissions, 800);

    // Sync Data
    useEffect(() => {
        if (userData && !isInitialized) {
            setPermissions(userData.permission || {});
            setIsInitialized(true);
        }
    }, [userData, isInitialized]);

    // Auto Save
    useEffect(() => {
        if (!isInitialized) return;
        if (JSON.stringify(debouncedPermissions) === JSON.stringify(userData?.permissions || {})) return;

        const performUpdate = async () => {
            await updatePermissions({
                userId: userId!,
                permission: debouncedPermissions
            });
        };
        performUpdate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedPermissions]);


    // --- FILTERING LOGIC ---
    const role = userData?.role?.toLowerCase();

    // Helper to filter keys based on role
    const filterKeys = (keys: string[]) => {
        if (!role) return [];
        if (role === 'owner' || role === 'cto') return keys;

        if (role === 'staff') {
            // return keys.filter(k => k !== 'stafftask');
            return keys
        }

        if (role === 'worker') {
            // const workerAllowed = [
            //     'subcontract', 'ordermaterial', 'logistics', 'procurement', // Org
            //     'workschedule', 'technicalconsultant', 'materialarrival', 'installation', 'cleaning' // Project
            // ];
            // return keys.filter(k => workerAllowed.includes(k));
            return keys
        }

        if (role === 'client') {
            // const clientAllowed = [
            //     'design', 'billing', 'materialquote', // Org
            //     'requirementform', 'clientrequirement', 'sitemeasurement', 'paymentconfirmation', 'projectdelivery' // Project
            // ];
            // return keys.filter(k => clientAllowed.includes(k));
            return keys

        }
        return [];
    };

    const visibleOrgModules = useMemo(() => filterKeys(ORG_MODULES), [role]);
    const visibleProjectStages = useMemo(() => filterKeys(PROJECT_STAGES), [role]);


    // --- HANDLERS ---

    const handleSingleCheck = (dept: string, action: string) => {
        setPermissions((prev: any) => ({
            ...prev,
            [dept]: { ...(prev[dept] || {}), [action]: !prev[dept]?.[action] }
        }));
    };

    const handleCardSelectAll = (dept: string) => {
        setPermissions((prev: any) => {
            const currentDept = prev[dept] || {};
            const allSelected = ACTIONS.every(act => currentDept[act] === true);
            const newValue = !allSelected;
            return {
                ...prev,
                [dept]: { list: newValue, create: newValue, edit: newValue, delete: newValue }
            };
        });
    };

    const isCardSelected = (dept: string) => {
        const currentDept = permissions[dept] || {};
        return ACTIONS.every(act => currentDept[act] === true);
    };

    // --- BULK HANDLERS ---

    const setBulkPermissions = (keys: string[], value: boolean) => {
        setPermissions((prev: any) => {
            const newPerms = { ...prev };
            keys.forEach((key) => {
                newPerms[key] = {
                    list: value,
                    create: value,
                    edit: value,
                    delete: value
                };
            });
            return newPerms;
        });
    };

    // 1. Global (Everything)
    const handleGlobalSelect = (val: boolean) => setBulkPermissions([...visibleOrgModules, ...visibleProjectStages], val);

    // 2. Org Only
    const handleOrgSelect = (val: boolean) => setBulkPermissions(visibleOrgModules, val);

    // 3. Project Only
    const handleProjectSelect = (val: boolean) => setBulkPermissions(visibleProjectStages, val);


    // Loading
    if (isLoading && !isInitialized) {
        return <div className="flex h-full items-center justify-center">Loading Permissions...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            {/* --- HEADER --- */}
            <header className=" border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-20 shadow-sm/50 backdrop-blur-sm bg-white/90 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-blue-600">
                        <i className="fas fa-arrow-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Permission Management</h1>
                        <p className="text-xs text-gray-500">
                            {userData?.name} <span className="uppercase font-bold bg-blue-50 text-blue-600 px-1 rounded ml-1">{userData?.role}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* GLOBAL CONTROLS */}
                    {(visibleOrgModules.length > 0 || visibleProjectStages.length > 0) && (
                        <div className="flex items-center gap-2 border-r pr-4 mr-2 border-gray-200">
                            <span className="text-[10px] uppercase font-bold text-gray-400 mr-1">Global:</span>
                            <button onClick={() => handleGlobalSelect(true)} className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-black transition">
                                Select All
                            </button>
                            <button onClick={() => handleGlobalSelect(false)} className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-100 transition">
                                Clear All
                            </button>
                        </div>
                    )}

                    {saveStatus === 'pending' ? (
                        <span className="text-xs font-bold text-orange-500 animate-pulse">SAVING...</span>
                    ) : saveStatus === 'success' ? (
                        <span className="text-xs font-bold text-green-600">SAVED</span>
                    ) : null}
                </div>
            </header>

            {/* --- CONTENT --- */}
            <main className="flex-1 overflow-y-auto p-6 space-y-10">

                {/* --- SECTION 1: ORGANIZATION DEPARTMENTS --- */}
                {visibleOrgModules.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-4 border-b pb-2 border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                <i className="fas fa-building mr-2 text-blue-500"></i> Organization Departments
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={() => handleOrgSelect(true)} className="text-[10px] uppercase font-bold text-blue-600 hover:underline">Select All Org</button>
                                <span className="text-gray-300">|</span>
                                <button onClick={() => handleOrgSelect(false)} className="text-[10px] uppercase font-bold text-red-500 hover:underline">Deselect Org</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {visibleOrgModules.map(dept => (
                                <PermissionCard
                                    key={dept}
                                    dept={dept}
                                    permissions={permissions}
                                    onSelectAll={() => handleCardSelectAll(dept)}
                                    onSingleCheck={handleSingleCheck}
                                    isAllSelected={isCardSelected(dept)}
                                    style={getDeptStyle(dept)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* --- SECTION 2: PROJECT STAGES --- */}
                {visibleProjectStages.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-4 border-b pb-2 border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                <i className="fas fa-layer-group mr-2 text-indigo-500"></i> Project Stages
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={() => handleProjectSelect(true)} className="text-[10px] uppercase font-bold text-blue-600 hover:underline">Select All Projects</button>
                                <span className="text-gray-300">|</span>
                                <button onClick={() => handleProjectSelect(false)} className="text-[10px] uppercase font-bold text-red-500 hover:underline">Deselect Projects</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {visibleProjectStages.map(dept => (
                                <PermissionCard
                                    key={dept}
                                    dept={dept}
                                    permissions={permissions}
                                    onSelectAll={() => handleCardSelectAll(dept)}
                                    onSingleCheck={handleSingleCheck}
                                    isAllSelected={isCardSelected(dept)}
                                    style={getDeptStyle(dept)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {visibleOrgModules.length === 0 && visibleProjectStages.length === 0 && isInitialized && (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                        <p>No configurable permissions available for this role.</p>
                    </div>
                )}

            </main>
        </div>
    );
};

// --- SUB COMPONENT FOR CLEANER CODE ---
const PermissionCard = ({ dept, permissions, onSelectAll, onSingleCheck, isAllSelected, style }: any) => {
    return (
        <div className={`relative bg-white rounded-xl shadow-sm border transition-all duration-300 ${isAllSelected ? `border-blue-300 shadow-blue-50 ring-1 ring-blue-100` : 'border-gray-200 hover:shadow-md'}`}>
            {/* Header */}
            <div
                className={`px-4 py-3 border-b flex justify-between items-center cursor-pointer select-none rounded-t-xl transition-colors ${isAllSelected ? 'bg-blue-50/50' : 'bg-white hover:bg-gray-50'}`}
                onClick={onSelectAll}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className={`flex-shrink-0 h-7 w-7 rounded flex items-center justify-center ${style.bg} ${style.color}`}>
                        <i className={`fas ${style.icon} text-xs`}></i>
                    </div>
                    <h3 className="font-bold text-xs text-gray-800 capitalize truncate" title={dept}>
                        {dept.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                </div>
                <div className={`flex-shrink-0 h-4 w-4 rounded border flex items-center justify-center transition-all ${isAllSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                    {isAllSelected && <i className="fas fa-check text-white text-[10px]"></i>}
                </div>
            </div>

            {/* Body */}
            <div className="p-3 space-y-2">
                {ACTIONS.map((action) => {
                    const isChecked = permissions[dept]?.[action] || false;
                    return (
                        <label key={action} className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-all ${isChecked ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                            <span className={`text-xs capitalize font-medium ${isChecked ? 'text-blue-700' : 'text-gray-600'}`}>{action}</span>
                            <div className="relative">
                                <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => onSingleCheck(dept, action)} />
                                <div className={`h-4 w-7 rounded-full transition-colors duration-200 border ${isChecked ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-200'}`}></div>
                                <div className={`absolute left-[2px] top-[2px] bg-white w-3 h-3 rounded-full shadow transition-transform duration-200 ${isChecked ? 'translate-x-3' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                    );
                })}
            </div>
            <div className={`h-1 w-full rounded-b-xl transition-all ${isAllSelected ? 'bg-blue-500' : 'bg-transparent'}`} />
        </div>
    );
};

export default StaffPermissionsSingle;