// ===================================
// SIGNIX APP.JS - WITH YOUR REAL VIDEOS
// ===================================

// KSL DATABASE - Your actual files from GitHub
const KSL_DATA = {
  greetings: [
    { 
      id: "hello",
      title: "Hello / Habari", 
      gloss: "HABARI", 
      level: "Beginner", 
      video: "Hello-ksl.mp4",
      description: "Standard KSL greeting used any time of day",
      source: "local"
    }
  ],
  family: [
    { 
      id: "family-members",
      title: "Family Members", 
      gloss: "JAMII", 
      level: "Beginner", 
      video: "family members-ksl.mp4",
      description: "Signs for mother, father, brother, sister",
      source: "local"
    }
  ],
  numbers: [
    { 
      id: "alphabet-numbers",
      title: "KSL Alphabet & Numbers", 
      gloss: "ALFABETI NA NAMBA", 
      level: "Beginner", 
      video: "ksl_alphabet_numbers_web_v0.2.pdf",
      description: "Fingerspelling A-Z and numbers 1-100 - PDF download",
      source: "pdf"
    }
  ],
  time: [
    { 
      id: "telling-time",
      title: "Telling Time", 
      gloss: "KUSEMA SAA", 
      level: "Beginner", 
      video: "telling time-ksl.mp4",
      description: "How to sign time in KSL - hours, today, tomorrow",
      source: "local"
    }
  ],
  school: [
    { 
      id: "school",
      title: "School / Shule", 
      gloss: "SHULE", 
      level: "Intermediate", 
      video: "school sign-ksl.mp4",
      description: "Educational institution sign",
      source: "local"
    }
  ],
  grammar: [],
  storytelling: [],
  workplace: []
};

// ===================================
// STATE MANAGEMENT
// ===================================
let completedCards = JSON.parse(localStorage.getItem('signixCompleted') || '[]');
let revisionDeck = JSON.parse(localStorage.getItem('signixRevision') || '[]');

// ===================================
// PAGE ROUTING
// ===================================
function switchPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.add('active');
  
  document.querySelectorAll('.topbar a').forEach(a => a.classList.remove('active'));
  document.querySelector(`.topbar a[data-page="${pageId}"]`)?.classList.add('active');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// RENDER CATEGORIES
// ===================================
function renderCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  for (const [category, videos] of Object.entries(KSL_DATA)) {
    if (videos.length === 0) continue;
    
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    categoryDiv.id = category;
    
    categoryDiv.innerHTML = `
      <h2>${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</h2>
      <div class="card-grid">
        ${videos.map(v => renderVideoCard(v)).join('')}
      </div>
    `;
    container.appendChild(categoryDiv);
  }
}

function renderVideoCard(video) {
  const isCompleted = completedCards.includes(video.id);
  const isInRevision = revisionDeck.some(c => c.id === video.id);
  
  // Handle PDF vs Video
  if (video.source === 'pdf') {
    return `
      <div class="video-card" data-id="${video.id}">
        <div class="video-thumb" style="background: linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%); display: flex; align-items: center; justify-content: center;">
          <div style="text-align: center; color: white;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">📄</div>
            <div style="font-weight: 700;">PDF Resource</div>
          </div>
          <span class="level-badge ${video.level.toLowerCase()}">${video.level}</span>
        </div>
        <div class="card-body">
          <div class="card-title">${video.title}</div>
          <div class="card-gloss">${video.gloss}</div>
          <div class="card-actions">
            <a href="${video.video}" target="_blank" class="btn btn-primary">Download PDF</a>
          </div>
        </div>
      </div>
    `;
  }
  
  // Regular video card
  return `
    <div class="video-card" data-id="${video.id}">
      <div class="video-thumb" onclick="playVideo('${video.video}', '${video.title}')">
        <video muted loop playsinline preload="metadata">
          <source src="${video.video}" type="video/mp4">
        </video>
        <span class="level-badge ${video.level.toLowerCase()}">${video.level}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${video.title}</div>
        <div class="card-gloss">${video.gloss}</div>
        <div class="card-actions">
          <button class="btn ${isCompleted ? 'btn-saved' : 'btn-primary'}" onclick="markComplete('${video.id}')">
            ${isCompleted ? '✓ Mastered' : 'Mark Complete'}
          </button>
          <button class="btn ${isInRevision ? 'btn-saved' : 'btn-secondary'}" onclick="toggleRevision('${video.id}', '${video.title}')">
            ${isInRevision ? '★ In Deck' : 'Add to Revision'}
          </button>
        </div>
      </div>
    </div>
  `;
}

// ===================================
// USER ACTIONS
// ===================================
window.playVideo = function(src, title) {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 800px; background: var(--card); border-radius: var(--radius-lg); padding: 1rem;">
      <button class="close-modal" onclick="this.closest('.modal').remove()" style="position: absolute; top: 1rem; right: 1rem; background: var(--bg); border: none; color: var(--text); font-size: 2rem; cursor: pointer; width: 40px; height: 40px; border-radius: 50%;">×</button>
      <video controls autoplay style="width: 100%; border-radius: var(--radius-md);">
        <source src="${src}" type="video/mp4">
      </video>
      <div style="padding: 1rem 0 0;">
        <h3 style="color: var(--text);">${title}</h3>
      </div>
    </div>
  `;
  modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(10px);';
  document.body.appendChild(modal);
}

window.markComplete = function(id) {
  if (!completedCards.includes(id)) {
    completedCards.push(id);
    localStorage.setItem('signixCompleted', JSON.stringify(completedCards));
    renderCategories();
    updateProgress();
  }
}

window.toggleRevision = function(id, title) {
  const idx = revisionDeck.findIndex(c => c.id === id);
  if (idx > -1) {
    revisionDeck.splice(idx, 1);
  } else {
    revisionDeck.push({ id, title, due: Date.now() });
  }
  localStorage.setItem('signixRevision', JSON.stringify(revisionDeck));
  renderCategories();
}

// ===================================
// PROGRESS TRACKING
// ===================================
function updateProgress() {
  const allVideos = Object.values(KSL_DATA).flat().filter(v => v.source !== 'pdf');
  const beginnerVideos = allVideos.filter(v => v.level === 'Beginner');
  const beginnerCompleted = completedCards.filter(id => beginnerVideos.some(v => v.id === id)).length;
  
  const pct = beginnerVideos.length > 0 ? Math.round(beginnerCompleted / beginnerVideos.length * 100) : 0;
  
  const barEl = document.getElementById('beginner-bar');
  const pctEl = document.getElementById('beginner-percent');
  
  if (barEl) barEl.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  updateProgress();
  
  // Sidebar category clicks
  document.querySelectorAll('.nav-link[data-category]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      switchPage('home');
      setTimeout(() => {
        const categoryId = link.getAttribute('data-category');
        document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
  });
  
  // Sidebar page clicks
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      switchPage(link.getAttribute('data-page'));
    });
  });

  // Topbar clicks
  document.querySelectorAll('.topbar a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage(link.getAttribute('data-page'));
    });
  });

  // Auto-play on hover
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.video-thumb video')) {
      e.target.play().catch(err => {});
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.video-thumb video')) {
      e.target.pause();
      e.target.currentTime = 0;
    }
  });
});
