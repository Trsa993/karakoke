import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import Search from "./Search";
import { HiHome } from "react-icons/hi";

const Navigation = () => {
  const navigateTo = useNavigate();
  const logout = useLogout();

  const profileName = localStorage.getItem("profileName");

  const signOut = async () => {
    await logout();
    navigateTo("/");
  };

  return (
    <nav className="grid grid-cols-3 items-center min-w-screen h-12 bg-slate-900 text-white">
      <div className="justify-self-start">
        <HiHome
          className="fill-white cursor-pointer h-8 w-8 ml-2"
          onClick={() => navigateTo("/")}
        />
      </div>
      <div className="justify-self-auto h-10">
        <Search />
      </div>
      <div className="justify-self-end mr-3">
        {profileName ? (
          <div className="flex gap-2 items-center">
            <p className="line-clamp-1 -lg:text-xs -md:hidden">{profileName}</p>
            <button
              className="border-2 border-gray-700 rounded-full bg-blue-600 px-4 py-1 hover:scale-110 transition-all duration-200 ease-in-out whitespace-nowrap truncate"
              onClick={signOut}
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            className="border-2 border-gray-700 rounded-full bg-blue-600 px-4 py-1 hover:scale-110 transition-all duration-200 ease-in-out whitespace-nowrap truncate"
            onClick={() => navigateTo("/login")}
          >
            Log in
          </button>
        )}
      </div>
    </nav>
  );
};
export default Navigation;
