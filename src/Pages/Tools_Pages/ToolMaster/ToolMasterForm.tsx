import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';// import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Label } from '../../../components/ui/Label';
import ImageGalleryExample from '../../../shared/ImageGallery/ImageGalleryMain';
import { Textarea } from '../../../components/ui/TextArea';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';
import SearchSelectNew from '../../../components/ui/SearchSelectNew';
import { useGetAllToolRoomforDD } from '../../../apiList/tools_api/toolOtpApi';
import { useDeleteToolImage, useDeleteWarrantyFile } from '../../../apiList/tools_api/toolMasterApi';
import { toast } from '../../../utils/toast';

const CATEGORIES = [
    "carpentry",
    "tiling",
    "electrical",
    "plumbing",
    "falseCeiling",
    "painting",
    "finishing",
    "measurement",
    "handTools",
    "powerTools",
    "safety",
    "cleaning",
    "other"
];

const CONDITIONS = ["new", "good", "repair"];

// const avaiabilityStatus = ["new", "good", "worn", "repair"];

export interface ToolFormData {
    toolName: string;
    toolCategory: string;
    brand: string;
    modelNumber: string;
    toolRoomId: string | null
    // serialNumber: string;
    conditionStatus: string;
    // availabilityStatus: string;
    purchaseDate: string;
    purchaseValue: number;
    remarks: string;

    warrantyDuration: string;
    serviceLocation: string;
warrantyDetails: string;


    images: File[]; // For new uploads
    warrantyFiles: File[]; // Add this
}

interface ToolMasterFormProps {
    mode: 'create' | 'view' | 'edit';
    initialData?: any;
    organizationId: string;
    isSubmitting: boolean;
    onSubmit: (data: any, newFiles: File[], warrantyFiles: File[]) => Promise<void>;
    onQuickUpload?: (files: File[]) => Promise<void>;
    onQuickUploadWarranty?: (files: File[]) => Promise<void>; // Add this
    refetch?: () => void;
    isWarrantyUploading?: boolean,
    isToolUploading?: boolean,
}

const ToolMasterForm: React.FC<ToolMasterFormProps> = ({
    mode: initialMode,
    initialData,
    // organizationId,
    isSubmitting,
    onSubmit,
    onQuickUpload,
    onQuickUploadWarranty,
    isWarrantyUploading,
    isToolUploading
    // refetch
}) => {


    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string }
    const [currentMode, setCurrentMode] = useState(initialMode);

    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.toolhardware?.list;
    // const canCreate = role === "owner" || permission?.toolhardware?.create;
    // const canDelete = role === "owner" || permission?.toolhardware?.delete;
    const canEdit = role === "owner" || permission?.toolhardware?.edit;




    // --- STATE ---
    const defaultFormData: ToolFormData = {
        toolName: '',
        toolCategory: 'Drill',
        brand: '',
        modelNumber: '',
        toolRoomId: null,
        // serialNumber: '',
        // availabilityStatus: "",
        conditionStatus: "",
        purchaseDate: new Date().toISOString().split('T')[0],
        purchaseValue: 0,
        remarks: '',

        warrantyDuration: "",
        serviceLocation: '',
        warrantyDetails: '',
        images: [],
        warrantyFiles: [] // Add this
    };

    const { data: toolRoom = [] } = useGetAllToolRoomforDD(organizationId);
    // const [toolRoomId, setToolRoomId] = useState<string | null>(null);

    const deleteToolImageMutation = useDeleteToolImage();
    const deleteWarrantyFileMutation = useDeleteWarrantyFile();


    const [formData, setFormData] = useState<ToolFormData>(defaultFormData);

    // --- LOAD DATA ---
    useEffect(() => {
        if (initialData) {
            setFormData({
                toolName: initialData.toolName || '',
                toolCategory: initialData.toolCategory || 'Drill',
                brand: initialData.brand || '',
                modelNumber: initialData.modelNumber || '',
                // serialNumber: initialData.serialNumber || '',
                // availabilityStatus: initialData.availabilityStatus || "",
                toolRoomId: initialData?.toolRoomId?._id || null,
                conditionStatus: initialData?.conditionStatus || "",
                purchaseDate: initialData?.purchaseDate ? new Date(initialData?.purchaseDate).toISOString().split('T')[0] : '',
                purchaseValue: initialData?.purchaseValue || 0,
                remarks: initialData?.remarks || '',

                warrantyDuration: initialData?.warrantyDuration,
                serviceLocation: initialData?.serviceLocation,
                warrantyDetails: initialData?.warrantyDetails,
                images: [],
                warrantyFiles: [] // Add this
            });
        }
    }, [initialData, currentMode]);

    // --- HANDLERS ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         setFormData(p => ({ ...p, images: [...p.images, ...Array.from(e.target.files || [])] }));
    //     }
    // };


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && onQuickUpload) {
            const selectedFiles = Array.from(e.target.files);
            await onQuickUpload(selectedFiles);
        }
    };
    // const removeFile = (index: number) => {
    //     setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    // };

    // const handleWarrantyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         setFormData(p => ({
    //             ...p,
    //             warrantyFiles: [...p.warrantyFiles, ...Array.from(e.target.files || [])]
    //         }));
    //     }
    // };

    const handleWarrantyFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && onQuickUploadWarranty) {
            const selectedFiles = Array.from(e.target.files);
            await onQuickUploadWarranty(selectedFiles);
        }
    };

    // const removeWarrantyFile = (index: number) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         warrantyFiles: prev.warrantyFiles.filter((_, i) => i !== index)
    //     }));
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { images, warrantyFiles, ...textData } = formData;
        // Pass both file arrays to the parent
        await onSubmit(textData, images, warrantyFiles);
        if (currentMode === 'edit') setCurrentMode('view');
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     const { images, ...textData } = formData;
    //     await onSubmit(textData, images);
    //     if (currentMode === 'edit') setCurrentMode('view');
    // };


    // Handler for Tool Images
    const handleDeleteToolImage = async (fileId: string) => {
        try {
            // initialData._id is the toolId
            await deleteToolImageMutation.mutateAsync({
                toolId: initialData._id,
                fileId
            });
            toast({ title: "Success", description: "Tool image removed successfully" });
        } catch (error: any) {
            toast({
                title: "Delete Failed",
                description: error?.message || "Could not delete tool image",
                variant: "destructive"
            });
        }
    };

    // Handler for Warranty Files
    const handleDeleteWarrantyFile = async (fileId: string) => {
        try {
            await deleteWarrantyFileMutation.mutateAsync({
                toolId: initialData._id,
                fileId
            });
            toast({ title: "Success", description: "Warranty file removed successfully" });
        } catch (error: any) {
            toast({
                title: "Delete Failed",
                description: error?.message || "Could not delete warranty file",
                variant: "destructive"
            });
        }
    };


    const toolRoomOptions = toolRoom.map((t: any) => ({
        value: t._id,
        label: `${t.toolRoomName}`,
        // subLabel: t.brand,
    }));

    const handleToolRoomSelection = (id: string | null) => {
        setFormData(p => ({ ...p, toolRoomId: id }));
    };

    // const handleQuickUploadClick = async () => {
    //     if (formData.images.length > 0 && onQuickUpload) {
    //         await onQuickUpload(formData.images);
    //         setFormData(p => ({ ...p, images: [] }));
    //     }
    // };

    // For Warranty Files (Images or PDFs)
    // const handleQuickUploadWarranty = async () => {
    //     if (formData.warrantyFiles.length > 0 && onQuickUploadWarranty) {
    //         await onQuickUploadWarranty(formData.warrantyFiles);
    //         setFormData(p => ({ ...p, warrantyFiles: [] }));
    //     }
    // };


    // Inside ToolMasterForm component
    const warrantyPhotos = initialData?.warrantyFiles?.filter((file: any) => file.type === 'image') || [];
    const warrantyPDFs = initialData?.warrantyFiles?.filter((file: any) => file.type === 'pdf') || [];


    const isReadOnly = currentMode === 'view';
    const isCreateMode = currentMode === 'create';
    const isEditMode = currentMode === 'edit';
    const toggleEdit = () => setCurrentMode(p => p === 'view' ? 'edit' : 'view');

    return (
        <div className="max-w-full mx-auto space-y-0">
            {/* --- HEADER --- */}
            <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pb-2 mb-3 flex justify-between items-center">
                <div className='flex items-center gap-3'>
                    <button type="button" onClick={() => navigate(-1)} className='bg-blue-50 hover:bg-blue-100 flex items-center justify-center w-9 h-9 border border-blue-200 text-blue-600 cursor-pointer rounded-lg'>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isCreateMode ? 'Register Tool' : isEditMode ? 'Update Tool' : 'Tool Details'}
                        </h1>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            {initialData?.toolCode || 'New Asset'}
                        </p>
                    </div>
                </div>

                <div className='flex gap-3'>
                    {(isReadOnly && canEdit) && (
                        <Button type="button" onClick={toggleEdit} variant="outline" className="border-blue-600 text-blue-600">
                            <i className="fas fa-edit mr-2"></i>Edit Details
                        </Button>
                    )}

                    {(isCreateMode || isEditMode) && (
                        <div className="flex gap-2">
                            <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 text-white">
                                {isSubmitting ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2"></i>}
                                {isCreateMode ? 'Save Tool' : 'Save Changes'}
                            </Button>
                            <Button variant='outline' type="button" onClick={() => isCreateMode ? navigate(-1) : toggleEdit()} className="bg-white">
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- MAIN DETAILS (2/3 Width) --- */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center">
                            <i className="fas fa-info-circle mr-2"></i> Identity & Brand
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Tool Name</Label>
                                <input name="toolName" value={formData.toolName} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mt-1" placeholder="e.g., Bosch Hammer Drill" />
                            </div>
                            <div>
                                <Label>Category</Label>
                                <select name="toolCategory" value={formData.toolCategory} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white mt-1">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label>Brand</Label>
                                <input name="brand" value={formData.brand} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg mt-1" />
                            </div>
                            {/* <div>
                                <Label>Serial Number <span className='text-red-500'>*</span></Label>
                                <input name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg mt-1" placeholder="Required for issue" />
                            </div> */}
                            <div>
                                <Label>Model Number</Label>
                                <input name="modelNumber" value={formData.modelNumber} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg mt-1" placeholder="Required for issue" />
                            </div>

                            {/* <div>
                                <Label>Availbility Status</Label>
                                <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white mt-1">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div> */}

                            <div>
                                <Label>Conditional Status</Label>
                                <select name="conditionStatus" value={formData.conditionStatus} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white mt-1">
                                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                {/* <Label className="text-[10px] uppercase font-black text-gray-400">Search Room</Label> */}
                                <Label>Search Room</Label>

                                <SearchSelectNew

                                    options={toolRoomOptions}
                                    placeholder="Enter Tool Room Name..."
                                    value={formData.toolRoomId || ""}
                                    onValueChange={handleToolRoomSelection}
                                    displayFormat="detailed"
                                    className="w-full"
                                />
                            </div>


                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center">
                            <i className="fas fa-file-invoice-dollar mr-2"></i> Procurement
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Purchase Date</Label>
                                <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg mt-1" />
                            </div>
                            <div>
                                <Label>Purchase Value (₹)</Label>
                                <input type="number" name="purchaseValue" value={formData.purchaseValue || ""} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg mt-1" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center">
                            <i className="fas fa-shield-alt mr-2"></i> Warranty & Service
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Warranty Expires In</Label>
                                <input name="warrantyDuration" value={formData.warrantyDuration} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg mt-1" />
                            </div>
                            <div>
                                <Label>Service Location / Center</Label>
                                <input name="serviceLocation" value={formData.serviceLocation} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg mt-1" placeholder="e.g. Authorized Bosch Center" />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Warranty Policy Details</Label>
                                <Textarea name="warrantyDetails" value={formData.warrantyDetails} onChange={handleInputChange} rows={4} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg mt-1" placeholder="e.g. 1 Year limited warranty on motor" />
                            </div>
                        </div>
                    </div>



                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <Label>Remarks & Maintenance Notes</Label>
                        <Textarea name="remarks" value={formData.remarks} onChange={handleInputChange} disabled={isReadOnly} className="w-full mt-2" placeholder="Describe current condition or missing accessories..." rows={4} />
                    </div>
                </section>

                {/* --- MEDIA & DOCUMENTS (1/3 Width) --- */}
                <section className='flex flex-col gap-3'>
                    {/* <div className="space-y-6">
                        {isReadOnly && initialData?.toolImages?.length > 0 && (
                            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 border-b pb-2 flex items-center">
                                    <i className="fas fa-images mr-2 text-blue-500"></i> Gallery
                                </h3>
                                <ImageGalleryExample
                                    imageFiles={initialData.toolImages.map((img: any) => ({ ...img, url: img.url }))}
                                    height={120}
                                    minWidth={120}
                                    handleDeleteFile={handleDeleteToolImage}
                                />
                            </section>
                        )}

                        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b flex justify-between items-center">
                                <span><i className="fas fa-camera mr-2 text-blue-500"></i> {isCreateMode ? 'Upload Photos' : 'Add New Photos'}</span>
                            </h3>

                            <div className={`relative w-full h-32 border-2 border-dashed rounded-xl transition-colors flex flex-col items-center justify-center ${isReadOnly ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-300 hover:border-blue-500'}`}>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight text-center px-4">
                                    Drag or Click to upload tool images
                                </p>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {formData.images.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                                            <div className="flex items-center gap-2 truncate">
                                                <i className="fas fa-file-image text-blue-500"></i>
                                                <span className="text-[11px] font-medium text-gray-700 truncate">{file.name}</span>
                                            </div>
                                            <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors">
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}

                                    {isReadOnly && (
                                        <div className="flex justify-end pt-2">
                                            <Button type="button" onClick={handleQuickUploadClick} disabled={isSubmitting} className="h-8 text-xs bg-blue-600">
                                                {isSubmitting ? 'Uploading...' : 'Quick Upload Now'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                    </div> */}





                    <div className="space-y-6">
                        {/* --- 1. TOOL PHOTOS SECTION --- */}
                        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <header className="flex items-center justify-between border-b pb-2 mb-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                        <i className="fas fa-camera-retro mr-2 text-blue-500"></i> Tool Photos
                                    </h3>
                                    {/* {isToolUploading && <i className="fas fa-spinner fa-spin text-blue-500 text-xs"></i>} */}
                                </div>

                                {/* QUICK ADD BUTTON IN HEADER */}
                                <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold transition-colors flex items-center gap-1">
                                    {isToolUploading ? <><i className="fas fa-spinner fa-spin text-blue-500 text-xs"></i> Uploading</> : <><i className="fas fa-plus"></i> ADD</>}
                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" disabled={isToolUploading} />
                                </label>
                            </header>


                            {initialData?.toolImages?.length > 0 ? (

                                <div className='h-[300px] max-h-[300px] overflow-y-auto'>
                                    <ImageGalleryExample
                                        imageFiles={initialData.toolImages.map((img: any) => ({ ...img, url: img.url }))}
                                        height={120}
                                        minWidth={120}
                                        handleDeleteFile={handleDeleteToolImage}

                                    />
                                </div>

                            ) : (
                                <div className="py-8 flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                    <i className="fas fa-images text-gray-300 text-2xl mb-2"></i>
                                    <p className="text-[11px] font-medium text-gray-400">No photos available.</p>
                                </div>
                            )}
                        </section>

                        {/* --- 2. WARRANTY MEDIA SECTION --- */}
                        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <header className="flex items-center justify-between border-b pb-2 mb-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                        <i className="fas fa-shield-alt mr-2 text-red-500"></i> Warranty Media
                                    </h3>
                                    {/* {isWarrantyUploading && <i className="fas fa-spinner fa-spin text-red-500 text-xs"></i>} */}
                                </div>

                                {/* QUICK ADD BUTTON IN HEADER */}
                                <label className="cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold transition-colors flex items-center gap-1">
                                    {/* <i className="fas fa-plus"></i> ADD */}
                                    {isWarrantyUploading ? <><i className="fas fa-spinner fa-spin text-red-500 text-xs"></i> Uploading</> : <><i className="fas fa-plus"></i> ADD</>}

                                    <input type="file" multiple accept="image/*,.pdf" onChange={handleWarrantyFileChange} className="hidden" disabled={isWarrantyUploading} />
                                </label>
                            </header>

                            {/* Photo Proofs Sub-section */}
                            <div className="mb-6">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Photo Proofs</p>

                                {warrantyPhotos.length > 0 ? (
                                <div className='max-h-[300px] overflow-y-auto'>
                                    <ImageGalleryExample
                                        imageFiles={warrantyPhotos.map((img: any) => ({ ...img, url: img.url }))}
                                        height={100}
                                        minWidth={100}
                                        handleDeleteFile={handleDeleteWarrantyFile}
                                    />
                                    </div>

                                ) : (
                                    <div className="py-4 border border-dashed border-gray-100 rounded-lg flex items-center justify-center bg-gray-50/30">
                                        <span className="text-[10px] text-gray-400 italic">No image proofs uploaded.</span>
                                    </div>
                                )}
                            </div>

                            {/* Document Proofs Sub-section */}
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Document Proofs (PDF)</p>
                                {warrantyPDFs.length > 0 ? (
                                    <div className="space-y-2">
                                        {warrantyPDFs.map((doc: any) => (
                                            <div key={doc._id} className="flex items-center justify-between p-2 bg-gray-50 border rounded-lg group">
                                                <a href={doc.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 flex-1 truncate">
                                                    <i className="fas fa-file-pdf text-red-500"></i>
                                                    <span className="text-[11px] font-semibold text-gray-700 truncate">{doc.originalName}</span>
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteWarrantyFile(doc._id)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <i className="fas fa-trash-alt text-xs"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-3 border border-dashed border-gray-100 rounded-lg bg-gray-50/30">
                                        <span className="text-[10px] text-gray-400 italic">No PDF documents found.</span>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>


                   
                </section>

            </form>
        </div>
    );
};

export default ToolMasterForm;