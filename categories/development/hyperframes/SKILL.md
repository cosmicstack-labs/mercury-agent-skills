---
name: hyperframes
description: 'Create, compose, animate, and render HTML-based video compositions using HyperFrames — an open-source video rendering framework built for AI agents. Covers composition authoring with data attributes, GSAP timelines, caption/subtitle generation, text-to-speech narration, audio-reactive animations, scene transitions, variable-driven parametrized renders, and the full video production workflow.'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [hyperframes, video, animation, gsap, html-composition, video-rendering, heygen, captions, tts, transitions]
---

# HyperFrames — Video Composition Authoring

Write HTML. Render video. Built for agents.

HyperFrames is an open-source video rendering framework where **HTML is the source of truth**. A composition is an HTML file with `data-*` attributes for timing, a GSAP timeline for animation, and CSS for appearance. The framework handles clip visibility, media playback, and timeline sync.

**Requirements:** Node.js >= 22, FFmpeg
**Install:** \Created my-video/
  AGENTS.md
  CLAUDE.md
  hyperframes.json
  index.html
  meta.json
  package.json

Get started:

  1. Install AI coding skills (one-time):
     npx skills add heygen-com/hyperframes

  2. Open this project with your AI coding agent:
     cd my-video then start Claude Code, Cursor, or your preferred agent

  3. Try a starter prompt:
     "Using /hyperframes, create a 15-second intro about [your topic]"
     More patterns: hyperframes.heygen.com/guides/prompting

  4. Preview in the browser:
     cd my-video && npm run dev

  5. Check the composition:
     cd my-video && npm run check

  6. Render to MP4 when ready:
     cd my-video && npm run render

  Full docs: hyperframes.heygen.com
**License:** Apache 2.0 (fully open source)

---

## Core Concepts

### The Composition Model

Every video is a **composition** — an HTML document with a root element identified by . Inside it, **clips** (video, audio, img, div elements) are placed on **tracks** using . Each clip has a  and  in seconds. The composition has explicit  and  in pixels.



### Data Attributes Reference

#### All Clips

| Attribute | Required | Values |
|-----------|----------|--------|
| uid=501(salmanqureshi) gid=20(staff) groups=20(staff),12(everyone),61(localaccounts),79(_appserverusr),80(admin),81(_appserveradm),98(_lpadmin),33(_appstore),100(_lpoperator),204(_developer),250(_analyticsusers),395(com.apple.access_ftp),398(com.apple.access_screensharing),399(com.apple.access_ssh),400(com.apple.access_remote_ae),701(com.apple.sharepoint.group.1) | Yes | Unique identifier |
|  | Yes | Seconds or clip ID reference (, ) |
|  | Required for img/div/compositions | Seconds. Video/audio defaults to media duration. |
|  | Yes | Integer. Same-track clips cannot overlap. |
|  | No | Trim offset into source (seconds) |
|  | No | 0-1 (default 1) |

 does **not** affect visual layering — use CSS .

#### Composition Root

| Attribute | Required | Values |
|-----------|----------|--------|
|  | Yes | Unique composition ID |
|  /  | Yes | Pixel dimensions (1920x1080 or 1080x1920) |
|  | No | Path to external HTML file for sub-compositions |
|  | No | JSON object of per-instance variable overrides |

#### Root HTML Element

| Attribute | Values |
|-----------|--------|
|  | JSON array of declared variables for parametrized renders |

---

## Step-by-Step: Building a Video

### Discovery Phase (Exploratory Requests Only)

For open-ended requests ("make a product launch video") where no direction is given, understand intent first:

- **Audience** — who watches? Developers? Executives? General consumers?
- **Platform** — where does it play? Social (15s), website hero, product demo, internal?
- **Priority** — what matters most? Motion quality? Content accuracy? Brand fidelity? Speed?
- **Variations** — offer 2-3 options differing in pacing, energy, or structure.

For specific requests ("add a title card", "fix timing on scene 3"), skip discovery.

### Step 1: Design System

If `design.md` or `DESIGN.md` exists in the project, read it first. It defines brand colors, fonts, and constraints. Use exact values — don't invent colors or substitute fonts.

If fonts are named but no `fonts/` directory with `.woff2` files exists, warn the user.

If no `design.md` exists, ask:
1. **Named a style or mood?** Pick from visual style presets.
2. **Want to browse?** Serve a design picker page.
3. **Skip and go fast?** Ask: mood, light/dark, brand colors/fonts.

### Step 2: Layout Before Animation

**Build the end-state first.** Position every element where it should be at its most visible moment. Write as static HTML+CSS. No GSAP yet.

**The process:**
1. Identify the **hero frame** for each scene.
2. Write **static CSS** for that frame. The `.scene-content` container MUST fill the full scene: `width:100%; height:100%; padding:Npx; display:flex; flex-direction:column; gap:Npx; box-sizing:border-box`. Use padding to push content inward — NEVER `position:absolute; top:Npx` on a content container.
3. Add **entrances with `gsap.from()`** — animate FROM offscreen/invisible TO the CSS position.
4. Add **exits with `gsap.to()`** — animate TO offscreen/invisible FROM the CSS position.

```css
.scene-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 120px 160px;
  gap: 24px;
  box-sizing: border-box;
}
.title { font-size: 120px; }
.subtitle { font-size: 42px; }
```

```javascript
const tl = gsap.timeline({ paused: true });
// Entrances
tl.from(".title", { y: 60, opacity: 0, duration: 0.6, ease: "power3.out" }, 0);
tl.from(".subtitle", { y: 40, opacity: 0, duration: 0.5, ease: "power3.out" }, 0.2);
// Exits
tl.to(".title", { y: -40, opacity: 0, duration: 0.4, ease: "power2.in" }, 3);
tl.to(".subtitle", { y: -30, opacity: 0, duration: 0.3, ease: "power2.in" }, 3.1);
```

### Step 3: Composition Structure

**Standalone compositions (main `index.html`):** Put the `data-composition-id` div directly in `<body>`. No `<template>` wrapper.

**Sub-compositions** loaded via `data-composition-src` use a `<template>` wrapper:

```html
<template id="my-comp-template">
  <div data-composition-id="my-comp" data-width="1920" data-height="1080">
    <style>
      [data-composition-id="my-comp"] { /* scoped styles */ }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      window.__timelines["my-comp"] = tl;
    </script>
  </div>
</template>
```

Load in root: `<div data-composition-id="my-comp" data-composition-src="compositions/my-comp.html" data-start="0" data-duration="10" data-track-index="1"></div>`

### Step 4: Variables (Parametrized Compositions)

Render the same composition with different content without editing source HTML.

**Three-step pattern:**

1. **Declare** variables on `<html>` with `data-composition-variables`:

```html
<html data-composition-variables='[
  {"id":"title","type":"string","label":"Title","default":"Hello"},
  {"id":"theme","type":"enum","label":"Theme","default":"light","options":[
    {"value":"light","label":"Light"},
    {"value":"dark","label":"Dark"}
  ]}
]'>
```

2. **Read** inside the composition script:

```javascript
const { title, theme } = window.__hyperframes.getVariables();
document.getElementById("hero").textContent = title;
document.body.dataset.theme = theme;
```

3. **Override** at render time:

```bash
npx hyperframes render --variables '{"title":"Q4 Report","theme":"dark"}' --output q4.mp4
```

**Sub-composition per-instance values:**

```html
<div data-composition-id="card-pro" data-composition-src="compositions/card.html"
     data-variable-values='{"title":"Pro","price":"$29"}'></div>
```

Types supported: `string`, `number`, `color`, `boolean`, `enum`.

---

## Advanced Topics

### Scene Transitions

Transitions between scenes use the shader-transitions package or CSS approaches:

| Transition | Method |
|------------|--------|
| Crossfade | GSAP opacity cross between scenes |
| Wipe | CSS clip-path animation |
| Slide reveal | GSAP `x` or `y` transforms |
| Flash through white | Shader transition via catalog |
| Shader dissolve | WebGL via `@hyperframes/shader-transitions` |

Install transitions: `npx hyperframes add flash-through-white`

### Captions & Subtitles

Generate word-level captions synced to audio:

1. **Generate narration:** `npx hyperframes tts "Your script" --voice af_heart --output narration.wav`
2. **Transcribe:** `npx hyperframes transcribe narration.wav` (produces `transcript.json`)
3. **Use in composition:** Reference the transcript for word-level caption animation with GSAP stagger.

### Text-Behind-Subject (Presenter Behind Headline)

Two key rules:

1. **Wrap the cutout video in a non-timed `<div>`** and animate the wrapper's opacity, not the video element.
2. **Both videos use `data-start="0"` and `data-media-start="0"`** for frame-accurate sync.

```html
<video src="presenter.mp4" id="bg" data-start="0" data-duration="6" data-track-index="0" muted playsinline></video>
<h1 id="headline" style="z-index:2;">MAKE IT IN HYPERFRAMES</h1>
<div class="cutout-wrap" style="position:absolute;inset:0;z-index:3;opacity:0">
  <video src="presenter.webm" data-start="0" data-duration="6" data-track-index="1" muted playsinline></video>
</div>
```

### Animating with Frame Adapters

Register each animation runtime on `window.__hf*` for deterministic seeking:

| Adapter | Registration | Notes |
|---------|-------------|-------|
| **GSAP** | `window.__timelines["comp-id"] = tl` | Paused timeline, `paused:true` |
| **Anime.js** | `window.__hfAnime` | Registered animations on global |
| **CSS Animations** | Automatic discovery | Browser pauses/resumes keyframes |
| **Lottie** | `window.__hfLottie` | `lottie-web` or dotLottie players |
| **Three.js** | `window.__hfThreeTime` | Uses seek events, not wall-clock |
| **WAAPI** | `document.getAnimations()` | Standard Web Animations API |

### Color Themes & Palettes

When no `design.md` exists, offer mood-based presets:

| Mood | Theme | Palette |
|------|-------|---------|
| Professional | Light, clean | Slate blues, whites, accent teal |
| Energetic | Dark, vibrant | Deep navy, bright cyan, amber accents |
| Warm | Cream/beige | Warm grays, terracotta, gold |
| Tech-forward | Dark mode | Near-black, electric blue, neon green |
| Minimal | Light, ample space | White, light gray, single accent |
| Luxury | Dark, rich | Charcoal, gold, deep burgundy |
| Playful | Bright, colorful | Pastels, saturated primaries |
| Cinematic | Dark, high contrast | Black, white, single saturated color |

---

## Common Patterns

### Product Intro (10s)

```html
<div data-composition-id="product-intro" data-width="1920" data-height="1080">
  <div class="scene-content">
    <h1 class="title">Product Name</h1>
    <p class="subtitle">The next generation of productivity</p>
  </div>
  <style>
    .scene-content { display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%; height:100%; padding:120px; gap:24px; box-sizing:border-box; background:linear-gradient(135deg,#0f0c29,#302b63,#24243e); color:white; font-family:system-ui,sans-serif; }
    .title { font-size:120px; font-weight:800; margin:0; }
    .subtitle { font-size:42px; opacity:0.8; margin:0; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <script>
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({paused:true});
    tl.from(".title", {y:80,opacity:0,duration:0.8,ease:"power3.out"}, 0);
    tl.from(".subtitle", {y:40,opacity:0,duration:0.6,ease:"power3.out"}, 0.3);
    tl.to(".title", {y:-40,opacity:0,duration:0.5,ease:"power2.in"}, 8);
    tl.to(".subtitle", {y:-30,opacity:0,duration:0.4,ease:"power2.in"}, 8.2);
    window.__timelines["product-intro"] = tl;
  </script>
</div>
```

### Animated Bar Chart Race (from CSV)

Use HTML tables or SVG bars with GSAP stagger animations. Each bar's height animates from 0 to its data value.

### TikTok-Style Hook (9:16, 15s)

Use `data-width="1080" data-height="1920"` for vertical format. Bouncy captions synced to TTS, fast cuts, bold text.

---

## Best Practices

1. **Build the end-state first** — position all elements at their hero frame before adding GSAP.
2. **Lint before rendering** — `npx hyperframes lint` catches missing IDs, overlapping tracks, unregistered timelines.
3. **Inspect visually** — `npx hyperframes inspect` seeks through the timeline and reports text spilling off-canvas.
4. **Use draft quality while iterating** — `--quality draft` for fast iterations, `standard` for review, `high` for final delivery.
5. **FPS tradeoff** — 30fps default is sufficient for most content. 60fps doubles render time.
6. **Run `npx hyperframes doctor` if rendering fails** — checks for Chrome, FFmpeg, Node version, and memory.
7. **Consistent timing** — sub-comps loaded via `data-composition-src` mount at `data-start`; ensure `data-media-start="0"` for frame-accurate sync.
8. **Test both preview and render** — browser preview is not byte-identical to headless Chrome render.
9. **Docker for reproducibility** — `--docker` flag ensures byte-identical output across machines.

---

## Prompt Examples for AI Agents

**Cold start (describe what you want):**
> Using the hyperframes skill, create a 10-second product intro with a fade-in title, a background video, and background music.

**Warm start (turn context into video):**
> Take this GitHub repo and explain its uses and architecture to me using a hyperframes video.

> Summarize this PDF into a 45-second pitch video.

> Turn this CSV into an animated bar chart race.

**Format-specific:**
> Make a 9:16 TikTok-style hook video about AI agents, with bouncy captions synced to TTS narration.

**Iteration (talk to the agent like a video editor):**
> Make the title 2x bigger, swap to dark mode, and add a fade-out at the end.

> Add a lower third at 0:03 with my name and title.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npx hyperframes` not found | Node.js >= 22 required |
| FFmpeg not found | Install via `brew install ffmpeg` or `apt install ffmpeg` |
| Chrome issues | Run `npx hyperframes browser` to manage bundled Chrome |
| Render fails | Run `npx hyperframes doctor` for diagnostics |
| Lint errors | Fix missing `data-composition-id`, overlapping tracks, unregistered timelines |
| Inspect warnings | Check text overflow, clipping containers, off-canvas elements |
| Version check | `npx hyperframes info` or `npx hyperframes upgrade` |

---

## Related Skills

| Skill | Purpose |
|-------|---------|
| `hyperframes-cli` | CLI dev loop — init, lint, inspect, preview, render, doctor |
| `hyperframes-media` | Asset preprocessing — TTS, transcribe, background removal |

---
