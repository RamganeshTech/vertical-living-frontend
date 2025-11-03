import React from "react";
import type { Customer } from "../../../../apiList/Department Api/Accounting Api/customerAccountApi";
import { dateFormate } from "../../../../utils/dateFormator";

interface Props {
    customer: Customer;
    index: number;
    onView: (id: string) => void;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}

const CustomerAccList: React.FC<Props> = ({
    customer,
    index,
    onView,
    onDelete,
    isDeleting,
}) => {
    const displayName = customer.firstName || customer.lastName ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() : null;

    const phone = customer.phone?.work || customer.phone?.mobile || null

    const customerTypeLabel =
        customer.customerType === "business" ? "Business" : "Individual";

    return (
        <div
            className="grid cursor-pointer grid-cols-14 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-[#f9fcff] items-center transition-colors last:border-b-0"
            onClick={() => onView(customer._id)}

        >
            {/* Serial No */}
            <div className="col-span-1 text-center text-gray-600 font-medium">
                {index + 1}
            </div>

            {/* Customer Name */}
            <div className="col-span-3 truncate font-medium text-gray-900 flex items-center gap-2">
                {displayName ?
                    <span>{displayName}</span>
                    : "-"
                }
            </div>

            {/* Customer Type */}
            <div className="col-span-2 text-center">
                <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${customer.customerType === "business"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                        }`}
                >
                    {customerTypeLabel}
                </span>
            </div>

            {/* Email */}
            <div className="col-span-2 text-sm text-gray-700 truncate text-center">
                {/* <i className="fas fa-envelope text-gray-400 mr-2"></i> */}
                {customer.email ? customer.email : "-"}
            </div>

            {/* Phone */}
            <div className="col-span-2 text-sm text-gray-700 truncate text-center">
                {/* <i className="fas fa-phone text-gray-400 mr-2"></i> */}
                {phone ? phone : "-"}
            </div>

            {/* Created At */}
            <div className="col-span-2 text-sm text-gray-600 whitespace-nowrap">
                <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
                {dateFormate(customer.createdAt)}
            </div>

            {/* Actions */}
            <div className="col-span-2 flex justify-center gap-2">
                {/* <button
                    onClick={() => onView(customer._id)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                    title="View Customer"
                >
                    <i className="fas fa-eye" />
                </button> */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(customer._id)
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                    disabled={isDeleting}
                    title="Delete Customer"
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

export default CustomerAccList;