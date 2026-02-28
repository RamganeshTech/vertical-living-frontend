import React, { useEffect, useMemo } from 'react'

import {
    useGetAllOrderMaterialPublicUnits,
    useAddOrderingMaterialSubItem,
    useUpdateOrderingMaterialSubItem,
    useDeleteOrderingMaterialSubItem,
    useUpdatePublicOrderShopDetails,
} from '../../../../apiList/Stage Api/publicOrderMaterialApi';
import ExcelLikeRow from './ExcelLikeRow';
import { toast } from '../../../../utils/toast';
import { useState } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
// import { useGetShopLib } from '../../../../apiList/Stage Api/shopLibDetailApi';
import SearchSelectNew from '../../../../components/ui/SearchSelectNew';
import { useGetVendorForDropDown } from '../../../../apiList/Department Api/Accounting Api/vendorAccApi';

type Props = {
    selectedProjectId: string,
    organizationId: string,
};

const PublicOrderMaterialCompo: React.FC<Props> = ({
    selectedProjectId,
    organizationId
}) => {

    // const { data: shops } = useGetShopLib(organizationId);
    const { data: vendors } = useGetVendorForDropDown(organizationId);


    const [editShop, setEditShop] = useState(false);

    const [shopForm, setShopForm] = useState<any>({});
    const [selectedShop, setSelectedShop] = useState<{
        selectedId: string | null,
        shopName: string | null
    }>({
        selectedId: null,
        shopName: null
    })



    // useEffect(() => {
    //     if (selectedShop.selectedId) {
    //         const shop = shops?.find((shop: any) => shop._id === selectedShop.selectedId)
    //         // console.log("shop", shop)
    //         if (shop) {
    //             setShopForm(shop)
    //         }
    //     }
    // }, [selectedShop.selectedId, shops])

    // const shopLibOptions = (shops || [])?.map((shop: any) => ({
    //     value: shop._id,
    //     label: shop.shopName
    // }))


    // Inside your useEffect to update the form
    useEffect(() => {
        if (selectedShop.selectedId && vendors.length > 0) {
            const vendor = vendors.find((v: any) => v._id === selectedShop.selectedId);
            if (vendor) {
                setShopForm({
                    shopName: vendor?.shopName,
                    address: vendor?.address,
                    contactPerson: vendor?.vendorName,
                    phoneNumber: vendor?.phoneNo, // Matches 'phoneNo' from your backend map
                    priority: vendor?.priority || []
                });
            }
        }
    }, [selectedShop.selectedId, vendors]);


    // 2. Map the data specifically for SearchSelectNew options
    const shopLibOptions = useMemo(() => {
        return vendors?.map((vendor: any) => ({
            value: vendor._id,
            // Match the 'shopName' key you defined in your backend 'modifiedvendor'
            label: vendor.shopName || vendor.vendorName,
            subLabel: vendor.contactPerson
        }));
    }, [vendors]);



    const [newRowData, setNewRowData] = useState({ name: '', quantity: 1, unit: '' });
    const [editingCell, setEditingCell] = useState<{ subItemId: string; field: string } | null>(null);



    const { data: publicUnits, isLoading } = useGetAllOrderMaterialPublicUnits(selectedProjectId);
    const addMutation = useAddOrderingMaterialSubItem();
    const updateMutation = useUpdateOrderingMaterialSubItem();
    const deleteMutation = useDeleteOrderingMaterialSubItem();


    // Handle save edit
    const handleSaveEdit = async (subItemId: string, field: string, value: any) => {
        try {
            const subItem = publicUnits?.subItems?.find((s: any) => s._id === subItemId);
            if (!subItem) return;

            const updatedData = {
                projectId: selectedProjectId,
                subItemId,
                subItemName: field === 'name' ? value : subItem.subItemName,
                quantity: field === 'quantity' ? (Number(value) || 1) : subItem.quantity,
                unit: field === 'unit' ? value : subItem.unit,
            };

            await updateMutation.mutateAsync(updatedData);
            toast({ title: "Success", description: "Item updated successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update item",
                variant: "destructive"
            });
        }
    };

    // Handle new row save
    const handleNewRowSave = async (newData: any) => {
        const rowData = newData;

        if (!rowData?.name?.trim()) {
            return toast({
                title: "Error",
                description: "Material Name is mandatory",
                variant: "destructive"
            });
        }

        if (!rowData?.unit) {
            return toast({
                title: "Error",
                description: "Unit is mandatory",
                variant: "destructive"
            });
        }

        try {
            await addMutation.mutateAsync({
                projectId: selectedProjectId,
                unitId: "", // Not needed
                subItemName: rowData.name,
                quantity: rowData.quantity || 1,
                unit: rowData.unit,
            });

            // Clear the new row
            setNewRowData({ name: '', quantity: 1, unit: '' });

            toast({ title: "Success", description: "Item created successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to create item",
                variant: "destructive"
            });
        }
    };

    // Handle delete
    const handleDelete = async (subItemId: string) => {
        try {
            await deleteMutation.mutateAsync({
                projectId: selectedProjectId,
                subItemId
            });
            toast({ title: "Success", description: "Item deleted successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete item",
                variant: "destructive"
            });
        }
    };


    const { mutateAsync: updateShop } = useUpdatePublicOrderShopDetails();


    const handleUpdateShop = async () => {
        try {

            if (shopForm.phoneNumber) {
                if (!/^\d{10}$/.test(shopForm.phoneNumber.trim())) {
                    throw new Error("Phone number should contain exactly 10 digit numbers")
                }
            }

            await updateShop({ projectId: selectedProjectId!, updates: shopForm });
            toast({ title: "Success", description: "Shop Details Updated" });
            setEditShop(false);
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
        }
    };


    return (
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-lg">


            {/* <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                            <i className="fa-solid fa-store"></i>
                            Shop Details
                        </h2>
                    </div>
                    <button
                        onClick={() => { setShopForm(publicUnits?.shopDetails); setEditShop(true); }}
                        // className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
                        className=" text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
                        
                        >
                        <i className="fa-solid fa-edit mr-1"></i>Edit
                    </button>
                        {editShop ? (
                    <div className="space-y-3">
                        <Input
                            placeholder="Shop Name"
                            value={shopForm?.shopName || ""}
                            onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                            className="w-full"
                        />
                        <Input
                            placeholder="Contact Person"
                            value={shopForm?.contactPerson || ""}
                            onChange={(e) => setShopForm({ ...shopForm, contactPerson: e.target.value })}
                            className="w-full"
                        />
                        <Input
                            placeholder="Phone Number"
                            value={shopForm?.phoneNumber || ""}
                            type="tel"
                            maxLength={10}
                            onChange={(e) => setShopForm({ ...shopForm, phoneNumber: e.target.value })}
                            className="w-full"
                        />
                        <Input
                            placeholder="Address"
                            value={shopForm?.address || ""}
                            onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                            className="w-full"
                        />
                        <div className="flex flex-col sm:flex-row gap-2 mt-3  justify-end ">
                            <Button onClick={handleUpdateShop} className="w-full sm:w-auto">
                                <i className="fa-solid fa-save mr-2"></i>Save
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setEditShop(false)}
                                className="w-full sm:w-auto"
                            >
                                <i className="fa-solid fa-times mr-2"></i>Cancel
                            </Button>
                        </div>
                </div>
            ) : (
                <div className="space-y-2 text-sm sm:text-base">
                    <p><strong>Shop Name:</strong> {publicUnits?.shopDetails?.shopName || "-"}</p>
                    <p><strong>Contact Person:</strong> {publicUnits?.shopDetails?.contactPerson || "-"}</p>
                    <p><strong>Phone:</strong> {publicUnits?.shopDetails?.phoneNumber || "-"}</p>
                    <p><strong>Address:</strong> {publicUnits?.shopDetails?.address || "-"}</p>
                </div>
            )}
            </div> */}

            <div className="border rounded-lg p-4 mb-6 bg-white  shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                        <i className="fa-solid fa-store text-blue-600"></i>
                        Shop Details
                    </h2>

                    {!editShop ? (
                        <button
                            onClick={() => { setShopForm(publicUnits?.shopDetails); setEditShop(true); }}
                            className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                            Edit
                        </button>
                    )
                        :

                        <div className="w-[25%] animate-in fade-in duration-300 mb-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Selection</label>
                            <SearchSelectNew
                                options={shopLibOptions}
                                placeholder="Select Shop"
                                searchPlaceholder="Search by shop name..."
                                value={selectedShop.selectedId || ''}
                                // onValueChange={(value) => {
                                //     const shopFound = shops?.find((s: any) => s._id === value)
                                //     // console.log("sop", shopFound)
                                //     setSelectedShop(({ selectedId: shopFound._id, shopName: shopFound.shopName }))
                                // }}


                                onValueChange={(value) => {
                                    // Search in the 'vendors' local variable we created above
                                    const vendorFound = vendors.find((v: any) => v._id === value);
                                    if (vendorFound) {
                                        setSelectedShop({
                                            selectedId: vendorFound._id,
                                            shopName: vendorFound.shopName
                                        });
                                    }
                                }}


                                searchBy="name"
                                displayFormat="detailed"
                                className="w-full"
                            />
                        </div>
                    }
                </div>

                {editShop ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            placeholder="Shop Name"
                            value={shopForm?.shopName || ""}
                            onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                        />
                        <Input
                            placeholder="Contact Person"
                            value={shopForm?.contactPerson || ""}
                            onChange={(e) => setShopForm({ ...shopForm, contactPerson: e.target.value })}
                        />
                        <Input
                            placeholder="Phone Number"
                            value={shopForm?.phoneNumber || ""}
                            type="tel"
                            maxLength={10}
                            onChange={(e) => setShopForm({ ...shopForm, phoneNumber: e.target.value })}
                        />
                        <Input
                            placeholder="Address"
                            value={shopForm?.address || ""}
                            onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                        />

                        <div className="flex gap-3 justify-end sm:col-span-2 mt-4">
                            <Button onClick={handleUpdateShop} className="bg-blue-600 hover:bg-blue-700 text-white">
                                <i className="fa-solid fa-save mr-2"></i>Save
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setEditShop(false)}
                            >
                                <i className="fa-solid fa-times mr-2"></i>Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700 text-sm sm:text-base">
                        <p><strong>Shop Name:</strong> {publicUnits?.shopDetails?.shopName || "-"}</p>
                        <p><strong>Contact Person:</strong> {publicUnits?.shopDetails?.contactPerson || "-"}</p>
                        <p><strong>Phone Number:</strong> {publicUnits?.shopDetails?.phoneNumber || "-"}</p>
                        <p><strong>Address:</strong> {publicUnits?.shopDetails?.address || "-"}</p>
                    </div>
                )}
            </div>





            {/* Table Header */}
            <div className="grid grid-cols-17 gap-0 bg-gradient-to-r from-blue-100 to-blue-100 border-b-2 border-blue-200">
                <div className="col-span-3 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                    Ref ID
                </div>
                <div className="col-span-8 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                    Material Name
                </div>
                <div className="col-span-2 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                    Quantity
                </div>
                <div className="col-span-3 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                    Unit
                </div>
                <div className="col-span-1 px-4 py-3 text-sm font-medium text-gray-700">
                    Action
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="p-8 text-center">
                    <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-3" />
                    <p className="text-gray-600">Loading materials...</p>
                </div>
            )}

            {/* Existing Items */}
            {!isLoading && publicUnits?.subItems?.map((sub: any) => (
                <ExcelLikeRow
                    key={sub._id}
                    item={sub}
                    editingCell={editingCell}
                    setEditingCell={setEditingCell}
                    onSave={handleSaveEdit}
                    onDelete={handleDelete}
                    isDeleting={deleteMutation.isPending}
                />
            ))}

            {/* New Row */}
            <ExcelLikeRow
                isNewRow
                newRowData={newRowData}
                setNewRowData={setNewRowData}
                onNewRowSave={handleNewRowSave}
                isAdding={addMutation.isPending}
            />

            {/* Empty State */}
            {!isLoading && publicUnits?.subItems?.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <i className="fa-solid fa-inbox text-4xl mb-3 text-gray-300"></i>
                    <p className="text-sm">No materials yet. Start typing in the row above to add items.</p>
                </div>
            )}
        </div>
    )
}

export default PublicOrderMaterialCompo