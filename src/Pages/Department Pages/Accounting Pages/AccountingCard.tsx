// import React from "react";
// import { Card, CardContent } from "../../../components/ui/Card";
// import { Button } from "../../../components/ui/Button";
// import { useDeleteAccounting } from "../../../apiList/Department Api/Accounting Api/accountingApi";
// import { toast } from "../../../utils/toast";

// interface Props {
//     id: string,
//     transactionNumber?: string | null;
//     dept?: string;
//     totalAmount: { amount: number, taxAmount: number };
//     status?: string;
//     onView: () => void;
// }

// const AccountingCard: React.FC<Props> = ({
//     id,
//     transactionNumber,
//     dept,
//     totalAmount,
//     status,
//     onView,
// }) => {


//     const { mutateAsync: deleteAccounting, isPending } = useDeleteAccounting();


//     const handleDelete = async () => {
//         try {
//             await deleteAccounting({ id })
//             toast({ title: "success", description: "Deleted Successfully" })
//         }
//         catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message || "Failed to delete",
//                 variant: "destructive"
//             });
//         }
//     }


//     const totalAmt = totalAmount?.amount + totalAmount?.taxAmount || 0
//     return (
//         <Card className="w-full border-l-4 border-blue-600 shadow-md bg-white hover:shadow-lg">
//             <CardContent className="p-4 space-y-2">
//                 <h3 className="text-base font-bold text-blue-700 mb-2">
//                     {transactionNumber ?? "Transaction"}
//                 </h3>

//                 <p className="text-sm text-gray-600 capitalize">Department: <strong>{dept || "N/A"}</strong></p>
//                 <p className="text-sm text-gray-800">Amount: ₹ <strong> {totalAmt.toLocaleString("en-in")}</strong></p>
//                 <p className="text-sm text-gray-600 capitalize">Status: <strong>{status}</strong></p>

//                 <div className="flex justify-end gap-2 pt-2">
//                     <Button size="sm" variant="secondary" onClick={onView}>
//                         <i className="fas fa-eye mr-1" />
//                         View
//                     </Button>
//                     <Button size="sm" isLoading={isPending} variant="danger" className="bg-red-600 text-white" onClick={handleDelete}>
//                         <i className="fas fa-trash mr-1" />
//                         Delete
//                     </Button>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export default AccountingCard;




import React from 'react';
import { dateFormate } from '../../../utils/dateFormator';
// import { dateFormate } from '../../../../utils/dateFormator'; // Adjust path

interface Props {
    data: any;
    index: number;
    onView: () => void;
}

const AccountingAccList: React.FC<Props> = ({ data, index, onView }) => {
    
    // Status Badge Logic
    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    // Icon Logic based on Dept/Source
    const getSourceIcon = (type: string) => {
        switch(type) {
            case 'Bill Acc': return 'fa-file-invoice text-purple-500';
            case 'Expense Acc': return 'fa-receipt text-pink-500';
            case 'Payment Acc': return 'fa-money-check-alt text-green-500';
            default: return 'fa-file-alt text-gray-400';
        }
    };

    return (
        <div 
            onClick={onView}
            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-blue-50/30 transition-colors cursor-pointer items-center"
        >
            {/* 1. Index */}
            <div className="col-span-1 text-center text-gray-400 font-medium text-sm">
                {index + 1}
            </div>

            {/* 2. Record Number */}
            <div className="col-span-2">
                <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                    {data.recordNumber || 'N/A'}
                </span>
            </div>

            {/* 3. Payee / Source Info */}
            <div className="col-span-3">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 truncate text-sm" title={data.personName}>
                        {data.personName || 'Unknown Payee'}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                        <i className={`fas ${getSourceIcon(data.type)} text-[10px]`}></i>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                            {data.type}
                        </span>
                    </div>
                </div>
            </div>

            {/* 4. Date */}
            <div className="col-span-2 text-sm text-gray-600">
                {dateFormate(data.createdAt)}
            </div>

            {/* 5. Amount */}
            <div className="col-span-2 text-right font-bold text-gray-800 text-sm">
                ₹{data.amount?.toLocaleString('en-IN') || '0.00'}
            </div>

            {/* 6. Status */}
            <div className="col-span-1 text-center">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(data.status)}`}>
                    {data.status || 'Pending'}
                </span>
            </div>

            {/* 7. Action */}
            <div className="col-span-1 text-center">
                <button className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors">
                    <i className="fas fa-chevron-right text-xs"></i>
                </button>
            </div>
        </div>
    );
};

export default AccountingAccList;