// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '../../../components/ui/Button';
// import { Label } from '../../../components/ui/Label';
// import ImageGalleryExample from '../../../shared/ImageGallery/ImageGalleryMain';
// import { Textarea } from '../../../components/ui/TextArea';

// interface ToolMasterFormProps {
//     mode: 'create' | 'view' | 'edit';
//     initialData?: any;
//     onSubmit: (data: any, files: File[]) => void;
//     isSubmitting: boolean;
//     organizationId: string;
//     refetch?: () => void;
// }

// const ToolMasterForm: React.FC<ToolMasterFormProps> = ({ mode: initialMode, initialData, onSubmit, isSubmitting, organizationId, refetch }) => {
//     const navigate = useNavigate();
//     const [mode, setMode] = useState(initialMode);
//     // const { role, permission } = useAuthCheck();

//     const isView = mode === 'view';
//     const isEdit = mode === 'edit';
//     const isCreate = mode === 'create';

//     // const canEdit = role === "owner" || permission?.tools?.edit;

//     const [formData, setFormData] = useState({
//         toolName: '',
//         toolCategory: 'Drill',
//         brand: '',
//         modelNumber: '',
//         serialNumber: '',
//         purchaseDate: '',
//         purchaseValue: 0,
//         remarks: '',
//     });

//     const [newFiles, setNewFiles] = useState<File[]>([]);

//     useEffect(() => {
//         if (initialData) {
//             setFormData({
//                 toolName: initialData.toolName || '',
//                 toolCategory: initialData.toolCategory || 'Drill',
//                 brand: initialData.brand || '',
//                 modelNumber: initialData.modelNumber || '',
//                 serialNumber: initialData.serialNumber || '',
//                 purchaseDate: initialData.purchaseDate ? new Date(initialData.purchaseDate).toISOString().split('T')[0] : '',
//                 purchaseValue: initialData.purchaseValue || 0,
//                 remarks: initialData.remarks || '',
//             });
//         }
//     }, [initialData]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSubmit(formData, newFiles);
//         if (isEdit) {
//             setMode('view');
//         }
//     };

//     return (
//         <div className="max-w-full mx-auto space-y-6 bg-blue-50">
//             {/* Header */}
//             <header className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 sticky top-0 z-10 shadow-sm">
//                 <div className="flex items-center gap-4">
//                     <button type="button" onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                         <i className="fas fa-arrow-left text-gray-600"></i>
//                     </button>
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">
//                             {isCreate ? 'Register New Tool' : isEdit ? 'Edit Tool Details' : 'Tool Overview'}
//                         </h1>
//                         <p className="text-sm text-gray-500">{formData.toolName || 'Asset Information'}</p>
//                     </div>
//                 </div>

//                 <div className="flex gap-3">
//                     {isView && (
//                         <Button onClick={() => setMode('edit')} variant="outline" className="gap-2">
//                             <i className="fas fa-edit"></i> Edit Tool
//                         </Button>
//                     )}
//                     {(isCreate || isEdit) && (
//                         <>
//                             <Button onClick={() => isEdit ? setMode('view') : navigate(-1)} variant="ghost">Cancel</Button>
//                             <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2 bg-blue-600">
//                                 {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
//                                 {isCreate ? 'Save Tool' : 'Update Details'}
//                             </Button>
//                         </>
//                     )}
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Information Column */}
//                 <div className="lg:col-span-2 space-y-6">
//                     <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
//                         <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
//                             <i className="fas fa-info-circle text-blue-500"></i> General Specifications
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="space-y-1">
//                                 <Label>Tool Name</Label>
//                                 <input name="toolName" value={formData.toolName} onChange={handleInputChange} disabled={isView} className="form-input-styled w-full border p-2 rounded-lg" placeholder="e.g. Cordless Hammer Drill" />
//                             </div>
//                             <div className="space-y-1">
//                                 <Label>Category</Label>
//                                 <select name="toolCategory" value={formData.toolCategory} onChange={handleInputChange} disabled={isView} className="form-input-styled w-full border p-2 rounded-lg bg-white">
//                                     {["Drill", "Saw", "Grinder", "Cutter", "Laser Level", "Other"].map(cat => <option key={cat} value={cat}>{cat}</option>)}
//                                 </select>
//                             </div>
//                             <div className="space-y-1">
//                                 <Label>Brand</Label>
//                                 <input name="brand" value={formData.brand} onChange={handleInputChange} disabled={isView} className="form-input-styled w-full border p-2 rounded-lg" />
//                             </div>
//                             <div className="space-y-1">
//                                 <Label>Serial Number</Label>
//                                 <input name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} disabled={isView} className="form-input-styled w-full border p-2 rounded-lg" />
//                             </div>
//                         </div>
//                     </section>

//                     <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
//                         <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
//                             <i className="fas fa-history text-orange-500"></i> Procurement Details
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="space-y-1">
//                                 <Label>Purchase Date</Label>
//                                 <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleInputChange} disabled={isView} className="form-input-styled w-full border p-2 rounded-lg" />
//                             </div>
//                             <div className="space-y-1">
//                                 <Label>Purchase Value (₹)</Label>
//                                 <input type="number" name="purchaseValue" value={formData.purchaseValue} onChange={handleInputChange} disabled={isView} className="form-input-styled w-full border p-2 rounded-lg" />
//                             </div>
//                         </div>
//                     </section>
//                 </div>

//                 {/* Media Column */}
//                 <div className="space-y-6">
//                     <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
//                         <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
//                             <i className="fas fa-camera text-purple-500"></i> Tool Images
//                         </h3>

//                         {/* Existing Images (View/Edit) */}
//                         {initialData?.toolImages?.length > 0 && (
//                             <div className="space-y-2">
//                                 <Label className="text-xs text-gray-400">Existing Media</Label>
//                                 <ImageGalleryExample
//                                     imageFiles={initialData.toolImages.map((img: any) => ({ ...img, url: img.url }))}
//                                     height={120}
//                                     // isReadOnly={isView}
//                                     handleDeleteFile={(id: string) => {/* Add delete logic */ }}
//                                 />
//                             </div>
//                         )}

//                         {/* Upload New (Create/Edit) */}
//                         {!isView && (
//                             <div className="space-y-2 pt-4">
//                                 <Label className="text-xs text-gray-400">Upload New Photos</Label>
//                                 {/* <MultiFileUploader onFilesChange={setNewFiles} accept="image/*" /> */}

//                                 <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 bg-gray-50 flex flex-col items-center justify-center">
//                                     {/* <input type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" /> */}
//                                     <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
//                                     <p className="text-sm text-gray-600">Click to upload files</p>
//                                 </div>
//                             </div>
//                         )}
//                     </section>

//                     <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
//                         <Label>Remarks / Internal Notes</Label>
//                         <Textarea name="remarks" value={formData.remarks} onChange={handleInputChange} disabled={isView} placeholder="Any specific maintenance notes..." rows={4} />
//                     </section>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ToolMasterForm;




import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';// import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Label } from '../../../components/ui/Label';
import ImageGalleryExample from '../../../shared/ImageGallery/ImageGalleryMain';
import { Textarea } from '../../../components/ui/TextArea';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';
import SearchSelectNew from '../../../components/ui/SearchSelectNew';
import { useGetAllToolRoomforDD } from '../../../apiList/tools_api/toolOtpApi';


// Define the categories and conditions as per your backend schema
// const CATEGORIES = ["Drill", "Saw", "Grinder", "Cutter", "Laser Level", "Other"];

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
    images: File[]; // For new uploads
}

interface ToolMasterFormProps {
    mode: 'create' | 'view' | 'edit';
    initialData?: any;
    organizationId: string;
    isSubmitting: boolean;
    onSubmit: (data: any, newFiles: File[]) => Promise<void>;
    onQuickUpload?: (files: File[]) => Promise<void>;
    refetch?: () => void;
}

const ToolMasterForm: React.FC<ToolMasterFormProps> = ({
    mode: initialMode,
    initialData,
    // organizationId,
    isSubmitting,
    onSubmit,
    onQuickUpload,
    // refetch
}) => {
    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string }
    const [currentMode, setCurrentMode] = useState(initialMode);
    const { role, permission } = useAuthCheck();

    const canEdit = role === "owner" || permission?.tools?.edit;
    // const canCreate = role === "owner" || permission?.tools?.create;

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
        images: []
    };

    const { data: toolRoom = [] } = useGetAllToolRoomforDD(organizationId);
    // const [toolRoomId, setToolRoomId] = useState<string | null>(null);


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
                toolRoomId: initialData?.toolRoomId._id || null,
                conditionStatus: initialData.conditionStatus || "",
                purchaseDate: initialData.purchaseDate ? new Date(initialData.purchaseDate).toISOString().split('T')[0] : '',
                purchaseValue: initialData.purchaseValue || 0,
                remarks: initialData.remarks || '',
                images: []
            });
        }
    }, [initialData, currentMode]);

    // --- HANDLERS ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(p => ({ ...p, images: [...p.images, ...Array.from(e.target.files || [])] }));
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { images, ...textData } = formData;
        await onSubmit(textData, images);
        if (currentMode === 'edit') setCurrentMode('view');
    };



    const toolRoomOptions = toolRoom.map((t: any) => ({
        value: t._id,
        label: `${t.toolRoomName}`,
        // subLabel: t.brand,
    }));

    const handleToolRoomSelection = (id: string | null) => {
        setFormData(p => ({ ...p, toolRoomId: id}));
    };

    const handleQuickUploadClick = async () => {
        if (formData.images.length > 0 && onQuickUpload) {
            await onQuickUpload(formData.images);
            setFormData(p => ({ ...p, images: [] }));
        }
    };

    const isReadOnly = currentMode === 'view';
    const isCreateMode = currentMode === 'create';
    const isEditMode = currentMode === 'edit';
    const toggleEdit = () => setCurrentMode(p => p === 'view' ? 'edit' : 'view');

    return (
        <div className="max-w-full mx-auto space-y-4">
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
                <div className="lg:col-span-2 space-y-6">
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
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c[0].toUpperCase()+c.slice(1)}</option>)}
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
                                <input type="number" name="purchaseValue" value={formData.purchaseValue} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg mt-1" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <Label>Remarks & Maintenance Notes</Label>
                        <Textarea name="remarks" value={formData.remarks} onChange={handleInputChange} disabled={isReadOnly} className="w-full mt-2" placeholder="Describe current condition or missing accessories..." rows={4} />
                    </div>
                </div>

                {/* --- MEDIA & DOCUMENTS (1/3 Width) --- */}
                <div className="space-y-6">
                    {/* Existing Images */}
                    {isReadOnly && initialData?.toolImages?.length > 0 && (
                        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 border-b pb-2 flex items-center">
                                <i className="fas fa-images mr-2 text-blue-500"></i> Gallery
                            </h3>
                            <ImageGalleryExample
                                imageFiles={initialData.toolImages.map((img: any) => ({ ...img, url: img.url }))}
                                height={120}
                                minWidth={120}
                            // isReadOnly={true}
                            />
                        </section>
                    )}

                    {/* New Upload Section */}
                    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b flex justify-between items-center">
                            <span><i className="fas fa-camera mr-2 text-blue-500"></i> {isCreateMode ? 'Upload Photos' : 'Add New Photos'}</span>
                        </h3>

                        {/* Transparent Input Wrapper */}
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

                        {/* Pending Files List */}
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

                    {/* Status Overview Card */}
                    {!isCreateMode && (
                        <div className={`p-6 rounded-xl border flex items-center justify-between shadow-sm ${initialData?.availabilityStatus === 'available' ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'
                            }`}>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">Current Status</p>
                                <p className={`text-xl font-bold capitalize ${initialData?.availabilityStatus === 'available' ? 'text-green-700' : 'text-orange-700'
                                    }`}>
                                    {initialData?.availabilityStatus}
                                </p>
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${initialData?.availabilityStatus === 'available' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                <i className={`fas ${initialData?.availabilityStatus === 'available' ? 'fa-check-circle' : 'fa-hand-holding'}`}></i>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ToolMasterForm;