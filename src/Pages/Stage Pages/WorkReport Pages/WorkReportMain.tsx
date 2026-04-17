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
        try {
            await deleteReport({ id, projectId: projectId! });
            toast({ title: "Success", description: "deleted successfully" })
        }
        catch (error: any) {
            toast({ title: "Error", description: error.response.data.message || "delete operation failed", variant: "destructive" })
        }
    };

    if (isLoading) return <MaterialOverviewLoading />;

    // console.log("reports", reports)
    return (
        <div className="space-y-4 max-h-full overflow-y-auto bg-brand-surface">

            <header>

                <div className="flex gap-2 items-center">
                    <button
                        className="bg-brand-surface border border-ash-medium hover:bg-brand-ash text-text-muted hover:text-text-main rounded-lg w-10 h-10 flex items-center justify-center transition-colors shadow-sm shrink-0"
                        onClick={() => navigate(-1)}
                        title="Go Back"
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
                            <div className="w-10 h-10 bg-brand-surface border border-ash-medium rounded-lg hidden sm:flex items-center justify-center shadow-sm shrink-0 ">
                                <i className="fas fa-file-invoice text-text-muted text-lg"></i>
                            </div>
                            Work Reports
                        </h1>
                        {/* <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">
                            Review generated daily completion reports
                        </p> */}
                    </div>
                </div>
            </header>


            {reports?.length > 0
                ?
                <main className="grid grid-cols-3 gap-5">
                    {reports?.map((report: any) => (
                        <>
                            <Card
                                key={report._id}
                                // className="border-l-4 border-blue-600 shadow-sm"
                                className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl  hover:shadow-md transition-all group flex flex-col"
                            >
                                {/* <CardHeader>
                                    <CardTitle>{report.workerName || "Unnamed Worker"}</CardTitle>
                                </CardHeader> */}

                                <CardHeader className="bg-brand-ash/50 border-b border-ash-light p-4">
                                    <CardTitle className="text-base font-bold text-text-main flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-brand-surface border border-ash-medium flex items-center justify-center shrink-0 shadow-sm">
                                            <i className="fas fa-hard-hat text-text-muted text-sm"></i>
                                        </div>
                                        <span className="truncate group-hover:text-action-primary transition-colors">
                                            {report.workerName || "Unnamed Worker"}
                                        </span>
                                    </CardTitle>
                                </CardHeader>

                                {/* <CardContent className="space-y-1 text-sm text-blue-950">
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
                                        {report?.placeOfWork?.slice(0, 100) + "..." || "-"}
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
                                </CardContent> */}

                                <CardContent className="p-5 flex-1 flex flex-col">
                                    <div className="space-y-4 flex-1">
                                        {/* Date */}
                                        <div className="flex items-start gap-3">
                                            <i className="fas fa-calendar-day text-text-muted mt-0.5 w-4 text-center"></i>
                                            <div>
                                                <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Date</span>
                                                <span className="font-bold text-text-main text-sm">
                                                    {report?.date ? new Date(report.date).toLocaleDateString() : "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Work Done */}
                                        <div className="flex items-start gap-3">
                                            <i className="fas fa-briefcase text-text-muted mt-0.5 w-4 text-center"></i>
                                            <div>
                                                <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Work Done</span>
                                                <span className="font-medium text-text-main text-sm leading-snug line-clamp-2">
                                                    {report?.workDone || "-"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Place of Work */}
                                        <div className="flex items-start gap-3">
                                            <i className="fas fa-map-marker-alt text-text-muted mt-0.5 w-4 text-center"></i>
                                            <div>
                                                <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Place of Work</span>
                                                <span className="font-medium text-text-main text-sm leading-snug line-clamp-2">
                                                    {report?.placeOfWork || "-"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 pt-4 border-t border-ash-light flex flex-wrap justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="white"
                                            className="border-ash-medium text-text-main shadow-sm flex-1 sm:flex-none justify-center hover:text-action-primary"
                                            onClick={() => window.open(report?.imageLink?.url, "blank")}
                                        >
                                            <i className="fas fa-eye sm:mr-2" />
                                            <span className="hidden sm:inline">View</span>
                                        </Button>
                                        
                                        <Button
                                            size="sm"
                                            variant="white"
                                            className="border-ash-medium text-text-main shadow-sm flex-1 sm:flex-none justify-center hover:text-action-primary"
                                            onClick={() => downloadImage({ src: report?.imageLink?.url, alt: report?.imageLink?.originalName })}
                                        >
                                            <i className="fas fa-download sm:mr-2" />
                                            <span className="hidden sm:inline">Download</span>
                                        </Button>
                                        
                                        <Button
                                            size="sm"
                                            isLoading={isPending}
                                            variant="ghost"
                                            onClick={() => handleDelete(report._id)}
                                            className="text-text-muted hover:text-action-danger hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors shadow-sm flex-1 sm:flex-none justify-center"
                                        >
                                            <i className="fas fa-trash-can sm:mr-2" />
                                            <span className="hidden sm:inline">Delete</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </>)
                    )
                    }
                </main>
                :
                // <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
                //     <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
                //     <h3 className="text-lg font-semibold text-blue-800 mb-1">No Reports Found</h3>
                //     <p className="text-sm text-gray-500">
                //         Create the Report by select any task in the Work Schedule Calender Page<br />
                //         Click on <strong>"Create Report"</strong> to get started 🚀
                //     </p>
                // </div>
                <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-brand-surface border border-ash-medium rounded-xl shadow-sm text-center p-6">
                        <div className="w-20 h-20 bg-brand-ash border border-ash-light rounded-full flex items-center justify-center mb-5 shadow-sm">
                            <i className="fas fa-folder-open text-4xl text-ash-dark" />
                        </div>
                        <h3 className="text-xl font-bold text-text-main mb-2">No Reports Found</h3>
                        <p className="text-text-muted text-sm font-medium max-w-md mx-auto leading-relaxed">
                            Create a report by selecting a task in the <span className="font-bold text-text-main">Work Schedule Calendar</span> and clicking on <span className="font-bold text-text-main">"Create Report"</span> to get started.
                        </p>
                        
                        <Button 
                            variant="dark" 
                            className="mt-6 shadow-sm px-6"
                            onClick={() => navigate(-1)}
                        >
                            <i className="fas fa-arrow-left mr-2"></i> Go to Calendar
                        </Button>
                    </div>
            }

        </div>
    );
};

export default WorkReportMain;