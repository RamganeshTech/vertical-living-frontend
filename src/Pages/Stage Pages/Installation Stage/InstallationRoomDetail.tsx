import  { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useGetInstallationDetails, useCreateInstallationItem,
    useEditInstallationItem,
    useDeleteInstallationItem
} from "../../../apiList/Stage Api/installationWorkApi";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import type { InstallationWorkItem } from "../../../types/types";
import RoomDetailsLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/RoomDetailLoading";
import { dateFormate } from "../../../utils/dateFormator";


// const dummyInstallationWorkItems: (InstallationWorkItem & { _id: string })[] = [
// {
//     _id: "id001",
//     workName: "Roof Waterproofing",
//     descritpion: "Applied waterproof coating on roof.",
//     completedDate: new Date("2025-06-27"),
//     upload: {
//         type: "image",
//         url: "https://example-bucket.s3.amazonaws.com/uploads/roof-waterproofing.jpg",
//         originalName: "roof-waterproofing.jpg",
//         uploadedAt: new Date("2025-06-27T09:15:00Z")
//     }
// },
// {
//     _id: "id002",
//     workName: "Door Fitting",
//     descritpion: "Installed main entrance door.",
//     completedDate: new Date("2025-06-26"),
//     upload: null
// },
// {
//     _id: "id003",
//     workName: "Tile Laying",
//     descritpion: "Laid new tiles in bathroom.",
//     completedDate: new Date("2025-06-25"),
//     upload: {
//         type: "image",
//         url: "https://example-bucket.s3.amazonaws.com/uploads/bathroom-tiles.jpg",
//         originalName: "bathroom-tiles.jpg",
//         uploadedAt: new Date("2025-06-25T11:00:00Z")
//     }
// },
// {
//     _id: "id004",
//     workName: "Ceiling POP",
//     descritpion: "Completed false ceiling POP work.",
//     completedDate: new Date("2025-06-29"),
//     upload: {
//         type: "pdf",
//         url: "https://example-bucket.s3.amazonaws.com/uploads/ceiling-plan.pdf",
//         originalName: "ceiling-plan.pdf",
//         uploadedAt: new Date("2025-06-29T14:30:00Z")
//     }
// },
// {
//     _id: "id005",
//     workName: "Electrical Board Fix",
//     descritpion: "Installed electrical distribution board.",
//     completedDate: new Date("2025-06-30"),
//     upload: null
// },
// {
//     _id: "id006",
//     workName: "Floor Polishing",
//     descritpion: "Polished marble floor in living room.",
//     completedDate: new Date("2025-06-28"),
//     upload: {
//         type: "image",
//         url: "https://example-bucket.s3.amazonaws.com/uploads/floor-polish.jpg",
//         originalName: "floor-polish.jpg",
//         uploadedAt: new Date("2025-06-28T13:00:00Z")
//     }
// },
// {
//     _id: "id007",
//     workName: "Bathroom Fittings",
//     descritpion: "Fitted new faucets and shower heads.",
//     completedDate: new Date("2025-06-27"),
//     upload: {
//         type: "image",
//         url: "https://example-bucket.s3.amazonaws.com/uploads/bathroom-fittings.jpg",
//         originalName: "bathroom-fittings.jpg",
//         uploadedAt: new Date("2025-06-27T10:30:00Z")
//     }
// },
// {
//     _id: "id008",
//     workName: "Staircase Railing",
//     descritpion: "Installed staircase railings.",
//     completedDate: new Date("2025-06-25"),
//     upload: null
// },
// {
//     _id: "id009",
//     workName: "Garden Landscaping",
//     descritpion: "Planted shrubs and laid grass.",
//     completedDate: new Date("2025-06-28"),
//     upload: {
//         type: "image",
//         url: "https://example-bucket.s3.amazonaws.com/uploads/garden.jpg",
//         originalName: "garden.jpg",
//         uploadedAt: new Date("2025-06-28T15:00:00Z")
//     }
// },
// {
//     _id: "id010",
//     workName: "Kitchen Countertop",
//     descritpion: "Installed granite countertop in kitchen.",
//     completedDate: new Date("2025-06-29"),
//     upload: {
//         type: "pdf",
//         url: "https://example-bucket.s3.amazonaws.com/uploads/countertop-specs.pdf",
//         originalName: "countertop-specs.pdf",
//         uploadedAt: new Date("2025-06-29T16:30:00Z")
//     }
// }
// ];



export default function InstallationRoomDetail() {
    const { roomkey, projectId, organizationId } = useParams() as { roomkey: string; projectId: string, organizationId: string };
    const navigate = useNavigate()

    const [popupImage, setPopupImage] = useState<string | null>(null);

    const { data, isLoading, refetch, error, isError } = useGetInstallationDetails(projectId);
    const { mutateAsync: createItem,  isPending: createPending } = useCreateInstallationItem();
    const { mutateAsync: editItem,    isPending: editPending } = useEditInstallationItem();
    const { mutateAsync: deleteItem,  isPending: deletePending } = useDeleteInstallationItem();

    const [form, setForm] = useState({
        workName: "",
        descritpion: "",
        completedDate: "",
        file: undefined as File | undefined,
    });


    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);


    // if (isLoading) return <MaterialOverviewLoading />

    const items: (InstallationWorkItem & { _id: string })[] = data?.[roomkey] || [];
    // const items = dummyInstallationWorkItems


    const handleAdd = async () => {
        try {
            if (!form.workName.trim()) {
                throw new Error("work Name field is mandatory")
            }

            const formData = new FormData();
            formData.append("workName", form.workName);
            if (form.descritpion) formData.append("descritpion", form.descritpion);
            if (form.completedDate) formData.append("completedDate", form.completedDate);
            if (form.file) formData.append("file", form.file);

            await createItem({
                projectId,
                roomName: roomkey,
                formData,
            });
            setAdding(false)
            toast({ description: 'created successfully', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

        }
    };


    const handleEdit = async () => {
        try {
            if (!editingId) return;

            if (!form.workName.trim()) {
                throw new Error("work Name field is mandatory")
            }

            const formData = new FormData();
            formData.append("itemId", editingId);
            if (form.workName) formData.append("workName", form.workName);
            if (form.descritpion) formData.append("descritpion", form.descritpion);
            if (form.completedDate) formData.append("completedDate", form.completedDate);
            if (form.file) formData.append("file", form.file);

            await editItem(
                { projectId, roomName: roomkey, formData },
                {
                    onSuccess: () => {
                        setForm({ workName: "", descritpion: "", completedDate: "", file: undefined });
                        setEditingId(null);
                    },
                }
            );
            toast({ description: 'edited successfully', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

        }
    };


    const handleDelete = async (itemId: string) => {
        try {
            await deleteItem({ projectId, roomName: roomkey, itemId });
            toast({ description: 'deleted successfully', title: "Success" });
            refetch()
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

        }
    };


    const resetForm = () => {
        setForm({ workName: "", descritpion: "", completedDate: "", file: undefined });
        setAdding(false);
        setEditingId(null);
    };


    if (isLoading) return <RoomDetailsLoading />;

    if (isError) {
        <div className="flex-1 flex items-center justify-center">
            <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                <div className="text-red-600 font-semibold mb-2">
                    ⚠️ Error Occurred
                </div>
                <p className="text-red-500 text-sm mb-4">
                    {(error as any)?.response?.data?.message || "Failed to load material arrival data"}
                </p>
                <Button
                    onClick={() => refetch()}
                    className="bg-red-600 text-white hover:bg-red-700"
                >
                    Retry
                </Button>
            </div>
        </div>
    }

    return (
        <div className="w-full h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold mb-4">Room: {roomkey}</h1>
                <Button variant="primary" className="" onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/installation`)}>
                    Go Back
                </Button>
            </div>

            {items.length === 0 && !adding ? (
                <>
                    <div className="grid grid-cols-5 mb-2  gap-2 font-semibold bg-blue-100  text-blue-900 p-2 rounded ">
                        <div className="text-center">Work Name</div>
                        <div className="text-center">Description</div>
                        <div className="text-center">Completed Date</div>
                        <div className="text-center">Upload</div>
                        <div className="text-center">Actions</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-12 shadow rounded-lg bg-white">
                        <i className="fas fa-tasks text-3xl text-blue-400 mb-2"></i>
                        <p className="text-blue-600 mb-4 text-sm">No works added yet for this room.</p>
                        <Button
                            onClick={() => setAdding(true)}
                            variant="primary"
                            className=""
                        >
                            <i className="fas fa-plus mr-2"></i> Add Work
                        </Button>
                    </div>
                </>
            ) : (
                <div className="w-full overflow-x-auto h-[95%]  custom-scrollbar">
                    <div className="min-w-[1000px]">
                        {/* Headers */}
                        <div className="grid grid-cols-5 text-blue-900 gap-2 font-semibold bg-blue-100 p-2 rounded">
                            <div className="text-center">Work Name</div>
                            <div className="text-center">Description</div>
                            <div className="text-center">Completed Date</div>
                            <div className="text-center">Upload</div>
                            <div className="text-center">Actions</div>
                        </div>

                        <section className="!max-h-[100%] overflow-y-auto">
                            {/* Item rows */}
                            {items.map((item) =>
                                editingId === item._id ? (
                                    <div
                                        key={item._id}
                                        className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-gray-200 items-center bg-white"
                                    >
                                        <input
                                            className="border-b p-1 focus:outline-none"
                                            value={form.workName}
                                            onChange={(e) => setForm({ ...form, workName: e.target.value })}
                                        />
                                        <input
                                            className="border-b p-1 focus:outline-none"
                                            value={form.descritpion}
                                            onChange={(e) => setForm({ ...form, descritpion: e.target.value })}
                                        />
                                        <input
                                            type="date"
                                            className="border-b p-1 focus:outline-none"
                                            value={form.completedDate}
                                            onChange={(e) => setForm({ ...form, completedDate: e.target.value })}
                                        />
                                        {/* <div className="flex flex-col items-center gap-1"> */}
                                            <input
                                                className="border-b p-2 text-xs max-w-[80%] "
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    setForm({ ...form, file });
                                                    // setImagePreview(file ? URL.createObjectURL(file) : null);
                                                }}
                                            />
                                            {/* {imagePreview && (
                                            <img
                                                src={imagePreview}
                                                className="w-10 h-10 object-cover rounded border cursor-pointer"
                                                onClick={() => setPopupImage(imagePreview)}
                                            />
                                        )} */}
                                        {/* </div> */}

                                        <div className="flex gap-2">
                                            <Button
                                                variant="primary"
                                                isLoading={editPending}
                                                onClick={handleEdit}
                                                // className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                            >
                                                <i className="fas fa-save mr-1"></i> Save
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={resetForm}
                                                // className="bg-gray-400 text-white px-3 py-1 rounded"
                                            >
                                                <i className="fas fa-times mr-1"></i> Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={item._id}
                                        className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-gray-200 items-center bg-white"
                                    >
                                        <div className="text-center">{item.workName || "N/A"}</div>
                                        <div className="text-center">{item.descritpion || "N/A"}</div>
                                        <div className="text-center">
                                            {item.completedDate ? dateFormate(item.completedDate.toLocaleString()) : "N/A"}
                                        </div>
                                        <div className="text-center">
                                            {item.upload?.type === "image" ? (
                                                <img
                                                    loading="lazy"
                                                    src={item.upload.url}
                                                    alt="preview"
                                                    className="w-10 mx-auto block h-10 object-cover border rounded shadow cursor-pointer"
                                                    onClick={() => setPopupImage(item.upload?.url!)}
                                                />
                                            ) : item.upload?.type === "pdf" ? (
                                                <a href={item.upload.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                                    View PDF
                                                </a>
                                            ) : (
                                                "No image"
                                            )}
                                        </div>
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                onClick={() => {
                                                    setEditingId(item._id);
                                                    setAdding(false);
                                                    // setImagePreview(null);
                                                    setForm({
                                                        workName: item.workName || "",
                                                        descritpion: item.descritpion || "",
                                                        completedDate: item.completedDate
                                                            ? new Date(item.completedDate).toISOString().split("T")[0]
                                                            : "",
                                                        file: undefined,
                                                    });
                                                }}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                            >
                                                <i className="fas fa-edit mr-1"></i> Edit
                                            </Button>
                                            <Button
                                                isLoading={deletePending}
                                                variant="danger"
                                                onClick={() => handleDelete(item._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                            >
                                                <i className="fas fa-trash mr-1"></i> Delete
                                            </Button>
                                        </div>
                                    </div>
                                )
                            )}

                            {/* Add New Row */}
                            {adding && (
                                <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-gray-200 items-center bg-white">
                                    <input
                                        className="border-b p-1 focus:outline-none"
                                        placeholder="Work Name"
                                        value={form.workName}
                                        onChange={(e) => setForm({ ...form, workName: e.target.value })}
                                    />
                                    <input
                                        className="border-b p-1 focus:outline-none"
                                        placeholder="Description"
                                        value={form.descritpion}
                                        onChange={(e) => setForm({ ...form, descritpion: e.target.value })}
                                    />
                                    <input
                                        type="date"
                                        className="border-b  p-1 focus:outline-none"
                                        value={form.completedDate}
                                        onChange={(e) => setForm({ ...form, completedDate: e.target.value })}
                                    />
                                    <div className="flex flex-col items-center gap-1">
                                        <input
                                            className="border-b max-w-[80%]"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                setForm({ ...form, file });
                                                // setImagePreview(file ? URL.createObjectURL(file) : null);
                                            }}
                                        />
                                        {/* {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            className="w-10 h-10 object-cover rounded border cursor-pointer"
                                            onClick={() => setPopupImage(imagePreview)}
                                        />
                                    )} */}
                                    </div>
                                    <div className="flex gap-2 justify-center">
                                        <Button
                                            isLoading={createPending}
                                            variant="primary"
                                            onClick={handleAdd}
                                        // className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                        >
                                            <i className="fas fa-save mr-1"></i> Save
                                        </Button>
                                        <button
                                            onClick={resetForm}
                                            className="bg-gray-400 text-white px-3 py-1 rounded"
                                        >
                                            <i className="fas fa-times mr-1"></i> Cancel
                                        </button>
                                    </div>
                                </div>
                            )}


                            {!adding && <Button
                                onClick={() => setAdding(true)}
                                variant="primary"
                                className=""
                            >
                                <i className="fas fa-plus mr-2"></i> Add Work
                            </Button>}
                        </section>
                    </div>
                </div>
            )}


            {popupImage && (
                <div onClick={() => setPopupImage(null)} className="fixed inset-0  bg-black/70 bg-opacity-60 z-50 flex items-center justify-center">
                    <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded p-4 lg:p-8 max-w-[90vw] max-h-[80vh] shadow-lg">
                        <i
                            className="fas fa-times absolute top-3 right-4 text-xl text-gray-700 hover:text-red-500 cursor-pointer"
                            onClick={() => setPopupImage(null)}
                        ></i>
                        <img
                            loading="lazy"
                            src={popupImage}
                            alt="Full Preview"
                            className="max-h-[70vh] w-auto object-contain rounded"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
