import React from "react";
import type { Customer } from "../../../../apiList/Department Api/Accounting Api/customerAccountApi";
import { dateFormate } from "../../../../utils/dateFormator";
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";

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
    const displayName = customer.firstName;




    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.stafftask?.delete;
    // const canList = role === "owner" || permission?.customer?.list;
    // const canCreate = role === "owner" || permission?.customer?.create
    // const canEdit = role === "owner" || permission?.customer?.edit
    const canDelete = role === "owner" || permission?.customer?.delete

    // const phone = customer.phone?.work || customer.phone?.mobile || null


    const workPhone = customer?.phone?.work || null;
    const mobilePhone = customer?.phone?.mobile || null;


    // const customerTypeLabel =
    //     customer.customerType === "business" ? "Business" : "Individual";

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
            <div className="col-span-3 text-center truncate font-medium text-gray-900 flex items-center gap-2">
                {displayName ?
                    <span className=" block mx-auto">{displayName}</span>
                    : "-"
                }
            </div>

            {/* Customer Type */}
            {/* <div className="col-span-2 text-center">
                <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${customer.customerType === "business"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                        }`}
                >
                    {customerTypeLabel}
                </span>
            </div> */}

            <div className="col-span-2 text-sm text-gray-700 truncate text-center">
                {/* <i className="fas fa-envelope text-gray-400 mr-2"></i> */}
                {customer.companyName ? customer.companyName : "-"}
            </div>


            {/* Email */}
            <div className="col-span-2 text-sm text-gray-700 truncate text-center">
                {/* <i className="fas fa-envelope text-gray-400 mr-2"></i> */}
                {customer.email ? customer.email : "-"}
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
                {canDelete && <button
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
                </button>}
            </div>
        </div>
    );
};

export default CustomerAccList;