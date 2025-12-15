import { useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "../../../../components/ui/Input";
// import { Label } from "../../../../components/ui/Label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {  } from "@/hooks/rateconfig";
import { toast } from "../../../../utils/toast";
import { Button } from "../../../../components/ui/Button";
// import { useCreateCategory, useDeleteCategory, useGetCategories } from "../../../../apiList/Quote Api/RateConfig Api/rateConfigApi";
// import { Card, CardContent } from "../../../../components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/Dialog";
import { useCreateLabourRateConfigCategory, useGetLabourRateConfigCategories } from "../../../../apiList/Quote Api/RateConfig Api/labourRateconfigApi";
import LabourRateConfigSingle from "./LabourRateConfigSingle";
import MaterialOverviewLoading from "../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
import StageGuide from "../../../../shared/StageGuide";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/Dialog"; 




export default function LabourRateConfigMain() {
    const { organizationId } = useParams<{ organizationId: string }>();
    // const navigate = useNavigate();
    // const location = useLocation();

    // const isChildRoute = location.pathname.includes("laboursingle");

    const { role, permission } = useAuthCheck();
    const canList = role === "owner" || permission?.materialquote?.list;
    const canCreate = role === "owner" || permission?.materialquote?.create;
    // const canDelete = role === "owner" || permission?.materialquote?.delete;
    // const canEdit = role === "owner" || permission?.materialquote?.edit;


    const [categoryName, setCategoryName] = useState("Labour and Miscellaneous");
    const [fields, setFields] = useState([{ key: "Category", type: "string", required: false }, { key: "Rs", type: "number", required: false }, { key: "notes", type: "string", required: false },]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const { data: categories, isLoading, refetch } = useGetLabourRateConfigCategories(organizationId!);
    const { mutateAsync: createCategory, isPending: createPending } = useCreateLabourRateConfigCategory();
    // const { mutateAsync: deleteCategory, isPending } = useDeleteLabourRateConfigCategory();

    const handleAddField = () => {
        setFields([...fields, { key: "", type: "string", required: false }]);
    };

    const handleFieldChange = (
        index: number,
        field: keyof typeof fields[number],
        value: any
    ) => {
        const updated: any = [...fields];
        updated[index][field] = value;
        setFields(updated);
    };

    const handleCreate = async () => {
        try {
            // if (!organizationId || !categoryName || fields.length === 0) {
            //     return toast({
            //         title: "Error",
            //         description: "Category name and fields are required",
            //         variant: "destructive",
            //     });
            // }

            // const validFields = fields.filter((f) => f.key.trim() !== "");
            // if (validFields.length === 0) {
            //     return toast({
            //         title: "Error",
            //         description: "Please enter valid field keys",
            //         variant: "destructive",
            //     });
            // }


            // await createCategory({
            //     organizationId,
            //     name: categoryName,
            //     fields: validFields,
            // });


            await createCategory({
                organizationId: organizationId!,
                name: categoryName,
                fields: fields,
            });

            setCategoryName("");
            setFields([{ key: "", type: "string", required: false }]);
            setShowCreateForm(false);
            refetch()
            toast({ title: "Success", description: "Category Created Successfully" });
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "failed to create category", variant: "destructive" });
        }
    };



    // const handleDelete = (categoryId: string) => {
    //     try {
    //         deleteCategory({
    //             categoryId: categoryId,
    //             organizationId: organizationId!,
    //         })
    //         refetch()
    //         toast({ title: "Success", description: "Category Deleted Successfully" });

    //     }
    //     catch (error: any) {
    //         toast({ title: "Error", description: error?.response?.data?.message || error?.message || "failed to delete category", variant: "destructive" });
    //     }
    // }
    // if (isChildRoute) return <Outlet />;

    return (
        <div className="space-y-6 max-h-full overflow-y-auto ">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-cubes mr-3 text-blue-600" />
                        Labour Rate Configuration
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your labour's charges here
                    </p>
                </div>


                <section className="flex  gap-3 items-center">

                    {(categories?.length === 0 && canCreate) && <div>
                        {/* <Button onClick={() => setShowCreateForm(true)}>Create New Category</Button> */}
                        <Button onClick={handleCreate} isLoading={createPending}>Create New Category</Button>
                    </div>}

                    <div className="w-full sm:w-auto flex justify-end sm:block">
                        <StageGuide
                            organizationId={organizationId!}
                            stageName="materialquote"
                        />
                    </div>
                </section>


            </header>

            {/* Create Modal */}
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogContent className="px-5 py-6">
                    <DialogHeader className="px-0 py-0">
                        <DialogTitle>Create New Labour Category</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Input
                            placeholder="Labour and Miscellaneous"
                            value={categoryName}
                        // onChange={(e) => setCategoryName(e.target.value)}
                        />

                        <h4 className="text-base font-semibold">Define Fields</h4>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        placeholder="Field key (e.g: Category, Rs, notes)"
                                        value={field.key}
                                        onChange={(e) => handleFieldChange(index, "key", e.target.value)}
                                        className="flex-1"
                                    />
                                    <select
                                        value={field.type}
                                        onChange={(e) =>
                                            handleFieldChange(index, "type", e.target.value)
                                        }
                                        className="  px-2 py-2 rounded-xl border border-blue-200 focus:border-blue-200 active:border-blue-200"
                                    >
                                        <option value="string">text</option>
                                        <option value="number">number</option>
                                        {/* <option value="boolean">boolean</option> */}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between pt-2">
                            <Button variant="secondary" onClick={handleAddField}>
                                + Add Field
                            </Button>
                            <Button isLoading={createPending} onClick={handleCreate}>Create Category</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>


            {!isLoading && categories?.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
                    <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">No Labour Rate Configuration Found</h3>
                    <p className="text-sm text-gray-500">
                        Looks like there are no Labour Rate Configuration yet for this organization.<br />
                        <Button onClick={handleCreate} isLoading={createPending} className="mx-4 my-2">Create New Category</Button>
                    </p>
                </div>)}

            {/* Category Cards Section */}
            {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}

            {isLoading && <MaterialOverviewLoading />}


            {/* {categories?.map((category: any) => (
                    <Card
                        key={category._id}
                        className="w-full border-l-4 border-blue-600 shadow-md bg-white hover:shadow-lg transition-all"
                    >
                        <CardContent className="p-4 space-y-2">
                            <h3 className="text-base font-bold text-blue-700 mb-2">
                                {category.name}
                            </h3>

                            <p className="text-sm text-gray-600 capitalize">
                                Fields:{" "}
                                <strong>{category.fields.map((f: any) => f.key).join(", ")}</strong>
                            </p>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => navigate(`laboursingle/${category._id}`)}
                                >
                                    <i className="fas fa-eye mr-1" />
                                    View
                                </Button>
                                <Button
                                    size="sm"
                                    isLoading={isPending}
                                    variant="danger"
                                    className="bg-red-600 text-white"
                                    onClick={() =>
                                        handleDelete(category._id)
                                    }
                                >
                                    <i className="fas fa-trash mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))} */}

            {(canList && categories?.length > 0) && (
                <LabourRateConfigSingle />
            )}
            {/* </div> */}
        </div>
    );
}