import { useParams } from "react-router-dom";
import { useState } from "react";
import { useGetSingleOrganization, useUpdateOrganizationName } from "../../apiList/orgApi";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Skeleton } from "../../components/ui/Skeleton";
import { toast } from "../../utils/toast";
import { Breadcrumb } from "../Department Pages/Breadcrumb";

export default function OrganizationSettings() {
    const { organizationId } = useParams<{ organizationId: string }>();

    // Fetch Organization Data
    let { data: organization, isLoading: orgLoading } = useGetSingleOrganization(organizationId!);
    if (Array.isArray(organization)) organization = organization[0];

    const updateMutation = useUpdateOrganizationName();

    // State for inline editing
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState("");

    // Breadcrumb Paths
    const paths = [
        { label: "Organization", path: `/organizations/${organizationId}` },
        { label: "Settings", path: `/organizations/${organizationId}/settings` },
    ];

    const handleStartEdit = (field: string, currentVal: string) => {
        setEditingField(field);
        setTempValue(currentVal || "");
    };

    const handleSave = async (field: string) => {
        try {

            if (field === "organizationPhoneNo") {
                const phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(tempValue)) {
                    toast({
                        title: "Invalid Phone Number",
                        description: "Please enter a valid 10-digit phone number.",
                        variant: "destructive",
                    });
                    return; // Stop the API call
                }
            }



            // --- GENERAL EMPTY CHECK ---
            if (!tempValue.trim() && field !== "gstin") {
                toast({
                    title: "Error",
                    description: "Field cannot be empty",
                    variant: "destructive",
                });
                return;
            }


            await updateMutation.mutateAsync({
                orgsId: organizationId!,
                updateField: { [field]: tempValue },
            });
            toast({ title: "Success", description: `${field} updated successfully` });
            setEditingField(null);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Update failed",
                variant: "destructive",
            });
        }
    };

    const handleModeToggle = async (newMode: "manual" | "automation") => {
        if (organization?.mode === newMode) return;
        try {
            await updateMutation.mutateAsync({
                orgsId: organizationId!,
                updateField: { mode: newMode },
            });
            toast({ title: "Success", description: `Switched to ${newMode} mode` });
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to update mode", variant: "destructive" });
        }
    };

    if (orgLoading) return <SettingsSkeleton />;

    return (
        <div className="flex flex-col w-full h-full bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-y-auto custom-scrollbar">

            {/* PROFESSIONAL HEADER SECTION */}
            <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-20 w-full">
                <div className="max-w-full mx-auto px-6 py-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <i className="fas fa-cog mr-3 text-blue-600"></i>
                            Organization Settings
                        </h1>
                        <Breadcrumb paths={paths} />
                    </div>
                </div>
            </div>

            {/* FULL WIDTH CONTENT AREA */}
            <div className="p-6 space-y-8 w-full">

                {/* HYBRID MODE TOGGLE CARD - Enterprise Style */}
                <div className="w-full bg-white border border-blue-200 rounded-2xl shadow-sm p-8 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <i className="fas fa-microchip text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Process Automation Mode</h3>
                                <p className="text-gray-500 mt-1 max-w-2xl">
                                    Choose between manual staff verification or automated 30-minute auto-transfer to payment department. This setting affects procurement and billing workflows globally.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center p-1.5 bg-gray-100 rounded-2xl border border-gray-200 w-fit">
                            <button
                                onClick={() => handleModeToggle("manual")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${organization?.mode === "manual"
                                    ? "bg-white text-blue-600 shadow-lg scale-105"
                                    : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                <i className="fas fa-hand-pointer"></i> Manual
                            </button>
                            <button
                                onClick={() => handleModeToggle("automation")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${organization?.mode === "automation"
                                    ? "bg-blue-600 text-white shadow-lg scale-105"
                                    : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                <i className="fas fa-bolt"></i> Automation
                            </button>
                        </div>
                    </div>
                </div>

                {/* DETAILS GRID - TAKES FULL WIDTH */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    <SettingCard
                        label="Organization Name"
                        icon="fa-building"
                        value={organization?.organizationName}
                        isEditing={editingField === "organizationName"}
                        onEdit={() => handleStartEdit("organizationName", organization?.organizationName)}
                        onSave={() => handleSave("organizationName")}
                        onCancel={() => setEditingField(null)}
                        onChange={setTempValue}
                        tempValue={tempValue}
                        loading={updateMutation.isPending}
                    />

                    <SettingCard
                        label="GSTIN Number"
                        icon="fa-file-invoice"
                        value={organization?.gstin}
                        isEditing={editingField === "gstin"}
                        onEdit={() => handleStartEdit("gstin", organization?.gstin)}
                        onSave={() => handleSave("gstin")}
                        onCancel={() => setEditingField(null)}
                        onChange={setTempValue}
                        tempValue={tempValue}
                        loading={updateMutation.isPending}
                    />

                    <SettingCard
                        label="Contact Phone"
                        icon="fa-phone-alt"
                        value={organization?.organizationPhoneNo}
                        isEditing={editingField === "organizationPhoneNo"}
                        onEdit={() => handleStartEdit("organizationPhoneNo", organization?.organizationPhoneNo)}
                        onSave={() => handleSave("organizationPhoneNo")}
                        onCancel={() => setEditingField(null)}
                        onChange={setTempValue}
                        tempValue={tempValue}
                        loading={updateMutation.isPending}
                    />

                    <div className="md:col-span-2 xl:col-span-3">
                        <SettingCard
                            label="Registered Office Address"
                            icon="fa-map-marked-alt"
                            value={organization?.address}
                            isEditing={editingField === "address"}
                            onEdit={() => handleStartEdit("address", organization?.address)}
                            onSave={() => handleSave("address")}
                            onCancel={() => setEditingField(null)}
                            onChange={setTempValue}
                            tempValue={tempValue}
                            loading={updateMutation.isPending}
                            isTextArea
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

// STYLED SETTING CARD COMPONENT
function SettingCard({ label, icon, value, isEditing, onEdit, onSave, inputType = "text", onCancel, onChange, tempValue, loading, isTextArea }: any) {
    return (
        <div className="group bg-white border border-blue-100 rounded-2xl p-6 transition-all hover:shadow-md hover:border-blue-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <i className={`fas ${icon} text-sm`}></i>
                    </div>
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{label}</span>
                </div>
                {!isEditing && (
                    <button onClick={onEdit} className="text-blue-500 hover:text-blue-700 p-1">
                        <i className="fas fa-pencil-alt text-xs"></i>
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    {isTextArea ? (
                        <textarea
                            className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 outline-none text-gray-700 bg-blue-50/30"
                            rows={3}
                            value={tempValue}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    ) : (
                        <Input
                            className="border-blue-100 focus:border-blue-500 h-12 rounded-xl bg-blue-50/30"
                            value={tempValue}
                            // onChange={(e) => onChange(e.target.value)}
                            onChange={(e) => {
                                let val = e.target.value;

                                // BLOCK ALPHABETS AND LIMIT TO 10 FOR PHONE
                                if (label === "Contact Phone" || inputType === "tel") {
                                    // Remove anything that is NOT a number
                                    val = val.replace(/\D/g, "");

                                    // Manually slice to 10 characters to ensure no bypass
                                    if (val.length > 10) {
                                        val = val.slice(0, 10);
                                    }
                                }
                                onChange(val);
                            }}
                        />
                    )}
                    <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
                        <Button size="sm" className="bg-blue-600 text-white px-6 rounded-lg" onClick={onSave} isLoading={loading}>Save Changes</Button>
                    </div>
                </div>
            ) : (
                <div className="text-lg font-semibold text-gray-800 break-words whitespace-pre-wrap pl-11">
                    {value || <span className="text-gray-300 font-normal italic">No data provided</span>}
                </div>
            )}
        </div>
    );
}

function SettingsSkeleton() {
    return (
        <div className="w-full p-8 space-y-8">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
            </div>
        </div>
    );
}