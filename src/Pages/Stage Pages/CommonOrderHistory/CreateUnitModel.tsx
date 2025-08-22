// src/components/commonorder/UnitForm.tsx

import React, { useEffect, useState } from "react"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import {
    useCreateCommonUnit,
    useEditCommonUnit,
} from "../../../apiList/Stage Api/Common OrderMaterialHisotry APi/commonOrderHistoryMaterialApi"
import { toast } from "../../../utils/toast"
import { Label } from "../../../components/ui/Label"

export type UnitPayload = {
    unitName: string
    quantity: number
    singleUnitCost: number
    _id?: string
}

interface UnitFormProps {
    id: string
    mode: "create" | "edit"
    unitId?: string
    initialData?: UnitPayload | null
    onSuccess: () => void
    onCancel: () => void
}

const CreateUnitModel: React.FC<UnitFormProps> = ({
    id,
    unitId,
    initialData,
    onSuccess,
    onCancel,
    mode,
}) => {
    const [form, setForm] = useState<UnitPayload>({
        unitName: "",
        quantity: 1,
        singleUnitCost: 0,
    })

    const { mutateAsync: createUnit, isPending: isCreating } = useCreateCommonUnit()
    const { mutateAsync: editUnit, isPending: isEditing } = useEditCommonUnit()

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setForm({
                unitName: initialData.unitName,
                singleUnitCost: initialData.singleUnitCost,
                quantity: initialData.quantity
            })
        }
    }, [mode, initialData])

    const handleSubmit = async () => {
        try {
            if (!form.unitName.trim()) {
                toast({ title: "Error", description: "Please Enter the UnitName", variant: "destructive" })
            }

            if (mode === "create") {
                
                await createUnit({ id: id, payload: form })
                setForm({
                    unitName: "",
                    singleUnitCost: 0,
                    quantity: 0
                })
                toast({ title: "Success", description: "Item Created Successfully" });

            } else {
                if(initialData?.unitName !== form.unitName || initialData.quantity !== form.quantity || initialData.singleUnitCost !== form.singleUnitCost ){
                    await editUnit({ id: id, unitId: unitId!, payload: form })
                    toast({ title: "Success", description: "Item Updated Successfully" });
                }
                onCancel()

            }

            onSuccess()
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white shadow-xl p-6 rounded-xl w-full max-w-md relative z-50">
                <h2 className="text-lg font-semibold mb-4">
                    {mode === "create" ? "Create Unit" : "Edit Unit"}
                </h2>

                <div className="space-y-3">
                    <Label>UnitName *</Label>
                    <Input
                        placeholder="Unit Name"
                        value={form.unitName}
                        onChange={(e) => setForm({ ...form, unitName: e.target.value })}
                        autoFocus
                    />
                    <Label>Quantity (optional)</Label>

                    <Input
                        type="number"
                        placeholder="Quantity"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                    />
                    <Label>Single Unit Cost (optional)</Label>
                    <Input
                        type="number"
                        placeholder="Single Unit Cost"
                        value={form.singleUnitCost}
                        onChange={(e) => setForm({ ...form, singleUnitCost: Number(e.target.value) })}
                    />

                    <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-200">
                        <Button
                            variant="primary"
                            isLoading={mode === "create" ? isCreating : isEditing}
                            onClick={handleSubmit}
                        >
                            {mode === "create" ? "Create" : "Update"}
                        </Button>
                        <Button variant="ghost" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUnitModel