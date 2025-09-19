// WorkReportMain.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteWorkReportById, useGetWorkReportsByProjectId } from "../../../apiList/Stage Api/WorkReports Api/workReportsApi";
import { Button } from "../../../components/ui/Button";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { downloadImage } from "../../../utils/downloadFile";
import { toast } from "../../../utils/toast";
// import { useGetWorkReportsByProjectId, useDeleteWorkReportById } from "@/hooks/workReports";

const WorkReportMain = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { data: reports, isLoading } = useGetWorkReportsByProjectId(projectId!);
    const { mutateAsync: deleteReport, isPending } = useDeleteWorkReportById();
    const navigate = useNavigate()
    const handleDelete = async (id: string) => {
        try{
            await deleteReport({ id, projectId: projectId! });
            toast({title:"Success", description:"deleted successfully"})
        }
        catch(error:any){
            toast({title:"Error", description:error.response.data.message || "delete operation failed", variant:"destructive"})
        }
    };

    if (isLoading) return <MaterialOverviewLoading />;

console.log("reports", reports)
    return (
        <div className="space-y-4 max-h-full overflow-y-auto">

            <header>

                <div className="flex gap-2 items-center">
                    <div onClick={() => navigate(-1)}
                        className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                        <i className='fas fa-arrow-left'></i>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
                        Work Reports
                    </h1>
                </div>
            </header>


            {reports?.length > 0 
            ?
                <main className="grid grid-cols-3 gap-5">
                    {reports?.map((report: any) => (
                        <>
                            <Card
                                key={report._id}
                                className="border-l-4 border-blue-600 shadow-sm"
                            >
                                <CardHeader>
                                    <CardTitle>{report.workerName || "Unnamed Worker"}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-1 text-sm text-blue-950">
                                    <p>
                                        <i className="fas fa-calendar mr-1 text-gray-500" />
                                        <span className="font-medium text-gray-700">Date:</span>{" "}
                                        {report?.date
                                            ? new Date(report.date).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                    <p>
                                        <i className="fas fa-briefcase mr-1 text-gray-500" />
                                        <span className="font-medium text-gray-700">Work Done:</span>{" "}
                                        {report?.workDone?.slice(0, 100) + "..." || "-"}
                                    </p>
                                    <p>
                                        <i className="fas fa-map-marker-alt mr-1 text-gray-500" />
                                        <span className="font-medium text-gray-700">Place of Work:</span>{" "}
                                        {report?.placeOfWork?.slice(0, 100) + "..."|| "-"}
                                    </p>

                                    <div className="mt-4 flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => window.open(report?.imageLink?.url, "blank")}
                                        >
                                            <i className="fas fa-eye mr-1" />
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => downloadImage({ src: report?.imageLink?.url, alt: report?.imageLink?.originalName })}
                                        >
                                            <i className="fas fa-download mr-1" />
                                            Download
                                        </Button>
                                        <Button
                                            size="sm"
                                            isLoading={isPending}
                                            variant="danger"
                                            onClick={() => handleDelete(report._id)}
                                            className="text-white bg-red-600"
                                        >
                                            <i className="fas fa-trash mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </>)
                    )
                    }
                </main>
                :
                <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
                    <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">No Reports Found</h3>
                    <p className="text-sm text-gray-500">
                        Create the Report by select any task in the Work Schedule Calender Page<br />
                        Click on <strong>"Create Report"</strong> to get started 🚀
                    </p>
                </div>
            }

        </div>
    );
};

export default WorkReportMain;