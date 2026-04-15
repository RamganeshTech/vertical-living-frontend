
// import React from 'react';
// import { Link, useOutletContext } from 'react-router-dom';
// import { useGetCurrentActiveStage } from '../../apiList/currentActiveStage api/currentActiveStageApi';

// export const statusColors: Record<string, string> = {
//     "Active": "text-blue-600 bg-blue-100",
//     "Completed": "text-emerald-600 bg-emerald-100",
//     "On Hold": "text-amber-600 bg-amber-100",
//     "Cancelled": "text-red-600 bg-red-100",
// };

// type ProjectsOutletContextType = {
//     projectId: string;
//     setProjectId: React.Dispatch<React.SetStateAction<string>>;
// };

// interface ProjectCardProps {
//     project: any; 
//     organizationId: string;
//     onEdit: () => void;
//     onDelete: () => void;
//     isDeleting: boolean;
// }

// const ProjectCard: React.FC<ProjectCardProps> = ({ project, organizationId, onEdit, onDelete, isDeleting }) => {
//     const { projectName, projectInformation, completionPercentage } = project;

//     const { setProjectId } = useOutletContext<ProjectsOutletContextType>();
//     const { data: currentStagePath, isLoading: isStageLoading } = useGetCurrentActiveStage(project?._id!);

//     const handleSetProjectId = () => setProjectId(project._id);

//     // --- Dynamic Color Helpers ---
//     const getPriorityColor = (priority: string) => {
//         switch (priority?.toLowerCase()) {
//             case 'high': return 'bg-red-100 text-red-600 border-red-200';
//             case 'medium': return 'bg-amber-100 text-amber-600 border-amber-200';
//             case 'low': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
//             default: return 'bg-slate-100 text-slate-600 border-slate-200';
//         }
//     };

//     const getStatusBorder = (status: string) => {
//         switch (status?.toLowerCase()) {
//             case 'completed': return 'border-l-emerald-500';
//             case 'on hold': return 'border-l-amber-500';
//             case 'cancelled': return 'border-l-red-500';
//             default: return 'border-l-blue-500'; // Active
//         }
//     };

//     const formatDate = (dateString: string | Date | null) => {
//         if (!dateString) return "N/A";
//         return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//     };

//     return (
//         <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden border border-slate-200 border-l-4 ${getStatusBorder(projectInformation?.status)}`}>
            
//             <div className="p-4 flex-1 flex flex-col">
                
//                 {/* --- HEADER: Title & Badges --- */}
//                 <div className="flex justify-between items-start gap-2 mb-3">
//                     <h3 className="font-bold text-[15px] text-[#1f2d3d] leading-tight line-clamp-2 flex-1">
//                         <i className="fa-solid fa-compass-drafting text-indigo-500 mr-1.5"></i>
//                         {projectName}
//                     </h3>
                    
//                     {/* Compact Badges */}
//                     <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
//                         <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getPriorityColor(projectInformation?.priority)}`}>
//                             {projectInformation?.priority || 'None'} 
//                         </span>
                        
//                         {/* Status Badge (Using your requested statusColors logic) */}
//                         {/* <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${statusColors[projectInformation?.status] || 'bg-slate-100 text-slate-600'}`}>
//                             <span className="!bg-transparent">{projectInformation?.status || 'Unknown'}</span>
//                         </div> */}
//                     </div>
//                 </div>

//                 {/* --- COMPACT METRICS GRID --- */}
//                 <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
//                     <div className="flex items-center gap-1.5 text-xs">
//                         <i className="fa-solid fa-calendar-day text-blue-500 w-3 text-center"></i>
//                         <span className="text-slate-400 text-[10px] uppercase font-bold w-7">Start</span>
//                         <span className="font-semibold text-slate-700">{formatDate(projectInformation?.startDate)}</span>
//                     </div>
//                     <div className="flex items-center gap-1.5 text-xs">
//                         <i className="fa-solid fa-calendar-check text-emerald-500 w-3 text-center"></i>
//                         <span className="text-slate-400 text-[10px] uppercase font-bold w-7">End</span>
//                         <span className="font-semibold text-slate-700">{formatDate(projectInformation?.endDate)}</span>
//                     </div>
//                     <div className="flex items-center gap-1.5 text-xs">
//                         <i className="fa-solid fa-bell text-rose-500 w-3 text-center"></i>
//                         <span className="text-slate-400 text-[10px] uppercase font-bold w-7">Due</span>
//                         <span className="font-semibold text-slate-700">{formatDate(projectInformation?.dueDate)}</span>
//                     </div>
//                     <div className="flex items-center gap-1.5 text-xs">
//                         <i className="fa-solid fa-hourglass-half text-purple-500 w-3 text-center"></i>
//                         <span className="text-slate-400 text-[10px] uppercase font-bold w-7">Days</span>
//                         <span className="font-semibold text-slate-700">{projectInformation?.duration || 0}</span>
//                     </div>
//                 </div>

//                 {/* --- TIGHT PROGRESS BAR --- */}
//                 <div className="mt-auto px-1">
//                     <div className="flex justify-between items-end mb-1">
//                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
//                         <span className="text-[11px] font-bold text-indigo-600">{completionPercentage || 0}%</span>
//                     </div>
//                     <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
//                         <div 
//                             className={`h-full transition-all duration-1000 ease-out ${completionPercentage === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
//                             style={{ width: `${completionPercentage || 0}%` }}
//                         ></div>
//                     </div>
//                 </div>
//             </div>

//             {/* --- FULL BLEED ACTION BAR (Saves Vertical Height) --- */}
//             <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/50">
//                 <Link 
//                     to={`/${organizationId}/projectdetails/${project._id}/${currentStagePath}`} 
//                     onClick={handleSetProjectId}
//                     className={`flex  items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${isStageLoading ? "pointer-events-none opacity-50" : ""}`}
//                 >
//                     {isStageLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-eye"></i>}
//                     View
//                 </Link>

//                 <button 
//                     onClick={onEdit}
//                     className="flex cursor-pointer items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
//                 >
//                     <i className="fa-solid fa-pencil"></i> Edit
//                 </button>

//                 <button 
//                     onClick={onDelete}
//                     disabled={isDeleting}
//                     className="flex cursor-pointer items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50"
//                 >
//                     {isDeleting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fa-solid fa-trash"></i>}
//                     Delete
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ProjectCard;


//  SECOND VERSION

import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useGetCurrentActiveStage } from '../../apiList/currentActiveStage api/currentActiveStageApi';

export const statusColors: Record<string, string> = {
    "Active": "text-slate-700 bg-slate-100",
    "Completed": "text-slate-700 bg-slate-100",
    "On Hold": "text-slate-700 bg-slate-100",
    "Cancelled": "text-slate-700 bg-slate-100",
};

type ProjectsOutletContextType = {
    projectId: string;
    setProjectId: React.Dispatch<React.SetStateAction<string>>;
};

interface ProjectCardProps {
    project: any; 
    organizationId: string;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, organizationId, onEdit, onDelete, isDeleting }) => {
    const { projectName, projectInformation, completionPercentage } = project;

    const { setProjectId } = useOutletContext<ProjectsOutletContextType>();
    const { data: currentStagePath, isLoading: isStageLoading } = useGetCurrentActiveStage(project?._id!);

    const handleSetProjectId = () => setProjectId(project._id);

    // Flattened, minimal colors for badges
    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-50 text-red-600 border-red-100';
            case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'low': return 'bg-slate-50 text-slate-600 border-slate-200';
            default: return 'bg-white text-slate-500 border-slate-200';
        }
    };

    const formatDate = (dateString: string | Date | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden border border-slate-200">
            
            <div className="p-4 flex-1 flex flex-col">
                
                {/* --- HEADER: Title & Badges --- */}
                <div className="flex justify-between items-start gap-3 mb-4">
                    <h3 className="font-semibold text-[15px] text-slate-800 leading-snug line-clamp-2 flex-1">
 <i className="fa-solid fa-compass-drafting text-blue-500 mr-1.5"></i>

                        {projectName}
                    </h3>
                    
                    {/* Compact Badge */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0 mt-0.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border ${getPriorityColor(projectInformation?.priority)}`}>
                            {projectInformation?.priority || 'None'} 
                        </span>
                    </div>
                </div>

                {/* --- COMPACT METRICS GRID (Ash/Grey Theme) --- */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-3 mb-5">
                    <div className="flex items-center gap-2 text-xs">
                        <i className="fa-solid fa-calendar-day text-slate-400 w-3 text-center"></i>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold w-7 tracking-wider">Start</span>
                        <span className="font-medium text-slate-600">{formatDate(projectInformation?.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <i className="fa-solid fa-calendar-check text-slate-400 w-3 text-center"></i>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold w-7 tracking-wider">End</span>
                        <span className="font-medium text-slate-600">{formatDate(projectInformation?.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <i className="fa-solid fa-bell text-slate-400 w-3 text-center"></i>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold w-7 tracking-wider">Due</span>
                        <span className="font-medium text-slate-600">{formatDate(projectInformation?.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <i className="fa-regular fa-clock text-slate-400 w-3 text-center"></i>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold w-7 tracking-wider">Days</span>
                        <span className="font-medium text-slate-600">{projectInformation?.duration || 0}</span>
                    </div>
                </div>

                {/* --- TIGHT PROGRESS BAR --- */}
                <div className="mt-auto pt-1">
                    <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Progress</span>
                        <span className="text-[11px] font-semibold text-slate-700">{completionPercentage || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ease-out ${completionPercentage === 100 ? 'bg-emerald-400' : 'bg-blue-500'}`}
                            style={{ width: `${completionPercentage || 0}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* --- FULL BLEED ACTION BAR (Ash/White minimal theme) --- */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-white">
    <Link 
        to={`/${organizationId}/projectdetails/${project._id}/${currentStagePath}`} 
        onClick={handleSetProjectId}
        className={`flex items-center justify-center gap-1.5 py-3 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors ${isStageLoading ? "pointer-events-none opacity-50" : ""}`}
    >
        {isStageLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-regular fa-eye opacity-80"></i>}
        View
    </Link>

    <button 
        onClick={onEdit}
        className="flex cursor-pointer items-center justify-center gap-1.5 py-3 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
    >
        <i className="fa-regular fa-pen-to-square opacity-70"></i> Edit
    </button>

    <button 
        onClick={onDelete}
        disabled={isDeleting}
        className="flex cursor-pointer items-center justify-center gap-1.5 py-3 text-[11px] font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50"
    >
        {isDeleting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fa-regular fa-trash-can opacity-80"></i>}
        Delete
    </button>
</div>
        </div>
    );
};

export default ProjectCard;