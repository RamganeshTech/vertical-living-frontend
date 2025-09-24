// import React, { useState } from 'react'
// import { Label } from '../../../components/ui/Label'
// import SearchSelectNew from '../../../components/ui/SearchSelectNew'
// import { dateFormate, formatTime } from '../../../utils/dateFormator'

// type Props = {
//     allTasks: any[]
// }
// const DependentTaskList:React.FC<Props> = ({allTasks}) => {

//     const [search, setSearch] = useState("")
//     const availableDependentTasks = allTasks
//   .filter((task) => task?.status !== "done")
//   .map((task) => ({
//     value: task._id,
//     label: `${task.title} (${task?.assigneeId?.staffName ?? 'Unassigned'})`,
//     extra: {
//       due: task.due,
//       assignee: task?.assigneeId?.staffName || ""
//     }
//   }))


//   return (
//       <>

//   <div className="col-span-full">
//     <Label>Select Required Tasks</Label>
  
//     <div className="grid md:grid-cols-2 mt-2 gap-3 text-sm text-blue-700">
//       {availableDependentTasks?.map((task:any) => {
//         return (
//           <div className="bg-blue-50 p-3 rounded border" key={task._id}>
//             <strong>{task?.title || "N/A"}</strong>
//             {task?.due && (
//               <div className="text-xs text-gray-500">Due: 
//                             <p className="text-blue-800 font-medium">{task?.due ? <>{dateFormate(task.due)} - {formatTime(task.due)}</>: "N/A"}</p>
              
//               </div>
//             )}
//           </div>
//         )
//       })}
//     </div>
//   </div>
//   </>
//   )
// }

// export default DependentTaskList


// src/components/stafftasks/DependentTaskList.tsx

import React, { useMemo, useState } from "react";
import { Label } from "../../../components/ui/Label";
import { dateFormate, formatTime } from "../../../utils/dateFormator";

type Props = {
  allTasks: any[];
  selected: string[];
  onChange: (ids: string[]) => void;
};

const DependentTaskList: React.FC<Props> = ({ allTasks, selected, onChange }) => {
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();

    return allTasks
      .filter((task) => task?.status !== "done")
      .filter((task) =>
        !search ? true : task?.title?.toLowerCase().includes(lowerSearch)
      );
  }, [allTasks, search]);

  const toggleSelection = (taskId: string) => {
    const alreadyIncluded = selected.includes(taskId);
    const updated = alreadyIncluded
      ? selected.filter((id) => id !== taskId)
      : [...selected, taskId];
    onChange(updated);
  };

  return (
    <div className="col-span-full mt-4">
      <Label htmlFor="searchDependencies">Search Tasks</Label>
      <input
        id="searchDependencies"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-2 mb-3 w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:ring-blue-400 outline-none"
      />

      {filteredTasks?.length === 0 && (
        <div className="text-gray-500 mt-2">No matching tasks found.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        {filteredTasks.map((task: any) => {
          const isSelected = selected.includes(task._id);

          return (
            <div
              key={task._id}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                isSelected
                  ? "bg-blue-100 border-blue-400"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => toggleSelection(task._id)}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-600"
                  checked={isSelected}
                  onChange={() => toggleSelection(task._id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">{task.title || "N/A"}</p>
                  <p className="text-sm text-gray-600">
                    Assigned to: {task?.assigneeId?.staffName || "Unassigned"}
                  </p>
                  {task?.due && (
                    <p className="text-sm text-blue-700">
                      Due: {dateFormate(task.due)} - {formatTime(task.due)}
                    </p>
                  )}
                                    <p className="text-sm text-gray-600">
                    Status: {task?.status || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DependentTaskList;