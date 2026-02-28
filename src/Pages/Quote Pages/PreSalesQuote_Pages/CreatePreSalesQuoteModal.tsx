import React from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
// import { Button } from '../../../../../components/ui/Button';
// import { Input } from '../../../../../components/ui/Input';

interface CreatePreSalesQuoteModalProps {
    formData: { mainQuoteName: string };
    setModalOpen: (open: boolean) => void;
    setFormData: React.Dispatch<React.SetStateAction<{ mainQuoteName: string }>>;
    handleSubmit: () => void;
    isEditing: boolean
    isSubmitting?: boolean;
}

const CreatePreSalesQuoteModal: React.FC<CreatePreSalesQuoteModalProps> = ({
    isSubmitting,
    formData,
    setModalOpen,
    isEditing,
    setFormData,
    handleSubmit
}) => {
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                <header className='flex justify-between items-center mb-6'>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                        <i className="fas fa-file-signature text-blue-600"></i>
                        {isEditing && "Update"} Pre Sales Quote
                    </h2>
                </header>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                            Quote Name
                        </label>
                        <Input
                            autoFocus
                            className="w-full p-4 bg-slate-50 border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                            value={formData.mainQuoteName}
                            onChange={(e: any) => setFormData({ ...formData, mainQuoteName: e.target.value })}
                            placeholder="e.g. Apartment 402 Pre Sales Quote"
                            onKeyDown={(e: any) => {
                                if (e.key === 'Enter' && formData.mainQuoteName) handleSubmit();
                            }}
                        />
                        {/* <p className="mt-2 text-[10px] text-slate-400 italic">
                            * This name helps you identify the quote in your records.
                        </p> */}
                    </div>
                </div>

                <div className="flex gap-3 mt-10">
                    <Button
                        variant="outline"
                        className="flex-1 rounded-xl h-12"
                        onClick={() => setModalOpen(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        isLoading={isSubmitting}
                        disabled={!formData.mainQuoteName || isSubmitting}
                        className="flex-1 bg-blue-600 rounded-xl h-12 shadow-lg shadow-blue-100"
                        onClick={handleSubmit}
                    >
                        Create & Configure
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreatePreSalesQuoteModal;