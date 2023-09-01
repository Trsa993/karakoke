import { useEffect, useState } from "react";
import Song from "./Song";
import Artist from "./Artist";
import useApiPrivate from "../hooks/useApiPrivate";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const apiPrivate = useApiPrivate();
  const profileName = localStorage.getItem("profileName");

  const [homeData, setHomeData] = useState({
    home_songs: [],
    home_artists: [],
  });
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      const endpoint = profileName ? "/home" : "/home/guest";
      try {
        const response = await apiPrivate.get(endpoint, { signal });
        setHomeData(response.data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
        } else {
          console.log(error.response);
          setIsError(true);
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [profileName]);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }
  if (isError) {
    return <h2>There was an error</h2>;
  }
  return (
    <div className="rounded-md bg-slate-900 w-full max-h-screen overflow-y-auto overflow-x-hidden main-scroll-animation py-6 px-2 flex flex-col gap-10 text-white">
      <div>
        <h2 className="pb-6 text-3xl">Where every voice shines</h2>
        <div className="grid grid-cols-3 gap-4 -md:grid-cols-2">
          {homeData.home_songs.map((song) => (
            <Song key={song.id} song={song} />
          ))}
        </div>
      </div>
      <div>
        <h2 className="pb-6 text-3xl">Discover your next sound obsession</h2>
        <div className="grid grid-cols-6 gap-4 -lg:grid-cols-5 -md:grid-cols-4 -sm:grid-cols-3">
          {homeData.home_artists.map((artist) => (
            <Artist key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Home;
