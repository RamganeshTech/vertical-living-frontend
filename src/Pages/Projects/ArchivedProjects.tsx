import ProjectCard from "./ProjectCard"; // reuse same card
import { Button } from "../../components/ui/Button";
import { useGetAllProjects, useToggleProjectArchive } from "../../apiList/projectApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../utils/toast";

const ArchivedProjects = () => {

    const { organizationId } = useParams() as { organizationId: string }

const navigate = useNavigate();
    const { mutateAsync: toggleArchive, } = useToggleProjectArchive();

    const {
        data,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetAllProjects({
        organizationId: organizationId || '',
        limit: 300,
        isArchived: true // ✅ ONLY CHANGE
    });


    const handleToggleArchive = async (project: any) => {
        try {
            await toggleArchive({
                projectId: project._id,
                isArchived: !project.isArchived
            });

            refetch(); // 🔥 THIS IS THE KEY FIX

            toast({
                title: "Success",
                description: project.isArchived
                    ? "Project unarchived successfully"
                    : "Project archived successfully"
            });

        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update archive status",
                variant: "destructive"
            });
        }
    };

    // const projects = data?.pages?.flatMap(page => page.data) || [];
    const projects = data?.pages.flatMap(page => page.data.projects) || [];


    return (
        <div className="flex flex-col h-full">

            {/* 🔹 HEADER */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 flex-shrink-0">
               <div className="flex items-center gap-3 mb-3">
    
    {/* Back Button with your exact requested styling */}
    <button
        onClick={() => navigate(-1)}
        className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer bg-ash-medium border-2 border-ash-medium text-text-main hover:text-action-primary hover:border-ash-dark hover:shadow-md transition-all flex-shrink-0 shadow-sm"
        aria-label="Go back"
    >
        <i className="fa-solid fa-arrow-left"></i>
    </button>

    {/* Text Block */}
    <div className="flex flex-col justify-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-strong flex items-center">
            <i className="fa-solid fa-box-archive mr-3 text-text-main"></i>
            Archived Projects
        </h1>
        <p className="text-sm text-text-muted mt-1 leading-tight">
            View and manage archived projects
        </p>
    </div>
    
</div>
            </header>

            {/* 🔹 STATES */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20 flex-1">
                    <i className="fas fa-spinner fa-spin text-slate-400 text-4xl"></i>
                </div>
            ) : isError ? (
                <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 text-center rounded-xl border border-red-100">
                    <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-3"></i>
                    <p className="text-red-600 font-medium mb-4">
                        {(error as any)?.message}
                    </p>
                    <Button onClick={() => refetch()} variant="outline">
                        Retry Loading
                    </Button>
                </div>
            ) : (
                <main className="flex flex-col gap-6 flex-1 min-h-0 overflow-y-auto">

                    <div className="flex-1 pb-10 custom-scrollbar">

                        {projects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-xl border border-slate-200 border-dashed">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                    <i className="fas fa-box-open text-2xl text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 mb-1">
                                    No Archived Projects
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Archived projects will appear here.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* 🔹 GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                                    {projects.map((project: any) => (
                                        <ProjectCard
                                            key={project._id}
                                            project={project}
                                            organizationId={organizationId}
                                            isArchived={true}
                                            onToggleArchive={() => handleToggleArchive(project)} // ✅ NEW

                                            // ❌ REMOVE ACTIONS
                                            onEdit={() => { }}
                                            onDelete={() => { }}
                                            isDeleting={false}
                                        />
                                    ))}
                                </div>

                                {/* 🔹 LOAD MORE */}
                                {isFetchingNextPage && (
                                    <div className="py-8 flex justify-center w-full">
                                        <div className="bg-white shadow-sm border border-slate-200 px-5 py-2 rounded-full flex items-center gap-2 text-slate-600 font-medium">
                                            <i className="fas fa-circle-notch fa-spin text-slate-400"></i>
                                            <span className="text-xs">
                                                Loading more projects...
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {!hasNextPage && projects.length > 0 && (
                                    <div className="py-8 text-center w-full">
                                        <p className="text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
                                            <i className="fas fa-check-double text-slate-300"></i>
                                            End of archived list
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            )}
        </div>
    );
};

export default ArchivedProjects;