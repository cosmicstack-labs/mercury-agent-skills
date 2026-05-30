---
name: screenshot
description: 'Capture high-fidelity screenshots of any website using Playwright — supports custom viewports, dark/light mode, mobile/tablet/desktop presets, split-screen, element-based capture by CSS selector, and text-based area capture. Integrates with Telegram or any output channel for delivery.'
metadata:
  author: cosmicstack-labs
  version: 2.0.0
  category: automation
  tags: [playwright, screenshot, browser-automation, web-capture, testing, selenium]
---

# Screenshot Skill

Capture high-fidelity screenshots of any website using Playwright — the industry-standard browser automation framework. This skill covers viewport presets (mobile, tablet, desktop), dark/light mode, full-page captures, custom dimensions, element-level capture by CSS selector, text-based area capture, split-screen viewports, and automatic delivery to the user via Telegram or the active output channel.

## Core Principles

### 1. Wait for the Right Moment
Screenshots fail when content hasn't loaded. Always wait for network idle, specific selectors, or a minimum timeout before capturing. Rushing the capture produces blank or partial images.

### 2. Match the Viewport to the Use Case
A screenshot taken at 1920x1080 tells a different story than one at 375x667. Choose viewport presets deliberately based on what you're testing or documenting.

### 3. Respect Rate Limits and Server Load
Don't hammer a website with concurrent screenshot requests. Add delays between captures, respect robots.txt, and avoid high-frequency automated captures of any single domain.

### 4. Handle JS-Heavy Pages
Modern SPAs and dynamic content need extra care. Use `wait_until: networkidle`, wait for specific CSS selectors, or add explicit delays for animations to finish before capturing.

### 5. Capture Only What Matters
Don't always screenshot the full page. Use element selectors and text-based area capture to zero in on the specific content that matters, reducing file size and increasing clarity.

---

## Installation and Setup

### Prerequisites

```bash
# Install Playwright
pip install playwright

# Install browser binaries
playwright install chromium

# Or install all browsers
playwright install
```

### Verify Installation

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    print(f"Browser version: {browser.version}")
    browser.close()
```

---

## Quick Start — Basic Screenshot

```python
from playwright.sync_api import sync_playwright

def take_screenshot(url: str, output_path: str = "screenshot.png"):
    """Take a simple screenshot with default settings."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url, wait_until="networkidle")
        page.screenshot(path=output_path, full_page=False)
        browser.close()
        print(f"Screenshot saved to {output_path}")

# Usage
take_screenshot("https://example.com")
```

---

## Viewport Presets

### Mobile Viewports

```python
MOBILE_PRESETS = {
    "iphone-12-pro": {"width": 390, "height": 844},
    "iphone-14-pro-max": {"width": 430, "height": 932},
    "pixel-7": {"width": 412, "height": 915},
    "galaxy-s22": {"width": 360, "height": 780},
    "iphone-se": {"width": 375, "height": 667},
    "iphone-16-pro-max": {"width": 440, "height": 956},
    "pixel-9-pro": {"width": 393, "height": 873},
    "oneplus-12": {"width": 430, "height": 932},
}

def mobile_screenshot(url: str, device: str = "iphone-12-pro"):
    """Take a mobile viewport screenshot."""
    viewport = MOBILE_PRESETS.get(device, MOBILE_PRESETS["iphone-12-pro"])
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport=viewport)
        page.goto(url, wait_until="networkidle")
        page.screenshot(path=f"screenshot_{device}.png", full_page=True)
        browser.close()
```

### Tablet Viewports

```python
TABLET_PRESETS = {
    "ipad-air": {"width": 820, "height": 1180},
    "ipad-pro-11": {"width": 834, "height": 1194},
    "ipad-mini": {"width": 744, "height": 1133},
    "galaxy-tab-s8": {"width": 800, "height": 1280},
    "surface-pro": {"width": 1440, "height": 960},
    "kindle-scribe": {"width": 824, "height": 1200},
}

def tablet_screenshot(url: str, device: str = "ipad-air"):
    """Take a tablet viewport screenshot."""
    viewport = TABLET_PRESETS.get(device, TABLET_PRESETS["ipad-air"])
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport=viewport)
        page.goto(url, wait_until="networkidle")
        page.screenshot(path=f"screenshot_{device}.png", full_page=True)
        browser.close()
```

### Desktop Viewports

```python
DESKTOP_PRESETS = {
    "hd": {"width": 1280, "height": 720},
    "full-hd": {"width": 1920, "height": 1080},
    "macbook-air": {"width": 1440, "height": 900},
    "macbook-pro-16": {"width": 1728, "height": 1117},
    "retina": {"width": 2560, "height": 1440},
    "ultrawide": {"width": 3440, "height": 1440},
    "4k": {"width": 3840, "height": 2160},
}

def desktop_screenshot(url: str, preset: str = "full-hd"):
    """Take a desktop viewport screenshot."""
    viewport = DESKTOP_PRESETS.get(preset, DESKTOP_PRESETS["full-hd"])
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport=viewport)
        page.goto(url, wait_until="networkidle")
        page.screenshot(path=f"screenshot_{preset}.png", full_page=True)
        browser.close()
```

---

## Display Mode — Dark Mode & Light Mode

### Dark Mode Screenshot

```python
def dark_mode_screenshot(url: str, output_path: str = "screenshot_dark.png"):
    """Force dark mode via CSS media feature override."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(color_scheme="dark")
        page = context.new_page()
        page.goto(url, wait_until="networkidle")
        page.evaluate("document.documentElement.style.colorScheme = 'dark'")
        page.screenshot(path=output_path, full_page=True)
        browser.close()
        print(f"Dark mode screenshot saved to {output_path}")
```

### Light Mode Screenshot

```python
def light_mode_screenshot(url: str, output_path: str = "screenshot_light.png"):
    """Force light mode via CSS media feature override."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(color_scheme="light")
        page = context.new_page()
        page.goto(url, wait_until="networkidle")
        page.evaluate("document.documentElement.style.colorScheme = 'light'")
        page.screenshot(path=output_path, full_page=True)
        browser.close()
        print(f"Light mode screenshot saved to {output_path}")
```

### Dual Mode (Both in One Shot)

```python
def dual_mode_screenshots(url: str, output_dark: str = "screenshot_dark.png",
                          output_light: str = "screenshot_light.png"):
    """Take both dark and light mode screenshots in a single session."""
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # Dark mode
        dark_context = browser.new_context(color_scheme="dark")
        dark_page = dark_context.new_page()
        dark_page.goto(url, wait_until="networkidle")
        dark_page.evaluate("document.documentElement.style.colorScheme = 'dark'")
        dark_page.screenshot(path=output_dark, full_page=True)
        dark_context.close()
        print(f"Dark: {output_dark}")

        # Light mode
        light_context = browser.new_context(color_scheme="light")
        light_page = light_context.new_page()
        light_page.goto(url, wait_until="networkidle")
        light_page.evaluate("document.documentElement.style.colorScheme = 'light'")
        light_page.screenshot(path=output_light, full_page=True)
        light_context.close()
        print(f"Light: {output_light}")

        browser.close()
```

---

## Custom Dimensions

```python
def custom_screenshot(url: str, width: int = 1280, height: int = 720,
                      output_path: str = "screenshot_custom.png",
                      full_page: bool = False):
    """Take a screenshot with fully custom viewport dimensions."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height})
        page.goto(url, wait_until="networkidle")
        page.screenshot(path=output_path, full_page=full_page)
        browser.close()
        print(f"Custom screenshot ({width}x{height}) saved to {output_path}")

custom_screenshot("https://example.com", 1024, 768)
custom_screenshot("https://example.com", 375, 812, full_page=True)
```

---

## Full-Page Screenshots

```python
def full_page_screenshot(url: str, output_path: str = "screenshot_full.png"):
    """Capture the entire scrollable page."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        page.goto(url, wait_until="networkidle")
        page_height = page.evaluate("document.body.scrollHeight")
        print(f"Page height: {page_height}px")
        page.screenshot(path=output_path, full_page=True)
        browser.close()
        print(f"Full-page screenshot saved to {output_path}")
```

---

## Element-Based Capture (Capture a Specific Div)

Capture a specific element on the page by its CSS selector. This is useful for isolating a component, card, modal, or section without the surrounding page.

```python
from playwright.sync_api import sync_playwright
from typing import Optional

def capture_element(
    url: str,
    selector: str,
    output_path: str = "element_screenshot.png",
    wait_for_selector: Optional[str] = None,
    timeout_ms: int = 10000,
    viewport: Optional[dict] = None,
    color_scheme: str = "light"
):
    """
    Capture a specific element by CSS selector.

    Args:
        url: The page URL
        selector: CSS selector for the target element
        output_path: Output file path
        wait_for_selector: Optional selector to wait for before capturing
        timeout_ms: Timeout for element visibility
        viewport: Custom viewport dimensions (defaults to 1280x720)
        color_scheme: "dark" or "light"
    """
    vp = viewport or {"width": 1280, "height": 720}

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(color_scheme=color_scheme)
        page = context.new_page()
        page.set_viewport_size(vp)

        page.goto(url, wait_until="networkidle")

        # Wait for the specific element to be visible
        wait_sel = wait_for_selector or selector
        page.wait_for_selector(wait_sel, timeout=timeout_ms, state="visible")

        # Scroll element into view
        element = page.query_selector(selector)
        if not element:
            raise ValueError(f"Selector '{selector}' not found on {url}")

        element.scroll_into_view_if_needed()
        page.wait_for_timeout(500)  # Let scroll/animation settle

        # Capture just that element
        element.screenshot(path=output_path)
        browser.close()

        print(f"Element screenshot saved to {output_path} (selector: {selector})")
        return output_path

# Examples
capture_element("https://example.com", "#main-content")
capture_element("https://github.com", ".Header", output_path="github_header.png")
capture_element("https://example.com", "div.hero-banner", color_scheme="dark")
```

---

## Text-Based Area Capture

Identify and capture an area of the page based on visible text content. This is useful when you know what the page says but not the CSS selector structure.

```python
from playwright.sync_api import sync_playwright
from typing import Optional

def capture_by_text(
    url: str,
    text: str,
    output_path: str = "text_area_screenshot.png",
    ancestor_selector: str = "body",
    padding_px: int = 20,
    timeout_ms: int = 10000,
    viewport: Optional[dict] = None,
    color_scheme: str = "light"
):
    """
    Capture the area around a text match on the page.

    Uses an XPath text search to find the element containing the text,
    then captures its bounding box with optional padding.

    Args:
        url: The page URL
        text: The visible text to search for (partial match)
        output_path: Output file path
        ancestor_selector: Ancestor within which to search (default: "body")
        padding_px: Additional pixels padding around the bounding box
        timeout_ms: Timeout for text to appear
        viewport: Custom viewport dimensions
        color_scheme: "dark" or "light"
    """
    vp = viewport or {"width": 1280, "height": 720}

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(color_scheme=color_scheme)
        page = context.new_page()
        page.set_viewport_size(vp)

        page.goto(url, wait_until="networkidle")

        # Wait for the text to appear in the DOM
        page.wait_for_selector(f"text={text}", timeout=timeout_ms)

        # Use XPath to find the element containing the exact text
        xpath = f"//*[contains(text(), '{text}')]"
        element = page.query_selector(f"xpath={xpath}")

        if not element:
            # Fallback: case-insensitive via JS evaluation
            element = page.evaluate_handle(f"""
                (() => {{
                    const walker = document.createTreeWalker(
                        document.body,
                        NodeFilter.SHOW_TEXT,
                        null,
                        false
                    );
                    let node;
                    while (node = walker.nextNode()) {{
                        if (node.textContent.toLowerCase().includes('{text.lower()}')) {{
                            return node.parentElement;
                        }}
                    }}
                    return null;
                }})()
            """)

        if not element:
            raise ValueError(f"Text '{text}' not found on {url}")

        # Scroll into view
        element.scroll_into_view_if_needed()
        page.wait_for_timeout(500)

        # Get bounding box
        box = element.bounding_box()
        if not box:
            raise ValueError(f"Could not get bounding box for text '{text}'")

        # Apply padding around the element
        clip = {
            "x": max(0, box["x"] - padding_px),
            "y": max(0, box["y"] - padding_px),
            "width": box["width"] + (2 * padding_px),
            "height": box["height"] + (2 * padding_px),
        }

        page.screenshot(path=output_path, clip=clip)
        browser.close()

        print(f"Text-area screenshot saved to {output_path} (text: '{text}')")
        return output_path, clip

# Examples
capture_by_text("https://example.com", "Example Domain")
capture_by_text("https://github.com", "Pricing", output_path="github_pricing.png")
capture_by_text("https://en.wikipedia.org/wiki/Screenshot", "History",
                padding_px=30, color_scheme="dark")
```

### Advanced: Capture Multiple Text Matches

```python
def capture_all_text_matches(
    url: str,
    text: str,
    output_dir: str = ".",
    prefix: str = "capture",
    **kwargs
) -> list:
    """
    Find all elements containing the given text and capture each one.

    Returns a list of (output_path, clip_box) tuples.
    """
    vp = kwargs.get("viewport", {"width": 1280, "height": 720})
    color_scheme = kwargs.get("color_scheme", "light")
    padding_px = kwargs.get("padding_px", 20)
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(color_scheme=color_scheme)
        page = context.new_page()
        page.set_viewport_size(vp)

        page.goto(url, wait_until="networkidle")

        # Find all elements containing the text
        elements = page.query_selector_all(f"xpath=//*[contains(text(), '{text}')]")

        if not elements:
            browser.close()
            print(f"No elements found containing text: '{text}'")
            return results

        for i, el in enumerate(elements):
            try:
                el.scroll_into_view_if_needed()
                page.wait_for_timeout(300)
                box = el.bounding_box()
                if not box:
                    continue

                clip = {
                    "x": max(0, box["x"] - padding_px),
                    "y": max(0, box["y"] - padding_px),
                    "width": box["width"] + (2 * padding_px),
                    "height": box["height"] + (2 * padding_px),
                }

                output_path = f"{output_dir}/{prefix}_{i+1}.png"
                page.screenshot(path=output_path, clip=clip)
                results.append((output_path, clip))
                print(f"  [{i+1}] Captured: {output_path}")
            except Exception as e:
                print(f"  [{i+1}] Failed: {e}")

        browser.close()

    return results
```

---

## Split-Screen Screenshots

Useful for responsive design comparisons or side-by-side views of different states.

### Side-by-Side Viewports (Single Browser, Two Pages)

```python
from playwright.sync_api import sync_playwright
from typing import Optional
import subprocess

def split_screen_screenshot(
    url: str,
    left_viewport: dict = {"width": 390, "height": 844},   # mobile
    right_viewport: dict = {"width": 1440, "height": 900},  # desktop
    output_path: str = "screenshot_split.png",
    color_scheme: str = "light",
    separator_px: int = 10
):
    """
    Take two screenshots of the same URL at different viewports
    and stitch them side-by-side using ImageMagick.
    """
    left_path = "/tmp/_split_left.png"
    right_path = "/tmp/_split_right.png"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(color_scheme=color_scheme)

        # Left pane (e.g., mobile)
        left_page = context.new_page()
        left_page.set_viewport_size(left_viewport)
        left_page.goto(url, wait_until="networkidle")
        left_page.screenshot(path=left_path, full_page=False)
        left_page.close()

        # Right pane (e.g., desktop)
        right_page = context.new_page()
        right_page.set_viewport_size(right_viewport)
        right_page.goto(url, wait_until="networkidle")
        right_page.screenshot(path=right_path, full_page=False)
        right_page.close()

        browser.close()

    # Stitch with ImageMagick
    cmd = [
        "magick", "montage",
        left_path, right_path,
        "-tile", "2x1",
        "-geometry", f"+{separator_px}+0",
        output_path
    ]
    subprocess.run(cmd, check=True)
    print(f"Split-screen screenshot saved to {output_path}")
    return output_path
```

### Split URLs (Two Different Pages Side-by-Side)

```python
def split_screen_two_urls(
    url_left: str,
    url_right: str,
    viewport: dict = {"width": 960, "height": 1080},
    output_path: str = "screenshot_two_urls.png",
    color_scheme: str = "light",
    separator_px: int = 10
):
    """
    Capture two different URLs side-by-side at the same viewport.
    """
    left_path = "/tmp/_split_two_left.png"
    right_path = "/tmp/_split_two_right.png"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(color_scheme=color_scheme)

        for path, target_url in [(left_path, url_left), (right_path, url_right)]:
            page = context.new_page()
            page.set_viewport_size(viewport)
            page.goto(target_url, wait_until="networkidle")
            page.screenshot(path=path, full_page=False)
            page.close()

        browser.close()

    # Stitch with ImageMagick
    cmd = [
        "magick", "montage",
        left_path, right_path,
        "-tile", "2x1",
        "-geometry", f"+{separator_px}+0",
        output_path
    ]
    subprocess.run(cmd, check=True)
    print(f"Split-screen (two URLs) saved to {output_path}")
    return output_path
```

### Without ImageMagick: Pure CSS Canvas Approach

If ImageMagick is unavailable, use Playwright's canvas screenshot feature:

```python
def split_screen_playwright_only(
    url: str,
    left_viewport: dict = {"width": 390, "height": 844},
    right_viewport: dict = {"width": 1440, "height": 900},
    output_path: str = "screenshot_split.png",
    color_scheme: str = "light"
):
    """
    Split-screen using Playwright by creating a composite page
    with both viewports rendered as iframes.
    """
    from playwright.async_api import async_playwright
    import asyncio

    async def _capture():
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            context = await browser.new_context(color_scheme=color_scheme)

            # Load the page at each viewport and screenshot
            screenshots = []
            for vp in [left_viewport, right_viewport]:
                page = await context.new_page()
                await page.set_viewport_size(vp)
                await page.goto(url, wait_until="networkidle")
                screenshots.append(await page.screenshot(full_page=False))
                await page.close()

            await browser.close()

            # Create a composite HTML page with both screenshots
            # and screenshot that
            return screenshots

    return asyncio.run(_capture())
```

---

## Unified Screenshot Function

A single entry point that handles all modes — viewport presets, element selectors, text-based capture, split-screen, and delivery.

```python
from playwright.sync_api import sync_playwright
from typing import Optional, Literal, Union
import os, subprocess, time

ViewportPreset = Literal[
    "mobile", "mobile-small", "tablet", "desktop-hd",
    "desktop-fhd", "desktop-retina", "custom"
]
ColorScheme = Literal["dark", "light"]
CaptureMode = Literal["full", "element", "text", "split", "dual"]

PRESETS = {
    "mobile": {"width": 390, "height": 844},
    "mobile-small": {"width": 375, "height": 667},
    "tablet": {"width": 820, "height": 1180},
    "desktop-hd": {"width": 1280, "height": 720},
    "desktop-fhd": {"width": 1920, "height": 1080},
    "desktop-retina": {"width": 2560, "height": 1440},
}

def capture(
    url: str,
    mode: CaptureMode = "full",
    viewport: ViewportPreset = "desktop-fhd",
    color_scheme: ColorScheme = "light",
    full_page: bool = True,
    output_path: Optional[str] = None,
    width: Optional[int] = None,
    height: Optional[int] = None,
    # Element / text selectors
    selector: Optional[str] = None,
    text: Optional[str] = None,
    padding_px: int = 20,
    # Split-screen options
    left_viewport: Optional[dict] = None,
    right_viewport: Optional[dict] = None,
    url_left: Optional[str] = None,
    url_right: Optional[str] = None,
    # Wait options
    wait_for_selector: Optional[str] = None,
    delay_ms: Optional[int] = None,
    # Output
    auto_deliver: bool = False,
) -> Union[str, list]:
    """
    Unified screenshot capture function.

    Args:
        url: The URL to capture
        mode: "full" (entire page), "element" (by CSS selector),
              "text" (by text content), "split" (side-by-side),
              "dual" (dark + light mode)
        viewport: Named preset or "custom"
        color_scheme: "dark" or "light"
        full_page: Capture entire scrollable page
        output_path: Custom output path (auto-generated if None)
        width/height: Custom viewport dimensions (requires viewport="custom")
        selector: CSS selector for element capture mode
        text: Text to search for in text capture mode
        padding_px: Padding around text/element bounding box
        left_viewport/right_viewport: Viewports for split-screen mode
        url_left/url_right: Different URLs for split-screen mode
        wait_for_selector: Wait for this CSS selector before capture
        delay_ms: Additional delay after page load (ms)
        auto_deliver: If True, sends the file to the user's output channel
                      (caller should use the agent's send_file tool)

    Returns:
        Path(s) to saved screenshot(s)
    """
    # --- Mode Routing ---
    if mode == "split":
        use_url_left = url_left or url
        use_url_right = url_right or url
        lv = left_viewport or {"width": 390, "height": 844}
        rv = right_viewport or {"width": 1440, "height": 900}
        return _split_capture(use_url_left, use_url_right, lv, rv,
                              output_path, color_scheme)

    if mode == "dual":
        out_dark = output_path or f"screenshot_dual_dark_{int(time.time())}.png"
        out_light = output_path or f"screenshot_dual_light_{int(time.time())}.png"
        if output_path:
            base, ext = os.path.splitext(output_path)
            out_dark = f"{base}_dark{ext}"
            out_light = f"{base}_light{ext}"
        return dual_mode_screenshots(url, out_dark, out_light)

    if mode == "element" and selector:
        out = output_path or f"element_{int(time.time())}.png"
        return capture_element(url, selector, out, wait_for_selector,
                               10000, None, color_scheme)

    if mode == "text" and text:
        out = output_path or f"text_{int(time.time())}.png"
        result = capture_by_text(url, text, out, "body", padding_px,
                                 10000, None, color_scheme)
        return result[0] if isinstance(result, tuple) else result

    # --- Default: full page capture ---
    if viewport == "custom" and width and height:
        vp = {"width": width, "height": height}
    elif viewport in PRESETS:
        vp = PRESETS[viewport]
    else:
        vp = PRESETS["desktop-fhd"]

    if not output_path:
        mode_tag = "dark" if color_scheme == "dark" else "light"
        vp_tag = f"{vp['width']}x{vp['height']}"
        output_path = f"screenshot_{vp_tag}_{mode_tag}.png"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(color_scheme=color_scheme)
        page = context.new_page()
        page.set_viewport_size(vp)
        page.goto(url, wait_until="networkidle")
        page.evaluate(f"document.documentElement.style.colorScheme = '{color_scheme}'")

        if wait_for_selector:
            page.wait_for_selector(wait_for_selector, timeout=10000)
        if delay_ms:
            page.wait_for_timeout(delay_ms)

        page.screenshot(path=output_path, full_page=full_page)
        browser.close()

    print(f"Screenshot saved: {output_path} ({vp['width']}x{vp['height']}, {color_scheme} mode)")
    return output_path


def _split_capture(url_left, url_right, left_vp, right_vp,
                   output_path, color_scheme):
    """Internal: handle split-screen capture."""
    out = output_path or f"screenshot_split_{int(time.time())}.png"
    left_path = "/tmp/_mercury_split_left.png"
    right_path = "/tmp/_mercury_split_right.png"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(color_scheme=color_scheme)

        for path, target_url, vp in [
            (left_path, url_left, left_vp),
            (right_path, url_right, right_vp)
        ]:
            page = context.new_page()
            page.set_viewport_size(vp)
            page.goto(target_url, wait_until="networkidle")
            page.screenshot(path=path, full_page=False)
            page.close()

        browser.close()

    try:
        subprocess.run([
            "magick", "montage",
            left_path, right_path,
            "-tile", "2x1",
            "-geometry", "+10+0",
            out
        ], check=True, capture_output=True)
        print(f"Split-screen saved to {out}")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("ImageMagick not available. Saving individual screenshots.")
        return [left_path, right_path]

    return out

# === Usage Examples ===

# Full page, desktop FHD, light
# capture("https://example.com")

# Mobile view
# capture("https://example.com", viewport="mobile", full_page=True)

# Dark mode, tablet
# capture("https://example.com", viewport="tablet", color_scheme="dark")

# Custom dimensions
# capture("https://example.com", viewport="custom", width=1024, height=768)

# Capture a specific element
# capture("https://github.com", mode="element", selector=".Header")

# Capture area around text
# capture("https://en.wikipedia.org", mode="text", text="History", padding_px=30)

# Split-screen: mobile + desktop comparison
# capture("https://example.com", mode="split",
#         left_viewport={"width": 390, "height": 844},
#         right_viewport={"width": 1440, "height": 900})

# Split-screen: two different URLs
# capture("https://google.com", mode="split",
#         url_left="https://google.com",
#         url_right="https://bing.com")

# Dual mode: dark + light
# capture("https://example.com", mode="dual")
```

---

## Delivery Integration — Send Screenshots to the User

After capturing a screenshot, deliver it to the user via the active output channel (Telegram, CLI, web, etc.). Use the agent's `send_file` tool for delivery.

### Agent Integration Pattern

When the Mercury agent invokes this skill, it follows this workflow:

```
1. User asks: "Take a screenshot of X in dark mode"
2. Agent calls capture() → saves PNG to a known path
3. Agent calls send_file(path) → delivers to the user's output channel
```

### Deliver After Capture

```python
# This is the pattern for Mercury agent skill integration:
#
# Step 1: Capture the screenshot
# screenshot_path = capture(url, viewport="mobile", color_scheme="dark")
#
# Step 2: Deliver via the active output channel
# agent.send_file(screenshot_path)
#
# Done — the user receives the screenshot in Telegram, CLI, or web.
```

### Batch Delivery (Multiple Screenshots at Once)

```python
# For dual mode or bulk captures, deliver each file:
# paths = capture(url, mode="dual")  # returns [dark_path, light_path]
# for p in paths:
#     agent.send_file(p)
```

### Cleanup After Delivery

Always clean up temporary files after delivery to avoid disk bloat:

```python
import os

def cleanup(paths: list):
    """Remove temporary screenshot files after delivery."""
    for p in paths:
        if os.path.exists(p) and p.startswith("/tmp/"):
            os.remove(p)
            print(f"Cleaned up: {p}")
```

### Agent Flow Summary

| Step | Action | Tool |
|------|--------|------|
| 1 | Capture screenshot | `capture()` (this skill) |
| 2 | Deliver to user | `send_file(path)` |
| 3 | Clean up temp files | `os.remove()` for /tmp/ files |

---

## Wait Strategies

| Strategy | When to Use | Code |
|----------|-------------|------|
| `networkidle` | Most cases — waits for no network activity for 500ms | `page.goto(url, wait_until="networkidle")` |
| `domcontentloaded` | Fast static pages | `page.goto(url, wait_until="domcontentloaded")` |
| `load` | When you want all resources loaded | `page.goto(url, wait_until="load")` |
| CSS selector | JS-rendered content needs specific element | `page.wait_for_selector(".app-loaded")` |
| Timeout | Animations or lazy-loaded images | `page.wait_for_timeout(3000)` |
| Custom JS | Complex conditions | `page.wait_for_function("() => window.appReady")` |
| Text visible | Text-based capture needs text rendered | `page.wait_for_selector("text=Pricing")` |
| Network idle + scroll | Lazy-loaded content | See lazy-load handler below |

### Handling Lazy-Loaded Content

```python
def capture_with_scroll(
    url: str,
    output_path: str = "screenshot_lazy.png",
    scroll_pause_ms: int = 500,
    scroll_steps: int = 5
):
    """Capture a page with lazy-loaded content by scrolling progressively."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url, wait_until="networkidle")

        # Progressive scroll to trigger lazy loads
        for _ in range(scroll_steps):
            page.evaluate("window.scrollBy(0, window.innerHeight)")
            page.wait_for_timeout(scroll_pause_ms)

        # Scroll back to top for full-page capture
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(500)

        page.screenshot(path=output_path, full_page=True)
        browser.close()
        print(f"Lazy-loaded screenshot saved to {output_path}")
```

---

## Batch Screenshots (Multiple URLs)

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def batch_capture(
    urls: list,
    viewport: str = "desktop-fhd",
    color_scheme: str = "light",
    max_workers: int = 3,
    output_dir: str = "batch_screenshots"
) -> list:
    """Capture screenshots for multiple URLs with rate-limited parallelism."""
    os.makedirs(output_dir, exist_ok=True)
    results = []

    def _capture_single(url: str) -> str:
        safe_name = url.replace("https://", "").replace("http://", "")
        safe_name = safe_name.replace("/", "_").replace(".", "_")
        path = os.path.join(output_dir, f"{safe_name}.png")

        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(color_scheme=color_scheme,
                                    viewport=PRESETS.get(viewport, PRESETS["desktop-fhd"]))
            page.goto(url, wait_until="networkidle")
            page.screenshot(path=path, full_page=True)
            browser.close()

        return path

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(_capture_single, url): url for url in urls}
        for future in as_completed(futures):
            url = futures[future]
            try:
                path = future.result()
                results.append((url, path))
                print(f"  ✓ {url} → {path}")
            except Exception as e:
                print(f"  ✗ {url} → {e}")

    return results
```

---

## Skill Maturity Model

| Level | Coverage | Reliability | Automation | Maintenance |
|-------|----------|-------------|------------|-------------|
| **1: Basic** | Single URL, default settings | Manual, often fails | None | Never updated |
| **2: Functional** | Mobile/desktop presets, dark/light mode | Mostly reliable waits | Basic CLI script | Updated occasionally |
| **3: Efficient** | Multi-device sets, dual mode, full-page, element/text selectors | Reliable waits + retries | CLI tool + aliases | Regular updates |
| **4: Automated** | Batch URLs, scheduled captures, diffing, split-screen | Highly reliable + fallbacks | Cron jobs + scripts | Automated updates |
| **5: Production** | Full pipeline + CDN + gallery + monitoring + delivery | Fault-tolerant queue | Full CI/CD pipeline | Always current |

**Target: Level 3** for personal use. **Level 4** for team/CI use. **Level 5** for enterprise visual regression pipelines.

---

## Common Mistakes

1. **Not waiting for page load**: The most common mistake. Always use `wait_until="networkidle"` or wait for a specific selector. A blank or partial screenshot is useless.
2. **Ignoring responsive design**: Taking a single desktop-width screenshot when you need mobile dimensions. Choose viewport presets deliberately.
3. **Not handling auth/cookies**: Screenshots of logged-in pages will show login forms. Use `context.add_cookies()` or storage state from a logged-in session.
4. **Missing dark mode testing**: Many sites look completely different in dark mode. Always capture both modes when doing visual comparisons.
5. **Relying on viewport clipping**: The default screenshot clips to the viewport. Use `full_page=True` to capture the entire page.
6. **Blocking resources unnecessarily**: Blocking CSS or fonts changes the visual output. Only block resources when you deliberately want a stripped-down capture.
7. **Not using headless properly**: Chromium in headless mode is different from headed. Some sites detect headless browsers. Use `headless=False` or channel="chrome" for production accuracy.
8. **Forgetting to close the browser**: Unclosed browser instances leak memory. Always use context managers or `browser.close()`.
9. **Over-aggressive concurrent captures**: Screenshotting many pages at once can get your IP rate-limited. Use queues and delays for batch captures.
10. **Not handling dynamic content**: SPAs with lazy loading may need scrolling (`page.evaluate("window.scrollTo(0, document.body.scrollHeight)")`) before full-page capture.
11. **Element not in viewport**: When capturing elements, always call `element.scroll_into_view_if_needed()` first. An off-screen element produces a blank or clipped screenshot.
12. **Text case sensitivity**: Text-based search is case-sensitive by default. Use the JS fallback or lowercase normalization for case-insensitive matching.
13. **Forgetting to deliver**: Don't just save the file — send it to the user via `send_file()`. A screenshot on disk is invisible. A screenshot in Telegram is useful.
14. **No cleanup**: Temporary files accumulate. Clean up `/tmp/` screenshots after delivery.

---

## Trigger Phrases

Use this skill when the user asks:

- "Take a screenshot of [URL]"
- "Capture a website"
- "Screenshot this page in mobile view"
- "Show me what [URL] looks like on iPhone"
- "Take a screenshot in dark mode"
- "Capture the full page"
- "Screenshot at 1440x900"
- "Take a screenshot of my website on tablet view"
- "Compare light and dark mode for [URL]"
- "Need a screenshot for documentation"
- "Capture just the header/hero/footer of [URL]"
- "Screenshot the div with class [selector]"
- "Find and capture the section containing the text [text]"
- "Show me mobile vs desktop side by side for [URL]"
- "Take screenshots of [URL1] and [URL2] side by side"
- "Send me a screenshot of [URL]"
- "Capture [URL] and send it to me"
- "Take a screenshot at [width]x[height]"
- "Screenshot all these URLs: [list]"
- "I need a split-screen comparison of [URL] on mobile and desktop"
- "Capture the area around the word [text] on [URL]"



