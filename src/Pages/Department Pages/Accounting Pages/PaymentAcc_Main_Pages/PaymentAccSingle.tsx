import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSinglePayment, useSyncPaymentToAccounts, useUploadPaymentAccProof, useVerifyCashPayemtnAcc } from "../../../../apiList/Department Api/Accounting Api/paymentAccApi";
import { toast } from "../../../../utils/toast";
import { Button } from "../../../../components/ui/Button";
import { dateFormate } from "../../../../utils/dateFormator";
import { Card, CardContent } from "../../../../components/ui/Card";
import InfoTooltip from "../../../../components/ui/InfoToolTip";
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
import ImageGalleryExample from "../../../../shared/ImageGallery/ImageGalleryMain";
import { getSourceStatusLabel } from "../Bill Pages/BillAccForm";
import { SOURCE_STATUS_CONFIG } from "./PaymentAccList";
import { Badge } from "../../../../components/ui/Badge";
// import ImageGalleryExample from "../../../../shared/ImageGallery/ImageGalleryMain";

// ... existing getStatusConfig function ...
const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'paid':
            return { bg: 'bg-green-100', text: 'text-green-700', icon: 'fa-check-circle', badge: 'bg-green-100 text-green-700' };
        case 'processing':
            return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'fa-spinner fa-spin', badge: 'bg-blue-100 text-blue-700' };
        case 'failed':
            return { bg: 'bg-red-100', text: 'text-red-700', icon: 'fa-times-circle', badge: 'bg-red-100 text-red-700' };
        default: // pending
            return { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'fa-clock', badge: 'bg-orange-100 text-orange-700' };
    }
};

type ModalStep = "SELECTION" | "CASH_DETAILS" | "OTP_VERIFY" | "GATEWAY_LOADING";

const PaymentAccSingle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading, isError, refetch } = useGetSinglePayment(id!);


    // Inside your component
    const { mutateAsync: uploadProofMutation, isPending: isUploading } = useUploadPaymentAccProof();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);



    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.payments?.delete;
    const canEdit = role === "owner" || permission?.payments?.edit;
    const canCreate = role === "owner" || permission?.payments?.create;



    // State to track what is being paid
    const [selectedPaymentData, setSelectedPaymentData] = useState<{
        id: string;
        amount: number;
        type: 'item' | 'advance' | 'remaining';
        itemName?: string
    }>({ id: '', amount: 0, type: 'remaining' });
    const [otpValue, setOtpValue] = useState("");

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    // const [showOtpScreen, setShowOtpScreen] = useState(false);


    const { mutateAsync: syncAccountsMutation, isPending: syncAccountsLoading } = useSyncPaymentToAccounts();
    const { mutateAsync: verifyCashMutation, isPending: isVerifying } = useVerifyCashPayemtnAcc();
    const [modalStep, setModalStep] = useState<ModalStep>("SELECTION");

    // 2. Add state for inputs
    const [recipientInfo, setRecipientInfo] = useState({
        name: data?.cashCollectionDetail?.recipientName || "",
        phone: data?.cashCollectionDetail?.phoneNo || ""
    });

    // const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

    const handleSyncToAccounts = async () => {
        try {
            await syncAccountsMutation({ id: id! });
            toast({ title: "Success", description: "Bill sent to Accounts Department" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleUploadProof = async () => {
        if (selectedFiles.length === 0) return toast({ variant: "destructive", title: "Error", description: "Select atleast one file" });
        try {
            await uploadProofMutation({ paymentId: id!, files: selectedFiles });
            setSelectedFiles([]);
            toast({ title: "Success", description: "Payment proofs uploaded successfully" });
            refetch();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Upload Failed", description: error.message });
        }
    };

    const handleGenerateOtp = async () => {
        if (!recipientInfo?.name || !recipientInfo?.name?.trim() || recipientInfo.phone.length < 10) {
            return toast({ title: "Error", description: "Please enter valid name and phone number", variant: "destructive" });
        }
        // Since you said not to worry about OTP verification for now, 
        // we send the data to your backend verify route
        try {
            const res = await verifyCashMutation({
                id: id!,
                recipientName: recipientInfo.name.trim(),
                phoneNo: recipientInfo.phone
            });


            console.log("res for otp", res)
            refetch()
            // setShowPaymentModal(false);
            // 3. Force Modal Close FIRST (Better UX)
            // setShowPaymentModal(false);
            setModalStep("OTP_VERIFY")

            // setShowOtpScreen(false);
            toast({ title: "Success", description: "Cash payment recorded successfully" });
        } catch (err: any) {
            // Error handled by mutation toast
            toast({ variant: "destructive", title: "Error", description: err?.response?.data?.message || err?.message || "failed to generate otp" });

        }
    };




    // const handleItemPay = (itemId: string, _amount: number) => {
    //     setProcessingItems(prev => new Set(prev).add(itemId));
    //     toast({
    //         title: "In Developement",
    //         description: "Payment integration coming soon",
    //         variant: "default"
    //     });
    // };

    const handleItemPay = (id: string, amount: number, type: 'item' | 'advance' | 'remaining', itemName?: string) => {
        setSelectedPaymentData({ id, amount, type, itemName });
        setShowPaymentModal(true);
    };

    // const handleProceedWithCash = async () => {
    //     // Here you would call: await sendOtpApi({ phone: data.paymentPersonId.phone.mobile, amount: selectedPaymentData.amount })
    //     toast({ title: "OTP Sent", description: `Verification code sent to ${data?.paymentPersonName}` });
    //     setShowOtpScreen(true);
    // };



    const handleProceedWithOnline = async () => {
        // Logic to initialize Razorpay checkout
        toast({ title: "Redirecting", description: "Opening Razorpay Secure Gateway..." });
        // Example: razorpayInstance.open();
    };

    // const handleGenerateOtp = async () => {
    //     if (otpValue.length < 6) return toast({ title: "Error", description: "Invalid OTP", variant: "destructive" });
    //     // Logic to verify OTP and mark as paid in DB
    //     toast({ title: "Payment Verified", description: "Cash payment has been successfully recorded." });
    //     setShowPaymentModal(false);
    // };

    const isExpense = data?.fromSection?.toLowerCase() === 'expense';

    const hasProof = data?.paymentProof?.length > 0
    // Filter current proofs from data (Only if mode is cash)
    const proofImages = data?.paymentProof?.filter((f: any) => f.type === "image") || [];
    const proofPDFs = data?.paymentProof?.filter((f: any) => f.type === "pdf") || [];
    const isCashMode = data?.paymentMode === "cash"; // Assuming this field exists in your API response

    // const isStaffPaid = data?.settlementSource === "STAFF_OUT_OF_POCKET";

    // // Filter Payment Proofs
    // const proofImages = data?.paymentProof?.filter((f: any) => f.type === "image") || [];
    // const proofPDFs = data?.paymentProof?.filter((f: any) => f.type === "pdf") || [];


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="flex flex-col items-center gap-2">
                    <i className="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
                    <p className="text-gray-500">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-xl p-6 border border-red-100">
                <i className="fas fa-exclamation-triangle text-4xl text-red-300 mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Could not load details</h3>
                <Button onClick={() => refetch()} variant="secondary">Retry</Button>
            </div>
        );
    }

    const statusConfig = getStatusConfig(data.generalStatus);

    const expenseItemName = data.items && data.items.length > 0 ? data.items[0].itemName : "Expense Item";


    return (
        <div className="p-4 h-full overflow-y-auto custom-scrollbar space-y-6 bg-gray-50/50">

            {/* --- Top Header --- */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div className="flex gap-3 items-center">
                    <div onClick={() => navigate(-1)} className="bg-white hover:bg-gray-100 shadow-sm flex items-center justify-center w-9 h-9 border border-gray-200 text-gray-600 text-sm cursor-pointer rounded-lg transition-all">
                        <i className="fas fa-arrow-left" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            Payment: <span className="text-blue-600">{data.paymentNumber}</span>
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Created on {dateFormate(data.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {(canEdit || canCreate) && <div className="flex items-center space-y-1">
                        <Button variant="primary" isLoading={syncAccountsLoading} onClick={handleSyncToAccounts}>
                            Send To Accounts Dept
                        </Button>
                        <InfoTooltip content="Click to send the payment to accounts department" type="info" position="bottom" />
                    </div>}
                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${statusConfig.bg} ${statusConfig.text} border-current/20 capitalize flex items-center gap-2`}>
                        <i className={`fas ${statusConfig.icon}`}></i>
                        {data.generalStatus}
                    </div>
                </div>
            </div>

            {/* --- Main Content Card --- */}
            <Card className="shadow-sm border border-gray-200 bg-white">
                <CardContent className="p-6 space-y-8">



                    {/* --- 1. Overview Grid (Updated for Compactness) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-3 bg-gray-50/80 rounded-xl border border-gray-200/60 min-h-[80px]">

                        {/* COLUMN 1: Payee Profile (Compact) */}
                        <div className="md:col-span-1 flex gap-3 items-start overflow-hidden">
                            {/* Image / Placeholder */}
                            <div className="flex-shrink-0">
                                {data.paymentPersonId?.mainImage?.url ? (
                                    <img
                                        src={data.paymentPersonId.mainImage.url}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                                        <i className="fas fa-user text-sm"></i>
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex flex-col min-w-0 space-y-0.5">
                                {/* Name */}
                                <p className="font-bold text-gray-800 text-sm leading-tight truncate" title={data.paymentPersonName}>
                                    {data?.paymentPersonName}
                                </p>

                                {/* Model Type Badge (Tiny) */}
                                {data.paymentPersonModel && (
                                    <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide leading-none">
                                        {/* {data.paymentPersonModel.replace('Model', '')} */}
                                        <p className="text-xs text-gray-500 capitalize">{data.paymentPersonModel?.replace('Model', '')}</p>

                                    </span>
                                )}

                                {/* Phone */}
                                {(
                                    <div className="flex items-center gap-1 text-[10px] text-gray-500 leading-none pt-0.5">
                                        <i className="fas fa-phone-alt text-[8px]"></i>
                                        <span>{data?.paymentPersonId?.phone?.mobile || "No Ph"}</span>
                                        <span>{data?.paymentPersonId?.phone?.work}</span>
                                    </div>
                                )}

                                {/* Address (Truncated) */}
                                {(
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 leading-tight pt-0.5 truncate">
                                        <i className="fas fa-map-marker-alt text-[8px]"></i>
                                        <span className="truncate">
                                            {data?.paymentPersonId?.address ?
                                                data?.paymentPersonId?.address : "No Address"
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* COLUMN 2: Reference Info (No Labels) */}
                        <div className="md:col-span-1 flex flex-col justify-center space-y-1 pl-2 md:border-l border-gray-200 border-dashed">

                            {/* From Section (Badge style) */}
                            {data.fromSection && (
                                <span className="inline-flex text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-200/50 px-1.5 rounded w-fit">
                                    {data?.fromSection}
                                </span>
                            )}

                            {/* Section Number (Big & Bold) */}
                            {data.fromSectionNumber && (
                                <div className="font-mono text-sm font-bold text-gray-800 leading-none">
                                    #{data?.fromSectionNumber}
                                </div>
                            )}

                            {/* Payment Type */}
                            {data?.paymentType && (
                                <div className="text-[10px] text-gray-500 font-medium capitalize flex items-center gap-1 pt-0.5">
                                    <i className="fas fa-credit-card text-[9px]"></i>
                                    {data?.paymentType}
                                </div>
                            )}

                            {data?.projectId?.projectName && (
                                <div className="text-[10px] text-gray-900 font-medium capitalize flex items-center gap-1 pt-0.5">
                                    <i className="fas fa-folder-open text-[9px]"></i>

                                    <span className="text-gray-500">project:</span>  {" "}
                                    {data?.projectId?.projectName}
                                </div>
                            )}
                        </div>

                        {/* COLUMN 3: Important Dates */}
                        <div className="md:col-span-1 flex flex-col justify-center space-y-1.5 pl-2 md:border-l border-gray-200 border-dashed">


                            <div className="flex items-center justify-between md:justify-start md:gap-2 text-xs">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wide w-18">Created Date</span>
                                <Badge variant="success">{dateFormate(data?.createdAt)}</Badge>
                            </div>

                            <div className="flex items-center justify-between md:justify-start md:gap-2 text-xs">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wide w-18">Payment Date</span>
                                {/* <span className="font-medium text-gray-700">{dateFormate(data?.paymentDate)}</span> */}
                                <Badge variant="secondary">{dateFormate(data?.paymentDate)}</Badge>
                            </div>


                            {data.dueDate && (
                                <div className="flex items-center justify-between md:justify-start md:gap-2 text-xs">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wide w-18">Due</span>
                                    <Badge variant="default">{dateFormate(data?.dueDate)}</Badge>

                                    {/* <span className="font-medium text-red-600 bg-red-50 px-1 rounded">
                                        {dateFormate(data?.dueDate)}
                                    </span> */}
                                </div>
                            )}
                        </div>

                        {/* NEW COLUMN 4: Source Status (Using your helper function) */}
                        {/* COLUMN 4: Entry Source Information */}
                        <div className="md:col-span-1  space-y-1 pl-2 md:border-l border-gray-200 border-dashed overflow-hidden">
                            {/* Small Header Label */}
                            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider leading-none">
                                Entry Source
                            </span>

                            <div className="pt-0.5">
                                {(() => {
                                    // Safely get the config object without forced assertions
                                    const statusKey = data?.sourceStatus;
                                    const config = statusKey ? SOURCE_STATUS_CONFIG[statusKey] : null;

                                    return (
                                        <>
                                            <p className={`text-[12px] font-bold leading-tight ${config ? config.color.split(' ')[1] : 'text-gray-700'}`}>
                                                {config?.label || "N/A"}
                                            </p>

                                            {statusKey && (
                                                <p className="text-[12px] text-gray-900 mt-0.5 leading-none">
                                                    ({getSourceStatusLabel(statusKey)})
                                                </p>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* COLUMN 4: Financials (Right Aligned) */}
                        <div className="md:col-span-1 flex flex-col items-end justify-center pl-4 md:border-l border-gray-200">
                            <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-0.5">Payable</p>
                            <h2 className="text-2xl font-bold text-gray-900 leading-none">
                                ₹{data?.grandTotal?.toLocaleString('en-IN')}
                            </h2>
                            {data.taxAmount > 0 && (
                                <p className="text-[9px] text-gray-400 mt-1">
                                    + ₹{data?.taxAmount} Tax
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 2. Items Table Section */}

                    {isExpense ? (
                        // ==================== EXPENSE CARD VIEW ====================
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[250px]">

                            {/* Left: Details & Notes (Takes up more space) */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col">
                                {/* Header Row */}
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                    <div className="bg-orange-50 text-orange-600 w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0">
                                        <i className="fas fa-shopping-basket text-lg"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-700 leading-tight">
                                            {expenseItemName}
                                        </h3>
                                        <p className="text-xs text-gray-400">Expense / Small Purchase</p>
                                    </div>
                                </div>

                                {/* Prominent Notes Section */}
                                <div className="flex-1 flex flex-col">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <i className="fas fa-align-left"></i> Description / Notes
                                    </label>

                                    <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-100 relative group hover:border-blue-200 transition-colors">
                                        {/* Decorative quote icon */}
                                        {/* <i className="fas fa-quote-left absolute top-4 left-4 text-gray-200 text-2xl -z-0"></i> */}

                                        <div className="relative z-10">
                                            {data.notes ? (
                                                <p className="text-gray-800 text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                                    {data.notes}
                                                </p>
                                            ) : (
                                                <p className="text-gray-400 italic">No additional details provided for this expense.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Payment Action Sidebar */}
                            <div className="w-full md:w-80 bg-gray-50/50 border-t md:border-t-0 md:border-l border-gray-200 p-6 flex flex-col justify-center items-center text-center relative">
                                {/* Dotted separator visual for desktop */}
                                <div className="hidden md:block absolute left-0 top-6 bottom-6 w-[1px] border-l border-dashed border-gray-300/50"></div>

                                <div className="mb-6">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Total Payable</p>
                                    <h2 className="text-4xl font-bold text-blue-900 font-mono tracking-tight">
                                        ₹{data?.grandTotal?.toLocaleString('en-IN')}
                                    </h2>
                                </div>

                                {data?.generalStatus?.toLowerCase() !== 'paid' ? (
                                    <>
                                        {(canCreate || canEdit) && <div className="w-full space-y-3">
                                            <Button
                                                onClick={() => handleItemPay(data._id, data.grandTotal, "remaining")}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all py-6 text-lg rounded-xl font-semibold group"
                                            >
                                                Pay Now <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                            </Button>
                                            <p className="text-[10px] text-gray-400">
                                                Clicking pay will process the full amount.
                                            </p>
                                        </div>}
                                    </>
                                ) : (
                                    <div className="w-full flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-1">
                                            <i className="fas fa-check text-3xl"></i>
                                        </div>
                                        <div className="text-green-700 font-bold text-lg">Paid Successfully</div>
                                        <p className="text-xs text-green-600/80">No further action needed.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    ) : (
                        <>
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-600 w-1 h-6 rounded-full"></div>
                                        <h2 className="text-xl font-bold text-gray-800">Payment Items</h2>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                            {data.items?.length || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* --- TABLE START --- */}
                                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">

                                    {/* 
                                CHANGED: Grid cols increased to 13 to fit the new column.
                            */}
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                        <div className="grid grid-cols-11 gap-2 px-4 py-3 font-semibold text-xs uppercase tracking-wider items-center">
                                            <div className="col-span-1 text-center">S.No</div>
                                            <div className="col-span-2">Item Name</div>
                                            <div className="col-span-1">Unit</div>
                                            <div className="col-span-1 text-center">Qty</div>
                                            <div className="col-span-1 text-center">Rate</div>
                                            <div className="col-span-1 text-center">Total</div>
                                            <div className="col-span-1 text-center">Order ID</div>
                                            <div className="col-span-2 text-center">Txn ID</div>
                                            {/* <div className="col-span-1">Due Date</div> */}
                                            <div className="col-span-1 text-center">Pay</div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="bg-white divide-y divide-gray-100">
                                        {(!data.items || data.items.length === 0) ? (
                                            <div className="p-8 text-center text-gray-400">
                                                No items found in this payment record.
                                            </div>
                                        ) : (
                                            data.items.map((item: any, index: number) => {
                                                // const isProcessing = processingItems.has(item._id || index.toString());
                                                const itemStatus = item.status || 'pending';

                                                return (
                                                    <div
                                                        key={index}
                                                        className="grid grid-cols-11 gap-2 px-4 py-3 items-center text-sm hover:bg-blue-50/30 transition-colors"
                                                    >
                                                        <div className="col-span-1 text-center text-gray-500 font-medium">{index + 1}</div>
                                                        <div className="col-span-2 font-medium text-gray-800 truncate" title={item.itemName}>{item.itemName}</div>
                                                        <div className="col-span-1 text-gray-500 text-xs">{item.unit || '-'}</div>
                                                        <div className="col-span-1 text-center text-gray-700">{item.quantity}</div>
                                                        <div className="col-span-1 text-center text-gray-600 font-mono text-xs">{item.rate?.toLocaleString()}</div>

                                                        {/* Base Total (Qty * Rate) */}
                                                        <div className="col-span-1 text-center text-gray-500 font-mono text-xs">
                                                            ₹{item.totalCost?.toLocaleString()}
                                                        </div>

                                                        <div className="col-span-1 text-center">
                                                            {item.orderId ? (
                                                                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-mono truncate block" title={item.orderId}>
                                                                    {item.orderId.slice(-6)}..
                                                                </span>
                                                            ) : <span className="text-gray-900 text-lg ">-</span>}
                                                        </div>

                                                        <div className="col-span-2 text-center">
                                                            {item.transactionId ? (
                                                                <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded text-[10px] font-mono truncate block" title={item.transactionId}>
                                                                    {item.transactionId}
                                                                </span>
                                                            ) : <span className="text-gray-300 text-xs italic">Pending</span>}
                                                        </div>

                                                        {/* <div className="col-span-1 text-xs text-gray-600">{dateFormate(data.dueDate)}</div> */}




                                                        {(canEdit || canCreate) && <div className="col-span-1 text-center">
                                                            {itemStatus === 'paid' ? (
                                                                <span className="text-green-600 text-xs font-bold flex justify-center items-center gap-1">
                                                                    <i className="fas fa-check-double"></i> Paid
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    // onClick={() => handleItemPay(item._id || index.toString(), item.totalCost)}
                                                                    onClick={() => handleItemPay(item._id || index.toString(), item.totalCost, 'item', item.itemName)}
                                                                    // disabled={isProcessing}
                                                                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1 w-full
                                                                bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white
                                                            `}
                                                                >
                                                                    {/* {isProcessing ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-rupee-sign"></i> Pay</>} */}
                                                                    <i className="fas fa-rupee-sign"></i> Pay
                                                                </button>
                                                            )}
                                                        </div>
                                                        }



                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                    {/* Table Footer */}
                                    <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Showing {data.items?.length} items</span>
                                            <div className="flex gap-4">
                                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Paid</span>
                                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Unpaid</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <section className="flex flex-col items-end justify-end mt-6 pt-2">
                                    {/* Summary Container */}
                                    <div className="w-full md:w-1/2 lg:w-[40%] bg-gray-50/50 p-6 rounded-xl border border-gray-100 space-y-3">

                                        {/* 1. Sub Total */}
                                        <div className="flex justify-between items-center text-sm text-gray-600">
                                            <span className="font-medium">Sub Total</span>
                                            <span className="font-mono font-semibold text-gray-800">
                                                ₹{data.totalAmount?.toLocaleString('en-IN') || 0}
                                            </span>
                                        </div>

                                        {/* 2. Discount (Conditional) */}
                                        {(data.discountAmount > 0 || (data.discountPercentage && data.discountPercentage > 0)) ? (
                                            <div className="flex justify-between items-center text-sm text-green-700">
                                                <span className="font-medium flex items-center gap-2">
                                                    Discount
                                                    {data.discountPercentage ? (
                                                        <span className="text-[10px] bg-green-100 border border-green-200 px-1.5 py-0.5 rounded-md font-bold">
                                                            {data.discountPercentage}%
                                                        </span>
                                                    ) : null}
                                                </span>
                                                <span className="font-mono font-semibold">
                                                    - ₹{data.discountAmount?.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        ) : null}

                                        {/* 3. Tax (Conditional) */}
                                        {(data.taxAmount > 0 || (data.taxPercentage && data.taxPercentage > 0)) ? (
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span className="font-medium flex items-center gap-2">
                                                    Tax
                                                    {data.taxPercentage ? (
                                                        <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md font-bold">
                                                            {data.taxPercentage}%
                                                        </span>
                                                    ) : null}
                                                </span>
                                                <span className="font-mono font-semibold">
                                                    + ₹{data.taxAmount?.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        ) : null}

                                        {/* 4. Advanced Amount (Optional - Good to handle if schema has it) */}
                                        {data.advancedAmount && data.advancedAmount > 0 && (
                                            <div className="flex justify-between items-center text-sm text-blue-600">
                                                <span className="font-medium">Advanced Paid</span>
                                                <span className="font-mono font-semibold">
                                                    - ₹{data.advancedAmount?.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        )}

                                        {/* Divider */}
                                        <div className="border-t border-dashed border-gray-300 my-3"></div>


                                        {data?.advancedAmount?.totalAmount > 0 && (
                                            <div className="flex items-center justify-between rounded-xl">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-bold text-gray-800">Advance Amount</span>
                                                </div>

                                                <div className="flex flex-col items-end gap-3">
                                                    <span className="text-2xl font-bold text-purple-700 font-mono">
                                                        ₹{data.advancedAmount.totalAmount.toLocaleString('en-IN')}
                                                    </span>

                                                    {(canEdit || canCreate) && <Button
                                                        // onClick={() => handleItemPay(data._id, data.advancedAmount.totalAmount)}
                                                        onClick={() => handleItemPay(data._id, data.advancedAmount.totalAmount, 'advance', 'Advance Payment')}
                                                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all w-32"
                                                        size="sm"
                                                    >
                                                        Pay Advance <i className="fas fa-arrow-right ml-2 text-xs"></i>
                                                    </Button>}
                                                </div>
                                            </div>
                                        )}


                                        {/* 5. Grand Total & Pay Button */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold text-gray-800">
                                                    {data?.advancedAmount?.totalAmount ? "Remaining Amount To Pay" : "Total Amount"}
                                                    {/* {isStaffPaid ? "Total Paid by Staff" : (data?.advancedAmount?.totalAmount ? "Remaining Amount To Pay" : "Total Amount")} */}

                                                </span>
                                                {/* <span className="text-xs text-gray-400 font-medium">Total Payable</span> */}
                                            </div>

                                            <div className="flex flex-col items-end gap-3">
                                                <span className="text-2xl font-bold text-blue-700 font-mono">
                                                    ₹{data.amountRemaining.totalAmount?.toLocaleString('en-IN')}
                                                </span>

                                                {/* Render Pay Button Only if Not Paid */}
                                                {data?.generalStatus?.toLowerCase() !== 'paid' ? (
                                                    <>
                                                        {(canCreate || canEdit) &&
                                                            <Button
                                                                // onClick={() => handleItemPay(data._id, data?.amountRemaining?.totalAmount)}
                                                                onClick={() => handleItemPay(data._id, data.amountRemaining.totalAmount, 'remaining', 'Full Settlement')}
                                                                // disabled={isProcessing}
                                                                // variant=""
                                                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all w-32"
                                                                size="sm"
                                                            >

                                                                <>Pay Now <i className="fas fa-arrow-right ml-2 text-xs"></i></>
                                                            </Button>}
                                                    </>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                                                        <i className="fas fa-check-circle"></i> Fully Paid
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </section>
                                {/* --- TABLE END --- */}
                            </div>

                            {data.notes && (
                                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                                    <h4 className="text-sm font-bold text-yellow-800 mb-1">
                                        <i className="fas fa-sticky-note mr-2"></i>Notes
                                    </h4>
                                    <p className="text-sm text-yellow-800/80">{data.notes}</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* {(proofImages.length > 0 || proofPDFs.length > 0) && (
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <i className="fas fa-paperclip text-blue-500"></i> Attached Payment Proofs
                            </h3>

                            {proofImages.length > 0 && (
                                <div className="mb-6">
                                    <ImageGalleryExample
                                        handleDeleteFile={() => { }} // Pass null or a proper delete function if allowed
                                        imageFiles={proofImages}
                                        height={150}
                                        minWidth={150}
                                        maxWidth={200}
                                    />
                                </div>
                            )}

                            {proofPDFs.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {proofPDFs.map((pdf: any, idx: number) => (
                                        <a
                                            key={idx}
                                            href={pdf.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white hover:border-blue-300 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                                                    <i className="fas fa-file-pdf text-xl"></i>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{pdf.originalName}</p>
                                                    <p className="text-[10px] text-gray-400">PDF Document</p>
                                                </div>
                                            </div>
                                            <i className="fas fa-external-link-alt text-gray-300 group-hover:text-blue-500 text-xs"></i>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    )} */}


                    {isCashMode && (
                        <div className="pt-8 border-t border-gray-100 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <i className="fas fa-camera text-blue-500"></i> Cash Payment Proofs
                                </h3>

                                {/* Professional Upload Trigger */}
                                <div className="flex items-center gap-2">
                                    <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all">
                                        <i className="fas fa-plus mr-2"></i> Select Files
                                        <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />
                                    </label>
                                    {selectedFiles.length > 0 && (
                                        <Button size="sm" onClick={handleUploadProof} isLoading={isUploading}>
                                            Upload {selectedFiles.length} File(s)
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {hasProof ? (
                                <div className="space-y-6 animate-in fade-in duration-500">

                                    {/* IMAGE GALLERY SECTION */}
                                    {proofImages?.length > 0 && (
                                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                            <ImageGalleryExample
                                                imageFiles={proofImages}
                                                handleDeleteFile={() => { }} // Pass delete logic if needed
                                                height={120}
                                            // width={120}
                                            />
                                        </div>
                                    )}

                                    {/* PDF SECTION: Separate and Professional */}
                                    {proofPDFs.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {proofPDFs.map((pdf: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center text-xl">
                                                            <i className="fas fa-file-pdf"></i>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{pdf.originalName}</p>
                                                            <p className="text-[10px] text-slate-400 font-medium">PDF DOCUMENT</p>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={pdf.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
                                                    >
                                                        <i className="fas fa-external-link-alt text-xs"></i>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>

                            ) : (
                                /* CONDITION 2: EMPTY STATE (PRO PLACEHOLDER) */
                                <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30 transition-all">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                        <i className="fas fa-file-invoice-dollar text-slate-200 text-2xl"></i>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-tight">No Proofs Uploaded</h4>
                                        <p className="text-xs text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                                            Please upload receipt images or PDF documents for cash records.
                                        </p>
                                    </div>
                                </div>
                            )}


                        </div>
                    )}


                </CardContent>
            </Card>

            {/* <>
            {showPaymentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[1.5rem] shadow-xl w-full max-w-md overflow-hidden border border-slate-200">

                        
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                                {showOtpScreen ? "Verification Required" : "Release Payment"}
                            </span>
                            <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="p-8">
                            
                            {!showOtpScreen ? (
                                <div className="space-y-8">
                                    
                                    <div className="text-center space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount to Pay</p>
                                        <h2 className="text-5xl font-light text-slate-900 font-mono tracking-tighter">
                                            ₹{selectedPaymentData.amount.toLocaleString('en-IN')}
                                        </h2>
                                        <p className="text-xs text-slate-500 font-medium">{selectedPaymentData.itemName}</p>
                                    </div>

                                    
                                    <div className="grid grid-cols-1 gap-3">
                                        <button
                                            onClick={handleProceedWithCash}
                                            className="flex items-center justify-between w-full p-5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                                    <i className="fas fa-money-bill-wave text-sm"></i>
                                                </div>
                                                <span className="font-bold text-slate-700">Cash Payment</span>
                                            </div>
                                            <i className="fas fa-chevron-right text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all"></i>
                                        </button>

                                        <button
                                            onClick={handleProceedWithOnline}
                                            className="flex items-center justify-between w-full p-5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                                                    <i className="fas fa-credit-card text-sm"></i>
                                                </div>
                                                <span className="font-bold text-slate-700">Online Gateway</span>
                                            </div>
                                            <i className="fas fa-chevron-right text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all"></i>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="space-y-4">
                                        
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Recipient Name</label>
                                                <input
                                                    type="text"
                                                    // defaultValue={data?.paymentPersonName}
                                                    value={recipientInfo.name}
                                                    onChange={(e) => setRecipientInfo({ ...recipientInfo, name: e.target.value })}
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                                                    placeholder="Full Name"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    // defaultValue={data?.paymentPersonId?.phone?.mobile}
                                                    value={recipientInfo.phone}
                                                    onChange={(e) => setRecipientInfo({ ...recipientInfo, phone: e.target.value })}
                                                    maxLength={10}
                                                    minLength={10}
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                                                    placeholder="10-digit Mobile"
                                                />
                                            </div>
                                        </div>

                                      
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                className="flex-1 py-4 rounded-xl text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all"
                                                onClick={() => setShowOtpScreen(false)}
                                            >
                                                Cancel
                                            </button>
                                            <Button
                                                isLoading={isVerifying}
                                                className="flex-1 py-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-black transition-all shadow-lg"
                                                onClick={handleGenerateOtp}
                                            >
                                                Confirm Pay
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
</> */}




            {showPaymentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[1.5rem] shadow-xl w-full max-w-md overflow-hidden border border-slate-200">

                        {/* Header: Titles based on the Name of the step */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center text-slate-800">
                            <span className="text-sm font-bold uppercase tracking-tight">
                                {modalStep === "SELECTION" && "Release Payment"}
                                {modalStep === "CASH_DETAILS" && "Recipient Information"}
                                {modalStep === "OTP_VERIFY" && "Authorize Payout"}
                                {modalStep === "GATEWAY_LOADING" && "Secure Gateway"}
                            </span>
                            <button
                                onClick={() => { setShowPaymentModal(false); setModalStep("SELECTION"); }}
                                className="text-slate-400 hover:text-slate-600 transition-colors px-2"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="p-8">
                            {/* --- FLOW 1: SELECTION --- */}
                            {modalStep === "SELECTION" && (
                                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="text-center space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payable Amount</p>
                                        <h2 className="text-5xl font-light text-slate-900 font-mono tracking-tighter">
                                            ₹{selectedPaymentData.amount.toLocaleString('en-IN')}
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <button
                                            onClick={() => setModalStep("CASH_DETAILS")}
                                            className="flex items-center justify-between w-full p-5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                                    <i className="fas fa-money-bill-wave"></i>
                                                </div>
                                                <span className="font-bold text-slate-700">Cash Payment</span>
                                            </div>
                                            <i className="fas fa-chevron-right text-slate-300"></i>
                                        </button>

                                        <button
                                            onClick={() => setModalStep("GATEWAY_LOADING")}
                                            className="flex items-center justify-between w-full p-5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                                                    <i className="fas fa-credit-card"></i>
                                                </div>
                                                <span className="font-bold text-slate-700">Online Gateway</span>
                                            </div>
                                            <i className="fas fa-chevron-right text-slate-300"></i>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* --- FLOW 2: CASH DETAILS --- */}
                            {modalStep === "CASH_DETAILS" && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Recipient Name</label>
                                            <input
                                                type="text"
                                                value={recipientInfo.name}
                                                onChange={(e) => setRecipientInfo({ ...recipientInfo, name: e.target.value })}
                                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                                                placeholder="Full Name"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Mobile Number</label>
                                            <input
                                                type="tel"
                                                value={recipientInfo.phone}
                                                onChange={(e) => setRecipientInfo({ ...recipientInfo, phone: e.target.value })}
                                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                                                placeholder="10-digit Phone"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setModalStep("SELECTION")} className="flex-1 py-4 rounded-xl text-sm font-bold bg-slate-50 border border-slate-200">Back</button>
                                        <button onClick={() => handleGenerateOtp()} className="flex-1 py-4 rounded-xl text-sm font-bold text-white bg-blue-600 shadow-lg">Send OTP</button>
                                    </div>
                                </div>
                            )}

                            {/* --- FLOW 3: OTP VERIFY --- */}
                            {modalStep === "OTP_VERIFY" && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-center">
                                    <p className="text-xs text-slate-500">Verification code sent to <span className="font-bold text-slate-800">{recipientInfo.phone}</span></p>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={otpValue}
                                        onChange={(e) => setOtpValue(e.target.value)}
                                        placeholder="0 0 0 0 0 0"
                                        className="w-full text-center text-4xl font-mono tracking-[0.3em] p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => setModalStep("CASH_DETAILS")} className="flex-1 py-4 rounded-xl text-sm font-bold bg-slate-50 border border-slate-200">Edit Info</button>
                                        <Button isLoading={isVerifying} onClick={() => toast({ title: "Success", description: "otp verificiation is in development" })} className="flex-1 py-4 rounded-xl text-sm font-bold text-white bg-slate-900 shadow-lg">Confirm Payment</Button>
                                    </div>
                                </div>
                            )}

                            {/* --- FLOW 4: GATEWAY LOADING --- */}
                            {modalStep === "GATEWAY_LOADING" && (
                                <div className="text-center space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="py-10">
                                        <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                        <h3 className="text-lg font-bold text-slate-800">Connecting to Razorpay</h3>
                                        <p className="text-xs text-slate-400">Please do not close this window...</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setModalStep("SELECTION")} className="flex-1 py-4 rounded-xl text-sm font-bold bg-slate-50 border border-slate-200">Cancel</button>
                                        <Button onClick={handleProceedWithOnline} className="flex-1 py-4 rounded-xl text-sm font-bold text-white bg-blue-600 shadow-lg">Pay with Card/UPI</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PaymentAccSingle;