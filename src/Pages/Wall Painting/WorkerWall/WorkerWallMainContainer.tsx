import { Outlet, Link, useParams, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { WORKER_WALL_PAINTING_STEPS } from "../../../constants/constants";
import { useGetWorkerSOP } from "../../../apiList/WallPainting Api/workerWallPaintingApi";
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
    // <div className="flex flex-col w-full h-full bg-gray-50">
    //   {isRoot ? (
    //     <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
    //       <h2 className="text-xl md:text-3xl text-left font-bold mb-6 sm:text-center text-gray-800">
    //         {isMobile && (
    //           <button
    //             onClick={openMobileSidebar}
    //             className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
    //             title="Open Menu"
    //           >
    //             <i className="fa-solid fa-bars"></i>
    //           </button>
    //         )}
    //         Worker Wall Painting Steps
    //       </h2>
    //       <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    //         {WORKER_WALL_PAINTING_STEPS.map((step) => {
    //           const stepObj = sop?.steps?.find(
    //             (stepStage: any) => stepStage?.stepNumber === step.stepNumber
    //           );

    //           return (
    //             <li
    //               key={step.stepNumber}
    //               className="group relative bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
    //             >
    //               <Link
    //                 to={`step/${stepObj?._id}/${step.stepNumber}`}
    //                 className="flex flex-col justify-between h-full p-6"
    //               >
    //                 <div>
    //                   <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600">
    //                     {step.label}
    //                   </h3>
    //                   <p className="text-gray-500 text-sm">Step #{step.stepNumber}</p>
    //                 </div>
    //                 <div className="mt-4">
    //                   <span className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-full group-hover:bg-blue-700 transition">
    //                     View Step
    //                   </span>
    //                 </div>
    //               </Link>
    //             </li>
    //           );
    //         })}
    //       </ul>

    //     </div>
    //   ) : (
    //     <section className="flex flex-col w-full h-full">
    //       <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 shadow z-10">
    //         <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-600 flex items-center">
    //           {isMobile && (
    //             <button
    //               onClick={openMobileSidebar}
    //               className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
    //               title="Open Menu"
    //             >
    //               <i className="fa-solid fa-bars"></i>
    //             </button>
    //           )}
    //           <div onClick={() => navigate(-1)}
    //             className='!bg-blue-50 mr-2  hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 text-black '>
    //             <i className='fas fa-arrow-left'></i>
    //           </div>
    //           Worker Side
    //         </h1>
    //         {/* <Button onClick={() => navigate(-1)}>Go Back</Button> */}
    //       </header>

    //       <main className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
    //         <Outlet />
    //       </main>
    //     </section>
    //   )}
    // </div>

    //  <div className="flex flex-col w-full h-full bg-slate-50">
    <div className="flex flex-col w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-y-auto custom-scrollbar">

      {isRoot ? (
        <div className="flex flex-col w-full h-full">
          {/* Sticky Header */}
          {/* <header className="sticky top-0 z-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg"> */}
          <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">

            <div className="max-w-full mx-auto p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <button
                      onClick={openMobileSidebar}
                      className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                      title="Open Menu"
                      aria-label="Open Menu"
                    >
                      <i className="fa-solid fa-bars text-lg"></i>
                    </button>
                  )}
                  <div onClick={() => navigate(-1)}
                    className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                    <i className='fas fa-arrow-left'></i>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Worker Wall Painting</h1>
                    {/* <p className="text-slate-300 text-sm mt-1">Complete your assigned steps</p> */}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-full mx-auto p-4">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {WORKER_WALL_PAINTING_STEPS.map((step, index) => {
                  const stepObj = sop?.steps?.find((stepStage: any) => stepStage?.stepNumber === step.stepNumber)

                  return (
                    <li key={step.stepNumber} className="group">
                      <Link
                        to={`step/${stepObj?._id}/${step.stepNumber}`}
                        className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden hover:-translate-y-1"
                      >
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 border-b border-slate-200 flex gap-2 justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                              {step.label}
                            </h3>
                            {/* <p className="text-slate-500 text-sm mt-1">Step #{step.stepNumber}</p> */}
                          </div>
                          <div className="ml-2 h-fit p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
                            <i className="fa-solid fa-arrow-right text-blue-600 text-sm"></i>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="flex-1 px-6 py-4 flex flex-col justify-between">
                          <div className="text-slate-600 text-sm">
                            <p>Step #{index + 1}</p>
                          </div>

                          {/* Card Footer */}
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            {/* <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg group-hover:bg-slate-800 transition-colors duration-200"> */}
                            <span className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg group-hover:bg-blue-700 transition-colors duration-200">

                              View Step
                              <i className="fa-solid fa-chevron-right text-xs"></i>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </main>
        </div>
      ) : (
        <section className="flex flex-col w-full h-full">
          {/* Sticky Header */}
          <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-md">
            <div className="max-w-full mx-auto p-4">
              <div className="flex items-center gap-4">
                {/* Back Button */}
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all duration-200 hover:border-slate-400"
                  title="Go Back"
                  aria-label="Go Back"
                >
                  <i className="fa-solid fa-arrow-left text-base"></i>
                </button>

                {/* Menu Button for Mobile */}
                {isMobile && (
                  <button
                    onClick={openMobileSidebar}
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all duration-200"
                    title="Open Menu"
                    aria-label="Open Menu"
                  >
                    <i className="fa-solid fa-bars text-base"></i>
                  </button>
                )}

                {/* Header Title */}
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900">Worker Side</h1>
                  <p className="text-slate-500 text-sm">Complete your assigned tasks</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Outlet />
            </div>
          </main>
        </section>
      )}
    </div>

  );
}
