import React from "react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useDeleteAccounting } from "../../../apiList/Department Api/Accounting Api/accountingApi";
import { toast } from "../../../utils/toast";

interface Props {
    id: string,
    transactionNumber?: string | null;
    dept?: string;
    totalAmount: { amount: number, taxAmount: number };
    status?: string;
    onView: () => void;
}

const AccountingCard: React.FC<Props> = ({
    id,
    transactionNumber,
    dept,
    totalAmount,
    status,
    onView,
}) => {


    const { mutateAsync: deleteAccounting, isPending } = useDeleteAccounting();


    const handleDelete = async () => {
        try {
            await deleteAccounting({ id })
            toast({ title: "success", description: "Deleted Successfully" })
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete",
                variant: "destructive"
            });
        }
    }


    return (
        <Card className="w-full border-l-4 border-blue-600 shadow-md bg-white hover:shadow-lg">
            <CardContent className="p-4 space-y-2">
                <h3 className="text-base font-bold text-blue-700 mb-2">
                    {transactionNumber ?? "Transaction"}
                </h3>

                <p className="text-sm text-gray-600 capitalize">Department: <strong>{dept || "N/A"}</strong></p>
                <p className="text-sm text-gray-800">Amount: ₹ <strong> {totalAmount?.amount + totalAmount?.taxAmount || 0}</strong></p>
                <p className="text-sm text-gray-600 capitalize">Status: <strong>{status}</strong></p>

                <div className="flex justify-end gap-2 pt-2">
                    <Button size="sm" variant="secondary" onClick={onView}>
                        <i className="fas fa-eye mr-1" />
                        View
                    </Button>
                    <Button size="sm" isLoading={isPending} variant="danger" className="bg-red-600 text-white" onClick={handleDelete}>
                        <i className="fas fa-trash mr-1" />
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AccountingCard;