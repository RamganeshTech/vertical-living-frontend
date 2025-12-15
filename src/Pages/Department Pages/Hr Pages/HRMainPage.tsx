import React, { useState, useMemo } from 'react';

import { type EmployeeFilters, type IEmployee } from '../../../types/types';
import {
  useGetEmployeesInfinite,
  useDeleteEmployee,
} from '../../../apiList/Department Api/HrApi/HrApi';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import type { OrganizationOutletTypeProps } from '../../Organization/OrganizationChildren';
import { roles } from '../../../constants/constants';
import { toast } from '../../../utils/toast';
import { Button } from '../../../components/ui/Button';
import CreateNewEmployee from './CreateNewEmployee';
// import GridCardEmployeeView from './GridCardEmployeeView';
import EmployeeListView from './EmployeeListView';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';
import StageGuide from '../../../shared/StageGuide';

const HRMainPage: React.FC = () => {
  const { openMobileSidebar, isMobile } = useOutletContext<OrganizationOutletTypeProps>()
  const { organizationId } = useParams() as { organizationId: string }
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  // const [viewMode, _setViewMode] = useState<'grid' | 'list'>('list');

  const { role, permission } = useAuthCheck();


  const canList = role === "owner" || permission?.hr?.list;
  const canCreate = role === "owner" || permission?.hr?.create;



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

  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

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
      toast({ title: "Success", description: "deleted successfully" })
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to delete", variant: "destructive" })

    }
  };


  // const getStatusColor = (status?: string) => {
  //   switch (status) {
  //     case 'active': return 'bg-green-100 text-green-800';
  //     case 'inactive': return 'bg-gray-100 text-gray-800';
  //     case 'terminated': return 'bg-red-100 text-red-800';
  //     case 'on_leave': return 'bg-yellow-100 text-yellow-800';
  //     default: return 'bg-gray-100 text-gray-800';
  //   }
  // };



  const handleFilterChange = (key: keyof EmployeeFilters, value: string) => {

    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };


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
      {!showCreateForm &&
        <>
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

                  {canCreate && <div>
                    <Button onClick={() => setShowCreateForm(true)}>Create New Employee</Button>
                  </div>
                  }

                  <div className="w-full sm:w-auto flex justify-end sm:block">
                    <StageGuide
                      organizationId={organizationId!}
                      stageName="hr"
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
                        Organization Type
                      </label>
                      <select
                        value={filters.empRole || ''}
                        onChange={(e) => handleFilterChange('empRole', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        <option value="organization_staff">Organization Staff</option>
                        <option value="nonorganization_staff">Non-Organization Staff</option>
                      </select>
                    </div>

                    {/* Status */}
                    {/* <div>
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
                </div> */}

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>



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
              <div className="flex-1  max-h-[74vh] overflow-y-auto">
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
                    {/* {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {filteredEmployees.map((employee: IEmployee) => (
                          <GridCardEmployeeView key={employee._id} employee={employee} getStatusColor={getStatusColor} handleDeleteEmployee={handleDeleteEmployee} deleteEmployeeMutation={deleteEmployeeMutation} />
                        ))}
                      </div>
                    ) : ( */}
                    {canList &&
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
                                  Department
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Type
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {filteredEmployees.map((employee: IEmployee) => (
                                <EmployeeListView key={employee._id} employee={employee} handleDeleteEmployee={handleDeleteEmployee} deleteEmployeeMutation={deleteEmployeeMutation} />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    }
                    {/* )} */}

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
        </>
      }


      {showCreateForm && <CreateNewEmployee organizationId={organizationId} onSuccess={() => setShowCreateForm(false)} />}

    </div>
  );
};

export default HRMainPage;