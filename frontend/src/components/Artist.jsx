const Artist = ({ artist }) => {
  return (
    <div>
      <img src={artist.image_path} alt={artist.artist} />
      <div>
        <h3>{artist.artist}</h3>
      </div>
    </div>
  );
};
export default Artist;
