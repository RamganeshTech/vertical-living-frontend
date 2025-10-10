
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast } from "../../utils/toast";
import { useGetMaterialInventoryById, useUpdateMaterialInventory } from "../../apiList/MaterialInventory Api/materialInventoryApi";
import MaterialOverviewLoading from "../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

type MaterialSpecification = {
    itemCode?: string;
    category?: string;
    series?: string;
    subcategory?: string;
    description?: string;
    watt?: string;
    image?: string;
    cct?: string;
    mrp?: string;
    model?: string;
};

const MaterialInventorySingle: React.FC = () => {
    const navigate = useNavigate()

    const { id } = useParams() as { id: string };
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<MaterialSpecification>({});
    const [error, setError] = useState<string | null>(null);

    const { data, isLoading, error: queryError, isError } = useGetMaterialInventoryById(id);
    const updateMutation = useUpdateMaterialInventory();

    // Initialize form with data when data loads
    useEffect(() => {
        if (data?.specification) {
            setForm(data?.specification);
        }
    }, [data]);

    const handleEdit = () => {
        setEditMode(true);
        // Pre-fill form with current data
        if (data?.specification) {
            setForm({ ...data.specification });
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        // Reset form to original data
        if (data?.specification) {
            setForm({ ...data.specification });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        if (!id || !form) return;
        try {
            await updateMutation.mutateAsync({ id, specification: form });
            toast({
                title: "✓ Updated",
                description: "Material inventory updated successfully",
                variant: "default"
            });
            setEditMode(false);
        } catch (e: any) {
            toast({
                title: "Error",
                description: e?.response?.data?.message || e?.message || "something has went wrong",
                variant: "destructive"
            });
        }
    };

    // Loading fallback
    if (isLoading) return <MaterialOverviewLoading />;

    if (isError || error || queryError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-white p-6 flex items-center justify-center">
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-6 shadow-lg max-w-xl w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <i className="fas fa-exclamation-triangle text-red-600"></i>
                            </div>
                            <div>
                                <h3 className="font-semibold">Error Loading Data</h3>
                                <p className="text-sm text-red-600">{error || queryError?.message || "Failed to load data"}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-400 hover:text-red-700 transition-colors"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-white flex items-center justify-center">
                <div className="text-center text-gray-400 py-12">
                    <i className="fas fa-box-open text-6xl mb-4"></i>
                    <p className="text-xl">No data found</p>
                </div>
            </div>
        );
    }

    const imageUrl = form?.image;

    // Define editable fields with labels and icons
    const editableFields = [
        { key: "mrp", label: "MRP", icon: "fa-indian-rupee-sign", type: "number" },
        { key: "category", label: "Category", icon: "fa-tag", type: "text" },
        { key: "subcategory", label: "Sub Category", icon: "fa-tags", type: "text" },
        // { key: "series", label: "Series", icon: "fa-layer-group", type: "text" },
        { key: "model", label: "Model", icon: "fa-cube", type: "text" },
        { key: "description", label: "Description", icon: "fa-align-left", type: "text" },
        { key: "watt", label: "Watt", icon: "fa-bolt", type: "number" },
        { key: "itemCode", label: "Item Code", icon: "fa-barcode", type: "text" },
        { key: "cct", label: "CCT", icon: "fa-lightbulb", type: "text" },
    ];

    // Get other fields that are not in editableFields
    // const otherFields = Object.entries(form).filter(
    //     ([key]) => !editableFields.some(f => f.key === key) && key !== "image"
    // );

    return (
        <div className="max-h-full min-h-full overflow-y-auto bg-gradient-to-br from-violet-50 via-blue-50 to-white p-4 ">
            <div className="max-w-full mx-auto">

                <header className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center justify-between gap-3">
                        <div onClick={() => navigate(-1)}
                            className='bg-white hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                            <i className='fas fa-arrow-left'></i>
                        </div>
                        <div>
 <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                            {data?.specification?.subcategory ? data?.specification?.subcategory : "Material Details"}
                        </h1>
                        <p className="text-gray-600 mt-2">View and manage material inventory information</p>
                    
                        </div>
                       </div>
                    <div className="flex gap-3">
                        {!editMode ? (
                            <Button
                                onClick={handleEdit}
                                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg"
                            >
                                <i className="fas fa-edit mr-2"></i>
                                Edit Details
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="border-2 border-gray-300 hover:bg-gray-50"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={updateMutation.isPending}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save mr-2"></i>
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </header>


                


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-1">
                        <Card className="overflow-hidden border-2 border-violet-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <CardContent className="p-0">
                                {imageUrl ? (
                                    <div className="relative group">
                                        <img
                                            src={imageUrl}
                                            alt={form.itemCode || "Material"}
                                            className="w-full h-auto object-cover rounded-t-xl"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=No+Image";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-violet-100 to-blue-100 h-80 flex items-center justify-center">
                                        <div className="text-center text-violet-300">
                                            <i className="fas fa-image text-6xl mb-3"></i>
                                            <p className="text-sm">No Image Available</p>
                                        </div>
                                    </div>
                                )}


                                <div className="p-6 bg-gradient-to-br from-violet-50 to-blue-50">
                                    {/* <div className="space-y-3">
                                         {form.mrp && (
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm text-gray-600">MRP</Label>
                                                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                                                    ₹{form.mrp}
                                                </Badge>
                                            </div>
                                        )}
                                        {form.itemCode && (
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm text-gray-600">Item Code</Label>
                                                <Badge variant="success" className="font-mono">
                                                    {form.itemCode}
                                                </Badge>
                                            </div>
                                        )}
                                        {form.category && (
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm text-gray-600">Category</Label>
                                                <Badge variant="default">
                                                    {form.category}
                                                </Badge>
                                            </div>
                                        )}
                                       
                                    </div> */}


                                    <div className="space-y-4">
                                        {data?.specification?.mrp && (
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900 mb-3">
                                                    ₹{data.specification.mrp}
                                                    <span className="text-xs font-normal text-gray-500 ml-2">MRP</span>
                                                </p>
                                            </div>
                                        )}
                                        <div className="space-y-2 text-sm">
                                            {data?.specification?.category && (
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-gray-500">Category</Label>
                                                    {/* <Label className="font-medium text-gray-900">{form.category}</Label> */}
                                                    

                                                 <Badge variant="default">
                                                    {data?.specification?.category}
                                                </Badge>
                                                </div>
                                            )}
                                            {data?.specification?.itemCode && (
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-gray-500">Code</Label>
                                                    {/* <Label className="font-mono text-gray-700">{form.itemCode}</Label> */}
                                                   <Badge variant="success" className="font-mono">
                                                    {data?.specification?.itemCode}
                                                </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2">
                        <Card className="border-2 border-violet-100 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-violet-50 to-blue-50 border-b-2 border-violet-100">
                                <CardTitle className="text-2xl text-violet-700 flex items-center gap-2">
                                    <i className="fas fa-info-circle"></i>
                                    Specifications
                                </CardTitle>
                                <CardDescription>
                                    {editMode ? "Edit material specifications below" : "Detailed material information"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {editMode ? (
                                    /* Edit Mode */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {editableFields.map((field) => (
                                            <div key={field.key} className="space-y-2">
                                                <Label htmlFor={field.key} className="flex items-center gap-2 text-violet-700">
                                                    <i className={`fas ${field.icon} text-sm`}></i>
                                                    {field.label}
                                                </Label>
                                                <Input
                                                    id={field.key}
                                                    name={field.key}
                                                    type={field.type}
                                                    value={form[field.key as keyof MaterialSpecification] || ""}
                                                    onChange={handleChange}
                                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                                    className="transition-all duration-200 hover:border-violet-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {editableFields.map((field) => {
                                            const value = form[field.key as keyof MaterialSpecification];
                                            if (!value) return null;

                                            return (
                                                <div
                                                    key={field.key}
                                                    className="bg-gradient-to-br from-white to-violet-50 p-4 rounded-xl border border-violet-100 hover:shadow-md transition-all duration-200"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <i className={`fas ${field.icon} text-violet-600`}></i>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                                {field.label}
                                                            </p>
                                                            <p className="text-gray-900 font-semibold truncate">
                                                                {field.key === "mrp" ? `₹${value}` : value}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Other Custom Fields */}
                                {/* {!editMode && otherFields.length > 0 && (
                                    <div className="mt-8 pt-6 border-t-2 border-violet-100">
                                        <h3 className="text-lg font-semibold text-violet-700 mb-4 flex items-center gap-2">
                                            <i className="fas fa-list-ul"></i>
                                            Additional Properties
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {otherFields.map(([key, value]) => (
                                                <div 
                                                    key={key} 
                                                    className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <i className="fas fa-cube text-blue-600"></i>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                                            </p>
                                                            <p className="text-gray-900 font-semibold truncate">
                                                                {String(value)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )} */}

                                {/* Edit Mode - Additional Custom Fields */}
                                {/* {editMode && otherFields.length > 0 && (
                                    <div className="mt-8 pt-6 border-t-2 border-violet-100">
                                        <h3 className="text-lg font-semibold text-violet-700 mb-4 flex items-center gap-2">
                                            <i className="fas fa-list-ul"></i>
                                            Additional Properties
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {otherFields.map(([key, value]) => (
                                                <div key={key} className="space-y-2">
                                                    <Label htmlFor={key} className="flex items-center gap-2 text-blue-700">
                                                        <i className="fas fa-cube text-sm"></i>
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </Label>
                                                    <Input
                                                        id={key}
                                                        name={key}
                                                        type="text"
                                                        value={String(value) || ""}
                                                        onChange={handleChange}
                                                        placeholder={`Enter ${key.toLowerCase()}`}
                                                        className="transition-all duration-200 hover:border-blue-300"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )} */}

                                {/* Empty State */}
                                {!editMode && Object.keys(form).filter(key => key !== 'image').length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <i className="fas fa-inbox text-3xl text-violet-400"></i>
                                        </div>
                                        <p className="text-gray-500">No specifications available</p>
                                        <Button
                                            onClick={handleEdit}
                                            className="mt-4 bg-violet-600 hover:bg-violet-700 text-white"
                                        >
                                            <i className="fas fa-plus mr-2"></i>
                                            Add Specifications
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Additional Information Card */}
                        {/* {!editMode && (form.watt || form.cct) && (
                            <Card className="mt-6 border-2 border-violet-100 shadow-xl">
                                <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b-2 border-yellow-100">
                                    <CardTitle className="text-xl text-orange-700 flex items-center gap-2">
                                        <i className="fas fa-bolt"></i>
                                        Technical Specifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {form.watt && (
                                            <div className="text-center">
                                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                                    <i className="fas fa-bolt text-3xl text-orange-600"></i>
                                                </div>
                                                <p className="text-sm text-gray-500 uppercase tracking-wider">Power</p>
                                                <p className="text-2xl font-bold text-gray-900">{form.watt}W</p>
                                            </div>
                                        )}
                                        {form.cct && (
                                            <div className="text-center">
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                                    <i className="fas fa-lightbulb text-3xl text-cyan-600"></i>
                                                </div>
                                                <p className="text-sm text-gray-500 uppercase tracking-wider">CCT</p>
                                                <p className="text-2xl font-bold text-gray-900">{form.cct}</p>
                                            </div>
                                        )}
                                        {form.series && (
                                            <div className="text-center">
                                                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                                    <i className="fas fa-layer-group text-3xl text-purple-600"></i>
                                                </div>
                                                <p className="text-sm text-gray-500 uppercase tracking-wider">Series</p>
                                                <p className="text-2xl font-bold text-gray-900">{form.series}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )} */}

                        {/* Status Bar */}
                        {/* {editMode && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
                                        <i className="fas fa-edit text-amber-600"></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-amber-800">Edit Mode Active</p>
                                        <p className="text-xs text-amber-600">Make changes to the fields above and click Save when done</p>
                                    </div>
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>

                {/* Footer Actions - Mobile Only */}
                {editMode && (
                    <div className="mt-8 lg:hidden">
                        <div className="bg-white border-2 border-violet-100 rounded-xl p-4 shadow-xl">
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="flex-1 border-2 border-gray-300 hover:bg-gray-50"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={updateMutation.isPending}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save mr-2"></i>
                                            Save
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaterialInventorySingle;