import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Upload, CheckCircle2, Sparkles, AlertCircle, FileCheck } from 'lucide-react';
import { useFestival } from '../../context/FestivalContext';
import { KRATHONG_STYLES } from '../../utils/initialData';
import { compressImageToMax500KB } from '../../utils/imageCompressor';

export default function CreateKrathongModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, addKrathong } = useFestival();

  const [name, setName] = useState('');
  const [wish, setWish] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(KRATHONG_STYLES[0].id);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoSizeKB, setPhotoSizeKB] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera when modal closes
  useEffect(() => {
    if (!isCreateModalOpen) {
      stopCamera();
    }
  }, [isCreateModalOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } else {
        setCameraError('อุปกรณ์ไม่รองรับการเปิดกล้องโดยตรง กรุณาอัปโหลดรูปภาพแทน');
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('ไม่สามารถเปิดกล้องได้ (โปรดตรวจสอบสิทธิ์ หรือเลือกอัปโหลดรูปภาพ)');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const processAndCompressPhoto = async (rawInput) => {
    setIsCompressing(true);
    try {
      // Compresses to guaranteed max 500KB
      const { dataUrl, sizeKB } = await compressImageToMax500KB(rawInput, 500 * 1024);
      setCapturedPhoto(dataUrl);
      setPhotoSizeKB(sizeKB);
    } catch (err) {
      console.error('Image compression failed:', err);
      alert('ไม่สามารถประมวลผลรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsCompressing(false);
    }
  };

  const takePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = 480;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');

      const minDim = Math.min(video.videoWidth, video.videoHeight);
      const sx = (video.videoWidth - minDim) / 2;
      const sy = (video.videoHeight - minDim) / 2;

      ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, 480, 480);
      const rawDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      await processAndCompressPhoto(rawDataUrl);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      await processAndCompressPhoto(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('กรุณากรอกชื่อของคุณ');
      return;
    }

    setIsSubmitting(true);
    try {
      const photoToUse =
        capturedPhoto ||
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23ec4899"/><text x="50" y="55" font-size="40" text-anchor="middle" dominant-baseline="central">🪷</text></svg>`;

      await addKrathong({
        name: name.trim(),
        wish: wish.trim() || 'ขอขมาพระแม่คงคา และขอให้มีแต่ความสุขสมหวังตลอดไป',
        photo: photoToUse,
        style: selectedStyle
      });

      // Reset Form
      setName('');
      setWish('');
      setCapturedPhoto(null);
      setPhotoSizeKB(null);
    } catch (err) {
      console.error('Error submitting krathong:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-5 sm:p-7 text-slate-100 shadow-2xl border border-amber-400/40 my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            stopCamera();
            setIsCreateModalOpen(false);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-pink-500 mb-2 shadow-lg shadow-pink-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400">
            สร้างกระทง & ส่งประกวด
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            บันทึกลง Cloud Firestore พร้อมระบบบีบอัดรูปไม่เกิน 500KB
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Photo Capture / Upload */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-amber-200 mb-2 self-start flex items-center justify-between w-full">
              <span>1. รูปภาพของคุณ (ถ่ายรูป หรือ อัปโหลด)</span>
              {photoSizeKB !== null && (
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <FileCheck className="w-3.5 h-3.5" />
                  {photoSizeKB} KB (ไม่เกิน 500KB)
                </span>
              )}
            </label>

            {/* Photo Preview or Live Camera */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-dashed border-amber-400/50 p-1 flex items-center justify-center overflow-hidden bg-slate-900 shadow-inner">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-full transform -scale-x-100"
                />
              ) : capturedPhoto ? (
                <img
                  src={capturedPhoto}
                  alt="Selfie"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="text-center p-3 text-slate-400 flex flex-col items-center">
                  <Camera className="w-8 h-8 text-amber-400/80 mb-1" />
                  <span className="text-xs">ยังไม่มีรูปถ่าย</span>
                </div>
              )}

              {isCompressing && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-amber-300 text-xs gap-1">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>กำลังบีบอัดรูป...</span>
                </div>
              )}
            </div>

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Actions */}
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {isCameraActive ? (
                <button
                  type="button"
                  onClick={takePhoto}
                  disabled={isCompressing}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-pink-600/30 active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>กดถ่ายรูปตอนนี้</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={isCompressing}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>{capturedPhoto ? 'ถ่ายรูปใหม่' : 'เปิดกล้องถ่ายรูป'}</span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>เลือกรูปจากเครื่อง</span>
              </button>
            </div>

            {cameraError && (
              <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{cameraError}</span>
              </p>
            )}
          </div>

          {/* Section 2: Name Input */}
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-1.5">
              2. ชื่อผู้ส่งเข้าประกวด <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น น้องฟ้าใส ใจดี"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
            />
          </div>

          {/* Section 3: Wish Input */}
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-1.5">
              3. คำอธิษฐานในคืนวันเพ็ญ
            </label>
            <textarea
              rows={3}
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="ขอขมาพระแม่คงคา และขอให้ชีวิตมีแต่ความสุข ความเจริญ..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all resize-none"
            />
          </div>

          {/* Section 4: Krathong Style Selector */}
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">
              4. เลือกรูปแบบกระทง
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {KRATHONG_STYLES.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-2.5 rounded-xl flex items-center gap-2 border text-left transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md shadow-amber-500/20'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 border border-white/40 shadow-sm"
                      style={{ backgroundColor: style.petalColor }}
                    />
                    <span className="text-xs font-medium truncate">{style.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCompressing || isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-amber-500 hover:from-amber-400 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all border border-amber-300/40 disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin" />
            <span>{isSubmitting ? 'กำลังบันทึกลง Firestore...' : 'ลอยกระทงสู่แม่น้ำ & เริ่มประกวด'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
