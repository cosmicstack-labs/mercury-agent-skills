---
name: presentation-design
description: 'Presentation Design & Storyboarding: Slide design principles, visual hierarchy, layout, typography, and storyboarding for compelling presentations'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: presentation
  tags: [presentation, slide-design, storyboarding, visual-design, presentations]
---

# Presentation Design & Storyboarding

Design presentations that communicate clearly, hold attention, and drive action — grounded in visual design principles and narrative structure.

## Core Principles

### 1. One Idea Per Slide
Every slide should communicate exactly one idea. If a slide has multiple takeaways, split it. Audiences can only process one concept at a time during a live presentation.

### 2. Visual Hierarchy Guides the Eye
The most important element on each slide should be the most visually prominent. Size, color, position, and whitespace direct attention — use them deliberately.

### 3. Slides Support the Speaker, Not Replace Them
Slides are visual aids, not teleprompters. Text-heavy slides cause the audience to read instead of listen. Keep text minimal; let the speaker deliver the details.

### 4. Consistency Builds Trust
A consistent color palette, typography system, layout grid, and animation style signal professionalism. Every inconsistency distracts and erodes credibility.

---

## Presentation Design Maturity Model

| Level | Slide Design | Story Structure | Visual Consistency | Audience Adaptation |
|-------|-------------|----------------|-------------------|-------------------|
| **1: Basic** | Default templates, text-heavy | Linear slide dump | Inconsistent fonts/colors | One deck for all audiences |
| **2: Structured** | Some visual hierarchy, basic icons | Beginning-middle-end | Brand colors applied | Optional appendix slides |
| **3: Polished** | Custom layouts, professional imagery | Clear narrative arc | Typography scale + color system | Audience-specific versions |
| **4: Strategic** | Purposeful whitespace, data visualization | Emotional arc + call to action | Full design system | Adaptive storylines per stakeholder |
| **5: Masterful** | Cinematic pacing, multi-sensory | Stories within a story | Living brand system | Real-time adaptation during delivery |

Target: **Level 3** for internal presentations. **Level 4** for investor and client decks.

---

## Slide Structure

### The Anatomy of a Slide

Every slide should have these structural elements:

```
┌─────────────────────────────────┐
│  HEADER (Title)                 │  ← One line, action-oriented
│                                 │
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │   CONTENT               │    │  ← One core message
│  │   (visual/text/data)    │    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                 │
│  Footer (source, page #)        │  ← Optional, consistent placement
└─────────────────────────────────┘
```

### Title Slides

```markdown
# Title Slide Template

## Title
[Compelling, benefit-driven title]

## Subtitle
[What the audience will learn or gain]

## Presenter Info
[Name, Title, Organization]

## Date
[Presentation Date]
```

### Section Divider Slides

```markdown
# Section Divider Template

## [Section Number]
[Section Title — large, centered]

> "A relevant quote or key takeaway for this section"
```

### Content Slides

**The 3-5-7 Rule:**
- **3** key messages per presentation
- **5** bullet points maximum per slide
- **7** words maximum per bullet

```markdown
# Content Slide Patterns

## Problem / Solution Pattern
| Left (Problem)            | Right (Solution)          |
|---------------------------|---------------------------|
| Pain point description    | How we solve it           |
| Impact statistics         | Before/after comparison   |
| Current frustrations      | New capabilities          |

## Before / After Pattern
| Before                    | After                     |
|---------------------------|---------------------------|
| Current state challenges  | Improved state benefits   |
| Inefficient process       | Streamlined workflow      |
| Metrics showing struggle  | Metrics showing growth    |
```

### Transition Slides

Transition slides signal a shift in topic. Use them between major sections:

```markdown
## Transition Slide Types

1. **Section Divider**: Full-screen section title + large number
2. **Question Slide**: "What if we could...?" — creates anticipation
3. **Quote Slide**: Relevant quote that bridges two topics
4. **Visual Transition**: Full-bleed image that evokes the next topic
5. **Recap Slide**: 3 key points from previous section → arrow → next section
```

---

## Visual Hierarchy Principles

### 1. Size Matters
Larger elements are perceived as more important. Establish a clear size hierarchy:

```css
/* Slide element size hierarchy */
Title:       36-48pt  /* Largest — primary attention */
Subtitle:    24-32pt  /* Secondary — context */
Body Text:   18-24pt  /* Supporting detail */
Captions:    12-14pt  /* Optional — notes, sources */
```

### 2. Color Directs Attention
Use color strategically to guide the eye:

```text
- **Accent colors** for CTAs, key data points, important terms
- **Neutral colors** (grays) for supporting content
- **Brand colors** for headers and structural elements
- **Red/green** sparingly — consider color blindness (use patterns too)
```

### 3. Position = Priority
Top-left to bottom-right reading pattern in Western cultures:

```text
┌─────────────────────────────────┐
│ MOST IMPORTANT                  │
│ (Top-left, large)               │
│                                 │
│              │                  │
│   Secondary  │   Tertiary       │
│   (Bottom-L) │   (Bottom-R)     │
└─────────────────────────────────┘
```

### 4. Whitespace Is a Design Element
Don't fear empty space. Whitespace:

- Reduces cognitive load
- Emphasizes what remains
- Makes slides look premium
- Improves readability

**Rule**: If a slide looks busy, remove elements until it looks too sparse — then add back one.

---

## Typography for Slides

### Font Selection

```text
Safe Choices for Presentations:

| Category       | Serif        | Sans-Serif           |
|----------------|--------------|----------------------|
| Headers        | Georgia      | Montserrat, Inter    |
| Body           | Merriweather | Roboto, Open Sans    |
| Monospace      | —            | Source Code Pro, Fira Code |

Best Practice: Use max 2 fonts per presentation.
- 1 header font (bold, attention-grabbing)
- 1 body font (readable at small sizes)
```

### Font Sizing Scale

```text
Presentation Typography Scale:

| Element        | Size    | Weight          |
|----------------|---------|-----------------|
| Slide Title    | 36-48pt | Bold            |
| Subtitle       | 24-30pt | Semi-Bold       |
| Body Text      | 18-24pt | Regular         |
| Caption/Source | 12-14pt | Regular/Light   |
| Callout Number | 48-72pt | Bold/ExtraBold  |
| Quote          | 28-36pt | Italic          |
```

### Readability Guidelines

```text
- **Line length**: 40-60 characters per line (avoid long lines)
- **Line height**: 1.2-1.5x font size
- **Contrast ratio**: Minimum 4.5:1 for body text (WCAG AA)
- **Background**: Light backgrounds with dark text (or vice versa)
- **All-caps**: Use only for short labels (3-5 words max)
- **Bold**: Emphasize key terms, not entire sentences
```

---

## Color Theory for Presentations

### Building a Presentation Color Palette

```text
Core Palette (4-5 colors):

1. **Primary** (60%) — Brand color, used for backgrounds, headers
2. **Secondary** (30%) — Complementary color, used for content areas
3. **Accent** (10%) — High-contrast, used for CTAs, data highlights
4. **Neutral** — Grays for body text, borders, backgrounds
5. **Alert** — Red/green for status indicators (WARNING/SUCCESS)

Example:
- Primary: #1A365D (Deep Navy)
- Secondary: #2B6CB0 (Blue)
- Accent: #E53E3E (Red)
- Neutral: #718096 (Gray), #EDF2F7 (Light Gray)
- Alert: #38A169 (Green)
```

### Color Psychology

```text
Common Presentation Color Meanings:

| Color  | Emotion             | Best Used For                |
|--------|---------------------|------------------------------|
| Blue   | Trust, Professional | Finance, Enterprise, Tech    |
| Green  | Growth, Health      | Environment, Finance, Health |
| Red    | Urgency, Passion    | CTAs, Warnings, Excitement   |
| Yellow | Optimism, Energy    | Highlights, Creative         |
| Purple | Luxury, Wisdom      | Premium, Education           |
| Orange | Confidence, Fun     | CTAs, Creative, Non-profit   |
| Black  | Power, Luxury       | Luxury, High-end             |
| White  | Clean, Simple       | Minimalist, Medical          |
```

---

## Layout Grids

### The Rule of Thirds

Divide each slide into a 3×3 grid. Place key elements at intersection points:

```text
┌──────┬──────┬──────┐
│      │      │      │
│  ╳   │      │  ╳   │  ← Key elements at intersections
│      │      │      │
├──────┼──────┼──────┤
│      │      │      │
│      │      │      │
│      │      │      │
├──────┼──────┼──────┤
│  ╳   │      │  ╳   │
│      │      │      │
└──────┴──────┴──────┘
```

### Common Layout Templates

```text
1. **Title + Content** (70/30 split)
   - Top 30%: Title
   - Bottom 70%: Content (text, image, or data)

2. **Two-Column** (50/50)
   - Left: Concept or data
   - Right: Supporting visual or comparison

3. **Three-Column** (33/33/33)
   - Use for timelines, process steps, or comparisons

4. **Full-Bleed Image** (100%)
   - Background image with text overlay
   - Use sparingly for impact

5. **Content + Sidebar** (70/30)
   - Main content left
   - Context, definition, or supporting stat on right
```

### Grid Alignment Rules

```text
- Align all elements to a consistent grid (4px or 8px increments)
- Maintain equal margins on all sides (minimum 0.5 inch)
- Keep consistent spacing between elements (24-32px)
- Left-align text for readability (center-align only for titles)
- Never place elements outside the safe area (avoid projector cropping)
```

---

## Image Selection

### Image Quality Standards

```text
- **Resolution**: Minimum 1920×1080 for full-slide images
- **Format**: PNG for graphics, JPEG for photos, SVG for icons
- **File size**: Under 500KB per image (optimize before inserting)
- **Density**: At least 72 DPI for projection, 300 DPI for print
```

### Where to Find Presentation Images

```bash
# Free stock photo sources
# - unsplash.com — high quality, diverse
# - pexels.com — curated, searchable
# - pixabay.com — large library, vector art

# Icon sources
# - thenounproject.com — consistent style icons
# - flaticon.com — icon packs by theme
# - icons8.com — animated and static

# Premium sources
# - shutterstock.com — largest library
# - gettyimages.com — editorial quality
```

### Image Placement Principles

```text
- **Relevant**: Image should support the message, not decorate
- **Consistent**: Use one image style throughout (all photos or all illustrations)
- **Cropped intentionally**: Remove clutter, focus on the subject
- **Text overlay**: Use a dark gradient overlay (30-40% opacity) for readability
- **Avoid**: Generic handshake photos, puzzle pieces, clip art
```

---

## Animation Principles

### Animation Types

```text
Three Categories of Animation:

1. **Entrance** — Element appears on slide
   - Fade In (subtle, professional)
   - Slide In from Left/Right (reveal)
   - Zoom In (emphasis on important element)

2. **Emphasis** — Element draws attention
   - Pulse/Grow (brief attention)
   - Color Change (highlight change)
   - Wobble (warning/caution)

3. **Exit** — Element leaves slide
   - Fade Out (smooth disappearance)
   - Slide Out (transition to next point)
   - Zoom Out (summarize and dismiss)
```

### Animation Best Practices

```text
DO:
- Use consistent animation timing (0.3-0.5 seconds per animation)
- Animate with purpose — reveal information as you discuss it
- Use fade/ slide transitions for professional look
- Keep total animation time under 2 seconds per slide

DON'T:
- Use Fly In, Bounce, or Spin (distracting, amateur)
- Animate every element on a slide (overwhelming)
- Use sound effects (unprofessional in most contexts)
- Make audiences wait for animations to complete
```

### Animation Timing Guide

```python
# Animation timing recommendations (in seconds)
animation_timing = {
    "fade_in": 0.3,
    "slide_in": 0.4,
    "zoom_in": 0.5,
    "emphasis_pulse": 0.6,
    "color_transition": 0.3,
    "fade_out": 0.3,
    "slide_out": 0.4,
    "crossfade_transition": 0.5,
    "push_transition": 0.6,
}

# Delay between sequential animations
sequential_delay = 0.2  # seconds

# Total time budget for animations per slide
max_animation_time = 2.0  # seconds
```

---

## Storytelling Arc

### The Three-Act Structure for Presentations

```text
ACT 1: THE SETUP (20% of time)
├── Hook — Grab attention (statistic, question, story)
├── Context — Where we are today
└── Problem — What's broken or missing

ACT 2: THE CONFRONTATION (60% of time)
├── Journey — How we got here / What we tried
├── Insight — The breakthrough discovery
├── Solution — What we built / What we propose
└── Evidence — Proof it works (data, case studies, demos)

ACT 3: THE RESOLUTION (20% of time)
├── Vision — What the future looks like
├── Call to Action — What the audience should do
└── Close — Memorable final statement
```

### Storyboarding Template

```markdown
# Storyboard Template

## Slide 1: Hook
**Visual**: [Describe image/graphic]
**Script**: [Opening line]
**Emotion**: [Curiosity, surprise, concern]

## Slide 2: Problem
**Visual**: [Chart showing pain point]
**Script**: [Problem statement]
**Emotion**: [Recognition, agreement]

## Slide 3: Solution
**Visual**: [Product screenshot / diagram]
**Script**: [How we solve it]
**Emotion**: [Relief, excitement]

## Slide 4: Evidence
**Visual**: [Testimonial / metrics]
**Script**: [Proof points]
**Emotion**: [Confidence, trust]

## Slide 5: Call to Action
**Visual**: [Next steps / contact]
**Script**: [What to do now]
**Emotion**: [Urgency, motivation]
```

### Narrative Techniques

```text
1. **The Hero's Journey**: The customer is the hero, your solution is the guide
2. **Before/After**: Show the contrast in vivid terms
3. **Suspense**: Reveal the key insight at the midpoint, not the beginning
4. **Cause and Effect**: "Because of X, Y happened" — logical progression
5. **Testimonial Arc**: Tell the story through a customer's experience
6. **Data Narrative**: Let the numbers tell the story with human context
7. **Problem → Solution → Proof**: Classic persuasive structure
```

---

## Presenter Notes

### Writing Effective Speaker Notes

```markdown
# Speaker Note Template

## Slide Title: [Title]

**Key Message**: [Single sentence — what the audience must remember]

**Opening**: [2-3 sentences to introduce the slide]

**Details to Cover**:
1. [First point to verbalize]
2. [Second point — expand on the visual]
3. [Third point — connect to broader narrative]

**Transition**: [How to move to the next slide]

**Time**: [Estimated speaking time for this slide]

**Notes**: [Any reminders, warnings, or context for the presenter]
```

### Note-Taking Best Practices

```text
- Write notes as if explaining to a colleague — conversational tone
- Include timing cues: "This slide should take 90 seconds"
- Mark slides that can be skipped if running short
- Add backup data points for Q&A
- Practice with notes, then without
- Never read directly from notes — use them as cues
```

---

## Slide Master Templates

### Creating a Slide Master

```python
# python-pptx example: Creating a custom slide master
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

prs = Presentation()
slide_width = Inches(13.333)  # 16:9 widescreen
slide_height = Inches(7.5)

# Slide master dimensions for common aspect ratios:
aspect_ratios = {
    "4:3 Standard": (Inches(10), Inches(7.5)),
    "16:9 Widescreen": (Inches(13.333), Inches(7.5)),
    "16:10": (Inches(11.25), Inches(7.03)),
}

# Best practices for slide master:
# 1. Define 3-5 layout variants (title, content, section, blank, image)
# 2. Set consistent margins (0.5-1 inch on all sides)
# 3. Include footer placeholders (page number, date, logo)
# 4. Define placeholder sizes and positions in master
# 5. Set default font families and sizes
```

### Common Slide Layouts for Master

```text
| Layout Name       | Elements                                        |
|-------------------|-------------------------------------------------|
| Title Slide       | Title, subtitle, date, presenter info           |
| Section Divider   | Section number, title, background image         |
| Content           | Title, body content, optional image placeholders|
| Two-Column        | Title, left column, right column                |
| Blank             | No placeholders — full creative control         |
| Image + Caption   | Full-bleed image, caption overlay               |
| Quote             | Large quote text, attribution                   |
| Data / Chart      | Title, chart area, source footnote              |
```

---

## Common Mistakes

1. **Death by bullet points**: Slides with 8+ bullet points that the presenter reads verbatim. Use 3-5 concise bullets max.
2. **Inconsistent formatting**: Mixing fonts, colors, and alignment across slides. Establish a design system and follow it.
3. **Too much text**: Audiences read slides faster than speakers talk. If they're reading, they're not listening.
4. **No visual hierarchy**: Everything is the same size and weight. Nothing stands out — nothing is remembered.
5. **Bad image quality**: Pixelated, stretched, or low-resolution images look unprofessional. Always use high-res.
6. **Over-animating**: Fly-in, spin, bounce, and sound effects scream "amateur." Stick to fade and slide transitions.
7. **Missing narrative arc**: Slides are in order but there's no story. Each slide should build on the last toward a conclusion.
8. **No call to action**: The presentation ends without telling the audience what to do next. Always include a CTA.
9. **Ignoring the audience**: Same deck for investors, customers, and internal teams. Tailor content and language per audience.
10. **Reading from slides**: The speaker faces the screen and reads. Slides support the presenter — the presenter owns the content.
