import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { WORK_TEMPLATE, type WorkModule } from '../../../WorkData_Page/WorkDataTemplateMain';
import { useNavigate, useParams } from 'react-router-dom';
import DynamicWorkForm from '../../../WorkData_Page/DynamicWorkForm';
import { toast } from '../../../../../utils/toast';
import { useAddWorkItem, useDeleteTemplate, useDeleteWorkItem, useUpdateSubletFields, useUpdateTemplateFields, useUpsertTemplateData } from '../../../../../apiList/Quote Api/Internal_Quote_Api/internalQuoteNewVersionApi';
import { useDebounce } from '../../../../../Hooks/useDebounce';
import InlineWorkNameEditor from './InlineWorkNameEditor';
import SublettingTemplate from '../../../WorkData_Page/Subletting_Template/SublettingTemplate';

const InternalQuoteForm: React.FC<any> = ({ initialData }) => {
    const { id: quoteId } = useParams() as { id: string };
    const navigate = useNavigate();

    const [activeWorkId, setActiveWorkId] = useState<string | null>(null);
    const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

    // UI States for Popups
    const [isWorkModalOpen, setWorkModalOpen] = useState(false);
    const [newWorkName, setNewWorkName] = useState("");

    const [popoverState, setPopoverState] = useState<{
        workId: string,
        x: number,
        y: number,
        menuLevel: 'choice' | 'templates'
    } | null>(null);

    const addWorkMutation = useAddWorkItem();
    const upsertTemplateMutation = useUpsertTemplateData();
    const { mutateAsync: deleteTemplateMutate, isPending: deletetemplatePending } = useDeleteTemplate();
    const { mutateAsync: deleteWorkMutate, isPending: deleteWorkPending } = useDeleteWorkItem();

    // Data Resolution
    const activeWork = useMemo(() =>
        initialData?.mainQuote?.works?.find((w: any) => w._id === activeWorkId),
        [activeWorkId, initialData]);

    const activeTemplate = useMemo(() => {
        if (!activeWork) return null;

        // First, look in workTemplates
        const template = activeWork.workTemplates?.find((t: any) => t._id === activeTemplateId);
        if (template) return template;

        // If not found, look in subLettingData
        const sublet = activeWork.subLettingData?.find((s: any) => s._id === activeTemplateId);
        if (sublet) {
            // We return a mapped object so the header doesn't crash 
            // when looking for .templateName and .singleTotal
            return {
                ...sublet,
                templateName: "Subletting Quote",
                singleTotal: sublet.vendorDetails?.finalQuoteRate || 0,
                isSublet: true // Helper flag
            };
        }

        return null;
    }, [activeTemplateId, activeWork])

    useEffect(() => {

        if (initialData && initialData?.mainQuote && initialData.mainQuote.works.length && !activeWorkId) {
            const firstWork = initialData?.mainQuote?.works[0]

            if (firstWork) {
                setActiveWorkId(firstWork?._id)


                const template = firstWork?.workTemplates[0];
                const sublet = firstWork?.subLettingData[0];

                if (template) {
                    setActiveTemplateId(template?._id)
                }
                else if (sublet) {
                    setActiveTemplateId(sublet?._id)
                }
                else {
                    setActiveTemplateId(null)
                }

            }
        }

    }, [initialData])


    const openTemplatePicker = (e: React.MouseEvent, workId: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPopoverState({
            workId,
            x: rect.right + 10,
            y: rect.top,
            menuLevel: 'choice' // Start with the two main options
        });
    };



    const updateFieldsMutation = useUpdateTemplateFields();
    const updateSubletMutation = useUpdateSubletFields();    // Holds the "In-Progress" data for the active template

    const [saveBuffer, setSaveBuffer] = useState<{
        workId: string;
        tempId: string;
        data: any;
        total: number;
    } | null>(null);

    // Apply your manual debounce hook (wait 500ms after last keystroke)
    const debouncedSaveRequest = useDebounce(saveBuffer, 500);

    useEffect(() => {
        // Only trigger API if we have a valid request from the debounce hook
        if (debouncedSaveRequest && quoteId) {
            updateFieldsMutation.mutate({
                quoteId,
                workId: debouncedSaveRequest.workId,
                templateId: debouncedSaveRequest.tempId,
                payload: {
                    templateData: debouncedSaveRequest.data,
                    singleTotal: debouncedSaveRequest.total
                }
            });
        }
    }, [debouncedSaveRequest, quoteId]);


    const handleManualSaveSublet = async (updatedData: any) => {
        // Ensure we have the necessary IDs before attempting update
        if (!activeWorkId || !activeTemplateId || !quoteId) {
            return toast({ title: "Error", description: "Missing Area or Spec ID", variant: "destructive" });
        }

        try {
            await updateSubletMutation.mutateAsync({
                quoteId,
                workId: activeWorkId,
                subletId: activeTemplateId, // This is the ID of the specific entry in subLettingData
                subLettingData: updatedData
            });
            toast({ title: "Success", description: "Sublet quote saved successfully" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };


    const handleCreateWorkArea = async () => {
        if (!newWorkName.trim()) {
            return toast({ title: "Success", description: "Work Name required" });
        }
        try {
            await addWorkMutation.mutateAsync({ quoteId, payload: { workName: newWorkName } });
            setWorkModalOpen(false);
            setNewWorkName("");
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };


    const handleCreateSublet = async () => {
        if (!popoverState) return;
        try {
            await upsertTemplateMutation.mutateAsync({
                quoteId,
                workId: popoverState.workId,
                payload: {
                    workType: 'sublet',
                    templateName: 'Subletting Quote'
                }
            });
            setPopoverState(null);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleSelectMaterialTemplate = async (template: WorkModule) => {
        if (!popoverState) return;
        try {
            await upsertTemplateMutation.mutateAsync({
                quoteId,
                workId: popoverState.workId,
                payload: {
                    workType: 'template',
                    templateName: template.work
                }
            });
            setPopoverState(null);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };


    const handleDeleteTemplate = async ({ workId, templateId, type }: { workId: string, templateId: string, type: string }) => {
        try {
            await deleteTemplateMutate({
                quoteId,
                type,
                workId: workId,
                templateId
            });
            // toast({ title: "Spec Added" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleDeleteWork = async ({ workId }: { workId: string }) => {
        try {
            await deleteWorkMutate({
                quoteId,
                workId: workId,
            });
            // toast({ title: "Spec Added" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };






    return (
        <div className="flex flex-col h-screen bg-[#F1F5F9] overflow-hidden font-sans">
            {/* --- TOP HEADER --- */}
            <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between  shrink-0 z-30 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white hover:bg-gray-100 shadow-sm flex items-center justify-center w-10 h-10 border border-gray-200 text-gray-600 rounded-lg transition-all"
                    >
                        <i className="fas fa-arrow-left" />
                    </button>
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
                        <i className="fas fa-file-contract text-xs"></i>
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none">
                            {initialData?.mainQuote?.mainQuoteName || "New Quote"}
                        </h1>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {initialData?.mainQuote?.quoteCategory} Work
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="text-right border-r pr-5 border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
                        <p className="text-lg font-black text-slate-900 leading-none">₹{initialData?.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <Button onClick={() => setWorkModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[10px] uppercase h-9 px-4">
                        + New Area
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* --- SIDEBAR --- */}
                <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
                        {initialData?.mainQuote?.works?.map((work: any, index: number) => (
                            <div key={work._id} className="space-y-1">
                                <div
                                    //  className="flex items-center justify-between px-2 py-1"

                                    className={`flex items-center justify-between px-2 py-2 rounded-lg transition-all ${activeWorkId === work._id

                                        ? 'bg-slate-900 border-slate-900 text-white shadow-md '
                                        : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 '



                                        }`}>

                                    {/* <InlineWorkNameEditor index={index} work={work} quoteId={quoteId} /> */}


                                    <div className="flex items-center gap-3">
                                        {/* WORK NUMBER IDENTIFIER */}
                                        <div className={`
            flex items-center justify-center 
            w-6 h-6 rounded-lg text-[10px] font-black 
            transition-colors duration-300
            ${activeWorkId === work._id
                                                ? 'bg-white/20 text-white'
                                                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 '}
        `}>
                                            {String(index + 1).padStart(2, '0')}
                                        </div>

                                        {/* INLINE EDITOR */}
                                        <InlineWorkNameEditor
                                            work={work}
                                            quoteId={quoteId}
                                        />
                                    </div>
                                    <div className='flex gap-2'>
                                        <button
                                            onClick={(e) => openTemplatePicker(e, work._id)}
                                            className="w-5 h-5 rounded hover:bg-blue-50 text-blue-600 flex items-center justify-center transition-all border border-blue-100 bg-white"
                                        >
                                            <i className="fas fa-plus text-[9px]"></i>
                                        </button>

                                        <button
                                            onClick={() => handleDeleteWork({ workId: work._id })}
                                            className="w-5 h-5 rounded cursor-pointer hover:bg-red-400 text-white flex items-center justify-center transition-all  bg-red-600"
                                        >
                                            <i className={`fas  ${!deleteWorkPending ? "fa-trash-alt" : "fa-spinner animate-spin"} text-[10px]`}></i>

                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-0.5">



                                    {/* --- RENDER SUBLETTING ENTRIES --- */}
                                    {work.subLettingData?.map((sub: any) => (
                                        <div key={sub._id} className="group relative">
                                            <div
                                                onClick={() => { setActiveWorkId(work._id); setActiveTemplateId(sub._id); }}
                                                className={`w-full flex cursor-pointer items-center justify-between p-3 rounded-xl transition-all border ${activeTemplateId === sub._id
                                                    // ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                                    // : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
                                                    ? 'bg-blue-50/50 border-blue-200 shadow-sm' // Highlighted State
                                                    : 'bg-transparent border-transparent'      // Default State


                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 truncate pr-2">
                                                    <i className={`fas fa-handshake text-[8px] ${activeTemplateId === sub._id ? 'text-emerald-400' : 'text-slate-300'}`} />
                                                    <span className="text-[11px] font-bold capitalize truncate">Sublet Quote</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[9px] font-mono font-bold group-hover:opacity-0 ${activeTemplateId === sub._id ? 'text-slate-400' : 'text-slate-800'
                                                        }`}>
                                                        ₹{sub.vendorDetails?.finalQuoteRate?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || 0}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteTemplate({ workId: work._id, templateId: sub._id, type: 'sublet' });
                                                        }}
                                                        className="absolute right-3 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1"
                                                    >
                                                        <i className={`fas  ${!deletetemplatePending ? "fa-trash-alt" : "fa-spinner animate-spin"} text-[10px]`}></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}



                                    {work.workTemplates?.map((temp: any) => (
                                        <div key={temp._id} className="group relative">
                                            <button
                                                onClick={() => { setActiveWorkId(work._id); setActiveTemplateId(temp._id); }}
                                                className={`w-full flex cursor-pointer items-center justify-between p-3 rounded-xl transition-all border ${activeTemplateId === temp._id
                                                    // ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                                    // : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-100'

                                                    ? 'bg-blue-50/60 border-blue-500 shadow-sm ring-1 ring-blue-100' // Premium Active State
                                                    : 'bg-white border-transparent hover:bg-slate-50 ' // Clean Neutral State
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 truncate pr-2">
                                                    <i className={`fas fa-caret-right text-[8px] ${activeTemplateId === temp._id ? 'text-blue-400' : 'text-slate-300'}`} />
                                                    <span className="text-[11px] font-bold capitalize truncate">{temp.templateName}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* Price - Hidden on hover to show trash, or kept next to it */}
                                                    <span className={`text-[9px] font-mono font-bold transition-opacity ${activeTemplateId === temp._id ? 'text-slate-800' : 'text-slate-800'
                                                        } group-hover:opacity-0`}>
                                                        ₹{temp.singleTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </span>

                                                    {/* DELETE TEMPLATE BUTTON - Slides in from the right inside the card */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteTemplate({ workId: work._id, templateId: temp._id, type: 'template' });
                                                        }}
                                                        className="absolute right-3 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all cursor-pointer p-1"
                                                    >
                                                        <i className="fas fa-trash-alt text-[10px]"></i>
                                                    </button>
                                                </div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>





                <main className="flex-1 overflow-y-auto p-2">
                    {activeWork && activeTemplate ? (
                        <div className="max-w-full mx-auto space-y-3">
                            {/* --- TOP HEADER CARD --- */}
                            {/* <header className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
                                        <i className={`fas ${activeWork.workType === 'sublet' ? 'fa-handshake' : 'fa-edit'} text-blue-600 text-sm`} />
                                        {activeTemplate.templateName} WORK
                                    </h2>
                                    <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5 italic">
                                        Workspace: {activeWork.workName} | Type: {activeWork.workType}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Sheet Total</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tight leading-none font-mono">
                                        ₹{activeTemplate.singleTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || "0.00"}
                                    </p>
                                </div>
                            </header> */}

                            {/* --- DYNAMIC CONTENT SWITCHER --- */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* {activeWork.workType === 'sublet' ? ( */}
                                {activeTemplate.isSublet ? (
                                    <SublettingTemplate
                                        // Find the specific sublet entry using the activeTemplateId
                                        // initialData={activeWork.subLettingData?.find((s: any) => s._id === activeTemplateId)}
                                        key={activeTemplate._id}
                                        initialData={activeTemplate}
                                        onAutoSave={handleManualSaveSublet} // This is triggered by the "Save" button in the child
                                        isSubmitting={updateSubletMutation.isPending}
                                    />
                                ) : (
                                    // 2. Render Dynamic Material Template if workType is template
                                    <DynamicWorkForm
                                        key={activeTemplate._id}
                                        templateName={activeTemplate.templateName}
                                        initialData={activeTemplate.templateData}
                                        onAutoSave={(updatedFields: any, newTotal: any) => {
                                            // Update the buffer for debounced standard templates
                                            setSaveBuffer({
                                                workId: activeWork._id,
                                                tempId: activeTemplate._id,
                                                data: updatedFields,
                                                total: newTotal
                                            });
                                        }}
                                        isSubmitting={updateFieldsMutation.isPending}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        /* --- EMPTY STATE --- */
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                <i className="fas fa-hand-pointer text-2xl text-slate-300"></i>
                            </div>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Select a sheet from sidebar</h3>
                        </div>
                    )}
                </main>


                {popoverState && (
                    <>
                        {/* Backdrop for closing */}
                        <div className="fixed inset-0 z-[100]" onClick={() => setPopoverState(null)} />

                        <div
                            style={{ position: 'fixed', top: popoverState.y, left: popoverState.x, zIndex: 101 }}
                            className="w-52 bg-white border border-slate-200 shadow-2xl rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-200"
                        >
                            {popoverState.menuLevel === 'choice' ? (
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 border-b border-slate-50 mb-1">
                                        Select Work Category
                                    </p>

                                    {/* Option 1: SUBLETTING */}
                                    <button
                                        onClick={handleCreateSublet}
                                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50 transition-all group flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            <i className="fas fa-handshake text-xs"></i>
                                        </div>
                                        <div>
                                            <span className="block font-bold text-slate-700 text-[11px] leading-none">Sublet Work</span>
                                            <span className="text-[8px] text-slate-400 uppercase font-medium">Vendor Quote</span>
                                        </div>
                                    </button>

                                    {/* Option 2: MATERIAL TEMPLATE (Click to show second menu) */}
                                    <button
                                        onClick={() => setPopoverState({ ...popoverState, menuLevel: 'templates' })}
                                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-all group flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <i className="fas fa-layer-group text-xs"></i>
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-700 text-[11px] leading-none">Mat X Sqft (Template)</span>
                                                <span className="text-[8px] text-slate-400 uppercase font-medium">Material Specs</span>
                                            </div>
                                        </div>
                                        <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setPopoverState({ ...popoverState, menuLevel: 'choice' })}
                                        className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:text-blue-800 transition-colors mb-1"
                                    >
                                        <i className="fas fa-arrow-left text-[9px]"></i>
                                        <span className="text-[9px] font-black uppercase tracking-widest">Back</span>
                                    </button>

                                    {WORK_TEMPLATE.map(t => (
                                        <button
                                            key={t.work}
                                            onClick={() => handleSelectMaterialTemplate(t)}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group flex items-center gap-3"
                                        >
                                            <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 transition-colors">
                                                <i className={`fas ${t.work === 'glass' ? 'fa-window-restore' : 'fa-box'} text-[10px] text-blue-600 group-hover:text-white`}></i>
                                            </div>
                                            <span className="font-bold text-slate-700 capitalize text-[10px] tracking-tight">{t.work} Spec</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>



            {/* --- CUSTOM MODAL: NEW WORK AREA --- */}
            {isWorkModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setWorkModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 border border-slate-100">
                        <div className="mb-6">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">New Area Context</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">E.g. Ground Floor Lobby, Meeting Room A</p>
                        </div>
                        <input
                            autoFocus
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all mb-6"
                            placeholder="NAME OF THE SPACE"
                            value={newWorkName}
                            onChange={(e) => setNewWorkName(e.target.value.toUpperCase())}
                        />
                        <div className="flex gap-2">
                            <Button variant="secondary" className="flex-1 text-[10px] font-bold uppercase text-slate-400" onClick={() => setWorkModalOpen(false)}>Cancel</Button>
                            <Button className="flex-1 bg-bue-600 text-white rounded-xl py-5 font-black text-[10px] uppercase shadow-lg"
                                onClick={handleCreateWorkArea}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternalQuoteForm;


