// pages/Expenses/ExpenseAccountsSingle.tsx

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExpenseForm from "./ExpenseAccForm";

const ExpenseAccountSingle: React.FC = () => {
    const navigate = useNavigate();
    const { id, organizationId } = useParams<{ id: string, organizationId:string }>();

    const [isEditing, setIsEditing] = useState<boolean>()

    const handleClose = () => {
        navigate("/expensemain");
    };

    const handleEdit = ()=>{
        setIsEditing(p=> !p)
    }

    if (!id) {
        return <div>Expense ID not found</div>;
    }

    return (
        <div className="min-h-full bg-gray-50 py-2">
            <div className="max-w-full mx-auto px-2">
                {/* Header with Edit Button */}
                <div className="mb-4 flex justify-between items-center">
                    <button
                        onClick={handleClose}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Expenses
                    </button>
                    
                    <button
                        onClick={handleEdit}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                            transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {isEditing ? "Cancel": "Edit"} Expense
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <ExpenseForm
                        mode={isEditing ? "edit" : "view"}
                        organizationId={organizationId!}
                        expenseId={id}
                        onCancel={handleClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExpenseAccountSingle;