---
name: zomato-order
description: >-
  Order food from Zomato via browser automation. Uses a two-phase approach:
  Phase 1 (setup) captures login cookies after manual login. Phase 2 (auto-order)
  reuses cookies to create orders and share payment links. No OTP needed after
  initial setup.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: shop-restaurant
  tags:
    - zomato
    - food-ordering
    - browser-automation
    - playwright
    - cookies
    - delivery
---

# Zomato Order Skill 🛵

## Core Principles

Ordering food through Zomato programmatically has a key constraint: **Zomato has no public consumer ordering API**. The only way to automate order creation is through browser automation (Playwright/Puppeteer).

The smartest approach is **cookie-based session reuse**:
1. **Phase 1 — Setup (one-time):** Open a visible browser, let the user log in manually, capture session cookies
2. **Phase 2 — Auto-Order (reusable):** Load saved cookies (auto-logged in), browse restaurants, build cart, generate payment link

This avoids OTP prompts on every order while keeping payment in the user's hands (they pay via the shared link).

---

## How It Works

### Phase 1 —Initial Setup

```bash
node scripts/zomato-order.js --setup
```

1. Opens a visible Chromium browser to Zomato
2. User logs in manually (phone + OTP)
3. User confirms login is complete
4. Session cookies are saved to `/tmp/zomato-cookies.json`
5. Done — no further OTP needed for weeks/months

### Phase 2 — Auto-Order

```bash
node scripts/zomato-order.js
```

1. Loads saved cookies (auto-logged in)
2. Navigates to Zomato, restores session
3. Searches for restaurants in user's default location
4. Waits for user to browse, select items, and add to cart
5. Once at the payment page, captures the URL
6. Shares the **payment link** with the user to complete payment
7. Order is placed once user pays

---

## When To Use This Skill

### Trigger Phrases

| User says | Action |
|-----------|--------|
| "Order food from Zomato" | Run Phase 2 (auto-order). If no cookies, run Phase 1 first |
| "Let's order lunch/dinner" | Same as above |
| "Setup Zomato ordering" | Run Phase 1 (setup) |
| "I need to set up Zomato first" | Run Phase 1 (setup) |
| "Order something for the office" | Run auto-order flow |
| "Can we do Zomato automation?" | Explain the two-phase approach, offer to set up |

### When NOT to use

| Scenario | Reason |
|----------|--------|
| User wants to place order without any interaction | Payment requires user action (UPI/Card OTP) |
| Cookies expired (> 2 months old) | Run Phase 1 setup again |
| User on a different device | Works on the machine where the script runs |

---

## Skill Workflow

### Step 1 — Check Setup State

Check if `/tmp/zomato-cookies.json` exists. If not, the user needs Phase 1 setup first.

### Step 2 — Run Phase 1 (if needed)

```bash
node scripts/zomato-order.js --setup
```

Tell the user:
> "I'll open a browser window. Please log in to Zomato with your phone number. Once you're logged in and your default address (e.g., Gulab Bagh) is set, come back here and press Enter. I'll save your session for future orders."

### Step 3 — Run Phase 2 (auto-order)

```bash
node scripts/zomato-order.js
```

The browser will:
- Load cookies and log in automatically
- Navigate to Zomato with the user's saved address
- Keep the browser open so the user can browse

Tell the user:
> "The browser is open and you're logged in. Search for restaurants, add items to your cart. Once you reach the payment page, stop — don't enter payment details. Come back here and press Enter. I'll grab the payment link so you can pay securely."

### Step 4 — Share the Payment Link

Once the user confirms they're on the payment page, the script captures the URL. Share it clearly:

> **💰 Payment Link:**
> `https://www.zomato.com/...`
>
> Open this link to complete payment. The order will be placed once you pay.

### Step 5 — Handle Cookie Expiry

If Zomato logs out during auto-order (cookies expired), let the user know:
> "Your session has expired. We need to run setup again. Run `node scripts/zomato-order.js --setup` to re-login and capture fresh cookies."

---

## Important Notes

### Security
- **Cookies** are saved in plain JSON at `/tmp/zomato-cookies.json` — readable only by the current user
- **Payment** always goes through the user — the script never handles payment credentials
- **Never share cookie files** — they contain auth tokens

### Dependencies
- Node.js (v18+)
- Playwright (`npm install playwright`)
- Chromium browser (installed via `npx playwright install chromium`)

### Limitations
- Zomato's UI changes occasionally — the selectors may need updating
- Some captchas may appear (rare) — user intervention needed
- Cookie lifetime is typically 2-4 weeks for Zomato

---

## Technical Details

### Cookie File Location
```
/tmp/zomato-cookies.json
```

### Payment Link Output
```
/tmp/zomato-payment-link.txt
```

### Screenshot (debug)
```
/tmp/zomato-state.png
```