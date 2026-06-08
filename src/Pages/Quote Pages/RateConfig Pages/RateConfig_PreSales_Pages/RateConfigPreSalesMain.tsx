import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { Input } from "../../../../components/ui/Input";
// import { Label } from "../../../components/ui/Label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {  } from "@/hooks/rateconfig";
import { toast } from "../../../../utils/toast";
import { Button } from "../../../../components/ui/Button";
import { useCreateCategory, useDeleteCategory, useGetCategoriesPreSales } from "../../../../apiList/Quote Api/RateConfig Api/rateConfigApi";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/Dialog";
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
import StageGuide from "../../../../shared/StageGuide";
import { useUpdateRateConfigCategory } from "../../../../apiList/Quote Api/RateConfig Api/preSalesRateConfigApi";



export default function RateConfigPreSalesMain() {
    const { organizationId } = useParams<{ organizationId: string }>();
    const navigate = useNavigate();
    const location = useLocation();



    const { role, permission } = useAuthCheck();
    const canList = role === "owner" || permission?.presalesmaterialrateconfig?.list;
    const canCreate = role === "owner" || permission?.presalesmaterialrateconfig?.create;
    const canDelete = role === "owner" || permission?.presalesmaterialrateconfig?.delete;
    //   const canEdit = role === "owner" || permission?.presalesmaterialrateconfig?.edit;

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const [searchQuery, setSearchQuery] = useState<string>("");



    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);




    // Inside your component function:
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // If the dropdown is open and the click is NOT inside the ref element, close it
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownIndex(null);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdownIndex]);

    const toggleVisibility = (index: number, module: string) => {
        const updated = [...fields];
        const currentVisibility = updated[index].visibleIn || ["presales"];

        if (currentVisibility.includes(module)) {
            updated[index].visibleIn = currentVisibility.filter(m => m !== module);
        } else {
            updated[index].visibleIn = [...currentVisibility, module];
        }
        setFields(updated);
    };



    const toggleAllModules = (index: number) => {
        const updated = [...fields];
        const current = updated[index].visibleIn || [];

        // If everything is already selected, clear it. Otherwise, select all.
        if (current.includes("materials") && current.includes("presales")) {
            updated[index].visibleIn = [];
        } else {
            updated[index].visibleIn = ["materials", "presales"];
        }
        setFields(updated);
    };


    // const isChildRoute = location.pathname.includes("single");
    const isChildRoute = location.pathname.includes("single") || location.pathname.includes("backup");


    const [categoryName, setCategoryName] = useState("");
    const [fields, setFields] = useState([{ key: "", oldKey: "", type: "string", required: false, visibleIn: ["presales"] as string[] }]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isProductSpecific, setIsProductSpecific] = useState<boolean>(true);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    // const { data: categories, isLoading, refetch } = useGetCategories(organizationId!);
    const { data: categories, isLoading, refetch } =  useGetCategoriesPreSales(organizationId!)
    const { mutateAsync: createCategory, isPending: createPending } = useCreateCategory();
    const { mutateAsync: deleteCategory, isPending } = useDeleteCategory();
    const { mutateAsync: updateCategory, isPending: updatePending } = useUpdateRateConfigCategory();

    // Add this line to filter categories dynamically
    const filteredCategories = categories?.filter((category: any) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleAddField = () => {
        setFields([...fields, { key: "", oldKey: "", type: "string", required: false, visibleIn: ["presales"] }]);
    };

    const handleRemoveField = (index: number) => {
        // Prevent deleting the last field if you want to ensure at least one field exists
        if (fields.length > 1) {
            const updated = fields.filter((_, i) => i !== index);
            setFields(updated);
        } else {
            toast({ title: "Note", description: "At least one field is required" });
        }
    };

    // const handleFieldChange = (
    //     index: number,
    //     field: keyof typeof fields[number],
    //     value: any
    // ) => {
    //     const updated: any = [...fields];
    //     updated[index][field] = value;
    //     setFields(updated);
    // };

    // // Update your change handler
    const handleFieldChange = (index: number, property: string, value: any) => {
        const updatedFields = [...fields];

        // If it's a brand new field being typed for the first time, 
        // it won't have an oldKey, which is correct (it's an addition).
        updatedFields[index] = { ...updatedFields[index], [property]: value };
        setFields(updatedFields);
    };

    const handleCreate = async () => {
        try {
            if (!editingCategoryId) {
                if (!organizationId || !categoryName || fields.length === 0) {
                    return toast({
                        title: "Error",
                        description: "Category name and fields are required",
                        variant: "destructive",
                    });
                }
            } else {
                if (!organizationId || fields.length === 0) {
                    return toast({
                        title: "Error",
                        description: "Category name and fields are required",
                        variant: "destructive",
                    });
                }
            }

            // const validFields = fields.filter((f) => f.key.trim() !== "");

            // 1. Validate and Normalize Field Keys
            const validFields = fields.filter((f) => f.key.trim() !== "").map(f => {
                let sanitizedKey = f.key.trim();

                // --- NORMALIZATION: Replace '×' (U+00D7) with 'x' (Standard) ---
                if (isProductSpecific) {
                    sanitizedKey = sanitizedKey.replace(/×/g, 'x');
                }

                return { ...f, key: sanitizedKey };
            });


            if (validFields.length === 0) {
                return toast({
                    title: "Error",
                    description: "Please enter valid field keys",
                    variant: "destructive",
                });
            }


            if (editingCategoryId) {

                // --- UPDATE FLOW ---
                // We map the fields to include oldKey so the backend can sync
                const updatePayload = validFields.map(f => ({
                    key: f.key,
                    type: f.type,
                    required: f.required || false,
                    visibleIn: f.visibleIn || ["presales"],
                    oldKey: f.oldKey // Will be undefined for brand new fields added during edit
                }));



                // CALL UPDATE MUTATION
                await updateCategory({
                    organizationId,
                    categoryId: editingCategoryId,
                    name: categoryName,
                    fields: updatePayload,
                    isProductSpecific: isProductSpecific,

                });
                toast({ title: "Success", description: "Category Updated Successfully" });
            }
            else {
                await createCategory({
                    organizationId,
                    name: categoryName,
                    fields: validFields,
                    isProductSpecific: isProductSpecific,

                });
                toast({ title: "Success", description: "Category Created Successfully" });
            }

            setEditingCategoryId(null);
            setCategoryName("");
            setFields([{ key: "", oldKey: "", type: "string", required: false, visibleIn: ["presales"] }]);
            setShowCreateForm(false);
            refetch()
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "failed to create category", variant: "destructive" });
        }
    };



    const handleDelete = (categoryId: string) => {
        try {

            const confirmDelete = window.confirm("Are you sure you want to delete this category? This action cannot be undone.");

            // Only proceed if user clicks 'OK'
            if (!confirmDelete) return;


            deleteCategory({
                categoryId: categoryId,
                organizationId: organizationId!,
            })
            refetch()
            toast({ title: "Success", description: "Category Deleted Successfully" });

        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "failed to delete category", variant: "destructive" });
        }
    }
    if (isChildRoute) return <Outlet />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-cubes mr-3 text-blue-600" />
                        Rate Configuration Pre Sales
                    </h1>
                    {/* <p className="text-gray-600 mt-1">
                        Manage your organization's material categories and configurable fields
                    </p> */}
                </div>

                <section className="flex  gap-3 items-center">

                    <div className="relative hidden sm:block">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        <Input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 w-48 lg:w-64"
                        />
                    </div>

                    <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-700"}`}
                            title="Grid View"
                        >
                            <i className="fa-solid fa-border-all text-sm px-1" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-700"}`}
                            title="List View"
                        >
                            <i className="fa-solid fa-list text-sm px-1" />
                        </button>
                    </div>


                    {canCreate && <div>
                        <Button onClick={() => setShowCreateForm(true)}>Create New Category</Button>
                    </div>}

                    <div>
                        <Button onClick={() => navigate("backup")}>Backup</Button>
                    </div>

                    <div className="w-full sm:w-auto flex justify-end sm:block">
                        <StageGuide
                            organizationId={organizationId!}
                            stageName="materialquote"
                        />
                    </div>
                </section>
            </header>

            {/* Create Modal */}
            <Dialog open={showCreateForm}
                // onOpenChange={setShowCreateForm}
                onOpenChange={(open) => {
                    setShowCreateForm(open);
                    if (!open) {
                        setEditingCategoryId(null);
                        setCategoryName("");
                        setFields([{ key: "", oldKey: "", type: "string", required: false, visibleIn: ["presales"] }]);
                    }
                }}

            >
                <DialogContent className="px-5 py-6">
                    <DialogHeader className="px-0 py-0">
                        {/* <DialogTitle>Create New Material Category</DialogTitle> */}
                        <DialogTitle>{editingCategoryId ? "Edit Category Fields" : "Create New Material Category"}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Input
                            placeholder="Category name (e.g. Plywood)"
                            value={categoryName}
                            // disabled={!!editingCategoryId}
                            // onChange={(e) => setCategoryName(e.target.value)}
                            // className={editingCategoryId ? "cursor-not-allowed" : ""}
                            // title={`${editingCategoryId ? "not allowed to edit title" : ""}`}
                        />

                        <div>
                            {/* <h4 className="text-base font-semibold">Define Fields</h4> */}

                            <div className="flex gap-2 items-center justify-between">
                                <h4 className="text-base font-semibold">Define Fields</h4>

                                <div className="flex gap-2 items-center justify-between">
                                    <input id="productspecific" checked={isProductSpecific} onChange={(e) => setIsProductSpecific(e.target.checked)} type="checkbox" />
                                    <label className="cursor-pointer" htmlFor="productspecific">Product Specific</label>
                                </div>
                            </div>

                            {/* <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 mt-1 inline-block">
                                <i className="fas fa-exclamation-triangle mr-1.5" />
                                Ensure keys are named accurately. Renaming a field key after data has been entered will delete the data
                            </span> */}

                            <div className="flex flex-col gap-2 mt-1">
                                {/* Existing Data Loss Warning */}
                                <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 inline-block">
                                    <i className="fas fa-exclamation-triangle mr-1.5" />
                                    Ensure keys are named accurately. Renaming a field key after data has been entered will delete the data.
                                </span>

                                {/* NEW: Conditional Dimension Instruction - Only shows if checked */}
                                {isProductSpecific && (
                                    <div className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-2 rounded-md border border-blue-100 animate-in slide-in-from-top-1 duration-200">
                                        <div className="flex items-start gap-2">
                                            <i className="fas fa-info-circle mt-0.5" />
                                            <div>
                                                <p className="font-bold uppercase text-[9px] mb-0.5">Dimension Naming Guide:</p>
                                                <p>Use an 'x' between Height and Width for automatic calculation in quote engines.</p>
                                                <p className="mt-1 font-bold opacity-80">
                                                    Valid Formats: <span className="underline">7 x 6</span> or <span className="underline">7ft h x 6ft w</span>, or <span className="underline">7h x 6w</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">

                            {/* so here you nee dot mention the field key accoridg to he field inptu wil be ehsong below this will becommon for all the fields*/}


                            {/* NEW: COMMON HEADERS BEFORE THE MAP */}
                            <div className="flex gap-2 items-center px-1 mt-4 mb-1">
                                <label className="flex-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Field Key</label>
                                <label className="w-[85px] text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                                <label className="w-[120px] text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Visible In
                                    <br />
                                    (Select Modules)
                                </label>
                                <div className="w-8"></div> {/* Spacer for delete button */}
                            </div>

                            {fields.map((field, index) => {
                                const isLockedField = field.key === "manufacturCostPerSqft";

                                return (
                                    <div key={index} className="flex gap-2 items-center">
                                        <Input
                                            placeholder="Field key (e.g: brand, sqft/rate, notes)"
                                            value={isLockedField ? "Mfg Cost / Sqft" : field.key}
                                            onChange={(e) => handleFieldChange(index, "key", e.target.value)}
                                            // className="flex-1"
                                            className={`flex-1 ${isLockedField ? "cursor-not-allowed " : ""}`}
                                            disabled={isLockedField}
                                            title={isLockedField ? "This field cannot be edited" : ""}
                                        />
                                        <select
                                            value={field.type}
                                            disabled={isLockedField}
                                            onChange={(e) =>
                                                handleFieldChange(index, "type", e.target.value)
                                            }
                                            title={isLockedField ? "This field cannot be edited" : ""}
                                            // className="  px-2 py-2 rounded-xl border border-blue-200 focus:border-blue-200 active:border-blue-200"
                                            className={`px-2 py-2 rounded-xl border border-blue-200 focus:border-blue-200 active:border-blue-200
                ${isLockedField ? "cursor-not-allowed " : ""}`}
                                        >
                                            <option value="string">text</option>
                                            <option value="number">number</option>
                                            <option value="file">Image</option>

                                            {/* <option value="boolean">boolean</option> */}
                                        </select>


                                        {/* COMPACT DROPDOWN FOR VISIBILITY */}
                                        <div className="relative" ref={openDropdownIndex === index ? dropdownRef : null}>
                                            {/* <label className="text-[8px] font-black text-slate-400 uppercase absolute -top-4 left-1">Visible In</label> */}
                                            <div
                                                onClick={() => setOpenDropdownIndex(openDropdownIndex === index ? null : index)}
                                                className="h-10 px-3 min-w-[120px] bg-white border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all"
                                            >
                                                <span className="text-[11px] font-bold text-slate-600 truncate">
                                                    {field?.visibleIn?.length === 0 ? "None" : `${field?.visibleIn?.length || 0} Selected`}
                                                </span>
                                                <i className={`fas fa-chevron-down text-[8px] text-slate-400 transition-transform ${openDropdownIndex === index ? 'rotate-180' : ''}`} />
                                            </div>

                                            {/* Floating Menu */}
                                            {openDropdownIndex === index && (
                                                <>
                                                    {/* Backdrop to close dropdown */}
                                                    {/* <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownIndex(null)} /> */}

                                                    <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-100 p-2 animate-in zoom-in-95 duration-100">


                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleAllModules(index);
                                                            }}
                                                            className="w-full text-left flex items-center gap-2 p-2 hover:bg-indigo-50 rounded-lg cursor-pointer group transition-colors border-b border-slate-100 mb-1 pb-2"
                                                        >
                                                            <span className={`w-4 h-4 rounded border flex flex-shrink-0 items-center justify-center transition-all ${(field.visibleIn || []).includes("materials") && (field.visibleIn || []).includes("presales")
                                                                ? 'bg-indigo-600 border-indigo-600'
                                                                : 'bg-white border-slate-300'
                                                                }`}>
                                                                {(field.visibleIn || []).includes("materials") && (field.visibleIn || []).includes("presales") && (
                                                                    <i className="fas fa-check-double text-[8px] text-white" />
                                                                )}
                                                            </span>
                                                            <span className="text-[11px] flex-1 font-black uppercase tracking-tighter text-indigo-600">
                                                                All Modules
                                                            </span>
                                                        </button>


                                                        {['materials', 'presales'].map((module) => (
                                                            <button
                                                                key={module}
                                                                type="button"
                                                                className=" w-full text-left  flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer group"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    toggleVisibility(index, module);
                                                                }}
                                                            >
                                                                <div

                                                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${field.visibleIn?.includes(module)
                                                                        ? 'bg-blue-600 border-blue-600'
                                                                        : 'bg-white border-slate-300'
                                                                        }`}
                                                                >
                                                                    {field.visibleIn?.includes(module) && (
                                                                        <i className="fas fa-check text-[8px] text-white" />
                                                                    )}
                                                                </div>
                                                                <span className="text-[11px] font-bold capitalize text-slate-600 group-hover:text-blue-600">
                                                                    {module}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>


                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleRemoveField(index)}
                                            className="bg-red-600 hover:bg-red-600 text-white"
                                            title="Remove Field"
                                        >
                                            <i className="fas fa-trash-alt text-sm" />
                                        </Button>


                                        {/* <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        handleFieldChange(index, "required", e.target.checked)
                      }
                    />
                    <span className="text-sm">Required</span>
                  </label> */}
                                    </div>
                                )
                            }

                            )}
                        </div>

                        <div className="flex justify-between pt-2">
                            <Button variant="secondary" onClick={handleAddField}>
                                + Add Field
                            </Button>
                            <Button isLoading={createPending || updatePending} onClick={handleCreate}>

                                {/* Create Category */}
                                {editingCategoryId ? "Update Category" : "Create Category"}

                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Category Cards Section */}
            {canList && 
            // <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[88vh] overflow-y-auto">
             <div className={`mt-6 overflow-y-auto max-h-[85vh] ${viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "flex flex-col gap-3" // List view uses flex column
                    }`}>
                        

                {isLoading && <p>Loading categories...</p>}
                {!isLoading && categories?.length === 0 && (
                    <p className="text-gray-500">No categories found</p>
                )}

                {filteredCategories?.map((category: any) => (


                    <Card
                            key={category._id}
                            className="w-full border-l-4 border-blue-600 shadow-sm bg-white hover:shadow-md transition-all"
                        >
                            {/* Dynamically switch between vertical (grid) and horizontal (list) layouts */}
                            <CardContent className={`p-4 ${viewMode === "list" ? "flex flex-col sm:flex-row sm:items-center justify-between gap-4" : "space-y-3"}`}>

                                {/* Left Side: Title & Fields */}
                                <div className={`${viewMode === "list" ? "flex-1 flex flex-col sm:flex-row sm:items-center gap-4" : ""}`}>
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-bold text-blue-700 truncate ${viewMode === "list" ? "text-lg w-48" : "text-base mb-2"}`}>
                                            {category.name}
                                        </h3>

                                        {/* Mobile Delete Button (Only shows in grid mode or on small screens) */}
                                        {(canDelete && viewMode === "grid") && (
                                            <button
                                                disabled={isPending}
                                                className="group flex items-center justify-center w-8 h-8 rounded-full text-red-500 bg-red-50 hover:bg-red-600 hover:text-white transition-all"
                                                onClick={() => handleDelete(category._id)}
                                            >
                                                {isPending ? <i className="fas fa-circle-notch fa-spin text-sm" /> : <i className="fas fa-trash-alt text-sm" />}
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 capitalize flex-1 line-clamp-1" title={category.fields.map((f: any) => f.key).join(", ")}>
                                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mr-2">Fields:</span>
                                        <span className="font-medium">
                                            {category.fields
                                                .filter((f: any) => !f.visibleIn || f.visibleIn.length === 0 || f.visibleIn.includes("materials"))
                                                .map((f: any) => f.key)
                                                .join(", ") || <span className="italic text-gray-400">None</span>
                                            }
                                        </span>
                                    </p>
                                </div>

                                {/* Right Side: Actions */}
                                <div className={`flex items-center justify-end gap-2 ${viewMode === "list" ? "" : "pt-3 border-t border-gray-50"}`}>
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => {
                                            setEditingCategoryId(category._id);
                                            setCategoryName(category.name);
                                            setIsProductSpecific(category.isProductSpecific);
                                            const mappedFields = category.fields.map((f: any) => ({ ...f, oldKey: f.key }));
                                            setFields(mappedFields);
                                            setShowCreateForm(true);
                                        }}
                                    >
                                        <i className="fas fa-edit sm:mr-1" /> <span className={`${viewMode === 'list' ? 'hidden sm:inline' : ''}`}>Edit</span>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => navigate(`single/${category._id}`)}
                                    >
                                        <i className="fas fa-eye sm:mr-1" /> <span className={`${viewMode === 'list' ? 'hidden sm:inline' : ''}`}>View</span>
                                    </Button>

                                    {/* Desktop Delete Button (List Mode) */}
                                    {(canDelete && viewMode === "list") && (
                                        <button
                                            disabled={isPending}
                                            className="flex items-center justify-center w-9 h-9 ml-1 rounded-md text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                            onClick={() => handleDelete(category._id)}
                                        >
                                            {isPending ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-trash-alt" />}
                                        </button>
                                    )}
                                </div>

                            </CardContent>
                        </Card>
                ))}
            </div>
            }
        </div>
    );
}