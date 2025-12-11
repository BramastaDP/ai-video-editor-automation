# 🎬 AI Video Editor Automation

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-Fullstack-blue)
![Python](https://img.shields.io/badge/Python-3.10%2B-yellow)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

**Aplikasi otomatisasi editing video berbasis AI yang mengubah video panjang menjadi konten vertikal (TikTok/Reels) secara instan.**

Dibuat untuk mengatasi masalah editing manual yang memakan waktu, aplikasi ini menggabungkan kekuatan **Python (Backend)** untuk pemrosesan media berat dan **Next.js (Frontend)** untuk antarmuka yang modern dan responsif.

---

## 📸 Tampilan Aplikasi (Preview)

> *Tampilan Antarmuka Modern dengan Mode Gelap & Glassmorphism*
![UI Screenshot](https://github.com/BramastaDP/ai-video-editor-automation/blob/main/Screenshot%202025-12-11%20at%2013.58.34.png)


---

## ✨ Fitur Utama

✅ **Auto-Trimming:** Memotong durasi video secara presisi sesuai keinginan pengguna.
✅ **Smart Crop (9:16):** Mengubah video landscape (YouTube) menjadi portrait otomatis agar pas di layar HP.
✅ **🤖 AI Subtitles:** Menggunakan **OpenAI Whisper (Medium Model)** untuk mentranskripsi suara menjadi teks dengan akurasi tinggi (Support Bahasa Indonesia & Inggris).
✅ **🎵 Audio Mixing:** Fitur *auto-ducking* untuk menggabungkan background music dengan suara asli secara mulus.
✅ **🎨 Visual Styling:** Kustomisasi font subtitle (Montserrat, Anton, Roboto) dan gaya visual estetik.
✅ **Watermark Otomatis:** Menambahkan identitas pembuat pada footer video.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

### Backend (The Brain 🧠)
* **Python 3.10+**: Bahasa pemrograman utama.
* **FastAPI**: Framework API modern yang super cepat.
* **OpenAI Whisper**: Model AI untuk Speech-to-Text.
* **MoviePy**: Library untuk editing video (potong, crop, gabung).
* **FFmpeg & ImageMagick**: Mesin pemroses multimedia di balik layar.

### Frontend (The Face 💻)
* **Next.js 14 (App Router)**: Framework React untuk performa web terbaik.
* **Tailwind CSS**: Untuk styling UI yang cepat dan modern.
* **Lucide React**: Ikon visual yang cantik.
* **Glassmorphism CSS**: Efek visual modern pada antarmuka.

---

## 🚀 Cara Menjalankan (Localhost)

Karena aplikasi ini menggunakan model AI yang berat, disarankan untuk menjalankannya di komputer lokal (Mac/Windows dengan GPU disarankan).

### Prasyarat
Pastikan sudah terinstall:
* Python 3.x
* Node.js & NPM
* ImageMagick & FFmpeg


## 👨‍💻 Author
Dibuat dengan ❤️ dan ☕ oleh Bramasta Dhuanda Prastiko.

