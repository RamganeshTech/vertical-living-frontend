import React from "react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import type { OrderMaterialShopDetails, OrderMaterialSiteDetail } from "./ProcurementNewMain";

interface Props {
  shopDetails: OrderMaterialShopDetails;
  siteDetails: OrderMaterialSiteDetail;
  totalCost: number;
  onView: () => void;
  onDelete: (e:any) => void;
  refPdfId: string
  deletePending: boolean
}


const ProcurementCard: React.FC<Props> = ({
  shopDetails,
  siteDetails,
  totalCost,
  onView,
  onDelete,
  refPdfId,
  deletePending
}) => {
  return (
    <Card onClick={onView} className="w-full cursor-pointer border-l-4 border-blue-600 shadow-sm">
      <CardContent className="p-4 space-y-3">
        {/* Header: PDF Reference ID */}
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-blue-800 truncate">
            Ref No:  {refPdfId ? refPdfId.replace(/-pdf$/, "") : "N/A"}
          </h3>
        </div>

        {/* Main Info */}
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium text-gray-700">Shop:</span>{" "}
            <span className="text-gray-900">{shopDetails?.shopName || "Shop Name"}</span>
          </p>
          <p>
            <span className="font-medium text-gray-700">Delivery Site:</span>{" "}
            <span className="text-gray-900">{siteDetails?.siteName || "Delivery Site Name"}</span>
          </p>
          <p>
            <span className="font-medium text-gray-700">Total Cost:</span>{" "}
            <span className="text-gray-900">₹ {totalCost || 0}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-3">
          {/* <Button size="sm" variant="secondary" onClick={onView}>
            <i className="fas fa-eye mr-1" />
            View
          </Button> */}
          <Button size="sm" variant="danger" isLoading={deletePending} onClick={onDelete}
           className='text-white bg-red-600'
          >
            <i className="fas fa-trash mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcurementCard;