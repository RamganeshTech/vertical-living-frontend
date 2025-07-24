// import React from "react";
// import { useParams, Link, useLocation, Outlet, useOutletContext } from "react-router-dom";
// import { useGetAllStageDocumentation, type DocumentStage } from "../../apiList/Documentation Api/documentationApi"; 
// import { Button } from "../../components/ui/Button"; 
// import { Card , CardContent} from './../../components/ui/Card';
// import type { ProjectDetailsOutlet } from "../../types/types";

// const DocumentationMain:React.FC = () => {
//   const { projectId } = useParams();
//   const location = useLocation()
//   const {isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>()
//   const { data, isLoading, isError } = useGetAllStageDocumentation(projectId!);

//   if (isLoading) return <p className="text-center">Loading...</p>;
//   if (isError) return <p className="text-center text-red-500">Failed to load data</p>;

//   const locationArray = location.pathname.split('/')
//   const isChild = locationArray.indexOf("document") !== locationArray.length-1


//   return (
//     <div className="max-w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//          {isMobile && (
//                   <button
//                     onClick={openMobileSidebar}
//                     className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
//                     title="Open Menu"
//                   >
//                     <i className="fa-solid fa-bars"></i>
//                   </button>
//                 )}
//      {isChild ? <Outlet /> :
//      <>
//      {data?.stages?.length ? (
//         data.stages.map((stage:DocumentStage) => (
//           <Card key={stage.stageNumber} className="hover:shadow-lg transition">
//             <CardContent className="p-4">
//               <h2 className="text-xl font-semibold mb-2">Stage {stage.stageNumber}</h2>
//               <p className="text-sm text-muted-foreground line-clamp-3">
//                 {stage.description || "No description provided."}
//               </p>
//               <div className="mt-4">
//                 <Link to={`${stage.stageNumber}`}>
//                   <Button>View Details</Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         ))
//       ) : (
//         <p className="text-center col-span-2">No documentation available yet.</p>
//       )}
//       </>
//       }

//     </div>
//   );
// };

// export default DocumentationMain;





// "use client"

// import type React from "react"
// import { useParams, Link, useLocation, Outlet, useOutletContext } from "react-router-dom"
// import { useGetAllStageDocumentation, type DocumentStage } from "../../apiList/Documentation Api/documentationApi"
// import { Button } from "../../components/ui/Button"
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
// import { Badge } from "../../components/ui/Badge"
// import { Skeleton } from "../../components/ui/Skeleton"
// import type { ProjectDetailsOutlet } from "../../types/types"

// const DocumentationMain: React.FC = () => {
//   const { projectId } = useParams()
//   const location = useLocation()
//   const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>()
//   const { data, isLoading, isError } = useGetAllStageDocumentation(projectId!)

//   const locationArray = location.pathname.split("/")
//   const isChild = locationArray.indexOf("document") !== locationArray.length - 1

//   if (isLoading) {
//     return (
//       <div className="mx-auto p-4 space-y-6 overflow-y-auto max-h-full custom-scrollbar">
//         {isMobile && (
//           <Button variant="outline" size="sm" onClick={openMobileSidebar} className="mb-4 bg-transparent">
//             <i className="fa-solid fa-bars mr-2"></i>
//             Menu
//           </Button>
//         )}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <Card key={index} className="overflow-hidden">
//               <CardHeader className="pb-3">
//                 <Skeleton className="h-6 w-24" />
//                 <Skeleton className="h-4 w-full" />
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-16 w-full mb-4" />
//                 <Skeleton className="h-9 w-28" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   if (isError) {
//     return (
//       <div className="container mx-auto">
//         {isMobile && (
//           <Button variant="outline" size="sm" onClick={openMobileSidebar} className="mb-4 bg-transparent">
//             <i className="fa-solid fa-bars mr-2"></i>
//             Menu
//           </Button>
//         )}
//         <div className="max-w-4xl mx-auto">
//           <Card className="border-red-200 bg-red-50">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3">
//                 <i className="fa-solid fa-exclamation-triangle text-red-500 text-xl"></i>
//                 <div>
//                   <h3 className="font-semibold text-red-800">Error Loading Documentation</h3>
//                   <p className="text-red-600 text-sm mt-1">Failed to load documentation. Please try again later.</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="mx-auto  space-y-6 h-full overflow-y-auto custom-scrollbar">
//       {isMobile && (
//         <Button variant="outline" size="sm" onClick={openMobileSidebar} className="mb-4 bg-transparent">
//           <i className="fa-solid fa-bars mr-2"></i>
//           Menu
//         </Button>
//       )}

//       {isChild ? (
//         <Outlet />
//       ) : (
//         <>
//           <div className="space-y-4">
//             <div className="flex flex-col space-y-2">
//               <h1 className="text-3xl font-bold tracking-tight">Project Documentation</h1>
//               <p className="text-muted-foreground">Track and manage documentation across all project stages</p>
//             </div>

//             {data?.stages?.length ? (
//               <>
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                   <i className="fa-solid fa-file-text"></i>
//                   <span>{data.stages.length} stages available</span>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {data.stages.map((stage: DocumentStage) => (
//                     <>
//                     <Card
//                       key={stage.stageNumber}
//                       className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-primary/20 hover:border-l-primary"
//                     >
//                       <CardHeader className="pb-3">
//                         <div className="flex items-center justify-between">
//                           <CardTitle className="text-lg flex items-center gap-2">
//                             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
//                               {stage.stageNumber}
//                             </div>
//                             Stage {stage.stageNumber}
//                           </CardTitle>
//                           <Badge variant="secondary" className="text-xs">
//                             <i className="fa-solid fa-clock mr-1"></i>
//                             Active
//                           </Badge>
//                         </div>
//                       </CardHeader>

//                       <CardContent className="space-y-4">
//                         <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3rem]">
//                           {stage.description || "No description provided for this stage."}
//                         </p>

//                         <div className="flex items-center justify-between pt-2">
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <i className="fa-solid fa-check-circle"></i>
//                             <span>Ready to view</span>
//                           </div>

//                           <Link to={`${stage.stageNumber}`}>
//                             <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
//                               View Details
//                             </Button>
//                           </Link>
//                         </div>
//                       </CardContent>
//                     </Card>
//                      <Card
//                       key={stage.stageNumber}
//                       className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-primary/20 hover:border-l-primary"
//                     >
//                       <CardHeader className="pb-3">
//                         <div className="flex items-center justify-between">
//                           <CardTitle className="text-lg flex items-center gap-2">
//                             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
//                               {stage.stageNumber}
//                             </div>
//                             Stage {stage.stageNumber}
//                           </CardTitle>
//                           <Badge variant="secondary" className="text-xs">
//                             <i className="fa-solid fa-clock mr-1"></i>
//                             Active
//                           </Badge>
//                         </div>
//                       </CardHeader>

//                       <CardContent className="space-y-4">
//                         <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3rem]">
//                           {stage.description || "No description provided for this stage."}
//                         </p>

//                         <div className="flex items-center justify-between pt-2">
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <i className="fa-solid fa-check-circle"></i>
//                             <span>Ready to view</span>
//                           </div>

//                           <Link to={`${stage.stageNumber}`}>
//                             <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
//                               View Details
//                             </Button>
//                           </Link>
//                         </div>
//                       </CardContent>
//                     </Card>
//                      <Card
//                       key={stage.stageNumber}
//                       className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-primary/20 hover:border-l-primary"
//                     >
//                       <CardHeader className="pb-3">
//                         <div className="flex items-center justify-between">
//                           <CardTitle className="text-lg flex items-center gap-2">
//                             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
//                               {stage.stageNumber}
//                             </div>
//                             Stage {stage.stageNumber}
//                           </CardTitle>
//                           <Badge variant="secondary" className="text-xs">
//                             <i className="fa-solid fa-clock mr-1"></i>
//                             Active
//                           </Badge>
//                         </div>
//                       </CardHeader>

//                       <CardContent className="space-y-4">
//                         <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3rem]">
//                           {stage.description || "No description provided for this stage."}
//                         </p>

//                         <div className="flex items-center justify-between pt-2">
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <i className="fa-solid fa-check-circle"></i>
//                             <span>Ready to view</span>
//                           </div>

//                           <Link to={`${stage.stageNumber}`}>
//                             <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
//                               View Details
//                             </Button>
//                           </Link>
//                         </div>
//                       </CardContent>
//                     </Card>
//                     </>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <Card className="max-w-2xl mx-auto">
//                 <CardContent className="flex flex-col items-center justify-center py-12 text-center">
//                   <i className="fa-solid fa-file-text text-5xl text-muted-foreground mb-4"></i>
//                   <h3 className="text-lg font-semibold mb-2">No Documentation Available</h3>
//                   <p className="text-muted-foreground">
//                     Documentation stages will appear here once they are created for this project.
//                   </p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default DocumentationMain






"use client"

import type React from "react"
import { useParams, Link, useLocation, Outlet, useOutletContext } from "react-router-dom"
import { useGetAllStageDocumentation, type DocumentStage } from "../../apiList/Documentation Api/documentationApi"
import { Button } from "../../components/ui/Button"
import { Skeleton } from "../../components/ui/Skeleton"
import type { ProjectDetailsOutlet } from "../../types/types"

const DocumentationMain: React.FC = () => {
    const { projectId } = useParams()
    const location = useLocation()
    const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>()
    const { data, isLoading, isError, refetch, isFetching } = useGetAllStageDocumentation(projectId!)

    const locationArray = location.pathname.split("/")
    const isChild = locationArray.indexOf("document") !== locationArray.length - 1


   
    if (isLoading) {
        return (
            <div className="mx-auto p-4 space-y-6 overflow-y-auto max-h-full custom-scrollbar">
                {isMobile && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openMobileSidebar}
                        className="mb-4 bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        <i className="fa-solid fa-bars mr-2"></i>
                        Menu
                    </Button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-200">
                                <Skeleton className="h-6 w-24 bg-slate-200 mb-2" />
                                <Skeleton className="h-4 w-full bg-slate-200" />
                            </div>
                            <div className="p-4">
                                <Skeleton className="h-16 w-full mb-4 bg-slate-200" />
                                <Skeleton className="h-9 w-28 bg-slate-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="container mx-auto">
                {isMobile && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openMobileSidebar}
                        className="mb-4 bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        <i className="fa-solid fa-bars mr-2"></i>
                        Menu
                    </Button>
                )}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-exclamation-triangle text-red-500 text-xl"></i>
                            <div>
                                <h3 className="font-semibold text-red-800">Error Loading Documentation</h3>
                                <p className="text-red-600 text-sm mt-1">Failed to load documentation. Please try again later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


     if (data === null) {
        return (
             <div className="container mx-auto">
                {isMobile && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openMobileSidebar}
                        className="mb-4 bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        <i className="fa-solid fa-bars mr-2"></i>
                        Menu
                    </Button>
                )}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-exclamation-triangle text-blue-600 text-xl"></i>
                            <div>
                                <h3 className="font-semibold text-blue-800">No Documentation created Yet</h3>
                                <p className="text-blue-600 text-sm mt-1">Failed to load documentation. Please try again later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        )
    }


    return (
        <div className="mx-auto space-y-6 h-full overflow-y-auto custom-scrollbar">
            {isChild ? (
                <Outlet />
            ) : (
                <>
                    <div className="space-y-4">
                        <div className="flex flex-col space-y-1">
                            <div className="flex gap-2 items-center">
                                {isMobile && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={openMobileSidebar}
                                        className="bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100"
                                    >
                                        <i className="fa-solid fa-bars "></i>
                                    </Button>
                                )}

                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-600">Project Documentation</h1>
                            </div>
                            <p className="text-slate-600 text-sm sm:text-xl">Track and manage documentation across all project stages</p>

                        </div>
                        {data?.stages?.length ? (
                            <>
                                <div className="flex justify-between items-center gap-2 text-sm text-slate-500">
                                    <div>
                                        <i className="fa-solid fa-file-text text-indigo-500"></i>
                                        <span>{data.stages.length} stages available</span>
                                    </div>

                                    <div>
                                        <Button isLoading={isFetching} onClick={() => refetch()}>
                                            <i className="fas fa-refresh mr-1"></i> Sync
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data.stages.map((stage: DocumentStage) => (
                                        <div
                                            key={stage.stageNumber}
                                            className="group relative bg-white rounded-lg border-l-4  shadow-sm border-indigo-600 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                        >
                                            {/* Left Border Accent */}

                                            {/* Header */}
                                            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                                                            {stage.stageNumber}
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-slate-800">Stage {stage.stageNumber}</h3>
                                                    </div>
                                                    {/* <Badge className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">
                            <i className="fa-solid fa-clock mr-1"></i>
                            Active
                          </Badge> */}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 space-y-4">
                                                <p className="text-sm text-slate-600 line-clamp-3 min-h-[3rem] leading-relaxed">
                                                    {stage.description || "No description provided for this stage."}
                                                </p>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <i className="fa-solid fa-check-circle text-emerald-500"></i>
                                                        <span>Ready to view</span>
                                                    </div>

                                                    <Link to={`${stage.stageNumber}`}>
                                                        <Button
                                                            size="sm"
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                                <i className="fa-solid fa-file-text text-5xl text-slate-400 mb-4"></i>
                                <h3 className="text-lg font-semibold mb-2 text-slate-800">No Documentation Available</h3>
                                <p className="text-slate-600">
                                    Documentation stages will appear here once they are created for this project.
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default DocumentationMain
