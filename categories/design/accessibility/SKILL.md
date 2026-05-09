---
name: accessibility
description: Achieve and maintain WCAG compliance through inclusive design practices, proper ARIA usage, and comprehensive testing methodologies.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: Design
  tags:
    - accessibility
    - wcag
    - inclusive-design
    - aria
    - a11y
    - screen-readers
    - keyboard-navigation
    - color-contrast
    - assistive-technology
    - accessibility-testing
---

# Accessibility Skill

## Core Principles

### 1. Accessibility Is a Human Right
Digital accessibility is not a compliance checkbox — it's about ensuring everyone can use the web regardless of ability. Approximately 15% of the world's population experiences some form of disability. Building accessible products is the ethical choice, not just a legal requirement.

### 2. Start Early, Not as an Audit
Accessibility must be considered from the first wireframe, not discovered in a last-minute audit before launch. Retrofitting accessibility costs significantly more than building it in from the start. Include a11y in design critiques, sprint planning, and definition of done.

### 3. Nothing About Us Without Us
Design with, not for, people with disabilities. Test with real users who rely on assistive technologies. Automated tools catch only 30-40% of accessibility issues — human testing catches the rest. Include disabled people in your user research and usability testing.

### 4. Accessibility Improves UX for Everyone
Curb cuts benefit everyone, not just wheelchair users. Captions help people in noisy environments. High contrast helps on sunny days. Keyboard navigation helps power users. Accessibility features often become mainstream UX improvements.

### 5. Progress Over Perfection
Level AAA compliance is aspirational and not always achievable. Level AA is the practical target for most products. Don't let perfect be the enemy of good — ship AA-compliant work and document remaining issues for future iterations.

## Accessibility Maturity Model

### Level 1: Unaware
Accessibility is not considered at all. No guidelines, no testing, no training. Accessibility issues are found only when legal complaints arise. This is the starting point — and a liability.

### Level 2: Reactive
Accessibility is addressed reactively — when a bug is filed, an audit is demanded, or a legal threat emerges. Fixes are firefighting exercises. No systemic improvements occur. Burnout is high among any team members advocating for a11y.

### Level 3: Proactive
Basic accessibility practices are followed. Designers check color contrast. Developers use semantic HTML. Automated tools (axe, Lighthouse) run in CI. But there's no dedicated owner or formal process. Consistency varies across teams.

### Level 4: Embedded
Accessibility has a dedicated owner or team. WCAG 2.1 AA is the standard for all new work. Manual testing with screen readers is part of QA. Accessibility is in the definition of done. Training is provided to all designers and developers.

### Level 5: Culture
Accessibility is part of organizational culture. Every role owns accessibility — product managers, designers, engineers, QA, content writers. Users with disabilities are part of the research and testing process. The organization contributes back to the accessibility community.

## WCAG Guidelines — The POUR Principles

WCAG 2.1 is organized around four principles. If any principle is broken, users with certain disabilities cannot access the content at all.

### Perceivable — "Can users perceive the content?"

Users must be able to perceive the information being presented. It cannot be invisible to all of their senses.

**Guideline 1.1: Text Alternatives**
- **1.1.1 Non-text Content (Level A)**: All images, icons, and non-text content must have text alternatives. Decorative images must be hidden from assistive technology.
- ✅ Good: `<img src="chart.png" alt="Sales increased 25% in Q4 2025">`
- ✅ Decorative: `<img src="divider.png" alt="" role="presentation">`
- ❌ Bad: `<img src="chart.png">`

**Guideline 1.2: Time-based Media**
- **1.2.2 Captions (Level A)**: Provide captions for all prerecorded video with audio
- **1.2.4 Captions (Live) (Level AA)**: Provide captions for live broadcasts

**Guideline 1.3: Adaptable**
- **1.3.1 Info and Relationships (Level A)**: Use semantic HTML to convey structure, not visual presentation alone
- **1.3.2 Meaningful Sequence (Level A)**: Content should make sense when read in DOM order
- ✅ Use `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>` — don't use `<div class="nav">`

**Guideline 1.4: Distinguishable**
- **1.4.1 Use of Color (Level A)**: Color is not the only visual means of conveying information
- **1.4.3 Contrast (Minimum) (Level AA)**: Text and images of text have a contrast ratio of at least 4.5:1 (3:1 for large text)
- **1.4.4 Resize Text (Level AA)**: Text can be resized up to 200% without loss of content or functionality
- **1.4.10 Reflow (Level AA)**: Content should not require scrolling in two dimensions at 320px by 256px viewport

### Operable — "Can users operate the interface?"

User interface components and navigation must be operable. The interface cannot require interaction that a user cannot perform.

**Guideline 2.1: Keyboard Accessible**
- **2.1.1 Keyboard (Level A)**: All functionality must be operable through a keyboard interface
- **2.1.2 No Keyboard Trap (Level A)**: Focus must be movable away from any component using only a keyboard

**Guideline 2.4: Navigable**
- **2.4.1 Bypass Blocks (Level A)**: Provide a mechanism to skip repetitive content (skip links)
- **2.4.3 Focus Order (Level A)**: Focus order must preserve meaning and operability
- **2.4.6 Headings and Labels (Level AA)**: Headings and labels should describe topic or purpose
- **2.4.7 Focus Visible (Level AA)**: Any keyboard operable user interface has a mode of operation where the focus indicator is visible

**Guideline 2.5: Input Modalities**
- **2.5.3 Label in Name (Level A)**: The visible text label of a component must match its accessible name
- **2.5.5 Target Size (Level AAA)**: Touch targets should be at least 44px by 44px

### Understandable — "Can users understand the content and interface?"

Information and the operation of the user interface must be understandable.

**Guideline 3.1: Readable**
- **3.1.1 Language of Page (Level A)**: The default human language of each web page can be programmatically determined
- ✅ `<html lang="en">`

**Guideline 3.2: Predictable**
- **3.2.1 On Focus (Level A)**: Changing focus does not cause context changes (no auto-submitting on focus)
- **3.2.2 On Input (Level A)**: Changing input does not automatically cause context changes unless warned

**Guideline 3.3: Input Assistance**
- **3.3.1 Error Identification (Level A)**: Input errors are automatically detected and described to the user
- **3.3.2 Labels or Instructions (Level A)**: Labels or instructions are provided when content requires user input
- **3.3.3 Error Suggestion (Level AA)**: If an input error is detected, suggestions for correction are provided

### Robust — "Can assistive technology parse and interpret the content?"

Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.

**Guideline 4.1: Compatible**
- **4.1.1 Parsing (Level A)**: Elements have complete start and end tags, are nested correctly, do not contain duplicate attributes, and IDs are unique
- **4.1.2 Name, Role, Value (Level A)**: All UI components have a programmatically determinable name, role, and value
- **4.1.3 Status Messages (Level AA)**: Status messages can be programmatically determined through roles or properties (use `aria-live`)

### Conformance Levels

| Level | Standard | What's Expected |
|---|---|---|
| **A** | Minimum | Essential support — removes major barriers. All Level A criteria must be met. |
| **AA** | Target | Acceptable for most organizations and legal requirements. All Level A + AA criteria. |
| **AAA** | Aspirational | Highest level — may not be achievable for all content. All Level A + AA + AAA criteria. |

**Legal context**: Most accessibility lawsuits and regulations (Section 508, EN 301 549, ADA) reference WCAG 2.1 Level AA as the standard.

## Inclusive Design Practices

### Color Contrast

- **Normal text** (< 18px or < 14px bold): Minimum 4.5:1 contrast ratio against background
- **Large text** (≥ 18px or ≥ 14px bold): Minimum 3:1 contrast ratio
- **UI components and graphical objects**: Minimum 3:1 contrast ratio against adjacent colors
- **Non-text contrast**: Icons, borders, and focus indicators need 3:1 minimum

Use tools like WebAIM Contrast Checker, Stark (Figma), or `@axe-core/cli` to verify.

```css
/* Good contrast */
.button-primary {
  background: #0052CC;  /* Blue */
  color: #FFFFFF;       /* White — 5.2:1 ratio ✅ */
}

/* Insufficient contrast */
.button-primary {
  background: #6B9FFF;  /* Light blue */
  color: #FFFFFF;       /* White — 2.8:1 ratio ❌ */
}
```

### Keyboard Navigation

Every interactive element must be reachable and operable via keyboard:

| Key | Expected Behavior |
|---|---|
| Tab | Move focus forward through interactive elements |
| Shift + Tab | Move focus backward |
| Enter / Space | Activate buttons, links, and controls |
| Arrow keys | Navigate within components (menus, tabs, lists, sliders) |
| Escape | Close modals, dropdowns, dismiss popups |

**Focus indicators must never be removed** — unless a custom focus style with sufficient contrast is provided. Never use `outline: none` without a replacement.

```css
/* Acceptable custom focus style */
:focus-visible {
  outline: 2px solid #0052CC;
  outline-offset: 2px;
}

/* Never do this */
*:focus {
  outline: none;  /* ❌ Invisible focus — unusable for keyboard users */
}
```

### Screen Reader Support

- Use semantic HTML by default — it's free accessibility
- Provide `aria-label` or `aria-labelledby` when visual labels aren't sufficient
- Use `aria-describedby` for additional context
- Hide decorative content with `aria-hidden="true"` or `role="presentation"`
- Ensure dynamic content announcements use `aria-live` regions

```html
<!-- Accessible loading button -->
<button aria-busy="true" aria-label="Submitting form, please wait">
  <span class="sr-only">Submitting...</span>
  <span aria-hidden="true">⏳</span>
</button>
```

### Reduced Motion

Respect the user's system preference for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This should not disable essential motion (like a loading spinner that indicates progress) — provide alternative non-moving indicators.

## ARIA — Accessible Rich Internet Applications

### When to Use ARIA

ARIA should be used **only when native HTML semantics are insufficient**.

**The First Rule of ARIA**: If you can use a native HTML element or attribute that has the semantics and behavior you need, use it instead of repurposing an element and adding ARIA.

```html
<!-- ❌ Bad: div with ARIA instead of native button -->
<div role="button" tabindex="0" onclick="submit()">Submit</div>

<!-- ✅ Good: Native button (free keyboard support, form behavior, semantics) -->
<button type="submit">Submit</button>
```

### ARIA Roles

Roles define what an element is or does:

- **Landmark roles**: `navigation`, `main`, `complementary`, `contentinfo`, `banner`, `search`
- **Widget roles**: `button`, `link`, `tab`, `tabpanel`, `dialog`, `tooltip`, `progressbar`
- **Document structure**: `heading`, `list`, `listitem`, `table`, `row`, `cell`
- **Live regions**: `alert`, `status`, `log`, `marquee`, `timer`

### ARIA States and Properties

- **`aria-expanded`**: Indicates whether a collapsible element is open (boolean)
- **`aria-pressed`**: Indicates toggle button state (tri-state)
- **`aria-current`**: Indicates the current item in a set (`page`, `step`, `location`, `date`, `time`, `true`)
- **`aria-selected`**: Indicates current selected item in a list/grid
- **`aria-hidden`**: Hides elements from the accessibility tree
- **`aria-live`**: Announces dynamic content changes (`off`, `polite`, `assertive`)
- **`aria-atomic`**: Specifies whether to announce the entire live region or just changed parts
- **`aria-relevant`**: What types of changes are relevant (`additions`, `removals`, `text`, `all`)

### Common ARIA Patterns

**Modal Dialog**:
```html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-desc">
  <h2 id="dialog-title">Confirm Delete</h2>
  <p id="dialog-desc">This action cannot be undone.</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>
```

**Tab Panel**:
```html
<div role="tablist" aria-label="Documentation">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1" tabindex="0">Overview</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">API</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1" tabindex="0">
  <!-- Content -->
</div>
```

## Testing Methodology

### Automated Testing

Automated tools catch ~30-40% of accessibility issues. They're great for catching low-hanging fruit but cannot replace manual testing.

| Tool | What It Checks | Use Case |
|---|---|---|
| **axe-core** (axe DevTools) | WCAG violations, best practices | CI/CD pipeline, local dev |
| **WAVE** | Visual overlay of a11y issues | Quick page audits |
| **Lighthouse** | Performance + a11y score | Reporting, regression |
| **Pa11y** | CI/CD integration | Automated regression testing |
| **Accessibility Insights** | Automated + guided manual tests | Comprehensive audits |

**CI Integration Example** (using axe-core with Playwright):
```javascript
const { injectAxe, checkAxe } = require('axe-playwright');

test('Homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  const results = await checkAxe(page);
  expect(results.violations).toHaveLength(0);
});
```

### Manual Testing

Automated tools miss context-dependent issues. Manual testing catches the rest.

**Checklist for Manual Testing:**

1. **Keyboard testing**: Tab through the entire page. Is focus visible? Is the order logical? Are there keyboard traps?
2. **Zoom testing**: Zoom to 200%. Does content reflow? Is any content cut off or overlapping?
3. **Color testing**: Use a color blindness simulator. Is information conveyed without relying on color alone?
4. **Reduced motion**: Enable reduced motion in OS settings. Do animations reduce or stop appropriately?
5. **Focus management**: After opening a modal, does focus move into it? Does it return when closed?

### Screen Reader Testing

Test with real screen readers — each behaves differently:

| Screen Reader | Platform | Browser |
|---|---|---|
| **VoiceOver** | macOS, iOS | Safari |
| **NVDA** | Windows | Firefox |
| **JAWS** | Windows | Chrome, Edge |
| **TalkBack** | Android | Chrome |
| **Orca** | Linux | Firefox |

**Testing checklist:**
- Navigate by headings (H key in NVDA/VoiceOver) — is the heading hierarchy logical?
- Navigate by landmarks (D key) — are landmark regions properly used?
- Navigate by links (Tab / K key) — are link texts descriptive out of context?
- Listen to the page read from top to bottom — does the reading order match the visual order?
- Interact with forms — are all labels announced? Are error messages conveyed?

## Common Accessibility Patterns

### Skip Links

Allow keyboard users to bypass repetitive navigation:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>

/* Style */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0052CC;
  color: white;
  padding: 8px;
  z-index: 9999;
}
.skip-link:focus {
  top: 0;
}
```

### Focus Management

When content changes dynamically (modals, navigation, async updates), manage focus intentionally:

```javascript
function openModal(modalElement) {
  modalElement.showModal();  // Using native <dialog> — focus management is built-in
  // For custom modals:
  focusTrap(modalElement);   // Trap focus within modal
  modalElement.querySelector('[autofocus]')?.focus();
}

function closeModal(modalElement, triggerButton) {
  modalElement.close();
  triggerButton.focus();     // Return focus to the element that opened it
}
```

### Live Regions

Announce dynamic content changes without moving the user's focus:

```html
<div aria-live="polite" aria-atomic="true" class="sr-only">
  <!-- Screen reader announces this content when it changes -->
</div>
```

- `aria-live="polite"` — Announce when idle (for non-critical updates)
- `aria-live="assertive"` — Announce immediately (for errors, critical alerts)

### Error Announcements

```html
<form novalidate>
  <label for="email">Email address</label>
  <input
    type="email"
    id="email"
    aria-describedby="email-error"
    aria-invalid="true"
    required
  />
  <span id="email-error" role="alert">
    Please enter a valid email address (e.g., user@example.com)
  </span>
</form>
```

## Scoring & Evaluation

| Criteria | Novice (1) | Competent (2) | Proficient (3) | Expert (4) |
|---|---|---|---|---|
| WCAG Knowledge | Unaware of WCAG | Knows A vs. AA | Knows POUR principles | Can recite specific success criteria |
| Color Contrast | Not checked | Manual checks some text | Verified all text + UI components | Token-based contrast enforcement |
| Keyboard Support | Mouse-only interactions | Basic Tab navigation | Full keyboard patterns + focus visible | Advanced patterns (arrow nav, typeahead) |
| Screen Reader | Not tested | Basic alt text | Navigates with headings/landmarks | Full ARIA patterns + live regions |
| ARIA Usage | No ARIA used | ARIA on everything (overused) | ARIA used appropriately | ARIA used only when HTML insufficient |
| Testing | No testing | Automated tools only | Automated + manual keyboard | Full suite: auto + manual + screen reader + real users |
| Documentation | None | Basic checklist | WCAG alignment documented | Full VPAT / ACR |

## Common Mistakes

### 1. Treating Accessibility as a Checklist
WCAG success criteria are minimum standards, not a complete definition of accessibility. Checking boxes doesn't guarantee a usable experience. Real accessibility requires empathy, testing with real users, and ongoing commitment.

### 2. Removing Focus Indicators
The most common and most damaging mistake. `outline: none` on focus removes the only way keyboard users can track their position on the page. Always provide a visible, high-contrast focus indicator.

### 3. Overusing ARIA
Using ARIA where native HTML would suffice. Adding `role="button"` to a `<div>` instead of using `<button>`. Native elements come with built-in keyboard support, form semantics, and accessibility tree mappings. Don't reinvent what browsers already provide.

### 4. Relying Solely on Automated Testing
Automated tools catch syntax and structural issues but miss context-dependent problems. A form can pass all automated checks and still be unusable with a screen reader because instructions are unclear. Always test manually.

### 5. Color-Only Indicators
Using color alone to convey status, error states, or active states. Users with color blindness cannot distinguish red/green indicators. Always use icons, text, or patterns alongside color.

```html
<!-- ❌ Color only -->
<span style="color: red">Error</span>

<!-- ✅ Color + icon + text -->
<span style="color: red">
  <span aria-hidden="true">⚠</span>
  <span>Error: Connection failed</span>
</span>
```

### 6. Ignoring Reduced Motion
Adding animations without respecting `prefers-reduced-motion`. This can cause nausea, dizziness, and vestibular issues for users with motion sensitivity. Always provide a reduced motion alternative.

### 7. Poor Label-Input Association
Using `placeholder` as a substitute for `<label>`. Placeholders disappear when the user types, have poor contrast by default, and are not reliably announced by screen readers. Always use explicit `<label>` elements.

```html
<!-- ❌ Placeholder as label -->
<input type="email" placeholder="Enter your email" />

<!-- ✅ Proper label -->
<label for="email">Email address</label>
<input type="email" id="email" />
```

### 8. Not Testing with Real Assistive Technology
Simulating a screen reader experience does not replicate the real thing. A VoiceOver user navigates differently than an NVDA user. Test with at least two different screen reader + browser combinations.

### 9. Making Skip Links Invisible
Hiding skip links so they're never keyboard-reachable. Many implementations hide skip links permanently or collapse them to 0 height. Skip links must be accessible when focused via keyboard.

### 10. Forgetting About Cognitive Accessibility
Focusing exclusively on visual and motor disabilities while ignoring cognitive accessibility. Use plain language, consistent navigation, clear error messages, and give users enough time to complete tasks. Cognitive accessibility affects the largest segment of users with disabilities.
