import { Outlet, Link, useParams, useLocation } from "react-router-dom";
import { WORKER_WALL_PAINTING_STEPS } from "../../../constants/constants";
import { useGetWorkerSOP } from "../../../apiList/WallPainting Api/workerWallPaintingApi";

export default function WorkerWallMainContainer() {
  const { projectId } = useParams<{ projectId: string }>();
  const { pathname } = useLocation();
  const { data: sop, isLoading , error} = useGetWorkerSOP(projectId!);

  const isRoot = pathname.endsWith("/workerwall");
if(isLoading) return <p>loaidng ....</p>
if(error) return <p>{error?.message}</p>
  return (
    <div className="p-4">
      {isRoot && (
        <div>
          <h2 className="text-xl font-bold mb-4">Worker Wall Painting Steps</h2>
          <ul className="space-y-2">
            {WORKER_WALL_PAINTING_STEPS.map((step) => {
              const stepObj = sop?.steps?.find((stepStage:any)=> stepStage?.stepNumber === step.stepNumber)
              console.log(stepObj)
            return (
              <li key={step.stepNumber}>
                <Link
                  to={`step/${stepObj?._id}/${step.stepNumber}`}
                  className="text-blue-600 underline"
                >
                  {step.label}
                </Link>
              </li>
            )
})}
          </ul>
        </div>
      )}

      <Outlet />
    </div>
  );
}
