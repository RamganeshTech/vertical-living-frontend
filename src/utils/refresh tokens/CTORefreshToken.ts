import axios from "axios";
import {store} from '../../store/store';
import { setAuth } from "../../features/CTOSlice";
import staffApi from "../../apiService/staffApiservice";


const getCTORefreshtoken = async (): Promise<{ ok: boolean }> => {
  try {
    let { data } = await staffApi.get('/auth/CTO/refreshtoken')
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


export default getCTORefreshtoken;