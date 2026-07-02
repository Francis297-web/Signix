// ===================================
// SIGNIX APP.JS
// Main JavaScript for index.html
// Handles: Navigation, Page Routing, Category Rendering
// ===================================

// KSL VIDEO DATABASE - Replace URLs with your real KSL videos
const KSL_DATA = {
  greetings: [
    { 
      id: "hello",
      title: "Hello", 
      gloss: "HABARI / HELLO", 
      level: "Beginner", 
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      description: "Common greeting used any time of day"
    },
    { 
      id: "good-morning",
      title: "Good Morning", 
      gloss: "HABARI ZA ASUBUHI", 
      level: "Beginner", 
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      description: "Morning greeting until noon"
    },
    { 
      id: "how-are-you",
      title: "How are you?", 
      gloss: "HABARI YAKO?", 
      level: "Beginner", 
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      description: "Asking about wellbeing"
    }
  ],
  family: [
    { 
      id: "mother",
      title: "Mother", 
      gloss: "MAMA", 
      level: "Beginner", 
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      description: "Female parent"
    },
    { 
      id: "father",
      title: "Father", 
      gloss: "BABA", 
      level: "Beginner", 
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      description: "Male parent"
    }
  ],
  numbers: [
    { 
      id: "numbers-1-5",
      title: "Numbers 1 to 5", 
      gloss: "NAMBA 1-5", 
      level: "Beginner", 
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      description: "Basic counting"
    }
  ],
  time: [
    { 
      id: "today",
      title: "Today", 
      gloss: "LEO", 
      level: "Beginner", 
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      description: "Current day"
    }
  ],
  school: [],
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
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.add('active');
  
  // Update topbar active state
  document.querySelectorAll('.topbar a').forEach(a => a.classList.remove('active'));
  document.querySelector(`.topbar a[data-page="${pageId}"]`)?.classList.add('active');
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// RENDER CATEGORIES ON HOME PAGE
// ===================================
function renderCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  for (const [category, videos] of Object.entries(KSL_DATA)) {
    if (videos.length === 0) continue; // Skip empty categories
    
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    categoryDiv.id = category;
    
    categoryDiv.innerHTML = `
      <h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      <div class="card-grid">
        ${videos.map(v => renderVideoCard(v)).join('')}
      </div>
    `;
    container.appendChild(categoryDiv);
  }
  
  // Add hover play/pause to all videos
  attachVideoListeners();
}

function renderVideoCard(video) {
  const isCompleted = completedCards.includes(video.id);
  const isInRevision = revisionDeck.some(c => c.id === video.id);
  
  return `
    <div class="video-card" data-id="${video.id}">
      <div class="video-thumb" onclick="playVideo('${video.video}', '${video.title}')">
        <video muted loop playsinline preload="metadata">
          <source src="${video.video}" type="video/webm">
        </video>
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

function attachVideoListeners() {
  document.querySelectorAll('.video-thumb video').forEach(video => {
    video.addEventListener('mouseenter', function() {
      this.play().catch(e => console.log('Autoplay prevented'));
    });
    video.addEventListener('mouseleave', function() {
      this.pause();
      this.currentTime = 0;
    });
  });
}

// ===================================
// USER ACTIONS
// ===================================
window.playVideo = function(src, title) {
  // For now, alert. Later replace with modal player
  alert(`Playing: ${title}\n\nURL: ${src}\n\nNext step: Build modal video player`);
}

window.markComplete = function(id) {
  if (!completedCards.includes(id)) {
    completedCards.push(id);
    localStorage.setItem('signixCompleted', JSON.stringify(completedCards));
    renderCategories(); // Re-render to update button text
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
  renderCategories(); // Re-render to update button text
}

// ===================================
// PROGRESS TRACKING
// ===================================
function updateProgress() {
  const beginnerTotal = KSL_DATA.greetings.length + KSL_DATA.family.length + KSL_DATA.numbers.length + KSL_DATA.time.length;
  const beginnerCompleted = completedCards.filter(id => {
    return [...KSL_DATA.greetings, ...KSL_DATA.family, ...KSL_DATA.numbers, ...KSL_DATA.time].some(v => v.id === id);
  }).length;
  
  const pct = beginnerTotal > 0 ? Math.round(beginnerCompleted / beginnerTotal * 100) : 0;
  
  const barEl = document.getElementById('beginner-bar');
  const pctEl = document.getElementById('beginner-percent');
  
  if (barEl) barEl.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Render video cards
  renderCategories();
  
  // 2. Update progress bars
  updateProgress();
  
  // 3. Sidebar category clicks
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
  
  // 4. Sidebar page clicks - Revision Deck, Fluency Path
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      const pageId = link.getAttribute('data-page');
      switchPage(pageId);
    });
  });

  // 5. Topbar clicks
  document.querySelectorAll('.topbar a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.getAttribute('data-page');
      switchPage(pageId);
    });
  });
});
