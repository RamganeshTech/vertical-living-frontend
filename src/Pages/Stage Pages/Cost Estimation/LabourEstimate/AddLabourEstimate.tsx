// import React from 'react'
// import { useAddLabourEstimation } from '../../../../apiList/Stage Api/costEstimationApi';
// import { Button } from '../../../../components/ui/Button';
// import { Input } from '../../../../components/ui/Input';

// interface AddLabourEstimateProps {
//     projectId:string
// }

// const AddLabourEstimate:React.FC<AddLabourEstimateProps> = ({projectId}) => {
//    const [workType, setWorkType] = React.useState("");
//   const [hoursPlanned, setHoursPlanned] = React.useState(0);
//   const [hourlyRate, setHourlyRate] = React.useState(0);
//   const { mutateAsync, isPending } = useAddLabourEstimation();

//   const handleSubmit = async () => {
//     await mutateAsync({ projectId, payload: { workType, hoursPlanned, hourlyRate } });
//     setWorkType("");
//     setHoursPlanned(0);
//     setHourlyRate(0);
//   };

//   return (
//     <div className="border p-4 bg-white rounded-xl shadow-sm">
//       <h4 className="font-semibold text-green-700 mb-2">Add Labour</h4>
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <Input  value={workType} onChange={(e) => setWorkType(e.target.value)} />
//         <Input
//           type="number"
//           value={hoursPlanned}
//           onChange={(e) => setHoursPlanned(Number(e.target.value))}
//         />
//         <Input
//           type="number"
//           value={hourlyRate}
//           onChange={(e) => setHourlyRate(Number(e.target.value))}
//         />
//       </div>
//       <Button onClick={handleSubmit} isLoading={isPending} className="mt-3 bg-green-700 text-white">
//         Add
//       </Button>
//     </div>
//   );
// }

// export default AddLabourEstimate