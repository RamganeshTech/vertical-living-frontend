import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetShopLib, useUpdateShopLib } from "../../../../apiList/Stage Api/shopLibDetailApi";
import { toast } from "../../../../utils/toast";
import { Button } from "../../../../components/ui/Button";
// import { useGetShopLib, useUpdateShopLib } from "../../api/shopLibApi";
// import toast from "react-hot-toast";

interface ShopFormData {
    shopName: string;
    address: string;
    contactPerson: string;
    phoneNumber: string;
}

const ShopDetailSingle: React.FC = () => {
    const { shopId } = useParams<{ shopId: string }>();
    const { organizationId } = useParams() as { organizationId: string }

    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<ShopFormData>({
        shopName: "",
        address: "",
        contactPerson: "",
        phoneNumber: "",
    });

    const { data: shops, isLoading, error } = useGetShopLib(organizationId);
    const updateShopMutation = useUpdateShopLib();

    // Find the current shop
    const currentShop = shops?.find((shop: any) => shop._id === shopId);

    useEffect(() => {
        if (currentShop) {
            setFormData({
                shopName: currentShop.shopName || "",
                address: currentShop.address || "",
                contactPerson: currentShop.contactPerson || "",
                phoneNumber: currentShop.phoneNumber || "",
            });
        }
    }, [currentShop]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateShop = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!formData.shopName.trim()) {
                toast({
                    title: "Validation Error",
                    description: "Shop name is required",
                    variant: "destructive"
                });
                return;
            }

            const updateData = {
                id: shopId!,
                shopData: {
                    shopName: formData.shopName,
                    address: formData.address,
                    contactPerson: formData.contactPerson,
                    phoneNumber: formData.phoneNumber,
                }
            };

            await updateShopMutation.mutateAsync(updateData);

            toast({
                title: "Success",
                description: "Shop updated successfully"
            });

            setIsEditMode(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update shop",
                variant: "destructive"
            });
        }
    };

    // const handleUpdateField = async (field: string, value: string) => {
    //     try {
    //         if (!currentShop) return;

    //         const updatedData = {
    //             id: shopId!,
    //             shopData: {
    //                 shopName: field === 'shopName' ? value : currentShop.shopName,
    //                 address: field === 'address' ? value : currentShop.address,
    //                 contactPerson: field === 'contactPerson' ? value : currentShop.contactPerson,
    //                 phoneNumber: field === 'phoneNumber' ? value : currentShop.phoneNumber,
    //             }
    //         };

    //         await updateShopMutation.mutateAsync(updatedData);

    //         toast({
    //             title: "Success",
    //             description: `${field} updated successfully`
    //         });
    //     } catch (error: any) {
    //         toast({
    //             title: "Error",
    //             description: error?.response?.data?.message || `Failed to update ${field}`,
    //             variant: "destructive"
    //         });
    //     }
    // };


    const handleCopyDetails = async () => {
        try {
            const details = `Shop: ${currentShop.shopName}\nAddress: ${currentShop.address || 'N/A'}\nContact: ${currentShop.contactPerson || 'N/A'}\nPhone: ${currentShop.phoneNumber || 'N/A'}`;
            await navigator.clipboard.writeText(details);

            toast({
                title: "Success",
                description: "Shop details copied to clipboard"
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to copy details",
                variant: "destructive"
            });
        }
    };


    const handleNavigateBack = () => {
        try {
            navigate(-1);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to navigate back",
                variant: "destructive"
            });
        }
    };


    const handleCancel = () => {
        if (currentShop) {
            setFormData({
                shopName: currentShop.shopName || "",
                address: currentShop.address || "",
                contactPerson: currentShop.contactPerson || "",
                phoneNumber: currentShop.phoneNumber || "",
            });
        }
        setIsEditMode(false);
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
                    <p className="text-gray-600">Loading shop details...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error || !currentShop) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                    <p className="text-gray-600 mb-4">
                        {error ? "Failed to load shop details" : "Shop not found"}
                    </p>
                    <button
                        onClick={handleNavigateBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <i className="fas fa-arrow-left text-gray-600"></i>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full  bg-gray-50 p-2">
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleNavigateBack}
                                className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <i className="fas fa-arrow-left text-gray-600"></i>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {isEditMode ? "Edit Shop Details" : "Shop Details"}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {isEditMode ? "Update shop information" : "View and manage shop information"}
                                </p>
                            </div>
                        </div>

                        {!isEditMode && (
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="px-4 cursor-pointer py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                <i className="fas fa-edit"></i>
                                <span>Edit Shop</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Shop Details Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {!isEditMode ? (
                        // View Mode
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 block mb-1">
                                            <i className="fas fa-store mr-2"></i>
                                            Shop Name
                                        </label>
                                        <p className="text-lg font-medium text-gray-800">
                                            {currentShop.shopName || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500 block mb-1">
                                            <i className="fas fa-user mr-2"></i>
                                            Contact Person
                                        </label>
                                        <p className="text-lg text-gray-800">
                                            {currentShop.contactPerson || "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 block mb-1">
                                            <i className="fas fa-phone mr-2"></i>
                                            Phone Number
                                        </label>
                                        <p className="text-lg text-gray-800">
                                            {currentShop.phoneNumber || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500 block mb-1">
                                            <i className="fas fa-map-marker-alt mr-2"></i>
                                            Address
                                        </label>
                                        <p className="text-lg text-gray-800">
                                            {currentShop.address || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            {/* <div className="pt-6 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                                    <div>
                                        <i className="fas fa-calendar-alt mr-2"></i>
                                        Created: {new Date(currentShop.createdAt).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <i className="fas fa-clock mr-2"></i>
                                        Last Updated: {new Date(currentShop.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    ) : (
                        // Edit Mode
                        <form onSubmit={handleUpdateShop} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-store mr-2"></i>
                                        Shop Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="shopName"
                                        value={formData.shopName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-phone mr-2"></i>
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-user mr-2"></i>
                                        Contact Person
                                    </label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-map-marker-alt mr-2"></i>
                                        Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-4 cursor-pointer py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    disabled={updateShopMutation.isPending}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2"
                                >
                                    {updateShopMutation.isPending ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            <span>Updating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save"></i>
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Quick Actions Card */}
                {!isEditMode && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            <i className="fas fa-bolt mr-2 text-yellow-500"></i>
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="p-4 cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                            >
                                <i className="fas fa-edit text-blue-500 text-xl mb-2"></i>
                                <p className="font-medium text-gray-800">Edit Details</p>
                                <p className="text-sm text-gray-500">Update shop information</p>
                            </button>

                            <button
                                onClick={handleCopyDetails}
                                className="p-4 cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                            >
                                <i className="fas fa-copy text-green-500 text-xl mb-2"></i>
                                <p className="font-medium text-gray-800">Copy Details</p>
                                <p className="text-sm text-gray-500">Copy to clipboard</p>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopDetailSingle;