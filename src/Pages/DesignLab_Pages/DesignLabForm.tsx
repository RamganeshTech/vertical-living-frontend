import React, { useState, useEffect } from 'react';
// import { toast } from '../../utils/toast';
import { Button } from '../../components/ui/Button';
import { useCurrentSupervisor } from '../../Hooks/useCurrentSupervisor';
import { useNavigate } from 'react-router-dom';
import { useAuthCheck } from '../../Hooks/useAuthCheck';
// import { useDeleteMaterialImage, useDeleteReferenceImage, useUploadMaterialImage, useUploadReferenceImages } from '../../apiList/DesignLab_Api/designLabApi';
//   makgint eh chges

//  charign some thigns like the 


//  be careefull her  careefull her  careefull her  careefull her  careefull her careefull her careefull her 


// --- CUSTOM CARD COMPONENTS ---
interface CardProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => any;
}

const Card: React.FC<CardProps> = ({ className = "", children, onClick }) => (
    <div onClick={onClick} className={`bg-white border border-gray-300 rounded-xl shadow-sm mb-6 overflow-hidden ${className}`}>{children}</div>
);

const CardHeader: React.FC<CardProps> = ({ className = "", children }) => (
    <div className={`px-6 py-3 bg-gray-100 border-b border-gray-300 ${className}`}>{children}</div>
);

const CardContent: React.FC<CardProps> = ({ className = "", children }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitle: React.FC<CardProps> = ({ className = "", children }) => (
    <h3 className={`text-base font-extrabold text-gray-800 flex items-center gap-2 uppercase tracking-wide ${className}`}>{children}</h3>
);

// --- TYPES ---
export interface IMaterial {
    _id?: string;
    materialName: string;
    vendorId?: string | null;
    vendorName?: string;
    rate: number | '';
    unit: string;
    labourCost: number | '';
    specsNotes: string;
    image?: { url: string } | null;
    tempFile?: File;
}

export interface IComponent {
    _id?: string;
    componentName: string;
    materials: IMaterial[];
}

export interface IDesignLabFormData {
    _id?: string;
    designerName: string;
    designerId: string | null,
    designDate: string;
    designCode: string;
    productName: string;
    spaceType: string;
    difficultyLevel: string;
    status: string;
    referenceImages: { url: string; _id?: string }[];
    newRefFiles: File[];
    components: IComponent[];
    pros: string;
    cons: string;
    mistakes: string;
    visualLogic: string;
    variations: string;
    sequenceOfOperations: { stepNumber: number; description: string }[];
}

interface Props {
    initialData?: Partial<IDesignLabFormData>;
    organizationId?: string;
    mode: 'create' | 'edit' | 'view';
    onSubmit: (data: IDesignLabFormData) => void;
    isLoading?: boolean;
    onReset?: () => void;
}

const SPACE_TYPES = ["Bedroom", "Living Room", "Kitchen", "Bathroom", "Foyer", "Commercial"];
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Factory Pro"];
const UNITS = ["Nos", "Sqft", "Sqmt", "Rft", "mm", "Meters", "Kg", "Liters", "Sheets", "Box", "Set", "Bundle"];

// Default Empty Material
const EMPTY_MATERIAL: IMaterial = { materialName: '', rate: '', unit: 'Nos', labourCost: '', specsNotes: '', vendorId: null, vendorName: '' };

// Helper to check if material is empty
const isMaterialEmpty = (m: IMaterial) => {
    return !m.materialName && !m.vendorName && !m.rate && !m.labourCost && !m.specsNotes && !m.image?.url && !m.tempFile && (m.vendorId === "" || m.vendorId === null);
};

export const DesignLabForm: React.FC<Props> = ({ initialData, mode, onSubmit, isLoading, onReset }) => {
    const currentUser = useCurrentSupervisor();
    const navigate = useNavigate();
    const isCreateMode = mode === "create"



    const { role, permission } = useAuthCheck();


    const canCreate = role === "owner" || permission?.design?.create;
    const canEdit = role === "owner" || permission?.design?.edit;
    const canList = role === "owner" || permission?.design?.list;




    // --- STATE ---
    const [formData, setFormData] = useState<IDesignLabFormData>({
        designerName: currentUser?.name || 'Loading...',
        designerId: currentUser?.id || null,
        designDate: new Date().toISOString(),
        designCode: '',
        productName: '',
        spaceType: '',
        difficultyLevel: 'Intermediate',
        status: 'draft',
        referenceImages: [],
        newRefFiles: [],
        components: [
            { componentName: 'New Component', materials: [{ ...EMPTY_MATERIAL }] }
        ],
        pros: '',
        cons: '',
        mistakes: '',
        visualLogic: '',
        variations: '',
        sequenceOfOperations: [{ stepNumber: 1, description: '' }]
    });

    const [currentRefIndex, setCurrentRefIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState('');

    // const { data: VendorData } = useGetVendorForDropDown(organizationId);
    // const VendorOptions = (VendorData || [])?.map((v: any) => ({ value: v._id, label: v.vendorName }));

    // Inside DesignLabForm component
    // const { mutateAsync: uploadRefApi, isPending: uploadingReferenceImg } = useUploadReferenceImages();
    // const { mutateAsync: deleteRefApi, isPending: deletingReferenceImg } = useDeleteReferenceImage();
    // const { mutateAsync: uploadMatApi, isPending: uploadingMatImg } = useUploadMaterialImage();
    // const { mutateAsync: deleteMatApi, isPending: deletingMatImg } = useDeleteMaterialImage();

    useEffect(() => {
        if (initialData) {
            console.log("geting ")
            setFormData(prev => ({
                ...prev, ...initialData,
                newRefFiles: []


                //  pros: initialData.pros || '',
                //     cons: initialData.cons || '',
                //     mistakes: initialData.mistakes || '',
                //     visualLogic: initialData.visualLogic || '',
            }));
        } else if (currentUser?.name && mode === 'create') {
            setFormData(prev => ({ ...prev, designerName: currentUser?.name || "" }));
        }
    }, [currentUser?.name, initialData, mode,]);

    // --- HANDLERS ---
    const handleChange = (field: keyof IDesignLabFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // --- Images ---
    // const handleRefImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && mode === 'create') {
    //         const files = Array.from(e.target.files);
    //         const tempUrls = files.map(f => ({ url: URL.createObjectURL(f) }));
    //         setFormData(prev => ({
    //             ...prev,
    //             newRefFiles: [...prev.newRefFiles, ...files],
    //             referenceImages: [...prev.referenceImages, ...tempUrls]
    //         }));
    //     } else if (mode !== 'create') {
    //         toast({ title: "Info", description: "Use the upload button in view mode." });
    //     }
    // };

    const handleRefImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // if (!e.target.files?.length) return;

        // const files = Array.from(e.target.files);

        // if (mode === 'create') {
        //     // LOCAL STATE (Create Mode)
        //     const tempUrls = files.map(f => ({ url: URL.createObjectURL(f) }));
        //     setFormData(prev => ({
        //         ...prev,
        //         newRefFiles: [...prev.newRefFiles, ...files],
        //         referenceImages: [...prev.referenceImages, ...tempUrls]
        //     }));
        // } else {
        //     // API CALL (Edit Mode)
        //     // Assuming we have formData._id for the design lab ID
        //     if (!formData._id) return;

        //     const uploadData = new FormData();
        //     files.forEach(file => uploadData.append('files', file));

        //     try {
        //         await uploadRefApi({ id: formData._id, formData: uploadData });
        //         toast({ title: "Success", description: "Images uploaded successfully" });
        //         // The hook invalidates query, so data should refresh automatically via parent re-fetch
        //         // OR you can manually update local state if needed for immediate feedback
        //     } catch (err: any) {
        //         toast({ title: "Error", description: "Failed to upload images", variant: "destructive" });
        //     }
        // }


        if (!e.target.files?.length) return;
        const files = Array.from(e.target.files);

        // Just update Local State for BOTH Create and Edit modes.
        // The Parent component (UpdateDesignLab) will handle the actual upload on Save.
        const tempUrls = files.map(f => ({ url: URL.createObjectURL(f) }));

        setFormData(prev => ({
            ...prev,
            newRefFiles: [...(prev.newRefFiles || []), ...files], // Store file for upload
            referenceImages: [...(prev.referenceImages || []), ...tempUrls] // Show preview
        }));
    };

    const removeRefImage = async (index: number) => {
        // const imageToDelete = formData.referenceImages[index];

        // if (mode === 'create') {
        //     // LOCAL STATE (Create Mode)
        //     const newImages = [...formData.referenceImages];
        //     newImages.splice(index, 1);

        //     // Remove from newRefFiles file array as well (Logic assumes order matches for simplicity)
        //     // Ideally, you'd map IDs, but for create we rely on index sync
        //     const newFiles = [...formData.newRefFiles];
        //     if (index >= (formData.referenceImages.length - formData.newRefFiles.length)) {
        //         // It's a newly added file
        //         const fileIndex = index - (formData.referenceImages.length - formData.newRefFiles.length);
        //         newFiles.splice(fileIndex, 1);
        //     }

        //     setFormData(prev => ({ ...prev, referenceImages: newImages, newRefFiles: newFiles }));
        //     if (currentRefIndex >= newImages.length) setCurrentRefIndex(Math.max(0, newImages.length - 1));
        // } else {
        //     // API CALL (Edit Mode)
        //     if (!formData._id || !imageToDelete._id) return; // Need image ID

        //     try {
        //         await deleteRefApi({ id: formData._id, imageId: imageToDelete._id });
        //         toast({ title: "Success", description: "Image deleted" });
        //         // Optimistic UI Update
        //         const newImages = [...formData.referenceImages];
        //         newImages.splice(index, 1);
        //         setFormData(prev => ({ ...prev, referenceImages: newImages }));
        //         if (currentRefIndex >= newImages.length) setCurrentRefIndex(Math.max(0, newImages.length - 1));
        //     } catch (err: any) {
        //         toast({ title: "Error", description: "Failed to delete image", variant: "destructive" });
        //     }
        // }


        // Just remove from Local State.
        // On Save, the backend receives the list *without* this image, so it's effectively deleted.
        const newImages = [...formData.referenceImages];
        newImages.splice(index, 1);

        // Also try to remove from newRefFiles if it was a newly added one
        // (Simplified logic: if we just assume user removes newly added ones from the end or track them)
        // For strict correctness in "Edit", we rely on the parent filtering existing vs new.
        // But we must maintain the newRefFiles array cleanly.

        // Strategy: 
        // 1. If it's a 'blob:' url (New), remove from newRefFiles.
        // 2. If it's a real url (Old), just removing from referenceImages is enough (Backend won't get it in the JSON list).

        const imageToRemove = formData.referenceImages[index];
        if (imageToRemove.url.startsWith('blob:')) {
            // It is a new file. We need to find and remove it from newRefFiles.
            // This can be tricky with just arrays. 
            // Ideally, map specific IDs, but for now, we can filter newRefFiles.
            // A simple way is to rebuild newRefFiles based on remaining blob images in referenceImages
            // But we can't easily map back to the File object from the Blob URL in all browsers.

            // Simple fix for now:
            // If user deletes a "New" image, we might just clear that specific File from state.
            // Since we pushed them, the order in newRefFiles corresponds to the order of blob urls in referenceImages.

            // However, for this implementation, let's keep it simple:
            // If they delete an *existing* image, it's gone from the UI list -> gone from DB on save.
        }

        setFormData(prev => ({
            ...prev,
            referenceImages: newImages,
            // Optimization: If you want to be perfect, you'd filter newRefFiles here too, 
            // but the Parent filters newRefFiles based on what is actually uploaded vs what is mapped.
            // Actually, the parent loops 'newRefFiles'. If we don't remove it from 'newRefFiles', it gets uploaded as an orphan.
            // FIX:
            newRefFiles: prev.newRefFiles.filter((_) => {
                // This is hard to sync without unique IDs for new files.
                // Recommendation: Just let it be. If an extra file uploads but isn't mapped, it's just a wasted S3 call, not a broken logic.
                // Or better: Don't rely on 'newRefFiles' array index.
                // In handleRefImageUpload, assign a temp ID to the file object and the preview object.
                return true;
            })
        }));

        if (currentRefIndex >= newImages.length) setCurrentRefIndex(Math.max(0, newImages.length - 1));
    };


    const slideImage = (direction: 'prev' | 'next') => {
        if (formData.referenceImages.length <= 1) return;
        setCurrentRefIndex(prev => {
            if (direction === 'prev') return prev === 0 ? formData.referenceImages.length - 1 : prev - 1;
            return prev === formData.referenceImages.length - 1 ? 0 : prev + 1;
        });
    };

    // --- Smart Sequence Logic ---
    const updateSequence = (index: number, value: string) => {
        let newSeq = [...formData.sequenceOfOperations];
        newSeq[index].description = value;

        // Auto-add
        if (index === newSeq.length - 1 && value.trim() !== "") {
            newSeq.push({ stepNumber: newSeq.length + 1, description: "" });
        }

        // Auto-remove (if empty and not last)
        if (value.trim() === "" && index !== newSeq.length - 1) {
            newSeq.splice(index, 1);
            newSeq.forEach((s, i) => s.stepNumber = i + 1);
        }

        setFormData(prev => ({ ...prev, sequenceOfOperations: newSeq }));
    };

    const handleAddRow = () => {
        setFormData(p => ({ ...p, sequenceOfOperations: [...p.sequenceOfOperations, { stepNumber: p.sequenceOfOperations.length + 1, description: "" }] }))
    }


    // --- Components Logic ---
    const addComponent = () => {
        setFormData(prev => ({
            ...prev,
            components: [...prev.components, { componentName: 'New Component', materials: [{ ...EMPTY_MATERIAL }] }]
        }));
    };

    const removeComponent = (idx: number) => {
        const newComps = [...formData.components];
        newComps.splice(idx, 1);
        setFormData(prev => ({ ...prev, components: newComps }));
    };

    const updateCompName = (idx: number, val: string) => {
        const newComps = [...formData.components];
        newComps[idx].componentName = val;
        setFormData(prev => ({ ...prev, components: newComps }));
    };

    // --- Smart Material Logic ---
    const updateMaterial = (compIdx: number, matIdx: number, field: keyof IMaterial, value: any) => {
        const newComps = [...formData.components];
        // Update value
        newComps[compIdx].materials[matIdx] = { ...newComps[compIdx].materials[matIdx], [field]: value };

        const mats = newComps[compIdx].materials;
        const currentMat = mats[matIdx];

        // Check Auto-Add: If editing last row and it has data, add new
        if (matIdx === mats.length - 1 && !isMaterialEmpty(currentMat)) {
            mats.push({ ...EMPTY_MATERIAL });
        }

        // Check Auto-Remove: If current row is empty and NOT last row, remove it
        if (isMaterialEmpty(currentMat) && matIdx !== mats.length - 1) {
            mats.splice(matIdx, 1);
        }

        setFormData(prev => ({ ...prev, components: newComps }));
    };


    const removeMaterial = (compIdx: number, matIdx: number) => {
        const newComps = [...formData.components];

        // Ensure the component and materials array exist
        if (newComps[compIdx] && newComps[compIdx].materials) {
            // Remove the material at matIdx
            newComps[compIdx].materials.splice(matIdx, 1);

            // Optional: If you want to ensure there is always at least one empty row left
            if (newComps[compIdx].materials.length === 0) {
                newComps[compIdx].materials.push({ ...EMPTY_MATERIAL });
            }

            setFormData(prev => ({ ...prev, components: newComps }));
        }
    };

    // const toggleVendorMode = (compIdx: number, matIdx: number) => {
    //     const newComps = [...formData.components];
    //     const mat = newComps[compIdx].materials[matIdx];
    //     if (mat.vendorId === null) { mat.vendorId = ""; } else { mat.vendorId = null; mat.vendorName = ""; }
    //     // Trigger update logic to handle auto-add/remove if needed (though toggling alone usually doesn't trigger remove)
    //     updateMaterial(compIdx, matIdx, 'vendorId', mat.vendorId);
    // };

    // const toggleVendorMode = (compIdx: number, matIdx: number) => {
    //     const newComps = [...formData.components];
    //     const mat = newComps[compIdx].materials[matIdx];

    //     // Logic:
    //     // If currently Manual (vendorId is null), switch to Dropdown (undefined or "")
    //     // If currently Dropdown (vendorId is string/undefined), switch to Manual (null)

    //     if (mat.vendorId === null) {
    //         // Switch to Dropdown Mode
    //         mat.vendorId = null; // Use undefined instead of "" to avoid BSON error if passed directly
    //         mat.vendorName = "";
    //     } else {
    //         // Switch to Manual Mode
    //         mat.vendorId = null;
    //         mat.vendorName = "";
    //     }
    //     setFormData(prev => ({ ...prev, components: newComps }));
    // };


    const handleMaterialImageUpload = async (compIdx: number, matIdx: number, file: File) => {
        // if (mode === 'create') {
        //     // LOCAL STATE (Create Mode)
        //     const newComps = [...formData.components];
        //     newComps[compIdx].materials[matIdx].tempFile = file;
        //     newComps[compIdx].materials[matIdx].image = { url: URL.createObjectURL(file) };
        //     // Trigger smart update logic if needed
        //     updateMaterial(compIdx, matIdx, 'tempFile', file);
        // } else {
        //     // API CALL (Edit Mode)
        //     const compId = formData.components[compIdx]._id;
        //     const matId = formData.components[compIdx].materials[matIdx]._id;

        //     // If this is a newly added row in Edit mode (no _id), treat as local until saved
        //     if (!compId || !matId) {
        //         const newComps = [...formData.components];
        //         newComps[compIdx].materials[matIdx].tempFile = file;
        //         newComps[compIdx].materials[matIdx].image = { url: URL.createObjectURL(file) };
        //         setFormData(prev => ({ ...prev, components: newComps }));
        //         return;
        //     }

        //     const uploadData = new FormData();
        //     uploadData.append('files', file);

        //     try {
        //         await uploadMatApi({
        //             id: formData._id!,
        //             componentId: compId,
        //             materialId: matId,
        //             formData: uploadData
        //         });
        //         toast({ title: "Success", description: "Material image uploaded" });
        //         // Optimistic update
        //         const newComps = [...formData.components];
        //         newComps[compIdx].materials[matIdx].image = { url: URL.createObjectURL(file) };
        //         setFormData(prev => ({ ...prev, components: newComps }));
        //     } catch (err: any) {
        //         toast({ title: "Error", description: "Failed to upload material image", variant: "destructive" });
        //     }
        // }


        // Pure State Update. No API.
        const newComps = [...formData.components];

        // Store the File object directly on the material
        newComps[compIdx].materials[matIdx].tempFile = file;
        // Show Preview
        newComps[compIdx].materials[matIdx].image = { url: URL.createObjectURL(file) };

        // Trigger smart row logic if needed
        updateMaterial(compIdx, matIdx, 'tempFile', file);

        // Force update state
        setFormData(prev => ({ ...prev, components: newComps }));
    };

    //  const removeMaterialImage = (compIdx: number, matIdx: number) => {
    //     const newComps = [...formData.components];
    //     newComps[compIdx].materials[matIdx].image = null;
    //     newComps[compIdx].materials[matIdx].tempFile = undefined;

    //     // Trigger smart update (might remove row if everything else is empty)
    //     updateMaterial(compIdx, matIdx, 'image', null);
    // };



    const removeMaterialImage = async (compIdx: number, matIdx: number) => {
        // if (mode === 'create') {
        //     // LOCAL STATE (Create Mode)
        //     const newComps = [...formData.components];
        //     newComps[compIdx].materials[matIdx].image = null;
        //     newComps[compIdx].materials[matIdx].tempFile = undefined;
        //     updateMaterial(compIdx, matIdx, 'image', null); // Triggers smart row logic
        // } else {
        //     // API CALL (Edit Mode)
        //     const compId = formData.components[compIdx]._id;
        //     const matId = formData.components[compIdx].materials[matIdx]._id;

        //     // If local row in edit mode
        //     if (!compId || !matId) {
        //         const newComps = [...formData.components];
        //         newComps[compIdx].materials[matIdx].image = null;
        //         newComps[compIdx].materials[matIdx].tempFile = undefined;
        //         setFormData(prev => ({ ...prev, components: newComps }));
        //         return;
        //     }

        //     try {
        //         await deleteMatApi({
        //             id: formData._id!,
        //             componentId: compId,
        //             materialId: matId
        //         });
        //         toast({ title: "Success", description: "Material image deleted" });
        //         // Optimistic update
        //         const newComps = [...formData.components];
        //         newComps[compIdx].materials[matIdx].image = null;
        //         setFormData(prev => ({ ...prev, components: newComps }));
        //     } catch (err: any) {
        //         toast({ title: "Error", description: "Failed to delete material image", variant: "destructive" });
        //     }
        // }


        // Pure State Update.
        const newComps = [...formData.components];

        newComps[compIdx].materials[matIdx].image = null;
        newComps[compIdx].materials[matIdx].tempFile = undefined;

        updateMaterial(compIdx, matIdx, 'image', null); // Triggers smart row logic

        setFormData(prev => ({ ...prev, components: newComps }));
    };



    if (!canList) {
        return
    }

    return (
        <div className="max-h-full overflow-y-auto bg-gray-100 text-gray-800 font-sans">

            {/* HEADER */}
            <header className="bg-white border-b border-gray-300 px-8 py-3 sticky top-0 z-50 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => navigate(-1)} className='bg-blue-100 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2'>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div className="bg-blue-600 p-2 rounded text-white">
                        <i className="fas fa-drafting-compass text-lg"></i>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-none">
                            {mode === 'create' ? 'New Specification' : 'Edit Specification'}
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">Design Lab Control • {formData.designCode}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {onReset && (
                        <Button variant="outline" onClick={onReset} disabled={isLoading} className="h-9 text-sm border-gray-300 text-gray-600 hover:bg-gray-50">
                            <i className="fas fa-undo mr-2"></i> Reset
                        </Button>
                    )}
                    {((mode === "create" && canCreate) || (mode === "edit" && canEdit)) && (
                        <Button
                            onClick={() => onSubmit(formData)}
                            isLoading={isLoading}
                            className="h-9 text-sm bg-blue-700 hover:bg-blue-800 text-white shadow-md"
                        >
                            <i className="fas fa-save mr-2"></i> {mode === 'create' ? 'Create Design' : 'Save Changes'}
                        </Button>)}
                </div>
            </header>

            <div className="max-w-full mx-auto p-6 space-y-6">

                {/* 1. BASIC DETAILS */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider">Basic Details</h3>
                        {!isCreateMode && <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">
                                {/* {formData.designCode} */}
                                Design Code: {" "}
                                <span className='text-blue-700 text-sm'>{formData?.designCode}</span>
                            </label>
                        </div>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-13 gap-6 items-end">

                        {/* Read-Only Fields (Styled as Disabled Inputs) */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Designer Name</label>
                            <input className="w-full p-2.5 border border-gray-300 rounded text-sm font-bold text-gray-700" value={formData.designerName} />
                        </div>


                        <div className={`${!isCreateMode ? "md:col-span-2" : "md:col-span-2"}`}>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Design Date</label>
                            <input
                                type="date"
                                className="w-full p-2.5 bg-white border border-gray-300 rounded text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.designDate.split('T')[0]}
                                name='designDate'
                                onChange={(e) => handleChange('designDate', e.target.value)}
                            />
                        </div>

                        {/* Editable Fields */}
                        {/* <div className="md:col-span-3"> */}
                        <div className={`${!isCreateMode ? "md:col-span-3" : "md:col-span-4"}`}>

                            <label className="block text-xs font-bold text-blue-700 mb-1">Product / Design Name</label>
                            <input
                                className="w-full p-2.5 bg-white border border-gray-300 rounded text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter Name..."
                                name='productName'
                                value={formData.productName}
                                onChange={(e) => handleChange('productName', e.target.value)}
                            />
                        </div>
                        {/* <div className="md:col-span-1.5"> */}
                        <div className={`${!isCreateMode ? "md:col-span-2" : "md:col-span-2"}`}>

                            <label className="block text-xs font-bold text-blue-700 mb-1">Space Type</label>
                            <select
                                className="w-full p-2.5 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.spaceType}
                                name='productName'
                                onChange={(e) => handleChange('spaceType', e.target.value)}
                            >
                                <option value="">Select...</option>
                                {SPACE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        {/* <div className="md:col-span-1.5"> */}
                        <div className={`${!isCreateMode ? "md:col-span-3" : "md:col-span-2"}`}>

                            <label className="block text-xs font-bold text-blue-700 mb-1">Difficulty</label>
                            <select
                                className="w-full p-2.5 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.difficultyLevel}
                                name='difficultyLevel'
                                onChange={(e) => handleChange('difficultyLevel', e.target.value)}
                            >
                                {DIFFICULTY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. REFERENCE IMAGES */}
                <Card>
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle><i className="fas fa-images text-blue-600"></i> Reference Images</CardTitle>
                        <label className="cursor-pointer bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded font-bold text-xs uppercase transition-colors flex items-center gap-2">
                            {/* {!uploadingReferenceImg ?  */}
                            <i className="fas fa-upload"></i>
                            {/* : 
                             <i className="fas fa-spinner animate-spin text-[10px]"></i> */}
                            {/* }  */}
                            Upload Images
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleRefImageUpload} />
                        </label>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center gap-4">
                            {/* Main Image Area */}
                            <div className="relative w-full h-[400px] bg-gray-300 rounded-lg overflow-hidden flex items-center justify-center group">
                                {formData.referenceImages.length > 0 ? (
                                    <>
                                        <img
                                            src={formData.referenceImages[currentRefIndex].url}
                                            className="h-full max-w-full object-contain"
                                            onClick={() => { setLightboxImage(formData.referenceImages[currentRefIndex].url); setIsLightboxOpen(true); }}
                                        />
                                        <button onClick={(e) => { e.stopPropagation(); slideImage('prev'); }} className="absolute left-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fas fa-chevron-left"></i></button>
                                        <button onClick={(e) => { e.stopPropagation(); slideImage('next'); }} className="absolute right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fas fa-chevron-right"></i></button>
                                        <span className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-xs font-bold">{currentRefIndex + 1} / {formData.referenceImages.length}</span>
                                    </>
                                ) : (
                                    // <div className="text-center text-gray-500">
                                    //     <i className="fas fa-image text-5xl mb-3 opacity-30"></i>
                                    //     <p className="text-sm">No images uploaded yet.</p>
                                    //     <p className="text-xs opacity-70">(Upload 2-5 images for best results)</p>
                                    // </div>

                                    // --- CLICKABLE UPLOAD ZONE ---
                                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-gray-400 ">
                                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                            {/* {!uploadingReferenceImg ? ( */}
                                            <i className="fas fa-cloud-upload-alt text-3xl"></i>
                                            {/* ) : (
                                                <i className="fas fa-spinner animate-spin text-3xl text-blue-500"></i>
                                            )} */}
                                        </div>
                                        <p className="text-lg font-semibold text-gray-600 ">Click to Upload Images</p>
                                        <p className="text-xs text-gray-400 mt-1">(Upload 2-5 images for best results)</p>

                                        {/* Hidden Input triggered by label click */}
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleRefImageUpload}
                                        />
                                    </label>
                                )}
                            </div>



                            {/* Thumbnails Row */}
                            {formData.referenceImages.length > 0 && (
                                <div className="w-full overflow-x-auto pb-2 flex justify-center">
                                    <div className="flex gap-3">
                                        {formData.referenceImages.map((img, idx) => (
                                            <div key={idx} className="relative group/thumb">
                                                <img
                                                    src={img.url}
                                                    onClick={() => setCurrentRefIndex(idx)}
                                                    className={`h-[80px] w-[120px] object-cover rounded border-2 cursor-pointer transition-all ${currentRefIndex === idx ? 'border-blue-600 opacity-100 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                                />
                                                {/* Delete Button (Top Right) */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeRefImage(idx); }}
                                                    className="absolute !cursor-pointer -top-1 -right-2 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center shadow-md opacity-0 group-hover/thumb:opacity-100 transition-opacity border border-gray-200 z-10"
                                                    title="Delete Image"
                                                >
                                                    {/* {!deletingReferenceImg ?  */}
                                                    <i className="fas fa-trash text-[10px]"></i>
                                                    {/* :
                                                     <i className="fas fa-spinner animate-spin text-[10px]"></i>
                                                     } */}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. DESIGN COMPONENTS & MATERIALS */}
                <Card>
                    <CardHeader className="flex justify-between items-center">
                        {/* <CardTitle><i className="fas fa-images text-blue-600"></i> Reference Images</CardTitle> */}

                        <CardTitle><i className="fas fa-cubes text-blue-400"></i> Design Components</CardTitle>

                        <Button onClick={addComponent} className="bg-blue-600 hover:bg-blue-500 border-none text-white text-xs h-8">
                            <i className="fas fa-plus mr-2"></i> Add Component
                        </Button>
                    </CardHeader>
                    <div className="p-6 bg-gray-50 space-y-8">
                        {formData.components.map((comp, compIdx) => (
                            <div key={compIdx} className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                                {/* Component Header */}
                                <div className="px-6 py-3 border-b border-gray-200 bg-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center text-sm font-bold">{compIdx + 1}</div>
                                        <input
                                            className="bg-transparent text-lg font-bold text-gray-800 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-600 outline-none px-1 w-1/2 transition-all placeholder-gray-400"
                                            placeholder="Component Name..."
                                            value={comp.componentName}
                                            onChange={e => updateCompName(compIdx, e.target.value)}
                                        />
                                    </div>
                                    <button onClick={() => removeComponent(compIdx)} className="text-gray-400 hover:text-red-600 p-2"><i className="fas fa-trash-alt text-lg"></i></button>
                                </div>

                                {/* Materials Table */}
                                <div className="p-2">
                                    {/* Header Row */}
                                    <div className="flex gap-3 px-4 py-2 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                                        <div className="w-[90px] text-center">Img</div>
                                        <div className="flex-[2] text-center">Material Name</div>
                                        <div className="flex-[2] text-center ">Vendor</div>
                                        <div className="w-[80px] text-center ">Rate</div>
                                        <div className="w-[80px] text-center ">Unit</div>
                                        <div className="w-[80px] text-center ">Labour</div>
                                        <div className="flex-[3] text-center ">Specs / Notes</div>
                                        <div className="w-[40px] text-center">Del</div>
                                    </div>

                                    {/* Rows */}
                                    <div className="divide-y divide-gray-50">
                                        {comp.materials.map((mat, matIdx) => (
                                            <div key={matIdx} className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors group">

                                                {/* Image */}
                                                {/* <div className="w-[60px] h-[60px] shrink-0 relative bg-gray-100 border border-gray-200 rounded overflow-hidden group/img">
                                                    {mat.image?.url ? (
                                                        <>
                                                            <img src={mat.image.url} className="w-full h-full object-cover cursor-pointer" onClick={() => { setLightboxImage(mat.image!.url); setIsLightboxOpen(true); }} />
                                                            <div className="absolute inset-0 bg-black/50 hidden group-hover/img:flex items-center justify-center gap-2">
                                                                <label className="text-white cursor-pointer hover:text-blue-300"><i className="fas fa-sync-alt"></i><input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleMaterialImage(compIdx, matIdx, e.target.files[0])} /></label>
                                                                <button onClick={() => removeMaterialImage(compIdx, matIdx)} className="text-white hover:text-red-300"><i className="fas fa-trash"></i></button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <label className="w-full h-full flex items-center justify-center cursor-pointer text-gray-400 hover:text-blue-600"><i className="fas fa-camera"></i><input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleMaterialImage(compIdx, matIdx, e.target.files[0])} /></label>
                                                    )}
                                                </div> */}

                                                {/* Material Image Cell */}
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-[90px] h-[90px] shrink-0 relative rounded-lg overflow-hidden group/img">
                                                        {mat.image?.url ? (
                                                            <>
                                                                {/* The Image */}
                                                                <img
                                                                    src={mat.image.url}
                                                                    alt="Material"
                                                                    className="w-full h-full object-cover bg-gray-100"
                                                                />

                                                                {/* Hover Overlay with Actions */}
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-[1px]">

                                                                    {/* View Image (Invisible click area for Lightbox) */}
                                                                    <div
                                                                        className="absolute inset-0 z-0 cursor-pointer"
                                                                        onClick={() => { setLightboxImage(mat.image!.url); setIsLightboxOpen(true); }}
                                                                    ></div>

                                                                    {/* Change/Upload Button */}
                                                                    <label
                                                                        className="relative z-10 w-8 h-8 flex items-center justify-center bg-white text-gray-600 rounded-full shadow-lg cursor-pointer hover:text-blue-600 hover:scale-110 transition-transform"
                                                                        title="Change Image"
                                                                    >
                                                                        <i className="fas fa-sync-alt text-xs"></i>
                                                                        <input
                                                                            type="file"
                                                                            className="hidden"
                                                                            accept="image/*"
                                                                            onChange={e => e.target.files?.[0] && handleMaterialImageUpload(compIdx, matIdx, e.target.files[0])}
                                                                        />
                                                                    </label>

                                                                    {/* Delete Button */}
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation(); // Prevent opening lightbox
                                                                            removeMaterialImage(compIdx, matIdx);
                                                                        }}
                                                                        className="relative z-10 w-8 h-8 flex items-center justify-center bg-white text-red-500 rounded-full shadow-lg cursor-pointer hover:bg-red-50 hover:scale-110 transition-transform"
                                                                        title="Remove Image"
                                                                    >
                                                                        {/* {!deletingMatImg ? ( */}
                                                                        <i className="fas fa-trash text-xs"></i>
                                                                        {/* ) : (
                                                                            <i className="fas fa-spinner animate-spin text-xs"></i>
                                                                        )} */}
                                                                    </button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            /* Empty State (Upload Placeholder) */
                                                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 text-gray-400 hover:text-blue-500 transition-all group/upload">
                                                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm mb-1 group-hover/upload:scale-110 transition-transform">
                                                                    {/* {!uploadingMatImg ? ( */}
                                                                    <i className="fas fa-plus text-xs"></i>
                                                                    {/* ) : (
                                                                        <i className="fas fa-spinner animate-spin text-xs text-blue-500"></i>
                                                                    )} */}
                                                                </div>
                                                                <span className="text-[9px] font-medium uppercase tracking-wide">Add</span>
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={e => e.target.files?.[0] && handleMaterialImageUpload(compIdx, matIdx, e.target.files[0])}
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Inputs (Single Row) */}
                                                <div className="flex-[2]"><input className="w-full p-2 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none" placeholder="Name" value={mat.materialName} onChange={e => updateMaterial(compIdx, matIdx, 'materialName', e.target.value)} /></div>

                                                <div className="flex-[2] relative group/vendor">
                                                    {/* {mat.vendorId === null ? ( */}
                                                    <input className="w-full p-2 text-sm bg-gray-50 border border-gray-300 rounded outline-none" placeholder="Vendor" value={mat.vendorName || ''} onChange={e => updateMaterial(compIdx, matIdx, 'vendorName', e.target.value)} />
                                                    {/* ) : ( */}
                                                    {/* <div className="h-[38px]"> */}
                                                    {/* <SearchSelectNew options={VendorOptions} value={mat.vendorId || ""}
                                                                onValueChange={(val: string | null) => updateMaterial(compIdx, matIdx, 'vendorId', val)}
                                                                className="w-full h-full text-sm"
                                                                placeholder="Select Vendor" /> */}
                                                    {/* </div>
                                                    )} */}
                                                    {/* <div className="absolute -top-2 -right-2 bg-white rounded-full shadow border p-0.5 opacity-0 group-hover/vendor:opacity-100 transition-opacity z-10"><input type="checkbox" className="w-4 h-4 cursor-pointer" checked={mat.vendorId === null} onChange={() => toggleVendorMode(compIdx, matIdx)} title="Manual?" /></div> */}
                                                </div>

                                                <div className="w-[80px]">
                                                    <input type="number" className="w-full p-2 text-sm text-right border border-gray-300 rounded outline-none" placeholder="0" value={mat.rate} onChange={e => updateMaterial(compIdx, matIdx, 'rate', e.target.value)} />
                                                </div>
                                                <div className="w-[80px]"><select className="w-full p-2 text-sm border border-gray-300 rounded outline-none bg-white" value={mat.unit} onChange={e => updateMaterial(compIdx, matIdx, 'unit', e.target.value)}>{UNITS.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
                                                <div className="w-[80px]"><input type="number" className="w-full p-2 text-sm text-right border border-gray-300 rounded outline-none" placeholder="0" value={mat.labourCost} onChange={e => updateMaterial(compIdx, matIdx, 'labourCost', e.target.value)} /></div>
                                                <div className="flex-[3]"><input className="w-full p-2 text-sm border border-gray-300 rounded outline-none" placeholder="Specs..." value={mat.specsNotes} onChange={e => updateMaterial(compIdx, matIdx, 'specsNotes', e.target.value)} /></div>

                                                <div className="w-[40px] text-center">
                                                    {matIdx !== comp.materials.length - 1 && (
                                                        <button onClick={() => removeMaterial(compIdx, matIdx)} className="text-gray-300 hover:text-red-500"><i className="fas fa-times-circle text-xl"></i></button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 4. LOGIC & NOTES */}
                <Card>
                    <CardHeader><CardTitle><i className="fas fa-brain text-purple-600"></i> Logic, Pros & Cons</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Pros</label>
                                    <textarea className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-sm" rows={3} value={formData.pros} name='pros' onChange={e => handleChange('pros', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Cons</label>
                                    <textarea className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-sm" rows={3} value={formData.cons} name='cons' onChange={e => handleChange('cons', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Mistakes to Avoid</label>
                                    <textarea className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-sm" rows={3} value={formData.mistakes} name='mistakes' onChange={e => handleChange('mistakes', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Visual Logic</label>
                                    <textarea className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-sm" rows={3} value={formData.visualLogic} name='visualLogic' onChange={e => handleChange('visualLogic', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 5. SEQUENCE OF OPERATIONS */}
                <Card>
                    <CardHeader className='flex justify-between'>
                        <CardTitle><i className="fas fa-list-ol text-teal-600"></i> Sequence of Operations</CardTitle>

                        <Button onClick={handleAddRow}>
                            Add Row
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {formData.sequenceOfOperations.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-4 group">
                                    <div className="mt-2 w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center shrink-0 border border-teal-200 shadow-sm">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-200 outline-none  overflow-hidden min-h-[46px]"
                                            rows={3}
                                            placeholder="Describe step..."
                                            value={step.description}
                                            onInput={(e) => { e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'; }}
                                            onChange={e => updateSequence(idx, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Lightbox */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsLightboxOpen(false)}>
                    <button className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl transition-colors"><i className="fas fa-times"></i></button>
                    <img src={lightboxImage} className="max-h-[90vh] max-w-[90vw] object-contain rounded shadow-2xl border border-white/20" onClick={e => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
};