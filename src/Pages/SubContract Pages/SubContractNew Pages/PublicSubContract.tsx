import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetPublicSubContWorkDetails, useSubmitWorkerInfo, useUploadAfterWorkFiles } from "../../../apiList/SubContract Api/subContractNewApi";
import { toast } from "../../../utils/toast";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import type { SubContractFile } from "./SubContractMain";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import { dateFormate } from "../../../utils/dateFormator";
const PublicSubContract = () => {
  const { subContractId } = useParams();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✅ get ?token=value


  const submitMutation = useSubmitWorkerInfo();

  // const submissionToken = localStorage.getItem("submissionToken")
  const uploadAfterMutation = useUploadAfterWorkFiles();
  // const uploadBeforeMutation = useUploadBeforeWorkFiles();
  const { data: submission, isLoading } = useGetPublicSubContWorkDetails({ subContractId: subContractId! });


  // console.log("submission", submission)


  const [beforeWorkData, setBeforeWorkData] = useState({
    dateOfCommencement: "",
    dateOfCompletion: "",
    workerName: "",
    labourCost: "",
    materialCost: "",
    totalCost: "",
    files: [] as File[]
  });

  const [afterWorkFiles, setAfterWorkFiles] = useState<File[]>([]);
  // const [beforeWorkFiles, setBeforeWorkFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    // Check if submission exists
    // if (submission) {
    //   setStep('after');
    // }

    if (submission) {
      const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        // ✅ Convert to yyyy-mm-dd for input type="date"
        return date.toISOString().split("T")[0];
      };

      setBeforeWorkData({
        dateOfCommencement: formatDate(submission.dateOfCommencement),
        dateOfCompletion: formatDate(submission.dateOfCompletion),
        workerName: submission.workerName || "",
        labourCost: submission.labourCost || 0,
        materialCost: submission.materialCost || 0,
        totalCost: submission.totalCost || 0,
        files: submission.filesBeforeWork || []
      });

      setAfterWorkFiles(submission.filesAfterWork || []);
    }
  }, [submission]);


  if (!token) {
    return <div>
      <p>Check the link is correct, Token is missing</p>
    </div>
  }

  const validateBeforeWork = () => {
    const newErrors: any = {};

    if (!beforeWorkData.workerName) newErrors.workerName = "Worker name is required";
    if (!beforeWorkData.dateOfCommencement) newErrors.dateOfCommencement = "Commencement date is required";
    if (!beforeWorkData.dateOfCompletion) newErrors.dateOfCompletion = "Completion date is required";
    if (!beforeWorkData.labourCost || Number(beforeWorkData.labourCost) <= 0) {
      newErrors.labourCost = "Valid labour cost is required";
    }
    if (!beforeWorkData.materialCost || Number(beforeWorkData.materialCost) <= 0) {
      newErrors.materialCost = "Valid material cost is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleBeforeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBeforeWork()) return;

    try {
      const totalCost = Number(beforeWorkData.labourCost) + Number(beforeWorkData.materialCost);

      await submitMutation.mutateAsync({
        token: token,
        subContractId: subContractId!,
        workerData: {
          dateOfCommencement: beforeWorkData.dateOfCommencement,
          dateOfCompletion: beforeWorkData.dateOfCompletion,
          workerName: beforeWorkData.workerName,
          labourCost: Number(beforeWorkData.labourCost),
          materialCost: Number(beforeWorkData.materialCost),
          totalCost: totalCost,
          status: "pending"
        },
        files: beforeWorkData.files
      });

      // if (result?.data?.submissionToken) {
      //   localStorage.setItem('submissionToken', result?.data?.submissionToken);
      // }

      toast({
        title: "Success",
        description: "Work information submitted successfully"
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to submit information",
        variant: "destructive"
      });
    }
  };



  // const handleBeforeUpload = async () => {
  //   if (beforeWorkFiles.length === 0) {
  //     toast({
  //       title: "Error",
  //       description: "Please upload at least one file",
  //       variant: "destructive"
  //     });
  //     return;
  //   }

  //   try {
  //     await uploadBeforeMutation.mutateAsync({
  //       subContractId: subContractId!,
  //       files: beforeWorkFiles,
  //       submissionToken: submissionToken!
  //     });

  //     toast({
  //       title: "Success",
  //       description: "Before work files uploaded successfully"
  //     });
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error?.message || "Failed to upload files",
  //       variant: "destructive"
  //     });
  //   }
  // };


  const handleAfterUploads = async () => {
    if (afterWorkFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one file",
        variant: "destructive"
      });
      return;
    }

    try {
      await uploadAfterMutation.mutateAsync({
        subContractId: subContractId!,
        files: afterWorkFiles,

      });

      toast({
        title: "Success",
        description: "After work files uploaded successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to upload files",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const files = Array.from(e.target.files || []);
    if (type === 'before') {
      setBeforeWorkData(prev => ({ ...prev, files }));
    } else {
      setAfterWorkFiles(files);
    }
  };

  const calculateTotal = () => {
    const labour = Number(beforeWorkData.labourCost) || 0;
    const material = Number(beforeWorkData.materialCost) || 0;
    return labour + material;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <i className="fas fa-spinner fa-spin text-4xl text-text-main"></i>
      </div>
    );
  }


  const getWorkOrderCreatedBy = () => {
    const { workOrderCreatedBy } = submission
    if (workOrderCreatedBy?.username) {
      return workOrderCreatedBy?.username
    } else if (workOrderCreatedBy?.staffName) {
      return workOrderCreatedBy?.staffName
    } else if (workOrderCreatedBy?.CTOName) {
      return workOrderCreatedBy?.CTOName
    }
    return ""
  }
  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header Section */}
      <header className="bg-brand-surface border-b border-ash-light sticky top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
                    <i className="fas fa-hard-hat mr-3 text-blue-600"></i>
                    Sub Contract Work Portal
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">Submit your work details and upload documentation</p>
                </div>
              </div>

              {submission?.status && (
                <div className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2
                ${submission.status === 'pending' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    submission.status === 'accepted' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      'bg-gray-100 text-gray-700 border border-gray-300'}`}>
                  <i className={`fas ${submission.status === 'pending' ? 'fa-clock' :
                    submission.status === 'accepted' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                  <span className="hidden sm:inline">Status:</span> {submission.status.toUpperCase()}
                </div>
              )}
            </div> */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-ash border border-ash-medium rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <i className="fas fa-hard-hat text-action-primary text-lg"></i>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-text-main">
                    Sub Contract Work Portal
                  </h1>
                  <p className="text-[10px] font-bold tracking-wider text-text-muted mt-1">Submit your work details and documentation</p>
                </div>
              </div>

              {/* Status Badge */}
              {submission?.status && (
                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border shadow-sm w-fit
                                ${submission.status === 'pending' ? 'bg-brand-ash text-text-muted border-ash-medium' :
                    submission.status === 'accepted' ? 'bg-action-primary/10 text-action-primary border-action-primary/30' :
                      'bg-brand-surface text-text-main border-ash-medium'}`}>
                  <i className={`fas ${submission.status === 'pending' ? 'fa-clock' :
                    submission.status === 'accepted' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                  <span className="hidden sm:inline text-text-muted mr-1">Status:</span> {submission.status}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Info Bar - Part of Header */}
        <div className="bg-brand-ash/50 border-t border-ash-light">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap items-center gap-6">

              {/* <div className="flex items-center gap-2">
                <i className="fas fa-project-diagram text-blue-200"></i>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-blue-200">Project:</span>
                  <span className="font-semibold text-sm">{submission?.projectId?.projectName || "Loading..."}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <i className="fas fa-briefcase text-blue-200"></i>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-blue-200">Work:</span>
                  <span className="font-semibold text-sm">{submission?.workName || "Loading..."}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <i className="fas fa-user-tie text-blue-200"></i>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-blue-200">Created By:</span>
                  <span className="font-semibold text-sm">{getWorkOrderCreatedBy() || "Loading..."}</span>
                </div>
              </div> */}

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 bg-brand-surface border border-ash-light px-3 py-1.5 rounded-md shadow-sm">
                  <i className="fas fa-project-diagram text-text-muted text-[10px]"></i>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Project:</span>
                  <span className="font-bold text-xs text-text-main">{submission?.projectId?.projectName || "Loading..."}</span>
                </div>

                <div className="flex items-center gap-2 bg-brand-surface border border-ash-light px-3 py-1.5 rounded-md shadow-sm">
                  <i className="fas fa-briefcase text-text-muted text-[10px]"></i>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Work:</span>
                  <span className="font-bold text-xs text-text-main">{submission?.workName || "Loading..."}</span>
                </div>

                <div className="flex items-center gap-2 bg-brand-surface border border-ash-light px-3 py-1.5 rounded-md shadow-sm">
                  <i className="fas fa-user-tie text-text-muted text-[10px]"></i>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Created By:</span>
                  <span className="font-bold text-xs text-text-main">{getWorkOrderCreatedBy() || "Loading..."}</span>
                </div>
              </div>

              {/* Progress Indicator in Header */}
              {/* <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${submission ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'
                    }`}>
                    {submission ? <i className="fas fa-check"></i> : '1'}
                  </div>
                  <span className="text-xs">Before Work</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${submission?.filesAfterWork?.length > 0 ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'
                    }`}>
                    {submission?.filesAfterWork?.length > 0 ? <i className="fas fa-check"></i> : '2'}
                  </div>
                  <span className="text-xs">After Work</span>
                </div>
              </div> */}

              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${submission ? 'bg-action-primary/10 border-action-primary/30 text-action-primary' : 'bg-brand-surface border-ash-medium text-text-muted'}`}>
                  <i className={`fas ${submission ? 'fa-check-circle' : 'fa-circle'} text-[10px]`}></i>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Before Work</span>
                </div>
                <i className="fas fa-chevron-right text-ash-dark text-[10px]"></i>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${submission?.filesAfterWork?.length > 0 ? 'bg-action-primary/10 border-action-primary/30 text-action-primary' : 'bg-brand-surface border-ash-medium text-text-muted'}`}>
                  <i className={`fas ${submission?.filesAfterWork?.length > 0 ? 'fa-check-circle' : 'fa-circle'} text-[10px]`}></i>
                  <span className="text-[10px] font-bold uppercase tracking-wider">After Work</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Before Work Section */}
          <div>
            <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-brand-ash/50 border-b border-ash-light py-3 px-5">
                <CardTitle className="text-sm font-bold text-text-main flex items-center">
                  <i className="fas fa-clipboard-check mr-2 text-action-primary"></i>
                  Before Work Information
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleBeforeSubmit} className="space-y-5">
                  {/* Worker Name */}
                  <div>
                    <Label htmlFor="workerName" className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">
                      Worker Name <span className="text-action-danger">*</span>
                    </Label>
                    <Input
                      id="workerName"
                      value={beforeWorkData.workerName}
                      onChange={(e) => setBeforeWorkData(prev => ({ ...prev, workerName: e.target.value }))}
                      placeholder="Enter your full name"
                      className={`bg-brand-surface border-ash-medium focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 text-text-main h-10 text-sm transition-all ${errors.workerName ? 'border-action-danger focus:border-action-danger focus:ring-action-danger/20' : ''}`}
                    />
                    {errors.workerName && (
                      <p className="text-[10px] font-bold text-action-danger mt-1.5"><i className="fas fa-exclamation-circle mr-1"></i>{errors.workerName}</p>
                    )}
                  </div>

                  {/* Date Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfCommencement" className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">
                        Start Date <span className="text-action-danger">*</span>
                      </Label>
                      <Input
                        id="dateOfCommencement"
                        type="date"
                        value={beforeWorkData.dateOfCommencement}
                        onChange={(e) => setBeforeWorkData(prev => ({ ...prev, dateOfCommencement: e.target.value }))}
                        className={`bg-brand-surface border-ash-medium focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 text-text-main h-10 text-sm transition-all uppercase ${errors.dateOfCommencement ? 'border-action-danger' : ''}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor="dateOfCompletion" className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">
                        End Date <span className="text-action-danger">*</span>
                      </Label>
                      <Input
                        id="dateOfCompletion"
                        type="date"
                        value={beforeWorkData.dateOfCompletion}
                        onChange={(e) => setBeforeWorkData(prev => ({ ...prev, dateOfCompletion: e.target.value }))}
                        className={`bg-brand-surface border-ash-medium focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 text-text-main h-10 text-sm transition-all uppercase ${errors.dateOfCompletion ? 'border-action-danger' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Cost Section */}
                  <div className="bg-brand-ash/30 p-5 rounded-xl border border-ash-light">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-main mb-4 flex items-center">
                      <i className="fas fa-coins text-text-muted mr-2"></i> Cost Breakdown
                    </h4>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="labourCost" className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">
                          Labour Cost <span className="text-action-danger">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted text-xs">₹</span>
                          <Input
                            id="labourCost"
                            type="number"
                            value={beforeWorkData.labourCost}
                            onChange={(e) => setBeforeWorkData(prev => ({ ...prev, labourCost: e.target.value }))}
                            placeholder="0"
                            className={`bg-brand-surface border-ash-medium focus:border-action-primary pl-7 text-text-main h-10 text-sm transition-all ${errors.labourCost ? 'border-action-danger' : ''}`}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="materialCost" className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">
                          Material Cost <span className="text-action-danger">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted text-xs">₹</span>
                          <Input
                            id="materialCost"
                            type="number"
                            value={beforeWorkData.materialCost}
                            onChange={(e) => setBeforeWorkData(prev => ({ ...prev, materialCost: e.target.value }))}
                            placeholder="0"
                            className={`bg-brand-surface border-ash-medium focus:border-action-primary pl-7 text-text-main h-10 text-sm transition-all ${errors.materialCost ? 'border-action-danger' : ''}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Total Cost Highlight */}
                    <div className="bg-brand-surface rounded-xl p-4 border border-ash-medium shadow-sm flex justify-between items-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-action-primary"></div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted pl-2">Total Estimated Cost</span>
                      <div className="text-2xl font-bold text-action-primary">
                        ₹ {calculateTotal().toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>



                  {/* File Upload */}
                  <div>
                    <Label htmlFor="beforeFiles" className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">
                      Before Work Photos/Documents
                    </Label>
                    <div className="mt-1 bg-brand-surface border-2 border-dashed border-ash-medium rounded-xl p-4 hover:border-action-primary/50 hover:bg-brand-ash/30 transition-all cursor-pointer relative">
                      <Input
                        id="beforeFiles"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'before')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-center pointer-events-none">
                        <i className="fas fa-cloud-upload-alt text-2xl text-ash-dark mb-2"></i>
                        <p className="text-xs font-bold text-text-main">Click or drag files here to upload</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">Supports Images & PDFs</p>
                      </div>
                    </div>
                  </div>


                  {/* Display Existing Before Work Files */}
                  {submission?.filesBeforeWork && submission.filesBeforeWork.length > 0 && (
                    // <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-4 mt-4 p-5 bg-brand-ash/30 border border-ash-light rounded-xl">
                      {/* Images Section */}
                      {submission.filesBeforeWork.some((file: SubContractFile) => file.type === "image") && (
                        <div>
                          {/* <div className="flex items-center gap-2 mb-3">
                            <i className="fas fa-images text-blue-600"></i>
                            <h4 className="font-semibold text-gray-800 text-sm">Images</h4>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {submission.filesBeforeWork.filter((f: SubContractFile) => f.type === "image").length}
                            </span>
                          </div>


                          <ImageGalleryExample
                            imageFiles={submission.filesBeforeWork.filter((file: SubContractFile) => file.type === "image")}
                            height={150}
                            minWidth={150}
                            maxWidth={200}
                          /> */}

                          <div className="flex items-center gap-2 mb-3 border-b border-ash-medium/50 pb-2">
                            <i className="fas fa-images text-text-muted"></i>
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-main">Uploaded Images</h4>
                            <span className="text-[9px] font-bold bg-brand-surface border border-ash-medium text-text-muted px-2 py-0.5 rounded-full ml-auto">
                              {submission.filesBeforeWork.filter((f: SubContractFile) => f.type === "image").length} Files
                            </span>
                          </div>
                          <ImageGalleryExample
                            imageFiles={submission.filesBeforeWork.filter((file: SubContractFile) => file.type === "image")}
                            height={150} minWidth={150} maxWidth={200}
                          />

                        </div>
                      )}

                      {/* PDFs Section */}
                      {/* PDFs Section */}
                      {submission.filesBeforeWork.some((file: SubContractFile) => file.type === "pdf") && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-3 border-b border-ash-medium/50 pb-2">
                            <i className="fas fa-file-pdf text-text-muted"></i>
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-main">Uploaded Documents</h4>
                            <span className="text-[9px] font-bold bg-brand-surface border border-ash-medium text-text-muted px-2 py-0.5 rounded-full ml-auto">
                              {submission.filesBeforeWork.filter((f: SubContractFile) => f.type === "pdf").length} Files
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {submission.filesBeforeWork
                              .filter((file: SubContractFile) => file.type === "pdf")
                              .map((file: SubContractFile, i: number) => (
                                <div key={i} className="flex items-center justify-between gap-4 bg-brand-surface p-3 rounded-xl border border-ash-light hover:border-ash-medium transition-all group shadow-sm">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 bg-brand-ash rounded-lg flex items-center justify-center border border-ash-medium shrink-0">
                                      <i className="fas fa-file-pdf text-ash-dark text-lg"></i>
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-text-main truncate">
                                        {file.originalName || `Document ${i + 1}.pdf`}
                                      </p>
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-0.5">
                                        {dateFormate(file.uploadedAt)}
                                      </p>
                                    </div>
                                  </div>
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 px-3 py-1.5 bg-brand-ash text-text-main border border-ash-medium rounded-lg hover:text-action-primary hover:bg-brand-surface hover:border-action-primary/30 transition-all text-[10px] font-bold uppercase tracking-wider shadow-sm"
                                    title="Open in new tab"
                                  >
                                    Open <i className="fas fa-external-link-alt ml-1"></i>
                                  </a>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="dark"
                    className="w-full h-11 shadow-sm mt-4"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      <><i className="fas fa-spinner fa-spin mr-2"></i> Submitting...</>
                    ) : (
                      <><i className="fas fa-paper-plane mr-2"></i> Submit Before Work Details</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* After Work Section */}
          <div>
            <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-brand-ash/50 border-b border-ash-light py-3 px-5">
                <CardTitle className="text-sm font-bold text-text-main flex items-center">
                  <i className="fas fa-camera-retro mr-2 text-action-primary"></i>
                  After Work Documentation
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                {/* Display Existing After Work Files */}
                {submission?.filesAfterWork && submission.filesAfterWork.length > 0 && (
                  // <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4 mb-6 p-4 bg-brand-ash/30 border border-ash-light rounded-xl">
                    {/* Images Section */}
                    {submission.filesAfterWork.some((file: SubContractFile) => file.type === "image") && (
                      <div>
                        <div className="flex items-center gap-2 mb-3 border-b border-ash-medium/50 pb-2">
                          <i className="fas fa-images text-text-muted"></i>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-main">Uploaded Images</h4>
                          <span className="text-[9px] font-bold bg-brand-surface border border-ash-medium text-text-muted px-2 py-0.5 rounded-full ml-auto">
                            {submission.filesAfterWork.filter((f: SubContractFile) => f.type === "image").length} Files
                          </span>
                        </div>
                        <ImageGalleryExample
                          imageFiles={submission.filesAfterWork.filter((file: SubContractFile) => file.type === "image")}
                          height={150} minWidth={150} maxWidth={200}
                        />
                      </div>
                    )}

                    {/* PDFs Section */}
                    {submission.filesAfterWork.some((file: SubContractFile) => file.type === "pdf") && (
                      <div>

                        <div className="space-y-2">
                          {submission.filesAfterWork.some((file: SubContractFile) => file.type === "pdf") && (
                            <div className="mt-4">
                              <div className="flex items-center gap-2 mb-3 border-b border-ash-medium/50 pb-2">
                                <i className="fas fa-file-pdf text-text-muted"></i>
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-main">Uploaded Documents</h4>
                                <span className="text-[9px] font-bold bg-brand-surface border border-ash-medium text-text-muted px-2 py-0.5 rounded-full ml-auto">
                                  {submission.filesAfterWork.filter((f: SubContractFile) => f.type === "pdf").length} Files
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-3">
                                {submission.filesAfterWork
                                  .filter((file: SubContractFile) => file.type === "pdf")
                                  .map((file: SubContractFile, i: number) => (
                                    <div key={i} className="flex items-center justify-between gap-4 bg-brand-surface p-3 rounded-xl border border-ash-light hover:border-ash-medium transition-all group shadow-sm">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 bg-brand-ash rounded-lg flex items-center justify-center border border-ash-medium shrink-0">
                                          <i className="fas fa-file-pdf text-ash-dark text-lg"></i>
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-xs font-bold text-text-main truncate">
                                            {file.originalName || `Document ${i + 1}.pdf`}
                                          </p>
                                          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-0.5">
                                            {dateFormate(file.uploadedAt)}
                                          </p>
                                        </div>
                                      </div>
                                      <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 px-3 py-1.5 bg-brand-ash text-text-main border border-ash-medium rounded-lg hover:text-action-primary hover:bg-brand-surface hover:border-action-primary/30 transition-all text-[10px] font-bold uppercase tracking-wider shadow-sm"
                                        title="Open in new tab"
                                      >
                                        Open <i className="fas fa-external-link-alt ml-1"></i>
                                      </a>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="afterFiles" className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">
                      After Work Photos/Documents <span className="text-action-danger">*</span>
                    </Label>
                    <div className="mt-1 bg-brand-surface border-2 border-dashed border-ash-medium rounded-xl p-4 hover:border-action-primary/50 hover:bg-brand-ash/30 transition-all cursor-pointer relative">
                      <Input
                        id="afterFiles"
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, 'after')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-center pointer-events-none">
                        <i className="fas fa-cloud-upload-alt text-2xl text-ash-dark mb-2"></i>
                        <p className="text-xs font-bold text-text-main">Click or drag files here to upload</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">Supports Images & PDFs</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleAfterUploads}
                    variant="dark"
                    className="w-full h-11 shadow-sm"
                    disabled={uploadAfterMutation.isPending}
                  >
                    {uploadAfterMutation.isPending ? (
                      <><i className="fas fa-spinner fa-spin mr-2"></i> Uploading...</>
                    ) : (
                      <><i className="fas fa-cloud-upload-alt mr-2"></i> Upload After Work Files</>
                    )}
                  </Button>


                  {/* Info Banner */}
                  <div className="bg-brand-ash/50 border border-ash-medium rounded-xl p-3 flex items-start gap-3 mt-2">
                    <i className="fas fa-info-circle text-text-muted mt-0.5"></i>
                    <p className="text-[11px] font-bold text-text-muted leading-tight">
                      Please ensure you have submitted the "Before Work Details" (Step 1) prior to uploading the final completion files.
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicSubContract;