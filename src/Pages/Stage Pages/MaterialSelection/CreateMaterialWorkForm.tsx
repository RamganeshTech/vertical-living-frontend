import React, { useState } from "react";
import type { IMaterialSelectionWork } from "../../../types/types";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import {  useCreateModularWork } from './../../../apiList/Stage Api/materialSelectionApi';

interface CreateMaterialWorkForm {
    projectId: string
    roomId: string
}

const CreateMaterialWorkForm:React.FC<CreateMaterialWorkForm> = ({ projectId, roomId }) => {
    const { mutateAsync: createWork } = useCreateModularWork();

    const [newWork, setNewWork] = useState<IMaterialSelectionWork>({
        workName: "",
        notes: "",
        materials: []
    });
    const [materialInput, setMaterialInput] = React.useState("");


    const handleAddMaterial = (e: any) => {
        if (e.key === "Enter" && materialInput.trim()) {
            e.preventDefault();
            const trimmed = materialInput.trim();
            if (trimmed && !newWork.materials.includes(trimmed)) {
                setNewWork({ ...newWork, materials: [...newWork.materials, trimmed] });
            }
            setMaterialInput("");
        } else if (e.key === "Backspace" && !materialInput.trim()) {
            setNewWork(p => ({ ...p, materials: newWork.materials.slice(0, -1) }))
        }
    };

    // Handler to remove material
    const handleRemoveMaterial = (index: number) => {
        const updated = [...newWork.materials];
        updated.splice(index, 1);
        setNewWork({ ...newWork, materials: updated });
    };

    const handleCreate = async () => {
        if (!newWork.workName.trim()) return;
        await createWork({ projectId: projectId!, roomId: roomId!, body: newWork });
        setNewWork({ workName: "", notes: "", materials: [] });
    };

    return (
        <Card className="bg-blue-50">
            <CardContent className="space-y-4 py-6">
                <h2 className="text-lg font-semibold">Add Modular Work</h2>
                <Input
                    placeholder="Work Name"
                    value={newWork.workName}
                    onChange={(e) => setNewWork({ ...newWork, workName: e.target.value })}
                />
                <Input
                    placeholder="Notes"
                    value={newWork.notes}
                    onChange={(e) => setNewWork({ ...newWork, notes: e.target.value })}
                />

                <div
                    className="flex flex-wrap items-center gap-2 px-2 py-1 rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-400"
                    onClick={() => document.getElementById("material-input")?.focus()}
                >
                    {newWork.materials.map((mat, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                            <span>{mat}</span>
                            <button
                                onClick={() => handleRemoveMaterial(index)}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                                aria-label="Remove material"
                            >
                                x
                            </button>
                        </div>
                    ))}

                    {/* Invisible borderless inline input */}
                    <input
                        id="material-input"
                        type="text"
                        value={materialInput}
                        onChange={(e) => setMaterialInput(e.target.value)}
                        onKeyDown={(e) => handleAddMaterial(e)}
                        className="bg-transparent border-none outline-none text-sm py-1 px-2 flex-1 text-gray-800"
                        placeholder="Add material"
                    />
                </div>
                <Button onClick={handleCreate}>Add Work</Button>
            </CardContent>
        </Card>
    )
}

export default CreateMaterialWorkForm