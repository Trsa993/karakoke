import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { BsPlayFill } from "react-icons/bs";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import spinner from "../assets/spinner.svg";

import DOMPurify from "dompurify";

const ArtistSongs = () => {
  const { artistId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [songs, setSongs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [shouldScroll, setShouldScroll] = useState(false);
  const navigateTo = useNavigate();
  const songsRef = useRef();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const response = await api.get(
          `/artists/${artistId}/songs?offset=${offset}`,
          {
            signal,
          }
        );
        setSongs(response.data);
        console.log(response.data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
        } else if (error.response) {
          console.log(error.response);
          setIsError(true);
        }
      }
      setIsLoading(false);
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [artistId, offset]);

  useEffect(() => {
    songsRef?.current?.focus();
  }, [isLoading]);

  useEffect(() => {
    if (shouldScroll) {
      const timer = setTimeout(() => {
        songsRef.current.scrollIntoView({ behavior: "smooth" });
        setShouldScroll(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [offset, shouldScroll]);

  if (isLoading) {
    return (
      <div className="rounded-md w-full h-screen bg-slate-900 overflow-x-hidden flex flex-col text-white justify-center items-center">
        <img className="w-16 h-16" src={spinner} alt="Loading..." />
      </div>
    );
  }
  if (isError) {
    return <h2>There was an error</h2>;
  }
  return (
    <div
      className="rounded-md w-full max-h-screen bg-slate-900
     overflow-y-auto overflow-x-hidden main-scroll-animation flex flex-col gap-10 text-white"
    >
      <div
        style={{
          backgroundImage: `linear-gradient(0deg, #0f172a, ${songs?.dominant_color} 30%)`,
        }}
        className="w-full h-72 flex items-center p-5 gap-2"
      >
        <img
          className="aspect-square rounded-full w-64 h-64 place-self-center"
          src={`${import.meta.env.VITE_BASE_URL}/${
            songs?.artist?.artist_image_medium_path
          }`}
          alt=""
        />
        <h1 className="text-3xl self-end justify-self-start w-full lg:min-w-fit pr-5">
          {songs?.artist?.artist}
        </h1>
        <div
          className="summary-link h-full search-scroll overflow-y-auto overflow-x-hidden pr-1 -sm:text-sm"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(songs?.artist_summary),
          }}
        />
      </div>
      <div ref={songsRef} className="flex flex-col gap-2">
        <h3 className="text-xl ml-3 mb-6">Enjoy singing</h3>
        <div className="flex items-center h-fit mx-2 -sm:gap-2">
          <p className="text-sm text-center text-gray-400 w-[7%] -sm:w-[8%] -sm:ml-1">
            #
          </p>
          <p className="text-sm text-left text-gray-400 w-[63%] -sm:w-full">
            Title
          </p>
          <p className="text-sm text-right text-gray-400 w-[15%] -sm:hidden">
            Listeners
          </p>
          <p className="text-sm text-right text-gray-400 pr-5 w-[15%] -sm:w-fit">
            Duration
          </p>
        </div>
        <ul id={`${songs?.artist?.id} songs`}>
          {songs?.artist_songs?.map((song, index) => {
            return (
              <li
                key={song?.id}
                className="group flex items-center h-16 -sm:gap-2 bg-slate-800 hover:bg-slate-700 rounded-md m-2"
                onClick={() => navigateTo(`/songs/${song.id}`)}
              >
                <div className="w-[7%] -sm:w-[8%] -sm:ml-1">
                  <p className="text-lg text-center group-hover:hidden">
                    {index + 1 + offset}
                  </p>
                  <BsPlayFill
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo(`/songs/${song.id}?autoplay=true`);
                    }}
                    className="m-auto w-6 h-6 shrink-0 hidden group-hover:block hover:scale-110 transition-all duration-200 ease-in-out"
                  />
                </div>
                <p className="text-lg text-left w-[63%] -sm:w-full line-clamp-1">
                  {song?.title}
                </p>
                <p className="text-lg text-right w-[15%] -sm:hidden">
                  {song?.total_listeners}
                </p>
                <p className="text-lg text-right pr-5 w-[15%] -sm:w-fit">
                  {song?.length}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="flex justify-center items-center gap-3 py-5">
          <button
            className="disabled:opacity-50"
            disabled={offset < 50 ? true : false}
            onClick={() => {
              setShouldScroll(true);
              setOffset((prev) => prev - 50);
            }}
          >
            <FaLessThan className="w-8 h-8 fill-white" />
          </button>
          <button
            className="disabled:opacity-50"
            disabled={songs?.artist_songs?.length < 50 ? true : false}
            onClick={() => {
              setShouldScroll(true);
              setOffset((prev) => prev + 50);
            }}
          >
            <FaGreaterThan className="w-8 h-8 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistSongs;
