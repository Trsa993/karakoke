import { useGlobalContext } from "../components/GlobalProvider";
import useApiPrivate from "../hooks/useApiPrivate";

const useLogout = () => {
  const { setAuth } = useGlobalContext();
  const apiPrivate = useApiPrivate();

  const logout = async () => {
    setAuth({});
    localStorage.clear();
    try {
      await apiPrivate.get("/logout");
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
};

export default useLogout;
