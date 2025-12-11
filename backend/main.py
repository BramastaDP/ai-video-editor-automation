# backend/main.py (VERSI ANTI-ERROR FONT)
import os
import shutil
import textwrap
import whisper
from fastapi import FastAPI, UploadFile, Form, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from moviepy.config import change_settings
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, AudioFileClip, CompositeAudioClip, afx
from moviepy.video.fx.all import crop
import uvicorn
import subprocess

# --- 1. KONFIGURASI IMAGE MAGICK (MAC) ---
try:
    path = subprocess.check_output(["which", "magick"]).decode("utf-8").strip()
    change_settings({"IMAGEMAGICK_BINARY": path})
except:
    try:
        path = subprocess.check_output(["which", "convert"]).decode("utf-8").strip()
        change_settings({"IMAGEMAGICK_BINARY": path})
    except:
        # Fallback lokasi Homebrew standar
        if os.path.exists("/opt/homebrew/bin/magick"):
            change_settings({"IMAGEMAGICK_BINARY": "/opt/homebrew/bin/magick"})
        else:
            change_settings({"IMAGEMAGICK_BINARY": "/opt/homebrew/bin/convert"})

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DOWNLOAD FONT TAMBAHAN (LEBIH AMAN) ---
FONTS = {
    "montserrat": "Montserrat-ExtraBold.ttf",
    "anton": "Anton-Regular.ttf",
    "roboto": "Roboto-Bold.ttf"
}

# Fungsi download font yang lebih pintar (Cek ukuran file)
def check_and_download_font(name, url, filename):
    # Jika file ada tapi ukurannya 0 (rusak), hapus dulu
    if os.path.exists(filename) and os.path.getsize(filename) < 1000:
        print(f"⚠️ Font {name} rusak (0 bytes). Menghapus dan download ulang...")
        os.remove(filename)
    
    # Jika tidak ada, download
    if not os.path.exists(filename):
        print(f"⬇️ Mendownload font {name}...")
        try:
            # Gunakan curl dengan flag -L (follow redirect) dan -f (fail on error)
            os.system(f"curl -L -f -o {filename} {url}")
        except Exception as e:
            print(f"Gagal download font {name}: {e}")

# Download ulang semua font
print("--- MENGECEK KONDISI FONT ---")
check_and_download_font("Montserrat", "https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-ExtraBold.ttf", FONTS["montserrat"])
check_and_download_font("Anton", "https://github.com/google/fonts/raw/main/ofl/anton/Anton-Regular.ttf", FONTS["anton"])
check_and_download_font("Roboto", "https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Bold.ttf", FONTS["roboto"])

print("🧠 Memuat Model Whisper...")
model_ai = whisper.load_model("medium") 

# --- 2. FUNGSI EDITING DENGAN SAFETY NET ---
def buat_subtitle_keren(clip_video, transkrip_data, rasio_pilihan, font_key):
    subtitle_clips = []
    current_fontsize = 28 if rasio_pilihan == '2' else 30
    current_width = 10 if rasio_pilihan == '2' else 15
    
    # Ambil path font
    font_filename = FONTS.get(font_key, FONTS["montserrat"])
    font_absolute_path = os.path.abspath(font_filename)
    
    # Cek validitas font
    use_system_font = False
    if not os.path.exists(font_absolute_path) or os.path.getsize(font_absolute_path) < 1000:
        print(f"⚠️ Font custom bermasalah. Menggunakan font sistem 'Helvetica-Bold'.")
        use_system_font = True

    for segment in transkrip_data['segments']:
        start = segment['start']
        end = segment['end']
        text = segment['text'].strip()
        if len(text) < 2: continue

        wrapper = textwrap.TextWrapper(width=current_width)
        word_list = wrapper.wrap(text=text)
        text_formatted = "\n".join(word_list).upper()

        # LOGIKA PEMBUATAN TEXT (TRY-EXCEPT)
        try:
            # Percobaan 1: Pakai Font Custom
            txt_clip = (TextClip(text_formatted,
                                 fontsize=current_fontsize,
                                 font=font_absolute_path if not use_system_font else "Helvetica-Bold",
                                 color='white',
                                 stroke_color='black',
                                 stroke_width=3,
                                 align='center')
                        .set_position(('center', 0.8), relative=True)
                        .set_duration(end - start)
                        .set_start(start))
            subtitle_clips.append(txt_clip)
            
        except Exception as e:
            # Percobaan 2 (Safety Net): Jika error, paksa pakai Helvetica (Bawaan Mac)
            print(f"⚠️ Gagal render font custom. Retry pakai Helvetica. Error: {e}")
            try:
                txt_clip = (TextClip(text_formatted,
                                     fontsize=current_fontsize,
                                     font="Helvetica-Bold", # Font aman di Mac
                                     color='white',
                                     stroke_color='black',
                                     stroke_width=3,
                                     align='center')
                            .set_position(('center', 0.8), relative=True)
                            .set_duration(end - start)
                            .set_start(start))
                subtitle_clips.append(txt_clip)
            except Exception as e2:
                print(f"❌ Gagal total render teks ini: {e2}")
                continue

    if not subtitle_clips: return clip_video
    return CompositeVideoClip([clip_video] + subtitle_clips)

@app.post("/process-video")
async def process_video(
    file: UploadFile = File(...),
    music: UploadFile = File(None),
    duration: float = Form(...),
    ratio: str = Form(...),
    language: str = Form(...),
    font: str = Form(...)
):
    print(f"🚀 Proses Video: {file.filename} | Font: {font}")
    
    temp_video = f"temp_{file.filename}"
    output_filename = "output_result.mp4"
    with open(temp_video, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    temp_music = None
    if music:
        temp_music = f"temp_{music.filename}"
        with open(temp_music, "wb") as buffer:
            shutil.copyfileobj(music.file, buffer)

    try:
        video_utama = VideoFileClip(temp_video)
        w_asli, h_asli = video_utama.size
        
        end_time = min(duration, video_utama.duration)
        clip = video_utama.subclip(0, end_time)

        if ratio == '2': # Portrait
            target_w = h_asli * (9/16)
            clip = crop(clip, x_center=w_asli/2, y_center=h_asli/2, width=target_w, height=h_asli)

        audio_asli = clip.audio
        if temp_music:
            music_clip = AudioFileClip(temp_music)
            if music_clip.duration < clip.duration:
                music_clip = afx.audio_loop(music_clip, duration=clip.duration)
            else:
                music_clip = music_clip.subclip(0, clip.duration)
            
            music_clip = music_clip.volumex(0.15)
            final_audio = CompositeAudioClip([audio_asli, music_clip])
            clip = clip.set_audio(final_audio)

        temp_audio_ai = "temp_audio_ai.mp3"
        clip.audio.write_audiofile(temp_audio_ai, bitrate="192k", verbose=False, logger=None)
        
        lang_code = 'id' if language == '2' else 'en' if language == '3' else None
        transkrip = model_ai.transcribe(temp_audio_ai, language=lang_code, condition_on_previous_text=False, word_timestamps=True)
        
        # Panggil fungsi subtitle yang sudah aman
        final_clip = buat_subtitle_keren(clip, transkrip, ratio, font)
        
        final_clip.write_videofile(output_filename, codec="libx264", audio_codec="aac", preset='ultrafast', logger=None)

        clip.close()
        video_utama.close()
        if temp_music: os.remove(temp_music)
        if os.path.exists(temp_video): os.remove(temp_video)
        if os.path.exists(temp_audio_ai): os.remove(temp_audio_ai)

        return FileResponse(output_filename, media_type="video/mp4", filename="hasil_v2.mp4")

    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        if os.path.exists(temp_video): os.remove(temp_video)
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)