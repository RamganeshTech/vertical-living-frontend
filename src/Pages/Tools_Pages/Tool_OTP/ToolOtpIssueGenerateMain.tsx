import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Label } from '../../../components/ui/Label';
import SearchSelectNew from '../../../components/ui/SearchSelectNew';
import { useGetProjects } from '../../../apiList/projectApi';
import { toast } from '../../../utils/toast';
import { useGetAllToolRoomforDD, useGetAllToolsforDD, useInitiateToolIssue, useInitiateToolReturn, useResendOtpInitiateToolIssue, useResendOtpInitiateToolreturn } from '../../../apiList/tools_api/toolOtpApi';
import { useGetAllUsers } from '../../../apiList/getAll Users Api/getAllUsersApi';
import { Breadcrumb, type BreadcrumbItem } from '../../Department Pages/Breadcrumb';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';

const ToolOtpGenerateMain: React.FC = () => {
    const { organizationId } = useParams() as { organizationId: string };
    const navigate = useNavigate();





    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.toolhardware?.list;
    const canCreate = role === "owner" || permission?.toolhardware?.create;
    const canEdit = role === "owner" || permission?.toolhardware?.edit;
    // const canDelete = role === "owner" || permission?.toolhardware?.delete;




    // --- STATE ---
    const [mode, setMode] = useState<'issue' | 'return'>('issue');
    const [toolId, setToolId] = useState<string | null>(null);
    const [toolRoomId, setToolRoomId] = useState<string | null>(null);
    const [workerId, setWorkerId] = useState<string | null>(null);
    const [projectId, setProjectId] = useState<string | null>(null);
    const [expectedReturnDate, setExpectedReturnDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    const [returnCondition, setReturnCondition] = useState('good');
    const [damageNotes, setDamageNotes] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // const [showResendOTP, setShowResendOTP] = useState<{ tempTransactionId: string | null, showButton: boolean } | null>(null);

    const [showResendOTP, setShowResendOTP] = useState<{
        issue: { tempTransactionId: string | null, showButton: boolean } | null;
        return: { showButton: boolean } | null;
    }>({
        issue: null,
        return: null
    });

    const [resendTimer, setResendTimer] = useState<number>(0);

    // --- API ---
    const resendIssueMutation = useResendOtpInitiateToolIssue();
    const resendReturnMutation = useResendOtpInitiateToolreturn();

    // --- TIMER LOGIC ---
    useEffect(() => {
        let timer: any;
        if (resendTimer > 0) {
            timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    const startTimer = () => setResendTimer(180); // 3 Minutes (180 seconds)


    // --- API ---
    const { data: tools = [] } = useGetAllToolsforDD(organizationId);
    const { data: toolRoom = [] } = useGetAllToolRoomforDD(organizationId);
    const initiateIssueMutation = useInitiateToolIssue();
    const initiateReturnMutation = useInitiateToolReturn();
    const { data: workerList = [] } = useGetAllUsers(organizationId!, "worker");
    const { data: projectsData = [] } = useGetProjects(organizationId!);

    const filteredTools = tools.filter((t: any) =>
        mode === 'issue' ? t.availabilityStatus === 'available' : t.availabilityStatus === 'issued'
    );


    const toolOptions = filteredTools.map((t: any) => ({
        value: t._id,
        label: `${t.toolName} — ${t.toolCode}`,
        subLabel: t.brand,
    }));

    const toolRoomOptions = toolRoom.map((t: any) => ({
        value: t._id,
        label: `${t.toolRoomName}`,
        // subLabel: t.brand,
    }));


    const handleToolSelection = (id: string | null) => {
        const selected = tools.find((t: any) => t._id === id);
        setToolId(id);
        if (mode === 'return' && selected) {
            setWorkerId(selected.currentWorkerId || null);
            setProjectId(selected.currentProjectId || null);
        }
    };

    const handleToolRoomSelection = (id: string | null) => {
        // const selected = toolRoom.find((t: any) => t._id === id);
        setToolRoomId(id);

    };





    const paths: BreadcrumbItem[] = [
        { label: "Tools & Hardware", path: `/organizations/${organizationId}/projects/toolhub` },
        { label: "Handover Hub", path: `/organizations/${organizationId}/projects/issueotp` },
    ];

    const handleResendOtp = async () => {
        try {
            if (mode === 'issue') {
                const issueState = showResendOTP.issue;

                if (!issueState || !issueState.tempTransactionId) return;

                // if (!showResendOTP || !showResendOTP?.tempTransactionId) return;
                const res = await resendIssueMutation.mutateAsync({
                    transactionId: issueState.tempTransactionId,
                    organizationId
                });
                // console.log("resend otp", res)
                // IMPORTANT: Update state with the NEW transaction ID from backend
                // setShowResendOTP({
                //     tempTransactionId: res._id,
                //     showButton: true
                // });

                setShowResendOTP(() => ({
                    return: null,
                    issue: { tempTransactionId: res._id, showButton: true }
                }));

            } else {
                // For Return, we use the toolId and workerId as identifiers
                await resendReturnMutation.mutateAsync({
                    toolId,
                    organizationId,
                    toolWorkerId: workerId
                });
                // setShowResendOTP({
                //     tempTransactionId: null,
                //     showButton: true
                // });

                setShowResendOTP(() => ({
                    issue: null,
                    return: { showButton: true }
                }));
            }
            startTimer();
            toast({ title: "OTP Resent", description: "A fresh security code has been dispatched." });
        } catch (error: any) {
            toast({ title: "Resend Failed", description: error.message, variant: "destructive" });
        }
    };

    const handleAction = async () => {
        if (!toolId) return toast({ title: "Error", description: "Select a tool", variant: "destructive" });
        try {
            if (mode === 'issue') {
                if (!workerId || !projectId) return toast({ title: "Error", description: "Select a Worker and the Project", variant: "destructive" });
                const res = await initiateIssueMutation.mutateAsync({ toolId, toolWorkerId: workerId, projectId, organizationId, expectedReturnDate });
                // console.log("issue otp", res)
                // setShowResendOTP({
                //     tempTransactionId: res._id,
                //     showButton: true
                // });

                // Set only the issue property
                setShowResendOTP(() => ({
                    return: null,
                    issue: { tempTransactionId: res._id, showButton: true }
                }));

            } else {
                const formData = new FormData();
                formData.append('toolId', toolId);
                formData.append('organizationId', organizationId);
                formData.append('returnCondition', returnCondition);
                formData.append('damageNotes', damageNotes);
                if (projectId) formData.append('projectId', projectId);
                if (toolRoomId) formData.append('toolRoomId', toolRoomId);

                if (workerId) formData.append('toolWorkerId', workerId);
                selectedFiles.forEach(file => formData.append('photos', file));
                await initiateReturnMutation.mutateAsync(formData);
                // setShowResendOTP({
                //     tempTransactionId: null,
                //     showButton: true
                // });

                // Set only the return property
                setShowResendOTP(() => ({
                    issue: null,
                    return: { showButton: true }
                }));
            }
            startTimer();
            toast({ title: "Success", description: "OTP generated successfully." });
            // navigate(-1);
        } catch (error: any) {
            toast({ title: "Action Failed", description: error.message, variant: "destructive" });
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50/50">
            {/* --- TOP HEADER --- */}
            <header className="w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    {/* <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <i className="fas fa-arrow-left"></i>
                    </button> */}
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full animate-pulse ${mode === 'issue' ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
                            Tool Management Protocol
                        </h1>
                        {/* <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">OTP-Based Asset Handover</p> */}
                        <Breadcrumb paths={paths} />

                    </div>
                </div>


                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                        <button
                            onClick={() => {
                                setMode('issue'); setToolId(null);
                                // setShowResendOTP({issue:null, return:null}); 
                            }}
                            className={`px-8 py-2.5 cursor-pointer  rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === 'issue' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <i className="fas fa-sign-out-alt"></i> ISSUE ASSET
                        </button>
                        <button
                            onClick={() => { setMode('return'); setToolId(null); }}
                            className={`px-8 py-2.5 cursor-pointer  rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === 'return' ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <i className="fas fa-sign-in-alt"></i> COLLECT RETURN
                        </button>

                    </div>

                    <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

                    <div className="flex items-center gap-4 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                        <button
                            onClick={() => navigate('../enterotp')}
                            className="px-8 cursor-pointer  py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 
                   text-gray-500 hover:text-gray-700 hover:bg-white"
                        >
                            <i className="fas fa-key text-blue-500"></i>
                            TOOL HANDOVER
                            <i className="fas fa-external-link-alt text-[10px] opacity-50"></i>
                        </button>
                    </div>
                </div>
            </header >

            {/* --- MAIN CONTENT (FULL WIDTH) --- */}
            < main className="flex-1 overflow-y-auto p-8 grid grid-cols-12 gap-8" >

                {/* LEFT COLUMN: IDENTIFICATION (4/12) */}
                < div className="col-span-12 lg:col-span-4 space-y-6" >
                    <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <i className={`fas fa-search ${mode === "issue" ? "text-blue-500" : "text-orange-500"}`}></i> Tool Identification
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black text-gray-400">Search Tool</Label>
                                <SearchSelectNew
                                    options={toolOptions}
                                    placeholder="Enter Tool ID or Name..."
                                    value={toolId || ""}
                                    onValueChange={handleToolSelection}
                                    displayFormat="detailed"
                                    className="w-full"
                                />
                            </div>
                            {toolId && (
                                <div className={`p-5 rounded-2xl border-2 border-dashed ${mode === 'issue' ? 'bg-blue-50/50 border-blue-100' : 'bg-orange-50/50 border-orange-100'}`}>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Selected Asset Status</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-900">{tools.find((t: any) => t._id === toolId)?.toolName}</span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${mode === 'issue' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {mode === 'issue' ? 'Ready to Issue' : 'Awaiting Return'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div >

                {/* RIGHT COLUMN: RECIPIENT & SITE (8/12) */}
                < div className="col-span-12 lg:col-span-8 space-y-6" >
                    <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm grid grid-cols-2 gap-8">
                        <div className="col-span-2">
                            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <i className={`fas fa-users ${mode === "issue" ? "text-blue-500" : "text-orange-500"}`}></i> Operational Context
                            </h3>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black text-gray-400">Tool Taker</Label>
                            <SearchSelectNew
                                options={workerList.map((w: any) => ({ value: w._id, label: w.workerName, subLabel: w.phone }))}
                                placeholder="Choose field worker..."
                                value={workerId || ""}
                                onValueChange={setWorkerId}
                            // disabled={mode === 'return'}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black text-gray-400">Project</Label>
                            <SearchSelectNew
                                options={projectsData.map((p: any) => ({ value: p._id, label: p.projectName }))}
                                placeholder="Select Project..."
                                value={projectId || ""}
                                onValueChange={setProjectId}
                            // disabled={mode === 'return'}
                            />
                        </div>
                        {mode === "return" && <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black text-gray-400">Search Room</Label>
                            <SearchSelectNew
                                options={toolRoomOptions}
                                placeholder="Enter Tool Room Name..."
                                value={toolRoomId || ""}
                                onValueChange={handleToolRoomSelection}
                                displayFormat="detailed"
                                className="w-full"
                            />
                        </div>}
                    </div>

                    {/* DYNAMIC FOOTER SECTION */}
                    <div className={`bg-white rounded-3xl border-2 p-8 transition-all ${mode === 'issue' ? 'border-blue-50 bg-blue-50/10' : 'border-orange-50 bg-orange-50/10'}`}>
                        {mode === 'issue' ? (
                            <div className="flex items-center justify-between">
                                {!showResendOTP.issue?.showButton &&
                                    <>
                                        <div className="space-y-2 w-1/3">
                                            <Label className="text-[10px] uppercase font-black text-gray-400">Target Return Date</Label>
                                            <input type="date" value={expectedReturnDate} onChange={(e) => setExpectedReturnDate(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl font-bold shadow-sm" />
                                        </div>
                                       {(canCreate || canEdit) && <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-4 max-w-xs">A security code will be dispatched to the worker's device immediately.</p>
                                            <Button onClick={handleAction} disabled={initiateIssueMutation.isPending} className="px-12 py-7 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-2xl shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1">
                                                {initiateIssueMutation.isPending ? <i className="fas fa-spinner fa-spin"></i> : 'GENERATE ISSUE OTP'}
                                            </Button>
                                        </div>}
                                    </>
                                }
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {!showResendOTP.return?.showButton && <><div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] uppercase font-black text-gray-400">Condition Assessment</Label>
                                        <select value={returnCondition} onChange={(e) => setReturnCondition(e.target.value)} className="w-full p-4 border border-gray-200 rounded-2xl bg-white font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-orange-500">
                                            <option value="good">Good</option>
                                            <option value="damaged">Damaged</option>
                                        </select>
                                        {returnCondition === 'damaged' && (
                                            <textarea placeholder="Describe physical damages in detail..." value={damageNotes} onChange={(e) => setDamageNotes(e.target.value)} className="w-full p-4 border border-red-100 rounded-2xl h-24 text-sm bg-red-50/30" />
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] uppercase font-black text-gray-400">Physical Evidence</Label>
                                        <div className="h-40 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-gray-50 hover:bg-orange-50 transition-colors relative cursor-pointer group">
                                            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} />
                                            <i className="fas fa-camera text-3xl text-gray-300 group-hover:text-orange-500 transition-colors"></i>
                                            <p className="text-xs font-bold text-gray-500 mt-3">{selectedFiles.length > 0 ? `${selectedFiles.length} Photos Added` : 'Upload Site Photos'}</p>
                                        </div>
                                    </div>
                                </div>
                                    {(canCreate || canEdit) &&<div className="flex justify-end pt-6 border-t border-gray-100">
                                        <Button onClick={handleAction} disabled={initiateReturnMutation.isPending} className="px-12 py-7 bg-orange-600 hover:bg-orange-700 text-white text-lg rounded-2xl shadow-xl shadow-orange-200 transition-all transform hover:-translate-y-1">
                                            {initiateReturnMutation.isPending ? <i className="fas fa-spinner fa-spin"></i> : 'GENERATE RETURN OTP'}
                                        </Button>
                                    </div>}
                                </>
                                }
                            </div>
                        )}



                        {(canCreate || canEdit) && <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
                            {/* RESEND BUTTON - Shows only after initial generation */}
                            {showResendOTP[mode]?.showButton && (
                                <Button
                                    onClick={handleResendOtp}
                                    disabled={resendTimer > 0 || resendIssueMutation.isPending || resendReturnMutation.isPending}
                                    className="px-6 py-7 border-2 border-gray-200  text-gray-600 font-bold rounded-2xl transition-all"
                                >
                                    <i className={`fas fa-sync-alt mr-2 ${resendTimer > 0 ? '' : 'fa-spin'}`}></i>
                                    {resendTimer > 0
                                        ? `Resend in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}`
                                        : 'Resend OTP'}
                                </Button>
                            )}
                        </div>}


                    </div>



                </div >
            </main >
        </div >
    );
};

export default ToolOtpGenerateMain;