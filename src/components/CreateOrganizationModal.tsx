
// import type React from "react"

// import { useState } from "react"
// import { Button } from "./ui/Button"
// import { Input } from "./ui/Input"
// import { Label } from "./ui/Label"
// import { Textarea } from "./ui/TextArea"
// import { useCreateOrganization } from "../apiList/organization_api/orgApi"
// import { toast } from "../utils/toast"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';

// interface CreateOrganizationModalProps {
//   isOpen: boolean
//   onClose: () => void
// }

// export default function CreateOrganizationModal({ isOpen, onClose }: CreateOrganizationModalProps) {
//   const [formData, setFormData] = useState({
//     organizationName: "",
//     type: "",
//     address: "",
//     logoUrl: "",
//     organizationPhoneNo: "",
//   })

//   const createOrganization = useCreateOrganization()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.organizationName.trim()) {
//       toast({
//         title: "Error",
//         description: "Organization name is required",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       await createOrganization.mutateAsync(formData)
//       toast({
//         title: "Success",
//         description: "Organization created successfully",
//       })
//       setFormData({
//         organizationName: "",
//         type: "",
//         address: "",
//         logoUrl: "",
//         organizationPhoneNo: "",
//       })
//       onClose()
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || "Failed to create organization",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }))
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md p-4 custom-scrollbar">
//         <DialogHeader>
//           <DialogTitle className="text-blue-900">Create New Organization</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="organizationName" className="text-blue-800">
//               Organization Name *
//             </Label>
//             <Input
//               id="organizationName"
//               name="organizationName"
//               value={formData.organizationName}
//               onChange={handleChange}
//               placeholder="Enter organization name"
//               className="border-blue-200 focus:border-blue-500"
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="type" className="text-blue-800">
//               Type
//             </Label>
//             <Input
//               id="type"
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               placeholder="e.g., Company, NGO, Startup"
//               className="border-blue-200 focus:border-blue-500"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="organizationPhoneNo" className="text-blue-800">
//               Phone Number
//             </Label>
//             <Input
//               id="organizationPhoneNo"
//               name="organizationPhoneNo"
//               value={formData.organizationPhoneNo}
//               onChange={handleChange}
//               placeholder="Enter phone number"
//               className="border-blue-200 focus:border-blue-500"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="address" className="text-blue-800">
//               Address
//             </Label>
//             <Textarea
//               id="address"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Enter organization address"
//               className="border-blue-200 focus:border-blue-500"
//               rows={3}
//             />
//           </div>

//           {/* <div className="space-y-2">
//             <Label htmlFor="logoUrl" className="text-blue-800">
//               Logo URL
//             </Label>
//             <Input
//               id="logoUrl"
//               name="logoUrl"
//               value={formData.logoUrl}
//               onChange={handleChange}
//               placeholder="Enter logo URL"
//               className="border-blue-200 focus:border-blue-500"
//             />
//           </div> */}

//           <div className="flex justify-end space-x-2 pt-4">
//             <Button type="button" variant="outline" onClick={onClose} className="border-blue-200 text-blue-600">
//               Cancel
//             </Button>
//             <Button type="submit" disabled={createOrganization.isPending} className="bg-blue-600 hover:bg-blue-700">
//               {createOrganization.isPending ? "Creating..." : "Create Organization"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }


import type React from "react";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/TextArea";
import { useCreateOrganization } from "../apiList/organization_api/orgApi";
import { toast } from "../utils/toast";
import { COMPANY_DETAILS } from "../constants/constants";
import welcomeIllustrationImg from "../assets/welcomeimg.svg";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateOrganizationModal({ isOpen, onClose }: CreateOrganizationModalProps) {
  const [formData, setFormData] = useState({
    organizationName: "",
    type: "",
    address: "",
    organizationPhoneNo: "",
  });

  const createOrganization = useCreateOrganization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrganization.mutateAsync(formData);
      toast({ title: "Welcome!", description: `${formData.organizationName} has been registered.` });
      setFormData({ organizationName: "", type: "", address: "", organizationPhoneNo: "" });
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Creation failed", variant: "destructive" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-300">

        {/* LEFT SIDE: BRANDING & ILLUSTRATION (40%) */}
        <div className="w-full md:w-[40%] bg-gradient-to-br from-[#f0f7ff] via-[#f5f3ff] to-[#fefeff] p-10 flex flex-col justify-between items-center text-center relative overflow-hidden border-r border-slate-100">

          {/* Soft Decorative Orbs - Using very low opacity for a "Glass" look */}
          <div className="absolute top-[-5%] left-[-5%] w-64 h-64 bg-blue-200/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-64 h-64 bg-purple-200/30 rounded-full blur-[100px]" />

          <div className="space-y-6 relative z-10">
            {/* Floating Logo - Subtle shadow instead of heavy container */}
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-blue-100/50 mx-auto flex items-center justify-center p-3 transition-transform duration-500 hover:scale-110">
              <img src={COMPANY_DETAILS.COMPANY_LOGO} alt="Logo" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">Hi There! 👋</h2>
              <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.25em]">Welcome to {COMPANY_DETAILS.COMPANY_NAME} CRM</p>
            </div>

            <p className="text-slate-500/80 text-sm leading-relaxed max-w-[260px] mx-auto font-medium">
              Streamline your interior design and construction workflows with our <span className="text-blue-600 font-bold">all-in-One CRM</span>.
            </p>
          </div>

          {/* Illustration - Now perfectly blended into the light background */}
          <div className="relative w-full flex items-center justify-center py-4">
            {/* Very subtle glow to match the background tone */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 to-purple-100/40 rounded-full blur-[60px] transform scale-90" />
            <img
              src={welcomeIllustrationImg}
              alt="Welcome Illustration"
              className="w-full max-w-[280px] relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] transition-transform duration-700 hover:translate-y-[-5px]"
            />
          </div>

          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest relative z-10">
            © {new Date().getFullYear()} Vertical Living Tech
          </p>
        </div>


        {/* RIGHT SIDE: FORM (60%) */}
        <div className="w-full md:w-[60%] p-8 md:p-12 bg-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors">
            <i className="fas fa-times text-xl" />
          </button>

          <div className="mb-8">
            <h3 className="text-2xl font-black text-slate-900">Getting Started</h3>
            <p className="text-slate-400 text-sm mt-1">Setup your organization profile to begin.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-slate-400 uppercase ml-1">Company Name *</Label>
                <Input
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  placeholder="Enter business name"
                  className="h-12 border-slate-200 focus:border-blue-500 rounded-xl bg-slate-50/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-slate-400 uppercase ml-1">Business Type</Label>
                <Input
                  name="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g. Interior Design"
                  className="h-12 border-slate-200 focus:border-blue-500 rounded-xl bg-slate-50/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-black text-slate-400 uppercase ml-1">Phone Number</Label>
              <Input
                name="organizationPhoneNo"
                value={formData.organizationPhoneNo}
                onChange={(e) => setFormData({ ...formData, organizationPhoneNo: e.target.value })}
                placeholder="10-digit mobile number"
                className="h-12 border-slate-200 focus:border-blue-500 rounded-xl bg-slate-50/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-black text-slate-400 uppercase ml-1">Headquarters Address</Label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full office address..."
                className="min-h-[100px] border-slate-200 focus:border-blue-500 rounded-xl bg-slate-50/50 pt-3"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={createOrganization.isPending}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98]"
              >
                {createOrganization.isPending ? (
                  <><i className="fas fa-circle-notch fa-spin mr-2" /> Creating...</>
                ) : (
                  "Get Started"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}