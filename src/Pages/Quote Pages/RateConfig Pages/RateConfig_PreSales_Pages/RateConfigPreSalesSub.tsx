// import { useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Input } from "../../../../components/ui/Input";
// import { useCreateItems, useDeleteItem, useGetCategories, useGetItemsByCategory, useUpdateItem } from "../../../../apiList/Quote Api/RateConfig Api/rateConfigApi";
// import { Button } from "../../../../components/ui/Button";
// import { toast } from "../../../../utils/toast";
// import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
// import MaterialOverviewLoading from "../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

// export default function RateConfigPreSalesSub() {
//     const { organizationId, id: categoryId } = useParams<{
//         organizationId: string;
//         id: string;
//     }>();
//     const navigate = useNavigate()

//     const { role, permission } = useAuthCheck();
//     // const canList = role === "owner" || permission?.presalesmaterialrateconfig?.list;
//     const canCreate = role === "owner" || permission?.presalesmaterialrateconfig?.create;
//     const canDelete = role === "owner" || permission?.presalesmaterialrateconfig?.delete;
//     const canEdit = role === "owner" || permission?.presalesmaterialrateconfig?.edit;




//     const { data: categories } = useGetCategories(organizationId!);
//     const { data: existingItems, isLoading, refetch } = useGetItemsByCategory(categoryId!);
//     const { mutateAsync: createItems, isPending: createPending } = useCreateItems();
//     const { mutateAsync: deleteItem, isPending: deletePending } = useDeleteItem();
//     const { mutateAsync: updateItem, isPending: updatePending } = useUpdateItem();

//     const [rows, setRows] = useState([{ data: {} }]);
//     const [isEditingId, setIsEditingId] = useState<string | null>(null);
//     const [editValues, setEditValues] = useState<Record<string, any>>({});
//     const [searchTerm, setSearchTerm] = useState("");

//     const currentCategory = categories?.find((cat: any) => cat._id === categoryId);

//     const visibleFields = useMemo(() => {
//     return (currentCategory?.fields || []).filter(
//         (field: any) => field?.key !== "notes"
//     );
// }, [currentCategory]);

//     // 4. FILTER LOGIC (Grounded on the first field key)
//     const filteredItems = useMemo(() => {
//         if (!existingItems) return [];
//         if (!searchTerm.trim()) return existingItems;
//         // if (!currentCategory?.fields?.[0]?.key) return existingItems;

//         const firstFieldKey = currentCategory.fields[0].key;
//         return existingItems.filter((item: any) => {
//             const val = item.data[firstFieldKey]?.toString().toLowerCase() || "";
//             return val.includes(searchTerm.toLowerCase());
//         });
//     }, [existingItems, searchTerm, currentCategory]);


//     if (isLoading || !categories) return <MaterialOverviewLoading />;

//     if (!currentCategory) return <p>Category not found</p>;



//     // 3. Handle Edit Actions
//     const startEditing = (item: any) => {
//         setIsEditingId(item._id);
//         setEditValues({ ...item.data });
//     };

//     const cancelEdit = () => {
//         setIsEditingId(null);
//         setEditValues({});
//     };

//     const handleUpdateSubmit = async (itemId: string) => {
//         try {
//             await updateItem({ itemId, body: editValues, categoryId: categoryId! });
//             toast({ title: "Success", description: "Item updated successfully" });
//             setIsEditingId(null);
//             refetch();
//         } catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message ?? "Update failed",
//                 variant: "destructive"
//             });
//         }
//     };


//     const handleRowChange = (index: number, key: string, value: any) => {
//         const updatedRows: any = [...rows];
//         updatedRows[index].data[key] = value;

//         const firstFieldKey = currentCategory.fields?.[0]?.key;
//         const isLastRow = index === updatedRows.length - 1;
//         const isFirstField = key === firstFieldKey;

//         const isValueFilled = value?.toString().trim() !== "";

//         const alreadyHasEmptyRow =
//             updatedRows.length > 0 &&
//             Object.values(updatedRows[updatedRows.length - 1].data).every(
//                 (val) => val === undefined || val === ""
//             );

//         // ✅ Case 1: Add new row immediately when typing in first field of last row
//         if (isLastRow && isFirstField && isValueFilled && !alreadyHasEmptyRow) {
//             updatedRows.push({ data: {} });
//         }

//         // ✅ Case 2: Remove the last (empty) row only if first field of previous row is cleared
//         // const previousRowIndex = updatedRows.length - 2; // one before last
//         //   const previousRow = updatedRows[previousRowIndex];

//         if (
//             !isValueFilled &&               // current value is cleared
//             isFirstField &&                // you're clearing the first field
//             rows.length > 1                // more than one row exists
//         ) {
//             const lastRow = updatedRows[updatedRows.length - 1];
//             const isLastRowEmpty = Object.values(lastRow.data).every(
//                 (val) => val === undefined || val === ""
//             );

//             // If the last row is empty and the first field above it became empty
//             if (isLastRowEmpty) {
//                 updatedRows.pop();
//             }
//         }

//         setRows(updatedRows);
//     };
//     const handleAddRow = () => setRows([...rows, { data: {} }]);
//     const handleRemoveRow = (index: number) => {
//         const updated = [...rows];
//         updated.splice(index, 1);
//         setRows(updated);
//     };

//     const handleSave = async () => {
//         try {
//             // const newItems = rows.map((row) => row.data);
//             const firstFieldKey = currentCategory.fields?.[0]?.key;

//             const newItems = rows
//                 .map((row) => row.data)
//                 .filter((data: any) => {
//                     const value = data[firstFieldKey];
//                     return value !== undefined && value !== null && value.toString().trim() !== "";
//                 });


//             if (newItems.length === 0)
//                 return toast({
//                     title: "Error",
//                     description: "Nothing to save",
//                     variant: "destructive",
//                 });




//             await createItems({
//                 categoryId: categoryId!,
//                 items: newItems,
//                 organizationId: organizationId!,
//             });

//             toast({
//                 title: "Success",
//                 description: "Items created successfully",
//             });

//             setRows([{ data: {} }]);
//             refetch()
//         }
//         catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message ?? "Operation failed",
//             });
//         }
//     };

//     return (
//         <div className="space-y-4 max-h-full overflow-y-auto">
//             {/* Sticky Header */}
//             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sticky top-0 bg-white z-10 py-4 border-b">
//                 <div className='flex gap-2 items-center'>
//                     <div onClick={() => navigate(-1)}
//                         className='bg-slate-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
//                         <i className='fas fa-arrow-left'></i></div>
//                     <h2 className="text-2xl font-bold text-gray-800">{currentCategory.name}</h2>
//                 </div>
//                 <div className="flex gap-2 mt-3 sm:mt-0">

//                     <div className="relative w-full sm:w-64">
//                         <Input
//                             placeholder={`Search ${currentCategory.fields?.[0]?.key}...`}
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="pl-9 h-10 border-blue-100 focus:border-blue-400"
//                         />
//                         <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
//                     </div>

//                     {/* {(canEdit || canCreate) && <Button onClick={handleAddRow} variant="primary" className="">
//                         + Add Row
//                     </Button>}
//                     {(canEdit || canCreate) && <Button onClick={handleSave} isLoading={createPending} className="bg-blue-600 hover:bg-blue-700 text-white">
//                         <i className="fas fa-file mr-2"></i> Save Items
//                     </Button>} */}
//                 </div>
//             </div>

//             {/* Enhanced Table Layout */}
//             <div className="overflow-x-auto ">
//                 <table className="min-w-full bg-white text-sm">
//                     {/* Table Head */}
//                     <thead
//                         className="bg-blue-50 text-sm font-semibold text-gray-600 px-6 py-1 sm:py-3"
//                     >
//                         <tr>
//                             <th
//                                 className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                                 S.NO
//                             </th>
//                             {visibleFields.map((field: any) => {

//                                 const isManufacturCostPerSqft =  field?.key === "manufacturCostPerSqft"
//                                 return (
//                                 <th key={field.key}
//                                     className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500  tracking-wider"
//                                 >
//                                     {isManufacturCostPerSqft ? "Mfg Cost / Sqft" : field.key}
//                                 </th>
//                             )
//                             }
//                         )
//                         }
//                             <th className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                         </tr>
//                     </thead>

//                     {/* <tbody>
//                         {existingItems?.map((item: any, i: number) => (
//                             <tr
//                                 key={`existing-${item?._id}`}
//                                 // className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
//                                 className={`group relative border-none !border-b-1 px-4 py-2  cursor-pointer transition-all duration-200
//      hover:bg-gray-50 hover:border-gray-300
//   `}
//                             >
//                                 <td
//                                     className="border border-gray-100 p-4 font-medium text-center  text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
//                                 >
//                                     {i + 1 || "—"}
//                                 </td>
//                                 {currentCategory?.fields?.map((field: any) => (
//                                     <td key={field?.key}
//                                         //    className="p-4 border-t text-gray-700"
//                                         className="border border-gray-100 font-medium text-center  text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
//                                     >
//                                         {item?.data[field?.key] ?? "—"}
//                                     </td>
//                                 ))}
//                                 {canDelete && <td className="text-center p-4 border border-gray-100">
//                                     <Button
//                                         size="sm"
//                                         variant="danger"
//                                         isLoading={deletePending}
//                                         className="group text-white bg-red-600"
//                                         onClick={() =>
//                                             deleteItem({ itemId: item?._id, categoryId: categoryId! })
//                                         }
//                                     >
//                                         <i className="fas fa-trash mr-2"></i>
//                                         <span className="">Delete</span>
//                                     </Button>
//                                 </td>}
//                             </tr>
//                         ))}

//                         {rows.map((row, rowIndex) => (
//                             <tr key={`new-${rowIndex}`} className="group relative border-none !border-b-1 px-4 py-2  cursor-pointer transition-all duration-200
//      hover:bg-gray-50 hover:border-gray-300">
//                                 <td
//                                     className="border border-gray-100 p-4 font-medium text-center  text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
//                                 >

//                                 </td>

//                                 {currentCategory.fields.map((field: any) => (
//                                     <td key={field.key}
//                                         className="border border-gray-100 px-1 font-medium text-center  text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
//                                     >
//                                         <Input
//                                             type={field.type === "number" ? "number" : "text"}
//                                             placeholder={field.key}
//                                             className="w-full rounded-md "
//                                             value={(row.data as any)[field.key] || ""}
//                                             onChange={(e) =>
//                                                 handleRowChange(
//                                                     rowIndex,
//                                                     field.key,
//                                                     field.type === "number"
//                                                         ? Number(e.target.value)
//                                                         : e.target.value
//                                                 )
//                                             }
//                                         // onBlur={() => handleInputBlur(rowIndex)}
//                                         />
//                                     </td>
//                                 ))}
//                                 <td className="text-center p-4 border border-gray-100">
//                                     <Button
//                                         size="sm"
//                                         variant="ghost"
//                                         className="group text-white bg-red-600 hover:bg-red-600"
//                                         onClick={() => handleRemoveRow(rowIndex)}
//                                     >
//                                         <i className="fas fa-xmark mr-2"></i> Remove
//                                     </Button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody> */}


//                     <tbody>
//                         {filteredItems?.map((item: any, i: number) => {
//                             const isEditing = isEditingId === item._id;
//                             return (
//                                 <tr key={`existing-${item?._id}`} className={`group border-b border-gray-100 transition-all duration-200 ${isEditing ? "bg-blue-50/50" : "hover:bg-gray-50"}`}>
//                                     <td className="p-4 font-medium text-center text-sm text-gray-700">{i + 1}</td>

//                                     {visibleFields?.map((field: any) => (
//                                         <td key={field?.key} className="p-2 border border-gray-100 text-center">
//                                             {isEditing ? (
//                                                 <Input
//                                                     type={field.type === "number" ? "number" : "text"}
//                                                     value={editValues[field.key] ?? ""}
//                                                     onChange={(e) => setEditValues({
//                                                         ...editValues,
//                                                         [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value
//                                                     })}
//                                                     className="w-full h-8 text-xs"
//                                                 />
//                                             ) : (
//                                                 <span className="text-sm text-gray-700">{item?.data[field?.key] ?? "—"}</span>
//                                             )}
//                                         </td>
//                                     ))}

//                                     <td className="text-center p-4 border border-gray-100">
//                                         <div className="flex justify-center gap-2">
//                                             {isEditing ? (
//                                                 <>
//                                                     <Button size="sm" variant="primary"
//                                                         className="text-white h-8"
//                                                         onClick={() => handleUpdateSubmit(item._id)} isLoading={updatePending}>
//                                                         <i className="fas fa-check"></i>
//                                                     </Button>
//                                                     <Button size="sm" variant="secondary"
//                                                         className="  h-8" onClick={cancelEdit}>
//                                                         <i className="fas fa-x"></i>
//                                                     </Button>
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     {canEdit && <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50 h-8" onClick={() => startEditing(item)}>
//                                                         <i className="fas fa-pen-to-square"></i>
//                                                     </Button>}
//                                                     {canDelete && <Button size="sm" variant="danger" isLoading={deletePending} className="bg-red-600 text-white h-8" onClick={() => deleteItem({ itemId: item?._id, categoryId: categoryId! })}>
//                                                         <i className="fas fa-trash"></i>
//                                                     </Button>}
//                                                 </>
//                                             )}
//                                         </div>
//                                     </td>
//                                 </tr>
//                             );
//                         })}

//                         {/* New Input Rows */}
//                         {/* {rows.map((row, rowIndex) => (
//                             <tr key={`new-${rowIndex}`} className="hover:bg-gray-50 transition-all duration-200">
//                                 <td className="p-4 text-center text-gray-400">—</td>
//                                 {visibleFields.map((field: any) => (
//                                     <td key={field.key} className="p-2 border border-gray-100">
//                                         <Input
//                                             type={field.type === "number" ? "number" : "text"}
//                                             placeholder={field.key}
//                                             className="w-full h-8 text-xs"
//                                             value={(row.data as any)[field.key] || ""}
//                                             onChange={(e) => handleRowChange(rowIndex, field.key, field.type === "number" ? Number(e.target.value) : e.target.value)}
//                                         />
//                                     </td>
//                                 ))}
//                                 <td className="text-center p-4">


//                                     <Button
//                                         size="sm"
//                                         variant="ghost"
//                                         className="group text-white bg-red-600 hover:bg-red-600"
//                                         onClick={() => handleRemoveRow(rowIndex)}
//                                     >
//                                         <i className="fas fa-xmark mr-2"></i> Remove
//                                     </Button>
//                                 </td>
//                             </tr>
//                         ))} */}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }





//  SECOND VERSION




import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Input } from "../../../../components/ui/Input";
import { useCreateItems, useDeleteItem, useGetCategories, useGetItemsByCategory, useUpdateItem } from "../../../../apiList/Quote Api/RateConfig Api/rateConfigApi";
import { Button } from "../../../../components/ui/Button";
import { toast } from "../../../../utils/toast";
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
import MaterialOverviewLoading from "../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { useUpdatePreSalesRateConfigItem } from "../../../../apiList/Quote Api/RateConfig Api/preSalesRateConfigApi";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/Select";
import { materialTypeOptions } from "../RateConfigSub";

export default function RateConfigPreSalesSub() {
    const { organizationId, id: categoryId } = useParams<{
        organizationId: string;
        id: string;
    }>();
    const navigate = useNavigate()
    const location = useLocation()

    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.presalesmaterialrateconfig?.list;
    const canCreate = role === "owner" || permission?.presalesmaterialrateconfig?.create;
    const canDelete = role === "owner" || permission?.presalesmaterialrateconfig?.delete;
    const canEdit = role === "owner" || permission?.presalesmaterialrateconfig?.edit;


    const [previewImage, setPreviewImage] = useState<string | null>(null);


    const { data: categories } = useGetCategories(organizationId!);
    const { data: existingItems, isLoading, refetch } = useGetItemsByCategory(categoryId!);
    const { mutateAsync: createItems, isPending: createPending } = useCreateItems();
    const { mutateAsync: deleteItem, isPending: deletePending } = useDeleteItem();
    const { mutateAsync: updateItem, isPending: updatePending } = useUpdateItem();
    // const { mutateAsync: updateManufacturCost, isPending: updatePending } = useUpdatePreSalesRateConfigItem();

    const [rows, setRows] = useState([{ data: {} }]);
    const [isEditingId, setIsEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Record<string, any>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [materialType, setMaterialType] = useState<string>("All");

    // Default to the first field key if available, otherwise empty string
    const [searchKey, setSearchKey] = useState("");

    const currentCategory = categories?.find((cat: any) => cat._id === categoryId);

    // const visibleFields = useMemo(() => {
    //     return (currentCategory?.fields || []).filter(
    //         (field: any) => field?.key !== "notes"
    //     );
    // }, [currentCategory]);


    const visibleFields = useMemo(() => {
        if (!currentCategory?.fields) return [];

        const filtered = (currentCategory?.fields || []).filter((field: any) => {
            // 1. Identify the visibility configuration from DB
            const visibility = field.visibleIn;
            // const fieldKey = field.key?.toLowerCase();

            // 2. Logic: Only show if 'presales' is in the array
            // Also allow fields with NO visibility config for backward compatibility
            const isVisibleInPreSales = visibility?.includes("presales");
            const hasNoVisibilityConfig = !visibility || !Array.isArray(visibility) || visibility.length === 0;

            // Return true if it matches either condition
            return isVisibleInPreSales || hasNoVisibilityConfig;
        });



        // ✅ SORT LOGIC: Move "image" to the front
        return [...filtered]?.sort((a, b) => {
            const keyA = a.key?.toLowerCase();
            const keyB = b.key?.toLowerCase();

            if (keyA === "image") return -1; // Move image to the start
            if (keyB === "image") return 1;
            return 0; // Keep other fields in their original order
        });

    }, [currentCategory]);

    // // 4. FILTER LOGIC (Grounded on the first field key)
    // const filteredItems = useMemo(() => {
    //     if (!existingItems) return [];
    //     if (!searchTerm.trim()) return existingItems;
    //     // if (!currentCategory?.fields?.[0]?.key) return existingItems;

    //     const firstFieldKey = currentCategory.fields[0].key;
    //     return existingItems.filter((item: any) => {
    //         const val = item.data[firstFieldKey]?.toString().toLowerCase() || "";
    //         return val.includes(searchTerm.toLowerCase());
    //     });
    // }, [existingItems, searchTerm, currentCategory]);


    //  NEW VERSION

    // const filteredItems = useMemo(() => {
    //     if (!existingItems) return [];
    //     if (!searchTerm.trim()) return existingItems;

    //     // If no search key is selected, don't filter or filter all (user's choice)
    //     // Here we use the dynamic searchKey
    //     const activeKey = searchKey;

    //     return existingItems.filter((item: any) => {
    //         // Look up value based on the key selected in the dropdown
    //         const val = item.data[activeKey]?.toString().toLowerCase() || "";
    //         return val.includes(searchTerm.toLowerCase());
    //     });
    // }, [existingItems, searchTerm, searchKey]);



    const isProductSpecific = useMemo(() => currentCategory?.isProductSpecific || false, [currentCategory]);



    // 4. UPDATED FILTER LOGIC: First filter by Material Type, then by Search
    const filteredItems = useMemo(() => {
        if (!existingItems) return [];

        let baseList = [...existingItems];

        // Filter by Material Type if applicable
        if (isProductSpecific && materialType !== "all") {
            baseList = baseList.filter(item =>
                item.materialType?.toLowerCase() === materialType.toLowerCase()
            );
        }

        if (!searchTerm.trim()) return baseList;

        const activeKey = searchKey;
        return baseList.filter((item: any) => {
            const val = item.data[activeKey]?.toString().toLowerCase() || "";
            return val.includes(searchTerm.toLowerCase());
        });
    }, [existingItems, searchTerm, searchKey, materialType, isProductSpecific]);





    // Sync searchKey when category changes
    useEffect(() => {
        if (currentCategory?.fields?.[0]?.key) {
            setSearchKey(currentCategory.fields[0].key);
        }
    }, [currentCategory]);

    if (isLoading || !categories) return <MaterialOverviewLoading />;

    if (!currentCategory) return <p>Category not found</p>;



    // 3. Handle Edit Actions
    const startEditing = (item: any) => {
        setIsEditingId(item._id);
        //     setEditValues({
        //         manufacturCostPerSqft: item?.data?.manufacturCostPerSqft ?? 0
        //     });
        setEditValues({ ...item.data });
    };



    const cancelEdit = () => {
        setIsEditingId(null);
        setEditValues({});
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
            const imageField = currentCategory.fields.find((f: any) => f.type === 'file');

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


            // 2. Prepare FormData
            const formData = new FormData();

            // We need to separate files from text data
            const itemsData = newItems.map((item: any, index) => {
                const rowData = { ...item };

                // If this row has a file, append it to FormData with a unique key
                if (imageField && rowData[imageField.key] instanceof File) {
                    formData.append(`file-${index}`, rowData[imageField.key]);
                    // Remove the File object from the JSON data (backend will replace it with URL)
                    delete rowData[imageField.key];
                }
                return rowData;
            });

            // 3. Append the JSON part
            formData.append("items", JSON.stringify(itemsData));

            formData.append("materialType", materialType);



            await createItems({
                categoryId: categoryId!,
                // items: newItems,
                items: formData as any,
                organizationId: organizationId!,
            });

            toast({
                title: "Success",
                description: "Items created successfully",
            });

            setRows([{ data: {} }]);
            refetch()
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Operation failed",
                variant: "destructive"
            });
        }
    };

    const handleUpdateSubmit = async (itemId: string) => {
        try {


            const formData = new FormData();
            const imageField = currentCategory.fields.find((f: any) => f.type === 'file');

            // Prepare the body
            Object.keys(editValues).forEach((key) => {
                const value = editValues[key];

                if (imageField && key === imageField.key && value instanceof File) {
                    // Append as a file if it's a new upload
                    formData.append("file", value);
                } else {
                    // Append normally for text/numbers
                    formData.append(key, value);
                }
            });




            // await updateItem({ itemId, body: editValues, categoryId: categoryId! });
            await updateItem({
                itemId,
                //  body: editValues,
                body: formData as any, // Cast to any to satisfy TS
                categoryId: categoryId!
            });
            toast({ title: "Success", description: "Item updated successfully" });
            setIsEditingId(null);
            refetch();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message ?? "Update failed",
                variant: "destructive"
            });
        }
    };


    // const handleUpdateSubmit = async (itemId: string) => {
    //     try {
    //         await updateManufacturCost({ itemId, manufacturCostPerSqft: editValues?.manufacturCostPerSqft, categoryId: categoryId! });

    //         toast({ title: "Success", description: "Item updated successfully" });
    //         setIsEditingId(null);
    //         refetch();
    //     } catch (error: any) {
    //         toast({
    //             title: "Error",
    //             description: error?.response?.data?.message ?? "Update failed",
    //             variant: "destructive"
    //         });
    //     }
    // };


    // const handleRowChange = (index: number, key: string, value: any) => {
    //     const updatedRows: any = [...rows];
    //     updatedRows[index].data[key] = value;

    //     const firstFieldKey = currentCategory.fields?.[0]?.key;
    //     const isLastRow = index === updatedRows.length - 1;
    //     const isFirstField = key === firstFieldKey;

    //     const isValueFilled = value?.toString().trim() !== "";

    //     const alreadyHasEmptyRow =
    //         updatedRows.length > 0 &&
    //         Object.values(updatedRows[updatedRows.length - 1].data).every(
    //             (val) => val === undefined || val === ""
    //         );

    //     // ✅ Case 1: Add new row immediately when typing in first field of last row
    //     if (isLastRow && isFirstField && isValueFilled && !alreadyHasEmptyRow) {
    //         updatedRows.push({ data: {} });
    //     }

    //     // ✅ Case 2: Remove the last (empty) row only if first field of previous row is cleared
    //     // const previousRowIndex = updatedRows.length - 2; // one before last
    //     //   const previousRow = updatedRows[previousRowIndex];

    //     if (
    //         !isValueFilled &&               // current value is cleared
    //         isFirstField &&                // you're clearing the first field
    //         rows.length > 1                // more than one row exists
    //     ) {
    //         const lastRow = updatedRows[updatedRows.length - 1];
    //         const isLastRowEmpty = Object.values(lastRow.data).every(
    //             (val) => val === undefined || val === ""
    //         );

    //         // If the last row is empty and the first field above it became empty
    //         if (isLastRowEmpty) {
    //             updatedRows.pop();
    //         }
    //     }

    //     setRows(updatedRows);
    // };
    // const handleAddRow = () => setRows([...rows, { data: {} }]);
    // const handleRemoveRow = (index: number) => {
    //     const updated = [...rows];
    //     updated.splice(index, 1);
    //     setRows(updated);
    // };

    // const handleSave = async () => {
    //     try {
    //         // const newItems = rows.map((row) => row.data);
    //         const firstFieldKey = currentCategory.fields?.[0]?.key;

    //         const newItems = rows
    //             .map((row) => row.data)
    //             .filter((data: any) => {
    //                 const value = data[firstFieldKey];
    //                 return value !== undefined && value !== null && value.toString().trim() !== "";
    //             });


    //         if (newItems.length === 0)
    //             return toast({
    //                 title: "Error",
    //                 description: "Nothing to save",
    //                 variant: "destructive",
    //             });




    //         await createItems({
    //             categoryId: categoryId!,
    //             items: newItems,
    //             organizationId: organizationId!,
    //         });

    //         toast({
    //             title: "Success",
    //             description: "Items created successfully",
    //         });

    //         setRows([{ data: {} }]);
    //         refetch()
    //     }
    //     catch (error: any) {
    //         toast({
    //             title: "Error",
    //             description: error?.response?.data?.message ?? "Operation failed",
    //         });
    //     }
    // };


    const isChild = location.pathname.includes("description")


    if (isChild) {
        return <Outlet />
    }

    return (
        <div className="space-y-4 max-h-full overflow-y-auto">
            {/* Sticky Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sticky top-0 bg-white z-10 py-4 border-b">
                <div className='flex gap-2 items-center'>
                    <div onClick={() => navigate(-1)}
                        className='bg-slate-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                        <i className='fas fa-arrow-left'></i></div>
                    <h2 className="text-2xl font-bold text-gray-800">{currentCategory.name}</h2>


                    {isProductSpecific && (
                        <div className="w-full sm:w-56">
                            <Select value={materialType} onValueChange={setMaterialType}>
                                <SelectTrigger
                                    className="h-10 border-amber-100 bg-white rounded-xl focus:ring-amber-400 px-0 overflow-hidden shadow-sm"
                                >
                                    <div className="flex items-center h-full w-full">
                                        {/* FIXED LABEL: Always visible on the left in Amber */}
                                        <div className="bg-amber-50 h-full px-3 flex items-center border-r border-amber-100 shrink-0">
                                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-tighter">
                                                Material Type
                                            </span>
                                        </div>

                                        {/* DYNAMIC VALUE: Shows what you selected */}
                                        <div className="px-3 truncate text-[13px] font-bold text-slate-700">
                                            <SelectValue
                                                placeholder="Select Type"
                                                selectedValue={materialType}
                                            />
                                        </div>
                                    </div>
                                </SelectTrigger>

                                <SelectContent className="rounded-xl border-amber-100 p-1 shadow-2xl">
                                    {materialTypeOptions.map((type) => {
                                        // Logic: 3 or fewer chars = UPPERCASE, else = Sentence Case
                                        const formattedType = type.length <= 5
                                            ? type.toUpperCase()
                                            : type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

                                        return (
                                            <SelectItem
                                                key={type}
                                                value={type}
                                                className="text-[12px] font-semibold py-2.5 px-3 cursor-pointer rounded-lg hover:bg-amber-50 focus:bg-amber-50 transition-all border-b border-slate-50 last:border-0"
                                            >
                                                {formattedType}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0">

                    {/* <div className="relative w-full sm:w-64">
                        <Input
                            placeholder={`Search ${currentCategory.fields?.[0]?.key}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 border-blue-100 focus:border-blue-400"
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    </div> */}

                    <div className="w-full sm:w-56">
                        <Select
                            value={searchKey}
                            onValueChange={(val) => setSearchKey(val)}
                        >
                            <SelectTrigger
                                className="h-10 border-blue-100 bg-white rounded-xl focus:ring-blue-400 px-0 overflow-hidden"
                            >
                                <div className="flex items-center h-full w-full">
                                    {/* FIXED LABEL: Always visible on the left */}
                                    <div className="bg-blue-50 h-full px-3 flex items-center border-r border-blue-100 shrink-0">
                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">
                                            Search By
                                        </span>
                                    </div>

                                    {/* DYNAMIC VALUE: The selected field name */}
                                    <div className="px-3 truncate text-[13px] font-bold text-slate-700">
                                        <SelectValue
                                            placeholder="Field"
                                            selectedValue={searchKey}
                                        />
                                    </div>
                                </div>
                            </SelectTrigger>

                            {/* CONTENT: With improved spacing and separation */}
                            <SelectContent className="rounded-xl border-blue-100 p-1 shadow-2xl">
                                {visibleFields.map((field: any) => (
                                    <SelectItem
                                        key={field.key}
                                        value={field.key}
                                        className="text-[12px] font-semibold py-2.5 px-3 cursor-pointer rounded-lg hover:bg-blue-50 focus:bg-blue-50 transition-all border-b border-slate-50 last:border-0"
                                    >
                                        {field.key === "manufacturCostPerSqft" ? "MFG Cost / Sqft" : field.key}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 2. SEARCH INPUT */}
                    <div className="relative w-full sm:w-64">
                        <Input
                            placeholder={`Search ${searchKey}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 border-blue-100 focus:border-blue-400 rounded-xl text-[11px]"
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    </div>

                    {(canEdit || canCreate) && <Button onClick={handleAddRow} variant="primary" className="">
                        + Add Row
                    </Button>}
                    {(canEdit || canCreate) && <Button onClick={handleSave} isLoading={createPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <i className="fas fa-file mr-2"></i> Save Items
                    </Button>}

                    <Button
                        onClick={() => navigate(`description`)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-xl text-[11px] font-bold shadow-sm px-4 shrink-0"
                    >
                        <i className="fas fa-file-alt mr-2"></i> Scope
                    </Button>
                </div>
            </div>

            {/* Enhanced Table Layout */}
            <div className="overflow-x-auto min-h-[450px]">
                <table className="min-w-full bg-white text-sm">
                    {/* Table Head */}
                    <thead
                        className="bg-blue-50 text-sm font-semibold text-gray-600 px-6 py-1 sm:py-3"
                    >
                        <tr>
                            <th
                                className="text-center w-[50px] px-2 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                S.NO
                            </th>
                            {visibleFields.map((field: any) => {

                                const isManufacturCostPerSqft = field?.key === "manufacturCostPerSqft"

                                // Check for description to give it more space
                                const isLongField = field?.key?.toLowerCase().includes("description") || field?.key?.toLowerCase().includes("notes")

                                return (
                                    <th key={field.key}
                                        // className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500  tracking-wider"
                                        className={`text-center px-2 py-3 text-xs font-medium text-gray-500 tracking-wider ${isLongField ? 'min-w-[200px]' : 'min-w-[70px] max-w-[80px]'}`}
                                    >
                                        {isManufacturCostPerSqft ? "Mfg Cost / Sqft" : field.key}
                                    </th>
                                )
                            }
                            )
                            }
                            <th className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>


                    <tbody>
                        {filteredItems?.map((item: any, i: number) => {
                            const isEditing = isEditingId === item._id;
                            return (
                                <tr key={`existing-${item?._id}`} className={`group border-b border-gray-100 transition-all duration-200 ${isEditing ? "bg-blue-50/50" : "hover:bg-gray-50"}`}>
                                    <td className=" w-[50px] p-2 font-medium text-center text-sm text-gray-700">{i + 1}</td>

                                    {visibleFields?.map((field: any) => {
                                        // const isManufacturField = field.key === "manufacturCostPerSqft";

                                        // Define fields that should NOT be editable
                                        // const restrictedKeys = ["brand", "description", "thickness", "thickness (mm)", "Rs", "rs", "Materials And labour rate", "unit"];
                                        // const isRestricted = restrictedKeys.includes(field?.key?.toLowerCase());
                                        const isLongField = field?.key?.toLowerCase().includes("description") || field?.key?.toLowerCase().includes("notes");

                                        return (
                                            <td key={field?.key}
                                                // className="p-2 border border-gray-100 text-center"
                                                className={`p-1 border border-gray-100 text-center ${isLongField ? 'min-w-[10px] !max-w-[100px]' : 'min-w-[80px] max-w-[100px]'}`}

                                            >
                                                {/* {isEditing ? 
                                                (
                                                    <Input
                                                        type={field.type === "number" ? "number" : "text"}
                                                        value={editValues[field.key] || ""}
                                                        onChange={(e) => setEditValues({
                                                            ...editValues,
                                                            [field.key]: field.type === "number" ? Math.max(0, Number(e.target.value)) : e.target.value
                                                        })}
                                                        className="!w-full no-arrow max-w-[150px] h-10 text-sm"
                                                    />
                                                )
                                                : (
                                                    <span className="text-sm text-gray-700">{item?.data[field?.key] || "—"}</span>
                                                )} */}


                                                {isEditing ? (
                                                    field.type === "file" ? (
                                                        /* IMAGE UPLOAD RENDER */
                                                        <div className="flex flex-col items-center gap-1">
                                                            <Input
                                                                type="file"
                                                                accept="image/*"
                                                                className="w-full h-9 text-[10px] px-1"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        // Update editValues with the File object
                                                                        setEditValues({ ...editValues, [field.key]: file });
                                                                    }
                                                                }}
                                                            />
                                                            {/* Optional: Show filename if already present */}
                                                            {typeof editValues[field.key] === 'string' && (
                                                                <span className="text-[9px] text-blue-600 truncate max-w-[100px]">
                                                                    Current: {editValues[field.key].split('/').pop()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )
                                                        : (
                                                            <Input
                                                                type={field.type === "number" ? "number" : "text"}
                                                                value={editValues[field.key] || ""}
                                                                onChange={(e) => setEditValues({
                                                                    ...editValues,
                                                                    [field.key]: field.type === "number" ? Math.max(0, Number(e.target.value)) : e.target.value
                                                                })}
                                                                className="w-full h-10 text-sm"
                                                            />
                                                        ))
                                                    :
                                                    (
                                                        /* VIEW MODE */
                                                        field.type === "file" ? (
                                                            item?.data[field.key] ? (
                                                                <div className="flex justify-center">
                                                                    <img
                                                                        src={item?.data[field?.key]}
                                                                        alt={field?.key}
                                                                        onClick={() => setPreviewImage(item?.data[field?.key])}
                                                                        className="w-20 h-20 rounded-md object-cover border-2 border-blue-100 cursor-pointer hover:scale-110 transition-transform shadow-sm"
                                                                        title="Click to preview"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="flex justify-center">
                                                                    <div className="w-20 h-20 rounded-md bg-slate-50 flex items-center justify-center border border-dashed border-slate-200">
                                                                        <i className="fas fa-image text-slate-300 text-[10px]"></i>
                                                                    </div>
                                                                </div>
                                                            )
                                                        ) :

                                                            (
                                                                <span className="text-sm text-gray-700">{item?.data[field?.key] || "—"}</span>
                                                            )
                                                    )


                                                }
                                            </td>
                                        )
                                    }

                                    )}

                                    <td className="text-center p-4 border border-gray-100">
                                        <div className="flex justify-center gap-2">
                                            {isEditing ? (
                                                <>
                                                    <Button size="sm" variant="primary"
                                                        className="text-white !w-4 h-7"
                                                        onClick={() => handleUpdateSubmit(item._id)} isLoading={updatePending}>
                                                        <i className="fas fa-check"></i>
                                                    </Button>
                                                    <Button size="sm" variant="secondary"
                                                        className="!w-4 h-7" onClick={cancelEdit}>
                                                        <i className="fas fa-x"></i>
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    {canEdit && <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50 h-8" onClick={() => startEditing(item)}>
                                                        <i className="fas fa-pen-to-square"></i>
                                                    </Button>}
                                                    {canDelete && <Button size="sm" variant="danger" isLoading={deletePending} className="bg-red-600 text-white h-8" onClick={() => deleteItem({ itemId: item?._id, categoryId: categoryId! })}>
                                                        <i className="fas fa-trash"></i>
                                                    </Button>}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {/* New Input Rows */}
                        {rows.map((row, rowIndex) => (
                            <tr key={`new-${rowIndex}`} className="hover:bg-gray-50 transition-all duration-200">
                                <td className="p-4 text-center text-gray-400">—</td>
                                {visibleFields.map((field: any) => (
                                    <td key={field.key} className="p-2 border border-gray-100">
                                        <Input
                                            type={field.type === "number" ? "number" : "text"}
                                            placeholder={field.key}
                                            className="w-full h-8 text-xs"
                                            value={(row.data as any)[field.key] || ""}
                                            onChange={(e) => handleRowChange(rowIndex, field.key, field.type === "number" ? Math.max(0, Number(e.target.value)) : e.target.value)}
                                        />
                                    </td>
                                ))}
                                <td className="text-center p-4">


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



            {previewImage && (
                <section className="fixed inset-0 z-[999] flex items-center justify-center p-0 animate-in fade-in duration-200">
                    {/* Backdrop: Clicking anywhere outside the image closes it */}
                    <div
                        className="absolute inset-0 bg-black/90 cursor-zoom-out"
                        onClick={() => setPreviewImage(null)}
                    />

                    {/* Content Container */}
                    <div className="relative z-[1000] flex flex-col items-center">
                        {/* Close Button: Positioned absolutely relative to the image container */}
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors p-2"
                        >
                            <i className="fas fa-times text-2xl"></i>
                        </button>

                        {/* Image: No shadow, no border, no rounded corners */}
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-screen max-h-screen object-contain pointer-events-auto"
                            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the image itself
                        />
                    </div>
                </section>
            )}
        </div>
    );
}