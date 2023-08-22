import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BiErrorCircle } from "react-icons/bi";
import {
  FaTimes,
  FaCheck,
  FaInfoCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { api } from "../api";
import googleLogo from "../assets/google-logo.svg";
import facebookLogo from "../assets/facebook-logo.svg";

const USER_REGEX = /^[A-z][A-z0-9-_\s]{2,30}$/;
const EMAIL_REGEX = /^([A-z0-9._%-]+@[A-z0-9.-]+\.[A-z]{2,})$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{5,24}$/;
const REGISTER_URL = "/users";

const Register = () => {
  const navigateTo = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [email, user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = USER_REGEX.test(user);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = PWD_REGEX.test(pwd);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await api.post(
        REGISTER_URL,
        JSON.stringify({
          profile_name: user,
          email: email,
          password: pwd,
          confirm_password: matchPwd,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response?.data);

      setUser("");
      setEmail("");
      setPwd("");
      setMatchPwd("");
      navigateTo("/login");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Email Already Exist");
      } else if (err.response?.status === 400) {
        setErrMsg("Passwords Do Not Match");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:8000/login/google";
  };

  const handleFacebookLogin = async () => {
    window.location.href = "http://localhost:8000/login/facebook";
  };

  const toggleShowPwd = () => {
    setShowPwd((prev) => !prev);
  };

  return (
    <div className="bg-slate-800 min-h-screen min-w-fit overflow-x-hidden text-white">
      <div className="bg-slate-900 h-16 flex items-center">
        <Link to="/">
          <h1 className="text-3xl font-sans ml-8">🎤 Karakoke</h1>
        </Link>
      </div>
      <div className="flex grow shrink justify-center p-8 -sm:bg-slate-900 -sm:justify-start">
        <div className="bg-slate-900 border-2 rounded-md border-gray-700 -sm:border-0 w-full max-w-3xl flex flex-col py-8 justify-start items-center -sm:items-start">
          <h1 className="text-5xl text-center w-full my-12 -sm:mt-0 -sm:mb-6  -sm:text-2xl -sm:text-left">
            Sign up to Karakoke
          </h1>
          <div className="w-96 flex flex-col -sm:w-full">
            <div
              ref={errRef}
              aria-live="assertive"
              className="flex items-center space-x-2 bg-red-600 mb-2 text-xl"
            >
              {errMsg ? (
                <>
                  <BiErrorCircle />
                  <span>{errMsg}</span>
                </>
              ) : null}
            </div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <label className="flex items-end text-xl mb-1" htmlFor="username">
                Username:
                <FaCheck
                  className={
                    validName ? "fill-green-700 ml-1 h-6 w-6" : "hidden"
                  }
                />
                <FaTimes
                  className={
                    validName || !user ? "hidden" : "fill-red-700 ml-1 h-6 w-6"
                  }
                />
              </label>
              <input
                className="pl-2 h-12 border-2 border-gray-700 rounded-md bg-slate-800 focus:border-white focus:ring-0"
                type="text"
                id="username"
                placeholder="Username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              <div
                id="uidnote"
                className={
                  userFocus && user && !validName
                    ? "pl-1 py-2 inline-block mt-2 border-2 rounded-md border-gray-700 text-sm"
                    : "hidden"
                }
              >
                <div className="flex gap-1 mb-0 items-center">
                  <FaInfoCircle />
                  <span>3 to 24 characters.</span>
                </div>
                Must begin with a letter.
                <br />
                Letters, numbers, spaces, underscores, hyphens allowed.
              </div>

              <label
                className="flex items-end text-xl mb-1 mt-2"
                htmlFor="email"
              >
                Email:
                <FaCheck
                  className={
                    validEmail ? "fill-green-700 ml-1 h-6 w-6" : "hidden"
                  }
                />
                <FaTimes
                  className={
                    validEmail || !email
                      ? "hidden"
                      : "fill-red-700 ml-1 h-6 w-6"
                  }
                />
              </label>
              <input
                className="pl-2 h-12 border-2 border-gray-700 rounded-md bg-slate-800 focus:border-white focus:ring-0"
                type="email"
                id="email"
                placeholder="Email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />

              <label
                className="flex items-end text-xl mb-1 mt-2"
                htmlFor="password"
              >
                Password:
                <FaCheck
                  className={
                    validPwd ? "fill-green-700 ml-1 h-6 w-6" : "hidden"
                  }
                />
                <FaTimes
                  className={
                    validPwd || !pwd ? "hidden" : "fill-red-700 ml-1 h-6 w-6"
                  }
                />
              </label>
              <div className="flex justify-between items-center border-2 border-gray-700 rounded-md bg-slate-800 focus-within:border-white">
                <input
                  className="pl-2 h-12 border-0 bg-transparent w-full focus:outline-none focus:ring-0"
                  type={showPwd ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <button type="button" className="px-3" onClick={toggleShowPwd}>
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div
                id="pwdnote"
                className={
                  pwdFocus && !validPwd
                    ? "pl-1 py-2 inline-block mt-2 border-2 rounded-md border-gray-700 text-sm"
                    : "hidden"
                }
              >
                <div className="flex gap-1 mb-0 items-center">
                  <FaInfoCircle />
                  <span>5 to 24 characters.</span>
                </div>
                Must include uppercase and lowercase letters and a number.
              </div>

              <label
                className="flex items-end text-xl mb-1 mt-2"
                htmlFor="confirm_pwd"
              >
                Confirm Password:
                <FaCheck
                  className={
                    validMatch && matchPwd
                      ? "fill-green-700 ml-1 h-6 w-6"
                      : "hidden"
                  }
                />
                <FaTimes
                  className={
                    validMatch || !matchPwd
                      ? "hidden"
                      : "fill-red-700 ml-1 h-6 w-6"
                  }
                />
              </label>
              <input
                className="pl-2 h-12 border-2 border-gray-700 rounded-md bg-slate-800 focus:border-white focus:ring-0"
                type={showPwd ? "text" : "password"}
                id="confirm_pwd"
                placeholder="Confirm Password"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              <div
                id="confirmnote"
                className={
                  matchFocus && !validMatch
                    ? "pl-1 py-2 inline-block mt-2 border-2 rounded-md border-gray-700 text-sm"
                    : "hidden"
                }
              >
                <div className="flex gap-1 mb-0 items-center">
                  <FaInfoCircle />
                  <span>Must match the first password input field.</span>
                </div>
              </div>

              <button
                className="mt-5 h-12 w-full flex justify-center items-center border-2 border-gray-700 rounded-3xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 text-center text-xl"
                disabled={!validName || !validPwd || !validMatch ? true : false}
              >
                Sign up
              </button>
            </form>
          </div>
          <hr className="my-6 h-0.5 border-0 w-10/12 bg-gray-700 -sm:w-full" />
          <div className="w-96 flex flex-col gap-y-2 text-xl -sm:w-full">
            <button
              className="h-12 w-full flex items-center relative bg-slate-800 border-2 border-gray-700 rounded-3xl hover:bg-slate-700"
              onClick={handleGoogleLogin}
            >
              <img
                className="w-7 h-7 absolute left-4"
                src={googleLogo}
                loading="lazy"
                alt="google logo"
              ></img>
              <span className="m-auto left-0 right-0">Sign up with Google</span>
            </button>
            <button
              className="h-12 w-full flex items-center relative bg-slate-800 border-2 border-gray-700 rounded-3xl hover:bg-slate-700"
              onClick={handleFacebookLogin}
            >
              <img
                className="w-7 h-7 absolute left-4"
                src={facebookLogo}
                loading="lazy"
                alt="facebook logo"
              ></img>
              <span className="m-auto left-0 right-0">
                Sign up with Facebook
              </span>
            </button>
          </div>
          <hr className="my-6 h-0.5 border-0 w-10/12 bg-gray-700 -sm:w-full" />
          <p className="flex gap-2 text-xl">
            Alerady registred?
            <span>
              <Link className="underline underline-offset-2" to="/login">
                Log in
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
