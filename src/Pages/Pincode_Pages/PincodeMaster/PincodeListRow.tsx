import React from 'react';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';
import { Badge } from '../../../components/ui/Badge';
// import { useAuthCheck } from '../../../../Hooks/useAuthCheck'; // Adjust path
// import { dateFormate } from '../../../../utils/dateFormator'; // Adjust path
// import type { IPincodeMaster } from '../models/PincodeMasterModel'; // Adjust path

type Props = {
    pincodeItem: any,
    index: number,
    handleView: (id: string) => any,
    handleDelete: (id: string) => any,
    deletePending: boolean
}

const PincodeListRow: React.FC<Props> = ({
    pincodeItem,
    index,
    handleView,
    handleDelete,
    deletePending
}) => {
    const { role, permission } = useAuthCheck();

    // Permission check for Pincode module
    const canDelete = role === "owner" || permission?.pincode?.delete;

    // Helper to get color for Service Status [cite: 34-41]
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Restricted': return 'bg-orange-100 text-orange-700';
            case 'Blocked': return 'bg-red-100 text-red-700';
            case 'Approval Required': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Helper to get color for Risk Level [cite: 136, 351]
    // const getRiskIcon = (level: string) => {
    //     if (level === 'High') return 'text-red-500';
    //     if (level === 'Medium') return 'text-orange-500';
    //     return 'text-blue-500';
    // };

    return (
        <div
            className="grid cursor-pointer grid-cols-13 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-[#f9fcff] transition-colors items-center last:border-b-0"
            onClick={() => handleView(pincodeItem._id as string)}
        >
            {/* S.No */}
            <div className="col-span-1 text-center text-gray-600 font-medium">
                {index + 1}
            </div>

            {/* Pincode & Area [cite: 79-80] */}
            <div className="col-span-2 ">
                <div className="flex flex-col items-center">
                    <span className="font-bold text-blue-600 tracking-wide">
                        {pincodeItem.pincode}
                    </span>
                    <span className="text-xs text-gray-400">
                        {pincodeItem.state || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Area & Locality Name [cite: 80-81] */}
            <div className="col-span-3">
                <div className="flex items-center justify-center gap-2">
                    <i className="fas fa-map-marker-alt text-blue-500 text-sm"></i>
                    <div className="flex flex-col truncate">
                        <span className="font-medium text-gray-900 truncate">
                            {pincodeItem.areaName || 'N/A'}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                            {pincodeItem.localityName || 'No Locality'}
                        </span>
                    </div>
                </div>
            </div>


            <div className="col-span-2 text-center">
                <span className={` py-1 rounded-full text-[11px] font-bold`}>
                    <Badge variant='default'>{pincodeItem?.district}</Badge>
                </span>
            </div>


            {/* Service Mode  */}
            <div className="col-span-2 text-center">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">
                        {pincodeItem.serviceMode}
                    </span>
                    <span className="text-[10px] uppercase tracking-tighter text-gray-400">
                        {pincodeItem.urbanClassification || 'Urban'} [cite: 87]
                    </span>
                </div>
            </div>

            {/* Service Status Badge [cite: 95] */}
            <div className="col-span-2 text-center">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusStyles(pincodeItem.serviceStatus)}`}>
                    {pincodeItem.serviceStatus}
                </span>
            </div>

            {/* Risk Level [cite: 136] */}
            {/* <div className="col-span-1 text-center">
                <div className="flex flex-col items-center" title={`Risk Level: ${pincodeItem.riskLevel}`}>
                    <i className={`fas fa-exclamation-triangle ${getRiskIcon(pincodeItem.riskLevel)}`}></i>
                    <span className="text-[10px] text-gray-400">{pincodeItem.riskLevel}</span>
                </div>
            </div> */}

            {/* Actions */}
            <div className="col-span-1 flex justify-center gap-2">
                {canDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(pincodeItem._id as string);
                        }}
                        disabled={deletePending}
                        className="p-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Pincode Record"
                    >
                        {deletePending ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fas fa-trash-alt"></i>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PincodeListRow;