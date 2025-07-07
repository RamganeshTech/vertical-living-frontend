import { useParams } from "react-router-dom";
import { useDeleteRequirementUploadFile, useDeleteRequriementForm, useFormCompletion, useGenerateShareableLink, useGetFormRequriemetn, useLockUpdationOfForm, useSetDeadLineFormRequirement, useUploadRequirementFiles } from "../../apiList/Stage Api/requirementFormApi";
import { Card } from "../../components/ui/Card";
import { Separator } from "../../components/ui/Seperator";
import { Button } from "../../components/ui/Button";
import KitchenSection from './PrivateRequrirementComponents/KitchenSection';
import LivingHallSection from './PrivateRequrirementComponents/LivingHallSection';
import BedroomSection from './PrivateRequrirementComponents/BedroomSection';
import WardrobeSection from './PrivateRequrirementComponents/WardrobeSection';
import React, { useState } from "react";
import { toast } from "../../utils/toast";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import StageTimerInfo from "../../shared/StagetimerInfo";
import RequirementFileUploader from "../../shared/StageFileUploader";
import useGetRole from "../../Hooks/useGetRole";
import { ResetStageButton } from "../../shared/ResetStageButton";
import MaterialOverviewLoading from "../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import ClientInfoCard from "./components/ClientInfoCard";
import SectionCards from "./components/SectionCards";
import AssignStageStaff from "../../shared/AssignStaff";


export type PrivateRequriementFromProp = {
  data: any,
  isEditable: any,
  setVisibleSection: React.Dispatch<React.SetStateAction<string | null>>
}


const SectionConfig = [
  {
    Component: BedroomSection,
    icon: "fa-solid fa-bed",
    label: "Bedroom Section",
    key: "bedroom"
  },
  {
    Component: KitchenSection,
    icon: "fa-solid fa-kitchen-set",
    label: "Kitchen Section",
    key: "kitchen"
  },
  {
    Component: LivingHallSection,
    icon: "fa-solid fa-house",
    label: "Living Hall Section",
    key: "livingHall"
  },
  {
    Component: WardrobeSection,
    icon: "fa-solid fa-shirt",
    label: "Wardrobe Section",
    key: "wardrobe"
  }
]

export default function RequirementForm() {
  const { projectId , organizationId} = useParams() as { projectId: string; organizationId:string};
  const { role } = useGetRole()

  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [visibleSection, setVisibleSection] = useState<string | null>(null);

  const { data: formData, isLoading, isError, error, refetch } = useGetFormRequriemetn({ projectId: projectId! });
  const { mutateAsync: linkgenerate, isPending: linkPending, isError: linkIsError, error: linkError, reset: linkReset } = useGenerateShareableLink()
  const { mutateAsync: completeFormMutate, isPending: completePending, isError: completeIsError, error: completeError, reset: completeReset } = useFormCompletion()
  const { mutateAsync: lockFormMutate, isPending: lockPending, isError: lockIsError, error: lockError, reset: lockReset } = useLockUpdationOfForm()

  const { mutateAsync: deadLineMutate, isPending: deadLinePending, isError: deadLineIsError, error: deadLineError, reset: deadLineReset } = useSetDeadLineFormRequirement()
  const { mutateAsync: uploadFilesMutate, isPending: uploadPending } = useUploadRequirementFiles();
  const { mutateAsync: deleteFormMutate, isPending: deleteFormPending } = useDeleteRequriementForm();
 const { mutateAsync: deleteUploadFile, isPending: deleteUploadPending } = useDeleteRequirementUploadFile()

  if (isLoading) return <MaterialOverviewLoading />;
  // if (isError || !formData) return <div className="p-8">{(error as any).response?.data.message || "Failed to fetch form data."}</div>;

  const client = formData?.clientData;

  const handleFormDeletion = async () => {
    if (!window.confirm(`Are you sure you want to delete this form?`)) return
    try {
      if (!deleteFormPending) {
        await deleteFormMutate({ projectId: projectId! })
        toast({ title: "Success", description: "Form deleted  successfully" })
      }
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to delete the form", variant: "destructive" })
    }
  }


  const handleFormCompletion = async () => {
    if (!window.confirm("Are you sure want to mark it as completed?")) return
    try {
      if (!completePending) {
        await completeFormMutate({ formId: formData._id, projectId })
        toast({ title: "Success", description: "completion updated successfully" })
      }
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to update to complete the form", variant: "destructive" })
    }
  }

  const handleLockForm = async () => {
    try {
      if (!lockPending) {
        await lockFormMutate({ formId: formData._id!, projectId })
        toast({ title: "Success", description: "form updation locked successfully" })
      }
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to lock the updation", variant: "destructive" })
    }
  }

  const handleCopyStaticLink = async (link: string) => {

    try {
      const allowedRoles = ["owner", "staff", "CTO"]
      if (!role) throw new Error("Not Authorized")
      console.log(role, role, role)
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
    } catch (error) {
      toast({ title: "Error", description: "Failed to copy link", variant: "destructive" })
    }
  }

  const handleShareWhatsApp = () => {
    const message = `You're requeted to fill the form, Click this link to fill the form: ${inviteLink}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  console.log("staff assigned", formData.assignedTo
)

  return (
    <>
      {visibleSection ? (
        <>
          {SectionConfig.map(({ Component, key }) => (
            visibleSection === key ? (
              <div key={key} className="pt-6">
                <Component
                  data={formData[key]}
                  isEditable={formData.isEditable}
                  setVisibleSection={setVisibleSection}
                />
              </div>
            ) : null
          ))}
        </>
      ) : (
        <div className="h-full space-y-4 p-2">

          <div className='flex justify-between w-full items-center '>
            <div>
              <h2 className="text-3xl font-semibold text-blue-600 mb-3 flex items-center">
                <i className="fa-solid fa-pencil mr-2"></i>Client Requriement
              </h2>
            </div>


            <div className="flex gap-3">
              {/* <Button onClick={handleLockForm} className="bg-yellow-100 hover:bg-yellow-100  border-yellow-400 text-yellow-800 w-full sm:w-auto">
                <i className="fa-solid fa-lock"></i>
              </Button> */}
              <Button onClick={handleFormCompletion} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                <i className="fa-solid fa-circle-check mr-2"></i>
                Mark as Complete
              </Button>
              <Button onClick={handleFormDeletion} className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto">
                <i className="fa-solid fa-trash-can"></i>
                
              </Button>

              <ResetStageButton projectId={projectId!} stageNumber={1} stagePath="requirementform" />

              <AssignStageStaff
                stageName="RequirementFormModel"
                projectId={projectId}
                organizationId={organizationId}
                currentAssignedStaff={formData?.assignedTo || null}
              />

            </div>
          </div>

          <main className="max-h-[90%] space-y-4 overflow-y-auto">
            {/* 1. Timer Section */}
            <Card className="p-4  w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
              <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
                <span>Stage Timings</span>
              </div>

              {/* Keep content within this, it will now handle horizontal layout */}
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


            {/* 2. Client Info & Uploads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClientInfoCard client={formData?.clientData} />

              <div className="">
                <Card className="p-4 shadow border-l-4 border-blue-500 bg-white">
                  <RequirementFileUploader
                    formId={formData._id}
                    existingUploads={formData.uploads}
                    onUploadComplete={refetch}
                    uploadFilesMutate={uploadFilesMutate}
                    uploadPending={uploadPending}
                    projectId={projectId}
                    onDeleteUpload={deleteUploadFile}
                    deleteFilePending={deleteUploadPending}
                  />
                </Card>
              </div>
            </div>

            {/* 3. Section Config Cards */}
            <SectionCards sections={SectionConfig} setVisibleSection={setVisibleSection} />

            {/* 4. Form Link Section */}
            <div className="pt-6">
              {!formData.projectId ? (
                <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
                  <h2 className="text-xl font-bold text-blue-900 flex items-center">
                    <i className="fas fa-link mr-2" /> Generate Form Link
                  </h2>
                  <p className="text-sm text-gray-600">
                    Request to fill the form by generating a link.
                  </p>
                  {!inviteLink ? (
                    <Button
                      onClick={handleGenerateInviteLink}
                      isLoading={linkPending}
                      className="w-full bg-blue-600 text-white py-3"
                    >
                      <i className="fas fa-link mr-2" /> Generate Form Link
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Label>Form Link</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={inviteLink}
                          readOnly
                          className="bg-blue-50 text-blue-800 flex-1"
                        />
                        <Button onClick={handleCopyLink}>
                          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
                        </Button>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleShareWhatsApp} className="w-full bg-green-600 text-white">
                          <i className="fab fa-whatsapp mr-2" /> Share on WhatsApp
                        </Button>
                        <Button onClick={handleCopyLink} className="w-full border border-blue-400 text-blue-700">
                          <i className="fas fa-copy mr-2" /> Copy
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Label>Form Link</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`http://localhost:5173/requirementform/${projectId}/token=${formData?.shareToken}`}
                      readOnly
                      className="bg-blue-50 text-blue-800 flex-1"
                    />
                    <Button onClick={() => handleCopyStaticLink(`http://localhost:5173/requirementform/${projectId}/token=${formData?.shareToken}`)}>
                      <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </>
  );
}