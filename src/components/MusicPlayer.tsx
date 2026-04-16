import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Drive (AI Gen)",
    artist: "CyberMinds",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Digital Sunset (AI Gen)",
    artist: "SynthNet",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Quantum Core (AI Gen)",
    artist: "Neural Beats",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl neon-border-pink shadow-[0_0_20px_rgba(255,0,255,0.15)] flex flex-col gap-4">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Track Info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center neon-border-cyan overflow-hidden relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-pink-500/20" />
          <Music className={`w-8 h-8 text-cyan-400 ${isPlaying ? 'animate-pulse' : ''}`} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-lg font-bold text-white truncate neon-text-pink">
            {currentTrack.title}
          </h3>
          <p className="text-cyan-400 text-sm truncate">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-2 bg-gray-800 rounded-full cursor-pointer overflow-hidden relative group"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-100 group-hover:from-cyan-300 group-hover:to-pink-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 accent-cyan-400 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="p-2 text-gray-300 hover:text-pink-400 transition-colors cursor-pointer"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full text-white hover:scale-105 transition-transform neon-border-cyan cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-cyan-400" />
            ) : (
              <Play className="w-6 h-6 text-cyan-400 ml-1" />
            )}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-2 text-gray-300 hover:text-pink-400 transition-colors cursor-pointer"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
