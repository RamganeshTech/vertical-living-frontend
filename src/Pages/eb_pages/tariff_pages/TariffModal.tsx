import React, { useState, useEffect } from 'react';
import { useCreateTariff, useUpdateTariff, type ITariff, type ITariffSlab } from '../../../apiList/eb_api/tariffApi';
import { toast } from '../../../utils/toast';
import { SidePanel } from '../../../shared/SidePanel/SidePanel';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface TariffModalProps {
    isOpen: boolean;
    onClose: () => void;
    tariffData?: ITariff | null;
    organizationId: string;
    canEdit: boolean;
}

export default function TariffModal({ isOpen, onClose, tariffData, organizationId, canEdit }: TariffModalProps) {

    // --- API Hooks ---
    const { mutateAsync: createTariff, isPending: isCreating } = useCreateTariff();
    const { mutateAsync: updateTariff, isPending: isUpdating } = useUpdateTariff();
    const isPending = isCreating || isUpdating;

    // --- State Setup ---
    const initialFormState = {
        tariffName: '',
        fixedChargePerKw: '',
        isActive: true
    };

    const [formData, setFormData] = useState(initialFormState);
    const [slabs, setSlabs] = useState<ITariffSlab[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);

    // --- Initialize Form on Open ---
    useEffect(() => {
        if (isOpen) {
            if (tariffData) {
                // View Mode for existing record
                setFormData({
                    tariffName: tariffData.tariffName || '',
                    fixedChargePerKw: tariffData.fixedChargePerKw !== undefined ? String(tariffData.fixedChargePerKw) : '',
                    isActive: tariffData.isActive ?? true
                });
                // Deep copy slabs to avoid mutating cache directly before saving
                setSlabs(tariffData.slabs ? JSON.parse(JSON.stringify(tariffData.slabs)) : []);
                setIsEditMode(false);
            } else {
                // Create Mode
                setFormData(initialFormState);
                // setSlabs([{ minKw: 0, maxKw: 100, ratePerUnit: 0 }]); // Start with one default slab
                setSlabs([{ upto: 100, ratePerUnit: 0 }]); // Start with one default slab
                setIsEditMode(true);
            }
        }
    }, [isOpen, tariffData]);

    // --- Handlers: Basic Fields ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    // --- Handlers: Dynamic Slabs ---
    const handleAddSlab = () => {
        const lastSlab = slabs[slabs.length - 1];
        // Automatically suggest the next 'upto' limit by adding 100
        const newUpto = lastSlab ? Number(lastSlab.upto) + 100 : 100;
        setSlabs(prev => [...prev, { upto: newUpto, ratePerUnit: 0 }]);
    };

    const handleRemoveSlab = (indexToRemove: number) => {
        setSlabs(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSlabChange = (index: number, field: keyof ITariffSlab, value: string) => {
        setSlabs(prev => {
            const updated = [...prev];
            // Convert to number, but handle empty string temporarily if user is typing
            updated[index] = {
                ...updated[index],
                [field]: value === '' ? '' : Number(value)
            };
            return updated;
        });
    };

    // --- Submit / Cancel ---
    const handleCancel = () => {
        if (!tariffData) {
            onClose(); // Creating -> close
        } else {
            // Revert changes
            setFormData({
                tariffName: tariffData.tariffName || '',
                fixedChargePerKw: tariffData.fixedChargePerKw !== undefined ? String(tariffData.fixedChargePerKw) : '',
                isActive: tariffData.isActive ?? true
            });
            setSlabs(tariffData.slabs ? JSON.parse(JSON.stringify(tariffData.slabs)) : []);
            setIsEditMode(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!formData.tariffName || formData.fixedChargePerKw === '') {
                // toast.error("Tariff Name and Fixed Charge are required.");
                toast({ variant: "destructive", title: "Error", description: "Tariff Name and Fixed Charge are required" });

                return;
            }

            // Basic Slab Validation
            // Basic Slab Validation
            let previousUpto = -1;
            for (let i = 0; i < slabs.length; i++) {
                const slab = slabs[i];
                if (slab.upto === undefined || slab.ratePerUnit === undefined) {
                    // toast.error(`Slab ${i + 1} has missing values.`);
                    toast({ variant: "destructive", title: "Error", description: `Slab ${i + 1} has missing values.` });

                    return;
                }
                if (Number(slab.upto) <= previousUpto) {
                    // toast.error(`Slab ${i + 1}: 'Up To' limit must be greater than the previous slab.`);
                    toast({ variant: "destructive", title: "Error", description: `Slab ${i + 1}: 'Up To' limit must be greater than the previous slab.` });

                    return;
                }
                previousUpto = Number(slab.upto);
            }

            // Prepare Payload
            const payload: any = {
                tariffName: formData.tariffName,
                fixedChargePerKw: Number(formData.fixedChargePerKw),
                slabs: slabs,
                isActive: formData.isActive
            };

            if (tariffData?._id) {
                // Update
                await updateTariff({ organizationId, tariffId: tariffData._id, payload });
                // toast.success("Tariff Updated Successfully!");
                toast({ title: "Success", description: "Tariff Updated Successfully" });

                setIsEditMode(false);
            } else {
                // Create
                await createTariff({ organizationId, payload });
                // toast.success("Tariff Created Successfully!");
                toast({ title: "Success", description: "Tariff Created Successfully" });

                onClose();
            }
        } catch (error: any) {
            // toast.error(error?.message || "Operation Failed.");
                        toast({ variant: "destructive", title: "Error", description: error?.message || "Operation Failed" });
            
        }
    };

    const title = !tariffData ? "Create New Tariff" : isEditMode ? "Edit Tariff Plan" : "Tariff Details";

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            actions={
                (canEdit && tariffData && !isEditMode) ? (
                    <Button type="button" variant="primary" 
                    // leftIcon="fas fa-edit"
                     onClick={() => setIsEditMode(true)}>
                        Edit Details
                    </Button>
                ) : undefined
            }
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-6">

                {/* Scrollable Content Area */}
                <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1 pb-4 mt-2">

                    {/* --- Basic Information --- */}
                    <div className="bg-surface/50 p-5 rounded-xl border border-ash-medium/50 space-y-5">
                        <h4 className="text-sm font-semibold text-text-strong border-b border-ash-medium pb-2 flex items-center gap-2">
                            <i className="fas fa-info-circle text-text-muted"></i> General Details
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="sm:col-span-2">
                                <InfoField label="Tariff Plan Name *" isEdit={isEditMode}>
                                    {isEditMode ? (
                                        <Input
                                            id="tariffName"
                                            placeholder="e.g. Commercial Plan A, Residential"
                                            value={formData.tariffName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    ) : (
                                        <p className="font-medium text-text-strong text-[14px]">{formData.tariffName || 'N/A'}</p>
                                    )}
                                </InfoField>
                            </div>

                            <InfoField label="Fixed Charge per kW (₹) *" isEdit={isEditMode}>
                                {isEditMode ? (
                                    <Input
                                        id="fixedChargePerKw"
                                        type="number"
                                        step="any"
                                        placeholder="e.g. 150"
                                        value={formData.fixedChargePerKw}
                                        onChange={handleInputChange}
                                        required
                                    />
                                ) : (
                                    <p className="font-mono text-sm text-text-strong bg-brand-surface border border-ash-medium px-2 py-1 rounded w-fit">
                                        ₹{formData.fixedChargePerKw} / kW
                                    </p>
                                )}
                            </InfoField>

                            {isEditMode ? (
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-text-strong">
                                        <input
                                            id="isActive"
                                            type="checkbox"
                                            className="w-4 h-4 accent-text-muted rounded border-ash-medium"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                        />
                                        Plan is Active
                                    </label>
                                </div>
                            ) : (
                                <InfoField label="Status" isEdit={false}>
                                    <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-[11px] font-medium ${formData.isActive
                                        ? "bg-action-success/10 text-action-success border border-action-success/20"
                                        : "bg-action-danger/10 text-action-danger border border-action-danger/20"
                                        }`}>
                                        {formData.isActive ? "Active" : "Inactive"}
                                    </span>
                                </InfoField>
                            )}
                        </div>
                    </div>

                    {/* --- Dynamic Slabs Configuration --- */}
                    <div className="bg-surface/50 p-5 rounded-xl border border-ash-medium/50 flex flex-col space-y-4">
                        <div className="flex items-center justify-between border-b border-ash-medium pb-2">
                            <h4 className="text-sm font-semibold text-text-strong flex items-center gap-2">
                                <i className="fas fa-layer-group text-text-muted"></i> Usage Slabs
                            </h4>
                            {isEditMode && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddSlab}
                                    className="h-7 text-xs border-ash-medium"
                                    // leftIcon="fas fa-plus"
                                >
                                    Add Slab
                                </Button>
                            )}
                        </div>

                        {slabs.length === 0 ? (
                            <div className="text-center py-6 text-sm text-text-muted bg-brand-surface border border-ash-medium border-dashed rounded-lg">
                                No slabs configured. Add a slab to define consumption rates.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {slabs.map((slab, index) => (
                                    <div key={index} className="relative bg-brand-surface border border-ash-medium rounded-lg p-3 sm:p-4 group">

                                        {/* Slab Header/Number */}
                                        <div className="absolute -top-2.5 left-3 bg-surface border border-ash-medium px-2 py-0.5 rounded text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                            Slab {index + 1}
                                        </div>

                                        {/* Remove Button (Edit Mode Only) */}
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSlab(index)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-brand-surface border border-ash-medium rounded-full text-danger hover:bg-danger/10 flex items-center justify-center transition-colors shadow-sm z-10"
                                                title="Remove Slab"
                                            >
                                                <i className="fas fa-times text-xs"></i>
                                            </button>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                                            <InfoField label="Up To (kW)" isEdit={isEditMode}>
                                                {isEditMode ? (
                                                    <Input
                                                        type="number"
                                                        value={String(slab.upto)}
                                                        onChange={(e) => handleSlabChange(index, 'upto', e.target.value)}
                                                        required
                                                    />
                                                ) : (
                                                    <p className="font-mono text-[13px] text-text-strong">
                                                        {index === 0 ? `0 - ${slab.upto}` : `${Number(slabs[index - 1].upto) + 1} - ${slab.upto}`} kW
                                                    </p>
                                                )}
                                            </InfoField>

                                            <InfoField label="Rate per Unit (₹)" isEdit={isEditMode}>
                                                {isEditMode ? (
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        value={String(slab.ratePerUnit)}
                                                        onChange={(e) => handleSlabChange(index, 'ratePerUnit', e.target.value)}
                                                        required
                                                    />
                                                ) : (
                                                    <p className="font-mono text-[13px] text-primary font-bold">₹{slab.ratePerUnit}</p>
                                                )}
                                            </InfoField>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="mt-auto pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-ash-medium shrink-0 bg-brand-surface">
                    <Button type="button" variant="outline" onClick={isEditMode && tariffData ? handleCancel : onClose} className="w-full sm:w-auto">
                        {isEditMode && tariffData ? 'Cancel Edit' : 'Close'}
                    </Button>

                    {isEditMode && (
                        <Button
                            type="submit"
                            variant="dark"
                            isLoading={isPending}
                            className="w-full sm:w-auto"
                        >
                            {tariffData ? 'Save Changes' : 'Create Tariff'}
                        </Button>
                    )}
                </div>
            </form>
        </SidePanel>
    );
}

// Small UI Helper for Grid Alignment
const InfoField = ({ label, isEdit, children }: { label: string, isEdit: boolean, children: React.ReactNode }) => (
    <div className={`flex flex-col ${isEdit ? 'gap-1' : 'gap-1.5'}`}>
        <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">{label}</label>
        {children}
    </div>
);