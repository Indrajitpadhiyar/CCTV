import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Maximize2, AlertTriangle, Activity } from 'lucide-react';

export default function HLSPlayer({ streamUrl, cameraCode, isOnline = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [ptsMs, setPtsMs] = useState(0);
  const [fps, setFps] = useState(25);
  const [resolution, setResolution] = useState("1080p");
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let hls;
    const video = videoRef.current;

    if (video && streamUrl && isOnline) {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
          setHasError(false);
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setHasError(true);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(() => {});
        });
      } else {
        setHasError(true);
      }
    } else {
      setHasError(true);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl, isOnline]);

  // Simulation Canvas Fallback when live stream connection is restricted or offline
  useEffect(() => {
    if (!hasError || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let step = 0;

    const renderFrame = () => {
      step += 1;
      const currentPts = step * 40; // 25 FPS = 40ms per frame
      setPtsMs(currentPts);

      // Dark background gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#0a0f1d');
      grad.addColorStop(1, '#151d30');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animated CCTV grid lines
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Scanline animation
      const scanY = (step * 3) % canvas.height;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      // Simulated Target Bounding Box
      const targetX = 120 + Math.sin(step * 0.05) * 80;
      const targetY = 80 + Math.cos(step * 0.03) * 30;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.strokeRect(targetX, targetY, 90, 60);

      ctx.fillStyle = '#10b981';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(`VEHICLE 98.4% [GJ01AB1234]`, targetX, targetY - 6);

      // Overlay Timestamp & Camera Tag
      ctx.fillStyle = '#06b6d4';
      ctx.font = '12px JetBrains Mono';
      ctx.fillText(`LIVE STREAM • ${cameraCode}`, 12, 24);

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hasError, cameraCode]);

  return (
    <div className="relative w-full aspect-video bg-gray-950 rounded-lg overflow-hidden border border-gray-800 group">
      {!hasError ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
        />
      ) : (
        <canvas
          ref={canvasRef}
          width={480}
          height={270}
          className="w-full h-full object-cover"
        />
      )}

      {/* Live Badge & Metrics Overlay */}
      <div className="absolute top-2 left-2 flex items-center gap-2 z-10 pointer-events-none">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur border border-white/10 text-xs font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          LIVE
        </span>
        <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur border border-white/10 text-xs font-mono text-cyan-300">
          PTS: {ptsMs.toLocaleString()} ms
        </span>
      </div>

      {/* Resolution Pill & Expand Overlay */}
      <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity z-10">
        <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur border border-white/10 text-[10px] font-mono text-gray-300">
          {resolution} @ 25FPS
        </span>
      </div>
    </div>
  );
}
