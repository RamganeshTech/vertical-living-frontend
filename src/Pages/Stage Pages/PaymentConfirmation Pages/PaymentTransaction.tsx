
// TEST 1 CARD NUMBER
// Card Number: 4111 1111 1111 1111
// Expiry: Any future date (e.g. 12/28)
// CVV: Any 3 digits (e.g. 123)
// Name: Any name

// for upi
// success@razorpay
// failure@razorpay

// import React from "react";
// import { useParams } from "react-router-dom";
// import { loadScript } from "../../../utils/loadScript";
// import { toast } from "../../../utils/toast";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../store/store";
// import {
//   useCreatePaymentOrder,
//   useGetPaymentTransaction,
//   useVerifyPayment,
// } from "../../../apiList/Stage Api/Payment Api/paymentTransactionApi";

// const PaymentTransaction = () => {
//   const { projectId } = useParams<{ projectId: string }>();
//   const { data } = useGetPaymentTransaction(projectId!);
//   const paymentTransaction = data?.paymentTransaction;
//   const totalAmount = data?.totalAmount;

//   const { mutateAsync: createPaymentOrder, isPending: isCreating } = useCreatePaymentOrder();
//   const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPayment();

//   const client = useSelector((state: RootState) => state.clientProfileStore);

//   const handlePayment = async () => {
//     try {
//       const orderData = await createPaymentOrder({
//         projectId: projectId!,
//         clientId: client.clientId,
//       });

//       const razorpayLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
//       if (!razorpayLoaded) {
//         toast({
//           title: "Error",
//           description: "Failed to load Razorpay SDK.",
//           variant: "destructive",
//         });
//         return;
//       }

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: orderData.amount,
//         currency: "INR",
//         name: "Vertical Living",
//         description: "Project Payment",
//         order_id: orderData.orderId,
//         handler: async function (response: any) {
//           console.log("response", response)
//          const verify =  await verifyPayment({
//             projectId: projectId!,
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//           });
//           console.log("verify paymnt hadnler", verify)
//           toast({
//             title: "Success",
//             description: "Payment successful!",
//           });
//         },

//         prefill: {
//           name: client.clientName || "",
//           email: client.email || "",
//           contact: client.phoneNo || "",
//         },
//         theme: {
//           color: "#007bff",
//         },
//       };

//       const rzp = new (window as any).Razorpay(options);
//       rzp.open();
//     } catch (err: any) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: err.message || "Payment failed. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="w-full min-h-[80vh] py-10 px-4 bg-gray-50 flex justify-center">
//       <div className="w-full max-w-xl space-y-6 bg-white p-6 rounded-lg shadow-lg border">

//         <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-4">
//           <i className="fa-solid fa-credit-card" />
//           Make a Payment
//         </h2>

//         <div className="text-center bg-blue-50 p-5 rounded-lg border border-blue-200">
//           <p className="text-gray-600 mb-2">Amount Payable</p>
//           <h3 className="text-3xl font-bold text-blue-800">₹ {totalAmount}</h3>
//         </div>

//         <button
//           onClick={handlePayment}
//           disabled={isCreating || isVerifying}
//           className="w-full py-3 text-white font-medium text-lg bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50"
//         >
//           {isCreating || isVerifying ? (
//             <>
//               <i className="fa-solid fa-circle-notch fa-spin mr-2" />
//               Processing...
//             </>
//           ) : (
//             <>
//               <i className="fa-brands fa-cc-visa mr-2" />
//               Pay Now
//             </>
//           )}
//         </button>

//         {paymentTransaction?.status && (
//           <div className="bg-gray-100 border border-gray-200 rounded p-4 mt-6">
//             <h3 className="text-lg font-semibold mb-2 text-gray-700 flex items-center gap-2">
//               <i
//                 className={`fa-solid ${
//                   paymentTransaction.status === "successful"
//                     ? "fa-circle-check text-green-600"
//                     : "fa-circle-exclamation text-red-500"
//                 }`}
//               />
//               Payment Status:{" "}
//               <span
//                 className={`ml-1 font-semibold ${
//                   paymentTransaction.status === "successful" ? "text-green-700" : "text-red-700"
//                 }`}
//               >
//                 {paymentTransaction.status.toUpperCase()}
//               </span>
//             </h3>

//             {paymentTransaction.status === "successful" && (
//               <p className="text-sm text-green-700">
//                 Paid At: {new Date(paymentTransaction.paidAt!).toLocaleString()}
//               </p>
//             )}

//             <p className="text-sm text-gray-500 mt-2">
//               Gateway Order ID:{" "}
//               <span className="font-mono text-gray-700">{paymentTransaction.gatewayOrderId}</span>
//             </p>

//             {paymentTransaction.gatewayPaymentId && (
//               <p className="text-sm text-gray-500">
//                 Payment ID:{" "}
//                 <span className="font-mono text-gray-700">
//                   {paymentTransaction.gatewayPaymentId}
//                 </span>
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentTransaction;




import React from "react";
import { useParams } from "react-router-dom";
import { loadScript } from "../../../utils/loadScript";
import { toast } from "../../../utils/toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import {
  useCreatePaymentOrder,
  useGetPaymentTransaction,
  useVerifyPayment,
} from "../../../apiList/Stage Api/Payment Api/paymentTransactionApi";

const PaymentTransaction = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data } = useGetPaymentTransaction(projectId!);
  const paymentTransaction = data?.paymentTransaction;
  const totalAmount = data?.totalAmount;

  const { mutateAsync: createPaymentOrder, isPending: isCreating } = useCreatePaymentOrder();
  const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  const client = useSelector((state: RootState) => state.clientProfileStore);

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
    <div className="w-full min-h-full bg-gray-50 py-10 px-4 flex justify-center">
      <div className="bg-white w-full h-full max-w-2xl rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 flex items-center justify-center gap-2">
            <i className="fa-solid fa-money-check-dollar" />
            Payment Gateway
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Securely make your payment to proceed with the project.
          </p>
        </div>

        {/* Amount Display */}
        <div className="border border-blue-200 rounded-lg p-5 bg-blue-50 text-center shadow-sm">
          <p className="text-gray-700 text-sm mb-1">Amount Payable</p>
          <div className="text-3xl font-bold text-blue-800">₹ {totalAmount}</div>
        </div>

        {/* Status */}
        {paymentTransaction?.status && (
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 space-y-1 text-sm">
            <p className="font-medium flex items-center gap-2">
              <i
                className={`fa-solid ${
                  paymentTransaction.status === "successful"
                    ? "fa-circle-check text-green-600"
                    : "fa-circle-xmark text-red-600"
                }`}
              />
              Status:
              <span
                className={`ml-1 font-semibold ${
                  paymentTransaction.status === "successful"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {paymentTransaction.status.toUpperCase()}
              </span>
            </p>

            {paymentTransaction.status === "successful" && (
              <p className="text-green-700">
                Paid At: {new Date(paymentTransaction.paidAt!).toLocaleString()}
              </p>
            )}

            <p className="text-gray-600">
              Order ID: <span className="text-gray-800">{paymentTransaction.gatewayOrderId}</span>
            </p>
            {paymentTransaction.gatewayPaymentId && (
              <p className="text-gray-600">
                Payment ID:{" "}
                <span className="text-gray-800">{paymentTransaction.gatewayPaymentId}</span>
              </p>
            )}
          </div>
        )}

        {/* Pay Button */}
        <div>
          <button
            onClick={handlePayment}
            disabled={isCreating || isVerifying}
            className={`w-full py-3 rounded-md text-white text-lg font-medium transition ${
              isCreating || isVerifying
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isCreating || isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-notch fa-spin" />
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-wallet" />
                Pay Now
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentTransaction;