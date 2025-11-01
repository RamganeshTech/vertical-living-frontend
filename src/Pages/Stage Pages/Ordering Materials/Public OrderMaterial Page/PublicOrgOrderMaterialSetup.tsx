import React, { useEffect, useState } from "react";
import { Input } from "../../../../components/ui/Input";
import { Label } from "../../../../components/ui/Label";
import { Separator } from "../../../../components/ui/Seperator";
import { Button } from "../../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export const LOCAL_KEY = "orgId";

const PublicOrgOrderMaterialSetup = () => {
    const navigate = useNavigate();
    const [organizationId, setOrganizationId] = useState<number | null | string>(null);
    const [isSaved, setIsSaved] = useState(false);

    // Load saved data if exists
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_KEY);
        if (saved) {
            const parsedValue = JSON.parse(saved);
            setOrganizationId(parsedValue);
            setIsSaved(true);
        }
    }, []);

    // Update local state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setOrganizationId(value);
    };

    // Save to localStorage
    const handleSave = () => {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(organizationId));
        setIsSaved(true);
        navigate(`/${organizationId}/ordermaterial`)
    };

    // Reset / delete key
    // const handleReset = () => {
    //     if (!confirm("Are you sure you want to reset?")) return;
    //     localStorage.removeItem(LOCAL_KEY);
    //     setOrganizationId(null);
    //     setIsSaved(false);
    // };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <i className="fas fa-arrow-left w-5 h-5" />
                            <span className="text-sm font-medium">Back</span>
                        </button>
                        <Separator orientation="vertical" className="h-6" />
                        <h1 className="text-2xl font-bold text-gray-900">
                            Vertical Living
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white">
                            Organization Setup
                        </h2>
                        <p className="text-blue-100 mt-1 text-sm">
                            Configure your organization to start ordering materials
                        </p>
                    </div>

                    {/* Card Body */}
                    <div className="p-8">
                        <div className="space-y-6">
                            <div>
                                <Label 
                                    htmlFor="organizationID" 
                                    className="text-gray-700 font-medium mb-2 block"
                                >
                                    Organization ID
                                </Label>
                                <Input
                                    id="organizationID"
                                    name="organizationID"
                                    placeholder="Enter your Organization ID"
                                    value={organizationId || ""}
                                    onChange={handleChange}
                                    className="text-lg"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Enter the unique ID provided by your organization
                                </p>
                            </div>

                            <Separator className="my-6" />

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleSave}
                                    variant="primary"
                                    className="flex-1 py-3 text-base font-medium"
                                    disabled={!organizationId}
                                >
                                    {isSaved ? "Update Configuration" : "Save Configuration"}
                                </Button>

                                {/* {isSaved && (
                                    <Button
                                        onClick={handleReset}
                                        variant="danger"
                                        className="px-6 py-3 text-base font-medium"
                                    >
                                        Reset
                                    </Button>
                                )} */}
                            </div>

                            {/* Success Message */}
                            {isSaved && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="w-5 h-5 text-green-600 mt-0.5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-green-800">
                                            Configuration Saved
                                        </h3>
                                        <p className="text-sm text-green-700 mt-1">
                                            Your organization settings have been saved successfully.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                        <svg
                            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div className="text-sm text-blue-800">
                            <p className="font-medium">Need help?</p>
                            <p className="mt-1">
                                Contact your organization administrator to get your Organization ID if you don't have it.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PublicOrgOrderMaterialSetup;
