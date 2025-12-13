import { useMemo, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useDeleteUser, useGetAllUsers } from '../../../apiList/orgApi';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { CreateUserModal } from './CreateStaffModel';
import { toast } from '../../../utils/toast';

const StaffPermissionDashboard = () => {
    // 1. Get Organization ID
    const { organizationId } = useParams() as { organizationId: string }
    const navigate = useNavigate()
    const { data: users = [], isLoading, isError, refetch } = useGetAllUsers(organizationId!);
    const { mutateAsync: deleteUser } = useDeleteUser();

    // 3. Local State for Filters & Modals
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        email: '',
        phone: ''
    });

    const [isCreateOpen, setCreateOpen] = useState(false);

    // 4. Filtering Logic (Client Side)
    // const filteredUsers = useMemo(() => {
    //     return users.filter((user: any) => {
    //         const matchesSearch = user.name.toLowerCase().includes(filters.search.toLowerCase());
    //         const matchesRole = filters.role ? user.role === filters.role : true;
    //         const matchesEmail = user.email?.toLowerCase().includes(filters.email.toLowerCase()) || true;
    //         const matchesPhone = user.phoneNo?.includes(filters.phone) || true;

    //         return matchesSearch && matchesRole && matchesEmail && matchesPhone;
    //     });
    // }, [users, filters]);

     const filteredUsers = useMemo(() => {
        return users.filter((user: any) => {
            
            // 1. General Search (Name)
            // Safe check: handle if user.name is null
            const matchesSearch = filters.search 
                ? user.name?.toLowerCase().includes(filters.search.toLowerCase()) 
                : true;

            // 2. Role Filter
            const matchesRole = filters.role ? user.role === filters.role : true;

            // 3. Email Filter (FIXED)
            // Logic: If filter is empty, return true. Else, check match.
            const matchesEmail = filters.email 
                ? user.email?.toLowerCase().includes(filters.email.toLowerCase()) 
                : true;

            // 4. Phone Filter (FIXED)
            const matchesPhone = filters.phone 
                ? user.phoneNo?.includes(filters.phone) 
                : true;

            return matchesSearch && matchesRole && matchesEmail && matchesPhone;
        });
    }, [users, filters]);

    // 5. Handlers
    const handleDelete = async (userId: string) => {
        try {
            await deleteUser({ userId, organizationId })
            toast({ title: "Success", description: "deleted successfully" })
        }
        catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || "failed to delete", variant: "destructive" })

        }

    };

    const clearFilters = () => setFilters({ search: '', role: '', email: '', phone: '' });



    const isDetailView = location.pathname.includes('/roles');
    if (isDetailView) return <Outlet />;


    return (
        <div className="h-full flex flex-col bg-gray-50/50 overflow-hidden">
            {/* --- HEADER --- */}
            <header className="flex justify-between items-center bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-users-cog mr-3 text-blue-600"></i>
                        User Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage Staff, Workers, Clients and their permissions.</p>
                </div>

                <div className='gap-2 flex items-center'>
                    <Button onClick={() => setCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <i className="fas fa-user-plus mr-2"></i> Create User
                    </Button>
                </div>
            </header>

            {/* --- BODY --- */}
            {isLoading ? (
                <div className="flex flex-1 items-center justify-center text-gray-500">
                    <i className="fas fa-spinner fa-spin mr-2 text-2xl"></i> Loading Users...
                </div>
            ) : isError ? (
                <div className="p-6 text-center text-red-500">
                    Failed to load users. <button onClick={() => refetch()} className="underline">Retry</button>
                </div>
            ) : (
                <main className="flex flex-col xl:flex-row flex-1 overflow-hidden">

                    {/* --- LEFT SIDEBAR (FILTERS) --- */}
                    <div className="xl:w-80 w-full xl:border-r border-gray-200 bg-white overflow-y-auto p-4 flex-shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-md font-bold text-gray-900 flex items-center">
                                <i className="fas fa-filter mr-2 text-blue-600"></i> Filters
                            </h3>
                            <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline font-medium">
                                Clear All
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* General Search */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name / General</label>
                                <div className="relative">
                                    <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                                    <input
                                        type="text"
                                        placeholder="Search by Name..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Role Select */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                                <select
                                    value={filters.role}
                                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full px-2 py-2 border border-gray-300 rounded text-sm outline-none bg-white"
                                >
                                    <option value="">All Roles</option>
                                    <option value="staff">Staff</option>
                                    <option value="worker">Worker</option>
                                    <option value="client">Client</option>
                                    <option value="CTO">CTO</option>
                                </select>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                <input
                                    type="text"
                                    placeholder="Filter by Email"
                                    value={filters.email}
                                    onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone No</label>
                                <input
                                    type="text"
                                    placeholder="Filter by Phone"
                                    value={filters.phone}
                                    onChange={(e) => setFilters(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT CONTENT (TABLE LIST) --- */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name / Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                                No users found matching your filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user: any) => (
                                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                            <Badge className={`text-[10px] px-2 py-0.5 rounded-full uppercase
                                                                ${user.role === 'CTO' ? 'bg-purple-100 text-purple-800' :
                                                                    user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                                                                        user.role === 'worker' ? 'bg-orange-100 text-orange-800' :
                                                                            'bg-green-100 text-green-800'}`}>
                                                                {user.role}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900"><i className="far fa-envelope text-gray-400 mr-2"></i>{user.email}</div>
                                                    {user.phoneNo && (
                                                        <div className="text-sm text-gray-500 mt-1"><i className="fas fa-phone text-gray-400 mr-2"></i>{user.phoneNo}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <Button
                                                        onClick={() => navigate(`roles/${user._id}`)}
                                                        variant="ghost"
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        <i className="fas fa-lock mr-1"></i> Perms
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(user._id)}
                                                        variant="ghost"
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            )}

            {/* --- MODALS --- */}
            {isCreateOpen && (
                <div >

                    <CreateUserModal
                        isOpen={isCreateOpen}
                        onClose={() => setCreateOpen(false)}
                        organizationId={organizationId!}
                    />
                </div>
            )}
        </div>
    );
};


export default StaffPermissionDashboard;