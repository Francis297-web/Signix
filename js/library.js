// ===================================
// SIGNIX LIBRARY.JS
// KSL Dictionary - Browse all signs
// ===================================

import { auth } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// KSL DATABASE - Same as app.js but can add more
const KSL_DATA = {
  greetings: [
    { id: "hello", title: "Hello", gloss: "HABARI / HELLO", level: "Beginner", category: "greetings", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", description: "Common greeting used any time of day" },
    { id: "good-morning", title: "Good Morning", gloss: "HABARI ZA ASUBUHI", level: "Beginner", category: "greetings", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", description: "Morning greeting until noon" },
    { id: "how-are-you", title: "How are you?", gloss: "HABARI YAKO?", level: "Beginner", category: "greetings", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", description: "Asking about wellbeing" },
    { id: "goodbye", title: "Goodbye", gloss: "KWAHERI", level: "Beginner", category: "greetings", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", description: "Parting greeting" }
  ],
  family: [
    { id: "mother", title: "Mother", gloss: "MAMA", level: "Beginner", category: "family", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", description: "Female parent" },
    { id: "father", title: "Father", gloss: "BABA", level: "Beginner", category: "family", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", description: "Male parent" },
    { id: "sister", title: "Sister", gloss: "DADA", level: "Beginner", category: "family", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", description: "Female sibling" },
    { id: "brother", title: "Brother", gloss: "KAKA", level: "Beginner", category: "family", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", description: "Male sibling" }
  ],
  numbers: [
    { id: "numbers-1-5", title: "Numbers 1 to 5", gloss: "NAMBA 1-5", level: "Beginner", category: "numbers", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", description: "Basic counting" },
    { id: "numbers-6-10", title: "Numbers 6 to 10", gloss: "NAMBA 6-10", level: "Beginner", category: "numbers", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", description: "Counting continued" }
  ],
  time: [
    { id: "today", title: "Today", gloss: "LEO", level: "Beginner", category: "time", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", description: "Current day" },
    { id: "tomorrow", title: "Tomorrow", gloss: "KESHO", level: "Beginner", category: "time", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", description: "Next day" }
  ],
  school: [],
  grammar: [],
  storytelling: [],
  workplace: []
};

let completedCards = JSON.parse(localStorage.getItem('signixCompleted') || '[]');
let revisionDeck = JSON.parse(localStorage.getItem('signixRevision') || '[]');
let currentFilter = 'all';

// Flatten all videos
function getAllVideos() {
  return Object.values(KSL_DATA).flat();
}

function renderLibrary() {
  const container = document.getElementById('categoriesContainer');
  if (!container) return;

  container.innerHTML = '';

  const videos = currentFilter === 'all'
   ? getAllVideos()
    : KSL_DATA[currentFilter] || [];

  if (videos.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No signs in this category yet</h3>
        <p>Check back soon as we add more KSL content.</p>
      </div>
    `;
    return;
  }

  // Group by category if showing all
  if (currentFilter === 'all') {
    for (const [category, vids] of Object.entries(KSL_DATA)) {
      if (vids.length === 0) continue;

      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'category mb-xl';
      categoryDiv.innerHTML = `
        <h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
        <div class="card-grid">
          ${vids.map(v => renderDictCard(v)).join('')}
        </div>
      `;
      container.appendChild(categoryDiv);
    }
  } else {
    container.innerHTML = `
      <div class="card-grid">
        ${videos.map(v => renderDictCard(v)).join('')}
      </div>
    `;
  }

  attachVideoListeners();
}

function renderDictCard(video) {
  const isCompleted = completedCards.includes(video.id);
  const isInRevision = revisionDeck.some(c => c.id === video.id);

  return `
    <div class="dict-card" data-id="${video.id}" data-category="${video.category}">
      <div class="dict-thumb" onclick="playSign('${video.video}', '${video.title}')">
        <video muted loop playsinline preload="metadata">
          <source src="${video.video}" type="video/webm">
        </video>
        <span class="level-badge ${video.level.toLowerCase()}">${video.level}</span>
      </div>
      <div class="dict-body">
        <div class="dict-title">${video.title}</div>
        <div class="dict-gloss">${video.gloss}</div>
        <div class="card-actions">
          <button class="btn btn-primary" onclick="markComplete('${video.id}')">
            ${isCompleted? '✓ Mastered' : 'Mark Complete'}
          </button>
          <button class="btn ${isInRevision? 'btn-saved' : 'btn-secondary'}" onclick="toggleRevision('${video.id}', '${video.title}')">
            ${isInRevision? '★ Saved' : 'Add to Deck'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function attachVideoListeners() {
  document.querySelectorAll('.dict-thumb video').forEach(video => {
    video.addEventListener('mouseenter', function() {
      this.play().catch(e => console.log('Autoplay prevented'));
    });
    video.addEventListener('mouseleave', function() {
      this.pause();
      this.currentTime = 0;
    });
  });
}

// Global functions
window.playSign = function(src, title) {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 600px;">
      <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
      <video controls autoplay style="width: 100%; border-radius: var(--radius-md);">
        <source src="${src}" type="video/webm">
      </video>
      <div style="padding: var(--space-lg);">
        <h3>${title}</h3>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

window.markComplete = function(id) {
  if (!completedCards.includes(id)) {
    completedCards.push(id);
    localStorage.setItem('signixCompleted', JSON.stringify(completedCards));
    renderLibrary();
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
  renderLibrary();
}

// Search
document.getElementById('searchInput')?.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.dict-card').forEach(card => {
    const title = card.querySelector('.dict-title').textContent.toLowerCase();
    const gloss = card.querySelector('.dict-gloss').textContent.toLowerCase();
    card.style.display = (title.includes(query) || gloss.includes(query))? 'block' : 'none';
  });
});

// Category filters
document.querySelectorAll('.nav-link[data-category]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    currentFilter = link.getAttribute('data-category');
    renderLibrary();
  });
});

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderLibrary();

  // Auth check
  onAuthStateChanged(auth, (user) => {
    const userEmail = document.getElementById('userEmail');
    if (userEmail) userEmail.textContent = user? user.email : 'Guest';
  });
});
