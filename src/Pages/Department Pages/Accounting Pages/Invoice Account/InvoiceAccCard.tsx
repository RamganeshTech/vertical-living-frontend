// InvoiceAccCard.tsx
import React from 'react';
import { dateFormate } from '../../../../utils/dateFormator';
import { Button } from '../../../../components/ui/Button';

interface InvoiceAccCardProps {
    invoice: any;
    onView: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}

const InvoiceAccCard: React.FC<InvoiceAccCardProps> = ({ invoice, onView, onDelete, isDeleting }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const formatDate = (date: string | Date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = () => {
        const today = new Date();
        const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;

        if (!dueDate) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">No Due Date</span>;
        }

        if (dueDate < today) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-200 text-red-700">Overdue</span>;
        }

        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilDue <= 7) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-700">Due Soon</span>;
        }

        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-700">Active</span>;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {invoice.invoiceNumber || 'N/A'}
                            </h3>
                            {getStatusBadge()}
                        </div>
                        <p className="text-sm text-gray-600">
                            <i className="fas fa-user mr-1"></i>
                            {invoice.customerName || 'N/A'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(invoice.grandTotal)}
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">
                            <i className="fas fa-calendar-alt mr-1"></i>
                            Invoice Date
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                            {formatDate(invoice.invoiceDate)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">
                            <i className="fas fa-calendar-check mr-1"></i>
                            Due Date
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                            {formatDate(invoice.dueDate)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">
                            <i className="fas fa-receipt mr-1"></i>
                            Items
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                            {invoice.items?.length || 0} items
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">
                            <i className="fas fa-hashtag mr-1"></i>
                            Order Number
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                            {invoice.orderNumber || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Financial Details */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
                    </div>
                    {invoice.discountAmount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                Discount ({invoice.discountPercentage}%):
                            </span>
                            <span className="font-medium text-green-600">
                                -{formatCurrency(invoice.discountAmount)}
                            </span>
                        </div>
                    )}
                    {invoice.taxAmount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                Tax ({invoice.taxPercentage}%):
                            </span>
                            <span className="font-medium text-gray-900">
                                {formatCurrency(invoice.taxAmount)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Additional Info */}
                {(invoice.subject || invoice.salesPerson) && (
                    <div className="space-y-2 mb-4">
                        {invoice.subject && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Subject:</p>
                                <p className="text-sm text-gray-900 line-clamp-2">{invoice.subject}</p>
                            </div>
                        )}
                        {invoice.salesPerson && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">
                                    <i className="fas fa-user-tie mr-1"></i>
                                    Sales Person:
                                </p>
                                <p className="text-sm text-gray-900">{invoice.salesPerson}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-gray-400">
                        <i className="fas fa-clock mr-1"></i>
                        Created {dateFormate(invoice.createdAt)}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            onClick={onView}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <i className="fas fa-eye"></i>
                            View
                        </Button>
                        <Button
                            onClick={onDelete}
                            isLoading={isDeleting}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"

                        >
                            <i className="fas fa-trash mr-2"></i>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceAccCard;