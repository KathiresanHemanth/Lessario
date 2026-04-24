import os
os.environ["PATH"] += r";C:\Users\khkum\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin"

import whisper

print("Loading model...")
model = whisper.load_model("small")  # Using "small" for better translation quality while still fast
print("Transcribing and translating...")
result = model.transcribe("shinguu dubbing guide by writer.mp3", task="translate", verbose=True)

def format_timestamp(seconds: float):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours:02d}:{minutes:02d}:{secs:06.3f}".replace('.', ',')

srt_content = []
for i, segment in enumerate(result['segments'], start=1):
    start = format_timestamp(segment['start'])
    end = format_timestamp(segment['end'])
    text = segment['text'].strip()
    srt_content.append(f"{i}\n{start} --> {end}\n{text}\n")

srt_text = "\n".join(srt_content)

print("Writing to SRT file...")
with open("shinguu_dubbing_guide_translated.srt", "w", encoding="utf-8") as f:
    f.write(srt_text)

print("Writing to Markdown file...")
with open("shinguu_dubbing_guide_translated.md", "w", encoding="utf-8") as f:
    f.write("# Shinguu Dubbing Guide (Translated)\n\n")
    f.write("```srt\n")
    f.write(srt_text)
    f.write("\n```\n")

print("Done!")
