import axios from "axios";
import {store} from '../../store/store';
import { setAuth } from "../../features/workerSlice";
import workerApi from "../../apiService/workerApiService";


const getWorkerRefreshtoken = async (): Promise<{ ok: boolean }> => {
  try {
    let { data } = await workerApi.get('/auth/worker/refreshtoken')
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


export default getWorkerRefreshtoken;