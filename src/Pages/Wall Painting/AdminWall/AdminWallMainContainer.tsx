import { Outlet, Link, useParams, useLocation } from "react-router-dom";
import { ADMIN_WALL_PAINTING_STEPS } from "../../../constants/constants"; 
import { useGetAdminSOP } from "../../../apiList/WallPainting Api/adminWallPaintingApi";

export default function AdminWallMainContainer() {
    const {projectId} = useParams()
  const { pathname } = useLocation();
  const { data: sop,  } = useGetAdminSOP(projectId!);

  const isRoot = pathname.endsWith("/admin-wall");

  return (
    <div className="p-4">
      {isRoot && (
        <div>
          <h2 className="text-xl font-bold mb-4">Admin Wall Painting Steps</h2>
          <ul className="space-y-2">
            {ADMIN_WALL_PAINTING_STEPS.map((step) => (
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
