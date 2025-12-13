import React, { useState } from 'react'
import { useAddEmployeeByHR } from '../../../apiList/Department Api/HrApi/HrApi';
import { toast } from '../../../utils/toast';
import { roles } from '../../../constants/constants';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';

interface CreateNewEmployeeProps {
  organizationId: string;
  //   roles?: string[];
  onSuccess?: () => void;
}




interface IAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface IEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface ISalary {
  basic: number;
  hra: number;
  allowances: number;
  total: number;
}

interface IEmployment {
  joinDate: Date;
  designation: string;
  department: string;
  //   reportingTo: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  salary: ISalary;
  //   specificRole: string;
  workLocation: string;
}

interface IDocument {
  _id?: string;
  type: string;
  fileName: string;
  fileUrl: string;
  uploadedAt?: Date;
}

interface IPersonalInfo {
  empName: string;
  dateOfBirth: Date;
  email: string;
  phoneNo: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'unmarried' | 'married' | 'divorced' | 'widowed';
  address: IAddress;
  emergencyContact: IEmergencyContact;
}

interface IEmployee {
  _id?: string;
  organizationId: string;
  empId: string | null;
  employeeModel: string | null;
  empRole: 'organization_staff' | 'nonorganization_staff';
  personalInfo: IPersonalInfo;
  employment: IEmployment;
  documents: IDocument[];
  status: 'active' | 'inactive' | 'terminated' | 'on_leave';
}



const CreateNewEmployee: React.FC<CreateNewEmployeeProps> = ({
  organizationId,
  onSuccess
}) => {
  const newEmployeeByHR = useAddEmployeeByHR();


  const { role, permission } = useAuthCheck();


  const canCreate = role === "owner" || permission?.hr?.create;



  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'documents'>('personal');
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [localDocuments, setLocalDocuments] = useState<IDocument[]>([]);

  const [newEmployee, setNewEmployee] = useState<IEmployee>({
    organizationId: organizationId,
    empId: null,
    employeeModel: null,
    empRole: "organization_staff",
    personalInfo: {
      empName: "",
      dateOfBirth: new Date(),
      email: "",
      phoneNo: "",
      gender: "male",
      maritalStatus: "unmarried",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    },
    employment: {
      joinDate: new Date(),
      designation: "",
      department: "",
      //   reportingTo: "",
      employmentType: 'full_time',
      salary: {
        basic: 0,
        hra: 0,
        allowances: 0,
        total: 0,
      },
      //   specificRole: "",
      workLocation: "",
    },
    documents: [],
    status: "active",
  });


  const handleInputValidation = (employee: IEmployee) => {
    const errors: string[] = [];

    // Phone number: exactly 10 digits
    if (!/^\d{10}$/.test(employee.personalInfo.phoneNo)) {
      errors.push("Phone number must be exactly 10 digits.");
    }

    // Emergency contact phone
    if (employee.personalInfo.emergencyContact?.phone &&
      !/^\d{10}$/.test(employee.personalInfo.emergencyContact.phone)) {
      errors.push("Emergency contact phone must be exactly 10 digits.");
    }

    // Email validation
    if (employee.personalInfo.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.personalInfo.email)) {
      errors.push("Invalid email format.");
    }

    // Example: Name required
    if (!employee.personalInfo.empName.trim()) {
      errors.push("Employee name is required.");
    }


    if (!/^\d{6}$/.test(employee.personalInfo.address.pincode)) {
      errors.push("Pincode must be exactly 6 digits.");
    }

    return errors;

  }

  const handleInputChange = (section: string, field: string, value: any, nestedField?: string) => {
    setNewEmployee((prev: IEmployee) => {
      if (!prev) return prev;

      // Create a deep copy to avoid mutation issues
      const updated = JSON.parse(JSON.stringify(prev)) as IEmployee;

      if (nestedField) {
        // Handle nested fields with explicit type checking
        if (section === 'personalInfo') {
          // Ensure personalInfo is an object
          if (typeof updated.personalInfo !== 'object' || updated.personalInfo === null) {
            updated.personalInfo = {} as IPersonalInfo;
          }

          // Ensure the nested field exists
          if (!(nestedField in updated.personalInfo)) {
            (updated.personalInfo as any)[nestedField] = {};
          }

          // Update the nested field
          (updated.personalInfo as any)[nestedField][field] = value;
        }
        else if (section === 'employment') {
          // Ensure employment is an object
          if (typeof updated.employment !== 'object' || updated.employment === null) {
            updated.employment = {} as IEmployment;
          }

          // Ensure the nested field exists
          if (!(nestedField in updated.employment)) {
            (updated.employment as any)[nestedField] = {};
          }

          // Update the nested field
          (updated.employment as any)[nestedField][field] = value;

          // Auto-calculate total salary when salary components change
          if (nestedField === 'salary') {
            const basic = field === 'basic' ? value : updated.employment.salary?.basic || 0;
            const hra = field === 'hra' ? value : updated.employment.salary?.hra || 0;
            const allowances = field === 'allowances' ? value : updated.employment.salary?.allowances || 0;

            // Ensure salary object exists
            if (!updated.employment.salary) {
              updated.employment.salary = {} as ISalary;
            }

            updated.employment.salary.total = Number(basic) + Number(hra) + Number(allowances);
          }
        }
      } else {
        // Handle top-level fields with explicit type checking
        switch (section) {
          case 'empRole':
            updated.empRole = value as 'organization_staff' | 'nonorganization_staff';
            break;
          case 'status':
            updated.status = value as 'active' | 'inactive' | 'terminated' | 'on_leave';
            break;
          case 'personalInfo':
            // Ensure personalInfo is an object
            if (typeof updated.personalInfo !== 'object' || updated.personalInfo === null) {
              updated.personalInfo = {} as IPersonalInfo;
            }
            updated.personalInfo = {
              ...updated.personalInfo,
              [field]: value
            };
            break;
          case 'employment':
            // Ensure employment is an object
            if (typeof updated.employment !== 'object' || updated.employment === null) {
              updated.employment = {} as IEmployment;
            }
            updated.employment = {
              ...updated.employment,
              [field]: value
            };
            break;
          default:
            // Handle any other sections if needed
            break;
        }
      }

      return updated;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(docType);

    // Create a preview URL for the uploaded file
    const fileUrl = URL.createObjectURL(file);

    const newDocument: IDocument = {
      type: docType,
      fileName: file.name,
      fileUrl: fileUrl,
      uploadedAt: new Date()
    };

    // Add to local documents state for preview
    setLocalDocuments(prev => [...prev, newDocument]);

    setTimeout(() => {
      setUploadingDoc(null);
      e.target.value = ''; // Reset the file input
    }, 1000);
  };

  const handleDeleteLocalDocument = (index: number) => {
    setLocalDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveEmployee = async () => {
    try {


      const errors = handleInputValidation(newEmployee);
      if (errors.length > 0) {
        errors.forEach(err => {
          toast({
            title: "Validation Error",
            description: err,
            variant: "destructive"
          });
        });
        return; // stop save
      }

      const formData = new FormData();

      // Add employee data as JSON string
      const employeeData = {
        ...newEmployee,
        documents: [] // We'll handle documents as files
      };
      formData.append('employeeData', JSON.stringify(employeeData));

      // Add files to FormData
      // Wait for all files to be processed
      await Promise.all(
        localDocuments.map(async (doc) => {
          const response = await fetch(doc.fileUrl);
          const blob = await response.blob();
          const file = new File([blob], doc.fileName, { type: blob.type });
          formData.append(doc.type, file);
        })
      );
      // Send the request
      await newEmployeeByHR.mutateAsync({
        formData: formData
      });


      toast({
        title: "Success",
        description: "Employee created successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create employee",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: Date | undefined | null): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN');
  };

  const formatSalary = (salary: ISalary | undefined): string => {
    if (!salary || salary.total === 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(salary.total);
  };


  if(!canCreate){
    return 
  }

  return (
    <div className='max-h-full overflow-y-auto bg-gray-50'>
      <div className="bg-white rounded-xl shadow-xl w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div
              onClick={onSuccess}
              className='bg-slate-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2'
            >
              <i className='fas fa-arrow-left'></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 ml-3">
              Create New Employee
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveEmployee}
              disabled={newEmployeeByHR.isPending}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {newEmployeeByHR.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Create Employee
                </>
              )}
            </button>

            <button
              onClick={onSuccess}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <i className="fas fa-times mr-2"></i>
              Cancel
            </button>
          </div>
        </div>

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
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newEmployee.personalInfo.empName}
                      onChange={(e) => handleInputChange('personalInfo', 'empName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newEmployee.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={newEmployee.personalInfo.phoneNo}
                      onChange={(e) => handleInputChange('personalInfo', 'phoneNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={newEmployee.personalInfo.gender}
                      onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={newEmployee?.personalInfo?.dateOfBirth ? new Date(newEmployee.personalInfo.dateOfBirth).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marital Status
                    </label>
                    <select
                      value={newEmployee?.personalInfo?.maritalStatus}
                      onChange={(e) => handleInputChange('personalInfo', 'maritalStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="unmarried">UnMarried</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
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
                      <input
                        type="text"
                        value={newEmployee?.personalInfo?.address?.street}
                        onChange={(e) => handleInputChange('personalInfo', 'street', e.target.value, 'address')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={newEmployee.personalInfo?.address?.city}
                          onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value, 'address')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={newEmployee.personalInfo?.address?.state}
                          onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value, 'address')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={newEmployee.personalInfo?.address?.pincode}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) {
                              handleInputChange('personalInfo', 'pincode', e.target.value, 'address')
                            }
                          }
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={newEmployee.personalInfo?.address?.country}
                          onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value, 'address')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
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
                      <input
                        type="text"
                        value={newEmployee?.personalInfo?.emergencyContact?.name}
                        onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value, 'emergencyContact')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={newEmployee.personalInfo?.emergencyContact?.relationship}
                        onChange={(e) => handleInputChange('personalInfo', 'relationship', e.target.value, 'emergencyContact')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={newEmployee.personalInfo?.emergencyContact?.phone}
                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value, 'emergencyContact')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
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
                      Designation *
                    </label>
                    <input
                      type="text"
                      value={newEmployee.employment?.designation}
                      onChange={(e) => handleInputChange('employment', 'designation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={newEmployee.employment?.department}
                      onChange={(e) => handleInputChange('employment', 'department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Department</option>
                      {roles?.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Type
                    </label>
                    <select
                      value={newEmployee.employment?.employmentType}
                      onChange={(e) => handleInputChange('employment', 'employmentType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="intern">Intern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Join Date
                    </label>
                    <input
                      type="date"
                      value={newEmployee.employment.joinDate ? new Date(newEmployee.employment.joinDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange('employment', 'joinDate', new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Location
                    </label>
                    <input
                      type="text"
                      value={newEmployee.employment?.workLocation}
                      onChange={(e) => handleInputChange('employment', 'workLocation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reporting To
                    </label>
                    <input
                      type="text"
                      value={newEmployee.employment?.reportingTo}
                      onChange={(e) => handleInputChange('employment', 'reportingTo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Status
                    </label>
                    <select
                      value={newEmployee.status}
                      onChange={(e) => handleInputChange('status', '', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="terminated">Terminated</option>
                      <option value="on_leave">On Leave</option>
                    </select>
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
                    <input
                      type="number"
                      value={newEmployee.employment?.salary?.basic}
                      onChange={(e) => handleInputChange('employment', 'basic', parseFloat(e.target.value) || 0, 'salary')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      HRA
                    </label>
                    <input
                      type="number"
                      value={newEmployee.employment?.salary?.hra}
                      onChange={(e) => handleInputChange('employment', 'hra', parseFloat(e.target.value) || 0, 'salary')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allowances
                    </label>
                    <input
                      type="number"
                      value={newEmployee.employment?.salary?.allowances}
                      onChange={(e) => handleInputChange('employment', 'allowances', parseFloat(e.target.value) || 0, 'salary')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Salary
                    </label>
                    <p className="text-xl font-bold text-green-600 py-2">
                      {formatSalary(newEmployee.employment?.salary)}
                    </p>
                  </div>

                  {/* Employee Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Role
                    </label>
                    <select
                      value={newEmployee.empRole}
                      onChange={(e) => handleInputChange('empRole', '', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="organization_staff">Organization Staff</option>
                      <option value="nonorganization_staff">Non-Organization Staff</option>
                    </select>
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
                  Total Documents: {localDocuments.length}
                </p>
              </div>

              {/* Document Upload Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Upload Documents</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {['resume', 'aadhar', 'pan', 'passport', 'education', 'experience'].map((docType) => (
                    <div key={docType} className="text-center">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,"
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
                {localDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {localDocuments.map((doc, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                            onClick={() => handleDeleteLocalDocument(index)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1"
                            title="Delete document"
                          >
                            <i className="fas fa-trash text-sm"></i>
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
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Documents Uploaded</h4>
                    <p className="text-gray-600">Upload documents using the section above.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Save Button */}
        {/* <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onSuccess}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEmployee}
              disabled={newEmployeeByHR.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {newEmployeeByHR.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Create Employee
                </>
              )}
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};


export default CreateNewEmployee