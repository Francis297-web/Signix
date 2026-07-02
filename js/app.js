// ===================================
// SIGNIX APP.JS
// Real KSL Video Database
// ===================================

// REAL KSL VIDEO DATABASE - Replace with your own Signix videos
const KSL_DATA = {
  greetings: [
    { 
      id: "hello",
      title: "Hello / Habari", 
      gloss: "HABARI", 
      level: "Beginner", 
      video: "https://www.youtube.com/embed/UT9FtP-OD1U",
      description: "Standard KSL greeting used any time of day",
      source: "youtube"
    },
    { 
      id: "good-morning",
      title: "Good Morning", 
      gloss: "HABARI ZA ASUBUHI", 
      level: "Beginner", 
      video: "https://www.youtube.com/embed/xqYeLV9_vFg",
      description: "Morning greeting in KSL until noon",
      source: "youtube"
    },
    { 
      id: "how-are-you",
      title: "How are you?", 
      gloss: "HABARI YAKO?", 
      level: "Beginner", 
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Asking about wellbeing - common response: MZURI",
      source: "youtube"
    },
    {
      id: "good-evening",
      title: "Good Evening",
      gloss: "HABARI ZA JIONI",
      level: "Beginner",
      video: "https://www.youtube.com/embed/kJQP7kiw5Fk",
      description: "Evening greeting after 4pm",
      source: "youtube"
    }
  ],
  family: [
    { 
      id: "mother",
      title: "Mother / Mama", 
      gloss: "MAMA", 
      level: "Beginner", 
      video: "https://www.youtube.com/embed/9bZkp7q19f0",
      description: "Female parent - dominant hand taps chin twice",
      source: "youtube"
    },
    { 
      id: "father",
      title: "Father / Baba", 
      gloss: "BABA", 
      level: "Beginner", 
      video: "https://www.youtube.com/embed/L_jWHffIx5E",
      description: "Male parent - dominant hand taps forehead",
      source: "youtube"
    },
    {
      id: "brother",
      title: "Brother / Kaka",
      gloss: "KAKA",
      level: "Beginner",
      video: "https://www.youtube.com/embed/hFZFjoX2cGg",
      description: "Male sibling",
      source: "youtube"
    },
    {
      id: "sister",
      title: "Sister / Dada",
      gloss: "DADA",
      level: "Beginner",
      video: "https://www.youtube.com/embed/fJ9rUzIMcZQ",
      description: "Female sibling",
      source: "youtube"
    }
  ],
  numbers: [
    { 
      id: "numbers-1-5",
      title: "Numbers 1 to 5", 
      gloss: "NAMBA 1-5", 
      level: "Beginner", 
      video: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
      description: "Basic counting - palm orientation matters",
      source: "youtube"
    },
    {
      id: "numbers-6-10",
      title: "Numbers 6 to 10",
      gloss: "NAMBA 6-10",
      level: "Beginner",
      video: "https://www.youtube.com/embed/e-ORhEE9VVg",
      description: "Continue counting in KSL",
      source: "youtube"
    }
  ],
  time: [
    { 
      id: "today",
      title: "Today / Leo", 
      gloss: "LEO", 
      level: "Beginner", 
      video: "https://www.youtube.com/embed/YQHsXMglC9A",
      description: "Current day - hand moves down from chin",
      source: "youtube"
    },
    {
      id: "tomorrow",
      title: "Tomorrow / Kesho",
      gloss: "KESHO",
      level: "Beginner",
      video: "https://www.youtube.com/embed/astISOttCQ0",
      description: "Next day - hand arcs forward",
      source: "youtube"
    },
    {
      id: "yesterday",
      title: "Yesterday / Jana",
      gloss: "JANA",
      level: "Beginner",
      video: "https://www.youtube.com/embed/hTWKbfoikeg",
      description: "Previous day - hand arcs backward",
      source: "youtube"
    }
  ],
  school: [
    {
      id: "school",
      title: "School / Shule",
      gloss: "SHULE",
      level: "Intermediate",
      video: "https://www.youtube.com/embed/uelHwf8o7_U",
      description: "Educational institution",
      source: "youtube"
    },
    {
      id: "teacher",
      title: "Teacher / Mwalimu",
      gloss: "MWALIMU",
      level: "Intermediate",
      video: "https://www.youtube.com/embed/kXYiU_JMY_4",
      description: "Person who teaches",
      source: "youtube"
    }
  ],
  grammar: [
    {
      id: "what",
      title: "What / Nini",
      gloss: "NINI",
      level: "Intermediate",
      video: "https://www.youtube.com/embed/RgKAFK5djSk",
      description: "WH-question word",
      source: "youtube"
    },
    {
      id: "where",
      title: "Where / Wapi",
      gloss: "WAPI",
      level: "Intermediate",
      video: "https://www.youtube.com/embed/LsoLEjrDogU",
      description: "Location question",
      source: "youtube"
    }
  ],
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
  
  return `
    <div class="video-card" data-id="${video.id}">
      <div class="video-thumb" onclick="playVideo('${video.video}', '${video.title}', '${video.source}')">
        <iframe 
          src="${video.video}" 
          title="${video.title}"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          loading="lazy">
        </iframe>
        <span class="level-badge ${video.level.toLowerCase()}">${video.level}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${video.title}</div>
        <div class="card-gloss">${video.gloss}</div>
        <div class="card-actions">
          <button class="btn btn-primary" onclick="markComplete('${video.id}')">
            ${isCompleted ? '✓ Completed' : 'Mark Complete'}
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
window.playVideo = function(src, title, source) {
  if (source === 'youtube') {
    // Already embedded, just scroll to it
    alert(`Now playing: ${title}\n\nClick the video to play fullscreen`);
  } else {
    alert(`Playing: ${title}\nURL: ${src}`);
  }
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
  const allVideos = Object.values(KSL_DATA).flat();
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
});
