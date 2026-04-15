



import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PincodeFormData } from './PinCodeMain';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import SearchSelectNew from '../../../components/ui/SearchSelectNew';
import { toast } from '../../../utils/toast';
import { useGetExecutionPartnerForDropDown } from '../../../apiList/Department Api/Accounting Api/executionPartnerApi';

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
            <span className='text-gray-900'>{label}</span>
        </label>
        {children}
    </div>
);

const PincodeForm: React.FC<Props> = ({ mode, initialData, onSubmit, isSubmitting, canEdit, canCreate }) => {
    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string }

    const [currentMode, setCurrentMode] = useState(mode);
    const [formData, setFormData] = useState<PincodeFormData & { partnerId: string }>({
        pincode: '', areaName: '', localityName: '', taluk: '', district: null, zone: null,
        state: 'Tamil Nadu', latitude: null, longitude: null, urbanClassification: 'Urban',
        activeStatus: true, serviceStatus: 'Active', serviceMode: 'Direct Core',
        approvalRequired: false, minOrderValue: 0, directMarginPercent: 0, partnerMarginPercent: 0,
        transportFactor: 1.0, installFactor: 1.0, serviceFactor: 1.0, complexityFactor: 1.0,
        riskLevel: 'Low', notes: '', partners: [], partnerId: ""
    });

    useEffect(() => {
        if (initialData) setFormData(prev => ({ ...prev, ...initialData }));
    }, [initialData]);

    const { data: executionPartnerData } = useGetExecutionPartnerForDropDown(organizationId);




    // 3. Prepare Options
    const executionPartnerOptions = useMemo(() =>
        (executionPartnerData || [])?.map((v: any) => ({ value: v._id, label: v.partnerName })),
        [executionPartnerData]);


    // 4. Handle Selection Changes
    // const handlePartnerChange = (value: string | null) => {
    //     setFormData((p: any) => ({ ...p, partners: [...p.partners, { partnerId: value }] }));
    // };


    const handleAddPartner = (partnerId: string | null) => {
        if (!partnerId) return;

        // Prevent duplicate partners
        const exists = formData.partners?.find((v: any) =>
            (typeof v.partnerId === 'string' ? v.partnerId : v.partnerId?._id) === partnerId
        );

        if (exists) {
            return toast({ title: "Already Added", description: "This Partner is already mapped to this pincode." });
        }

        setFormData((prev: any) => ({
            ...prev,
            partners: [...(prev.partners || []), { partnerId }]
        }));
    };

    const handleRemovePartner = (partnerId: string) => {
        setFormData((prev: any) => ({
            ...prev,
            partners: prev.partners.filter((v: any) =>
                (typeof v.partnerId === 'string' ? v.partnerId : v.partnerId?._id) !== partnerId
            )
        }));
    };



    const isReadOnly = currentMode === 'view';
    const isEditMode = currentMode === 'edit';
    const isCreateMode = currentMode === 'create';

    const toggleEdit = () => setCurrentMode(prev => prev === 'view' ? 'edit' : 'view');



    return (

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
                                    <input disabled={isReadOnly} className="pro-input" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} placeholder={!isReadOnly ? "600xxx" : ""} />
                                </InputWrapper>
                                <InputWrapper label="Area Name" icon="fas fa-map-pin">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.areaName} onChange={e => setFormData({ ...formData, areaName: e.target.value })} placeholder={!isReadOnly ? "Area Name" : ""} />
                                </InputWrapper>
                                <InputWrapper label="Locality" icon="fas fa-city">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.localityName} onChange={e => setFormData({ ...formData, localityName: e.target.value })} placeholder={!isReadOnly ? "Locality" : ""} />
                                </InputWrapper>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                                <InputWrapper label="Taluk" icon="fas fa-landmark">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.taluk} onChange={e => setFormData({ ...formData, taluk: e.target.value })} placeholder={!isReadOnly ? "taluk" : ""} />
                                </InputWrapper>
                                <InputWrapper label="District" icon="fas fa-atlas">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.district as any || ''} onChange={e => setFormData({ ...formData, district: e.target.value as any })} placeholder={!isReadOnly ? "district" : ""} />
                                </InputWrapper>
                                <InputWrapper label="State" icon="fas fa-flag">
                                    <input disabled={isReadOnly} className="pro-input" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} placeholder={!isReadOnly ? "state" : ""}/>
                                </InputWrapper>
                            </div>


                            {/* {isEditMode && <div>
                                <InputWrapper label="Select Partner" icon="fas fa-user-tie">
                                    <SearchSelectNew
                                        options={executionPartnerOptions}
                                        value={formData.partnerId || ""}
                                        onValueChange={handlePartnerChange}
                                        placeholder="Search & Select Partner"
                                        className="w-full"
                                    />
                                </InputWrapper>

                            </div>} */}

                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 mt-2 border-t border-gray-50">
                                <InputWrapper label="Latitude" icon="fas fa-crosshairs">
                                    <input type="number" disabled={isReadOnly} className="pro-input" value={formData.latitude || ''} onChange={e => setFormData({ ...formData, latitude: +e.target.value })} />
                                </InputWrapper>
                                <InputWrapper label="Longitude" icon="fas fa-compass">
                                    <input type="number" disabled={isReadOnly} className="pro-input" value={formData.longitude || ''} onChange={e => setFormData({ ...formData, longitude: +e.target.value })} />
                                </InputWrapper>
                            </div> */}
                        </Card>





                        <Card className="p-5 border-gray-200 shadow-sm rounded-2xl bg-white space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-50 pb-3 mb-5">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                                    <i className="fas fa-shop text-lg"></i>
                                </div>
                                <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">Execution Partners Connectivity</h3>
                            </div>

                            {/* Search & Add partner - Styled like the top inputs */}
                            {(isEditMode || isCreateMode) && (
                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-4">
                                    <InputWrapper label="Assign Partner to this pincode" icon="fas fa-search">
                                        <SearchSelectNew
                                            options={executionPartnerOptions}
                                            onValueChange={handleAddPartner}
                                            placeholder="Search by Partner or company name..."
                                            className="w-full"
                                        />
                                    </InputWrapper>
                                    {/* <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 px-1 tracking-wider italic">
                                        <i className="fas fa-info-circle mr-1"></i> Selecting a partner will automatically add them to this territory
                                    </p> */}
                                </div>
                            )}

                            {/* List of Mapped partners */}
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                {formData.partners?.length > 0 ? (
                                    formData.partners.map((v: any, idx: number) => {
                                        // Handle both populated object and raw ID safely
                                        const vData = typeof v.partnerId === 'object' ? v.partnerId : executionPartnerData?.find((raw: any) => raw._id === v.partnerId);

                                        // 2. Normalize the phone data because the dropdown structure is different from the DB structure
                                        const displayMobile = vData?.mobile || vData?.phone?.mobile;
                                        const displayWork = vData?.work || vData?.phone?.work || vData?.phoneNo;

                                        return (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-bold text-slate-800 truncate">
                                                                <span className='text-gray-600 text-xs'>Partner Name:</span> {vData?.firstName || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-0.5">
                                                            <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                                                <i className="fas fa-building text-[8px] text-slate-800"></i>
                                                                {vData?.companyName || 'No Name'}
                                                            </p>
                                                            {displayMobile && <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                                                                <i className="fas fa-phone-alt text-[8px] text-blue-300"></i>
                                                                {displayMobile},
                                                            </p>}

                                                            <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                                                                {displayWork}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {!isReadOnly && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePartner(vData?._id)}
                                                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white flex items-center justify-center cursor-pointer shadow-sm"
                                                        title="Remove Partner"
                                                    >
                                                        <i className="fas fa-trash-alt text-[10px]"></i>
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-3">
                                            <i className="fas fa-user-slash text-slate-200 text-xl"></i>
                                        </div>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest px-4">
                                            No service partners mapped to this area
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-5 border-gray-200 shadow-sm rounded-2xl bg-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-inner">
                                    <i className="fas fa-clipboard text-lg"></i>
                                </div>
                                <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">Notes</h3>
                            </div>
                            <InputWrapper label="" icon="">
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
                                {/* <InputWrapper label="Delivery Mode" icon="fas fa-truck">
                                    <select disabled={isReadOnly} className="pro-select" value={formData.serviceMode} onChange={e => setFormData({ ...formData, serviceMode: e.target.value as any })}>
                                        <option value="Direct Core">Direct Core</option>
                                        <option value="Direct Extended">Direct Extended</option>
                                        <option value="Hybrid">Hybrid Controlled</option>
                                        <option value="Partner Managed">Partner Managed</option>
                                    </select>
                                </InputWrapper> */}

                                <InputWrapper label="Availability" icon="fas fa-info-circle">
                                    <select disabled={isReadOnly} className="pro-select" value={formData.serviceStatus} onChange={e => setFormData({ ...formData, serviceStatus: e.target.value as any })}>
                                        <option value="Active">Active</option>
                                        <option value="Restricted">Restricted</option>
                                        <option value="Blocked">Blocked</option>
                                        <option value="Approval Required">Pending Review</option>
                                    </select>
                                </InputWrapper>

                                {/* <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex items-center justify-between">
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
                                </div> */}
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
                                        <input type="number" disabled={isReadOnly} className="pro-input   !pl-8 font-bold text-blue-600 text-sm" value={formData.minOrderValue} onChange={e => setFormData({ ...formData, minOrderValue: +e.target.value })} />
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
            color: #101828;
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