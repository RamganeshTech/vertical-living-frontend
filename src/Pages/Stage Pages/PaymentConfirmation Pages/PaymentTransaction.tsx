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
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import { COMPANY_DETAILS } from "../../../constants/constants";


const PaymentTransaction = () => {
  const { projectId, organizationId } = useParams<{ projectId: string, organizationId: string }>();
  const navigate = useNavigate();
  const { data, refetch, isError, error: getAllError, isLoading } = useGetPaymentTransaction(projectId!);
  const paymentTransaction = data?.paymentTransaction;
  const totalAmount = data?.totalAmount;

  const { mutateAsync: createPaymentOrder, isPending: isCreating } = useCreatePaymentOrder();
  const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPayment();



  const { role, permission } = useAuthCheck();
  // const canDelete = role === "owner" || permission?.paymentconfirmation?.delete;
  // const canList = role === "owner" || permission?.paymentconfirmation?.list;
  const canCreate = role === "owner" || permission?.paymentconfirmation?.create;
  const canEdit = role === "owner" || permission?.paymentconfirmation?.edit;




  const client = useSelector((state: RootState) => state.clientProfileStore);


  if (isLoading) return <MaterialOverviewLoading />;
  // if (isError || !data) return <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-6">
  //   <div className="text-red-600 font-semibold mb-2">
  //     ⚠️ Error Occurred
  //   </div>
  //   <p className="text-red-500 text-sm mb-4">
  //     {(getAllError as any)?.response?.data?.message ||
  //       (getAllError as any)?.message ||
  //       "Failed to load cost estimation data"}
  //   </p>
  //   <Button
  //     onClick={() => refetch()}
  //     className="bg-red-600 text-white px-4 py-2"
  //   >
  //     Retry
  //   </Button>
  // </div>


  if (isError || !data) return (
    <div className="max-w-xl mx-auto p-6 bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center mt-6">
      <div className="text-action-danger text-2xl mb-3">
        <i className="fa-solid fa-triangle-exclamation"></i>
      </div>
      <div className="text-text-main font-bold mb-2">
        Error Occurred
      </div>
      <p className="text-text-muted text-sm mb-5">
        {(getAllError as any)?.response?.data?.message ||
          (getAllError as any)?.message ||
          "Failed to load payment transaction data"}
      </p>
      <Button
        onClick={() => refetch()}
        variant="outline"
        className="border-ash-medium text-text-main hover:text-action-danger hover:border-action-danger hover:bg-brand-ash"
      >
        Retry
      </Button>
    </div>
  );

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
        name: COMPANY_DETAILS.COMPANY_NAME,
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
        description: error?.response?.data?.message || error?.message || "Payment failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    // <div className="w-full h-full flex flex-col bg-gray-50 p-2 sm:p-4">
    <div className="w-full h-full flex flex-col bg-brand-main p-4 sm:p-6 min-h-screen">
      {/* Header Section */}
      {/* <div className="flex-shrink-0 flex justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
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
      </div> */}

      <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-ash-light gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-surface border border-ash-medium rounded-lg flex items-center justify-center shadow-sm">
            <i className="fa-solid fa-money-check-dollar text-text-muted" />
          </div>
          <span className="hidden sm:inline">Payment Transaction</span>
          <span className="sm:hidden">Payment</span>
        </h1>

        <Button
          onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/paymentconfirmation`)}
          variant="white"
          className="border-ash-medium text-text-main shadow-sm"
        >
          <i className="fa-solid fa-arrow-left sm:mr-2" />
          <span className="hidden sm:inline">Go Back</span>
        </Button>
      </div>


      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        {/* <div className="bg-white w-full max-w-lg rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6"> */}
        <div className="bg-brand-surface w-full max-w-lg rounded-2xl shadow-md border border-ash-medium p-5 sm:p-8 space-y-6">
          {/* Gateway Header */}
          <div className="text-center">
            {/* <h2 className="text-lg sm:text-xl font-semibold text-blue-700 flex items-center justify-center gap-2">
              <i className="fa-solid fa-shield-halved text-blue-600" />
              Secure Payment Gateway
            </h2> */}

            <h2 className="text-lg sm:text-xl font-bold text-text-main flex items-center justify-center gap-2">
              <i className="fa-solid fa-shield-halved text-text-muted" />
              Secure Payment Gateway
            </h2>

            {/* <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Securely make your payment to proceed with the project.
            </p> */}

            <p className="text-sm text-text-muted mt-2">
              Securely make your payment to proceed with the project.
            </p>

          </div>

          {/* Amount Display */}
          {/* <div className="border border-blue-200 rounded-lg p-4 sm:p-5 bg-blue-50 text-center shadow-sm">
            <p className="text-gray-700 text-xs sm:text-sm mb-1">Amount Payable</p>
            <div className="text-2xl sm:text-3xl font-bold text-blue-800">
              ₹ {totalAmount?.toLocaleString('en-IN') || '0'}
            </div>
          </div> */}

          {/* Amount Display */}
          <div className="border border-ash-medium rounded-xl p-5 bg-brand-ash text-center shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">Amount Payable</p>
            <div className="text-3xl sm:text-4xl font-bold text-text-main tracking-tight">
              <span className="text-text-muted text-2xl mr-1">₹</span>
              {totalAmount?.toLocaleString('en-IN') || '0'}
            </div>
          </div>


          {/* Status */}
          {paymentTransaction?.status && (
            // <div className="bg-gray-100 p-3 sm:p-4 rounded-lg border border-gray-300 space-y-2 text-xs sm:text-sm">
            <div className="bg-brand-ash p-4 rounded-xl border border-ash-light space-y-3 text-sm">
              {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"> */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-ash-medium/50">
                <div className="flex items-center gap-2">
                  {/* <i
                    className={`fa-solid ${paymentTransaction.status === "successful"
                      ? "fa-circle-check text-green-600"
                      : "fa-circle-xmark text-red-600"
                      }`}
                  /> */}

                  <i
                    className={`fa-solid ${
                      paymentTransaction.status === "successful"
                        ? "fa-circle-check text-action-success"
                        : "fa-circle-xmark text-action-danger"
                    }`}
                  />

                  {/* <span className="font-medium">Status:</span> */}
                  <span className="font-bold text-text-muted">Transaction Status:</span>
                </div>
                <span
                  // className={`font-semibold ${paymentTransaction.status === "successful"
                  //   ? "text-green-700"
                  //   : "text-red-700"
                  //   }`}

                  className={`font-bold px-2.5 py-1 rounded-md bg-brand-surface border ${
                    paymentTransaction.status === "successful"
                      ? "text-action-success border-action-success/20"
                      : "text-action-danger border-action-danger/20"
                  }`}
                >
                  {paymentTransaction.status.toUpperCase()}
                </span>
              </div>

              {paymentTransaction.status === "successful" && (
                // <p className="text-green-700 break-words">
                //   <span className="font-medium">Paid At:</span>{" "}
                //   {new Date(paymentTransaction.paidAt!).toLocaleString()}
                // </p>

                <div className="flex justify-between items-start gap-4">
                  <span className="font-bold text-text-muted">Paid At:</span>
                  <span className="text-text-main font-medium text-right">
                    {new Date(paymentTransaction.paidAt!).toLocaleString()}
                  </span>
                </div>

              )}

              {/* <div className="space-y-1">
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
              </div> */}

              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-start gap-4 break-all">
                  <span className="font-bold text-text-muted whitespace-nowrap">Order ID:</span>
                  <span className="text-text-main font-medium text-xs text-right">
                    {paymentTransaction.gatewayOrderId}
                  </span>
                </div>
                
                {paymentTransaction.gatewayPaymentId && (
                  <div className="flex justify-between items-start gap-4 break-all">
                    <span className="font-bold text-text-muted whitespace-nowrap">Payment ID:</span>
                    <span className="text-text-main font-medium text-xs text-right">
                      {paymentTransaction.gatewayPaymentId}
                    </span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Pay Button */}
          { (canCreate || canEdit )&& <div className="pt-2">
            <button
              onClick={handlePayment}
              disabled={isCreating || isVerifying || paymentTransaction?.status === "successful"}
              // className={`w-full py-3 sm:py-4 rounded-md text-white text-base sm:text-lg font-medium transition ${isCreating || isVerifying
              //   ? "bg-blue-400 cursor-not-allowed"
              //   : paymentTransaction?.status === "successful"
              //     ? "bg-green-600 cursor-default"
              //     : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              //   }`}

              className={`w-full py-3.5 rounded-xl text-white text-base font-bold transition-all shadow-sm ${
                  isCreating || isVerifying
                    ? "bg-action-primary opacity-70 cursor-not-allowed"
                    : paymentTransaction?.status === "successful"
                    ? "bg-action-success pointer-events-none"
                    : "bg-action-primary hover:opacity-90 active:scale-[0.99]"
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
          </div>}

          {/* Security Notice */}
          <div className="text-center pt-2">
            {/* <p className="text-xs text-gray-500 flex items-center justify-center gap-1"> */}
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center justify-center gap-1.5">
              {/* <i className="fa-solid fa-shield-halved text-green-600"></i> */}
              <i className="fa-solid fa-shield-halved text-action-success"></i>
              Secured by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTransaction;