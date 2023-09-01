import { useState, useEffect, useRef } from "react";
import { api } from "../api";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useKeyPress from "../hooks/useKeyPress";
import { useGlobalContext } from "./GlobalProvider";

const Search = () => {
  const { isSearchFocused, setIsSearchFocused } = useGlobalContext();
  const [cursor, setCursor] = useState(-1);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const resultsRef = useRef([]);

  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState({ artists: [], songs: [] });

  const navigateTo = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async (value) => {
      try {
        if (value) {
          const response = await api.get(`/search?query=${value}`, { signal });
          setSearchResult({
            artists: response.data?.artists,
            songs: response.data?.songs,
          });
          console.log(searchResult);
        } else {
          setSearchResult({ artists: [], songs: [] });
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
        } else {
          console.log(error.response);
        }
      }
    };
    const timeoutId = setTimeout(() => fetchData(query), 500);
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (searchResult.artists.length + searchResult.songs.length && downPress) {
      setCursor((prevCursor) =>
        prevCursor < searchResult.artists.length + searchResult.songs.length - 1
          ? prevCursor + 1
          : prevCursor
      );
    }
  }, [downPress]);

  useEffect(() => {
    if (searchResult.artists.length + searchResult.songs.length && upPress) {
      setCursor((prevCursor) => (prevCursor > 0 ? prevCursor - 1 : -1));
    }
  }, [upPress]);

  useEffect(() => {
    if (searchResult.artists.length + searchResult.songs.length && enterPress) {
      if (cursor < searchResult.artists.length) {
        navigateTo(`/artists/${searchResult.artists[cursor].id}`);
        setQuery("");
      } else {
        navigateTo(
          `/songs/${
            searchResult.songs[cursor - searchResult.artists.length].id
          }`
        );
        setQuery("");
      }
    }
  }, [enterPress]);

  useEffect(() => {
    setCursor(-1);
  }, [searchResult]);

  useEffect(() => {
    if (cursor !== -1) {
      const resultItem = resultsRef?.current?.childNodes[cursor];
      if (resultItem) {
        resultItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [cursor]);

  return (
    <div className="flex flex-col items-center z-20">
      <div className="flex items-center border-2 w-full h-10 border-gray-700 rounded-full bg-slate-800 hover:border-gray-600 hover:focus-within:border-white focus-within:border-white">
        <FiSearch className="ml-3" />
        <input
          className="pl-2 border-0 bg-transparent w-full h-full focus:outline-none focus:ring-0"
          placeholder="Search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </div>
      {isSearchFocused && (
        <div className="w-full max-h-60 overflow-y-auto rounded-md search-scroll">
          <ul id="results" ref={resultsRef}>
            {searchResult.artists.map((artist, index) => {
              return (
                <li
                  key={artist.id}
                  className={`w-full flex gap-2 items-center h-12 ${
                    cursor === index ? "bg-slate-700" : "bg-slate-800"
                  }`}
                  onMouseDown={() => {
                    navigateTo(`/artists/${artist.id}`);
                    setQuery("");
                  }}
                  onMouseMove={() => setCursor(index)}
                >
                  <img
                    className="ml-1 w-9 h-9 rounded-full"
                    src={`${import.meta.env.VITE_BASE_URL}/${
                      artist?.artist_image_small_path
                    }`}
                    alt=""
                  />
                  <p className="line-clamp-1">{artist.artist}</p>
                </li>
              );
            })}
            {searchResult.songs.map((song, index) => {
              return (
                <li
                  key={song.id}
                  className={`w-full flex gap-2 items-center h-12 ${
                    cursor === index + searchResult.artists.length
                      ? "bg-slate-700"
                      : "bg-slate-800"
                  }`}
                  onMouseDown={() => {
                    navigateTo(`/songs/${song.id}`);
                    setQuery("");
                  }}
                  onMouseMove={() =>
                    setCursor(index + searchResult.artists.length)
                  }
                >
                  <img
                    className="ml-1 w-9 h-9 rounded-full"
                    src={`${import.meta.env.VITE_BASE_URL}/${
                      song.artist?.artist_image_small_path
                    }`}
                    alt=""
                  />
                  <p className="truncate">{song.title}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
