import { useEffect, useState } from "react";
import api from "../../api";
import Song from "../Song/Song";
import Artist from "../Artist/Artist";

const Home = ({ isLoggedIn }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [homeData, setHomeData] = useState({
    home_songs: [],
    home_artists: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      const endpoint = isLoggedIn ? "/home" : "/home/guest";
      try {
        const response = await api.get(endpoint);
        setHomeData(response.data);
      } catch (error) {
        console.log(error.response);
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [isLoggedIn]);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }
  if (isError) {
    return <h2>There was an error</h2>;
  }
  return (
    <div>
      <div>
        {homeData.home_songs.map((song) => (
          <Song key={song.id} song={song} />
        ))}
      </div>
      <div>
        {homeData.home_artists.map((artist) => (
          <Artist key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
};
export default Home;
