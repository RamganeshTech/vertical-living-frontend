import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useGetSingleAccounting, useUpdateAccounting } from "../../../apiList/Department Api/Accounting Api/accountingApi";
import { toast } from "../../../utils/toast";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import type { IAccounting } from "./AccountingMain";

const AccountingSingle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useGetSingleAccounting(id!) as { data: IAccounting, isLoading: boolean };
    const { mutateAsync: updateRecord } = useUpdateAccounting();
    const navigate = useNavigate()

    const [formData, setFormData] = useState<any>(data || {});
    const [editMode, setEditMode] = useState(false);


    const handleSave = async () => {
        try {
            await updateRecord({ id: id!, payload: formData });

            toast({ title: "success", description: "shipment has generated" })
            setEditMode(false);
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Operation Failed",
                variant: "destructive"
            });
        }
    }

    // useEffect(() => {
    //     setFormData(data)
    // }, [editMode])



    const preloadFormData = () => {
        if (data) {
            setFormData(
                {
                transactionType: data.transactionType,
                fromDept: data.fromDept,
                totalAmount: {
                    amount: data.totalAmount?.amount ?? 0,
                    taxAmount: data.totalAmount?.taxAmount ?? 0,
                },
                upiId: data?.upiId,
                status: data.status,
                dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split("T")[0] : "",
                notes: data.notes ?? "",
            }
        );
        }
    };

    const handleToggleEdit = () => {
        if (!editMode) {
            preloadFormData(); // load latest data before entering edit mode
        }
        setEditMode((prev) => !prev);
    };

    if (isLoading) return <p className="p-6"><MaterialOverviewLoading /></p>;

    if (!data) {
        <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
            <i className="fas fa-money-bill-wave text-5xl text-blue-300 mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Records Found</h3>
            {/* <p className="text-sm text-gray-500">
                                Looks like there are no Procurements yet for this project.<br />
                                Once you have <strong> generated the Pdf </strong>  items will be listed here  to get started 🚀
                            </p> */}
        </div>
    }

return (
  <div className="p-4 max-h-full overflow-y-auto max-w-full space-y-6">
    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
      <div className="flex gap-3 items-center">
        <div onClick={() => navigate(-1)}
          className="bg-blue-50 hover:bg-slate-300 flex items-center justify-center w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md">
          <i className="fas fa-arrow-left" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
          Transaction: {data?.transactionNumber ?? "N/A"}
        </h1>
      </div>

      {!editMode && <Button size="md" variant="primary" onClick={handleToggleEdit}>
        <i className="fas fa-edit mr-1" />
        {editMode ? "Cancel" : "Edit"}
      </Button>}
    </div>

    <Card>
      <CardContent className="p-6 space-y-6">

        {/* Amount + Tax */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Amount</h3>
            {editMode ? (
              <Input
                value={formData?.totalAmount?.amount}
                type="number"
                onChange={(e) => {
                  const val = +e.target.value;
                  if (val >= 0) {
                    setFormData((prev: any) => ({
                      ...prev,
                      totalAmount: {
                        ...prev.totalAmount,
                        amount: val || 0,
                      },
                    }));
                  }
                }}
              />
            ) : (
              <p className="text-lg text-gray-900 font-medium">₹ {data?.totalAmount?.amount}</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Tax</h3>
            {editMode ? (
              <Input
                value={formData?.totalAmount?.taxAmount}
                type="number"
                onChange={(e) => {
                  const val = +e.target.value;
                  if (val >= 0) {
                    setFormData((prev: any) => ({
                      ...prev,
                      totalAmount: {
                        ...prev.totalAmount,
                        taxAmount: val || 0,
                      },
                    }));
                  }
                }}
              />
            ) : (
              <p className="text-lg text-gray-900 font-medium">₹ {data?.totalAmount?.taxAmount}</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Upi ID</h3>
            {editMode ? (
              <Input
                value={formData.upiId}
                type="text"
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    upiId: e.target.value
                  }))
                }
              />
            ) : (
              <p className="text-lg text-gray-800">{data?.upiId || "-"}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Status</h3>
            {editMode ? (
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            ) : (
              <p className="text-sm font-medium text-blue-700 capitalize">{data.status}</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Due Date</h3>
            {editMode ? (
              <Input
                value={formData?.dueDate}
                type="date"
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    dueDate: e.target.value
                  }))
                }
              />
            ) : (
              <p className="text-sm text-gray-800">
                {data?.dueDate ? new Date(data?.dueDate).toLocaleDateString() : "-"}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Notes</h3>
          {editMode ? (
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
            />
          ) : (
            <p className="text-sm text-gray-800">{data.notes || "-"}</p>
          )}
        </div>

        {/* Read-Only Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="block font-medium text-gray-700">From Department</span>
            <span className="text-gray-800 capitalize">{data?.fromDept || "-"}</span>
          </div>
          <div>
            <span className="block font-medium text-gray-700">Paid At</span>
            <span className="text-gray-800">{data?.paidAt ? new Date(data?.paidAt).toLocaleString() : "-"}</span>
          </div>
        </div>

        {editMode && (
          <div className="flex justify-end gap-2">

           
            <Button onClick={handleSave}>
              <i className="fas fa-save mr-1" /> Save Changes
            </Button>

             <Button variant="secondary" onClick={()=> setEditMode(false)}>
              <i className="fas fa-save mr-1" />  Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);


};

export default AccountingSingle;

