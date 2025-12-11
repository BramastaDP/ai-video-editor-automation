'use client';
import { useState } from 'react';
import { Upload, Music, Clock, Type, Globe, CheckCircle, Loader2, Video, Scissors, Heart } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [music, setMusic] = useState(null);
  const [duration, setDuration] = useState(30);
  const [ratio, setRatio] = useState('1');
  const [language, setLanguage] = useState('1');
  const [font, setFont] = useState('montserrat');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("⚠️ Pilih video dulu bos!");

    setLoading(true);
    setVideoUrl(null);
    setStatus("Sedang menghubungkan ke Otak AI...");

    const formData = new FormData();
    formData.append('file', file);
    if (music) formData.append('music', music);
    formData.append('duration', duration);
    formData.append('ratio', ratio);
    formData.append('language', language);
    formData.append('font', font);

    try {
      const response = await fetch('http://localhost:8000/process-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Gagal proses di server");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setVideoUrl(url);
      setStatus("Selesai! Video siap ditonton.");
    } catch (error) {
      alert("Error: " + error.message);
      setStatus("Gagal memproses video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden flex flex-col">
      
      {/* Background Glow Effect */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col items-center flex-grow">
        
        {/* Header Section */}
        <div className="text-center mb-10 animate-fade-in-down">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-gray-400">
            AI Video Editor
          </h1>
          <p className="text-gray-400 text-lg">Ubah video panjang jadi konten viral dalam sekejap.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
          
          {/* FORM CARD */}
          <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            {/* Border Glow on Hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/30 rounded-3xl transition-all duration-500 pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              
              {/* Upload Zone */}
              <div className="relative group/upload">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer bg-gray-800/50 hover:bg-gray-800 hover:border-purple-500 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {file ? (
                      <>
                        <CheckCircle className="w-10 h-10 text-green-400 mb-2" />
                        <p className="text-sm text-green-300 font-semibold">{file.name}</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mb-2 group-hover/upload:text-purple-400 transition-colors" />
                        <p className="text-sm text-gray-400"><span className="font-semibold text-purple-400">Klik upload</span> video utama</p>
                        <p className="text-xs text-gray-500 mt-1">MP4, MOV (Max 100MB)</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
                </label>
              </div>

              {/* Music Upload */}
              <div className="relative">
                 <label className="flex items-center gap-3 w-full p-3 border border-gray-700 rounded-xl cursor-pointer bg-gray-800/30 hover:bg-gray-800 hover:border-blue-500 transition-all">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Music className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 font-medium">{music ? music.name : "Tambah Background Music (Opsional)"}</p>
                      {!music && <p className="text-xs text-gray-500">Audio akan otomatis di-mixing</p>}
                    </div>
                    <input type="file" className="hidden" accept="audio/*" onChange={(e) => setMusic(e.target.files[0])} />
                 </label>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Durasi (Detik)
                  </label>
                  <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 text-white text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 block p-3 transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Type className="w-3 h-3" /> Gaya Font
                  </label>
                  <select value={font} onChange={(e) => setFont(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 text-white text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 block p-3 appearance-none cursor-pointer">
                    <option value="montserrat">Montserrat (Tebal)</option>
                    <option value="anton">Anton (TikTok Viral)</option>
                    <option value="roboto">Roboto (Clean)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-3 h-3" /> Rasio
                  </label>
                  <select value={ratio} onChange={(e) => setRatio(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 text-white text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 block p-3 cursor-pointer">
                    <option value="1">Original (Landscape)</option>
                    <option value="2">Portrait (9:16)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Bahasa Audio
                  </label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 text-white text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 block p-3 cursor-pointer">
                    <option value="1">Auto Detect</option>
                    <option value="2">Indonesia</option>
                    <option value="3">Inggris</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full relative group overflow-hidden rounded-xl p-4 font-bold text-lg transition-all shadow-lg shadow-purple-500/20 ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] hover:shadow-purple-500/40'}`}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sedang Meracik...</span>
                    </>
                  ) : (
                    <>
                      <span>✨ Generate Magic Video</span>
                    </>
                  )}
                </div>
              </button>

              {/* Status Text */}
              {status && (
                <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium border ${status.includes("Gagal") ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"}`}>
                  {status}
                </div>
              )}
            </form>
          </div>

          {/* PREVIEW CARD */}
          <div className="w-full lg:w-[400px]">
            {videoUrl ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl sticky top-8 animate-fade-in-up">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5 text-green-400" /> Hasil Video
                </h2>
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700 mb-6 bg-black">
                   <video controls src={videoUrl} className="w-full h-auto" />
                </div>
                <a 
                  href={videoUrl} 
                  download="hasil_video_ai.mp4" 
                  className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl border border-gray-600 transition-all hover:border-gray-500"
                >
                  ⬇️ Download MP4
                </a>
              </div>
            ) : (
              <div className="h-full min-h-[300px] border-2 border-dashed border-gray-700 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Video className="w-8 h-8 opacity-50" />
                </div>
                <p className="font-medium">Hasil video akan muncul di sini</p>
                <p className="text-sm opacity-60 mt-2">Silakan upload video dan tekan tombol generate.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* FOOTER / WATERMARK */}
      <div className="w-full py-8 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm mt-auto">
        <p className="text-gray-500 text-sm font-medium tracking-widest uppercase flex items-center justify-center gap-2">
          Dibuat oleh <span className="text-purple-400 font-bold">Bramasta Dhuanda Prastiko</span> - 2025
        </p>
      </div>

    </div>
  );
}