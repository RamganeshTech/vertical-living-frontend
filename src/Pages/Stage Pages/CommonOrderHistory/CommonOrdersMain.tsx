import { useState } from "react"
import { useParams, useNavigate, Outlet, useOutletContext } from "react-router-dom"
import {
    useCreateCommonProject,
    useDeleteCommonProject,
    useEditCommonProject,
    useGetCommonOrderHistory
} from "../../../apiList/Stage Api/Common OrderMaterialHisotry APi/commonOrderHistoryMaterialApi"

import type { OrganizationOutletTypeProps } from "../../Organization/OrganizationChildren"

import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "../../../components/ui/Card"
import { toast } from "../../../utils/toast"
import { Label } from "../../../components/ui/Label"
import { useAuthCheck } from "../../../Hooks/useAuthCheck"
import StageGuide from "../../../shared/StageGuide"

const CommonOrdersMain = () => {
    const { organizationId } = useParams<{ organizationId: string }>()
    const { openMobileSidebar, isMobile } = useOutletContext<OrganizationOutletTypeProps>()
    const navigate = useNavigate()

    const [projectName, setProjectName] = useState("")
    const [showInput, setShowInput] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingText, setEditingText] = useState("")





    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.commonorder?.delete;
    const canList = role === "owner" || permission?.commonorder?.list;
    const canCreate = role === "owner" || permission?.commonorder?.create;
    const canEdit = role === "owner" || permission?.commonorder?.edit;



    const {
        data: commonOrders,
        isLoading,
        error,
        refetch,
    } = useGetCommonOrderHistory(organizationId!)

    const { mutateAsync: createProject, isPending: creating } = useCreateCommonProject()
    const { mutateAsync: deleteProject, isPending: deleting } = useDeleteCommonProject()
    const { mutateAsync: editProject, isPending: updating } = useEditCommonProject()

    const pathPart = location.pathname.split("/")
    const isChildRoute = pathPart[pathPart.length - 1] !== "commonorder"

    if (isChildRoute) {
        return <Outlet context={{ openMobileSidebar, isMobile }} />
    }

    const handleCreate = async () => {
        if (!projectName.trim()) {
            toast({ title: "Error", description: "Project Name is mandatory", variant: "destructive" })
        }
        try {
            await createProject({
                organizationId: organizationId!,
                payload: { projectName },
            })
            setProjectName("")
            setShowInput(false)
            await refetch()
        } catch (error: any) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure?")
        if (!confirmDelete) return

        try {
            await deleteProject({ id })
            await refetch()
        } catch (error: any) {
            console.error(error)
        }
    }

    const handleEditSave = async () => {
        if (!editingText.trim() || !editingId) return
        try {
            await editProject({ id: editingId, payload: { projectName: editingText } })
            setEditingId(null)
            setEditingText("")
            await refetch()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="max-w-full mx-auto p-2 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-blue-600">
                    <i className="fas fa-layer-group mr-2" />
                    Common Projects
                </h1>

                <div className='flex gap-3 items-center'>
                    {(!showInput && canCreate) && (
                        <Button variant="primary" onClick={() => setShowInput(true)}>
                            <i className="fas fa-plus mr-2" />
                            Create New Project
                        </Button>
                    )}


                    <div className="w-full sm:w-auto flex justify-end sm:block">
                        <StageGuide
                            organizationId={organizationId!}
                            stageName="commonorder"
                        />
                    </div>
                </div>
            </div>

            {/* Create Project Form */}
            {showInput && (
                <div onClick={() => setShowInput(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div onClick={(e) => e.stopPropagation()} className="flex rounded-2xl bg-white flex-col p-6 gap-3 max-w-lg items-start">
                        <Label className="text-2xl">Create Project</Label>
                        <Input
                            placeholder="Enter project name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleCreate()
                                }
                            }}

                        />
                        <div className="flex gap-2">
                            <Button variant="primary" onClick={handleCreate} isLoading={creating}>
                                <i className="fas fa-save mr-2" />
                                Save
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowInput(false)
                                    setProjectName("")
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading/Error States */}
            {isLoading && <p>Loading projects...</p>}
            {error && <p className="text-red-500">Something went wrong while loading projects.</p>}

            {/* Empty State */}
            {commonOrders?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <i className="fas fa-folder-open text-5xl text-blue-300 mb-4" />
                    <h2 className="text-xl font-semibold">No Projects Found</h2>
                    <p>Create a project to start managing materials more efficiently.</p>
                </div>
            )}

            {/* Project Cards */}
            {canList && <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {commonOrders?.map((project: any) => (
                    <div
                        key={project._id}
                        className="transition-transform hover:scale-[1.02] cursor-pointer"

                    >
                        <Card className="shadow-md hover:shadow-lg border-l-4 border-blue-600">
                            <CardHeader>
                                {editingId === project._id ? (
                                    <Input
                                        value={editingText}
                                        onChange={(e) => {
                                            setEditingText(e.target.value)
                                        }}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {

                                            }
                                        }}
                                        placeholder="Edit project name"
                                    />
                                ) : (
                                    <CardTitle className="line-clamp-1">
                                        <i className="fas fa-project-diagram mr-2 text-blue-500" />
                                        {project.projectName || "Untitled"}
                                    </CardTitle>
                                )}
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <CardDescription>
                                    <i className="fas fa-tasks mr-1 text-gray-400" />
                                    Order Units:{" "}
                                    <span className="font-medium text-blue-600">{project?.selectedUnits?.length}</span>
                                </CardDescription>

                                {/* Action Buttons */}
                                <div className="flex gap-3 flex-wrap">
                                    {editingId === project._id ? (
                                        <>
                                            {canEdit && <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEditSave()
                                                }}
                                                isLoading={updating}
                                            >
                                                <i className="fas fa-check mr-1" />
                                                Save
                                            </Button>}
                                            {canEdit && <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setEditingId(null)
                                                    setEditingText("")
                                                }}
                                            >
                                                Cancel
                                            </Button>}
                                        </>
                                    ) : (
                                        <>
                                            {canEdit && <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setEditingId(project._id)
                                                    setEditingText(project.projectName || "")
                                                }}
                                            >
                                                <i className="fas fa-edit mr-1 text-blue-500" />
                                                Edit
                                            </Button>}
                                            {canDelete && <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDelete(project._id)
                                                }}
                                                isLoading={deleting}
                                                className="hover:text-white"
                                            >
                                                <i className="fas fa-trash-alt mr-1" />
                                                Delete
                                            </Button>}
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    navigate(`${project._id}`)
                                                }}
                                            >
                                                <i className="fas fa-eye mr-1 text-blue-600" />
                                                View
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>}
        </div>
    )
}

export default CommonOrdersMain