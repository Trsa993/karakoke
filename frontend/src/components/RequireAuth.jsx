import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useGlobalContext } from "./GlobalProvider";

const RequireAuth = () => {
  const { auth } = useGlobalContext();
  const location = useLocation();

  return auth?.email ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
