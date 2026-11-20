import React, { useState } from 'react';
import { X, Heart, Sparkles, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFestival } from '../../context/FestivalContext';
import { KRATHONG_STYLES } from '../../utils/initialData';

export default function KrathongModal() {
  const { selectedKrathong, setSelectedKrathong, voteKrathong, votedKrathongId, hasVoted } = useFestival();
  const [voteMsg, setVoteMsg] = useState(null);

  if (!selectedKrathong) return null;

  const currentVotes = selectedKrathong.votes;
  const isVotedForThis = votedKrathongId === selectedKrathong.id;
  const isVotedForOther = hasVoted && !isVotedForThis;
  const styleObj = KRATHONG_STYLES.find(s => s.id === selectedKrathong.style) || KRATHONG_STYLES[0];

  const handleVote = () => {
    const res = voteKrathong(selectedKrathong.id);
    if (!res.success) {
      setVoteMsg(res.message);
    } else {
      setVoteMsg('บันทึกคะแนนโหวตของคุณเรียบร้อยแล้ว!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md glass-panel-glow rounded-3xl p-6 overflow-hidden text-slate-100 shadow-2xl border border-amber-400/40">
        {/* Close Button */}
        <button
          onClick={() => {
            setVoteMsg(null);
            setSelectedKrathong(null);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Decorator */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            ผู้เข้าประกวดกระทง
          </span>
          <span className="text-xs text-slate-400">
            {styleObj.name}
          </span>
        </div>

        {/* Contestant Photo */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-pink-500 to-amber-200 shadow-xl shadow-pink-500/20 mb-3">
            <img
              src={selectedKrathong.photo}
              alt={selectedKrathong.name}
              className="w-full h-full rounded-full object-cover bg-slate-800"
            />
            <div className="absolute -bottom-2 right-1 bg-slate-900 border border-amber-400/50 rounded-full px-2 py-0.5 text-[10px] text-amber-300 font-bold flex items-center gap-0.5 shadow">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>3D</span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300">
            {selectedKrathong.name}
          </h3>
        </div>

        {/* Wish / Prayer Content */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-900/70 border border-slate-700/60 relative">
          <span className="text-amber-400/50 text-2xl absolute top-2 left-3 font-serif">“</span>
          <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed text-center px-4">
            {selectedKrathong.wish || 'ขอขมาพระแม่คงคา และขอให้มีแต่ความสุขความเจริญ'}
          </p>
          <span className="text-amber-400/50 text-2xl absolute bottom-1 right-3 font-serif">”</span>
        </div>

        {/* Vote Stats & Action Button */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-2 text-sm">
            <span className="text-slate-400">คะแนนโหวตทั้งหมด</span>
            <div className="flex items-center gap-1.5 font-bold text-lg text-pink-400">
              <Heart className="w-5 h-5 fill-pink-500 text-pink-500 animate-pulse" />
              <span>{currentVotes} คะแนน</span>
            </div>
          </div>

          {voteMsg && (
            <div className={`p-2.5 rounded-xl text-xs flex items-center gap-1.5 ${
              isVotedForThis ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {isVotedForThis ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{voteMsg}</span>
            </div>
          )}

          {/* Button states depending on single-vote status */}
          {isVotedForThis ? (
            <div className="w-full py-3.5 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 font-semibold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>คุณได้โหวตให้กระทงนี้แล้ว (1 สิทธิ์/คน)</span>
            </div>
          ) : isVotedForOther ? (
            <div className="w-full py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs sm:text-sm font-medium text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>คุณใช้สิทธิ์โหวตไปแล้ว (โหวตได้ 1 คน 1 ครั้ง)</span>
            </div>
          ) : (
            <button
              onClick={handleVote}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-bold text-base shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all border border-pink-400/30"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>กดโหวตให้คะแนน (มี 1 สิทธิ์โหวต)</span>
            </button>
          )}

          <p className="text-[11px] text-center text-amber-200/60">
            * กติกาการแข่งขัน: ผู้ใช้งาน 1 ท่าน สามารถใช้สิทธิ์โหวตได้ 1 ครั้ง
          </p>
        </div>
      </div>
    </div>
  );
}
