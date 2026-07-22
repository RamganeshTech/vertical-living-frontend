



import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type CreateCustomerPayload, type Customer, type UpdateCustomerPayload } from '../../../../apiList/Department Api/Accounting Api/customerAccountApi';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import ImageGalleryExample from '../../../../shared/ImageGallery/ImageGalleryMain';
import { dateFormate } from '../../../../utils/dateFormator';
import { useAuthCheck } from '../../../../Hooks/useAuthCheck';

// --- UI Helpers (Same as Vendor Form) ---
// const SectionHeader = ({ icon, title }: { icon: string, title: string }) => (
//     <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 pb-1 border-b border-gray-100 flex items-center gap-2">
//         <i className={`fas ${icon} text-blue-500`}></i> {title}
//     </h3>
// );

// const InputLabel = ({ children, required }: { children: React.ReactNode, required?: boolean }) => (
//     <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
//         {children} {required && <span className="text-red-500">*</span>}
//     </label>
// );

// const ModernInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
//     <input
//         {...props}
//         className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-all ${props.className}`}
//     />
// );

// const ModernSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
//     <select
//         {...props}
//         className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 bg-white disabled:bg-gray-50 transition-all ${props.className}`}
//     >
//         {props.children}
//     </select>
// );

const SectionHeader = ({ icon, title }: { icon: string, title: string }) => (
    <h3 className="text-sm font-bold text-text-main uppercase tracking-wide mb-3 pb-1 border-b border-ash-medium flex items-center gap-2">
        <i className={`fas ${icon} text-action-primary`}></i> {title}
    </h3>
);

const InputLabel = ({ children, required }: { children: React.ReactNode, required?: boolean }) => (
    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">
        {children} {required && <span className="text-action-danger">*</span>}
    </label>
);

const ModernInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full rounded-md border border-ash-medium shadow-sm focus:border-action-primary 
            focus:ring-1 focus:ring-action-primary sm:text-sm py-2 px-3 bg-brand-surface text-text-main 
            placeholder:text-text-soft disabled:bg-brand-ash disabled:text-text-muted outline-none transition-all ${props.className || ''}`}
    />
);

const ModernSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
        {...props}
        className={`w-full rounded-md border border-ash-medium shadow-sm focus:border-action-primary focus:ring-1 focus:ring-action-primary sm:text-sm py-2 px-3 bg-brand-surface text-text-main disabled:bg-brand-ash disabled:text-text-muted outline-none transition-all ${props.className || ''}`}
    >
        {props.children}
    </select>
);

interface CustomerAccountFormProps {
    mode: 'create' | 'update' | "view";
    initialData?: Customer | null;
    onSubmit: (data: any, files?: File[], mainImage?: File) => Promise<void>;
    isSubmitting: boolean;
}

const CustomerAccountForm: React.FC<CustomerAccountFormProps> = ({
    mode: initialMode,
    initialData,
    onSubmit,
    isSubmitting,
}) => {
    const { organizationId } = useParams()
    const navigate = useNavigate();
    const [currentMode, setCurrentMode] = useState<'create' | 'view' | 'update'>(initialMode);
    const isReadOnly = currentMode === 'view';

    // --- Main Image State (Commented out functionality as requested) ---
    /*
    const [mainImageFile, setMainImageFile] = useState<File | undefined>(undefined);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(initialData?.mainImage?.url || null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const updateImageMutation = useUpdateCustomerMainImage(); 
    */




    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.customer?.list;
    // const canCreate = role === "owner" || permission?.customer?.create
    const canEdit = role === "owner" || permission?.customer?.edit
    // const canDelete = role === "owner" || permission?.customer?.delete


    // --- Form State ---
    const [formData, setFormData] = useState({
        organizationId: initialData?.organizationId || organizationId,
        projectId: initialData?.projectId || null,
        clientId: initialData?.clientId || null,

        // Basic
        firstName: '',
        companyName: '',
        email: '',
        phone: { work: '', mobile: '' },

        // Statutory
        language: 'English',
        currency: 'INR - Indian Rupee',
        pan: '',
        tan: '',
        gstin: '',

        // Banking
        bankAccNo: '',
        accHolderName: '',
        bankName: '',
        bankBranch: '',
        ifscCode: ''
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // --- Initialize Data ---
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                organizationId: initialData.organizationId || organizationId,
                clientId: initialData.clientId || null,
                firstName: initialData.firstName || '',
                companyName: initialData.companyName || '',
                email: initialData.email || '',
                phone: {
                    work: initialData.phone?.work || '',
                    mobile: initialData.phone?.mobile || ''
                },
                language: initialData.language || 'English',
                currency: initialData.currency || 'INR - Indian Rupee',
                pan: initialData.pan || '',
                tan: initialData.tan || '',
                gstin: initialData.gstin || '',
                bankAccNo: initialData.bankAccNo || '',
                accHolderName: initialData.accHolderName || '',
                bankName: initialData.bankName || '',
                bankBranch: initialData.bankBranch || '',
                ifscCode: initialData.ifscCode || ''
            }));
        }
    }, [initialData, organizationId]);


    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (type: 'mobile' | 'work', value: string) => {
        // Allow only numbers
        const cleanValue = value.replace(/[^0-9]/g, '');
        setFormData(prev => ({
            ...prev,
            phone: { ...prev.phone, [type]: cleanValue }
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setSelectedFiles(Array.from(e.target.files));
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleCancelClick = () => {
        if (currentMode === 'create') navigate(-1);
        else {
            setCurrentMode('view');
            setSelectedFiles([]);
        }
    };

    // --- Validation ---
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (formData.phone.mobile && formData.phone.mobile.length !== 10) {
            newErrors['phone.mobile'] = 'Mobile number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            if (initialMode === 'create') {
                // Pass undefined for mainImage as requested to remove functionality
                await onSubmit(formData as CreateCustomerPayload, selectedFiles);
            } else {
                await onSubmit(formData as UpdateCustomerPayload, selectedFiles);
                setCurrentMode('view');
                setSelectedFiles([]);
            }
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    // --- Document Filters ---
    const existingImages = initialData?.documents?.filter((f: any) => f.type === 'image') || [];
    const existingPdfs = initialData?.documents?.filter((f: any) => f.type === 'pdf') || [];

    // return (
    //     <div className="max-w-full overflow-y-auto mx-auto h-full flex flex-col pb-10 font-sans">

    //         {/* --- Header --- */}
    //         <div className="mb-6 flex items-center justify-between">
    //             <div className="flex items-center gap-4">
    //                 <button
    //                     onClick={() => navigate(-1)}
    //                     className='bg-white hover:bg-gray-50 w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full shadow-sm transition-colors'>
    //                     <i className="fas fa-arrow-left text-gray-600"></i>
    //                 </button>
    //                 <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
    //                     <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-lg">
    //                         <i className={`fas ${currentMode === 'create' ? 'fa-user-plus' : 'fa-user-tie'}`}></i>
    //                     </span>
    //                     {currentMode === 'create' ? 'Create Customer' : 'Customer Details'}
    //                 </h1>
    //             </div>
    //             <div className="flex gap-3">
    //                 {(currentMode === 'view' && canEdit) && (
    //                     <Button onClick={() => setCurrentMode('update')} className="bg-blue-600 text-white shadow-sm">
    //                         <i className="fas fa-edit mr-2"></i> Edit Details
    //                     </Button>
    //                 )}
    //                 {currentMode === 'update' && (
    //                     <Button onClick={handleCancelClick} variant="outline" className="bg-white">
    //                         Cancel Edit
    //                     </Button>
    //                 )}
    //                 {!isReadOnly && (
    //                     <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="">
    //                         {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <span className="flex items-center">
    //                             <i className="fas fa-save mr-2"></i> Save Changes
    //                         </span>}
    //                     </Button>
    //                 )}
    //             </div>
    //         </div>

    //         <Card className="p-6 shadow-sm border border-gray-100">
    //             <div className="space-y-6">

    //                 {/* --- Section 1: Basic Information --- */}
    //                 <div>
    //                     <SectionHeader icon="fa-info-circle" title="Basic Information" />
    //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    //                         <div className="lg:col-span-2">
    //                             <InputLabel required>Customer Name</InputLabel>
    //                             <ModernInput
    //                                 name="firstName"
    //                                 value={formData.firstName}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                                 placeholder="Full Name"
    //                             />
    //                             {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
    //                         </div>
    //                         <div className="lg:col-span-1">
    //                             <InputLabel>Company Name</InputLabel>
    //                             <ModernInput
    //                                 name="companyName"
    //                                 value={formData.companyName}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                                 placeholder="Company"
    //                             />
    //                         </div>
    //                         <div className="lg:col-span-1">
    //                             <InputLabel>Email Address</InputLabel>
    //                             <ModernInput
    //                                 type="email"
    //                                 name="email"
    //                                 value={formData.email}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                                 placeholder="email@example.com"
    //                             />
    //                             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
    //                         </div>
    //                         <div className="lg:col-span-1">
    //                             <InputLabel>Mobile Number</InputLabel>
    //                             <ModernInput
    //                                 value={formData.phone.mobile}
    //                                 onChange={(e) => handlePhoneChange('mobile', e.target.value)}
    //                                 disabled={isReadOnly}
    //                                 maxLength={10}
    //                                 placeholder="10 digits"
    //                             />
    //                             {errors['phone.mobile'] && <p className="text-red-500 text-xs mt-1">{errors['phone.mobile']}</p>}
    //                         </div>
    //                         <div className="lg:col-span-1">
    //                             <InputLabel>Work Phone</InputLabel>
    //                             <ModernInput
    //                                 value={formData.phone.work}
    //                                 onChange={(e) => handlePhoneChange('work', e.target.value)}
    //                                 disabled={isReadOnly}
    //                                 maxLength={12}
    //                                 placeholder="Landline / Alt"
    //                             />
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* --- Section 2: Statutory & Settings --- */}
    //                 <div>
    //                     <SectionHeader icon="fa-file-invoice" title="Statutory & Settings" />
    //                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    //                         <div>
    //                             <InputLabel>PAN Number</InputLabel>
    //                             <ModernInput
    //                                 name="pan"
    //                                 value={formData.pan}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                                 placeholder="PAN"
    //                                 className="uppercase"
    //                             />
    //                         </div>
    //                         <div>
    //                             <InputLabel>TAN Number</InputLabel>
    //                             <ModernInput
    //                                 name="tan"
    //                                 value={formData.tan}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                                 placeholder="TAN"
    //                                 className="uppercase"
    //                             />
    //                         </div>
    //                         <div>
    //                             <InputLabel>GSTIN</InputLabel>
    //                             <ModernInput
    //                                 name="gstin"
    //                                 value={formData.gstin}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                                 placeholder="GSTIN"
    //                                 className="uppercase"
    //                             />
    //                         </div>
    //                         <div>
    //                             <InputLabel>Language</InputLabel>
    //                             <ModernSelect
    //                                 name="language"
    //                                 value={formData.language}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                             >
    //                                 {['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'].map(l => <option key={l} value={l}>{l}</option>)}
    //                             </ModernSelect>
    //                         </div>
    //                         <div>
    //                             <InputLabel>Currency</InputLabel>
    //                             <ModernSelect
    //                                 name="currency"
    //                                 value={formData.currency}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                             >
    //                                 {['INR - Indian Rupee', 'USD - US Dollar', 'EUR - Euro'].map(c => <option key={c} value={c}>{c}</option>)}
    //                             </ModernSelect>
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* --- Section 3: Banking Details --- */}
    //                 {/* <div className="bg-gray-50 p-4 rounded-lg border border-gray-200"> */}
    //                 <div >
    //                     <SectionHeader icon="fa-university" title="Banking Details" />
    //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    //                         <div className="lg:col-span-1">
    //                             <InputLabel>Bank Name</InputLabel>
    //                             <ModernInput
    //                                 name="bankName"
    //                                 value={formData.bankName}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                             />
    //                         </div>
    //                         <div className="lg:col-span-1">
    //                             <InputLabel>Branch</InputLabel>
    //                             <ModernInput
    //                                 name="bankBranch"
    //                                 value={formData.bankBranch}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                             />
    //                         </div>
    //                         <div className="lg:col-span-1">
    //                             <InputLabel>Account Number</InputLabel>
    //                             <ModernInput
    //                                 name="bankAccNo"
    //                                 value={formData.bankAccNo}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                             />
    //                         </div>
    //                         <div className="lg:col-span-1">
    //                             <InputLabel>IFSC Code</InputLabel>
    //                             <ModernInput
    //                                 name="ifscCode"
    //                                 value={formData.ifscCode}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                                 className="uppercase"
    //                             />
    //                         </div>
    //                         <div className="lg:col-span-1">
    //                             <InputLabel>Account Holder</InputLabel>
    //                             <ModernInput
    //                                 name="accHolderName"
    //                                 value={formData.accHolderName}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                             />
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* --- Section 4: Documents --- */}
    //                 {(existingImages.length > 0 || existingPdfs.length > 0) && (
    //                     <section>
    //                         <SectionHeader icon="fa-folder-open" title="Attached Documents" />

    //                         {/* Images Gallery */}
    //                         {existingImages.length > 0 && (
    //                             <div className="mb-4">
    //                                 <div className="flex items-center gap-2 mb-3">
    //                                     <i className="fas fa-images text-purple-600"></i>
    //                                     <h4 className="font-semibold text-gray-800 text-xs uppercase">Images</h4>
    //                                     <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 rounded-full">
    //                                         {existingImages.length}
    //                                     </span>
    //                                 </div>
    //                                 <ImageGalleryExample
    //                                     imageFiles={existingImages}
    //                                     height={120}
    //                                     minWidth={120}
    //                                     maxWidth={180}
    //                                 />
    //                             </div>
    //                         )}

    //                         {/* PDFs List */}
    //                         {existingPdfs.length > 0 && (
    //                             <div>
    //                                 <div className="flex items-center gap-2 mb-3">
    //                                     <i className="fas fa-file-pdf text-red-600"></i>
    //                                     <h4 className="font-semibold text-gray-800 text-xs uppercase">PDF Documents</h4>
    //                                     <span className="text-[10px] bg-red-100 text-red-700 px-1.5 rounded-full">
    //                                         {existingPdfs.length}
    //                                     </span>
    //                                 </div>
    //                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
    //                                     {existingPdfs.map((file: any, i: number) => (
    //                                         <div key={i} className="flex items-center gap-3 bg-red-50 p-2 rounded border border-red-100 hover:shadow-sm transition-all">
    //                                             <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-red-500 border border-red-100">
    //                                                 <i className="fas fa-file-pdf"></i>
    //                                             </div>
    //                                             <div className="flex-1 min-w-0">
    //                                                 <p className="text-xs font-semibold text-gray-900 truncate">
    //                                                     {file.originalName || `Document ${i + 1}.pdf`}
    //                                                 </p>
    //                                                 <p className="text-[10px] text-gray-500">
    //                                                     {dateFormate(file.uploadedAt)}
    //                                                 </p>
    //                                             </div>
    //                                             <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-800 px-1">
    //                                                 Open
    //                                             </a>
    //                                         </div>
    //                                     ))}
    //                                 </div>
    //                             </div>
    //                         )}
    //                     </section>
    //                 )}

    //                 {/* --- Upload New Documents --- */}
    //                 {!isReadOnly && (
    //                     <section>
    //                         <SectionHeader icon="fa-cloud-upload-alt" title={currentMode === 'create' ? 'Upload Documents' : 'Add New Documents'} />

    //                         <div className="relative w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50 flex flex-col items-center justify-center group">
    //                             <input
    //                                 type="file"
    //                                 multiple
    //                                 accept="image/*,.pdf"
    //                                 onChange={handleFileChange}
    //                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
    //                             />
    //                             <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 group-hover:text-blue-500 transition-colors mb-1"></i>
    //                             <p className="text-xs text-gray-600 font-medium">Click to upload files</p>
    //                             <p className="text-[10px] text-gray-400">PDF, PNG, JPG</p>
    //                         </div>

    //                         {/* New Files Preview */}
    //                         {selectedFiles.length > 0 && (
    //                             <div className="mt-3 space-y-2">
    //                                 {selectedFiles.map((file, index) => (
    //                                     <div key={index} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded shadow-sm">
    //                                         <div className="flex items-center gap-2">
    //                                             <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'}`}></i>
    //                                             <span className="text-sm text-gray-700">{file.name}</span>
    //                                             <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
    //                                         </div>
    //                                         <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 px-2">
    //                                             <i className="fas fa-times"></i>
    //                                         </button>
    //                                     </div>
    //                                 ))}
    //                             </div>
    //                         )}
    //                     </section>
    //                 )}

    //             </div>
    //         </Card>
    //     </div>
    // );



    return (
        <div className="max-w-full overflow-y-auto mx-auto h-full flex flex-col pb-10 font-sans bg-brand-surface">

            {/* --- Header --- */}
            <div className="mb-6 flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className='bg-brand-surface cursor-pointer hover:bg-brand-surface-hover w-9 h-9 flex items-center justify-center border border-ash-medium rounded-full shadow-sm transition-colors'>
                        <i className="fas fa-arrow-left text-text-main"></i>
                    </button>
                    <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
                        <span className="bg-brand-ash border border-ash-medium text-action-primary w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm">
                            <i className={`fas ${currentMode === 'create' ? 'fa-user-plus' : 'fa-user-tie'}`}></i>
                        </span>
                        {currentMode === 'create' ? 'Create Customer' : 'Customer Details'}
                    </h1>
                </div>
                <div className="flex gap-3">
                    {(currentMode === 'view' && canEdit) && (
                        <Button variant='dark' onClick={() => setCurrentMode('update')} className="bg-action-primary hover:bg-action-primary-hover text-brand-surface shadow-sm transition-colors">
                            <i className="fas fa-edit mr-2"></i> Edit Details
                        </Button>
                    )}
                    {currentMode === 'update' && (
                        <Button onClick={handleCancelClick} variant="outline" className="bg-brand-surface border-ash-medium text-text-main hover:bg-brand-surface-hover transition-colors">
                            Cancel
                        </Button>
                    )}
                    {!isReadOnly && (
                        <Button type="button" variant='dark' onClick={handleSubmit} disabled={isSubmitting} className="hover:opacity-90 text-brand-surface transition-opacity">
                            {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <span className="flex items-center">
                                <i className="fas fa-save mr-2"></i> Save Changes
                            </span>}
                        </Button>
                    )}
                </div>
            </div>

            <Card className="p-6 shadow-sm border border-ash-light bg-brand-surface mx-4">
                <div className="space-y-6">

                    {/* --- Section 1: Basic Information --- */}
                    <div>
                        <SectionHeader icon="fa-info-circle" title="Basic Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="lg:col-span-2">
                                <InputLabel required>Customer Name</InputLabel>
                                <ModernInput
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="Full Name"
                                />
                                {errors.firstName && <p className="text-action-danger text-xs mt-1">{errors.firstName}</p>}
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Company Name</InputLabel>
                                <ModernInput
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="Company"
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Email Address</InputLabel>
                                <ModernInput
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="email@example.com"
                                />
                                {errors.email && <p className="text-action-danger text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Mobile Number</InputLabel>
                                <ModernInput
                                    value={formData.phone.mobile}
                                    onChange={(e) => handlePhoneChange('mobile', e.target.value)}
                                    disabled={isReadOnly}
                                    maxLength={10}
                                    placeholder="10 digits"
                                />
                                {errors['phone.mobile'] && <p className="text-action-danger text-xs mt-1">{errors['phone.mobile']}</p>}
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Work Phone</InputLabel>
                                <ModernInput
                                    value={formData.phone.work}
                                    onChange={(e) => handlePhoneChange('work', e.target.value)}
                                    disabled={isReadOnly}
                                    maxLength={12}
                                    placeholder="Landline / Alt"
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Section 2: Statutory & Settings --- */}
                    <div>
                        <SectionHeader icon="fa-file-invoice" title="Statutory & Settings" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div>
                                <InputLabel>PAN Number</InputLabel>
                                <ModernInput
                                    name="pan"
                                    value={formData.pan}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="PAN"
                                    className="uppercase"
                                />
                            </div>
                            <div>
                                <InputLabel>TAN Number</InputLabel>
                                <ModernInput
                                    name="tan"
                                    value={formData.tan}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="TAN"
                                    className="uppercase"
                                />
                            </div>
                            <div>
                                <InputLabel>GSTIN</InputLabel>
                                <ModernInput
                                    name="gstin"
                                    value={formData.gstin}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="GSTIN"
                                    className="uppercase"
                                />
                            </div>
                            <div>
                                <InputLabel>Language</InputLabel>
                                <ModernSelect
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                >
                                    {['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'].map(l => <option key={l} value={l}>{l}</option>)}
                                </ModernSelect>
                            </div>
                            <div>
                                <InputLabel>Currency</InputLabel>
                                <ModernSelect
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                >
                                    {['INR - Indian Rupee', 'USD - US Dollar', 'EUR - Euro'].map(c => <option key={c} value={c}>{c}</option>)}
                                </ModernSelect>
                            </div>
                        </div>
                    </div>

                    {/* --- Section 3: Banking Details --- */}
                    <div >
                        <SectionHeader icon="fa-university" title="Banking Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="lg:col-span-1">
                                <InputLabel>Bank Name</InputLabel>
                                <ModernInput
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Branch</InputLabel>
                                <ModernInput
                                    name="bankBranch"
                                    value={formData.bankBranch}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Account Number</InputLabel>
                                <ModernInput
                                    name="bankAccNo"
                                    value={formData.bankAccNo}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>IFSC Code</InputLabel>
                                <ModernInput
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="uppercase"
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Account Holder</InputLabel>
                                <ModernInput
                                    name="accHolderName"
                                    value={formData.accHolderName}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Section 4: Documents --- */}
                    {(existingImages.length > 0 || existingPdfs.length > 0) && (
                        <section>
                            <SectionHeader icon="fa-folder-open" title="Attached Documents" />

                            {/* Images Gallery */}
                            {existingImages.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-images text-action-primary"></i>
                                        <h4 className="font-semibold text-text-main text-xs uppercase">Images</h4>
                                        <span className="text-[10px] bg-brand-ash border border-ash-medium text-text-strong px-2 py-0.5 rounded-full shadow-sm">
                                            {existingImages.length}
                                        </span>
                                    </div>
                                    <ImageGalleryExample
                                        imageFiles={existingImages}
                                        height={120}
                                        minWidth={120}
                                        maxWidth={180}
                                    />
                                </div>
                            )}

                            {/* PDFs List */}
                            {existingPdfs.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-file-pdf text-action-danger"></i>
                                        <h4 className="font-semibold text-text-main text-xs uppercase">PDF Documents</h4>
                                        <span className="text-[10px] bg-brand-ash border border-ash-medium text-text-strong px-2 py-0.5 rounded-full shadow-sm">
                                            {existingPdfs.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {existingPdfs.map((file: any, i: number) => (
                                            <div key={i} className="flex items-center gap-3 bg-brand-surface p-2 rounded border border-ash-medium hover:shadow-sm transition-all">
                                                <div className="w-8 h-8 bg-brand-ash rounded flex items-center justify-center text-action-danger border border-ash-light">
                                                    <i className="fas fa-file-pdf"></i>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-text-strong truncate">
                                                        {file.originalName || `Document ${i + 1}.pdf`}
                                                    </p>
                                                    <p className="text-[10px] text-text-muted mt-0.5">
                                                        {dateFormate(file.uploadedAt)}
                                                    </p>
                                                </div>
                                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-action-primary hover:text-action-primary-hover px-1 transition-colors">
                                                    Open
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* --- Upload New Documents --- */}
                    {!isReadOnly && (
                        <section>
                            <SectionHeader icon="fa-cloud-upload-alt" title={currentMode === 'create' ? 'Upload Documents' : 'Add New Documents'} />

                            <div className="relative w-full h-24 border-2 border-dashed border-ash-medium rounded-lg hover:border-action-primary transition-colors bg-brand-ash flex flex-col items-center justify-center group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                <i className="fas fa-cloud-upload-alt text-2xl text-text-soft group-hover:text-action-primary transition-colors mb-1"></i>
                                <p className="text-xs text-text-main font-medium">Click to upload files</p>
                                <p className="text-[10px] text-text-muted">PDF, PNG, JPG</p>
                            </div>

                            {/* New Files Preview */}
                            {selectedFiles.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-brand-surface border border-ash-medium rounded-lg shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf text-action-danger' : 'fa-file-image text-action-primary'}`}></i>
                                                <span className="text-sm text-text-main font-medium">{file.name}</span>
                                                <span className="text-xs text-text-muted bg-brand-ash px-2 py-0.5 rounded-full border border-ash-light">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </div>
                                            <button type="button" onClick={() => removeFile(index)} className="text-text-soft hover:text-action-danger px-2 transition-colors">
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                </div>
            </Card>
        </div>
    );
};

export default CustomerAccountForm;