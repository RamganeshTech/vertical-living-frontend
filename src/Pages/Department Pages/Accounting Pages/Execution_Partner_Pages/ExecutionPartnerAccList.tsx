import React from "react";
import { dateFormate } from "../../../../utils/dateFormator";
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
import type { ExecutionPartner } from "../../../../apiList/Department Api/Accounting Api/executionPartnerApi";

interface Props {
    partner: ExecutionPartner;
    index: number;
    onView: (id: string) => void;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}

const ExecutionPartnerAccList: React.FC<Props> = ({
    partner,
    index,
    onView,
    onDelete,
    isDeleting,
}) => {
    const displayName = partner?.firstName;





    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.stafftask?.delete;
    // const canList = role === "owner" || permission?.executionpartner?.list;
    // const canCreate = role === "owner" || permission?.executionpartner?.create
    // const canEdit = role === "owner" || permission?.executionpartner?.edit
    const canDelete = role === "owner" || permission?.executionpartner?.delete

    // const phone = partner.phone?.work || partner.phone?.mobile || null

    const workPhone = partner.phone?.work || null;
    const mobilePhone = partner.phone?.mobile || null;



    return (
        <div
            className="grid  cursor-pointer grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-[#f9fcff] items-center transition-colors last:border-b-0"
            onClick={() => onView(partner._id)}

        >
            {/* Serial No */}
            <div className="col-span-1 text-center text-gray-600 font-medium ">
                {index + 1}
            </div>

            {/* partner Name */}
            <div className="col-span-3 truncate font-medium text-gray-900 flex items-center gap-2">
                {displayName ?
                    <span className="!text-center w-full">{displayName}</span>
                    : "-"
                }
            </div>

            {/* companyName */}
            <div className="col-span-2 text-sm text-gray-700 truncate text-center">
                {/* <i className="fas fa-envelope text-gray-400 mr-2"></i> */}
                {partner.companyName ? partner.companyName : "-"}
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
                {dateFormate(partner.createdAt)}
            </div>

            {/* Actions */}
            <div className="col-span-2 flex justify-center gap-2">
                {/* <button
                    onClick={() => onView(partner._id)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                    title="View partner"
                >
                    <i className="fas fa-eye" />
                </button> */}
                {canDelete && <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(partner._id)
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                    disabled={isDeleting}
                    title="Delete partner"
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

export default ExecutionPartnerAccList;
