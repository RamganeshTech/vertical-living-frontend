import React from 'react'
import { dateFormate } from '../../../../utils/dateFormator'
import type { CreatePurchasePayload } from './CreatePurchaseAcc'
type Props = {
    purchase: CreatePurchasePayload,
    index: number,
    handleView: (id: string) => any,
    handleDelete: (id: string) => any,
    deletePending:boolean
}
const PurchaseAccList: React.FC<Props> = ({ purchase, index, handleView, handleDelete, deletePending }) => {
    return (
        <div
            className="grid cursor-pointer grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-[#f9fcff] transition-colors items-center last:border-b-0"
            onClick={() => handleView(purchase._id!)}
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
                        {purchase.vendorName || 'N/A'}
                    </span>
                </div>
            </div>

            {/* purchaseOrderNumber Number */}
            <div className="col-span-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {purchase.purchaseOrderNumber || 'N/A'}
                </span>
            </div>


              <div className="col-span-2 text-gray-600 text-sm">
                <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
                {dateFormate(purchase.purchaseDate!)}
            </div>

            {/* Created At */}
            <div className="col-span-2 text-gray-600 text-sm">
                <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
                {dateFormate(purchase.createdAt!)}
            </div>

            {/* Grand Total or total amount */}
            <div className="col-span-2 font-semibold text-green-600">
                {/* ₹{purchase.grandTotal?.toFixed(2) || '0.00'} */}
                ₹{purchase.totalAmount?.toFixed(2) || '0.00'}
            </div>

            {/* Items Count */}
            <div className="col-span-1 text-center">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {purchase.items?.length || 0}
                </span>
            </div>

            {/* Actions */}
            <div className="col-span-1 flex justify-center gap-2">
                {/* <button
                    onClick={() => handleView(purchase._id!)}
                    className="p-2 cursor-pointer text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="View Purchase Order"
                >
                    <i className="fas fa-eye"></i>
                </button> */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(purchase._id!)
                    }}
                    disabled={deletePending}
                    className="p-2 cursor-pointer text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Purchase Order"
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

export default PurchaseAccList