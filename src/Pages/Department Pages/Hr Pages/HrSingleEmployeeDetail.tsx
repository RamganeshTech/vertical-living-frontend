import React, { useState } from 'react'
import type { IDocument, IEmployee } from '../../../types/types';
import {  useDeleteEmployeeDocument, useGetSingleEmployee, useUpdateEmployee, useUploadEmployeeDocument } from '../../../apiList/Department Api/HrApi/HrApi';
import { useNavigate, useParams } from 'react-router-dom';
import MaterialOverviewLoading from '../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import { toast } from '../../../utils/toast';
import { roles } from '../../../constants/constants';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';

const HrSingleEmployeeDetail = () => {


    // const {organizationId} = useParams() as {organizationId:string}
    const { id } = useParams()
    const navigate = useNavigate()


    const { role, permission } = useAuthCheck();


    const canList = role === "owner" || permission?.hr?.list;
    const canEdit = role === "owner" || permission?.hr?.edit;


    const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
    const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'documents'>('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<IEmployee | null>(null);
    const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);


    const {
        data: singleEmployeeData,
        isLoading: isLoadingSingleEmployee
    } = useGetSingleEmployee(id!);


    //   const newEmployeeByHR = useAddEmployeeByHR()
    const updateEmployeeMutation = useUpdateEmployee();
    // const deleteEmployeeMutation = useDeleteEmployee();
    const uploadDocumentMutation = useUploadEmployeeDocument();
    const deleteDocumentMutation = useDeleteEmployeeDocument();


    const handleEmployeeClick = () => {
        setSelectedEmployee(singleEmployeeData);
        setEditData(singleEmployeeData);
        setIsEditing(true);
        setActiveTab('personal');
    };

    const handleSaveEmployee = async () => {
        try {
            if (!editData || !selectedEmployee) return;

            await updateEmployeeMutation.mutateAsync({
                empId: selectedEmployee._id!,
                updates: editData
            });
            setIsEditing(false);
            setSelectedEmployee(editData);
            toast({ title: "Success", description: "Employee updated successfully" })
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "Failed to update employee", variant: "destructive" })
        }
    };


    // const handleDeleteEmployee = async (empId: string) => {
    //     if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
    //         return;
    //     }

    //     try {
    //         await deleteEmployeeMutation.mutateAsync({ empId });
    //         //   setIsModalOpen(false);
    //         setSelectedEmployee(null);
    //         toast({ title: "Success", description: "Employee deleted successfully" })
    //     } catch (error: any) {
    //         toast({ title: "Error", description: error?.response?.data?.message || "Failed to upload file", variant: "destructive" })
    //     }
    // };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = event.target.files?.[0];
        //   console.log("entering", file)
        if (!file) {
            toast({ title: "Error", description: "Pleae select the file to upload" })
            return;
        };
        setUploadingDoc(type);
        try {
            await uploadDocumentMutation.mutateAsync({
                empId: singleEmployeeData._id,
                type,
                file
            });
            toast({ title: "Success", description: "File Uploaded Successfully" })
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "Failed to upload file", variant: "destructive" })
        } finally {
            setUploadingDoc(null);
        }
    };

    const handleDeleteDocument = async (docId: string) => {
        // if (!singleEmployeeData || !window.confirm('Are you sure you want to delete this document?')) {
        //   return;
        // }

        try {
            await deleteDocumentMutation.mutateAsync({
                empId: singleEmployeeData._id,
                docId
            });
            toast({ title: "Success", description: "Document deleted successfully" })
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "Failed to delete document", variant: "destructive" })
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'terminated': return 'bg-red-100 text-red-800';
            case 'on_leave': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    //   const getEmploymentTypeColor = (type?: string) => {
    //     switch (type) {
    //       case 'full_time': return 'bg-blue-100 text-blue-800';
    //       case 'part_time': return 'bg-purple-100 text-purple-800';
    //       case 'contract': return 'bg-orange-100 text-orange-800';
    //       case 'intern': return 'bg-pink-100 text-pink-800';
    //       default: return 'bg-gray-100 text-gray-800';
    //     }
    //   };

    const formatDate = (date?: Date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    };

    //   const formatSalary = (salary?: { total?: number }) => {
    //     if (!salary?.total) return 'N/A';
    //     return new Intl.NumberFormat('en-IN', {
    //       style: 'currency',
    //       currency: 'INR',
    //       maximumFractionDigits: 0
    //     }).format(salary.total);
    //   };



    if (isLoadingSingleEmployee) {
        return <MaterialOverviewLoading />
    }

    // console.log("data", singleEmployeeData)
    // Use single employee data if available, otherwise use selected employee
    const currentEmployee = singleEmployeeData;

    if (!canList) {
        return
    }

    return (
        <div className='max-h-full overflow-y-auto bg-gray-50'>
            {/* <div className="flex items-center justify-center p-4 z-50"> */}
            {/* <div className='w-fit flex gap-2 items-center'>
            <p onClick={()=> navigate(-1)} className='bg-slate-50 hover:bg-slate-300 cursor-pointer rounded-2xl px-2'><i className='fas fa-arrow-left'></i> back</p>
            <h2 className='text-2xl  text-shadow-black font-semibold'>Employee Detail</h2>
        </div> */}
            <div className="bg-white rounded-xl shadow-xl w-full">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center">
                        {/* <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {currentEmployee.personalInfo?.empName?.charAt(0)?.toUpperCase() || 'N'}
                </div> */}
                        <div className='flex gap-2 items-center'>
                            <div onClick={() => navigate(-1)}
                                className='bg-slate-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                                <i className='fas fa-arrow-left'></i></div>
                            <h2 className="text-lg font-normal  text-gray-600">

                                <span className='text-xl font-semibold text-gray-800'>{currentEmployee.personalInfo?.empName || 'N/A'}</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                       {
                       canEdit && <>
                       {!isEditing ? (
                            <button
                                onClick={() => handleEmployeeClick()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <i className="fas fa-edit mr-2"></i>
                                Edit Employee
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveEmployee}
                                    disabled={updateEmployeeMutation.isPending}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                                >
                                    {updateEmployeeMutation.isPending ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save mr-2"></i>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditData(currentEmployee);
                                    }}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </button>
                            </div>
                        )}
                        </>
                        }

                        {/* <button
                            onClick={() => handleDeleteEmployee(currentEmployee._id)}
                            disabled={deleteEmployeeMutation.isPending}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                            {deleteEmployeeMutation.isPending ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-trash mr-2"></i>
                                    Delete
                                </>
                            )}
                        </button> */}


                    </div>
                </div>

                {/* Loading State for Single Employee */}
                {isLoadingSingleEmployee && (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading employee details...</p>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: 'personal', label: 'Personal Info', icon: 'fas fa-user' },
                            { id: 'employment', label: 'Employment', icon: 'fas fa-briefcase' },
                            { id: 'documents', label: 'Documents', icon: 'fas fa-file-alt' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <i className={`${tab.icon} mr-2`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(95vh-150px)] custom-scrollbar">
                    {/* Personal Information Tab */}
                    {activeTab === 'personal' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                        Basic Information
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData?.personalInfo?.empName || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    personalInfo: { ...prev.personalInfo, empName: e.target.value }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.empName || 'N/A'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editData?.personalInfo?.email || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    personalInfo: { ...prev.personalInfo, email: e.target.value }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.email || 'N/A'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editData?.personalInfo?.phoneNo || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    personalInfo: { ...prev.personalInfo, phoneNo: e.target.value }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.phoneNo || 'N/A'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gender
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={editData?.personalInfo?.gender || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    personalInfo: { ...prev.personalInfo, gender: e.target.value as any }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.gender || 'N/A'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date of Birth
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={editData?.personalInfo?.dateOfBirth ? new Date(editData.personalInfo.dateOfBirth).toISOString().split('T')[0] : ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    personalInfo: { ...prev.personalInfo, dateOfBirth: new Date(e.target.value) }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{formatDate(currentEmployee.personalInfo?.dateOfBirth)}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Marital Status
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={editData?.personalInfo?.maritalStatus || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    personalInfo: { ...prev.personalInfo, maritalStatus: e.target.value as any }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select Status</option>
                                                <option value="unmarried">UnMarried</option>
                                                <option value="married">Married</option>
                                                <option value="divorced">Divorced</option>
                                                <option value="widowed">Widowed</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.maritalStatus || 'N/A'}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Address & Emergency Contact */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                        Address & Emergency Contact
                                    </h3>

                                    {/* Address */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-800">Address</h4>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Street
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editData?.personalInfo?.address?.street || ''}
                                                    onChange={(e) => setEditData(prev => prev ? {
                                                        ...prev,
                                                        personalInfo: {
                                                            ...prev.personalInfo,
                                                            address: { ...prev.personalInfo?.address, street: e.target.value }
                                                        }
                                                    } : null)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.address?.street || 'N/A'}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    City
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData?.personalInfo?.address?.city || ''}
                                                        onChange={(e) => setEditData(prev => prev ? {
                                                            ...prev,
                                                            personalInfo: {
                                                                ...prev.personalInfo,
                                                                address: { ...prev.personalInfo?.address, city: e.target.value }
                                                            }
                                                        } : null)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.address?.city || 'N/A'}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    State
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData?.personalInfo?.address?.state || ''}
                                                        onChange={(e) => setEditData(prev => prev ? {
                                                            ...prev,
                                                            personalInfo: {
                                                                ...prev.personalInfo,
                                                                address: { ...prev.personalInfo?.address, state: e.target.value }
                                                            }
                                                        } : null)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.address?.state || 'N/A'}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Pincode
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData?.personalInfo?.address?.pincode || ''}
                                                        onChange={(e) => setEditData(prev => prev ? {
                                                            ...prev,
                                                            personalInfo: {
                                                                ...prev.personalInfo,
                                                                address: { ...prev.personalInfo?.address, pincode: e.target.value }
                                                            }
                                                        } : null)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.address?.pincode || 'N/A'}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Country
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData?.personalInfo?.address?.country || ''}
                                                        onChange={(e) => setEditData(prev => prev ? {
                                                            ...prev,
                                                            personalInfo: {
                                                                ...prev.personalInfo,
                                                                address: { ...prev.personalInfo?.address, country: e.target.value }
                                                            }
                                                        } : null)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.address?.country || 'N/A'}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div className="space-y-3 pt-4">
                                        <h4 className="font-medium text-gray-800">Emergency Contact</h4>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Contact Name
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editData?.personalInfo?.emergencyContact?.name || ''}
                                                    onChange={(e) => setEditData(prev => prev ? {
                                                        ...prev,
                                                        personalInfo: {
                                                            ...prev.personalInfo,
                                                            emergencyContact: { ...prev.personalInfo?.emergencyContact, name: e.target.value }
                                                        }
                                                    } : null)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.emergencyContact?.name || 'N/A'}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Relationship
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editData?.personalInfo?.emergencyContact?.relationship || ''}
                                                    onChange={(e) => setEditData(prev => prev ? {
                                                        ...prev,
                                                        personalInfo: {
                                                            ...prev.personalInfo,
                                                            emergencyContact: { ...prev.personalInfo?.emergencyContact, relationship: e.target.value }
                                                        }
                                                    } : null)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.emergencyContact?.relationship || 'N/A'}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={editData?.personalInfo?.emergencyContact?.phone || ''}
                                                    onChange={(e) => setEditData(prev => prev ? {
                                                        ...prev,
                                                        personalInfo: {
                                                            ...prev.personalInfo,
                                                            emergencyContact: { ...prev.personalInfo?.emergencyContact, phone: e.target.value }
                                                        }
                                                    } : null)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="text-gray-900 py-2">{currentEmployee.personalInfo?.emergencyContact?.phone || 'N/A'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Employment Information Tab */}
                    {activeTab === 'employment' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Job Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                        Job Information
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Designation
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData?.employment?.designation || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    employment: { ...prev.employment, designation: e.target.value }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{currentEmployee.employment?.designation || 'N/A'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Department
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={editData?.employment?.department || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    employment: { ...prev.employment, department: e.target.value as any }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select Department</option>
                                                {roles?.map((role) => (
                                                    <option key={role} value={role}>
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-gray-900 py-2">{currentEmployee.employment?.department || 'N/A'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Employment Type
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={editData?.employment?.employmentType || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    employment: { ...prev.employment, employmentType: e.target.value as any }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="full_time">Full Time</option>
                                                <option value="part_time">Part Time</option>
                                                <option value="contract">Contract</option>
                                                <option value="intern">Intern</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900 py-2">{currentEmployee.employment?.employmentType?.replace('_', ' ') || 'N/A'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Join Date
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={editData?.employment?.joinDate ? new Date(editData.employment.joinDate).toISOString().split('T')[0] : ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    employment: { ...prev.employment, joinDate: new Date(e.target.value) }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{formatDate(currentEmployee.employment?.joinDate)}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Work Location
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData?.employment?.workLocation || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    employment: { ...prev.employment, workLocation: e.target.value }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{currentEmployee.employment?.workLocation || 'N/A'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Employee Status
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={editData?.status || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    status: e.target.value as any
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select Status</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="terminated">Terminated</option>
                                                <option value="on_leave">On Leave</option>
                                            </select>
                                        ) : (
                                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(currentEmployee.status)}`}>
                                                {currentEmployee.status || 'N/A'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Salary Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                        Salary Information
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Basic Salary
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editData?.employment?.salary?.basic || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    employment: {
                                                        ...prev.employment,
                                                        salary: {
                                                            ...prev.employment?.salary,
                                                            basic: parseFloat(e.target.value) || 0,
                                                            total: (parseFloat(e.target.value) || 0) + (prev.employment?.salary?.hra || 0) + (prev.employment?.salary?.allowances || 0)
                                                        }
                                                    }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">
                                                {currentEmployee.employment?.salary?.basic ?
                                                    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(currentEmployee.employment.salary.basic) :
                                                    'N/A'
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            HRA
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editData?.employment?.salary?.hra || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    employment: {
                                                        ...prev.employment,
                                                        salary: {
                                                            ...prev.employment?.salary,
                                                            hra: parseFloat(e.target.value) || 0,
                                                            total: (prev.employment?.salary?.basic || 0) + (parseFloat(e.target.value) || 0) + (prev.employment?.salary?.allowances || 0)
                                                        }
                                                    }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">
                                                {currentEmployee.employment?.salary?.hra ?
                                                    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(currentEmployee.employment.salary.hra) :
                                                    'N/A'
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Allowances
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editData?.employment?.salary?.allowances || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    employment: {
                                                        ...prev.employment,
                                                        salary: {
                                                            ...prev.employment?.salary,
                                                            allowances: parseFloat(e.target.value) || 0,
                                                            total: (prev.employment?.salary?.basic || 0) + (prev.employment?.salary?.hra || 0) + (parseFloat(e.target.value) || 0)
                                                        }
                                                    }
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">
                                                {currentEmployee.employment?.salary?.allowances ?
                                                    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(currentEmployee.employment.salary.allowances) :
                                                    'N/A'
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-gray-200">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Total Salary
                                        </label>
                                        <p className="text-xl font-bold text-green-600 py-2">
                                            {currentEmployee.employment?.salary?.total ?
                                                new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(currentEmployee.employment.salary.total) :
                                                'N/A'
                                            }


                                            {/* {formatSalary(currentEmployee.employment?.salary)} */}
                                        </p>
                                    </div>

                                    {/* Employee Role */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Employee Role
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={editData?.empRole || ''}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    empRole: e.target.value as any
                                                } : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select Role</option>
                                                <option value="organization_staff">Organization Staff</option>
                                                <option value="nonorganization_staff">Non-Organization Staff</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900 py-2">{currentEmployee.empRole?.replace('_', ' ') || 'N/A'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Employee Documents
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Total Documents: {currentEmployee.documents?.length || 0}
                                </p>
                            </div>

                            {/* Document Upload Section */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h4 className="text-md font-semibold text-gray-800 mb-4">Upload New Document</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {['resume', 'aadhar', 'pan', 'passport', 'education', 'experience'].map((docType) => (
                                        <div key={docType} className="text-center">
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    onChange={(e) => handleFileUpload(e, docType)}
                                                    className="hidden"
                                                    disabled={uploadingDoc === docType}
                                                />
                                                <div className={`p-4 border-2 border-dashed rounded-lg transition-colors ${uploadingDoc === docType
                                                    ? 'border-blue-300 bg-blue-50'
                                                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                                    }`}>
                                                    {uploadingDoc === docType ? (
                                                        <div className="text-center">
                                                            <i className="fas fa-spinner fa-spin text-blue-600 text-2xl mb-2"></i>
                                                            <p className="text-xs text-blue-600">Uploading...</p>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <i className="fas fa-upload text-gray-400 text-2xl mb-2"></i>
                                                            <p className="text-xs text-gray-600 capitalize">{docType}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Documents List */}
                            <div className="space-y-4">
                                {currentEmployee.documents && currentEmployee.documents.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {currentEmployee.documents.map((doc: IDocument) => (
                                            <div key={doc._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                                            <i className="fas fa-file-alt text-blue-600"></i>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-medium text-gray-900 capitalize">
                                                                {doc.type?.replace('_', ' ') || 'Document'}
                                                            </h5>
                                                            <p className="text-sm text-gray-500">
                                                                {doc.fileName || 'Unknown file'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteDocument(doc._id!)}
                                                        disabled={deleteDocumentMutation.isPending}
                                                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                                                        title="Delete document"
                                                    >
                                                        {deleteDocumentMutation.isPending ? (
                                                            <i className="fas fa-spinner fa-spin"></i>
                                                        ) : (
                                                            <i className="fas fa-trash text-sm"></i>
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <span>
                                                        Uploaded: {doc.uploadedAt ? formatDate(doc.uploadedAt) : 'N/A'}
                                                    </span>
                                                    {doc.fileUrl && (
                                                        <a
                                                            href={doc.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            <i className="fas fa-external-link-alt mr-1"></i>
                                                            View
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <i className="fas fa-file-alt text-gray-300 text-6xl mb-4"></i>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Documents Found</h4>
                                        <p className="text-gray-600">Upload documents using the section above.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                {isEditing && (
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditData(currentEmployee);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel Changes
                            </button>
                            <button
                                onClick={handleSaveEmployee}
                                disabled={updateEmployeeMutation.isPending}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {updateEmployeeMutation.isPending ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-2"></i>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* </div> */}

        </div>
    )
}

export default HrSingleEmployeeDetail