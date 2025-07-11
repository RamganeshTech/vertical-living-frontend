import { Outlet, Link, useParams, useLocation } from "react-router-dom";
import { WORKER_WALL_PAINTING_STEPS } from "../../../constants/constants";
import { useGetWorkerSOP } from "../../../apiList/WallPainting Api/workerWallPaintingApi";

export default function WorkerWallMainContainer() {
  const { projectId } = useParams<{ projectId: string }>();
  const { pathname } = useLocation();
  const { data: sop } = useGetWorkerSOP(projectId!);

  const isRoot = pathname.endsWith("/worker-wall");

  return (
    <div className="p-4">
      {isRoot && (
        <div>
          <h2 className="text-xl font-bold mb-4">Worker Wall Painting Steps</h2>
          <ul className="space-y-2">
            {WORKER_WALL_PAINTING_STEPS.map((step) => (
              <li key={step.stepNumber}>
                <Link
                  to={`step/${step.stepNumber}`}
                  className="text-blue-600 underline"
                >
                  {step.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Outlet />
    </div>
  );
}
