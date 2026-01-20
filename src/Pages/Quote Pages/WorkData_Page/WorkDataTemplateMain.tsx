import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';

export interface TemplateField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea';
    options?: string[]; // Only for select type
    readOnly?: boolean;
    gridSpan?: number; // Optional: for layout control
}

export interface WorkSection {
    section: string;
    fields: TemplateField[];
}

export interface WorkModule {
    work: string;
    template: WorkSection[];
}

export const WORK_TEMPLATE: WorkModule[] = [
    {
        work: "glass",
        template: [
            {
                section: "A. Basic Details",
                fields: [
                    { name: "areaName", label: "Area / Zone Name", type: "text" },
                    { name: "floorLevel", label: "Floor Level", type: "select", options: ["GF", "FF", "SF", "TF"] },
                    { name: "purpose", label: "Partition Purpose", type: "select", options: ["Cabin", "Meeting Room", "Corridor", "Reception"] }
                ]
            },
            {
                section: "B. Glass Partition System",
                fields: [
                    { name: "partitionType", label: "Partition Type", type: "select", options: ["Framed", "Frameless", "Spider", "Slim Profile"] },
                    { name: "mountingType", label: "Mounting Type", type: "select", options: ["Floor-to-Ceiling", "Floor-to-Beam", "Wall-to-Wall"] }
                ]
            },
            {
                section: "C. Dimensions",
                fields: [
                    { name: "height", label: "Height (ft)", type: "number" },
                    { name: "width", label: "Width (ft)", type: "number" },
                    { name: "panels", label: "No. of Panels", type: "number" },
                    { name: "deduction", label: "Deduction (sqft)", type: "number" }
                ]
            },
            {
                section: "D. Glass Specifications",
                fields: [
                    { name: "glassType", label: "Glass Type", type: "select", options: ["Clear", "Frosted", "Tinted", "Reflective"] },
                    { name: "thickness", label: "Glass Thickness", type: "select", options: ["10mm", "12mm", "15mm", "19mm"] },
                    { name: "edgeFinish", label: "Edge Finish", type: "select", options: ["Polished", "Flat", "Beveled"] }
                ]
            },
            {
                section: "E. Joints & Hardware",
                fields: [
                    { name: "jointType", label: "Joint Type", type: "text", },
                    { name: "hardwareSet", label: "Hardware Set", type: "select", options: ["Yes", "No"] },
                    { name: "doorIncluded", label: "Door Included?", type: "select", options: ["Yes", "No"] }
                ]
            },
            {
                section: "F. Optional Enhancements",
                fields: [
                    { name: "blindsRequired", label: "Blinds Required", type: "select", options: ["Yes", "No"] },
                    { name: "acousticRequirement", label: "Acoustic Requirement", type: "select", options: ["Yes", "No"] },
                    { name: "fireRating", label: "Fire Rating", type: "select", options: ["None", "30 mins", "60 mins", "120 mins"] },
                    { name: "remarks", label: "Remarks", type: "textarea", gridSpan: 3 }
                ]
            }
        ]
    }
];

// const WorkDataTemplateMain = () => {
//     const navigate = useNavigate();


//     const isSubPage = location.pathname.includes("single");
//     if (isSubPage) return <Outlet />;

//     return (
//         <div className="p-8 bg-slate-50 min-h-screen">
//             <div className="max-w-6xl mx-auto">
//                 <header className="mb-8">
//                     <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//                         <i className="fas fa-layer-group text-blue-600"></i>
//                         Work Specification Templates
//                     </h1>
//                     <p className="text-gray-500 text-sm mt-1">Select a template to view or manage technical data structures.</p>
//                 </header>

//                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//                     <table className="w-full text-left border-collapse">
//                         <thead className="bg-gray-50 border-b border-gray-200">
//                             <tr>
//                                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-20">S.No</th>
//                                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Work Type</th>
//                                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Sections</th>
//                                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {WORK_TEMPLATE.map((item, index) => (
//                                 <tr
//                                     key={item.work}
//                                     className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
//                                     onClick={() => navigate(`single/${item.work}`)}
//                                 >
//                                     <td className="px-6 py-4 text-sm font-medium text-gray-500">{index + 1}</td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center gap-3">
//                                             <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
//                                                 <i className={`fas ${item.work === 'glass' ? 'fa-window-maximize' : 'fa-box'}`}></i>
//                                             </div>
//                                             <span className="font-bold text-gray-800 capitalize">{item.work} Work</span>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 text-center">
//                                         <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
//                                             {item.template.length} Sections
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 text-right">
//                                         <button className="text-blue-600 font-bold text-sm group-hover:underline">
//                                             View Template <i className="fas fa-chevron-right ml-1"></i>
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default WorkDataTemplateMain;


const WorkDataTemplateMain = () => {
    const navigate = useNavigate();

    const { role, permission } = useAuthCheck();
    const canList = role === "owner" || permission?.worktemplates?.list;
    // const canCreate = role === "owner" || permission?.worktemplates?.create;
    // const canDelete = role === "owner" || permission?.worktemplates?.delete;
    // const canEdit = role === "owner" || permission?.worktemplates?.edit;




    const isSubPage = location.pathname.includes("single");
    if (isSubPage) return <Outlet />;

    return (
        <div className="p-2 h-full flex flex-col gap-4 bg-white">
            {/* Header Section */}
            <header className="flex justify-between items-center pb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-layer-group mr-3 text-blue-600"></i>
                        Work Data Templates
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Manage technical specification structures and asset data templates
                    </p>
                </div>
            </header>

            {/* Table Container */}
            {canList && <div
                className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto custom-scrollbar flex flex-col"
            >
                <div className="sticky top-0 z-10 bg-white border-b border-blue-200 shadow-sm">
                    <div className="grid grid-cols-13 gap-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                        <div className="col-span-1 text-center">S.No</div>
                        <div className="col-span-3">Template Category</div>
                        <div className="col-span-4">Internal Description</div>
                        <div className="col-span-2 text-center">Sections</div>
                        <div className="col-span-2 text-center">Total Fields</div>
                        <div className="col-span-1 text-center">Action</div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {WORK_TEMPLATE.map((item, index) => (
                        <WorkDataTemplateList
                            key={item.work}
                            data={item}
                            index={index}
                            onView={() => navigate(`single/${item.work}`)}
                        />
                    ))}
                </div>
            </div>}
        </div>
    );
};

export default WorkDataTemplateMain;




interface Props {
    data: any; // WorkModule type
    index: number;
    onView: () => void;
}

const WorkDataTemplateList: React.FC<Props> = ({ data, index, onView }) => {

    // Calculate total fields across all sections
    const totalFields = data.template.reduce((acc: number, sec: any) => acc + sec.fields.length, 0);

    // Icon Logic based on Work Category
    const getWorkIcon = (work: string) => {
        switch (work?.toLowerCase()) {
            case 'glass': return 'fa-window-maximize text-blue-500';
            case 'plywood': return 'fa-box text-amber-600';
            case 'flooring': return 'fa-square text-emerald-500';
            default: return 'fa-shapes text-gray-400';
        }
    };

    return (
        <div
            onClick={onView}
            className="grid grid-cols-13 border-b border-gray-300 gap-4 px-6 py-4 hover:bg-blue-50/30 transition-colors cursor-pointer items-center"
        >
            {/* 1. Index */}
            <div className="col-span-1 text-center text-gray-400 font-medium text-sm">
                {index + 1}
            </div>

            {/* 2. Work Category Name */}
            <div className="col-span-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                        <i className={`fas ${getWorkIcon(data.work)} text-sm`}></i>
                    </div>
                    <span className="font-bold text-gray-800 capitalize text-sm">
                        {data.work} Work
                    </span>
                </div>
            </div>

            {/* 3. Description (Dynamic Placeholder) */}
            <div className="col-span-4">
                <span className="text-xs text-gray-500 italic">
                    Standard protocol for {data.work} specifications...
                </span>
            </div>

            {/* 4. Section Count Tag */}
            <div className="col-span-2 text-center">
                <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase tracking-tighter">
                    {data.template.length} Sections
                </span>
            </div>

            {/* 5. Field Count Tag */}
            <div className="col-span-2 text-center">
                <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 uppercase tracking-tighter">
                    {totalFields} Parameters
                </span>
            </div>

            {/* 6. Status Badge */}
            {/* <div className="col-span-1">
                <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase border bg-green-100 text-green-700 border-green-200 tracking-widest">
                    Active
                </span>
            </div> */}

            {/* 7. Action Chevron */}
            <div className="col-span-1 text-center">
                <button className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors">
                    <i className="fas fa-chevron-right text-xs"></i>
                </button>
            </div>
        </div>
    );
};


