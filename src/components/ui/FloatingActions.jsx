import React from 'react';
import { Camera, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { useFestival } from '../../context/FestivalContext';

export default function FloatingActions({ sceneManagerRef }) {
  const { setIsCreateModalOpen, setIsLeaderboardOpen } = useFestival();

  const handleResetCamera = () => {
    if (sceneManagerRef && sceneManagerRef.current) {
      sceneManagerRef.current.resetCamera();
    }
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-20 pointer-events-none px-4 flex flex-col items-center">
      {/* Tip Banner */}
      <div className="pointer-events-none mb-3 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-amber-400/20 text-amber-200/90 text-[11px] md:text-xs flex items-center gap-1.5 shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>แตะที่ตัวกระทงในแม่น้ำเพื่อดูรูปถ่ายและกดโหวต</span>
      </div>

      {/* Floating Action Controls */}
      <div className="pointer-events-auto flex items-center gap-2 md:gap-3 bg-slate-950/80 backdrop-blur-lg p-2 rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/10">
        {/* Reset Camera Button */}
        <button
          onClick={handleResetCamera}
          className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all active:scale-95 border border-slate-700"
          title="รีเซ็ตมุมมองกล้อง"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Primary Action: Create Krathong */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-pink-600 to-amber-500 hover:from-amber-400 hover:to-pink-500 text-white font-semibold text-sm md:text-base flex items-center gap-2.5 shadow-lg shadow-pink-600/30 active:scale-95 transition-all border border-amber-300/40"
        >
          <Camera className="w-5 h-5 animate-bounce" />
          <span>ถ่ายรูป & ปล่อยกระทงประกวด</span>
        </button>

        {/* Leaderboard Mobile Quick Toggle */}
        <button
          onClick={() => setIsLeaderboardOpen(true)}
          className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 hover:text-amber-100 transition-all active:scale-95 border border-slate-700 sm:hidden"
          title="อันดับโหวต"
        >
          <Trophy className="w-5 h-5 text-amber-400" />
        </button>
      </div>
    </div>
  );
}
