import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { IVendorPincodeMapping } from './PincodeVendorMappingMain';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useGetVendorForDropDown } from '../../../apiList/Department Api/Accounting Api/vendorAccApi';
import SearchSelectNew from '../../../components/ui/SearchSelectNew';
import { useGetAllPincodes } from '../../../apiList/pincode_api/pincodeApi';

// ✅ Moved outside to prevent focus loss
const InputWrapper = ({ label, icon, children }: { label: string, icon?: string, children: React.ReactNode }) => (
    <div className="space-y-1 group">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
            {icon && <i className={`${icon} text-blue-500`}></i>}
            {label}
        </label>
        {children}
    </div>
);

interface Props {
    mode: 'create' | 'view' | 'edit';
    initialData?: Partial<IVendorPincodeMapping>;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    canEdit?: boolean;
    canCreate?: boolean;
}

const PincodeVendorMappingForm: React.FC<Props> = ({ mode, initialData, onSubmit, isSubmitting, canEdit, canCreate }) => {
    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string }
    const [currentMode, setCurrentMode] = useState(mode);
    const [formData, setFormData] = useState<any>({
        vendorId: '',
        pincodeId: '',
        vendorRole: 'Primary',
        serviceMode: 'Direct',
        priorityRank: 1,
        minOrderValue: 0,
        maxProjectValue: 0,
        rateMultiplier: 1.0,
        travelRule: '',
        serviceVisitRule: '',
        siteVisitSlaDays: 2,
        installSlaDays: 5,
        complaintSlaHours: 24,
        premiumJobAllowed: true,
        repairJobAllowed: true,
        activeStatus: true,
        notes: ''
    });

    // 2. Fetch Dropdown Data
    const { data: VendorData } = useGetVendorForDropDown(organizationId);

    // 2. Updated Hook Call with debounced search
    const {
        data: PincodeListData,
    } = useGetAllPincodes({
        organizationId: organizationId || '',

        limit: 100,
    });


    // 3. Prepare Options
    const VendorOptions = useMemo(() =>
        (VendorData || [])?.map((v: any) => ({ value: v._id, label: v.vendorName })),
        [VendorData]);

        console.log("playlist, pincode", PincodeListData)
    const PincodeOptions = useMemo(() =>
        (PincodeListData?.pages?.flatMap(p => p.data) || [])?.map((p: any) => ({
            value: p._id,
            label: `${p.pincode} - ${p.areaName} (${p.district})`
        })),
        [PincodeListData]);

    // 4. Handle Selection Changes
    const handleVendorChange = (value: string | null) => {
        setFormData((p:any) => ({ ...p, vendorId: value || "" }));
    };

    const handlePincodeChange = (value: string | null) => {
        setFormData((p:any) => ({ ...p, pincodeId: value || "" }));
    };

    useEffect(() => {
        if (initialData) {
            // Map the nested objects to IDs for form handling if in view/edit mode
            setFormData({
                ...initialData,
                vendorId: typeof initialData.vendorId === 'object' ? initialData.vendorId._id : initialData.vendorId,
                pincodeId: typeof initialData.pincodeId === 'object' ? initialData.pincodeId._id : initialData.pincodeId,
            });
        }
    }, [initialData]);

    const isReadOnly = currentMode === 'view';
    const isEditMode = currentMode === 'edit';
    const isCreateMode = currentMode === 'create';

    const toggleEdit = () => setCurrentMode(prev => prev === 'view' ? 'edit' : 'view');

    return (
        <div className="bg-[#f8fafc] h-full max-h-full overflow-hidden flex flex-col">
            <header className="flex-shrink-0 z-40 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
                <div className='flex items-center gap-4'>
                    <button type="button" onClick={() => navigate(-1)} className='bg-white hover:bg-gray-50 w-9 h-9 border border-gray-200 text-gray-700 cursor-pointer rounded-lg flex items-center justify-center transition-all shadow-sm'>
                        <i className="fas fa-arrow-left text-xs"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-black text-gray-900 tracking-tight">
                                {isCreateMode ? 'Map Vendor to Area' : isEditMode ? 'Modify Coverage' : 'Coverage Audit'}
                            </h1>
                            <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${isReadOnly ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                {currentMode}
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium italic">Assign operational rules for specific vendor territories</p>
                    </div>
                </div>

                <div className='flex gap-2 items-center'>
                    {(isReadOnly && canEdit) && (
                        <Button onClick={toggleEdit} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm">
                            <i className="fas fa-edit mr-2 text-[10px]"></i> Edit Mapping
                        </Button>
                    )}
                    {(isCreateMode || isEditMode) && canCreate && (
                        <div className="flex gap-2">
                            <Button onClick={() => onSubmit(formData)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-1.5 rounded-lg transition-all" disabled={isSubmitting}>
                                {isSubmitting ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2 text-[10px]"></i>}
                                {isCreateMode ? 'Establish Mapping' : 'Push Changes'}
                            </Button>
                            <Button variant="outline" onClick={isCreateMode ? () => navigate(-1) : toggleEdit} className="rounded-lg border-gray-300 font-bold px-4 py-1.5 text-xs text-gray-600">Cancel</Button>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">

                    {/* LEFT SIDE: CORE ASSIGNMENT */}
                    <div className="lg:col-span-8 p-4 space-y-4 border-r border-gray-100">
                        <Card className="p-5 border-gray-200 shadow-sm rounded-2xl bg-white">
                            <div className="flex items-center gap-3 border-b border-gray-50 pb-3 mb-5">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                                    <i className="fas fa-link text-lg"></i>
                                </div>
                                <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">Assignment Logic</h3>
                            </div>

                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputWrapper label="Vendor ID" icon="fas fa-user-tie">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.vendorId} onChange={e => setFormData({ ...formData, vendorId: e.target.value })} placeholder="Mongoose ID" />
                                </InputWrapper>
                                <InputWrapper label="Pincode ID" icon="fas fa-map-marker-alt">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.pincodeId} onChange={e => setFormData({ ...formData, pincodeId: e.target.value })} placeholder="Mongoose ID" />
                                </InputWrapper>
                            </div> */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputWrapper label="Select Vendor" icon="fas fa-user-tie">
                                    <SearchSelectNew
                                        options={VendorOptions}
                                        value={formData.vendorId || ""}
                                        onValueChange={handleVendorChange}
                                        placeholder="Search & Select Vendor"
                                        className="w-full"
                                    />
                                </InputWrapper>

                                <InputWrapper label="Select Service Area (Pincode)" icon="fas fa-map-marker-alt">
                                    <SearchSelectNew
                                        options={PincodeOptions}
                                        value={formData.pincodeId || ""}
                                        onValueChange={handlePincodeChange}
                                        placeholder="Search Pincode or Area Name"
                                        className="w-full"
                                    />
                                </InputWrapper>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                                <InputWrapper label="Vendor Role" icon="fas fa-award">
                                    <select disabled={isReadOnly} className="pro-select" value={formData.vendorRole} onChange={e => setFormData({ ...formData, vendorRole: e.target.value })}>
                                        <option value="Primary">Primary</option>
                                        <option value="Secondary">Secondary</option>
                                        <option value="Backup">Backup</option>
                                    </select>
                                </InputWrapper>
                                <InputWrapper label="Service Mode" icon="fas fa-handshake">
                                    <select disabled={isReadOnly} className="pro-select" value={formData.serviceMode} onChange={e => setFormData({ ...formData, serviceMode: e.target.value })}>
                                        <option value="Direct">Direct</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Partner">Partner</option>
                                    </select>
                                </InputWrapper>
                                <InputWrapper label="Priority Rank" icon="fas fa-sort-numeric-down">
                                    <input type="number" disabled={isReadOnly} className="pro-input" value={formData.priorityRank} onChange={e => setFormData({ ...formData, priorityRank: +e.target.value })} />
                                </InputWrapper>
                            </div>
                        </Card>

                        <Card className="p-5 border-gray-200 shadow-sm rounded-2xl bg-white">
                            <div className="flex items-center gap-3 border-b border-gray-50 pb-3 mb-5">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shadow-inner">
                                    <i className="fas fa-route text-lg"></i>
                                </div>
                                <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">Travel & Visit Rules</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputWrapper label="Travel Rule" icon="fas fa-car">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.travelRule} onChange={e => setFormData({ ...formData, travelRule: e.target.value })} placeholder="e.g., Charged above 20km" />
                                </InputWrapper>
                                <InputWrapper label="Service Visit Rule" icon="fas fa-tools">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.serviceVisitRule} onChange={e => setFormData({ ...formData, serviceVisitRule: e.target.value })} placeholder="e.g., 2 free visits" />
                                </InputWrapper>
                            </div>
                        </Card>

                        <Card className="p-5 border-gray-200 shadow-sm rounded-2xl bg-white">
                            <InputWrapper label="Internal Mapping Notes" icon="fas fa-sticky-note">
                                <textarea disabled={isReadOnly} rows={3} className="pro-input resize-none" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Operational context..." />
                            </InputWrapper>
                        </Card>
                    </div>

                    {/* RIGHT SIDE: COMMERCIALS & SLA */}
                    <div className="lg:col-span-4 p-4 space-y-4 bg-gray-50/30">
                        <Card className="p-5 border-gray-200 shadow-sm rounded-2xl bg-white border-l-4 border-l-green-500">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shadow-inner">
                                    <i className="fas fa-hand-holding-usd text-lg"></i>
                                </div>
                                <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">Commercials</h3>
                            </div>
                            <div className="space-y-4">
                                <InputWrapper label="Rate Multiplier (x)" icon="fas fa-percentage">
                                    <input type="number" step="0.1" disabled={isReadOnly} className="pro-input font-bold text-orange-600" value={formData.rateMultiplier} onChange={e => setFormData({ ...formData, rateMultiplier: +e.target.value })} />
                                </InputWrapper>
                                <InputWrapper label="Min Order Value (MOV)">
                                    <input type="number" disabled={isReadOnly} className="pro-input text-blue-600 font-bold" value={formData.minOrderValue} onChange={e => setFormData({ ...formData, minOrderValue: +e.target.value })} />
                                </InputWrapper>
                                <InputWrapper label="Max Project Value">
                                    <input type="number" disabled={isReadOnly} className="pro-input text-gray-600" value={formData.maxProjectValue} onChange={e => setFormData({ ...formData, maxProjectValue: +e.target.value })} />
                                </InputWrapper>
                            </div>
                        </Card>

                        <Card className="p-5 border-gray-200 shadow-sm rounded-2xl bg-white border-l-4 border-l-blue-500">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                                    <i className="fas fa-clock text-lg"></i>
                                </div>
                                <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">SLA Performance</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <InputWrapper label="Site Visit (Days)">
                                    <input type="number" disabled={isReadOnly} className="pro-input text-center" value={formData.siteVisitSlaDays} onChange={e => setFormData({ ...formData, siteVisitSlaDays: +e.target.value })} />
                                </InputWrapper>
                                <InputWrapper label="Installation (Days)">
                                    <input type="number" disabled={isReadOnly} className="pro-input text-center" value={formData.installSlaDays} onChange={e => setFormData({ ...formData, installSlaDays: +e.target.value })} />
                                </InputWrapper>
                                <InputWrapper label="Complaint (Hours)">
                                    <input type="number" disabled={isReadOnly} className="pro-input text-center" value={formData.complaintSlaHours} onChange={e => setFormData({ ...formData, complaintSlaHours: +e.target.value })} />
                                </InputWrapper>
                            </div>
                        </Card>

                        <Card className="p-4 border-gray-200 shadow-sm rounded-2xl bg-white space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-gray-500">Premium Jobs?</span>
                                <input type="checkbox" disabled={isReadOnly} checked={formData.premiumJobAllowed} onChange={e => setFormData({ ...formData, premiumJobAllowed: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-gray-500">Repair Jobs?</span>
                                <input type="checkbox" disabled={isReadOnly} checked={formData.repairJobAllowed} onChange={e => setFormData({ ...formData, repairJobAllowed: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <style>{`
                .pro-input { width: 100%; padding: 0.65rem 1rem; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 0.85rem; font-size: 0.8rem; font-weight: 600; color: #1e293b; transition: all 0.2s; }
                .pro-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .pro-input:disabled { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }
                .pro-select { appearance: none; width: 100%; padding: 0.65rem 1rem; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='3'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 1rem center; border: 1.5px solid #f1f5f9; border-radius: 0.85rem; font-size: 0.8rem; font-weight: 700; color: #1e293b; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default PincodeVendorMappingForm;