// import React from "react";
// import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
// import { toast } from "../../../utils/toast";
// import { Button } from "../../../components/ui/Button";
// import { ResetStageButton } from "../../../shared/ResetStageButton";
// import AssignStageStaff from "../../../shared/AssignStaff";
// import StageTimerInfo from "../../../shared/StagetimerInfo";
// import { Card } from "../../../components/ui/Card";
// import { useCompletePaymentConfirmation, useGetPaymentConfirmation, useSetPaymentConfirmationDeadline } from "../../../apiList/Stage Api/Payment Api/paymentConfirmationApi";

// const stages = [
//   { name: "Consent Form", path: "consent", icon: "📝", color: "text-blue-700" },
//   { name: "Schedule Approval", path: "schedule", icon: "📅", color: "text-blue-700" },
//   { name: "Transaction", icon: "💳", color: "text-blue-700", path: "transaction" },
// ];

// const PaymentConfirmationStage: React.FC = () => {
//   const { projectId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { data, isLoading, isError, refetch } = useGetPaymentConfirmation(projectId!);
//   const { mutateAsync: setDeadlineAsync, isPending: isDeadlinePending } = useSetPaymentConfirmationDeadline();
//   const { mutateAsync: completeStageAsync, isPending: isCompletePending } = useCompletePaymentConfirmation();

//   // If currently inside a child route (e.g. /consent /schedule), don't render the main layout
//   if (
//     location.pathname.includes("/consent") ||
//     location.pathname.includes("/schedule") ||
//     location.pathname.includes("/transaction")
//   ) {
//     return <Outlet />; // render child page only
//   }

//   if (isLoading) return <p>Loading payment confirmation...</p>;
//   if (isError || !data) return <p>Something went wrong loading data.</p>;

//   const handleCompleteClick = async () => {
//     try {
//       await completeStageAsync({ projectId: projectId! });
//       toast({
//         title: "Success",
//         description: "Marked stage as complete.",
//       });
//       refetch();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description:
//           error?.response?.data?.message || error.message || "Failed to mark complete",
//         variant: "destructive",
//       });
//     }
//   };

//   // Data from model
//   const { timer, assignedTo, totalAmount, isConsentRequired, status, _id: formId } = data;

//   return (
//     <div className="space-y-6">
//       <Card className="p-5 space-y-4 border-l-4 border-blue-600 bg-white">
//         <h2 className="text-2xl font-semibold text-blue-800">📑 Payment Confirmation Overview</h2>

//         {/* General Info */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
//           <p><strong>Status:</strong> {status}</p>
//           <p><strong>Total Amount:</strong> ₹{totalAmount?.toLocaleString()}</p>
//           <p><strong>Consent Required:</strong> {isConsentRequired ? "Yes" : "No"}</p>
//           <p><strong>Assigned Staff:</strong> {assignedTo ? assignedTo.name || "Assigned" : "Not Assigned"}</p>
//         </div>

//         {/* Controls */}
//         <div className="flex gap-2 items-center flex-wrap">
//           <Button
//             isLoading={isCompletePending}
//             onClick={handleCompleteClick}
//             className="bg-green-600 hover:bg-green-700 text-white"
//           >
//             ✅ Mark as Complete
//           </Button>
//           <ResetStageButton
//             projectId={projectId!}
//             stageNumber={7}
//             stagePath="paymentconfirmation"
//           />
//           <AssignStageStaff
//             stageName="PaymentConfirmationModel"
//             projectId={projectId!}
//             organizationId={"684a57015e439b678e8f6918"}
//             currentAssignedStaff={assignedTo}
//           />
//         </div>

//         {/* Timer */}
//         <StageTimerInfo
//           stageName="paymentconfirmation"
//           completedAt={timer?.completedAt}
//           startedAt={timer?.startedAt}
//           formId={formId}
//           projectId={projectId!}
//           deadLine={timer?.deadLine}
//           deadLineMutate={setDeadlineAsync}
//           isPending={isDeadlinePending}
//           refetchStageMutate={refetch}
//         />
//       </Card>

//       {/* Sub-Stage Cards */}
//       <div className="grid sm:grid-cols-3 gap-4">
//         {stages.map((stage) => (
//          <div
//           onClick={() => navigate(stage.path)}
//          >
//              <Card
//             key={stage.path}
//             className="cursor-pointer hover:shadow-md transition p-4 border border-blue-200 bg-blue-50"
           
//           >
//             <div className="text-2xl">{stage.icon}</div>
//             <h3 className={`font-semibold text-md mt-2 ${stage.color}`}>{stage.name}</h3>
//             <p className="text-sm text-gray-600 mt-1">Go to {stage.name}</p>
//           </Card>
//          </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PaymentConfirmationStage;



import React from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { Card } from "../../../components/ui/Card";
import { useCompletePaymentConfirmation, useGetPaymentConfirmation, useSetPaymentConfirmationDeadline } from "../../../apiList/Stage Api/Payment Api/paymentConfirmationApi";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

const sectionCards = [
  {
    title: "Consent Form",
    description: "Review and accept client consent agreements.",
    icon: "📝",
    path: "consent",
  },
  {
    title: "Schedule Approval",
    description: "Manage milestone approvals from client & MD.",
    icon: "📅",
    path: "schedule",
  },
  {
    title: "Payment Transaction",
    description: "Track actual payment gateway transactions.",
    icon: "💳",
    path: "transaction",
  },
];

const PaymentConfirmationStage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError: getAllError,
    refetch,
  } = useGetPaymentConfirmation(projectId!);

  const { mutateAsync: completeStage, isPending: completePending } = useCompletePaymentConfirmation();
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetPaymentConfirmationDeadline();

  // Hide main page if a sub-stage is open
  if (
    location.pathname.includes("/consent") ||
    location.pathname.includes("/schedule") ||
    location.pathname.includes("/transaction")
  )
    return <Outlet />;

  // Loading state
  if (isLoading) return <MaterialOverviewLoading />;

  // Error state
  if (getAllError)
    return (
      <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
        <div className="text-red-600 text-xl font-semibold mb-2">
          ⚠️ Oops! An Error Occurred
        </div>
        <p className="text-red-500 text-sm mb-4">
          {(getAllError as any)?.response?.data?.message ||
            (getAllError as any)?.message ||
            "Failed to load, please try again"}
        </p>

        <Button
          onClick={() => refetch()}
          isLoading={isLoading}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Retry
        </Button>
      </div>
    );

  const handleCompletionStatus = async () => {
    try {
      await completeStage({ projectId: projectId! });
      toast({title: "Success",description: "Completion status updated successfully",});
      refetch();
    } catch (error: any) {
      toast({title: "Error",description:error?.response?.data?.message ||error.message ||"Failed to update completion status",variant: "destructive",});
    }
  };

  const { assignedTo, timer, totalAmount, status, _id: formId } = data;

  return (
    <div className="space-y-4">
      {/* ⬆ Header Section with Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-blue-600 flex items-center">
          <i className="fa-solid fa-sack-dollar mr-3" />
          Payment Confirmation
        </h2>

        <div className="flex gap-2 items-center justify-end">
          <Button
            isLoading={completePending}
            onClick={handleCompletionStatus}
            className="bg-green-600 hover:bg-green-700 text-white h-10"
          >
            <i className="fa-solid fa-circle-check mr-2" />
            Mark as Complete
          </Button>

          <ResetStageButton stageNumber={7} stagePath="paymentconfirmation" projectId={projectId!} />

          <AssignStageStaff
            stageName="PaymentConfirmationModel"
            projectId={projectId!}
            organizationId="684a57015e439b678e8f6918"
            currentAssignedStaff={assignedTo || null}
          />
        </div>
      </div>

      {/* ⏳ Timer */}
      <Card className="p-4 mb-4 w-full shadow border-l-4 border-blue-600 bg-white">
        <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
          <i className="fa-solid fa-clock text-blue-500 text-lg" />
          <span>Stage Timings</span>
        </div>

        <StageTimerInfo
          completedAt={timer?.completedAt}
          stageName={"paymentconfirmation"}
          formId={formId}
          projectId={projectId!}
          deadLine={timer?.deadLine}
          startedAt={timer?.startedAt}
          refetchStageMutate={refetch}
          deadLineMutate={deadLineAsync}
          isPending={deadLinePending}
        />
      </Card>

      {/* 💰 Total Amount Display */}
      <Card className="p-4 mb-4 bg-blue-50 border-l-4 border-blue-600 shadow-md">
        <div className="text-lg font-semibold text-blue-800 flex items-center gap-2">
          <i className="fa-solid fa-wallet" />
          Total Payment Amount
        </div>
        <p className="text-3xl text-blue-700 mt-2 font-bold">
          ₹ {totalAmount?.toLocaleString() || 0}
        </p>
      </Card>

      {/* 🗂️ Stage Sections Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sectionCards.map((card) => (
        <div  onClick={() => navigate(card.path)}>
              <Card
           
            key={card.path}
            className="cursor-pointer hover:shadow-xl border-l-6 border-blue-600 transform hover:scale-[1.02] transition bg-blue-100 p-6 !rounded-xl h-full flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl">{card.icon}</div>
              <h3 className="text-xl mt-3 font-bold text-blue-800">{card.title}</h3>
              <p className="text-sm text-blue-700 mt-2">{card.description}</p>
            </div>
            <div className="mt-4 text-right">
              <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded">
                Go to {card.title}
              </span>
            </div>
          </Card>
        </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentConfirmationStage;