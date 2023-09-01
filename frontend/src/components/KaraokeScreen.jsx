import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { apiPrivate } from "../api";
import axios from "axios";
import Karaoke from "./Karaoke";

const KaraokeScreen = () => {
  const { songId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const autoplay = searchParams.get("autoplay") === "true";
  const [songData, setSongData] = useState();
  const [textData, setTextData] = useState();
  const navigateTo = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const response = await apiPrivate.get(`/songs/${songId}/listen`, {
          signal,
        });
        setSongData(response.data);
        console.log(response.data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
        } else {
          console.log(error.response);
        }
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [songId]);

  useEffect(() => {
    const textController = new AbortController();
    const textSignal = textController.signal;

    const fetchTextData = async () => {
      try {
        const textResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/${songData?.text_path}`,
          {
            textSignal,
          }
        );
        setTextData(textResponse.data);
        console.log(textResponse.data);
      } catch (textError) {
        if (textError.name === "AbortError") {
          console.log("Aborted");
        } else {
          console.log(textError.response);
        }
      }
    };
    fetchTextData();
    return () => {
      textController.abort();
    };
  }, [songData]);

  return (
    <div
      className="rounded-md w-full h-screen max-h-screen bg-slate-900
  overflow-y-auto overflow-x-hidden main-scroll-animation flex flex-col items-center gap-5 text-white p-10"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl text-center">{songData?.title}</h2>
        <h3
          onClick={() => navigateTo(`/artists/${songData?.artist_id}`)}
          className="text-xl text-center cursor-pointer hover:underline underline-offset-2"
        >
          {songData?.artist?.artist}
        </h3>
      </div>
      <Karaoke
        vocalsPath={`${import.meta.env.VITE_BASE_URL}/${songData?.vocals_path}`}
        noVocalsPath={`${import.meta.env.VITE_BASE_URL}/${
          songData?.accompaniments_path
        }`}
        textData={textData}
        autoplay={autoplay}
      />
    </div>
  );
};

export default KaraokeScreen;
