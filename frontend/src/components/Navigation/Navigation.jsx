import { useNavigate } from "react-router-dom";
import homeIcon from "../../assets/home-icon.png";
import { useState, useEffect } from "react";
import api from "../../api";

const Navigation = ({ isLoggedIn }) => {
  const navigateTo = useNavigate();

  const handleHomeClick = () => {
    const endpoint = isLoggedIn ? "/home" : "/home/guest";
    navigateTo(endpoint);
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
    <nav>
      <img src={homeIcon} alt="home-icon" onClick={handleHomeClick} />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </nav>
  );
};
export default Navigation;
