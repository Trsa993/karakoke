import { useEffect } from "react";
import { useGlobalContext } from "./GlobalProvider";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

const OAuthRedirectHandler = () => {
  const { setAuth } = useGlobalContext();
  const navigateTo = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const accessToken = urlParams.get("access_token");
    const profileName = urlParams.get("profile_name");

    if (!accessToken) {
      return;
    }

    localStorage.setItem("profileName", profileName);

    setAuth({ accessToken: accessToken });

    navigateTo(from, { replace: true });
  }, []);

  return <div>Loading...</div>;
};

export default OAuthRedirectHandler;
