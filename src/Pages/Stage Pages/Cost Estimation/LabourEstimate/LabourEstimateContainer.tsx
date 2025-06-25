import React, { useMemo, useState } from 'react'
// import AddLabourEstimate from './AddLabourEstimate';
import { useNavigate, useParams } from 'react-router-dom';
import MaterialOverviewLoading from '../../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import { useAddLabourEstimation, useDeleteLabourEstimation, useEditLabourEstimation, useGetLabourEstimation } from '../../../../apiList/Stage Api/costEstimationApi';
import { Button } from '../../../../components/ui/Button';
import EmptyState from '../../../../components/ui/EmptyState';
import { toast } from '../../../../utils/toast';
import { Input } from '../../../../components/ui/Input';
import AddLabourEstimate from './AddLabourEstimate';


export interface EditLabourType {
    workType: string,
    noOfPeople: number,
    daysPlanned: number,
    perdaySalary: number
};

const LabourEstimateContainer = () => {
    const { projectId } = useParams()
    const navigate = useNavigate()

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<EditLabourType>({ workType: "", noOfPeople: 0, daysPlanned: 0, perdaySalary: 0 });
    const [newData, setNewData] = useState<EditLabourType>({ workType: "", noOfPeople: 0, daysPlanned: 0, perdaySalary: 0 });
    const [showAddRow, setShowAddRow] = useState(false);
    const [showform, setShowForm] = useState<boolean>(false);

    const { data: labourList, isLoading, isError, error, refetch } = useGetLabourEstimation(projectId!);

    const { mutateAsync: deleteLabour, isPending: deletePending } = useDeleteLabourEstimation();
    const { mutateAsync: editLabour, isPending: editPending } = useEditLabourEstimation();
    const { mutateAsync: addLabour, isPending: addPending } = useAddLabourEstimation();
    const totalLabourCost = useMemo(() => labourList?.reduce((acc: any, curr: any) => acc + curr?.totalCost, 0), [labourList])


    if (isLoading) return <MaterialOverviewLoading />;

    if (isError) return <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
        <div className="text-red-600 text-xl font-semibold mb-2">
            ⚠️ Oops! An Error Occurred
        </div>
        <p className="text-red-500 text-sm mb-4">{(error as any)?.response?.data?.message || (error as any)?.message || "Failed to load , please try again"}</p>

        <Button
            isLoading={isLoading}
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
        >
            Retry
        </Button>
    </div>;

    const handleEdit = (labour: any) => {
        setEditingId(labour._id);
        setEditData({
            workType: labour.workType,
            noOfPeople: labour.noOfPeople,
            daysPlanned: labour.daysPlanned,
            perdaySalary: labour.perdaySalary,
        });
    };

    const resetEditData = () => {
        setEditingId(null);
        setEditData({
            workType: "",
            noOfPeople: 0,
            daysPlanned: 0,
            perdaySalary: 0
        });
    }


    const handleDeleteLabour = async (labourId: string) => {
        try {
            await deleteLabour({ projectId: projectId!, labourId: labourId });
            toast({ description: 'Deleted successfully', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

        }
    };



    const handleEditLabour = async (labourId: string) => {
        try {
            await editLabour({ projectId: projectId!, labourId: labourId, updates: editData });
            toast({ description: 'edited successfully', title: "Success" });
            resetEditData()
            refetch()
            refetch()

        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

        }
    };


    const handleAdd = async () => {
        try {
            if(newData.workType) {
                throw new Error("Please Enter the workType")
            }
            await addLabour({ projectId: projectId!, labourData: newData });
            setNewData({
                workType: "",
                noOfPeople: 0,
                daysPlanned: 0,
                perdaySalary: 0
            });
            setShowAddRow(false);
            setShowForm(false)
            toast({ title: "Success", description: "Labour estimation added" });
            refetch()

        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };


//     const llabourList = [
//   {
//     workType: "Carpenter",
//     noofPeople: 4,
//     daysPlanned: 30,
//     perdaySalary: 800,
//     weeklySalary: 22400,
//     totalCost: 96000
//   },
//   {
//     workType: "Electrician",
//     noofPeople: 3,
//     daysPlanned: 28,
//     perdaySalary: 700,
//     weeklySalary: 14700,
//     totalCost: 58800
//   },
//   {
//     workType: "Painter",
//     noofPeople: 5,
//     daysPlanned: 21,
//     perdaySalary: 600,
//     weeklySalary: 21000,
//     totalCost: 63000
//   },
//   {
//     workType: "Plumber",
//     noofPeople: 2,
//     daysPlanned: 14,
//     perdaySalary: 800,
//     weeklySalary: 11200,
//     totalCost: 22400
//   },
//   {
//     workType: "Welder",
//     noofPeople: 3,
//     daysPlanned: 35,
//     perdaySalary: 750,
//     weeklySalary: 15750,
//     totalCost: 78750
//   },
//   {
//     workType: "Mason",
//     noofPeople: 6,
//     daysPlanned: 25,
//     perdaySalary: 650,
//     weeklySalary: 27300,
//     totalCost: 97500
//   },
//   {
//     workType: "Tile Worker",
//     noofPeople: 2,
//     daysPlanned: 20,
//     perdaySalary: 800,
//     weeklySalary: 11200,
//     totalCost: 32000
//   },
//   {
//     workType: "Supervisor",
//     noofPeople: 1,
//     daysPlanned: 40,
//     perdaySalary: 1000,
//     weeklySalary: 7000,
//     totalCost: 40000
//   },
//   {
//     workType: "Fabricator",
//     noofPeople: 2,
//     daysPlanned: 18,
//     perdaySalary: 900,
//     weeklySalary: 12600,
//     totalCost: 32400
//   },
//   {
//     workType: "Cleaner",
//     noofPeople: 2,
//     daysPlanned: 15,
//     perdaySalary: 400,
//     weeklySalary: 5600,
//     totalCost: 12000
//   }
// ];


    return (
        <main className='h-full w-full'>
            <div className='w-full flex justify-between '>
                <h2 className="text-xl font-bold text-blue-600 mb-5">Labour Estimation</h2>

                <Button variant="primary" className="h-10" onClick={() => navigate(`/projectdetails/${projectId}/costestimation`)}>Go Back</Button>
            </div>


            {!labourList?.length &&
                <div className="w-full bg-white border border-gray-200 rounded-lg p-10 h-[60%] shadow-sm flex flex-col items-center justify-center text-center">
                    <i className="fa-solid fa-person-digging text-7xl text-gray-400 mb-6"></i>

                    <h2 className="text-xl font-semibold text-gray-800 mb-2">No Labour Estimations</h2>

                    <p className="text-sm text-gray-500 mb-6">
                        Create your first labour estimation to start managing your workforce
                    </p>

                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg font-medium rounded"
                    >
                        <i className="fa-solid fa-plus mr-2"></i> Create Labour Estimation
                    </Button>
                </div>
            }

            <section>
                {showform &&

                    <div className="fixed bg-black/70 flex justify-center items-center h-full w-full z-50 top-0 left-0">
                        <AddLabourEstimate handleAdd={handleAdd} newData={newData}
                            setNewData={setNewData} addPending={addPending}
                            setShowForm={setShowForm} />
                    </div>
                }
            </section>

           { labourList?.length > 0 && <div className="bg-white rounded  overflow-hidden">

                <section>
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-blue-900">Total Labour Cost:</span>
                            <span className={`text-lg font-bold  text-blue-900`}>₹{!totalLabourCost?.toLocaleString() ||  <span>5,32,850</span>}</span>
                        </div>
                    </div>
                </section>

                <section className='shadow-lg !rounded-lg'>
                    <div className="grid grid-cols-7 bg-blue-50 px-6 py-3 font-semibold text-gray-700 text-sm">
                        <div className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Work Type</div>
                        <div className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No.Of People</div>
                        <div className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Days Planned</div>
                        <div className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Per Day Salary</div>
                        <div className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Weekly Salary</div>
                        <div className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</div>
                        <div className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-100 shadow-md  rounded-lg max-h-[65vh] overflow-y-auto bg-white">
                        {labourList?.map((labour: any) => (
                            <div key={labour._id} className={`grid grid-cols-7 rounded-lg items-center gap-2 px-6 py-4 text-sm ${editingId === labour._id ? "" : "hover:bg-[#f7fbff]"}`}>
                                {editingId === labour._id ? (
                                    <>
                                        <Input required={true} value={editData.workType} onChange={(e) => setEditData({ ...editData, workType: e.target.value })} />
                                        <Input type="number" value={editData.noOfPeople} onChange={(e) => setEditData({ ...editData, noOfPeople: +e.target.value })} />
                                        <Input type="number" value={editData.daysPlanned} onChange={(e) => setEditData({ ...editData, daysPlanned: +e.target.value })} />
                                        <Input type="number" value={editData.perdaySalary} onChange={(e) => setEditData({ ...editData, perdaySalary: +e.target.value })} />
                                        <div className="text-gray-700">₹{(editData.perdaySalary * 7) || 0}</div>
                                        <div className="text-gray-700">₹{editData.daysPlanned * editData.perdaySalary || 0}</div>
                                        <div className="flex items-center justify-center gap-2">
                                            <Button onClick={() => handleEditLabour(labour._id)} isLoading={editPending}><i className="fas fa-check"></i></Button>
                                            <Button variant="ghost" onClick={() => setEditingId(null)}>✖</Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className='font-medium text-left    text-gray-700'>{labour.workType}</div>
                                        <div className='font-medium text-center  text-gray-700'>{labour?.noOfPeople}</div>
                                        <div className='font-medium text-center  text-gray-700'>{labour.daysPlanned}</div>
                                        <div className='font-medium text-center  text-gray-700'>₹{labour.perdaySalary}</div>
                                        <div className='font-medium text-center  text-gray-700'>₹{labour.weeklySalary}</div>
                                        <div className="text-gray-800 font-medium text-center">₹{labour.totalCost || 0}</div>
                                        <div className="flex items-center justify-center gap-2">
                                            <Button onClick={() => handleEdit(labour)}>✎</Button>
                                            <Button variant="danger" className='bg-red-500 text-white' isLoading={deletePending} onClick={() => handleDeleteLabour(labour._id)}> <i className='fas fa-trash-can'></i> </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}

                        {showAddRow &&
                            <div className="grid grid-cols-7 gap-2  px-6 py-4 text-sm  !bg-none">
                                <Input
                                required={true}
                                    placeholder="Work Type"
                                    value={newData.workType}
                                    onChange={(e) => setNewData({ ...newData, workType: e.target.value })}
                                />
                                <Input
                                    placeholder="No of people"
                                    value={newData.workType}
                                    onChange={(e) => setNewData({ ...newData, noOfPeople: +e.target.value })}
                                />
                                <Input
                                    placeholder="Days"
                                    type="number"
                                    value={newData.daysPlanned}
                                    onChange={(e) => setNewData({ ...newData, daysPlanned: +e.target.value })}
                                />
                                <Input
                                    placeholder="Per Day Salary"
                                    type="number"
                                    value={newData.perdaySalary}
                                    onChange={(e) => setNewData({ ...newData, perdaySalary: +e.target.value })}
                                />
                                <p className="font-medium text-center  text-gray-700 leading-10 ">₹{(newData.perdaySalary * newData.noOfPeople) * 7 || 0}</p>
                                <div className="font-medium text-center  text-gray-700 leading-10">₹{(newData.daysPlanned * newData.perdaySalary) * newData.noOfPeople || 0}</div>
                                <div className="flex  items-center justify-center gap-2">
                                    <Button onClick={handleAdd} isLoading={addPending}>Add</Button>
                                    <Button variant="outline" onClick={() => setShowAddRow(false)}>Cancel</Button>
                                </div>
                            </div>
                        }
                    </div>


                    <div className="mt-2">
                        <Button variant="primary" onClick={() => setShowAddRow(true)}>+ Add Labour Estimation</Button>
                    </div>
                </section>

            </div>}
        </main>
    );

}

export default LabourEstimateContainer