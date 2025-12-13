import { useDeleteShortListedPdf, useGetShortlistedDesigns } from '../../../../apiList/Stage Api/shortListApi'
import { Card, CardContent } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { downloadImage } from '../../../../utils/downloadFile'
import { toast } from '../../../../utils/toast'
import MaterialOverviewLoading from '../../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading'
import { useAuthCheck } from '../../../../Hooks/useAuthCheck'

const ShortListPdfList = ({ projectId }: { projectId: string }) => {
    const { data, isLoading, isError, error } = useGetShortlistedDesigns(projectId)



    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.sampledesign?.delete;
    // const canList = role === "owner" || permission?.sampledesign?.list;
    // const canCreate = role === "owner" || permission?.sampledesign?.create;
    // const canEdit = role === "owner" || permission?.sampledesign?.create;



    const { mutateAsync: deletePdf, isPending: deletepdfPending } = useDeleteShortListedPdf()

    // console.log("data form pdf", data)

    const handleDeletePdf = async (id: string) => {
        try {
            await deletePdf({ id: id!, projectId });
            toast({ title: "Success", description: "PDF deleted" });
            // refetch()
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "failed to delete" });
        }
    };

    if (isLoading) {
        return <div className='max-h-50 overflow-y-auto w-full'>
            <MaterialOverviewLoading />
        </div>
    }

    if (isError) {
        <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
            <i className="fa-solid fa-file-lines text-5xl text-blue-300 mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-1">Somethink went wrong</h3>
            {(error as any)?.response?.data?.message || error?.message && <p className="text-sm text-gray-500">
                {(error as any)?.response?.data?.message || error?.message || "No PDF Generated"}</p>}
        </div>

    }


    return (
        <div className="max-w-full px-4 mx-auto py-2">
            <header className="flex gap-2 items-center justify-between">
                <div className="flex gap-2">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">Shortlisted Pdf's</h1>
                        {/* <p className="text-gray-600 hidden sm:inline-block text-sm md:text-md">
                      Select and organize your favorite design references for easy access
                    </p> */}
                    </div>
                </div>
            </header>


            <section className='gap-4 flex flex-col'>
                {data?.length > 0 ? data?.map((pdf: any) => {
                    return (
                        <Card key={pdf._id} className="border-green-200 bg-green-50">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <i className="fas fa-check-circle text-green-600"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-900 mb-1">
                                                {/* PDF Generated Successfully */}
                                                {pdf?.pdfLink?.originalName}
                                            </h4>
                                            {/* <span className="text-sm">Pdf Reference Id: {ele.refUniquePdf || "N/A"}</span> */}
                                            <p className="text-sm text-green-700">
                                                Your Design PDF is ready to view or download
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            onClick={() => window.open(pdf?.pdfLink?.url, "_blank")}
                                            className="border-green-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                        >
                                            <i className="fas mr-2 fa-external-link-alt"></i>
                                            View in New Tab
                                        </Button>

                                        <Button
                                            variant="secondary"
                                            onClick={() => downloadImage({ src: pdf?.pdfLink?.url, alt: "Shortlisted designs" })}
                                            className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                        >
                                            Download PDF
                                        </Button>

                                        {canDelete &&  < Button
                                            variant="danger"
                                        isLoading={deletepdfPending}
                                        onClick={() => handleDeletePdf(pdf._id)}
                                        className="border-red-300 bg-red-600 text-white hover:bg-red-600 hover:border-red-400"
                                        >
                                        Delete PDF
                                    </Button>}
                                </div>
                            </div>
                        </CardContent>
                        </Card>
            )
                })
            :
            <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                <i className="fa-solid fa-file-lines text-5xl text-blue-300 mb-4" />
                <h3 className="text-lg font-semibold text-blue-800 mb-1">No Pdf Found</h3>
                <p className="text-sm text-gray-500">
                    No PDF Generated</p>
            </div>

                }
        </section>
        </div >
    )
}

export default ShortListPdfList