import React, { Fragment, memo, useState, type ChangeEvent, type FormEvent } from "react";
import TagInput from "../shared/TagInput";
import { useCreateProject, useUpdateProject } from "../apiList/projectApi";
import ErrorComponent from "./ErrorComponent";
import { handleProjectValidate } from "../utils/validation";
import CustomAlert from "./CustomAlert";

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
  tags: string[],
  startDate: Date | null,
  endDate: Date | null,
  dueDate: Date | null,
  priority: string,
  status: string,
}


type CreateProjectProp = {
  onClose: () => void,
  setEditForm: React.Dispatch<React.SetStateAction<ProjectInput>>,
  editForm: ProjectInput,
  isEditing: boolean,
  editProjectId: string | null,
  organizationId:string
}

const CreateProject: React.FC<CreateProjectProp> = ({ onClose, organizationId, isEditing, setEditForm, editForm, editProjectId }) => {

  const [formData, setFormData] = useState<ProjectInput>({
    projectName: "",
    description: "",
    duration: 0,
    tags: [],
    startDate: new Date(),
    endDate: null,
    dueDate: null,
    priority: "none",
    status: "Active",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<string | null>(null);


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

        // if (
        //   name === "startDate" &&
        //   updated.endDate && newDate &&
        //   updated.endDate <= newDate
        // ) {
        //   alert("Start Date must be before end date");
        //   return prev;
        // }

        // if (
        //   name === "endDate" &&
        //   updated.startDate && newDate &&
        //   newDate <= updated.startDate
        // ) {
        //   alert("End date must be after start date.");
        //   return prev;
        // }

        // if (
        //   name === "dueDate" &&
        //   updated.startDate && newDate &&
        //   newDate <= updated.startDate
        // ) {
        //   alert("Due date must be after start date.");
        //   return prev;
        // }

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

  const { mutate: createProject, isPending, error, isError, reset } = useCreateProject()
  const { mutate: updateProject, isPending: updatePending, error: updateError, isError: updateIsError, reset: updateReset } = useUpdateProject()

  // console.log("error of creating", error)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()


    try {
      const validationErrors = isEditing ? handleProjectValidate(editForm) : handleProjectValidate(formData)
      setErrors(validationErrors);

      // console.log("validationErrors", validationErrors)

      if (Object.keys(validationErrors).length === 0) {

        if (isEditing && editProjectId) {
          if (!updatePending) {
            console.log("editForm", editForm)
            updateProject({ projectId: editProjectId, formData: editForm }, {
              onSuccess: (data) => {
                setToast(data.message)
              }, 
            }
            )
          }
        }
        else {
          if (!isPending) {
            // console.log("formData", formData)
            createProject({projectData:formData, orgsId:organizationId},{
              onSuccess: (data) => {
                setToast((data as any)?.message || "project created successfully")
              }
            })
          }
        }
      }
    }
    catch (error) {
      console.log("error", error)
    }
  }



  return (
    <>
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-2xl mx-auto rounded-2xl shadow-2xl p-8 border  border-gray-200 relative">

        {!isPending && isError && <ErrorComponent message={(error as any)?.response?.data?.message || error?.message || "Something went wrong"} onClick={() => reset()} />}
        {!updatePending && updateIsError && <ErrorComponent message={(updateError as any)?.response?.data?.message || updateError?.message || "Something went wrong"} onClick={() => updateReset()} />}

        {toast && <CustomAlert onClose={() => setToast(null)} message={toast} type="success" />}


        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            {isEditing ?
              <><i className="fa-solid fa-edit"></i> Edit Project</> :
              <><i className="fa-solid fa-plus"></i> Create Project</>}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input autoFocus name="projectName" value={isEditing ? editForm.projectName : formData.projectName} onChange={(e) => handleChange(e, (isEditing ? setEditForm : setFormData))} type="text" placeholder="Enter name" className="input outline-none border-b-1 border-[#565656]" />
              {errors.projectName && (
                <p className="text-red-600 text-sm mt-1">{errors.projectName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
              <input disabled type="number" name="duration" onChange={(e) => handleChange(e, (isEditing ? setEditForm : setFormData))} value={isEditing ? editForm.duration : formData.duration} placeholder="Ex: 15" className="input outline-none border-b-0 border-[#565656]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} name="description" onChange={(e) => handleChange(e, (isEditing ? setEditForm : setFormData))} value={isEditing ? editForm.description : formData.description} placeholder="Brief project overview" className="input outline-none w-full border-1 border-[#565656] resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <TagInput tags={isEditing ? editForm.tags : formData.tags} setState={isEditing ? setEditForm : setFormData} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" onChange={(e) => handleChange(e, (isEditing ? setEditForm : setFormData))}
                value={isEditing ? editForm.startDate ? editForm.startDate.toISOString().split('T')[0] : "" : formData.startDate ? formData.startDate.toISOString().split('T')[0] : ""}
                name="startDate" className="input outline-none border-b-1 border-[#565656]" />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" name="endDate" onChange={(e) => handleChange(e, (isEditing ? setEditForm : setFormData))}
                value={isEditing ? editForm?.endDate?.toISOString().split('T')[0] : formData.endDate ? formData.endDate.toISOString().split('T')[0] : ""}
                className="input outline-none border-b-1 border-[#565656]" />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" name="dueDate"
                onChange={(e) => handleChange(e, (isEditing ? setEditForm : setFormData))}
                value={isEditing ? editForm?.dueDate?.toISOString().split('T')[0] : formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ""}
                className="input outline-none border-b-1 border-[#565656]" />
              {errors.dueDate && (
                <p className="text-red-600 text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select name="priority" onChange={(e) => handleChange(e, (isEditing ? setEditForm : setFormData))} value={isEditing ? editForm.priority : formData.priority} className="input border-b-1 border-[#565656]">
                {priorities.map(priority => {
                  return (
                    <Fragment key={priority}>
                      <option className="cursor-pointer" value={priority}>{priority}</option>
                    </Fragment>
                  )
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" onChange={(e) => handleChange(e, (isEditing ? setEditForm : setFormData))} value={isEditing ? editForm.status : formData.status} className="input cursor-pointer border-b-1 border-[#565656]">
                {statuses.map(status => {
                  return (
                    <Fragment key={status}>
                      <option className={`${statusColors[status]} cursor-pointer`} value={status}>{status}</option>
                    </Fragment>
                  )
                })}
              </select>
            </div>
          </div>

          <div className="text-end">
            <button type="submit" disabled={isPending || updatePending} className="bg-blue-600 text-white px-6 w-40 cursor-pointer py-2 rounded-xl hover:bg-blue-700 transition-all">
              {isPending || updatePending ? <div className=" mx-auto w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                : isEditing ? "Edit Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default memo(CreateProject);