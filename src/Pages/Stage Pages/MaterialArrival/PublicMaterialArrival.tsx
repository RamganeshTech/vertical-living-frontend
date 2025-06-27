// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import { useGetPublicMaterialArrival } from "../../../apiList/Stage Api/materialArrivalApi";
// import { Separator } from "../../../components/ui/Seperator";
// import { Input } from "../../../components/ui/Input";
// import { Button } from "../../../components/ui/Button";
// import { COMPANY_DETAILS } from "../../../constants/constants";

// const PublicMaterialArrival = () => {
//     const { projectId, token } = useParams();
//     const { data, isLoading, isError } = useGetPublicMaterialArrival(projectId!, token!);
//     const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
//     const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);

//     const handleToggle = (roomKey: string) => {
//         setExpandedRoom(prev => (prev === roomKey ? null : roomKey));
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col w-full">
//             {/* Header */}
//             <header className="bg-white shadow sticky top-0 z-10">
//                 <div className="max-w-5xl w-full mx-auto flex items-center gap-4 px-4 py-3">
//                     <img
//                         src={COMPANY_DETAILS.COMPANY_LOGO}
//                         alt="Logo"
//                         className="w-10 h-10 object-contain"
//                     />
//                     <h1 className="text-xl font-bold">{COMPANY_DETAILS.COMPANY_NAME}</h1>
//                 </div>
//             </header>

//             {/* Main Content */}
//             <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
//                 <h2 className="text-2xl font-bold text-blue-700">Arrived Materials</h2>

//                 {/* Shop Delivery Details */}
//                 <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                     <h3 className="text-lg font-semibold text-blue-700 mb-2">Shop Delivery Details</h3>
//                     {isLoading ? (
//                         <p className="animate-pulse text-sm">Loading...</p>
//                     ) : isError || !data?.shopDetails ? (
//                         <p className="text-red-500">Failed to load shop details</p>
//                     ) : (
//                         <div className="grid sm:grid-cols-2 gap-4 text-sm">
//                             {Object.entries(data.shopDetails).map(([key, value]) => (
//                                 <div key={key} className="flex flex-col">
//                                     <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
//                                     <span className="text-gray-600">
//                                         {typeof value === "string" || typeof value === "number"
//                                             ? value
//                                             : typeof value === "boolean"
//                                                 ? value ? "✔️" : "❌"
//                                                 : "-"}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </section>

//                 {/* Site Delivery Location */}
//                 <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                     <h3 className="text-lg font-semibold text-blue-700 mb-2">Site Location Details</h3>
//                     {isLoading ? (
//                         <p className="animate-pulse text-sm">Loading...</p>
//                     ) : isError || !data?.deliveryLocationDetails ? (
//                         <p className="text-red-500">Failed to load site details</p>
//                     ) : (
//                         <div className="grid sm:grid-cols-2 gap-4 text-sm">
//                             {Object.entries(data.deliveryLocationDetails).map(([key, value]) => (
//                                 <div key={key} className="flex flex-col">
//                                     <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
//                                     <span className="text-gray-600">
//                                         {typeof value === "string" || typeof value === "number"
//                                             ? value
//                                             : typeof value === "boolean"
//                                                 ? value ? "✔️" : "❌"
//                                                 : "-"}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </section>

//                 {/* Material Arrival List */}
//                 <section>
//                     <h3 className="text-lg font-bold text-blue-800 mb-4">Material Rooms</h3>

//                     {isLoading ? (
//                         <p className="animate-pulse text-sm">Loading material data...</p>
//                     ) : isError || !data?.materialArrivalList ? (
//                         <p className="text-red-500">Failed to load material arrival data</p>
//                     ) : (
//                         Object.entries(data.materialArrivalList as Record<string, any[]>).map(([roomKey, items]) => (
//                             <div key={roomKey} className="mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
//                                 <button
//                                     onClick={() => handleToggle(roomKey)}
//                                     className="w-full px-4 py-3 text-left flex items-center justify-between bg-blue-100 hover:bg-blue-200 transition-all"
//                                 >
//                                     <span className="capitalize font-semibold text-blue-800">{roomKey.replace(/([A-Z])/g, " $1")}</span>
//                                     <i className={`fas fa-chevron-${expandedRoom === roomKey ? "up" : "down"}`}></i>
//                                 </button>

//                                 <div className={`transition-all duration-300 overflow-hidden ${expandedRoom === roomKey ? "max-h-[1000px] p-4" : "max-h-0"}`}>
//                                     {items.length === 0 ? (
//                                         <p className="text-gray-500 italic text-sm">No items arrived in this room.</p>
//                                     ) : (
//                                         <div className="w-full overflow-x-auto mt-3">
//                                             <div className="min-w-[600px] space-y-2">
//                                                 {/* Header */}
//                                                 <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] bg-blue-50 text-xs text-blue-900 font-semibold border-b border-blue-200 py-2 px-2">
//                                                     {Object.keys(items[0])
//                                                         .filter(key => key !== "_id")
//                                                         .map(key => (
//                                                             <div key={key} className="text-center capitalize">
//                                                                 {key === "upload" ? "Image" : key === "verifiedByAccountant" ? "Verified" : key.replace(/([A-Z])/g, " $1")}
//                                                             </div>
//                                                         ))}
//                                                 </div>

//                                                 {/* Rows */}
//                                                 {items.map((item: any, index: number) => (
//                                                     <div key={index} className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] text-xs text-gray-800 border-b border-gray-100 py-2 px-2 hover:bg-gray-50">
//                                                         {Object.entries(item)
//                                                             .filter(([key]) => key !== "_id")
//                                                             .map(([key, val], i) => (
//                                                                 <div key={i} className="text-center break-words">
//                                                                     {key === "upload" && typeof val === "object" && val !== null && "url" in val ? (
//                                                                         <div className="flex flex-col items-center gap-1">
//                                                                             <Button
//                                                                                 size="sm"
//                                                                                 className="text-xs bg-blue-500 hover:bg-blue-600 text-white"
//                                                                                 onClick={() => {
//                                                                                     if (typeof val === "object" && val !== null && "url" in val) {
//                                                                                         setViewImageUrl((val as { url: string }).url);
//                                                                                     }
//                                                                                 }}                                      >
//                                                                                 View
//                                                                             </Button>
//                                                                             <a
//                                                                                 href={(val as any).url}
//                                                                                 download
//                                                                                 className="text-xs text-blue-600 underline"
//                                                                             >
//                                                                                 Download
//                                                                             </a>
//                                                                         </div>
//                                                                     ) : key === "verifiedByAccountant" ? (
//                                                                         val ? "✔️" : "❌"
//                                                                     ) : typeof val === "boolean" ? (
//                                                                         val ? "✔️" : "❌"
//                                                                     ) : typeof val === "string" || typeof val === "number" ? (
//                                                                         val
//                                                                     ) : (
//                                                                         "-"
//                                                                     )}
//                                                                 </div>
//                                                             ))}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </section>
//             </main>

//             {/* Footer */}
//             <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
//                 &copy; {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME}. All rights reserved.
//             </footer>

//             {/* Image Modal */}
//             {viewImageUrl && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg shadow-lg p-4 relative max-w-3xl max-h-[90vh] overflow-auto">
//                         <button
//                             onClick={() => setViewImageUrl(null)}
//                             className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//                         >
//                             <i className="fas fa-times"></i>
//                         </button>
//                         <img src={viewImageUrl} alt="View" className="w-full h-auto rounded" />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PublicMaterialArrival;









// MaterialArrivalPublic.tsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "../../../utils/toast";
import {
    useGetPublicMaterialArrival,
    useUpdateMaterialArrivalRoomItem,
    useDeleteMaterialArrivalItem,
} from "../../../apiList/Stage Api/materialArrivalApi";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { requiredFieldsByRoomArrival } from "../../../constants/constants";
import { Footer, Header } from "../Ordering Materials/PublicOrderMaterial";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Textarea } from "../../../components/ui/TextArea";

const RoomSection = ({
    projectId,
    token,
    roomKey,
    items,
    refetch
}: {
    projectId: string;
    token: string;
    roomKey: string;
    items: any[];
    refetch: () => Promise<any>
}) => {
    const updateItem = useUpdateMaterialArrivalRoomItem();
    const deleteItem = useDeleteMaterialArrivalItem();

    const [open, setOpen] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [newData, setNewData] = useState<any>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editData, setEditData] = useState<any>({});
    const [editFile, setEditFile] = useState<File | null>(null);

    const handleAdd = async () => {
        const fd = new FormData();
        fd.append("itemData", JSON.stringify(newData));

        if (selectedFile) fd.append("upload", selectedFile);
        try {
            await updateItem.mutateAsync({ projectId, roomKey, formData: fd });
            toast({ title: "Added", description: "New item saved." });
            setShowAdd(false);
            setNewData({});
            setSelectedFile(null);
            refetch()
        } catch (e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        }
    };

    const handleSave = async (originalId: string) => {
        const fd = new FormData();
        fd.append("itemData", JSON.stringify(editData));
        if (editFile) fd.append("upload", editFile);
        try {
            await updateItem.mutateAsync({ projectId, roomKey, formData: fd });
            toast({ title: "Updated", description: "Item saved." });
            refetch()
            setEditIndex(null);
            setEditData({});
            setEditFile(null);

        } catch (e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        }
    };

    const handleDelete = async (itemId: string) => {
        try {
            await deleteItem.mutateAsync({ projectId, roomKey, itemId });
            toast({ title: "Deleted", description: "Item removed." });
            refetch()
        } catch (e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        }
    };

    const fields = requiredFieldsByRoomArrival[roomKey];


    console.log(fields)

    return (
        <div className="mb-4 bg-white outline-noneh rounded-lg overflow-hidden shadow-sm">
            <button
                className="w-full px-4 py-3 text-left flex items-center justify-between bg-blue-100 hover:bg-blue-200 transition-all"
                onClick={() => setOpen(!open)}
            >

                <span className="capitalize font-semibold text-blue-800">{roomKey.replace(/([A-Z])/g, " $1")}</span>
                <i className={`fas fa-chevron-${open ? "up" : "down"}`}></i>
            </button>

            <div
                className={`transition-max-h duration-300 ease-out overflow-hidden ${open ? "max-h-[500px] p-4" : "max-h-0 p-0"
                    }`}
            >
                {/* Heading Row */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] font-semibold text-sm bg-blue-50  text-blue-900 border-b border-blue-200 py-2 px-1 rounded mb-2">
                    {fields.map((field) => (
                        <div key={field} className="capitalize  text-center">
                            {field === "image" ? "Upload" : field === "verifiedByAccountant" ? "verified" : field}
                        </div>
                    ))}
                    <div className="text-center">Actions</div>
                </div>





                {/* Existing Items */}
                {items?.length === 0 && !showAdd ? (
                    <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-md shadow-inner">
                        <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-700">No Items Found</h3>
                        <p className="text-sm text-gray-500 mb-4">Start by adding your first item to this room.</p>
                        <Button
                            onClick={() => setShowAdd(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded"
                        >
                            <i className="fas fa-plus mr-2"></i> Add One
                        </Button>
                    </div>

                ) : (
                    items?.map((item, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] items-center gap-2 py-2 border-b-1 border-gray-100 hover:bg-gray-50"
                        >
                            {fields?.map((f) => {
                                if (f === "image") {
                                    return editIndex === idx ? (
                                        <input
                                            key={f}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                                        />
                                    ) : item.upload?.url ? (
                                        <img
                                            loading="lazy"
                                            key={f}
                                            src={item.upload.url}
                                            alt=""
                                            className="w-12 h-12 object-cover rounded mx-auto"
                                        />
                                    ) : (
                                        <div key={f} className="text-center">no image</div>
                                    );
                                }
                                if (f === "verifiedByAccountant") {
                                    return editIndex === idx ? (
                                        <input
                                            key={f}
                                            type="checkbox"
                                            className="text-center"
                                            checked={!!editData.verifiedByAccountant}
                                            onChange={(e) =>
                                                setEditData((p: any) => ({ ...p, verifiedByAccountant: e.target.checked }))
                                            }
                                        />
                                    ) : item?.verifiedByAccountant ? (
                                        <span className="text-center truncate" ><i className="fas fa-check text-blue-600 text-lg"></i></span>
                                    ) : (
                                        <span className="text-center truncate" ><i className="fas fa-xmark text-red-500 text-lg"></i></span>
                                    );
                                }

                                if (f === "remarks") {
                                    return editIndex === idx ? (
                                        <Textarea
                                            key={f}
                                            value={editData[f] || ""}
                                            className="text-center"
                                            onChange={(e) =>
                                                setEditData((p: any) => ({ ...p, remarks: e.target.value }))
                                            }
                                        />
                                    ) :
                                        <div
                                            className="w-[150px] text-center overflow-x-auto overflow-y-hidden scrollbar-none [&::-webkit-scrollbar]:hidden whitespace-nowrap text-md px-1 rounded"
                                        >
                                            {f} </div>
                                }
                                return editIndex === idx ? (
                                    <Input
                                        key={f}
                                        value={editData[f] || ""}
                                        onChange={(e) =>
                                            setEditData((p: any) => ({ ...p, [f]: e.target.value }))
                                        }
                                    />
                                ) : (
                                    <div key={f} className="text-center truncate ">
                                        {item[f] ?? "-"}
                                    </div>
                                );
                            })}
                            <div className="flex gap-2 justify-center">
                                {editIndex === idx ? (
                                    <>
                                        <Button size="sm" onClick={() => handleSave(item._id)}>
                                            Save
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setEditIndex(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <i
                                            className="fas fa-pen cursor-pointer"
                                            onClick={() => {
                                                setEditIndex(idx);
                                                setEditData(item);
                                            }}
                                        />
                                        <i
                                            className="fas fa-trash text-red-500 cursor-pointer"
                                            onClick={() => handleDelete(item._id)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}


                {/* Add Row */}
                {showAdd && (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] items-center gap-2 bg-white p-2 rounded mb-4">
                        {fields.map((f) => {
                            if (f === "image")
                                return (
                                    <Input
                                        key={f}
                                        type="file"
                                        className="border-2"
                                        accept="image/*"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    />
                                );
                            if (f === "verifiedByAccountant")
                                return (
                                    // <label key={f} className="flex items-center justify-center gap-1">
                                    //     Verified
                                    <Input
                                        className="w-5 h-5"
                                        type="checkbox"
                                        checked={!!newData.verifiedByAccountant}
                                        onChange={(e) =>
                                            setNewData((p: any) => ({ ...p, verifiedByAccountant: e.target.checked }))
                                        }
                                    />
                                    // </label>
                                );
                            return (
                                <Input
                                    key={f}
                                    placeholder={f}
                                    value={newData[f] || ""}
                                    onChange={(e) =>
                                        setNewData((p: any) => ({ ...p, [f]: e.target.value }))
                                    }
                                />
                            );
                        })}
                        <div className="flex justify-center gap-2">
                            {/* add */}
                            <Button size="sm" className="h-10" onClick={handleAdd}>
                                Add
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setShowAdd(false)}
                            >
                                Cancel
                            </Button>
                            {/* cancel */}
                        </div>
                    </div>
                )}

                {/* Add button */}
                {!showAdd && items.length > 0 && (
                    <div className="pt-3">
                        <Button onClick={() => setShowAdd(true)}>
                            ➕ Add Item
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function MaterialArrivalPublic() {
    const { projectId, token } = useParams();
    const { data, isLoading, isError, refetch } = useGetPublicMaterialArrival(projectId!, token!);

    if (isLoading) return <p>Loading...</p>;
    if (isError || !data) return <p>Error loading materials.</p>;

    const rooms = Object.entries(data.materialArrivalList || {});

    return (
        <div className="min-h-screen  bg-gray-50  space-y-6">
            <Header />
            <main className="flex-1 w-full px-4 py-6 space-y-6 mx-auto sm:max-w-full md:max-w-[95%] lg:max-w-[85%] xl:max-w-[90%]">

                <h1 className="text-2xl font-semibold">Arrived Materials</h1>

                {/* Shop + Site */}

                <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2">Shop Delivery Details</h2>
                    {isLoading ? (
                        <Skeleton />
                    ) : isError || !data?.shopDetails ? (
                        <p className="text-red-500">Failed to load shop details</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            {Object.entries(data.shopDetails).map(([key, value]) => (
                                <div key={key} className="flex flex-col">
                                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="text-gray-600"> {typeof value === "string" || typeof value === "number"
                                        ? value
                                        : typeof value === "boolean"
                                            ? value ? "✔️" : "❌"
                                            : "-"}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Site Details */}
                <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2">Site Location Details</h2>
                    {isLoading ? (
                        <Skeleton />
                    ) : isError || !data?.deliveryLocationDetails ? (
                        <p className="text-red-500">Failed to load site details</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            {Object.entries(data.deliveryLocationDetails).map(([key, value]) => (
                                <div key={key} className="flex flex-col">
                                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="text-gray-600"> {typeof value === "string" || typeof value === "number"
                                        ? value
                                        : typeof value === "boolean"
                                            ? value ? "✔️" : "❌"
                                            : "-"}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Room Accordions */}
                <section className="max-w-full mx-auto space-y-4">
                    <h2 className="text-lg font-bold text-blue-800 mb-4">Material Rooms</h2>

                    {rooms.map(([rk, items]) => (
                        <RoomSection
                            key={rk}
                            projectId={projectId!}
                            token={token!}
                            roomKey={rk}
                            items={items as any[]}
                            refetch={refetch}
                        />
                    ))}
                </section>

            </main>

            <Footer />
        </div>
    );
}
