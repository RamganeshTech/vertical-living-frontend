import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { useCreateItems, useDeleteItem, useGetCategories, useGetItemsByCategory } from "../../../apiList/Quote Api/RateConfig Api/rateConfigApi";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

export default function RateConfigSub() {
    const { organizationId, id: categoryId } = useParams<{
        organizationId: string;
        id: string;
    }>();
    const navigate = useNavigate()

    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.materialrateconfig?.list;
    const canCreate = role === "owner" || permission?.materialrateconfig?.create;
    const canDelete = role === "owner" || permission?.materialrateconfig?.delete;
    const canEdit = role === "owner" || permission?.materialrateconfig?.edit;




    const { data: categories } = useGetCategories(organizationId!);
    const { data: existingItems, isLoading, refetch } = useGetItemsByCategory(categoryId!);
    const { mutateAsync: createItems, isPending: createPending } = useCreateItems();
    const { mutateAsync: deleteItem, isPending: deletePending } = useDeleteItem();

    const [rows, setRows] = useState([{ data: {} }]);

    if (isLoading || !categories) return <p>Loading category...</p>;

    const currentCategory = categories?.find((cat: any) => cat._id === categoryId);
    if (!currentCategory) return <p>Category not found</p>;




    //    const handleInputBlur = (index: number) => {
    //   setTimeout(() => {
    //     const isLastRow = index === rows.length - 1;
    //     if (!isLastRow) return;

    //     const currentRow: any = rows[index].data;
    //     const firstFieldKey = currentCategory.fields?.[0]?.key;

    //     console.log("firstFieldKey", firstFieldKey);

    //     const previousRow: any = rows[index - 1]?.data;
    //     const previousFirstFieldValue = previousRow?.[firstFieldKey];

    //     console.log("previousRow", previousRow);

    //     const isCurrentFirstFieldEmpty =
    //       !currentRow?.[firstFieldKey] ||
    //       currentRow[firstFieldKey].toString().trim() === "";

    //     console.log("isCurrentFirstFieldEmpty", isCurrentFirstFieldEmpty);

    //     // Step 1: Auto-copy previous first field value if current is empty
    //     if (isCurrentFirstFieldEmpty && previousFirstFieldValue) {
    //       const updatedRows: any = [...rows];
    //       updatedRows[index].data[firstFieldKey] = previousFirstFieldValue;
    //       setRows(updatedRows);
    //     }

    //     // Step 2: Auto-add another empty row if current row has any values
    //     const isLastRowFilled = Object.values(currentRow).some(
    //       (val) => val !== "" && val !== undefined
    //     );

    //     const lastRow = rows[rows.length - 1];
    //     const isDuplicateEmptyRow =
    //       Object.values(lastRow.data).every((val) => val === "" || val === undefined);

    //     if (isLastRowFilled && !isDuplicateEmptyRow) {
    //       setRows((prev) => [...prev, { data: {} }]);
    //     }
    //   }, 0); // ← This defers the entire logic until blur has fully resolved
    // };

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
                description: "Items created successfully",
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
        <div className="space-y-4 max-h-full overflow-y-auto">
            {/* Sticky Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sticky top-0 bg-white z-10 py-4 border-b">
                <div className='flex gap-2 items-center'>
                    <div onClick={() => navigate(-1)}
                        className='bg-slate-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                        <i className='fas fa-arrow-left'></i></div>
                    <h2 className="text-2xl font-bold text-gray-800">{currentCategory.name}</h2>
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0">
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
                        {/* Existing Items */}
                        {existingItems?.map((item: any, i: number) => (
                            <tr
                                key={`existing-${item?._id}`}
                                // className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                className={`group relative border-none !border-b-1 px-4 py-2  cursor-pointer transition-all duration-200
     hover:bg-gray-50 hover:border-gray-300
  `}
                            >
                                <td
                                    className="border border-gray-100 p-4 font-medium text-center  text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
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
                                            deleteItem({ itemId: item?._id, categoryId: categoryId! })
                                        }
                                    >
                                        <i className="fas fa-trash mr-2"></i>
                                        <span className="">Delete</span>
                                    </Button>
                                </td>}
                            </tr>
                        ))}

                        {/* New Input Rows */}
                        {rows.map((row, rowIndex) => (
                            <tr key={`new-${rowIndex}`} className="group relative border-none !border-b-1 px-4 py-2  cursor-pointer transition-all duration-200
     hover:bg-gray-50 hover:border-gray-300">
                                <td
                                    className="border border-gray-100 p-4 font-medium text-center  text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
                                >
                                    
                                </td>

                                {currentCategory.fields.map((field: any) => (
                                    <td key={field.key}
                                        className="border border-gray-100 px-1 font-medium text-center  text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
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