---
name: hyperframes-cli
description: 'HyperFrames CLI dev loop — project scaffolding, validation (lint/inspect), browser preview with live reload, MP4/WebM rendering, and environment troubleshooting (doctor, browser, info, upgrade). Use when running any npx hyperframes command or troubleshooting the build/render environment. For composition authoring see the hyperframes skill; for asset preprocessing (tts, transcribe, remove-background) see the hyperframes-media skill.'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [hyperframes, cli, video-rendering, devops, preview, lint, render, ffmpeg]
---

# HyperFrames CLI — Dev Loop

Everything runs through `npx hyperframes`. Requires **Node.js >= 22** and **FFmpeg**.

## Workflow

1. **Scaffold** — `npx hyperframes init my-video`
2. **Write** — author HTML composition (see the `hyperframes` skill)
3. **Lint** — `npx hyperframes lint`
4. **Visual inspect** — `npx hyperframes inspect`
5. **Preview** — `npx hyperframes preview`
6. **Render** — `npx hyperframes render`

Lint and inspect before preview. Render before delivery.

---

## Scaffolding

```bash
npx hyperframes init my-video                        # interactive wizard
npx hyperframes init my-video --example warm-grain   # pick a template
npx hyperframes init my-video --video clip.mp4        # with video file
npx hyperframes init my-video --audio track.mp3       # with audio file
npx hyperframes init my-video --example blank --tailwind # with Tailwind v4
npx hyperframes init my-video --non-interactive       # skip prompts (CI/agents)
```

**Templates:** `blank`, `warm-grain`, `play-mode`, `swiss-grid`, `vignelli`, `decision-tree`, `kinetic-type`, `product-promo`, `nyt-graph`

`init` creates the right file structure, copies media, transcribes audio with Whisper, and installs AI coding skills. Use it instead of creating files by hand.

---

## Linting

```bash
npx hyperframes lint                  # current directory
npx hyperframes lint ./my-project     # specific project
npx hyperframes lint --verbose        # info-level findings
npx hyperframes lint --json           # machine-readable
```

Lints `index.html` and all files in `compositions/`. Reports **errors** (must fix), **warnings** (should fix), and **info** (with `--verbose`).

---

## Visual Inspect

```bash
npx hyperframes inspect                 # inspect layout over the timeline
npx hyperframes inspect ./my-project    # specific project
npx hyperframes inspect --json          # agent-readable findings
npx hyperframes inspect --samples 15    # denser timeline sweep
npx hyperframes inspect --at 1.5,4,7.25 # explicit hero-frame timestamps
```

Reports:
- Text extending outside visual containers/bubbles
- Text clipped by fixed-width/fixed-height boxes
- Text extending outside the composition canvas
- Children escaping clipping containers

**Error:** must fix before rendering. **Warning:** agent review. Run with `--strict` to fail on warnings too.

Mark elements with `data-layout-allow-overflow` (intentional entrance/exit overflow) or `data-layout-ignore` (decorative elements).

---

## Previewing

```bash
npx hyperframes preview                   # serve current directory
npx hyperframes preview --port 4567       # custom port (default 3002)
```

Hot-reloads on file changes. Opens the Studio in browser automatically.

When handing a project back, use the Studio URL: `http://localhost:<port>/#project/<project-name>`

---

## Rendering

```bash
npx hyperframes render                                # standard MP4
npx hyperframes render --output final.mp4             # named output
npx hyperframes render --quality draft                # fast iteration
npx hyperframes render --fps 60 --quality high        # final delivery
npx hyperframes render --format webm                  # transparent WebM
npx hyperframes render --docker                       # byte-identical
```

| Flag | Options | Default | Notes |
|------|---------|---------|-------|
| `--output` | path | renders/name_timestamp.mp4 | Output path |
| `--fps` | 24, 30, 60 | 30 | 60fps doubles render time |
| `--quality` | draft, standard, high | standard | draft for iterating |
| `--format` | mp4, webm | mp4 | WebM supports transparency |
| `--workers` | 1-8 or auto | auto | Each spawns Chrome |
| `--docker` | flag | off | Reproducible output |
| `--gpu` | flag | off | GPU-accelerated encoding |
| `--strict` | flag | off | Fail on lint errors |
| `--strict-all` | flag | off | Fail on errors AND warnings |
| `--variables` | JSON object | — | Override composition variables |
| `--variables-file` | path | — | JSON file with variables |
| `--strict-variables` | flag | off | Fail on undeclared keys |

**Quality guidance:** `draft` while iterating, `standard` for review, `high` for final delivery.

---

## Troubleshooting

```bash
npx hyperframes doctor       # check environment (Chrome, FFmpeg, Node, memory)
npx hyperframes browser      # manage bundled Chrome
npx hyperframes info         # version and environment details
npx hyperframes upgrade      # check for updates
```

Run `doctor` first if rendering fails.

---

## Other Commands

```bash
npx hyperframes compositions   # list compositions in project
npx hyperframes docs           # open documentation
npx hyperframes benchmark .    # benchmark render performance
```

---

## Related Skills

| Skill | Purpose |
|-------|---------|
| `hyperframes` | Composition authoring (HTML, GSAP, captions, variables) |
| `hyperframes-media` | Asset preprocessing (TTS, transcribe, background removal) |
