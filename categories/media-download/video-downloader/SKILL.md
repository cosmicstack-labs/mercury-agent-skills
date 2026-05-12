---
name: video-downloader
description: 'Video Downloader: Using yt-dlp to download videos from YouTube, Bilibili, Twitter, and thousands of other sites'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: media-download
  tags: [video-download, yt-dlp, youtube-downloader, media-download, bilibili]
---

# Video Downloader

Download videos from thousands of sites using yt-dlp — the most powerful and actively maintained video downloading tool. This skill covers installation, configuration, format selection, playlist management, and optimization techniques.

## Core Principles

### 1. Choose the Right Tool
yt-dlp is the successor to youtube-dl and is actively maintained with support for over 1,000 sites. It handles YouTube, Bilibili, Twitter/X, Instagram, TikTok, Vimeo, Twitch, and countless others through extractors.

### 2. Understand Format Selection
Video and audio are often delivered as separate streams (DASH). yt-dlp can merge them automatically with ffmpeg, or you can download them individually. Understanding formats means you get exactly the quality you need without wasting bandwidth.

### 3. Respect Rate Limits and Servers
Don't hammer servers with concurrent downloads. Use rate limiting, randomized delays, and reasonable thread counts to avoid IP blocks and maintain access.

### 4. Handle Authentication Properly
Some content requires authentication. Use cookies from your browser session rather than passing passwords directly. This is more reliable and avoids credential exposure in command history.

---

## Installation and Setup

### macOS (Homebrew)
```bash
# Install yt-dlp
brew install yt-dlp

# Install ffmpeg for post-processing (merging, conversion)
brew install ffmpeg
```

### Linux (Ubuntu/Debian)
```bash
# Latest version via pip (recommended)
python3 -m pip install -U yt-dlp

# Or via apt (may be outdated)
sudo apt install yt-dlp ffmpeg
```

### Windows
```powershell
# Via pip (recommended)
python -m pip install -U yt-dlp

# Via winget
winget install yt-dlp

# Download standalone binary
# https://github.com/yt-dlp/yt-dlp/releases
```

### Verify Installation
```bash
yt-dlp --version
yt-dlp --help | head -20
```

---

## Basic Download Commands

### Simple Video Download
```bash
# Download best quality video+audio
yt-dlp "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# Download with specific output template
yt-dlp -o "%(title)s.%(ext)s" "https://youtube.com/watch?v=VIDEO_ID"
```

### Format Selection

```bash
# List available formats
yt-dlp -F "https://youtube.com/watch?v=VIDEO_ID"

# Download best video+audio combined
yt-dlp -f "bestvideo+bestaudio" "URL"

# Download specific resolution (e.g., 1080p)
yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" "URL"

# Download worst quality (for slow connections)
yt-dlp -f "worst" "URL"

# Download only audio (most compatible format)
yt-dlp -f "bestaudio" -x --audio-format mp3 "URL"

# Download a specific format by format code
yt-dlp -f "137+140" "URL"  # 137=1080p video, 140=audio
```

### Output Templates

```bash
# Organize by type and ID
yt-dlp -o "%(playlist_title)s/%(playlist_index)s - %(title)s.%(ext)s" "URL"

# Custom directory structure
yt-dlp -o "~/Downloads/YouTube/%(uploader)s/%(title)s.%(ext)s" "URL"

# Include date in filename
yt-dlp -o "%(upload_date>%Y-%m-%d)s - %(title)s.%(ext)s" "URL"
```

---

## Playlist and Channel Downloading

### Download Full Playlists
```bash
# Download entire playlist
yt-dlp "https://youtube.com/playlist?list=PLAYLIST_ID"

# Download specific range
yt-dlp --playlist-start 1 --playlist-end 10 "PLAYLIST_URL"

# Download only liked videos
yt-dlp "https://youtube.com/playlist?list=LL"

# Reverse playlist order
yt-dlp --playlist-reverse "PLAYLIST_URL"
```

### Channel Downloads
```bash
# Download all videos from a channel
yt-dlp "https://www.youtube.com/@ChannelName/videos"

# Download only recent videos (last 5)
yt-dlp --max-downloads 5 "https://www.youtube.com/@ChannelName/videos"

# Download with channel-specific folder
yt-dlp -o "%(channel)s/%(playlist)s/%(playlist_index)s - %(title)s.%(ext)s" "URL"
```

### Archive File Management

```bash
# Track downloaded videos to avoid re-downloading
yt-dlp --download-archive archive.txt "PLAYLIST_URL"

# Use archive for incremental updates
yt-dlp --download-archive ~/.yt-dlp-archive "CHANNEL_URL"
```

---

## Subtitle Downloading

### Automatic and Manual Subtitles
```bash
# Download all available subtitles
yt-dlp --write-subs --sub-langs all "URL"

# Download specific language subtitles
yt-dlp --write-subs --sub-langs "en,es,fr" "URL"

# Download auto-generated subtitles
yt-dlp --write-auto-subs --sub-langs "en" "URL"

# Embed subtitles into video file
yt-dlp --embed-subs --sub-langs "en" "URL"

# Convert subtitles to SRT format
yt-dlp --write-subs --sub-langs "en" --convert-subs srt "URL"
```

---

## Authentication and Cookies

### Using Browser Cookies
```bash
# Extract cookies from browser (for age-restricted content)
yt-dlp --cookies-from-browser chrome "URL"

# Use specific browser profile
yt-dlp --cookies-from-browser firefox:"~/Library/Application Support/Firefox/Profiles/xxxx.default-release" "URL"

# Save cookies to file for reuse
yt-dlp --cookies-from-browser chrome --cookies cookies.txt "URL"
yt-dlp --cookies cookies.txt "URL"
```

### Login Credentials (Less Recommended)
```bash
# Pass username and password
yt-dlp -u "username" -p "password" "URL"

# Use netrc file (~/.netrc)
yt-dlp --netrc "URL"
```

---

## Download Speed and Performance

### Speed Optimization
```bash
# Use multiple threads/fragments for faster downloads
yt-dlp --fragment-retries 10 --concurrent-fragments 5 "URL"

# Limit download speed (500 KB/s)
yt-dlp --limit-rate 500K "URL"

# Retry on failure
yt-dlp --retries 10 --fragment-retries 10 "URL"

# Throttled download detection
yt-dlp --throttled-rate 100K "URL"
```

### Proxy Configuration
```bash
# HTTP/HTTPS proxy
yt-dlp --proxy "http://proxy.example.com:8080" "URL"

# SOCKS5 proxy
yt-dlp --proxy "socks5://127.0.0.1:1080" "URL"

# Tor proxy
yt-dlp --proxy "socks5://127.0.0.1:9050" "URL"

# No proxy for specific sites
yt-dlp --proxy "http://proxy.example.com:8080" --no-proxy "https://youtube.com" "URL"
```

---

## Post-Processing with FFmpeg

### Merging and Conversion
```bash
# Automatically merge best video+audio (requires ffmpeg)
yt-dlp -f "bestvideo+bestaudio" --merge-output-format mp4 "URL"

# Convert to specific container
yt-dlp --merge-output-format mkv "URL"

# Extract audio and convert
yt-dlp -x --audio-format mp3 --audio-quality 0 "URL"
```

### Custom FFmpeg Options
```bash
# Apply ffmpeg filters
yt-dlp --postprocessor-args "ffmpeg:-vf 'scale=1280:720'" "URL"

# Add metadata
yt-dlp --parse-metadata "%(title)s:%(meta_title)s" "URL"

# Embed thumbnail
yt-dlp --embed-thumbnail "URL"
```

### Embedding Metadata
```bash
# Embed all metadata
yt-dlp --embed-metadata --embed-thumbnail "URL"

# Embed chapters
yt-dlp --embed-chapters "URL"

# Write info JSON
yt-dlp --write-info-json "URL"
```

---

## Batch Downloading

### From a File List
```bash
# Create a text file with one URL per line
# urls.txt
# https://youtube.com/watch?v=VIDEO1
# https://youtube.com/watch?v=VIDEO2
# https://vimeo.com/VIDEO3

# Download all URLs from file
yt-dlp --batch-file urls.txt

# Download with filtered list
yt-dlp --batch-file urls.txt --match-filter "duration < 3600"
```

### Advanced Batch Processing
```bash
# Download only matching titles
yt-dlp --match-title "tutorial" --batch-file urls.txt

# Skip videos by title pattern
yt-dlp --reject-title "live stream" --batch-file urls.txt

# Download by date range
yt-dlp --dateafter "20240101" --datebefore "20241231" "CHANNEL_URL"

# Minimum and maximum file size
yt-dlp --min-filesize 10M --max-filesize 500M "URL"
```

---

## Python Scripting with yt-dlp

### Basic Python Integration
```python
import yt_dlp
import json

def download_video(url, output_path="~/Downloads/YouTube"):
    """Download a single video with best quality."""
    ydl_opts = {
        'format': 'bestvideo+bestaudio/best',
        'outtmpl': f'{output_path}/%(title)s.%(ext)s',
        'merge_output_format': 'mp4',
        'embedmetadata': True,
        'embedthumbnail': True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        return {
            'title': info.get('title'),
            'duration': info.get('duration'),
            'filesize': info.get('filesize'),
            'filepath': ydl.prepare_filename(info)
        }

# Usage
result = download_video("https://youtube.com/watch?v=dQw4w9WgXcQ")
print(f"Downloaded: {result['title']}")
```

### Extracting Info Without Downloading
```python
import yt_dlp

def get_video_info(url):
    """Get video metadata without downloading."""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        return {
            'title': info.get('title'),
            'duration': info.get('duration'),
            'uploader': info.get('uploader'),
            'view_count': info.get('view_count'),
            'like_count': info.get('like_count'),
            'description': info.get('description')[:500] if info.get('description') else '',
            'formats': [
                {
                    'format_id': f.get('format_id'),
                    'ext': f.get('ext'),
                    'resolution': f"{f.get('height', '?')}p",
                    'filesize': f.get('filesize'),
                    'vcodec': f.get('vcodec'),
                    'acodec': f.get('acodec'),
                }
                for f in info.get('formats', [])
                if f.get('height')  # Only video formats
            ]
        }

info = get_video_info("https://youtube.com/watch?v=dQw4w9WgXcQ")
print(json.dumps(info, indent=2))
```

### Playlist Downloader
```python
import yt_dlp
import os

class PlaylistDownloader:
    def __init__(self, output_dir="~/Downloads/Playlists"):
        self.output_dir = os.path.expanduser(output_dir)
    
    def download_playlist(self, url, quality="1080"):
        """Download an entire playlist with progress tracking."""
        ydl_opts = {
            'format': f'bestvideo[height<={quality}]+bestaudio/best[height<={quality}]',
            'outtmpl': f'{self.output_dir}/%(playlist_title)s/%(playlist_index)03d - %(title)s.%(ext)s',
            'merge_output_format': 'mp4',
            'ignoreerrors': True,  # Skip unavailable videos
            'continuedl': True,    # Resume partial downloads
            'progress_hooks': [self.progress_hook],
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    
    def progress_hook(self, d):
        """Track download progress."""
        if d['status'] == 'downloading':
            percent = d.get('_percent_str', '0%').strip()
            speed = d.get('_speed_str', '?').strip()
            print(f"Downloading: {percent} at {speed}", end='\r')
        elif d['status'] == 'finished':
            print(f"\n✓ Downloaded: {d['filename']}")

# Usage
dl = PlaylistDownloader()
dl.download_playlist("https://youtube.com/playlist?list=PLAYLIST_ID")
```

### Configuration Presets
```python
import yt_dlp

# Common configuration presets as reusable dictionaries

PRESETS = {
    'best': {
        'format': 'bestvideo+bestaudio/best',
        'merge_output_format': 'mp4',
        'embedmetadata': True,
        'embedthumbnail': True,
    },
    '1080p': {
        'format': 'bestvideo[height<=1080]+bestaudio/best[height<=1080]',
        'merge_output_format': 'mp4',
    },
    '720p': {
        'format': 'bestvideo[height<=720]+bestaudio/best[height<=720]',
        'merge_output_format': 'mp4',
    },
    'audio-only': {
        'format': 'bestaudio/best',
        'extract_audio': True,
        'audio_format': 'mp3',
        'audio_quality': 0,
        'postprocessor_args': {
            'ffmpeg': ['-id3v2_version', '3'],
        },
    },
    'mobile': {
        'format': 'worst[ext=mp4]',
        'outtmpl': '%(title)s_%(id)s.%(ext)s',
    },
}

def download_with_preset(url, preset_name='best'):
    """Download using a named preset."""
    if preset_name not in PRESETS:
        raise ValueError(f"Unknown preset: {preset_name}. Available: {list(PRESETS.keys())}")
    
    opts = PRESETS[preset_name].copy()
    opts['outtmpl'] = '~/Downloads/%(title)s.%(ext)s'
    
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])

# Usage
download_with_preset("https://youtube.com/watch?v=VIDEO_ID", "1080p")
```

---

## Quality Presets and Recipes

### Common One-Liners

```bash
# Best quality, embed metadata
alias yt-best='yt-dlp -f "bestvideo+bestaudio/best" --merge-output-format mp4 --embed-metadata --embed-thumbnail'

# 1080p with subtitles
alias yt-1080p='yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" --merge-output-format mp4 --write-subs --sub-langs en'

# Audio only (MP3 320kbps)
alias yt-audio='yt-dlp -x --audio-format mp3 --audio-quality 0 --embed-thumbnail'

# Playlist in order
alias yt-playlist='yt-dlp -f "bestvideo+bestaudio/best" -o "%(playlist)s/%(playlist_index)03d - %(title)s.%(ext)s"'

# Extract and organize by channel
alias yt-channel='yt-dlp -o "%(uploader)s/%(title)s.%(ext)s" --download-archive archive.txt'
```

### Configuration File
Create `~/.config/yt-dlp/config` for persistent options:

```text
# Default options for all downloads
-o ~/Downloads/YouTube/%(uploader)s/%(title)s.%(ext)s
--embed-metadata
--embed-thumbnail
--embed-chapters

# Prefer 1080p or best available
-f bestvideo[height<=1080]+bestaudio/best[height<=1080]

# Merge best formats
--merge-output-format mp4

# Retry settings
--retries 10
--fragment-retries 10
--continuedl

# Thumbnails
--write-thumbnail
```

### Download Only Audio
```bash
# Quick audio extraction
yt-dlp -x --audio-format mp3 --audio-quality 0 "URL"

# With metadata and cover art
yt-dlp -x --audio-format mp3 --audio-quality 0 \
  --embed-thumbnail --embed-metadata "URL"

# Best quality audio (opus format)
yt-dlp -f "bestaudio[ext=webm]/bestaudio" \
  --extract-audio --audio-format opus "URL"
```

---

## Skill Maturity Model

| Level | Coverage | Reliability | Automation | Maintenance |
|-------|----------|-------------|------------|-------------|
| **1: Basic** | Single video downloads | Manual, often fails | None | Never updated |
| **2: Functional** | Playlists + formats + subs | Mostly works | Basic archive file | Updated occasionally |
| **3: Efficient** | Batch + channels + cookies | Reliable with retries | Config file + aliases | Regular updates |
| **4: Automated** | Scheduled + archived + organized | Highly reliable | Cron jobs + scripts | Automated dependency updates |
| **5: Production** | Full pipeline + monitoring + library | Fault-tolerant | Full CI/CD pipeline | Always current |

**Target: Level 3** for personal use. **Level 4** for content archival. **Level 5** for media library management.

---

## Common Mistakes

1. **Not installing ffmpeg**: yt-dlp needs ffmpeg to merge separate video and audio streams. Without it, you'll get either video without audio or audio without video from DASH sources.
2. **Ignoring format codes**: Using `-f best` often gets you a suboptimal format. Always check available formats with `-F` first and use `bestvideo+bestaudio` for the best quality.
3. **Overly aggressive downloading**: Using too many concurrent fragments or no rate limiting can get your IP blocked. Add `--limit-rate` and reasonable delays.
4. **Storing passwords in command history**: Use `--cookies-from-browser` instead of `-u`/`-p`. Passwords in shell history are a security risk.
5. **No archive file for playlists**: Without `--download-archive`, re-running a playlist download will re-download everything. Always use an archive file for incremental updates.
6. **Downloading copyrighted content without permission**: Respect copyright laws and platform terms of service. Only download content you have rights to access offline.
7. **Using outdated yt-dlp**: Sites change their APIs frequently. Keep yt-dlp updated with `pip install -U yt-dlp` or your package manager.
8. **Not handling errors gracefully**: Use `--ignore-errors` for batch/playlist downloads and `--retries` to handle transient failures.
9. **Poor output template organization**: Without a good output template, files end up with unwieldy names in a flat directory. Use `%(playlist)s/%(uploader)s/` structure.
10. **Assuming all sites work the same**: Different sites have different extractors. Some need cookies, some need specific format strings, some don't support certain features. Test first.
