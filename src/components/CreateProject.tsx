import React, { memo, useState, type ChangeEvent, type FormEvent } from "react";
// import TagInput from "../shared/TagInput";
import { useCreateProject, useUpdateProject } from "../apiList/projectApi";
import ErrorComponent from "./ErrorComponent";
import { handleProjectValidate } from "../utils/validation";
import { toast } from "../utils/toast";
import { Button } from "./ui/Button";
// import { Label } from "./ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { COMPANY_DETAILS } from "../constants/constants";

const priorities = ["none", "low", "medium", "high"];
const statuses = [
  "Active",
  "Delayed",
  "In Progress",
  "In Testing",
  "On Track",
  "On Hold",
  "Approved",
  "Cancelled",
  "Planning",
  "Invoice",
];
// const category = ["commercial", "residential"]

// export const statusColors: Record<string, string> = {
//   Active: "bg-green-100 text-green-800",
//   Delayed: "bg-red-100 text-red-800",
//   "In Progress": "bg-blue-100 text-blue-800",
//   "In Testing": "bg-yellow-100 text-yellow-800",
//   "On Track": "bg-emerald-100 text-emerald-800",
//   "On Hold": "bg-gray-100 text-gray-800",
//   Approved: "bg-indigo-100 text-indigo-800",
//   Cancelled: "bg-rose-100 text-rose-800",
//   Planning: "bg-purple-100 text-purple-800",
//   Invoice: "bg-pink-100 text-pink-800",
// };

export const statusColors: Record<string, string> = {
  Active: "bg-action-success/10 text-action-success border-action-success/20",
  Delayed: "bg-action-danger/10 text-action-danger border-action-danger/20",
  "In Progress": "bg-action-primary/10 text-action-primary border-action-primary/20",
  "In Testing": "bg-action-warning/10 text-action-warning border-action-warning/20",
  "On Track": "bg-action-success/10 text-action-success border-action-success/20",
  "On Hold": "bg-brand-ash text-text-muted border-ash-medium",
  Approved: "bg-action-primary/10 text-action-primary border-action-primary/20",
  Cancelled: "bg-brand-ash text-text-soft border-ash-medium",
  Planning: "bg-brand-ash text-text-main border-ash-medium",
  Invoice: "bg-action-primary/10 text-action-primary border-action-primary/20",
};

export interface ProjectInput {
  projectName: string,
  description: string,
  duration: number,
  // category: string,
  tags: string[],
  startDate: Date | null,
  endDate: Date | null,
  dueDate: Date | null,
  priority: string,
  status: string,
  clientName: string;
  email: string;
  whatsapp: string;
  location: string;
  budget: string;
  designType: string;
}


type CreateProjectProp = {
  onClose: () => void,
  refetch: () => Promise<any>,
  setEditForm: React.Dispatch<React.SetStateAction<ProjectInput>>,
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>,
  editForm: ProjectInput,
  isEditing: boolean,
  editProjectId: string | null,
  organizationId: string
}

const CreateProject: React.FC<CreateProjectProp> = ({ onClose, refetch, setShowForm, organizationId, isEditing, setEditForm, editForm, editProjectId }) => {


  const [formData, setFormData] = useState<ProjectInput>({
    projectName: "",
    description: "",
    duration: 0,
    // category: "",
    tags: [],
    startDate: new Date(),
    endDate: null,
    dueDate: null,
    priority: "none",
    status: "Active",

    clientName: "",
    email: "",
    whatsapp: "",
    location: "",
    budget: "",
    designType: ""
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  // const [toastMessage, setToastMessage] = useState<string | null>(null);


  // const budgetOptions = ["Fixed budget", "Own interiors", "Custom architect designs"];
  // const designTypeOptions = ["Modern", "Minimalist", "Traditional"]; // Adjust as needed

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, setState: React.Dispatch<React.SetStateAction<ProjectInput>>) => {
    let { name, value } = e.target

    if (name === "tags") {
      setState(p => ({ ...p, tags: Array.from(new Set([...p.tags, value])) }))
      return;
    }

    if (name.includes("Date")) {
      const newDate = value ? new Date(value) : null; // handle empty string as null

      setState(prev => {
        const updated = { ...prev, [name]: newDate };

        if (updated.startDate && updated.dueDate) {
          const timeDiff = updated.dueDate.getTime() - updated.startDate.getTime();
          if (timeDiff >= 0) {
            updated.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
          } else {
            updated.duration = 0;
          }
        }

        return updated;
      });

      return;
    }

    setState(p => ({ ...p, [name]: value }))
  }

  //   const handleSelectChange = (name: string, value: string) => {
  //   if (isEditing) {
  //     setEditForm((prev) => ({ ...prev, [name]: value }));
  //   } else {
  //     setFormData((prev) => ({ ...prev, [name]: value }));
  //   }
  // };

  const { mutateAsync: createProject, isPending, error, isError, reset } = useCreateProject()
  const { mutateAsync: updateProject, isPending: updatePending, error: updateError, isError: updateIsError, reset: updateReset } = useUpdateProject()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()


    try {
      const validationErrors = isEditing ? handleProjectValidate(editForm) : handleProjectValidate(formData)
      setErrors(validationErrors);


      if (Object.keys(validationErrors).length === 0) {

        if (isEditing && editProjectId) {
          if (!updatePending) {
            await updateProject({ projectId: editProjectId, formData: editForm })
            toast({ title: "Success", description: "Project Edited Successfully" })

          }
        }
        else {
          if (!isPending) {

            if (!acceptedTerms) {
              toast({
                title: "Error",
                description: "Please accept Terms & Conditions",
                variant: "destructive"
              });
              return;
            }


            await createProject({ projectData: formData, orgsId: organizationId })
            toast({ title: "Success", description: "Project Created Successfully" })
          }
        }
        refetch()
        setShowForm(false)
      }
    }
    catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Operation Failed", variant: "destructive" })
    }
  }



  return (
    // <>

    //   <div
    //     onClick={(e) => e.stopPropagation()}
    //     className="bg-brand-surface w-full h-full overflow-y-auto custom-scrollbar max-w-3xl mx-auto rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-ash-medium relative"
    //   >
    //     {!isPending && isError && (
    //       <ErrorComponent
    //         message={(error as any)?.response?.data?.message || error?.message || "Something went wrong"}
    //         onClick={() => reset()}
    //       />
    //     )}
    //     {!updatePending && updateIsError && (
    //       <ErrorComponent
    //         message={(updateError as any)?.response?.data?.message || updateError?.message || "Something went wrong"}
    //         onClick={() => updateReset()}
    //       />
    //     )}

    //     {/* {toastMessage && (
    //       <CustomAlert
    //         onClose={() => setToastMessage(null)}
    //         message={toastMessage}
    //         type="success"
    //       />
    //     )} */}

    //     <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-ash-light">
    //       <h2 className="text-xl sm:text-2xl font-bold text-text-strong flex items-center gap-2">
    //         <div className="w-10 h-10 bg-brand-ash border border-ash-medium rounded-lg flex items-center justify-center text-action-primary shadow-sm">
    //           <i className={`fa-solid ${isEditing ? 'fa-edit' : 'fa-plus'} text-sm`}></i>
    //         </div>
    //         {/* {isEditing ? (
    //           <>
    //             <i className="fa-solid fa-edit"></i> Edit Project
    //           </>
    //         ) : (
    //           <>
    //             <i className="fa-solid fa-plus"></i> Create Project
    //           </>
    //         )} */}
    //         {isEditing ? 'Edit Project' : 'Create Project'}
    //       </h2>
    //       <button
    //         onClick={onClose}
    //         className="hover:bg-brand-ash text-text-soft hover:text-action-danger text-xl"
    //       >
    //         <i className="fa-solid fa-xmark"></i>
    //       </button>
    //     </div>

    //     <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //         <div>
    //           <label className="block text-sm font-medium text-text-muted mb-1">Project Name</label>
    //           <input
    //             autoFocus
    //             name="projectName"
    //             value={isEditing ? editForm.projectName : formData.projectName}
    //             onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
    //             type="text"
    //             placeholder="Enter name"
    //             className="input outline-none w-full bg-brand-surface border-2 text-text-main rounded-md px-3 py-2"
    //           />
    //           {errors.projectName && (
    //             <p className="text-action-danger text-xs mt-1">{errors.projectName}</p>
    //           )}
    //         </div>

    //         <div>
    //           <label className="block text-sm font-medium text-text-muted mb-1">Duration (days)</label>
    //           <input
    //             disabled
    //             type="number"
    //             name="duration"
    //             onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
    //             value={isEditing ? editForm.duration : formData.duration}
    //             placeholder="Ex: 15"
    //             className="input outline-none w-full bg-brand-ash border border-ash-medium rounded-md text-text-main px-3 py-2 cursor-not-allowed"
    //           />
    //         </div>
    //       </div>


    //       {/* <div className="col-span-1"> */}
    //       {/* <Label className="block text-sm font-medium text-slate-700 mb-2">Category</Label> */}
    //       {/* <Select onValueChange={(val: any) => setFormData(p => ({ ...p, category: val }))}>
    //           <SelectTrigger className="w-full">
    //             <SelectValue placeholder="Select height" selectedValue={formData.category} />
    //           </SelectTrigger>
    //           <SelectContent>
    //             {["residential", "commercial"].map((option) => (
    //               <SelectItem key={option} value={option.toString()}>
    //                 {option}mm
    //               </SelectItem>
    //             ))}
    //           </SelectContent>
    //         </Select> */}

    //       {/* <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
    //         <select
    //           name="category"
    //           onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
    //           value={isEditing ? editForm.category : formData.category}
    //           className="input w-full border border-gray-300 rounded-md px-3 py-2"
    //         >
    //           {category.map(category => (
    //             <option key={category} value={category}>{category}</option>
    //           ))}
    //         </select>
    //       </div> */}



    //       <div>
    //         <label className="block text-sm font-medium text-text-muted mb-1">Description</label>
    //         <textarea
    //           rows={3}
    //           name="description"
    //           onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
    //           value={isEditing ? editForm.description : formData.description}
    //           placeholder="Brief project overview"
    //           className="input outline-none w-full bg-brand-ash border border-ash-medium text-text-main rounded-md px-3 py-2 resize-none"
    //         />
    //       </div>
    //       {/* 
    //       <div>
    //         <label className="block text-sm font-medium text-text-muted mb-1">Tags</label>
    //         <TagInput
    //           tags={isEditing ? editForm.tags : formData.tags}
    //           setState={isEditing ? setEditForm : setFormData}
    //         />
    //       </div> */}

    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //         <div>
    //           <label className="block text-sm font-medium text-text-muted mb-1">Start Date</label>
    //           <input
    //             type="date"
    //             onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
    //             value={isEditing
    //               ? editForm.startDate ? editForm.startDate.toISOString().split('T')[0] : ""
    //               : formData.startDate ? formData.startDate.toISOString().split('T')[0] : ""
    //             }
    //             name="startDate"
    //             className="input outline-none w-full bg-brand-ash border border-ash-medium text-text-main rounded-md px-3 py-2"
    //           />
    //           {errors.startDate && (
    //             <p className="text-red-600 text-xs mt-1">{errors.startDate}</p>
    //           )}
    //         </div>

    //         <div>
    //           <label className="block text-sm font-medium text-text-muted mb-1">End Date</label>
    //           <input
    //             type="date"
    //             name="endDate"
    //             onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
    //             value={isEditing
    //               ? editForm.endDate ? editForm.endDate.toISOString().split('T')[0] : ""
    //               : formData.endDate ? formData.endDate.toISOString().split('T')[0] : ""
    //             }
    //             className="input outline-none w-full bg-brand-ash border border-ash-medium text-text-main rounded-md px-3 py-2"
    //           />
    //           {errors.endDate && (
    //             <p className="text-red-600 text-xs mt-1">{errors.endDate}</p>
    //           )}
    //         </div>

    //         <div>
    //           <label className="block text-sm font-medium text-text-muted mb-1">Due Date</label>
    //           <input
    //             type="date"
    //             name="dueDate"
    //             onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
    //             value={isEditing
    //               ? editForm.dueDate ? editForm.dueDate.toISOString().split('T')[0] : ""
    //               : formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ""
    //             }
    //             className="input outline-none w-full bg-brand-ash border border-ash-medium text-text-main rounded-md px-3 py-2"
    //           />
    //           {errors.dueDate && (
    //             <p className="text-red-600 text-xs mt-1">{errors.dueDate}</p>
    //           )}
    //         </div>
    //       </div>

    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //         <div>
    //           <label className="block text-sm font-medium text-text-muted mb-1">Priority</label>
    //           <select
    //             name="priority"
    //             onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
    //             value={isEditing ? editForm.priority : formData.priority}
    //             className="input w-full bg-brand-ash border border-ash-medium text-text-main rounded-md px-3 py-2"
    //           >
    //             {priorities.map(priority => (
    //               <option key={priority} value={priority}>{priority}</option>
    //             ))}
    //           </select>
    //         </div>

    //         <div>
    //           <label className="block text-sm font-medium text-text-muted mb-1">Status</label>
    //           <select
    //             name="status"
    //             onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
    //             value={isEditing ? editForm.status : formData.status}
    //             className="input w-full bg-brand-ash border border-ash-medium text-text-main rounded-md px-3 py-2"
    //           >
    //             {statuses.map(status => (
    //               <option key={status} value={status}>{status}</option>
    //             ))}
    //           </select>
    //         </div>
    //       </div>

    //       <div className="text-end">
    //         <Button
    //           isLoading={isPending || updatePending}
    //           type="submit"
    //           disabled={isPending || updatePending}
    //           // className="bg-blue-600 text-white px-6 w-full sm:w-40 py-2 rounded-xl hover:bg-blue-700 transition-all"
    //           variant="dark"
    //           className=" h-11 w-full sm:w-50 px-10 shadow-lg font-black text-xs uppercase tracking-widest"
    //         >
    //           {/* {isPending || updatePending ? (
    //             <div className="mx-auto w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
    //           ) : isEditing ? "Edit Project" : "Create Project"} */}
    //           {isEditing ? "Update Project" : "Create Project"}
    //         </Button>
    //       </div>
    //     </form>
    //   </div>

    // </>


    <div
      onClick={(e) => e.stopPropagation()}
      // Removed overflow-y-auto and tightened padding to prevent scrolling
      // className="bg-brand-surface w-full h-full max-w-4xl mx-auto rounded-2xl shadow-2xl p-4 sm:p-5 border border-ash-medium relative"
      className="bg-brand-surface w-full h-[90%] max-w-4xl mx-auto rounded-2xl shadow-2xl  p-4 sm:p-5  border border-ash-medium flex flex-col"
    >
      {!isPending && isError && (
        <ErrorComponent
          message={(error as any)?.response?.data?.message || error?.message || "Something went wrong"}
          onClick={() => reset()}
        />
      )}
      {!updatePending && updateIsError && (
        <ErrorComponent
          message={(updateError as any)?.response?.data?.message || updateError?.message || "Something went wrong"}
          onClick={() => updateReset()}
        />
      )}

      <div className="flex flex-shrink-0 justify-between items-center mb-3 border-b border-ash-light pb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-text-strong flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-ash border border-ash-medium rounded-lg flex items-center justify-center text-action-primary shadow-sm">
            <i className={`fa-solid ${isEditing ? 'fa-edit' : 'fa-plus'} text-sm`}></i>
          </div>
          {isEditing ? 'Edit Project' : 'Create Project'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="hover:bg-brand-ash text-text-soft hover:text-action-danger text-xl"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>


      {/* Tightened space-y-3 to prevent vertical scrolling */}
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">

        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3">
          {/* ROW 1: Project Name & Client Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Project Name</label>
              <input
                autoFocus
                name="projectName"
                value={isEditing ? editForm.projectName : formData.projectName}
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                type="text"
                placeholder="Enter project name"
                className="input outline-none w-full bg-brand-surface border-2 border-ash-dark text-text-main rounded-md px-3 py-1.5"
              />
              {errors.projectName && (
                <p className="text-action-danger text-xs mt-1">{errors.projectName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Client Name</label>
              <input
                name="clientName"
                value={isEditing ? editForm.clientName : formData.clientName}
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                type="text"
                placeholder="Enter client name"
                className="input outline-none w-full bg-brand-surface border-2 border-ash-dark text-text-main rounded-md px-3 py-1.5"
              />
            </div>
          </div>

          {/* ROW 2: Email & WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
              <input
                name="email"
                value={isEditing ? editForm.email : formData.email}
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                type="email"
                placeholder="client@example.com"
                className="input outline-none w-full bg-brand-surface border-2 border-ash-dark text-text-main rounded-md px-3 py-1.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">WhatsApp Number</label>
              <input
                name="whatsapp"
                value={isEditing ? editForm.whatsapp : formData.whatsapp}
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                type="tel"
                placeholder="Enter WhatsApp number"
                className="input outline-none w-full bg-brand-surface border-2 border-ash-dark text-text-main rounded-md px-3 py-1.5"
              />
            </div>
          </div>

          {/* ROW 3: Location & Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Location</label>
              <input
                name="location"
                value={isEditing ? editForm.location : formData.location}
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                type="text"
                placeholder="Enter location"
                className="input outline-none w-full bg-brand-surface border-2 border-ash-dark text-text-main rounded-md px-3 py-1.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Budget</label>
              {/* <Select
                value={isEditing ? editForm.budget : formData.budget}
                onValueChange={(val) => isEditing ? setEditForm(p => ({ ...p, budget: val })) : setFormData(p => ({ ...p, budget: val }))}
              >
                <SelectTrigger className="bg-brand-surface border-2 !border-ash-dark focus:!border-ash-dark focus:!ring-ash-dark">
                  <SelectValue placeholder="Select Budget" />
                </SelectTrigger>
                <SelectContent>
                  {["Fixed budget", "Own interiors", "Custom architect designs"].map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

              <input
                name="budget"
                value={isEditing ? editForm.budget : formData.budget}
                onChange={(e) => {
                  if (Number(e.target.value) >= 0)
                    handleChange(e, isEditing ? setEditForm : setFormData)
                }}
                type="number"
                placeholder="Enter budget"
                className="input outline-none w-full bg-brand-surface border-2 border-ash-dark text-text-main rounded-md px-3 py-1.5"
              />
            </div>
          </div>

          {/* ROW 4: Design Type & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Design Type</label>
              <Select
                value={isEditing ? editForm.designType : formData.designType}
                onValueChange={(val) => isEditing ? setEditForm(p => ({ ...p, designType: val })) : setFormData(p => ({ ...p, designType: val }))}
              >
                <SelectTrigger className="bg-brand-surface border-2  !border-ash-dark focus:!border-ash-dark focus:!ring-ash-dark">
                  <SelectValue placeholder="Select Design Type" />
                </SelectTrigger>
                <SelectContent>
                  {["Modern", "Minimalist", "Traditional", "Industrial"].map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Duration (days)</label>
              <input
                disabled
                type="number"
                name="duration"
                value={isEditing ? editForm.duration : formData.duration}
                placeholder="Ex: 15"
                className="input outline-none w-full bg-brand-ash border border-ash-medium rounded-md text-text-main px-3 py-1.5 cursor-not-allowed"
              />
            </div>
          </div>

          {/* ROW 5: Description */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Description</label>
            <textarea
              rows={2}
              name="description"
              onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
              value={isEditing ? editForm.description : formData.description}
              placeholder="Brief project overview"
              className="input outline-none w-full bg-brand-surface border-2 border-ash-dark text-text-main rounded-md px-3 py-1.5 resize-none"
            />
          </div>

          {/* ROW 6: Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Start Date</label>
              <input
                type="date"
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                value={isEditing
                  ? editForm.startDate ? editForm.startDate.toISOString().split('T')[0] : ""
                  : formData.startDate ? formData.startDate.toISOString().split('T')[0] : ""
                }
                name="startDate"
                className="input outline-none w-full bg-brand-surface border-2 border-ash-dark text-text-main rounded-md px-3 py-1.5"
              />
              {errors.startDate && (
                <p className="text-red-600 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                value={isEditing
                  ? editForm.endDate ? editForm.endDate.toISOString().split('T')[0] : ""
                  : formData.endDate ? formData.endDate.toISOString().split('T')[0] : ""
                }
                className="input outline-none w-full bg-brand-surface border-2 border-ash-dark text-text-main rounded-md px-3 py-1.5"
              />
              {errors.endDate && (
                <p className="text-red-600 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                value={isEditing
                  ? editForm.dueDate ? editForm.dueDate.toISOString().split('T')[0] : ""
                  : formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ""
                }
                className="input outline-none w-full bg-brand-surface border-2 border-ash-dark text-text-main rounded-md px-3 py-1.5"
              />
              {errors.dueDate && (
                <p className="text-red-600 text-xs mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* ROW 7: Priority & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Priority</label>
              <select
                name="priority"
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                value={isEditing ? editForm.priority : formData.priority}
                className="input outline-none w-full bg-brand-surface border-2 border-ash-dark text-text-main rounded-md px-3 py-1.5"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Status</label>
              <select
                name="status"
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                value={isEditing ? editForm.status : formData.status}
                className="input outline-none w-full bg-brand-surface border-2 border-ash-dark text-text-main rounded-md px-3 py-1.5"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>


          <div className=" space-y-2 leading-relaxed pr-2">
            <p className="font-semibold text-text-main">
              Terms & Conditions – {COMPANY_DETAILS.COMPANY_NAME}
            </p>

            <p>
              By proceeding with project creation, you agree to the following:
            </p>

            <p className="font-medium">Payment Milestones</p>

            <ul className="list-disc pl-4 space-y-1">
              <li>
                Booking Advance: INR 10,000 (fixed) – Site visit, discussion, proposal
              </li>
              <li>
                Design Approval: INR 15,000 (fixed) – 2D/3D design, site measurement, BOQ
              </li>
              <li>
                Procurement: 80% of total – Material purchase, fabrication initiation
              </li>
              <li>
                Execution: 10% of total – Installation, finishing, electrical/plumbing
              </li>
              <li>
                Handover: 10% of total – Snag closure, cleaning, final handover
              </li>
            </ul>

            <p className="font-medium">Payment Terms & Conditions</p>

            <ul className="list-disc pl-4 space-y-1">
              <li>
                Delayed Payments: Interest of 2% per month applies after 5 working days.
              </li>
              <li>
                GST: Added as applicable by law.
              </li>
              <li>
                Forfeiture Clause: If the next milestone is not paid within 7 days, previous fixed payments (INR 25,000) are forfeited. {COMPANY_DETAILS.COMPANY_NAME} reserves the right to suspend the project.
              </li>
              <li>
                Legal Validity: Acceptance via digital/physical signature or email is enforceable under the IT Act, 2000.
              </li>
            </ul>


            <p>
              By selecting “I accept Terms & Conditions”, you confirm that you have read, understood, and agreed to the above.
            </p>
          </div>

          {/* <div className="text-end pt-2">
            <Button
              isLoading={isPending || updatePending}
              type="submit"
              disabled={isPending || updatePending}
              variant="dark"
              className="h-10 w-full sm:w-50 px-10 shadow-lg font-black text-xs uppercase tracking-widest"
            >
              {isEditing ? "Update Project" : "Create Project"}
            </Button>
          </div> */}
        </div>



        <div className="flex-shrink-0 border-t border-ash-light p-4 bg-brand-surface space-y-3">

          {/* TERMS (scrollable small box) */}


          {/* CHECKBOX + BUTTON ROW */}
          <div className="flex justify-between items-center">
            {/* LEFT: checkbox */}
            <div className="flex items-center gap-2">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="cursor-pointer"
              />

              <label
                htmlFor="acceptTerms"
                className="text-sm text-text-muted cursor-pointer"
              >
                I accept Terms & Conditions
              </label>
            </div>

            {/* RIGHT: button */}
            <Button
              isLoading={isPending || updatePending}
              type="submit"
              disabled={!acceptedTerms || isPending || updatePending}
              variant="dark"
              className="h-10 px-6 shadow-lg font-black text-xs uppercase tracking-widest"
            >
              {isEditing ? "Update Project" : "Create Project"}
            </Button>

          </div>
        </div>

      </form>
    </div >
  );
};

export default memo(CreateProject);