import { useRef, useState, useEffect } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsStopFill,
  BsFillVolumeMuteFill,
  BsFillVolumeDownFill,
  BsFillVolumeUpFill,
} from "react-icons/bs";
import { useGlobalContext } from "./GlobalProvider";
import useKeyPress from "../hooks/useKeyPress";

const Karaoke = ({ vocalsPath, noVocalsPath, textData, autoplay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const {
    isSearchFocused,
    volume,
    setVolume,
    previousVolume,
    setPreviousVolume,
    vocalsVolume,
    setVocalsVolume,
  } = useGlobalContext();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(null);

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  const audioContext = useRef();

  const vocals = useRef();
  const vocalsSource = useRef();
  const vocalsGain = useRef();
  const noVocals = useRef();
  const noVocalsSource = useRef();
  const noVocalsGain = useRef();

  const analyser = useRef();
  const bufferLength = useRef();
  const dataArray = useRef();
  const fftSize = [1024, 2048];

  let waveformAnimationFrameId;
  let frequencyBarAnimationFrameId;

  const canvasRef = useRef();

  const songProgress = useRef();
  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const spacePress = useKeyPress(" ");

  useEffect(() => {
    audioContext.current = new AudioContext();

    vocals.current = new Audio(vocalsPath);
    vocals.current.crossOrigin = "anonymous";
    vocalsSource.current = audioContext.current.createMediaElementSource(
      vocals.current
    );
    vocalsGain.current = audioContext.current.createGain();

    noVocals.current = new Audio(noVocalsPath);
    noVocals.current.crossOrigin = "anonymous";
    noVocalsSource.current = audioContext.current.createMediaElementSource(
      noVocals.current
    );
    noVocalsGain.current = audioContext.current.createGain();

    analyser.current = audioContext.current.createAnalyser();

    vocalsSource.current
      .connect(vocalsGain.current)
      .connect(audioContext.current.destination);
    noVocalsSource.current
      .connect(analyser.current)
      .connect(noVocalsGain.current)
      .connect(audioContext.current.destination);

    analyser.current.fftSize =
      fftSize[Math.floor(Math.random() * fftSize.length)];
    bufferLength.current = analyser.current.frequencyBinCount;
    dataArray.current = new Uint8Array(bufferLength.current);

    vocals.current.addEventListener("ended", handleSongEnd);
    noVocals.current.addEventListener("ended", handleSongEnd);

    const updateDuration = () => {
      if (noVocals.current.duration) {
        setDuration(noVocals.current.duration);
      }
    };

    noVocals.current.addEventListener("loadedmetadata", updateDuration);

    const updateTime = () => {
      setCurrentTime(noVocals.current.currentTime);
      if (textData.segments) {
        const segmentIndex = textData.segments.findIndex(
          (segment) =>
            noVocals.current.currentTime >= segment.start &&
            noVocals.current.currentTime <= segment.end
        );

        if (segmentIndex !== -1) {
          const wordIndex = textData.segments[segmentIndex].words.findIndex(
            (word) =>
              noVocals.current.currentTime >= word.start &&
              noVocals.current.currentTime <= word.end
          );
          setCurrentSegmentIndex(segmentIndex);
          if (wordIndex !== -1) {
            setCurrentWordIndex(wordIndex);
          }
        } else {
          setCurrentSegmentIndex(-1);
        }
      }
    };

    noVocals.current.addEventListener("timeupdate", updateTime);

    if (analyser.current.fftSize === 1024) {
      drawFrequencyBar();
    } else {
      drawWaveform();
    }

    return () => {
      setCurrentTime(0);
      setIsPlaying(false);
      setCurrentSegmentIndex(-1);
      setCurrentWordIndex(-1);
      audioContext.current.close();
      vocalsSource.current.disconnect();
      noVocalsSource.current.disconnect();
      vocals.current.removeEventListener("ended", handleSongEnd);
      noVocals.current.removeEventListener("ended", handleSongEnd);
      noVocals.current.removeEventListener("timeupdate", updateTime);
      noVocals.current.removeEventListener("loadedmetadata", updateDuration);
      cancelAnimationFrame(waveformAnimationFrameId);
      cancelAnimationFrame(frequencyBarAnimationFrameId);
    };
  }, [vocalsPath, noVocalsPath, textData]);

  const handlePlayPause = () => {
    if (audioContext.current.state === "suspended") {
      audioContext.current.resume();
    }

    if (!isPlaying) {
      vocals.current.play();
      noVocals.current.play();
      setIsPlaying(true);
    } else {
      vocals.current.pause();
      noVocals.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    vocals.current.pause();
    vocals.current.currentTime = 0;
    noVocals.current.pause();
    noVocals.current.currentTime = 0;
    setIsPlaying(false);
  };

  const handleSongEnd = () => {
    setIsPlaying(false);
    vocals.current.currentTime = 0;
    noVocals.current.currentTime = 0;
  };

  const handleMute = () => {
    if (volume !== 0) {
      setPreviousVolume(volume);
      setVolume(0);
    } else {
      setVolume(previousVolume);
    }
  };

  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    vocals.current.currentTime = newTime;
    noVocals.current.currentTime = newTime;
  };

  const drawWaveform = () => {
    waveformAnimationFrameId = requestAnimationFrame(drawWaveform);

    analyser.current.getByteTimeDomainData(dataArray.current);

    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();

    const sliceWidth = width / bufferLength.current;
    let x = 0;

    for (let i = 0; i < bufferLength.current; i++) {
      const v = dataArray.current[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  const drawFrequencyBar = () => {
    frequencyBarAnimationFrameId = requestAnimationFrame(drawFrequencyBar);

    analyser.current.getByteFrequencyData(dataArray.current);

    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    const barWidth = (width / bufferLength.current) * 2.5;
    let barHeight;

    let x = 0;

    for (let i = 0; i < bufferLength.current; i++) {
      barHeight = dataArray.current[i];

      ctx.fillStyle = `rgba(${barHeight + 100}, 255, 255, 0.7)`;
      ctx.fillRect(x, height - barHeight / 2, barWidth, barHeight);

      x += barWidth + 1;
    }
  };

  useEffect(() => {
    if (volume <= vocalsVolume) {
      vocalsGain.current.gain.setValueAtTime(
        volume,
        audioContext.current.currentTime
      );
    }
    noVocalsGain.current.gain.setValueAtTime(
      volume,
      audioContext.current.currentTime
    );
  }, [volume, vocalsPath, noVocalsPath, textData]);

  useEffect(() => {
    if (volume >= vocalsVolume) {
      vocalsGain.current.gain.setValueAtTime(
        vocalsVolume,
        audioContext.current.currentTime
      );
    }
  }, [vocalsVolume, vocalsPath, noVocalsPath, textData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (songProgress.current) {
        songProgress.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (leftPress && !isSearchFocused) {
      if (currentTime <= 5) {
        setCurrentTime(0);
        noVocals.current.currentTime = 0;
        vocals.current.currentTime = 0;
      } else {
        noVocals.current.currentTime -= 5;
        vocals.current.currentTime -= 5;
        setCurrentTime((prev) => prev - 5);
      }
    }
  }, [leftPress]);

  useEffect(() => {
    if (rightPress && !isSearchFocused) {
      if (currentTime >= duration - 5) {
        setCurrentTime(duration);
        noVocals.current.currentTime = duration;
        vocals.current.currentTime = duration;
      } else {
        noVocals.current.currentTime += 5;
        vocals.current.currentTime += 5;
        setCurrentTime((prev) => prev + 5);
      }
    }
  }, [rightPress]);

  useEffect(() => {
    if (spacePress && !isSearchFocused) {
      handlePlayPause();
    }
  }, [spacePress]);

  return (
    <div className="flex flex-col gap-2 w-10/12">
      <canvas ref={canvasRef} width="800" height="100"></canvas>
      <div className="h-32 pb-10 pt-5">
        {currentSegmentIndex !== -1 && (
          <div className="flex gap-2 justify-center items-center">
            {textData.segments[currentSegmentIndex].words.map((word, index) => (
              <span
                className="text-2xl -md:text-lg -sm:text-sm"
                key={index}
                style={{ color: index <= currentWordIndex ? "red" : "white" }}
              >
                {word.text}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end mb-16">
        <input
          className="-rotate-90 h-5 w-32 self-end"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={vocalsVolume}
          onChange={(e) => {
            setVocalsVolume(parseFloat(e.target.value));
          }}
          style={{
            "--percentage": `${Math.ceil(vocalsVolume * 100)}%`,
          }}
        />
        <p className="-ml-10">Vocals</p>
      </div>
      <div className="flex justify-center items-center gap-2 w-full">
        <span className="text-lg">
          {Math.floor(currentTime / 60)}:
          {(currentTime % 60).toFixed(0).padStart(2, "0")}
        </span>
        {duration && (
          <input
            ref={songProgress}
            className="w-2/3"
            type="range"
            min="0"
            max={duration}
            step="1"
            value={currentTime}
            onChange={handleTimeChange}
            style={{
              "--percentage": `${Math.ceil((currentTime / duration) * 100)}%`,
            }}
          />
        )}
        <span className="text-lg">
          {Math.floor(duration / 60)}:
          {(duration % 60).toFixed(0).padStart(2, "0")}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2 mt-2">
        <div className="flex items-center justify-center gap-2 mr-4">
          <button onClick={handlePlayPause}>
            {isPlaying ? (
              <BsPauseFill className="h-8 w-8 fill-white" />
            ) : (
              <BsPlayFill className="h-8 w-8 fill-white" />
            )}
          </button>
          <button onClick={handleStop}>
            <BsStopFill className="h-8 w-8 fill-white" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleMute}>
            {volume === 0 ? (
              <BsFillVolumeMuteFill className="h-8 w-8 fill-white">
                /
              </BsFillVolumeMuteFill>
            ) : volume < 0.6 ? (
              <BsFillVolumeDownFill className="h-8 w-8 fill-white " />
            ) : (
              <BsFillVolumeUpFill className="h-8 w-8 fill-white" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
            }}
            onMouseUp={() => {
              if (volume !== 0) {
                setPreviousVolume(volume);
              }
            }}
            style={{
              "--percentage": `${Math.ceil(volume * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Karaoke;
