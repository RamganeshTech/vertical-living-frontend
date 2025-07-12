// import { Outlet, Link, useParams, useLocation } from "react-router-dom";
// import { WORKER_WALL_PAINTING_STEPS } from "../../../constants/constants";
// import { useGetWorkerSOP } from "../../../apiList/WallPainting Api/workerWallPaintingApi";

// export default function WorkerWallMainContainer() {
//   const { projectId } = useParams<{ projectId: string }>();
//   const { pathname } = useLocation();
//   const { data: sop, isLoading , error} = useGetWorkerSOP(projectId!);

//   const isRoot = pathname.endsWith("/workerwall");
// if(isLoading) return <p>loaidng ....</p>
// if(error) return <p>{error?.message}</p>
//   return (
//     <div className="p-4">
//       {isRoot && (
//         <div>
//           <h2 className="text-xl font-bold mb-4">Worker Wall Painting Steps</h2>
//           <ul className="space-y-2">
//             {WORKER_WALL_PAINTING_STEPS.map((step) => {
//               const stepObj = sop?.steps?.find((stepStage:any)=> stepStage?.stepNumber === step.stepNumber)
//               console.log(stepObj)
//             return (
//               <li key={step.stepNumber}>
//                 <Link
//                   to={`step/${stepObj?._id}/${step.stepNumber}`}
//                   className="text-blue-600 underline"
//                 >
//                   {step.label}
//                 </Link>
//               </li>
//             )
// })}
//           </ul>
//         </div>
//       )}

//       <Outlet />
//     </div>
//   );
// }








import { Outlet, Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { WORKER_WALL_PAINTING_STEPS } from "../../../constants/constants";
import { useGetWorkerSOP } from "../../../apiList/WallPainting Api/workerWallPaintingApi";
import { Button } from "../../../components/ui/Button";

export default function WorkerWallMainContainer() {
  const { projectId } = useParams<{ projectId: string }>();
  const { pathname } = useLocation();
  const navigate = useNavigate()

  const { data: sop, isLoading, error } = useGetWorkerSOP(projectId!);

  const isRoot = pathname.endsWith("/workerwall");

  if (isLoading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error?.message}</p>;

  return (
    <div className="w-full h-full ">
      {isRoot ? (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
            Worker Wall Painting Steps
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {WORKER_WALL_PAINTING_STEPS.map((step) => {
              const stepObj = sop?.steps?.find(
                (stepStage: any) => stepStage?.stepNumber === step.stepNumber
              );

              return (
                <li
                  key={step.stepNumber}
                  className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <Link
                    to={`step/${stepObj?._id}/${step.stepNumber}`}
                    className="block p-4 text-center text-blue-600 font-medium hover:text-blue-800"
                  >
                    {step.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )
    :
     <section className="h-full w-full">
            <header className="py-4 px-4 bg-white shadow-sm flex justify-between mb-4">
              <h1 className="text-2xl sm:text-3xl text-blue-600 font-semibold">Worker Side</h1>
              <div>
                <Button onClick={() => navigate(-1)}>
                  Go Back
                </Button>
              </div>
            </header >
           <main className="w-full h-[80%] px-4">
             <Outlet />
           </main>
          </section>
    
    }

    </div>
  );
}
