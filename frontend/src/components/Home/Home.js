import React, { useState, useEffect } from "react";
import api from "../../api";
import Song from "../Song/Song";
import Artist from "../Artist/Artist";
import "./Home.css";

const Home = () => {
  const [homeData, setHomeData] = useState({
    home_songs: [],
    home_artists: [],
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const loggedInResponse = await api.get("/is-logged-in", {
        withCredentials: true,
      });
      console.log(loggedInResponse.data.is_logged_in);
      setIsLoggedIn(loggedInResponse.data.is_logged_in);

      const endpoint = isLoggedIn ? "/home" : "/home/guest";
      const response = await api.get(endpoint);
      setHomeData(response.data);
    };

    fetchData();
  }, [isLoggedIn]);

  return (
    <div className="home-container">
      <div className="songs-container">
        {homeData.home_songs.map((song) => (
          <Song key={song.id} song={song} />
        ))}
      </div>
      <div className="artists-container">
        {homeData.home_artists.map((artist) => (
          <Artist key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
};

export default Home;
