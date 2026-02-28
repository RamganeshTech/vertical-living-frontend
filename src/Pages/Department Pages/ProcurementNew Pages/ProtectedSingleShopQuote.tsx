import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConfirmFinalShopQuote, useGetSingleProcurementDetails } from '../../../apiList/Department Api/Procurement Api/procurementApi';
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { toast } from '../../../utils/toast';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { IShopQuotes } from './ProcurementNewMain';

const ProtectedSingleShopQuote = () => {
    const { shopquoteid, id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useGetSingleProcurementDetails(id!);


    const { mutateAsync: confirmQuote, isPending: isConfirming } = useConfirmFinalShopQuote();


    const [copied, setCopied] = useState(false);


    const handleCopy = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            toast({ title: "Error", description: "Failed to copy link", variant: "destructive" });
        }
    };

    const handleWhatsappShare = () => {
        if (!quoteData.generatedLink) return;

        // Pre-filled message
        // const text = `Hey, please check this items link: ${link}`
        const text = `Hey, please check this items link:\n\n${quoteData.generatedLink}`;


        // Check if phone number exists
        const phoneNumber = data?.shopDetails?.phoneNumber;

        let waUrl = "";

        if (phoneNumber) {
            // Send directly to the phone number (must include country code, no + or spaces)
            // Example: 919876543210
            // const formattedNumber = phoneNumber.replace(/\D/g, ""); // remove non-digit characters
            // waUrl = `https://wa.me/${formattedNumber}?text=${text}`;

            // Remove non-digit characters
            const formattedNumber = phoneNumber.replace(/\D/g, "");
            waUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(text)}`;

        } else {
            // Fallback: let user choose whom to send
            waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        }

        // Open WhatsApp
        window.open(waUrl, "_blank");
    };





    const handleConfirmSelection = async (e: React.MouseEvent) => {
        try {
            e.stopPropagation(); // ✋ Stops the card from navigating to the details page

            await confirmQuote({ id: id!, quoteId: shopquoteid! });
            refetch?.()
            toast({ title: "Success", description: "Shop quote selected successfully" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
        }
    };



    const quoteData: IShopQuotes = useMemo(() => {
        return data?.shopQuotes?.find((quote: any) => quote._id === shopquoteid);
    }, [data, shopquoteid]);

    const grandTotal = useMemo(() => {
        return quoteData?.selectedUnits?.reduce((acc: number, curr: any) => acc + (curr.totalCost || 0), 0);
    }, [quoteData]);

    if (isLoading) return <MaterialOverviewLoading />;

    if (!quoteData) return null;

    const shop = quoteData.shopId as any;

    return (
        <div className="p-1 max-w-full max-h-full overflow-y-auto space-y-8">
            {/* --- HEADER --- */}
            <header className="flex gap-2 items-center">
                <section className="flex flex-1 justify-between items-center">
                    <div className="flex gap-2 justify-between items-center">
                        <div onClick={() => navigate(-1)}
                            className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                            <i className='fas fa-arrow-left'></i>
                        </div>
                        {/* New Descriptive Title */}
                        <div className='flex flex-col gap-0'>
                            <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
                                Shop Rate Quotation
                            </h1>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Detailed price breakdown from {(quoteData as any)?.shopId?.shopName || "Vendor"}
                            </p>
                        </div>
                    </div>



                    <Button
                        onClick={(e) => handleConfirmSelection(e)}
                        isLoading={isConfirming}
                        // className="flex items-center justify-center px-3 rounded-lg bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-tight hover:bg-indigo-700 active:scale-95 transition-all shadow-sm disabled:opacity-50"

                        className={`flex items-center justify-center px-4 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all shadow-sm 
        ${data?.selectedShopId?._id === (quoteData as any)?.shopId?._id
                                ? "bg-green-600 text-green-700 border border-green-200 cursor-default hover:bg-green-600"
                                : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                            }`}
                    >
                        {/* Select Shop */}

                        {/* {data?.selectedShopId?._id === (quoteData as any)?.shopId?._id ? <><i className="fas fa-check mr-1"></i> Selected </>: "Select Shop"} */}

                        {data?.selectedShopId?._id === (quoteData as any)?.shopId?._id ? (
                            <>
                                <i className="fas fa-check-circle mr-2 text-sm"></i>
                                Currently Selected Shop
                            </>
                        ) : (
                            "Select This Shop"
                        )}


                    </Button>

                </section>
            </header>

            {/* --- SHOP DETAILS CARD --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="p-4 flex flex-col relative group transition-all">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <i className="fa-solid fa-store text-sm"></i>
                        </div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Shop Details</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-1">
                        <div>
                            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Shop Name</span>
                            <p className="font-bold text-gray-900 text-base">{shop?.shopDisplayName || "N/A"}</p>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Contact Person</span>
                            <p className="text-sm text-gray-700 font-medium">{shop?.firstName || "N/A"}</p>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Phone Number</span>
                            <p className="text-sm text-gray-700 font-mono">{shop?.phone?.mobile || shop?.phone?.work || "N/A"}</p>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Address</span>
                            <p className="text-sm text-gray-600 line-clamp-2">{shop?.shopFullAddress || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ITEMS LIST TABLE --- */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-indigo-700 mb-4">
                    Items List 📋
                </h3>

                <div className="overflow-x-auto rounded border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-200 text-sm text-gray-700 font-medium">
                            <tr>
                                <th className="px-5 py-3 text-center border-r border-r-gray-300">S.No</th>
                                <th className="px-5 py-3 text-center border-r border-r-gray-300">Item Name</th>
                                <th className="px-5 py-3 text-center border-r border-r-gray-300">Quantity</th>
                                <th className="px-5 py-3 text-center border-r border-r-gray-300">Unit</th>
                                <th className="px-5 py-3 text-center border-r border-r-gray-300">Rate</th>
                                <th className="px-5 py-3 text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100 text-sm">
                            {quoteData.selectedUnits.map((item: any, index: number) => (
                                <>
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3 text-center border-r border-r-gray-300 text-gray-500">{index + 1}</td>
                                        <td className="px-5 py-3 text-center border-r border-r-gray-300 font-medium text-gray-900">{item.subItemName}</td>
                                        <td className="px-5 py-3 text-center border-r border-r-gray-300 font-semibold text-gray-700">{item.quantity}</td>
                                        <td className="px-5 py-3 text-center border-r border-r-gray-300 text-gray-600">{item.unit}</td>
                                        <td className="px-5 py-3 text-center border-r border-r-gray-300 text-gray-700">₹{item.rate}</td>
                                        <td className="px-5 py-3 text-center font-bold text-gray-900">₹{item.totalCost?.toLocaleString()}</td>
                                    </tr>


                                </>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- TOTAL COST SUMMARY --- */}
                <div className="mt-6 flex justify-end">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-500 uppercase">Total Cost:</span>
                        <span className="text-2xl font-black text-indigo-700">
                            ₹{grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>



            </div>


            {quoteData.generatedLink && <div>
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="flex items-center gap-2 px-1">
                        <i className="fas fa-info-circle text-blue-500 text-xs"></i>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            To share the link manually, copy the link below and share via your preferred platform
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <Input readOnly value={quoteData.generatedLink} className="flex-1 text-sm cursor-default" />
                        <Button onClick={() => handleCopy(quoteData.generatedLink!)} variant="outline" className="flex gap-2">
                            <i className={`fas ${copied ? "fa-check-circle" : "fa-copy"}`}></i>
                            {copied ? "Copied" : "Copy"}
                        </Button>
                        <Button onClick={handleWhatsappShare} className="bg-green-500 hover:bg-green-600 text-white flex gap-2">
                            <i className="fab fa-whatsapp"></i>
                            Share
                        </Button>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default ProtectedSingleShopQuote;