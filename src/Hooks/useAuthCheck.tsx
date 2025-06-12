// hooks/useAuthBootstrap.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRole } from "../features/authSlice";
import Api from "../apiService/apiService"; 
import staffApi from "../apiService/staffApiservice";
import workerApi from "../apiService/workerApiService"; 

export const useAuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAllRoles = async () => {
      try {
        const [ownerRes, staffRes, workerRes] = await Promise.allSettled([
          Api.get("/auth/isauthenticated"),
          staffApi.get("/auth/staff/isauthenticated"),
          workerApi.get("/auth/worker/isauthenticated")
        ]);

        if (ownerRes.status === "fulfilled" && ownerRes.value.data.ok) {
          dispatch(setRole({ role: "owner", isauthenticated: true }));
          return;
        }

        if (staffRes.status === "fulfilled" && staffRes.value.data.ok) {
          dispatch(setRole({ role: "staff", isauthenticated: true }));
          return;
        }

        if (workerRes.status === "fulfilled" && workerRes.value.data.ok) {
          dispatch(setRole({ role: "worker", isauthenticated: true }));
          return;
        }

        dispatch(setRole({ role: null, isauthenticated: false }));
      } catch (error) {
        dispatch(setRole({ role: null, isauthenticated: false }));
      }
    };

    checkAllRoles();
  }, []);
};
