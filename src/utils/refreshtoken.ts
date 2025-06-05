import axios from "axios";
import Api from "../apiService/apiService";
import {store} from './../store/store';
import { setAuth } from "../features/userSlices";


const getRefreshtoken = async (): Promise<{ ok: boolean }> => {
  try {
    let { data } = await Api.get('/auth/refreshtoken')
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


export default getRefreshtoken;