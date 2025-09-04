import React from 'react'
import { Button } from '../../../components/ui/Button'
import type { IEmployee } from '../../../types/types'
import { useNavigate } from 'react-router-dom'


type GridCardProps = {
    employee: IEmployee,
    handleDeleteEmployee: any,
    deleteEmployeeMutation: any
}



const getOrganizationType = (org?: string) => {
    switch (org) {
        case 'organization_staff': return 'bg-blue-100 text-blue-800';
        case 'nonorganization_staff': return 'bg-gray-100 text-gray-800';
        //   case 'contract': return 'bg-orange-100 text-orange-800';
        //   case 'intern': return 'bg-pink-100 text-pink-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const EmployeeListView: React.FC<GridCardProps> = ({ employee, handleDeleteEmployee, deleteEmployeeMutation }) => {
    const navigate = useNavigate()


    const getEmployeeModel = (model: string | null)=> {
        switch (model) {
            case 'WorkerModel': return 'Worker';
            case 'CTOModel': return 'CTO';
            case 'UserModel': return 'Admin';
            //   case 'intern': return 'bg-pink-100 text-pink-800';
            default: return 'N/A';
        }
    }

    return (
        <>
            <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-center">
                    <div className="flex items-center">
                        {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {employee.personalInfo?.empName?.charAt(0)?.toUpperCase() || 'N'}
                                  </div> */}
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {employee.personalInfo?.empName || 'N/A'}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-center">
                    <div className="text-sm text-gray-900">
                        {employee.personalInfo?.email || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 ">
                        {employee.personalInfo?.phoneNo || 'N/A'}
                    </div>
                </td>
                <td className="px-6 py-4 text-center">
                    {/* <div className="text-sm text-gray-900">
                                  {employee.employment?.designation || 'N/A'}
                                </div> */}
                    <div className="text-sm text-gray-900">
                        {employee.employment?.department || employee?.employeeModel === "StaffModel" ? employee.employment?.department || 'N/A' : getEmployeeModel(employee?.employeeModel)}
                    </div>
                </td>
                <td className="px-6 py-4 text-center ">
                    <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrganizationType(employee.empRole)}`}>
                            {employee?.empRole
                                ? (employee.empRole === "organization_staff" ? "Organization Staff" : "Non-Organization Staff")
                                : 'N/A'}
                        </span>
                        {/* {employee.employment?.employmentType && (
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEmploymentTypeColor(employee.employment.employmentType)}`}>
                                      {employee.employment.employmentType.replace('_', ' ')}
                                    </span>
                                  )} */}
                    </div>
                </td>
                <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                        <Button
                            variant='secondary'
                            onClick={() => navigate(employee._id!)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                            <i className="fas fa-eye mr-1"></i>
                            View
                        </Button>
                        <Button
                            variant='danger'
                            onClick={() => handleDeleteEmployee(employee._id!)}
                            className="text-white  bg-red-600 font-medium text-sm"
                            disabled={deleteEmployeeMutation.isPending}
                        >
                            {deleteEmployeeMutation.isPending ? (
                                <i className="fas fa-spinner fa-spin mr-1"></i>
                            ) : (
                                <i className="fas fa-trash mr-1"></i>
                            )}
                            Delete
                        </Button>
                    </div>
                </td>
            </tr>
        </>
    )
}

export default EmployeeListView