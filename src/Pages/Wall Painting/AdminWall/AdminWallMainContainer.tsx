import { Outlet, Link, useParams, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { ADMIN_WALL_PAINTING_STEPS } from "../../../constants/constants";
import { useGetAdminSOP } from "../../../apiList/WallPainting Api/adminWallPaintingApi";
import type { ProjectDetailsOutlet } from "../../../types/types";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

export default function AdminWallMainContainer() {
  const { projectId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate()
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();

  const { data: sop, isLoading, error } = useGetAdminSOP(projectId!);

  const isRoot = pathname.endsWith("/adminwall");

  if (isLoading) return <MaterialOverviewLoading />


  if (error)
    return (
      <div className="flex justify-center items-center h-40 text-red-500">
        {error?.message}
      </div>
    );

  return (
    // <div className="flex flex-col w-full h-full bg-gray-50 overflow-y-auto custom-scrollbar">
    //   {isRoot ? (
    //     <div className="flex-1 max-w-6xl mx-auto">
    //       <header>

    //         <div className="mb-4 ">
    //           <h1 className="text-2xl md:text-3xl text-left sm:text-center font-bold mb-2 text-gray-800">
    //             {isMobile && (
    //               <button
    //                 onClick={openMobileSidebar}
    //                 className="mr-2 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
    //                 title="Open Menu"
    //               >
    //                 <i className="fa-solid fa-bars"></i>
    //               </button>
    //             )}
    //             Admin Wall Painting Steps
    //           </h1>
    //           <p className="text-gray-600 text-base mb-2 text-center hidden sm:block">
    //             Select a step to manage its details.
    //           </p>
    //         </div>
    //       </header>

    //       <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    //         {ADMIN_WALL_PAINTING_STEPS.map((step) => {
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
    //       <header className="flex items-center justify-between px-4  bg-white border-b border-gray-200 shadow z-10">
    //         <h1 className="text-xl flex gap-2 sm:text-2xl md:text-3xl text-blue-600 font-semibold">
    //           <div onClick={() => navigate(-1)}
    //             className='!bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 text-black '>
    //             <i className='fas fa-arrow-left'></i>
    //           </div>
    //           Admin Side
    //         </h1>
    //       </header>

    //       <main className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
    //         <Outlet context={{ isMobile, openMobileSidebar }} />
    //       </main>
    //     </section>
    //   )}
    // </div>


    <div className="flex flex-col w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-y-auto custom-scrollbar">
      {isRoot ? (
        <div className="flex-1 w-full">

          <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-full mx-auto p-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <button
                      onClick={openMobileSidebar}
                      className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors duration-200"
                      title="Open Menu"
                      aria-label="Open navigation menu"
                    >
                      <i className="fa-solid fa-bars text-slate-700"></i>
                    </button>
                  )}
                  <div className="flex gap-2 items-center">
                    <div onClick={() => navigate(-1)}
                      className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                      <i className='fas fa-arrow-left'></i>
                    </div>
                    <div className="">

                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Admin Wall Painting</h1>
                    <p className="text-sm text-slate-600 mt-1 hidden sm:block">Manage and configure painting steps</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-full mx-auto p-2">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Steps Overview</h2>
              <p className="text-slate-600 text-sm">Select a step below to view and manage its details</p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ADMIN_WALL_PAINTING_STEPS.map((step) => {
                const stepObj = sop?.steps?.find((stepStage: any) => stepStage?.stepNumber === step.stepNumber)

                return (
                  <li key={step.stepNumber} className="group">
                    <Link
                      to={`step/${stepObj?._id}/${step.stepNumber}`}
                      className="flex flex-col h-full p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                            {step.label}
                          </h3>
                          <p className="text-slate-500 text-sm mt-1">Step #{step.stepNumber}</p>
                        </div>
                        <div className="ml-2 p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
                          <i className="fa-solid fa-arrow-right text-blue-600 text-sm"></i>
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-slate-100">
                        <span className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg group-hover:bg-blue-700 transition-colors duration-200">
                          <i className="fa-solid fa-chevron-right text-xs"></i>
                          View Step
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </main>
        </div>
      ) : (
        <section className="flex flex-col w-full h-full">
          <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
            <div className="px-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex cursor-pointer items-center justify-center w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 text-slate-700 hover:text-slate-900"
                  title="Go back"
                  aria-label="Go back to previous page"
                >
                  <i className="fa-solid fa-arrow-left text-base"></i>
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Step Details</h1>
                  <p className="text-sm text-slate-600 mt-1 hidden sm:block">Configure and manage this painting step</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-2 custom-scrollbar">
            <div className="max-w-full mx-auto">
              <Outlet context={{ isMobile, openMobileSidebar }} />
            </div>
          </main>
        </section>
      )}
    </div>
  );
}
