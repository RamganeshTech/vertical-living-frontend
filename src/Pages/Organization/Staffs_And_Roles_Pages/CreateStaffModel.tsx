// import React, { useState } from 'react';
// import { useRegisterUser } from '../../../apiList/orgApi';
// import { useGetProjects } from '../../../apiList/projectApi';
// import { toast } from '../../../utils/toast';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';

import { useState } from "react";
import { useRegisterUser } from "../../../apiList/orgApi";
import { useGetProjects } from "../../../apiList/projectApi";
import { toast } from "../../../utils/toast";
// import { Dialog } from "../../../components/ui/Dialog";
import { Label } from '../../../components/ui/Label';

// export const CreateUserModal = ({ isOpen, onClose, organizationId }: { isOpen: boolean, onClose: () => void, organizationId: string }) => {

//     // 1. Form State
//     const [role, setRole] = useState("staff");
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         phoneNo: "",
//         password: "",
//         location: "", // Only for Client
//         projectId: "" // For Client & Worker
//     });

//     // 2. Hooks
//     const { mutate: registerUser, isPending } = useRegisterUser();
//     const { data: projectsData } = useGetProjects(organizationId); // Fetch projects for dropdown
//     const projects = projectsData || [];

//     // 3. Handle Submit
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         // Map generic "name" to specific field (staffName, workerName, etc.)
//         const payload: any = {
//             email: formData.email,
//             phoneNo: formData.phoneNo,
//             password: formData.password,
//             organizationId: [organizationId], // Array as per schema
//         };

//         if (role === 'staff') payload.staffName = formData.name;
//         if (role === 'worker') payload.workerName = formData.name;
//         if (role === 'client') payload.clientName = formData.name;
//         if (role === 'CTO') payload.CTOName = formData.name;

//         // Add extras
//         if (role === 'client') payload.location = formData.location;

//         // Handle Project ID (If your backend expects it in body or specific role)
//         // Note: Your schema didn't explicitly show projectId in user models, 
//         // but if you have it, add it here.
//         if ((role === 'client' || role === 'worker') && formData.projectId) {
//             payload.projectId = formData.projectId;
//         }

//         registerUser({
//             organizationId,
//             roleToCreate: role,
//             payload
//         }, {
//             onSuccess: () => {
//                 toast({ title: "Success", description: `${role} created successfully` });
//                 onClose();
//             },
//             onError: (err: any) => {
//                 toast({ title: "Error", description: err.message, variant: "destructive" });
//             }
//         });
//     };

//     return (
//         <div className="px-4 py-5 !bg-white ">

//         <Dialog open={isOpen} onOpenChange={onClose}>
//             <DialogContent className="max-w-md px-4 py-4">
//                 <DialogHeader>
//                     <DialogTitle>Create New User</DialogTitle>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit} className="space-y-4 mt-2">
//                     {/* Role Selector */}
//                     <div>
//                         <label className="text-xs font-bold text-gray-500 uppercase">Select Role</label>
//                         <select
//                             className="w-full border p-2 rounded mt-1"
//                             value={role}
//                             onChange={(e) => setRole(e.target.value)}
//                         >
//                             <option value="staff">Staff</option>
//                             <option value="worker">Worker</option>
//                             <option value="client">Client</option>
//                             <option value="CTO">CTO</option>
//                         </select>
//                     </div>

//                     {/* Dynamic Fields */}
//                     <div>
//                         <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
//                         <input required type="text" className="w-full border p-2 rounded mt-1"
//                             placeholder={`Enter ${role} name`}
//                             value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
//                     </div>

//                     <div>
//                         <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
//                         <input required type="email" className="w-full border p-2 rounded mt-1"
//                             value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
//                             <input type="text" className="w-full border p-2 rounded mt-1"
//                                 value={formData.phoneNo} onChange={e => setFormData({ ...formData, phoneNo: e.target.value })} />
//                         </div>
//                         <div>
//                             <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
//                             <input required type="password" className="w-full border p-2 rounded mt-1"
//                                 value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
//                         </div>
//                     </div>

//                     {/* Specific: Client Location */}
//                     {role === 'client' && (
//                         <div>
//                             <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
//                             <input type="text" className="w-full border p-2 rounded mt-1"
//                                 value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
//                         </div>
//                     )}

//                     {/* Specific: Project Selection for Client & Worker */}
//                     {(role === 'client' || role === 'worker') && (
//                         <div>
//                             <label className="text-xs font-bold text-gray-500 uppercase">Assign Project</label>
//                             <select
//                                 className="w-full border p-2 rounded mt-1 bg-white"
//                                 value={formData.projectId}
//                                 onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
//                             >
//                                 <option value="">-- Select Project --</option>
//                                 {projects.map((p: any) => (
//                                     <option key={p._id} value={p._id}>{p.projectName}</option>
//                                 ))}
//                             </select>
//                             <p className="text-[10px] text-gray-400 mt-1">* Optional assignment</p>
//                         </div>
//                     )}

//                     <div className="flex justify-end gap-2 mt-4">
//                         <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
//                         <Button type="submit" disabled={isPending} className="bg-blue-600">
//                             {isPending ? "Creating..." : "Create User"}
//                         </Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//         </div>

//     );
// };



// import React, { useState } from 'react';
// import { useRegisterUser } from './hooks/useUserManagement'; // Your hook path
// import { useGetProjects } from '@/hooks/useProjects'; // Your hook path
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { toast } from '@/components/ui/use-toast';
// import { Input } from './components/Input'; // Adjust path to your custom Input
// import { Label } from './components/Label'; // Adjust path to your custom Label
// import { Button } from './components/Button'; // Adjust path to your custom Button

// import { useRegisterUser } from '../../../apiList/orgApi';
// import { useGetProjects } from '../../../apiList/projectApi';
// import { toast } from '../../../utils/toast';
import { Dialog, DialogContent, DialogTitle } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
// import { Button } from '../../../components/ui/Button';



export const CreateUserModal = ({ isOpen, onClose, organizationId }: { isOpen: boolean, onClose: () => void, organizationId: string }) => {

    const [role, setRole] = useState("staff");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNo: "",
        password: "",
        // location: "", 
        // projectId: "" 
    });

    const { mutateAsync: registerUser, isPending } = useRegisterUser();
    const { data: _projectsData } = useGetProjects(organizationId);
    // const projects = projectsData || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {
            name: formData.name,
            email: formData.email,
            phoneNo: formData.phoneNo,
            password: formData.password,
            organizationId: [organizationId],
        };

        // if (role === 'staff') payload.staffName = formData.name;
        // if (role === 'worker') payload.workerName = formData.name;
        // if (role === 'client') payload.clientName = formData.name;
        // if (role === 'CTO') payload.CTOName = formData.name;

        // if (role === 'client') payload.location = formData.location;
        // if ((role === 'client' || role === 'worker') && formData.projectId) {
        //     payload.projectId = formData.projectId; 
        // }
        try {

            await registerUser({
                organizationId,
                roleToCreate: role,
                payload
            })

            toast({ title: "Success", description: `${role.toUpperCase()} created successfully` });


        } catch (error: any) {
            toast({ title: "Error", description: error.response.data.message || error?.message || "Failed to create", variant: "destructive" });

        }
    };

return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">
            {/* Header with Color Accent */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                    <i className="fas fa-user-plus bg-white/20 p-2 rounded-lg"></i>
                    Create New User
                </DialogTitle>
                <p className="text-blue-100 text-xs mt-1">Add a new member to your organization</p>
            </div>

            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Role Selection - Visual Cards or Select */}
                    <div>
                        <Label className="mb-2 block text-xs uppercase tracking-wide text-gray-500">Assign Role</Label>
                        <div className="relative">
                            <i className="fas fa-briefcase absolute left-3 top-3 text-gray-400 z-10"></i>
                            <select
                                className="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-xl bg-blue-50/30 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all cursor-pointer font-medium text-gray-700"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="staff">staff</option>
                                <option value="worker">worker</option>
                                <option value="client">client</option>
                                <option value="CTO">CTO</option>
                            </select>
                        </div>
                    </div>

                    {/* Name & Email Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-1.5 block">Full Name</Label>
                            <Input
                                required
                                placeholder={`e.g. John Doe`}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label className="mb-1.5 block">Email Address</Label>
                            <Input
                                required
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Phone & Password Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-1.5 block">Phone Number</Label>
                            <Input
                                maxLength={10}
                                type="text"
                                placeholder="+91 98765 43210"
                                value={formData.phoneNo}
                                onChange={e => setFormData({ ...formData, phoneNo: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label className="mb-1.5 block">Set Password</Label>
                            <Input
                                required
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Conditional Fields */}
                    {/* <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                            {role === 'client' && (
                                <div>
                                    <Label className="mb-1.5 block">Location / Address</Label>
                                    <Input 
                                        placeholder="Site Location"
                                        value={formData.location} 
                                        onChange={e => setFormData({...formData, location: e.target.value})} 
                                    />
                                </div>
                            )}

                            {(role === 'client' || role === 'worker') && (
                                <div>
                                    <Label className="mb-1.5 block">Assign Project (Optional)</Label>
                                    <select 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-sm"
                                        value={formData.projectId}
                                        onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                                    >
                                        <option value="">-- No Project Assigned --</option>
                                        {projects.map((p: any) => (
                                            <option key={p._id} value={p._id}>{p.projectName}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            
                            {!((role === 'client' || role === 'worker')) && role !== 'client' && (
                                <p className="text-xs text-gray-400 text-center italic">No additional fields required for this role.</p>
                            )}
                        </div> */}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant='secondary'
                            onClick={onClose}
                            className="  text-gray-700 border border-gray-300 shadow-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
                        >
                            <i className="fas fa-check mr-2"></i> Create User
                        </Button>
                    </div>
                </form>
            </div>
        </DialogContent>
    </Dialog>
);
};