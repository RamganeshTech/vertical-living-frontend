import React, { useState } from "react";

const priorities = ["None", "Low", "Medium", "High"];
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

const CreateProject = ({onClose}: {onClose: ()=> void}) => {
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

  <form className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
        <input type="text" placeholder="Enter name" className="input border-b-1 border-[#565656]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
        <input type="number" placeholder="Ex: 15" className="input border-b-1 border-[#565656]" />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea rows={3} placeholder="Brief project overview" className="input w-full border-1 border-[#565656] resize-none" />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
      <input type="text" placeholder="Type & press Enter" className="input border-b-1 border-[#565656]" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input type="date" className="input border-b-1 border-[#565656]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input type="date" className="input border-b-1 border-[#565656]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input type="date" className="input border-b-1 border-[#565656]" />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select className="input border-b-1 border-[#565656]">
          <option value="None">None</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select className="input border-b-1 border-[#155dfc]">
          <option className="text-blue-600" value="Active">Active</option>
          <option className="text-orange-600" value="Delayed">Delayed</option>
          <option className="text-yellow-600" value="In Progress">In Progress</option>
          <option className="text-purple-600" value="In Testing">In Testing</option>
          <option className="text-green-600" value="On Track">On Track</option>
          <option className="text-gray-600" value="On Hold">On Hold</option>
          <option className="text-green-700" value="Approved">Approved</option>
          <option className="text-red-600" value="Cancelled">Cancelled</option>
          <option className="text-cyan-700" value="Planning">Planning</option>
          <option className="text-indigo-600" value="Invoice">Invoice</option>
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



