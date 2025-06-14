// hooks/useAuthCheck.ts
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setRole } from "../features/authSlice";
import Api from "../apiService/apiService";
import staffApi from "../apiService/staffApiservice";
import workerApi from "../apiService/workerApiService";
import { resetOwnerProfile, setOwnerProfileData } from "../features/userSlices";
import { resetWorkerProfile, setWorkerProfileData } from "../features/workerSlice";
import { resetStaffProfile, setStaffProfileData } from "../features/staffSlices";

export const useAuthCheck = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [authInfo, setAuthInfo] = useState<{ role: string | null; isauthenticated: boolean }>({
    role: null,
    isauthenticated: false,
  });

  useEffect(() => {
    const checkAllRoles = async () => {
      setLoading(true);
      setError(null);

      try {
        const [ownerRes, staffRes, workerRes] = await Promise.allSettled([
          Api.get("/auth/isauthenticated"),
          staffApi.get("/auth/staff/isauthenticated"),
          workerApi.get("/auth/worker/isauthenticated")
        ]);

        if (ownerRes.status === "fulfilled" && ownerRes.value.data.ok) {
          const info = { role: "owner", isauthenticated: true };
          dispatch(setRole(info));
          console.log(ownerRes)
          dispatch(setOwnerProfileData(ownerRes.value.data.data))
          setAuthInfo(info);
          return setLoading(false);;
        }

        if (staffRes.status === "fulfilled" && staffRes.value.data.ok) {
          const info = { role: "staff", isauthenticated: true };
          dispatch(setRole(info));
          dispatch(setStaffProfileData(staffRes.value.data.data))
          setAuthInfo(info);
          return setLoading(false);;
        }

        if (workerRes.status === "fulfilled" && workerRes.value.data.ok) {
          const info = { role: "worker", isauthenticated: true };
          dispatch(setRole(info));
          dispatch(setWorkerProfileData(workerRes.value.data.data))
          setAuthInfo(info);
          return setLoading(false);
        }

        dispatch(setRole({ role: null, isauthenticated: false }));
        setAuthInfo({ role: null, isauthenticated: false });

        dispatch(resetOwnerProfile())
        dispatch(resetStaffProfile())
        dispatch(resetWorkerProfile())

        setLoading(false);
      } catch (error) {
        dispatch(setRole({ role: null, isauthenticated: false }));
        setAuthInfo({ role: null, isauthenticated: false });
        setError("Something went wrong while checking authentication.");

        // resetting every data 
        dispatch(resetOwnerProfile())
        dispatch(resetStaffProfile())
        dispatch(resetWorkerProfile())
       
        setLoading(false);
      }
    };

    checkAllRoles();
  }, []);

  return { loading, error, ...authInfo }
};
