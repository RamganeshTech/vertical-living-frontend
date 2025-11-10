// src/components/Department/Accounting/ExpenseAccounts/ExpenseList.tsx

import React from 'react';
import { dateFormate } from '../../../../utils/dateFormator';

interface ExpenseAccListProps {
    expense: {
        _id: string;
        invoiceNumber: string;
        vendorName: string;
        amount: number;
        dateOfPayment: Date;
        paidThrough: string;
        notes: string | null;
        createdAt: Date;
    };
    index: number;
    onView: () => void;
    // onEdit: () => void;
    onDelete: (e: any) => void;
    isDeleting: boolean;
}

const ExpenseList: React.FC<ExpenseAccListProps> = ({
    expense,
    index,
    onView,
    // onEdit,
    onDelete,
    isDeleting
}) => {
    return (
        <div onClick={onView} className="grid  cursor-pointer grid-cols-16 gap-4 px-6 py-4 border-b border-gray-100  hover:bg-[#f9fcff] transition-colors items-center">
            {/* S.No */}
            <div className="col-span-1 text-center text-sm font-medium text-gray-600">
                {index + 1}
            </div>

            {/* Invoice Number */}
            <div className="col-span-2 text-center">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-mono font-semibold">
                    {expense.invoiceNumber}
                </span>
            </div>

            {/* Vendor Name */}
            <div className="col-span-3 text-center">
                <p className="font-medium text-gray-900">{expense.vendorName}</p>
            </div>

            {/* Amount */}
            <div className="col-span-2 text-center">
                <span className="text-lg font-bold text-green-600">
                    ₹{expense.amount.toLocaleString()}
                </span>
            </div>

            {/* Payment Date */}
            <div className="col-span-2 text-center text-sm text-gray-600">
                {/* {new Date(expense.dateOfPayment).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })} */}
                <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>

                {dateFormate(expense.dateOfPayment)}
            </div>

            {/* Paid Through */}
            <div className="col-span-2 text-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                    {expense.paidThrough ?
                        <>
                            <i className="fas fa-credit-card mr-1"></i>
                            {expense.paidThrough}
                        </> : "-"}
                </span>
            </div>

            {/* Created At */}
            <div className="col-span-2 text-center text-sm text-gray-500">
                {/* {new Date(expense.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })} */}
                <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>

                {dateFormate(expense.createdAt)}

            </div>

            {/* Actions */}
            <div className="col-span-2 flex justify-center gap-2">

                <button
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Expense"
                >
                    <i className={`fas ${isDeleting ? 'fa-spinner fa-spin' : 'fa-trash'}`}></i>
                </button>
            </div>
        </div>
    );
};

export default ExpenseList;