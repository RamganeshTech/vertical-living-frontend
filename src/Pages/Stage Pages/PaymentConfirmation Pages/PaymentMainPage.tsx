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
// import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";

// Define context type
type ProjectDetailsOutlet = {
  isMobile: boolean;
  openMobileSidebar: () => void;
};

const sectionCards = [
  {
    title: "Consent Form",
    description: "Review and accept client consent agreements.",
    // icon: "📝",
    icon: "fa-solid fa-file-signature", // Replaces 📝
    path: "consent",
  },
  {
    title: "Schedule Approval",
    description: "Manage milestone approvals from client & MD.",
    // icon: "📅",
    icon: "fa-solid fa-calendar-check", // Replaces 📅
    path: "schedule",
  },
  {
    title: "Payment Transaction",
    description: "Track actual payment gateway transactions.",
    // icon: "💳",
    icon: "fa-solid fa-credit-card", // Replaces 💳 (or you can use "fa-solid fa-money-check-dollar")
    path: "transaction",
  },

  {
    title: "Client Quotes",
    description: "Get the Quotation that is approved by client",
    // icon: "📄",
    icon: "fa-solid fa-file-invoice-dollar", // Replaces 📄
    path: "quotes",
  },
];

const PaymentConfirmationStage: React.FC = () => {
  const { projectId, organizationId } = useParams<{ projectId: string, organizationId: string }>();
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
  const location = useLocation();
  const navigate = useNavigate();

  const { data, isLoading, isError: getAllError, refetch, 
    // error
   } = useGetPaymentConfirmation(projectId!);
  const { mutateAsync: completeStage, isPending: completePending } = useCompletePaymentConfirmation();
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetPaymentConfirmationDeadline();





  const { role, permission } = useAuthCheck();
  // const canDelete = role === "owner" || permission?.paymentconfirmation?.delete;
  // const canList = role === "owner" || permission?.paymentconfirmation?.list;
  const canCreate = role === "owner" || permission?.paymentconfirmation?.create;
  const canEdit = role === "owner" || permission?.paymentconfirmation?.edit;


  // Hide main page if a sub-stage is open
  if (
    location.pathname.includes("/consent") ||
    location.pathname.includes("/schedule") ||
    location.pathname.includes("/transaction") ||
    location.pathname.includes("/quotes")
  ) {
    return <Outlet />;
  }

  const handleCompletionStatus = async () => {
    try {
      await completeStage({ projectId: projectId! });
      toast({ title: "Success", description: "Completion status updated successfully" });
      refetch();
      navigate('../ordermaterial')

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

  const { assignedTo, timer, totalAmount, _id: formId } = data || {};

  return (
    <div className="container mx-auto max-w-full max-h-full overflow-y-auto bg-brand-surface ">
      {/* Header Section with Mobile Sidebar Toggle */}
      {/* <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6"> */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-8 pb-4 border-b border-ash-light">
        {/* <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center"> */}
        <h2 className="text-2xl sm:text-3xl font-bold text-text-main flex items-center">
          {isMobile && (
            <button
              onClick={openMobileSidebar}
              // className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
              className="mr-3 p-2 rounded-lg border border-ash-medium hover:bg-brand-ash text-text-muted shadow-sm transition-colors"
              title="Open Menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          )}
          <i className="fa-solid fa-sack-dollar mr-2 text-text-muted" /> Payment Confirmation
        </h2>

        <div className="!w-[100%] sm:!w-[80%] lg:w-[50%] flex flex-col sm:flex-row gap-3 justify-end">
          <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-end">
            {(canCreate || canEdit) && <Button
              isLoading={completePending}
              onClick={handleCompletionStatus}
              // className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-initial min-w-max"
              variant="dark"
            >
              <i className="fa-solid fa-circle-check mr-2 text-action-success" />
              Mark Complete
            </Button>}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-end">
            {(canCreate || canEdit) && <ResetStageButton
              stageNumber={7}
              stagePath="paymentconfirmation"
              projectId={projectId!}
              className="flex-1 sm:flex-initial min-w-max"
            // className="flex-1 sm:flex-initial min-w-max border-ash-medium text-text-main"
            />}


            {/* {(!getAllError && (canCreate || canEdit)) && <ShareDocumentWhatsapp
              projectId={projectId!}
              stageNumber="7"
              className="w-full sm:w-fit"
              isStageCompleted={data?.status}
            />} */}

            {(canCreate || canEdit) && <AssignStageStaff
              stageName="PaymentConfirmationModel"
              projectId={projectId!}
              organizationId={organizationId!}
              currentAssignedStaff={assignedTo || null}
              className="flex-1 sm:flex-initial min-w-max"
            />}

            <div className="w-full sm:w-auto flex justify-end sm:block">
              <StageGuide
                organizationId={organizationId!}
                stageName="paymentconfirmation"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display - Doesn't hide header buttons */}
      {getAllError && (


        // <div className="max-w-xl mx-auto p-5 bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center mb-8">
        //   <div className="text-action-danger text-2xl mb-3">
        //     <i className="fa-solid fa-triangle-exclamation"></i>
        //   </div>
        //   <div className="text-text-main font-bold mb-2">
        //     Error Occurred
        //   </div>
        //   <p className="text-text-muted text-sm mb-5">
        //     {(error as any)?.response?.data?.message ||
        //       (error as any)?.message ||
        //       "Failed to load payment confirmation data"}
        //   </p>
        //   <Button
        //     onClick={() => refetch()}
        //     variant="outline"
        //     className="hover:bg-brand-ash hover:text-action-danger hover:border-action-danger text-text-main border-ash-medium"
        //   >
        //     Retry
        //   </Button>
        // </div>

        <div className="max-w-xl mx-auto p-8 bg-brand-surface border-2 border-ash-medium rounded-xl shadow-sm text-center mt-8">

          {/* Soft, neutral icon wrapper instead of a stark warning */}
          <div className="w-16 h-16 bg-brand-surface-hover rounded-full flex items-center justify-center mx-auto mb-4 border border-ash-medium shadow-sm">
            <i className="fa-solid fa-lock text-text-muted text-2xl"></i>
          </div>

          {/* Professional, non-alarming title */}
          <div className="text-text-strong text-lg font-bold mb-2">
            Stage Not Yet Available
          </div>

          {/* Clear explanation of the business logic */}
          <p className="text-text-muted text-sm mb-6 max-w-md mx-auto leading-relaxed">
            {/* {(getAllError as any)?.response?.data?.message} */}
            This section is currently locked. Please ensure all required steps in the previous stage are fully completed before accessing this information.
          </p>

          {/* Neutral action button */}
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-ash-medium text-text-main hover:text-action-primary hover:border-action-primary hover:bg-brand-surface-hover transition-all px-3 shadow-sm"
          >
            <i className="fas fa-sync-alt mr-2 text-text-soft"></i> Refresh
          </Button>

        </div>
      )}

      {/* Show content only when no error */}
      {!getAllError && (
        <>
          {/* Timer Section */}
          {/* <Card className="p-4 mb-6 w-full shadow border-l-4 border-blue-600 bg-white">
            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-blue-500 text-lg" />
              <span>Stage Timings</span>
            </div> */}


          <Card className="p-5 mb-2  lg:col-span-2 shadow-sm  border-2 border-ash-medium rounded-xl bg-brand-surface">
            <div className="flex items-center gap-2 text-text-main text-sm font-bold mb-4 uppercase tracking-wide border-b border-ash-light pb-3">
              <i className="fa-regular fa-clock text-ash-dark text-base" />
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
          {/* <Card className="p-4 mb-6 bg-blue-50 border-l-4 border-blue-600 shadow-md">
            <div className="text-lg font-semibold text-blue-800 flex items-center gap-2">
              <i className="fa-solid fa-wallet" />
              Total Payment Amount
            </div>
            <p className="text-3xl text-blue-700 mt-2 font-bold">
              ₹ {totalAmount?.toLocaleString("en-in") || 0}
            </p>
          </Card> */}

          {/* <Card className="p-6 mb-3 bg-brand-surface border border-ash-medium rounded-xl shadow-sm flex flex-col justify-center"> */}
          <Card className="bg-brand-surface border-2 border-ash-medium  hover:shadow-md transition-all p-5 rounded-xl h-full flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-brand-ash border border-ash-light rounded-lg flex items-center justify-center shrink-0">
                <i className="fa-solid fa-wallet text-text-muted text-lg" />
              </div>
              <h3 className="text-md sm:text-lg  font-bold tracking-wide text-text-muted">Total Payment Amount</h3>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-text-main mt-2 tracking-tight">
              <span className="text-text-muted text-2xl mr-1">₹</span>
              {totalAmount?.toLocaleString("en-in") || 0}
            </p>
          </Card>


          {/* Stage Sections Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {sectionCards.map((card) => (
              <div
                key={card.path}
                onClick={() => navigate(card.path)}
                className="cursor-pointer"
              >
                {/* <Card className="hover:shadow-xl border-l-6 border-blue-600 transition bg-blue-100 p-4 sm:p-6 !rounded-xl h-full flex flex-col justify-between"> */}
                {/* <Card className="bg-brand-surface border border-ash-medium hover:border-text-muted hover:shadow-md transition-all p-5 rounded-xl h-full flex flex-col justify-between shadow-sm"> */}
                <Card className="bg-brand-surface border-[2px] border-ash-medium hover:border-text-muted hover:shadow-md transition-all p-5 rounded-xl h-full flex flex-col justify-between shadow-sm">
                  <div>
                    {/* <div className="text-4xl">{card.icon}</div>
                    <h3 className="text-xl mt-3 font-bold text-blue-800">{card.title}</h3>
                    <p className="text-sm text-blue-700 mt-2">{card.description}</p> */}

                    <div className="w-10 h-10 rounded-lg bg-brand-ash border border-ash-light flex items-center justify-center shadow-sm mb-4">
                      {/* This will now inject 'fa-solid fa-file-signature' etc. */}
                      <i className={`${card.icon} text-text-muted text-lg`}></i>
                    </div>
                    <h3 className="text-lg font-bold text-text-main mb-2">{card.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{card.description}</p>

                  </div>
                  {/* <div className="mt-4 text-right">
                    <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded">
                      Go to {card.title}
                    </span>
                  </div> */}

                  <div className="mt-6 flex items-center justify-between border-t border-ash-light pt-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted group-hover:text-text-main transition-colors">
                      Go to {card.title}
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-ash group-hover:bg-action-primary transition-colors">
                      <i className="fas fa-arrow-right text-ash-dark group-hover:text-text-main text-xs transition-colors"></i>
                    </div>
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