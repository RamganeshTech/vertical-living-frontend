// CreateWorkReport.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateWorkReport, useGetWorkReportImages } from "../../../apiList/Stage Api/WorkReports Api/workReportsApi";
import { Input } from "../../../components/ui/Input";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { downloadImage } from "../../../utils/downloadFile";
// import { downloadImage } from "../../../utils/downloadFile";
// import { toPng } from 'html-to-image';

interface Props {
    dailyScheduleId: string;
    date?: string
    dailyTaskId: string
}

type UploadItem = {
    _id?: string;
    type: "image" | "pdf";
    url: string;
    originalName?: string;
};


const CreateWorkReport: React.FC<Props> = ({ dailyScheduleId, dailyTaskId }) => {
    const { projectId, organizationId } = useParams<{
        projectId: string;
        organizationId: string;
    }>();

    const [form, setForm] = useState({
        workerName: "",
        date: new Date().toISOString().substring(0, 10), // current date
        placeOfWork: "",
        reportingTime: "",
        workStartTime: "",
        travelingTime: "",
        workDone: "",
        finishingTime: "",
        shiftDone: "",
        placeOfStay: "",
    });

    const [images, setImages] = useState<UploadItem[]>([]);

    const { data: fetchedImages } = useGetWorkReportImages(projectId!, dailyScheduleId, dailyTaskId);
    const { mutateAsync: createReport, isPending } = useCreateWorkReport();
    console.log("fetchedimages", fetchedImages)

    useEffect(() => {
        if (fetchedImages) {
            setImages(
                fetchedImages.map((img: any) => ({
                    ...img,
                    _id: undefined, // clear old _id, backend will regenerate
                }))
            );
        }
    }, [fetchedImages]);





    // const imageUrlToBase64ViaProxy = async (originalUrl: string): Promise<string> => {
    //   try {
    //     const proxyUrl = `${import.meta.env.VITE_API_URL}/api/workreports/proxyimage?url=${encodeURIComponent(originalUrl)}`;
    // console.log("Proxy image url →", proxyUrl);

    //     const response = await fetch(proxyUrl);
    //     const blob = await response.blob();

    //     return await new Promise((resolve, reject) => {
    //       const reader = new FileReader();
    //       reader.onloadend = () => resolve(reader.result as string);
    //       reader.onerror = reject;
    //       reader.readAsDataURL(blob);
    //     });
    //   } catch (error) {
    //     console.warn("Failed to load base64 from proxy:", originalUrl, error);
    //     return "";
    //   }
    // };


    //    useEffect(() => {
    //   if (!fetchedImages || fetchedImages.length === 0) return;

    //   const loadImagesAsBase64 = async () => {

    //     const results = await Promise.all(
    //       fetchedImages.map((img:any) => imageUrlToBase64ViaProxy(img?.url))
    //     );
    //     console.log("results", results)
    //     setImages(fetchedImages.map((img:any) => ({ ...img, _id: undefined })));
    //     setConvertedImages(results.filter(Boolean)); // remove blank results
    //   };

    //   loadImagesAsBase64();
    // }, [fetchedImages]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            const res = await createReport({
                // await createReport({
                projectId: projectId!,
                organizationId: organizationId!,
                payload: {
                    ...form,
                    images,
                },
            });
            downloadImage({ src: res?.url, alt: res?.fileName })
            toast({ title: "Success", description: "Created report successfully" })
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Report not created" })
        }

    };

    return (
        <>
            <div className="p-4 border border-ash-medium rounded-md bg-brand-surface space-y-4">
                {/* <h2 className="text-lg font-bold text-blue-700">Create Work Report</h2> */}



                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Worker Name</label>
                        <Input name="workerName" value={form.workerName} onChange={handleChange}
                            className="bg-brand-ash border border-ash-medium text-text-main focus:ring-2 focus:ring-ash-medium transition-all shadow-sm w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Date</label>
                        <Input type="date" name="date" value={form.date} onChange={handleChange}
                            className="bg-brand-ash border border-ash-medium text-text-main focus:ring-2 focus:ring-ash-medium transition-all shadow-sm w-full"

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Place of Work</label>
                        <Input name="placeOfWork" value={form.placeOfWork} onChange={handleChange}
                            className="bg-brand-ash border border-ash-medium text-text-main focus:ring-2 focus:ring-ash-medium transition-all shadow-sm w-full"

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Reporting Time</label>
                        <Input type="time" name="reportingTime" value={form.reportingTime} onChange={handleChange}
                            className="bg-brand-ash border border-ash-medium text-text-main focus:ring-2 focus:ring-ash-medium transition-all shadow-sm w-full"

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Work Start Time</label>
                        <Input type="time" name="workStartTime" value={form.workStartTime} onChange={handleChange}
                            className="bg-brand-ash border border-ash-medium text-text-main focus:ring-2 focus:ring-ash-medium transition-all shadow-sm w-full"

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Traveling Time</label>
                        <Input type="time" name="travelingTime" value={form.travelingTime} onChange={handleChange}
                            className="bg-brand-ash border border-ash-medium text-text-main focus:ring-2 focus:ring-ash-medium transition-all shadow-sm w-full"

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Finishing Time</label>
                        <Input type="time" name="finishingTime" value={form.finishingTime} onChange={handleChange}
                            className="bg-brand-ash border border-ash-medium text-text-main focus:ring-2 focus:ring-ash-medium transition-all shadow-sm w-full"

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Shift Done</label>
                        <Input name="shiftDone" value={form.shiftDone} onChange={handleChange}
                            className="bg-brand-ash border border-ash-medium text-text-main focus:ring-2 focus:ring-ash-medium transition-all shadow-sm w-full"

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Place of Stay</label>
                        <Input name="placeOfStay" value={form.placeOfStay} onChange={handleChange}
                            className="bg-brand-ash border border-ash-medium text-text-main focus:ring-2 focus:ring-ash-medium transition-all shadow-sm w-full"

                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Work Done</label>
                    <textarea
                        name="workDone"
                        // className="w-full border px-3 py-2 rounded-md"
                        className="w-full bg-brand-ash border border-ash-medium text-text-main focus:ring-2 focus:ring-ash-medium rounded-lg px-3 py-3 outline-none transition-all shadow-sm resize-none custom-scrollbar placeholder:text-text-muted"
                        rows={3}
                        value={form.workDone}
                        onChange={handleChange}

                    />
                </div>

                <div className="mt-4">
                    <h3 className="text-sm font-bold text-text-main mb-2">Work Images</h3>
                    {images.length === 0 ? (
                        // <p className="text-gray-500 text-sm">No images found for this date.</p>
                        <div className="text-center py-8 border border-dashed border-ash-medium rounded-xl bg-brand-ash/30">
                            <i className="fas fa-image text-3xl text-ash-dark mb-2"></i>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">No images found for this task.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {images.map((img, i) => (
                                <div
                                    key={i}
                                    // className="relative border p-1 rounded-md shadow-sm flex flex-col items-center justify-center"
                                    className="relative bg-brand-surface border border-ash-medium p-2 rounded-xl shadow-sm flex flex-col items-center group hover:shadow-md transition-all"
                                >
                                    <img
                                        src={img?.url}
                                        alt={img?.originalName || "work image"}
                                        // className="w-full h-[150px] object-cover rounded"
                                        className="w-full h-[120px] sm:h-[150px] object-cover rounded-lg border border-ash-light mb-2"
                                    />
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleRemoveImage(i)}
                                        // className="text-xs text-white mt-1 bg-red-600"
                                        className="w-full text-text-muted hover:text-text-main hover:bg-brand-ash border border-transparent hover:border-ash-medium transition-colors shadow-sm"
                                    >
                                        <i className="fas fa-trash mr-1"></i>
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    variant="dark"
                    onClick={handleSubmit}
                    isLoading={isPending}
                    className="w-full sm:w-auto px-4 shadow-sm"
                >
                    <i className="fas fa-save mr-2"></i> Save Report
                </Button>
            </div>



        </>
    );
};

export default CreateWorkReport;