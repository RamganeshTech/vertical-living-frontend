import React from "react";
import { dateFormate } from "../../../../utils/dateFormator";
import type { Vendor } from "../../../../apiList/Department Api/Accounting Api/vendorAccApi";

interface Props {
    vendor: Vendor;
    index: number;
    onView: (id: string) => void;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}

const VendorAccList: React.FC<Props> = ({
    vendor,
    index,
    onView,
    onDelete,
    isDeleting,
}) => {
    const displayName = vendor?.firstName;

    // const phone = vendor.phone?.work || vendor.phone?.mobile || null

    const workPhone = vendor.phone?.work || null;
    const mobilePhone = vendor.phone?.mobile || null;



    return (
        <div
            className="grid  cursor-pointer grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-[#f9fcff] items-center transition-colors last:border-b-0"
            onClick={() => onView(vendor._id)}

        >
            {/* Serial No */}
            <div className="col-span-1 text-center text-gray-600 font-medium ">
                {index + 1}
            </div>

            {/* vendor Name */}
            <div className="col-span-3 truncate font-medium text-gray-900 flex items-center gap-2">
                {displayName ?
                    <span className="!text-center w-full">{displayName}</span>
                    : "-"
                }
            </div>

            {/* companyName */}
            <div className="col-span-2 text-sm text-gray-700 truncate text-center">
                {/* <i className="fas fa-envelope text-gray-400 mr-2"></i> */}
                {vendor.companyName ? vendor.companyName : "-"}
            </div>

            {/* Phone */}
            {/* <div className="col-span-2 text-sm text-gray-700 truncate text-center">
                <i className="fas fa-phone text-gray-400 mr-2"></i>
                {phone ? phone : "-"}
            </div> */}

            <div className="col-span-2 text-sm text-gray-700 flex flex-col items-center gap-1">

                {/* Work Phone */}
                {workPhone && (
                    <div className="flex items-center gap-2">
                        <i className="fas fa-phone text-gray-400"></i>
                        <span>{workPhone}</span>
                    </div>
                )}

                {/* Mobile Phone */}
                {mobilePhone && (
                    <div className="flex items-center gap-2">
                        <i className="fas fa-mobile-alt text-gray-400"></i>
                        <span>{mobilePhone}</span>
                    </div>
                )}

                {/* If nothing exists */}
                {!workPhone && !mobilePhone && <span>-</span>}
            </div>


            {/* Created At */}
            <div className="col-span-2 text-sm text-gray-600 whitespace-nowrap text-center">
                <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
                {dateFormate(vendor.createdAt)}
            </div>

            {/* Actions */}
            <div className="col-span-2 flex justify-center gap-2">
                {/* <button
                    onClick={() => onView(vendor._id)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                    title="View vendor"
                >
                    <i className="fas fa-eye" />
                </button> */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(vendor._id)
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                    disabled={isDeleting}
                    title="Delete vendor"
                >
                    {isDeleting ? (
                        <i className="fas fa-spinner fa-spin" />
                    ) : (
                        <i className="fas fa-trash" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default VendorAccList;