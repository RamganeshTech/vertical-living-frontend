
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { type CreateVendorPayload, type UpdateVendorPayload, type Vendor } from '../../../../apiList/Department Api/Accounting Api/vendorAccApi';
import ImageGalleryExample from '../../../../shared/ImageGallery/ImageGalleryMain';
import { dateFormate } from '../../../../utils/dateFormator';
import { useAuthCheck } from '../../../../Hooks/useAuthCheck';
import SmartTagInput from '../../../../shared/SmartTagInput';

// // --- UI Helpers ---
// const SectionHeader = ({ icon, title }: { icon: string, title: string }) => (
//     <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
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
//         className={`
//             w-full rounded-lg border border-gray-200 bg-white
//             text-gray-800 text-sm font-medium
//             px-3.5 py-2.5
//             shadow-sm
//             placeholder:text-gray-400 placeholder:font-normal
//             hover:border-gray-300
//             focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//             disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-100 disabled:cursor-not-allowed disabled:shadow-none
//             transition-all duration-200
//             ${props.className || ''}
//         `}
//     />
// );

// const ModernSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
//     <select
//         {...props}
//         className={`
//             w-full rounded-lg border border-gray-200 bg-white
//             text-gray-800 text-sm font-medium
//             px-3.5 py-2.5
//             shadow-sm
//             hover:border-gray-300
//             focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//             disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-100 disabled:cursor-not-allowed disabled:shadow-none
//             transition-all duration-200
//             appearance-none cursor-pointer
//             ${props.className || ''}
//         `}
//     >
//         {props.children}
//     </select>
// );


// --- UI Helpers ---
const SectionHeader = ({ icon, title }: { icon: string, title: string }) => (
    <h3 className="text-sm font-bold text-text-main uppercase tracking-wide mb-4 pb-2 border-b border-ash-medium flex items-center gap-2">
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
        className={`
            w-full rounded-lg border border-ash-medium bg-brand-surface
            text-text-main text-sm font-medium
            px-3.5 py-2.5
            shadow-sm
            placeholder:text-text-soft placeholder:font-normal
            hover:border-action-primary
            focus:outline-none focus:border-action-primary focus:ring-2 focus:ring-action-primary/20
            disabled:bg-brand-ash disabled:text-text-muted disabled:border-ash-light disabled:cursor-not-allowed disabled:shadow-none
            transition-all duration-200
            ${props.className || ''}
        `}
    />
);

const ModernSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
        {...props}
        className={`
            w-full rounded-lg border border-ash-medium bg-brand-surface
            text-text-main text-sm font-medium
            px-3.5 py-2.5
            shadow-sm
            hover:border-action-primary
            focus:outline-none focus:border-action-primary focus:ring-2 focus:ring-action-primary/20
            disabled:bg-brand-ash disabled:text-text-muted disabled:border-ash-light disabled:cursor-not-allowed disabled:shadow-none
            transition-all duration-200
            appearance-none cursor-pointer
            ${props.className || ''}
        `}
    >
        {props.children}
    </select>
);

// --- Constants ---
const CATEGORIES = ["electronics", "hardware", "services", "consumables", "furniture", "others"];
const BUSINESS_STRUCTURES = ["proprietorship", "partnership", "private_limited", "llp", "individual"];

interface VendorFormProps {
    mode: 'create' | 'view';
    initialData?: Vendor;
    onSubmit: (data: any, documents?: File[], shopImages?: File[]) => Promise<void>;
    isSubmitting: boolean;
}

const VendorAccountForm: React.FC<VendorFormProps> = ({
    mode: initialMode,
    initialData,
    onSubmit,
    isSubmitting,
}) => {
    const { organizationId } = useParams();
    const navigate = useNavigate();


    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.vendor?.list;
    // const canCreate = role === "owner" || permission?.vendor?.create
    const canEdit = role === "owner" || permission?.vendor?.edit
    // const canDelete = role === "owner" || permission?.vendor?.delete


    // --- State ---
    const [currentMode, setCurrentMode] = useState<'create' | 'view' | 'update'>(initialMode);
    const isReadOnly = currentMode === 'view';

    const [formData, setFormData] = useState({
        organizationId: organizationId,
        clientId: initialData?.clientId || null,
        firstName: '',
        companyName: '',
        shopDisplayName: "",
        vendorCategory: "",
        shopFullAddress: "",
        email: '',
        phone: { work: '', mobile: '' },
        language: 'English',
        pan: "",
        tan: "",
        gstin: "",
        msmeNo: "",
        cin: "",
        businessStructure: "",
        bankAccNo: "",
        accHolderName: "",
        bankName: "",
        upiId: "",
        bankBranch: "",
        ifscCode: "",
        mapUrl: "",
        openingBalance: 0,
        paymentTerms: 'Due on Receipt',
        location: { latitude: 0, longitude: 0 },
        priority: [] as string[]
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedShopImages, setSelectedShopImages] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // --- Effects ---
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                organizationId: initialData.organizationId || organizationId,
                clientId: initialData.clientId || null,
                firstName: initialData.firstName || '',
                companyName: initialData.companyName || '',
                shopDisplayName: initialData.shopDisplayName || '',
                vendorCategory: initialData.vendorCategory || '',
                shopFullAddress: initialData.shopFullAddress || '',
                email: initialData.email || '',
                phone: {
                    work: initialData.phone?.work || '',
                    mobile: initialData.phone?.mobile || ''
                },
                language: initialData.language || 'English',
                pan: initialData.pan || '',
                tan: initialData.tan || '',
                gstin: initialData.gstin || '',
                msmeNo: initialData.msmeNo || '',
                cin: initialData.cin || '',
                businessStructure: initialData.businessStructure || '',
                bankAccNo: initialData.bankAccNo || '',
                accHolderName: initialData.accHolderName || '',
                bankName: initialData.bankName || '',
                upiId: initialData.upiId || '',
                bankBranch: initialData.bankBranch || '',
                ifscCode: initialData.ifscCode || '',
                mapUrl: initialData.mapUrl || '',
                openingBalance: initialData.openingBalance || 0,
                paymentTerms: initialData.paymentTerms || 'Due on Receipt',
                location: {
                    latitude: initialData?.location?.latitude || 0,
                    longitude: initialData?.location?.longitude || 0
                },
                priority: initialData?.priority || []
            }));
        }
    }, [initialData, organizationId]);

    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (type: 'mobile' | 'work', value: string) => {
        const cleanValue = value.replace(/[^0-9]/g, '');
        setFormData(prev => ({ ...prev, phone: { ...prev.phone, [type]: cleanValue } }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setSelectedFiles(Array.from(e.target.files));
    };
    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleShopImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setSelectedShopImages(Array.from(e.target.files));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName?.trim()) newErrors.firstName = 'Vendor name is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        if (formData.phone.mobile && formData.phone.mobile.length !== 10) newErrors['phone.mobile'] = 'Must be 10 digits';
        setErrors(newErrors);
        console.log("mew errors", newErrors)
        return Object.keys(newErrors).length === 0;
    };


    const handleSetTags = (newTags: string[] | ((prev: string[]) => string[])) => {
        setFormData((prev: any) => ({
            ...prev,
            priority: typeof newTags === 'function' ? newTags(prev.priority) : newTags
        }));
    };



    const handleSubmit = async () => {
        if (!validateForm()) return;
        if (currentMode === 'create') {
            await onSubmit(formData as CreateVendorPayload, selectedFiles, selectedShopImages);
        } else {
            await onSubmit(formData as UpdateVendorPayload, selectedFiles, selectedShopImages);
            setCurrentMode('view');
            setSelectedFiles([]);
            setSelectedShopImages([]);
        }
    };

    // --- Derived Data ---
    const existingImages = initialData?.documents?.filter((f: any) => f.type === 'image') || [];
    const existingPdfs = initialData?.documents?.filter((f: any) => f.type === 'pdf') || [];

    // Combine existing shop images with newly selected ones (as preview URLs) for the Gallery
    const combinedShopImages = [
        ...(initialData?.shopImages?.filter((f: any) => f.type === 'image') || []),
        ...selectedShopImages.map(file => ({
            type: 'image',
            url: URL.createObjectURL(file),
            originalName: file.name
        }))
    ];

    const getMapSrc = () => {
        if (formData.location.latitude && formData.location.longitude) {
            return `https://maps.google.com/maps?q=${formData.location.latitude},${formData.location.longitude}&hl=en&z=14&output=embed`;
        }
        return null;
    };

    // return (
    //     <div className="max-w-full overflow-y-auto mx-auto h-full flex flex-col pb-10 font-sans">
    //         {/* --- Header --- */}
    //         <div className="mb-6 flex items-center justify-between">
    //             <div className="flex items-center gap-4">
    //                 <button onClick={() => navigate(-1)} className='bg-white hover:bg-gray-50 w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full shadow-sm transition-colors'>
    //                     <i className="fas fa-arrow-left text-gray-600"></i>
    //                 </button>
    //                 <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
    //                     <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-lg">
    //                         <i className={`fas ${currentMode === 'create' ? 'fa-plus' : 'fa-store'}`}></i>
    //                     </span>
    //                     {currentMode === 'create' ? 'Create Vendor' : 'Vendor Details'}
    //                 </h1>
    //             </div>
    //             <div className="flex gap-3">
    //                 {(currentMode === 'view' && canEdit) && (
    //                     <Button onClick={() => setCurrentMode('update')} className="bg-blue-600 text-white shadow-sm">
    //                         <i className="fas fa-edit mr-2"></i> Edit Details
    //                     </Button>
    //                 )}
    //                 {currentMode === 'update' && (
    //                     <Button onClick={() => { setCurrentMode('view'); setSelectedShopImages([]); setSelectedFiles([]); }} variant="outline" className="bg-white">
    //                         Cancel Edit
    //                     </Button>
    //                 )}
    //                 {!isReadOnly && (
    //                     <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 text-white hover:bg-green-700">
    //                         {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save mr-2"></i> Save Changes</>}
    //                     </Button>
    //                 )}
    //             </div>
    //         </div>

    //         <Card className="p-6 shadow-sm border border-gray-100">
    //             <div className="space-y-8">

    //                 {/* --- SECTION 1: Basic Info & Shop Images --- */}
    //                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

    //                     {/* Left: Form Inputs (60%) */}
    //                     <div className="lg:col-span-6 space-y-6">
    //                         <SectionHeader icon="fa-info-circle" title="Basic Information" />

    //                         <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
    //                             {/* Row 1: Vendor Name & Company Name */}
    //                             <div>
    //                                 <InputLabel required>Vendor Name</InputLabel>
    //                                 <ModernInput
    //                                     name="firstName"
    //                                     value={formData.firstName}
    //                                     onChange={handleInputChange}
    //                                     disabled={isReadOnly}
    //                                     placeholder="E.g. John Doe"
    //                                 />
    //                                 {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
    //                             </div>
    //                             <div>
    //                                 <InputLabel>Company Name</InputLabel>
    //                                 <ModernInput
    //                                     name="companyName"
    //                                     value={formData.companyName}
    //                                     onChange={handleInputChange}
    //                                     disabled={isReadOnly}
    //                                     placeholder="Legal Company Name"
    //                                 />
    //                             </div>

    //                             {/* Row 2: Shop Name & Category */}
    //                             <div>
    //                                 <InputLabel>Shop / Display Name</InputLabel>
    //                                 <ModernInput
    //                                     name="shopDisplayName"
    //                                     value={formData.shopDisplayName}
    //                                     onChange={handleInputChange}
    //                                     disabled={isReadOnly}
    //                                     placeholder="Name on Board"
    //                                 />
    //                             </div>
    //                             <div>
    //                                 <InputLabel>Vendor Category</InputLabel>
    //                                 <ModernSelect
    //                                     name="vendorCategory"
    //                                     value={formData.vendorCategory}
    //                                     onChange={handleInputChange}
    //                                     disabled={isReadOnly}
    //                                 >
    //                                     <option value="">Select Category...</option>
    //                                     {CATEGORIES.map(cat => (
    //                                         <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
    //                                     ))}
    //                                 </ModernSelect>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Right: Shop Images (40%) */}
    //                     <div className="lg:col-span-6 flex flex-col">
    //                         <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
    //                             <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
    //                                 <i className="fas fa-images text-blue-500"></i> Shop Images
    //                             </h3>
    //                             {!isReadOnly && (
    //                                 <div className="relative">
    //                                     <label className="cursor-pointer inline-flex items-center px-3 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors">
    //                                         <i className="fas fa-plus mr-1.5"></i> Add Image
    //                                         <input
    //                                             type="file"
    //                                             multiple
    //                                             accept="image/*"
    //                                             className="hidden"
    //                                             onChange={handleShopImageChange}
    //                                         />
    //                                     </label>
    //                                 </div>
    //                             )}
    //                         </div>

    //                         <div className="flex-1 rounded-lg border
    //                          border-gray-200  flex flex-col items-center  min-h-[170px]">
    //                             {combinedShopImages.length > 0 ? (
    //                                 <div className="w-full max-h-[280px] overflow-y-auto">

    //                                     <ImageGalleryExample
    //                                         imageFiles={combinedShopImages}
    //                                         height={150}
    //                                         minWidth={150}
    //                                         maxWidth={200}
    //                                         className='!p-0 !py-0'
    //                                     />
    //                                 </div>
    //                             ) : (
    //                                 <div className="text-center text-gray-400">
    //                                     <i className="fas fa-store-alt text-4xl mb-2 opacity-20"></i>
    //                                     <p className="text-xs">No shop images uploaded</p>
    //                                 </div>
    //                             )}
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* --- SECTION 2: Contact & Location --- */}
    //                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    //                     {/* Left: Contact Inputs (60%) */}
    //                     <div className="lg:col-span-6 space-y-6">
    //                         <SectionHeader icon="fa-map-marker-alt" title="Contact & Location" />

    //                         <div>
    //                             <InputLabel>Shop Full Address</InputLabel>
    //                             <textarea
    //                                 name="shopFullAddress"
    //                                 value={formData.shopFullAddress}
    //                                 onChange={handleInputChange}
    //                                 disabled={isReadOnly}
    //                                 rows={2}
    //                                 placeholder="Enter full address including pincode"
    //                                 className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 bg-white disabled:bg-gray-50 resize-none"
    //                             />
    //                         </div>

    //                         <div className="grid grid-cols-2 gap-5">
    //                             <div>
    //                                 <InputLabel>Email Address</InputLabel>
    //                                 <ModernInput
    //                                     type="email"
    //                                     name="email"
    //                                     value={formData.email}
    //                                     onChange={handleInputChange}
    //                                     disabled={isReadOnly}
    //                                     placeholder="email@example.com"
    //                                 />
    //                                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
    //                             </div>
    //                             <div>
    //                                 <InputLabel>Google Map Link</InputLabel>
    //                                 <div className="relative">
    //                                     <ModernInput
    //                                         value={formData.mapUrl || ''}
    //                                         onChange={(e) => setFormData(prev => ({ ...prev, mapUrl: e.target.value }))}
    //                                         disabled={isReadOnly}
    //                                         placeholder="https://maps.app.goo.gl..."
    //                                         className="pr-16" // space for button
    //                                     />
    //                                     {formData.mapUrl && (
    //                                         <a
    //                                             href={formData.mapUrl}
    //                                             target="_blank"
    //                                             rel="noreferrer"
    //                                             className="absolute right-1 top-1 bottom-1 px-2 flex items-center text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
    //                                         >
    //                                             Open
    //                                         </a>
    //                                     )}
    //                                 </div>
    //                             </div>
    //                             <div>
    //                                 <InputLabel>Mobile Number</InputLabel>
    //                                 <ModernInput
    //                                     value={formData.phone.mobile}
    //                                     onChange={(e) => handlePhoneChange('mobile', e.target.value)}
    //                                     disabled={isReadOnly}
    //                                     maxLength={10}
    //                                     placeholder="10 Digit Mobile"
    //                                 />
    //                                 {errors['phone.mobile'] && <p className="text-red-500 text-xs mt-1">{errors['phone.mobile']}</p>}
    //                             </div>
    //                             <div>
    //                                 <InputLabel>Work / Landline</InputLabel>
    //                                 <ModernInput
    //                                     value={formData.phone.work}
    //                                     onChange={(e) => handlePhoneChange('work', e.target.value)}
    //                                     disabled={isReadOnly}
    //                                     maxLength={12}
    //                                     placeholder="STD + Number"
    //                                 />
    //                             </div>
    //                         </div>


    //                         <div className="pt-4 border-t border-gray-100">
    //                             {/* <label className="block text-sm font-bold text-gray-700 mb-2">
    //                                 <i className="fas fa-tags mr-2 text-blue-500"></i>Priority Tags
    //                             </label> */}
    //                             <InputLabel>Tags</InputLabel>
    //                             <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
    //                                 <SmartTagInput
    //                                     tags={formData.priority}
    //                                     setState={handleSetTags}
    //                                 // suggestionFetcher={async () => ['high', 'electrical', 'plumbing', 'general', 'urgent']}
    //                                 />
    //                                 <p className="text-[10px] text-gray-400 mt-2 italic">These tags are used to filter shops when sending procurement requests.</p>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Right: Map Preview (40%) */}
    //                     <div className="lg:col-span-6 flex flex-col">
    //                         <div className="flex items-center mb-4 pb-2 border-b border-gray-100 h-[38px]"> {/* Height matched with header */}
    //                             <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Map Preview</h3>
    //                         </div>
    //                         <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative min-h-[200px]">
    //                             {getMapSrc() ? (
    //                                 <iframe
    //                                     title="map"
    //                                     width="100%"
    //                                     height="100%"
    //                                     frameBorder="0"
    //                                     src={getMapSrc()!}
    //                                     className="w-full h-full"
    //                                 />
    //                             ) : (
    //                                 <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
    //                                     <i className="fas fa-map-marked-alt text-4xl mb-2 opacity-20"></i>
    //                                     <p className="text-xs text-center px-6">
    //                                         {formData.mapUrl ? "Save to generate preview" : "Paste Map URL to see preview"}
    //                                     </p>
    //                                 </div>
    //                             )}
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* --- SECTION 3: Tax & Statutory (Dense Grid) --- */}
    //                 <div>
    //                     <SectionHeader icon="fa-file-invoice" title="Tax & Statutory Details" />
    //                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    //                         <div>
    //                             <InputLabel>GSTIN</InputLabel>
    //                             <ModernInput name="gstin" value={formData.gstin} onChange={handleInputChange} disabled={isReadOnly} placeholder="GSTIN" className="uppercase" />
    //                         </div>
    //                         <div>
    //                             <InputLabel>PAN Number</InputLabel>
    //                             <ModernInput name="pan" value={formData.pan} onChange={handleInputChange} disabled={isReadOnly} placeholder="PAN" className="uppercase" />
    //                         </div>
    //                         <div>
    //                             <InputLabel>TAN Number</InputLabel>
    //                             <ModernInput name="tan" value={formData.tan} onChange={handleInputChange} disabled={isReadOnly} placeholder="TAN" className="uppercase" />
    //                         </div>
    //                         <div>
    //                             <InputLabel>MSME No</InputLabel>
    //                             <ModernInput name="msmeNo" value={formData.msmeNo} onChange={handleInputChange} disabled={isReadOnly} placeholder="Udyam" />
    //                         </div>
    //                         <div>
    //                             <InputLabel>CIN (Pvt Ltd)</InputLabel>
    //                             <ModernInput name="cin" value={formData.cin} onChange={handleInputChange} disabled={isReadOnly} placeholder="CIN" />
    //                         </div>
    //                         <div>
    //                             <InputLabel>Business Structure</InputLabel>
    //                             <ModernSelect name="businessStructure" value={formData.businessStructure} onChange={handleInputChange} disabled={isReadOnly}>
    //                                 <option value="">Select...</option>
    //                                 {BUSINESS_STRUCTURES.map(s => (
    //                                     <option key={s} value={s}>{s.replace("_", " ").toUpperCase()}</option>
    //                                 ))}
    //                             </ModernSelect>
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* --- SECTION 4: Banking (Dense Grid) --- */}
    //                 {/* <div className="bg-gray-50 p-4 rounded-lg border border-gray-200"> */}
    //                 <div>
    //                     <SectionHeader icon="fa-university" title="Banking & Financials" />
    //                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    //                         <div className="md:col-span-2 lg:col-span-1">
    //                             <InputLabel>Bank Name</InputLabel>
    //                             <ModernInput name="bankName" value={formData.bankName} onChange={handleInputChange} disabled={isReadOnly} />
    //                         </div>
    //                         <div className="md:col-span-2 lg:col-span-1">
    //                             <InputLabel>Account Holder</InputLabel>
    //                             <ModernInput name="accHolderName" value={formData.accHolderName} onChange={handleInputChange} disabled={isReadOnly} />
    //                         </div>
    //                         <div>
    //                             <InputLabel>Account Number</InputLabel>
    //                             <ModernInput name="bankAccNo" value={formData.bankAccNo} onChange={handleInputChange} disabled={isReadOnly} />
    //                         </div>
    //                         <div>
    //                             <InputLabel>IFSC Code</InputLabel>
    //                             <ModernInput name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} disabled={isReadOnly} className="uppercase" />
    //                         </div>
    //                         <div>
    //                             <InputLabel>Branch</InputLabel>
    //                             <ModernInput name="bankBranch" value={formData.bankBranch} onChange={handleInputChange} disabled={isReadOnly} />
    //                         </div>
    //                         <div>
    //                             <InputLabel>UPI ID</InputLabel>
    //                             <ModernInput name="upiId" value={formData.upiId} onChange={handleInputChange} disabled={isReadOnly} />
    //                         </div>
    //                         <div>
    //                             <InputLabel>Payment Terms</InputLabel>
    //                             <ModernSelect name="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange} disabled={isReadOnly}>
    //                                 {['Due on Receipt', 'Net 7 days', 'Net 15 days', 'Net 30 days', '50% Advance'].map(t => <option key={t} value={t}>{t}</option>)}
    //                             </ModernSelect>
    //                         </div>
    //                         <div>
    //                             <InputLabel>Opening Balance</InputLabel>
    //                             <ModernInput type="number" name="openingBalance" value={formData.openingBalance} onChange={handleInputChange} disabled={isReadOnly} />
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* --- SECTION 5: Documents (User's Exact UI Logic) --- */}
    //                 {(existingImages.length > 0 || existingPdfs.length > 0) && (
    //                     <section>
    //                         <SectionHeader icon="fa-folder-open" title="Attached Documents" />

    //                         {/* Images Gallery */}
    //                         {existingImages.length > 0 && (
    //                             <div className="mb-6">
    //                                 <div className="flex items-center gap-2 mb-3">
    //                                     <i className="fas fa-images text-purple-600"></i>
    //                                     <h4 className="font-semibold text-gray-800 text-sm">Images</h4>
    //                                     <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
    //                                         {existingImages.length}
    //                                     </span>
    //                                 </div>
    //                                 <ImageGalleryExample
    //                                     imageFiles={existingImages}
    //                                     height={150}
    //                                     minWidth={150}
    //                                     maxWidth={200}
    //                                 />
    //                             </div>
    //                         )}

    //                         {/* PDFs List */}
    //                         {existingPdfs.length > 0 && (
    //                             <div>
    //                                 <div className="flex items-center gap-2 mb-3">
    //                                     <i className="fas fa-file-pdf text-red-600"></i>
    //                                     <h4 className="font-semibold text-gray-800 text-sm">PDF Documents</h4>
    //                                     <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
    //                                         {existingPdfs.length}
    //                                     </span>
    //                                 </div>
    //                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    //                                     {existingPdfs.map((file: any, i: number) => (
    //                                         <div key={i} className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-100 hover:shadow-sm transition-all">
    //                                             <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-500 text-lg border border-red-100">
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
    //                                             <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-800">
    //                                                 Open
    //                                             </a>
    //                                         </div>
    //                                     ))}
    //                                 </div>
    //                             </div>
    //                         )}
    //                     </section>
    //                 )}

    //                 {/* Upload New Documents */}
    //                 {!isReadOnly && (
    //                     <section>
    //                         <SectionHeader icon="fa-cloud-upload-alt" title={currentMode === 'create' ? 'Upload Documents' : 'Add New Documents'} />

    //                         <div className="relative w-full h-28 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50 flex flex-col items-center justify-center group">
    //                             <input
    //                                 type="file"
    //                                 multiple
    //                                 accept="image/*,.pdf"
    //                                 onChange={handleFileChange}
    //                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
    //                             />
    //                             <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 group-hover:text-blue-500 transition-colors mb-2"></i>
    //                             <p className="text-sm text-gray-600 font-medium">Click to upload files</p>
    //                             <p className="text-[10px] text-gray-400">PDF, PNG, JPG</p>
    //                         </div>

    //                         {/* New Files Preview */}
    //                         {selectedFiles.length > 0 && (
    //                             <div className="mt-4 space-y-2">
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
        <div className="max-w-full overflow-y-auto mx-auto h-full flex flex-col pb-10 font-sans">
            {/* --- Header --- */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className='bg-brand-surface hover:bg-brand-surface-hover w-9 h-9 flex items-center justify-center border border-ash-medium rounded-full shadow-sm transition-colors'>
                        <i className="fas fa-arrow-left text-text-main"></i>
                    </button>
                    <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
                        <span className="bg-brand-ash border border-ash-medium text-action-primary w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm">
                            <i className={`fas ${currentMode === 'create' ? 'fa-plus' : 'fa-store'}`}></i>
                        </span>
                        {currentMode === 'create' ? 'Create Vendor' : 'Vendor Details'}
                    </h1>
                </div>
                <div className="flex gap-3">
                    {(currentMode === 'view' && canEdit) && (
                        <Button  onClick={() => setCurrentMode('update')} variant='dark' className="bg-action-primary hover:bg-action-primary-hover text-brand-surface shadow-sm transition-colors">
                            <i className="fas fa-edit mr-2"></i> Edit Details
                        </Button>
                    )}
                    {currentMode === 'update' && (
                        <Button  onClick={() => { setCurrentMode('view'); setSelectedShopImages([]); setSelectedFiles([]); }} variant="outline" 
                        className="bg-brand-surface border-ash-medium text-text-main hover:bg-brand-surface-hover transition-colors">
                            Cancel Edit
                        </Button>
                    )}
                    {!isReadOnly && (
                        <Button type="button" variant='dark' onClick={handleSubmit} disabled={isSubmitting} 
                        className=" text-brand-surface hover:opacity-90 transition-opacity">
                            {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save mr-2"></i> Save Changes</>}
                        </Button>
                    )}
                </div>
            </div>

            <Card className="p-6 shadow-sm border border-ash-light bg-brand-surface">
                <div className="space-y-8">

                    {/* --- SECTION 1: Basic Info & Shop Images --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left: Form Inputs (60%) */}
                        <div className="lg:col-span-6 space-y-6">
                            <SectionHeader icon="fa-info-circle" title="Basic Information" />

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                                {/* Row 1: Vendor Name & Company Name */}
                                <div>
                                    <InputLabel required>Vendor Name</InputLabel>
                                    <ModernInput
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="E.g. John Doe"
                                    />
                                    {errors.firstName && <p className="text-action-danger text-xs mt-1">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <InputLabel>Company Name</InputLabel>
                                    <ModernInput
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="Legal Company Name"
                                    />
                                </div>

                                {/* Row 2: Shop Name & Category */}
                                <div>
                                    <InputLabel>Shop / Display Name</InputLabel>
                                    <ModernInput
                                        name="shopDisplayName"
                                        value={formData.shopDisplayName}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="Name on Board"
                                    />
                                </div>
                                <div>
                                    <InputLabel>Vendor Category</InputLabel>
                                    <ModernSelect
                                        name="vendorCategory"
                                        value={formData.vendorCategory}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                    >
                                        <option value="">Select Category...</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                        ))}
                                    </ModernSelect>
                                </div>
                            </div>
                        </div>

                        {/* Right: Shop Images (40%) */}
                        <div className="lg:col-span-6 flex flex-col">
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-ash-medium">
                                <h3 className="text-sm font-bold text-text-main uppercase tracking-wide flex items-center gap-2">
                                    <i className="fas fa-images text-action-primary"></i> Shop Images
                                </h3>
                                {!isReadOnly && (
                                    <div className="relative">
                                        <label className="cursor-pointer inline-flex items-center px-3 py-1 text-xs font-medium text-action-primary bg-brand-ash border border-ash-medium rounded-full hover:bg-brand-surface-hover transition-colors">
                                            <i className="fas fa-plus mr-1.5"></i> Add Image
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleShopImageChange}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 rounded-lg border border-ash-medium flex flex-col items-center min-h-[170px] bg-brand-surface">
                                {combinedShopImages.length > 0 ? (
                                    <div className="w-full max-h-[280px] overflow-y-auto custom-scrollbar">
                                        <ImageGalleryExample
                                            imageFiles={combinedShopImages}
                                            height={150}
                                            minWidth={150}
                                            maxWidth={200}
                                            className='!p-0 !py-0'
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-full w-full items-center justify-center text-text-soft">
                                        <i className="fas fa-store-alt text-4xl mb-2 opacity-50"></i>
                                        <p className="text-xs">No shop images uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- SECTION 2: Contact & Location --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left: Contact Inputs (60%) */}
                        <div className="lg:col-span-6 space-y-6">
                            <SectionHeader icon="fa-map-marker-alt" title="Contact & Location" />

                            <div>
                                <InputLabel>Shop Full Address</InputLabel>
                                <textarea
                                    name="shopFullAddress"
                                    value={formData.shopFullAddress}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    rows={2}
                                    placeholder="Enter full address including pincode"
                                    className="w-full rounded-lg border border-ash-medium shadow-sm focus:border-action-primary focus:ring-action-primary sm:text-sm py-2.5 px-3.5 bg-brand-surface text-text-main placeholder-text-soft disabled:bg-brand-ash disabled:text-text-muted resize-none outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
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
                                <div>
                                    <InputLabel>Google Map Link</InputLabel>
                                    <div className="relative flex items-center">
                                        <ModernInput
                                            value={formData.mapUrl || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, mapUrl: e.target.value }))}
                                            disabled={isReadOnly}
                                            placeholder="https://maps.app.goo.gl..."
                                            className="pr-16" // space for button
                                        />
                                        {formData.mapUrl && (
                                            <a
                                                href={formData.mapUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute right-1.5 px-2.5 py-1 text-xs font-medium bg-brand-ash border border-ash-medium text-action-primary rounded hover:bg-brand-surface-hover transition-colors"
                                            >
                                                Open
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <InputLabel>Mobile Number</InputLabel>
                                    <ModernInput
                                        value={formData.phone.mobile}
                                        onChange={(e) => handlePhoneChange('mobile', e.target.value)}
                                        disabled={isReadOnly}
                                        maxLength={10}
                                        placeholder="10 Digit Mobile"
                                    />
                                    {errors['phone.mobile'] && <p className="text-action-danger text-xs mt-1">{errors['phone.mobile']}</p>}
                                </div>
                                <div>
                                    <InputLabel>Work / Landline</InputLabel>
                                    <ModernInput
                                        value={formData.phone.work}
                                        onChange={(e) => handlePhoneChange('work', e.target.value)}
                                        disabled={isReadOnly}
                                        maxLength={12}
                                        placeholder="STD + Number"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-ash-medium">
                                <InputLabel>Tags</InputLabel>
                                <div className="bg-brand-ash p-4 rounded-xl border border-dashed border-ash-medium">
                                    <SmartTagInput
                                        tags={formData.priority}
                                        setState={handleSetTags}
                                    />
                                    <p className="text-[10px] text-text-soft mt-2 italic">These tags are used to filter shops when sending procurement requests.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Map Preview (40%) */}
                        <div className="lg:col-span-6 flex flex-col">
                            <div className="flex items-center mb-4 pb-2 border-b border-ash-medium h-[38px]">
                                <h3 className="text-sm font-bold text-text-main uppercase tracking-wide">Map Preview</h3>
                            </div>
                            <div className="flex-1 bg-brand-ash rounded-lg overflow-hidden border border-ash-medium relative min-h-[200px]">
                                {getMapSrc() ? (
                                    <iframe
                                        title="map"
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        src={getMapSrc()!}
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-text-soft">
                                        <i className="fas fa-map-marked-alt text-4xl mb-2 opacity-50"></i>
                                        <p className="text-xs text-center px-6">
                                            {formData.mapUrl ? "Save to generate preview" : "Paste Map URL to see preview"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- SECTION 3: Tax & Statutory (Dense Grid) --- */}
                    <div>
                        <SectionHeader icon="fa-file-invoice" title="Tax & Statutory Details" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div>
                                <InputLabel>GSTIN</InputLabel>
                                <ModernInput name="gstin" value={formData.gstin} onChange={handleInputChange} disabled={isReadOnly} placeholder="GSTIN" className="uppercase" />
                            </div>
                            <div>
                                <InputLabel>PAN Number</InputLabel>
                                <ModernInput name="pan" value={formData.pan} onChange={handleInputChange} disabled={isReadOnly} placeholder="PAN" className="uppercase" />
                            </div>
                            <div>
                                <InputLabel>TAN Number</InputLabel>
                                <ModernInput name="tan" value={formData.tan} onChange={handleInputChange} disabled={isReadOnly} placeholder="TAN" className="uppercase" />
                            </div>
                            <div>
                                <InputLabel>MSME No</InputLabel>
                                <ModernInput name="msmeNo" value={formData.msmeNo} onChange={handleInputChange} disabled={isReadOnly} placeholder="Udyam" />
                            </div>
                            <div>
                                <InputLabel>CIN (Pvt Ltd)</InputLabel>
                                <ModernInput name="cin" value={formData.cin} onChange={handleInputChange} disabled={isReadOnly} placeholder="CIN" />
                            </div>
                            <div>
                                <InputLabel>Business Structure</InputLabel>
                                <ModernSelect name="businessStructure" value={formData.businessStructure} onChange={handleInputChange} disabled={isReadOnly}>
                                    <option value="">Select...</option>
                                    {BUSINESS_STRUCTURES.map(s => (
                                        <option key={s} value={s}>{s.replace("_", " ").toUpperCase()}</option>
                                    ))}
                                </ModernSelect>
                            </div>
                        </div>
                    </div>

                    {/* --- SECTION 4: Banking (Dense Grid) --- */}
                    <div>
                        <SectionHeader icon="fa-university" title="Banking & Financials" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2 lg:col-span-1">
                                <InputLabel>Bank Name</InputLabel>
                                <ModernInput name="bankName" value={formData.bankName} onChange={handleInputChange} disabled={isReadOnly} />
                            </div>
                            <div className="md:col-span-2 lg:col-span-1">
                                <InputLabel>Account Holder</InputLabel>
                                <ModernInput name="accHolderName" value={formData.accHolderName} onChange={handleInputChange} disabled={isReadOnly} />
                            </div>
                            <div>
                                <InputLabel>Account Number</InputLabel>
                                <ModernInput name="bankAccNo" value={formData.bankAccNo} onChange={handleInputChange} disabled={isReadOnly} />
                            </div>
                            <div>
                                <InputLabel>IFSC Code</InputLabel>
                                <ModernInput name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} disabled={isReadOnly} className="uppercase" />
                            </div>
                            <div>
                                <InputLabel>Branch</InputLabel>
                                <ModernInput name="bankBranch" value={formData.bankBranch} onChange={handleInputChange} disabled={isReadOnly} />
                            </div>
                            <div>
                                <InputLabel>UPI ID</InputLabel>
                                <ModernInput name="upiId" value={formData.upiId} onChange={handleInputChange} disabled={isReadOnly} />
                            </div>
                            <div>
                                <InputLabel>Payment Terms</InputLabel>
                                <ModernSelect name="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange} disabled={isReadOnly}>
                                    {['Due on Receipt', 'Net 7 days', 'Net 15 days', 'Net 30 days', '50% Advance'].map(t => <option key={t} value={t}>{t}</option>)}
                                </ModernSelect>
                            </div>
                            <div>
                                <InputLabel>Opening Balance</InputLabel>
                                <ModernInput type="number" name="openingBalance" value={formData.openingBalance} onChange={handleInputChange} disabled={isReadOnly} />
                            </div>
                        </div>
                    </div>

                    {/* --- SECTION 5: Documents (User's Exact UI Logic) --- */}
                    {(existingImages.length > 0 || existingPdfs.length > 0) && (
                        <section>
                            <SectionHeader icon="fa-folder-open" title="Attached Documents" />

                            {/* Images Gallery */}
                            {existingImages.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-images text-action-primary"></i>
                                        <h4 className="font-semibold text-text-main text-sm">Images</h4>
                                        <span className="text-xs bg-brand-ash border border-ash-medium text-text-strong px-2 py-0.5 rounded-full shadow-sm">
                                            {existingImages.length}
                                        </span>
                                    </div>
                                    <ImageGalleryExample
                                        imageFiles={existingImages}
                                        height={150}
                                        minWidth={150}
                                        maxWidth={200}
                                    />
                                </div>
                            )}

                            {/* PDFs List */}
                            {existingPdfs.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-file-pdf text-action-danger"></i>
                                        <h4 className="font-semibold text-text-main text-sm">PDF Documents</h4>
                                        <span className="text-xs bg-brand-ash border border-ash-medium text-text-strong px-2 py-0.5 rounded-full shadow-sm">
                                            {existingPdfs.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {existingPdfs.map((file: any, i: number) => (
                                            <div key={i} className="flex items-center gap-3 bg-brand-surface p-3 rounded-lg border border-ash-medium hover:shadow-md transition-all">
                                                <div className="w-10 h-10 bg-brand-ash rounded-lg flex items-center justify-center text-action-danger text-lg border border-ash-light">
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
                                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-action-primary hover:text-action-primary-hover transition-colors">
                                                    Open
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Upload New Documents */}
                    {!isReadOnly && (
                        <section>
                            <SectionHeader icon="fa-cloud-upload-alt" title={currentMode === 'create' ? 'Upload Documents' : 'Add New Documents'} />

                            <div className="relative w-full h-28 border-2 border-dashed border-ash-medium rounded-lg hover:border-action-primary transition-colors bg-brand-ash flex flex-col items-center justify-center group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                <i className="fas fa-cloud-upload-alt text-2xl text-text-soft group-hover:text-action-primary transition-colors mb-2"></i>
                                <p className="text-sm text-text-main font-medium">Click to upload files</p>
                                <p className="text-[10px] text-text-muted mt-1">PDF, PNG, JPG</p>
                            </div>

                            {/* New Files Preview */}
                            {selectedFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-brand-surface border border-ash-medium rounded-lg shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf text-action-danger' : 'fa-file-image text-action-primary'}`}></i>
                                                <span className="text-sm text-text-main font-medium">{file.name}</span>
                                                <span className="text-xs text-text-muted bg-brand-ash px-2 py-0.5 rounded-full border border-ash-light">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </div>
                                            <button type="button" onClick={() => removeFile(index)} className="text-text-soft hover:text-action-danger transition-colors px-2">
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

export default VendorAccountForm;