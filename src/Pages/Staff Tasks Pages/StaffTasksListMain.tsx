import React, { useState } from "react"

import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { useGetAllStaffTasks } from "../../apiList/StaffTasks Api/staffTaskApi"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../components/ui/Select"
import type { AvailableProjetType } from "../Department Pages/Logistics Pages/LogisticsShipmentForm"
import { useGetProjects } from "../../apiList/projectApi"
import { useGetAllUsers } from "../../apiList/getAll Users Api/getAllUsersApi"
import SearchSelectNew from "../../components/ui/SearchSelectNew"
import { Button } from "../../components/ui/Button"
import StaffTaskCard from "./StaffTaskCard"
import MaterialOverviewLoading from "../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading"

// Types
type FilterType = {
    status?: string
    priority?: string
    department?: string
    assigneeId?: string | null
    assigneeName?: string
    projectId?: string
    projectName?: string
    overdue?: boolean
}

const statusOptions = ["queued", "in_progress", "paused", "done"]
const priorityOptions = ["low", "medium", "high"]
const departmentOptions = ["site", "procurement", "design", "accounts"]

export const StaffTasksListMain: React.FC = () => {
    const { organizationId } = useParams() as { organizationId: string }
    const [filters, setFilters] = useState<FilterType>({})
    const navigate = useNavigate()
    const location = useLocation()

    const { data: tasks, isLoading, isError, error, refetch } = useGetAllStaffTasks(filters)

    const { data } = useGetProjects(organizationId!)
    const { data: staffList } = useGetAllUsers(organizationId!, "staff");

    const staffOptions = (staffList || [])?.map((staff: { _id: string, email: string, staffName: string }) => ({
        value: staff._id,
        label: staff.staffName,
        email: staff.email
    })) || [];

    // console.log("data", data)
    const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))




    const clearFilters = () => setFilters({})
    const activeFiltersCount = Object.values(filters).filter(Boolean).length


    let isChild = location.pathname.includes("single") || location.pathname.includes("addtask")

    if (isChild) {
        return <Outlet />
    }

    return (
       

        <div className="p-2 h-full ">
            <header className="flex justify-between items-center w-full">


                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-dolly mr-3 text-blue-600"></i>
                        Tasks

                    </h2>
                    <p className="text-gray-600 mt-1">
                        Manage & Assign Tasks to your team members
                    </p>
                </div>
                <Button
                    onClick={() => {
                        navigate(`addtask`)
                    }}
                    className="bg-blue-600  cursor-pointer "
                >
                    Add Task
                </Button>
            </header>

            <section className="py-2 flex w-full gap-6 flex-col lg:flex-row items-start h-[90%]">

                {/* Filter Panel - LEFT (30%) */}
                <div className="lg:w-1/3 xl:w-1/4 w-full">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <i className="fas fa-filter mr-2 text-blue-600" />
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
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <Select
                                    value={filters.status}
                                    onValueChange={(val) =>
                                        setFilters(prev => ({ ...prev, status: val }))
                                    }
                                >
                                    <SelectTrigger className="bg-white w-full">
                                        <SelectValue placeholder="Select status" selectedValue={filters.status} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <Select
                                    value={filters.priority}
                                    onValueChange={(val) =>
                                        setFilters(prev => ({ ...prev, priority: val }))
                                    }
                                >
                                    <SelectTrigger className="bg-white w-full">
                                        <SelectValue placeholder="Select priority" selectedValue={filters.priority} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorityOptions.map(priority => (
                                            <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <Select
                                    value={filters.department}
                                    onValueChange={(val) =>
                                        setFilters(prev => ({ ...prev, department: val }))
                                    }
                                >
                                    <SelectTrigger className="bg-white w-full">
                                        <SelectValue placeholder="Select department" selectedValue={filters.department} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departmentOptions.map(dep => (
                                            <SelectItem value={dep} key={dep}>{dep}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Assignee SearchSelect */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                                <SearchSelectNew
                                    options={staffOptions}
                                    placeholder="Select assignee"
                                    searchPlaceholder="Search by name..."
                                    value={filters.assigneeId || ''}
                                    onValueChange={(value) => {
                                        const selected = staffList?.find((s: any) => s._id === value)
                                        setFilters(prev => ({
                                            ...prev,
                                            assigneeId: value || null,
                                            assigneeName: selected?.staffName || ""
                                        }))
                                    }}
                                    searchBy="name"
                                    displayFormat="detailed"
                                    className="w-full"
                                />
                            </div>

                            {/* Project Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                                <select
                                    value={filters.projectId || ''}
                                    onChange={(e) => {
                                        const selected = projects.find((p: any) => p._id === e.target.value)
                                        setFilters(prev => ({
                                            ...prev,
                                            projectId: selected?._id,
                                            projectName: selected?.projectName
                                        }))
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Projects</option>
                                    {projects?.map((project: any) => (
                                        <option key={project._id} value={project._id}>
                                            {project.projectName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Overdue */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Overdue</label>
                                <Select
                                    value={filters.overdue?.toString() || ""}
                                    onValueChange={(val: any) => {
                                        setFilters(prev => ({
                                            ...prev,
                                            overdue: val === "true"
                                        }))
                                    }}
                                >
                                    <SelectTrigger className="bg-white w-full">
                                        <SelectValue placeholder="Overdue?" selectedValue={filters.overdue?.toString()} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="false">No</SelectItem>
                                        <SelectItem value="true">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards / Results - RIGHT (70%) */}
                <div className="flex-1 w-full overflow-y-auto  h-[100%]">
                    {/* <header className="mb-6 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-blue-900">Task List</h2>
                        <Button onClick={() => navigate("addtask")} className="bg-blue-600">
                            + Add Task
                        </Button>
                    </header> */}

                    {isLoading && <MaterialOverviewLoading />}


                    {isError && (
                        <div className="max-w-xl sm:min-w-[80%]  mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                            <div className="text-red-600 font-semibold mb-2 text-xl sm:text-3xl">
                                ⚠️ Error Occurred
                            </div>
                            <p className="text-red-500  mb-4 text-lg sm:text-xl">
                                {(error as any)?.response?.data?.message || "Failed to load data"}
                            </p>
                            <Button
                                onClick={() => refetch()}
                                className="bg-red-600 text-white px-4 py-2"
                            >
                                Retry
                            </Button>
                        </div>)}

                    {!isLoading && !isError && tasks?.length === 0 && (
                       
                        <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
                            <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Tasks Found</h3>
                            <p className="text-sm text-gray-500">
                                Looks like there are no tasks assigned yet <br />
                                Click on <strong>"Add task"</strong> to get started 🚀
                            </p>
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tasks?.map((task: any) => (
                            <StaffTaskCard key={task._id} task={task} />
                        ))}
                    </div>
                </div>
            </section>

        </div>
    )
}

export default StaffTasksListMain