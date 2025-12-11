# 🎬 AI Video Editor Automation

**Automated Video Editing Pipeline using Python (FastAPI) & Next.js**

Project ini adalah alat otomatisasi untuk mengubah video panjang (Landscape) menjadi konten pendek vertikal (TikTok/Reels) secara instan. Dibangun untuk menyelesaikan masalah editing manual yang memakan waktu.

## ✨ Fitur Utama
* **✂️ Smart Trimming:** Memotong durasi video secara presisi.
* **📐 Auto-Crop 9:16:** Mengubah rasio video landscape menjadi portrait otomatis.
* **📝 AI Subtitles:** Transkripsi audio-ke-teks otomatis menggunakan **OpenAI Whisper** dengan akurasi tinggi (Support Bahasa Indonesia).
* **🎵 Smart Audio Mixing:** Menambahkan background music dengan volume yang disesuaikan (Ducking).
* **🎨 Dynamic Styling:** Subtitle dengan font modern (Montserrat/Anton) dan visual estetik.

## 🛠️ Tech Stack
* **Backend:** Python, FastAPI, MoviePy, OpenAI Whisper, FFmpeg.
* **Frontend:** Next.js 14, Tailwind CSS, Lucide React.
* **System:** Local Processing (macOS optimized).

## 🚀 Cara Menjalankan (Localhost)

### Prasyarat
Pastikan sudah terinstall: Python 3.10+, Node.js, ImageMagick, dan FFmpeg.

### 1. Setup Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py