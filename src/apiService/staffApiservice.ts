// api/staffApi.ts
import axios from "axios";
import getStaffRefreshtoken from "../utils/refresh tokens/staffRefreshToken";

const staffApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

staffApi.interceptors.request.use(
    (config) => {
        return config; // No need to manually add token in headers (handled via cookies)
    },
    (error) => Promise.reject(error)
);

staffApi.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;

     if (originalRequest.url.includes('/auth/staff/isauthenticated')) {
            return Promise.reject(error);
        }

    if ((error.response?.status === 401 || error.response?.status === 403)) {
      originalRequest._retry = true;

       try {
                // Refresh the token
                const { ok } = await getStaffRefreshtoken();

                if (ok) {
                    return staffApi(originalRequest);
                }
                // Retry the original failed request after refreshing the token
            } catch (refreshError) {

                return Promise.reject(refreshError);
            }
    }

    return Promise.reject(error);
  }
);

export default staffApi;
