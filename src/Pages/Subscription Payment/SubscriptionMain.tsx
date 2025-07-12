import React, { useState } from "react";
import { loadScript } from "../../utils/loadScript";
import { toast } from "../../utils/toast";
import { useChooseSubscriptionMode, useVerifySubscriptionPayment } from "../../apiList/subscriptionApi";
import { useLocation } from "react-router-dom";
import { Button } from "../../components/ui/Button";

// ✅ App Plan List & Styling Config
// const plans = [
//   {
//     key: "basic",
//     name: "Basic",
//     price: 1000,
//     color: "border-blue-500",
//     btnColor: "bg-blue-600 hover:bg-blue-700",
//     planNameColor: "text-blue-700",
//     features: ["✔ 1 User Access", "✔ Email Support", "✘ No Analytics"],
//   },
//   {
//     key: "advanced",
//     name: "Advanced",
//     price: 8000,
//     color: "border-purple-500",
//     btnColor: "bg-purple-600 hover:bg-purple-700",
//     planNameColor: "text-purple-700",
//     features: ["✔ Up to 5 Users", "✔ Email & Chat Support", "✔ Basic Analytics"],
//   },
//   {
//     key: "enterprise",
//     name: "Enterprise",
//     price: 5000,
//     color: "border-rose-500",
//     btnColor: "bg-rose-600 hover:bg-rose-700",
//     planNameColor: "text-rose-700",
//     features: ["✔ Unlimited Users", "✔ Priority Support", "✔ Custom Reports & Exports"],
//   },
// ];


const plans = [
  {
    key: "basic",
    name: "Basic",
    price: 1000,
    color: "border-blue-500",
    btnColor: "bg-blue-600 hover:bg-blue-700",
    planNameColor: "text-blue-700",
    features: ["✔ 5 Roles Allowed", "✔ Email Notification", "✔ Timer Functionality", "✔ Image Upload","✔ PDF Upload", "✔ Assign Staffs", "✔ Cost Estimation"],
    // features: ["✔ 5 Roles Allowed", "✔ Email Notification", "✔ Timer Functionality", "✔ Image Upload","✔ PDF Upload",  "✘ No Analytics", ],
    available: true,
  },
  {
    key: "advanced",
    name: "Advanced",
    price: 0,
    color: "border-purple-500",
    btnColor: "bg-purple-600 hover:bg-purple-700",
    planNameColor: "text-purple-700",
    features: [],
    available: false,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: 0,
    color: "border-rose-500",
    btnColor: "bg-rose-600 hover:bg-rose-700",
    planNameColor: "text-rose-700",
    features: [],
    available: false,
  },
];


type SubscriptionPlansProp = {
  openMobileSidebar?: () => void
  isMobile?: boolean
}

const SubscriptionPlans: React.FC<SubscriptionPlansProp> = ({ openMobileSidebar, isMobile }) => {
  const location = useLocation()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const showMobileMenuIcon = location.pathname.split('/').includes("organizations")




  const { mutateAsync: choosePlan, isPending: isCreating } = useChooseSubscriptionMode();
  const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifySubscriptionPayment();
  const handleSelectPlan = async (planKey: string) => {
    try {
      setLoadingPlan(planKey);
      const razorResult = await choosePlan({ newPlanType: planKey });

      // if `orderId` exists, it's an upgrade → Razorpay required
      if (razorResult?.orderId) {
        const isLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!isLoaded) {
          toast({ title: "Error", description: "Razorpay failed to load", variant: "destructive" });
          return;
        }

        const razorOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorResult.amount,
          currency: razorResult.currency,
          name: "Vertical Living",
          description: "Subscription Payment",
          order_id: razorResult.orderId,
          handler: async function (response: any) {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast({ title: "Success", description: "Subscription payment verified." });
          },
          theme: { color: "#0A71F2" },
        };

        const rzp = new (window as any).Razorpay(razorOptions);
        rzp.open();
      } else {
        // Downgrade — no Razorpay
        toast({ title: "Plan Changed", description: "You have switched your plan successfully." });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || err.message || "Failed to switch plan",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-full bg-gray-100  flex flex-col items-center">
      {/* Title */}
      <>
        {showMobileMenuIcon && isMobile ?
          <div className="w-full flex items-center justify-center mb-2 py-2 px-2 bg-white">
            <button
              onClick={openMobileSidebar}
              className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
              title="Open Menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>

            <div className="w-full">
              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800">Upgrade Plan</h1>
              {/* <p className="text-md text-gray-500">Choose a subscription plan to match your needs</p> */}
            </div>
          </div>

          :
          <>
            <div className="max-w-4xl w-full text-center py-5">
              <h1 className="text-4xl font-extrabold text-[#2f303a] mb-2">{showMobileMenuIcon ? "Upgrade your Plan" : "Choose Plan"}</h1>
              <p className="text-md text-gray-500">Choose a subscription plan to match your needs</p>
            </div>
          </>
        }
      </>


      {/* Plan Cards */}
      <div className=" px-4 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`group border-t-[6px] ${plan.color} rounded-xl bg-white shadow-md p-6 flex flex-col justify-between transition hover:shadow-xl`}
          >
            {/* Title */}
            <div className="text-center">
              <h2 className={`text-2xl font-bold ${plan.planNameColor}`}>{plan.name}</h2>
              <p className="text-gray-500 text-sm">Billed every 30 days</p>
            </div>

            {/* Price */}
            <div className="text-center my-5">
              <h3 className={`${plan.price ? "text-3xl" : "text-xl"} font-extrabold text-gray-800`}>
                {plan.price ? `₹ ${plan.price}` : "Coming Soon"}
              </h3>
              <p className="text-sm text-gray-400">/ month</p>
            </div>

            {/* Features */}
            <ul className="text-sm text-gray-700 mt-2 mb-5 space-y-2">
              {plan.features.length > 0 ? (
                plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <i
                      className={`fa-solid ${feature.includes("✔") ? "fa-check text-green-600 mt-1" : "fa-xmark text-red-400 mt-1"
                        }`}
                    />
                    <span>{feature.replace("✔", "").replace("✘", "")}</span>
                  </li>
                ))
              ) : (
                <div className="text-sm text-gray-500 text-center">Features Coming Soon</div>
              )}
            </ul>

            {/* Button */}
            {plan.price ? (
              <Button
              isLoading={isVerifying || isCreating}
                onClick={() => handleSelectPlan(plan.key)}
                disabled={loadingPlan === plan.key || isVerifying}
                className={`w-full py-2 mt-auto text-white rounded-md font-medium ${loadingPlan === plan.key || isVerifying
                  ? "bg-gray-400 !cursor-not-allowed"
                  : plan.btnColor
                  } transition`}
              >
                {loadingPlan === plan.key || isVerifying ? "Processing..." : "Choose Plan"}
              </Button>
            ) : (
              <Button
                disabled
                className="w-full py-2 mt-auto text-white rounded-md font-medium bg-gray-400 hover:!bg-gray-400 !cursor-not-allowed"
              >
                Coming Soon
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;