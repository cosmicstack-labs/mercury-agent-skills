#!/usr/bin/env node
/**
 * Zomato Ordering Bot — Managed by Mercury Agent 🤖
 * Skill: zomato-order (categories/shop-restaurant/zomato-order/)
 *
 * A two-phase food ordering bot for Zomato:
 *   --setup   : Phase 1 — Manual login + cookie capture (one-time)
 *   (no flag) : Phase 2 — Auto-order using saved cookies
 *
 * Requirements: Node.js v18+, `npm install playwright`
 *                   `npx playwright install chromium`
 *
 * Cookie file: /tmp/zomato-cookies.json
 * Payment link output: /tmp/zomato-payment-link.txt
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// ─── Configuration ───────────────────────────────────────────────────────────
const COOKIE_PATH = '/tmp/zomato-cookies.json';
const PAYMENT_LINK_PATH = '/tmp/zomato-payment-link.txt';
const SCREENSHOT_PATH = '/tmp/zomato-state.png';
const ZOMATO_URL = 'https://www.zomato.com';
const IS_SETUP = process.argv.includes('--setup');

// ─── Cookie Management ──────────────────────────────────────────────────────

async function loadCookies(context) {
  if (fs.existsSync(COOKIE_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIE_PATH, 'utf8'));
    await context.addCookies(cookies);
    console.log('✅ Cookies loaded — auto-logged in');
    return true;
  }
  return false;
}

async function saveCookies(context) {
  const cookies = await context.cookies();
  fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
  console.log('✅ Cookies saved to', COOKIE_PATH);
}

// ─── Utility Functions ──────────────────────────────────────────────────────

function waitForEnter(msj) {
  return new Promise((resolve) => {
    console.log(`\n${msj}`);
    console.log('⏳ Press ENTER to continue...');
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.pause();
      resolve();
    });
  });
}

function printBanner(title) {
  const line = '='.repeat(46);
  console.log(`\n${line}`);
  console.log(`  ${title}`);
  console.log(`${line}`);
}

// ─── Phase 1: Setup (Manual Login) ─────────────────────────────────────────

async function phaseSetup(page) {
  printBanner('ZOMATO SETUP — PHASE 1');

  console.log('🔄 Opening Zomato...');
  await page.goto(ZOMATO_URL, { waitUntil: 'networkidle', timeout: 30000 });

  console.log('\n📱 Please log in manually in the browser window.');
  console.log('   Steps:');
  console.log('   1. Click "Log in" or the profile icon');
  console.log('   2. Enter your phone number');
  console.log('   3. Enter the OTP sent to your phone');
  console.log('   4. Verify your default delivery address is set');
  console.log('');

  await waitForEnter('   📌 Once logged in, press ENTER here.');

  // Verify login worked
  const currentUrl = page.url();
  console.log('📍 Current page:', currentUrl);

  // Save the session cookies
  await saveCookies(page.context());

  // Take a verification screenshot
  await page.screenshot({ path: SCREENSHOT_PATH });
  console.log('📸 Verification screenshot saved to', SCREENSHOT_PATH);

  console.log('\n🎉 Setup complete!');
  console.log(`   Cookies saved to ${COOKIE_PATH}`);
  console.log('   You can now run the order bot anytime without re-logging in.\n');

  return true;
}

// ─── Phase 2: Auto-Order ────────────────────────────────────────────────────

async function phaseOrder(page) {
  printBanner('ZOMATO ORDER — PHASE 2');

  const loggedIn = await loadCookies(page.context());
  if (!loggedIn) {
    console.log('❌ No saved cookies found.');
    console.log('   Run with --setup first to capture your login session:');
    console.log('   node scripts/zomato-order.js --setup');
    return false;
  }

  console.log('🔄 Opening Zomato...');
  await page.goto(ZOMATO_URL, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for session to restore
  await page.waitForTimeout(4000);

  // Check if we're still logged in
  const loginButton = page.locator('a[href*="login"], button:has-text("Log in"), [data-testid*="login"]').first();
  const isLoggedIn = !(await loginButton.isVisible().catch(() => false));

  if (!isLoggedIn) {
    console.log('⚠️  Session may have expired. Trying to navigate...');
  } else {
    console.log('✅ Logged in successfully!');
  }

  // Take a screenshot of the current state
  await page.screenshot({ path: SCREENSHOT_PATH });
  console.log('📸 Screenshot saved to', SCREENSHOT_PATH);

  // Let the user interact with the browser to build their order
  console.log('\n🛵 Browser is now open and ready.');
  console.log('   What you can do:');
  console.log('   1. Search for a restaurant');
  console.log('   2. Browse the menu');
  console.log('   3. Add items to your cart');
  console.log('   4. Proceed to checkout');
  console.log('');
  console.log('💰 IMPORTANT: Do NOT enter payment details.');
  console.log('   Once you reach the payment/checkout page,');
  console.log('   come back here and press ENTER.');
  console.log('');

  await waitForEnter('   📌 At the payment page? Press ENTER.');

  // Capture the payment URL
  const currentUrl = page.url();

  // Take a screenshot for verification
  await page.screenshot({ path: SCREENSHOT_PATH });
  console.log('📸 Updated screenshot saved to', SCREENSHOT_PATH);

  // Save the payment link
  fs.writeFileSync(PAYMENT_LINK_PATH, currentUrl);
  console.log('\n✅ Payment link saved to', PAYMENT_LINK_PATH);

  // Print the payment link clearly
  console.log('\n' + '─'.repeat(50));
  console.log('💰  YOUR PAYMENT LINK');
  console.log('─'.repeat(50));
  console.log('');
  console.log(currentUrl);
  console.log('');
  console.log('─'.repeat(50));
  console.log('📌 Open this link in your browser to pay.');
  console.log('   Once payment is complete, the order will be placed.');
  console.log('');

  return true;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Check Playwright availability
  try {
    require.resolve('playwright');
  } catch {
    console.error('❌ Playwright is not installed. Run: npm install playwright');
    console.error('   Then: npx playwright install chromium');
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: false,   // Visible browser for interaction
    args: [
      '--disable-blink-features=AutomationControlled',  // Reduce bot detection
      '--no-sandbox',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
    geolocation: { latitude: 28.6139, longitude: 77.2090 },  // Delhi
    permissions: ['geolocation'],
  });

  const page = await context.newPage();

  try {
    let success;
    if (IS_SETUP) {
      success = await phaseSetup(page);
    } else {
      success = await phaseOrder(page);
    }

    if (success) {
      console.log('\n🔄 Browser will close in 30 seconds. Close it manually anytime.\n');
      await page.waitForTimeout(30000);
    }
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    // Try to capture error state
    try {
      await page.screenshot({ path: '/tmp/zomato-error.png' });
      console.log('📸 Error screenshot saved to /tmp/zomato-error.png');
    } catch {}
  } finally {
    await browser.close();
    console.log('✅ Done. Browser closed.');
  }
}

main().catch((err) => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
