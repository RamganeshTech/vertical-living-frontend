import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetRazorpay, useSaveRazorpay, useDeleteRazorpay } from "../../apiList/razorPayApi";
import { toast } from "../../utils/toast";

const RazorpayConfig = () => {
    const { organizationId } = useParams<{ organizationId: string }>();

    const [isEditing, setIsEditing] = useState(false);
    const [showSecrets, setShowSecrets] = useState({
        razorpayKeySecret: false,
        razorpayXKeySecret: false,
        razorpayXAccountNumber: false
    });

    const [formData, setFormData] = useState({
        razorpayKeyId: "",
        razorpayKeySecret: "",
        razorpayXKeyId: "",
        razorpayXKeySecret: "",
        razorpayXAccountNumber: ""
    });

    // Fetch existing config
    const { data: config, isLoading, refetch } = useGetRazorpay(organizationId!);

    // Save mutation
    const { mutate: saveConfig, isPending: isSaving } = useSaveRazorpay();

    // Delete mutation
    const { mutate: deleteConfig, isPending: isDeleting } = useDeleteRazorpay();

    const handleEdit = () => {
        if (config) {
            setFormData({
                razorpayKeyId: config.razorpayKeyId || "",
                razorpayKeySecret: "",
                razorpayXKeyId: config.razorpayXKeyId || "",
                razorpayXKeySecret: "",
                razorpayXAccountNumber: ""
            });
        }
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!formData.razorpayKeyId || !formData.razorpayKeySecret) {
            toast({
                title: "Error",
                description: "Razorpay Key ID and Secret are required",
                variant: "destructive"
            });
            return;
        }

        saveConfig(
            {
                organizationId: organizationId!,
                payload: formData
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Success",
                        description: "Razorpay configuration saved successfully"
                    });
                    setIsEditing(false);
                    refetch();
                },
                onError: (error: any) => {
                    toast({
                        title: "Error",
                        description: error.message || "Failed to save configuration",
                        variant: "destructive"
                    });
                }
            }
        );
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete Razorpay configuration?")) {
            deleteConfig(
                { organizationId: organizationId! },
                {
                    onSuccess: () => {
                        toast({
                            title: "Success",
                            description: "Razorpay configuration deleted successfully"
                        });
                        refetch();
                        setFormData({
                            razorpayKeyId: "",
                            razorpayKeySecret: "",
                            razorpayXKeyId: "",
                            razorpayXKeySecret: "",
                            razorpayXAccountNumber: ""
                        });
                    },
                    onError: (error: any) => {
                        toast({
                            title: "Error",
                            description: error.message || "Failed to delete configuration",
                            variant: "destructive"
                        });
                    }
                }
            );
        }
    };

    const toggleSecretVisibility = (field: keyof typeof showSecrets) => {
        setShowSecrets(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <i className="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <i className="fas fa-credit-card text-2xl text-blue-600"></i>
                        <h2 className="text-2xl font-bold text-gray-800">Razorpay Configuration</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing && config && (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <i className="fas fa-edit"></i>
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    <i className={`fas ${isDeleting ? 'fa-spinner fa-spin' : 'fa-trash'}`}></i>
                                    Delete
                                </button>
                            </>
                        )}
                        {isEditing && (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    <i className={`fas ${isSaving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <i className="fas fa-times"></i>
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Razorpay Payment Gateway */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="fas fa-money-check-alt text-blue-600"></i>
                            Payment Gateway (Required)
                        </h3>

                        {/* Key ID */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Razorpay Key ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={isEditing ? formData.razorpayKeyId : config?.razorpayKeyId || ""}
                                onChange={(e) => setFormData({ ...formData, razorpayKeyId: e.target.value })}
                                disabled={!isEditing}
                                placeholder="rzp_live_xxxxxxxxxxxxx"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Key Secret */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Razorpay Key Secret <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showSecrets.razorpayKeySecret ? "text" : "password"}
                                    value={isEditing ? formData.razorpayKeySecret : (config?.razorpayKeySecret || "")}
                                    onChange={(e) => setFormData({ ...formData, razorpayKeySecret: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder={isEditing ? "Enter secret key" : "********"}
                                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleSecretVisibility('razorpayKeySecret')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <i className={`fas ${showSecrets.razorpayKeySecret ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RazorpayX Payout */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="fas fa-exchange-alt text-green-600"></i>
                            RazorpayX Payout (Optional)
                        </h3>

                        {/* X Key ID */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                RazorpayX Key ID
                            </label>
                            <input
                                type="text"
                                value={isEditing ? formData.razorpayXKeyId : config?.razorpayXKeyId || ""}
                                onChange={(e) => setFormData({ ...formData, razorpayXKeyId: e.target.value })}
                                disabled={!isEditing}
                                placeholder="rzp_live_xxxxxxxxxxxxx"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* X Key Secret */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                RazorpayX Key Secret
                            </label>
                            <div className="relative">
                                <input
                                    type={showSecrets.razorpayXKeySecret ? "text" : "password"}
                                    value={isEditing ? formData.razorpayXKeySecret : (config?.razorpayXKeySecret || "")}
                                    onChange={(e) => setFormData({ ...formData, razorpayXKeySecret: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder={isEditing ? "Enter secret key" : "********"}
                                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleSecretVisibility('razorpayXKeySecret')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <i className={`fas ${showSecrets.razorpayXKeySecret ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Account Number */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                RazorpayX Account Number
                            </label>
                            <div className="relative">
                                <input
                                    type={showSecrets.razorpayXAccountNumber ? "text" : "password"}
                                    value={isEditing ? formData.razorpayXAccountNumber : (config?.razorpayXAccountNumber || "")}
                                    onChange={(e) => setFormData({ ...formData, razorpayXAccountNumber: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder={isEditing ? "Enter account number" : "********"}
                                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleSecretVisibility('razorpayXAccountNumber')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <i className={`fas ${showSecrets.razorpayXAccountNumber ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    {!config && !isEditing && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <i className="fas fa-info-circle text-blue-600 text-xl mt-0.5"></i>
                                <div>
                                    <p className="text-sm text-blue-800 font-medium mb-2">
                                        No Razorpay configuration found
                                    </p>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        <i className="fas fa-plus"></i>
                                        Add Configuration
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Help Text */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <i className="fas fa-exclamation-triangle text-yellow-600 text-xl mt-0.5"></i>
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium mb-2">Important Security Notes:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Keep your API keys secure and never share them publicly</li>
                                    <li>Use separate keys for test and live modes</li>
                                    <li>RazorpayX is required only if you want to make payouts</li>
                                    <li>Get your keys from <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">Razorpay Dashboard</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RazorpayConfig;