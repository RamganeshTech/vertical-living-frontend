import type React from "react"
import { useState } from "react"
// import { ToastContainer } from "./components/toast-container"
import { useGetAllPreRequireties, useUpdatePreRequiretyBoolean, useUpdatePreRequiretyNotes } from './../../apiList/preqRequiretiesApi.ts/preRequiretiesApi';
import { toast } from "../../utils/toast";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import type { ProjectDetailsOutlet } from "../../types/types";
import { Button } from "../../components/ui/Button";
import { useAuthCheck } from "../../Hooks/useAuthCheck";
import StageGuide from "../../shared/StageGuide";

interface PrerequisitesSectionProps {
    title: string
    section: string
    isRequired: boolean
    notes: string
    formId: string
    onUpdate: () => void
}

const PrerequisitesSection: React.FC<PrerequisitesSectionProps> = ({
    title,
    section,
    isRequired,
    notes,
    formId,
    onUpdate,
}) => {


    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.prerequisites?.delete;
    // const canList = role === "owner" || permission?.prerequisites?.list;
    const canCreate = role === "owner" || permission?.prerequisites?.create;
    const canEdit = role === "owner" || permission?.prerequisites?.edit;



    const [isOpen, setIsOpen] = useState(false)
    const [localNotes, setLocalNotes] = useState(notes)
    const [isUpdatingNotes, setIsUpdatingNotes] = useState(false)

    //   const { toast } = useToast()
    const updateBooleanMutation = useUpdatePreRequiretyBoolean()
    const updateNotesMutation = useUpdatePreRequiretyNotes()

    const handleBooleanToggle = async (checked: boolean) => {
        try {
            await updateBooleanMutation.mutateAsync({
                id: formId,

                section,
                isRequired: checked,
            })

            toast({
                title: "Success",
                description: `${title} requirement updated successfully`,
            })
            onUpdate()
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update requirement",
                variant: "destructive",
            })
        }
    }

    const handleNotesUpdate = async () => {
        if (localNotes === notes) return

        setIsUpdatingNotes(true)
        try {
            await updateNotesMutation.mutateAsync({
                id: formId,

                section,
                notes: localNotes,
            })

            toast({
                title: "Success",
                description: `${title} notes updated successfully`,
            })
            onUpdate()
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update notes",
                variant: "destructive",
            })
            setLocalNotes(notes) // Reset to original value on error
        } finally {
            setIsUpdatingNotes(false)
        }
    }

    const handleNotesBlur = () => {
        handleNotesUpdate()
    }

    const handleNotesKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.ctrlKey) {
            handleNotesUpdate()
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
            {/* Header */}
            <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <i className={`fas ${isOpen ? "fa-chevron-down" : "fa-chevron-right"} text-gray-400`}></i>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-gray-500">Status:</span>
                                {isRequired ? (
                                    // <span className="flex items-center text-green-600 text-sm">
                                    <span className="flex items-center  text-xs font-semibold">
                                        <i className="fas fa-check-circle text-emerald-500 mr-1"></i>
                                        Required
                                    </span>
                                ) : (
                                    // <span className="flex items-center text-gray-500 text-sm">
                                    <span className="flex items-center text-gray-400 text-xs font-semibold">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        Not Required
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {(canCreate || canEdit) && <div className="flex items-center space-x-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isRequired}
                                onChange={(e) => {
                                    e.stopPropagation()
                                    handleBooleanToggle(e.target.checked)
                                }}
                                disabled={updateBooleanMutation.isPending}
                                className="sr-only"
                            />
                            <div
                                // className={`w-11 h-6 rounded-full transition-colors ${isRequired ? "bg-blue-600" : "bg-gray-200"
                                className={`w-10 h-5 rounded-full transition-colors ${isRequired ? "bg-gray-800" : "bg-gray-200"
                                    } ${updateBooleanMutation.isPending ? "opacity-50" : ""}`}
                            >
                                <div
                                    // className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${isRequired ? "translate-x-5" : "translate-x-0"
                                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${isRequired ? "translate-x-5" : "translate-x-0.5"
                                        } mt-0.5 ml-0.5`}
                                ></div>
                            </div>
                        </label>
                        {updateBooleanMutation.isPending && <i className="fas fa-spinner fa-spin text-gray-400"></i>}
                    </div>}
                </div>
            </div>

            {/* Collapsible Content */}
            {isOpen && (
                // <div className="p-4">
                <div className="p-4 sm:p-5 bg-gray-50/30">
                    <div className="space-y-4">
                        {/* {(canCreate || canEdit) && <div className="flex items-center space-x-2"> */}
                        {(canCreate || canEdit) && <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm w-fit">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isRequired}
                                    onChange={(e) => handleBooleanToggle(e.target.checked)}
                                    disabled={updateBooleanMutation.isPending}
                                    className="sr-only"
                                />
                                <div
                                    // className={`w-11 h-6 rounded-full transition-colors ${isRequired ? "bg-blue-600" : "bg-gray-200"
                                    className={`w-10 h-5 rounded-full transition-colors ${isRequired ? "bg-gray-800" : "bg-gray-200"
                                        } ${updateBooleanMutation.isPending ? "opacity-50" : ""}`}
                                >
                                    <div
                                        // className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${isRequired ? "translate-x-5" : "translate-x-0"
                                        className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${isRequired ? "translate-x-5" : "translate-x-0.5"
                                            } mt-0.5 ml-0.5`}
                                    ></div>
                                </div>
                            </label>
                            <label className="text-sm font-medium text-gray-700 cursor-pointer">This work is required for the project</label>
                        </div>}

                        {(canCreate || canEdit) && <div className="space-y-2">
                            {/* <label className="text-sm font-medium text-gray-700">Notes & Additional Details</label> */}
                            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Notes & Additional Details</label>
                            <div className="relative">
                                <textarea
                                    placeholder={`Add notes about ${title.toLowerCase()}...`}
                                    value={localNotes}
                                    onChange={(e) => setLocalNotes(e.target.value)}
                                    onBlur={handleNotesBlur}
                                    onKeyDown={handleNotesKeyDown}
                                    // className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    className="w-full min-h-[100px] p-3 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white outline-none transition-all text-sm text-gray-800 shadow-sm"
                                    disabled={isUpdatingNotes}
                                />
                                {isUpdatingNotes && (
                                    // <div className="absolute top-2 right-2">
                                    //     <i className="fas fa-spinner fa-spin text-gray-400"></i>
                                    // </div>
                                    <div className="absolute top-3 right-3 bg-white/80 rounded-full w-6 h-6 flex items-center justify-center">
                                        <i className="fas fa-circle-notch fa-spin text-gray-400 text-sm"></i>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">Press Ctrl+Enter to save or click outside the text area</p>
                        </div>}
                    </div>
                </div>
            )}
        </div>
    )
}

const PrerequisitesPage: React.FC = () => {

    const { projectId, organizationId } = useParams() as { projectId: string, organizationId: string }
    const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>()

    //   const { toast } = useToast()
    const { data, isLoading, error, refetch } = useGetAllPreRequireties(projectId)
    const navigate = useNavigate()


    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.prerequisites?.delete;
    // const canList = role === "owner" || permission?.prerequisites?.list;
    const canCreate = role === "owner" || permission?.prerequisites?.create;
    const canEdit = role === "owner" || permission?.prerequisites?.edit;


    const workTypes = [
        { key: "modularWork", title: "Modular Work", description: "Prefabricated components and modular construction", _id: data?.data?._id },
        { key: "electricalWork", title: "Electrical Work", description: "Wiring, fixtures, and electrical installations", _id: data?.data?._id },
        { key: "plumbingWork", title: "Plumbing Work", dzescription: "Water supply, drainage, and plumbing fixtures", _id: data?.data?._id },
        { key: "civilWork", title: "Civil Work", description: "Structural work, foundations, and civil engineering", _id: data?.data?._id },
        {
            key: "decorationWork",
            title: "Decoration Work",
            description: "Interior design, painting, and finishing touches",
            _id: data?.data?._id
        },
        { key: "carpentryWork", title: "Carpentry Work", description: "Woodwork including doors, windows, furniture, partitions, and fittings", _id: data?.data?._id },
    ]

    const handleUpdate = () => {
        refetch()
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center space-y-4">
                    {/* <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i> */}
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 mx-auto"></div>
                    <p className="text-gray-600">Loading project prerequisites...</p>
                </div>
            </div>
        )
    }

    if (error) {
        // return (
        //     <div className="container mx-auto px-4 py-8 max-w-4xl">
        //         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        //             <div className="flex items-center">
        //                 <i className="fas fa-exclamation-circle text-red-600 mr-2"></i>
        //                 <p className="text-red-800">{error instanceof Error ? error.message : "Failed to load prerequisites"}</p>
        //             </div>
        //         </div>
        //         <div className="mt-4 text-center">
        //             <button
        //                 onClick={() => refetch()}
        //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        //             >
        //                 Try Again
        //             </button>
        //         </div>
        //     </div>
        // )


        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white border border-red-200 rounded-xl p-6 text-center shadow-sm">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-exclamation-triangle text-red-500 text-lg"></i>
                    </div>
                    <h3 className="text-gray-800 font-bold mb-2">Failed to load data</h3>
                    <p className="text-gray-500 text-sm mb-5">{error instanceof Error ? error.message : "Failed to load prerequisites"}</p>
                    <Button variant="outline" onClick={() => refetch()} className="bg-white border-gray-200 hover:bg-gray-50">
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    if (!data?.data) {
        return (
           

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white border border-yellow-200 rounded-xl p-6 text-center shadow-sm">
                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-exclamation-circle text-yellow-600 text-lg"></i>
                    </div>
                    <h3 className="text-gray-800 font-bold mb-2">No Data Found</h3>
                    <p className="text-gray-500 text-sm mb-5">
                        No prerequisites data found for this project. Please ensure the project exists and try again.
                    </p>
                    <Button variant="outline" onClick={() => refetch()} className="bg-white border-gray-200 hover:bg-gray-50">
                        Refresh
                    </Button>
                </div>
            </div>
        )
    }

    const prerequisites = data.data

    return (
        <>
            {/* <div className="max-h-full overflow-y-auto mx-auto px-4  custom-scrollbar"> */}
            <div className="max-h-full overflow-y-auto mx-auto px-4 sm:px-6 py-6 custom-scrollbar ">
                <div className="space-y-6">
                   


                    <header className="flex justify-between items-center mb-2 pb-2  border-b border-gray-100 gap-4">

                        {/* --- Left Side: Content --- */}
                        <div className="flex-1">

                            {/* Mobile View: Hamburger + Title */}
                            <div className="flex items-center sm:hidden">
                                {isMobile && (
                                    <button
                                        onClick={openMobileSidebar}
                                        className="mr-3 p-2 h-10 w-10 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                        title="Open Menu"
                                    >
                                        <i className="fa-solid fa-bars text-lg"></i>
                                    </button>
                                )}
                                {/* <h1 className="text-xl font-bold text-gray-800 leading-tight">
                                    Project Prerequisites
                                </h1> */}

                               <h1 className="text-xl font-bold text-gray-800 leading-tight">
                                    Project Prerequisites
                                </h1>
                            </div>

                            {/* Desktop View: Title + Description */}
                            <div className="hidden sm:block space-y-2">
                                {/* <h1 className="text-3xl font-bold text-blue-700 tracking-tight">
                                    Project Prerequisites
                                </h1> */}

                                <h1 className="text-3xl font-bold text-gray-700 tracking-tight flex items-center">
                                    <i className="fa-solid fa-list-check mr-3 text-gray-400"></i>
                                    Project Prerequisites
                                </h1>
                                <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed">
                                    Configure the required work types for your project. These prerequisites must be completed before proceeding to the 14-step process.
                                </p>
                            </div>
                        </div>

                        {/* --- Right Side: Stage Guide --- */}
                        {/* shrink-0 ensures it never collapses or hides on mobile */}
                        <div className="shrink-0 pt-1">
                            <StageGuide
                                organizationId={organizationId!}
                                stageName="prerequisites"
                            />
                        </div>

                    </header>

                    {/* Prerequisites Sections */}
                    <div className="space-y-4">
                        {workTypes.map((workType) => {

                            const sectionData = prerequisites[workType.key as keyof typeof prerequisites]
                            return (
                                <PrerequisitesSection
                                    key={workType.key}
                                    title={workType.title}
                                    section={workType.key}
                                    isRequired={sectionData?.isRequired || false}
                                    notes={sectionData?.notes || ""}
                                    formId={workType._id}
                                    onUpdate={handleUpdate}
                                />
                            )
                        })}
                    </div>

                    {/* Summary */}
                    {/* <div className="bg-gray-50 border border-gray-200 rounded-lg p-6"> */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mt-8">
                        {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">Prerequisites Summary</h3> */}
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-5 border-b border-gray-100 pb-3">Prerequisites Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                            {workTypes.map((workType) => {
                                const sectionData = prerequisites[workType.key as keyof typeof prerequisites]
                                const isRequired = sectionData?.isRequired || false

                                return (
                                    <div key={workType.key} className="flex items-center space-x-2">
                                        {/* {isRequired ? (
                                            <i className="fas fa-check-circle text-green-600"></i>
                                        ) : (
                                            <i className="fas fa-exclamation-circle text-gray-400"></i>
                                        )} */}

                                        {isRequired ? (
                                            <i className="fa-solid fa-circle-check text-emerald-500 text-lg"></i>
                                        ) : (
                                            <i className="fa-solid fa-circle-minus text-gray-300 text-lg"></i>
                                        )}
                                        {/* <span className={`text-sm ${isRequired ? "text-green-600 font-medium" : "text-gray-500"}`}> */}
                                        <span className={`text-sm ${isRequired ? "text-gray-800 font-bold" : "text-gray-500 font-medium"}`}>
                                            {workType.title}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => refetch()}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Refresh Data
                        </Button>
                        {(canCreate || canEdit) && <Button
                            onClick={() => {
                                navigate(`../requirementform`)
                                toast({
                                    title: "Success",
                                    description: "Prerequisites configured successfully. You can now proceed to the 14-step process.",
                                })
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Continue to Next Steps
                        </Button>}
                    </div> */}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                        <Button
                            variant="white"
                            onClick={() => refetch()}
                            className="px-6"
                        >
                            Refresh Data
                        </Button>
                        {(canCreate || canEdit) && (
                            <Button
                                variant="dark"
                                onClick={() => {
                                    navigate(`../requirementform`)
                                    toast({
                                        title: "Success",
                                        description: "Prerequisites configured successfully. You can now proceed to the next steps.",
                                    })
                                }}
                                className="px-6"
                            >
                                Continue to Next Steps <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            {/* <ToastContainer /> */}
        </>
    )
}

export default PrerequisitesPage
