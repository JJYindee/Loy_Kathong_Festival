import React from 'react';
import { X, HelpCircle, Move, ZoomIn, HandMetal, Heart, Camera } from 'lucide-react';
import { useFestival } from '../../context/FestivalContext';

export default function HelpModal() {
  const { isHelpOpen, setIsHelpOpen } = useFestival();

  if (!isHelpOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 text-slate-100 shadow-2xl border border-amber-400/40">
        <button
          onClick={() => setIsHelpOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-amber-300">
            วิธีเพลิดเพลินกับงานลอยกระทง
          </h2>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Move className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-100">หมุนมุมมอง 360 องศา</p>
              <p className="text-xs text-slate-400">
                ลากเมาส์ (PC) หรือใช้นิ้วลากบนหน้าจอ (มือถือ/แท็บเล็ต) เพื่อชมบรรยากาศวัด, เจดีย์, บ้านเรือนไทย และพระจันทร์เต็มดวง
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <ZoomIn className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-100">ซูมเข้า - ออก</p>
              <p className="text-xs text-slate-400">
                หมุน Scroll เมาส์ หรือใช้ 2 นิ้วหนีบ/กาง (Pinch to zoom) บนหน้าจอสัมผัส
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-100">แตะกระทงเพื่อโหวต</p>
              <p className="text-xs text-slate-400">
                แตะหรือคลิกที่กระทงใดก็ได้ที่ลอยอยู่ในแม่น้ำ เพื่อเปิดดูรูปถ่ายของผู้เข้าประกวด และกดโหวตให้คะแนน
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-100">ถ่ายรูป & ปล่อยกระทง</p>
              <p className="text-xs text-slate-400">
                กดปุ่ม "ถ่ายรูป & ปล่อยกระทงประกวด" ด้านล่าง เพื่อเซลฟี่หรืออัปโหลดรูป พร้อมส่งคำอธิษฐานลงสู่แม่น้ำ
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsHelpOpen(false)}
          className="w-full mt-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg active:scale-95 transition-all"
        >
          เข้าใจแล้ว เริ่มสนุกกับงาน
        </button>
      </div>
    </div>
  );
}
