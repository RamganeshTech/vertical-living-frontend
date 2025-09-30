// src/pages/PaymentPages/QuotePaymentMain.tsx
import { useParams, Outlet, useNavigate, useLocation } from "react-router-dom";
// import { usePaymentAllQuotes } from "../../../apiList/Quote Api/ClientQuote/paymentQuoteApi"; // 👈 your hook
// import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
// import { Button } from "../../../components/ui/Button";
import { usePaymentAllQuotes } from "../../../../apiList/Stage Api/Payment Api/paymentQuoteApi";
import MaterialOverviewLoading from "../../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";

const QuotePaymentMain = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const location = useLocation()

    const { data: quotes, isLoading, isError, error, refetch } = usePaymentAllQuotes(projectId!);

    if (isLoading) return <MaterialOverviewLoading />;
    if (isError) return (
        <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-6">
            <div className="text-red-600 font-semibold mb-2">
                ⚠️ Error Occurred
            </div>
            <p className="text-red-500 text-sm mb-4">
                {(error as any)?.response?.data?.message ||
                    (error as any)?.message ||
                    "Failed to load payment confirmation data"}
            </p>
            <Button
                onClick={() => refetch()}
                className="bg-red-600 text-white px-4 py-2"
            >
                Retry
            </Button>
        </div>
    );




    const isSubPage = location.pathname.includes("single");

    if (isSubPage) return <Outlet />; // subpage like /vehicles


    return (
        <div className="p-2 max-h-full overflow-y-auto">
            <div className="flex gap-2 items-center mb-4">

                <div onClick={() => navigate(-1)}
                    className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                    <i className='fas fa-arrow-left'></i>
                </div>
                <h1 className="text-2xl font-bold text-blue-600">Payment Quotes</h1>
            </div>


            {!quotes?.length &&
                <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
                    <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">No Quotes Found</h3>
                    <p className="text-sm text-gray-500">
                        Looks like there are no quotes shipments yet for this project.<br />
                        Click on <strong>"Select Quote"</strong> in the Quote Clients 🚀
                    </p>
                </div>
            }


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(quotes || [])?.map((q: any) => (
                    // <Card  key={q._id} className="border-l-4 border-blue-600 shadow-sm">
                    //     <CardHeader className=" flex items-center justify-between">
                    //         <CardTitle className="">{q.quoteNo || "Untitled Quote"}</CardTitle>

                    //     </CardHeader>
                    //     <CardContent className="space-y-1 text-sm text-blue-950">
                    //         <p>
                    //             <i className="fas fa-stream mr-1 text-gray-500" />
                    //             <span className="font-medium text-gray-700">Status</span> {q.status || "—"}
                    //         </p>

                    //         <div className="mt-4 flex justify-end">
                    //             <Button
                    //                 size="sm"
                    //                 variant="primary"
                    //                 onClick={() => navigate(`single/${q._id}`)} // 👈 navigates to child
                    //             >
                    //                 <i className="fas fa-eye mr-1" />
                    //                 View
                    //             </Button>
                    //         </div>
                    //     </CardContent>
                    // </Card>

                    <Card key={quotes._id} className="border-l-4 border-blue-600 shadow-sm">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle>Quote No: {q.quoteNo}</CardTitle>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${q.status === "selected"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-600"
                                }`}>
                                {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                            </span>
                        </CardHeader>

                        <CardContent>
                            <CardDescription>
                                {/* Static description – makes it feel complete */}
                                This quote includes all pricing details and is ready for client review.
                            </CardDescription>

                            <div className="flex justify-end w-full">
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => navigate(`single/${q._id}`)} // 👈 navigates to child
                                    className="justify-end "
                                >
                                    <i className="fas fa-eye mr-1" />
                                    View
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>


        </div>
    );
};

export default QuotePaymentMain;