import { Button } from '../../../components/ui/Button'
import { useOrderHistorySendToBillModule } from '../../../apiList/Stage Api/orderMaterialHistoryApi';
import { toast } from '../../../utils/toast';

const SendToBillSection = ({ ele, projectId, organizationId, refetch }: any) => {

    const { mutateAsync: createBill, isPending: isCreating } = useOrderHistorySendToBillModule();
    
    const handleSendToProcurement = async (orderItemId: string,) => {
        try {
            await createBill({ projectId: projectId!,  orderItemId: orderItemId!, organizationId: organizationId! });
            toast({ description: 'Sent to Procurement', title: "Success" });
            refetch?.()
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to create bill", variant: "destructive" })
        }
    };

    return (
        <Button
            variant="secondary"
            onClick={() => handleSendToProcurement(ele._id)}
            disabled={ele?.isSyncWithBill}
            title={ele?.isSyncWithBill ? "bill already created" : ""}

            isLoading={isCreating}
            // className="border-green-300 text-blue-700 disabled:cursor-not-allowed hover:bg-blue-100 hover:border-blue-400"
            // className={`${ele.isSyncWithBill ? " text-gray-400 !cursor-not-allowed": ""}`}
        >
            Create Bill
        </Button>
    )
}

export default SendToBillSection