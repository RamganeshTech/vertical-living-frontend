// import { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useGetCurrentActiveStage } from "../../apiList/currentActiveStage api/currentActiveStageApi";

// const ProjectStageRedirect = () => {
//   const { projectId } = useParams();
//   const navigate = useNavigate();

//   const { data: currentStagePath, isLoading } = useGetCurrentActiveStage(projectId!);

//   useEffect(() => {
//     if (!isLoading && currentStagePath && projectId) {
//       navigate(currentStagePath);
//     }
//   }, [isLoading, currentStagePath, navigate, projectId]);

//   return null;
// };

// export default ProjectStageRedirect;
