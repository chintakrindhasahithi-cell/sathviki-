import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-pink-500/30 relative overflow-hidden flex flex-col">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-pink-500 animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-black tracking-wider neon-text-cyan uppercase">
            Neon <span className="neon-text-pink">Snake</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-900/80 px-6 py-2 rounded-full neon-border-green backdrop-blur-sm">
          <span className="text-gray-400 font-medium uppercase tracking-widest text-sm">Score</span>
          <span className="text-2xl font-bold text-green-400 drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-6 max-w-6xl mx-auto w-full">
        
        {/* Left Column: Music Player & Info */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8 order-2 lg:order-1 items-center lg:items-start">
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">SYSTEM STATUS</h2>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>AESTHETIC</span>
                <span className="text-pink-400">CYBERPUNK</span>
              </li>
              <li className="flex justify-between">
                <span>AUDIO</span>
                <span className="text-cyan-400">AI SYNTHWAVE</span>
              </li>
              <li className="flex justify-between">
                <span>OBJECTIVE</span>
                <span className="text-green-400">CONSUME DATA</span>
              </li>
            </ul>
          </div>
          
          <MusicPlayer />
        </div>

        {/* Right Column: Game Board */}
        <div className="w-full lg:w-2/3 flex justify-center order-1 lg:order-2">
          <SnakeGame onScoreChange={setScore} />
        </div>

      </main>
    </div>
  );
}

