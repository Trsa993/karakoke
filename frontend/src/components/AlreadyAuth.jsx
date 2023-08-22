import { Navigate, Outlet } from "react-router-dom";

const AleradyAuth = () => {
  const profileName = localStorage.getItem("profileName");

  return !profileName ? <Outlet /> : <Navigate to="/" replace />;
};

export default AleradyAuth;
