import React from "react";
import { GoogleLogin } from "react-google-login";

const responseGoogle = (response) => {
  console.log(response);
};

const Auth = () => (
  <div>
    <GoogleLogin
      clientId="Your-Google-Client-ID"
      buttonText="Login with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  </div>
);

export default Auth;
