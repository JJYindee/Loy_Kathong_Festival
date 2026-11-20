import React from 'react';
import { Volume2, VolumeX, Trophy, HelpCircle, Sparkles } from 'lucide-react';
import { useFestival } from '../../context/FestivalContext';

export default function Header() {
  const { krathongs, isPlayingMusic, toggleMusic, setIsLeaderboardOpen, setIsHelpOpen } = useFestival();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none p-3 md:p-4 flex justify-between items-center bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent">
      {/* Brand Title */}
      <div className="pointer-events-auto flex items-center space-x-3">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center animate-pulse-glow">
          <span className="text-xl md:text-2xl">🪷</span>
        </div>
        <div>
          <h1 className="text-base md:text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 drop-shadow">
            ลอยกระทงออนไลน์ 3D
          </h1>
          <p className="text-[11px] md:text-xs text-amber-200/80 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
            <span>ประกวดกระทงในลำน้ำ ({krathongs.length} กระทง)</span>
          </p>
        </div>
      </div>

      {/* Control Action Buttons */}
      <div className="pointer-events-auto flex items-center space-x-2">
        {/* Leaderboard Button */}
        <button
          onClick={() => setIsLeaderboardOpen(true)}
          className="glass-panel px-3 py-2 rounded-xl text-amber-300 hover:text-amber-100 hover:border-amber-400/50 transition-all flex items-center gap-1.5 text-xs md:text-sm font-medium shadow-md active:scale-95"
          title="ดูตารางอันดับโหวต"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">อันดับโหวต</span>
        </button>

        {/* Music Sound Toggle */}
        <button
          onClick={toggleMusic}
          className={`glass-panel p-2 md:px-3 md:py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs md:text-sm font-medium active:scale-95 ${
            isPlayingMusic
              ? 'text-emerald-400 border-emerald-500/50 shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title={isPlayingMusic ? 'ปิดเสียงดนตรีไทย' : 'เปิดเสียงดนตรีไทยบรรเลง'}
        >
          {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{isPlayingMusic ? 'ดนตรีเปิด' : 'เปิดดนตรี'}</span>
        </button>

        {/* Help Guide Button */}
        <button
          onClick={() => setIsHelpOpen(true)}
          className="glass-panel p-2 rounded-xl text-slate-300 hover:text-white hover:border-amber-400/50 transition-all active:scale-95"
          title="วิธีใช้งาน"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
