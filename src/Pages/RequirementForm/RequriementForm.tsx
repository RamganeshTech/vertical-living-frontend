// RequirementForm.tsx
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useCreateRoom, useDeleteRequirementUploadFile, useFormCompletion, useGenerateShareableLink, useGetAllRequirementInfo, useSetDeadLineFormRequirement, useUploadRequirementFiles } from "../../apiList/Stage Api/requirementFormApi";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
// import KitchenSection from './PrivateRequrirementComponents/KitchenSection';
// import LivingHallSection from './PrivateRequrirementComponents/LivingHallSection';
// // import BedroomSection from './PrivateRequrirementComponents/BedroomSection';
// import WardrobeSection from './PrivateRequrirementComponents/WardrobeSection';
import React, { useState } from "react";
import { toast } from "../../utils/toast";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import StageTimerInfo from "../../shared/StagetimerInfo";
import RequirementFileUploader from "../../shared/StageFileUploader";
// import useGetRole from "../../Hooks/useGetRole";
import { ResetStageButton } from "../../shared/ResetStageButton";
import MaterialOverviewLoading from "../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import ClientInfoCard from "./components/ClientInfoCard";
import SectionCards from "./components/SectionCards";
import AssignStageStaff from "../../shared/AssignStaff";
import type { ProjectDetailsOutlet } from "../../types/types";
// import ShareDocumentWhatsapp from "../../shared/ShareDocumentWhatsapp";
import { useAuthCheck } from "../../Hooks/useAuthCheck";
import StageGuide from "../../shared/StageGuide";

export type PrivateRequriementFromProp = {
  data: any,
  isEditable: any,
  setVisibleSection: React.Dispatch<React.SetStateAction<string | null>>
  sectionName: string
}




// export function CreateRoomModal({
//   open,
//   onClose,
//   onSubmit,
//   isLoading,
// }: {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (roomName: string) => void;
//   isLoading: boolean;
// }) {
//   const [roomName, setRoomName] = React.useState("");

//   React.useEffect(() => {
//     if (!open) setRoomName("");
//   }, [open]);

//   if (!open) return null;

//   return (
//     <div
//       className="fixed top-0 left-0 w-full h-screen  bg-black/70 bg-opacity-40 flex justify-center items-center z-50"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-lg p-6 max-w-sm w-full"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h3 className="text-xl font-semibold mb-4">Create New Room</h3>
//         <input
//           type="text"
//           placeholder="Enter Room Name"
//           className="w-full p-2 border border-gray-300 rounded mb-4"
//           value={roomName}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               onSubmit(roomName)
//             }
//           }}
//           autoFocus
//           onChange={(e) => setRoomName(e.target.value)}
//         />
//         <div className="flex justify-end gap-2">
//           <Button
//             className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-400"
//             onClick={onClose}
//             disabled={isLoading}
//           >
//             Cancel
//           </Button>
//           <Button
//             className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
//             onClick={() => onSubmit(roomName)}
//             disabled={!roomName.trim() || isLoading}
//           >
//             {isLoading ? "Creating..." : "Create"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


export function CreateRoomModal({
  open,
  onClose,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (roomName: string) => void;
  isLoading: boolean;
}) {
  const [roomName, setRoomName] = React.useState("");

  React.useEffect(() => {
    if (!open) setRoomName("");
  }, [open]);

  // 2. Add Escape key listener
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup the listener when modal closes or unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-brand-main/90 backdrop-blur-sm flex justify-center items-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-brand-surface rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-ash-medium"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-ash-medium flex justify-between items-center bg-brand-ash">
          <h2 className="text-lg font-bold text-text-main">Create New Room</h2>
          <button
            onClick={onClose}
            // className="text-gray-400 hover:text-gray-600 transition-colors"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-surface border border-ash-medium text-text-muted hover:text-text-main hover:bg-brand-ash transition-all shadow-sm"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5"> */}
          <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted block mb-1.5">
            Room Name
          </label>
          <input
            type="text"
            placeholder="e.g., Master Bedroom"
            // className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all text-gray-800 text-sm outline-none"
            className="w-full px-3 py-2.5 bg-brand-surface border border-ash-medium rounded-lg focus:ring-2 focus:ring-ash-medium focus:outline-none transition-all text-text-main font-bold text-sm shadow-sm placeholder:text-text-muted placeholder:font-normal"
            value={roomName}
            onKeyDown={(e) => {
              if (e.key === "Enter" && roomName.trim() && !isLoading) {
                onSubmit(roomName);
              }
            }}
            autoFocus
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-brand-ash border-t border-ash-medium flex justify-end gap-3">
          <Button
            variant="white"
            onClick={onClose}
            disabled={isLoading}
            // className="px-5 border border-gray-200 bg-white shadow-sm"
            className="px-5 border-ash-medium text-text-main shadow-sm"
          >
            Cancel
          </Button>
          <Button
            variant="dark"
            onClick={() => onSubmit(roomName)}
            disabled={!roomName.trim() || isLoading}
            isLoading={isLoading}
            className="px-6"
          >
            Create Room
          </Button>
        </div>
      </div>
    </div>
  );
}


export default function RequirementForm() {
  const { projectId, organizationId } = useParams() as { projectId: string; organizationId: string };
  // const { role } = useGetRole()
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>()

  const navigate = useNavigate()

  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)

  const { data: formData, isLoading, error, refetch } = useGetAllRequirementInfo({ projectId: projectId! });
  const { mutateAsync: linkgenerate, isPending: linkPending, } = useGenerateShareableLink()
  const { mutateAsync: completeFormMutate, isPending: completePending, } = useFormCompletion()
  // const { mutateAsync: lockFormMutate, isPending: lockPending,  } = useLockUpdationOfForm()

  const { mutateAsync: deadLineMutate, isPending: deadLinePending, } = useSetDeadLineFormRequirement()
  const { mutateAsync: uploadFilesMutate, isPending: uploadPending } = useUploadRequirementFiles();
  // const { mutateAsync: deleteFormMutate, isPending: deleteFormPending } = useDeleteRequriementForm();
  const { mutateAsync: deleteUploadFile, isPending: deleteUploadPending } = useDeleteRequirementUploadFile()

  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);

  const { mutateAsync: createRoom, isPending: roomPending } = useCreateRoom();


  const { role, permission } = useAuthCheck();
  // const canDelete = role === "owner" || permission?.clientrequirement?.delete;
  const canList = role === "owner" || permission?.clientrequirement?.list;
  const canCreate = role === "owner" || permission?.clientrequirement?.create;
  const canEdit = role === "owner" || permission?.clientrequirement?.edit;


  // Handler to submit new room creation
  const handleCreateRoomSubmit = async (roomName: string) => {
    if (!projectId) return;
    try {
      await createRoom({ projectId, payload: { roomName } });
      toast({ title: "Success", description: "Room created successfully" });
      setIsCreateRoomOpen(false);
      refetch(); // refresh form data to include new room
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to create room",
        variant: "destructive",
      });
    }
  };


  if (isLoading) return <MaterialOverviewLoading />;

  // const client = formData?.clientData;

  // const handleFormDeletion = async () => {
  //   if (!window.confirm(`Are you sure you want to delete this form?`)) return
  //   try {
  //     if (!deleteFormPending) {
  //       await deleteFormMutate({ projectId: projectId! })
  //       toast({ title: "Success", description: "Form deleted  successfully" })
  //     }
  //   } catch (error: any) {
  //     toast({ title: "Error", description: error?.response?.data?.message || "Failed to delete the form", variant: "destructive" })
  //   }
  // }

  const handleFormCompletion = async () => {
    try {
      if (!completePending) {
        await completeFormMutate({ formId: formData._id, projectId })
        toast({ title: "Success", description: "completion updated successfully" })
        navigate(`../sitemeasurement`)
      }
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to update to complete the form", variant: "destructive" })
    }
  }

  // const handleLockForm = async () => {
  //   try {
  //     if (!lockPending) {
  //       await lockFormMutate({ formId: formData._id!, projectId })
  //       toast({ title: "Success", description: "form updation locked successfully" })
  //     }
  //   } catch (error: any) {
  //     toast({ title: "Error", description: error?.response?.data?.message || "Failed to lock the updation", variant: "destructive" })
  //   }
  // }

  const handleCopyStaticLink = async (link: string) => {
    try {
      const allowedRoles = ["owner", "staff", "CTO"]
      if (!role) throw new Error("Not Authorized")
      if (!allowedRoles.includes(role)) throw new Error("Dont have the access")
      await navigator.clipboard.writeText(link)
      setCopied(true)
      toast({ title: "Success", description: "Link copied to clipboard" })
      setTimeout(() => setCopied(false), 4000)
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to copy link", variant: "destructive" })
    }
  }

  const handleGenerateInviteLink = async () => {
    try {
      const response = await linkgenerate({ projectId: projectId! })
      setInviteLink(response.inviteLink || response)
      toast({ title: "Success", description: "Invitation link generated successfully" })
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to generate invitation link", variant: "destructive" })
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      toast({ title: "Success", description: "Link copied to clipboard" })
      setTimeout(() => setCopied(false), 2000)
    } catch (_error) {
      toast({ title: "Error", description: "Failed to copy link", variant: "destructive" })
    }
  }

  const handleShareWhatsApp = () => {
    const message = `You're requested to fill the form, Click this link to fill the form: ${inviteLink}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }


  // console.log("data", formData.rooms)




  const isChild = location.pathname.includes("roompage")

  if (isChild) {
    return <Outlet />
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-brand-surface">

      <div className="h-full w-full space-y-4">
        {/* Header Section */}
        <div className="border-b border-ash-light flex flex-col w-full sm:flex-row justify-between sm:items-center items-start gap-4">
          <div className="">
            {/* <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center"> */}
            <h2 className="text-2xl font-bold text-text-main flex items-center">

              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  // className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  className="mr-3 p-2 rounded-lg border border-ash-medium hover:bg-brand-ash text-text-muted shadow-sm transition-colors"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}

              {/* <i className="fa-solid fa-pencil mr-2"></i> Client Requirement */}

              <div className="w-10 h-10 bg-brand-surface border border-ash-medium rounded-lg flex items-center justify-center shadow-sm mr-3">
                <i className="fa-solid fa-pencil text-text-muted text-lg"></i>
              </div>
              <span className="leading-tight">Client Requirement</span>
            </h2>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2  !w-[100%] sm:!w-[50%] lg:!w-[60%] justify-end lg:justify-end">
            {/* <Button onClick={handleLockForm} className="bg-yellow-100 hover:bg-yellow-100 border-yellow-400 text-yellow-800 w-full sm:w-auto">
                <i className="fa-solid fa-lock"></i>
              </Button> */}
            {(canCreate || canEdit) && <Button
              isLoading={completePending}
              onClick={handleFormCompletion}
              //   className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              // >
              //   <i className="fa-solid fa-circle-check mr-2"></i>
              //   Mark as Complete


              // className="bg-gray-800 hover:bg-gray-900 text-white w-full sm:w-auto shadow-sm transition-colors"
              variant="dark"
              className="flex-1 sm:flex-none px-6 shadow-sm min-w-max"
            >
              <i className="fa-regular fa-circle-check mr-2 text-action-success"></i>
              Mark as Complete
            </Button>}

            {/* <Button
                onClick={handleFormDeletion}
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
              >
                <i className="fa-solid fa-trash-can"></i>
              </Button> */}

            {(canCreate || canEdit) && <ResetStageButton
              projectId={projectId!}
              stageNumber={1}
              stagePath="requirementform"
              className="sm:!max-w-[20%] w-full"
            />}

            {/* {(!error && (canCreate || canEdit)) && <ShareDocumentWhatsapp
              projectId={projectId}
              stageNumber="1"
              className="w-full sm:w-fit"
              isStageCompleted={formData?.status}
            />} */}

            {(canCreate || canEdit) && <AssignStageStaff
              stageName="RequirementFormModel"
              projectId={projectId}
              organizationId={organizationId}
              currentAssignedStaff={formData?.assignedTo || null}
              // className="!w-[100%]"
              className="w-full sm:w-auto"
            />}

            <div className="w-full sm:w-auto flex justify-end sm:block">
              <StageGuide
                organizationId={organizationId}
                stageName="clientrequirement"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-xl mx-auto p-6 bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center mt-8">
            <div className="text-action-danger text-3xl mb-3">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div className="text-text-main text-lg font-bold mb-2">Error Occurred</div>
            <p className="text-text-muted text-sm mb-5">
              {(error as any)?.response?.data?.message || "Failed to load requirement data"}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="border-ash-medium text-text-main hover:text-action-danger hover:border-action-danger hover:bg-brand-ash transition-all px-6 shadow-sm"
            >
              Retry
            </Button>
          </div>
        )}


        {!error && <main className="h-[calc(100vh-90px)] overflow-y-auto custom-scrollbar space-y-6">
          {/* Timer Section */}
          {/* <Card className="p-4 w-full shadow border-l-4 border-blue-600 bg-white"> */}
          {/* <Card className="p-5 w-full bg-white shadow-sm border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
              <span>Stage Timings</span>
            </div> */}

          <Card className="p-4 shadow-sm border-2 border-ash-medium rounded-xl bg-brand-surface w-full">
            <div className="flex items-center gap-2 text-text-main text-sm font-bold mb-4 uppercase tracking-wide border-b border-ash-light pb-3">
              <i className="fa-regular fa-clock text-ash-dark text-base"></i>
              <span>Stage Timings</span>
            </div>
            <StageTimerInfo
              startedAt={formData?.timer?.startedAt}
              projectId={projectId!}
              stageName="requirementform"
              refetchStageMutate={refetch}
              completedAt={formData?.timer?.completedAt}
              deadLine={formData?.timer?.deadLine}
              formId={formData?._id}
              deadLineMutate={deadLineMutate}
              isPending={deadLinePending}
            />
          </Card>

          {/* Client Info & Uploads */}
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            <ClientInfoCard projectId={projectId} className="w-[100%] md:w-[50%]" client={formData?.clientData} />

            {/* {canList && <Card className="p-4 w-[100%] md:w-[50%] shadow border-l-4 border-blue-500 bg-white"> */}
            {canList && <Card className="p-4 w-[100%] md:w-[50%] shadow border-2 border-gray-200 rounded-xl bg-white">
              <RequirementFileUploader
                enableUpload={canEdit || canCreate}

                formId={formData?._id}
                existingUploads={formData?.uploads}
                onUploadComplete={refetch}
                uploadFilesMutate={uploadFilesMutate}
                uploadPending={uploadPending}
                projectId={projectId}
                refetch={refetch}
                onDeleteUpload={deleteUploadFile}
                deleteFilePending={deleteUploadPending}
              />
            </Card>}
          </div>

          {/* Create Room Modal */}
          <CreateRoomModal
            open={isCreateRoomOpen}
            onClose={() => setIsCreateRoomOpen(false)}
            onSubmit={handleCreateRoomSubmit}
            isLoading={roomPending}
          />


          {/* Section Cards */}
          <SectionCards
            sections={formData?.rooms}
            setIsCreateRoomOpen={setIsCreateRoomOpen}
          />

          {/* Form Link Section */}
          <div className="pb-6">
            {!formData?.shareToken ? (
              // <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg space-y-4">
              //   <h2 className="text-lg sm:text-xl font-bold text-blue-900 flex items-center">
              //     <i className="fas fa-link mr-2" /> Generate Form Link
              //   </h2>

              <div className="bg-brand-surface p-5 sm:p-6 rounded-xl border border-ash-medium shadow-sm space-y-4">
                <h2 className="text-base font-bold text-text-main flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-brand-ash border border-ash-light flex items-center justify-center mr-3 shadow-sm">
                    <i className="fas fa-link text-text-muted" />
                  </div>
                  Generate Form Link
                </h2>
                <p className="text-sm text-text-muted font-medium">
                  Request the client to fill the requirement form by generating the link.
                </p>
                {(!inviteLink && (canCreate || canEdit)) ? (
                  <Button
                    onClick={handleGenerateInviteLink}
                    isLoading={linkPending}
                    // className="w-full bg-blue-600 text-white py-2.5 sm:py-3"
                    variant="dark"
                    className="w-full sm:w-auto px-6 shadow-sm mt-2"
                  >
                    <i className="fas fa-link mr-2" /> Generate Form Link
                  </Button>
                ) : (
                  <div className="space-y-4">
                    {/* <Label>Form Link</Label> */}
                    <Label className=" font-bold text-text-muted uppercase tracking-wider block mb-1">Generated Link</Label>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <Input
                        value={inviteLink}
                        readOnly
                        // className="bg-blue-50 text-blue-800 flex-1"
                        // className="bg-gray-50 border border-gray-200 text-gray-700 flex-1 focus:ring-0 shadow-sm"
                        className="bg-brand-ash border border-ash-medium text-text-main flex-1 focus:ring-0 shadow-sm"
                      />
                      <Button
                        onClick={handleCopyLink}
                        // className="w-full sm:w-auto"
                        // className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white shadow-sm transition-colors px-4"
                        variant="white"
                        className="w-full sm:w-auto border-ash-medium text-text-main shadow-sm transition-colors px-4 flex-1 sm:flex-none"
                      >
                        <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={handleShareWhatsApp}
                        // className="w-full sm:w-auto bg-green-600 text-white"
                        // className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-all"
                        variant="white"
                        className="w-full sm:w-auto border-ash-medium text-text-main shadow-sm transition-all flex-1 sm:flex-none"
                      >
                        {/* <i className="fab fa-whatsapp mr-2" /> Share on WhatsApp */}
                        {/* <i className="fab fa-whatsapp text-emerald-500 text-base mr-2" /> Share on WhatsApp */}
                        <i className="fab fa-whatsapp text-emerald-500 text-lg sm:mr-2" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </Button>
                      <Button
                        onClick={handleCopyLink}
                        // className="w-full sm:w-auto border border-blue-400 text-blue-700"
                        className="w-full sm:w-auto bg-brand-surface border border-ash-light text-text-muted hover:bg-brand-surface hover:text-text-main shadow-sm transition-all"
                      >
                        <i className="fas fa-copy mr-2" /> Copy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-brand-surface space-y-4">
                {/* <Label>Form Link</Label> */}
                {/* <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Form Link</Label> */}
                <Label className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                  <i className="fa-solid fa-link text-text-muted"></i> Active Form Link
                </Label>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Input
                    value={formData?.shareToken}
                    readOnly
                    // className="bg-blue-50 text-blue-800 flex-1"
                    // className="bg-slate-50 border border-slate-200 text-slate-700 flex-1 focus:ring-0"
                    // className="bg-gray-50 border border-gray-200 text-gray-700 flex-1 focus:ring-0 shadow-sm"
                    className="bg-brand-ash border border-ash-medium text-text-main flex-1 focus:ring-0 shadow-sm"
                  />
                  <Button
                    onClick={() => handleCopyStaticLink(formData?.shareToken)}
                    // className="w-full sm:w-auto"
                    // className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white shadow-sm transition-colors px-4"
                    variant="dark"
                    className="w-full sm:w-auto shadow-sm px-6"

                  >
                    {/* <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} /> */}
                    <i className={`fas ${copied ? 'fa-check text-action-success' : 'fa-copy'} mr-2`} />
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>}
      </div>
    </div>
  );
}