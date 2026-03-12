


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import type { PincodeFormData } from './PinCodeMain';
// import { Card } from '../../components/ui/Card';
// import { Button } from '../../components/ui/Button';

// interface Props {
//     mode: 'create' | 'view' | 'edit';
//     initialData?: Partial<PincodeFormData>;
//     onSubmit: (data: PincodeFormData) => void;
//     isSubmitting: boolean;
//     canEdit?: boolean;
//     canCreate?: boolean;
// }

// const PincodeForm: React.FC<Props> = ({ mode, initialData, onSubmit, isSubmitting, canEdit, canCreate }) => {

//     const navigate = useNavigate();
//     const [currentMode, setCurrentMode] = useState(mode);
//     const [formData, setFormData] = useState<PincodeFormData>({
//         pincode: '', areaName: '', localityName: '', taluk: '', districtId: null, zoneId: null,
//         state: 'Tamil Nadu', latitude: null, longitude: null, urbanClassification: 'Urban',
//         activeStatus: true, serviceStatus: 'Active', serviceMode: 'Direct Core',
//         approvalRequired: false, minOrderValue: 0, directMarginPercent: 0, partnerMarginPercent: 0,
//         transportFactor: 1.0, installFactor: 1.0, serviceFactor: 1.0, complexityFactor: 1.0,
//         riskLevel: 'Low', notes: ''
//     });

//     useEffect(() => {
//         if (initialData) setFormData(prev => ({ ...prev, ...initialData }));
//     }, [initialData]);

//     const isReadOnly = currentMode === 'view';
//     const isEditMode = currentMode === 'edit';
//     const isCreateMode = currentMode === 'create';

//     const toggleEdit = () => setCurrentMode(prev => prev === 'view' ? 'edit' : 'view');

//     // Professional Input Wrapper to reduce repetition
//     const InputField = ({ label, icon, children }: { label: string, icon?: string, children: React.ReactNode }) => (
//         <div className="space-y-1.5">
//             <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
//                 {icon && <i className={`${icon} text-blue-500`}></i>}
//                 {label}
//             </label>
//             {children}
//         </div>
//     );

//     console.log("canCreate",canCreate)

//     return (
//         <div className="bg-gray-50/50 min-h-full pb-10">
//             {/* --- TOP PROFESSIONAL HEADER --- */}
//             <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 mb-8 flex justify-between items-center shadow-sm">
//                 <div className='flex items-center gap-5'>
//                     <button 
//                         type="button" 
//                         onClick={() => navigate(-1)} 
//                         className='bg-white hover:bg-gray-100 w-10 h-10 border border-gray-200 text-gray-600 cursor-pointer rounded-xl flex items-center justify-center transition-all shadow-sm'
//                     >
//                         <i className="fas fa-chevron-left text-sm"></i>
//                     </button>
//                     <div>
//                         <div className="flex items-center gap-3">
//                             <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
//                                 {isCreateMode ? 'Initialize Pincode' : isEditMode ? 'Modify Parameters' : 'Regional Audit'}
//                             </h1>
//                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isReadOnly ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
//                                 {currentMode} Mode
//                             </span>
//                         </div>
//                         <p className="text-gray-500 text-xs mt-0.5 font-medium">
//                             {formData.pincode ? `Locality Control: ${formData.areaName || formData.pincode}` : 'Configure logistics and serviceability logic'} [cite: 10]
//                         </p>
//                     </div>
//                 </div>

//                 <div className='flex gap-3 items-center'>
//                     {(isReadOnly && canEdit) && (
//                         <Button onClick={toggleEdit} className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 rounded-xl font-bold transition-all">
//                             <i className="fas fa-pen-nib mr-2 text-xs"></i>Unlock for Editing
//                         </Button>
//                     )}
//                     {(isCreateMode || isEditMode) && (
//                         <div className="flex gap-3">
//                             <Button 
//                                 onClick={() => onSubmit(formData)} 
//                                 className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all" 
//                                 disabled={isSubmitting}
//                             >
//                                 {isSubmitting ? <i className="fas fa-circle-notch fa-spin mr-2"></i> : <i className="fas fa-check-double mr-2 text-xs"></i>}
//                                 {isCreateMode ? 'Commit Pincode' : 'Push Updates'}
//                             </Button>
//                             <Button variant="outline" onClick={isCreateMode ? () => navigate(-1) : toggleEdit} className="rounded-xl border-gray-300 font-bold px-6">
//                                 Cancel
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//             </header>

//             <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-12 gap-8">

//                 {/* --- LEFT COLUMN: GEOGRAPHY & LOGISTICS --- */}
//                 <div className="col-span-12 lg:col-span-8 space-y-8">

//                     {/* GEOGRAPHIC MASTER DATA */}
//                     <Card className="p-8 border-none shadow-xl shadow-gray-200/50 rounded-3xl space-y-8">
//                         <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
//                             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
//                                 <i className="fas fa-globe-asia"></i>
//                             </div>
//                             <h3 className="text-lg font-bold text-gray-800">Geographic Master Data [cite: 78]</h3>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <InputField label="Pincode [cite: 79]" icon="fas fa-hashtag">
//                                 <input disabled={isReadOnly} className="professional-input" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} placeholder="600XXX" />
//                             </InputField>
//                             <InputField label="Area Name [cite: 80]" icon="fas fa-map-signs">
//                                 <input disabled={isReadOnly} className="professional-input" value={formData.areaName} onChange={e => setFormData({...formData, areaName: e.target.value})} placeholder="Main Area" />
//                             </InputField>
//                             <InputField label="Locality [cite: 81]" icon="fas fa-building">
//                                 <input disabled={isReadOnly} className="professional-input" value={formData.localityName} onChange={e => setFormData({...formData, localityName: e.target.value})} placeholder="Specific Locality" />
//                             </InputField>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <InputField label="Taluk [cite: 82]" icon="fas fa-landmark">
//                                 <input disabled={isReadOnly} className="professional-input" value={formData.taluk} onChange={e => setFormData({...formData, taluk: e.target.value})} />
//                             </InputField>
//                             <InputField label="District [cite: 83]" icon="fas fa-city">
//                                 <input disabled={isReadOnly} className="professional-input" value={formData.districtId as any || ''} onChange={e => setFormData({...formData, districtId: e.target.value as any})} placeholder="MongooseID/Name" />
//                             </InputField>
//                             <InputField label="State [cite: 85]" icon="fas fa-flag">
//                                 <input disabled={isReadOnly} className="professional-input" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
//                             </InputField>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
//                             <InputField label="Latitude [cite: 88]" icon="fas fa-crosshairs">
//                                 <input type="number" disabled={isReadOnly} className="professional-input" value={formData.latitude || ''} onChange={e => setFormData({...formData, latitude: +e.target.value})} />
//                             </InputField>
//                             <InputField label="Longitude [cite: 89]" icon="fas fa-compass">
//                                 <input type="number" disabled={isReadOnly} className="professional-input" value={formData.longitude || ''} onChange={e => setFormData({...formData, longitude: +e.target.value})} />
//                             </InputField>
//                         </div>
//                     </Card>

//                     {/* COMMERCIAL RISK & NOTES */}
//                     <Card className="p-8 border-none shadow-xl shadow-gray-200/50 rounded-3xl space-y-6">
//                         <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
//                                 <i className="fas fa-sticky-note"></i>
//                             </div>
//                             <h3 className="text-lg font-bold text-gray-800">Operational Intelligence [cite: 136, 138]</h3>
//                         </div>
//                         <InputField label="Audit Notes & Location Risks [cite: 138]" icon="fas fa-comment-dots">
//                             <textarea 
//                                 disabled={isReadOnly} 
//                                 rows={4} 
//                                 className="professional-input resize-none" 
//                                 value={formData.notes} 
//                                 onChange={e => setFormData({...formData, notes: e.target.value})}
//                                 placeholder="Mention site restrictions, association rules, or delivery issues..."
//                             />
//                         </InputField>
//                     </Card>
//                 </div>

//                 {/* --- RIGHT COLUMN: BUSINESS RULES & MARGINS --- */}
//                 <div className="col-span-12 lg:col-span-4 space-y-8">

//                     {/* SERVICEABILITY STATUS */}
//                     <Card className="p-8 border-none bg-white shadow-xl shadow-gray-200/50 rounded-3xl space-y-6 border-l-4 border-blue-500">
//                         <InputField label="Service Mode [cite: 96]" icon="fas fa-truck-loading">
//                             <select disabled={isReadOnly} className="professional-select" value={formData.serviceMode} onChange={e => setFormData({...formData, serviceMode: e.target.value as any})}>
//                                 <option value="Direct Core">Direct Core</option>
//                                 <option value="Direct Extended">Direct Extended</option>
//                                 <option value="Hybrid">Hybrid Controlled</option>
//                                 <option value="Partner Managed">Partner Managed</option>
//                             </select>
//                         </InputField>

//                         <InputField label="Current Status [cite: 95]" icon="fas fa-info-circle">
//                             <select disabled={isReadOnly} className="professional-select" value={formData.serviceStatus} onChange={e => setFormData({...formData, serviceStatus: e.target.value as any})}>
//                                 <option value="Active">Active / Open</option>
//                                 <option value="Restricted">Restricted Scope</option>
//                                 <option value="Blocked">Blocked / Unserviceable</option>
//                                 <option value="Approval Required">Needs Management Review</option>
//                             </select>
//                         </InputField>

//                         <InputField label="Urban Classification [cite: 87]" icon="fas fa-tree">
//                             <select disabled={isReadOnly} className="professional-select" value={formData.urbanClassification} onChange={e => setFormData({...formData, urbanClassification: e.target.value as any})}>
//                                 <option value="Urban">Urban Center</option>
//                                 <option value="Semi-Urban">Semi-Urban</option>
//                                 <option value="Rural">Rural / Remote</option>
//                             </select>
//                         </InputField>

//                         <div className="pt-4 flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200">
//                             <div className="space-y-1">
//                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">System Approval [cite: 131]</span>
//                                 <p className="text-xs font-medium text-gray-600">Manual review for quotation?</p>
//                             </div>
//                             <input 
//                                 type="checkbox" 
//                                 disabled={isReadOnly} 
//                                 checked={formData.approvalRequired} 
//                                 onChange={e => setFormData({...formData, approvalRequired: e.target.checked})}
//                                 className="w-5 h-5 accent-blue-600 cursor-pointer"
//                             />
//                         </div>
//                     </Card>

//                     {/* PROFITABILITY ENGINE */}
//                     <Card className="p-8 border-none bg-gray-900 shadow-2xl shadow-blue-900/20 rounded-3xl space-y-8 text-white">
//                         <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
//                                 <i className="fas fa-chart-line"></i>
//                             </div>
//                             <h3 className="text-lg font-bold">Profitability Engine [cite: 121-124]</h3>
//                         </div>

//                         <InputField label="Min Order Value (MOV) [cite: 124]" icon="fas fa-tag">
//                             <div className="relative">
//                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
//                                 <input type="number" disabled={isReadOnly} className="professional-input !bg-gray-800 !border-gray-700 !text-white !pl-7" value={formData.minOrderValue} onChange={e => setFormData({...formData, minOrderValue: +e.target.value})} />
//                             </div>
//                         </InputField>

//                         <div className="grid grid-cols-2 gap-4">
//                             <InputField label="Direct Margin % [cite: 122]" icon="fas fa-percentage">
//                                 <input type="number" disabled={isReadOnly} className="professional-input !bg-gray-800 !border-gray-700 !text-white" value={formData.directMarginPercent} onChange={e => setFormData({...formData, directMarginPercent: +e.target.value})} />
//                             </InputField>
//                             <InputField label="Partner Margin % [cite: 123]" icon="fas fa-handshake">
//                                 <input type="number" disabled={isReadOnly} className="professional-input !bg-gray-800 !border-gray-700 !text-white" value={formData.partnerMarginPercent} onChange={e => setFormData({...formData, partnerMarginPercent: +e.target.value})} />
//                             </InputField>
//                         </div>

//                         <div className="space-y-4 pt-6 border-t border-gray-800">
//                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Execution Factors [cite: 126-129]</span>
//                             <div className="grid grid-cols-2 gap-x-4 gap-y-6">
//                                 <InputField label="Transport [cite: 126]"><input step="0.1" type="number" disabled={isReadOnly} className="factor-input" value={formData.transportFactor} onChange={e => setFormData({...formData, transportFactor: +e.target.value})} /></InputField>
//                                 <InputField label="Installation [cite: 127]"><input step="0.1" type="number" disabled={isReadOnly} className="factor-input" value={formData.installFactor} onChange={e => setFormData({...formData, installFactor: +e.target.value})} /></InputField>
//                                 <InputField label="Service [cite: 128]"><input step="0.1" type="number" disabled={isReadOnly} className="factor-input" value={formData.serviceFactor} onChange={e => setFormData({...formData, serviceFactor: +e.target.value})} /></InputField>
//                                 <InputField label="Complexity [cite: 129]"><input step="0.1" type="number" disabled={isReadOnly} className="factor-input" value={formData.complexityFactor} onChange={e => setFormData({...formData, complexityFactor: +e.target.value})} /></InputField>
//                             </div>
//                         </div>
//                     </Card>
//                 </div>
//             </div>

//             {/* CSS INJECTION FOR PROFESSIONAL UI */}
//             <style>{`
//                 .professional-input {
//                     width: 100%;
//                     padding: 0.75rem 1rem;
//                     background: #fff;
//                     border: 1.5px solid #f1f3f5;
//                     border-radius: 1rem;
//                     font-size: 0.875rem;
//                     font-weight: 500;
//                     color: #212529;
//                     transition: all 0.2s;
//                 }
//                 .professional-input:focus {
//                     outline: none;
//                     border-color: #3b82f6;
//                     box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.05);
//                 }
//                 .professional-input:disabled {
//                     background: #f8f9fa;
//                     color: #adb5bd;
//                     border-color: #f1f3f5;
//                     cursor: not-allowed;
//                 }
//                 .professional-select {
//                     appearance: none;
//                     width: 100%;
//                     padding: 0.75rem 1rem;
//                     background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23adb5bd' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 1rem center;
//                     border: 1.5px solid #f1f3f5;
//                     border-radius: 1rem;
//                     font-size: 0.875rem;
//                     font-weight: 600;
//                     color: #212529;
//                     transition: all 0.2s;
//                     cursor: pointer;
//                 }
//                 .professional-select:focus {
//                     outline: none;
//                     border-color: #3b82f6;
//                 }
//                 .factor-input {
//                     width: 100%;
//                     padding: 0.5rem;
//                     background: #1a1d21;
//                     border: 1.5px solid #2d3339;
//                     border-radius: 0.75rem;
//                     text-align: center;
//                     font-weight: 800;
//                     font-size: 1.125rem;
//                     color: #3b82f6;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default PincodeForm;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PincodeFormData } from './PinCodeMain';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface Props {
    mode: 'create' | 'view' | 'edit';
    initialData?: Partial<PincodeFormData>;
    onSubmit: (data: PincodeFormData) => void;
    isSubmitting: boolean;
    canEdit?: boolean;
    canCreate?: boolean;
}

// Helper component for consistent spacing and labeling
const InputWrapper = ({ label, icon, children }: { label: string, icon?: string, children: React.ReactNode }) => (
    <div className="space-y-1.5 group">
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
            {icon && <i className={`${icon} text-gray-400 group-focus-within:text-blue-500`}></i>}
            {label}
        </label>
        {children}
    </div>
);

const PincodeForm: React.FC<Props> = ({ mode, initialData, onSubmit, isSubmitting, canEdit, canCreate }) => {
    const navigate = useNavigate();
    const [currentMode, setCurrentMode] = useState(mode);
    const [formData, setFormData] = useState<PincodeFormData>({
        pincode: '', areaName: '', localityName: '', taluk: '', district: null, zone: null,
        state: 'Tamil Nadu', latitude: null, longitude: null, urbanClassification: 'Urban',
        activeStatus: true, serviceStatus: 'Active', serviceMode: 'Direct Core',
        approvalRequired: false, minOrderValue: 0, directMarginPercent: 0, partnerMarginPercent: 0,
        transportFactor: 1.0, installFactor: 1.0, serviceFactor: 1.0, complexityFactor: 1.0,
        riskLevel: 'Low', notes: ''
    });

    useEffect(() => {
        if (initialData) setFormData(prev => ({ ...prev, ...initialData }));
    }, [initialData]);

    const isReadOnly = currentMode === 'view';
    const isEditMode = currentMode === 'edit';
    const isCreateMode = currentMode === 'create';

    const toggleEdit = () => setCurrentMode(prev => prev === 'view' ? 'edit' : 'view');



    return (
        // <div className="bg-[#f8fafc] h-full max-h-full overflow-y-auto pb-12">
        //     {/* --- PROFESSIONAL NAVIGATION HEADER --- */}
        //     <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-8 py-4 mb-8 flex justify-between items-center shadow-sm">
        //         <div className='flex items-center gap-6'>
        //             <button 
        //                 type="button" 
        //                 onClick={() => navigate(-1)} 
        //                 className='bg-white hover:bg-gray-50 w-10 h-10 border border-gray-200 text-gray-700 cursor-pointer rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-md'
        //             >
        //                 <i className="fas fa-arrow-left text-sm"></i>
        //             </button>
        //             <div>
        //                 <div className="flex items-center gap-3">
        //                     <h1 className="text-2xl font-black text-gray-900 tracking-tight">
        //                         {isCreateMode ? 'Initialize Pincode' : isEditMode ? 'Modify Parameters' : 'Regional Audit'}
        //                     </h1>
        //                     <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${isReadOnly ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
        //                         {currentMode}
        //                     </div>
        //                 </div>
        //                 <p className="text-gray-500 text-xs mt-1 font-medium italic">
        //                     Vertical Living &bull; Serviceability Engine [cite: 8]
        //                 </p>
        //             </div>
        //         </div>

        //         <div className='flex gap-3 items-center'>
        //             {(isReadOnly && canEdit) && (
        //                 <Button onClick={toggleEdit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-xl shadow-lg shadow-blue-100">
        //                     <i className="fas fa-edit mr-2 text-xs"></i> Edit Details
        //                 </Button>
        //             )}
        //             {(isCreateMode || isEditMode) && (
        //                 <div className="flex gap-3">
        //                     <Button 
        //                         onClick={() => onSubmit(formData)} 
        //                         className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all" 
        //                         disabled={isSubmitting}
        //                     >
        //                         {isSubmitting ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2 text-xs"></i>}
        //                         {isCreateMode ? 'Save Pincode' : 'Push Changes'}
        //                     </Button>
        //                     <Button variant="outline" onClick={isCreateMode ? () => navigate(-1) : toggleEdit} className="rounded-xl border-gray-300 font-bold px-6 text-gray-600">
        //                         Cancel
        //                     </Button>
        //                 </div>
        //             )}
        //         </div>
        //     </header>

        //     <div className="max-w-full mx-auto px-2 grid grid-cols-1 lg:grid-cols-12 gap-8">

        //         {/* --- PRIMARY CONTENT: GEOGRAPHY & NOTES --- */}
        //         <div className="lg:col-span-8 space-y-8">

        //             {/* GEOGRAPHIC MASTER DATA [cite: 78-89] */}
        //             <Card className="p-8 border-gray-200 shadow-sm rounded-[2rem] bg-white">
        //                 <div className="flex items-center gap-4 border-b border-gray-50 pb-6 mb-8">
        //                     <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
        //                         <i className="fas fa-map-marked-alt text-xl"></i>
        //                     </div>
        //                     <div>
        //                         <h3 className="text-lg font-black text-gray-800">Regional Identity [cite: 78]</h3>
        //                         <p className="text-xs text-gray-400 font-medium">Core geographic identifiers for lead mapping</p>
        //                     </div>
        //                 </div>

        //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        //                     <InputWrapper label="Pincode [cite: 79]" icon="fas fa-hashtag">
        //                         <input disabled={isReadOnly} className="pro-input" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} placeholder="600XXX" />
        //                     </InputWrapper>
        //                     <InputWrapper label="Area Name [cite: 80]" icon="fas fa-map-pin">
        //                         <input disabled={isReadOnly} className="pro-input" value={formData.areaName} onChange={e => setFormData({...formData, areaName: e.target.value})} placeholder="Chennai Central" />
        //                     </InputWrapper>
        //                     <InputWrapper label="Locality [cite: 81]" icon="fas fa-city">
        //                         <input disabled={isReadOnly} className="pro-input" value={formData.localityName} onChange={e => setFormData({...formData, localityName: e.target.value})} placeholder="Adyar" />
        //                     </InputWrapper>
        //                 </div>

        //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        //                     <InputWrapper label="Taluk [cite: 82]" icon="fas fa-landmark">
        //                         <input disabled={isReadOnly} className="pro-input" value={formData.taluk} onChange={e => setFormData({...formData, taluk: e.target.value})} />
        //                     </InputWrapper>
        //                     <InputWrapper label="District [cite: 83]" icon="fas fa-atlas">
        //                         <input disabled={isReadOnly} className="pro-input" value={formData.districtId as any || ''} onChange={e => setFormData({...formData, districtId: e.target.value as any})} />
        //                     </InputWrapper>
        //                     <InputWrapper label="State [cite: 85]" icon="fas fa-flag">
        //                         <input disabled={isReadOnly} className="pro-input" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
        //                     </InputWrapper>
        //                 </div>

        //                 {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
        //                     <InputWrapper label="Latitude [cite: 88]" icon="fas fa-crosshairs">
        //                         <input type="number" disabled={isReadOnly} className="pro-input" value={formData.latitude || ''} onChange={e => setFormData({...formData, latitude: +e.target.value})} />
        //                     </InputWrapper>
        //                     <InputWrapper label="Longitude [cite: 89]" icon="fas fa-compass">
        //                         <input type="number" disabled={isReadOnly} className="pro-input" value={formData.longitude || ''} onChange={e => setFormData({...formData, longitude: +e.target.value})} />
        //                     </InputWrapper>
        //                 </div> */}
        //             </Card>

        //             {/* RISK & AUDIT NOTES [cite: 136, 138] */}
        //             <Card className="p-8 border-gray-200 shadow-sm rounded-[2rem] bg-white">
        //                 <div className="flex items-center gap-4 mb-6">
        //                     <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
        //                         <i className="fas fa-shield-alt text-xl"></i>
        //                     </div>
        //                     <h3 className="text-lg font-black text-gray-800">Operational Intelligence [cite: 136]</h3>
        //                 </div>
        //                 <InputWrapper label="Internal Audit & Risk Notes [cite: 138]" icon="fas fa-pen-fancy">
        //                     <textarea 
        //                         disabled={isReadOnly} 
        //                         rows={4} 
        //                         className="pro-input resize-none py-4" 
        //                         value={formData.notes} 
        //                         onChange={e => setFormData({...formData, notes: e.target.value})}
        //                         placeholder="Site access hours, apartment association rules, or specific logistics challenges..."
        //                     />
        //                 </InputWrapper>
        //             </Card>
        //         </div>

        //         {/* --- SIDEBAR: STATUS & PROFITABILITY --- */}
        //         <div className="lg:col-span-4 space-y-8">

        //             {/* SERVICE CONTROL [cite: 94-96] */}
        //             <Card className="p-8 border-gray-200 shadow-sm rounded-[2rem] bg-white border-l-8 border-l-blue-500">
        //                 <div className="space-y-8">
        //                     <InputWrapper label="Service Delivery Mode [cite: 96]" icon="fas fa-truck">
        //                         <select disabled={isReadOnly} className="pro-select" value={formData.serviceMode} onChange={e => setFormData({...formData, serviceMode: e.target.value as any})}>
        //                             <option value="Direct Core">Direct Core</option>
        //                             <option value="Direct Extended">Direct Extended</option>
        //                             <option value="Hybrid">Hybrid Controlled</option>
        //                             <option value="Partner Managed">Partner Managed</option>
        //                         </select>
        //                     </InputWrapper>

        //                     <InputWrapper label="Current Availability [cite: 95]" icon="fas fa-info-circle">
        //                         <select disabled={isReadOnly} className="pro-select" value={formData.serviceStatus} onChange={e => setFormData({...formData, serviceStatus: e.target.value as any})}>
        //                             <option value="Active">Active / Ready</option>
        //                             <option value="Restricted">Restricted Scope</option>
        //                             <option value="Blocked">Blacklisted / Blocked</option>
        //                             <option value="Approval Required">Pending Review</option>
        //                         </select>
        //                     </InputWrapper>

        //                     <InputWrapper label="Urban Density [cite: 87]" icon="fas fa-tree">
        //                         <select disabled={isReadOnly} className="pro-select" value={formData.urbanClassification} onChange={e => setFormData({...formData, urbanClassification: e.target.value as any})}>
        //                             <option value="Urban">Urban Center</option>
        //                             <option value="Semi-Urban">Semi-Urban</option>
        //                             <option value="Rural">Rural / Remote</option>
        //                         </select>
        //                     </InputWrapper>

        //                     <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 flex items-center justify-between transition-all hover:bg-blue-50">
        //                         <div>
        //                             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">System Lock [cite: 131]</p>
        //                             <p className="text-xs font-bold text-gray-700">Manual Approval Required?</p>
        //                         </div>
        //                         <label className="relative inline-flex items-center cursor-pointer">
        //                             <input 
        //                                 type="checkbox" 
        //                                 disabled={isReadOnly} 
        //                                 checked={formData.approvalRequired} 
        //                                 onChange={e => setFormData({...formData, approvalRequired: e.target.checked})}
        //                                 className="sr-only peer"
        //                             />
        //                             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        //                         </label>
        //                     </div>
        //                 </div>
        //             </Card>

        //             {/* PROFITABILITY ENGINE [cite: 121-129] */}
        //             <Card className="p-8 border-gray-200 shadow-sm rounded-[2rem] bg-white">
        //                 <div className="flex items-center gap-4 mb-8">
        //                     <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
        //                         <i className="fas fa-hand-holding-usd text-xl"></i>
        //                     </div>
        //                     <h3 className="text-lg font-black text-gray-800">Margin Engine [cite: 121]</h3>
        //                 </div>

        //                 <div className="space-y-8">
        //                     <InputWrapper label="Min Order Value (MOV) [cite: 124]" icon="fas fa-coins">
        //                         <div className="relative">
        //                             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
        //                             <input type="number" disabled={isReadOnly} className="pro-input !pl-10 font-bold text-blue-600" value={formData.minOrderValue} onChange={e => setFormData({...formData, minOrderValue: +e.target.value})} />
        //                         </div>
        //                     </InputWrapper>

        //                     <div className="grid grid-cols-2 gap-6">
        //                         <InputWrapper label="Direct % [cite: 122]">
        //                             <input type="number" disabled={isReadOnly} className="pro-input font-bold" value={formData.directMarginPercent} onChange={e => setFormData({...formData, directMarginPercent: +e.target.value})} />
        //                         </InputWrapper>
        //                         <InputWrapper label="Partner % [cite: 123]">
        //                             <input type="number" disabled={isReadOnly} className="pro-input font-bold" value={formData.partnerMarginPercent} onChange={e => setFormData({...formData, partnerMarginPercent: +e.target.value})} />
        //                         </InputWrapper>
        //                     </div>

        //                     <div className="pt-8 border-t border-gray-100">
        //                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Cost Multipliers [cite: 126-129]</p>
        //                         <div className="grid grid-cols-2 gap-6">
        //                             <InputWrapper label="Transport [cite: 126]">
        //                                 <input step="0.1" type="number" disabled={isReadOnly} className="pro-input text-center !bg-gray-50 border-dashed" value={formData.transportFactor} onChange={e => setFormData({...formData, transportFactor: +e.target.value})} />
        //                             </InputWrapper>
        //                             <InputWrapper label="Installation [cite: 127]">
        //                                 <input step="0.1" type="number" disabled={isReadOnly} className="pro-input text-center !bg-gray-50 border-dashed" value={formData.installFactor} onChange={e => setFormData({...formData, installFactor: +e.target.value})} />
        //                             </InputWrapper>
        //                             <InputWrapper label="Service [cite: 128]">
        //                                 <input step="0.1" type="number" disabled={isReadOnly} className="pro-input text-center !bg-gray-50 border-dashed" value={formData.serviceFactor} onChange={e => setFormData({...formData, serviceFactor: +e.target.value})} />
        //                             </InputWrapper>
        //                             <InputWrapper label="Complexity [cite: 129]">
        //                                 <input step="0.1" type="number" disabled={isReadOnly} className="pro-input text-center !bg-gray-50 border-dashed" value={formData.complexityFactor} onChange={e => setFormData({...formData, complexityFactor: +e.target.value})} />
        //                             </InputWrapper>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </Card>
        //         </div>
        //     </div>

        //     <style>{`
        //         .pro-input {
        //             width: 100%;
        //             padding: 0.85rem 1.25rem;
        //             background: #fff;
        //             border: 2px solid #f1f5f9;
        //             border-radius: 1.15rem;
        //             font-size: 0.875rem;
        //             font-weight: 600;
        //             color: #1e293b;
        //             transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        //         }
        //         .pro-input:focus {
        //             outline: none;
        //             border-color: #3b82f6;
        //             background: #fff;
        //             box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.08);
        //             transform: translateY(-1px);
        //         }
        //         .pro-input:disabled {
        //             background: #f8fafc;
        //             color: #64748b;
        //             border-color: #f1f5f9;
        //             cursor: not-allowed;
        //             opacity: 0.8;
        //         }
        //         .pro-select {
        //             appearance: none;
        //             width: 100%;
        //             padding: 0.85rem 1.25rem;
        //             background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 1.25rem center;
        //             border: 2px solid #f1f5f9;
        //             border-radius: 1.15rem;
        //             font-size: 0.875rem;
        //             font-weight: 700;
        //             color: #1e293b;
        //             transition: all 0.2s;
        //             cursor: pointer;
        //         }
        //         .pro-select:focus {
        //             outline: none;
        //             border-color: #3b82f6;
        //         }
        //     `}</style>
        // </div>

        <div className="bg-[#f8fafc] h-full max-h-full overflow-hidden flex flex-col">
            {/* --- COMPACT PROFESSIONAL HEADER --- */}
            <header className="flex-shrink-0 z-40 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
                <div className='flex items-center gap-4'>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className='bg-white hover:bg-gray-50 w-9 h-9 border border-gray-200 text-gray-700 cursor-pointer rounded-lg flex items-center justify-center transition-all shadow-sm'
                    >
                        <i className="fas fa-arrow-left text-xs"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-black text-gray-900 tracking-tight">
                                {isCreateMode ? 'Initialize Pincode' : isEditMode ? 'Modify Parameters' : 'Regional Audit'}
                            </h1>
                            <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${isReadOnly ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                {currentMode}
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium italic">
                            Vertical Living &bull; Serviceability Engine
                        </p>
                    </div>
                </div>

                <div className='flex gap-2 items-center'>
                    {(isReadOnly && canEdit) && (
                        <Button onClick={toggleEdit} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm">
                            <i className="fas fa-edit mr-2 text-[10px]"></i> Edit Details
                        </Button>
                    )}
                    {(isCreateMode || isEditMode) && (
                        <div className="flex gap-2">
                            <Button
                                onClick={() => onSubmit(formData)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-1.5 rounded-lg shadow-blue-200 transition-all"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2 text-[10px]"></i>}
                                {(isCreateMode && canCreate) ? 'Save Pincode' : ' Changes'}
                            </Button>
                            <Button variant="outline" onClick={isCreateMode ? () => navigate(-1) : toggleEdit} className="rounded-lg border-gray-300 font-bold px-4 py-1.5 text-xs text-gray-600">
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* --- MAIN CONTENT AREA: FULL WIDTH & EQUAL HEIGHT COLUMNS --- */}
            <div className="flex-1 overflow-y-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">

                    {/* LEFT SIDE: PRIMARY GEOGRAPHY (8 Units) */}
                    <div className="lg:col-span-8 p-4 space-y-4 border-r border-gray-100">
                        <Card className="p-5 border-gray-200 shadow-sm rounded-2xl bg-white">
                            <div className="flex items-center gap-3 border-b border-gray-50 pb-3 mb-5">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                                    <i className="fas fa-map-marked-alt text-lg"></i>
                                </div>
                                <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">Regional Identity</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <InputWrapper label="Pincode" icon="fas fa-hashtag">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} placeholder="600XXX" />
                                </InputWrapper>
                                <InputWrapper label="Area Name" icon="fas fa-map-pin">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.areaName} onChange={e => setFormData({ ...formData, areaName: e.target.value })} placeholder="Area" />
                                </InputWrapper>
                                <InputWrapper label="Locality" icon="fas fa-city">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.localityName} onChange={e => setFormData({ ...formData, localityName: e.target.value })} placeholder="Locality" />
                                </InputWrapper>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                                <InputWrapper label="Taluk" icon="fas fa-landmark">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.taluk} onChange={e => setFormData({ ...formData, taluk: e.target.value })} />
                                </InputWrapper>
                                <InputWrapper label="District" icon="fas fa-atlas">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.district as any || ''} onChange={e => setFormData({ ...formData, district: e.target.value as any })} />
                                </InputWrapper>
                                <InputWrapper label="State" icon="fas fa-flag">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                                </InputWrapper>
                            </div>

                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 mt-2 border-t border-gray-50">
                                <InputWrapper label="Latitude" icon="fas fa-crosshairs">
                                    <input type="number" disabled={isReadOnly} className="pro-input" value={formData.latitude || ''} onChange={e => setFormData({ ...formData, latitude: +e.target.value })} />
                                </InputWrapper>
                                <InputWrapper label="Longitude" icon="fas fa-compass">
                                    <input type="number" disabled={isReadOnly} className="pro-input" value={formData.longitude || ''} onChange={e => setFormData({ ...formData, longitude: +e.target.value })} />
                                </InputWrapper>
                            </div> */}
                        </Card>

                        <Card className="p-5 border-gray-200 shadow-sm rounded-2xl bg-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-inner">
                                    <i className="fas fa-shield-alt text-lg"></i>
                                </div>
                                <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">Audit & Risks</h3>
                            </div>
                            <InputWrapper label="Internal Risk Notes" icon="fas fa-pen-fancy">
                                <textarea
                                    disabled={isReadOnly}
                                    rows={3}
                                    className="pro-input resize-none py-3"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Site access hours, apartment association rules..."
                                />
                            </InputWrapper>
                        </Card>
                    </div>

                    {/* RIGHT SIDE: SIDEBAR (4 Units) */}
                    <div className="lg:col-span-4 p-4 space-y-4 bg-gray-50/30">

                        {/* SERVICE CONTROL CARD */}
                        <Card className="p-5 border-gray-200 shadow-sm rounded-2xl bg-white border-l-4 border-l-blue-500">
                            <div className="space-y-5">
                                <InputWrapper label="Delivery Mode" icon="fas fa-truck">
                                    <select disabled={isReadOnly} className="pro-select" value={formData.serviceMode} onChange={e => setFormData({ ...formData, serviceMode: e.target.value as any })}>
                                        <option value="Direct Core">Direct Core</option>
                                        <option value="Direct Extended">Direct Extended</option>
                                        <option value="Hybrid">Hybrid Controlled</option>
                                        <option value="Partner Managed">Partner Managed</option>
                                    </select>
                                </InputWrapper>

                                <InputWrapper label="Availability" icon="fas fa-info-circle">
                                    <select disabled={isReadOnly} className="pro-select" value={formData.serviceStatus} onChange={e => setFormData({ ...formData, serviceStatus: e.target.value as any })}>
                                        <option value="Active">Active</option>
                                        <option value="Restricted">Restricted</option>
                                        <option value="Blocked">Blocked</option>
                                        <option value="Approval Required">Pending Review</option>
                                    </select>
                                </InputWrapper>

                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">System Lock</p>
                                        <p className="text-[11px] font-bold text-gray-700">Approval Required?</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        disabled={isReadOnly}
                                        checked={formData.approvalRequired}
                                        onChange={e => setFormData({ ...formData, approvalRequired: e.target.checked })}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* MARGIN ENGINE CARD */}
                        <Card className="p-5 border-gray-200 shadow-sm rounded-2xl bg-white">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shadow-inner">
                                    <i className="fas fa-coins text-lg"></i>
                                </div>
                                <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">Margin Engine</h3>
                            </div>

                            <div className="space-y-5">
                                <InputWrapper label="Min Order Value (MOV)" icon="fas fa-tag">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                                        <input type="number" disabled={isReadOnly} className="pro-input !pl-8 font-bold text-blue-600 text-sm" value={formData.minOrderValue} onChange={e => setFormData({ ...formData, minOrderValue: +e.target.value })} />
                                    </div>
                                </InputWrapper>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputWrapper label="Direct %">
                                        <input type="number" disabled={isReadOnly} className="pro-input text-sm" value={formData.directMarginPercent} onChange={e => setFormData({ ...formData, directMarginPercent: +e.target.value })} />
                                    </InputWrapper>
                                    <InputWrapper label="Partner %">
                                        <input type="number" disabled={isReadOnly} className="pro-input text-sm" value={formData.partnerMarginPercent} onChange={e => setFormData({ ...formData, partnerMarginPercent: +e.target.value })} />
                                    </InputWrapper>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Cost Multipliers</p>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                        <InputWrapper label="Transport">
                                            <input step="0.1" type="number" disabled={isReadOnly} className="pro-input text-center !bg-gray-50 border-dashed text-xs" value={formData.transportFactor} onChange={e => setFormData({ ...formData, transportFactor: +e.target.value })} />
                                        </InputWrapper>
                                        <InputWrapper label="Install">
                                            <input step="0.1" type="number" disabled={isReadOnly} className="pro-input text-center !bg-gray-50 border-dashed text-xs" value={formData.installFactor} onChange={e => setFormData({ ...formData, installFactor: +e.target.value })} />
                                        </InputWrapper>
                                        <InputWrapper label="Service">
                                            <input step="0.1" type="number" disabled={isReadOnly} className="pro-input text-center !bg-gray-50 border-dashed text-xs" value={formData.serviceFactor} onChange={e => setFormData({ ...formData, serviceFactor: +e.target.value })} />
                                        </InputWrapper>
                                        <InputWrapper label="Complexity">
                                            <input step="0.1" type="number" disabled={isReadOnly} className="pro-input text-center !bg-gray-50 border-dashed text-xs" value={formData.complexityFactor} onChange={e => setFormData({ ...formData, complexityFactor: +e.target.value })} />
                                        </InputWrapper>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <style>{`
        .pro-input {
            width: 100%;
            padding: 0.65rem 1rem;
            background: #fff;
            border: 1.5px solid #f1f5f9;
            border-radius: 0.85rem;
            font-size: 0.8rem;
            font-weight: 600;
            color: #1e293b;
            transition: all 0.2s ease;
        }
        .pro-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .pro-input:disabled {
            background: #f8fafc;
            color: #94a3b8;
            cursor: not-allowed;
        }
        .pro-select {
            appearance: none;
            width: 100%;
            padding: 0.65rem 1rem;
            background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='3'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 1rem center;
            border: 1.5px solid #f1f5f9;
            border-radius: 0.85rem;
            font-size: 0.8rem;
            font-weight: 700;
            color: #1e293b;
            cursor: pointer;
        }
    `}</style>
        </div>
    );
};

export default PincodeForm;