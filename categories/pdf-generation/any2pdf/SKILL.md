---
name: any2pdf
description: 'Convert Markdown to publication-quality PDF with reportlab — CJK/Latin mixed text, themes, cover pages, watermarks, callouts, formulas, and interactive theme selection'
metadata:
  author: lovstudio
  curator: cosmicstack-labs
  version: 1.1.0
  category: pdf-generation
  tags: [markdown, pdf, cjk, reportlab, typesetting, themes, any2pdf]
  source: https://github.com/lovstudio/any2pdf
  license: MIT
metadata:
  hermes:
    tags: [any2pdf]
---

# any2pdf — Markdown to Professionally Typeset PDF

> **Credits.** This skill is adapted from [`lovstudio/any2pdf`](https://github.com/lovstudio/any2pdf) by **lovstudio**, distributed under the MIT license. The original repository ships the Python implementation (`md2pdf.py`), preview gallery, and reference theme JSONs. This document is the Mercury-compatible `SKILL.md` adaptation; the runtime code and design credit belong entirely to the original author.
>
> - Upstream: https://github.com/lovstudio/any2pdf
> - License: MIT (see upstream `LICENSE`)
> - Author: lovstudio
> - Curator (this entry): cosmicstack-labs

This skill converts any Markdown file into a publication-quality PDF using Python's `reportlab`. It was developed through extensive iteration on real Chinese technical reports and solves several hard problems that naive MD→PDF converters get wrong — CJK/Latin mixed text wrapping, canvas CJK rendering on cover/headers/footers, code-block whitespace preservation, and mixed-font fallbacks across macOS, Linux, and Windows.

---

## When to Use

Trigger this skill whenever the user:

- Wants to convert `.md` → `.pdf`
- Has a markdown report or document and wants professional typesetting
- Mentions **"markdown to PDF"**, **"md2pdf"**, **"any2pdf"**, **"md转pdf"**, **"报告生成"**, or asks for a **"typeset"** or **"professionally formatted"** PDF from markdown source
- Has a document with CJK characters mixed with Latin text
- Has fenced code blocks, markdown tables, or nested lists that need to survive conversion
- Needs local/remote images, Obsidian callouts, emoji, or LaTeX-style math formulas
- Wants a cover page, table of contents, watermark, or back cover in their PDF

---

## Where the Runtime Lives

After installing this skill via the Mercury CLI:

```bash
mercury skills install pdf-generation/any2pdf
```

the SKILL.md lands at `~/.mercury/skills/pdf-generation/any2pdf/SKILL.md`.

The Python implementation (`md2pdf.py`), preview images, and theme files are **not** vendored into Mercury Skills — they live in the upstream repository. To use the skill end-to-end, also clone or install the upstream runtime:

```bash
# Option A: clone alongside (recommended for development)
git clone https://github.com/lovstudio/any2pdf.git
# The script is at: any2pdf/lovstudio-any2pdf/scripts/md2pdf.py

# Option B: install via the upstream's own installer
npx skills add lovstudio/any2pdf -g -y
```

When the AI agent runs the conversion, treat the script path as wherever the user cloned it. If unsure, ask:

> "Where is the `md2pdf.py` script on your system? (e.g. `./any2pdf/lovstudio-any2pdf/scripts/md2pdf.py`)"

---

## Quick Start

```bash
python <path-to>/md2pdf.py \
  --input report.md \
  --output report.pdf \
  --title "My Report" \
  --author "Author Name" \
  --theme warm-academic
```

All parameters except `--input` are optional — sensible defaults are applied.

---

## Pre-Conversion Options (MANDATORY)

**IMPORTANT for AI agents:** You MUST present these options to the user **before** running the conversion. Use whatever interactive question primitive your runtime provides (`AskUserQuestion`, a structured prompt, an MCP tool, etc.). Present **all** options in a **single** question so the user answers once.

The tone should be a friendly design assistant, not a config form.

### Suggested Prompt Template (English)

```
Starting PDF conversion — quick choices first

━━━ Design Style ━━━
 a) Warm Academic   — terracotta tones, refined and elegant; humanities / social science
 b) Classic Thesis  — brown tones, LaTeX classicthesis inspired; academic papers
 c) Tufte           — minimal whitespace, deep red accents; data narratives, technical writing
 d) IEEE Journal    — navy blue, journal-formal; conferences and journals
 e) Elegant Book    — coffee tones, book-like; long-form monographs / technical books
 f) Chinese Red     — vermilion on warm paper; Chinese formal reports / whitepapers
 g) Ink Wash        — pure grayscale, restrained and elegant; literary / design content
 h) GitHub          — blue-and-white minimal; developer-familiar
 i) Nord Frost      — Nordic blue-gray; clean modern
 j) Ocean Breeze    — teal-green; fresh and natural

━━━ Frontispiece (full-page image after cover) ━━━
 1) Skip
 2) I'll provide a local image path
 3) AI generates one based on document content

━━━ Watermark ━━━
 1) None
 2) Custom text (e.g. "DRAFT", "Internal Use Only")

━━━ Back Cover Material (business card / QR code / brand) ━━━
 1) Skip
 2) I'll provide an image
 3) Plain text only

Example reply: "a, frontispiece skip, watermark: For Reference Only, back cover: /path/qr.png"
Plain English is fine — no need to memorize the letters.
```

### Mapping User Choices to CLI Args

| Choice | CLI argument |
|---|---|
| Design style a–j | `--theme <value-from-table-below>` |
| Frontispiece local | `--frontispiece <path>` |
| Frontispiece AI | Generate image first, then `--frontispiece /tmp/frontispiece.png` |
| Watermark text | `--watermark "TEXT"` |
| Back cover image | `--banner <path>` |
| Back cover text | `--disclaimer "..."` and/or `--copyright "..."` |

### Theme Name Mapping

| Choice | `--theme` value | Inspiration |
|---|---|---|
| a) Warm Academic | `warm-academic` | Lovstudio design system |
| b) Classic Thesis | `classic-thesis` | LaTeX classicthesis |
| c) Tufte | `tufte` | Edward Tufte's books |
| d) IEEE Journal | `ieee-journal` | IEEE journal format |
| e) Elegant Book | `elegant-book` | LaTeX ElegantBook |
| f) Chinese Red | `chinese-red` | Chinese formal documents |
| g) Ink Wash | `ink-wash` | 水墨画 / ink wash painting |
| h) GitHub | `github-light` | GitHub Markdown style |
| i) Nord Frost | `nord-frost` | Nord color scheme |
| j) Ocean Breeze | `ocean-breeze` | — |

### Handling AI-Generated Frontispiece

If the user chose **AI generation**: read the document title and the first few paragraphs, use an image-generation tool to create a themed illustration matching the chosen design style, show the result for approval, then pass via `--frontispiece /path/to/image.png`.

---

## Architecture

```
Markdown
  → Preprocess (split merged headings)
  → Parse (code-fence aware)
  → Story (reportlab flowables)
  → PDF build
```

**Key components:**

1. **Font system** — Palatino (Latin body), Songti SC (CJK body), Menlo (code) on macOS; auto-fallback on Linux / Windows.
2. **CJK wrapper** — `_font_wrap()` wraps CJK character runs in `<font>` tags for automatic font switching.
3. **Mixed text renderer** — `_draw_mixed()` handles CJK/Latin mixed text on canvas (cover, headers, footers).
4. **Code block handler** — `esc_code()` preserves indentation and line breaks in reportlab Paragraphs.
5. **Smart table widths** — proportional column widths based on content length, with 18 mm minimum.
6. **Bookmark system** — `ChapterMark` flowable creates PDF sidebar bookmarks and named anchors.
7. **Heading preprocessor** — `_preprocess_md()` splits merged headings like `# Part## Chapter` into separate lines.
8. **Image handler** — local, relative, `file://`, and remote markdown images are scaled into the body frame with fallback text on errors.
9. **Callout renderer** — Obsidian-style `> [!NOTE]` blocks render as themed boxed callouts.
10. **Formula renderer** — display formulas use optional `matplotlib` mathtext images, with styled text fallback.
11. **Emoji fallback** — emojis render as cached Twemoji PNGs when available, or with a local emoji font fallback.

---

## Hard-Won Lessons

These are real bugs that came out of shipping real reports — preserve the fixes if you're customising the script.

### CJK Characters Rendering as □

`reportlab`'s `Paragraph` only uses the font set in `ParagraphStyle`. If `fontName="Mono"` but the text contains Chinese, characters render as □. **Fix:** always apply `_font_wrap()` to all text that might contain CJK, including code blocks.

### Code Blocks Losing Line Breaks

`reportlab` treats `\n` as whitespace. **Fix:** `esc_code()` converts `\n` → `<br/>` and all spaces → `&nbsp;`, preserving indentation and mid-line alignment before `_font_wrap()`.

### CJK/Latin Word Wrapping

Default reportlab breaks lines only at spaces, causing ugly splits like `Claude\nCode`. **Fix:** set `wordWrap='CJK'` on body / bullet styles to allow breaks at CJK character boundaries.

### Canvas Text with CJK (Cover / Footer)

`drawString()` / `drawCentredString()` with a Latin font can't render 年/月/日 etc. **Fix:** use `_draw_mixed()` for **all** user-content canvas text (dates, stats, disclaimers).

---

## Configuration Reference

Most options can also be set in the markdown file's YAML frontmatter. Explicit CLI arguments take precedence over frontmatter values.

| CLI Argument | Frontmatter Key | Default | Description |
|---|---|---|---|
| `--input` | — | (required) | Path to markdown file |
| `--output` | — | `output.pdf` | Output PDF path |
| `--title` | `title` | From first H1 | Document title for cover page |
| `--subtitle` | `subtitle` | `""` | Subtitle text |
| `--author` | `author` | `""` | Author name |
| `--date` | `date` | Today | Date string |
| `--version` | `version` | `""` | Version string for cover |
| `--watermark` | `watermark` | `""` | Watermark text (empty = none) |
| `--theme` | `theme` | `warm-academic` | Color theme name |
| `--theme-file` | — | `""` | Custom theme JSON file path |
| `--cover` | `cover` | `true` | Generate cover page |
| `--toc` | `toc` | `true` | Generate table of contents |
| `--page-size` | `page-size` | `A4` | Page size (`A4` or `Letter`) |
| `--frontispiece` | `frontispiece` | `""` | Full-page image after cover |
| `--banner` | `banner` | `""` | Back cover banner image |
| `--header-title` | `header-title` | `""` | Report title in page header |
| `--footer-left` | `footer-left` | author | Brand / author in footer |
| `--stats-line` | `stats-line` | `""` | Stats on cover |
| `--stats-line2` | `stats-line2` | `""` | Second stats line |
| `--edition-line` | `edition-line` | `""` | Edition line at cover bottom |
| `--disclaimer` | `disclaimer` | `""` | Back cover disclaimer |
| `--copyright` | `copyright` | `""` | Back cover copyright |
| `--code-max-lines` | `code-max-lines` | `30` | Max lines per code block |

---

## Themes

Built-in: `warm-academic`, `classic-thesis`, `tufte`, `ieee-journal`, `elegant-book`, `chinese-red`, `ink-wash`, `github-light`, `nord-frost`, `ocean-breeze`.

Each theme defines: page background, ink color, accent color, faded text color, border color, code background, and watermark tint. Preview images for every theme live in the upstream repository under [`previews/`](https://github.com/lovstudio/any2pdf/tree/main/previews).

---

## Dependencies

```bash
pip install reportlab
# Optional — render display formulas as images instead of styled text:
pip install matplotlib
```

### Fonts

- **macOS**: Palatino, Songti SC (宋体), Menlo — pre-installed.
- **Windows**: Times New Roman, SimSun / 微软雅黑, Consolas — pre-installed.
- **Linux (Ubuntu/Debian recommended setup)**:

  ```bash
  sudo apt install fonts-dejavu-core fonts-liberation fonts-freefont-ttf \
                   fonts-noto fonts-noto-cjk fonts-noto-color-emoji
  ```

Fonts are auto-discovered from system paths. Missing fonts produce a helpful error with the exact install command for your OS.

---

## What You Get

- **Cover page** — title, subtitle, author, version, stats lines
- **Clickable table of contents** — with PDF bookmark sidebar
- **Frontispiece** — full-page image after cover (local or AI-generated)
- **Running headers** — stable report / document title without page-lagged chapter labels
- **Running footers** — author / brand, page number, date
- **Watermark** — faint diagonal text on every content page
- **Back cover** — banner image or text branding (QR codes, business cards)
- **10 design themes** — from warm academic to ink wash minimalist
- **Markdown images** — local and remote `![alt](src)` with graceful fallback text
- **Obsidian callouts** — `> [!NOTE]`, warnings, tips, quotes, and related callout types
- **LaTeX-style formulas** — inline `$...$` and display `$$...$$` / `\[...\]`; install `matplotlib` for rendered math images
- **Emoji fallback** — Twemoji image rendering when online, with local emoji-font fallback when available
- **YAML frontmatter** — set title, theme, watermark, cover, TOC, and other options inside the Markdown file

---

## License & Attribution

This skill entry is a derivative work licensed under MIT, matching the upstream project.

- **Original work**: [lovstudio/any2pdf](https://github.com/lovstudio/any2pdf) — Copyright (c) lovstudio
- **License**: MIT
- **This SKILL.md adaptation**: curated for Mercury Skills by cosmicstack-labs; no code is redistributed, only documentation and workflow guidance.

If you ship this skill in a product, retain the upstream attribution and the MIT license notice from the original repository.
