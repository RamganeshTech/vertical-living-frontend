import React from 'react'
import type { EditLabourType } from './LabourEstimateContainer';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';



interface AddLabourEstimateProp {
    handleAdd: () => Promise<any>,
    newData: EditLabourType,
    addPending: boolean,
    setNewData: React.Dispatch<React.SetStateAction<EditLabourType>>,
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>,
}

const AddLabourEstimate: React.FC<AddLabourEstimateProp> = ({ handleAdd, newData, setNewData, addPending, setShowForm }) => {

    return (
        <div className='space-y-3 bg-white px-6 py-3 rounded-2xl'>
            <h2 className='font-medium text-gray-700 text-center'>Add Labour</h2>
            <Input
                placeholder="Work Type"
                value={newData.workType}
                onChange={(e) => setNewData({ ...newData, workType: e.target.value })}
            />
            <Input
                placeholder="No of people"
                value={newData.noOfPeople}
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
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
        </div>
    )
}

export default AddLabourEstimate