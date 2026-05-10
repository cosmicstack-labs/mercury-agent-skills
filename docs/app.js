/* Mercury Skill Library — App */
let skills = [], categories = {}, bookmarks = JSON.parse(localStorage.getItem('mercury-bookmarks')||'[]'), likes = JSON.parse(localStorage.getItem('mercury-likes')||'[]');

function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}

// Load Skills
async function loadSkills(){try{
  const r=await fetch('data/skills.json');
  skills=await r.json();
  const stats=document.getElementById('total-skills');
  if(stats)stats.textContent=skills.length;
  skills.forEach(s=>{if(s.category){if(!categories[s.category])categories[s.category]={name:s.category,icon:s.icon||'📦',desc:s.categoryDesc||'',skills:[]};categories[s.category].skills.push(s)}});
  let tc=document.getElementById('total-categories');if(tc)tc.textContent=Object.keys(categories).length;
  Object.keys(categories).sort();
  renderTrending();renderCategories();
}catch(e){console.error('Failed to load skills:',e);document.querySelector('.trending-grid').innerHTML='<div class="empty-state"><h3>Failed to load skills</h3><p>Make sure skills.json exists.</p></div>'}}

// Navigation
function navigate(view){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));const el=document.getElementById('view-'+view);if(el)el.classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}
function showBookmarks(){navigate('bookmarks');renderBookmarks()}

// Search
function handleSearch(q){
  q=q.toLowerCase().trim();
  const grid=document.getElementById('trending-grid');
  const sec=document.getElementById('trending-section');
  const count=document.getElementById('search-count');
  const all=document.getElementById('categories-grid');
  if(!q){sec.style.display='';all.style.display='';count.textContent='';renderTrending();renderCategories();return}
  sec.style.display='none';all.style.display='none';
  const results=skills.filter(s=>(s.name||'').toLowerCase().includes(q)||(s.description||'').toLowerCase().includes(q)||(s.category||'').toLowerCase().includes(q)||(s.tags||[]).some(t=>t.toLowerCase().includes(q)));
  count.textContent=results.length+' results';
  grid.innerHTML=results.length?results.map(s=>cardHTML(s,!0)).join(''):'<div class="empty-state" style="grid-column:1/-1"><h3>No results found</h3><p>Try a different search term</p></div>'
}

// Render Trending
function renderTrending(){
  const grid=document.getElementById('trending-grid');
  const sorted=[...skills].sort((a,b)=>(b.popularity||0)-(a.popularity||0));
  grid.innerHTML=sorted.slice(0,6).map(s=>cardHTML(s,!0)).join('')
}

// Render Categories
function renderCategories(){
  const grid=document.getElementById('categories-grid');
  grid.innerHTML=Object.entries(categories).sort((a,b)=>b[1].skills.length-a[1].skills.length).map(([key,cat])=>`<div class="category-card" onclick="filterCategory('${key.replace(/'/g,"\\'")}')"><div class="category-card-header"><span class="category-icon">${cat.icon||'📂'}</span><div><div class="category-name">${cat.name}</div><div class="category-count">${cat.skills.length} skills</div></div></div><p>${cat.desc||'Agent-ready skills'}</p></div>`).join('')
}

// Filter by category
function filterCategory(cat){
  const input=document.getElementById('search-input');
  input.value='category:'+cat;
  handleSearch(input.value)
}

// Card HTML
function cardHTML(s,trending){
  const isLiked=likes.includes(s.id);
  const isBm=bookmarks.includes(s.id);
  return `<div class="skill-card" onclick="showDetails('${s.id}')">${trending?'<span class="trending-badge">🔥 Trending</span>':''}<div class="skill-card-header"><span class="skill-icon">${s.icon||'📄'}</span><div class="skill-card-info"><div class="skill-card-name">${s.name||'Unnamed'}</div><div class="skill-card-category">${s.category||'Uncategorized'}</div></div></div><div class="skill-card-desc">${s.description||'No description'}</div><div class="skill-card-footer"><div class="skill-card-tags">${(s.tags||[]).slice(0,3).map(t=>`<span class="skill-tag">${t}</span>`).join('')}</div><div class="skill-card-actions"><button class="action-btn ${isLiked?'liked':''}" onclick="event.stopPropagation();toggleLike('${s.id}')">${isLiked?'❤️':'🤍'}</button><button class="action-btn ${isBm?'bookmarked':''}" onclick="event.stopPropagation();toggleBookmark('${s.id}')">${isBm?'🔖':'🔗'}</button></div></div></div>`
}

// Details
async function showDetails(id){
  navigate('details');
  const s=skills.find(x=>x.id===id);
  if(!s){document.getElementById('details-container').innerHTML='<div class="empty-state"><h3>Skill not found</h3></div>';return}
  const isLiked=likes.includes(s.id),isBm=bookmarks.includes(s.id);
  const body=marked?marked.parse(s.body||''):(s.body||'<p>No details available.</p>');
  document.getElementById('details-container').innerHTML=`<div class="details-header"><span class="details-icon">${s.icon||'📄'}</span><div class="details-title"><h1>${s.name}</h1><div class="details-meta"><span class="details-category">${s.category||'General'}</span><a href="${s.url||'#'}" target="_blank" class="details-github-link"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg> View on GitHub</a></div><div class="details-actions"><button class="details-action-btn ${isLiked?'liked':''}" onclick="toggleLike('${s.id}');showDetails('${s.id}')">${isLiked?'❤️ Liked':'🤍 Like'}</button><button class="details-action-btn ${isBm?'bookmarked':''}" onclick="toggleBookmark('${s.id}');showDetails('${s.id}')">${isBm?'🔖 Bookmarked':'🔗 Bookmark'}</button></div></div></div><div class="details-description">${s.description||'No description'}</div><div class="details-body">${body}</div><div class="details-install"><h3>📦 Installation</h3><div class="install-cmd"><code>install-skill "${s.name}"</code><button class="copy-btn" onclick="copyCmd(this)">Copy</button></div><div class="install-url">Or install from GitHub:<br><code>${s.url||'https://github.com/cosmicstack-labs/mercury-agent-skills/tree/main/skills/'+s.category?.toLowerCase().replace(/ /g,'-')+'/'+s.id}</code></div></div>`;
  if(window.Prism)Prism.highlightAll();
}

// Likes
function toggleLike(id){const i=likes.indexOf(id);if(i>-1)likes.splice(i,1);else likes.push(id);localStorage.setItem('mercury-likes',JSON.stringify(likes));const skill=skills.find(x=>x.id===id);toast(likes.includes(id)?'❤️ Liked '+(skill?skill.name:''):'Removed like')}

// Bookmarks
function toggleBookmark(id){const i=bookmarks.indexOf(id);if(i>-1)bookmarks.splice(i,1);else bookmarks.push(id);localStorage.setItem('mercury-bookmarks',JSON.stringify(bookmarks));const skill=skills.find(x=>x.id===id);toast(bookmarks.includes(id)?'🔖 Bookmarked '+(skill?skill.name:''):'Removed bookmark')}

// Render Bookmarks
function renderBookmarks(){const grid=document.getElementById('bookmarks-grid');const bm=skills.filter(s=>bookmarks.includes(s.id));grid.innerHTML=bm.length?bm.map(s=>cardHTML(s)).join(''):'<div class="empty-state"><h3>No bookmarks yet</h3><p>Click 🔗 on any skill to save it here</p></div>'}

// Copy
function copyCmd(btn){const txt=btn.previousElementSibling.textContent;navigator.clipboard.writeText(txt).then(()=>{btn.textContent='Copied!';setTimeout(()=>btn.textContent='Copy',1500)}).catch(()=>{})}

// Init
document.addEventListener('DOMContentLoaded',loadSkills);

// Load marked.js dynamically for markdown rendering
(function(){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/marked/marked.min.js';s.onload=()=>{document.querySelectorAll('.details-body').forEach(el=>{if(el.dataset.markdown)el.innerHTML=marked.parse(el.dataset.markdown)})};document.head.appendChild(s)})();
