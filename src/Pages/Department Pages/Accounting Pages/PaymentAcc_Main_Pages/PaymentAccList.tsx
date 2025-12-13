import React from 'react';
import { dateFormate } from '../../../../utils/dateFormator'; // Adjust path if needed
import { useAuthCheck } from '../../../../Hooks/useAuthCheck';
// You can import the interface from your model file or use 'any' if strict typing isn't ready
// import { IPaymentMainAcc } from '../../path/to/model'; 

type Props = {
    payment: any; // Replace 'any' with IPaymentMainAcc when available
    index: number;
    handleView: (id: string) => any;
    handleDelete: (id: string) => any;
    deletePending: boolean;
};

const PaymentAccList: React.FC<Props> = ({ payment, index, handleView, handleDelete, deletePending }) => {

    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.payments?.delete;
    // Helper for status colors
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'failed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div
            className="grid cursor-pointer grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-[#f9fcff] transition-colors items-center last:border-b-0"
            onClick={() => handleView(payment._id)}
        >
            {/* 1. S.No */}
            <div className="col-span-1 text-center text-gray-500 font-medium text-sm">
                {index + 1}
            </div>

            {/* 2. Payee Name & Source */}
            <div className="col-span-3">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <i className={`fas ${payment.fromSection === 'expense' ? 'fa-receipt' : 'fa-user'} text-blue-500 text-sm`}></i>
                        <span className="font-semibold text-gray-900 truncate" title={payment.paymentPersonName}>
                            {payment.paymentPersonName || 'Unknown Payee'}
                        </span>
                    </div>
                    {/* Source Tag (Bill vs Expense) */}
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide ml-6 mt-0.5">
                        {payment.fromSection || 'Direct'}
                    </span>
                </div>
            </div>

            {/* 3. Payment Number */}
            <div className="col-span-2">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-xs font-medium tracking-wide">
                    {payment.paymentNumber || 'N/A'}
                </span>
            </div>

            {/* 4. Payment Date */}
            <div className="col-span-2 text-gray-600 text-sm flex items-center">
                <i className="far fa-calendar-alt text-gray-400 mr-2"></i>
                {dateFormate(payment?.dueDate)}
            </div>

            {/* 5. Amount (Right Aligned) */}
            <div className="col-span-2 text-right font-bold text-gray-800">
                ₹{payment.grandTotal?.toLocaleString("en-IN") || '0.00'}
            </div>

            {/* 6. Status */}
            <div className="col-span-1 text-center">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(payment.generalStatus)}`}>
                    {payment.generalStatus || 'Pending'}
                </span>
            </div>

            {/* 7. Actions */}
            <div className="col-span-1 flex justify-center items-center gap-2">
                {canDelete && <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(payment._id);
                    }}
                    disabled={deletePending}
                    className="group p-2 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Record"
                >
                    {deletePending ? (
                        <i className="fas fa-spinner fa-spin text-red-500 text-sm"></i>
                    ) : (
                        <i className="far fa-trash-alt text-gray-400 group-hover:text-red-500 transition-colors text-sm"></i>
                    )}
                </button>}
            </div>
        </div>
    );
};

export default PaymentAccList;