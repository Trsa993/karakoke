import homeIcon from "../assets/home-icon.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useLogout from "../hooks/useLogout";
import { api } from "../api";

const Navigation = () => {
  const navigateTo = useNavigate();
  const logout = useLogout();

  const profileName = localStorage.getItem("profileName");

  const signOut = async () => {
    await logout();
    navigateTo("/");
  };

  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState({ artists: [], songs: [] });

  useEffect(() => {
    const fetchData = async (value) => {
      try {
        if (value) {
          const response = await api.get(`/search?query=${value}`);
          setSearchResult({
            artists: response.data.artists,
            songs: response.data.songs,
          });
          console.log(searchResult);
        } else {
          setSearchResult({ artists: [], songs: [] });
        }
      } catch (error) {
        console.log(error.response);
      }
    };
    const timeoutId = setTimeout(() => fetchData(query), 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <nav className="flex">
      <img
        className="object-contain h-16 w-16 bg-red-700 hover:bg-sky-700"
        src={homeIcon}
        alt="home-icon"
        onClick={() => navigateTo("/")}
      />
      <input
        className=""
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div>
        {profileName ? (
          <div>
            <p>{profileName}</p>
            <button onClick={signOut}>Sign Out</button>
          </div>
        ) : (
          <button onClick={() => navigateTo("/login")}>Sign In</button>
        )}
      </div>
    </nav>
  );
};
export default Navigation;
