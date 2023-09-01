import { FaPlayCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Song = ({ song }) => {
  const navigateTo = useNavigate();

  return (
    <button
      onClick={() => navigateTo(`/songs/${song.id}`)}
      className="group relative flex items-center gap-2 w-full h-28 rounded-lg bg-slate-800 hover:bg-slate-700"
    >
      <img
        className="aspect-square h-full w-28 rounded-l-lg"
        src={`${import.meta.env.VITE_BASE_URL}/${
          song.artist?.artist_image_medium_path
        }`}
        alt={song.artist?.artist}
      />
      <div className="flex flex-col gap-y-1 justify-start items-center w-full">
        <h3 className="w-full text-xl text-left line-clamp-1">{song.title}</h3>
        <p
          onClick={(e) => {
            e.stopPropagation();
            navigateTo(`artists/${song.artist_id}`);
          }}
          className="w-full text-sm text-left cursor-pointer hover:underline underline-offset-2 line-clamp-1"
        >
          {song.artist.artist}
        </p>
        <FaPlayCircle
          onClick={(e) => {
            e.stopPropagation();
            navigateTo(`/songs/${song.id}?autoplay=true`);
          }}
          className="fill-indigo-600 bg-white rounded-full hover:fill-indigo-500 opacity-0 group-hover:opacity-100 w-14 h-14 shrink-0 hover:scale-110 absolute right-4 top-0 bottom-0 my-auto song-hover-transition z-20"
        />
      </div>
    </button>
  );
};
export default Song;
