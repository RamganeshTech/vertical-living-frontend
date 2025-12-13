
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import type { SubContractSingleData } from "./SubContractMain";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

interface SubContractCardProps {
    data: SubContractSingleData;
    index: number;
    isDeleting: boolean;
    onDelete: () => void;
    onView: () => void;
}

const SubContractCard = ({ data, index, isDeleting, onDelete, onView }: SubContractCardProps) => {

    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.subcontract?.delete;



    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };


    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Prevents the click from "bubbling up" to the parent Card.
        onDelete();
    };



    return (
        <Card onClick={onView} className="border-l-4 border-blue-600 relative group cursor-pointer p-4 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
        >
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-500">#{index + 1}</span>
                            <Badge className={getStatusColor(data.status)}>
                                {data.status.toUpperCase()}
                            </Badge>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            <i className="fas fa-briefcase mr-2 text-blue-500"></i>
                            {data.workName}
                        </h3>
                        <p className="text-sm text-gray-600">
                            <i className="fas fa-user-hard-hat mr-1"></i>
                            {data.workerName}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-500">
                            <i className="fas fa-calendar-plus mr-1"></i>
                            Start:
                        </span>
                        <p className="font-medium">{formatDate(data.dateOfCommencement)}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">
                            <i className="fas fa-calendar-check mr-1"></i>
                            End:
                        </span>
                        <p className="font-medium">{formatDate(data.dateOfCompletion)}</p>
                    </div>
                </div>

                {/* Costs */}
                <div className="border-t pt-3">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                                <i className="fas fa-hammer mr-1"></i>
                                Labour Cost:
                            </span>
                            <span className="font-medium">₹ {data.labourCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                                <i className="fas fa-tools mr-1"></i>
                                Material Cost:
                            </span>
                            <span className="font-medium">₹ {data.materialCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t pt-2">
                            <span className="text-gray-700 font-semibold">
                                <i className="fas fa-rupee-sign mr-1"></i>
                                Total Cost:
                            </span>
                            <span className="font-bold text-blue-600">
                                ₹ {data.totalCost.toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Files Info */}
                <div className="flex justify-between text-xs text-gray-500 border-t pt-2">
                    <span>
                        <i className="fas fa-image mr-1"></i>
                        Before: {data.filesBeforeWork?.length || 0} files
                    </span>
                    <span>
                        <i className="fas fa-images mr-1"></i>
                        After: {data.filesAfterWork?.length || 0} files
                    </span>
                </div>
            </CardContent>

            <div>
                <div className="flex gap-2 w-full">
                    {/* <Button onClick={onView} variant="outline" size="sm" className="flex-1">
                        <i className="fas fa-eye mr-1"></i>
                        View
                    </Button> */}


                    {canDelete && <Button variant="danger"

                        className="absolute top-2 right-2 h-8 w-8 rounded-full
                           flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity
                           hover:!opacity-100 bg-red-600 text-white hover:text-white"
                        isLoading={isDeleting}
                        size="sm" onClick={handleDeleteClick}>
                        <i className="fas fa-trash"></i>
                    </Button>}
                </div>
            </div>
        </Card>
    );
};

export default SubContractCard;