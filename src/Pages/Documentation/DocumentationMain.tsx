import type React from "react"
import { useParams, Link, useLocation, Outlet, useOutletContext } from "react-router-dom"
import { useGetAllStageDocumentation, type DocumentStage } from "../../apiList/Documentation Api/documentationApi"
import { Button } from "../../components/ui/Button"
import { Skeleton } from "../../components/ui/Skeleton"
import type { ProjectDetailsOutlet } from "../../types/types"

const DocumentationMain: React.FC = () => {
    const { projectId } = useParams()
    const location = useLocation()
    const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>()
    const { data, isLoading, isError, refetch, isFetching } = useGetAllStageDocumentation(projectId!)

    const locationArray = location.pathname.split("/")
    const isChild = locationArray.indexOf("document") !== locationArray.length - 1


   
    if (isLoading) {
        return (
            <div className="mx-auto p-4 space-y-6 overflow-y-auto max-h-full custom-scrollbar">
                {isMobile && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openMobileSidebar}
                        className="mb-4 bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        <i className="fa-solid fa-bars mr-2"></i>
                        Menu
                    </Button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-200">
                                <Skeleton className="h-6 w-24 bg-slate-200 mb-2" />
                                <Skeleton className="h-4 w-full bg-slate-200" />
                            </div>
                            <div className="p-4">
                                <Skeleton className="h-16 w-full mb-4 bg-slate-200" />
                                <Skeleton className="h-9 w-28 bg-slate-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="container mx-auto">
                {isMobile && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openMobileSidebar}
                        className="mb-4 bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        <i className="fa-solid fa-bars mr-2"></i>
                        Menu
                    </Button>
                )}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-exclamation-triangle text-red-500 text-xl"></i>
                            <div>
                                <h3 className="font-semibold text-red-800">Error Loading Documentation</h3>
                                <p className="text-red-600 text-sm mt-1">Failed to load documentation. Please try again later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


     if (data === null) {
        return (
             <div className="container mx-auto">
                {isMobile && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openMobileSidebar}
                        className="mb-4 bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        <i className="fa-solid fa-bars mr-2"></i>
                        Menu
                    </Button>
                )}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-exclamation-triangle text-blue-600 text-xl"></i>
                            <div>
                                <h3 className="font-semibold text-blue-800">No Documentation created Yet</h3>
                                <p className="text-blue-600 text-sm mt-1">Failed to load documentation. Please try again later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        )
    }


    return (
        <div className="mx-auto space-y-6 h-full overflow-y-auto custom-scrollbar">
            {isChild ? (
                <Outlet />
            ) : (
                <>
                    <div className="space-y-4">
                        <div className="flex flex-col space-y-1">
                            <div className="flex gap-2 items-center">
                                {isMobile && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={openMobileSidebar}
                                        className="bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100"
                                    >
                                        <i className="fa-solid fa-bars "></i>
                                    </Button>
                                )}

                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-600">Project Documentation</h1>
                            </div>
                            <p className="text-slate-600 text-sm sm:text-xl">Track and manage documentation across all project stages</p>

                        </div>
                        {data?.stages?.length ? (
                            <>
                                <div className="flex justify-between items-center gap-2 text-sm text-slate-500">
                                    <div>
                                        <i className="fa-solid fa-file-text text-indigo-500"></i>
                                        <span>{data.stages.length} stages available</span>
                                    </div>

                                    <div>
                                        <Button isLoading={isFetching} onClick={() => refetch()}>
                                            <i className="fas fa-refresh mr-1"></i> Sync
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data.stages.map((stage: DocumentStage) => (
                                        <div
                                            key={stage.stageNumber}
                                            className="group relative bg-white rounded-lg border-l-4  shadow-sm border-indigo-600 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                        >
                                            {/* Left Border Accent */}

                                            {/* Header */}
                                            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                                                            {stage.stageNumber}
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-slate-800">Stage {stage.stageNumber}</h3>
                                                    </div>
                                                    {/* <Badge className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">
                            <i className="fa-solid fa-clock mr-1"></i>
                            Active
                          </Badge> */}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 space-y-4">
                                                <p className="text-sm text-slate-600 line-clamp-3 min-h-[3rem] leading-relaxed">
                                                    {stage.description || "No description provided for this stage."}
                                                </p>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <i className="fa-solid fa-check-circle text-emerald-500"></i>
                                                        <span>Ready to view</span>
                                                    </div>

                                                    <Link to={`${stage.stageNumber}`}>
                                                        <Button
                                                            size="sm"
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                                <i className="fa-solid fa-file-text text-5xl text-slate-400 mb-4"></i>
                                <h3 className="text-lg font-semibold mb-2 text-slate-800">No Documentation Available</h3>
                                <p className="text-slate-600">
                                    Documentation stages will appear here once they are created for this project.
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default DocumentationMain
