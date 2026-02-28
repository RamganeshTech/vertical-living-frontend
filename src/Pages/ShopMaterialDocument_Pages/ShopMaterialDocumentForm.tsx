import React, { useState } from 'react';
import { Label } from '../../components/ui/Label';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteMaterialShopFile, useExtractMaterialShopDocDetailsV1, useUpdateCategoryNameMaterialShopDoc, useUploadMaterialShopFilesV1 } from '../../apiList/shopMaterialDocument_api/shopMaterialDocumentApi';
import { toast } from '../../utils/toast';
import SearchSelect from '../../components/ui/SearchSelect';
import ShopMaterialCategoryModal from './ShopMaterialCategoryModal';

interface Props {
    mode: 'create' | 'view';
    initialData?: any;
    onSubmit?: (categoryName: string, files: File[]) => void;
    isSubmitting?: boolean;
    materialCategoryOptions?: any[]
    rateConfigCategoryName?: string
    categoryId?: string
}

const ShopMaterialDocumentForm: React.FC<Props> = ({ mode, categoryId, materialCategoryOptions, initialData, rateConfigCategoryName, onSubmit, isSubmitting }) => {
    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string }
    const [categoryName, setCategoryName] = useState(initialData?.categoryName || "");
    const [files, setFiles] = useState<File[]>([]);
    const [viewMode, setViewMode] = useState<'full' | 'extracted'>('full');

    const [isManualEntry, setIsManualEntry] = useState(false);

    // const { mutateAsync: extractionMutate, isPending: isExtracting, variables } = useExtractMaterialShopDocDetails()
    const { mutateAsync: extractionMutateV1, isPending: isExtractingV1, variables: extractV1Variables } = useExtractMaterialShopDocDetailsV1();
    // const { mutateAsync: updateUpload, isPending: isUploading } = useUpdateUploadMaterialShopFiles();
    const { mutateAsync: upsertUpload, isPending: isUpserting } = useUploadMaterialShopFilesV1();
    const { mutateAsync: updateCategory, isPending: isUpdatingCategory } = useUpdateCategoryNameMaterialShopDoc();
    const { mutateAsync: deleteFile, isPending: isDeleting, variables: deleteFileVariables } = useDeleteMaterialShopFile();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ categoryName: initialData?.categoryName || "" });
    const [categoryError, setCategoryError] = useState<string | null>(null);


    const [selectedFile, setSelectedFile] = useState<any>(initialData?.file?.[0] || null);




    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = () => {
        if (onSubmit && files.length > 0) {
            onSubmit(categoryName, files);
            setFiles([])
        }
    };



    // 3. Submit Handler
    const handleUpdateCategory = async () => {
        try {
            await updateCategory({
                id: initialData._id,
                organizationId: organizationId,
                categoryName: editFormData.categoryName
            });
            toast({ title: "Success", description: "Category name updated" });
            setIsEditModalOpen(false);
            // setEditFormData({categoryName: ""})
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Update failed";
            setCategoryError(msg);
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Update failed",
                variant: "destructive"
            });
        }
    };


    // const handleRunExtraction = async (id: string, fileId: string) => {
    //     if (!initialData._id) return
    //     try {
    //         // await uploadFiles({ categoryName, files });
    //         await extractionMutate({ id, fileId })
    //         toast({ title: "Success", description: "Operation successfully" });
    //     } catch (error: any) {
    //         toast({
    //             title: "Error",
    //             description: error?.data?.response?.message || "Operation failed",
    //             variant: "destructive"
    //         });
    //     }
    // };


    const handleExtractionV1 = async (fileId: string) => {
        try {
            await extractionMutateV1({
                id: initialData._id,
                organizationId: initialData.organizationId,
                categoryId: initialData.materialCategoryId,
                fileId: fileId
            });
            toast({ title: "Success", description: "AI has extracted and saved items to Rate Config!" });
        } catch (err: any) {
            toast({ title: "AI Error", description: err?.response?.data?.message || err.message || "Extraction Failed please try again after some time" , variant: "destructive" });
        }
    };


    // const handleAddFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const selectedFiles = Array.from(e.target.files || []);
    //     if (selectedFiles.length === 0) return;

    //     try {
    //         await updateUpload({
    //             categoryId: initialData._id,
    //             files: selectedFiles
    //         });
    //         toast({ title: "Success", description: "Files added to category" });
    //     } catch (error: any) {
    //         toast({ title: "Error", description: error?.response?.data?.message || "Upload Failed", variant: "destructive" });
    //     }
    // };


    const handleUpsertFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        try {
            // Now using the unified Upsert API
            await upsertUpload({
                categoryName: initialData?.categoryName || rateConfigCategoryName,
                materialCategoryId: categoryId!, // From your useParams/props
                organizationId: organizationId!, // From your auth context/params
                files: selectedFiles
            });

            toast({ title: "Success", description: "Catalogue updated successfully" });

            // Reset the input so the same file can be picked again if deleted
            e.target.value = '';
        } catch (error: any) {
            toast({
                title: "Upload Failed",
                description: error?.response?.data?.message || "Check your connection",
                variant: "destructive"
            });
        }
    };



    const handleDeleteFile = async (fileId: string) => {
        try {
            await deleteFile({
                id: initialData._id,
                fileId,
            });

            // 🔹 SYNC STATE: If the deleted file is the one currently being viewed, clear it
            if (selectedFile?._id === fileId) {
                // Option A: Set to null (shows the "Please select a file" state)
                setSelectedFile(null);

                // Option B: Auto-select the next available file if any exist
                // const remainingFiles = initialData.file.filter((f: any) => f._id !== fileId);
                // if (remainingFiles.length > 0) setSelectedFile(remainingFiles[0]);
                // else setSelectedFile(null);
            }

            toast({ title: "Success", description: "Files deleted to category" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "Upload Failed", variant: "destructive" });
        }
    }


    return (
        <div className=" flex flex-col h-full mx-auto">


            {/* --- The Modal --- */}
            {isEditModalOpen && (
                <ShopMaterialCategoryModal
                    formData={editFormData}
                    setFormData={setEditFormData}
                    setModalOpen={setIsEditModalOpen}
                    handleSubmit={handleUpdateCategory}
                    isSubmitting={isUpdatingCategory}
                    errorMessage={categoryError}
                />
            )}

            <header className="sticky top-0 z-20 bg-white border-b border-gray-200  pb-2 pt-2 mb-6 flex justify-between items-center">
                <div className='flex items-center gap-4'>
                    <button
                        type="button"
                        // onClick={() => navigate(-1)}
                        // onClick={() => navigate(http://localhost:5173/organizations/6881a8c24a56bad430507bb8/projects/rateconfig)}
                         onClick={() => navigate("..")}
                        className='bg-blue-50 hover:bg-blue-100 flex items-center justify-center w-9 h-9 border border-blue-200 text-blue-600 cursor-pointer rounded-md transition-colors'
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <i className="fas fa-receipt mr-3 text-blue-600"></i>
                                {mode === 'create' ? 'New Shop Record' : (rateConfigCategoryName || initialData?.categoryName)}
                            </h1>

                            {/* --- PENCIL ICON FOR EDITING --- */}
                            {/* {mode === 'view' && (
                                <button
                                    onClick={() => {
                                        setEditFormData({ categoryName: initialData?.categoryName || "" });
                                        setIsEditModalOpen(true);
                                    }}
                                    className="flex items-center justify-center w-7 h-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all cursor-pointer"
                                    title="Edit Category Name"
                                >
                                    <i className="fas fa-pencil-alt text-xs"></i>
                                </button>
                            )} */}
                        </div>
                        <p className="text-gray-500 text-sm mt-0.5">
                            {mode === 'create' ? 'Upload shop receipts and categorize them' : ``}
                        </p>
                    </div>


                </div>

                {/* --- Category Input in Header Right --- */}
                <section className='flex gap-4 items-center'>


                    {/* --- VIEW MODE SWITCHER --- */}


                    {mode === "create" && (
                        <div className="flex flex-col pr-6 border-r border-gray-200 group">
                            <div className="flex items-center justify-between mb-1">
                                <Label className="block text-[10px] uppercase tracking-widest font-black text-blue-500">
                                    {isManualEntry ? "New Category" : "Category Name"}
                                </Label>

                                {/* Toggle Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsManualEntry(!isManualEntry);
                                        setCategoryName(""); // Clear name when switching modes
                                    }}
                                    title={isManualEntry ? "Switch to Selection" : "Type New Category"}
                                    className="ml-4 text-[10px] flex items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                                >
                                    {/* <i className={`fas ${isManualEntry ? "fa-switch" : "fa-keyboard"}`}></i> */}
                                    <i className={`fas fa-repeat text-[10px]`}></i>
                                    <span className="font-bold uppercase tracking-tighter">
                                        {/* {isManualEntry ? "Select" : "New"} */}
                                        Switch
                                    </span>
                                </button>
                            </div>

                            <div className="h-[32px] flex items-center">
                                {isManualEntry ? (
                                    /* Manual Text Input */
                                    <Input
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        placeholder="Type new category..."
                                        autoFocus
                                        className="h-9 w-64 bg-white border-blue-200 focus:ring-2 focus:ring-blue-500 transition-all rounded-lg font-semibold text-[14px] shadow-sm"
                                    />
                                ) : (
                                    /* Searchable Select */
                                    <SearchSelect
                                        options={materialCategoryOptions || []}
                                        placeholder="Select Material..."
                                        selectedValue={categoryName || ""}
                                        onSelect={(val) => setCategoryName(val)}
                                        className="h-9 w-64 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all rounded-lg font-semibold text-[14px]"
                                    />
                                )}
                            </div>
                        </div>
                    )}


                    {/* --- Mode Switcher Section --- */}
                    {mode === 'view' && (
                        <div className="flex flex-col">
                            <Label className="mb-1 block text-[10px] uppercase tracking-widest font-black text-blue-500">
                                Display Mode
                            </Label>
                            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 h-[32px] items-center">
                                <button
                                    onClick={() => setViewMode('full')}
                                    className={`px-4 cursor-pointer h-full flex items-center text-[11px] font-bold rounded-lg transition-all ${viewMode === 'full'
                                        ? 'bg-white shadow-sm text-blue-600'
                                        : 'text-gray-500 hover:text-blue-400'
                                        }`}
                                >
                                    <i className="fas fa-file-pdf mr-1.5 text-[10px]"></i>
                                    Full Details
                                </button>
                                <button

                                    onClick={() => setViewMode('extracted')}
                                    className={`px-4 cursor-pointer h-full flex items-center text-[11px] font-bold rounded-lg transition-all ${viewMode === 'extracted'
                                        ? 'bg-white shadow-sm text-blue-600'
                                        : 'text-gray-500 hover:text-blue-400'
                                        }`}
                                >
                                    <i className="fas fa-bolt mr-1.5 text-[10px]"></i>
                                    Extracted
                                </button>
                            </div>
                        </div>
                    )}





                    {/* {mode === 'create' && (
                        <Button
                            variant="primary"
                            onClick={handleUpload}
                            isLoading={isSubmitting}
                            disabled={!categoryName || files.length === 0}
                            className="mt-4 px-6 h-10 shadow-lg shadow-blue-200"
                        >
                            <i className="fa-solid fa-save mr-2"></i> Save Record
                        </Button>
                    )} */}


                    {/* {mode === 'view' && (
                        <div className="flex flex-col">
                            <Label className="mb-0.5 block text-[10px] uppercase tracking-widest font-black text-blue-500">
                                Display Mode
                            </Label>
                            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                                <button
                                    onClick={() => setViewMode('full')}
                                    className={`px-4 cursor-pointer py-1.5 text-[11px] font-bold rounded-lg transition-all ${viewMode === 'full'
                                        ? 'bg-white shadow-sm text-blue-600'
                                        : 'text-gray-500 hover:text-blue-400'
                                        }`}
                                >
                                    <i className="fas fa-file-pdf mr-1.5 text-[10px]"></i>
                                    Full Details
                                </button>
                                <button
                                    onClick={() => setViewMode('extracted')}
                                    className={`px-4 cursor-pointer py-1.5 text-[11px] font-bold rounded-lg transition-all ${viewMode === 'extracted'
                                        ? 'bg-white shadow-sm text-blue-600'
                                        : 'text-gray-500 hover:text-blue-400'
                                        }`}
                                >
                                    <i className="fas fa-bolt mr-1.5 text-[10px]"></i>
                                    Extracted
                                </button>
                            </div>
                        </div>
                    )} */}
                </section>
            </header>




            <main className="flex-1 overflow-y-auto">
                {mode === 'create' ? (
                    <div className="mb-10 overflow-hidden rounded-2xl bg-white shadow-xl shadow-blue-100/40 border border-gray-100">
                        <div className="p-8">
                            <Label className="mb-4 block text-lg font-bold text-gray-800">Upload Document</Label>
                            <div
                                className={`relative rounded-xl border-2 border-dashed transition-all duration-300 p-12 text-center 
                            ${files.length > 0 ? "border-blue-400 bg-blue-50/20" : "border-gray-200 hover:border-blue-500 hover:bg-gray-50"}`}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,image/*"
                                    className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0"
                                    onChange={handleFileChange}
                                />
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                    <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                                </div>
                                <p className="text-lg font-semibold text-gray-800">
                                    {files.length > 0 ? `${files.length} files selected` : "Drop your Shop PDFs or Images here"}
                                </p>
                                <p className="mt-1 text-sm text-gray-400 font-medium italic">
                                    {files.length > 0 ? files.map(f => f.name).join(", ") : "Supported: PDFs"}
                                </p>
                            </div>

                            <div className="mt-8 flex justify-end gap-4">
                                {files.length > 0 && (
                                    <Button variant="ghost" onClick={() => setFiles([])}>Clear</Button>
                                )}
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleUpload}
                                    isLoading={isSubmitting}
                                    disabled={!categoryName || files.length === 0}
                                    className="min-w-[200px]"
                                >
                                    <i className="fa-solid fa-upload mr-2"></i> Upload to Records
                                </Button>
                            </div>
                        </div>
                    </div>
                ) :
                    (
                        // viewMode === 'full' ? (
                        //     <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden h-[80vh]">
                        //         <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                        //             <span className="font-bold text-gray-700">{initialData?.file?.originalName}</span>
                        //             <Button variant="secondary" size="sm" onClick={() => window.open(initialData?.file?.url, '_blank')}>
                        //                 <i className="fa-solid fa-expand mr-2"></i> Open Fullscreen
                        //             </Button>
                        //         </div>
                        //         {initialData?.file?.type === 'pdf' ? (
                        //             <iframe
                        //                 // src={`${initialData.file.url}#toolbar=0`}
                        //                 src={`${initialData.file.url}#view=FitH`}
                        //                 className="w-full h-full border-none"
                        //                 allow="fullscreen"
                        //                 title="PDF Viewer"
                        //                 tabIndex={0}
                        //                 style={{ pointerEvents: 'all' }}
                        //             />
                        //         ) : (
                        //             <div className="w-full h-full flex items-center justify-center bg-gray-100 p-10">
                        //                 <img src={initialData.file.url} alt="Shop Doc" className="max-w-full max-h-full object-contain shadow-2xl" />
                        //             </div>
                        //         )}
                        //     </div>



                        //  new version

                        <div className="flex h-full gap-6">
                            {/* --- LEFT SIDE: FILE LIST --- */}
                            {/* {viewMode === 'full' && <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2">
                                <Label className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                                    Documents ({initialData?.file?.length || 0})
                                </Label>
                                {initialData?.file?.map((f: any) => {
                                    const isActive = selectedFile?._id === f._id;
                                    const isExtracted = f.isExtracted; // Assume this field exists now

                                    return (
                                        <div
                                            key={f._id}
                                            onClick={() => setSelectedFile(f)}
                                            className={`group relative cursor-pointer p-4 rounded-2xl border transition-all duration-300 
                                                ${isActive
                                                ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100'
                                                : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-md'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-gray-50'}`}>
                                                    <i className={`${f.type === 'pdf' ? 'fa-solid fa-file-pdf' : 'fa-solid fa-image'} ${isActive ? 'text-white' : 'text-blue-600'}`}></i>
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                                        {f.originalName}
                                                    </p>
                                                    <div className="flex items-center mt-1">
                                                        <span className={`text-[9px] font-black uppercase ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                                                            {f.type}
                                                        </span>
                                                        <div className={`ml-2 w-1.5 h-1.5 rounded-full ${isExtracted ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRunExtraction(initialData._id, f._id);
                                                }}
                                                isLoading={isExtracting}
                                                className={`w-full h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg border-none ${isActive
                                                        ? 'bg-white/20 text-white hover:bg-white/30'
                                                        : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                                                    }`}
                                            >
                                                <i className={`fas ${isExtracted ? 'fa-sync-alt' : 'fa-robot'} mr-2`}></i>
                                                {isExtracted ? 'Re-Extract' : 'Extract'}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>} */}


                            {viewMode === 'full' && (
                                <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2 border-r border-gray-100">
                                    {/* <Label className="text-[10px] uppercase tracking-widest font-black text-gray-400 px-1">
                                        Documents ({initialData?.file?.length || 0})
                                    </Label> */}

                                    <div className="flex items-center justify-between px-1">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                                            Documents ({initialData?.file?.length || 0})
                                        </Label>

                                        <div className="relative">
                                            <input
                                                type="file"
                                                multiple
                                                accept=".pdf,image/*"
                                                className="hidden"
                                                id="add-more-files"
                                                // onChange={handleAddFiles}
                                                onChange={handleUpsertFiles}
                                            />
                                            <label
                                                htmlFor="add-more-files"
                                                className={`cursor-pointer flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition-all hover:bg-blue-600 hover:text-white
                                                     ${isUpserting ? 'opacity-50 pointer-events-none' : ''
                                                    }`}
                                            >
                                                {isUpserting ? (
                                                    <i className="fas fa-spinner fa-spin text-[10px]"></i>
                                                ) : (
                                                    <i className="fas fa-plus text-[10px]"></i>
                                                )}
                                                <span className="text-[11px] font-bold uppercase tracking-tight">
                                                    {isUpserting ? "Adding..." : "Add file"}
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    {initialData?.file?.map((f: any) => {
                                        const isActive = selectedFile?._id === f._id;
                                        const isExtracted = f.isExtracted;

                                        return (
                                            <div
                                                key={f._id}
                                                onClick={() => setSelectedFile(f)}
                                                className={`group cursor-pointer p-3 rounded-xl border transition-all duration-200 bg-white
                        ${isActive
                                                        ? 'border-blue-500 shadow-sm ring-1 ring-blue-500/10'
                                                        : 'border-gray-100 hover:border-blue-200'
                                                    }`}
                                            >
                                                {/* Header Row: Icon, Name, and Status */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50`}>
                                                        <i className={`${f.type === 'pdf' ? 'fa-solid fa-file-pdf text-red-400' : 'fa-solid fa-image text-blue-400'} text-sm`}></i>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[11px] font-bold text-gray-600 leading-snug line-clamp-2 break-words">
                                                            {f.originalName}
                                                        </p>
                                                        <div className="flex items-center mt-0.5 gap-2">
                                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                                                                {f.type}
                                                            </span>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${isExtracted ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Button Row */}




                                                <div className='flex gap-2 items-center'>


                                                    <Button
                                                        size="sm"
                                                        onClick={(e: React.MouseEvent) => {
                                                            e.stopPropagation();
                                                            // handleRunExtraction(initialData._id, f._id);
                                                            handleExtractionV1(f._id)
                                                        }}
                                                        isLoading={isExtractingV1 && extractV1Variables?.fileId === f._id}
                                                        // disabled={true}
                                                        // title='disabled temporarily'
                                                        className={`w-full  h-7 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-none transition-colors
                            ${isActive
                                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                                : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                                                            }`}
                                                    >
                                                        <i className={`fas ${isExtracted ? 'fa-sync-alt' : 'fa-robot'} mr-2`}></i>
                                                        {isExtracted ? 'Re-Extract' : 'Extract Details'}
                                                    </Button>

                                                    <Button
                                                        onClick={() => handleDeleteFile(f._id)}
                                                        className="hover:text-white text-white bg-red-600 hover:bg-red-600 p-1 transition-colors"
                                                        isLoading={isDeleting && deleteFileVariables.fileId === f._id}
                                                    >
                                                        {/* <i className={`fas ${isDeleting ? "fa-spinner fa-spin" : "fa-trash-alt"} text-xs`}></i> */}
                                                        <i className={`fas fa-trash-alt text-xs`}></i>
                                                    </Button>


                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}



                            {/* --- RIGHT SIDE: VIEWER / TABLE --- */}
                            <div className="flex-1 overflow-hidden">
                                {viewMode === 'full' ?
                                    (
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden h-full flex flex-col">
                                            {selectedFile && <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                                                <span className="font-bold text-gray-700 text-sm truncate max-w-md">
                                                    {selectedFile?.originalName || ""}
                                                </span>
                                                <div className="flex gap-2">
                                                    <Button variant="secondary" size="sm" onClick={() => window.open(selectedFile?.url, '_blank')}>
                                                        <i className="fa-solid fa-expand mr-2"></i> Fullscreen
                                                    </Button>
                                                    {!selectedFile?.isExtracted && (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            // className='!cursor-not-allowed'
                                                            // disabled={true}
                                                            // title='disabled temporarily'
                                                            // onClick={() => handleRunExtraction(initialData._id, selectedFile?._id)}
                                                            onClick={() => handleExtractionV1(selectedFile?._id)}
                                                            isLoading={isExtractingV1}
                                                        >
                                                            <i className="fas fa-magic mr-2"></i> Extract
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>}
                                            <div className="flex-1 bg-gray-100">
                                                {/* {selectedFile?.type === 'pdf' ? (



                                                    // <iframe
                                                    //     src={`${selectedFile.url}#view=FitH`}
                                                    //     className="w-full h-full border-none"
                                                    //     title="PDF Viewer"
                                                    //     tabIndex={0}
                                                    //     style={{ pointerEvents: 'all' }}
                                                    // />

                                                    <iframe
                                                        // src={`${initialData.file.url}#toolbar=0`}
                                                        src={`${selectedFile.url}#view=FitH`}
                                                        className="w-full h-full border-none"
                                                        allow="fullscreen"
                                                        title="PDF Viewer"
                                                        tabIndex={0}
                                                        style={{ pointerEvents: 'all' }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center p-10">
                                                        <img src={selectedFile?.url} alt="Shop Doc" className="max-w-full max-h-full object-contain shadow-2xl" />
                                                    </div>
                                                )} */}


                                                {initialData?.file?.length > 0 ? (
                                                    // CASE 1: Files exist in the category
                                                    selectedFile ? (
                                                        // Sub-Case: A specific file is selected
                                                        selectedFile.type === 'pdf' ? (
                                                            <iframe
                                                                src={`${selectedFile.url}#view=FitH`}
                                                                className="w-full h-full border-none"
                                                                allow="fullscreen"
                                                                title="PDF Viewer"
                                                                style={{ pointerEvents: 'all' }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center p-10">
                                                                <img
                                                                    src={selectedFile.url}
                                                                    alt="Shop Doc"
                                                                    className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                                                                />
                                                            </div>
                                                        )
                                                    ) : (
                                                        // Sub-Case: Files exist but user hasn't clicked one yet
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                                                            <i className="fas fa-arrow-left animate-bounce"></i>
                                                            <p className="font-bold text-sm uppercase tracking-tighter">Please select a file from the sidebar</p>
                                                        </div>
                                                    )
                                                ) : (
                                                    // CASE 2: No files exist at all for this catalogue
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                                                        <i className="fas fa-file-circle-exclamation text-6xl mb-4"></i>
                                                        <p className="font-black text-xs uppercase tracking-[0.2em]">No files uploaded yet</p>
                                                        <p className="text-[10px] mt-2">Upload a PDF or Image to see it here</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                    )
                                    :
                                    (
                                        /* --- PROFESSIONAL EXTRACTED DATA TABLE --- */
                                        // <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col min-h-[60vh]">
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col h-[80vh]">
                                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                                        <i className="fas fa-microchip mr-2 text-blue-600"></i>
                                                        AI Extracted Specifications
                                                    </h3>
                                                    <p className="text-xs text-gray-500">Structured data generated by Gemini 2.0</p>
                                                </div>
                                                {/* <Button
                                                    variant="primary"
                                                    size="sm"
                                                    // onClick={handleRunExtraction}
                                                    onClick={() => handleRunExtraction(initialData._id, selectedFile?._id)}
                                                    isLoading={isExtracting}
                                                    className="shadow-md"
                                                >
                                                    <i className="fas fa-sync-alt mr-2"></i>
                                                    {initialData?.extractDetails?.length > 0 ? 'Re-Extract' : 'Start Extracting'}
                                                </Button> */}
                                            </div>

                                            {/* <div className="flex-1 overflow-x-auto"> */}
                                            <div className="flex-1 overflow-y-auto bg-gray-50/30 custom-scrollbar">
                                                {initialData?.extractDetails?.length > 0 ? (
                                                    // <table className="w-full border-collapse">
                                                    //     <thead>
                                                    //         <tr className="bg-white border-b border-gray-200">
                                                    //             <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest w-16">#</th>
                                                    //             <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Brand</th>
                                                    //             <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Item</th>
                                                    //         </tr>
                                                    //     </thead>
                                                    //     <tbody className="divide-y divide-gray-50">
                                                    //         {initialData.extractDetails.map((item: any, idx: number) => (
                                                    //             <tr key={idx} className="hover:bg-blue-50/20 transition-colors group">
                                                    //                 <td className="px-6 py-4 text-sm text-gray-400 font-mono">{idx + 1}</td>
                                                    //                 <td className="px-6 py-4">
                                                    //                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                                    //                         {item.brand || 'Generic'}
                                                    //                     </span>
                                                    //                 </td>
                                                    //                 <td className="px-6 py-4 text-sm font-semibold text-gray-700 group-hover:text-blue-900">
                                                    //                     {item.itemName}
                                                    //                 </td>

                                                    //             </tr>
                                                    //         ))}
                                                    //     </tbody>
                                                    // </table>


                                                    <div className="flex justify-center bg-gray-50/30 py-8 px-4">
                                                        <div className="w-full max-w-4xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                                            <table className="w-full border-collapse">
                                                                <thead>
                                                                    <tr className="bg-slate-50 border-b border-gray-200">
                                                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-widest w-20">#</th>
                                                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-widest w-1/3">Brand</th>
                                                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-widest">Item</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-gray-100">
                                                                    {initialData.extractDetails.map((item: any, idx: number) => (
                                                                        <tr key={idx} className="hover:bg-blue-50/10 transition-colors group">
                                                                            <td className="px-8 py-4 text-sm text-gray-400 font-mono border-r border-gray-50">
                                                                                {String(idx + 1).padStart(2, '0')}
                                                                            </td>
                                                                            <td className="px-8 py-4 border-r border-gray-50">
                                                                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-black bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-tighter">
                                                                                    {item.brand || 'Generic'}
                                                                                </span>
                                                                            </td>
                                                                            <td className="px-8 py-4 text-sm font-semibold text-gray-700 group-hover:text-blue-900">
                                                                                {item.itemName}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-32">
                                                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100 shadow-inner">
                                                            <i className="fas fa-robot text-3xl text-blue-300"></i>
                                                        </div>
                                                        <h4 className="text-gray-900 font-bold text-lg">No Data Extracted</h4>
                                                        <p className="text-gray-500 text-sm max-w-xs text-center mt-1">
                                                            To Exgtract the limited details from the pdf use the Extract button to automatically identify brands and items from this document.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}
            </main>
        </div>
    );
};

export default ShopMaterialDocumentForm;