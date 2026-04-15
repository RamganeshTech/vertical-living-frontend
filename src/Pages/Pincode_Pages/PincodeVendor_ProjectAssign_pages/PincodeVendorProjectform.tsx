
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
// import { useGetVendorForDropDown, useQuickCreateVendor } from '../../../apiList/Department Api/Accounting Api/vendorAccApi';
import SearchSelectNew from '../../../components/ui/SearchSelectNew';
import { Badge } from '../../../components/ui/Badge';
import { useGetProjects } from '../../../apiList/projectApi';
import { toast } from '../../../utils/toast';
import { useGetExecutionPartnerForDropDown, useQuickCreateExecutionPartner } from '../../../apiList/Department Api/Accounting Api/executionPartnerApi';
import QuickPartnerDrawer from './QuickVendorDrawer';

// Refined InputWrapper with stronger labeling
const InputWrapper = ({ label, icon, children }: { label: string, icon?: string, children: React.ReactNode }) => (
    <div className="space-y-2 group">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
            {icon && <i className={`${icon} text-indigo-500 text-sm`}></i>}
            {label}
        </label>
        {children}
    </div>
);

interface Props {
    mode: 'create' | 'view' | 'edit';
    initialData?: any;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    canEdit?: boolean;
    canCreate?: boolean;
}

const PincodePartnerProjectform: React.FC<Props> = ({ mode, initialData, onSubmit, isSubmitting, canEdit, canCreate }) => {


    const navigate = useNavigate();
    const { organizationId, id } = useParams() as { organizationId: string, id: string };
    const [currentMode, setCurrentMode] = useState(mode);
    const [formData, setFormData] = useState({
        projectId: '',
        partnerId: '',
        status: 'pending',
        termsAndConditions: '',
        notes: ''
    });


    const [isPartnerDrawerOpen, setIsPartnerDrawerOpen] = useState(false);
    const quickCreate = useQuickCreateExecutionPartner();

    const { data: PartnerData } = useGetExecutionPartnerForDropDown(organizationId);
    const { data: projectsData = [] } = useGetProjects(organizationId);



    // const partnerOptions = useMemo(() => (PartnerData || [])?.map((v: any) => ({ value: v._id, label: v.firstName || v.firstName })), [PartnerData]);
    const partnerOptions = useMemo(() => {
        return (PartnerData || []).map((partner: any) => ({
            value: partner._id, // This remains the ID passed to your form
            // Combine First Name and Company Name for the display
            label: `${partner.firstName || ''}`,
            // label: `${partner.firstName || ''} ${partner.companyName ? `(${partner.companyName})` : ''}`.trim(),
            email: partner.companyName ? <><span className='text-gray-700 font-medium text-xs'>Company Name:</span> <span className='text-gray-900 font-semibold text-sm'>{partner.companyName}</span></> : "",// Optional: keeps the detailed view working
        }));
    }, [PartnerData]);
    const ProjectOptions = useMemo(() => (projectsData || [])?.map((p: any) => ({ value: p._id, label: p.projectName })), [projectsData]);

    useEffect(() => {
        if (currentMode === 'create' && formData.projectId && formData.partnerId) {
            const selectedPartner = PartnerData?.find((v: any) => v._id === formData.partnerId);
            const selectedProject = projectsData?.find((p: any) => p._id === formData.projectId);

            const generatedTerms = `LEGAL TERMS OF ENGAGEMENT\n----------------------------\nProject: ${selectedProject?.projectName}\nPartner: ${selectedPartner?.companyName}\nDate: ${new Date().toLocaleDateString()}\n\n1. The partner acknowledges receipt of project drawings.\n2. Completion is expected as per the master schedule.\n3. Quality check score must maintain a minimum of 80%.\n4. Payment Terms: ${selectedPartner?.paymentTerms || 'Standard'}.`;

            setFormData((prev: any) => ({ ...prev, termsAndConditions: generatedTerms }));
        }
    }, [formData.projectId, formData.partnerId, currentMode]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                projectId: initialData.projectId?._id || initialData.projectId,
                partnerId: initialData.partnerId?._id || initialData.partnerId,
            });
        }
    }, [initialData]);

    // Public Link Generation
    const shareUrl = `${window.location.origin}/${organizationId}/pincode/acknowledgement/public/${id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast({ title: "Copied!", description: "Public link copied to clipboard" });
    };

    const handleWhatsAppShare = () => {
        const partner = PartnerData?.find((v: any) => v._id === formData.partnerId);
        const text = `Hello ${partner?.firstName || 'Partner'}, please review and acknowledge the project terms here: ${shareUrl}`;
        window.open(`https://wa.me/${partner?.phone?.whatsappNumber || ''}?text=${encodeURIComponent(text)}`, '_blank');
    };


    const isReadOnly = currentMode === 'view';
    const isCreateMode = currentMode === 'create';
    const toggleEdit = () => setCurrentMode(p => p === 'view' ? 'edit' : 'view');

    return (
        <div className="bg-slate-50 h-full max-h-full overflow-hidden flex flex-col font-poppins">
            {/* Header - Full Width */}

            <QuickPartnerDrawer
                organizationId={organizationId}
                isOpen={isPartnerDrawerOpen}
                onClose={() => setIsPartnerDrawerOpen(false)}
                onSubmit={(PartnerData) => {
                    quickCreate.mutate(PartnerData, {
                        onSuccess: () => {
                            toast({ title: "Success", description: "Partner Created Successfully" })
                            setIsPartnerDrawerOpen(false);
                        }
                    });
                }}
                isLoading={quickCreate.isPending}
            />

            <header className="flex-shrink-0 z-40 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
                <div className='flex items-center gap-5'>
                    <button type="button" onClick={() => navigate(-1)} className='bg-slate-50 hover:bg-slate-100 w-11 h-11 border border-slate-200 text-slate-600 rounded-2xl flex items-center justify-center transition-all cursor-pointer'>
                        <i className="fas fa-arrow-left text-sm"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
                            {isCreateMode ? 'Assign Project to Partner   ' : 'Review Assignment'}
                            <Badge className={`ml-2 border-none px-3 py-1 uppercase text-[10px] ${isReadOnly ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                                {currentMode}
                            </Badge>
                        </h1>
                        <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">Establish connection to project with partner</p>
                    </div>
                </div>

                <div className='flex gap-4'>
                    {(isReadOnly && canEdit) && (
                        <Button onClick={toggleEdit} className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-xl shadow-md transition-all text-sm font-semibold">
                            <i className="fas fa-edit mr-2 text-xs"></i> Edit Details
                        </Button>
                    )}
                    {((isCreateMode && canCreate) || currentMode === 'edit') && (
                        <div className="flex gap-3">
                            <Button
                                isLoading={isSubmitting}
                                onClick={() => {
                                    onSubmit(formData)
                                    toggleEdit()
                                }} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition-all text-sm font-bold">
                                <i className="fas fa-save mr-2"></i>
                                Save
                            </Button>
                            <Button variant="outline" onClick={isCreateMode ? () => navigate(-1) : toggleEdit} className="border-slate-300 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-bold">Cancel</Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content - Full Width Scrollable Area */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT SIDE: SELECTION & TERMS */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="p-8 border-none shadow-xl shadow-slate-200/40 rounded-[2.5rem] bg-white ring-1 ring-slate-100 space-y-8">
                            <div className="flex items-center gap-4 border-b border-slate-50">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                                    <i className="fas fa-link text-xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Connect Project and partner</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputWrapper label="Project Target" icon="fas fa-project-diagram">
                                    <SearchSelectNew
                                        options={ProjectOptions}
                                        value={formData.projectId}
                                        onValueChange={(val) => setFormData((p: any) => ({ ...p, projectId: val }))}
                                        placeholder="Select active project"


                                        disabled={isReadOnly}
                                        disabledTitle="click on the Edit button to see the list of projects"
                                    />
                                </InputWrapper>
                                <InputWrapper label="Assign Partner To Project" icon="fas fa-shop">
                                    <SearchSelectNew
                                        options={partnerOptions}
                                        value={formData.partnerId}
                                        onValueChange={(val) => setFormData((p: any) => ({ ...p, partnerId: val }))}
                                        placeholder="Select Partner..."

                                        showCreateButton={true}            // 👈 New Prop

                                        createButtonLabel="Add New Partner" // 👈 New Prop
                                        onCreateClick={() => setIsPartnerDrawerOpen(true)} // 👈 Open Drawer

                                        disabled={isReadOnly}
                                        disabledTitle="click on the Edit button to see the list of executioin partners"
                                    />
                                </InputWrapper>
                            </div>

                            <InputWrapper label="Digital Terms & Conditions" icon="fas fa-file-contract">
                                <textarea
                                    disabled={isReadOnly}
                                    className="w-full p-6 border-2 border-slate-100 rounded-3xl bg-slate-50/50  text-xs leading-relaxed min-h-[280px] focus:border-indigo-400 focus:bg-white transition-all outline-none text-slate-700 shadow-inner"
                                    value={formData.termsAndConditions}
                                    onChange={e => setFormData({ ...formData, termsAndConditions: e.target.value })}
                                />
                            </InputWrapper>
                        </Card>

                        {/* SHARE SECTION - ONLY VISIBLE IN VIEW MODE */}
                        {isReadOnly && (
                            <Card className="p-8 border-none shadow-xl shadow-slate-200/40 rounded-[2.5rem] bg-white ring-1 ring-slate-100">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Share Acknowledgement Link</h3>
                                        <p className="text-xs text-slate-400 font-medium italic">Send this link to the partner for getting acknowledgement</p>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <button
                                            onClick={handleWhatsAppShare}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-green-100"
                                        >
                                            <i className="fab fa-whatsapp text-lg"></i> WhatsApp
                                        </button>
                                        <button
                                            onClick={handleCopyLink}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-black text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-slate-200"
                                        >
                                            <i className="fas fa-link text-sm"></i> Copy URL
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* RIGHT SIDE: STATUS & AUDIT TRAIL */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Assignment Status Card - Vivid & Visible */}
                        <Card className="p-8 border-none shadow-xl shadow-indigo-100 rounded-[2rem] bg-indigo-600 text-white space-y-5">
                            <div className="flex items-center gap-3 border-b border-white/10">
                                <i className="fas fa-shield-alt text-indigo-800"></i>
                                <h3 className="text-sm font-bold text-gray-800 tracking-[0.1em]">Acknowledge Manually</h3>
                            </div>
                            <div className="relative">
                                <select
                                    disabled={isReadOnly}
                                    // className="w-full bg-white text-indigo-900 border-none rounded-2xl px-5 py-3.5 text-sm font-bold shadow-lg focus:ring-4 focus:ring-indigo-300 transition-all outline-none appearance-none cursor-pointer disabled:bg-indigo-100 disabled:text-indigo-400"
                                    className={`w-full bg-white text-indigo-900 border-[1px] rounded-2xl px-5 py-3.5 text-sm font-bold shadow-lg outline-none appearance-none transition-all 
        ${(isReadOnly)
                                            ? "bg-indigo-100 text-indigo-400 cursor-not-allowed"
                                            : "cursor-pointer focus:ring-4 focus:ring-indigo-300"
                                        }`}
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    title={isReadOnly ? "click on the edit button to see the options" : ""}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>

                                </select>
                                {!isReadOnly && <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none"></i>}
                            </div>
                        </Card>

                        <Card className="p-8 border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white space-y-6">
                            <InputWrapper label="Internal Audit Notes" icon="fas fa-comment-alt-lines">
                                <textarea
                                    disabled={isReadOnly}
                                    placeholder="Enter internal communication or partner feedback..."
                                    className="w-full p-5 border-2 border-slate-100 rounded-3xl bg-slate-50 text-sm h-40 resize-none outline-none focus:border-indigo-400 focus:bg-white transition-all text-slate-600"
                                    value={formData.notes}
                                    title={isReadOnly ? "click on the edit button to enable editing notes" : ""}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </InputWrapper>

                            {!isCreateMode && initialData?.acknowledgedAt && (
                                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 ring-4 ring-emerald-50/50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-certificate text-emerald-500"></i>
                                        <p className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">Signed Acknowledgment</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[11px] font-bold text-emerald-900">
                                            <span className="opacity-60">Execution Partner's IP</span>
                                            <span>{initialData.ipAddress || '0.0.0.0'}</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-bold text-emerald-900">
                                            <span className="opacity-60">Verified On</span>
                                            <span>{new Date(initialData.acknowledgedAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PincodePartnerProjectform;