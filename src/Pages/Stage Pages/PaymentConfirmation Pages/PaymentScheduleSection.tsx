import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useGetPaymentSchedule,
    useUpdateClientApprovalStatus,
    useUpdateClientNotes,
    useUpdateMdApprovalStatus,
    useUpdateMdNotes,
    useUpdatePaymentScheduleDueDate,
} from "../../../apiList/Stage Api/Payment Api/paymentScheduleApi";
import { toast } from "../../../utils/toast";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { dateFormate } from "../../../utils/dateFormator";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

const statusOptions = ["pending", "approved", "rejected"] as const;

const PaymentScheduleSection: React.FC = () => {
    const { projectId, organizationId } = useParams<{ projectId: string, organizationId: string }>();
    const navigate = useNavigate()
    const { data, isLoading, error: getAllError, refetch } = useGetPaymentSchedule(projectId!);
    const clientStatusMutation = useUpdateClientApprovalStatus();
    const clientNotesMutation = useUpdateClientNotes();
    const mdStatusMutation = useUpdateMdApprovalStatus();
    const mdNotesMutation = useUpdateMdNotes();

    const [clientNotes, setClientNotes] = useState("");
    const [mdNotes, setMdNotes] = useState("");
    const [dueDate, setDueDate] = useState(data?.dueDate);
    const [isEditingDueDate, setIsEditingDueDate] = useState(false);
    const dueDateMutation = useUpdatePaymentScheduleDueDate();



    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.paymentconfirmation?.delete;
    // const canList = role === "owner" || permission?.paymentconfirmation?.list;
    const canCreate = role === "owner" || permission?.paymentconfirmation?.create;
    const canEdit = role === "owner" || permission?.paymentconfirmation?.edit;





    const handleDueDateSave = async () => {
        try {
            await dueDateMutation.mutateAsync({ projectId: projectId!, dueDate });
            refetch()
            toast({
                title: "Success",
                description: "Due date updated successfully.",
            });
            setIsEditingDueDate(false);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.response?.data?.message || err.message || "Failed to update due date.",
                variant: "destructive",
            });
        }
    };

    const handleUpdateClientStatus = (status: "pending" | "approved" | "rejected") => {
        clientStatusMutation.mutate(
            { projectId: projectId!, status },
            {
                onSuccess: () => toast({ title: "Success", description: "Client approval status updated." }),
                onError: (err: any) =>
                    toast({
                        title: "Error",
                        description:
                            err?.response?.data?.message || err.message || "Failed to update client status",
                        variant: "destructive",
                    }),
            }
        );
    };

    const handleUpdateMdStatus = (status: "pending" | "approved" | "rejected") => {
        mdStatusMutation.mutate(
            { projectId: projectId!, status },
            {
                onSuccess: () => toast({ title: "Success", description: "MD approval status updated." }),
                onError: (err: any) =>
                    toast({
                        title: "Error",
                        description:
                            err?.response?.data?.message || err.message || "Failed to update MD status",
                        variant: "destructive",
                    }),
            }
        );
    };

    const handleClientNotesSubmit = () => {
        clientNotesMutation.mutate(
            { projectId: projectId!, notes: clientNotes },
            {
                onSuccess: () => toast({ title: "Success", description: "Client note updated." }),
                onError: (err: any) =>
                    toast({
                        title: "Error",
                        description:
                            err?.response?.data?.message || err.message || "Failed to update notes",
                        variant: "destructive",
                    }),
            }
        );
    };

    const handleMdNotesSubmit = () => {
        mdNotesMutation.mutate(
            { projectId: projectId!, notes: mdNotes },
            {
                onSuccess: () => toast({ title: "Success", description: "MD note updated." }),
                onError: (err: any) =>
                    toast({
                        title: "Error",
                        description:
                            err?.response?.data?.message || err.message || "Failed to update notes",
                        variant: "destructive",
                    }),
            }
        );
    };

    if (isLoading) return <p><MaterialOverviewLoading /></p>;
    if (getAllError)
        return (
            // <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
            //     <div className="text-red-600 text-xl font-semibold mb-2">
            //         ⚠️ Oops! An Error Occurred
            //     </div>
            //     <p className="text-red-500 text-sm mb-4">
            //         {(getAllError as any)?.response?.data?.message ||
            //             (getAllError as any)?.message ||
            //             "Failed to load, please try again"}
            //     </p>

            //     <Button
            //         onClick={() => refetch()}
            //         isLoading={isLoading}
            //         className="bg-red-600 text-white hover:bg-red-700"
            //     >
            //         Retry
            //     </Button>
            // </div>

            <div className="max-w-xl mx-auto mt-12 p-6 bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center">
                <div className="text-action-danger text-2xl mb-3">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div className="text-text-main text-lg font-bold mb-2">
                    Oops! An Error Occurred
                </div>
                <p className="text-text-muted text-sm mb-5">
                    {(getAllError as any)?.response?.data?.message ||
                        (getAllError as any)?.message ||
                        "Failed to load, please try again"}
                </p>

                <Button
                    onClick={() => refetch()}
                    isLoading={isLoading}
                    variant="outline"
                    className="hover:bg-brand-ash hover:text-action-danger hover:border-action-danger text-text-main border-ash-medium"
                >
                    Retry
                </Button>
            </div>
        );

    return (
        <div className="w-full max-w-full max-h-full overflow-y-auto custom-scrollbar mx-auto space-y-6 px-4 py-6 bg-brand-main">
            {/* <div className="w-full justify-between flex"> */}
            <div className="w-full justify-between items-center flex mb-2 pb-4 border-b border-ash-light">

                {/* <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2"> */}
                <h2 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-3">
                    {/* <i className="fa-regular fa-calendar-check text-blue-600" /> */}
                    <i className="fa-regular fa-calendar-check text-text-muted text-lg" />
                    <span className="hidden sm:inline">  Step 2: Payment Schedule Approval</span>
                    <span className="inline sm:hidden">  Payment Schedule</span>
                </h2>



                {/* <Button variant="primary" onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/paymentconfirmation`)}>
                    Back
                </Button> */}

                <Button
                    variant="white"
                    onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/paymentconfirmation`)}
                    className="border-ash-medium text-text-main shadow-sm"
                >
                    <i className="fa-solid fa-arrow-left sm:mr-2"></i>
                    <span className="hidden sm:inline">Back</span>
                </Button>
            </div>

            {/* <Card className="p-4 border border-gray-200 shadow-sm rounded mb-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h3 className="font-semibold text-blue-700 text-lg flex items-center gap-2">
                        <i className="fa-solid fa-calendar-days" /> Payment Due Date
                    </h3> */}

            <Card className="p-5 sm:p-6 border border-ash-medium bg-brand-surface shadow-sm rounded-xl mb-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
                        <i className="fa-solid fa-calendar-days text-text-muted" /> Payment Due Date
                    </h3>


                    {!isEditingDueDate ? (
                        <div className="flex items-center gap-3">
                            {/* <span className="text-md font-medium text-gray-800"> */}
                            <span className="text-base font-semibold text-text-main bg-brand-ash border border-ash-light px-4 py-1.5 rounded-lg">
                                {data?.dueDate ? dateFormate(data?.dueDate) : "Not set"}
                            </span>

                            {(canCreate || canEdit) && <Button
                                size="sm"
                                variant="white"
                                onClick={() => setIsEditingDueDate(true)}
                                // className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
                                className="border-ash-medium text-text-main shadow-sm px-4"
                            >
                                <i className="fa-regular fa-pen-to-square mr-2 text-text-muted" />
                                Edit
                            </Button>}
                        </div>
                    ) : (
                        // <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-3 flex-wrap bg-brand-ash p-2 rounded-lg border border-ash-light">
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                // className="border rounded px-3 py-1 text-sm"
                                className="bg-brand-surface border border-ash-medium rounded-md px-3 py-1.5 text-sm text-text-main focus:ring-2 focus:ring-ash-medium outline-none transition-all shadow-sm"
                            />
                            <Button
                                size="sm"
                                onClick={handleDueDateSave}
                                variant="dark"
                                isLoading={dueDateMutation.isPending}
                                // className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
                                className="px-4 py-1.5 shadow-sm"
                            >
                                <i className="fa-solid fa-check mr-2" />
                                Save
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setDueDate(data?.dueDate?.slice(0, 10));
                                    setIsEditingDueDate(false);
                                }}
                                // variant="outline"
                                // className="px-3 py-1"
                                variant="ghost"
                                className="px-3 py-1.5 text-text-muted hover:text-text-main hover:bg-ash-medium"
                            >
                                <i className="fa-solid fa-xmark mr-1" />
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* ... (rest of your approval cards afterwards) */}

            {/* Client Box */}
            {/* <Card className="p-5 space-y-4 shadow-md border border-gray-200">
                <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col sm:mb-0  mb-1 items-start">
                    <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                        <i className="fa-solid fa-user" /> Client Approval
                    </h3> */}

            <Card className="p-6 space-y-6 shadow-sm border border-ash-medium bg-brand-surface rounded-xl">
                <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col sm:mb-0 mb-1 items-start gap-4 pb-4 border-b border-ash-light">
                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-ash border border-ash-medium flex items-center justify-center">
                            <i className="fa-solid fa-user text-text-muted text-sm" />
                        </div>
                        Client Approval
                    </h3>

                    {/* <div className="flex items-center gap-2"> */}
                    <div className="flex items-center gap-2 bg-brand-ash p-1.5 rounded-lg border border-ash-light">
                        {(canCreate || canEdit) && statusOptions.map((status) => (
                            <Button
                                isLoading={
                                    clientStatusMutation.isPending &&
                                    clientStatusMutation.variables?.status === status
                                }
                                key={status}
                                size="sm"
                                onClick={() => handleUpdateClientStatus(status)}
                                variant={data.clientApprovalStatus === status ? "dark" : "ghost"}
                                // className={`text-white text-xs ${data.clientApprovalStatus === status
                                //     ? "bg-blue-800"
                                //     : "bg-blue-600 hover:bg-blue-700"
                                //     }`}

                                className={`text-xs font-bold px-4 py-1.5 rounded-md transition-all ${data.clientApprovalStatus === status
                                    ? "shadow-sm pointer-events-none"
                                    : "text-text-muted hover:text-text-main hover:bg-brand-surface border border-transparent hover:border-ash-medium"
                                    }`}
                            >
                                {status.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* <div>
                    <p className="text-sm text-gray-600 mb-1">Current Status:</p>
                    <div className="rounded bg-gray-100 px-4 py-2 text-sm text-blue-900 border">
                        {data.clientApprovalStatus.toUpperCase()}
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-600 mt-4 mb-1">Existing Notes:</p>
                    <div className="bg-gray-50 p-3 text-sm rounded border text-gray-800">
                        {data.clientNotes || "No notes added yet"}
                    </div>
                </div> */}
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">Current Status</p>
                    <div className="rounded-lg bg-brand-ash px-4 py-2.5 text-sm font-bold text-text-main border border-ash-medium inline-block">
                        {data.clientApprovalStatus.toUpperCase()}
                    </div>
                </div>

                {/* Existing Notes */}
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">Existing Notes</p>
                    <div className="bg-brand-ash p-3.5 text-sm rounded-lg border border-ash-medium text-text-main min-h-[46px]">
                        {data.clientNotes || <span className="text-text-muted italic">No notes added yet</span>}
                    </div>
                </div>


                {/* New Notes */}
                <div>
                    <textarea
                        // className="w-full mt-3 p-2 border rounded-md text-sm"
                        className="w-full p-3.5 bg-brand-ash border border-ash-medium rounded-lg text-sm text-text-main focus:bg-brand-surface focus:ring-2 focus:ring-ash-medium outline-none transition-all shadow-sm placeholder:text-text-muted"
                        placeholder="Add client notes..."
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        rows={3}
                    />
                    {(canCreate || canEdit) &&

                        <div className="flex justify-end mt-3">
                            <Button
                                onClick={handleClientNotesSubmit}
                                isLoading={clientNotesMutation.isPending}
                                // className="bg-blue-600 hover:bg-blue-700 text-white mt-2"
                                variant="dark"
                                className="px-5 shadow-sm"
                            >
                                <i className="fa-regular fa-floppy-disk mr-2" />
                                Save Client Notes
                            </Button>
                        </div>
                    }
                </div>
            </Card >

            {/* MD Box */}
            {/* < Card className="p-5 space-y-4 shadow-md border border-gray-200" >
                <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col sm:mb-0  mb-1 items-start">
                    <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                        <i className="fa-solid fa-user-tie" /> MD Approval
                    </h3> */}


            <Card className="p-6 space-y-6 shadow-sm border border-ash-medium bg-brand-surface rounded-xl">
                <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col sm:mb-0 mb-1 items-start gap-4 pb-4 border-b border-ash-light">
                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-ash border border-ash-medium flex items-center justify-center">
                            <i className="fa-solid fa-user-tie text-text-muted text-sm" />
                        </div>
                        MD Approval
                    </h3>

                    <div className="flex items-center gap-2">
                        {(canCreate || canEdit) && statusOptions.map((status) => (
                            <Button
                                isLoading={
                                    mdStatusMutation.isPending &&
                                    mdStatusMutation.variables?.status === status
                                }

                                key={status}
                                size="sm"
                                onClick={() => handleUpdateMdStatus(status)}
                                variant={data.mdApprovalStatus === status ? "dark" : "ghost"}
                                // className={`text-white text-xs ${data.mdApprovalStatus === status
                                //     ? "bg-blue-800"
                                //     : "bg-blue-600 hover:bg-blue-700"
                                //     }`}

                                className={`text-xs font-bold px-4 py-1.5 rounded-md transition-all ${data.mdApprovalStatus === status
                                        ? "shadow-sm pointer-events-none"
                                        : "text-text-muted hover:text-text-main hover:bg-brand-surface border border-transparent hover:border-ash-medium"
                                    }`}
                            >
                                {status.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Existing Status & Notes */}
                {/* <div>
                    <p className="text-sm text-gray-600 mb-1">Current Status:</p>
                    <div className="rounded bg-gray-100 px-4 py-2 text-sm text-blue-900 border">
                        {data.mdApprovalStatus.toUpperCase()}
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-600 mt-4 mb-1">Existing Notes:</p>
                    <div className="bg-gray-50 p-3 text-sm rounded border text-gray-800">
                        {data.mdNotes || "No notes added yet"}
                    </div>
                </div> */}

                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">Current Status</p>
                    <div className="rounded-lg bg-brand-ash px-4 py-2.5 text-sm font-bold text-text-main border border-ash-medium inline-block">
                        {data.mdApprovalStatus.toUpperCase()}
                    </div>
                </div>

                {/* Existing Notes */}
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">Existing Notes</p>
                    <div className="bg-brand-ash p-3.5 text-sm rounded-lg border border-ash-medium text-text-main min-h-[46px]">
                        {data.mdNotes || <span className="text-text-muted italic">No notes added yet</span>}
                    </div>
                </div>

                {/* New Notes */}
                <div>
                    <textarea
                        // className="w-full mt-3 p-2 border rounded-md text-sm"
                        className="w-full p-3.5 bg-brand-ash border border-ash-medium rounded-lg text-sm text-text-main focus:bg-brand-surface focus:ring-2 focus:ring-ash-medium outline-none transition-all shadow-sm placeholder:text-text-muted"
                        placeholder="Add MD notes..."
                        value={mdNotes}
                        onChange={(e) => setMdNotes(e.target.value)}
                        rows={3}
                    />
                    {(canCreate || canEdit) && (
                        <div className="flex justify-end mt-3">
                            <Button
                                onClick={handleMdNotesSubmit}
                                isLoading={mdNotesMutation.isPending}
                                variant="dark"
                                className="px-5 shadow-sm"
                            >
                                <i className="fa-regular fa-floppy-disk mr-2" />
                                Save MD Notes
                            </Button>
                        </div>
                    )}
                </div>
            </Card >
        </div >
    );
};

export default PaymentScheduleSection;