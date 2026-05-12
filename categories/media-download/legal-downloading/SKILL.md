---
name: legal-downloading
description: 'Legal Downloading: Copyright-aware downloading, content that allows offline access, podcast tools, and compliance best practices'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: media-download
  tags: [legal-downloading, copyright-compliance, offline-access, podcast-tools, fair-use]
---

# Legal Downloading

Download media legally and responsibly. This skill covers the legal landscape of media downloading — what's allowed, what's not, and how to build workflows that respect copyright while still getting the content you need offline.

## Core Principles

### 1. Copyright Is Not Optional
Copyright law protects creators' rights to control reproduction and distribution of their work. Downloading copyrighted content without permission is infringement in most jurisdictions, regardless of whether you're "just sharing" or "only for personal use."

### 2. Permission Comes in Many Forms
Not all downloading requires explicit permission. Look for:
- **Explicit permission**: Creative Commons, public domain, or direct creator authorization
- **Implied permission**: Platform download features, offline modes, RSS feeds
- **Statutory permission**: Fair use/fair dealing, time-shifting, format-shifting (jurisdiction-dependent)

### 3. Platform Terms Matter
Each platform has its own terms of service that govern what you can do with content. YouTube's Terms of Service prohibit downloading videos unless a download button or API is provided. Violating ToS isn't necessarily illegal, but it can get your account terminated.

### 4. Know Your Jurisdiction
Copyright law varies significantly by country. Fair use (US) is broader than fair dealing (UK, Canada, Australia). Private copying exceptions exist in some EU countries but not others. Know the laws that apply to you.

---

## Understanding Copyright and Fair Use

### What Copyright Protects
Copyright protects original works of authorship fixed in a tangible medium:
- **Audiovisual works**: Movies, TV shows, videos
- **Sound recordings**: Music, podcasts, audio books
- **Literary works**: Books, articles, code
- **Musical works**: Compositions, lyrics

Copyright grants the creator exclusive rights to:
- Reproduce the work
- Create derivative works
- Distribute copies
- Perform the work publicly
- Display the work publicly

### Fair Use (US Law)

Fair use is a legal doctrine that permits limited use of copyrighted material without permission. Courts evaluate four factors:

| Factor | Favors Fair Use | Against Fair Use |
|--------|----------------|------------------|
| **Purpose of use** | Education, research, criticism, news reporting, commentary | Commercial use, entertainment |
| **Nature of work** | Factual, published, non-fiction | Creative, unpublished, fiction |
| **Amount used** | Small portion, not the "heart" of the work | Large portion, entire work |
| **Market effect** | No harm to market, transformative | Replaces original, harms sales |

**Important**: Fair use is a defense, not a right. Only a court can definitively determine if a use is fair. There are no bright-line rules.

### Fair Dealing (UK, Canada, Australia)
Similar to fair use but more narrowly defined. Specific categories include:
- Research and private study
- Criticism and review
- News reporting
- Education
- Parody and satire

Canada's Copyright Act includes a specific exception for **format-shifting** (making copies for personal use) and **time-shifting** (recording broadcasts for later viewing).

### Private Copying Exceptions
Some countries allow limited private copying:
- **EU**: Article 5(2)(b) of the InfoSoc Directive allows member states to implement private copying exceptions
- **Germany**: Private copying is allowed with a levy on blank media
- **Japan**: Private copying is permitted for personal use
- **Australia**: Format-shifting for personal use is allowed

---

## Tools for Legal Downloading

### Spotify Offline Mode
```bash
# Spotify's official offline mode (requires Premium)
# 1. Open Spotify app
# 2. Go to playlist/album/podcast
# 3. Toggle "Download" switch
# 4. Content is available offline for 30 days
#    (must reconnect every 30 days to refresh)

# Maximum devices: 5 (10,000 songs per device on up to 5 devices)
# Audio quality: Up to 320kbps Ogg Vorbis (Premium)
```

### YouTube Music Offline
```bash
# YouTube Music Premium — official offline download
# 1. Open YouTube Music app
# 2. Search for music
# 3. Tap download icon next to song/album/playlist
# 4. Downloaded for 30 days (must reconnect to refresh)

# Downloads are encrypted and only playable in YouTube Music app
# Quality: Up to 256kbps AAC
```

### Netflix Downloads
```bash
# Netflix — official offline viewing
# Available on: Standard and Premium plans
# Steps:
# 1. Open Netflix app
# 2. Find movie or show
# 3. Tap download icon

# Limitations:
# - Expires after 48 hours to 30 days depending on title
# - Limited number of downloads per account (100 per device)
# - Some titles not available for download
# - Downloads are encrypted, app-only playback
```

### Amazon Prime Video Downloads
```bash
# Amazon Prime Video — official offline viewing
# Available on: Prime membership
# Steps:
# 1. Open Prime Video app
# 2. Find content
# 3. Tap download button

# Limitations:
# - Expiration varies by title
# - 25-30 titles can be stored per device
# - Some titles restricted to specific regions
# - Downloads are encrypted
```

---

## Podcast Downloading

Podcasts are one of the few content types where downloading is explicitly and universally permitted. RSS feeds are designed for open access and offline listening.

### Using gPodder
```bash
# Install gPodder
pip install gpodder

# Subscribe to a podcast
gpo add "https://feeds.simplecast.com/XXXXX"

# List subscriptions
gpo list

# Download all new episodes
gpo download

# Download specific podcast
gpo download "Podcast Name"

# Show download status
gpo status

# Update feeds and download new episodes
gpo update && gpo download
```

### Using PodcastIndex API
```python
import requests
import xml.etree.ElementTree as ET

class PodcastIndexClient:
    """
    Client for the PodcastIndex API — an open, decentralized podcast directory.
    Free to use with API key registration.
    """
    
    def __init__(self, api_key, api_secret):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = "https://api.podcastindex.org/api/1.0"
    
    def search(self, query, max_results=10):
        """Search for podcasts by name or topic."""
        headers = {
            'X-Auth-Key': self.api_key,
            'X-Auth-Secret': self.api_secret,
        }
        
        response = requests.get(
            f"{self.base_url}/search/byterm",
            params={'q': query, 'max': max_results},
            headers=headers
        )
        response.raise_for_status()
        
        return response.json().get('feeds', [])
    
    def get_episodes(self, feed_id, max_episodes=20):
        """Get episodes for a specific podcast feed."""
        headers = {
            'X-Auth-Key': self.api_key,
            'X-Auth-Secret': self.api_secret,
        }
        
        response = requests.get(
            f"{self.base_url}/episodes/byfeedid",
            params={'id': feed_id, 'max': max_episodes},
            headers=headers
        )
        response.raise_for_status()
        
        return response.json().get('items', [])
    
    def download_episode(self, episode_url, output_dir="~/Podcasts"):
        """Download a podcast episode."""
        import os
        from urllib.parse import urlparse
        
        output_dir = os.path.expanduser(output_dir)
        os.makedirs(output_dir, exist_ok=True)
        
        filename = os.path.basename(urlparse(episode_url).path)
        if not filename:
            filename = f"episode_{hash(episode_url)}.mp3"
        
        filepath = os.path.join(output_dir, filename)
        
        if os.path.exists(filepath):
            print(f"✓ Already downloaded: {filename}")
            return filepath
        
        print(f"↓ Downloading: {filename}")
        response = requests.get(episode_url, stream=True)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        print(f"✓ Saved: {filepath}")
        return filepath

# Usage
client = PodcastIndexClient(api_key="your_key", api_secret="your_secret")
results = client.search("science")
for feed in results:
    print(f"{feed['title']} — {feed.get('description', '')[:100]}")
```

### RSS Feed Downloader
```python
#!/usr/bin/env python3
"""Download podcasts from any valid RSS feed."""

import feedparser
import requests
import os
from datetime import datetime
from pathlib import Path

class PodcastDownloader:
    """
    Download podcast episodes from RSS feeds.
    Tracks what's been downloaded and handles incremental updates.
    """
    
    def __init__(self, output_dir="~/Podcasts"):
        self.output_dir = os.path.expanduser(output_dir)
        self.history_file = os.path.join(self.output_dir, ".download_history")
        self.downloaded = self._load_history()
    
    def _load_history(self):
        """Load download history from file."""
        if os.path.exists(self.history_file):
            with open(self.history_file, 'r') as f:
                return set(line.strip() for line in f if line.strip())
        return set()
    
    def _save_history(self):
        """Save download history to file."""
        os.makedirs(os.path.dirname(self.history_file), exist_ok=True)
        with open(self.history_file, 'w') as f:
            for guid in sorted(self.downloaded):
                f.write(f"{guid}\n")
    
    def download_feed(self, rss_url, max_episodes=10):
        """
        Download new episodes from an RSS feed.
        
        Args:
            rss_url: RSS feed URL
            max_episodes: Maximum episodes to download in this run
        """
        feed = feedparser.parse(rss_url)
        podcast_name = feed.feed.get('title', 'Unknown Podcast')
        
        podcast_dir = os.path.join(self.output_dir, podcast_name)
        os.makedirs(podcast_dir, exist_ok=True)
        
        new_count = 0
        for entry in feed.entries:
            if new_count >= max_episodes:
                break
            
            # Use guid or link as unique identifier
            guid = entry.get('id', entry.get('link', ''))
            if guid in self.downloaded:
                continue
            
            # Find audio enclosure
            audio_url = None
            for link in entry.get('links', []):
                if link.get('type', '').startswith('audio/'):
                    audio_url = link['href']
                    break
            
            if not audio_url:
                continue
            
            # Generate filename
            pub_date = entry.get('published_parsed')
            date_prefix = datetime(*pub_date[:6]).strftime('%Y-%m-%d') if pub_date else 'unknown'
            title = entry.get('title', 'untitled')
            safe_title = "".join(c for c in title if c.isalnum() or c in ' -_.,!?').rstrip()
            filename = f"{date_prefix} - {safe_title}.mp3"
            filepath = os.path.join(podcast_dir, filename)
            
            # Download
            print(f"↓ [{new_count+1}/{max_episodes}] {title}")
            try:
                response = requests.get(audio_url, stream=True, timeout=60)
                response.raise_for_status()
                
                with open(filepath, 'wb') as f:
                    for chunk in response.iter_content(8192):
                        if chunk:
                            f.write(chunk)
                
                self.downloaded.add(guid)
                new_count += 1
                print(f"  ✓ Saved: {filename}")
                
            except Exception as e:
                print(f"  ✗ Failed: {e}")
        
        self._save_history()
        print(f"\nDownloaded {new_count} new episodes from '{podcast_name}'")
        return new_count

# Usage
dl = PodcastDownloader()
dl.download_feed("https://feeds.simplecast.com/XXXXX")
```

---

## Public Domain and Creative Commons Content

### Sources of Free and Legal Content

#### Public Domain
Works in the public domain are free of copyright restrictions. You can download, modify, and share them freely.

| Source | URL | Content Type |
|--------|-----|-------------|
| **Internet Archive** | https://archive.org | Movies, music, books, software |
| **Project Gutenberg** | https://gutenberg.org | Books (70,000+) |
| **LibriVox** | https://librivox.org | Public domain audiobooks |
| **Wikimedia Commons** | https://commons.wikimedia.org | Images, audio, video |
| **Prelinger Archives** | https://archive.org/details/prelinger | Ephemeral films |
| **Musopen** | https://musopen.org | Classical music recordings |
| **Public Domain Review** | https://publicdomainreview.org | Curated public domain works |

#### Creative Commons
Creative Commons licenses let creators grant permissions in advance. Different CC licenses have different restrictions:

| License | Attribution Required | ShareAlike | NonCommercial | NoDerivatives |
|---------|---------------------|------------|---------------|---------------|
| **CC0** | No | No | No | No |
| **CC BY** | Yes | No | No | No |
| **CC BY-SA** | Yes | Yes | No | No |
| **CC BY-NC** | Yes | No | Yes | No |
| **CC BY-NC-SA** | Yes | Yes | Yes | No |
| **CC BY-ND** | Yes | No | No | Yes |
| **CC BY-NC-ND** | Yes | No | Yes | Yes |

### Searching for CC Content
```bash
# YouTube — filter by Creative Commons
# 1. Search on YouTube
# 2. Click "Filters" → "Features" → "Creative Commons"
# These videos have CC BY licenses

# Creative Commons Search
# https://search.creativecommons.org/
# Searches multiple platforms at once
```

### Internet Archive Downloading
```bash
# Download from Internet Archive via command line

# Install internetarchive
pip install internetarchive

# Search for items
ia search "subject:music AND collection:etree"

# Download an item
ia download <identifier>

# Download specific formats
ia download <identifier> --format=MP3

# Download with metadata
ia download <identifier> --metadata --glob="*mp3"

# List item details
ia metadata <identifier>
```

### Python: Internet Archive Downloader
```python
#!/usr/bin/env python3
"""Search and download from Internet Archive."""

import requests
import os
from urllib.parse import urljoin

class InternetArchiveDownloader:
    """Download public domain and CC-licensed content from archive.org."""
    
    BASE_URL = "https://archive.org"
    
    def search(self, query, media_types=['audio', 'video', 'movies']):
        """Search the Internet Archive."""
        params = {
            'q': query,
            'fl[]': ['identifier', 'title', 'description', 'downloads'],
            'sort[]': ['downloads desc'],
            'rows': 50,
            'page': 1,
            'output': 'json'
        }
        
        response = requests.get(
            f"{self.BASE_URL}/advancedsearch.php",
            params=params
        )
        response.raise_for_status()
        
        data = response.json()
        return data.get('response', {}).get('docs', [])
    
    def get_download_urls(self, identifier):
        """Get available download formats for an item."""
        response = requests.get(
            f"{self.BASE_URL}/details/{identifier}",
            params={'output': 'json'}
        )
        response.raise_for_status()
        
        data = response.json()
        files = data.get('files', [])
        
        downloads = []
        for f in files:
            name = f.get('name', '')
            source = f.get('source', '')
            format_type = f.get('format', '')
            
            # Skip metadata files
            if source == 'metadata':
                continue
            
            downloads.append({
                'name': name,
                'format': format_type,
                'size': f.get('size', 0),
                'url': f"{self.BASE_URL}/download/{identifier}/{name}"
            })
        
        return downloads
    
    def download(self, identifier, output_dir="~/Downloads/IA", 
                 formats=None, progress=True):
        """
        Download an item from the Internet Archive.
        
        Args:
            identifier: Archive.org identifier
            output_dir: Output directory
            formats: List of formats to download (None = all)
            progress: Show progress bar
        """
        import shutil
        
        output_dir = os.path.expanduser(output_dir)
        item_dir = os.path.join(output_dir, identifier)
        os.makedirs(item_dir, exist_ok=True)
        
        downloads = self.get_download_urls(identifier)
        
        if formats:
            downloads = [d for d in downloads if d['format'] in formats]
        
        print(f"Downloading {len(downloads)} files from '{identifier}'")
        
        for d in downloads:
            filepath = os.path.join(item_dir, d['name'])
            
            if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
                print(f"  ✓ Already exists: {d['name']}")
                continue
            
            print(f"  ↓ {d['name']} ({d['format']}, {self._format_size(d['size'])})")
            
            response = requests.get(d['url'], stream=True)
            response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                response.raw.decode_content = True
                shutil.copyfileobj(response.raw, f)
        
        print(f"✓ Download complete: {item_dir}")
    
    def _format_size(self, bytes_val):
        """Format file size for display."""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if bytes_val < 1024:
                return f"{bytes_val:.1f}{unit}"
            bytes_val /= 1024
        return f"{bytes_val:.1f}TB"

# Usage
ia = InternetArchiveDownloader()
results = ia.search("Beethoven Symphony")
for r in results[:5]:
    print(f"{r['title']} ({r.get('downloads', 0)} downloads)")
```

---

## YouTube Terms of Service Compliance

### What YouTube Allows
YouTube's Terms of Service explicitly prohibit downloading content unless a download button or API is provided on the platform.

**Allowed downloading methods:**
- **YouTube Premium**: Official offline downloads within the YouTube app
- **YouTube Music Premium**: Official offline music downloads
- **YouTube Download button**: For creators who enable it on their videos
- **YouTube Data API**: For metadata, not video files

**What's restricted:**
- Using third-party tools to download videos
- Circumventing YouTube's technical protection measures
- Downloading for redistribution
- Automated scraping at scale

### Content That Explicitly Allows Downloading
Some YouTube creators enable the download feature on their videos:
```bash
# Check if download is enabled (in YouTube API response)
# Look for: "downloadUrl" in video metadata

# YouTube's built-in download button
# Visible below video if creator enabled it
```

### Best Practices for YouTube Content
1. **Only download your own content**: You own the copyright to videos you created. Downloading your own uploads is always allowed.
2. **Download with creator permission**: If a creator explicitly says downloads are okay (in description, comments, or their website), you have permission.
3. **Use YouTube Premium**: For personal offline viewing, YouTube Premium is the authorized method.
4. **Download Creative Commons videos**: YouTube allows filtering by Creative Commons license. These videos have pre-granted permissions.
5. **Don't redistribute**: Even if you download, don't re-upload or share the files. Link to the original instead.
6. **Respect view counts**: Streaming contributes to creator revenue and analytics. When possible, stream rather than download.

---

## Checking Download Permissions

### License Detection Tool
```python
#!/usr/bin/env python3
"""Check if content is licensed for downloading."""

import requests
import re
from urllib.parse import urlparse

class LicenseChecker:
    """
    Check if content has explicit permission for downloading
    by analyzing license information, page metadata, and terms.
    """
    
    # Known open-license keywords
    OPEN_LICENSE_KEYWORDS = [
        'creative commons', 'public domain', 'cc0', 'cc by',
        'cc by-sa', 'cc by-nc', 'cc by-nc-sa', 'royalty-free',
        'royalty free', 'no copyright', 'copyright waived',
        'license-free', 'license free', 'open source music',
        'open source audio', 'podcast license', 'attribution only',
        'attribution 4.0', 'attribution 3.0', 'copyright free',
        'download permitted', 'free download', 'free to download',
    ]
    
    # Known restrictive keywords
    RESTRICTIVE_KEYWORDS = [
        'all rights reserved', 'copyright ©', '©', 'do not download',
        'no downloads allowed', 'download prohibited', 'copyright protected',
        'unauthorized distribution', 'not for redistribution',
        'streaming only', 'viewing only', 'personal use only',
    ]
    
    def check_url(self, url):
        """
        Check a URL for download permissions.
        
        Returns a dict with license info and confidence score.
        """
        domain = urlparse(url).netloc.lower()
        
        # Known platforms
        platform_check = self._check_platform(domain, url)
        if platform_check:
            return platform_check
        
        # Scrape page for license info
        try:
            response = requests.get(url, timeout=10, headers={
                'User-Agent': 'LicenseChecker/1.0'
            })
            
            text = response.text.lower()
            
            # Check for open licenses
            for keyword in self.OPEN_LICENSE_KEYWORDS:
                if keyword in text:
                    return {
                        'status': 'likely_allowed',
                        'reason': f"Found license keyword: '{keyword}'",
                        'confidence': 'medium',
                        'action': 'Check the specific license terms for restrictions'
                    }
            
            # Check for restrictive notices
            for keyword in self.RESTRICTIVE_KEYWORDS:
                if keyword in text:
                    return {
                        'status': 'likely_restricted',
                        'reason': f"Found restriction: '{keyword}'",
                        'confidence': 'medium',
                        'action': 'Assume downloading is not permitted without permission'
                    }
            
            # No clear license information
            return {
                'status': 'unknown',
                'reason': 'No clear license information found on page',
                'confidence': 'low',
                'action': 'Assume all rights reserved unless stated otherwise'
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'reason': f"Could not check: {e}",
                'confidence': 'none',
                'action': 'Assume all rights reserved'
            }
    
    def _check_platform(self, domain, url):
        """Check known platforms for their download policies."""
        platform_rules = {
            'archive.org': {
                'status': 'allowed',
                'reason': 'Internet Archive hosts public domain and CC-licensed content',
                'confidence': 'high',
                'action': 'Check individual item license before downloading'
            },
            'youtube.com': {
                'status': 'restricted',
                'reason': 'YouTube ToS prohibits downloading without official features',
                'confidence': 'high',
                'action': 'Use YouTube Premium for offline access, or check for CC license'
            },
            'vimeo.com': {
                'status': 'conditional',
                'reason': 'Some Vimeo videos have download buttons enabled by creators',
                'confidence': 'medium',
                'action': 'Check for download button or explicit license in description'
            },
            'soundcloud.com': {
                'status': 'conditional',
                'reason': 'Some tracks have download enabled by the artist',
                'confidence': 'medium',
                'action': 'Look for download button on the track page'
            },
            'bandcamp.com': {
                'status': 'usually_allowed',
                'reason': 'Bandcamp artists can enable downloads for purchases or free',
                'confidence': 'high',
                'action': 'Check if download is enabled on the album/track page'
            },
        }
        
        for key, info in platform_rules.items():
            if key in domain:
                return info
        
        return None

# Usage
checker = LicenseChecker()
result = checker.check_url("https://archive.org/details/someitem")
print(f"Status: {result['status']}")
print(f"Reason: {result['reason']}")
print(f"Action: {result['action']}")
```

---

## Attribution Requirements

### How to Give Proper Attribution
When using Creative Commons or other open-licensed content, proper attribution is both a legal requirement and good practice.

**The TASL Framework:**
- **T**itle: What is the work called?
- **A**uthor: Who created it?
- **S**ource: Where can it be found?
- **L**icense: What license is it under?

### Attribution Template
```text
"Title of Work" by Author Name is licensed under CC BY 4.0.
Source: https://example.com/work
```

### For Collections or Archives
```text
This collection includes:
- "Sunset Overdrive" by Jane Smith (CC BY-NC 4.0) — https://example.com/sunset
- "Urban Jazz" by Carlos Rivera (CC BY-SA 4.0) — https://example.com/jazz
- "Ocean Waves" from FreeSound.org (CC0) — via freesound.org/s/12345
```

### Automated License Tracking
```python
#!/usr/bin/env python3
"""Track licenses for downloaded content and generate attribution files."""

import json
import os
from datetime import datetime

class LicenseTracker:
    """
    Track licenses for downloaded media and generate README attribution files.
    """
    
    def __init__(self, archive_path="~/Media"):
        self.archive_path = os.path.expanduser(archive_path)
        self.license_file = os.path.join(self.archive_path, "LICENSES.json")
        self.attributions = self._load_attributions()
    
    def _load_attributions(self):
        """Load existing attribution data."""
        if os.path.exists(self.license_file):
            with open(self.license_file, 'r') as f:
                return json.load(f)
        return []
    
    def add_entry(self, title, author, source, license_type, 
                  file_path=None, notes=""):
        """Add a license entry for downloaded content."""
        entry = {
            'title': title,
            'author': author,
            'source': source,
            'license': license_type,
            'file_path': file_path,
            'date_downloaded': datetime.now().isoformat(),
            'notes': notes,
        }
        
        self.attributions.append(entry)
        self._save()
        
        print(f"✓ Added attribution: {title} by {author} ({license_type})")
    
    def _save(self):
        """Save attributions to file."""
        os.makedirs(os.path.dirname(self.license_file), exist_ok=True)
        with open(self.license_file, 'w') as f:
            json.dump(self.attributions, f, indent=2)
    
    def generate_readme(self, output_path=None):
        """Generate a README with all attributions."""
        if not output_path:
            output_path = os.path.join(self.archive_path, "ATTRIBUTIONS.md")
        
        lines = [
            "# Media Attributions\n",
            f"*Generated: {datetime.now().strftime('%Y-%m-%d')}*\n",
            f"Total entries: {len(self.attributions)}\n",
            "---\n",
            "## Licensed Content\n",
        ]
        
        # Group by license type
        by_license = {}
        for entry in self.attributions:
            license_type = entry['license']
            if license_type not in by_license:
                by_license[license_type] = []
            by_license[license_type].append(entry)
        
        for license_type, entries in by_license.items():
            lines.append(f"\n### {license_type}\n")
            for entry in entries:
                lines.append(
                    f'- **"{entry["title"]}"** by {entry["author"]} '
                    f'— [Source]({entry["source"]})'
                )
                if entry.get('notes'):
                    lines.append(f'  - *Note: {entry["notes"]}*')
                lines.append('')
        
        with open(output_path, 'w') as f:
            f.write('\n'.join(lines))
        
        print(f"✓ Generated: {output_path}")
        return output_path
    
    def search(self, query):
        """Search attribution records."""
        results = []
        query = query.lower()
        
        for entry in self.attributions:
            if (query in entry['title'].lower() or 
                query in entry['author'].lower() or 
                query in entry['license'].lower()):
                results.append(entry)
        
        return results

# Usage
tracker = LicenseTracker()
tracker.add_entry(
    title="Ambient Forest Sounds",
    author="Nature Recordings Collective",
    source="https://freesound.org/people/example/sounds/12345/",
    license_type="CC BY 4.0",
    notes="Used in relaxation video project"
)
tracker.generate_readme()
```

---

## Personal Use vs. Distribution

### What's Personal Use?
Personal use generally means:
- Watching/listening yourself
- Within your household
- Not publicly performing or displaying
- Not sharing files with others
- Not uploading to other platforms

### What Crosses the Line
These activities typically require additional permission:
- **Sharing files** with friends, family, or online
- **Uploading** to another platform or server
- **Public performance**: Playing in a business, event, or stream
- **Derivative works**: Editing, remixing, or sampling
- **Commercial use**: Using in a paid product or service
- **Sublicensing**: Allowing others to use the content

### Self-Audit Checklist
```markdown
## Download Legitimacy Self-Audit

### Before downloading, ask:
- [ ] Do I own the copyright to this content?
- [ ] Has the creator explicitly allowed downloading?
- [ ] Is this content under a Creative Commons or open license?
- [ ] Is this content in the public domain?
- [ ] Am I using a platform's official download feature?
- [ ] Is this a podcast available via RSS feed?

### If you answered NO to ALL of the above:
**Do not download without explicit permission.**

### If you answered YES to any:
- [ ] Am I downloading for personal use only?
- [ ] Will I refrain from redistributing this content?
- [ ] Will I give proper attribution if required?
- [ ] Am I complying with the specific license terms?
```

---

## Skill Maturity Model

| Level | Knowledge | Compliance | Tools | Practice |
|-------|-----------|------------|-------|----------|
| **1: Unaware** | No copyright understanding | Downloading anything | Any tool regardless of ToS | No attribution |
| **2: Informed** | Knows copyright basics | Avoids obvious infringement | Podcast apps, official download tools | Basic attribution |
| **3: Compliant** | Understands licenses | Only downloads permitted content | License checkers, CC search | Proper TASL attribution |
| **4: Advocate** | Deep license knowledge | Proactive compliance | Automated license tracking | Full license documentation |
| **5: Steward** | Legal nuance mastery | Educator + policy maker | License management systems | Community education |

**Target: Level 3** for everyday use. **Level 4** for content creators and curators. **Level 5** for organizations managing media at scale.

---

## Common Mistakes

1. **Assuming "for personal use" is always legal**: In many jurisdictions, personal use is not a blanket exception. Making copies — even for yourself — of copyrighted content without permission is still infringement in most countries.
2. **Confusing "free to access" with "free to download"**: Streaming content without paying doesn't mean downloading is allowed. YouTube is free to watch online but downloading is against their Terms of Service.
3. **Ignoring license differences**: Not all Creative Commons licenses are the same. CC BY-ND doesn't allow modifications. CC BY-NC prohibits commercial use. Read the specific license.
4. **Skipping attribution**: Many open-licensed works require attribution. Failing to provide it is a license violation. Use the TASL framework (Title, Author, Source, License).
5. **Redistributing downloaded content**: Downloading for personal use does not give you the right to share files with others. Each person should obtain content through legitimate channels.
6. **Using unofficial tools on restricted platforms**: Third-party downloaders for Netflix, Spotify, or YouTube Music almost certainly violate terms of service and may violate copyright law through circumvention of technical protection measures.
7. **Not checking jurisdiction-specific laws**: Fair use in the US is broader than fair dealing in the UK. What's legal in Germany may not be legal in Japan. Know your local copyright law.
8. **Ignoring platform download features**: Many platforms offer legitimate offline access (Spotify Premium, YouTube Premium, Netflix downloads). These are the authorized channels — use them first.
9. **Assuming podcasts are always okay**: While most podcasts explicitly allow downloading via RSS, some podcast content (like audiobooks or music podcasts) may have additional restrictions. Check the specific feed terms.
10. **Not documenting licenses**: When you download legally licensed content, keep records of the license terms and source. Years later, you won't remember where something came from or what you're allowed to do with it.
