// import { Outlet, Link, useParams, useLocation } from "react-router-dom";
// import { ADMIN_WALL_PAINTING_STEPS } from "../../../constants/constants";
// import { useGetAdminSOP } from "../../../apiList/WallPainting Api/adminWallPaintingApi";

// export default function AdminWallMainContainer() {
//   const { projectId } = useParams()
//   const { pathname } = useLocation();
//   const { data: sop, isLoading , error} = useGetAdminSOP(projectId!);

//   const isRoot = pathname.endsWith("/adminwall");
// if(isLoading) return <p>loaidng ....</p>
// if(error) return <p>{error?.message}</p>

// console.log("sop form admn", sop)

//   return (
//     <div className="p-4">
//       {isRoot && (
//         <div>
//           <h2 className="text-xl font-bold mb-4">Admin Wall Painting Steps</h2>
//           <ul className="space-y-2">
//             {ADMIN_WALL_PAINTING_STEPS.map((step) => {

//              const stepObj = sop?.steps?.find((stepStage: any) => stepStage?.stepNumber === step.stepNumber)
//               console.log(stepObj)

//               return <li key={step.stepNumber}>
//                 <Link
//                   to={`step/${stepObj?._id}/${step.stepNumber}`}
//                   className="text-blue-600 underline"
//                 >
//                   {step.label}
//                 </Link>
//               </li>
//             })}
//           </ul>
//         </div>
//       )}
//       <Outlet />
//     </div>
//   );
// }




// import { Outlet, Link, useParams, useLocation } from "react-router-dom";
// import { ADMIN_WALL_PAINTING_STEPS } from "../../../constants/constants";
// import { useGetAdminSOP } from "../../../apiList/WallPainting Api/adminWallPaintingApi";
// import { FaArrowRight } from "react-icons/fa";

// export default function AdminWallMainContainer() {
//   const { projectId } = useParams();
//   const { pathname } = useLocation();
//   const { data: sop, isLoading, error } = useGetAdminSOP(projectId!);

//   const isRoot = pathname.endsWith("/adminwall");

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-40 text-gray-500">
//         Loading...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="flex justify-center items-center h-40 text-red-500">
//         {error?.message}
//       </div>
//     );

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       {isRoot && (
//         <div className="max-w-5xl mx-auto">
//           <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-gray-800">
//             🛠️ Admin Wall Painting Steps
//           </h2>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {ADMIN_WALL_PAINTING_STEPS.map((step) => {
//               const stepObj = sop?.steps?.find(
//                 (stepStage: any) => stepStage?.stepNumber === step.stepNumber
//               );

//               return (
//                 <li
//                   key={step.stepNumber}
//                   className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-300"
//                 >
//                   <Link
//                     to={`step/${stepObj?._id}/${step.stepNumber}`}
//                     className="flex items-center justify-between p-6 h-full text-gray-700 hover:text-blue-700"
//                   >
//                     <span className="font-semibold text-lg">{step.label}</span>
//                     <FaArrowRight className="ml-3 text-blue-500" />
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       )}
//       <Outlet />
//     </div>
//   );
// }



import { Outlet, Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { ADMIN_WALL_PAINTING_STEPS } from "../../../constants/constants";
import { useGetAdminSOP } from "../../../apiList/WallPainting Api/adminWallPaintingApi";
import { Button } from "../../../components/ui/Button";

export default function AdminWallMainContainer() {
  const { projectId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate()
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
    <div className="min-h-full bg-gradient-to-br from-gray-100 to-gray-200">
      {isRoot ? (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
              Admin Wall Painting Steps
            </h1>
            <p className="text-gray-600 text-lg">
              Select a step below to manage its details.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ADMIN_WALL_PAINTING_STEPS.map((step) => {
              const stepObj = sop?.steps?.find(
                (stepStage: any) => stepStage?.stepNumber === step.stepNumber
              );

              return (
                <li
                  key={step.stepNumber}
                  className="group relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                >
                  <Link
                    to={`step/${stepObj?._id}/${step.stepNumber}`}
                    className="flex flex-col justify-between h-full p-6"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
                        {step.label}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Step #{step.stepNumber}
                      </p>
                    </div>
                    <div className="mt-4">
                      <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full group-hover:bg-blue-700 transition">
                        View Step
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )
    :
     <section className="h-full w-full">
        <header className="p-2 px-4 bg-white shadow-sm flex justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl text-blue-600 font-semibold"> Admin Side</h1>
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
