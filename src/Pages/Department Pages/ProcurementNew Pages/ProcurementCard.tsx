// import React from "react";
// import { Card, CardContent } from "../../../components/ui/Card";
// import { Button } from "../../../components/ui/Button";
// import type { OrderMaterialShopDetails, OrderMaterialSiteDetail } from "./ProcurementNewMain";

// interface Props {
//   shopDetails: OrderMaterialShopDetails;
//   siteDetails: OrderMaterialSiteDetail;
//   totalCost: number;
//   onView: () => void;
//   onDelete: (e:any) => void;
//   refPdfId: string
//   deletePending: boolean
// }


// const ProcurementCard: React.FC<Props> = ({
//   shopDetails,
//   siteDetails,
//   totalCost,
//   onView,
//   onDelete,
//   refPdfId,
//   deletePending
// }) => {
//   return (
//     <Card onClick={onView} className="w-full cursor-pointer border-l-4 border-blue-600 shadow-sm">
//       <CardContent className="p-4 space-y-3">
//         {/* Header: PDF Reference ID */}
//         <div className="flex justify-between items-center">
//           <h3 className="text-base font-semibold text-blue-800 truncate">
//             Ref No:  {refPdfId ? refPdfId.replace(/-pdf$/, "") : "N/A"}
//           </h3>
//         </div>

//         {/* Main Info */}
//         <div className="space-y-1 text-sm">
//           <p>
//             <span className="font-medium text-gray-700">Shop:</span>{" "}
//             <span className="text-gray-900">{shopDetails?.shopName || "Shop Name"}</span>
//           </p>
//           <p>
//             <span className="font-medium text-gray-700">Delivery Site:</span>{" "}
//             <span className="text-gray-900">{siteDetails?.siteName || "Delivery Site Name"}</span>
//           </p>
//           <p>
//             <span className="font-medium text-gray-700">Total Cost:</span>{" "}
//             <span className="text-gray-900">₹ {totalCost || 0}</span>
//           </p>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-2 pt-3">
//           {/* <Button size="sm" variant="secondary" onClick={onView}>
//             <i className="fas fa-eye mr-1" />
//             View
//           </Button> */}
//           <Button size="sm" variant="danger" isLoading={deletePending} onClick={onDelete}
//            className='text-white bg-red-600'
//           >
//             <i className="fas fa-trash mr-1" />
//             Delete
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProcurementCard;




import React from "react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import type { OrderMaterialShopDetails } from "./ProcurementNewMain"; 

interface Props {
  procurementNumber: string | null;
  shopDetails: OrderMaterialShopDetails;
  totalCost: number;
  itemCount: number;
  
  // Context Data
  projectName?: string; // from projectId.projectName
  fromDeptName: string;
  fromDeptNumber: string | null;

  // Status Flags
  isConfirmedRate: boolean;
  isSyncWithPaymentsSection: boolean;

  // Actions
  onView: () => void;
  onDelete: (e: any) => void;
  deletePending: boolean;
}

const ProcurementCard: React.FC<Props> = ({
  procurementNumber,
  shopDetails,
  totalCost,
  itemCount,
  projectName,
  fromDeptName,
  fromDeptNumber,
  isConfirmedRate,
  isSyncWithPaymentsSection,
  onView,
  onDelete,
  deletePending,
}) => {

  // Logic: Border Color determines the "Health/Stage" of the card
  // Purple = Final Stage (Accounts), Green = Vendor Done, Blue = New/Pending
  const borderClass = isSyncWithPaymentsSection
    ? "border-purple-500 bg-purple-50/10"
    : isConfirmedRate
      ? "border-green-500 bg-green-50/10"
      : "border-blue-500 bg-white";

  return (
    <Card
      onClick={onView}
      className={`w-full cursor-pointer group hover:shadow-md transition-all duration-200 border-l-[5px] ${borderClass} shadow-sm overflow-hidden bg-white`}
    >
      <CardContent className="p-0">
        
        {/* --- TOP ROW: NUMBER & STATUS --- */}
        <div className="p-3 flex justify-between items-start border-b border-gray-50 pb-2">
          {/* Procurement Number (Prominent) */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Procurement No</span>
            <h3 className="text-lg font-bold text-gray-800 font-mono tracking-tight leading-none group-hover:text-blue-600 transition-colors">
              {procurementNumber || "N/A"}
            </h3>
          </div>

          {/* Status Badges Stack */}
          <div className="flex flex-col items-end gap-1.5">
            {/* 1. Account Sync Status */}
            {isSyncWithPaymentsSection ? (
               <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-700 uppercase tracking-wide border border-purple-200">
                  <i className="fas fa-file-invoice-dollar text-[8px]"></i> In Payment
               </span>
            ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wide">
                  <i className="fas fa-hourglass-start text-[8px]"></i> Pre-Payment
                </span>
            )}

            {/* 2. Vendor Rate Status */}
            {isConfirmedRate ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600">
                   <i className="fas fa-check-circle"></i> Rates Added
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-500">
                   <i className="fas fa-exclamation-circle"></i> Rates Pending
                </span>
            )}
          </div>
        </div>

        {/* --- MIDDLE ROW: CONTEXT INFO --- */}
        <div className="px-3 py-2 space-y-1.5 grid grid-cols-2">
            
            {/* Project Name */}
            <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-4 flex justify-center"><i className="fas fa-folder text-gray-400 text-[10px]"></i></div>
                <span className="font-semibold truncate w-full" title={projectName}>
                    {projectName || "Unknown Project"}
                </span>
            </div>

            {/* From Dept / Number */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 flex justify-center"><i className="fas fa-share-alt text-gray-400 text-[10px]"></i></div>
                <span className="truncate">
                    From <span className="font-medium">{fromDeptName}</span> 
                    {fromDeptNumber && <span className="font-mono ml-1 text-gray-600">#{fromDeptNumber}</span>}
                </span>
            </div>

            {/* Vendor / Shop Person */}
            {shopDetails?.contactPerson && <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-4 flex justify-center"><i className="fas fa-user-tie text-blue-400 text-[10px]"></i></div>
                <span className="font-medium truncate text-blue-700">
                    {shopDetails?.contactPerson || "Vendor Unassigned"}
                </span>
            </div>}

            {
              shopDetails?.shopName && <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-4 flex justify-center"><i className="fas fa-shop text-blue-400 text-[10px]"></i></div>
                <span className="font-medium truncate text-blue-700">
                    {shopDetails?.shopName || "Vendor Unassigned"}
                </span>
            </div>
            }

        </div>

        {/* --- BOTTOM ROW: STATS & ACTION --- */}
        <div className="mt-1 bg-gray-50 px-3 py-2 border-t border-gray-100 flex items-center justify-between">
            
            <div className="flex gap-4">
                 {/* Item Count */}
                 <div className="flex flex-col leading-none">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Items</span>
                    <span className="text-xs font-bold text-gray-700">{itemCount}</span>
                </div>

                {/* Total Cost */}
                <div className="flex flex-col leading-none border-l border-gray-200 pl-4">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Total</span>
                    <span className="text-xs font-bold text-blue-700">
                        {totalCost > 0 ? `₹ ${totalCost.toLocaleString()}` : "-"}
                    </span>
                </div>
            </div>

            {/* Delete Button */}
            <Button
                size="sm"
                variant="ghost"
                isLoading={deletePending}
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(e);
                }}
                className="h-7 w-7 p-0 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
            >
                <i className="fas fa-trash-alt text-xs" />
            </Button>

        </div>
      </CardContent>
    </Card>
  );
};

export default ProcurementCard;