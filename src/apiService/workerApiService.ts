

// api/workerApi.ts
import axios from "axios";
import getWorkerRefreshtoken from "../utils/refresh tokens/workerRefreshToken";

const workerApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

workerApi.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;

     if (originalRequest.url.includes('/auth/worker/isauthenticated')) {
            return Promise.reject(error);
        }


    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

        try {
                // Refresh the token
                const { ok } = await getWorkerRefreshtoken();
                // console.log("refresh token",ok)

                if (ok) {
                    return workerApi(originalRequest);
                }
                // Retry the original failed request after refreshing the token
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);

                return Promise.reject(refreshError);
            }
    }

    return Promise.reject(error);
  }
);

export default workerApi;
