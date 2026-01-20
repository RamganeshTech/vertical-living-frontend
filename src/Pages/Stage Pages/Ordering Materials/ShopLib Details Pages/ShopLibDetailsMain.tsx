import React, { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useGetShopLib, useCreateShopLib, useDeleteShopLib } from "../../../../apiList/Stage Api/shopLibDetailApi";
import { toast } from "../../../../utils/toast";
import { Button } from "../../../../components/ui/Button";
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
import SmartTagInput from "../../../../shared/SmartTagInput";
// import { useGetShopLib, useCreateShopLib, useDeleteShopLib } from "../../api/shopLibApi";

export interface ShopFormData {
    shopName: string;
    address: string;
    contactPerson: string;
    phoneNumber: string;
    priority: string[];

}

const ShopLibDetailsMain: React.FC = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string }
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState<ShopFormData>({
        shopName: "",
        address: "",
        contactPerson: "",
        phoneNumber: "",
        priority: [],

    });

    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.ordermaterial?.delete;
    // const canList = role === "owner" || permission?.ordermaterial?.list;
    const canCreate = role === "owner" || permission?.ordermaterial?.create;
    // const canEdit = role === "owner" || permission?.ordermaterial?.edit;



    const { data: shops, isLoading, error } = useGetShopLib(organizationId);
    const createShopMutation = useCreateShopLib();
    const deleteShopMutation = useDeleteShopLib();

    // Filter shops based on search
    const filteredShops = shops?.filter((shop: any) =>
        shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handler for SmartTagInput
    const handleSetTags = (newTags: string[] | ((prev: string[]) => string[])) => {
        setFormData(prev => ({
            ...prev,
            priority: typeof newTags === 'function' ? newTags(prev.priority) : newTags
        }));
    };


    const handleCreateShop = async (e: React.FormEvent) => {
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

            const shopData = {
                organizationId,
                shopData: formData
            };

            await createShopMutation.mutateAsync(shopData);

            toast({
                title: "Success",
                description: "Shop created successfully"
            });

            setIsCreateModalOpen(false);
            setFormData({
                shopName: "",
                address: "",
                contactPerson: "",
                phoneNumber: "",
                priority: [],

            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to create shop",
                variant: "destructive"
            });
        }
    };

    const handleDeleteShop = async (shopId: string) => {
        try {
            // const confirmed = window.confirm(`Are you sure you want to delete "${shopName}"?`);
            // if (!confirmed) return;

            await deleteShopMutation.mutateAsync({ id: shopId });

            toast({
                title: "Success",
                description: "Shop deleted successfully"
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete shop",
                variant: "destructive"
            });
        }
    };


    const handleViewShop = (shopId: string) => {
        navigate(`single/${shopId}`);
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
                    <p className="text-gray-600">Loading shops...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                    <p className="text-gray-600">Failed to load shops</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        <i className="fas fa-redo mr-2"></i>
                        Retry
                    </button>
                </div>
            </div>
        );
    }


    const isChild = location.pathname.includes("single")

    if (isChild) {
        return <Outlet />
    }

    return (
        <div className="min-h-full overflow-y-auto bg-gray-50 p-4 md:p-6">
            <div className="max-w-full mx-auto">
                {/* Header */}
                <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <i className="fas fa-arrow-left text-gray-600"></i>
                            </button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    <i className="fas fa-store mr-3 text-blue-500"></i>
                                    Shop Library
                                </h1>
                                <p className="text-gray-600 mt-1">Manage your shop details and contacts</p>
                            </div>

                        </div>
                        {(canCreate) && <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            <i className="fas fa-plus"></i>
                            <span>Add New Shop</span>
                        </Button>}
                    </div>

                    {/* Search and View Toggle */}
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Search shops..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex  gap-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`px-4 cursor-pointer py-2 rounded-lg transition-colors ${viewMode === "grid"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                <i className="fas fa-th-large"></i>
                            </button>
                            <button
                                onClick={() => setViewMode("table")}
                                className={`px-4 cursor-pointer py-2 rounded-lg transition-colors ${viewMode === "table"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                <i className="fas fa-list"></i>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Empty State */}
                {(!filteredShops || filteredShops.length === 0) && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {searchTerm ? "No shops found" : "No shops yet"}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm
                                ? "Try adjusting your search terms"
                                : "Get started by adding your first shop"}
                        </p>
                        {(!searchTerm || canCreate) && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Add First Shop
                            </button>
                        )}
                    </div>
                )}

                {/* Grid View */}
                {viewMode === "grid" && filteredShops && filteredShops.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredShops.map((shop: any) => (
                            <div
                                key={shop._id}
                                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => handleViewShop(shop._id)}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                {shop.shopName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                <i className="fas fa-map-marker-alt mr-1"></i>
                                                {shop.address || "No address"}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteShop(shop._id);
                                            }}
                                            variant="danger"
                                            className="p-2 bg-red-500 hover:bg-red-500 text-white rounded-lg transition-colors"
                                            isLoading={deleteShopMutation.isPending && deleteShopMutation.variables?.id === shop._id}

                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <i className="fas fa-user w-5"></i>
                                            <span>{shop.contactPerson || "No contact person"}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <i className="fas fa-phone w-5"></i>
                                            <span>{shop.phoneNumber || "No phone"}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                        <span className="text-xs text-gray-400">
                                            Click to view details
                                        </span>
                                        <i className="fas fa-arrow-right text-gray-400"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Table View */}
                {viewMode === "table" && filteredShops && filteredShops.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Shop Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Address
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact Person
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredShops.map((shop: any) => (
                                        <tr
                                            key={shop._id}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleViewShop(shop._id)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {shop.shopName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    {shop.address || "-"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {shop.contactPerson || "-"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {shop.phoneNumber || "-"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                {canDelete && <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteShop(shop._id);
                                                    }}
                                                    variant="danger"
                                                    className="bg-red-500 hover:bg-red-500 text-white ml-4"
                                                    isLoading={deleteShopMutation.isPending && deleteShopMutation.variables?.id === shop._id}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </Button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Create Shop Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    <i className="fas fa-plus-circle mr-2 text-blue-500"></i>
                                    Add New Shop
                                </h2>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            <form onSubmit={handleCreateShop} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Shop Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="shopName"
                                        value={formData.shopName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Person
                                    </label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <i className="fas fa-tags mr-2 text-blue-500"></i>Priority Tags
                                    </label>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                                        <SmartTagInput
                                            tags={formData.priority}
                                            setState={handleSetTags}
                                            // suggestionFetcher={async () => ['high', 'electrical', 'plumbing', 'general', 'urgent']}
                                        />
                                        <p className="text-[10px] text-gray-400 mt-2 italic">These tags are used to filter shops when sending procurement requests.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createShopMutation.isPending}
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2"
                                    >
                                        {createShopMutation.isPending ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                <span>Creating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-check"></i>
                                                <span>Create Shop</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopLibDetailsMain;