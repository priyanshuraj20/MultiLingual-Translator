"use client";

import React, { useRef, useState, useEffect } from "react";

interface CustomAudioPlayerProps {
  src: string;
  label?: string;
}

/**
 * CustomAudioPlayer provides a sleek dark-themed alternative to default HTML audio elements.
 * It maps play/pause states, progress slider seek coordinates, and precise duration labels.
 */
export default function CustomAudioPlayer({ src, label }: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Sync state if audio source changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.log("Playback error:", err));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex-1 min-w-[240px] max-w-[400px] select-none font-sans transition-all hover:border-white/15">
      {/* Hidden audio player node */}
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 text-white hover:text-[#8b5cf6] hover:bg-white/10 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-xl">
          {isPlaying ? "pause" : "play_arrow"}
        </span>
      </button>

      {/* Progress timeline seeker */}
      <div className="flex-1 flex flex-col gap-1">
        {label && (
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
            {label}
          </span>
        )}
        <div className="flex items-center gap-3">
          <div
            onClick={handleSeek}
            className="flex-1 h-1.5 bg-white/10 relative rounded-full cursor-pointer hover:h-2 transition-all group overflow-hidden"
          >
            {/* Active timeline bar progress */}
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#adc6ff] rounded-full transition-all duration-75 relative"
            />
          </div>

          {/* Timestamp labels */}
          <span className="text-[10px] font-mono text-zinc-400 min-w-[65px] text-right">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
