#!/usr/bin/env python3
"""Generate app.js and style.css for Mercury Skills Hub."""
import json, os, textwrap

DIR = os.path.dirname(os.path.abspath(__file__))

# ── Load skills data ──
with open(os.path.join(DIR, "data", "skills.json")) as f:
    skills = json.load(f)

# ── APP.JS ──
js = """
// Mercury Skills Hub — app.js
const skills = """ + json.dumps(skills) + r""";

let currentView = 'home';
let selectedSkill = null;

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function init() {
  renderHome();
  setupSearch();
  setupNavigation();
  window.addEventListener('hashchange', handleRouting);
  handleRouting();
}

function handleRouting() {
  const hash = window.location.hash.slice(1) || 'home';
  if (hash.startsWith('skill/')) {
    const slug = hash.replace('skill/', '');
    const skill = skills.find(s => s.slug === slug);
    if (skill) {
      currentView = 'detail';
      selectedSkill = skill;
      renderDetail(skill);
      return;
    }
  }
  if (hash === 'bookmarks') {
    currentView = 'bookmarks';
    renderBookmarks();
    return;
  }
  currentView = 'home';
  renderHome();
}

function renderHome() {
  const main = $('#main-content');
  if (!main) return;
  // Trending
  const trending = skills.slice(0, 6);
  let html = `
  <section class="hero">
    <h1>Mercury Skills Hub</h1>
    <p class="hero-subtitle">A curated directory of ${skills.length} AI agent skills, built by <strong>Cosmic Stack</strong></p>
    <div class="search-box">
      <input type="text" id="search-input" placeholder="Search skills, categories, tags..." autofocus />
      <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    </div>
  </section>
  <section class="trending">
    <div class="section-header"><h2>🔥 Trending Skills</h2><a href="#" class="view-all" onclick="event.preventDefault();showAll()">View all \u2192</a></div>
    <div class="skills-grid" id="trending-grid">${trending.map(skillCard).join('')}</div>
  </section>
  <section class="categories">
    <h2>Explore by Category</h2>
    <div class="categories-grid" id="categories-grid">${renderCategories()}</div>
  </section>`;
  main.innerHTML = html;
  document.getElementById('search-input')?.addEventListener('input', handleSearch);
  currentView = 'home';
}

function renderCategories() {
  const cats = {};
  skills.forEach(s => { (s.tags || []).forEach(t => { cats[t] = (cats[t] || 0) + 1; }); });
  return Object.entries(cats).sort((a,b) => b[1]-a[1]).map(([cat, count]) => `
    <a class="category-card" href="#" onclick="event.preventDefault();searchCategory('${cat}')">
      <span class="cat-name">${cat}</span>
      <span class="cat-count">${count} skill${count>1?'s':''}</span>
    </a>
  `).join('');
}

function skillCard(s) {
  const tags = (s.tags || []).slice(0, 3);
  return `
  <a class="skill-card" href="#skill/${s.slug}">
    <div class="card-header">
      <h3>${s.name}</h3>
      <button class="btn-like ${isLiked(s.slug)?'liked':''}" onclick="event.stopPropagation();event.preventDefault();toggleLike('${s.slug}')" title="Like">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked(s.slug)?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
    </div>
    <p class="card-desc">${s.description || ''}</p>
    <div class="card-footer">
      <div class="card-tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <button class="btn-bookmark ${isBookmarked(s.slug)?'bookmarked':''}" onclick="event.stopPropagation();event.preventDefault();toggleBookmark('${s.slug}')" title="Bookmark">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${isBookmarked(s.slug)?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>
    </div>
  </a>`;
}

function renderDetail(skill) {
  const main = $('#main-content');
  if (!main) return;
  const tags = (skill.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  
  // Try to render markdown body
  let bodyHTML = '';
  if (skill.body) {
    if (typeof marked !== 'undefined') {
      try { bodyHTML = marked.parse(skill.body); } catch(e) { bodyHTML = escapeHtml(skill.body); }
    } else {
      bodyHTML = escapeHtml(skill.body);
    }
  }
  
  main.innerHTML = `
  <div class="detail-view">
    <a href="#home" class="back-link">&larr; Back to all skills</a>
    <div class="detail-card">
      <div class="detail-header">
        <h1>${skill.name}</h1>
        <div class="detail-actions">
          <button class="btn-action ${isLiked(skill.slug)?'liked':''}" onclick="toggleLike('${skill.slug}');renderDetail(selectedSkill)" title="Like">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked(skill.slug)?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>${isLiked(skill.slug)?'Liked':'Like'}</span>
          </button>
          <button class="btn-action ${isBookmarked(skill.slug)?'bookmarked':''}" onclick="toggleBookmark('${skill.slug}');renderDetail(selectedSkill)" title="Bookmark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked(skill.slug)?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            <span>${isBookmarked(skill.slug)?'Bookmarked':'Bookmark'}</span>
          </button>
        </div>
      </div>
      <div class="detail-meta">
        <div class="detail-tags">${tags}</div>
        ${skill.category ? `<span class="detail-category">${skill.category}</span>` : ''}
      </div>
      ${skill.description ? `<p class="detail-desc">${skill.description}</p>` : ''}
      <div class="detail-body">${bodyHTML}</div>
      ${skill.github ? `<div class="detail-github"><a href="${skill.github}" target="_blank" rel="noopener">View on GitHub \u2192</a></div>` : ''}
      <div class="detail-install">
        <h3>Install</h3>
        <div class="install-cmd">
          <code>/install skill ${skill.slug || skill.name}</code>
          <button class="btn-copy" onclick="copyText(this)" data-copy="/install skill ${skill.slug || skill.name}">Copy</button>
        </div>
      </div>
    </div>
  </div>`;
  currentView = 'detail';
  selectedSkill = skill;
}

function renderBookmarks() {
  const main = $('#main-content');
  if (!main) return;
  const bks = getBookmarks();
  const items = skills.filter(s => bks.includes(s.slug));
  main.innerHTML = `
  <div class="bookmarks-view">
    <a href="#home" class="back-link">&larr; Back to all skills</a>
    <h1>Bookmarked Skills</h1>
    ${items.length ? `<div class="skills-grid">${items.map(skillCard).join('')}</div>` : '<p class="empty-state">No bookmarks yet. Browse skills and bookmark the ones you like!</p>'}
  </div>`;
  currentView = 'bookmarks';
}

function showAll() {
  renderSearchResults(skills, 'All Skills');
}

function searchCategory(cat) {
  const results = skills.filter(s => (s.tags || []).includes(cat));
  renderSearchResults(results, `Category: ${cat}`);
}

function handleSearch(e) {
  const q = e.target.value.toLowerCase().trim();
  if (!q) { renderHome(); return; }
  const results = skills.filter(s =>
    (s.name || '').toLowerCase().includes(q) ||
    (s.description || '').toLowerCase().includes(q) ||
    (s.body || '').toLowerCase().includes(q) ||
    (s.tags || []).some(t => t.toLowerCase().includes(q)) ||
    (s.category || '').toLowerCase().includes(q)
  );
  renderSearchResults(results, `Results for "${q}"`);
}

function renderSearchResults(results, title) {
  const main = $('#main-content');
  if (!main) return;
  main.innerHTML = `
  <div class="search-results">
    <a href="#home" class="back-link">&larr; Back</a>
    <h2>${title}</h2>
    <p class="result-count">${results.length} skill${results.length!==1?'s':''} found</p>
    ${results.length ? `<div class="skills-grid">${results.map(skillCard).join('')}</div>` : '<p class="empty-state">No skills match your criteria.</p>'}
  </div>`;
}

function setupSearch() {
  // handled by event delegation on #search-input
}

function setupNavigation() {
  // Mobile menu
  document.querySelector('.menu-btn')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('open');
  });
}

// ── Like / Bookmark ──
function getLikes() { return JSON.parse(localStorage.getItem('mh_likes') || '[]'); }
function setLikes(arr) { localStorage.setItem('mh_likes', JSON.stringify(arr)); }
function isLiked(slug) { return getLikes().includes(slug); }
function toggleLike(slug) {
  let likes = getLikes();
  if (likes.includes(slug)) likes = likes.filter(s => s !== slug);
  else likes.push(slug);
  setLikes(likes);
  // re-render current view to update UI
  const hash = window.location.hash.slice(1) || 'home';
  handleRouting();
}

function getBookmarks() { return JSON.parse(localStorage.getItem('mh_bookmarks') || '[]'); }
function setBookmarks(arr) { localStorage.setItem('mh_bookmarks', JSON.stringify(arr)); }
function isBookmarked(slug) { return getBookmarks().includes(slug); }
function toggleBookmark(slug) {
  let bks = getBookmarks();
  if (bks.includes(slug)) bks = bks.filter(s => s !== slug);
  else bks.push(slug);
  setBookmarks(bks);
  const hash = window.location.hash.slice(1) || 'home';
  handleRouting();
}

function copyText(btn) {
  const text = btn.getAttribute('data-copy');
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  }).catch(() => {
    btn.textContent = 'Error';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  });
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

document.addEventListener('DOMContentLoaded', init);
"""

with open(os.path.join(DIR, "app.js"), "w") as f:
    f.write(js)
print("✅ app.js written")
