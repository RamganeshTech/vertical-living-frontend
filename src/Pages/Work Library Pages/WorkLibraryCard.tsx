import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from '../../components/ui/Button';
import { useAuthCheck } from '../../Hooks/useAuthCheck';

type Props = {
    work: any
    role: string | null
    onDelete: (id: string) => any,
    deletePending: boolean
    navigate: (path: string) => any
}

const WorkLibraryCard: React.FC<Props> = (
    { work, role, onDelete, deletePending, navigate }


) => {



    const { permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.stafftask?.delete;


    return (
        <Card key={work._id} className="p-0 border-l-4 border-blue-600">
            <CardHeader>
                <CardTitle>{work?.workName || "No title"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm">
                    <i className="fa-solid fa-file-lines mr-2 text-blue-600" />
                    Description: {work?.description ? (work?.description?.length > 100 ? `${work?.description?.slice(0, 100)}...` : work?.description) : "N/A"}
                </p>
                {/* <p className="text-sm">
                                    <i className="fa-solid fa-tags mr-2 text-green-600" />
                                    Tags: {work.tags?.join(", ") || "None"}
                                </p> */}
                <p className="text-sm">
                    <i className="fa-solid fa-list-check mr-2 text-purple-600" />{" "}
                    Total Tasks: {work.tasks?.length || 0}
                </p>

                <div className="flex gap-2 mt-3 justify-end">
                    <Button
                        size="sm"
                        onClick={() => navigate(`single/${work._id}`)}
                    >
                        <i className="fa-solid fa-eye mr-1" />
                        View
                    </Button>
                    {(role !== "staff" && canDelete )&& (
                        <Button
                            size="sm"
                            onClick={() => onDelete(work._id)}
                            isLoading={deletePending}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            <i className="fa-solid fa-trash mr-1" />
                            Delete
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>)
}

export default WorkLibraryCard