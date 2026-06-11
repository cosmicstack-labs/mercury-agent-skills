---
name: github-repo-promo
description: 'Generate 1080x1920 Instagram Reels video promos for GitHub repositories using HyperFrames. 7-beat structure with fullscreen scrolling phone mockup, GSAP animations, dark GitHub theme, repo stats, ElevenLabs AI voiceover synced to scroll duration, and follow CTA. Depends on the website-to-hyperframes skill for HyperFrames composition patterns.'
metadata:
  author: hotheadhacker
  version: 1.0.0
  category: media-download
  tags:
    - hyperframes
    - video-generation
    - github
    - promo
    - instagram-reels
    - gsap
    - elevenlabs
    - voiceover
    - social-media
license: MIT
metadata:
  hermes:
    tags: [github-repo-promo]
---

# GitHub Repo Promo Video

> **Depends on:** [website-to-hyperframes](https://github.com/heygen-com/hyperframes/blob/main/skills/website-to-hyperframes/SKILL.md) — load it before starting. Its 6-step workflow (capture → brand → brief → storyboard → build → validate) and all reference files apply here. This skill specializes that workflow for GitHub repository promos.

---

## Core Decisions

| Decision | Value | Why |
|----------|-------|-----|
| **Dimensions** | **1080x1920** (Instagram Reels) | Instagram Reels is the primary distribution format. Landscape is secondary. |
| **Phone mockup viewport** | **Full-screen of available viewport** | The phone mockup fills the entire 1080x1920 canvas — no letterboxing, no sidebars. The scrolling screenshot occupies every pixel. |
| **Narration priority** | **Narration drives timing** | Beat durations are computed FROM the narration audio, not the other way around. The narrator always knows the scroll state. |
| **Output folder** | `github-promos/<repo-name>/` | All promo projects live under a parent `github-promos/` directory for organization. |
| **Follow CTA** | `@githubprojects` (or user-specified) | Final beat shows "Follow @githubprojects for more trending repos" — not just "star on GitHub". |

---

## Directory Structure

Every promo project lives under a single parent folder:

```
github-promos/
  <repo-name>/
    index.html              ← main composition (mandatory)
    package.json            ← Node project config (from hyperframes init)
    hyperframes.config.json ← HyperFrames config
    DESIGN.md               ← brand cheat sheet (Step 1 output)
    STORYBOARD.md           ← beat plan (Step 3 output)
    SCRIPT.md               ← narration script (Step 3 output)
    assets/
      repo-page.png         ← Full-page GitHub screenshot (dark mode)
      narration.mp3         ← ElevenLabs voiceover
    renders/                 ← generated videos
```

**Sibling repos** coexist under `github-promos/`:

```
github-promos/
  mercury-agent-skills/
  nextjs/
  three.js/
  react/
```

---

## Workflow

This skill follows the website-to-hyperframes 6-step process, specialized for GitHub repos. Steps marked 💬 require user confirmation before proceeding.

### Step 0: Capture Repo Info

Use `web-search` or `fetch_url` to collect from the GitHub API and repo page:

- Stars, forks, watchers, open issues
- Primary language, top languages breakdown
- Description, topics/tags, about section
- Latest release, license, recent activity
- README summary (what the project does, who it's for)

Then use the `screenshot` skill to capture a **full-page screenshot** of the repo in dark mode:

```
use_skill("screenshot")
// URL: https://github.com/{owner}/{repo}
// Full page, dark mode, viewport 1080x1920
// Save as: github-promos/{repo}/assets/repo-page.png
```

Get the screenshot dimensions — you need the pixel height for scroll calculations:

```bash
sips -g pixelHeight github-promos/{repo}/assets/repo-page.png
sips -g pixelWidth github-promos/{repo}/assets/repo-page.png
```

### Step 1: Brand Identity

Write `DESIGN.md` — GitHub dark theme defaults:

| Token | Value |
|-------|-------|
| Background | `#0d1117` |
| Text | `#e6edf3` |
| Muted | `#8b949e` |
| Border | `#30363d` |
| Blue | `#58a6ff` |
| Green | `#3fb950` / CTA `#238636` |
| Gold | `#f9c513` |
| Purple | `#bc8cff` |
| Orange | `#f0883e` |
| Glass BG | `rgba(22,27,34,0.8)` + backdrop-filter |

Font: Inter (400–900).

### Step 2: Strategy & Brief 💬

Align with the user on:
- Which repo and what aspect to highlight
- Tone (professional, hype, educational)
- Audience (developers, founders, general tech)
- The ONE message this video must communicate

### Step 3: Storyboard + Script 💬

Write `STORYBOARD.md` and `SCRIPT.md` together. **Critical: narration writes itself around the scroll timing.**

#### 7-Beat Structure (MANDATORY)

| Beat | Timing | Visual | Narration focus |
|------|--------|--------|-----------------|
| 1. Hero | 0–~4s | Repo name, tagline, badges (stars/forks/lang) | "This is {repo}. {one-liner}." |
| 2. Scroll | ~4–~15s | **Fullscreen phone mockup** scrolls through the repo page | Narration describes what's scrolling into view, synced to scroll position |
| 3. Stats | ~15–~19s | 2x2 stat cards (stars, forks, issues, language) | "The numbers. {X} stars. {Y} forks." |
| 4. What You Build | ~19–~23s | 8–10 feature/use-case chips | "What can you build? {feature list}." |
| 5. Stars | ~23–~27s | Large star icon, big star count, label | "And {X} developers agree." |
| 6. CTA | ~27–~31s | "Star on GitHub" button with glow | "Star it today. {repo URL}." |
| 7. Follow | ~31–~33s | "Follow @{handle} for more trending repos" pill | "Follow @{handle} for more." |

**The narration script MUST reference the scroll state.** Example:

> "Mercury Skills — a curated library of 130 agent capabilities." *(Beat 1)*
> "Let's scroll through what's inside — here's the full registry, categories from AI to DevOps." *(Beat 2 — scroll starts)*
> "Zooming into the README — see how easy it is to search and install." *(Beat 2 — scroll at 60%)*
> "The numbers: 20 thousand stars, 3 thousand forks." *(Beat 3)*

The narrator never says "scrolling through" in a vacuum — they always describe **what is currently on screen**.

#### Timing from narration

1. Write the script first.
2. Generate audio (Step 4).
3. Measure actual audio duration per beat.
4. Set `data-start` and `data-duration` on each beat `<div>` from the measured timings.
5. If Beat 2 audio is 11 seconds, the scroll animation spans those 11 seconds — not a fixed 10.

### Step 4: Voiceover Generation 💬

Ask the user which TTS provider:

| Provider | When | API |
|----------|------|-----|
| **ElevenLabs** (default) | Best quality, most voices | `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}` |
| **HeyGen TTS** | If already in HeyGen ecosystem | Built-in to HyperFrames Studio |
| **Kokoro** | Free, good quality | Local inference |

Default ElevenLabs config:

```bash
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/AZnzlk1XvdvUeBnXmlld" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "SCRIPT_HERE",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.35,
      "similarity_boost": 0.8,
      "style": 0.25,
      "use_speaker_boost": true
    }
  }' \
  --output github-promos/{repo}/assets/narration.mp3
```

Verify: `ls -la github-promos/{repo}/assets/narration.mp3` — file must exist and be > 0 bytes.

After generating audio, **transcribe it with timestamps** (ElevenLabs returns these, or use `ffmpeg` + `whisper`). Map each timestamp to a beat. Update the storyboard timings from real audio durations.

### Step 5: Build Compositions

Follow the website-to-hyperframes build step, with these repo-specific requirements:

#### Mandatory architecture

```html
<div id="root"
  data-composition-id="{repo}-promo"
  data-width="1080"
  data-height="1920"
  data-start="0"
  data-duration="{total_seconds}">

  <audio id="narration-audio"
    src="assets/narration.mp3"
    data-start="0"
    data-duration="{total_seconds}"
    preload="auto"></audio>

  <!-- Background layers -->
  <div id="bg"></div>
  <div id="bg-grid"></div>
  <div class="glow-orb g1"></div>
  <div class="glow-orb g2"></div>
  <div id="scanlines"></div>

  <!-- 7 beats, each .beat.clip with data-start/data-duration -->
  ...
</div>
```

#### Fullscreen phone mockup (Beat 2)

The phone fills the entire 1080x1920 canvas — **not** a centered phone with dead space.

```css
.phone-frame {
  position: absolute;
  inset: 0;                       /* fills entire canvas */
  width: 1080px;
  height: 1920px;
  border-radius: 0px;             /* no rounded corners on fullscreen */
  overflow: hidden;
  background: #0d1117;
}

.phone-screen {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.phone-scroll-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: {IMG_H}px;             /* actual screenshot height */
}

.phone-scroll-thumb {
  position: absolute;
  right: 8px;
  width: 5px;
  border-radius: 3px;
  background: linear-gradient(180deg, #58a6ff, #3fb950);
  height: {THUMB_H}px;           /* computed: TRACK_H * (1920 / IMG_H) */
  top: 0;
}
```

Scroll variables:

```javascript
var IMG_H = /* actual screenshot pixel height */;
var PHONE_H = 1920;
var MAX_SCROLL = IMG_H - PHONE_H;

// Three scroll stops at ~30%, ~60%, ~88%
var SCROLL_1 = -Math.round(MAX_SCROLL * 0.3);
var SCROLL_2 = -Math.round(MAX_SCROLL * 0.6);
var SCROLL_3 = -Math.round(MAX_SCROLL * 0.88);

// Scroll thumb
var TRACK_H = 1920;
var THUMB_H = Math.round(TRACK_H * (PHONE_H / IMG_H));
var THUMB_TRAVEL = TRACK_H - THUMB_H;

function thumbY(scrollPx) {
  return (Math.abs(scrollPx) / MAX_SCROLL) * THUMB_TRAVEL;
}
```

#### GSAP timeline

```javascript
window.__timelines = window.__timelines || {};
var tl = gsap.timeline({paused: true});

// Beat 1: Hero — fade in elements, stagger badges
// Beat 2: Phone scroll — three scroll segments with different easing
//         gsap.to('.phone-scroll-content', { y: SCROLL_1, duration: beat2Duration * 0.33, ease: 'power3.out' })
//         gsap.to('.phone-scroll-content', { y: SCROLL_2, duration: beat2Duration * 0.33, ease: 'power2.out' })
//         gsap.to('.phone-scroll-content', { y: SCROLL_3, duration: beat2Duration * 0.34, ease: 'power1.out' })
//         gsap.to('.phone-scroll-thumb', { top: thumbY(SCROLL_1), ... })
//         ... repeat for SCROLL_2, SCROLL_3
// Beat 3: Stats — stagger-in cards
// Beat 4: Chips — stagger-in feature tags
// Beat 5: Stars — scale-in with elastic rotation
// Beat 6: CTA — fade-in button with glow pulse
// Beat 7: Follow — quick fade-in pill

window.__timelines["{repo}-promo"] = tl;
```

**Important:** Scroll durations come from the narration audio. If Beat 2's audio segment is 11 seconds, the scroll animations fill those 11 seconds proportionally — not a fixed speed.

### Step 6: Validate & Deliver

```bash
cd github-promos/{repo}
npx hyperframes lint
npx hyperframes validate
npx hyperframes snapshot
```

Fix all errors. Then render at draft quality first:

```bash
npx hyperframes render --quality draft
```

Verify output in `renders/`. If clean, render final:

```bash
npx hyperframes render --quality standard
```

Deliver the MP4 to the user. Ask: "Would you like me to post this, or render at high quality first?"

---

## Seven Beats — Detailed Specifications

### Beat 1: Hero (0s → ~4s)

- **Category pill**: e.g. `FRONTEND` or `AI / ML` — repo's primary category
- **Repo name**: Large text, gradient blue→green (`linear-gradient(135deg, #58a6ff, #3fb950)`)
- **Tagline**: One-liner from repo description, `#8b949e` color
- **3 badges**: Stars count, forks count, primary language — pill-shaped, border `#30363d`, icons from Lucide

### Beat 2: Fullscreen Scrollable Phone (~4s → ~15s)

**The phone fills the ENTIRE 1080x1920 canvas.** No frame bezels, no rounded corners on the outer viewport. The GitHub screenshot scrolls behind a status bar overlay and a scroll thumb indicator.

- Status bar at top: time, repo name, signal icons (semi-transparent overlay)
- Content: full-page GitHub screenshot scrolls from top to bottom
- Scroll thumb on the right edge: 5px wide, gradient blue→green, tracks scroll position
- Three scroll stops matching the narration's description of what's on screen
- Each scroll segment: different easing (`power3.out` → `power2.out` → `power1.out`)

### Beat 3: Stats (~15s → ~19s)

Title: "By the Numbers" in `#e6edf3`.

2×2 grid of glass-morphism stat cards:

| Position | Icon | Value | Label |
|----------|------|-------|-------|
| Top-left | Star | `{stars}k` | Stars |
| Top-right | GitFork | `{forks}` | Forks |
| Bottom-left | AlertCircle | `{issues}` | Open Issues |
| Bottom-right | Code | `{language}` | Language |

Each card: `rgba(22,27,34,0.8)` background, `backdrop-filter: blur(12px)`, border `#30363d`, value text with gradient matching the icon category.

### Beat 4: What You Can Build (~19s → ~23s)

Title: "What Can You Build?" in `#e6edf3`.

8–10 chips in a wrapping grid. Each chip:
- Rounded pill, `px-3 py-1.5`
- Left border color matches category (blue for dev, green for infra, purple for AI, etc.)
- `#e6edf3` text on `rgba(22,27,34,0.6)` background

### Beat 5: Stars Highlight (~23s → ~27s)

- Large star icon (Lucide `Star`, 120px) with `scale: 0 → 1.2 → 1` elastic animation + slight rotation
- Star count in large gradient gold text: `linear-gradient(135deg, #f9c513, #f0883e)`
- Label underneath: "developers trust this repo" in `#8b949e`

### Beat 6: CTA (~27s → ~31s)

- Title: "Star on GitHub Today" in `#e6edf3`
- Subtitle: repo description or tagline in `#8b949e`
- Green CTA button: `#238636` background, `#e6edf3` text, border-radius 999px
- Subtle glow pulse animation: `box-shadow: 0 0 20px rgba(35,134,54,0.4)` pulsing

### Beat 7: Follow (~31s → ~33s)

- Text: "Follow for more trending GitHub repositories" in `#e6edf3`
- Pill with `@githubprojects` (or user-specified handle): rounded, border `#30363d`, background `rgba(22,27,34,0.8)`
- Quick 0.5s fade-in

---

## Narration-Aware Scroll Sync

This is the key architectural rule: **the narration script is aware of what's on screen during the scroll.**

### How to write narration-aware scripts

1. **Know the scroll stops.** Before writing the script, you know the 3 scroll positions (30%, 60%, 88%) and what content appears at each position (from the screenshot).

2. **Call out what you see.** The narrator describes the content at each scroll position:
   - Start: "Here's the repo — README front and center."
   - 30% scroll: "Scrolling down through the installation instructions..."
   - 60% scroll: "And here's the full feature list, categories from AI to DevOps."
   - 88% scroll: "Down to the contributor section at the bottom."

3. **Time narration to scroll duration.** If Beat 2 audio is 11 seconds total, the three scroll segments each get approximately 3.7 seconds. Write ~12 words per segment so the narrator isn't rushing.

4. **Never narrate in a vacuum.** If the scroll is paused at 60% showing the feature list, the narration should reference specific features visible at that position — not generic filler.

### Example: narration-aware script

```
[Beat 1 — 4s] "Mercury Skills — 130 curated agent capabilities, one command away."

[Beat 2 — 11s, scroll across full page]
  0s–3.7s  "Let's walk through it. Here's the full registry on GitHub —"
  3.7s–7.3s "scrolling into the installation section — one CLI command and you're in."
  7.3s–11s  "Here's the feature grid — AI, DevOps, mobile, finance, 23 categories deep."

[Beat 3 — 4s] "The numbers: 20 thousand stars, 3 thousand forks, and zero friction to start."

[Beat 4 — 4s] "What can you build? PDF generation, Amazon shopping, screenshots, Twitter automation, and counting."

[Beat 5 — 4s] "And 20,000 developers agree — this is the agent skills library that ships."

[Beat 6 — 4s] "Star it today. github.com/cosmicstack-labs/mercury-agent-skills."

[Beat 7 — 2s] "Follow @githubprojects for more trending repos."
```

---

## Prerequisites

- `ELEVENLABS_API_KEY` environment variable (for ElevenLabs voiceover)
- Node.js >= 22 with HyperFrames installed globally
- `ffmpeg` available in PATH (for audio duration measurement if not using ElevenLabs timestamps)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Screenshot too tall | Use actual pixel height for `IMG_H`; `MAX_SCROLL = IMG_H - 1920` |
| Audio not playing | Verify `assets/narration.mp3` exists and `src` path is relative to project root |
| ElevenLabs API error | Check `ELEVENLABS_API_KEY` env var, verify credits |
| HyperFrames not found | `npm install -g hyperframes` then `npx hyperframes init` |
| Render fails | Run `npx hyperframes init --example blank` in the project dir first |
| Scroll speed too fast | Increase `data-duration` on Beat 2, or add more scroll words to narration |
| Phone not fullscreen | Set `.phone-frame { inset: 0; border-radius: 0; }` — no bezels |
| Narration desync | Re-transcribe audio, map timestamps to beats, update `data-start`/`data-duration` |
| Beat overlap | Ensure each beat's `data-start` + `data-duration` doesn't exceed the next beat's `data-start` |

---

## Skill Dependency

**Required dependency:** [website-to-hyperframes](https://github.com/heygen-com/hyperframes/blob/main/skills/website-to-hyperframes/SKILL.md)

Load it before starting. Its 6-step workflow (capture → brand → brief → storyboard → build → validate) and all reference files (`step-0-capture.md` through `step-6-validate.md`, `capabilities.md`, `techniques.md`) apply to this skill as the general framework. This skill specializes that workflow for GitHub repository promos with narration-aware scroll sync and the 7-beat structure.