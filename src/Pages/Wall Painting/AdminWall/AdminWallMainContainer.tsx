import { Outlet, Link, useParams, useLocation } from "react-router-dom";
import { ADMIN_WALL_PAINTING_STEPS } from "../../../constants/constants";
import { useGetAdminSOP } from "../../../apiList/WallPainting Api/adminWallPaintingApi";

export default function AdminWallMainContainer() {
  const { projectId } = useParams()
  const { pathname } = useLocation();
  const { data: sop, isLoading , error} = useGetAdminSOP(projectId!);

  const isRoot = pathname.endsWith("/adminwall");
if(isLoading) return <p>loaidng ....</p>
if(error) return <p>{error?.message}</p>

console.log("sop form admn", sop)

  return (
    <div className="p-4">
      {isRoot && (
        <div>
          <h2 className="text-xl font-bold mb-4">Admin Wall Painting Steps</h2>
          <ul className="space-y-2">
            {ADMIN_WALL_PAINTING_STEPS.map((step) => {
             
             const stepObj = sop?.steps?.find((stepStage: any) => stepStage?.stepNumber === step.stepNumber)
              console.log(stepObj)

              return <li key={step.stepNumber}>
                <Link
                  to={`step/${stepObj?._id}/${step.stepNumber}`}
                  className="text-blue-600 underline"
                >
                  {step.label}
                </Link>
              </li>
            })}
          </ul>
        </div>
      )}
      <Outlet />
    </div>
  );
}
