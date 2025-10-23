import React from 'react'
import { dateFormate } from '../../../../utils/dateFormator'
type Props = {
    invoice: any,
    index: number,
    handleView: (id:string) => any,
    handleDelete: (id:string) => any,
    deleteInvoiceMutation: any
}
const InvoiceAccList:React.FC<Props> = ({ invoice, index, handleView, handleDelete, deleteInvoiceMutation }) => {
    return (
        <div
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-blue-50 transition-colors items-center last:border-b-0"
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
                        {invoice.customerName || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Invoice Number */}
            <div className="col-span-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {invoice.invoiceNumber || 'N/A'}
                </span>
            </div>

            {/* Created At */}
            <div className="col-span-2 text-gray-600 text-sm">
                <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
                {dateFormate(invoice.createdAt)}
            </div>

            {/* Grand Total */}
            <div className="col-span-2 font-semibold text-green-600">
                ₹{invoice.grandTotal?.toFixed(2) || '0.00'}
            </div>

            {/* Items Count */}
            <div className="col-span-1 text-center">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {invoice.items?.length || 0}
                </span>
            </div>

            {/* Actions */}
            <div className="col-span-1 flex justify-center gap-2">
                <button
                    onClick={() => handleView(invoice._id)}
                    className="p-2 cursor-pointer text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="View Invoice"
                >
                    <i className="fas fa-eye"></i>
                </button>
                <button
                    onClick={() => handleDelete(invoice._id)}
                    disabled={deleteInvoiceMutation.isPending}
                    className="p-2 cursor-pointer text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Invoice"
                >
                    {deleteInvoiceMutation.isPending ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <i className="fas fa-trash"></i>
                    )}
                </button>
            </div>
        </div>
    )
}

export default InvoiceAccList