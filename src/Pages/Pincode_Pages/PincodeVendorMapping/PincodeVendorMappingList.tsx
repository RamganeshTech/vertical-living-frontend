// import React from 'react';
// import { useAuthCheck } from '../../../Hooks/useAuthCheck';
// import { Badge } from '../../../components/ui/Badge';
// // import { useAuthCheck } from '../../Hooks/useAuthCheck';
// // import { Badge } from '../../components/ui/Badge';

// type Props = {
//     mapping: any;
//     index: number;
//     handleView: (id: string) => void;
//     handleDelete: (id: string) => void;
//     deletePending: boolean;
// };

// const PincodeVendorMappingList: React.FC<Props> = ({ mapping, index, handleView, handleDelete, deletePending }) => {
//     const { role, permission } = useAuthCheck();
//     const canDelete = role === "owner" || permission?.pincodeMapping?.delete;

//     return (
//         <div 
//             className="grid grid-cols-13 gap-4 px-6 py-5 hover:bg-blue-50/30 transition-all cursor-pointer items-center text-center group"
//             onClick={() => handleView(mapping._id)}
//         >
//             <div className="col-span-1 text-gray-400 font-bold text-xs">{index + 1}</div>

//             {/* Vendor Name & Category [cite: 287] */}
//             <div className="col-span-3 text-left">
//                 <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
//                     {mapping.vendorId?.companyName || 'Unknown Vendor'}
//                 </p>
//                 <p className="text-[10px] text-gray-400 uppercase font-medium">
//                     {mapping.vendorId?.vendorCategory || 'General'}
//                 </p>
//             </div>

//             {/* Pincode & Area [cite: 286] */}
//             <div className="col-span-2">
//                 <Badge variant="outline" className="font-bold text-blue-700 bg-blue-50 border-blue-100">
//                     {mapping.pincodeId?.pincode || 'N/A'}
//                 </Badge>
//                 <p className="text-[10px] text-gray-500 mt-1 truncate px-2">
//                     {mapping.pincodeId?.areaName || 'N/A'}
//                 </p>
//             </div>

//             {/* Role & Mode [cite: 288-289] */}
//             <div className="col-span-2 flex flex-col items-center gap-1.5">
//                 <span className={`px-3 py-0.5 rounded-full text-[9px] font-bold uppercase ${mapping.vendorRole === 'Primary' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
//                     {mapping.vendorRole} [cite: 289]
//                 </span>
//                 <span className="text-[10px] font-bold text-gray-400 italic">{mapping.serviceMode} Mode [cite: 288]</span>
//             </div>

//             {/* Commercials [cite: 296-298] */}
//             <div className="col-span-2">
//                 <div className="flex flex-col items-center">
//                     <p className="text-xs font-bold text-gray-700">₹{mapping.minOrderValue?.toLocaleString()} MOV [cite: 298]</p>
//                     <p className="text-[10px] text-orange-600 font-bold mt-1">
//                         <i className="fas fa-times mr-1"></i>{mapping.rateMultiplier}x Rate [cite: 296]
//                     </p>
//                 </div>
//             </div>

//             {/* SLAs [cite: 293-294] */}
//             <div className="col-span-2">
//                 <div className="flex justify-center gap-3">
//                     <div className="text-center" title="Site Visit SLA">
//                         <p className="text-[10px] font-bold text-gray-900">{mapping.siteVisitSlaDays}d [cite: 293]</p>
//                         <p className="text-[8px] text-gray-400 uppercase">Visit</p>
//                     </div>
//                     <div className="text-center" title="Installation SLA">
//                         <p className="text-[10px] font-bold text-gray-900">{mapping.installSlaDays}d [cite: 294]</p>
//                         <p className="text-[8px] text-gray-400 uppercase">Inst</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Actions */}
//             <div className="col-span-1 flex justify-center">
//                 {canDelete && (
//                     <button 
//                         onClick={(e) => { e.stopPropagation(); handleDelete(mapping._id); }}
//                         className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center disabled:opacity-30"
//                         disabled={deletePending}
//                     >
//                         {deletePending ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-trash-alt"></i>}
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PincodeVendorMappingList;


import React from 'react';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';
import { Badge } from '../../../components/ui/Badge';

type Props = {
    mapping: any;
    index: number;
    handleView: (id: string) => void;
    handleDelete: (id: string) => void;
    deletePending: boolean;
};

const PincodeVendorMappingList: React.FC<Props> = ({ mapping, index, handleView, handleDelete, deletePending }) => {
    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.pincodeMapping?.delete;

    return (
        <div 
            className="grid grid-cols-13 gap-4 px-6 py-5 hover:bg-blue-50/30 transition-all cursor-pointer items-center text-center group"
            onClick={() => handleView(mapping._id)}
        >
            {/* 1. Serial Number */}
            <div className="col-span-1 text-gray-400 font-bold text-xs">{index + 1}</div>

            {/* 2. Business Identity (Company Name) */}
            <div className="col-span-3 text-left pl-4">
                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {mapping.vendorId?.companyName || 'N/A'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        Active Partner
                    </p>
                </div>
            </div>

            {/* 3. Contact Person (FirstName) */}
            <div className="col-span-2 px-2">
                <div className="flex items-center text-gray-700">
                    {/* <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                        {mapping.vendorId?.firstName?.charAt(0) || 'V'}
                    </div> */}
                    <p className="text-xs font-bold  capitalize">
                        {mapping.vendorId?.firstName || 'Unknown'}
                    </p>
                </div>
            </div>

            {/* 4. Vendor Category */}
            <div className="col-span-2">
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold px-3 text-[9px] uppercase tracking-wider">
                    {mapping.vendorId?.vendorCategory || 'Not Assigned'}
                </Badge>
            </div>

            {/* 5. Service Area (Pincode & Locality) */}
            <div className="col-span-2">
                <p className="font-bold text-blue-600 text-sm">{mapping.pincodeId?.pincode || 'N/A'}</p>
                <p className="text-[10px] text-gray-500 font-medium capitalize truncate px-1">
                    {mapping.pincodeId?.areaName || 'N/A'}
                </p>
            </div>

            {/* 6. Regional District */}
            <div className="col-span-2">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">
                        {mapping.pincodeId?.district || 'General Area'}
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium">
                        {mapping.pincodeId?.state || 'Tamil Nadu'}
                    </span>
                </div>
            </div>

            {/* 7. Actions */}
            <div className="col-span-1 flex justify-right pr-4">
                {canDelete && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(mapping._id); }}
                        className="ml-auto w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center disabled:opacity-30"
                        disabled={deletePending}
                    >
                        {deletePending ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-trash-alt text-xs"></i>}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PincodeVendorMappingList;