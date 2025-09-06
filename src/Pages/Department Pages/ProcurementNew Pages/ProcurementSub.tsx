import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import {
//   useGetSingleProcurementDetails,
//   useUpdateProcurementShopDetails,
//   useUpdateProcurementDeliveryLocation,
//   useUpdateProcurementTotalCost
// } from "../../../apiList/Department Api/Logistics Api/procurementNew.queries";
import { Card, CardContent } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import {
    useGetSingleProcurementDetails,
    useUpdateProcurementShopDetails,
    useUpdateProcurementDeliveryLocation,
    useUpdateProcurementTotalCost,
    useProcurementGeneratePdf,
    useDeleteProcurementPdf,
    useSyncLogistics
} from "../../../apiList/Department Api/Procurement Api/procurementApi";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { toast } from "../../../utils/toast";
import { downloadImage } from "../../../utils/downloadFile";

const ProcurementSub: React.FC = () => {
    const { id } = useParams() as { id: string }
    const navigate = useNavigate()
    const { data, isLoading } = useGetSingleProcurementDetails(id);
    const { mutateAsync: updateShop } = useUpdateProcurementShopDetails();
    const { mutateAsync: updateDelivery } = useUpdateProcurementDeliveryLocation();
    const { mutateAsync: updateCost, isPending: totalCostPending } = useUpdateProcurementTotalCost();
    const { mutateAsync: generateLink, isPending: generatePending } = useProcurementGeneratePdf()
    const { mutateAsync: deletePdf, isPending: deletePdfLoading } = useDeleteProcurementPdf()
    const { mutateAsync: syncLogistics, isPending: syncLogisticsLoading } = useSyncLogistics()

    const [editCost, setEditCost] = useState(false);
    const [totalCost, setTotalCost] = useState<number>(data?.totalCost || 0);


    const [editDelivery, setEditDelivery] = useState(false);
    const [deliveryForm, setDeliveryForm] = useState<any>({});
    const [editShop, setEditShop] = useState(false);
    const [shopForm, setShopForm] = useState<any>({});




    const handleUpdateDelivery = async () => {
        try {

            if (deliveryForm?.phoneNumber) {
                if (!/^\d{10}$/.test(deliveryForm?.phoneNumber.trim())) {
                    throw new Error("Phone number should contain exactly 10 digit numbers")
                }
            }

            await updateDelivery({ id, payload: deliveryForm });
            setEditDelivery(false);
            toast({ title: "Success", description: "Delivery Details Updated" });


        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
        }
    };


    const handleUpdateShop = async () => {
        try {

            if (shopForm.phoneNumber) {
                if (!/^\d{10}$/.test(shopForm.phoneNumber.trim())) {
                    throw new Error("Phone number should contain exactly 10 digit numbers")
                }
            }

            await updateShop({ id, payload: shopForm });
            toast({ title: "Success", description: "Shop Details Updated" });
            setEditShop(false);
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
        }
    };



    const handletotalCost = async () => {
        try {
            await updateCost({
                id,
                payload: { totalCost }
            });
            setEditCost(false);
            toast({ title: "Success", description: "Cost Updated Successfully" });
        }
        catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });

        }
    }



    const handleGenerate = async () => {
        try {
            await generateLink({ id });

            toast({ title: "Success", description: "Pdf Generated successfully" });
        } catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to generate link", variant: "destructive" });
        }
    };



    const handleDeletePdf = async (pdfId: string) => {
        try {

            await deletePdf({ id, pdfId });
            toast({ title: "Success", description: "PDF deleted" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "failed to delete" });
        }
    };


    const handleGenerateLogistics = async () => {
        try {

            await syncLogistics({ id });
            toast({ title: "Success", description: "Details sent to Logistics Department" });
        } catch (error: any) {
            console.log("error", error)
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
        }
    }


    if (isLoading) return <MaterialOverviewLoading />;

    if (!data) {
        <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
            <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Procurement Found</h3>
            {/* <p className="text-sm text-gray-500">
                                Looks like there are no Procurements yet for this project.<br />
                                Once you have <strong> generated the Pdf </strong>  items will be listed here  to get started 🚀
                            </p> */}
        </div>
    }

    return (
        <div className="p-1 max-w-full max-h-full overflow-y-auto space-y-8">


            <header className="flex gap-2 items-center">
                <section className="flex flex-1 justify-between items-center">
                    <div className="flex gap-2 justify-between items-center">
                        <div onClick={() => navigate(-1)}
                            className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                            <i className='fas fa-arrow-left'></i>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
                            <span className="text-black text-2xl">Ref Id:</span> {data?.refPdfId ? data?.refPdfId.replace(/-pdf$/, "") : "N/A"}
                        </h1>
                    </div>

                    <div className="flex flex-col items-start space-y-1">
                        <Button
                            variant="primary"
                            isLoading={syncLogisticsLoading}
                            onClick={handleGenerateLogistics}
                        >
                            Send To Logistics Dept
                        </Button>
                        <span className="text-xs text-blue-500 mx-auto">
                            <strong>*</strong> Click the button to send the <br /> details to  logistics dept
                        </span>
                    </div>
                </section>
            </header>

            <div className="border-l-4 border-blue-600 rounded-lg p-4 shadow-sm relative bg-white">
                <h2 className="text-base sm:text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                    <i className="fa-solid fa-store"></i>
                    Shop Details
                </h2>
                {editShop ? (
                    <div className="space-y-3">
                        <Input
                            placeholder="Shop Name"
                            value={shopForm?.shopName || ""}
                            onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                            className="w-full"
                        />
                        <Input
                            placeholder="Contact Person"
                            value={shopForm?.contactPerson || ""}
                            onChange={(e) => setShopForm({ ...shopForm, contactPerson: e.target.value })}
                            className="w-full"
                        />
                        <Input
                            placeholder="Phone Number"
                            value={shopForm?.phoneNumber || ""}
                            type="tel"
                            maxLength={10}
                            // onChange={(e) => setShopForm({ ...shopForm, phoneNumber: e.target.value })}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only digits (0–9)
                                if (/^\d*$/.test(value)) {
                                    setShopForm({ ...shopForm, phoneNumber: value });
                                }
                            }}
                            className="w-full"
                        />
                        <Input
                            placeholder="Address"
                            value={shopForm?.address || ""}
                            onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                            className="w-full"
                        />
                        <div className="flex flex-col sm:flex-row gap-2 mt-3  justify-end ">
                            <Button onClick={handleUpdateShop} className="w-full sm:w-auto">
                                <i className="fa-solid fa-save mr-2"></i>Save
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setEditShop(false)}
                                className="w-full sm:w-auto"
                            >
                                <i className="fa-solid fa-times mr-2"></i>Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2 text-sm sm:text-base">
                        <p><strong>Shop Name:</strong> {data?.shopDetails?.shopName || "-"}</p>
                        <p><strong>Contact Person:</strong> {data?.shopDetails?.contactPerson || "-"}</p>
                        <p><strong>Phone:</strong> {data?.shopDetails?.phoneNumber || "-"}</p>
                        <p><strong>Address:</strong> {data?.shopDetails?.address || "-"}</p>

                        <button
                            onClick={() => { setShopForm(data?.shopDetails); setEditShop(true); }}
                            className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
                        >
                            <i className="fa-solid fa-edit mr-1"></i>Edit
                        </button>

                    </div>
                )}
            </div>

            <div className="border-l-4 mt-4 border-blue-600 rounded-lg p-4 shadow-sm relative bg-white">
                <h2 className="text-base sm:text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                    <i className="fa-solid fa-truck"></i>
                    Delivery Location
                </h2>
                {editDelivery ? (
                    <div className="space-y-3">
                        <Input
                            placeholder="Site Name"
                            value={deliveryForm?.siteName || ""}
                            onChange={(e) => setDeliveryForm({ ...deliveryForm, siteName: e.target.value })}
                            className="w-full"
                        />
                        <Input
                            placeholder="Site Supervisor"
                            value={deliveryForm?.siteSupervisor || ""}
                            onChange={(e) => setDeliveryForm({ ...deliveryForm, siteSupervisor: e.target.value })}
                            className="w-full"
                        />
                        <Input
                            placeholder="Phone Number"
                            type="tel"
                            maxLength={10}
                            value={deliveryForm?.phoneNumber || ""}
                            // onChange={(e) => setDeliveryForm({ ...deliveryForm, phoneNumber: e.target.value })}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only digits (0–9)
                                if (/^\d*$/.test(value)) {
                                    setDeliveryForm({ ...deliveryForm, phoneNumber: value });
                                }
                            }}
                            className="w-full"
                        />
                        <Input
                            placeholder="Address"
                            value={deliveryForm?.address || ""}
                            onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                            className="w-full"
                        />
                        <div className="flex flex-col sm:flex-row gap-2 mt-3 justify-end ">
                            <Button onClick={handleUpdateDelivery} className="w-full sm:w-auto">
                                <i className="fa-solid fa-save mr-2"></i>Save
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setEditDelivery(false)}
                                className="w-full sm:w-auto"
                            >
                                <i className="fa-solid fa-times mr-2"></i>Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2 text-sm sm:text-base">
                        <p><strong>Site Name:</strong> {data?.deliveryLocationDetails?.siteName || "-"}</p>
                        <p><strong>Supervisor:</strong> {data?.deliveryLocationDetails?.siteSupervisor || "-"}</p>
                        <p><strong>Phone:</strong> {data?.deliveryLocationDetails?.phoneNumber || "-"}</p>
                        <p><strong>Address:</strong> {data?.deliveryLocationDetails?.address || "-"}</p>
                        <button
                            onClick={() => { setDeliveryForm(data?.deliveryLocationDetails); setEditDelivery(true); }}
                            className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
                        >
                            <i className="fa-solid fa-edit mr-1"></i>Edit
                        </button>
                    </div>
                )}
            </div>

            <Card>
                <CardContent className="py-6 space-y-5">
                    <div className="space-y-4">
                        {/* Heading Row with Items & Total Cost */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <h3 className="text-lg font-bold text-indigo-700 mb-2 sm:mb-0">
                                Items List 📋
                            </h3>

                            {/* Total Cost Right Aligned */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <h3 className="text-lg font-bold text-blue-700">
                                    {/* <i className="fas fa-money-bill-1-wave"></i>  */}
                                    Total Cost </h3>
                                <div className="flex items-center gap-3 text-sm">
                                    {editCost ? (
                                        <>
                                            <Input
                                                type="number"
                                                className="w-32"
                                                value={totalCost}
                                                onChange={(e) => setTotalCost(Number(e.target.value))}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handletotalCost();
                                                }}
                                            />
                                            <Button size="sm" isLoading={totalCostPending} onClick={handletotalCost}>
                                                Save
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-base font-semibold text-gray-800">₹ {data.totalCost}</p>
                                            <Button size="sm" variant="secondary" onClick={() => setEditCost(true)}>
                                                <i className="fas fa-pen mr-1" />
                                                Edit
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto rounded border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50 text-sm text-gray-700 font-medium">
                                    <tr>
                                        <th className="px-5 py-2 text-left">Item Name</th>
                                        <th className="px-5 py-2 text-left">Quantity</th>
                                        <th className="px-5 py-2 text-left">Unit</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100 text-sm">
                                    {data.selectedUnits.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td className="px-5 py-2">{item.subItemName}</td>
                                            <td className="px-5 py-2">{item.quantity}</td>
                                            <td className="px-5 py-2">{item.unit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>



            {/* PDF GENERATION */}


            <div className="space-y-4">



                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Export Procurement Material
                            </h3>
                            <p className="text-sm text-gray-600">
                                Generate a PDF document of your Procurements
                            </p>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={generatePending}
                            className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                            size="lg"
                        >
                            {generatePending ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-file-pdf"></i>
                                    Generate PDF
                                </>
                            )}
                        </Button>
                    </div>

                    {data?.procurementPdfs && data?.procurementPdfs?.length > 0 ?

                        data?.procurementPdfs?.map((ele: any) => (
                            <Card key={ele._id} className="border-green-200 bg-green-50 ">
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-check-circle text-green-600"></i>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-green-900 mb-1">
                                                    {/* PDF Generated Successfully */}
                                                    {/* {ele.pdfName} */}
                                                    <span className="text-sm text-black">Pdf Reference Id: </span>{ele.refUniquePdf || "N/A"}
                                                </h4>
                                                {/* <span className="text-sm">Pdf Reference Id: {ele.refUniquePdf || "N/A"}</span> */}
                                                <p className="text-sm text-green-700">
                                                    Your Procurement PDF is ready to view or download
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ">
                                            <Button
                                                variant="outline"
                                                onClick={() => window.open(ele.url, "_blank")}
                                                className="border-green-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                            >
                                                <i className="fas mr-2 fa-external-link-alt"></i>
                                                View in New Tab
                                            </Button>

                                            <Button
                                                variant="secondary"
                                                onClick={() => downloadImage({ src: ele.url, alt: "Procurement" })}
                                                className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                            >
                                                Download PDF
                                            </Button>


                                            {/* <div className="relative  min-w-[160px]">
                                                                        <label
                                                                            htmlFor={`pdf-status-${ele._id}`}
                                                                            className="hidden md:block mb-1 text-sm font-medium text-gray-600 absolute top-[-20px]"
                                                                        >
                                                                            Order Status
                                                                        </label>
                                                                        <select
                                                                            id={`pdf-status-${ele._id}`}
                                                                            value={ele.status || "pending"}
                                                                            onChange={async (e) => {
                                                                                const val = e.target.value;
                                                                                await handleUpdatePdfStatus(ele._id, val);
                                                                            }}
                                                                            className="
                                                                                                w-full h-[45px] px-3 py-2 text-md  bg-white border  rounded-xl shadow 
                                                                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                                                                disabled:opacity-50 appearance-none transition ease-in-out
                                                                                                border-blue-300 text-blue-800  hover:border-blue-400
                                                                                                "
                                                                        >
                                                                            {["pending", "delivered", "shipped", "ordered", "cancelled"].map((status) => (
                                                                                <option key={status} value={status}>
                                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                                </option>
                                                                            ))}
                                                                        </select>
            
                                                                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                                                            <i className="fas fa-chevron-down text-xs"></i>
                                                                        </div>
                                                                    </div> */}

                                            <Button
                                                variant="danger"
                                                isLoading={deletePdfLoading}
                                                onClick={() => handleDeletePdf(ele._id)}
                                                className="border-red-300 bg-red-600 text-white hover:bg-red-600 hover:border-red-400"
                                            >
                                                Delete PDF
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                        :
                        <>
                            <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                                <i className="fa-solid fa-file-lines text-5xl text-blue-300 mb-4" />
                                <h3 className="text-lg font-semibold text-blue-800 mb-1">No Pdf Found</h3>
                                <p className="text-sm text-gray-500">
                                    No PDF Generated</p>
                            </div>
                        </>
                    }
                </div>

            </div>
        </div>
    );
};

export default ProcurementSub;