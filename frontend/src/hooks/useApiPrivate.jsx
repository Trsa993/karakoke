import { useEffect } from "react";
import { apiPrivate } from "../api";
import { useGlobalContext } from "../components/GlobalProvider";
import useRefreshToken from "./useRefreshToken";

const useApiPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useGlobalContext();

  useEffect(() => {
    const requestInterceptor = apiPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = apiPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest._retry) {
          prevRequest._retry = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiPrivate.interceptors.request.eject(requestInterceptor);
      apiPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refresh]);

  return apiPrivate;
};

export default useApiPrivate;
