// hooks/useAuthCheck.ts
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout, setRole } from "../features/authSlice";
import Api from "../apiService/apiService";
import staffApi from "../apiService/staffApiservice";
import workerApi from "../apiService/workerApiService";
import { resetOwnerProfile, setOwnerProfileData } from "../features/userSlices";
import { resetWorkerProfile, setWorkerProfileData } from "../features/workerSlice";
import { resetStaffProfile, setStaffProfileData } from "../features/staffSlices";
import CTOApi from "../apiService/CTOService";
import { resetCTOProfile, setCTOProfileData } from "../features/CTOSlice";
import clientApi from "../apiService/clientService";
import { resetClientProfile, setClientProfileData } from "../features/clientSlice";

export const useAuthCheck = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [authInfo, setAuthInfo] = useState<{ role: string | null; isauthenticated: boolean, _id:null | string }>({
    role: null,
    isauthenticated: false,
    _id:null
  });


  useEffect(() => {
    const checkAllRoles = async () => {
      setLoading(true);
      setError(null);

      try {
        const [ownerRes, staffRes, workerRes, CTORes, clientRes] = await Promise.allSettled([
          Api.get("/auth/isauthenticated"),
          staffApi.get("/auth/staff/isauthenticated"),
          workerApi.get("/auth/worker/isauthenticated"),
          CTOApi.get('/auth/CTO/isauthenticated'),
          clientApi.get('/auth/client/isauthenticated')
        ]);

        if (ownerRes.status === "fulfilled" && ownerRes.value.data.ok) {
          console.log(ownerRes.value)
          const info = { role: "owner", isauthenticated: true, _id:ownerRes.value.data.data.userId };
          dispatch(setRole(info));
          console.log(ownerRes)
          dispatch(setOwnerProfileData(ownerRes.value.data.data))
          setAuthInfo({...info, _id:ownerRes.value.data.data.userId});
          console.log("im shoduld get executed fierst")
          return setLoading(false);;
        }

        if (staffRes.status === "fulfilled" && staffRes.value.data.ok) {
          const info = { role: "staff", isauthenticated: true, _id:staffRes.value.data.data.staffId };
          dispatch(setRole(info));
          dispatch(setStaffProfileData(staffRes.value.data.data))
          setAuthInfo({...info,  _id:staffRes.value.data.data.staffId});
          return setLoading(false);;
        }

        if (workerRes.status === "fulfilled" && workerRes.value.data.ok) {
          const info = { role: "worker", isauthenticated: true ,  _id:workerRes.value.data.data.workerId};
          dispatch(setRole(info));
          dispatch(setWorkerProfileData(workerRes.value.data.data))
          setAuthInfo({...info, _id:workerRes.value.data.data.workerId});
          return setLoading(false);
        }

        if (CTORes.status === "fulfilled" && CTORes.value.data.ok) {
          const info = { role: "CTO", isauthenticated: true , _id:CTORes.value.data.data.CTOId};
          dispatch(setRole(info));
          dispatch(setCTOProfileData(CTORes.value.data.data))
          setAuthInfo({...info, _id:CTORes.value.data.data.CTOId});
          return setLoading(false);
        }

         if (clientRes.status === "fulfilled" && clientRes.value.data.ok) {
          const info = { role: "client", isauthenticated: true , _id:clientRes.value.data.data.clientId};
          dispatch(setRole(info));
          dispatch(setClientProfileData(clientRes.value.data.data))
          setAuthInfo({...info, _id:clientRes.value.data.data.clientId});
          return setLoading(false);
        }

        dispatch(setRole({ role: null, isauthenticated: false, _id:null }));
        setAuthInfo({ role: null, isauthenticated: false, _id:null });

        dispatch(resetOwnerProfile())
        dispatch(resetStaffProfile())
        dispatch(resetWorkerProfile())
        dispatch(resetCTOProfile())
        dispatch(resetClientProfile())
        dispatch(logout())

        setLoading(false);
      } catch (error) {
        dispatch(setRole({ role: null, isauthenticated: false, _id:null }));
        setAuthInfo({ role: null, isauthenticated: false, _id:null });
        setError("Something went wrong while checking authentication.");

        // resetting every data 
        dispatch(resetOwnerProfile())
        dispatch(resetStaffProfile())
        dispatch(resetWorkerProfile())
        dispatch(resetCTOProfile())
        dispatch(resetClientProfile())
        dispatch(logout())

       
        setLoading(false);
      }
    };

    checkAllRoles();
  }, []);

  return { loading, error, ...authInfo }
};
