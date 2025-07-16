import { useParams, useNavigate } from "react-router-dom";
import { loadScript } from "../../../utils/loadScript";
import { toast } from "../../../utils/toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import {
  useCreatePaymentOrder,
  useGetPaymentTransaction,
  useVerifyPayment,
} from "../../../apiList/Stage Api/Payment Api/paymentTransactionApi";
import { Button } from "../../../components/ui/Button";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";


const PaymentTransaction = () => {
  const { projectId , organizationId} = useParams<{ projectId: string , organizationId:string}>();
  const navigate = useNavigate();
  const { data, refetch , isError, error :getAllError, isLoading} = useGetPaymentTransaction(projectId!);
  const paymentTransaction = data?.paymentTransaction;
  const totalAmount = data?.totalAmount;

  const { mutateAsync: createPaymentOrder, isPending: isCreating } = useCreatePaymentOrder();
  const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  const client = useSelector((state: RootState) => state.clientProfileStore);


   if (isLoading) return <MaterialOverviewLoading />;
    if (isError || !data) return  <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-6">
              <div className="text-red-600 font-semibold mb-2">
                ⚠️ Error Occurred
              </div>
              <p className="text-red-500 text-sm mb-4">
                {(getAllError as any)?.response?.data?.message || 
                 (getAllError as any)?.message || 
                 "Failed to load cost estimation data"}
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-red-600 text-white px-4 py-2"
              >
                Retry
              </Button>
            </div> 

  const handlePayment = async () => {
    try {
      const orderData = await createPaymentOrder({
        projectId: projectId!,
        clientId: client.clientId,
      });

      const razorpayLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!razorpayLoaded) {
        toast({
          title: "Error",
          description: "Failed to load Razorpay SDK.",
          variant: "destructive",
        });
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Vertical Living",
        description: "Project Payment",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          await verifyPayment({
            projectId: projectId!,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          toast({
            title: "Success",
            description: "Payment successful!",
          });
        },
        prefill: {
          name: client.clientName || "",
          email: client.email || "",
          contact: client.phoneNo || "",
        },
        theme: {
          color: "#0050b3",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Payment failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 p-2 sm:p-4">
      {/* Header Section */}
      <div className="flex-shrink-0 flex justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <div className="flex items-center gap-3 justify-between">
       
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-700 flex items-center gap-2">
            <i className="fa-solid fa-money-check-dollar" />
            <span className="hidden sm:inline">Payment Transaction</span>
            <span className="sm:hidden">Payment</span>
          </h1>
        </div>

        <Button
          onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/paymentconfirmation`)}
          variant="primary"
        >
          <i className="fa-solid fa-arrow-left mr-1" />
          Go Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="bg-white w-full max-w-lg rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Gateway Header */}
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-700 flex items-center justify-center gap-2">
              <i className="fa-solid fa-shield-halved text-blue-600" />
              Secure Payment Gateway
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Securely make your payment to proceed with the project.
            </p>
          </div>

          {/* Amount Display */}
          <div className="border border-blue-200 rounded-lg p-4 sm:p-5 bg-blue-50 text-center shadow-sm">
            <p className="text-gray-700 text-xs sm:text-sm mb-1">Amount Payable</p>
            <div className="text-2xl sm:text-3xl font-bold text-blue-800">
              ₹ {totalAmount?.toLocaleString('en-IN') || '0'}
            </div>
          </div>

          {/* Status */}
          {paymentTransaction?.status && (
            <div className="bg-gray-100 p-3 sm:p-4 rounded-lg border border-gray-300 space-y-2 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <i
                    className={`fa-solid ${
                      paymentTransaction.status === "successful"
                        ? "fa-circle-check text-green-600"
                        : "fa-circle-xmark text-red-600"
                    }`}
                  />
                  <span className="font-medium">Status:</span>
                </div>
                <span
                  className={`font-semibold ${
                    paymentTransaction.status === "successful"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {paymentTransaction.status.toUpperCase()}
                </span>
              </div>

              {paymentTransaction.status === "successful" && (
                <p className="text-green-700 break-words">
                  <span className="font-medium">Paid At:</span>{" "}
                  {new Date(paymentTransaction.paidAt!).toLocaleString()}
                </p>
              )}

              <div className="space-y-1">
                <p className="text-gray-600 break-words">
                  <span className="font-medium">Order ID:</span>{" "}
                  <span className="text-gray-800 text-xs">{paymentTransaction.gatewayOrderId}</span>
                </p>
                {paymentTransaction.gatewayPaymentId && (
                  <p className="text-gray-600 break-words">
                    <span className="font-medium">Payment ID:</span>{" "}
                    <span className="text-gray-800 text-xs">{paymentTransaction.gatewayPaymentId}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Pay Button */}
          <div className="pt-2">
            <button
              onClick={handlePayment}
              disabled={isCreating || isVerifying || paymentTransaction?.status === "successful"}
              className={`w-full py-3 sm:py-4 rounded-md text-white text-base sm:text-lg font-medium transition ${
                isCreating || isVerifying
                  ? "bg-blue-400 cursor-not-allowed"
                  : paymentTransaction?.status === "successful"
                  ? "bg-green-600 cursor-default"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }`}
            >
              {paymentTransaction?.status === "successful" ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-circle-check" />
                  Payment Completed
                </span>
              ) : isCreating || isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-circle-notch fa-spin" />
                  <span className="hidden sm:inline">Processing Payment...</span>
                  <span className="sm:hidden">Processing...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-wallet" />
                  Pay Now
                </span>
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <i className="fa-solid fa-shield-halved text-green-600"></i>
              Secured by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTransaction;