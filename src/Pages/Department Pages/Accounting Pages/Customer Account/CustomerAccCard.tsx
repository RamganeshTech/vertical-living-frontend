import type { Customer } from "../../../../apiList/Department Api/Accounting Api/customerAccountApi";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { dateFormate } from "../../../../utils/dateFormator";

// Customer Card Component
interface CustomerCardProps {
    customer: Customer;
    onView: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}

export const CustomerAccCard: React.FC<CustomerCardProps> = ({ customer, onView, onDelete, isDeleting }) => {
    const displayName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'N/A';

    return (
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-blue-600">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                            <i className={`fas ${customer.customerType === 'business' ? 'fa-building' : 'fa-user'} mr-2 text-blue-600`}></i>
                            {displayName}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                customer.customerType === 'business'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {customer.customerType === 'business' ? 'Business' : 'Individual'}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                                <i className="fas fa-calendar-alt mr-1"></i>
                                {dateFormate(customer.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                    
                        <div className="flex items-center text-sm text-gray-600">
                            <i className="fas fa-envelope w-5 mr-2 text-gray-400"></i>
                            <span className="truncate">{customer.email || "-"}</span>
                        </div>
                
                    
                        <div className="flex items-center text-sm text-gray-600">
                            <i className="fas fa-mobile-alt w-5 mr-2 text-gray-400"></i>
                            <span>{customer.phone.mobile || "-"}</span>
                        </div>
                    
                        <div className="flex items-center text-sm text-gray-600">
                            <i className="fas fa-phone w-5 mr-2 text-gray-400"></i>
                            <span>{customer.phone.work || "-"}</span>
                        </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                    <Button
                        onClick={onView}
                        variant="primary"
                        className="flex-1"
                    >
                        <i className="fas fa-eye mr-2"></i>
                        View
                    </Button>
                    <Button
                        onClick={onDelete}
                        variant="danger"
                        isLoading={isDeleting}
                        className="flex-1 bg-red-600 text-white "
                    >
                        
                                <i className="fas fa-trash mr-2"></i>
                                Delete
                           
                    </Button>
                </div>
            </div>
        </Card>
    );
};

