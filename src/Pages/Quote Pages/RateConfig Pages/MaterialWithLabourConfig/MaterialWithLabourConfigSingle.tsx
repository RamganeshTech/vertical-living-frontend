import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../../../components/ui/Input";
// import { useCreateItems, useDeleteItem, useGetCategories, useGetItemsByCategory } from "../../../apiList/Quote Api/RateConfig Api/rateConfigApi";
import { Button } from "../../../../components/ui/Button";
import { toast } from "../../../../utils/toast";
// import { useCreateLabourRateConfigItems, useDeleteLabourRateConfigItem, useGetItemsByLabourRateConfigCategory, useGetLabourRateConfigCategories } from "../../../../apiList/Quote Api/RateConfig Api/labourRateconfigApi";
import MaterialOverviewLoading from "../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
import { useCreateMaterialWithLabourRateConfigItems, useDeleteMaterialWithLabourRateConfigItem, useGetItemsByMaterialWithLabourRateConfigCategory, useGetMaterialWithLabourRateConfigCategories, useUpdateMaterialWithLabourRateConfigItem } from "../../../../apiList/Quote Api/RateConfig Api/rateConfigLabourwithMaterialApi";

export default function MaterialWithLabourSingle({
    categoryId
}: { categoryId?: string }) {
    const { organizationId } = useParams<{
        organizationId: string;
        // id: string;
    }>();
    const navigate = useNavigate()

    console.log("categoryId", categoryId)

    const { data: categories } = useGetMaterialWithLabourRateConfigCategories(organizationId!,);
    const { data: existingItems, isLoading, refetch } = useGetItemsByMaterialWithLabourRateConfigCategory(organizationId!, categoryId!);
    const { mutateAsync: createItems, isPending: createPending } = useCreateMaterialWithLabourRateConfigItems();
    const { mutateAsync: deleteItem, isPending: deletePending } = useDeleteMaterialWithLabourRateConfigItem();
    const { mutateAsync: updateItem, isPending: updatePending } = useUpdateMaterialWithLabourRateConfigItem();




    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.materialwithlabourratequote?.list;
    const canCreate = role === "owner" || permission?.materialwithlabourratequote?.create;
    const canDelete = role === "owner" || permission?.materialwithlabourratequote?.delete;
    const canEdit = role === "owner" || permission?.materialwithlabourratequote?.edit;




    const [rows, setRows] = useState([{ data: {} }]);


    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({});
    const [searchTerm, setSearchTerm] = useState("");



    const currentCategory = (categories || [])?.find((cat: any) => cat._id === categoryId);



    // 4. Filter Logic (Searching based on the first field key)
    const filteredItems = useMemo(() => {
        if (!existingItems) return [];
        if (!searchTerm.trim()) return existingItems;
        // if (!currentCategory?.fields?.[0]?.key) return existingItems;

        const firstFieldKey = currentCategory.fields[0].key;
        return existingItems.filter((item: any) => {
            const val = item.data[firstFieldKey]?.toString().toLowerCase() || "";
            return val.includes(searchTerm.toLowerCase());
        });
    }, [existingItems, searchTerm, currentCategory]);


    if (isLoading) return <MaterialOverviewLoading />;



    if (!currentCategory) return <p>Category not found</p>;


    // Update your existing startEditing
    const startEditing = (item: any) => {
        setEditValues({ ...item.data }); // Clone the nested data object
        setIsEditing(item._id); // Store the ID of the row being edited
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditValues({});
    };

    const handleUpdateSubmit = async (itemId: string,) => {
        try {
            await updateItem({
                itemId: itemId, body: editValues, categoryId: categoryId!
            });

            toast({
                title: "Success",
                description: "field update successfully",
            });

            setIsEditing(false); // Reset editing state
            setEditValues({});
            refetch();
            refetch()
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message ?? "Operation failed",
            });
        }
    };




    const handleRowChange = (index: number, key: string, value: any) => {
        const updatedRows: any = [...rows];
        updatedRows[index].data[key] = value;

        const firstFieldKey = currentCategory.fields?.[0]?.key;
        const isLastRow = index === updatedRows.length - 1;
        const isFirstField = key === firstFieldKey;

        const isValueFilled = value?.toString().trim() !== "";

        const alreadyHasEmptyRow =
            updatedRows.length > 0 &&
            Object.values(updatedRows[updatedRows.length - 1].data).every(
                (val) => val === undefined || val === ""
            );

        // ✅ Case 1: Add new row immediately when typing in first field of last row
        if (isLastRow && isFirstField && isValueFilled && !alreadyHasEmptyRow) {
            updatedRows.push({ data: {} });
        }

        // ✅ Case 2: Remove the last (empty) row only if first field of previous row is cleared
        // const previousRowIndex = updatedRows.length - 2; // one before last
        //   const previousRow = updatedRows[previousRowIndex];

        if (
            !isValueFilled &&               // current value is cleared
            isFirstField &&                // you're clearing the first field
            rows.length > 1                // more than one row exists
        ) {
            const lastRow = updatedRows[updatedRows.length - 1];
            const isLastRowEmpty = Object.values(lastRow.data).every(
                (val) => val === undefined || val === ""
            );

            // If the last row is empty and the first field above it became empty
            if (isLastRowEmpty) {
                updatedRows.pop();
            }
        }

        setRows(updatedRows);
    };
    const handleAddRow = () => setRows([...rows, { data: {} }]);
    const handleRemoveRow = (index: number) => {
        const updated = [...rows];
        updated.splice(index, 1);
        setRows(updated);
    };

    const handleSave = async () => {
        try {
            // const newItems = rows.map((row) => row.data);
            const firstFieldKey = currentCategory.fields?.[0]?.key;

            const newItems = rows
                .map((row) => row.data)
                .filter((data: any) => {
                    const value = data[firstFieldKey];
                    return value !== undefined && value !== null && value.toString().trim() !== "";
                });


            if (newItems.length === 0)
                return toast({
                    title: "Error",
                    description: "Nothing to save",
                    variant: "destructive",
                });




            await createItems({
                categoryId: categoryId!,
                items: newItems,
                organizationId: organizationId!,
            });

            toast({
                title: "Success",
                description: "field created successfully",
            });

            setRows([{ data: {} }]);
            refetch()
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message ?? "Operation failed",
            });
        }
    };

    return (
        <div className="space-y-4  ">
            {/* Sticky Header */}
            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center sticky top-0 bg-white z-10">
                {!categoryId && <div className='flex gap-2 items-center'>
                    <button onClick={() => navigate(-1)}
                        className='bg-slate-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                        <i className='fas fa-arrow-left'></i>
                    </button>
                    <div>

                        <h2 className="text-2xl font-bold text-gray-800">{currentCategory.name}</h2>

                        <span className="block  text-gray-500">
                            * Enter the rupees per head (Every field will be added for single labour cost)
                        </span>
                    </div>


                </div>}
                <div className="flex gap-2 mt-3 sm:mt-0  absolute top-[-73px] right-[43px]  ">

                    <div className="relative w-full sm:w-64">
                        <Input
                            placeholder={`Search ${currentCategory.fields?.[0]?.key}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 border-blue-100"
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    </div>

                    {(canEdit || canCreate) && <Button onClick={handleAddRow} variant="primary" className="">
                        + Add Row
                    </Button>}
                    {(canEdit || canCreate) && <Button onClick={handleSave} isLoading={createPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <i className="fas fa-file mr-2"></i> Save Items
                    </Button>}
                </div>
            </div>

            {/* Enhanced Table Layout */}
            <div className="overflow-x-auto ">
                <table className="min-w-full bg-white text-sm">
                    {/* Table Head */}
                    <thead
                        className="bg-blue-50 text-sm font-semibold text-gray-600 px-6 py-1 sm:py-3"
                    >
                        <tr>
                            <th
                                className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                S.NO
                            </th>
                            {currentCategory.fields.map((field: any) => (
                                <th key={field.key}
                                    className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {field.key}
                                </th>
                            ))}
                            <th className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* {existingItems?.map((item: any, i: number) => (
                                <tr
                                    key={`existing-${item?._id}`}
                                    // className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                    className={`group relative border-none !border-b-1 px-4 py-2  cursor-pointer transition-all duration-200
        hover:bg-gray-50 hover:border-gray-300
    `}
                                >
                                    <td
                                        className="border border-gray-100 font-medium text-center p-4  text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
                                    >
                                        {i + 1 || "—"}
                                    </td>
                                    {currentCategory?.fields?.map((field: any) => (
                                        <td key={field?.key}
                                            //    className="p-4 border-t text-gray-700"
                                            className="border border-gray-100 font-medium text-center  text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
                                        >
                                            {item?.data[field?.key] ?? "—"}
                                        </td>
                                    ))}
                                    {canDelete && <td className="text-center p-4 border border-gray-100">
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            isLoading={deletePending}
                                            className="group text-white bg-red-600"
                                            onClick={() =>
                                                deleteItem({ itemId: item?._id, organizationId: organizationId! })
                                            }
                                        >
                                            <i className="fas fa-trash mr-2"></i>
                                            <span className="">Delete</span>
                                        </Button>
                                    </td>}
                                </tr>
                            ))} */}


                        {filteredItems?.map((item: any, i: number) => {
                            const isThisRowEditing = isEditing === item._id;

                            return (
                                <tr
                                    key={`existing-${item?._id}`}
                                    className={`group border-b border-gray-100 transition-all duration-200 ${isThisRowEditing ? "bg-blue-50/30" : "hover:bg-gray-50"}`}
                                >
                                    <td className="border border-gray-100 font-medium text-center p-4 text-sm text-gray-700">
                                        {i + 1}
                                    </td>

                                    {currentCategory?.fields?.map((field: any) => (
                                        <td key={field?.key} className="border border-gray-100 p-2 text-center">
                                            {isThisRowEditing ? (
                                                <Input
                                                    type={field.type === "number" ? "number" : "text"}
                                                    value={(editValues as any)[field.key] || ""}
                                                    className="w-full h-10 text-sm"
                                                    onChange={(e) =>
                                                        setEditValues({
                                                            ...editValues,
                                                            [field.key]: field.type === "number" ? Math.max(0,Number(e.target.value)) : e.target.value,
                                                        })
                                                    }
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-700 font-medium">
                                                    {item?.data[field?.key] ?? "—"}
                                                </span>
                                            )}
                                        </td>
                                    ))}

                                    <td className="text-center p-4 border border-gray-100">
                                        <div className="flex justify-center gap-2">
                                            {isThisRowEditing ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        className="text-white h-8"
                                                        onClick={() => handleUpdateSubmit(item._id)}
                                                        isLoading={updatePending}
                                                    >
                                                        <i className="fas fa-check"></i>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="  h-8"
                                                        onClick={cancelEditing}
                                                    >
                                                        <i className="fas fa-xmark"></i>
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    {canEdit && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-blue-600  h-8 w-8 p-0"
                                                            onClick={() => startEditing(item)}
                                                        >
                                                            <i className="fas fa-pen-to-square"></i>
                                                        </Button>
                                                    )}
                                                    {canDelete && (
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            isLoading={deletePending}
                                                            className="bg-red-600 text-white h-8 w-8 p-0"
                                                            onClick={() =>
                                                                deleteItem({ itemId: item?._id, organizationId: organizationId! })
                                                            }
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {rows.map((row, rowIndex) => (
                            <tr key={`new-${rowIndex}`} className="group relative border-none !border-b-1 px-4 py-2  cursor-pointer transition-all duration-200
                                    hover:bg-gray-50 hover:border-gray-300">
                                <td className="border border-gray-100 px-4 font-medium text-center  
                                        text-sm text-gray-700 group-hover:text-gray-900 
                                        transition-colors duration-200">
                                    {/* {existingItems?.length ? existingItems.length + 1 : 1} */}
                                    {existingItems.length + rowIndex + 1}
                                </td>
                                {currentCategory.fields.map((field: any) => (
                                    <td key={field.key}
                                        className="border border-gray-100 px-4 font-medium text-center  text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
                                    >
                                        <Input
                                            type={field.type === "number" ? "number" : "text"}
                                            placeholder={field.key}
                                            className="w-full rounded-md "
                                            value={(row.data as any)[field.key] || ""}
                                            onChange={(e) =>
                                                handleRowChange(
                                                    rowIndex,
                                                    field.key,
                                                    field.type === "number"
                                                        ? Number(e.target.value)
                                                        : e.target.value
                                                )
                                            }
                                        // onBlur={() => handleInputBlur(rowIndex)}
                                        />
                                    </td>
                                ))}
                                <td className="text-center p-4 border border-gray-100">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="group text-white bg-red-600 hover:bg-red-600"
                                        onClick={() => handleRemoveRow(rowIndex)}
                                    >
                                        <i className="fas fa-xmark mr-2"></i> Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}