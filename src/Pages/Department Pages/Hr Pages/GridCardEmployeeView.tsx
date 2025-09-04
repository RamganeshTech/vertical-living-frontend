import React from 'react'
import type { IEmployee } from '../../../types/types'
import { useNavigate } from 'react-router-dom';

const getEmploymentTypeColor = (type?: string) => {
    switch (type) {
      case 'full_time': return 'bg-blue-100 text-blue-800';
      case 'part_time': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      case 'intern': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const formatSalary = (salary?: { total?: number }) => {
    if (!salary?.total) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(salary.total);
  };


  
type GridCardProps = {
    employee:IEmployee,
    getStatusColor:any,
    handleDeleteEmployee:any,
    deleteEmployeeMutation:any
}


  
const GridCardEmployeeView:React.FC<GridCardProps> = ({employee, getStatusColor, handleDeleteEmployee, deleteEmployeeMutation}) => {
    const navigate = useNavigate()
  return (
<div
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200 group"
                      >
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              {/* <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {employee.personalInfo?.empName?.charAt(0)?.toUpperCase() || 'N'}
                              </div> */}
                              <div className="ml-3">
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {employee.personalInfo?.empName || 'N/A'}
                                </h3>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                              {employee.status || 'N/A'}
                            </span>
                          </div>

                          {/* Employment Info */}
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center text-sm">
                              <i className="fas fa-briefcase text-gray-400 w-4"></i>
                              <span className="ml-2 text-gray-600">
                                {employee.employment?.designation || 'N/A'}
                              </span>
                            </div>

                            <div className="flex items-center text-sm">
                              <i className="fas fa-building text-gray-400 w-4"></i>
                              <span className="ml-2 text-gray-600">
                                {employee.employment?.department || 'N/A'}
                              </span>
                            </div>

                            <div className="flex items-center text-sm">
                              <i className="fas fa-envelope text-gray-400 w-4"></i>
                              <span className="ml-2 text-gray-600 truncate">
                                {employee.personalInfo?.email || 'N/A'}
                              </span>
                            </div>

                            <div className="flex items-center text-sm">
                              <i className="fas fa-phone text-gray-400 w-4"></i>
                              <span className="ml-2 text-gray-600">
                                {employee.personalInfo?.phoneNo || 'N/A'}
                              </span>
                            </div>
                          </div>

                          {/* Employment Type & Salary */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            {employee.employment?.employmentType && (
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEmploymentTypeColor(employee.employment.employmentType)}`}>
                                {employee.employment.employmentType.replace('_', ' ')}
                              </span>
                            )}

                            <div className="text-right">
                              <p className="text-xs text-gray-500">Salary</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatSalary(employee.employment?.salary)}
                              </p>
                            </div>
                          </div>

                          {/* Join Date */}
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Joined</span>
                              <span className="text-gray-900 font-medium">
                                {formatDate(employee.employment?.joinDate)}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                            <button
                              // onClick={() => handleEmployeeClick(employee)}
                              onClick={() => navigate(employee._id!)}
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              <i className="fas fa-eye mr-1"></i>
                              View Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEmployee(employee._id!);
                              }}
                              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                              disabled={deleteEmployeeMutation.isPending}
                            >
                              {deleteEmployeeMutation.isPending ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fas fa-trash"></i>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
  )
}

export default GridCardEmployeeView