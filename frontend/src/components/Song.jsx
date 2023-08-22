const Song = ({ song }) => {
  return (
    <div>
      <img src={song.artist.image_path} alt={song.artist.artist} />
      <div>
        <h3>{song.title}</h3>
        <p>{song.artist.artist}</p>
      </div>
    </div>
  );
};
export default Song;
