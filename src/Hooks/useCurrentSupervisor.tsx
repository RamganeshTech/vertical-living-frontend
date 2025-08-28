import { useSelector } from "react-redux";
import type { RootState } from "../store/store";


export const useCurrentSupervisor = () => {
  const auth = useSelector((state: RootState) => state.authStore);

  const userProfile = useSelector((state: RootState) => state.userProfileStore);
  const staffProfile = useSelector((state: RootState) => state.staffProfileStore);
  const ctoProfile = useSelector((state: RootState) => state.CTOProfileStore);
  const workerProfile = useSelector((state: RootState) => state.workerProfileStore);
  const clientProfile = useSelector((state: RootState) => state.clientProfileStore);

  if (!auth.isauthenticated) return null;

  switch (auth.role?.toLowerCase()) {
    case "owner":
      return {
        id: userProfile?.userId || auth._id,
        name: userProfile?.userName  || "",
      };
    case "staff":
      return {
        id: staffProfile?.staffId || auth._id,
        name: staffProfile?.staffName || "",
      };
    case "cto":
      return {
        id: ctoProfile?.CTOId || auth._id,
        name: ctoProfile?.CTOName || "",
      };
    case "worker":
      return {
        id: workerProfile?.workerId || auth._id,
        name: workerProfile?.workerName || "",
      };
    case "client":
      return {
        id: clientProfile?.clientId || auth._id,
        name: clientProfile?.clientName || "",
      };
    default:
      return null;
  }
};
