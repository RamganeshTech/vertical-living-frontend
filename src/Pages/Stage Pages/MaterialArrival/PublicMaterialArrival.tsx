// // MaterialArrivalPublic.tsx
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
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

export default function MaterialArrivalPublic() {
  const { projectId, token } = useParams();
  const { data, isLoading, isError, error, refetch } = useGetPublicMaterialArrival(projectId!, token!);

  if (isLoading) return <MaterialOverviewLoading />;
  if (isError || !data) return <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-6">
    <div className="text-red-600 font-semibold mb-2">
      ⚠️ Error Occurred
    </div>
    <p className="text-red-500 text-sm mb-4">
      {(error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Failed to load cost estimation data"}
    </p>
    <Button
      onClick={() => refetch()}
      className="bg-red-600 text-white px-4 py-2"
    >
      Retry
    </Button>
  </div>;

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


const RoomSection = ({
  projectId,
  roomKey,
  items,
  refetch,
}: {
  projectId: string;
  token: string;
  roomKey: string;
  items: any[];
  refetch: () => Promise<any>;
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

  const fields = requiredFieldsByRoomArrival[roomKey];

  const handleAdd = async () => {
    try {

      if (!fields || fields.length === 0) {
        throw new Error("Invalid room type or no fields defined.");
      }

      // Validate: first field must be filled
      const firstFieldKey = fields[0];
      const firstFieldValue = newData[firstFieldKey];

      if (!firstFieldValue || firstFieldValue.toString().trim() === "") {
        throw new Error(`The field "${firstFieldKey}" is required.`);
      }

      // Optionally: you can enforce at least one non-empty field overall
      const isAllEmpty = Object.values(newData).every(
        (val) => !val || val.toString().trim() === ""
      );

      if (isAllEmpty) {
        throw new Error("At least one field must be filled.");
      }

      const firstFieldExists = items?.some(
        (item: any) =>
          item[firstFieldKey]?.toString().trim().toLowerCase() ===
          firstFieldValue.toString().trim().toLowerCase()
      );

      if (firstFieldExists) {
        throw new Error(`"${firstFieldValue}" already exists. Please use a unique value.`);
      }

      const fd = new FormData();
      fd.append("itemData", JSON.stringify(newData));
      if (selectedFile) fd.append("upload", selectedFile);
      await updateItem.mutateAsync({ projectId, roomKey, formData: fd });
      toast({ title: "Added", description: "New item saved." });
      setShowAdd(false);
      setNewData({});
      setSelectedFile(null);
      refetch();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleSave = async () => {
    try {


      if (!fields || fields.length === 0) {
        throw new Error("Invalid room type or no fields defined.");
      }

      // Validate: first field must be filled
      const firstFieldKey = fields[0];
      const firstFieldValue = editData[firstFieldKey];

      if (!firstFieldValue || firstFieldValue.toString().trim() === "") {
        throw new Error(`The field "${firstFieldKey}" is required.`);
      }

      // Optionally: you can enforce at least one non-empty field overall
      const isAllEmpty = Object.values(editData).every(
        (val) => !val || val.toString().trim() === ""
      );

      if (isAllEmpty) {
        throw new Error("At least one field must be filled.");
      }


      const fd = new FormData();
      fd.append("itemData", JSON.stringify(editData));
      if (editFile) fd.append("upload", editFile);
      await updateItem.mutateAsync({ projectId, roomKey, formData: fd });
      toast({ title: "Updated", description: "Item saved." });
      refetch();
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
      refetch();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="mb-4 bg-white rounded-lg overflow-hidden shadow-sm">
      <button
        className="w-full px-4 py-3 text-left flex items-center justify-between bg-blue-100 hover:bg-blue-200 transition-all"
        onClick={() => setOpen(!open)}
      >
        <span className="capitalize font-semibold text-blue-800">{roomKey?.replace(/([A-Z])/g, " $1")}</span>
        <i className={`fas fa-chevron-${open ? "up" : "down"}`}></i>
      </button>

      <div className={`transition-max-h duration-300 ease-out overflow-hidden ${open ? "max-h-[500px] p-4" : "max-h-0 p-0"}`}>
        {fields && (
          <div className="overflow-x-auto">
            <div className="min-w-[1200px] space-y-2">
              {/* Header */}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] bg-blue-50 text-xs sm:text-sm font-semibold text-blue-900 border-b border-blue-200 py-2 px-2 rounded-t mb-2">
                {fields.map((field) => (
                  <div key={field} className="text-center capitalize truncate">
                    {field === "image" ? "Upload" : field === "verifiedByAccountant" ? "Verified" : field}
                  </div>
                ))}
                <div className="text-center truncate">Actions</div>
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
                  <div key={idx} className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] items-center gap-2 py-2 border-b border-gray-100 hover:bg-gray-50 min-h-[60px]">
                    {fields.map((f) => {
                      if (f === "image") {
                        return editIndex === idx ? (
                          <Input
                            key={f}
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                            className="w-full text-sm"
                          />
                        ) : item.upload?.url ? (
                          <img
                            src={item.upload.url}
                            alt=""
                            className="w-12 h-12 object-cover rounded mx-auto"
                          />
                        ) : (
                          <div className="text-center">No image</div>
                        );
                      }
                      if (f === "verifiedByAccountant") {
                        return editIndex === idx ? (
                          <Input
                            key={f}
                            type="checkbox"
                            className="text-center"
                            checked={!!editData.verifiedByAccountant}
                            onChange={(e) =>
                              setEditData((p: any) => ({ ...p, verifiedByAccountant: e.target.checked }))
                            }
                          />
                        ) : item?.verifiedByAccountant ? (
                          <span className="text-center"><i className="fas fa-check text-green-600 text-lg"></i></span>
                        ) : (
                          <span className="text-center"><i className="fas fa-xmark text-red-500 text-lg"></i></span>
                        );
                      }
                      if (f === "remarks") {
                        return editIndex === idx ? (
                          <Textarea
                            key={f}
                            value={editData[f] || ""}
                            className="text-center w-full text-sm"
                            onChange={(e) =>
                              setEditData((p: any) => ({ ...p, remarks: e.target.value }))
                            }
                          />
                        ) : (
                          <div className="w-full text-center overflow-x-auto max-h-[70px] overflow-y-auto custom-scrollbar">
                            {item[f] || "N/A"}
                          </div>
                        );
                      }
                      return editIndex === idx ? (
                        <Input
                          key={f}
                          value={editData[f] || ""}
                          onChange={(e) =>
                            setEditData((p: any) => ({ ...p, [f]: e.target.value }))
                          }
                          className="w-full text-sm"
                        />
                      ) : (
                        <div className="text-center truncate">{item[f] ?? "-"}</div>
                      );
                    })}
                    <div className="flex gap-2 justify-center">
                      {editIndex === idx ? (
                        <>
                          <Button size="sm" onClick={handleSave}>
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
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditIndex(idx);
                              setEditData(item);
                            }}
                          >
                            <i className="fas fa-pen"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(item._id)}
                          >
                            <i className="fas fa-trash text-red-500"></i>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
              {!showAdd && items.length > 0 && (
                <div className="pt-3 text-center">
                  <Button onClick={() => setShowAdd(true)}>
                    ➕ Add Item
                  </Button>
                </div>
              )}
              {showAdd && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] items-center gap-2 bg-white p-2 rounded mb-4">
                  {fields.map((f) => {
                    if (f === "image")
                      return (
                        <Input
                          key={f}
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="border-2 w-full text-sm"
                        />
                      );
                    if (f === "verifiedByAccountant")
                      return (
                        <Input
                          key={f}
                          type="checkbox"
                          className="text-center w-full text-sm"
                          checked={!!newData.verifiedByAccountant}
                          onChange={(e) =>
                            setNewData((p: any) => ({ ...p, verifiedByAccountant: e.target.checked }))
                          }
                        />
                      );
                    return (
                      <Input
                        key={f}
                        placeholder={f}
                        value={newData[f] || ""}
                        onChange={(e) =>
                          setNewData((p: any) => ({ ...p, [f]: e.target.value }))
                        }
                        className="w-full text-sm"
                      />
                    );
                  })}
                  <div className="flex gap-2 justify-center">
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
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

