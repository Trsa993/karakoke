import { useRef, useState, useEffect } from "react";
import { api } from "../api";
import { useGlobalContext } from "./GlobalProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BiErrorCircle, BiLogIn } from "react-icons/bi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import googleLogo from "../assets/google-logo.svg";
import facebookLogo from "../assets/facebook-logo.svg";

const Login = () => {
    const { setAuth, persist, setPersist } = useGlobalContext();

    const navigateTo = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("username", email);
        formData.append("password", pwd);
        formData.append("scope", `persist:${persist}`);

        try {
            const response = await api.post("/login", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            console.log(response?.data);
            const accessToken = response?.data?.access_token;
            const profileName = response?.data?.profile_name;
            localStorage.setItem("profileName", profileName);

            setAuth({ email, accessToken });
            setEmail("");
            setPwd("");
            navigateTo(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 400) {
                setErrMsg("Invalid Credentials");
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized");
            } else {
                setErrMsg("Login Failed");
            }
            setPwd("");
        }
    };

    useEffect(() => {
        if (errMsg && errRef.current) {
            errRef.current.focus();
            errRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [errMsg]);

    const handleGoogleLogin = async () => {
        window.location.href = "http://localhost:8000/login/google";
    };

    const handleFacebookLogin = async () => {
        window.location.href = "http://localhost:8000/login/facebook";
    };

    const togglePersist = () => {
        setPersist((prev) => !prev);
    };

    const toggleShowPwd = () => {
        setShowPwd((prev) => !prev);
    };

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist]);

    return (
        <div className="bg-slate-800 min-h-screen max-h-screen overflow-x-hidden text-white overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-100">
            <div className="bg-slate-900 h-16 flex items-center">
                <Link to="/">
                    <h1 className="text-3xl font-sans ml-8">🎤 Karakoke</h1>
                </Link>
            </div>
            <div className="flex grow shrink justify-center p-8 -sm:bg-slate-900 -sm:justify-start">
                <div className="bg-slate-900 border-2 rounded-md border-gray-700 -sm:border-0 w-full max-w-3xl flex flex-col py-8 justify-start items-center -sm:items-start">
                    <h1 className="text-5xl text-center w-full my-12 -sm:mt-0 -sm:mb-6  -sm:text-2xl -sm:text-left">
                        Log in to Karakoke
                    </h1>
                    <div className="w-96 flex flex-col -sm:w-full">
                        <div
                            ref={errRef}
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
                            <label className="text-xl mb-1" htmlFor="email">
                                Email:
                            </label>
                            <input
                                className="pl-2 h-12 border-2 border-gray-700 rounded-md bg-slate-800 focus:border-white focus:ring-0"
                                type="text"
                                id="email"
                                ref={emailRef}
                                placeholder="Email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />

                            <label
                                className="text-xl mb-1 mt-2"
                                htmlFor="password"
                            >
                                Password:
                            </label>
                            <div
                                className={`flex justify-between items-center border-2 border-gray-700 rounded-md bg-slate-800 ${
                                    pwdFocus ? "focus-within:border-white" : ""
                                }`}
                            >
                                <input
                                    className="pl-2 h-12 border-0 bg-transparent w-full focus:outline-none focus:ring-0"
                                    type={showPwd ? "text" : "password"}
                                    id="password"
                                    placeholder="Password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                    onFocus={() => setPwdFocus(true)}
                                    onBlur={() => setPwdFocus(false)}
                                />
                                <button
                                    type="button"
                                    className="px-3 focus:outline-none focus:ring-0 custom-focus-border"
                                    onClick={toggleShowPwd}
                                >
                                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <div className="my-2 ml-1 flex items-center">
                                <input
                                    className="w-4 h-4 border border-gray-700 rounded bg-slate-800 focus:ring-white focus:ring-offset-0 hover:border-white hover:border-2 checked:hover:border-white checked:hover:border-1"
                                    type="checkbox"
                                    id="persist"
                                    onChange={togglePersist}
                                    checked={persist}
                                />
                                <label className="pl-2" htmlFor="persist">
                                    Trust This Device
                                </label>
                            </div>
                            <button className="mt-5 mx-auto h-12 w-full flex gap-2 justify-center items-center border-2 border-gray-700 rounded-3xl bg-blue-600 hover:bg-blue-500">
                                <span className="text-center text-xl">
                                    Log in
                                </span>
                                <BiLogIn className="w-7 h-7" />
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
                            <span className="m-auto left-0 right-0">
                                Continue with Google
                            </span>
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
                                Continue with Facebook
                            </span>
                        </button>
                    </div>
                    <hr className="my-6 h-0.5 border-0 w-10/12 bg-gray-700 -sm:w-full" />
                    <p className="flex gap-2 text-xl">
                        Don't have an account?
                        <span>
                            <Link
                                className="underline underline-offset-2"
                                to="/register"
                            >
                                Sign up
                            </Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
