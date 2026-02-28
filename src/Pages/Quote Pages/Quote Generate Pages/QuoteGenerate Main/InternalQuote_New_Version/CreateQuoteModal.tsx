import React from 'react'
import { Button } from '../../../../../components/ui/Button'
import SearchSelectNew from '../../../../../components/ui/SearchSelectNew'
import { Label } from '../../../../../components/ui/Label'
import { Input } from '../../../../../components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/Select'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/Select";


export interface QuoteFormData {
    mainQuoteName: string;
    quoteType: string;
    quoteCategory: string;
    projectId: string | null;
}

interface CreateQuoteModalProps {
    // State and Data
    //   isOpen: boolean;
    isEditing?: boolean;
    formData: QuoteFormData;
    projectsData: Array<{ _id: string; projectName: string }>;

    // Actions
    setModalOpen: (open: boolean) => void;
    setFormData: React.Dispatch<React.SetStateAction<QuoteFormData>>;
    handleSubmit: () => void;
    isSubmitting?: boolean
}

export const QUOTE_TYPE = ["basic", "advanced", "sqft_rate"]
const CreateQuoteModal: React.FC<CreateQuoteModalProps> = ({
    isEditing,
    isSubmitting,
    formData,
    projectsData,
    setModalOpen,
    setFormData,
    handleSubmit
}) => {

    // 1. Create a specific handler to prevent accidental closures
    // const onInternalClick = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     console.log("Internal content clicked - Modal stays open");
    // };


    return (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div

                className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <header className='flex  justify-between items-center'>

                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <i className="fas fa-edit text-blue-600"></i>
                        {isEditing ? 'Update Quote Details' : 'Create New Quote'}
                    </h2>

                    {!isEditing && <div className='w-30'>
                        <Select onValueChange={(val: any) => {
                            setFormData(p => ({ ...p, quoteType: val }))
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue className='text-md' placeholder="Select Template Type" selectedValue={
                                    formData.quoteType === "sqft_rate" ?
                                        "Sqft Rate"
                                        :
                                        formData?.quoteType[0].toUpperCase() + formData.quoteType.slice(1)

                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {QUOTE_TYPE?.map((option) => (
                                    <SelectItem className='text-md' key={option} value={option.toString()}>
                                        {option === "sqft_rate" ? "Sqft Rate" :
                                            option[0].toUpperCase() + option.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>}
                </header>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Quote Name</label>
                        <Input
                            className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.mainQuoteName}
                            onChange={(e) => setFormData({ ...formData, mainQuoteName: e.target.value })}
                            placeholder="e.g. Phase 1 Glasswork"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                        {/* <select
                                    className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.quoteCategory}
                                    onChange={(e) => setFormData({ ...formData, quoteCategory: e.target.value })}
                                >
                                    <option value="commercial">Commercial</option>
                                    <option value="residential">Residential</option>
                                </select> */}

                        <SearchSelectNew
                            options={["commercial", "residential"].map((p: string) => ({ value: p, label: p }))}
                            placeholder="Select Quote Type..."
                            value={formData.quoteCategory || ""}
                            onValueChange={(val) => setFormData((p: any) => ({ ...p, quoteCategory: val }))}
                        />
                    </div>

                    {/* <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Select Project</label>
                                <SearchSelectNew 
                                    onValueChange={(val) => setFormData({...formData, projectId: val})}
                                    // Pass project list from your query here
                                />
                            </div> */}

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black text-gray-400">Project</Label>
                        <SearchSelectNew
                            options={projectsData.map((p: any) => ({ value: p._id, label: p.projectName }))}
                            placeholder="Select Project..."
                            value={formData.projectId || ""}
                            onValueChange={(val) => setFormData(p => ({ ...p, projectId: val }))}
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button type="button"
                        isLoading={isSubmitting}
                        className="flex-1 bg-blue-600"
                        onClick={() => {
                            // e.preventDefault();
                            // e.stopPropagation()
                            console.log("Submit button triggered inside Modal");
                            handleSubmit()
                        }}
                    >
                        {isEditing ? 'Update' : 'Generate Quote'}
                    </Button>
                </div>
            </div>
        </div >)
}

export default CreateQuoteModal