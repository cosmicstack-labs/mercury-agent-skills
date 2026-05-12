---
name: audio-extraction
description: 'Audio Extraction: Extracting audio from videos, converting formats, and managing audio collections'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: media-download
  tags: [audio-extraction, mp3-conversion, audio-conversion, ffmpeg, music]
---

# Audio Extraction

Extract high-quality audio from video files, convert between formats, manage metadata, and build organized audio collections. This skill covers everything from one-off audio rips to batch processing pipelines.

## Core Principles

### 1. Source Quality Determines Output Quality
You cannot create quality that wasn't captured. Start with the highest quality source available — lossy-to-lossy transcoding degrades audio further. Always extract from the best original source.

### 2. Choose the Right Format for the Use Case
- **MP3** (lossy): Universal compatibility, great for music players and portable devices
- **FLAC** (lossless): Archival quality, for listening on quality equipment or future transcoding
- **AAC/M4A**: Better quality than MP3 at the same bitrate, native to Apple ecosystem
- **OGG/Opus**: Best quality-per-bitrate, perfect for streaming and podcasts
- **WAV** (uncompressed): Editing and production, not for everyday listening

### 3. Metadata Is Not Optional
Untagged audio files are unmanageable at scale. Proper ID3 tags, cover art, and consistent naming conventions turn a pile of files into a browsable music library.

### 4. Preserve the Original
Always keep a copy of the original file or at minimum log what source was used. Once you transcode, you lose information. Archival means keeping the best available original plus a convenient playback copy.

---

## Audio Extraction with yt-dlp

### Basic Audio Extraction
```bash
# Simplest audio extraction (best quality)
yt-dlp -x "https://youtube.com/watch?v=VIDEO_ID"

# Specific audio format
yt-dlp -x --audio-format mp3 "https://youtube.com/watch?v=VIDEO_ID"

# Best quality with metadata
yt-dlp -x --audio-format mp3 --audio-quality 0 \
  --embed-thumbnail --embed-metadata "URL"
```

### Format Conversion Options
```bash
# MP3 at various quality levels
yt-dlp -x --audio-format mp3 --audio-quality 0 "URL"     # 320kbps (best)
yt-dlp -x --audio-format mp3 --audio-quality 2 "URL"     # ~256kbps
yt-dlp -x --audio-format mp3 --audio-quality 5 "URL"     # ~192kbps (good)
yt-dlp -x --audio-format mp3 --audio-quality 9 "URL"     # ~128kbps (acceptable)

# FLAC (lossless)
yt-dlp -x --audio-format flac --audio-quality 0 "URL"

# AAC/M4A
yt-dlp -x --audio-format m4a "URL"

# Opus (best quality-per-bitrate)
yt-dlp -x --audio-format opus "URL"

# WAV (uncompressed)
yt-dlp -x --audio-format wav "URL"
```

### Audio-Only Format Selection
```bash
# List available audio formats
yt-dlp -F "URL" | grep -E "audio|opus|aac|mp3|m4a"

# Download specific audio stream
yt-dlp -f "140" "URL"  # 128kbps AAC (YouTube standard)

# Download highest bitrate audio
yt-dlp -f "bestaudio[abr>128]/bestaudio" "URL"

# Download Opus stream (YouTube music)
yt-dlp -f "251" "URL"  # 160kbps Opus
```

---

## FFmpeg Audio Processing

### Format Conversion
```bash
# Convert MP4 to MP3
ffmpeg -i input.mp4 -vn -acodec libmp3lame -ab 320k output.mp3

# Convert any video to FLAC
ffmpeg -i input.mkv -vn -c:a flac output.flac

# Batch convert all MP4s in directory
for f in *.mp4; do
  ffmpeg -i "$f" -vn -acodec libmp3lame -ab 320k "${f%.mp4}.mp3"
done
```

### Trimming Audio
```bash
# Trim from 30s to 1m30s
ffmpeg -i input.mp3 -ss 00:00:30 -to 00:01:30 -c copy output.mp3

# Trim from start for 45 seconds
ffmpeg -i input.mp3 -t 45 -c copy output.mp3

# Trim with re-encoding (for precise cuts)
ffmpeg -i input.mp3 -ss 00:00:30 -to 00:01:30 output.mp3
```

### Merging Audio Files
```bash
# Concatenate with ffmpeg (same format)
ffmpeg -i "concat:file1.mp3|file2.mp3|file3.mp3" -c copy merged.mp3

# Using concat demuxer
echo "file 'part1.mp3'" > files.txt
echo "file 'part2.mp3'" >> files.txt
echo "file 'part3.mp3'" >> files.txt
ffmpeg -f concat -safe 0 -i files.txt -c copy merged.mp3

# Merge with crossfade
ffmpeg -i part1.mp3 -i part2.mp3 -filter_complex \
  "[0:a][1:a]acrossfade=d=2:c1=tri:c2=tri[a]" \
  -map "[a]" merged.mp3
```

### Audio Normalization
```bash
# EBU R128 loudness normalization (broadcast standard)
ffmpeg -i input.mp3 -af loudnorm=I=-16:LRA=11:TP=-1.5 output.mp3

# Peak normalization (simpler)
ffmpeg -i input.mp3 -af volume=3dB output.mp3

# Dynamic range compression
ffmpeg -i input.mp3 -af acompressor=threshold=-21dB:ratio=9:attack=200:release=1000 output.mp3

# Normalize batch files
for f in *.mp3; do
  ffmpeg -i "$f" -af loudnorm=I=-16:LRA=11:TP=-1.5 "normalized_$f"
done
```

---

## Metadata Tagging

### Using eyeD3 (MP3)
```bash
# Install eyeD3
pip install eyeD3

# Set basic tags
eyeD3 -a "Artist Name" -A "Album Title" -t "Song Title" -n 1 -N 10 track.mp3

# Set genre and year
eyeD3 -G "Rock" -Y 2024 track.mp3

# Add album art
eyeD3 --add-image cover.jpg:FRONT_COVER track.mp3

# Remove all tags
eyeD3 --remove-all track.mp3
```

### Using mutagen (Python - All Formats)
```python
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TIT2, TPE1, TALB, TRCK, TYER, APIC
import os

def tag_audio_file(filepath, metadata, cover_art_path=None):
    """
    Tag an audio file with comprehensive metadata.
    
    Args:
        filepath: Path to the audio file
        metadata: Dict with keys: title, artist, album, track, year, genre
        cover_art_path: Path to cover art image
    """
    audio = MP3(filepath, ID3=ID3)
    audio.tags.add(TIT2(encoding=3, text=metadata['title']))
    audio.tags.add(TPE1(encoding=3, text=metadata['artist']))
    audio.tags.add(TALB(encoding=3, text=metadata['album']))
    audio.tags.add(TRCK(encoding=3, text=str(metadata['track'])))
    audio.tags.add(TYER(encoding=3, text=str(metadata['year'])))
    
    if cover_art_path and os.path.exists(cover_art_path):
        with open(cover_art_path, 'rb') as img:
            audio.tags.add(
                APIC(
                    encoding=3,
                    mime='image/jpeg',
                    type=3,  # Front cover
                    desc='Cover',
                    data=img.read()
                )
            )
    
    audio.save()

# Usage
tag_audio_file('track.mp3', {
    'title': 'Bohemian Rhapsody',
    'artist': 'Queen',
    'album': 'A Night at the Opera',
    'track': 11,
    'year': 1975,
    'genre': 'Rock'
}, 'cover.jpg')
```

### Batch Metadata from Filename
```python
import os
import re
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TIT2, TPE1, TALB

def tag_from_filename(directory, pattern=r"(.+?) - (.+?) - (.+)\.mp3"):
    """
    Tag files based on filename pattern.
    Default pattern: "Artist - Album - Title.mp3"
    """
    for filename in os.listdir(directory):
        if not filename.endswith('.mp3'):
            continue
        
        match = re.match(pattern, filename)
        if not match:
            continue
        
        artist, album, title = match.groups()
        filepath = os.path.join(directory, filename)
        
        audio = MP3(filepath, ID3=ID3)
        audio.tags.add(TPE1(encoding=3, text=artist.strip()))
        audio.tags.add(TALB(encoding=3, text=album.strip()))
        audio.tags.add(TIT2(encoding=3, text=title.strip()))
        audio.save()
        
        print(f"Tagged: {filename} → {artist} / {album} / {title}")

# Usage
tag_from_filename("~/Music/Downloads/")
```

---

## Podcast RSS Feed Downloads

### Using yt-dlp for Podcasts
```bash
# Download podcast episode from RSS
yt-dlp -x --audio-format mp3 --audio-quality 0 "PODCAST_RSS_URL"

# Download only the latest episode
yt-dlp --playlist-end 1 -x --audio-format mp3 "RSS_URL"

# Download with consistent naming
yt-dlp -o "%(title)s.%(ext)s" -x --audio-format mp3 "RSS_URL"
```

### Using gPodder (CLI)
```bash
# Install gPodder
pip install gpodder

# Subscribe to a podcast
gpo add "https://example.com/podcast/rss"

# Download new episodes
gpo download

# List subscriptions
gpo list
```

### Custom Podcast Downloader
```python
import feedparser
import requests
import os
from urllib.parse import urlparse

def download_podcast_episodes(rss_url, output_dir="~/Podcasts"):
    """Download all episodes from an RSS feed."""
    output_dir = os.path.expanduser(output_dir)
    os.makedirs(output_dir, exist_ok=True)
    
    feed = feedparser.parse(rss_url)
    podcast_title = feed.feed.get('title', 'Unknown Podcast')
    podcast_dir = os.path.join(output_dir, podcast_title)
    os.makedirs(podcast_dir, exist_ok=True)
    
    for entry in feed.entries:
        title = entry.get('title', 'Unknown Episode')
        
        # Sanitize filename
        safe_title = "".join(c for c in title if c.isalnum() or c in ' -_').rstrip()
        
        # Find audio enclosure
        for link in entry.get('links', []):
            if link.get('type', '').startswith('audio/'):
                audio_url = link['href']
                ext = os.path.splitext(urlparse(audio_url).path)[1] or '.mp3'
                filepath = os.path.join(podcast_dir, f"{safe_title}{ext}")
                
                if os.path.exists(filepath):
                    print(f"✓ Already downloaded: {title}")
                    continue
                
                print(f"↓ Downloading: {title}")
                response = requests.get(audio_url, stream=True)
                with open(filepath, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                print(f"✓ Saved: {filepath}")
                break

# Usage
download_podcast_episodes("https://feeds.example.com/podcast/rss.xml")
```

---

## Batch Audio Extraction

### Process Multiple Files
```bash
# Extract audio from all videos in directory
for f in *.mp4 *.mkv *.webm; do
  [ -e "$f" ] || continue
  ffmpeg -i "$f" -vn -acodec libmp3lame -ab 320k "${f%.*}.mp3"
done
```

### Recursive Directory Processing
```python
import os
import subprocess

def extract_audio_recursive(root_dir, output_format='mp3', bitrate='320k'):
    """Extract audio from all video files in directory tree."""
    video_extensions = {'.mp4', '.mkv', '.webm', '.avi', '.mov', '.flv'}
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            ext = os.path.splitext(filename)[1].lower()
            if ext not in video_extensions:
                continue
            
            input_path = os.path.join(dirpath, filename)
            output_name = os.path.splitext(filename)[0] + f'.{output_format}'
            output_path = os.path.join(dirpath, output_name)
            
            if os.path.exists(output_path):
                print(f"✓ Already exists: {output_name}")
                continue
            
            print(f"⟳ Extracting: {filename} → {output_name}")
            cmd = [
                'ffmpeg', '-i', input_path,
                '-vn',
                '-c:a', 'libmp3lame' if output_format == 'mp3' else output_format,
                '-b:a', bitrate,
                '-y', output_path
            ]
            subprocess.run(cmd, capture_output=True)
            print(f"✓ Done: {output_name}")

# Usage
extract_audio_recursive("~/Videos/Recordings", output_format='mp3', bitrate='320k')
```

### Parallel Processing
```python
import os
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

def extract_audio_parallel(root_dir, workers=4):
    """Extract audio using multiple parallel workers."""
    video_files = []
    video_extensions = {'.mp4', '.mkv', '.webm'}
    
    for dirpath, _, filenames in os.walk(root_dir):
        for f in filenames:
            if os.path.splitext(f)[1].lower() in video_extensions:
                video_files.append(os.path.join(dirpath, f))
    
    def process_file(filepath):
        output = os.path.splitext(filepath)[0] + '.mp3'
        if os.path.exists(output):
            return f"✓ Skipped (exists): {os.path.basename(filepath)}"
        
        cmd = [
            'ffmpeg', '-i', filepath,
            '-vn', '-c:a', 'libmp3lame',
            '-b:a', '320k', '-y', output
        ]
        subprocess.run(cmd, capture_output=True, timeout=300)
        return f"✓ Extracted: {os.path.basename(filepath)}"
    
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(process_file, f): f for f in video_files}
        for future in as_completed(futures):
            print(future.result())

# Usage
extract_audio_parallel("~/Videos", workers=4)
```

---

## Audio Normalization and Leveling

### EBU R128 Loudness Standard
```python
import subprocess
import json

def normalize_loudness(input_file, output_file, target_lufs=-16):
    """
    Normalize audio to target loudness using EBU R128 standard.
    
    Args:
        input_file: Source audio file
        output_file: Output file path
        target_lufs: Target loudness in LUFS (default: -16 for podcasts, -14 for music)
    """
    # First pass: measure loudness
    measure_cmd = [
        'ffmpeg', '-i', input_file,
        '-af', f'loudnorm=I={target_lufs}:LRA=11:TP=-1.5:print_format=json',
        '-f', 'null', '-'
    ]
    result = subprocess.run(measure_cmd, capture_output=True, text=True, timeout=60)
    
    # Second pass: apply normalization
    normalize_cmd = [
        'ffmpeg', '-i', input_file,
        '-af', f'loudnorm=I={target_lufs}:LRA=11:TP=-1.5',
        '-c:a', 'libmp3lame', '-b:a', '320k',
        '-y', output_file
    ]
    subprocess.run(normalize_cmd, capture_output=True, timeout=120)
    print(f"Normalized to {target_lufs} LUFS: {output_file}")

# Usage
normalize_loudness("input.mp3", "output.mp3", target_lufs=-16)
```

---

## Splitting Audio by Chapters

### Chapter-Based Splitting
```python
import subprocess
import json

def split_by_chapters(input_file, output_dir="splits"):
    """
    Split an audio file into chapters using ffmpeg chapter metadata.
    """
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    # Get chapter info
    cmd = [
        'ffprobe', '-i', input_file,
        '-print_format', 'json',
        '-show_chapters',
        '-loglevel', 'error'
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    chapters = json.loads(result.stdout).get('chapters', [])
    
    if not chapters:
        print("No chapters found in the file.")
        return
    
    for chapter in chapters:
        start = chapter['start_time']
        end = chapter['end_time']
        title = chapter.get('tags', {}).get('title', f'Chapter {chapter["id"]}')
        
        safe_title = "".join(c for c in title if c.isalnum() or c in ' -_')
        output_path = os.path.join(output_dir, f"{safe_title}.mp3")
        
        cmd = [
            'ffmpeg', '-i', input_file,
            '-ss', str(start),
            '-to', str(end),
            '-c:a', 'libmp3lame', '-b:a', '320k',
            '-y', output_path
        ]
        subprocess.run(cmd, capture_output=True, timeout=300)
        print(f"✓ Split: {title} ({start}s → {end}s)")

# Usage
split_by_chapters("podcast.mp3", "~/Music/Splits")
```

---

## Speech-to-Text Integration

### Extracting Audio for Transcription
```python
import subprocess
import os

def prepare_for_transcription(video_file, output_wav="speech.wav"):
    """
    Extract clean speech-optimized audio for transcription.
    Converts to mono 16kHz WAV (standard for speech recognition).
    """
    cmd = [
        'ffmpeg', '-i', video_file,
        '-vn',                    # No video
        '-acodec', 'pcm_s16le',   # 16-bit PCM
        '-ac', '1',               # Mono
        '-ar', '16000',           # 16kHz sample rate
        '-af', 'highpass=200,lowpass=8000',  # Speech frequency filter
        '-y', output_wav
    ]
    subprocess.run(cmd, capture_output=True, timeout=300)
    print(f"✓ Audio prepared for transcription: {output_wav}")
    return output_wav

# Usage
prepare_for_transcription("lecture.mp4", "lecture_audio.wav")
```

---

## Skill Maturity Model

| Level | Coverage | Quality | Metadata | Automation |
|-------|----------|---------|----------|------------|
| **1: Basic** | One-off extractions | Default quality | None | Manual |
| **2: Consistent** | Format selection, basic batch | Target bitrate | Basic tags | Shell scripts |
| **3: Organized** | Batch processing, normalization | Optimized per use case | Full ID3 + album art | Config presets |
| **4: Automated** | Watch folders, scheduled jobs | Verified quality | Automatic tagging | Cron jobs + webhooks |
| **5: Library** | Full pipeline, multi-format archive | Lossless originals + playback copies | Complete metadata + cover | Full automation with monitoring |

**Target: Level 3** for personal music collections. **Level 4** for podcast production pipelines. **Level 5** for media archiving at scale.

---

## Common Mistakes

1. **Transcoding lossy to lossy**: Converting MP3 to FLAC doesn't restore quality — you get a large file with the same lossy audio. Always keep the original or use a lossless source.
2. **Ignoring sample rate and bit depth**: For archival, use the source's native sample rate. Unnecessary resampling degrades quality. Only convert sample rates when needed.
3. **Missing album art in playable files**: Many music players display album art prominently. Without it, your library looks unprofessional. Always embed cover art.
4. **Not normalizing volume levels**: Different sources have vastly different loudness levels. Without normalization, switching between tracks or podcasts means constantly adjusting volume.
5. **Using wrong bitrate for the content**: Music at 128kbps sounds noticeably compressed. Use 320kbps for music, 128kbps is fine for speech/podcasts. Opus at 96kbps is excellent for both.
6. **Overwriting originals**: Always work on copies. A mistyped ffmpeg command can destroy your original file. Use `-y` cautiously.
7. **Neglecting metadata hygiene**: Inconsistent or missing tags make a library unsearchable. Establish a tagging convention and stick to it.
8. **Not checking for clipping after normalization**: Aggressive loudness normalization can cause clipping. Use true peak limiting (TP=-1.5 in loudnorm) to prevent this.
9. **Forgetting to test output quality**: Don't trust the bitrate display — actually listen to a sample. Some extraction pipelines produce artifacts that aren't obvious in the metadata.
10. **Inconsistent naming schemes**: A mix of conventions (Title.mp3 vs artist-title.mp3 vs track_number_title.mp3) makes automation harder. Pick one scheme and apply it universally.
