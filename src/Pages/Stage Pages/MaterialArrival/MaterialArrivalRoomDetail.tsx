import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "../../../utils/toast";
import {
  useDeleteMaterialArrivalItem,
  useGetSingleRoomMaterialArrival,
  useUpdateMaterialArrivalRoomItem,
} from "../../../apiList/Stage Api/materialArrivalApi";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { requiredFieldsByRoomArrival } from "../../../constants/constants";
import { Textarea } from "../../../components/ui/TextArea";

const MaterialArrivalRoomDetail = () => {
  const { projectId, roomKey } = useParams();
  const navigate = useNavigate();

  if (!roomKey) return;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [newItemData, setNewItemData] = useState<any>({});
  const [showAddRow, setShowAddRow] = useState(false);

  const { data, isLoading, isError } = useGetSingleRoomMaterialArrival(projectId!, roomKey!);
  const { mutateAsync: updateItem } = useUpdateMaterialArrivalRoomItem();
  const { mutateAsync: deleteItem } = useDeleteMaterialArrivalItem();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load room materials</p>;

  const items = data || [];

  const handleChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("itemData", JSON.stringify(editData));

    if (editFile) {
      formData.append("upload", editFile);
    }

    try {
      await updateItem({
        projectId: projectId!,
        roomKey: roomKey!,
        formData,
      });
      toast({ title: "Success", description: "Item updated successfully" });
      setEditingIndex(null);
      setEditData({});
      setEditFile(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || err.message || "Failed to update",
        variant: "destructive",
      });
    }
  };



  const handleAddNew = async () => {
    const formData = new FormData();
    // Append the item data (required)
    formData.append("itemData", JSON.stringify(newItemData));

    // Append the file ONLY if it's selected (optional)
    if (selectedFile) {
      formData.append("upload", selectedFile);
    }

    try {
      await updateItem({
        projectId: projectId!,
        roomKey: roomKey!,
        formData,
      });

      toast({ title: "Success", description: "Item added successfully" });
      setShowAddRow(false);
      setNewItemData({});
      setSelectedFile(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || err.message || "Failed to add item",
        variant: "destructive",
      });
    }
  };



  const handleDelete = async (itemId: string) => {
    try {
      await deleteItem({ projectId: projectId!, roomKey: roomKey!, itemId });
      toast({ title: "Deleted", description: "Item removed" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed", variant: "destructive" });
    }
  };

  return (

    <div className="">
      <div className="w-full flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-blue-800 capitalize"><span className="text-black font-semibold">Section:</span> {roomKey}</h2>
        <Button
          variant="primary"
          className="h-10"
          onClick={() => navigate(`/projectdetails/${projectId}/materialarrival`)}
        >
          Go Back
        </Button>
      </div>

      <div className="max-h-[60vh] rounded-lg">
        {/* Table Header */}
        <div className="flex justify-around items-center px-6 py-3 bg-blue-100 text-blue-800 text-sm font-semibold">
          {requiredFieldsByRoomArrival[roomKey]?.map((field, idx) => (
            <div key={idx} className="text-center text-xs font-medium uppercase tracking-wider">
              {field === "verifiedByAccountant" ? "verified" : field}
            </div>
          ))}
          <div className="text-center text-xs font-medium uppercase tracking-wider">Actions</div>
        </div>

        <div className="text-sm text-blue-900 divide-y max-h-[70vh] overflow-y-auto divide-blue-100">
          {/* ➕ New Row */}


          {/* 🔁 Existing Rows */}
          {!showAddRow && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 bg-gray-50">
              <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700">No {roomKey.replace(/([A-Z])/g, ' $1')} Items</h3>
              <p className="text-sm text-gray-500 mb-4">Add your first {roomKey.replace(/([A-Z])/g, ' $1').toLowerCase()} item to start tracking</p>
              <button
                onClick={() => setShowAddRow(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded font-medium"
              >
                Add {roomKey.replace(/([A-Z])/g, ' $1')} Item
              </button>
            </div>
          )
            :
            <div>
              {items?.map((item: any, index: number) => (
                <div
                  key={item._id}
                  className="grid grid-cols-9  px-6 py-3 gap-2 border-b-1 border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {requiredFieldsByRoomArrival[roomKey]?.map((field, i) => {
                    if (field === "image") {
                      return (
                        <div key={i} className="text-center py-3">
                          {editingIndex === index ? (
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                              className="text-xs"
                            />
                          ) : (
                            item?.upload?.url ? (
                              <img
                                src={item.upload.url}
                                alt="Uploaded"
                                className="w-10 h-10 object-cover rounded shadow"
                              />
                            ) : "No image"
                          )}
                        </div>
                      );
                    }

                    if (field === "verifiedByAccountant") {
                      return (
                        <div key={i} className="text-center  py-3">
                          {editingIndex === index ? (
                            <input
                            className="py-3"
                              type="checkbox"
                              checked={!!editData[field]}
                              onChange={(e) =>
                                setEditData((prev: any) => ({ ...prev, [field]: e.target.checked }))
                              }
                            />
                          ) : item[field] ?
                            <span className="text-center truncate " ><i className="fas fa-check text-blue-600 text-lg"></i></span>
                            :
                            <span className="text-center truncate " ><i className="fas fa-xmark text-red-500 text-lg"></i></span>
                          }
                        </div>
                      );
                    }


                    if (field === "remarks") {
                      return editingIndex === index ? (
                       <div className=" text-center">
                         <Textarea
                          key={field}
                          value={editData[field] || ""}
                          className="text-center"
                          onChange={(e) =>
                            setEditData((p: any) => ({ ...p, remarks: e.target.value }))
                          }
                        />
                       </div>
                      ) :
                        <div
                          className="w-[150px] text-center overflow-x-auto py-3 overflow-y-hidden scrollbar-none [&::-webkit-scrollbar]:hidden whitespace-nowrap text-md px-1 rounded"
                        >
                          {item[field]} </div>
                    }



                    return (
                      <div key={i} className={`text-center  px-6 py-3 text-sm ${field === "specification" ? "w-[150px] text-center overflow-x-auto overflow-y-hidden scrollbar-none [&::-webkit-scrollbar]:hidden whitespace-nowrap" : ""}`}>
                        {editingIndex === index ? (
                          <Input
                            className="text-xs"
                            value={editData[field] || ""}
                            onChange={(e) => handleChange(field, e.target.value)}
                          />
                        ) : (
                          item[field] || "-"
                        )}
                      </div>
                    );
                  })}

                  <div className="flex justify-center gap-2 py-3">
                    {editingIndex === index ? (
                      <>
                        <Button size="sm" onClick={handleSave}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingIndex(null)}>Cancel</Button>
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
            </div>
          }


          {showAddRow && (
            <div className="flex justify-around items-center px-6 py-3 gap-2 bg-blue-50">
              {requiredFieldsByRoomArrival[roomKey]?.map((field, i) => {
                if (field === "image") {
                  return (
                    <div key={i} className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="text-xs"
                      />
                    </div>
                  );
                }

                if (field === "verified") {
                  return (
                    <div key={i} className="text-center">
                      <input
                        type="checkbox"
                        checked={!!newItemData[field]}
                        onChange={(e) =>
                          setNewItemData((prev: any) => ({ ...prev, [field]: e.target.checked }))
                        }
                      />
                    </div>
                  );
                }

                return (
                  <div key={i} className="text-center">
                    <Input
                      className="text-xs text-center"
                      placeholder={field}
                      value={newItemData[field] || ""}
                      onChange={(e) =>
                        setNewItemData((prev: any) => ({ ...prev, [field]: e.target.value }))
                      }
                    />
                  </div>
                );
              })}
              <div className="flex justify-center gap-2">
                <Button size="sm" onClick={handleAddNew}>Add</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddRow(false)}>Cancel</Button>
              </div>
            </div>
          )}
          {items?.length !== 0 && <div className="py-2 px-6">
            {!showAddRow && (
              <Button onClick={() => setShowAddRow(true)}>
                Add Item
              </Button>
            )}
          </div>}
        </div>
      </div>
    </div>


  );
};

export default MaterialArrivalRoomDetail;
