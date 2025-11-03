// pages/Expenses/CreateExpense.tsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExpenseForm from "./ExpenseAccForm";

const CreateExpense: React.FC = () => {
    const navigate = useNavigate();
    const {organizationId} = useParams();
    // const handleSuccess = () => {
    //     navigate("/expensemain"); // Redirect to expenses list
    // };

    const handleCancel = () => {
        navigate("/expensemain");
    };

    return (
        <div className="min-h-full bg-gray-50 py-2">
            <div className="max-w-full mx-auto px-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <ExpenseForm
                        mode="create"
                        organizationId={organizationId!}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateExpense;