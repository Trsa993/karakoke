import React from "react";
import "./Song.css";

const Song = ({ song }) => {
  return (
    <div className="song">
      <img src={song.artist.image_path} alt={song.artist.artist} />
      <div className="song-info">
        <h3>{song.title}</h3>
        <p>{song.artist.artist}</p>
      </div>
    </div>
  );
};

export default Song;
