import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetLabourLists,
  useGetLabourItems,
  useCreateLabourList,
  useUpdateLabourList,
  useDeleteLabourList,
  useCreateLabourItem,
  useUpdateLabourItem,
  useDeleteLabourItem,
} from '../../../apiList/labourApi';
import type { ILabourList } from "../../../types/types";
import ErrorComponent from "../../../components/ErrorComponent";

export default function LabourList() {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) return null;

  const {
    data: labourLists,
    isLoading: listsLoading,
    error: listsError,
    refetch: refetchLists,
  } = useGetLabourLists({ projectId: projectId! });

  const [expandedListId, setExpandedListId] = useState<string | null>(null);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState<string>("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemData, setEditingItemData] = useState<any>(null);
  const [labourItemsMap, setLabourItemsMap] = useState<Record<string, any[] | undefined>>({});

  const updateListMutation = useUpdateLabourList();
  const deleteListMutation = useDeleteLabourList();
  const createListMutation = useCreateLabourList();

  const updateItemMutation = useUpdateLabourItem();
  const deleteItemMutation = useDeleteLabourItem();
  const createItemMutation = useCreateLabourItem();

  useEffect(() => {
    if (!expandedListId || labourItemsMap[expandedListId]) return;
  }, [expandedListId]);

  const toggleExpandList = (listId: string) =>
    setExpandedListId((prev) => (prev === listId ? null : listId));
  const startEditList = (listId: string, currentName: string) => {
    setEditingListId(listId);
    setEditingListName(currentName);
  };
  const saveEditList = async (listId: string) => {
    if (!editingListName.trim()) return alert("List name cannot be empty");
    await updateListMutation.mutateAsync({
      projectId,
      labourListId: listId,
      labourListName: editingListName.trim(),
    });
    setEditingListId(null);
    refetchLists();
  };
  const deleteList = async (listId: string) => {
    if (window.confirm("Are you sure you want to delete this labour list?")) {
      await deleteListMutation.mutateAsync({ labourListId: listId, projectId });
      if (expandedListId === listId) setExpandedListId(null);
      refetchLists();
    }
  };
  const startEditItem = (item: any) => {
    setEditingItemId(item.id);
    setEditingItemData({ ...item });
  };
  const saveEditItem = async () => {
    if (!editingItemData.role?.trim()) return alert("Role cannot be empty");
    editingItemData.totalCost =
      editingItemData.numberOfPeople *
      editingItemData.estimatedHours *
      editingItemData.hourlyRate;
    await updateItemMutation.mutateAsync(editingItemData);
    setEditingItemId(null);
    if (expandedListId)
      setLabourItemsMap((prev) => ({ ...prev, [expandedListId]: undefined }));
  };
  const deleteItem = async (itemId: string, labourListId: string) => {
    if (window.confirm("Delete this labour item?")) {
      await deleteItemMutation.mutateAsync({ labourItemId: itemId, labourListId });
      if (expandedListId)
        setLabourItemsMap((prev) => ({ ...prev, [expandedListId]: undefined }));
    }
  };

  const [newListName, setNewListName] = useState("");
  const addNewList = async () => {
    if (!newListName.trim()) return alert("Enter list name");
    await createListMutation.mutateAsync({
      projectId: projectId!,
      labourListName: newListName.trim(),
    });
    setNewListName("");
    refetchLists();
  };

  const [newItemInputs, setNewItemInputs] = useState<any>({});
  const addNewItem = async (listId: string) => {
    const input = newItemInputs[listId];
    if (
      !input?.role ||
      !input?.numberOfPeople ||
      !input?.estimatedHours ||
      !input?.hourlyRate
    )
      return alert("Fill all required fields for new labour item");

    const totalCost =
      Number(input.numberOfPeople) *
      Number(input.estimatedHours) *
      Number(input.hourlyRate);
    await createItemMutation.mutateAsync({
      labourListId: listId,
      projectId,
      labourData: {
        role: input.role,
        numberOfPeople: Number(input.numberOfPeople),
        estimatedHours: Number(input.estimatedHours),
        hourlyRate: Number(input.hourlyRate),
        totalCost,
        notes: input.notes || "",
      },
    });
    setNewItemInputs((prev: any) => ({ ...prev, [listId]: {} }));
    setLabourItemsMap((prev) => ({ ...prev, [listId]: undefined }));
  };

  const LabourItemsList = ({ labourListId }: { labourListId: string }) => {
    const {
      data: labourItems,
      isLoading,
      error,
      isError,
    } = useGetLabourItems({ labourListId });

    useEffect(() => {
      if (labourItems)
        setLabourItemsMap((prev) => ({ ...prev, [labourListId]: labourItems }));
    }, [labourItems, labourListId]);

    if (isLoading)
      return <p className="text-blue-400 text-sm italic">Loading items...</p>;

    if (isError)
      return (
        <ErrorComponent
          message={
            (error as any)?.response?.data?.message ||
            (error as any)?.message ||
            "Something went wrong"
          }
          onClick={() => {}}
        />
      );

    return (
      <div className="mt-4 pl-4 border-l-4 border-blue-400">
        {labourItems.map((item: any) =>
          editingItemId === item.id ? (
            <div
              key={item.id}
              className="mb-4 p-4 rounded-md shadow-md bg-blue-50 border border-blue-200"
            >
              <input
                type="text"
                value={editingItemData.role}
                onChange={(e) =>
                  setEditingItemData((prev: any) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                placeholder="Role"
                className="input-blue mb-2"
              />
              <input
                type="number"
                value={editingItemData.numberOfPeople}
                onChange={(e) =>
                  setEditingItemData((prev: any) => ({
                    ...prev,
                    numberOfPeople: Number(e.target.value),
                  }))
                }
                placeholder="Number of People"
                className="input-blue mb-2"
              />
              <input
                type="number"
                value={editingItemData.estimatedHours}
                onChange={(e) =>
                  setEditingItemData((prev: any) => ({
                    ...prev,
                    estimatedHours: Number(e.target.value),
                  }))
                }
                placeholder="Estimated Hours"
                className="input-blue mb-2"
              />
              <input
                type="number"
                value={editingItemData.hourlyRate}
                onChange={(e) =>
                  setEditingItemData((prev: any) => ({
                    ...prev,
                    hourlyRate: Number(e.target.value),
                  }))
                }
                placeholder="Hourly Rate"
                className="input-blue mb-2"
              />
              <textarea
                value={editingItemData.notes}
                onChange={(e) =>
                  setEditingItemData((prev: any) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Notes (optional)"
                className="input-blue mb-2"
              />
              <div className="font-semibold text-blue-700 mb-2">
                Total Cost: ₹
                {editingItemData.numberOfPeople *
                  editingItemData.estimatedHours *
                  editingItemData.hourlyRate}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={saveEditItem}
                  className="btn-blue px-4 py-1 rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingItemId(null)}
                  className="btn-gray px-4 py-1 rounded-md font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-blue-200 py-2 cursor-pointer hover:bg-blue-50 rounded-md"
            >
              <div
                onClick={() => startEditItem(item)}
                className="flex-1 text-blue-900 font-medium"
              >
                <strong>{item.role}</strong> x{item.numberOfPeople} (
                {item.estimatedHours}h @ ₹{item.hourlyRate}) → ₹{item.totalCost}
                {item.notes && (
                  <div className="text-xs text-blue-600 italic">
                    Note: {item.notes}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteItem(item.id, labourListId)}
                className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-100 transition"
                title="Delete item"
              >
                🗑️
              </button>
            </div>
          )
        )}

        <div className="mt-5 border border-dashed border-blue-300 rounded-md p-4 bg-blue-50">
          <h4 className="text-blue-800 font-semibold mb-3 text-lg">
            Add New Labour Item
          </h4>
          <input
            type="text"
            placeholder="Role"
            value={newItemInputs[labourListId]?.role || ""}
            onChange={(e) =>
              setNewItemInputs((prev: any) => ({
                ...prev,
                [labourListId]: { ...prev[labourListId], role: e.target.value },
              }))
            }
            className="input-blue mb-3"
          />
          <input
            type="number"
            placeholder="Number of People"
            value={newItemInputs[labourListId]?.numberOfPeople || ""}
            onChange={(e) =>
              setNewItemInputs((prev: any) => ({
                ...prev,
                [labourListId]: {
                  ...prev[labourListId],
                  numberOfPeople: Number(e.target.value),
                },
              }))
            }
            className="input-blue mb-3"
          />
          <input
            type="number"
            placeholder="Estimated Hours"
            value={newItemInputs[labourListId]?.estimatedHours || ""}
            onChange={(e) =>
              setNewItemInputs((prev: any) => ({
                ...prev,
                [labourListId]: {
                  ...prev[labourListId],
                  estimatedHours: Number(e.target.value),
                },
              }))
            }
            className="input-blue mb-3"
          />
          <input
            type="number"
            placeholder="Hourly Rate"
            value={newItemInputs[labourListId]?.hourlyRate || ""}
            onChange={(e) =>
              setNewItemInputs((prev: any) => ({
                ...prev,
                [labourListId]: {
                  ...prev[labourListId],
                  hourlyRate: Number(e.target.value),
                },
              }))
            }
            className="input-blue mb-3"
          />
          <textarea
            placeholder="Notes (optional)"
            value={newItemInputs[labourListId]?.notes || ""}
            onChange={(e) =>
              setNewItemInputs((prev: any) => ({
                ...prev,
                [labourListId]: { ...prev[labourListId], notes: e.target.value },
              }))
            }
            className="input-blue mb-3"
          />
          <button
            onClick={() => addNewItem(labourListId)}
            className="btn-blue w-full py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Add Item
          </button>
        </div>
      </div>
    );
  };

  if (listsLoading)
    return <p className="text-blue-400 text-sm italic">Loading labour lists...</p>;

  return (
    <div className="max-w-4xl mx-auto font-sans p-6 bg-white rounded-lg shadow-lg">
      {!listsLoading && listsError && (
        <ErrorComponent
          message={
            (listsError as any)?.response?.data?.message ||
            (listsError as any)?.message ||
            "Something went wrong"
          }
          onClick={() => {}}
        />
      )}

      <h2 className="text-3xl font-extrabold text-blue-800 mb-6">
        Labour Lists for Project {projectId}
      </h2>

      {!listsLoading &&
        labourLists.map((list: ILabourList) => (
          <div
            key={(list as any)._id}
            className="border border-blue-300 rounded-lg mb-6 p-5 bg-blue-50 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center cursor-pointer">
              {editingListId === (list as any)._id ? (
                <>
                  <input
                    type="text"
                    value={editingListName}
                    onChange={(e) => setEditingListName(e.target.value)}
                    className="input-blue font-semibold text-lg flex-1"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEditList((list as any)._id)}
                    className="btn-blue ml-4 px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingListId(null)}
                    className="btn-gray ml-2 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3
                    onClick={() => toggleExpandList((list as any)._id)}
                    className="text-xl font-semibold text-blue-900 flex-1 hover:underline"
                  >
                    {list.labourListName}
                  </h3>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        startEditList((list as any)._id, list.labourListName)
                      }
                      className="btn-blue px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteList((list as any)._id)}
                      className="btn-red px-4 py-2 rounded-md font-semibold hover:bg-red-600 text-white transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
            {expandedListId === (list as any)._id && (
              <LabourItemsList labourListId={(list as any)._id} />
            )}
          </div>
        ))}

      <div className="mt-8 p-5 border border-blue-300 rounded-lg bg-blue-50 shadow-sm max-w-md mx-auto">
        <h3 className="text-2xl font-semibold text-blue-900 mb-4">
          Add New Labour List
        </h3>
        <input
          type="text"
          placeholder="New labour list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="input-blue w-full mb-4"
        />
        <button
          onClick={addNewList}
          className="btn-blue w-full py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Add List
        </button>
      </div>
    </div>
  );
}
