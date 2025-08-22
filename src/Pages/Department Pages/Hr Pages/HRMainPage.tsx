// import React, { useState, useMemo } from 'react';
// import type { EmployeeFilters, IEmployee } from '../../../types/types';
// import { useGetEmployeesInfinite } from '../../../apiList/Department Api/HrApi/HrApi';

// const HRMainPage: React.FC = () => {
//   const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [filters, setFilters] = useState<EmployeeFilters>({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

//   // Get organization ID from your context/store
//   const organizationId = "your-organization-id"; // Replace with actual organization ID

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     error,
//     refetch
//   } = useGetEmployeesInfinite(organizationId, filters);

//   const allEmployees = useMemo(() => {
//     return data?.pages.flatMap(page => page.data) || [];
//   }, [data]);

//   const filteredEmployees = useMemo(() => {
//     if (!searchTerm) return allEmployees;
//     return allEmployees.filter(employee =>
//       employee.personalInfo?.empName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.personalInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.personalInfo?.phoneNo?.includes(searchTerm) ||
//       employee.employment?.designation?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [allEmployees, searchTerm]);

//   const handleEmployeeClick = (employee: IEmployee) => {
//     setSelectedEmployee(employee);
//     setIsModalOpen(true);
//   };

//   const handleLoadMore = () => {
//     if (hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   };

//   const getStatusColor = (status?: string) => {
//     switch (status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'inactive': return 'bg-gray-100 text-gray-800';
//       case 'terminated': return 'bg-red-100 text-red-800';
//       case 'on_leave': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getEmploymentTypeColor = (type?: string) => {
//     switch (type) {
//       case 'full_time': return 'bg-blue-100 text-blue-800';
//       case 'part_time': return 'bg-purple-100 text-purple-800';
//       case 'contract': return 'bg-orange-100 text-orange-800';
//       case 'intern': return 'bg-pink-100 text-pink-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatDate = (date?: Date) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleDateString();
//   };

//   const formatSalary = (salary?: { total?: number }) => {
//     if (!salary?.total) return 'N/A';
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(salary.total);
//   };

//   const handleFilterChange = (key: keyof EmployeeFilters, value: string) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value || undefined
//     }));
//   };

//   const clearFilters = () => {
//     setFilters({});
//   };

//   const activeFiltersCount = Object.values(filters).filter(Boolean).length;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Employees</h2>
//           <p className="text-gray-600">Please wait while we fetch the employee data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <i className="fas fa-exclamation-triangle text-red-500 text-6xl mb-4"></i>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Employees</h2>
//           <p className="text-gray-600 mb-4">{error.message}</p>
//           <button
//             onClick={() => refetch()}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <i className="fas fa-redo mr-2"></i>
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//                 <i className="fas fa-users mr-3 text-blue-600"></i>
//                 Human Resources
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 Manage your organization's employees and their information
//               </p>
//             </div>
            
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="relative">
//                 <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//                 <input
//                   type="text"
//                   placeholder="Search employees..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
//                 />
//               </div>
              
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-lg transition-colors ${
//                     viewMode === 'grid' 
//                       ? 'bg-blue-600 text-white' 
//                       : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
//                   }`}
//                 >
//                   <i className="fas fa-th-large"></i>
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-lg transition-colors ${
//                     viewMode === 'list' 
//                       ? 'bg-blue-600 text-white' 
//                       : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
//                   }`}
//                 >
//                   <i className="fas fa-list"></i>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex flex-col xl:flex-row gap-6">
//           {/* Filters Sidebar */}
//           <div className="xl:w-80 flex-shrink-0">
//             <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                   <i className="fas fa-filter mr-2 text-blue-600"></i>
//                   Filters
//                 </h3>
//                 {activeFiltersCount > 0 && (
//                   <button
//                     onClick={clearFilters}
//                     className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     Clear All ({activeFiltersCount})
//                   </button>
//                 )}
//               </div>

//               <div className="space-y-6">
//                 {/* Employee Role */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Employee Role
//                   </label>
//                   <select
//                     value={filters.empRole || ''}
//                     onChange={(e) => handleFilterChange('empRole', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">All Roles</option>
//                     <option value="organization_staff">Organization Staff</option>
//                     <option value="nonorganization_staff">Non-Organization Staff</option>
//                   </select>
//                 </div>

//                 {/* Status */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Status
//                   </label>
//                   <select
//                     value={filters.status || ''}
//                     onChange={(e) => handleFilterChange('status', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">All Status</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="terminated">Terminated</option>
//                     <option value="on_leave">On Leave</option>
//                   </select>
//                 </div>

//                 {/* Department */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Department
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter department"
//                     value={filters.department || ''}
//                     onChange={(e) => handleFilterChange('department', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 {/* Quick Stats */}
//                 <div className="pt-4 border-t border-gray-200">
//                   <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h4>
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Total Employees</span>
//                       <span className="font-semibold text-gray-900">{allEmployees.length}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Active</span>
//                       <span className="font-semibold text-green-600">
//                         {allEmployees.filter(emp => emp.status === 'active').length}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">On Leave</span>
//                       <span className="font-semibold text-yellow-600">
//                         {allEmployees.filter(emp => emp.status === 'on_leave').length}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-blue-100 rounded-lg">
//                     <i className="fas fa-users text-blue-600 text-xl"></i>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Total Employees</p>
//                     <p className="text-2xl font-bold text-gray-900">{allEmployees.length}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-green-100 rounded-lg">
//                     <i className="fas fa-user-check text-green-600 text-xl"></i>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Active</p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {allEmployees.filter(emp => emp.status === 'active').length}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-yellow-100 rounded-lg">
//                     <i className="fas fa-user-clock text-yellow-600 text-xl"></i>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">On Leave</p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {allEmployees.filter(emp => emp.status === 'on_leave').length}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-purple-100 rounded-lg">
//                     <i className="fas fa-briefcase text-purple-600 text-xl"></i>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Departments</p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {new Set(allEmployees.map(emp => emp.employment?.department).filter(Boolean)).size}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Employee List/Grid */}
//             {/* {filteredEmployees.length === 0 ? (
//               <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//                 <i className="fas fa-users text-gray-300 text-6xl mb- */}

//                             {/* Employee List/Grid */}
//             {filteredEmployees.length === 0 ? (
//               <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//                 <i className="fas fa-users text-gray-300 text-6xl mb-4"></i>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">No employees found</h3>
//                 <p className="text-gray-600">
//                   {searchTerm || Object.keys(filters).length > 0
//                     ? "Try adjusting your search or filters"
//                     : "Start by adding your first employee"
//                   }
//                 </p>
//               </div>
//             ) : (
//               <>
//                 {viewMode === 'grid' ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
//                     {filteredEmployees.map((employee) => (
//                       <div
//                         key={employee._id}
//                         onClick={() => handleEmployeeClick(employee)}
//                         className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-200 group"
//                       >
//                         <div className="p-6">
//                           {/* Header */}
//                           <div className="flex items-start justify-between mb-4">
//                             <div className="flex items-center">
//                               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
//                                 {employee.personalInfo?.empName?.charAt(0)?.toUpperCase() || 'N'}
//                               </div>
//                               <div className="ml-3">
//                                 <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
//                                   {employee.personalInfo?.empName || 'N/A'}
//                                 </h3>
//                                 <p className="text-sm text-gray-500">
//                                   ID: {employee._id.slice(-6)}
//                                 </p>
//                               </div>
//                             </div>
//                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
//                               {employee.status || 'N/A'}
//                             </span>
//                           </div>

//                           {/* Employment Info */}
//                           <div className="space-y-3 mb-4">
//                             <div className="flex items-center text-sm">
//                               <i className="fas fa-briefcase text-gray-400 w-4"></i>
//                               <span className="ml-2 text-gray-600">
//                                 {employee.employment?.designation || 'N/A'}
//                               </span>
//                             </div>
                            
//                             <div className="flex items-center text-sm">
//                               <i className="fas fa-building text-gray-400 w-4"></i>
//                               <span className="ml-2 text-gray-600">
//                                 {employee.employment?.department || 'N/A'}
//                               </span>
//                             </div>

//                             <div className="flex items-center text-sm">
//                               <i className="fas fa-envelope text-gray-400 w-4"></i>
//                               <span className="ml-2 text-gray-600 truncate">
//                                 {employee.personalInfo?.email || 'N/A'}
//                               </span>
//                             </div>

//                             <div className="flex items-center text-sm">
//                               <i className="fas fa-phone text-gray-400 w-4"></i>
//                               <span className="ml-2 text-gray-600">
//                                 {employee.personalInfo?.phoneNo || 'N/A'}
//                               </span>
//                             </div>
//                           </div>

//                           {/* Employment Type & Salary */}
//                           <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                             {employee.employment?.employmentType && (
//                               <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEmploymentTypeColor(employee.employment.employmentType)}`}>
//                                 {employee.employment.employmentType.replace('_', ' ')}
//                               </span>
//                             )}
                            
//                             <div className="text-right">
//                               <p className="text-xs text-gray-500">Salary</p>
//                               <p className="text-sm font-semibold text-gray-900">
//                                 {formatSalary(employee.employment?.salary)}
//                               </p>
//                             </div>
//                           </div>

//                           {/* Join Date */}
//                           <div className="mt-3 pt-3 border-t border-gray-100">
//                             <div className="flex items-center justify-between text-sm">
//                               <span className="text-gray-500">Joined</span>
//                               <span className="text-gray-900 font-medium">
//                                 {formatDate(employee.employment?.joinDate)}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead className="bg-gray-50 border-b border-gray-200">
//                           <tr>
//                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Employee
//                             </th>
//                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Contact
//                             </th>
//                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Position
//                             </th>
//                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Status
//                             </th>
//                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                           {filteredEmployees.map((employee) => (
//                             <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
//                               <td className="px-6 py-4">
//                                 <div className="flex items-center">
//                                   <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
//                                     {employee.personalInfo?.empName?.charAt(0)?.toUpperCase() || 'N'}
//                                   </div>
//                                   <div className="ml-4">
//                                     <div className="text-sm font-medium text-gray-900">
//                                       {employee.personalInfo?.empName || 'N/A'}
//                                     </div>
//                                     <div className="text-sm text-gray-500">
//                                       ID: {employee._id.slice(-6)}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4">
//                                 <div className="text-sm text-gray-900">
//                                   {employee.personalInfo?.email || 'N/A'}
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                   {employee.personalInfo?.phoneNo || 'N/A'}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4">
//                                 <div className="text-sm text-gray-900">
//                                   {employee.employment?.designation || 'N/A'}
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                   {employee.employment?.department || 'N/A'}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4">
//                                 <div className="flex flex-col gap-1">
//                                   <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
//                                     {employee.status || 'N/A'}
//                                   </span>
//                                   {employee.employment?.employmentType && (
//                                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEmploymentTypeColor(employee.employment.employmentType)}`}>
//                                       {employee.employment.employmentType.replace('_', ' ')}
//                                     </span>
//                                   )}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4">
//                                 <button
//                                   onClick={() => handleEmployeeClick(employee)}
//                                   className="text-blue-600 hover:text-blue-800 font-medium text-sm"
//                                 >
//                                   <i className="fas fa-eye mr-1"></i>
//                                   View Details
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}

//                 {/* Load More Button */}
//                 {hasNextPage && (
//                   <div className="mt-8 text-center">
//                     <button
//                       onClick={handleLoadMore}
//                       disabled={isFetchingNextPage}
//                       className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       {isFetchingNextPage ? (
//                         <>
//                           <i className="fas fa-spinner fa-spin mr-2"></i>
//                           Loading...
//                         </>
//                       ) : (
//                         <>
//                           <i className="fas fa-plus mr-2"></i>
//                           Load More Employees
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Employee Modal */}
//       {isModalOpen && selectedEmployee && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900">
//                 Employee Details - {selectedEmployee.personalInfo?.empName || 'N/A'}
//               </h2>
//               <button
//                 onClick={() => {
//                   setIsModalOpen(false);
//                   setSelectedEmployee(null);
//                 }}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <i className="fas fa-times text-xl"></i>
//               </button>
//             </div>
//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Personal Information */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
//                     Personal Information
//                   </h3>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Name</label>
//                       <p className="text-gray-900">{selectedEmployee.personalInfo?.empName || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Email</label>
//                       <p className="text-gray-900">{selectedEmployee.personalInfo?.email || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Phone</label>
//                       <p className="text-gray-900">{selectedEmployee.personalInfo?.phoneNo || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Gender</label>
//                       <p className="text-gray-900">{selectedEmployee.personalInfo?.gender || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Date of Birth</label>
//                       <p className="text-gray-900">{formatDate(selectedEmployee.personalInfo?.dateOfBirth)}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Employment Information */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
//                     Employment Information
//                   </h3>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Designation</label>
//                       <p className="text-gray-900">{selectedEmployee.employment?.designation || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Department</label>
//                       <p className="text-gray-900">{selectedEmployee.employment?.department || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Employment Type</label>
//                       <p className="text-gray-900">{selectedEmployee.employment?.employmentType?.replace('_', ' ') || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Join Date</label>
//                       <p className="text-gray-900">{formatDate(selectedEmployee.employment?.joinDate)}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Total Salary</label>
//                       <p className="text-gray-900">{formatSalary(selectedEmployee.employment?.salary)}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRMainPage;


import React, { useState, useMemo } from 'react';
// import { 
//   useGetEmployeesInfinite, 
//   useGetSingleEmployee, 
//   useUpdateEmployee, 
//   useDeleteEmployee, 
//   useUploadEmployeeDocument, 
//   useDeleteEmployeeDocument 
// } from '../api/hrApi';
import { type IEmployee, type EmployeeFilters, type IDocument } from '../../../types/types';
import {  
     useGetEmployeesInfinite, 
  useGetSingleEmployee, 
  useUpdateEmployee, 
  useDeleteEmployee, 
  useUploadEmployeeDocument, 
  useDeleteEmployeeDocument 
 } from '../../../apiList/Department Api/HrApi/HrApi';
import { useParams } from 'react-router-dom';

const HRMainPage: React.FC = () => {
    const {organizationId} = useParams() as {organizationId:string}
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'documents'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<IEmployee | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  // Get organization ID from your context/store

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

  const { 
    data: singleEmployeeData, 
    isLoading: isLoadingSingleEmployee 
  } = useGetSingleEmployee(selectedEmployee?._id || '');

  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();
  const uploadDocumentMutation = useUploadEmployeeDocument();
  const deleteDocumentMutation = useDeleteEmployeeDocument();

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

  const handleEmployeeClick = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setEditData(employee);
    setIsModalOpen(true);
    setIsEditing(false);
    setActiveTab('personal');
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleSaveEmployee = async () => {
    if (!editData || !selectedEmployee) return;

    try {
      await updateEmployeeMutation.mutateAsync({
        empId: selectedEmployee._id,
        updates: editData
      });
      setIsEditing(false);
      setSelectedEmployee(editData);
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee. Please try again.');
    }
  };

  const handleDeleteEmployee = async (empId: string) => {
    if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteEmployeeMutation.mutateAsync({ empId });
      setIsModalOpen(false);
      setSelectedEmployee(null);
      alert('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee. Please try again.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file || !selectedEmployee) return;

    setUploadingDoc(type);
    try {
      await uploadDocumentMutation.mutateAsync({
        empId: selectedEmployee._id,
        type,
        file
      });
      alert('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!selectedEmployee || !window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await deleteDocumentMutation.mutateAsync({
        empId: selectedEmployee._id,
        docId
      });
      alert('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
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

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // Use single employee data if available, otherwise use selected employee
  const currentEmployee = singleEmployeeData || selectedEmployee;

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
          <p className="text-gray-600 mb-4">{error.message}</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
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
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
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
                  <input
                    type="text"
                    placeholder="Enter department"
                    value={filters.department || ''}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-gray-200">
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
                </div>
              </div>
            </div>
          </div>

 

          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                    {filteredEmployees.map((employee) => (
                      <div
                        key={employee._id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200 group"
                      >
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {employee.personalInfo?.empName?.charAt(0)?.toUpperCase() || 'N'}
                              </div>
                              <div className="ml-3">
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {employee.personalInfo?.empName || 'N/A'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  ID: {employee._id.slice(-6)}
                                </p>
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
                              onClick={() => handleEmployeeClick(employee)}
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
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Employee
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Position
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredEmployees.map((employee) => (
                            <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {employee.personalInfo?.empName?.charAt(0)?.toUpperCase() || 'N'}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {employee.personalInfo?.empName || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      ID: {employee._id.slice(-6)}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {employee.personalInfo?.email || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employee.personalInfo?.phoneNo || 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {employee.employment?.designation || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employee.employment?.department || 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                                    {employee.status || 'N/A'}
                                  </span>
                                  {employee.employment?.employmentType && (
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEmploymentTypeColor(employee.employment.employmentType)}`}>
                                      {employee.employment.employmentType.replace('_', ' ')}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEmployeeClick(employee)}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                  >
                                    <i className="fas fa-eye mr-1"></i>
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEmployee(employee._id)}
                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                    disabled={deleteEmployeeMutation.isPending}
                                  >
                                    {deleteEmployeeMutation.isPending ? (
                                      <i className="fas fa-spinner fa-spin mr-1"></i>
                                    ) : (
                                      <i className="fas fa-trash mr-1"></i>
                                    )}
                                    Delete
                                  </button>
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

    
      {/* Enhanced Employee Modal with Full Functionality */}
      {isModalOpen && currentEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {currentEmployee.personalInfo?.empName?.charAt(0)?.toUpperCase() || 'N'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentEmployee.personalInfo?.empName || 'N/A'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Employee ID: {currentEmployee._id.slice(-6)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
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
                
                <button
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
                </button>
                
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedEmployee(null);
                    setIsEditing(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
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
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
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
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
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
                            <option value="single">Single</option>
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
                          <input
                            type="text"
                            value={editData?.employment?.department || ''}
                            onChange={(e) => setEditData(prev => prev ? {
                              ...prev,
                              employment: { ...prev.employment, department: e.target.value }
                            } : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
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
                            <div className={`p-4 border-2 border-dashed rounded-lg transition-colors ${
                              uploadingDoc === docType 
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
        </div>
      )}
    </div>
  );
};

export default HRMainPage;