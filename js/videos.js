// ===================================
// SIGNIX VIDEOS.JS
// Practice Theater - All videos
// ===================================

import { auth } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Use same KSL_DATA as library.js
const KSL_DATA = {
  greetings: [
    { id: "hello", title: "Hello", gloss: "HABARI / HELLO", level: "Beginner", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" },
    { id: "good-morning", title: "Good Morning", gloss: "HABARI ZA ASUBUHI", level: "Beginner", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" },
    { id: "how-are-you", title: "How are you?", gloss: "HABARI YAKO?", level: "Beginner", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" }
  ],
  family: [
    { id: "mother", title: "Mother", gloss: "MAMA", level: "Beginner", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" },
    { id: "father", title: "Father", gloss: "BABA", level: "Beginner", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" }
  ],
  numbers: [
    { id: "numbers-1-5", title: "Numbers 1 to 5", gloss: "NAMBA 1-5", level: "Beginner", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" }
  ],
  time: [
    { id: "today", title: "Today", gloss: "LEO", level: "Beginner", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" }
  ],
  school: [],
  grammar: [],
  storytelling: [],
  workplace: []
};

let allVideos = Object.values(KSL_DATA).flat();
let currentLevel = 'all';
let currentView = 'grid';
let theaterPlaylist = [];
let currentVideoIndex = 0;

function renderVideos() {
  const container = document.getElementById('videosContainer');
  if (!container) return;

  const filtered = currentLevel === 'all'
   ? allVideos
    : allVideos.filter(v => v.level === currentLevel);

  theaterPlaylist = filtered;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><h3>No videos yet</h3></div>`;
    return;
  }

  container.className = currentView === 'grid'? 'video-grid' : 'video-list';

  container.innerHTML = filtered.map((v, idx) => `
    <div class="video-card" data-idx="${idx}">
      <div class="video-thumb" onclick="openTheater(${idx})">
        <video muted loop playsinline preload="metadata">
          <source src="${v.video}" type="video/webm">
        </video>
        <span class="level-badge ${v.level.toLowerCase()}">${v.level}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${v.title}</div>
        <div class="card-gloss">${v.gloss}</div>
        <div class="card-actions">
          <button class="btn btn-primary" onclick="openTheater(${idx})">Play</button>
        </div>
      </div>
    </div>
  `).join('');

  // Hover play
  document.querySelectorAll('.video-thumb video').forEach(video => {
    video.addEventListener('mouseenter', function() { this.play().catch(e => {}); });
    video.addEventListener('mouseleave', function() { this.pause(); this.currentTime = 0; });
  });
}

// Theater Mode
window.openTheater = function(idx) {
  currentVideoIndex = idx;
  const video = theaterPlaylist[idx];
  const modal = document.getElementById('theaterMode');
  const videoEl = document.getElementById('theaterVideo');
  const titleEl = document.getElementById('theaterTitle');

  videoEl.src = video.video;
  titleEl.textContent = video.title;
  modal.classList.add('active');
  videoEl.play();
}

window.closeTheater = function() {
  document.getElementById('theaterMode').classList.remove('active');
  document.getElementById('theaterVideo').pause();
}

window.nextVideo = function() {
  currentVideoIndex = (currentVideoIndex + 1) % theaterPlaylist.length;
  openTheater(currentVideoIndex);
}

window.prevVideo = function() {
  currentVideoIndex = (currentVideoIndex - 1 + theaterPlaylist.length) % theaterPlaylist.length;
  openTheater(currentVideoIndex);
}

window.togglePlayPause = function() {
  const video = document.getElementById('theaterVideo');
  video.paused? video.play() : video.pause();
}

window.startTheaterMode = function() {
  if (theaterPlaylist.length > 0) openTheater(0);
}

// Filters
document.querySelectorAll('.nav-link[data-level]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    currentLevel = link.getAttribute('data-level');
    renderVideos();
  });
});

// View toggle
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentView = btn.getAttribute('data-view');
    renderVideos();
  });
});

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderVideos();

  onAuthStateChanged(auth, (user) => {
    const userEmail = document.getElementById('userEmail');
    if (userEmail) userEmail.textContent = user? user.email : 'Guest';
  });
});
