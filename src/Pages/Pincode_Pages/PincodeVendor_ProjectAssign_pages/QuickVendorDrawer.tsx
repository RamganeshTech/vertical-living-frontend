import React, { useEffect, useState } from 'react';
import { toast } from '../../../utils/toast';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface QuickPartnerDrawerProps {
    isOpen: boolean;
    organizationId: string;
    onClose: () => void;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

const QuickPartnerDrawer: React.FC<QuickPartnerDrawerProps> = ({
    isOpen,
    organizationId,
    onClose,
    onSubmit,
    isLoading
}) => {
    // const [formData, setFormData] = useState({
    //     firstName: '',
    //     companyName: '',
    //     shopDisplayName: '',
    //     email: '',
    //     phoneMobile: '',      // Already there
    //     phoneWork: '',        // New
    //     phoneWhatsApp: '',    // New
    //     PartnerCategory: '',
    //     address: ''
    // });


    const initialFormState = {
        firstName: '',
        companyName: '',
        email: '',
        phoneMobile: '',
        phoneWork: '',
        phoneWhatsApp: '',
        category: '',
        address: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // Handle Escape Key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validation for Work Phone (ONLY if provided)
        const workPhone = formData.phoneWork.trim();
        if (workPhone !== '') {
            if (workPhone.length < 10 || workPhone.length > 11) {
                toast({
                    title: "Error",
                    description: "Work phone must be 10 or 11 digits.",
                    variant: "destructive"
                });
                return;
            }
        }

        // 2. Validation for Mobile (ONLY if provided)
        const mobilePhone = formData.phoneMobile.trim();
        if (mobilePhone !== '') {
            if (mobilePhone.length !== 10) {
                toast({
                    title: "Invalid Mobile",
                    description: "Mobile number must be exactly 10 digits.",
                    variant: "destructive"
                });
                return;
            }
        }

        // 3. Validation for WhatsApp (ONLY if provided)
        const whatsappPhone = formData.phoneWhatsApp.trim();
        if (whatsappPhone !== '') {
            if (whatsappPhone.length !== 10) {
                toast({
                    title: "Invalid WhatsApp",
                    description: "WhatsApp number must be exactly 10 digits.",
                    variant: "destructive"
                });
                return;
            }
        }
        onSubmit({
            ...formData,
            organizationId,
            phone: {
                mobile: formData.phoneMobile,
                work: formData.phoneWork,
                whatsappNumber: formData.phoneWhatsApp
            }
        });

        // 2. Reset the form fields to empty strings
        setFormData(initialFormState);


    };


    return (
        // <div className="fixed inset-0 z-[100] flex justify-end">
        <div
            className={`fixed inset-0 z-[100] flex justify-end transition-all duration-300 ${isOpen ? "visible" : "invisible"
                }`}
        >
            {/* 1. Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            />

            {/* 2. Drawer Panel */}
            <div
                className={`relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <header className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white relative">
                    {/* Subtle Left Accent Line */}
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-r-full" />

                    <div className="flex items-center gap-4">
                        {/* Icon representation */}
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                            <i className="fas fa-shop text-sm"></i>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 leading-none">
                                Quick Add Partner
                            </h2>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                    CRM
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                    New Partner Entry
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="group p-2.5 hover:bg-red-50 rounded-lg transition-all duration-200 border border-transparent hover:border-red-100"
                        title="Close (Esc)"
                    >
                        <i className="fas fa-times text-slate-400 group-hover:text-red-500 text-lg transition-colors"></i>
                    </button>
                </header>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div className="grid grid-cols-1 gap-6">

                        {/* Field: First Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                            <Input
                                type="text"
                                required
                                className="w-full !p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="e.g. Rahul"
                            />
                        </div>

                        {/* Field: Company Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                            <Input
                                type="text"
                                className="w-full !p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                placeholder="e.g. Apex Hardware"
                            />
                        </div>

                        {/* Field: Display Name */}
                        {/* <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                            <Input
                                type="text"
                                // className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50"
                                className="w-full !p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"

                                value={formData.shopDisplayName}
                                onChange={(e) => setFormData({ ...formData, shopDisplayName: e.target.value })}
                                placeholder="Name shown in invoices..."
                            />
                        </div> */}

                        {/* Field: Phone & Email */}
                        {/* Contact Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Mobile Number */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <i className="fas fa-mobile-alt mr-2 text-blue-500"></i>Mobile
                                </label>
                                <Input
                                    type="tel"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.phoneMobile}
                                    minLength={10}
                                    maxLength={10}
                                    onChange={(e) => setFormData({ ...formData, phoneMobile: e.target.value })}
                                    placeholder="Primary mobile"
                                />
                            </div>

                            {/* WhatsApp Number */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <i className="fab fa-whatsapp mr-2 text-green-500"></i>WhatsApp
                                </label>
                                <Input
                                    type="tel"
                                    className="w-full !p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                                    minLength={10}
                                    maxLength={10}
                                    value={formData.phoneWhatsApp}
                                    onChange={(e) => setFormData({ ...formData, phoneWhatsApp: e.target.value })}
                                    placeholder="enter whatsapp number"
                                />
                            </div>

                            {/* Work/Landline */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <i className="fas fa-phone mr-2 text-gray-500"></i>Work Phone
                                </label>
                                <Input
                                    type="tel"
                                    className="w-full !p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    /* Remove strict min/max 10 to allow landlines with STD codes */
                                    value={formData.phoneWork}
                                    onChange={(e) => {
                                        // Only allow numbers to be typed
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 11) { // 11 digits cover most STD + Landline combos
                                            setFormData({ ...formData, phoneWork: val });
                                        }
                                    }}
                                    placeholder="10-digit mobile or Landline with STD"
                                />
                                <p className="text-[10px] text-gray-400 mt-1 ">Enter 10 to 11 digits (e.g., 04523456789, 9876543210)</p>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full !p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Field: Full Address */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                            <textarea
                                rows={3}
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Detailed address in Chennai..."
                            />
                        </div>
                    </div>
                </form>

                {/* Action Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
                    <Button
                        variant='secondary'
                        type="button"
                        onClick={onClose}
                        // className="flex-1 px-6 py-3 rounded-lg font-bold text-gray-500 hover:bg-gray-200 transition-all"
                        className='w-full  py-3'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        // className="flex-[1] bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                        className='w-full py-3'

                    >
                        Create Partner
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QuickPartnerDrawer;