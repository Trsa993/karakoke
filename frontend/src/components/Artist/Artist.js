import React from "react";
import "./Artist.css";

const Artist = ({ artist }) => {
  return (
    <div className="artist">
      <img src={artist.image_path} alt={artist.artist} />
      <div className="artist-info">
        <h3>{artist.artist}</h3>
      </div>
    </div>
  );
};

export default Artist;
