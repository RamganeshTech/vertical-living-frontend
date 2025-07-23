import axios from 'axios';
import getRefreshtoken from '../utils/refresh tokens/refreshtoken';

let Api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true
})

Api.interceptors.request.use(
    (config) => {
        return config; // No need to manually add token in headers (handled via cookies)
    },
    (error) => Promise.reject(error)
);


// Response Interceptor (Handles expired tokens)
Api.interceptors.response.use(
    (response) => response, // If successful, just return the response
    async (error) => {
        const originalRequest = error.config;

        // If the failing request is for the refresh token, reject immediately
        // if (originalRequest.url.includes('/auth/isauthenticated')) {
        //     return Promise.reject(error);
        // }

        // Handle both 401 (Unauthorized) & 403 (Forbidden) errors
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite retry loops
            // remember refrsh token should not return any response with 401 or 403 status code, else it will be in infinite loop

            try {
                // Refresh the token
                const { ok } = await getRefreshtoken();

                if (ok) {
                    return Api(originalRequest);
                }
                // Retry the original failed request after refreshing the token
            } catch (refreshError) {

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default Api;
