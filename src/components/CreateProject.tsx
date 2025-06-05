import React, { Fragment, useState, type ChangeEvent, type FormEvent } from "react";
import TagInput from "../shared/TagInput";

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

const statusColors: Record<string, string> = {
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
  startDate: Date,
  endDate: Date | null,
  dueDate: Date | null,
  priority: string,
  status: string,
}

const CreateProject = ({ onClose }: { onClose: () => void }) => {

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target

    if (name === "tags") {
      setFormData(p => ({ ...p, tags: ([...formData.tags, value]) }))
      return;
    }

    if (name.includes("Date")) {
      console.log(name)
      setFormData(p => ({ ...p, [name]: new Date(e.target.value) }))
      return;
    }

    setFormData(p => ({ ...p, [name]: value }))

  }


  const handleSubmit = (e:FormEvent)=>{
    e.preventDefault()

    console.log("formDate", formData)
  }

  return (
    // DESIGN TWO 
    <div className="bg-white w-full max-w-2xl mx-auto rounded-2xl shadow-2xl p-8 border border-gray-200 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Create New Project
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input name="projectName" value={formData.projectName} onChange={handleChange} type="text" placeholder="Enter name" className="input border-b-1 border-[#565656]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
            <input type="number" name="duration" onChange={handleChange} value={formData.duration} placeholder="Ex: 15" className="input border-b-1 border-[#565656]" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows={3} name="description" onChange={handleChange} value={formData.description} placeholder="Brief project overview" className="input w-full border-1 border-[#565656] resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <TagInput tags={formData.tags} setFormData={setFormData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" onChange={handleChange} value={formData.startDate.toISOString().split('T')[0]} name="startDate" className="input border-b-1 border-[#565656]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" name="endDate" onChange={handleChange} value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ""} className="input border-b-1 border-[#565656]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input type="date" name="dueDate" onChange={handleChange} value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ""} className="input border-b-1 border-[#565656]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select name="priority" onChange={handleChange} value={formData.priority} className="input border-b-1 border-[#565656]">
              {priorities.map(priority => {
                return (
                  <Fragment key={priority}>
                    <option  value={priority}>{priority}</option>
                  </Fragment>
                )
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" onChange={handleChange} value={formData.status} className="input border-b-1 border-[#155dfc]">
              {statuses.map(status => {
                return (
                  <Fragment key={status}>
                    <option className={`${statusColors[status]}`} value={status}>{status}</option>
                  </Fragment>
                )
              })}
            </select>
          </div>
        </div>

        <div className="text-end">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all">
            Create Project
          </button>
        </div>
      </form>
    </div>

  );
};

export default CreateProject;