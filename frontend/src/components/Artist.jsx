import { useNavigate } from "react-router-dom";

const Artist = ({ artist }) => {
  const navigateTo = useNavigate();

  return (
    <button
      onClick={() => navigateTo(`/artists/${artist.id}`)}
      className="group flex flex-col items-center pt-2 gap-4 w-full max-w-[16rem] h-52 rounded-lg bg-slate-800 hover:bg-slate-700 justify-self-center srink"
    >
      <img
        className="aspect-square h-32 w-32 rounded-full"
        src={`${import.meta.env.VITE_BASE_URL}/${
          artist?.artist_image_small_path
        }`}
        alt={artist.artist}
      />
      <h3 className="w-full text-lg text-center line-clamp-2">
        {artist.artist}
      </h3>
    </button>
  );
};
export default Artist;
