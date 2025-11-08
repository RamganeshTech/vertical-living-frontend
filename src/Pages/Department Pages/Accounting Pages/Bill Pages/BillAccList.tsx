import React from 'react'
import { dateFormate } from '../../../../utils/dateFormator'
import type { CreateBillPayload } from './CreateBillAcc'
type Props = {
    bill: CreateBillPayload,
    index: number,
    handleView: (id: string) => any,
    handleDelete: (id: string) => any,
    deletePending:boolean
}
const BillAccList: React.FC<Props> = ({ bill, index, handleView, handleDelete, deletePending }) => {
    return (
        <div
            className="grid cursor-pointer grid-cols-14 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-[#f9fcff] transition-colors items-center last:border-b-0"
            onClick={() => handleView(bill._id!)}
        >
            {/* S.No */}
            <div className="col-span-1 text-center text-gray-600 font-medium">
                {index + 1}
            </div>

            {/* Vendor Name */}
            <div className="col-span-3">
                <div className="flex items-center gap-2">
                    <i className="fas fa-user text-blue-600 text-sm"></i>
                    <span className="font-medium text-gray-900 truncate">
                        {bill.vendorName || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Bill Number */}
            <div className="col-span-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {bill.billNumber || 'N/A'}
                </span>
            </div>

            {/* Created At */}
            <div className="col-span-2 text-gray-600 text-sm">
                <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
                {dateFormate(bill.createdAt!)}
            </div>

                <div className="col-span-2 text-gray-600 text-sm">
                <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
                {dateFormate(bill.billDate!)}
            </div>

            {/* Grand Total */}
            <div className="col-span-2 font-semibold text-green-600">
                ₹{bill.grandTotal?.toFixed(2) || '0.00'}
            </div>

            {/* Items Count */}
            <div className="col-span-1 text-center">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {bill.items?.length || 0}
                </span>
            </div>

            {/* Actions */}
            <div className="col-span-1 flex justify-center gap-2">
                {/* <button
                    onClick={() => handleView(bill._id!)}
                    className="p-2 cursor-pointer text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="View Bill"
                >
                    <i className="fas fa-eye"></i>
                </button> */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(bill._id!)
                    }}
                    disabled={deletePending}
                    className="p-2 cursor-pointer text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Bill"
                >
                    {deletePending ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <i className="fas fa-trash"></i>
                    )}
                </button>
            </div>
        </div>
    )
}

export default BillAccList