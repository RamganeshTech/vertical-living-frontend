import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "../../../utils/toast";
import {
  useDeleteMaterialArrivalItem,
  useGetSingleRoomMaterialArrival,
  useUpdateMaterialArrivalRoomItem
} from "../../../apiList/Stage Api/materialArrivalApi";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { requiredFieldsByRoomArrival } from "../../../constants/constants";
import { Textarea } from "../../../components/ui/TextArea";
import RoomDetailsLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/RoomDetailLoading";

const MaterialArrivalRoomDetail = () => {
  const { projectId, roomKey, organizationId } = useParams();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [newItemData, setNewItemData] = useState<any>({});
  const [showAddRow, setShowAddRow] = useState(false);
  const [popupImage, setPopupImage] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useGetSingleRoomMaterialArrival(projectId!, roomKey!);
  const { mutateAsync: updateItem } = useUpdateMaterialArrivalRoomItem();
  const { mutateAsync: deleteItem } = useDeleteMaterialArrivalItem();

  if (!roomKey) return;
  if (isLoading) return <RoomDetailsLoading />;
  if (isError) return <div className="max-w-xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
    <div className="text-red-600 font-semibold mb-2">
      ⚠️ Error Occurred
    </div>
    <p className="text-red-500 text-sm mb-4">
      {(error as any)?.response?.data?.message || "Failed to load data"}
    </p>
    <Button
      onClick={() => refetch()}
      className="bg-red-600 text-white px-4 py-2"
    >
      Retry
    </Button>
  </div>;

  const items = data || [];

  const handleChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {

      const requiredFields = requiredFieldsByRoomArrival[roomKey!];
      if (!requiredFields || requiredFields.length === 0) {
        throw new Error("No required fields defined for this section.");
      }

      const firstField = requiredFields[0];
      const firstValue = editData[firstField];

      if (!firstValue || firstValue.toString().trim() === "") {
        throw new Error(`The field "${firstField}" is required.`);
      }

      const isAllEmpty = requiredFields.every((field) => {
        const val = editData[field];
        return !val || val.toString().trim() === "";
      });

      if (isAllEmpty) {
        throw new Error("At least one field must be filled.");
      }


      const formData = new FormData();
      formData.append("itemData", JSON.stringify(editData));
      if (editFile) formData.append("upload", editFile);

      await updateItem({ projectId: projectId!, roomKey: roomKey!, formData });
      toast({ title: "Success", description: "Item updated successfully" });
      setEditingIndex(null);
      setEditData({});
      setEditFile(null);
      refetch()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || err.message || "Failed to update",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = async () => {
    try {

      const requiredFields = requiredFieldsByRoomArrival[roomKey!];
      if (!requiredFields || requiredFields.length === 0) {
        throw new Error("No required fields defined for this section.");
      }

      const firstField = requiredFields[0];
      const firstValue = newItemData[firstField];

      if (!firstValue || firstValue.toString().trim() === "") {
        throw new Error(`The field "${firstField}" is required.`);
      }

      const isAllEmpty = requiredFields.every((field) => {
        const val = newItemData[field];
        return !val || val.toString().trim() === "";
      });

      if (isAllEmpty) {
        throw new Error("At least one field must be filled.");
      }

      const formData = new FormData();
      formData.append("itemData", JSON.stringify(newItemData));
      if (selectedFile) formData.append("upload", selectedFile);

      await updateItem({ projectId: projectId!, roomKey: roomKey!, formData });
      toast({ title: "Success", description: "Item added successfully" });
      setShowAddRow(false);
      setNewItemData({});
      refetch()
      setSelectedFile(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || err.message || "Failed to add item",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteItem({ projectId: projectId!, roomKey: roomKey!, itemId });
      toast({ title: "Deleted", description: "Item removed" });
      refetch()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed",
        variant: "destructive"
      });
    }
  };



  return (
    <div className="w-full h-full">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-800 capitalize">
          <span className="text-black font-semibold">Section:</span> {roomKey}
        </h2>
        <Button
          variant="primary"
          className="h-10"
          onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/materialarrival`)}
        >
          Go Back
        </Button>
      </div>

      {/* Scrollable Container */}
      <div className="w-full overflow-x-auto roundex-lg mt-2 custom-scrollbar">
        {/* Table Content Container with fixed min width */}
        {/* below original  */}
        {/* <div className="min-w-[1000px]"> */}
        <div
          style={{
            minWidth: `${(requiredFieldsByRoomArrival[roomKey]?.length + 1) * 190
              }px`,
          }}
        >
          {/* Table Headings */}
          {/* below original  */}
          {/* <div className="grid grid-cols-9 gap-2 bg-blue-100 text-blue-800 text-xs font-semibold uppercase px-4 py-2"> */}
          <div
            className={`grid gap-2 bg-blue-100 text-blue-800 text-xs font-semibold uppercase px-4 py-2`}
            style={{
              gridTemplateColumns: `repeat(${requiredFieldsByRoomArrival[roomKey]?.length + 1
                }, minmax(120px, 1fr))`,
            }}
          >
            {requiredFieldsByRoomArrival[roomKey]?.map((field, idx) => (
              <div key={idx} className="text-center">{field === "verifiedByAccountant" ? "Verified" : field}</div>
            ))}
            <div className="text-center">Actions</div>
          </div>

          {/* Table Rows */}
          {items?.map((item: any, index: number) => (
            // below original 
            // <div
            //   key={item._id}
            //   className="grid grid-cols-9 gap-2 px-4 py-2 border-b items-center hover:bg-gray-50"
            // >

            <div
              key={item._id}
              className={`grid gap-2 px-4 py-2 items-center hover:bg-gray-50`}
              style={{
                gridTemplateColumns: `repeat(${requiredFieldsByRoomArrival[roomKey]?.length + 1
                  }, minmax(120px, 1fr))`,
              }}
            >
              {requiredFieldsByRoomArrival[roomKey]?.map((field, i) => {
                if (field === "image") {
                  return (
                    <div key={i} className="flex justify-center items-center">
                      {editingIndex === index ? (
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                          className="text-xs"
                        />
                      ) : item?.upload?.url ? (
                        <div
                          className="w-10 h-10 cursor-pointer"
                          onClick={() => setPopupImage(item.upload.url)}
                        >
                          <img
                            src={item.upload.url}
                            alt="Preview"
                            className="w-full h-full object-cover rounded border shadow"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No Image</span>
                      )}
                    </div>
                  );
                }

                if (field === "verifiedByAccountant") {
                  return (
                    <div key={i} className="text-center">
                      {editingIndex === index ? (
                        <input
                          type="checkbox"
                          checked={!!editData[field]}
                          onChange={(e) =>
                            setEditData((prev: any) => ({
                              ...prev,
                              [field]: e.target.checked
                            }))
                          }
                        />
                      ) : item[field] ? (
                        <i className="fas fa-check text-blue-600 text-lg" />
                      ) : (
                        <i className="fas fa-times text-red-500 text-lg" />
                      )}
                    </div>
                  );
                }

                if (field === "remarks") {
                  return editingIndex === index ? (
                    <Textarea
                      key={field}
                      value={editData[field] || ""}
                      className="text-sm"
                      onChange={(e) =>
                        setEditData((p: any) => ({ ...p, remarks: e.target.value }))
                      }
                    />
                  ) : (
                    <div className="text-sm text-center px-2 overflow-x-auto max-w-[150px] custom-scrollbar whitespace-nowrap">
                      {item[field]}
                    </div>
                  );
                }

                return (
                  <div key={i} className="text-sm text-center px-2 max-w-[140px] overflow-auto whitespace-nowrap">
                    {editingIndex === index ? (
                      <Input
                        className="text-xs w-full"
                        value={editData[field] || ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                      />
                    ) : (
                      item[field] || "-"
                    )}
                  </div>
                );
              })}

              <div className="flex justify-center gap-2 text-lg">
                {editingIndex === index ? (
                  <>
                    <Button size="sm" onClick={handleSave}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingIndex(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <i
                      className="fas fa-pen text-blue-600 cursor-pointer"
                      onClick={() => {
                        setEditData(item);
                        setEditingIndex(index);
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
          ))}

          {/* Add New Row */}
          {showAddRow && (
            // <div className="grid grid-cols-9 gap-2 px-4 py-2 border-t bg-blue-50 items-center">

            <div className={`grid gap-2 px-4 py-2  bg-blue-50 items-center`}
              style={{
                gridTemplateColumns: `repeat(${requiredFieldsByRoomArrival[roomKey]?.length + 1
                  }, minmax(120px, 1fr))`,
              }}
            >
              {requiredFieldsByRoomArrival[roomKey]?.map((field, i) => {
                if (field === "image") {
                  return (
                    <input
                      key={i}
                      type="file"
                      accept="image/*"
                      className="text-xs w-full"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  );
                }
                if (field === "verifiedByAccountant") {
                  return (
                    <input
                      key={i}
                      type="checkbox"
                      checked={!!newItemData[field]}
                      onChange={(e) =>
                        setNewItemData((prev: any) => ({ ...prev, [field]: e.target.checked }))
                      }
                    />
                  );
                }
                return (
                  <Input
                    key={i}
                    className="text-xs text-center w-full"
                    placeholder={field}
                    value={newItemData[field] || ""}
                    onChange={(e) =>
                      setNewItemData((prev: any) => ({ ...prev, [field]: e.target.value }))
                    }
                  />
                );
              })}
              <div className="flex justify-center gap-2">
                <Button size="sm" onClick={handleAddNew}>
                  Add
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddRow(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!showAddRow && (
            <div className="py-4 px-4">
              <Button onClick={() => setShowAddRow(true)}>Add Item</Button>
            </div>
          )}
        </div>
      </div>

      {/* Popup Image Viewer */}
      {popupImage && (
        <div onClick={() => setPopupImage(null)} className="fixed inset-0 bg-black/70 bg-opacity-60 z-50 flex items-center justify-center">
          <div onClick={(e) => e.stopPropagation} className="relative bg-white rounded p-4 sm:p-8 shadow-lg max-w-[90vw] max-h-[80vh]">
            <i
              className="fas fa-times absolute top-[0px] right-1 sm:top-2 sm:right-3 text-xl sm:text-2xl cursor-pointer text-gray-700 hover:text-red-500"
              onClick={() => setPopupImage(null)}
            ></i>
            <img
              src={popupImage}
              alt="Full View"
              className="max-h-[70vh] max-w-[100%] sm:max-w-full object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialArrivalRoomDetail;