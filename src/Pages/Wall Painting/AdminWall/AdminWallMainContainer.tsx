import { Outlet, Link, useParams, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { ADMIN_WALL_PAINTING_STEPS } from "../../../constants/constants";
import { useGetAdminSOP } from "../../../apiList/WallPainting Api/adminWallPaintingApi";
import { Button } from "../../../components/ui/Button";
import type { ProjectDetailsOutlet } from "../../../types/types";

export default function AdminWallMainContainer() {
  const { projectId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate()
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();

  const { data: sop, isLoading, error } = useGetAdminSOP(projectId!);

  const isRoot = pathname.endsWith("/adminwall");

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-40 text-red-500">
        {error?.message}
      </div>
    );

  return (
       <div className="flex flex-col w-full h-full bg-gray-50 overflow-y-auto custom-scrollbar">
      {isRoot ? (
        <div className="flex-1 max-w-6xl mx-auto">
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl text-left sm:text-center font-bold mb-2 text-gray-800">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  className="mr-2 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}
              Admin Wall Painting Steps
            </h1>
            <p className="text-gray-600 text-base mb-2 text-center hidden sm:block">
              Select a step to manage its details.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADMIN_WALL_PAINTING_STEPS.map((step) => {
              const stepObj = sop?.steps?.find(
                (stepStage: any) => stepStage?.stepNumber === step.stepNumber
              );

              return (
                <li
                  key={step.stepNumber}
                  className="group relative bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
                >
                  <Link
                    to={`step/${stepObj?._id}/${step.stepNumber}`}
                    className="flex flex-col justify-between h-full p-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600">
                        {step.label}
                      </h3>
                      <p className="text-gray-500 text-sm">Step #{step.stepNumber}</p>
                    </div>
                    <div className="mt-4">
                      <span className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-full group-hover:bg-blue-700 transition">
                        View Step
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <section className="flex flex-col w-full h-full">
          <header className="flex items-center justify-between px-4  bg-white border-b border-gray-200 shadow z-10">
            <h1 className="text-xl sm:text-2xl md:text-3xl text-blue-600 font-semibold">
              Admin Side
            </h1>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
            <Outlet context={{ isMobile, openMobileSidebar }} />
          </main>
        </section>
      )}
    </div>
  );
}
