import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { useDeleteMainTask } from '../../apiList/StaffTasks Api/staffTaskApi'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

type Props = {
    task:any
}
const StaffTaskCard:React.FC<Props> = ({task}) => {
    const navigate = useNavigate()


       const { mutateAsync: deleteTask } = useDeleteMainTask()

    const handleDelete = async (taskId: string) => {
        const confirm = window.confirm("Are you sure you want to delete this task?")
        if (!confirm) return
        await deleteTask({ mainTaskId: taskId })
    }

    const handleView = (taskId: string) => {
        navigate(`single/${taskId}`)
    }


  return (
    <Card key={task._id} className="p-0 border-l-4 border-blue-600">
                                    <CardHeader>
                                        <CardTitle>{task.title}</CardTitle>
                                        <CardDescription className="text-xs mt-1">{task.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-sm">
                                            <i className="fa-solid fa-calendar-days mr-2 text-blue-600" />
                                            Due: {new Date(task.due).toLocaleString()}
                                        </p>
                                        <p className="text-sm">
                                            <i className="fa-solid fa-layer-group mr-2 text-purple-600" />
                                            Subtasks: {task.tasks.length}
                                        </p>
                                        <p className="text-sm capitalize">
                                            <i className="fa-solid fa-star mr-2 text-yellow-500" />
                                            Priority: {task.priority}
                                        </p>
                                        <p className="text-sm capitalize">
                                            <i className="fa-solid fa-building mr-2 text-indigo-500" />
                                            Department: {task.department}
                                        </p>
    
                                        {/* Actions */}
                                        <div className="flex gap-2 mt-3">
                                            <Button
                                            size='sm'
                                                onClick={() => handleView(task._id)}
                                                className=""
                                            >
                                                <i className="fa-solid fa-eye mr-1" />
                                                View
                                            </Button>
                                            <Button
                                            size='sm'
                                                onClick={() => handleDelete(task._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                                            >
                                                <i className="fa-solid fa-trash mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
  )
}

export default StaffTaskCard