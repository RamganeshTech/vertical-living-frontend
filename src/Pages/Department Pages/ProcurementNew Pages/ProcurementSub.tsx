import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import {
    useGetSingleProcurementDetails,
    useUpdateProcurementShopDetails,
    useUpdateProcurementDeliveryLocation,
    // useUpdateProcurementTotalCost,
    useProcurementGeneratePdf,
    useDeleteProcurementPdf,
    useSyncLogistics,
    // useProcurementGenerateLink,
    useSyncProcurementToPaymentsSection,
    useCancelProcurementAutomation,
    useConfirmFinalShopQuote,
    // useSyncAccountsProcurement
} from "../../../apiList/Department Api/Procurement Api/procurementApi";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { toast } from "../../../utils/toast";
import { downloadImage } from "../../../utils/downloadFile";
import InfoTooltip from "../../../components/ui/InfoToolTip";
import { dateFormate } from "../../../utils/dateFormator";
import { Badge } from "../../../components/ui/Badge";
import { Textarea } from "../../../components/ui/TextArea";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import type { IProcurementNew, IShopQuotes } from "./ProcurementNewMain";










const ProcurementSub: React.FC = () => {
    const { id } = useParams() as { id: string, organizationId: string }
    const navigate = useNavigate()
    const location = useLocation()

    const { data, isLoading, refetch } = useGetSingleProcurementDetails(id) as { data: IProcurementNew, isLoading: boolean, refetch: any }
    const { mutateAsync: updateShop } = useUpdateProcurementShopDetails();
    const { mutateAsync: updateDelivery } = useUpdateProcurementDeliveryLocation();
    // const { mutateAsync: updateCost, isPending: totalCostPending } = useUpdateProcurementTotalCost();
    const { mutateAsync: generatePdf, isPending: generatePending } = useProcurementGeneratePdf()
    // const { mutateAsync: generateLink, isPending: linkPending } = useProcurementGenerateLink()
    const { mutateAsync: deletePdf, isPending: deletePdfLoading } = useDeleteProcurementPdf()
    const { mutateAsync: syncPaymentsMutation, isPending: syncPaymentsLoading } = useSyncProcurementToPaymentsSection()

    const { mutateAsync: confirmQuote, isPending: isConfirming } = useConfirmFinalShopQuote();



    const { mutateAsync: syncLogistics, isPending: syncLogisticsLoading } = useSyncLogistics()
    // const { mutateAsync: syncAccounts, isPending: syncAccountsLoading } = useSyncAccountsProcurement()

    // const [editCost, setEditCost] = useState(false);
    // const [totalCost, _setTotalCost] = useState<number>(data?.totalCost || 0);

    // const [link, setLink] = useState<string>("");
    // const link = data?.generatedLink ? `${import.meta.env.VITE_FRONTEND_URL}/${organizationId}/procurement/public/${encodeURIComponent(data?.generatedLink)}` : null;




    const { role, permission } = useAuthCheck();


    const canList = role === "owner" || permission?.procurement?.list;
    const canEdit = role === "owner" || permission?.procurement?.edit;


    // const tokenEncoded = encodeURIComponent(data?.generatedLink!); // encode only once
    // const link = `${import.meta.env.VITE_FRONTEND_URL}/${organizationId}/procurement/public?token=${tokenEncoded}&orderId=${id}`;

    // const [copied, setCopied] = useState(false);

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



    // const handletotalCost = async () => {
    //     try {
    //         await updateCost({
    //             id,
    //             payload: { totalCost }
    //         });
    //         setEditCost(false);
    //         toast({ title: "Success", description: "Cost Updated Successfully" });
    //     }
    //     catch (error: any) {
    //         toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });

    //     }
    // }



    const handleGeneratePdf = async () => {
        try {
            await generatePdf({ id });

            toast({ title: "Success", description: "Pdf Generated successfully" });
        } catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to generate link", variant: "destructive" });
        }
    };



    // const handleGenerateLink = async () => {
    //     try {
    //         await generateLink({ orderId: id });
    //         refetch()
    //         toast({ title: "Success", description: "Link Generated successfully" });
    //     } catch (err: any) {
    //         toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to generate link", variant: "destructive" });
    //     }
    // };

    // // Copy to clipboard handler
    // const handleCopy = async () => {

    //     if (!link) return

    //     try {
    //         await navigator.clipboard.writeText(link);
    //         setCopied(true);
    //         setTimeout(() => setCopied(false), 1500);
    //     } catch (err) {
    //         toast({ title: "Error", description: "Failed to copy link", variant: "destructive" });
    //     }
    // };





    // const handleWhatsappShare = () => {
    //     if (!link) return;

    //     // Pre-filled message
    //     // const text = `Hey, please check this items link: ${link}`
    //     const text = `Hey, please check this items link:\n\n${link}`;


    //     // Check if phone number exists
    //     const phoneNumber = data?.shopDetails?.phoneNumber;

    //     let waUrl = "";

    //     if (phoneNumber) {
    //         // Send directly to the phone number (must include country code, no + or spaces)
    //         // Example: 919876543210
    //         // const formattedNumber = phoneNumber.replace(/\D/g, ""); // remove non-digit characters
    //         // waUrl = `https://wa.me/${formattedNumber}?text=${text}`;

    //         // Remove non-digit characters
    //         const formattedNumber = phoneNumber.replace(/\D/g, "");
    //         waUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(text)}`;

    //     } else {
    //         // Fallback: let user choose whom to send
    //         waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    //     }

    //     // Open WhatsApp
    //     window.open(waUrl, "_blank");
    // };



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
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
        }
    }


    const handleSyncToPayments = async () => {
        try {
            if (data?.isSyncWithPaymentsSection) {
                return toast({ variant: "destructive", title: "Error", description: "already sent to payments section" });
            }
            await syncPaymentsMutation({
                id: data._id!
            });
            refetch?.()
            toast({ title: "Success", description: "Procurement order sent to Payments Section" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
        }
    }




    const handleConfirmSelection = async (e: React.MouseEvent, quoteId: string) => {
        try {
            e.stopPropagation(); // ✋ Stops the card from navigating to the details page

            await confirmQuote({ id: id!, quoteId: quoteId });
            refetch?.()
            toast({ title: "Success", description: "Shop quote selected successfully" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
        }
    };



    // const handleGenerateAccounts = async () => {
    //     try {
    //         await syncAccounts({ fromDept: "procurement", organizationId,
    //              projectId: data?.projectId, totalCost: data?.totalCost,
    //               upiId: data?.shopDetails?.upiId || null
    //             });
    //         toast({ title: "Success", description: "Details sent to Accounts Department" });
    //     } catch (error: any) {
    //         toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
    //     }
    // }



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


    if (location.pathname.includes("shopquote")) {
        return <Outlet />
    }

    if (!canList) {
        return;
    }


    // console.log("data", data)
    // console.log("data procuremnet", data.procurementNumber)

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
                            <span className="!text-gray-600 text-2xl">Procurement No:</span> {" "}
                            {/* {data?.procurementNumber || data?.refPdfId ? data?.refPdfId?.replace(/-pdf$/, "") : "N/A"} */}

                            {data?.procurementNumber
                                ? data.procurementNumber
                                : data?.refPdfId
                                    ? data.refPdfId?.replace(/-pdf$/, "")
                                    : "N/A"}

                        </h1>
                    </div>

                    <div className="flex gap-2 items-center ">

                        {/* <div className="flex flex-col items-start space-y-1">
                            <Button
                                variant="primary"
                                isLoading={syncAccountsLoading}
                                onClick={handleGenerateAccounts}
                            >
                                Send To Accounts Dept
                            </Button>
                            <span className="text-xs text-blue-500 mx-auto">
                                <strong>*</strong> Click the button to send the <br /> details to  accounts dept
                            </span>
                        </div> */}

                        <div className="flex gap-1 items-center">
                            <InfoTooltip
                                content="Click the button to send the details to  payments dept"
                                position="bottom"
                                className=""
                            />
                            <Button
                                variant="primary"
                                disabled={data.isSyncWithPaymentsSection}
                                isLoading={syncPaymentsLoading}
                                className="disabled:cursor-not-allowed"
                                onClick={handleSyncToPayments}
                            >
                                Send To Payments
                            </Button>

                            <Button
                                variant="primary"
                                disabled={data.isSyncWithLogistics}
                                isLoading={syncLogisticsLoading}
                                className="disabled:cursor-not-allowed"
                                onClick={handleGenerateLogistics}
                            >
                                Send To Logistics
                            </Button>

                            {/* <Button
                                variant="danger"
                                disabled={data.isSyncWithPaymentsSection &&}
                                isLoading={cancelSyncPaymentsLoading}
                                className="disabled:cursor-not-allowed"
                                onClick={handleCancelSyncToPayments}
                            >
                                Cancel Automation
                            </Button> */}


                            {!data.isSyncWithPaymentsSection && <AutomationTimerButton
                                data={data}
                                refetch={refetch}
                            />}




                            {/* <span className="text-xs text-blue-500 mx-auto">
                                <strong>*</strong> Click the button to send the <br /> details to  logistics dept
                            </span> */}
                        </div>

                    </div>
                </section>
            </header>

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 min-h-[140px] divide-y md:divide-y-0 md:divide-x divide-gray-100">

                    {/* --- COLUMN 1: SHOP DETAILS (Editable) --- */}
                    <div className="p-4 flex flex-col relative group transition-all hover:bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <i className="fa-solid fa-store text-sm"></i>
                            </div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Shop Details</h4>

                            {/* Edit Button (Only visible in view mode) */}
                            {(!editShop && canEdit) && (
                                <button
                                    onClick={() => { setShopForm(data?.shopDetails); setEditShop(true); }}
                                    className="ml-auto cursor-pointer text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Edit Shop Details"
                                >
                                    <i className="fa-solid fa-pen-to-square text-sm"></i>
                                </button>
                            )}
                        </div>

                        {editShop ? (
                            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                <Input
                                    placeholder="Shop Name"
                                    value={shopForm?.shopName || ""}
                                    onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                                    className="h-8 text-xs"
                                />
                                <Input
                                    placeholder="Contact Person"
                                    value={shopForm?.contactPerson || ""}
                                    onChange={(e) => setShopForm({ ...shopForm, contactPerson: e.target.value })}
                                    className="h-8 text-xs"
                                />
                                <Input
                                    placeholder="Phone"
                                    value={shopForm?.phoneNumber || ""}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value)) setShopForm({ ...shopForm, phoneNumber: e.target.value });
                                    }}
                                    className="h-8 text-xs"
                                    maxLength={10}
                                />

                                <Textarea
                                    placeholder="Address"
                                    value={shopForm?.address || ""}
                                    onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                                    className=" text-xs"
                                />

                                {/* <Input
                                    placeholder="upi Id"
                                    value={shopForm?.upiId || ""}
                                    onChange={(e) => setShopForm({ ...shopForm, upiId: e.target.value })}
                                    className="h-8"
                                /> */}

                                <div className="flex gap-2 pt-1">
                                    <Button size="sm" onClick={() => { handleUpdateShop(); setEditShop(false); }} className="h-7 text-xs px-3 bg-blue-600">
                                        Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditShop(false)} className="h-7 text-xs px-3">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5 mt-1">
                                <p className="font-bold text-gray-900 text-base leading-tight truncate">
                                    {data?.shopDetails?.shopName || <span className="text-gray-400 italic">No Shop Name</span>}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <i className="fa-solid fa-user text-gray-400 w-3"></i>
                                    <span className="truncate">{data?.shopDetails?.contactPerson || "-"}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <i className="fa-solid fa-phone text-gray-400 w-3"></i>
                                    <span className="font-mono">{data?.shopDetails?.phoneNumber || "-"}</span>
                                </div>

                                <div className="flex items-start gap-2 text-xs text-gray-500 mt-1">
                                    <i className="fa-solid fa-location-dot text-gray-400 w-3 mt-0.5"></i>
                                    <p className="line-clamp-2 leading-snug">{data?.shopDetails?.address || "-"}</p>
                                </div>

                                {/* <div className="flex items-start gap-2 text-xs text-gray-500 mt-1">
                                    <i className="fa-solid fa-wallet text-gray-400 w-3 mt-0.5"></i>
                                    <p className="line-clamp-2 leading-snug">{data?.shopDetails?.upiId || "-"}</p>
                                </div> */}

                                {/* <p><strong>Upi Id:</strong> {data?.shopDetails?.upiId || "-"}</p> */}

                            </div>
                        )}
                    </div>

                    {/* --- COLUMN 2: DELIVERY LOCATION (Editable) --- */}
                    <div className="p-4 flex flex-col relative group transition-all hover:bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <i className="fa-solid fa-truck-fast text-sm"></i>
                            </div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Details</h4>

                            {/* Edit Button */}
                            {(!editDelivery && canEdit) && (
                                <button
                                    onClick={() => { setDeliveryForm(data?.deliveryLocationDetails); setEditDelivery(true); }}
                                    className="ml-auto cursor-pointer text-gray-400 hover:text-orange-600 transition-colors"
                                    title="Edit Delivery Details"
                                >
                                    <i className="fa-solid fa-pen-to-square text-sm"></i>
                                </button>
                            )}
                        </div>

                        {editDelivery ? (
                            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                <Input
                                    placeholder="Site Name"
                                    value={deliveryForm?.siteName || ""}
                                    onChange={(e) => setDeliveryForm({ ...deliveryForm, siteName: e.target.value })}
                                    className="h-8 text-xs"
                                />
                                <Input
                                    placeholder="Supervisor"
                                    value={deliveryForm?.siteSupervisor || ""}
                                    onChange={(e) => setDeliveryForm({ ...deliveryForm, siteSupervisor: e.target.value })}
                                    className="h-8 text-xs"
                                />
                                <Input
                                    placeholder="Phone"
                                    value={deliveryForm?.phoneNumber || ""}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value)) setDeliveryForm({ ...deliveryForm, phoneNumber: e.target.value });
                                    }}
                                    className="h-8 text-xs"
                                    maxLength={10}
                                />
                                <Input
                                    placeholder="Address"
                                    value={deliveryForm?.address || ""}
                                    onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                                    className="w-full"
                                />
                                <div className="flex gap-2 pt-1">
                                    <Button size="sm" onClick={() => { handleUpdateDelivery(); setEditDelivery(false); }} className="h-7 text-xs px-3 bg-blue-600">
                                        Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditDelivery(false)} className="h-7 text-xs px-3">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5 mt-1">
                                <p className="font-bold text-gray-900 text-base leading-tight truncate">
                                    {data?.deliveryLocationDetails?.siteName || <span className="text-gray-400 italic">No Site Name</span>}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <i className="fa-solid fa-helmet-safety text-gray-400 w-3"></i>
                                    <span>{data?.deliveryLocationDetails?.siteSupervisor || "No Supervisor"}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <i className="fa-solid fa-mobile-screen text-gray-400 w-3"></i>
                                    <span className="font-mono">{data?.deliveryLocationDetails?.phoneNumber || "-"}</span>
                                </div>

                                <div className="flex items-start gap-2 text-xs text-gray-500 mt-1">
                                    <i className="fa-solid fa-map-pin text-gray-400 w-3 mt-0.5"></i>
                                    <p className="line-clamp-2 leading-snug">{data?.deliveryLocationDetails?.address || "No Address"}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- COLUMN 3: ORDER MATERIAL / SOURCE INFO --- */}
                    <div className="px-4  flex flex-col justify-center border-dashed border-l border-gray-200 bg-gray-50/30">
                        {/* Badge for Department Name */}
                        <div className="mb-2 flex gap-[3px]">
                            <span className="text-[10px] text-gray-400 uppercase font-semibold">From:</span>
                            {/* <span className="inline-flex items-center px-1 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                                {data?.fromDeptName || "Order Material tracking-wider"}
                            </span> */}
                            <Badge className="mbg-blue-100 uppercase text-[10px] !px-1 !font-bold">
                                {data?.fromDeptName || "Order Material"}

                            </Badge>
                        </div>

                        {/* Prominent Number (Procurement No OR Order Material No) */}
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-semibold">Order Number</span>
                            <h2 className="text-2xl font-mono font-bold text-gray-800 tracking-tight leading-none">
                                #{data?.fromDeptNumber || "N/A"}
                            </h2>
                        </div>

                        {(data?.quoteNumber && data?.quoteNumber > 1) && <div className="">
                            <span className="text-[10px] text-gray-400 uppercase font-semibold">Quote Number: {data?.quoteNumber} </span>
                        </div>}

                        {/* Rate Confirmation Status */}
                        <div className="mt-4 pt-3 border-t border-gray-100 border-dashed">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Rate Status</span>
                                {data?.isConfirmedRate ? (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                                        <i className="fa-solid fa-check-circle"></i> Confirmed
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                                        <i className="fa-solid fa-clock"></i> Pending
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- COLUMN 4: TIMELINE & META --- */}
                    <div className="p-4 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <i className="fa-regular fa-calendar-check text-gray-400"></i>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Timeline</h4>
                            </div>

                            <div className="space-y-3">
                                {/* Created Date */}
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Created</span>
                                    <span className="font-medium text-gray-900 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                        {dateFormate(data?.createdAt)}
                                    </span>
                                </div>


                            </div>
                        </div>

                        {/* Payment Status Badge */}
                        <div className="mt-auto">
                            <div className={`p-2 rounded-lg border flex items-center gap-3 ${data?.isSyncWithPaymentsSection ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-100'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${data?.isSyncWithPaymentsSection ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-400'}`}>
                                    <i className={`fa-solid ${data?.isSyncWithPaymentsSection ? 'fa-file-invoice-dollar' : 'fa-hourglass'}`}></i>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-gray-400">Payment Process</span>
                                    <span className={`text-xs font-bold ${data?.isSyncWithPaymentsSection ? 'text-purple-700' : 'text-gray-500'}`}>
                                        {data?.isSyncWithPaymentsSection ? "Sent to Payment" : "Not Sent Yet"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>



            {/* --- NEW SECTION: VENDOR QUOTES OVERVIEW --- */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-indigo-700 flex items-center gap-2">
                        <i className="fas fa-file-invoice"></i> Vendor Quotes Received
                    </h3>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                        {data?.shopQuotes?.length || 0} Quotes
                    </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.shopQuotes?.length > 0 ? (
                        data.shopQuotes.map((quote: IShopQuotes, idx: number) => {
                            // Calculate total for this specific quote
                            const quoteTotal = quote.selectedUnits?.reduce(
                                (acc: number, curr: any) => acc + (curr.totalCost || 0), 0
                            );

                            return (
                                <div
                                    key={quote._id}
                                    onClick={() => navigate(`shopquote/${quote._id}`)}
                                    className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all relative overflow-hidden"
                                >
                                    {/* Decorative side bar */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 group-hover:w-1.5 transition-all"></div>

                                    <div className="flex justify-between items-start mb-3 pl-2">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {(quote?.shopId as any)?.shopDisplayName || `Vendor ${idx + 1}`}
                                            </h4>
                                            {/* <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                                                Ref: {quote._id.slice(-6).toUpperCase()}
                                            </p> */}
                                        </div>
                                        <div className="flex items-center gap-2">

                                            {/* <Button
                                                    onClick={(e) => handleConfirmSelection(e, quote._id)}
                                                    disabled={isConfirming}
                                                    className="flex items-center justify-center h-7 px-3 rounded-lg bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-tight hover:bg-indigo-700 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                                                >
                                                    Select Shop
                                                </Button>
                                             
                                                {(data?.selectedShopId as any)._id === (quote?.shopId as any)?._id && (
                                                    <div className="h-7 px-3 rounded-lg bg-green-100 text-green-700 text-[10px] font-bold uppercase flex items-center border border-green-200">
                                                        <i className="fas fa-check mr-1"></i> Selected
                                                    </div>
                                                )} */}

                                            {(data?.selectedShopId as any)?._id === (quote?.shopId as any)?._id ? (
                                                <div className="h-7 px-3 rounded-lg bg-green-100 text-green-700 text-[10px] font-bold uppercase flex items-center border border-green-200 animate-in fade-in zoom-in duration-300">
                                                    <i className="fas fa-check mr-1"></i> Selected
                                                </div>
                                            ) : (
                                                /* 2. If it is NOT the selected shop, show the Select Button */
                                                <Button
                                                    onClick={(e) => handleConfirmSelection(e, quote._id)}
                                                    disabled={isConfirming}
                                                    className="flex items-center justify-center h-7 px-3 rounded-lg bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-tight hover:bg-indigo-700 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                                                >
                                                    {isConfirming ? <i className="fas fa-spinner fa-spin mr-1"></i> : null}
                                                    Select Shop
                                                </Button>
                                            )}


                                        </div>
                                    </div>

                                    <div className="pl-2 space-y-2">
                                        <div className="flex justify-between items-end mt-4">
                                            <span className="text-xs text-gray-500">Total Quoted Price:</span>
                                            <span className="text-lg font-black text-indigo-700">
                                                ₹{quoteTotal?.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="pt-2 border-t border-dashed border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                                            <span>{quote.selectedUnits?.length || 0} Items quoted</span>
                                            <span className="group-hover:translate-x-1 transition-transform text-indigo-500 font-bold">
                                                View Details <i className="fas fa-arrow-right ml-1"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <i className="fas fa-link text-gray-300 text-3xl mb-2"></i>
                            <p className="text-sm text-gray-500 italic">No quotes received from vendors yet.</p>
                        </div>
                    )}
                </div>
            </section>



            <Card>
                <CardContent className="py-6 space-y-5">
                    <div className="space-y-4">
                        {/* Heading Row with Items & Total Cost */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <h3 className="text-lg font-bold text-indigo-700 mb-2 sm:mb-0">
                                Items List 📋
                                {/* <span>{data?.isConfirmedRate ? "Vendor has confirmed the rates" : "Generate the Link and share the link to the vendor"}</span> */}
                            </h3>

                            {/* Right Side: Dynamic Status Badge */}
                            <div>
                                {/* {!data?.generatedLink &&
                                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full shadow-sm">
                                        <i className="fas fa-exclamation-circle text-red-500 text-lg"></i>
                                        <span className="text-sm font-bold text-red-600 tracking-wide">
                                            Action: Generate & Share Link
                                        </span>
                                    </div>
                                } */}
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto rounded border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-200 text-sm text-gray-700 font-medium">
                                    <tr>
                                        <th className="px-5 py-2 text-center">S.No</th>
                                        <th className="px-5 py-2 text-center">Item Name</th>
                                        <th className="px-5 py-2 text-center">Quantity</th>
                                        <th className="px-5 py-2 text-center">Unit</th>
                                        <th className="px-5 py-2 text-center">Rate</th>
                                        <th className="px-5 py-2 text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100 text-sm">
                                    {data.selectedUnits?.length > 0 ? data.selectedUnits?.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td className="px-5 py-2 text-center">{index + 1}</td>
                                            <td className="px-5 py-2 text-center">{item.subItemName}</td>
                                            <td className="px-5 py-2 text-center">{item.quantity}</td>
                                            <td className="px-5 py-2 text-center">{item.unit}</td>
                                            <td className="px-5 py-2 text-center">{item.rate}</td>
                                            <td className="px-5 py-2 text-center">{item.totalCost}</td>
                                        </tr>
                                    ))
                                        : (
                                            // --- FALLBACK STATE: NO SHOP SELECTED YET ---
                                            <tr>
                                                <td colSpan={6} className="px-5 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                                                            <i className="fas fa-hand-pointer text-indigo-400 text-xl"></i>
                                                        </div>
                                                        <div>
                                                            <p className="text-base font-bold text-slate-700">No Shop Selected</p>
                                                            <p className="text-xs text-slate-500 max-w-[250px] mx-auto mt-1">
                                                                Please review the vendor quotes above and click
                                                                <span className="text-indigo-600 font-bold mx-1">Select Shop</span>
                                                                to finalize the rates for this order.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>

                        {/* Total Cost Right Aligned */}
                        <div className="flex !ml-auto w-fit mr-[20px] sm:flex-row items-start sm:items-center gap-2">
                            <h3 className="text-lg font-bold text-blue-700">
                                Total Cost </h3>
                            <div className="flex  items-center gap-3 text-sm">
                                {/* {editCost ? (
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
                                        <> */}
                                <p className="text-base font-semibold text-gray-800">₹ {data?.totalCost || 0}</p>
                                {/* <Button size="sm" variant="secondary" onClick={() => setEditCost(true)}>
                                                <i className="fas fa-pen mr-1" />
                                                Edit
                                            </Button> */}
                                {/* </>
                                    )} */}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>




            {/* sharable link */}
            {/* <section className="w-full">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm w-full ">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                            <i className="fas fa-link"></i> Generate Shareable Link
                        </h3>
                    </div>

                    {data?.generatedLink ? (
                        <div className="flex flex-col sm:flex-row gap-2 items-center">
                            <Input readOnly value={link} className="flex-1 text-sm cursor-default" />
                            <Button onClick={handleCopy} variant="outline" className="flex gap-2">
                                <i className={`fas ${copied ? "fa-check-circle" : "fa-copy"}`}></i>
                                {copied ? "Copied" : "Copy"}
                            </Button>
                            <Button onClick={handleWhatsappShare} className="bg-green-500 hover:bg-green-600 text-white flex gap-2">
                                <i className="fab fa-whatsapp"></i>
                                Share
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={handleGenerateLink}
                            disabled={linkPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {linkPending ? "Generating..." : "Generate Link"}
                        </Button>
                    )}
                </div>
            </section> */}


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
                            onClick={handleGeneratePdf}
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



interface AutomationTimerButtonProps {
    data: any;
    refetch?: () => void;
}

const AutomationTimerButton: React.FC<AutomationTimerButtonProps> = ({ data, refetch }) => {
    // 2 minutes = 120 seconds
    const [timeLeft, setTimeLeft] = useState(900);
    const { mutateAsync: cancelSyncPaymentsMutation, isPending: cancelSyncPaymentsLoading } = useCancelProcurementAutomation();

    useEffect(() => {
        if (data?.isSyncWithPaymentsSection) return;

        const calculateTime = () => {
            const startTime = new Date(data?.createdAt)?.getTime();
            const endTime = startTime + 15 * 60 * 1000; // Exact 2-minute mark
            const now = new Date().getTime();
            const diff = Math.floor((endTime - now) / 1000);

            if (diff <= 0) {
                setTimeLeft(0);
                return false; // Stop interval
            }
            setTimeLeft(diff);
            return true;
        };

        // Initial calculation
        const isRunning = calculateTime();
        if (!isRunning) return;

        const timer = setInterval(() => {
            const stillRunning = calculateTime();
            if (!stillRunning) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [data?.createdAt, data?.isSyncWithPaymentsSection]);

    // Format seconds into MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCancelSyncToPayments = async () => {
        try {
            if (data?.isSyncWithPaymentsSection || timeLeft === 0) {
                return toast({
                    variant: "destructive",
                    title: "Action Restricted",
                    description: "Automation has already processed this record."
                });
            }

            await cancelSyncPaymentsMutation({ id: data._id! });

            refetch?.();
            toast({
                title: "Automation Disabled",
                description: "This procurement will no longer be automatically moved to payments."
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Operation failed"
            });
        }
    };

    // Determine button state
    const isProcessed = data?.isSyncWithPaymentsSection || timeLeft === 0;

    return (
        <Button
            variant="danger"
            disabled={isProcessed}
            isLoading={cancelSyncPaymentsLoading}
            className={`min-w-[140px] flex items-center justify-center gap-2 transition-all ${isProcessed ? "bg-gray-400 opacity-70" : "bg-red-600 hover:bg-red-700"
                }`}
            onClick={handleCancelSyncToPayments}
        >
            {/* <i className={`fas ${isProcessed ? 'fa-check-circle' : 'fa-clock'}`}></i> */}
            {/* {isProcessed ? "Automation Done" : `Cancel Auto-Sync (${formatTime(timeLeft)})`} */}

            <div className="flex items-center justify-between w-full gap-3">
                <span>{isProcessed ? "Automation Done" : "Cancel Automation"}</span>
                {!isProcessed && (
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono border-l border-white/30">
                        {formatTime(timeLeft)}
                    </span>
                )}
            </div>
        </Button>
    );
};

