import React from 'react';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';
import { dateFormate, formatTime } from '../../../utils/dateFormator';

type Props = {
    item: any,
    index: number,
    handleView: (id: string) => any,
    handleDelete: (id: string) => any,
    deletePending: boolean
}

const PincodeProjectAssignmentRow: React.FC<Props> = ({
    item,
    index,
    handleView,
    handleDelete,
    deletePending
}) => {
    const { role, permission } = useAuthCheck();

    // Permission check specifically for the project assignment module
    const canDelete = role === "owner" || permission?.pincodeproject?.delete;

    // Helper to get color styles for Assignment Status
    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'accepted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div
            className="grid cursor-pointer grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-indigo-50/30 transition-colors items-center last:border-b-0"
            onClick={() => handleView(item._id as string)}
        >
            {/* S.No */}
            <div className="col-span-1 text-center text-gray-400 font-medium text-sm">
                {String(index + 1).padStart(2, '0')}
            </div>

            {/* Project Name (Human Readable) */}
            <div className="col-span-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                        <i className="fas fa-project-diagram text-xs"></i>
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="font-semibold text-gray-900 truncate">
                            {item.projectId?.projectName || 'Deleted Project'}
                        </span>
                        {/* <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                            ID: {item.projectId?._id?.slice(-6) || 'N/A'}
                        </span> */}
                    </div>
                </div>
            </div>

            {/* Vendor Company Name (Human Readable) */}
            <div className="col-span-3">
                <div className="flex items-center gap-2">
                    <i className="fas fa-store text-gray-400 text-sm"></i>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-700">
                            {item.partnerId?.companyName || 'Unknown Partner'}
                        </span>
                        <span className="text-xs text-gray-500">
                            {item.partnerId?.firstName || 'No Contact'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            <div className="col-span-2 text-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tight ${getStatusStyles(item.status)}`}>
                    {item.status}
                </span>
            </div>

            {/* Acknowledgement Date */}
            <div className="col-span-2 text-center">
                {item.createdAt ? (
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">
                            {dateFormate(new Date(item.createdAt))}
                        </span>
                        <span className="text-[10px] text-gray-400">
                            {formatTime(new Date(item.createdAt))}
                        </span>
                    </div>
                ) : (
                    <span className="text-xs italic text-gray-400">Waiting for Sign...</span>
                )}
            </div>

            {/* Actions */}
            <div className="col-span-1 flex justify-center gap-2">
                {canDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item._id as string);
                        }}
                        disabled={deletePending}
                        className="p-2 text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        title="Remove Assignment"
                    >
                        {deletePending ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-trash-alt text-xs"></i>}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PincodeProjectAssignmentRow;