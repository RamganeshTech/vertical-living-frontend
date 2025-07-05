import React from "react";
import { useParams } from "react-router-dom";
import { loadScript } from "../../../utils/loadScript";
import { toast } from "../../../utils/toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useCreatePaymentOrder, useGetPaymentTransaction, useVerifyPayment } from "../../../apiList/Stage Api/Payment Api/paymentTransactionApi";


// TEST 1 CARD NUMBER
// Card Number: 4111 1111 1111 1111
// Expiry: Any future date (e.g. 12/28)
// CVV: Any 3 digits (e.g. 123)
// Name: Any name


const PaymentTransaction = () => {
    const { projectId } = useParams<{ projectId: string }>();

    const { data: {paymentTransaction, totalAmount} } = useGetPaymentTransaction(projectId!);

    const { mutateAsync: createPaymentOrder, isPending: isCreating } = useCreatePaymentOrder();
    const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPayment();


    const client = useSelector((state: RootState) => state.clientProfileStore)

    const handlePayment = async () => {
        try {
            // 1️⃣ Create Razorpay Order
            const orderData = await createPaymentOrder({ projectId: projectId!, clientId:client.clientId });

            // 2️⃣ Load Razorpay SDK
            const razorpayLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!razorpayLoaded) {
                toast({
                    title: "Error",
                    description: "Failed to load Razorpay SDK.",
                    variant: "destructive",
                })
                return;
            }

            // 3️⃣ Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: "INR",
                name: "Your Company",
                description: "Project Payment",
                order_id: orderData.gatewayOrderId,
                handler: async function (response: any) {
                    // 4️⃣ Verify payment on backend
                    await verifyPayment({
                        projectId: projectId!,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });
                    toast({ title: "Success", description: "Payment successful!" })
                },
                prefill: {
                    name: client.clientName || "",
                    email: client.email || "",
                    contact: client.phoneNo || "",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            console.error(err);
            toast({
                title: "Error",
                description: "Payment failed. Please try again.",
                variant: "destructive",
            })
    }
    };

    return (
        <div className="max-w-lg mx-auto border rounded p-6 shadow space-y-4">
            <h2 className="text-2xl font-bold mb-4">Make Your Payment</h2>
            <p className="text-lg font-semibold">Amount to Pay: ₹ {totalAmount / 100}</p>

            <button
                onClick={handlePayment}
                disabled={isCreating || isVerifying}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {isCreating ? "Processing..." : "Pay Now"}
            </button>

            {paymentTransaction?.status && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold">Payment Status: {paymentTransaction?.status}</h3>
                    {paymentTransaction?.status === "successful" && (
                        <p className="text-green-600">Paid At: {new Date(paymentTransaction?.paidAt).toLocaleString()}</p>
                    )}
                    <p>Gateway Order ID: {paymentTransaction?.gatewayOrderId}</p>
                    <p>Gateway Payment ID: {paymentTransaction?.gatewayPaymentId}</p>
                </div>
            )}
        </div>
    );
};

export default PaymentTransaction;
