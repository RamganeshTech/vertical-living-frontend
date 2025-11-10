import React from 'react'
import { dateFormate } from '../../../../utils/dateFormator'
import type { CreateSalesOrderPayload } from './CreateSalerOrderAcc'
type Props = {
    salesData: CreateSalesOrderPayload,
    index: number,
    handleView: (id: string) => any,
    handleDelete: (id: string) => any,
    deleteSalesMutation: any
}
const SalesOrderAccList: React.FC<Props> = ({ salesData, index, handleView, handleDelete, deleteSalesMutation }) => {
    return (
        <div
            className="grid cursor-pointer grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-[#f9fcff] transition-colors items-center last:border-b-0"
            onClick={() => handleView((salesData as any)._id)}
        >
            {/* S.No */}
            <div className="col-span-1 text-center text-gray-600 font-medium">
                {index + 1}
            </div>

            {/* Customer Name */}
            <div className="col-span-3">
                <div className="flex items-center gap-2">
                    <i className="fas fa-user text-blue-600 text-sm"></i>
                    <span className="font-medium text-gray-900 truncate">
                        {salesData.customerName || 'N/A'}
                    </span>
                </div>
            </div>

            {/* salesData Number */}
            <div className="col-span-2">
                <span className="fas fa-calendar-alt text-gray-400 mr-2">
                    {dateFormate(salesData.salesOrderDate) || 'N/A'}
                </span>
            </div>

            {/* Created At */}
            <div className="col-span-2 text-gray-600 text-sm">
                <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
                {dateFormate((salesData as any).createdAt)}
            </div>

            {/* Grand Total */}
            <div className="col-span-2 font-semibold text-green-600">
                ₹{salesData.grandTotal?.toFixed(2) || '0.00'}
            </div>

            {/* Items Count */}
            <div className="col-span-1 text-center">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {salesData.items?.length || 0}
                </span>
            </div>

            {/* Actions */}
            <div className="col-span-1 flex justify-center gap-2">
                {/* <button
                    onClick={() => handleView(salesData._id)}
                    className="p-2 cursor-pointer text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="View salesData"
                >
                    <i className="fas fa-eye"></i>
                </button> */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDelete((salesData as any)._id)
                    }}
                    disabled={deleteSalesMutation.isPending}
                    className="p-2 cursor-pointer text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete salesData"
                >
                    {deleteSalesMutation.isPending ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <i className="fas fa-trash"></i>
                    )}
                </button>
            </div>
        </div>
    )
}

export default SalesOrderAccList