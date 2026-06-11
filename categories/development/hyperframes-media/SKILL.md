---
name: hyperframes-media
description: 'Asset preprocessing for HyperFrames compositions — local text-to-speech narration (Kokoro-82M, no API key), audio/video transcription (Whisper), and background removal for transparent overlays (u2net). Use when generating voiceover from text, transcribing speech for captions, removing background from video/images, choosing TTS voices or whisper models, or chaining TTS -> transcribe -> captions. Each command downloads its own model on first run.'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [hyperframes, media, tts, transcription, background-removal, kokoro, whisper, u2net, captions]
license: MIT
metadata:
  hermes:
    tags: [hyperframes-media]
---

# HyperFrames Media Preprocessing

Three CLI commands that produce assets for compositions: `tts` (speech), `transcribe` (timestamps), and `remove-background` (transparent video). Each downloads a model on first run and caches it under `~/.cache/hyperframes/`.

---

## Text-to-Speech (`tts`)

Generate speech audio locally with Kokoro-82M. **No API key required.**

```bash
npx hyperframes tts "Text here" --voice af_nova --output narration.wav
npx hyperframes tts script.txt --voice bf_emma --output narration.wav
npx hyperframes tts --list                       # list all 54 voices
```

### Voice Selection

| Content Type | Recommended Voices | Why |
|-------------|-------------------|-----|
| Product demo | `af_heart` / `af_nova` | Warm, professional |
| Tutorial / how-to | `am_adam` / `bf_emma` | Neutral, easy to follow |
| Marketing / promo | `af_sky` / `am_michael` | Energetic or authoritative |
| Documentation | `bf_emma` / `bm_george` | Clear British English, formal |
| Casual / social | `af_heart` / `af_sky` | Approachable, natural |

### Multilingual

Voice IDs encode language in the first letter:
- `a` = American English, `b` = British English, `e` = Spanish
- `f` = French, `h` = Hindi, `i` = Italian, `j` = Japanese
- `p` = Brazilian Portuguese, `z` = Mandarin

The CLI auto-detects the phonemizer locale from the prefix — no `--lang` needed when the voice matches the text.

```bash
npx hyperframes tts "La reunión empieza a las nueve" --voice ef_dora --output es.wav
npx hyperframes tts "今日はいい天気ですね" --voice jf_alpha --output ja.wav
```

Use `--lang` only to override auto-detection (stylized accents). Valid codes: `en-us`, `en-gb`, `es`, `fr-fr`, `hi`, `it`, `pt-br`, `ja`, `zh`.

### Speed

| Speed | Use Case |
|-------|----------|
| 0.7-0.8 | Tutorial, complex content, accessibility |
| 1.0 | Natural pace (default) |
| 1.1-1.2 | Intros, transitions, upbeat content |
| 1.5+ | Rarely appropriate; test carefully |

### Long Scripts

Write to a `.txt` file and pass the path. Inputs over ~5 minutes may benefit from splitting into segments.

### Requirements

Python 3.8+ with `kokoro-onnx` and `soundfile` (`pip install kokoro-onnx soundfile`). Model downloads on first use (~311 MB + ~27 MB voices, cached in `~/.cache/hyperframes/tts/`).

---

## Transcription (`transcribe`)

Produce a normalized `transcript.json` with word-level timestamps.

```bash
npx hyperframes transcribe audio.mp3
npx hyperframes transcribe video.mp4 --model small --language es
npx hyperframes transcribe subtitles.srt          # import existing
npx hyperframes transcribe subtitles.vtt
npx hyperframes transcribe openai-response.json
```

### Critical Language Rule

**Never use `.en` models unless the user explicitly states the audio is English.** `.en` models (`small.en`, `medium.en`) **translate** non-English audio into English instead of transcribing it. This silently destroys the original language.

1. Language known and non-English → `--model small --language <code>` (no `.en` suffix)
2. Language known and English → `--model small.en`
3. Language unknown → `--model small` (no `.en`, no `--language`) — whisper auto-detects

**Default model is `small`, not `small.en`.**

### Model Sizes

| Model | Size | Speed | When to use |
|-------|------|-------|-------------|
| `tiny` | 75 MB | Fastest | Quick previews, testing pipeline |
| `base` | 142 MB | Fast | Short clips, clear audio |
| `small` | 466 MB | Moderate | **Default** — most content |
| `medium` | 1.5 GB | Slow | Important content, noisy audio, music |
| `large-v3` | 3.1 GB | Slowest | Production quality |

Music with vocals: start at `medium` minimum.

### Output Shape

```json
[
  { "id": "w0", "text": "Hello", "start": 0.0, "end": 0.5 },
  { "id": "w1", "text": "world.", "start": 0.6, "end": 1.2 }
]
```

---

## Background Removal (`remove-background`)

Remove the background from a video or image so the subject sits as a transparent overlay.

```bash
npx hyperframes remove-background subject.mp4 -o transparent.webm  # VP9 alpha WebM
npx hyperframes remove-background subject.mp4 -o transparent.mov   # ProRes 4444
npx hyperframes remove-background portrait.jpg -o cutout.png       # single-image cutout
npx hyperframes remove-background subject.mp4 -o subject.webm \
  --background-output plate.webm                                   # both layers
npx hyperframes remove-background --info                           # detected providers
```

Uses `u2net_human_seg` (MIT). First run downloads ~168 MB of weights.

### Layer Separation (`--background-output`)

Pass `--background-output` (or `-b`) to emit a **second** transparent video with the inverse alpha:

| File | Alpha is... | Use it for |
|------|-------------|------------|
| `-o subject.webm` | The mask — subject opaque, bg transparent | Foreground layer |
| `--background-output plate.webm` | Inverse — bg opaque, subject transparent | Bottom layer; put text/graphics between |

Both share the same quality preset and run from a single inference pass.

### Output Format

| Format | When |
|--------|------|
| `.webm` (VP9 + alpha) | Default. Compositions play directly via `<video>`. |
| `.mov` (ProRes 4444) | Editing in DaVinci/Premiere/FCP. Large files. |
| `.png` | Single-image cutout. |

### Quality Presets

| Preset | CRF | When |
|--------|-----|------|
| `fast` | 30 | Iterating, smaller file |
| `balanced` | 18 | Default. Visually identical for most uses |
| `best` | 12 | Master / final delivery |

---

## TTS -> Transcribe -> Captions Pipeline

Generate voiceover, get word-level timestamps, and create captions:

```bash
npx hyperframes tts script.txt --voice af_heart --output narration.wav
npx hyperframes transcribe narration.wav   # -> transcript.json
```

Whisper extracts precise word boundaries from the generated audio, so caption timing matches delivery without hand-tuning.

---

## Related Skills

| Skill | Purpose |
|-------|---------|
| `hyperframes` | Composition authoring (HTML, GSAP, captions, variables) |
| `hyperframes-cli` | CLI dev loop (init, lint, preview, render, doctor) |
