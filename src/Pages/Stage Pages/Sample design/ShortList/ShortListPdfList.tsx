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
        // <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
        //     <i className="fa-solid fa-file-lines text-5xl text-blue-300 mb-4" />
        //     <h3 className="text-lg font-semibold text-red-600 mb-1">Somethink went wrong</h3>
        //     {(error as any)?.response?.data?.message || error?.message && <p className="text-sm text-gray-500">
        //         {(error as any)?.response?.data?.message || error?.message || "No PDF Generated"}</p>}
        // </div>


        <div className="flex flex-col items-center justify-center min-h-[250px] w-full bg-brand-surface border border-ash-medium rounded-xl shadow-sm text-center p-6 mt-4">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <i className="fa-solid fa-triangle-exclamation text-2xl text-action-danger" />
            </div>
            <h3 className="text-base font-bold text-text-main mb-1">Something went wrong</h3>
            <p className="text-sm text-text-muted max-w-md">
                {(error as any)?.response?.data?.message || error?.message || "Failed to load generated PDFs."}
            </p>
        </div>
    }


    return (
        <div className="max-w-full px-4 mx-auto py-2">
            <header className="flex gap-2 items-center justify-between">
                <div className="flex gap-2">
                    {/* <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">Shortlisted Pdf's</h1> */}
                    <h1 className="text-lg md:text-xl font-bold text-text-main flex items-center gap-2">
                        <i className="fa-regular fa-file-pdf text-text-muted"></i>
                        Generated PDFs
                    </h1>

                </div>
            </header>


            <section className='gap-4 flex flex-col'>
                {data?.length > 0 ? data?.map((pdf: any) => {
                    return (
                        // <Card key={pdf._id} className="border-green-200 bg-green-50">
                        <Card key={pdf._id} className="border-ash-medium bg-brand-surface shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        {/* <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <i className="fas fa-check-circle text-green-600"></i>
                                        </div> */}

                                        <div className="w-12 h-12 bg-brand-ash border border-ash-light rounded-xl flex items-center justify-center shrink-0">
                                            <i className="fas fa-file-pdf text-text-main text-xl"></i>
                                        </div>
                                        {/* <div>

                                            <h4 className="font-semibold text-green-900 mb-1">
                                                {pdf?.pdfLink?.originalName}
                                            </h4>
                                            <p className="text-sm text-green-700">
                                                Your Design PDF is ready to view or download
                                            </p>
                                        </div> */}

                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-text-main mb-1 truncate">
                                                {pdf?.pdfLink?.originalName || "Design_Reference_Document.pdf"}
                                            </h4>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                                                Your Design PDF is ready to view
                                            </p>
                                        </div>
                                    </div>

                                    {/* <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"> */}

                                    <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto mt-2 lg:mt-0 shrink-0">
                                        <Button
                                            // variant="outline"
                                            variant="white"
                                            onClick={() => window.open(pdf?.pdfLink?.url, "_blank")}
                                            // className="border-green-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                            className="flex-1 sm:flex-none border-ash-medium"
                                        >
                                            {/* <i className="fas mr-2 fa-external-link-alt"></i> */}
                                            <i className="fas mr-2 fa-external-link-alt text-text-muted"></i>
                                            View
                                        </Button>

                                        <Button
                                            variant="dark"
                                            onClick={() => downloadImage({ src: pdf?.pdfLink?.url, alt: "Shortlisted designs" })}
                                            // className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                            className="flex-1 sm:flex-none px-6"
                                        >
                                            Download PDF
                                        </Button>

                                        {canDelete && < Button
                                            // variant="danger"
                                            variant="ghost"
                                            isLoading={deletepdfPending}
                                            onClick={() => handleDeletePdf(pdf._id)}
                                            // className="border-red-300 bg-red-600 text-white hover:bg-red-600 hover:border-red-400"
                                            className="flex-1 sm:flex-none text-action-danger bg-brand-surface border border-ash-light hover:border-ash-dark px-4"
                                        >
                                            {/* Delete PDF */}
                                            <i className="fas fa-trash-can sm:mr-2"></i>
                                            <span className="inline-block">Delete</span>
                                        </Button>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })
                    :
                    // <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                    //     <i className="fa-solid fa-file-lines text-5xl text-blue-300 mb-4" />
                    //     <h3 className="text-lg font-semibold text-blue-800 mb-1">No Pdf Found</h3>
                    //     <p className="text-sm text-gray-500">
                    //         No PDF Generated</p>
                    // </div>

                    <div className="flex flex-col items-center justify-center min-h-[250px] w-full bg-brand-surface border border-ash-medium rounded-xl shadow-sm text-center p-6">
                        <div className="w-16 h-16 bg-brand-ash border border-ash-light rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <i className="fa-regular fa-file-pdf text-2xl text-ash-dark" />
                        </div>
                        <h3 className="text-base font-bold text-text-main mb-1">No PDFs Generated</h3>
                        <p className="text-sm text-text-muted max-w-sm mx-auto">
                            When you generate a PDF from your shortlisted reference designs, it will appear here.
                        </p>
                    </div>

                }
            </section>
        </div >
    )
}

export default ShortListPdfList