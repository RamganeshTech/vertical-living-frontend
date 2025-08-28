import React, { useState, useMemo, useEffect } from 'react';

import { type EmployeeFilters, type IEmployee } from '../../../types/types';
import {
  useGetEmployeesInfinite,
  useDeleteEmployee,
} from '../../../apiList/Department Api/HrApi/HrApi';
import { Outlet, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import type { OrganizationOutletTypeProps } from '../../Organization/OrganizationChildren';
import { roles } from '../../../constants/constants';
import { toast } from '../../../utils/toast';
import { Button } from '../../../components/ui/Button';

const HRMainPage: React.FC = () => {
  const { openMobileSidebar, isMobile } = useOutletContext<OrganizationOutletTypeProps>()
  const { organizationId } = useParams() as { organizationId: string }
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, _setViewMode] = useState<'grid' | 'list'>('list');
  const navigate = useNavigate()


  // Hooks
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useGetEmployeesInfinite(organizationId, filters);

  const deleteEmployeeMutation = useDeleteEmployee();

  const allEmployees = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return allEmployees;
    return allEmployees.filter(employee =>
      employee.personalInfo?.empName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.personalInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.personalInfo?.phoneNo?.includes(searchTerm) ||
      employee.employment?.designation?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allEmployees, searchTerm]);

  // const handleEmployeeClick = (employee: IEmployee) => {
  //   setSelectedEmployee(employee);
  //   setEditData(employee);
  //   setIsModalOpen(true);
  //   setIsEditing(false);
  //   setActiveTab('personal');
  // };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };



  const handleDeleteEmployee = async (empId: string) => {
    if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteEmployeeMutation.mutateAsync({ empId });
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

  const handleFilterChange = (key: keyof EmployeeFilters, value: string) => {

    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };


  useEffect(() => {
    console.log("filter", filters)
  }, [filters])
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // Use single employee data if available, otherwise use selected employee

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Employees</h2>
          <p className="text-gray-600">Please wait while we fetch the employee data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-6xl mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Employees</h2>
          <p className="text-gray-600 mb-4">{error?.message}</p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-redo mr-2"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }


  const pathPart = location.pathname.split("/")
  const isChildRoute = pathPart[pathPart.length - 1] !== "hr"

  if (isChildRoute) {
    return <Outlet context={{ openMobileSidebar, isMobile }} />
  }



  return (
    <div className="min-h-full max-h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <i className="fas fa-users mr-3 text-blue-600"></i>
                Human Resources
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your organization's employees and their information
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search with Name or Email or Phno"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                />
              </div>

              {/* <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="xl:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <i className="fas fa-filter mr-2 text-blue-600"></i>
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear All ({activeFiltersCount})
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Employee Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Role
                  </label>
                  <select
                    value={filters.empRole || ''}
                    onChange={(e) => handleFilterChange('empRole', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Roles</option>
                    <option value="organization_staff">Organization Staff</option>
                    <option value="nonorganization_staff">Non-Organization Staff</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  {/* <input
                    type="text"
                    placeholder="Enter department"
                    value={filters.department || ''}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  /> */}


                  <select
                    value={filters?.department || ''}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Department</option>
                    {roles?.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Stats */}
                {/* <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Employees</span>
                      <span className="font-semibold text-gray-900">{allEmployees.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active</span>
                      <span className="font-semibold text-green-600">
                        {allEmployees.filter(emp => emp.status === 'active').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">On Leave</span>
                      <span className="font-semibold text-yellow-600">
                        {allEmployees.filter(emp => emp.status === 'on_leave').length}
                      </span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>



          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Cards */}


            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <i className="fas fa-users text-blue-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{allEmployees.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <i className="fas fa-user-check text-green-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {allEmployees.filter(emp => emp.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>

               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <i className="fas fa-user-clock text-yellow-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">On Leave</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {allEmployees.filter(emp => emp.status === 'on_leave').length}
                    </p>
                  </div>
                </div>
              </div> 

               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <i className="fas fa-briefcase text-purple-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Departments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(allEmployees.map(emp => emp.employment?.department).filter(Boolean)).size}
                    </p>
                  </div>
                </div>
              </div> 
            </div>
            /*}

            {/* Employee List/Grid */}
            {filteredEmployees.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <i className="fas fa-users text-gray-300 text-6xl mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No employees found</h3>
                <p className="text-gray-600">
                  {searchTerm || Object.keys(filters).length > 0
                    ? "Try adjusting your search or filters"
                    : "Start by adding your first employee"
                  }
                </p>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredEmployees.map((employee:IEmployee) => (
                      <div
                        key={employee._id}
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
                              onClick={() => navigate(employee._id)}
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              <i className="fas fa-eye mr-1"></i>
                              View Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEmployee(employee._id);
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
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Employee
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Position
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredEmployees.map((employee:IEmployee) => (
                            <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
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
                                  {employee?.employeeModel === "StaffModel" ? employee.employment?.department || 'N/A' : 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center ">
                                <div>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                                    {employee.status || 'N/A'}
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
                                    onClick={() => navigate(employee._id)}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                  >
                                    <i className="fas fa-eye mr-1"></i>
                                    View
                                  </Button>
                                  <Button
                                  variant='danger'
                                    onClick={() => handleDeleteEmployee(employee._id)}
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
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={isFetchingNextPage}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Loading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus mr-2"></i>
                          Load More Employees
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRMainPage;