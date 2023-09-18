import { useEffect, useRef } from "react";

const CanvasDrawings = ({ analyser, noVocalsPath }) => {
  const bufferLength = useRef();
  const dataArray = useRef();
  const fftSize = [1024, 2048];

  let waveformAnimationFrameId;
  let frequencyBarAnimationFrameId;

  const canvasRef = useRef();

  useEffect(() => {
    if (!canvasRef?.current || !analyser?.current) return;

    analyser.current.fftSize =
      fftSize[Math.floor(Math.random() * fftSize.length)];
    bufferLength.current = analyser.current.frequencyBinCount;
    dataArray.current = new Uint8Array(bufferLength.current);

    if (analyser.current.fftSize === 1024) {
      drawFrequencyBar();
    } else {
      drawWaveform();
    }
    return () => {
      cancelAnimationFrame(waveformAnimationFrameId);
      cancelAnimationFrame(frequencyBarAnimationFrameId);
    };
  }, [canvasRef, analyser, noVocalsPath]);

  const drawWaveform = () => {
    waveformAnimationFrameId = requestAnimationFrame(drawWaveform);

    analyser.current.getByteTimeDomainData(dataArray.current);

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
  return <canvas ref={canvasRef} width="800" height="100"></canvas>;
};

export default CanvasDrawings;
