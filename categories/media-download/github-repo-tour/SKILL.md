---
name: github-repo-tour
description: 'Generate a 15-30 second scrolling video tour of any GitHub repository page with ElevenLabs AI narration and word-by-word subtitle sync. Captures a full-page mobile-viewport screenshot, scrolls top-to-bottom with GSAP, and burns synced subtitles onto the final MP4 using HyperFrames CLI.'
metadata:
  author: hotheadhacker
  version: 1.0.0
  category: media-download
  tags:
    - hyperframes
    - video-generation
    - github
    - scrolling
    - subtitles
    - caption
    - elevenlabs
    - voiceover
    - instagram-reels
    - tts
---

# GitHub Repo Tour — Scrolling Video with Synced Narration & Subtitles

> **Depends on:** [website-to-hyperframes](https://github.com/heygen-com/hyperframes/blob/main/skills/website-to-hyperframes/SKILL.md) — load it before starting. Its 6-step workflow and reference files apply here. This skill specializes that workflow for single-page scrolling tours with narration and visible subtitles.

---

## What This Skill Produces

A **1080x1920 portrait video** (Instagram Reels format) that:

1. **Shows a GitHub repository page** — full-page mobile screenshot, scrolling smoothly from top to bottom over 15–30 seconds.
2. **Narrates the tour** — ElevenLabs AI voice describing what's on screen, synced to the scroll position.
3. **Burns subtitles on screen** — word-by-word caption overlay that highlights each word as the narrator speaks it. The viewer reads along while listening.
4. **Ends with a CTA** — "Star on GitHub" or "Follow for more" call to action.

## Core Decisions

| Decision | Value | Why |
|----------|-------|-----|
| **Dimensions** | **1080x1920** | Instagram Reels primary format |
| **Duration** | **15–30 seconds** | Sweet spot for Shorts/Reels engagement |
| **Narration** | **Drives timing** | Scroll speed, beat durations, and subtitle timing all derive from the audio |
| **Subtitles** | **Word-by-word highlight** | Each word lights up as the narrator says it — Karaoke-style captions |
| **Phone viewport** | **Full-screen scroll, no bezel** | The GitHub page fills the entire 1080x1920 canvas |
| **Output folder** | `github-promos/<repo>-tour/` | Sibling to github-repo-promo projects |

---

## Directory Structure

```
github-promos/
  <repo>-tour/
    index.html              ← main HyperFrames composition
    package.json            ← from hyperframes init
    hyperframes.config.json ← HyperFrames config
    SCRIPT.md               ← narration script with timestamps
    assets/
      repo-page.png         ← Full-page GitHub screenshot (dark mode, mobile viewport)
      narration.mp3         ← ElevenLabs voiceover
    renders/                ← generated MP4s
```

---

## Workflow

### Step 0: Capture Repo Info & Screenshot

Use `web-search` or `fetch_url` to get repo metadata:
- Stars, forks, watchers, open issues
- Primary language, description, topics
- README summary (what the project does, key features)

Then use the `screenshot` skill to capture a **full-page, dark-mode, mobile-viewport screenshot**:

```
use_skill("screenshot")
// URL: https://github.com/{owner}/{repo}
// Full page, dark mode
// Viewport: 390px wide (iPhone 14 mobile) — the screenshot should
//   capture the full height of the page at mobile width
// Save as: github-promos/<repo>-tour/assets/repo-page.png
```

Get the screenshot dimensions (you need the pixel height for scroll math):

```bash
sips -g pixelHeight github-promos/<repo>-tour/assets/repo-page.png
sips -g pixelWidth github-promos/<repo>-tour/assets/repo-page.png
```

### Step 1: Write the Narration Script

Write a 15–30 second script that **describes what the viewer sees as the scroll progresses**. The narrator walks the viewer through the page:

```
[0s–4s]  "This is {repo}. {one-liner description}."
[4s–8s]  "Here's the README — installation is one command."
[8s–13s] "Scrolling through the feature list — {mention 2-3 visible features}."
[13s–18s] "{stars} stars, {forks} forks, and a growing community."
[18s–23s] "Star it on GitHub. Link in bio."
[23s–25s] "Follow for more."
```

**Rules for the script:**
- The narrator references what's **currently on screen** at each scroll position.
- Total word count: 50–75 words (comfortable pace for 15–30 seconds).
- No filler ("um", "uh", "let me show you"). Every word earns its place.
- End with a clear CTA.

### Step 2: Generate Voiceover via ElevenLabs

```bash
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/AZnzlk1XvdvUeBnXmlld" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "FULL_SCRIPT_HERE",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.35,
      "similarity_boost": 0.8,
      "style": 0.25,
      "use_speaker_boost": true
    }
  }' \
  --output github-promos/<repo>-tour/assets/narration.mp3
```

Verify the file exists and has size > 0.

### Step 3: Transcribe & Time-Map

After generating audio, extract word-level timestamps:

**Option A: ElevenLabs timestamps** (returned with the API response if `output_format: "mp3"` is not the only output — check the API docs for `aligned` output).

**Option B: Use `ffmpeg` + Whisper** (local transcription with word timestamps):

```bash
# Install whisper if needed
pip install openai-whisper

# Transcribe with word timestamps
whisper github-promos/<repo>-tour/assets/narration.mp3 \
  --model base \
  --output_format json \
  --output_dir github-promos/<repo>-tour/assets/ \
  --word_timestamps True
```

The output gives you `words[]` with `start` and `end` timestamps for each word. Map these timestamps to the scroll positions.

### Step 4: Build the HyperFrames Composition

Create `index.html` following the HyperFrames composition architecture:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1080,height=1920"/>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  /* ── Root & Canvas ── */
  * { margin: 0; padding: 0; box-sizing: border-box; }
  #root {
    position: relative;
    width: 1080px;
    height: 1920px;
    background: #0d1117;
    font-family: 'Inter', sans-serif;
    overflow: hidden;
  }

  /* ── Scrolling Screenshot ── */
  .scroll-container {
    position: absolute;
    inset: 0;
    width: 1080px;
    height: 1920px;
    overflow: hidden;
  }
  .scroll-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 1080px;
    height: VAR_IMG_H px;   /* actual screenshot height */
  }

  /* ── Subtitle Overlay ── */
  .subtitle-bar {
    position: absolute;
    bottom: 180px;
    left: 50%;
    transform: translateX(-50%);
    width: 1000px;
    text-align: center;
    z-index: 100;
  }
  .subtitle-word {
    display: inline-block;
    font-size: 42px;
    font-weight: 700;
    color: rgba(255,255,255,0.35);
    padding: 0 4px;
    transition: color 0.08s, transform 0.08s;
  }
  .subtitle-word.active {
    color: #FFFFFF;
    transform: scale(1.08);
  }
  .subtitle-word.past {
    color: rgba(255,255,255,0.65);
  }

  /* ── Scroll Progress Bar ── */
  .scroll-progress-track {
    position: absolute;
    right: 16px;
    top: 100px;
    width: 5px;
    height: 1720px;
    border-radius: 3px;
    background: rgba(255,255,255,0.1);
    z-index: 50;
  }
  .scroll-progress-thumb {
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: VAR_THUMB_H px;
    border-radius: 3px;
    background: linear-gradient(180deg, #58a6ff, #3fb950);
    z-index: 51;
  }

  /* ── CTA Overlay (Beat 6-7) ── */
  .cta-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(13,17,23,0.92);
    backdrop-filter: blur(8px);
    z-index: 200;
    opacity: 0;
  }
  .cta-title {
    font-size: 56px;
    font-weight: 800;
    color: #e6edf3;
    text-align: center;
  }
  .cta-subtitle {
    font-size: 32px;
    color: #8b949e;
    margin-top: 16px;
  }
  .cta-button {
    margin-top: 40px;
    padding: 18px 48px;
    background: #238636;
    color: #e6edf3;
    font-size: 28px;
    font-weight: 700;
    border-radius: 999px;
    box-shadow: 0 0 30px rgba(35,134,54,0.5);
  }
  .follow-pill {
    margin-top: 24px;
    padding: 12px 28px;
    background: rgba(22,27,34,0.8);
    border: 1px solid #30363d;
    border-radius: 999px;
    font-size: 22px;
    color: #e6edf3;
    font-weight: 600;
  }
</style>
</head>
<body>
<div id="root"
  data-composition-id="{repo}-tour"
  data-width="1080"
  data-height="1920"
  data-start="0"
  data-duration="{total_seconds}">

  <audio id="narration-audio"
    src="assets/narration.mp3"
    data-start="0"
    data-duration="{total_seconds}"
    preload="auto"></audio>

  <!-- Scrolling screenshot (full-canvas) -->
  <div class="scroll-container">
    <img class="scroll-content" src="assets/repo-page.png" />
  </div>

  <!-- Scroll progress bar -->
  <div class="scroll-progress-track">
    <div class="scroll-progress-thumb" id="scroll-thumb"></div>
  </div>

  <!-- Subtitle overlay -->
  <div class="subtitle-bar" id="subtitle-bar">
    <!-- Words injected by JS, one <span class="subtitle-word"> per word -->
  </div>

  <!-- CTA overlay (final 5s) -->
  <div class="cta-overlay" id="cta-overlay">
    <div class="cta-title">Star on GitHub</div>
    <div class="cta-subtitle">{repo description}</div>
    <div class="cta-button">github.com/{owner}/{repo}</div>
    <div class="follow-pill">@githubprojects</div>
  </div>
</div>

<script>
// ── Scroll Math ──────────────────────────────────────────
var IMG_H = /* actual screenshot height */;
var CANVAS_H = 1920;
var MAX_SCROLL = IMG_H - CANVAS_H;
var THUMB_TRACK = 1720;
var THUMB_H = Math.round(THUMB_TRACK * (CANVAS_H / IMG_H));
var THUMB_TRAVEL = THUMB_TRACK - THUMB_H;

function thumbTop(scrollY) {
  return (Math.abs(scrollY) / MAX_SCROLL) * THUMB_TRAVEL;
}

// ── Word Timestamps ─────────────────────────────────────
// Paste the word-level timestamps from Step 3 here.
// Format: [word, startSeconds, endSeconds]
var WORDS = [
  // ["This", 0.0, 0.3],
  // ["is", 0.3, 0.5],
  // ["mercury-skills", 0.5, 1.0],
  // ...
];

var TOTAL_DURATION = /* total seconds from audio */;

// ── Build Subtitle Spans ────────────────────────────────
var subtitleBar = document.getElementById("subtitle-bar");
var wordSpans = [];
WORDS.forEach(function(w, i) {
  var span = document.createElement("span");
  span.className = "subtitle-word";
  span.textContent = w[0];
  subtitleBar.appendChild(span);
  wordSpans.push(span);
});

// ── GSAP Timeline ───────────────────────────────────────
window.__timelines = window.__timelines || {};
var tl = gsap.timeline({paused: true});

// Phase 1: Scroll (0s to ~80% of total duration)
var scrollEnd = TOTAL_DURATION * 0.80;
var ctaStart = TOTAL_DURATION * 0.80;

// Scroll from top to bottom with easing
tl.to(".scroll-content", {
  y: -MAX_SCROLL,
  duration: scrollEnd,
  ease: "none",
  onUpdate: function() {
    var progress = this.progress();
    var thumbTop = progress * THUMB_TRAVEL;
    gsap.set("#scroll-thumb", { top: thumbTop });
  }
}, 0);

// Phase 2: Word-by-word subtitle highlighting
var currentWordIndex = -1;
WORDS.forEach(function(w, i) {
  tl.call(function() {
    // Deactivate previous word
    if (currentWordIndex >= 0 && wordSpans[currentWordIndex]) {
      wordSpans[currentWordIndex].classList.remove("active");
      wordSpans[currentWordIndex].classList.add("past");
    }
    // Activate current word
    wordSpans[i].classList.add("active");
    currentWordIndex = i;
  }, null, w[1]);
});

// Phase 3: CTA overlay fades in at 80%
tl.to("#cta-overlay", { opacity: 1, duration: 0.5, ease: "power2.out" }, ctaStart);

// Phase 4: Dim subtitle bar during CTA
tl.to("#subtitle-bar", { opacity: 0.3, duration: 0.5 }, ctaStart);

// Phase 5: Scroll progress bar fades out
tl.to(".scroll-progress-track", { opacity: 0, duration: 0.3 }, ctaStart);

window.__timelines["{repo}-tour"] = tl;
</script>
</body>
</html>
```

### Step 5: Render

```bash
cd github-promos/<repo>-tour

# If no HyperFrames project config exists:
npx hyperframes init --example blank --non-interactive

# Lint
npx hyperframes lint

# Snapshot to verify visually
npx hyperframes snapshot

# Draft render
npx hyperframes render --quality draft

# Verify the output MP4 in renders/
ls -la renders/

# If everything looks good, render final
npx hyperframes render --quality standard
```

### Step 6: Deliver

Send the final MP4 to the user. Ask if they want:
- High-quality render (`--quality high`)
- Different aspect ratio (landscape 1920x1080)
- Script revisions

---

## Subtitle System — How It Works

The subtitle system is the core differentiator of this skill. Here's how word-by-word sync works:

### Word-Level Timestamps

The narration audio is transcribed with word-level timestamps (from ElevenLabs or Whisper). Each word gets a `[word, startSeconds, endSeconds]` entry in the `WORDS` array.

### Three Visual States

Every word in the subtitle bar has three CSS states:

| State | Class | Visual |
|-------|-------|--------|
| **Upcoming** | `.subtitle-word` | Dim white `rgba(255,255,255,0.35)` |
| **Active** | `.subtitle-word.active` | Bright white `#FFFFFF`, slightly scaled `1.08` |
| **Past** | `.subtitle-word.past` | Medium white `rgba(255,255,255,0.65)` |

The GSAP timeline calls a function at each word's `startSeconds` to transition `currentWord → active` and `previousWord → past`. This creates a **Karaoke-style word-by-word highlight** that's perfectly synced to the audio.

### Typography

- **Font**: Inter 700, 42px
- **Position**: Bottom 180px, centered, 1000px wide max
- **Background**: No background box — words float over the scroll content with the dim/bright/dim gradient making them readable against any content
- **Z-index**: 100 (above scroll content at z-index 1, below CTA overlay at z-index 200)

### Layout Considerations

Words are laid out with `display: inline-block` and natural text wrapping. For longer scripts (20+ seconds), consider splitting into 2–3 line groups that appear/disappear between scroll segments:

```javascript
// Group words by scroll segment
var SEGMENTS = [
  { start: 0, end: 5, words: [0, 12] },     // Beat 1: Hero
  { start: 5, end: 15, words: [13, 35] },   // Beat 2: Scroll
  { start: 15, end: 20, words: [36, 50] },   // Beat 3: Stats
  { start: 20, end: 25, words: [51, 65] },   // Beat 4: CTA
  { start: 25, end: 28, words: [66, 72] },   // Beat 5: Follow
];
```

Each segment fades in its words and fades out the previous segment's words, preventing subtitle overload during long scrolls.

---

## Scroll Mechanics

### Full-Screen Mobile Viewport

The GitHub screenshot fills the entire 1080x1920 canvas — no phone bezel, no sidebar, no letterboxing. The viewer sees the repo page exactly as it appears on a mobile phone in dark mode.

### Smooth Continuous Scroll

The scroll is a single `gsap.to()` animation from `y: 0` to `y: -MAX_SCROLL` over the first 80% of the video duration. This means:

- A 25-second video scrolls for 20 seconds, then shows the CTA for 5 seconds.
- A 15-second video scrolls for 12 seconds, then shows the CTA for 3 seconds.

The easing is `"none"` (linear) by default because the subtitles handle the pace perception — the narrator's word highlights create the feeling of "stopping" at interesting sections even though the scroll is continuous.

**If you want variable-speed scroll** (slower at interesting sections, faster at filler):

```javascript
// Replace the single gsap.to with a timeline of segments:
tl.to(".scroll-content", { y: SCROLL_30PCT, duration: scrollEnd * 0.35, ease: "power2.out" }, 0);
tl.to(".scroll-content", { y: SCROLL_70PCT, duration: scrollEnd * 0.40, ease: "power1.out" }, scrollEnd * 0.35);
tl.to(".scroll-content", { y: -MAX_SCROLL, duration: scrollEnd * 0.25, ease: "power3.in" }, scrollEnd * 0.75);
```

Map the slow segments to the sections the narrator calls out by name.

---

## Narration-Aware Timing (MANDATORY)

The scroll speed and CTA timing are derived FROM the narration audio, not the other way around.

1. **Write the script first.** Know what you're going to say.
2. **Generate the audio.** Get the actual MP3 file.
3. **Measure total duration.** `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 assets/narration.mp3`
4. **Transcribe with word timestamps.** Get `WORDS[]` with start/end per word.
5. **Set `data-duration`** on `#root` to the measured total duration.
6. **Set `data-duration`** on `<audio>` to the measured total duration.
7. **Set `TOTAL_DURATION`** in JS to the measured total duration.
8. **Calculate scroll/CTA splits** from `TOTAL_DURATION`:
   - Scroll phase: 0% to 80%
   - CTA phase: 80% to 100%

Never hard-code a duration and then try to fit the narration into it. The narration decides the duration.

---

## Color Scheme (GitHub Dark)

| Token | Value |
|-------|-------|
| Background | `#0d1117` |
| Text | `#e6edf3` |
| Muted | `#8b949e` |
| Borders | `#30363d` |
| Blue accent | `#58a6ff` |
| Green accent | `#3fb950` |
| CTA green | `#238636` |
| Gold | `#f9c513` |

---

## Variations

### Landscape (1920x1080)

Change `data-width="1920" data-height="1080"` and adjust:
- `.scroll-container` to 1920x1080
- Subtitle bar to `bottom: 80px`, `width: 1800px`
- CTA overlay sizing
- Screenshot capture at desktop width (1280px viewport)

### With Background Music

Add a second `<audio>` element with a low-volume ambient track (royalty-free). Set its `data-start` and `data-duration` to match the narration.

### Multiple Repos in One Video

Create separate compositions per repo, then use `npx hyperframes compose` to concatenate them with transitions between.

---

## Prerequisites

- `ELEVENLABS_API_KEY` environment variable
- Node.js >= 22 with HyperFrames CLI installed (`npm install -g hyperframes`)
- `ffmpeg` in PATH (for duration measurement)
- `whisper` installed if using local transcription (Option B in Step 3)
- `screenshot` skill available (for capturing the GitHub page)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Screenshot too short for 15s scroll | Capture at a smaller viewport width (390px) — the mobile layout makes pages taller |
| Audio duration mismatch | Use `ffprobe` to get exact duration; set `TOTAL_DURATION` from the measured value |
| Subtitles out of sync | Re-transcribe with `whisper --word_timestamps True`; verify timestamps against audio playback |
| Scroll too fast | Reduce scroll duration percentage (e.g. 80% → 70%) and give more time to CTA |
| Scroll too slow | Increase scroll duration percentage or use variable-speed segments |
| Words overlap content | Add a semi-transparent bar behind the subtitle area: `background: rgba(13,17,23,0.6)` on `.subtitle-bar` |
| HyperFrames init fails | Delete `hyperframes.config.json` and re-run `npx hyperframes init --example blank` |
| CTA not visible | Check `z-index: 200` on `.cta-overlay` and ensure `opacity: 0` initial state is in CSS |

---

## Skill Dependency

**Required:** [website-to-hyperframes](https://github.com/heygen-com/hyperframes/blob/main/skills/website-to-hyperframes/SKILL.md) — load it before starting. Its 6-step framework (capture → brand → brief → storyboard → build → validate) governs this skill's workflow. This skill specializes it for scrolling repo tours with synced subtitles on a full-screen mobile viewport.

**Suggested:** `screenshot` skill — for capturing the full-page GitHub repository screenshot in dark mode at mobile viewport width.