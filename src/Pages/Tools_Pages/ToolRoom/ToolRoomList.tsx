import React from 'react';
import { Button } from '../../../components/ui/Button';

interface Props {
    data: any;
    index: number;
    onView: () => void;
    onDelete: (id: string) => void;
    deletePending:boolean
}

const ToolRoomList: React.FC<Props> = ({ data, index, onView, onDelete, deletePending }) => {

    // Status Badge Style
    const getStatusStyle = (isActive: boolean) => {
        return isActive
            ? 'bg-green-100 text-green-700 border-green-200'
            : 'bg-red-100 text-red-700 border-red-200';
    };

    return (
        <div
            onClick={onView}
            className="grid grid-cols-13 gap-4 px-6 py-4 hover:bg-blue-50/40 transition-colors cursor-pointer items-center group"
        >
            {/* 1. Index */}
            <div className="col-span-1 text-center text-gray-400 font-mono text-xs">
                {String(index + 1).padStart(2, '0')}
            </div>

            {/* 2. Room Name & System ID */}
            <div className="col-span-3">
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                        {data.toolRoomName}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase">
                        ID: {data._id.slice(-6)}
                    </span>
                </div>
            </div>

            {/* 3. Location */}
            <div className="col-span-3">
                <div className="flex items-center gap-2 text-gray-600">
                    <i className="fas fa-map-marker-alt text-gray-300 text-xs"></i>
                    <span className="text-sm truncate">{data.location || 'Not Specified'}</span>
                </div>
            </div>

            {/* 4. In-Charge User (Dynamic Ref) */}
            <div className="col-span-2">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-700">
                        {data.inchargeUser?.name || data.inchargeUser?.staffName || 'Unassigned'}
                    </span>
                    <span className="text-[9px] text-blue-500 font-bold uppercase tracking-tighter">
                        {data.inchargeModel?.replace('Model', '')}
                    </span>
                </div>
            </div>

            {/* 5. Issue Timings */}
            <div className="col-span-2 text-center">
                <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2 py-1 rounded text-[11px] font-medium text-gray-500">
                    <i className="far fa-clock text-[10px]"></i>
                    {data.allowedIssueFrom || '00:00'} - {data.allowedIssueTo || '00:00'}
                </div>
            </div>

            {/* 6. Status & Action */}
            <div className="col-span-1 flex items-center justify-center gap-4">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${getStatusStyle(data.isActive)}`}>
                    {data.isActive ? 'Active' : 'Closed'}
                </span>
            </div>


            <div className="col-span-1 flex justify-center items-center gap-4">

                <Button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(data._id!)
                    }}
                    isLoading={deletePending}
                    className="bg-red-600 hover:bg-red-600 p-2 cursor-pointer  rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete"
                    size="sm"
                >

                    <i className="fas fa-trash"></i>
                </Button>

                <i className="fas fa-chevron-right text-[10px] text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"></i>

            </div>
        </div>
    );
};

export default ToolRoomList;