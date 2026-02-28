import React, { useEffect, useRef } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
// import { Input } from '../../../components/ui/Input';
// import { Button } from '../../../components/ui/Button';

interface ShopMaterialCategoryModalProps {
    formData: { categoryName: string };
    setModalOpen: (open: boolean) => void;
    setFormData: React.Dispatch<React.SetStateAction<{ categoryName: string }>>;
    handleSubmit: () => void;
    isSubmitting?: boolean;
    errorMessage?: string | null;
}

const ShopMaterialCategoryModal: React.FC<ShopMaterialCategoryModalProps> = ({
    isSubmitting,
    formData,
    setModalOpen,
    setFormData,
    handleSubmit,
    errorMessage
}) => {


    const modalRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setModalOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setModalOpen]);


    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
            ref={modalRef}
            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                <header className='flex justify-between items-center mb-6'>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                        <i className="fas fa-tags text-blue-600"></i>
                        Update Category Name
                    </h2>
                </header>

                <div className="space-y-6">
                    <div>
                        <label className="text-[12px] font-bold text-gray-600 uppercase mb-2 block">
                            Category Name
                        </label>
                        <Input
                            autoFocus
                            className="w-full p-4 bg-slate-50 border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                            value={formData.categoryName}
                            onChange={(e: any) => setFormData({ categoryName: e.target.value })}
                            placeholder="e.g. Plywood, Plumbing..."
                            onKeyDown={(e: any) => {
                                if (e.key === 'Enter' && formData.categoryName.trim()) handleSubmit();
                            }}
                        />
                        {/* Inline Error Message */}
                        {errorMessage && (
                            <p className="mt-2 text-[11px] text-red-500 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                                <i className="fas fa-circle-exclamation"></i>
                                {errorMessage}
                            </p>
                        )}
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
                        disabled={!formData.categoryName.trim() || isSubmitting}
                        className="flex-1 bg-blue-600 rounded-xl h-12 shadow-lg shadow-blue-100 text-white font-bold"
                        onClick={handleSubmit}
                    >
                        Update Category
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShopMaterialCategoryModal;