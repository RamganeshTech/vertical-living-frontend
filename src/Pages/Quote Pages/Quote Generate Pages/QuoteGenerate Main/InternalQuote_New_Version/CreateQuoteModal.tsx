import React from 'react'
import { Button } from '../../../../../components/ui/Button'
import SearchSelectNew from '../../../../../components/ui/SearchSelectNew'
import { Label } from '../../../../../components/ui/Label'
import { Input } from '../../../../../components/ui/Input'



export interface QuoteFormData {
  mainQuoteName: string;
  quoteCategory: string | null;
  projectId: string | null;
}

interface CreateQuoteModalProps {
  // State and Data
//   isOpen: boolean;
  isEditing: boolean;
  formData: QuoteFormData;
  projectsData: Array<{ _id: string; projectName: string }>;
  
  // Actions
  setModalOpen: (open: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<QuoteFormData>>;
  handleSubmit: () => void;
}


const CreateQuoteModal: React.FC<CreateQuoteModalProps> = ({
    isEditing,
    formData,
    projectsData,
    setModalOpen,
    setFormData,
    handleSubmit
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <i className="fas fa-edit text-blue-600"></i>
                    {isEditing ? 'Update Quote Details' : 'Create New Quote'}
                </h2>

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
                            onValueChange={(val) => setFormData(p => ({ ...p, quoteCategory: val }))}
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
                    <Button className="flex-1 bg-blue-600" onClick={handleSubmit}>
                        {isEditing ? 'Update' : 'Generate Quote'}
                    </Button>
                </div>
            </div>
        </div>)
}

export default CreateQuoteModal