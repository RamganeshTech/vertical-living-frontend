export interface IIssueFileType {
    type: "image" | "pdf"
    url: string
    originalName: string
    uploadedAt: Date
}

export interface IIssueRaise {
    _id?: string
    selectStaff: IStaffData
    staffSelectedModel: string
    raisedBy: IStaffData
    raisedModel: string
    issue: string
    responseType: "dropdown" | "text" | "file"
    isMessageRequired: boolean
    dropdownOptions?: string[]
    files: IIssueFileType[]
    createdAt?: Date
    updatedAt?: Date
}

export interface IResponse {
    _id?: string
    issueId: string
    responsededBy: IStaffData
    responsededModel: string
    responseType: "dropdown" | "text" | "file"
    dropdownResponse?: string
    textResponse?: string
    fileResponse?: IIssueFileType[]
    optionalMessage?: string
    createdAt?: Date
    updatedAt?: Date
}

export interface IConvo {
    _id: string
    issue: IIssueRaise
    response?: IResponse
    status?: "pending" | "responded"
    createdAt?: Date
    updatedAt?: Date
}

export interface IIssueDiscussion {
    _id?: string
    organizationId: string
    projectId: string
    discussion: IConvo[]
    createdAt?: Date
    updatedAt?: Date
}

export interface IStaffData {
    _id: string
    name: string
    email: string
    modelType: string
}




import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import {
    useCreateIssue,
    useProvideSolution,
    useGetProjectDiscussions,
    useDeleteConversation,
    useForwardIssue
} from "../../../apiList/Stage Api/issueDiscussionApi"
import { useGetAllUsers } from "../../../apiList/getAll Users Api/getAllUsersApi"
import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { Textarea } from "../../../components/ui/TextArea"
import { Label } from "../../../components/ui/Label"
import SearchSelectNew from "../../../components/ui/SearchSelectNew"
import { useCurrentSupervisor } from "../../../Hooks/useCurrentSupervisor"
import { socket } from "../../../lib/socket"
import { toast } from "../../../utils/toast"
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain"
import { NO_IMAGE } from "../../../constants/constants"
import { dateFormate } from "../../../utils/dateFormator"




// Types
interface FormState {
    responseType: "dropdown" | "text" | "file"
    isMessageRequired: boolean
    dropdownOptions: string[]
}

interface ResponseState {
    content?: string
    files: File[]
    message?: string
}

interface IssueState {
    issue: string;
    selectedStaff: string;
    selectStaffRole: string;
    dropdownOptions: string;
    files: File[];
}



interface PreviewState {
    isOpen: boolean
    type: "image" | "pdf" | null
    url: string
}

export default function IssueDiscussionPage() {
    const { projectId, organizationId } = useParams<{
        projectId: string
        organizationId: string
    }>()

    // Hooks
    const { mutateAsync: createIssue, isPending: isCreating } = useCreateIssue()
    const { mutateAsync: provideSolution, isPending: isResponding } = useProvideSolution()
    const { mutateAsync: deleteConvo, isPending: isDeleteing, variables } = useDeleteConversation()

    const { mutateAsync: forwardConvo, isPending: isForwarding } = useForwardIssue();

    const {
        data: discussionsData,
        isLoading: isLoadingDiscussions,
        hasNextPage,
        fetchNextPage,
    } = useGetProjectDiscussions({
        projectId: projectId!,
        limit: 50,
    })
    const { data: staffList = [] } = useGetAllUsers(organizationId!, "staff")
    const { data: ownerList = [] } = useGetAllUsers(organizationId!, "owner")
    const { data: workerList = [] } = useGetAllUsers(organizationId!, "worker");
    const { data: CTOList = [] } = useGetAllUsers(organizationId!, "CTO");
    // State
    const [discussions, setDiscussions] = useState<IConvo[]>([])
    const [selectedIssue, setSelectedIssue] = useState<IConvo | null>(null)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [createFormData, setCreateFormData] = useState<FormState>({
        responseType: "text",
        isMessageRequired: false,
        dropdownOptions: [],
    })

    const [createFormValues, setCreateFormValues] = useState<IssueState>({
        issue: "",
        selectedStaff: "",
        selectStaffRole: "",
        dropdownOptions: "",
        files: []
    })

    const [responseData, setResponseData] = useState<ResponseState>({
        content: "",
        files: [],
        message: "",
    })

    const [isEnableForwarding, setIsEnableForwarding] = useState<boolean>(false);
    const [forwardToStaff, setForwardToStaff] = useState("");
    const [_forwardToStaffRole, setForwardToStaffRole] = useState("");

    const currentUser = useCurrentSupervisor()

    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const fileIssueInputRef = useRef<HTMLInputElement>(null)
    const discussionEndRef = useRef<HTMLDivElement>(null)

    const [preview, setPreview] = useState<PreviewState>({
        isOpen: false,
        type: null,
        url: "",
    })


    // Initialize Socket
    useEffect(() => {
        if (!socket || !organizationId || !projectId) return

        console.log("[Socket] Joining discussion room for project:", projectId)


        // JOIN THE DISCUSSION ROOM FIRST!
        socket.emit('join_project_discussion', {
            projectId,
            organizationId
        })

        // Listen for room join confirmation
        socket.on('recent_discussions', (data) => {
            console.log('[Socket] Received recent discussions:', data)
        })

        // 1. New Issue Created - MATCH BACKEND EVENT NAME
        const handleNewIssueCreated = (data: {
            discussionId: string
            conversation: IConvo
            projectId: string
        }) => {
            console.log("[Socket] New issue created:", data)
            // Add to discussions if not created by current user
            setDiscussions((prev) => {
                // Check if already exists (to prevent duplicates)
                const exists = prev.some(d => d._id === data.conversation._id)
                if (!exists) {
                    return [data.conversation, ...prev]
                }
                return prev
            })
        }




        const handleIssueResponseAdded = (data: {
            projectId: string;
            convoId: string;
            conversation?: IConvo; // Full conversation
            response?: any; // Just the response
        }) => {


            console.log("=== RESPONSE HANDLER CALLED ===");
            console.log("Full data received:", data);
            console.log("ConvoId from data:", data.convoId);
            console.log("Has conversation?", !!data.conversation);
            console.log("Has response?", !!data.response);
            console.log("===============================");


            console.log("[Socket] Response added:", data)

            // Update discussions list
            setDiscussions((prev) =>
                prev.map((convo) => {
                    if (convo._id === data.convoId) {
                        // If we have the full conversation, use it

                        console.log("data from the upate", data)
                        if (data.conversation) {
                            return data.conversation;
                        }
                        // Otherwise, just update the response
                        return {
                            ...convo,
                            response: data.response,
                            status: "responded" as const
                        };
                    }
                    return convo;
                })
            );

            console.log("selectedIssue id", selectedIssue?._id)
            console.log("data.convoId", data.convoId)
            // Update selected issue if it matches
            // if (selectedIssue?._id === data.convoId) {
            // ✅ Use functional update to get current state
            setSelectedIssue((prev) => {
                console.log("Current selected:", prev?._id);
                console.log("Response for:", data.convoId);

                // If no issue selected, auto-select the one that got response
                if (!prev) {
                    console.log("✅ Auto-selecting issue that got response");
                    return data.conversation || null;
                }

                // If it's the same issue, update it
                if (prev._id === data.convoId) {
                    console.log("✅ Same issue - updating");
                    return data.conversation || {
                        ...prev,
                        response: data.response,
                        status: "responded" as const
                    };
                }

                // Different issue - keep current selection
                console.log("❌ Different issue - keeping current");
                return prev;
            });
            // }
        }

        // 3. Issue Deleted - MATCH BACKEND EVENT NAME
        const handleIssueDeleted = (data: {
            discussionId: string
            convoId: string
        }) => {
            console.log("[Socket] Issue deleted:", data)

            setDiscussions((prev) => prev.filter((convo) => convo._id !== data.convoId))

            setSelectedIssue((prev) => {
                console.log("Current selected issue:", prev?._id);
                console.log("Deleted issue:", data.convoId);

                // If the deleted issue is currently selected, clear it
                if (prev?._id === data.convoId) {
                    console.log("✅ Deleted issue was selected - clearing selection");
                    return null;
                }

                console.log("❌ Deleted issue was not selected - keeping selection");
                return prev;
            });
        }



        const handleIssueForwarded = (data: {
            projectId: string;
            convoId: string;
            conversation: IConvo;
            forwardedFrom: string;
            forwardedTo: string;
        }) => {
            console.log("[Socket] Issue forwarded:", data);

            // Update discussions list
            setDiscussions((prev) =>
                prev.map((convo) => {
                    if (convo._id === data.convoId) {
                        console.log("✅ Updating forwarded issue");
                        return data.conversation;
                    }
                    return convo;
                })
            );

            // Update selected issue if it matches
            setSelectedIssue((prev) => {
                if (!prev || prev._id !== data.convoId) {
                    return prev;
                }

                console.log("✅ Updating selected forwarded issue");
                return data.conversation;
            });
        };

        // Register event listeners with CORRECT NAMES
        socket.on("new_issue_created", handleNewIssueCreated)
        socket.on("issue_response_added", handleIssueResponseAdded)
        socket.on("issue_deleted", handleIssueDeleted)
        socket.on("issue_forwarded", handleIssueForwarded);


        // Cleanup
        return () => {
            console.log("[Socket] Leaving discussion room")

            // Leave the room
            socket.emit('leave_project_discussion', { projectId })

            // Remove listeners
            socket.off("new_issue_created", handleNewIssueCreated)
            socket.off("issue_response_added", handleIssueResponseAdded)
            socket.off("issue_deleted", handleIssueDeleted)
            socket.off("issue_forwarded", handleIssueForwarded);

            socket.off("recent_discussions")
        }
    }, [organizationId, projectId, currentUser?.id,]) // Remove selectedIssue from dependencies

    // Load discussions
    useEffect(() => {
        if (discussionsData?.pages) {
            const allDiscussions = discussionsData.pages.flatMap((page) => page.discussions || [])
            setDiscussions(allDiscussions)
        }
    }, [discussionsData])

    // Auto scroll to bottom
    useEffect(() => {
        discussionEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [discussions])

    // Staff options for dropdown
    const staffOptions = (staffList || []).map((staff: any) => ({
        value: staff._id,
        label: staff.staffName,
        email: staff.email,
        role: staff.role
    }))

    const ownerOptions = (ownerList || []).map((owner: any) => ({
        value: owner._id,
        label: owner.username,
        email: owner.email,
        role: owner.role
    }))

    const workerOptions = (workerList || []).map((worker: any) => ({
        value: worker._id,
        label: worker.username,
        email: worker.email,
        role: worker.role
    }))

    const CTOOptions = (CTOList || []).map((cto: any) => ({
        value: cto._id,
        label: cto.username,
        email: cto.email,
        role: cto.role
    }))


    const mergedUsers = [...staffOptions, ...ownerOptions, ...workerOptions, ...CTOOptions]

    const availableUsers = mergedUsers.filter(user =>
        user.value !== currentUser?.id &&
        user.value !== selectedIssue?.issue?.raisedBy?._id
    );

    const handleAssigneeChange = (value: string | null) => {
        const selectedAssignee = mergedUsers?.find((user: any) => user?.value === value)
        console.log("selectedAssignee", selectedAssignee)
        setCreateFormValues((prev) => ({ ...prev, selectedStaff: selectedAssignee?.value, selectStaffRole: selectedAssignee?.role }))
    }


    const handleForwardChange = async (value: string | null) => {
        const user = availableUsers.find(u => u.value === value);
        setForwardToStaff(user?.value);
        setForwardToStaffRole(user?.role || "");
        await handleForward(user?.value, user?.role)
    }


    // Handle Create Issue
    const handleCreateIssue = async () => {
        try {
            if (!createFormValues.issue.trim() || !createFormValues.selectedStaff) {
                setError("Please fill all required fields")
                return
            }

            if (createFormData.responseType === "dropdown" && createFormData.dropdownOptions.length === 0) {
                setError("Please add at least one dropdown option")
                return
            }

            setError(null)
            await createIssue(
                {
                    organizationId: organizationId!,
                    projectId: projectId!,
                    selectStaff: createFormValues.selectedStaff,
                    selectStaffRole: createFormValues.selectStaffRole,
                    issue: createFormValues.issue,
                    responseType: createFormData.responseType,
                    isMessageRequired: createFormData.isMessageRequired,
                    files: createFormValues.files ?? [],
                    dropdownOptions: createFormData.responseType === "dropdown" ? createFormData.dropdownOptions : undefined,
                }
            )

            setCreateFormValues({ issue: "", selectedStaff: "", dropdownOptions: "", selectStaffRole: "", files: [] })
            setCreateFormData({
                responseType: "text",
                isMessageRequired: false,
                dropdownOptions: [],
            })
            setShowCreateForm(false)
            toast({ title: "Success", description: "Ticket created successfully" })
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to create the ticket", variant: "destructive" })
            setError(error?.response?.data?.message || error?.message || "Failed to create ticket")

        }
    }

    const handleDelete = async (convoId: string) => {
        try {
            await deleteConvo({ convoId, projectId: projectId! })
            if (selectedIssue?._id === convoId) {
                setSelectedIssue(null)
            }
            toast({ title: "Success", description: "Ticket Deleted successfully" })
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to delete the ticket", variant: "destructive" })
        }
    }

    const handleForward = async (staffId: string, staffRole: string) => {
        if (!staffId || !staffRole) {
            alert("Please select a staff");
            return;
        }

        try {
            await forwardConvo({
                projectId: projectId!,
                convoId: selectedIssue!._id,
                forwardToStaff: staffId,
                forwardToStaffRole: staffRole
            });


            // success actions
            setForwardToStaff("");
            setForwardToStaffRole("");
            if (isForwarding) {
                toast({ title: "Success", description: "Ticket Forwarded successfully" })
            }
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to forward the Ticket", variant: "destructive" })
        }
    };


    // Handle Response Submission
    const handleSubmitResponse = async () => {
        try {
            if (!selectedIssue) return

            // Validation based on response type
            if (selectedIssue.issue.responseType === "dropdown" && !responseData.content) {
                setError("Please select an option")
                return
            }
            if (selectedIssue.issue.responseType === "text" && !responseData.content?.trim()) {
                setError("Please enter a response")
                return
            }
            if (selectedIssue.issue.responseType === "file" && responseData.files.length === 0) {
                setError("Please upload at least one file")
                return
            }
            if (selectedIssue.issue.isMessageRequired && !responseData.message?.trim()) {
                setError("Please add a message")
                return
            }

            setError(null)
            await provideSolution(
                {
                    convoId: selectedIssue._id,
                    responseContent: responseData.content,
                    optionalMessage: responseData.message,
                    files: responseData.files.length > 0 ? responseData.files : undefined,
                    projectId: projectId!,
                },
            )

            setResponseData({ content: "", files: [], message: "" })
            toast({ title: "Success", description: "Resolved successfully" })
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to Resolve the ticket", variant: "destructive" })
            setError(error?.response?.data?.message || error?.message || "Failed to resolve the ticket")

        }

    }



    const handleDropdownOptionsChange = (value: string) => {
        setCreateFormValues((prev) => ({ ...prev, dropdownOptions: value }))

        // Auto-parse options on comma
        if (value.includes(",")) {
            const options = value
                .split(",")
                .map((opt) => opt.trim())
                .filter((opt) => opt && !createFormData.dropdownOptions.includes(opt))

            if (options.length > 0) {
                setCreateFormData((prev) => ({
                    ...prev,
                    dropdownOptions: [...prev.dropdownOptions, ...options],
                }))
                setCreateFormValues((prev) => ({ ...prev, dropdownOptions: "" }))
            }
        }
    }


    // Handle Add Dropdown Option
    const handleAddDropdownOption = () => {
        const option = createFormValues.dropdownOptions.trim()
        if (option && !createFormData.dropdownOptions.includes(option)) {
            setCreateFormData((prev) => ({
                ...prev,
                dropdownOptions: [...prev.dropdownOptions, option],
            }))
            setCreateFormValues((prev) => ({ ...prev, dropdownOptions: "" }))
        }
    }


    // Handle File Upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const validFiles = files.filter((f) => {
            const isImage = f.type.startsWith("image/")
            const isPdf = f.type === "application/pdf"
            return isImage || isPdf
        })

        if (validFiles.length !== files.length) {
            setError("Only images and PDFs are allowed")
        }

        setResponseData((prev) => ({
            ...prev,
            files: [...prev.files, ...validFiles],
        }))
    }

    const handleIssueFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const validFiles = files.filter((f) => {
            const isImage = f.type.startsWith("image/")
            const isPdf = f.type === "application/pdf"
            return isImage || isPdf
        })

        if (validFiles.length !== files.length) {
            setError("Only images and PDFs are allowed")
        }

        setCreateFormValues((prev) => ({
            ...prev,
            files: [...prev.files, ...validFiles],
        }))
    }

    // Check if user can respond
    const canRespond =
        selectedIssue && !selectedIssue.response && selectedIssue.issue.selectStaff._id === currentUser?.id

    return (
        <main className="h-full max-h-full !overflow-y-auto bg-gradient-to-br from-blue-50 to-white p-2">


            <header className=" flex justify-between w-full pb-2 border-b border-b-[#aaaaaa] mb-2">
                <h1 className="text-3xl font-bold text-blue-600">
                    <i className="fa-solid fa-ticket mr-3"></i>Ticket Operations
                </h1>


                <Button
                    onClick={() => {
                        setSelectedIssue(null)
                        setShowCreateForm(!showCreateForm)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isCreating}
                >
                    <i className="fas fa-plus mr-1"></i>Raise Ticket
                </Button>
            </header>

            <main className="flex flex-col h-full max-h-[92%] lg:flex-row gap-4">
                {/* Left Sidebar - Discussions List (70% width) */}
                <div className="w-full lg:w-1/2 flex flex-col border-r border-blue-200">
                    {/* Discussions List */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {isLoadingDiscussions ? (
                            <div className="flex flex-col items-center justify-center h-40">
                                <i className="fas fa-spinner fa-spin text-blue-600 text-3xl mb-2"></i>
                                <p className="text-gray-600">Loading tickets...</p>
                            </div>
                        ) : discussions.length === 0 ? (
                            <section className="flex items-center justify-center h-[95%]">
                                <div className="text-center py-12 text-gray-500 ">
                                    <i className="fas fa-inbox text-5xl mb-3 opacity-50"></i>
                                    <p className="text-lg">No Tickets yet</p>
                                    <p className="text-sm">Create your first Ticket to get started</p>
                                </div>
                            </section>
                        ) : (
                            discussions.map((convo: IConvo) => (
                                    <div
                                        key={convo._id}
                                        onClick={() => setSelectedIssue(convo)}
                                        className={`group relative rounded-xl cursor-pointer border-2 transition-all duration-300 ${selectedIssue?._id === convo._id
                                                ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-500 shadow-lg"
                                                : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                                            }`}
                                    >
                                        {/* Selected Indicator */}
                                        {/* {selectedIssue?._id === convo._id && (
                                            <div className="absolute  top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-l-xl"></div>
                                        )} */}

                                        <div className="p-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <i className="fas fa-user text-white text-sm"></i>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs text-gray-500 font-medium">Assigned to</p>
                                                        <p className="text-sm font-bold text-gray-800 truncate">
                                                            {convo.issue.selectStaff?.name || "Unknown Staff"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 items-center">
                                                    {/* Status Badge */}
                                                    <span
                                                        className={`text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 whitespace-nowrap ${convo.response
                                                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm"
                                                                : "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm"
                                                            }`}
                                                    >
                                                        {convo.response ? (
                                                            <>
                                                                <i className="fas fa-check-circle"></i>
                                                                <span>Done</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-clock"></i>
                                                                <span>Pending</span>
                                                            </>
                                                        )}
                                                    </span>

                                                    {/* Delete Button */}
                                                    <Button
                                                        size="sm"
                                                        className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(convo._id)
                                                        }}
                                                        isLoading={isDeleteing && variables.convoId === convo._id}
                                                    >
                                                        <i className="fas fa-trash text-xs"></i>
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Issue Description */}
                                            <div className="mb-3 pl-10">
                                                <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                                                    {convo.issue.issue}
                                                </p>
                                            </div>

                                            {/* Footer Tags */}
                                            <div className="flex gap-2 items-center flex-wrap pl-10">
                                                {/* Response Type */}
                                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-blue-200">
                                                    {convo.issue.responseType === "dropdown" && (
                                                        <>
                                                            <i className="fas fa-list-ul"></i>
                                                            <span>Dropdown</span>
                                                        </>
                                                    )}
                                                    {convo.issue.responseType === "text" && (
                                                        <>
                                                            <i className="fas fa-align-left"></i>
                                                            <span>Text</span>
                                                        </>
                                                    )}
                                                    {convo.issue.responseType === "file" && (
                                                        <>
                                                            <i className="fas fa-file-upload"></i>
                                                            <span>File</span>
                                                        </>
                                                    )}
                                                </span>

                                                {/* Message Required Badge */}
                                                {convo.issue.isMessageRequired && (
                                                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-purple-200">
                                                        <i className="fas fa-comment-dots"></i>
                                                        <span>Additional Message Required</span>
                                                    </span>
                                                )}

                                                {/* File Attachment Indicator */}
                                                {convo.issue.files && convo.issue.files.length > 0 && (
                                                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-indigo-200">
                                                        <i className="fas fa-paperclip"></i>
                                                        <span>{convo.issue.files.length}</span>
                                                    </span>
                                                )}

                                                {/* Date */}
                                                <span className="text-xs text-gray-500 ml-auto flex items-center gap-1">
                                                    <i className="far fa-calendar-alt"></i>
                                                    {new Date(convo.createdAt!).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                            ))
                        )}
                        <div ref={discussionEndRef} />
                    </div>

                    {/* Load More */}
                    {hasNextPage && (
                        <Button
                            onClick={() => fetchNextPage()}
                            className="w-full mt-3 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300"
                        >
                            <i className="fas fa-arrow-down mr-2"></i>Load More Discussions
                        </Button>
                    )}
                </div>

                {/* Right Side - Issue Details & Response (30% width) */}
                <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-lg border border-blue-200  overflow-y-auto">

                    {/* Create Issue Form */}
                    

                    {showCreateForm && (
                        <div className=" bg-white rounded-xl h-full shadow-lg border border-blue-200 overflow-y-scroll">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                        <i className="fas fa-plus-circle text-blue-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Create New Ticket</h3>
                                        <p className="text-xs text-blue-100">Fill in the details to raise a new ticket</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Assign Staff */}
                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                        <i className="fas fa-user-check text-blue-600"></i>
                                        Select Staff to Respond
                                    </Label>
                                    <SearchSelectNew
                                        options={mergedUsers}
                                        placeholder="Choose staff member"
                                        searchPlaceholder="Search by name..."
                                        value={createFormValues.selectedStaff}
                                        onValueChange={(value) => { handleAssigneeChange(value) }}
                                        searchBy="name"
                                        displayFormat="detailed"
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                        <i className="fas fa-comment-dots text-blue-600"></i>
                                        Ticket Description
                                    </Label>
                                    <Textarea
                                        value={createFormValues.issue}
                                        onChange={(e) => setCreateFormValues((prev) => ({ ...prev, issue: e.target.value }))}
                                        placeholder="Describe the ticket in detail..."
                                        className="w-full min-h-24 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                        <i className="fas fa-reply text-blue-600"></i>
                                        Response Method
                                    </Label>
                                    <select
                                        value={createFormData.responseType}
                                        onChange={(e) =>
                                            setCreateFormData((prev) => ({
                                                ...prev,
                                                responseType: e.target.value as any,
                                            }))
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="text">💬 Text Response</option>
                                        <option value="dropdown">📋 Dropdown Selection</option>
                                        <option value="file">📎 File Upload (Image/PDF)</option>
                                    </select>
                                </div>

                                {createFormData.responseType === "dropdown" && (
                                    <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                            <i className="fas fa-list text-blue-600"></i>
                                            Dropdown Options
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={createFormValues.dropdownOptions}
                                                onChange={(e) => handleDropdownOptionsChange(e.target.value)}
                                                onKeyDown={(e: any) => {
                                                    if (e.key === "Enter") {
                                                        setCreateFormData((prev) => ({
                                                            ...prev,
                                                            dropdownOptions: [...prev.dropdownOptions, e.target.value],
                                                        }))
                                                        setCreateFormValues((prev) => ({ ...prev, dropdownOptions: "" }))
                                                    }
                                                }}
                                                placeholder="Enter options: Option 1, Option 2, Option 3"
                                                className="flex-1 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            />
                                            <Button
                                                onClick={handleAddDropdownOption}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 shadow-md hover:shadow-lg transition-all"
                                            >
                                                <i className="fas fa-plus"></i>
                                            </Button>
                                        </div>
                                        <p className="text-xs text-blue-700 flex items-center gap-1">
                                            <i className="fas fa-info-circle"></i>
                                            Type comma-separated values and press Add or Enter
                                        </p>

                                        {createFormData.dropdownOptions.length > 0 && (
                                            <div className="space-y-2 mt-3">
                                                {createFormData.dropdownOptions.map((opt, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200 hover:shadow-md transition-shadow group"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                                {i + 1}
                                                            </span>
                                                            <span className="text-sm text-gray-700 font-medium">{opt}</span>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                setCreateFormData((prev) => ({
                                                                    ...prev,
                                                                    dropdownOptions: prev.dropdownOptions.filter((_, idx) => idx !== i),
                                                                }))
                                                            }
                                                            className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <i className="fas fa-trash text-sm"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* File Upload */}
                                <div className="space-y-3">
                                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                        <i className="fas fa-paperclip text-blue-600"></i>
                                        Upload Files (Images/PDFs)
                                        <span className="text-xs font-normal text-gray-500">(Optional)</span>
                                    </Label>
                                    <input
                                        ref={fileIssueInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={handleIssueFileUpload}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => fileIssueInputRef.current?.click()}
                                        className="w-full p-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
                                    >
                                        <div className="text-center">
                                            <i className="fas fa-cloud-upload-alt text-4xl text-blue-400 group-hover:text-blue-600 mb-2 transition-colors"></i>
                                            <p className="text-blue-600 font-medium group-hover:text-blue-700">Click to upload files</p>
                                            <p className="text-xs text-gray-500 mt-1">Support: JPG, PNG, PDF (Max 10MB)</p>
                                        </div>
                                    </div>

                                    {/* Uploaded Files */}
                                    {createFormValues.files.length > 0 && (
                                        <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <i className="fas fa-check-circle text-green-600"></i>
                                                <p className="text-sm font-semibold text-gray-700">
                                                    Uploaded Files ({createFormValues.files.length})
                                                </p>
                                            </div>
                                            <div className="max-h-48 overflow-y-auto space-y-2">
                                                {createFormValues.files.map((file, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                                                    >
                                                        {file.type.startsWith("image") ? (
                                                            <img
                                                                src={URL.createObjectURL(file) || NO_IMAGE}
                                                                alt={file.name}
                                                                className="w-12 h-12 object-cover rounded-lg cursor-pointer hover:opacity-80 ring-2 ring-gray-200"
                                                                onClick={() => {
                                                                    setPreview({
                                                                        isOpen: true,
                                                                        type: "image",
                                                                        url: URL.createObjectURL(file),
                                                                    })
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                                                <i className="fas fa-file-pdf text-red-600 text-xl"></i>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-gray-800 truncate font-medium">{file.name}</p>
                                                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                setCreateFormValues((prev) => ({
                                                                    ...prev,
                                                                    files: prev.files.filter((_, idx) => idx !== i),
                                                                }))
                                                            }
                                                            className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                            title="Delete file"
                                                        >
                                                            <i className="fas fa-trash text-sm"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Message Checkbox */}
                                <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="messageRequired"
                                        checked={createFormData.isMessageRequired}
                                        onChange={(e) =>
                                            setCreateFormData((prev) => ({
                                                ...prev,
                                                isMessageRequired: e.target.checked,
                                            }))
                                        }
                                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                                    />
                                    <label htmlFor="messageRequired" className="text-sm text-gray-700 cursor-pointer font-medium flex items-center gap-2">
                                        <i className="fas fa-exclamation-circle text-amber-600"></i>
                                        Require additional message with response
                                    </label>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                                        <i className="fas fa-exclamation-triangle text-xl mt-0.5"></i>
                                        <div>
                                            <p className="font-semibold">Error</p>
                                            <p className="text-sm">{error}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
                                <Button
                                    onClick={handleCreateIssue}
                                    disabled={isCreating}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {isCreating ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>Creating Ticket...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-check-circle mr-2"></i>Create Ticket
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={() => setShowCreateForm(false)}
                                    className="flex-1 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all"
                                >
                                    <i className="fas fa-times-circle mr-2"></i>Cancel
                                </Button>
                            </div>
                        </div>
                    )}


                    {selectedIssue ? (
                        <>
                            <div className="flex flex-col h-full">
                                {/* Issue Header Card */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-4 rounded-t-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                                <i className="fas fa-clipboard-list text-blue-600 text-xl"></i>
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-white">Ticket Details</h2>
                                                <p className="text-xs text-blue-100 flex items-center gap-1">
                                                    <i className="far fa-calendar-alt mr-1"></i>
                                                    {new Date(selectedIssue.createdAt!).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                    <span className="mx-1">•</span>
                                                    {new Date(selectedIssue.createdAt!).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-lg font-semibold text-sm flex items-center gap-2 ${selectedIssue.response
                                            ? "bg-green-500 text-white"
                                            : "bg-amber-500 text-white"
                                            }`}>
                                            {selectedIssue.response ? (
                                                <>
                                                    <i className="fas fa-check-circle"></i>
                                                    <span>Resolved</span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-clock"></i>
                                                    <span>Pending</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-6">

                                    {/* People & Assignment Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Raised By Card */}
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-user text-purple-600 text-xl"></i>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Raised By</p>
                                                    <p className="text-gray-900 font-semibold">{selectedIssue.issue.raisedBy?.name || "Unknown"}</p>
                                                    <p className="text-xs text-gray-500">{selectedIssue.issue.raisedBy?.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Assigned To Card */}
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-user-check text-blue-600 text-xl"></i>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Assigned To</p>
                                                    <p className="text-gray-900 font-semibold">{selectedIssue.issue.selectStaff?.name || "Unknown"}</p>
                                                    <p className="text-xs text-gray-500">{selectedIssue.issue.selectStaff?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Response Type Badge */}
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                            {selectedIssue.issue.responseType === 'dropdown' && <><i className="fas fa-list mr-2"></i>Dropdown Response</>}
                                            {selectedIssue.issue.responseType === 'text' && <><i className="fas fa-keyboard mr-2"></i>Text Response</>}
                                            {selectedIssue.issue.responseType === 'file' && <><i className="fas fa-file-upload mr-2"></i>File Upload Response</>}
                                        </span>
                                    </div>

                                    {/* Forward Section (if applicable) */}
                                    {selectedIssue.issue.selectStaff._id === currentUser?.id && !selectedIssue.response && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <i className="fas fa-share text-amber-600"></i>
                                                <h3 className="font-semibold text-amber-900">Forward Ticket</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        id="forwardstff"
                                                        type="checkbox"
                                                        checked={isEnableForwarding}
                                                        onChange={() => setIsEnableForwarding(p => !p)}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <Label htmlFor="forwardstff" className="cursor-pointer text-sm text-gray-700">
                                                        Enable forwarding (only if other staff is available)
                                                    </Label>
                                                </div>
                                                {isEnableForwarding && (
                                                    <SearchSelectNew
                                                        options={availableUsers}
                                                        placeholder="Choose staff to forward"
                                                        searchPlaceholder="Search by name..."
                                                        value={forwardToStaff}
                                                        onValueChange={(value) => { handleForwardChange(value) }}
                                                        searchBy="name"
                                                        displayFormat="detailed"
                                                        className="w-full"
                                                        enabled={isEnableForwarding}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Issue Description Card */}
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <i className="fas fa-info-circle text-blue-600"></i>
                                            <h3 className="font-semibold text-gray-900">Ticket Description</h3>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {selectedIssue.issue.issue}
                                        </p>
                                    </div>

                                    {/* Issue Attachments (if any) */}
                                    {selectedIssue?.issue?.files && selectedIssue?.issue?.files?.length > 0 && (
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <i className="fas fa-paperclip text-blue-600"></i>
                                                <h3 className="font-semibold text-gray-900">Ticket Attachments</h3>
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                    {selectedIssue?.issue?.files.length} file{selectedIssue?.issue?.files.length > 1 ? 's' : ''}
                                                </span>
                                            </div>

                                            {/* Images Section */}
                                            {selectedIssue?.issue?.files.some(file => file.type === "image") && (
                                                <div className="mb-6">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <i className="fas fa-images text-purple-600"></i>
                                                        <h4 className="font-semibold text-gray-800 text-sm">Images</h4>
                                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                            {selectedIssue?.issue?.files.filter(f => f.type === "image").length}
                                                        </span>
                                                    </div>
                                                    <ImageGalleryExample
                                                        imageFiles={selectedIssue?.issue?.files.filter(file => file.type === "image")}
                                                        height={150}
                                                        minWidth={150}
                                                        maxWidth={200}
                                                    />
                                                </div>
                                            )}

                                            {/* PDFs Section */}
                                            {selectedIssue?.issue?.files.some(file => file.type === "pdf") && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <i className="fas fa-file-pdf text-red-600"></i>
                                                        <h4 className="font-semibold text-gray-800 text-sm">Documents</h4>
                                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                                            {selectedIssue?.issue?.files.filter(f => f.type === "pdf").length}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {selectedIssue?.issue?.files
                                                            .filter(file => file.type === "pdf")
                                                            .map((file, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200 hover:shadow-md transition-all group"
                                                                >
                                                                    <div
                                                                        onClick={() => {
                                                                            setPreview({
                                                                                isOpen: true,
                                                                                type: "pdf",
                                                                                url: file.url,
                                                                            })
                                                                        }}
                                                                        className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors"
                                                                    >
                                                                        <i className="fas fa-file-pdf text-red-600 text-2xl"></i>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                                            {file.originalName || `Document ${i + 1}.pdf`}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            <i className="far fa-calendar mr-1"></i>
                                                                            {dateFormate(file.uploadedAt)}
                                                                        </p>
                                                                    </div>
                                                                    <a
                                                                        href={file.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="px-3 py-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium text-sm group-hover:shadow-md"
                                                                        title="Open in new tab"
                                                                    >
                                                                        <i className="fas fa-external-link-alt mr-1"></i>
                                                                        Open
                                                                    </a>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Response Section */}
                                    {selectedIssue.response && (
                                        <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg shadow-sm border border-blue-200 p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-check text-white"></i>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-blue-900 text-lg">Response Provided</h3>
                                                    <p className="text-xs text-blue-700">
                                                        <i className="far fa-clock mr-1"></i>
                                                        {new Date(selectedIssue.response.createdAt!).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Responded By */}
                                            <div className="bg-white rounded-lg p-4 mb-4">
                                                <p className="text-xs text-gray-500 mb-1">Responded By</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                        <i className="fas fa-user text-blue-600 text-sm"></i>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {selectedIssue.response.responsededBy?.name || "Unknown"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {selectedIssue.response.responsededBy?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dropdown Response */}
                                            {selectedIssue.response.dropdownResponse && (
                                                <div className="bg-white rounded-lg p-4 mb-4">
                                                    <p className="text-xs text-gray-500 mb-2">Selected Option</p>
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-check-circle text-green-600"></i>
                                                        <p className="font-bold text-gray-900">{selectedIssue.response.dropdownResponse}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Text Response */}
                                            {selectedIssue.response.textResponse && (
                                                <div className="bg-white rounded-lg p-4 mb-4">
                                                    <p className="text-xs text-gray-500 mb-2">Response Message</p>
                                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                        {selectedIssue.response.textResponse}
                                                    </p>
                                                </div>
                                            )}

                                            {/* File Response */}
                                            {selectedIssue.response.fileResponse && selectedIssue.response.fileResponse.length > 0 && (
                                                <div className="bg-white rounded-lg p-4 mb-4">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <i className="fas fa-paperclip text-gray-600"></i>
                                                        <p className="font-semibold text-gray-900">Attached Files</p>
                                                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                                            {selectedIssue.response.fileResponse.length}
                                                        </span>
                                                    </div>

                                                    {/* Response Images */}
                                                    {selectedIssue.response.fileResponse.some(file => file.type === "image") && (
                                                        <div className="mb-6">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <i className="fas fa-images text-purple-600"></i>
                                                                <h5 className="font-semibold text-gray-800 text-sm">Images</h5>
                                                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                                    {selectedIssue.response.fileResponse.filter(f => f.type === "image").length}
                                                                </span>
                                                            </div>
                                                            <ImageGalleryExample
                                                                imageFiles={selectedIssue.response.fileResponse.filter(file => file.type === "image")}
                                                                height={120}
                                                                minWidth={120}
                                                                maxWidth={140}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Response PDFs */}
                                                    {selectedIssue.response.fileResponse.some(file => file.type === "pdf") && (
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <i className="fas fa-file-pdf text-red-600"></i>
                                                                <h5 className="font-semibold text-gray-800 text-sm">Documents</h5>
                                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                                                    {selectedIssue.response.fileResponse.filter(f => f.type === "pdf").length}
                                                                </span>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {selectedIssue.response.fileResponse
                                                                    .filter(file => file.type === "pdf")
                                                                    .map((file, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg border border-red-200 hover:shadow-md transition-all group"
                                                                        >
                                                                            <div
                                                                                onClick={() => {
                                                                                    setPreview({
                                                                                        isOpen: true,
                                                                                        type: "pdf",
                                                                                        url: file.url,
                                                                                    })
                                                                                }}
                                                                                className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors"
                                                                            >
                                                                                <i className="fas fa-file-pdf text-red-600 text-xl"></i>
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                                                    {file.originalName || `Document ${i + 1}`}
                                                                                </p>
                                                                                <p className="text-xs text-gray-500 mt-0.5">
                                                                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                                                                </p>
                                                                            </div>
                                                                            <a
                                                                                href={file.url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="px-3 py-1.5 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
                                                                                title="Open in new tab"
                                                                            >
                                                                                <i className="fas fa-external-link-alt mr-1"></i>
                                                                                Open
                                                                            </a>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Optional Message */}
                                            {selectedIssue.response.optionalMessage && (
                                                <div className="bg-white rounded-lg p-4">
                                                    <p className="text-xs text-gray-500 mb-2">Additional Message</p>
                                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                        {selectedIssue.response.optionalMessage}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Response Form - Only if can respond */}
                                    {canRespond && !selectedIssue.response && (
                                        <div className="bg-white rounded-lg shadow-lg border border-blue-200 p-6">
                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-reply text-white"></i>
                                                </div>
                                                <h3 className="font-bold text-blue-900 text-lg">Provide Your Response</h3>
                                            </div>

                                            <div className="space-y-5">
                                                {/* Text Response */}
                                                {selectedIssue.issue.responseType === "text" && (
                                                    <div>
                                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                                            <i className="fas fa-keyboard mr-2 text-blue-600"></i>
                                                            Your Response
                                                        </Label>
                                                        <Textarea
                                                            value={responseData.content || ""}
                                                            onChange={(e) => setResponseData((prev) => ({ ...prev, content: e.target.value }))}
                                                            placeholder="Type your detailed response here..."
                                                            className="w-full min-h-32 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                )}

                                                {/* Dropdown Response */}
                                                {selectedIssue.issue.responseType === "dropdown" && (
                                                    <div>
                                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                                            <i className="fas fa-list mr-2 text-blue-600"></i>
                                                            Select Your Response
                                                        </Label>
                                                        <select
                                                            value={responseData.content || ""}
                                                            onChange={(e) => setResponseData((prev) => ({ ...prev, content: e.target.value }))}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            <option value="">-- Choose an option --</option>
                                                            {selectedIssue.issue.dropdownOptions?.map((opt, i) => (
                                                                <option key={i} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                {/* File Response */}
                                                {selectedIssue.issue.responseType === "file" && (
                                                    <div>
                                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                                            <i className="fas fa-upload mr-2 text-blue-600"></i>
                                                            Upload Response Files
                                                        </Label>
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            multiple
                                                            accept="image/*,.pdf"
                                                            onChange={handleFileUpload}
                                                            className="hidden"
                                                        />
                                                        <div
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="w-full p-8 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer text-center group"
                                                        >
                                                            <i className="fas fa-cloud-upload-alt text-4xl text-blue-400 group-hover:text-blue-600 mb-3"></i>
                                                            <p className="text-blue-600 font-semibold group-hover:text-blue-700">
                                                                Click to upload files
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Supports Images and PDF documents
                                                            </p>
                                                        </div>

                                                        {/* Uploaded Files Preview */}
                                                        {responseData.files.length > 0 && (
                                                            <div className="mt-4 space-y-2">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <p className="text-sm font-semibold text-gray-700">
                                                                        Uploaded Files
                                                                    </p>
                                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                                        {responseData.files.length}
                                                                    </span>
                                                                </div>
                                                                <div className="max-h-64 overflow-y-auto space-y-2">
                                                                    {responseData.files.map((file, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                                                        >
                                                                            {file.type.startsWith("image") ? (
                                                                                <img
                                                                                    src={URL.createObjectURL(file)}
                                                                                    alt={file.name}
                                                                                    className="w-14 h-14 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                                                                    onClick={() => {
                                                                                        setPreview({
                                                                                            isOpen: true,
                                                                                            type: "image",
                                                                                            url: URL.createObjectURL(file),
                                                                                        })
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center">
                                                                                    <i className="fas fa-file-pdf text-red-600 text-xl"></i>
                                                                                </div>
                                                                            )}
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                                                    {file.name}
                                                                                </p>
                                                                                <p className="text-xs text-gray-500">
                                                                                    {(file.size / 1024).toFixed(2)} KB
                                                                                </p>
                                                                            </div>
                                                                            <button
                                                                                onClick={() =>
                                                                                    setResponseData((prev) => ({
                                                                                        ...prev,
                                                                                        files: prev.files.filter((_, idx) => idx !== i),
                                                                                    }))
                                                                                }
                                                                                className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-colors"
                                                                                title="Remove file"
                                                                            >
                                                                                <i className="fas fa-trash"></i>
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Optional Message */}
                                                {selectedIssue.issue.isMessageRequired && (
                                                    <div>
                                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                                            <i className="fas fa-comment mr-2 text-blue-600"></i>
                                                            Additional Message <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Textarea
                                                            value={responseData.message || ""}
                                                            onChange={(e) => setResponseData((prev) => ({ ...prev, message: e.target.value }))}
                                                            placeholder="Add any additional comments or explanations..."
                                                            className="w-full min-h-24 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                )}

                                                {/* Error Message */}
                                                {error && (
                                                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                                                        <i className="fas fa-exclamation-triangle mt-0.5"></i>
                                                        <div>
                                                            <p className="font-semibold">Error</p>
                                                            <p className="text-sm">{error}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Submit Button */}
                                                <Button
                                                    onClick={handleSubmitResponse}
                                                    disabled={isResponding}
                                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isResponding ? (
                                                        <>
                                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                                            Submitting Response...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-paper-plane mr-2"></i>
                                                            Submit Response
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Not Assigned Message */}
                                    {!canRespond && !selectedIssue.response && (
                                        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <i className="fas fa-info-circle text-amber-600 text-xl mt-1"></i>
                                                <div>
                                                    <p className="font-semibold text-amber-900">Not Assigned</p>
                                                    <p className="text-sm text-amber-700 mt-1">
                                                        You are not assigned to respond to this ticket. Only the assigned staff member can provide a response.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Already Responded Message */}
                                    {selectedIssue.response && (
                                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <i className="fas fa-check-circle text-blue-600 text-xl mt-1"></i>
                                                <div>
                                                    <p className="font-semibold text-blue-900">Ticket Resolved</p>
                                                    <p className="text-sm text-blue-700 mt-1">
                                                        This ticket has been successfully resolved.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        !showCreateForm ? <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <i className="fas fa-hand-pointer text-5xl mb-4 opacity-50"></i>
                                <p className="font-semibold">Select a ticket to view details</p>
                                <p className="text-sm">Click on any ticket from the left panel</p>
                            </div>
                        </div>

                            : null
                    )}
                </div>

                {preview.isOpen && (
                    <div
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                        onClick={() => setPreview({ isOpen: false, type: null, url: "" })}
                    >
                        <div
                            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
                                <h3 className="font-bold text-gray-800">
                                    <i
                                        className={`fas ${preview.type === "pdf" ? "fa-file-pdf text-red-500" : "fa-image text-blue-500"} mr-2`}
                                    ></i>
                                    {preview.type === "pdf" ? "PDF Preview" : "Image Preview"}
                                </h3>
                                <div className="flex gap-2">
                                    <a
                                        href={preview.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center gap-1"
                                    >
                                        <i className="fas fa-external-link-alt"></i>Open in New Tab
                                    </a>
                                    <button
                                        onClick={() => setPreview({ isOpen: false, type: null, url: "" })}
                                        className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-sm font-medium"
                                    >
                                        <i className="fas fa-times"></i>Close
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
                                {preview.type === "image" && (
                                    <img
                                        src={preview.url || NO_IMAGE}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                    />
                                )}
                                {preview.type === "pdf" && (
                                    <iframe src={preview.url} className="w-full h-full rounded-lg" title="PDF Preview" />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
       
        </main>

    )
}
