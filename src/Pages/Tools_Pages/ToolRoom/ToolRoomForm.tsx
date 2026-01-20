import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Label } from '../../../components/ui/Label';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';
import SearchSelectNew from '../../../components/ui/SearchSelectNew';
// import { useGetAllUsers } from '../../../apiList/orgApi';
import { useGetAllUsers } from "../../../apiList/getAll Users Api/getAllUsersApi"

// import { useGetStaffForDropDown } from '../../../apiList/staffApi'; // Assuming this exists

export interface ToolRoomFormData {
    toolRoomName: string;
    location: string;
    inchargeUser: string;
    inchargeRole: string;
    allowedIssueFrom: string;
    allowedIssueTo: string;
    isActive: boolean;
}

interface ToolRoomFormProps {
    mode: 'create' | 'view' | 'edit';
    initialData?: any;
    organizationId: string;
    isSubmitting: boolean;
    onSubmit: (data: any) => Promise<void>;
    refetch?: () => void;
}

const ToolRoomForm: React.FC<ToolRoomFormProps> = ({
    mode: initialMode,
    initialData,
    organizationId,
    isSubmitting,
    onSubmit,
    // refetch
}) => {
    const navigate = useNavigate();
    const [currentMode, setCurrentMode] = useState(initialMode);
    // const { role, permission } = useAuthCheck();

    // const canEdit = role === "owner" || permission?.tools?.edit;


    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.toolhardware?.list;
    const canCreate = role === "owner" || permission?.toolhardware?.create;
    // const canDelete = role === "owner" || permission?.toolhardware?.delete;
    const canEdit = role === "owner" || permission?.toolhardware?.edit;


    const { data: staffList = [] } = useGetAllUsers(organizationId!, "staff");

    const staffOptions = (staffList || []).map((staff: any) => ({
        value: staff._id,
        label: staff.staffName,
        email: staff.email,
        role: staff.role // The backend needs this for 'inchargeRole'
    }));

    // 3. Single handler to update User ID and Role
    const handleInchargeChange = (selectedId: string | null) => {
        const selectedStaff = staffOptions.find((s: any) => s.value === selectedId);
        if (selectedStaff) {
            setFormData(prev => ({
                ...prev,
                inchargeUser: selectedStaff.value,
                inchargeRole: selectedStaff.role // Automatically syncs the role
            }));
        } else {
            setFormData(prev => ({ ...prev, inchargeUser: '', inchargeRole: '' }));
        }
    };


    // --- DROPDOWN DATA ---
    // const { data: staffData } = useGetStaffForDropDown(organizationId);
    // const inchargeOptions = ([])?.map((s: any) => ({ value: s._id, label: s.staffName }));

    // --- STATE ---
    const [formData, setFormData] = useState<ToolRoomFormData>({
        toolRoomName: '',
        location: '',
        inchargeUser: '',
        inchargeRole: 'staff',
        allowedIssueFrom: '09:00',
        allowedIssueTo: '18:00',
        isActive: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                toolRoomName: initialData.toolRoomName || '',
                location: initialData.location || '',
                inchargeUser: initialData.inchargeUser?._id || '',
                inchargeRole: initialData.inchargeRole || 'staff',
                allowedIssueFrom: initialData.allowedIssueFrom || '09:00',
                allowedIssueTo: initialData.allowedIssueTo || '18:00',
                isActive: initialData.isActive ?? true
            });
        }
    }, [initialData, currentMode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const isReadOnly = currentMode === 'view';
    const isCreateMode = currentMode === 'create';
    const isEditMode = currentMode === 'edit';
    const toggleEdit = () => setCurrentMode(p => p === 'view' ? 'edit' : 'view');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        if (currentMode === 'edit') setCurrentMode('view');
    };

    return (
        <div className="max-w-full min-h-[80vh] mx-auto space-y-4">
            <header className="sticky px-4 top-0 z-20 bg-white border-b border-gray-200 pb-4 pt-2 mb-6 flex justify-between items-center rounded-b-xl">
                <div className='flex items-center gap-3'>
                    <button type="button" onClick={() => navigate(-1)} className='bg-blue-50 hover:bg-blue-100 flex items-center justify-center w-9 h-9 border border-blue-200 text-blue-600 cursor-pointer rounded-lg'>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isCreateMode ? 'Add Tool Room' : isEditMode ? 'Update Room' : 'Room Overview'}
                        </h1>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Physical Storage Location</p>
                    </div>
                </div>

                <div className='flex gap-3'>
                    {(isReadOnly && canEdit) && (
                        <Button type="button" onClick={toggleEdit} variant="outline" className="border-blue-600 text-blue-600">
                            <i className="fas fa-edit mr-2"></i>Edit Room
                        </Button>
                    )}
                    {(isCreateMode || isEditMode) && (
                        <div className="flex gap-2">
                            <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 text-white">
                                {isSubmitting ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2"></i>}
                                {isCreateMode ? 'Create Room' : 'Save Changes'}
                            </Button>
                            <Button variant='outline' type="button" onClick={() => isCreateMode ? navigate(-1) : toggleEdit()} className="bg-white">Cancel</Button>
                        </div>
                    )}
                </div>
            </header>

            <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center">
                            <i className="fas fa-warehouse mr-2"></i> Room Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Tool Room Name</Label>
                                <input name="toolRoomName" value={formData.toolRoomName} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mt-1" placeholder="e.g., Central Site Store" />
                            </div>
                            <div>
                                <Label>Location / Landmark</Label>
                                <input name="location" value={formData.location} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mt-1" placeholder="e.g., Block A, Basement" />
                            </div>
                        </div>
                    </div>

                    {/* Operational Timings */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center">
                            <i className="fas fa-clock mr-2"></i> Issue & Return Timings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Allowed From</Label>
                                <input type="time" name="allowedIssueFrom" value={formData.allowedIssueFrom} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg mt-1" />
                            </div>
                            <div>
                                <Label>Allowed To</Label>
                                <input type="time" name="allowedIssueTo" value={formData.allowedIssueTo} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg mt-1" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center">
                            <i className="fas fa-user-shield mr-2"></i> Personnel In-Charge
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                    <i className="fas fa-user-check text-blue-600 text-xs"></i>
                                    Select Assigned In-Charge
                                </Label>
                                <SearchSelectNew
                                    options={staffOptions}
                                    placeholder="Choose staff member"
                                    searchPlaceholder="Search by name..."
                                    value={formData.inchargeUser}
                                    onValueChange={handleInchargeChange}
                                    enabled={isReadOnly && (canEdit || canCreate)}
                                    searchBy="name"
                                    displayFormat="detailed"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Active Status Toggle */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-bold">Operating Status</Label>
                                <p className="text-[10px] text-gray-500">Toggle off to temporarily close this room</p>
                            </div>
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-5 h-5 accent-blue-600 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ToolRoomForm;