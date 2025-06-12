import axios from "axios";
import {store} from '../../store/store';
import { setAuth } from "../../features/staffSlices";
import staffApi from "../../apiService/staffApiservice";


const getStaffRefreshtoken = async (): Promise<{ ok: boolean }> => {
  try {
    let { data } = await staffApi.get('/auth/staff/refreshtoken')
    store.dispatch(setAuth({ isAuthenticated: data.ok, }))
    return { ok: data.ok }
  }
  catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      store.dispatch(setAuth({ isAuthenticated: error.response.data.ok,}));
    } else {
      store.dispatch(setAuth({ isAuthenticated: false }));
    }
    return { ok: false };

  }
}


export default getStaffRefreshtoken;