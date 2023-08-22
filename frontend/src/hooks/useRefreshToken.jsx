import { useGlobalContext } from "../components/GlobalProvider";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const useRefreshToken = () => {
  const { setAuth } = useGlobalContext();

  const refresh = async () => {
    try {
      const response = await api.get("/refresh", {
        withCredentials: true,
      });
      setAuth((prev) => {
        // console.log(JSON.stringify(prev));
        // console.log(response.data.access_token);
        return {
          ...prev,
          accessToken: response.data.access_token,
        };
      });

      return response.data.access_token;
    } catch (error) {
      if (error.response?.status === 400) {
        console.log("Invalid refresh token");
        localStorage.clear();
        setAuth({});
      }
    }
  };

  return refresh;
};

export default useRefreshToken;
