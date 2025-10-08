import { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useDeleteWorkLibrary, useGetAllWorkLibraries } from "../../apiList/workLibrary Api/workLibraryApi";
import useGetRole from "../../Hooks/useGetRole";
import { Button } from "../../components/ui/Button";

import { toast } from "../../utils/toast";
import MaterialOverviewLoading from "../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import WorkLibraryCard from "./WorkLibraryCard";
import CreateWorkLib from "./CreateWorkLib";


// Subtask Interface
export interface ISubtask {
    title: string;
    //   description?: string;
}

// Task Interface
export interface ITask {
    title: string;
    // description: string | null;
    //   category: string | null;
    subtasks: ISubtask[];
    estimatedTimeInMinutes: number;

}

// WorkLibrary Interface
export interface IWorkLibrary {
    organizationId?: string
    workName: string;
    description: string | null;
    tags?: string[] | null;
    tasks: ITask[];
}



const WorkLibraryMain = () => {
    const { organizationId } = useParams() as { organizationId: string };
    const { role } = useGetRole();
    const navigate = useNavigate()
    const [dialogOpen, setDialogOpen] = useState(false)


    const { data: works = [], isLoading, error } = useGetAllWorkLibraries(organizationId!);
    const deleteMutation = useDeleteWorkLibrary();

    const handleDelete = async (workId: string) => {
        try {
            await deleteMutation.mutateAsync({ workId, organizationId })
            toast({ description: 'Work Flow deleted successfully', title: "Success" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete the work flow",
                variant: "destructive"
            });
        }
    }

    const isChild = location.pathname.includes("single")

    if (isChild) {
        return <Outlet />
    }

    if (isLoading) return <MaterialOverviewLoading />

    return (
        <div className="p-2 max-h-full overflow-y-auto">
            {/* Header */}

            <header className="flex justify-between items-center w-full pb-2 border-b border-gray-300">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-code-fork mr-3 text-blue-600"></i>
                        Work Library SOP
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Manage your work flows
                    </p>
                </div>
                <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-blue-600 flex items-center "
                >
                    <i className="fas fa-plus mr-1 text-white"></i>
                    Add Work
                </Button>
            </header>


            {error &&
                <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                    <i className="fas fa-note text-5xl text-blue-300 mb-4" />
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">No WorkFlows Found</h3>
                    <p className="text-sm text-gray-500">
                        Looks like there are no work flow created yet.<br />
                        you can click <strong> add work </strong> to get started 🚀
                    </p>
                    <p className="text-sm text-gray-500">{(error as any)?.response?.data?.message || (error as any)?.message || "something went wrong"}</p>
                </div>
            }


            {dialogOpen && (
                <CreateWorkLib organizationId={organizationId} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
            )}

            {isLoading ? (
                <p><MaterialOverviewLoading /></p>
            ) : !error && works?.length === 0 ? (
                <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                    <i className="fas fa-note text-5xl text-blue-300 mb-4" />
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">No WorkFlows Found</h3>
                    <p className="text-sm text-gray-500">
                        Looks like there are no work flow created yet.<br />
                        you can click <strong> add work </strong> to get started 🚀
                    </p>
                </div>
            ) : (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
                    {works.map((work: any) => (
                        <WorkLibraryCard key={work._id} navigate={navigate} role={role} work={work} onDelete={handleDelete} deletePending={deleteMutation.isPending} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkLibraryMain;