// import React from "react";
// import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
// import { toast } from "../../../utils/toast";
// import { Button } from "../../../components/ui/Button";
// import { ResetStageButton } from "../../../shared/ResetStageButton";
// import AssignStageStaff from "../../../shared/AssignStaff";
// import StageTimerInfo from "../../../shared/StagetimerInfo";
// import { Card } from "../../../components/ui/Card";
// import { useCompletePaymentConfirmation, useGetPaymentConfirmation, useSetPaymentConfirmationDeadline } from "../../../apiList/Stage Api/Payment Api/paymentConfirmationApi";
// import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

// const sectionCards = [
//   {
//     title: "Consent Form",
//     description: "Review and accept client consent agreements.",
//     icon: "📝",
//     path: "consent",
//   },
//   {
//     title: "Schedule Approval",
//     description: "Manage milestone approvals from client & MD.",
//     icon: "📅",
//     path: "schedule",
//   },
//   {
//     title: "Payment Transaction",
//     description: "Track actual payment gateway transactions.",
//     icon: "💳",
//     path: "transaction",
//   },
// ];

// const PaymentConfirmationStage: React.FC = () => {
//   const { projectId, organizationId } = useParams<{ projectId: string, organizationId:string }>();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const {
//     data,
//     isLoading,
//     isError: getAllError,
//     refetch,
//   } = useGetPaymentConfirmation(projectId!);

//   const { mutateAsync: completeStage, isPending: completePending } = useCompletePaymentConfirmation();
//   const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetPaymentConfirmationDeadline();

//   // Hide main page if a sub-stage is open
//   if (
//     location.pathname.includes("/consent") ||
//     location.pathname.includes("/schedule") ||
//     location.pathname.includes("/transaction")
//   )
//     return <Outlet />;

//   // Loading state
//   if (isLoading) return <MaterialOverviewLoading />;

//   // Error state
//   if (getAllError)
//     return (
//       <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//         <div className="text-red-600 text-xl font-semibold mb-2">
//           ⚠️ Oops! An Error Occurred
//         </div>
//         <p className="text-red-500 text-sm mb-4">
//           {(getAllError as any)?.response?.data?.message ||
//             (getAllError as any)?.message ||
//             "Failed to load, please try again"}
//         </p>

//         <Button
//           onClick={() => refetch()}
//           isLoading={isLoading}
//           className="bg-red-600 text-white hover:bg-red-700"
//         >
//           Retry
//         </Button>
//       </div>
//     );

//   const handleCompletionStatus = async () => {
//     try {
//       await completeStage({ projectId: projectId! });
//       toast({title: "Success",description: "Completion status updated successfully",});
//       refetch();
//     } catch (error: any) {
//       toast({title: "Error",description:error?.response?.data?.message ||error.message ||"Failed to update completion status",variant: "destructive",});
//     }
//   };

//   const { assignedTo, timer, totalAmount, status, _id: formId } = data;

//   return (
//     <div className="space-y-4">
//       {/* ⬆ Header Section with Actions */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-semibold text-blue-600 flex items-center">
//           <i className="fa-solid fa-sack-dollar mr-3" />
//           Payment Confirmation
//         </h2>

//         <div className="flex gap-2 items-center justify-end">
//           <Button
//             isLoading={completePending}
//             onClick={handleCompletionStatus}
//             className="bg-green-600 hover:bg-green-700 text-white h-10"
//           >
//             <i className="fa-solid fa-circle-check mr-2" />
//             Mark as Complete
//           </Button>

//           <ResetStageButton stageNumber={7} stagePath="paymentconfirmation" projectId={projectId!} />

//           <AssignStageStaff
//             stageName="PaymentConfirmationModel"
//             projectId={projectId!}
//             organizationId={organizationId!}
//             currentAssignedStaff={assignedTo || null}
//           />
//         </div>
//       </div>

//       {/* ⏳ Timer */}
//       <Card className="p-4 mb-4 w-full shadow border-l-4 border-blue-600 bg-white">
//         <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
//           <i className="fa-solid fa-clock text-blue-500 text-lg" />
//           <span>Stage Timings</span>
//         </div>

//         <StageTimerInfo
//           completedAt={timer?.completedAt}
//           stageName={"paymentconfirmation"}
//           formId={formId}
//           projectId={projectId!}
//           deadLine={timer?.deadLine}
//           startedAt={timer?.startedAt}
//           refetchStageMutate={refetch}
//           deadLineMutate={deadLineAsync}
//           isPending={deadLinePending}
//         />
//       </Card>

//       {/* 💰 Total Amount Display */}
//       <Card className="p-4 mb-4 bg-blue-50 border-l-4 border-blue-600 shadow-md">
//         <div className="text-lg font-semibold text-blue-800 flex items-center gap-2">
//           <i className="fa-solid fa-wallet" />
//           Total Payment Amount
//         </div>
//         <p className="text-3xl text-blue-700 mt-2 font-bold">
//           ₹ {totalAmount?.toLocaleString() || 0}
//         </p>
//       </Card>

//       {/* 🗂️ Stage Sections Navigation */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {sectionCards.map((card) => (
//         <div  onClick={() => navigate(card.path)}>
//               <Card
           
//             key={card.path}
//             className="cursor-pointer hover:shadow-xl border-l-6 border-blue-600 transform hover:scale-[1.02] transition bg-blue-100 p-6 !rounded-xl h-full flex flex-col justify-between"
//           >
//             <div>
//               <div className="text-4xl">{card.icon}</div>
//               <h3 className="text-xl mt-3 font-bold text-blue-800">{card.title}</h3>
//               <p className="text-sm text-blue-700 mt-2">{card.description}</p>
//             </div>
//             <div className="mt-4 text-right">
//               <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded">
//                 Go to {card.title}
//               </span>
//             </div>
//           </Card>
//         </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PaymentConfirmationStage;






import React from "react";
import { Outlet, useLocation, useNavigate, useParams, useOutletContext } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { Card } from "../../../components/ui/Card";
import { useCompletePaymentConfirmation, useGetPaymentConfirmation, useSetPaymentConfirmationDeadline } from "../../../apiList/Stage Api/Payment Api/paymentConfirmationApi";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

// Define context type
type ProjectDetailsOutlet = {
  isMobile: boolean;
  openMobileSidebar: () => void;
};

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
  const { projectId, organizationId } = useParams<{ projectId: string, organizationId: string }>();
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
  const location = useLocation();
  const navigate = useNavigate();

  const { data, isLoading, isError: getAllError, refetch } = useGetPaymentConfirmation(projectId!);

  const { mutateAsync: completeStage, isPending: completePending } = useCompletePaymentConfirmation();
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetPaymentConfirmationDeadline();

  // Hide main page if a sub-stage is open
  if (
    location.pathname.includes("/consent") ||
    location.pathname.includes("/schedule") ||
    location.pathname.includes("/transaction")
  ) {
    return <Outlet />;
  }

  const handleCompletionStatus = async () => {
    try {
      await completeStage({ projectId: projectId! });
      toast({ title: "Success", description: "Completion status updated successfully" });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update completion status",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (isLoading) return <MaterialOverviewLoading />;

  const { assignedTo, timer, totalAmount, status, _id: formId } = data || {};

  return (
    <div className="container mx-auto p-2 max-w-full max-h-full overflow-y-auto">
      {/* Header Section with Mobile Sidebar Toggle */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center">
          {isMobile && (
            <button
              onClick={openMobileSidebar}
              className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
              title="Open Menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          )}
          <i className="fa-solid fa-sack-dollar mr-2" /> Payment Confirmation
        </h2>
        
        <div className="!w-[100%] sm:!w-[80%] lg:w-[50%] flex flex-col sm:flex-row gap-3 justify-end">
          <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-end">
            <Button
              isLoading={completePending}
              onClick={handleCompletionStatus}
              className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-initial min-w-max"
            >
              <i className="fa-solid fa-circle-check mr-2" />
              Mark Complete
            </Button>
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-end">
            <ResetStageButton 
              stageNumber={7} 
              stagePath="paymentconfirmation" 
              projectId={projectId!} 
              className="flex-1 sm:flex-initial min-w-max"
            />
            
            <AssignStageStaff
              stageName="PaymentConfirmationModel"
              projectId={projectId!}
              organizationId={organizationId!}
              currentAssignedStaff={assignedTo || null}
              className="flex-1 sm:flex-initial min-w-max"
            />
          </div>
        </div>
      </div>

      {/* Error Display - Doesn't hide header buttons */}
      {getAllError && (
        <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-6">
          <div className="text-red-600 font-semibold mb-2">
            ⚠️ Error Occurred
          </div>
          <p className="text-red-500 text-sm mb-4">
            {(getAllError as any)?.response?.data?.message || 
             (getAllError as any)?.message || 
             "Failed to load payment confirmation data"}
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-red-600 text-white px-4 py-2"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Show content only when no error */}
      {!getAllError && (
        <>
          {/* Timer Section */}
          <Card className="p-4 mb-6 w-full shadow border-l-4 border-blue-600 bg-white">
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

          {/* Total Amount Display */}
          <Card className="p-4 mb-6 bg-blue-50 border-l-4 border-blue-600 shadow-md">
            <div className="text-lg font-semibold text-blue-800 flex items-center gap-2">
              <i className="fa-solid fa-wallet" />
              Total Payment Amount
            </div>
            <p className="text-3xl text-blue-700 mt-2 font-bold">
              ₹ {totalAmount?.toLocaleString() || 0}
            </p>
          </Card>

          {/* Stage Sections Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sectionCards.map((card) => (
              <div 
                key={card.path} 
                onClick={() => navigate(card.path)}
                className="cursor-pointer"
              >
                <Card className="hover:shadow-xl border-l-6 border-blue-600 transition bg-blue-100 p-4 sm:p-6 !rounded-xl h-full flex flex-col justify-between">
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
        </>
      )}
    </div>
  );
};

export default PaymentConfirmationStage;