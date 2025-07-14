import { Outlet, Link, useParams, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { WORKER_WALL_PAINTING_STEPS } from "../../../constants/constants";
import { useGetWorkerSOP } from "../../../apiList/WallPainting Api/workerWallPaintingApi";
import { Button } from "../../../components/ui/Button";
import type { ProjectDetailsOutlet } from "../../../types/types";

export default function WorkerWallMainContainer() {
  const { projectId } = useParams<{ projectId: string }>();
  const { pathname } = useLocation();
  const navigate = useNavigate()
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();

  const { data: sop, isLoading, error } = useGetWorkerSOP(projectId!);

  const isRoot = pathname.endsWith("/workerwall");

  if (isLoading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error?.message}</p>;

  return (
     <div className="flex flex-col w-full h-full bg-gray-50">
      {isRoot ? (
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <h2 className="text-xl md:text-3xl text-left font-bold mb-6 sm:text-center text-gray-800">
             {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}
            Worker Wall Painting Steps
          </h2>
         <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {WORKER_WALL_PAINTING_STEPS.map((step) => {
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
          <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 shadow z-10">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-600 flex items-center">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}
              Worker Side
            </h1>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
            <Outlet />
          </main>
        </section>
      )}
    </div>
  );
}
