#!/usr/bin/env python3
"""Generate app.js for Mercury Skills Hub."""
import json
import os

DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(DIR, "data", "skills.json")) as f:
    skills_data = json.load(f)

skills_json = json.dumps(skills_data)

js = f"""
// Mercury Skills Hub — app.js
const SKILLS = {skills_json};

let currentView = "home";
const $$ = s => document.querySelectorAll(s);
const $ = s => document.querySelector(s);

function showView(id) {{
  $$(".view").forEach(v => v.classList.remove("active"));
  const el = document.getElementById("view-" + id);
  if (el) el.classList.add("active");
  currentView = id;
}}

function toggleMobile() {{
  document.querySelector(".nav-links")?.classList.toggle("open");
}}

function navigate(view, slug) {{
  toggleMobile();
  if (view === "home") {{ showView("home"); renderHome(); }}
  else if (view === "bookmarks") {{ showView("bookmarks"); renderBookmarks(); }}
  else if (view === "details" && slug) {{ showView("details"); renderDetail(slug); }}
}}

function getLikes() {{ return JSON.parse(localStorage.getItem("mh_likes") || "[]"); }}
function setLikes(a) {{ localStorage.setItem("mh_likes", JSON.stringify(a)); }}
function isLiked(slug) {{ return getLikes().includes(slug); }}
function toggleLike(slug) {{
  let a = getLikes();
  a = a.includes(slug) ? a.filter(s => s !== slug) : [...a, slug];
  setLikes(a);
}}

function getBkm() {{ return JSON.parse(localStorage.getItem("mh_bookmarks") || "[]"); }}
function setBkm(a) {{ localStorage.setItem("mh_bookmarks", JSON.stringify(a)); }}
function isBkm(slug) {{ return getBkm().includes(slug); }}
function toggleBkm(slug) {{
  let a = getBkm();
  a = a.includes(slug) ? a.filter(s => s !== slug) : [...a, slug];
  setBkm(a);
}}

function skillCardHTML(s, trending) {{
  const tags = (s.tags || []).slice(0, 3);
  const liked = isLiked(s.slug) ? "liked" : "";
  const bkm = isBkm(s.slug) ? "bookmarked" : "";
  const icon = s.icon || '⚡';
  const name = escHtml(s.name || '');
  const desc = escHtml(s.description || '');
  const cat = escHtml(s.category || '');
  const slug = s.slug;
  const tagHtml = tags.map(t => '<span class="skill-tag">' + escHtml(t) + '</span>').join('');
  let html = '<div class="skill-card" onclick="navigate(\\'details\\',\\'' + slug + '\\')">';
  if (trending) html += '<span class="trending-badge">🔥 Trending</span>';
  html += '<div class="skill-card-header">'
    + '<div class="skill-icon">' + icon + '</div>'
    + '<div class="skill-card-info">'
    + '<div class="skill-card-name">' + name + '</div>';
  if (cat) html += '<div class="skill-card-category">' + cat + '</div>';
  html += '</div></div>'
    + '<div class="skill-card-desc">' + desc + '</div>'
    + '<div class="skill-card-footer">'
    + '<div class="skill-card-tags">' + tagHtml + '</div>'
    + '<div class="skill-card-actions">'
    + '<button class="action-btn ' + liked + '" onclick="event.stopPropagation();toggleLike(\\'' + slug + '\\');this.classList.toggle(\\'liked\\')" title="Like">❤️</button>'
    + '<button class="action-btn ' + bkm + '" onclick="event.stopPropagation();toggleBkm(\\'' + slug + '\\');this.classList.toggle(\\'bookmarked\\')" title="Bookmark">🔖</button>'
    + '</div></div></div>';
  return html;
}}

function renderHome() {{
  const cats = new Set();
  SKILLS.forEach(s => (s.tags || []).forEach(t => cats.add(t)));
  document.getElementById("total-skills").textContent = SKILLS.length;
  document.getElementById("total-categories").textContent = cats.size;
  document.getElementById("total-installed").textContent = getBkm().length;
  const trending = SKILLS.slice(0, 6);
  document.getElementById("trending-grid").innerHTML = trending.map(s => skillCardHTML(s, true)).join("");
  const catCount = {{}};
  SKILLS.forEach(s => (s.tags || []).forEach(t => {{ catCount[t] = (catCount[t] || 0) + 1; }}));
  const entries = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
  document.getElementById("categories-grid").innerHTML = entries.map(([cat, count]) =>
    '<div class="category-card" onclick="searchCategory(\\'' + cat + '\\')">'
    + '<div class="category-card-header"><span class="category-icon">📂</span><span class="category-name">' + cat + '</span></div>'
    + '<div class="category-count">' + count + ' skill' + (count > 1 ? 's' : '') + '</div>'
    + '<p>Browse all ' + cat + ' skills</p></div>'
  ).join("");
  document.getElementById("categories-section").style.display = "block";
}}

function handleSearch(val) {{
  const q = val.toLowerCase().trim();
  const countEl = document.getElementById("search-count");
  if (!q) {{ countEl.textContent = ""; renderHome(); return; }}
  const results = SKILLS.filter(s =>
    (s.name || "").toLowerCase().includes(q) ||
    (s.description || "").toLowerCase().includes(q) ||
    (s.tags || []).some(t => t.toLowerCase().includes(q)) ||
    (s.category || "").toLowerCase().includes(q)
  );
  countEl.textContent = results.length + " result" + (results.length !== 1 ? "s" : "");
  document.getElementById("trending-grid").innerHTML = results.map(s => skillCardHTML(s, false)).join("");
  document.getElementById("categories-section").style.display = results.length ? "none" : "block";
}}

function searchCategory(cat) {{
  const results = SKILLS.filter(s => (s.tags || []).includes(cat));
  document.getElementById("trending-grid").innerHTML = results.map(s => skillCardHTML(s, false)).join("");
  document.getElementById("categories-section").style.display = "none";
  document.getElementById("search-count").textContent = results.length + " skill" + (results.length !== 1 ? "s" : "");
}}

function renderDetail(slug) {{
  const s = SKILLS.find(x => x.slug === slug);
  if (!s) {{ navigate("home"); return; }}
  const container = document.getElementById("details-container");
  const liked = isLiked(s.slug) ? "liked" : "";
  const bkm = isBkm(s.slug) ? "bookmarked" : "";
  const icon = s.icon || '⚡';
  let bodyHTML = "";
  if (s.body) {{
    if (typeof marked !== "undefined") {{
      try {{ bodyHTML = marked.parse(s.body); }} catch(e) {{ bodyHTML = escHtml(s.body).replace(/\\\\n/g, "<br>"); }}
    }} else {{
      bodyHTML = escHtml(s.body).replace(/\\\\n/g, "<br>");
    }}
  }}
  const tagHtml = (s.tags || []).map(t => '<span class="skill-tag">' + escHtml(t) + '</span>').join('');
  container.innerHTML = ''
    + '<div class="details-header">'
    + '<div class="details-icon">' + icon + '</div>'
    + '<div class="details-title">'
    + '<h1>' + escHtml(s.name) + '</h1>'
    + '<div class="details-meta">'
    + (s.category ? '<span class="details-category">' + escHtml(s.category) + '</span>' : '')
    + (s.github ? '<a href="' + s.github + '" target="_blank" rel="noopener" class="details-github-link">View on GitHub →</a>' : '')
    + '</div>'
    + '<div class="details-actions">'
    + '<button class="details-action-btn ' + liked + '" onclick="toggleLike(\\'' + s.slug + '\\');renderDetail(\\'' + s.slug + '\\')">❤️ ' + (liked ? 'Liked' : 'Like') + '</button>'
    + '<button class="details-action-btn ' + bkm + '" onclick="toggleBkm(\\'' + s.slug + '\\');renderDetail(\\'' + s.slug + '\\')">🔖 ' + (bkm ? 'Bookmarked' : 'Bookmark') + '</button>'
    + '</div></div></div>'
    + (s.description ? '<div class="details-description">' + escHtml(s.description) + '</div>' : '')
    + (tagHtml ? '<div class="details-meta" style="margin-bottom:16px">' + tagHtml + '</div>' : '')
    + (bodyHTML ? '<div class="details-body">' + bodyHTML + '</div>' : '')
    + '<div class="details-install">'
    + '<h3>📦 Install</h3>'
    + '<div class="install-cmd">'
    + '<code>/install skill ' + escHtml(s.slug || s.name) + '</code>'
    + '<button class="copy-btn" onclick="copyText(this,\\'/install skill ' + escHtml(s.slug || s.name) + '\\')">Copy</button>'
    + '</div>'
    + (s.github ? '<div class="install-url">Or clone: <code>' + s.github + '.git</code></div>' : '')
    + '</div>';
}}

function renderBookmarks() {{
  const slugs = getBkm();
  const items = SKILLS.filter(s => slugs.includes(s.slug));
  document.getElementById("bookmarks-grid").innerHTML = items.length
    ? items.map(s => skillCardHTML(s, false)).join("")
    : '<div class="empty-state"><h3>No bookmarks yet</h3><p>Browse skills and bookmark the ones you like!</p></div>';
}}

function copyText(btn, text) {{
  navigator.clipboard.writeText(text).then(() => {{
    btn.textContent = "Copied!";
    setTimeout(() => {{ btn.textContent = "Copy"; }}, 2000);
  }}).catch(() => {{
    btn.textContent = "Error";
  }});
}}

function escHtml(str) {{
  if (!str) return "";
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}}

document.addEventListener("keydown", e => {{
  if (e.key === "/" && e.target.tagName !== "INPUT") {{
    e.preventDefault();
    document.getElementById("search-input")?.focus();
  }}
}});

document.addEventListener("DOMContentLoaded", () => {{
  showView("home");
  renderHome();
}});
"""

with open(os.path.join(DIR, "app.js"), "w") as f:
    f.write(js)
print("Done")
