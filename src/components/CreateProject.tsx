import React, { memo, useState, type ChangeEvent, type FormEvent } from "react";
import TagInput from "../shared/TagInput";
import { useCreateProject, useUpdateProject } from "../apiList/projectApi";
import ErrorComponent from "./ErrorComponent";
import { handleProjectValidate } from "../utils/validation";
import { toast } from "../utils/toast";
import { Button } from "./ui/Button";
// import { Label } from "./ui/Label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";

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

export const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Delayed: "bg-red-100 text-red-800",
  "In Progress": "bg-blue-100 text-blue-800",
  "In Testing": "bg-yellow-100 text-yellow-800",
  "On Track": "bg-emerald-100 text-emerald-800",
  "On Hold": "bg-gray-100 text-gray-800",
  Approved: "bg-indigo-100 text-indigo-800",
  Cancelled: "bg-rose-100 text-rose-800",
  Planning: "bg-purple-100 text-purple-800",
  Invoice: "bg-pink-100 text-pink-800",
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
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // const [toastMessage, setToastMessage] = useState<string | null>(null);


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
    <>

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full h-full overflow-y-auto custom-scrollbar max-w-3xl mx-auto rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-200 relative"
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

        {/* {toastMessage && (
          <CustomAlert
            onClose={() => setToastMessage(null)}
            message={toastMessage}
            type="success"
          />
        )} */}

        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 flex items-center gap-2">
            {isEditing ? (
              <>
                <i className="fa-solid fa-edit"></i> Edit Project
              </>
            ) : (
              <>
                <i className="fa-solid fa-plus"></i> Create Project
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                autoFocus
                name="projectName"
                value={isEditing ? editForm.projectName : formData.projectName}
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                type="text"
                placeholder="Enter name"
                className="input outline-none w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.projectName && (
                <p className="text-red-600 text-xs mt-1">{errors.projectName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
              <input
                disabled
                type="number"
                name="duration"
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                value={isEditing ? editForm.duration : formData.duration}
                placeholder="Ex: 15"
                className="input outline-none w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>


          {/* <div className="col-span-1"> */}
            {/* <Label className="block text-sm font-medium text-slate-700 mb-2">Category</Label> */}
            {/* <Select onValueChange={(val: any) => setFormData(p => ({ ...p, category: val }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select height" selectedValue={formData.category} />
              </SelectTrigger>
              <SelectContent>
                {["residential", "commercial"].map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}mm
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
              value={isEditing ? editForm.category : formData.category}
              className="input w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {category.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div> */}



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              name="description"
              onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
              value={isEditing ? editForm.description : formData.description}
              placeholder="Brief project overview"
              className="input outline-none w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <TagInput
              tags={isEditing ? editForm.tags : formData.tags}
              setState={isEditing ? setEditForm : setFormData}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                value={isEditing
                  ? editForm.startDate ? editForm.startDate.toISOString().split('T')[0] : ""
                  : formData.startDate ? formData.startDate.toISOString().split('T')[0] : ""
                }
                name="startDate"
                className="input outline-none w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.startDate && (
                <p className="text-red-600 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                value={isEditing
                  ? editForm.endDate ? editForm.endDate.toISOString().split('T')[0] : ""
                  : formData.endDate ? formData.endDate.toISOString().split('T')[0] : ""
                }
                className="input outline-none w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.endDate && (
                <p className="text-red-600 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                value={isEditing
                  ? editForm.dueDate ? editForm.dueDate.toISOString().split('T')[0] : ""
                  : formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ""
                }
                className="input outline-none w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.dueDate && (
                <p className="text-red-600 text-xs mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                value={isEditing ? editForm.priority : formData.priority}
                className="input w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                onChange={(e) => handleChange(e, isEditing ? setEditForm : setFormData)}
                value={isEditing ? editForm.status : formData.status}
                className="input w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-end">
            <Button
              isLoading={isPending || updatePending}
              type="submit"
              disabled={isPending || updatePending}
              className="bg-blue-600 text-white px-6 w-full sm:w-40 py-2 rounded-xl hover:bg-blue-700 transition-all"
            >
              {isPending || updatePending ? (
                <div className="mx-auto w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : isEditing ? "Edit Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </div>

    </>
  );
};

export default memo(CreateProject);