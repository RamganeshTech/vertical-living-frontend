// pages/Expenses/ExpenseAccountsSingle.tsx

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExpenseAccForm from "./ExpenseAccForm";

const ExpenseAccountSingle: React.FC = () => {
    const navigate = useNavigate();
    const { id, organizationId } = useParams<{ id: string, organizationId:string }>();

    const [isEditing, setIsEditing] = useState<boolean>()

    const handleClose = () => {
        navigate(-1);
    };

    const handleEdit = ()=>{
        setIsEditing(p=> !p)
    }

    if (!id) {
        return <div>Expense ID not found</div>;
    }

    return (
        <div className="min-h-full max-h-full overflow-y-auto bg-gray-50 py-2">
            <div className="max-w-full mx-auto px-2">
                {/* Header with Edit Button */}
                <div className="mb-4 flex justify-between items-center">
                    {/* <button
                        onClick={handleClose}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Expenses
                    </button> */}
                    
                   
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <ExpenseAccForm
                        mode={isEditing ? "edit" : "view"}
                        organizationId={organizationId!}
                        expenseId={id}
                        isEditing={isEditing}
                        onEdit={handleEdit}
                        onCancel={handleClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExpenseAccountSingle;