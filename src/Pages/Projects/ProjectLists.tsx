// import { Fragment, useCallback, useMemo, useState } from "react";
// import { SIDEBAR_LABELS } from "../../constants/constants";
// import CreateProject, { type ProjectInput } from "../../components/CreateProject";
// import SingleProject from "../../shared/SingleProject";
// import { useGetProjects } from "../../apiList/projectApi";
// import type { IProject } from "../../types/types";
// import { mapProjectToProjectInput } from "../../utils/editProjectRequiredFields";
// import ProjectCardLoading from "../../LoadingUI/ProjectCartLoading";
// import { useOutletContext, useParams } from "react-router-dom";
// import type { OrganizationOutletTypeProps } from "../Organization/OrganizationChildren";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../store/store";
// import { Button } from "../../components/ui/Button";
// import { Input } from "../../components/ui/Input";


// const ProjectLists = () => {

//   const { organizationId } = useParams()
//   const { openMobileSidebar, isMobile } = useOutletContext<OrganizationOutletTypeProps>()
//   const { role } = useSelector((state: RootState) => state.authStore)
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [isEditing, setisEditing] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   const [editForm, setEditForm] = useState<ProjectInput>({
//     projectName: "",
//     description: "",
//     duration: 0,
//     // category:"",
//     tags: [],
//     startDate: new Date(),
//     endDate: null,
//     dueDate: null,
//     priority: "none",
//     status: "Active",
//   });
//   const [editProjectId, setEditProjectId] = useState<string | null>(null);

//   let { data: getProjects, refetch, isPending, error, isLoading } = useGetProjects(organizationId!)

//   // 2. Frontend Filter Logic
//   // We use useMemo to ensure we only re-filter when the data or query changes
//   const filteredProjects = useMemo(() => {
//     if (!getProjects) return [];
//     return getProjects?.filter((project: any) =>
//       project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [getProjects, searchQuery]);

//   const allowedRoles = ["owner", "CTO", "staff"]

//   const handleEdit = useCallback((project: IProject, id: string) => {
//     const projectInput = mapProjectToProjectInput(project);
//     setEditForm(projectInput);
//     setEditProjectId(id)
//     setisEditing(true);
//     setShowForm(true);

//   }, []);

//   const handleClose = useCallback(() => {
//     setShowForm(false);
//     setisEditing(false);
//   }, []);

//   const handleEditProject = useCallback((project: IProject, id: string) => {
//     handleEdit(project, id);
//   }, [handleEdit]);

//   if (isLoading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//     {[1, 2, 3, 4].map((n) => {
//       return (
//         <ProjectCardLoading key={n} />
//       )
//     })}
//   </div>




//   // getProjects = []
//   return (
//     <div className="w-[100%] flex flex-col h-full min-h-0 ">

//       <header className="flex justify-between items-center">
//         <div className="flex ">
//           {isMobile &&
//             <button
//               onClick={openMobileSidebar}
//               className="mr-3 p-2 rounded-md border-none border-gray-300 hover:bg-gray-100"
//               title="Open Menu"
//             >
//               <i className="fa-solid fa-bars"></i>
//             </button>
//           }
//           <h2 className="text-2xl sm:text-3xl font-bold text-[#1f2d3d] flex items-center gap-2">
//             <i className="fa-solid fa-diagram-project text-blue-600 text-2xl"></i>
//             <p>{SIDEBAR_LABELS.PROJECTS}</p>
//           </h2>
//         </div>


//         <div className="flex items-center gap-3 w-full sm:w-auto">
//           <div className="relative w-full sm:w-64">
//             <Input
//               placeholder="Search projects..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10" // Space for an icon
//             />
//             <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
//           </div>

//           {allowedRoles.includes(role!) && <div
//             onClick={() => {
//               setShowForm(!showForm)
//             }}
//             className="bg-blue-600  cursor-pointer !h-[40px] !w-[40px] flex justify-center items-center rounded-full"
//           >
//             <i
//               className={`fa-solid fa-plus text-white transition-transform duration-300 ${showForm ? "rotate-135" : "rotate-0"
//                 }`}
//             ></i>
//           </div>}
//         </div>


//       </header>
//       <hr className="my-2 border-b-1 border-gray-300" />

//       {!error && !isPending && (getProjects?.length ?? 0) === 0 && <div className="flex h-full flex-col items-center justify-center w-full py-16 text-center text-gray-500">
//         <div className="text-6xl mb-4">
//           📂
//         </div>
//         <h2 className="text-xl font-semibold mb-2">No Projects Found</h2>
//         <p className="text-sm text-gray-400 mb-4 max-w-md">
//           Looks like you haven’t added any projects yet. Click the “+” button to get started and create your first project.
//         </p>
//         <button onClick={() => setShowForm(true)} className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
//           Create New Project
//         </button>
//       </div>
//       }



//       {error && (
//         <div className="max-w-xl sm:min-w-[80%]  mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//           <div className="text-red-600 font-semibold mb-2 text-xl sm:text-3xl">
//             ⚠️ Error Occurred
//           </div>
//           <p className="text-red-500  mb-4 text-lg sm:text-xl">
//             {(error as any)?.response?.data?.message || "Failed to load the projects"}
//           </p>
//           <Button
//             onClick={() => refetch()}
//             className="bg-red-600 text-white px-4 py-2"
//           >
//             Retry
//           </Button>
//         </div>
//       )}


//       {!error && <div className="h-full flex-1 !overflow-y-auto custom-scrollbar grid md:grid-cols-2 gap-6">

//         {isPending && [...Array(6)].map((_, i) => <Fragment key={i}><ProjectCardLoading /></Fragment>)}

//         {/* {!isPending && getProjects?.length > 0 && getProjects?.map((project: IProject & { _id: string }, index: number) => {

//           return (
//             <>
//               <div
//                 key={(project as any)._id}
//                 className="h-[256px] sm:!h-[270px] md:!h-[330px] lg:!h-[282px] flex flex-col shadow-md rounded-xl overflow-hidden border-l-8 border-blue-600 bg-white"
//               >
//                 <SingleProject refetch={refetch} onEdit={handleEditProject} index={index} project={project} organizationId={organizationId!} />
//               </div>
//             </>
//           );
//         })} */}


//         {filteredProjects?.length > 0 ? (
//           filteredProjects?.map((project: IProject & { _id: string }, index: number) => (
//             <>
//               <div
//                 key={(project as any)._id}
//                 className="h-[256px] sm:!h-[270px] md:!h-[330px] lg:!h-[282px] flex flex-col shadow-md rounded-xl overflow-hidden border-l-8 border-blue-600 bg-white"
//               >
//                 <SingleProject
//                   refetch={refetch} onEdit={handleEditProject} index={index} project={project} organizationId={organizationId!}
//                 />
//               </div>
//             </>
//           ))
//         ) : (
//           <div className="col-span-full text-center py-10 text-gray-500">
//             No projects found matching "{searchQuery}"
//           </div>
//         )}
//       </div>}

//       {showForm && (
//         <div onClick={handleClose} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
//           <CreateProject onClose={handleClose} refetch={refetch} setShowForm={setShowForm} organizationId={organizationId!} isEditing={isEditing} setEditForm={setEditForm} editForm={editForm} editProjectId={editProjectId} />
//         </div>
//       )}

//     </div>
//   )
// }

// export default ProjectLists


//  SECOND VERSION

// import { useEffect, useRef, useState } from 'react';
// import { useLocation, useParams, Outlet } from 'react-router-dom';
// // import { useAuthCheck } from '../../Hooks/useAuthCheck';
// import { useDebounce } from '../../Hooks/useDebounce';
// import { useDeleteProject, useGetAllProjects } from '../../apiList/projectApi';
// import { toast } from '../../utils/toast';
// import { Button } from '../../components/ui/Button';
// import StageGuide from '../../shared/StageGuide';
// import ProjectCard from './ProjectCard';
// import CreateProject, { type ProjectInput } from "../../components/CreateProject";
// import { Input } from '../../components/ui/Input';

// const ProjectLists = () => {
//     // const navigate = useNavigate();
//     const location = useLocation();
//     const { organizationId } = useParams();

//     // const { role, permission } = useAuthCheck();
//     // const canList = role === "owner" || permission?.project?.list;
//     // const canCreate = role === "owner" || permission?.project?.create;

//     const isDetailView = location.pathname.includes('/single') || location.pathname.includes('/create');

//     // --- Create / Edit Form State ---
//     const [showForm, setShowForm] = useState<boolean>(false);
//     const [isEditing, setIsEditing] = useState<boolean>(false);
//     const [editProjectId, setEditProjectId] = useState<string | null>(null);
//     const [editForm, setEditForm] = useState<ProjectInput>({
//         projectName: "",
//         description: "",
//         duration: 0,
//         tags: [],
//         startDate: new Date(),
//         endDate: null,
//         dueDate: null,
//         priority: "none",
//         status: "Active",

//     });

//     // --- Filter States ---
//     const [filters, setFilters] = useState({
//         search: '',
//         status: '',
//         priority: '',
//         startDate: '',
//         endDate: '',
//         isCompleted: false
//     });

//     const debouncedSearch = useDebounce(filters.search, 700);
// const observerTarget = useRef<HTMLDivElement>(null); // 1. Create the ref
//     // --- Infinite Query Hook ---
//     const {
//         data,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         isLoading,
//         isError,
//         error,
//         refetch
//     } = useGetAllProjects({
//         organizationId: organizationId || '',
//         limit: 100,
//         projectName: debouncedSearch || undefined,
//         status: filters.status || undefined,
//         priority: filters.priority || undefined,
//         startDate: filters.startDate || undefined,
//         endDate: filters.endDate || undefined,
//         isCompleted: filters.isCompleted || undefined, // New State
//     });

//     const deleteProjectMutation = useDeleteProject();

//     // 2. Add the Intersection Observer Effect
//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 // If the target is visible on screen, and we can fetch more, do it!
//                 if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
//                     fetchNextPage();
//                 }
//             },
//             { threshold: 0.1 } // Triggers when 10% of the element is visible
//         );

//         if (observerTarget.current) {
//             observer.observe(observerTarget.current);
//         }

//         return () => observer.disconnect(); // Cleanup
//     }, [hasNextPage, isFetchingNextPage, fetchNextPage]);



//     const 
//     handleDelete = async (id: string) => {
//         try {
//             if (!window.confirm("Are you sure you want to delete this project?")) return;
//             await deleteProjectMutation.mutateAsync(id);
//             refetch();
//             toast({ title: "Success", description: "Project record deleted" });
//         } catch (err: any) {
//             toast({ title: "Error", description: err.message, variant: "destructive" });
//         }
//     };

//     const handleEdit = (project: any, id: string) => {
//         setEditProjectId(id);
//         setIsEditing(true);
//         setEditForm({
//             projectName: project.projectName,
//             description: project.description || "",
//             duration: project.projectInformation?.duration || 0,
//             tags: project.projectInformation?.tags || [],
//             startDate: project.projectInformation?.startDate ? new Date(project.projectInformation.startDate) : new Date(),
//             endDate: project.projectInformation?.endDate ? new Date(project.projectInformation.endDate) : null,
//             dueDate: project.projectInformation?.dueDate ? new Date(project.projectInformation.dueDate) : null,
//             priority: project.projectInformation?.priority || "none",
//             status: project.projectInformation?.status || "Active",
//         });
//         setShowForm(true);
//     };

//     const handleCloseForm = () => {
//         setShowForm(false);
//         setIsEditing(false);
//         setEditProjectId(null);
//         setEditForm({
//             projectName: "",
//             description: "",
//             duration: 0,
//             tags: [],
//             startDate: new Date(),
//             endDate: null,
//             dueDate: null,
//             priority: "none",
//             status: "Active",
//         });
//     };

//     const clearFilters = () => {
//         setFilters({ search: '', status: '', priority: '', startDate: '', endDate: '', isCompleted: false });
//     };

//     // const activeFiltersCount = Object.values(filters).filter(val => val !== '').length;

//     const activeFiltersCount = Object.values(filters).filter(val => val !== '' && val !== false).length;
//     const projects = data?.pages.flatMap(page => page.data.projects) || [];

//     if (isDetailView) return <Outlet />;

//     return (
//         <div className="space-y-0 h-full flex flex-col relative">

//             {/* Create / Edit Form Modal */}
//             {showForm && (
//                 <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
//                     <CreateProject
//                         onClose={handleCloseForm}
//                         refetch={refetch}
//                         setShowForm={setShowForm}
//                         organizationId={organizationId!}
//                         isEditing={isEditing}
//                         setEditForm={setEditForm}
//                         editForm={editForm}
//                         editProjectId={editProjectId}
//                     />
//                 </div>
//             )}

//             {/* --- HEADER --- */}
//             <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 flex-shrink-0">
//                 <div>
//                     <h1 className="text-3xl font-bold text-slate-800 flex items-center">
//                         {/* <i className="fas fa-project-diagram mr-3 text-indigo-600"></i> */}
//                         <i className="fa-solid fa-city mr-4 text-indigo-600 shadow-sm"></i>
//                         Projects Portfolio
//                     </h1>
//                     <p className="text-sm text-slate-500 mt-1">Manage and track your organization's projects</p>
//                 </div>

//                 <div className='flex gap-3'>
                    
//                         <Button
//                             onClick={() => setShowForm(true)}
//                             className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-transform active:scale-95"
//                         >
//                             <i className="fas fa-plus mr-2" />
//                             New Project
//                         </Button>
                    
//                     <StageGuide organizationId={organizationId!} stageName="project" />
//                 </div>
//             </header>

//             {/* --- MAIN CONTENT AREA --- */}
//             {isLoading ? (
//                 <div className="flex justify-center items-center py-20 flex-1">
//                     <i className="fas fa-spinner fa-spin text-indigo-600 text-5xl"></i>
//                 </div>
//             ) : isError ? (
//                 <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 text-center rounded-xl border border-red-100">
//                     <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-3"></i>
//                     <p className="text-red-600 font-medium mb-4">{(error as any)?.message}</p>
//                     <Button onClick={() => refetch()} variant="outline">Retry Loading</Button>
//                 </div>
//             ) : (
//                 // Responsive layout: flex-col on mobile, flex-row on large screens (lg)
//                 <main className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 lg:overflow-hidden overflow-y-auto">

//                     {/* LEFT: FILTERS SIDEBAR (Responsive Width) */}
//                     <div className="w-full lg:w-[30%] lg:max-w-[300px] flex-shrink-0 flex flex-col lg:h-full bg-white rounded-xl shadow-sm border border-slate-200 lg:overflow-y-auto">
//                         <div className="p-4 lg:p-5 border-b border-slate-100 sticky top-0 bg-white z-10 flex items-center justify-between">
//                             <h3 className="text-base font-bold text-slate-800 flex items-center">
//                                 <i className="fas fa-filter mr-2 text-indigo-500"></i> Filters
//                             </h3>
//                             {activeFiltersCount > 0 && (
//                                 <button onClick={clearFilters} className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
//                                     Clear All ({activeFiltersCount})
//                                 </button>
//                             )}
//                         </div>

//                         <div className="p-4 lg:p-5 space-y-4 lg:space-y-5">
//                             {/* Search Box */}
//                             <div className="grid grid-cols-2  lg:grid-cols-1 gap-3">
//                             <div>
//                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Search</label>
//                                 <div className="relative">
//                                     {/* <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i> */}
//                                     <Input
//                                         type="text"
//                                         placeholder="Project name..."
//                                         value={filters.search}
//                                         onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
//                                     // className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Priority Filter */}
//                             <div>
//                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
//                                 <select
//                                     value={filters.priority}
//                                     onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
//                                     className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
//                                 >
//                                     <option value="">All Priorities</option>
//                                     <option value="high">High</option>
//                                     <option value="medium">Medium</option>
//                                     <option value="low">Low</option>
//                                     <option value="none">None</option>
//                                 </select>
//                             </div>
//                             </div>

//                             {/* Date Range Filters */}
//                             <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date</label>
//                                     <input
//                                         type="date"
//                                         value={filters.startDate}
//                                         onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
//                                         className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Date</label>
//                                     <input
//                                         type="date"
//                                         value={filters.endDate}
//                                         onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
//                                         className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Completion</label>
//                                 <button
//                                     onClick={() => setFilters(f => ({ ...f, isCompleted: !f.isCompleted }))}
//                                     className={`flex cursor-pointer items-center gap-2 px-4 py-2.5 w-full rounded-lg text-sm font-semibold transition-all border ${filters.isCompleted
//                                             ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]'
//                                             : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
//                                         }`}
//                                 >
//                                     <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${filters.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
//                                         {filters.isCompleted && <i className="fa-solid fa-check text-[10px] text-white"></i>}
//                                     </div>
//                                     Completed
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* RIGHT: PROJECT CARDS GRID */}
                     
//                         <div
//                             // ref={setScrollRef}
//                             className="flex-1 lg:overflow-y-auto lg:pr-2 pb-10 custom-scrollbar"
//                         >
//                             {projects.length === 0 && !isLoading ? (
//                                 <div className="flex flex-col items-center justify-center h-64 lg:h-full text-center bg-white rounded-xl border border-slate-200 border-dashed">
//                                     <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
//                                         <i className="fas fa-folder-open text-3xl text-indigo-300" />
//                                     </div>
//                                     <h3 className="text-xl font-bold text-slate-700 mb-1">No Projects Found</h3>
//                                     <p className="text-slate-500">Try adjusting your filters or create a new project.</p>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
//                                         {projects.map((project) => (
//                                             <ProjectCard
//                                                 key={project._id}
//                                                 project={project}
//                                                 organizationId={organizationId!}
//                                                 onEdit={() => handleEdit(project, project._id)}
//                                                 onDelete={() => handleDelete(project._id)}
//                                                 isDeleting={deleteProjectMutation.isPending && deleteProjectMutation.variables === project._id}
//                                             />
//                                         ))}
//                                     </div>

//                                     <div ref={observerTarget} className="w-full h-10 mt-4"></div>

//                                     {isFetchingNextPage && (
//                                         <div className="py-8 flex justify-center w-full">
//                                             <div className="bg-white shadow-sm border border-slate-100 px-6 py-3 rounded-full flex items-center gap-3 text-indigo-600 font-semibold">
//                                                 <i className="fas fa-circle-notch fa-spin"></i>
//                                                 <span className="text-sm">Loading more projects...</span>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {!hasNextPage && projects.length > 0 && (
//                                         <div className="py-10 text-center w-full">
//                                             <p className="text-slate-400 text-sm font-medium flex items-center justify-center gap-2">
//                                                 <i className="fas fa-check-double text-slate-300"></i>
//                                                 You've reached the end of the list
//                                             </p>
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </div>
                
//                 </main>
//             )}
//         </div>
//     );
// };

// export default ProjectLists;


//  THIRD VERSION

import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams, Outlet } from 'react-router-dom';
import { useDebounce } from '../../Hooks/useDebounce';
import { useDeleteProject, useGetAllProjects } from '../../apiList/projectApi';
import { toast } from '../../utils/toast';
import { Button } from '../../components/ui/Button';
import StageGuide from '../../shared/StageGuide';
import ProjectCard from './ProjectCard';
import CreateProject, { type ProjectInput } from "../../components/CreateProject";
import { Input } from '../../components/ui/Input';

const ProjectLists = () => {
    const location = useLocation();
    const { organizationId } = useParams();

    const isDetailView = location.pathname.includes('/single') || location.pathname.includes('/create');

    // --- Create / Edit Form State ---
    const [showForm, setShowForm] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editProjectId, setEditProjectId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<ProjectInput>({
        projectName: "",
        description: "",
        duration: 0,
        tags: [],
        startDate: new Date(),
        endDate: null,
        dueDate: null,
        priority: "none",
        status: "Active",
    });

    // --- Filter States ---
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
        startDate: '',
        endDate: '',
        isCompleted: false
    });

    const debouncedSearch = useDebounce(filters.search, 700);
    const observerTarget = useRef<HTMLDivElement>(null);

    // --- Infinite Query Hook ---
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetAllProjects({
        organizationId: organizationId || '',
        limit: 100,
        projectName: debouncedSearch || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        isCompleted: filters.isCompleted || undefined,
    });

    const deleteProjectMutation = useDeleteProject();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleDelete = async (id: string) => {
        try {
            if (!window.confirm("Are you sure you want to delete this project?")) return;
            await deleteProjectMutation.mutateAsync(id);
            refetch();
            toast({ title: "Success", description: "Project record deleted" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleEdit = (project: any, id: string) => {
        setEditProjectId(id);
        setIsEditing(true);
        setEditForm({
            projectName: project.projectName,
            description: project.description || "",
            duration: project.projectInformation?.duration || 0,
            tags: project.projectInformation?.tags || [],
            startDate: project.projectInformation?.startDate ? new Date(project.projectInformation.startDate) : new Date(),
            endDate: project.projectInformation?.endDate ? new Date(project.projectInformation.endDate) : null,
            dueDate: project.projectInformation?.dueDate ? new Date(project.projectInformation.dueDate) : null,
            priority: project.projectInformation?.priority || "none",
            status: project.projectInformation?.status || "Active",
        });
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setIsEditing(false);
        setEditProjectId(null);
        setEditForm({
            projectName: "",
            description: "",
            duration: 0,
            tags: [],
            startDate: new Date(),
            endDate: null,
            dueDate: null,
            priority: "none",
            status: "Active",
        });
    };

    const clearFilters = () => {
        setFilters({ search: '', status: '', priority: '', startDate: '', endDate: '', isCompleted: false });
    };

    const activeFiltersCount = Object.values(filters).filter(val => val !== '' && val !== false).length;
    const projects = data?.pages.flatMap(page => page.data.projects) || [];

    if (isDetailView) return <Outlet />;

    return (
        <div className="space-y-0 h-full flex flex-col relative bg-[#f8f9fa] lg:bg-transparent">

            {/* Create / Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <CreateProject
                        onClose={handleCloseForm}
                        refetch={refetch}
                        setShowForm={setShowForm}
                        organizationId={organizationId!}
                        isEditing={isEditing}
                        setEditForm={setEditForm}
                        editForm={editForm}
                        editProjectId={editProjectId}
                    />
                </div>
            )}

            {/* --- HEADER --- */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                        <i className="fa-solid fa-city mr-3 text-slate-400"></i>
                        Projects Portfolio
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and track your organization's projects</p>
                </div>

                <div className='flex gap-3'>
                    <Button
                    variant='white'
                        onClick={() => setShowForm(true)}
                        // className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-transform active:scale-95 border-0"
                    >
                        <i className="fas fa-plus mr-2" />
                        New Project
                    </Button>
                    <StageGuide organizationId={organizationId!} stageName="project" />
                </div>
            </header>

            {/* --- MAIN CONTENT AREA --- */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20 flex-1">
                    <i className="fas fa-spinner fa-spin text-slate-400 text-4xl"></i>
                </div>
            ) : isError ? (
                <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 text-center rounded-xl border border-red-100">
                    <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-3"></i>
                    <p className="text-red-600 font-medium mb-4">{(error as any)?.message}</p>
                    <Button onClick={() => refetch()} variant="outline">Retry Loading</Button>
                </div>
            ) : (
                <main className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 lg:overflow-hidden overflow-y-auto">

                    {/* LEFT: FILTERS SIDEBAR */}
                    <div className="w-full lg:w-[30%] lg:max-w-[280px] flex-shrink-0 flex flex-col lg:h-full bg-white rounded-xl border border-slate-200 lg:overflow-y-auto">
                        <div className="p-4 lg:p-5 border-b border-slate-100 sticky top-0 bg-white z-10 flex items-center justify-between rounded-t-xl">
                            <h3 className="text-sm font-bold text-slate-700 flex items-center">
                                <i className="fas fa-filter mr-2 text-slate-400"></i> Filters
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                    Clear All ({activeFiltersCount})
                                </button>
                            )}
                        </div>

                        <div className="p-4 lg:p-5 space-y-4 lg:space-y-5">
                            {/* Search Box */}
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Search</label>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            placeholder="Project name..."
                                            value={filters.search}
                                            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {/* Priority Filter */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                                    <select
                                        value={filters.priority}
                                        onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
                                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-100 focus:border-slate-300 outline-none transition-colors text-slate-700"
                                    >
                                        <option value="">All Priorities</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            </div>

                            {/* Date Range Filters */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start</label>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                                        className="w-full px-2 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-300 text-slate-700 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End</label>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                                        className="w-full px-2 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-300 text-slate-700 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Completion</label>
                                <button
                                    onClick={() => setFilters(f => ({ ...f, isCompleted: !f.isCompleted }))}
                                    className={`flex cursor-pointer items-center gap-2 px-4 py-2 w-full rounded-lg text-sm font-medium transition-all border ${
                                        filters.isCompleted
                                            ? 'bg-slate-800 text-white border-slate-800'
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${filters.isCompleted ? 'bg-slate-800 border-slate-800' : 'border-slate-300'}`}>
                                        {filters.isCompleted && <i className="fa-solid fa-check text-[10px] text-white"></i>}
                                    </div>
                                    Completed Only
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: PROJECT CARDS GRID */}
                    <div className="flex-1 lg:overflow-y-auto lg:pr-2 pb-10 custom-scrollbar">
                        {projects.length === 0 && !isLoading ? (
                            <div className="flex flex-col items-center justify-center h-64 lg:h-full text-center bg-white rounded-xl border border-slate-200 border-dashed">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                    <i className="fas fa-folder-open text-2xl text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 mb-1">No Projects Found</h3>
                                <p className="text-sm text-slate-500">Try adjusting your filters or create a new project.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                                    {projects.map((project) => (
                                        <ProjectCard
                                            key={project._id}
                                            project={project}
                                            organizationId={organizationId!}
                                            onEdit={() => handleEdit(project, project._id)}
                                            onDelete={() => handleDelete(project._id)}
                                            isDeleting={deleteProjectMutation.isPending && deleteProjectMutation.variables === project._id}
                                        />
                                    ))}
                                </div>

                                <div ref={observerTarget} className="w-full h-10 mt-4"></div>

                                {isFetchingNextPage && (
                                    <div className="py-8 flex justify-center w-full">
                                        <div className="bg-white shadow-sm border border-slate-200 px-5 py-2 rounded-full flex items-center gap-2 text-slate-600 font-medium">
                                            <i className="fas fa-circle-notch fa-spin text-slate-400"></i>
                                            <span className="text-xs">Loading more projects...</span>
                                        </div>
                                    </div>
                                )}

                                {!hasNextPage && projects.length > 0 && (
                                    <div className="py-8 text-center w-full">
                                        <p className="text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
                                            <i className="fas fa-check-double text-slate-300"></i>
                                            End of projects list
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            )}
        </div>
    );
};

export default ProjectLists;