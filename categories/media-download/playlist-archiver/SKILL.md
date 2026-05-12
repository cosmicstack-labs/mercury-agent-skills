---
name: playlist-archiver
description: 'Playlist Archiver: Backup playlists, archive channels, scheduled downloading, and offline media libraries'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: media-download
  tags: [playlist-archiver, playlist-backup, channel-archive, offline-media, scheduling]
---

# Playlist Archiver

Build reliable offline media archives from playlists and channels. This skill covers incremental downloading, archive management, scheduling, metadata extraction, and organizing large media collections that stay up-to-date automatically.

## Core Principles

### 1. Archival Is Not Just Downloading
An archive is a curated, organized, and verifiable collection. You need tracking (what was downloaded when), organization (consistent folder structure), and redundancy (backups of your archive).

### 2. Incremental Updates Are Essential
Re-downloading everything is wasteful and risks hitting rate limits. Use archive files to track what you already have and only fetch new content. This also makes resuming interrupted operations trivial.

### 3. Structure Before Scale
A good directory structure scales. Design your folder hierarchy before you have 10,000 files. Flat directories are unmanageable. Use metadata variables to organize logically.

### 4. Plan for Long-Term Maintenance
Archives are long-term commitments. Format choices today affect accessibility tomorrow. Favor open formats (MKV, FLAC, Opus) over proprietary ones. Document your archive structure.

---

## Playlist Downloading with yt-dlp

### Basic Playlist Operations
```bash
# Download entire playlist
yt-dlp "https://youtube.com/playlist?list=PLAYLIST_ID"

# Download with organized output
yt-dlp -o "%(playlist_title)s/%(playlist_index)03d - %(title)s.%(ext)s" "URL"

# Download range of videos
yt-dlp --playlist-start 5 --playlist-end 15 "PLAYLIST_URL"

# Download newest videos first
yt-dlp --playlist-reverse "PLAYLIST_URL"

# Limit total downloads
yt-dlp --max-downloads 50 "PLAYLIST_URL"
```

### Handling Mixed Quality
```bash
# Best quality within playlist
yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" \
  --merge-output-format mp4 \
  "PLAYLIST_URL"

# Consistent format across all videos
yt-dlp -f "bestvideo[ext=mp4][height<=720]+bestaudio[ext=m4a]/best[ext=mp4]" \
  "PLAYLIST_URL"
```

### Channel Archiving
```bash
# Archive all videos from a channel
yt-dlp -f "bestvideo+bestaudio/best" \
  -o "%(channel)s/%(title)s.%(ext)s" \
  --download-archive ~/archives/channel_archive.txt \
  "https://www.youtube.com/@ChannelName/videos"

# Archive only uploads (not shorts, not streams)
yt-dlp --match-filter "duration > 60 & !is_live & !is_shorts" \
  "https://www.youtube.com/@ChannelName/videos"
```

---

## Archive File Management

### Using --download-archive
```bash
# Create and maintain an archive file
yt-dlp --download-archive archive.txt "PLAYLIST_URL"

# Re-run skips already downloaded videos
yt-dlp --download-archive archive.txt "PLAYLIST_URL"  # Only downloads new ones

# Use a central archive file for all downloads
yt-dlp --download-archive ~/.yt-dlp/archive.txt "URL1"
yt-dlp --download-archive ~/.yt-dlp/archive.txt "URL2"
```

### Archive File Format
The archive file is a simple text file with one video ID per line:

```text
# yt-dlp archive file — one video ID per line
youtube dQw4w9WgXcQ
youtube 9bZkp7q19f0
youtube jNQXAC9IVRw
```

### Managing Multiple Archives
```bash
# Separate archives per source
yt-dlp --download-archive ~/archives/youtube.txt "YOUTUBE_URL"
yt-dlp --download-archive ~/archives/vimeo.txt "VIMEO_URL"
yt-dlp --download-archive ~/archives/twitch.txt "TWITCH_URL"

# Combined archive for everything
yt-dlp --download-archive ~/archives/all_sites.txt "URL1"
yt-dlp --download-archive ~/archives/all_sites.txt "URL2"

# Check archive status
wc -l ~/archives/*.txt
#   1423 youtube.txt
#    234 vimeo.txt
#     89 twitch.txt
#   1746 total
```

### Archive Analysis Script
```python
#!/usr/bin/env python3
"""Analyze yt-dlp archive files for statistics."""

import os
from collections import Counter
from datetime import datetime

def analyze_archive(archive_path):
    """Analyze a yt-dlp archive file and return statistics."""
    if not os.path.exists(archive_path):
        return {"error": "Archive file not found"}
    
    with open(archive_path, 'r') as f:
        lines = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    
    sites = Counter()
    for line in lines:
        site = line.split()[0] if ' ' in line else 'unknown'
        sites[site] += 1
    
    file_stat = os.stat(archive_path)
    
    return {
        'total_entries': len(lines),
        'sites': dict(sites.most_common()),
        'file_size': file_stat.st_size,
        'last_modified': datetime.fromtimestamp(file_stat.st_mtime).isoformat(),
    }

# Usage
stats = analyze_archive("~/archives/youtube.txt")
print(f"Total videos archived: {stats['total_entries']}")
print(f"Sites: {stats['sites']}")
print(f"Last updated: {stats['last_modified']}")
```

---

## Directory Structure Organization

### Recommended Folder Layouts

**By Channel/Playlist**:
```
~/Media/YouTube/
├── channel-archive.txt
├── Tech Channels/
│   ├── MKBHD/
│   │   ├── The M4 iPad Pro Review.mp4
│   │   └── Studio 3.0 Tour.mp4
│   └── Linus Tech Tips/
│       ├── I bought EVERY GPU.mp4
│       └── Server Room Tour.mp4
└── Music/
    ├── Chill Vibes Playlist/
    │   ├── 001 - Lo-fi Beats.mp4
    │   └── 002 - Jazz Relaxation.mp4
    └── Workout Mix/
        ├── 001 - Pump Up.mp4
        └── 002 - High Energy.mp4
```

**By Date**:
```
~/Archives/
├── 2024/
│   ├── 01-January/
│   ├── 02-February/
│   └── ...
└── 2025/
    └── ...
```

### Output Template Patterns
```bash
# By channel, then by date
yt-dlp -o "%(channel)s/%(upload_date>%Y-%m-%d)s - %(title)s.%(ext)s" "URL"

# By playlist, indexed
yt-dlp -o "%(playlist_title)s/%(playlist_index)03d - %(title)s.%(ext)s" "URL"

# By uploader, with ID for deduplication
yt-dlp -o "%(uploader)s/%(id)s - %(title)s.%(ext)s" "URL"

# Flat with metadata in filename
yt-dlp -o "%(channel)s - %(title)s [%(id)s].%(ext)s" "URL"
```

### Automatic Organization Script
```python
#!/usr/bin/env python3
"""Organize downloaded media into structured directories."""

import os
import shutil
import json
import re
from pathlib import Path

class MediaOrganizer:
    def __init__(self, download_dir="~/Downloads", archive_root="~/Media"):
        self.download_dir = os.path.expanduser(download_dir)
        self.archive_root = os.path.expanduser(archive_root)
    
    def organize_file(self, filepath, info_json_path=None):
        """
        Organize a media file based on its metadata.
        
        Args:
            filepath: Path to the media file
            info_json_path: Path to yt-dlp info JSON (optional)
        """
        filename = os.path.basename(filepath)
        
        if info_json_path and os.path.exists(info_json_path):
            with open(info_json_path, 'r') as f:
                info = json.load(f)
            
            channel = self._sanitize(info.get('channel', info.get('uploader', 'Unknown')))
            playlist = self._sanitize(info.get('playlist_title', '_Singles'))
            upload_date = info.get('upload_date', 'unknown')
            year = upload_date[:4] if upload_date != 'unknown' else 'unknown'
            
            dest_dir = os.path.join(
                self.archive_root,
                channel,
                year,
                playlist
            )
        else:
            dest_dir = os.path.join(self.archive_root, 'Unsorted')
        
        os.makedirs(dest_dir, exist_ok=True)
        dest_path = os.path.join(dest_dir, filename)
        
        if os.path.exists(dest_path):
            print(f"⚠ Already exists: {filename}")
            return
        
        shutil.move(filepath, dest_path)
        print(f"✓ Moved: {filename} → {os.path.relpath(dest_path, self.archive_root)}")
    
    def _sanitize(self, name):
        """Remove characters unsuitable for directory names."""
        return re.sub(r'[<>:"/\\|?*]', '_', name)[:200]

# Usage
organizer = MediaOrganizer()
organizer.organize_file("~/Downloads/The Best Video Ever.mp4")
```

---

## Incremental Updates and Scheduling

### Shell Script for Regular Updates
```bash
#!/bin/bash
# ~/scripts/update_archives.sh — Run daily to update all archives

ARCHIVE_DIR="$HOME/archives"
MEDIA_DIR="$HOME/Media"
LOG_DIR="$HOME/logs"
DATE=$(date +%Y-%m-%d)

mkdir -p "$LOG_DIR"

# Function to update a playlist
update_playlist() {
    local name="$1"
    local url="$2"
    local archive="$ARCHIVE_DIR/${name}.txt"
    local output="$MEDIA_DIR/${name}/%(playlist_index)03d - %(title)s.%(ext)s"
    
    echo "[$DATE] Updating $name..." | tee -a "$LOG_DIR/archive.log"
    
    yt-dlp \
        -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" \
        --merge-output-format mp4 \
        --download-archive "$archive" \
        -o "$output" \
        --ignore-errors \
        --no-warnings \
        --sleep-interval 5 \
        --max-sleep-interval 15 \
        "$url" >> "$LOG_DIR/archive.log" 2>&1
    
    echo "[$DATE] $name complete" | tee -a "$LOG_DIR/archive.log"
}

# Update all subscribed channels and playlists
update_playlist "tech-mkbhd" "https://www.youtube.com/@MKBHD/videos"
update_playlist "tech-ltt" "https://www.youtube.com/@LinusTechTips/videos"
update_playlist "music-chill" "https://youtube.com/playlist?list=PLAYLIST_ID"
update_playlist "tutorials" "https://youtube.com/playlist?list=ANOTHER_PLAYLIST"

echo "[$DATE] All archives updated successfully" | tee -a "$LOG_DIR/archive.log"
```

### Cron Job Configuration
```bash
# Edit crontab
crontab -e

# Run archive update daily at 3 AM
0 3 * * * $HOME/scripts/update_archives.sh

# Run weekly archive verification every Sunday at 4 AM
0 4 * * 0 $HOME/scripts/verify_archive.sh

# Run monthly cleanup every 1st at 5 AM
0 5 1 * * $HOME/scripts/cleanup_archives.sh
```

### Systemd Service for Archiving
```ini
# ~/.config/systemd/user/media-archive.service
[Unit]
Description=Media Archive Update Service
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=%h/scripts/update_archives.sh
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
```

```ini
# ~/.config/systemd/user/media-archive.timer
[Unit]
Description=Daily Media Archive Update Timer

[Timer]
OnCalendar=daily
Persistent=true
RandomizedDelaySec=1h

[Install]
WantedBy=timers.target
```

```bash
# Enable the timer
systemctl --user daemon-reload
systemctl --user enable media-archive.timer
systemctl --user start media-archive.timer

# Check status
systemctl --user status media-archive.timer
systemctl --user list-timers
```

---

## Metadata Export and Extraction

### Export Playlist Metadata to JSON
```bash
# Extract playlist info without downloading
yt-dlp --flat-playlist --dump-json "PLAYLIST_URL" > playlist_metadata.json

# Extract with full video details
yt-dlp --dump-json "PLAYLIST_URL" > full_metadata.json
```

### Export to CSV
```bash
# Extract playlist info to CSV using jq
yt-dlp --flat-playlist --dump-json "PLAYLIST_URL" | \
  jq -r '[.id, .title, .duration, .view_count, .upload_date] | @csv' > playlist.csv

# With headers
echo "id,title,duration,views,upload_date" > playlist.csv
yt-dlp --flat-playlist --dump-json "PLAYLIST_URL" | \
  jq -r '[.id, .title, .duration, .view_count, .upload_date] | @csv' >> playlist.csv
```

### Python Metadata Processor
```python
#!/usr/bin/env python3
"""Extract and process playlist metadata into structured formats."""

import json
import csv
import subprocess
from datetime import datetime

class PlaylistMetadataExtractor:
    def __init__(self):
        self.data = []
    
    def extract(self, url, flat=True):
        """Extract metadata from a playlist URL."""
        cmd = [
            'yt-dlp', '--dump-json',
            '--flat-playlist' if flat else '--no-flat-playlist',
            '--ignore-errors',
            url
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        self.data = []
        for line in result.stdout.strip().split('\n'):
            if line:
                self.data.append(json.loads(line))
        
        return self
    
    def to_csv(self, output_path, fields=None):
        """Export metadata as CSV."""
        if not fields:
            fields = ['id', 'title', 'duration', 'view_count', 
                     'like_count', 'upload_date', 'channel']
        
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fields)
            writer.writeheader()
            
            for item in self.data:
                row = {field: item.get(field, '') for field in fields}
                writer.writerow(row)
        
        print(f"✓ Exported {len(self.data)} entries to {output_path}")
    
    def summary(self):
        """Print a summary of the playlist."""
        if not self.data:
            print("No data extracted.")
            return
        
        total_duration = sum(item.get('duration', 0) or 0 for item in self.data)
        total_views = sum(item.get('view_count', 0) or 0 for item in self.data)
        
        print(f"Total videos: {len(self.data)}")
        print(f"Total duration: {total_duration // 3600}h {(total_duration % 3600) // 60}m")
        print(f"Total views: {total_views:,}")
        
        # Earliest and latest
        dates = [item.get('upload_date') for item in self.data if item.get('upload_date')]
        if dates:
            print(f"Date range: {min(dates)} to {max(dates)}")

# Usage
extractor = PlaylistMetadataExtractor()
extractor.extract("https://youtube.com/playlist?list=PLAYLIST_ID")
extractor.summary()
extractor.to_csv("playlist_export.csv")
```

---

## Disk Usage Management

### Monitor Archive Size
```bash
# Check directory sizes
du -sh ~/Media/*
du -sh ~/Media/*/* | sort -rh | head -10

# Total archive size
du -sh ~/Media

# File count
find ~/Media -type f | wc -l

# Largest files
find ~/Media -type f -exec ls -lhS {} \; | head -10
```

### Quota Management Script
```python
#!/usr/bin/env python3
"""Monitor disk usage and alert when approaching limits."""

import os
import shutil
import smtplib
from pathlib import Path

class DiskUsageMonitor:
    def __init__(self, archive_path="~/Media", warning_gb=50, critical_gb=20):
        self.archive_path = os.path.expanduser(archive_path)
        self.warning_gb = warning_gb
        self.critical_gb = critical_gb
    
    def check_usage(self):
        """Check disk usage and return status."""
        usage = shutil.disk_usage(self.archive_path)
        
        total_gb = usage.total / (1024**3)
        used_gb = usage.used / (1024**3)
        free_gb = usage.free / (1024**3)
        percent = (usage.used / usage.total) * 100
        
        status = {
            'total_gb': round(total_gb, 1),
            'used_gb': round(used_gb, 1),
            'free_gb': round(free_gb, 1),
            'percent': round(percent, 1),
            'archive_size_gb': round(self._get_dir_size(self.archive_path), 1),
            'alerts': []
        }
        
        if free_gb < self.critical_gb:
            status['alerts'].append(f"CRITICAL: Only {free_gb}GB free!")
        elif free_gb < self.warning_gb:
            status['alerts'].append(f"WARNING: Only {free_gb}GB free")
        
        return status
    
    def _get_dir_size(self, path):
        """Calculate directory size recursively."""
        total = 0
        for entry in os.scandir(path):
            if entry.is_file():
                total += entry.stat().st_size
            elif entry.is_dir():
                total += self._get_dir_size(entry.path)
        return total
    
    def find_old_media(self, days=90):
        """Find media files not accessed in N days."""
        cutoff = time.time() - (days * 86400)
        old_files = []
        
        for path in Path(self.archive_path).rglob('*'):
            if path.is_file() and path.stat().st_atime < cutoff:
                old_files.append(path)
        
        return sorted(old_files, key=lambda p: p.stat().st_atime)

# Usage
monitor = DiskUsageMonitor()
status = monitor.check_usage()
print(f"Archive: {status['archive_size_gb']}GB / {status['used_gb']}GB used")
for alert in status['alerts']:
    print(f"⚠ {alert}")
```

---

## Database-Backed Media Library

### SQLite Media Catalog
```python
#!/usr/bin/env python3
"""Maintain a searchable SQLite database of your media archive."""

import sqlite3
import json
import subprocess
from datetime import datetime

class MediaLibrary:
    def __init__(self, db_path="~/.media_library.db"):
        self.db_path = os.path.expanduser(db_path)
        self._init_db()
    
    def _init_db(self):
        """Initialize the database schema."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.executescript('''
            CREATE TABLE IF NOT EXISTS media (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                url TEXT,
                channel TEXT,
                playlist TEXT,
                duration INTEGER,
                upload_date TEXT,
                file_path TEXT,
                file_size INTEGER,
                format TEXT,
                resolution TEXT,
                date_added TIMESTAMP,
                last_played TIMESTAMP,
                tags TEXT
            );
            
            CREATE TABLE IF NOT EXISTS playlists (
                id TEXT PRIMARY KEY,
                title TEXT,
                url TEXT,
                channel TEXT,
                last_updated TIMESTAMP,
                video_count INTEGER
            );
            
            CREATE TABLE IF NOT EXISTS tags (
                name TEXT PRIMARY KEY,
                color TEXT
            );
            
            CREATE INDEX IF NOT EXISTS idx_media_channel ON media(channel);
            CREATE INDEX IF NOT EXISTS idx_media_title ON media(title);
            CREATE INDEX IF NOT EXISTS idx_media_upload_date ON media(upload_date);
        ''')
        
        conn.commit()
        conn.close()
    
    def add_video(self, info):
        """Add or update a video in the library."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO media 
            (id, title, url, channel, playlist, duration, upload_date, 
             file_path, file_size, format, resolution, date_added)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            info.get('id'),
            info.get('title'),
            info.get('webpage_url'),
            info.get('channel', info.get('uploader')),
            info.get('playlist_title'),
            info.get('duration'),
            info.get('upload_date'),
            info.get('_filename'),
            info.get('filesize'),
            info.get('ext'),
            f"{info.get('height', '?')}p",
            datetime.now().isoformat()
        ))
        
        conn.commit()
        conn.close()
    
    def search(self, query, limit=20):
        """Search the media library."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT title, channel, duration, upload_date, file_path
            FROM media
            WHERE title LIKE ? OR channel LIKE ?
            ORDER BY upload_date DESC
            LIMIT ?
        ''', (f'%{query}%', f'%{query}%', limit))
        
        results = cursor.fetchall()
        conn.close()
        return results
    
    def stats(self):
        """Get library statistics."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) FROM media')
        total = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(DISTINCT channel) FROM media')
        channels = cursor.fetchone()[0]
        
        cursor.execute('SELECT SUM(duration) FROM media')
        total_duration = cursor.fetchone()[0] or 0
        
        cursor.execute('SELECT channel, COUNT(*) as c FROM media GROUP BY channel ORDER BY c DESC LIMIT 10')
        top_channels = cursor.fetchall()
        
        conn.close()
        
        return {
            'total_videos': total,
            'total_channels': channels,
            'total_duration_hours': round(total_duration / 3600, 1),
            'top_channels': top_channels
        }

# Usage
library = MediaLibrary()
library.add_video({'id': 'dQw4w9WgXcQ', 'title': 'Never Gonna Give You Up', ...})
results = library.search('tutorial')
print(library.stats())
```

---

## Deduplication

### Finding Duplicates
```bash
# Find duplicate files by name
find ~/Media -type f -printf '%f\n' | sort | uniq -d

# Find duplicates by size
find ~/Media -type f -printf '%s %p\n' | sort | uniq -D -w 20

# Using fdupes
fdupes -r ~/Media
fdupes -r -dN ~/Media  # Delete duplicates automatically
```

### Python Deduplication Script
```python
#!/usr/bin/env python3
"""Find and handle duplicate media files."""

import os
import hashlib
from collections import defaultdict
from pathlib import Path

def find_duplicates(root_dir):
    """Find duplicate files based on content hash."""
    hashes = defaultdict(list)
    
    for filepath in Path(root_dir).rglob('*'):
        if not filepath.is_file():
            continue
        
        # Skip small files (likely not media)
        size = filepath.stat().st_size
        if size < 1024 * 1024:  # < 1MB
            continue
        
        # Compute hash of first and last 64KB for speed
        with open(filepath, 'rb') as f:
            first = f.read(65536)
            f.seek(-65536, os.SEEK_END)
            last = f.read(65536)
        
        content_hash = hashlib.md5(first + last).hexdigest()
        hashes[content_hash].append(str(filepath))
    
    # Return only true duplicates (more than one file with same hash)
    return {h: paths for h, paths in hashes.items() if len(paths) > 1}

# Usage
duplicates = find_duplicates("~/Media")
for hash_val, paths in duplicates.items():
    print(f"\nDuplicate ({len(paths)} copies):")
    for p in paths:
        print(f"  {p}")
```

---

## Skill Maturity Model

| Level | Coverage | Reliability | Organization | Automation |
|-------|----------|-------------|--------------|------------|
| **1: Manual** | One-off playlists | Unreliable, no retries | Flat directory | None |
| **2: Tracked** | Archive files, playlist IDs | Retries enabled | By channel | Occasional scripts |
| **3: Structured** | Multiple playlists + channels | Reliable with error handling | Nested directories | Cron jobs |
| **4: Automated** | All subscriptions, scheduled | Fault-tolerant | Metadata indexed | systemd timers + alerts |
| **5: Library** | Full archive with search + dedup | Self-healing | Database-backed + searchable | Full CI/CD + monitoring |

**Target: Level 3** for personal archives. **Level 4** for content curation at scale. **Level 5** for media library management systems.

---

## Common Mistakes

1. **No archive file from the start**: Starting an archive without `--download-archive` means you can't resume or do incremental updates. Add it on day one — it's a single flag that saves terabytes of re-downloads.
2. **Flat directory structure**: Thousands of files in one directory is impossible to navigate. Use hierarchical structures: channel/year/playlist or uploader/category/.
3. **Ignoring error handling**: One unavailable video can crash a batch job. Use `--ignore-errors` for playlist downloads and `--retries` for transient failures.
4. **Running downloads during peak hours**: Sites rate-limit more aggressively during peak times. Schedule large archives for off-peak hours (early morning).
5. **No disk space monitoring**: Archives grow silently. Set up disk usage alerts before you run out of space mid-download.
6. **Using inconsistent naming**: Switching naming conventions mid-archive creates a mess. Decide on a template and stick with it forever.
7. **Not verifying downloads**: A "successful" download doesn't mean playable media. Periodically verify archive integrity with `ffprobe` or similar tools.
8. **Forgetting about metadata**: Without a metadata sidecar (info JSON), you lose all context about your archive. Always use `--write-info-json`.
9. **No backup strategy**: An archive on a single drive is one failure away from being lost. Follow the 3-2-1 backup rule (3 copies, 2 media types, 1 offsite).
10. **Over-aggressive scheduling**: Downloading too frequently or with too many concurrent jobs can get you rate-limited or banned. Use `--sleep-interval` and reasonable intervals.
