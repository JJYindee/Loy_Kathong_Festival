import React from 'react';
import { X, Trophy, Heart, Eye } from 'lucide-react';
import { useFestival } from '../../context/FestivalContext';

export default function LeaderboardModal() {
  const { isLeaderboardOpen, setIsLeaderboardOpen, krathongs, openKrathongById } = useFestival();

  if (!isLeaderboardOpen) return null;

  // Sort by vote count descending
  const sorted = [...krathongs].sort((a, b) => b.votes - a.votes);

  const handleSelect = (id) => {
    setIsLeaderboardOpen(false);
    openKrathongById(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl border border-amber-400/40 max-h-[88vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setIsLeaderboardOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-300">
              ตารางอันดับโหวตกระทงยอดนิยม
            </h2>
            <p className="text-xs text-slate-400">
              รวมผู้เข้าประกวดทั้งหมด {sorted.length} ท่าน
            </p>
          </div>
        </div>

        {/* Ranking List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {sorted.map((item, index) => {
            const rank = index + 1;
            let rankBadge = (
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-slate-800 text-slate-400">
                {rank}
              </span>
            );

            if (rank === 1) {
              rankBadge = (
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30">
                  🥇
                </span>
              );
            } else if (rank === 2) {
              rankBadge = (
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-slate-300 text-slate-950 shadow-md">
                  🥈
                </span>
              );
            } else if (rank === 3) {
              rankBadge = (
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-amber-700 text-amber-100 shadow-md">
                  🥉
                </span>
              );
            }

            return (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {rankBadge}
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover bg-slate-800 flex-shrink-0 border border-amber-400/30"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-pink-400 flex items-center gap-1 font-medium">
                      <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                      <span>{item.votes} โหวต</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSelect(item.id)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1 active:scale-95 transition-all flex-shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>ชมกระทง</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
