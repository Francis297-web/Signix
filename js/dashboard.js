// ===================================
// SIGNIX DASHBOARD.JS
// Handles user stats, progress, revision list
// ===================================

import { checkAuthState, logoutUser } from './auth.js';

// ===================================
// STATE
// ===================================
let currentUser = null;
let userData = null;
let completedCards = JSON.parse(localStorage.getItem('signixCompleted') || '[]');
let revisionDeck = JSON.parse(localStorage.getItem('signixRevision') || '[]');
let streak = parseInt(localStorage.getItem('signixStreak') || '0');
let lastLogin = localStorage.getItem('signixLastLogin');

// ===================================
// STREAK CALCULATION
// ===================================
function updateStreak() {
  const today = new Date().toDateString();

  if (lastLogin!== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastLogin === yesterday) {
      streak++;
    } else if (lastLogin) {
      streak = 1; // Reset streak
    } else {
      streak = 1; // First login
    }

    localStorage.setItem('signixStreak', streak);
    localStorage.setItem('signixLastLogin', today);
  }
}

// ===================================
// LOAD USER DATA FROM FIREBASE
// ===================================
function loadFirebaseData(data) {
  if (!data) return;

  // Override localStorage with Firebase data if it exists
  completedCards = data.completedCards || completedCards;
  revisionDeck = data.revisionDeck || revisionDeck;
  streak = data.streak || streak;

  // Update localStorage to match Firebase
  localStorage.setItem('signixCompleted', JSON.stringify(completedCards));
  localStorage.setItem('signixRevision', JSON.stringify(revisionDeck));
  localStorage.setItem('signixStreak', streak);
}

// ===================================
// RENDER DASHBOARD
// ===================================
function renderDashboard() {
  // 1. User info
  const userEmailEl = document.getElementById('userEmail');
  const userAvatarEl = document.getElementById('userAvatar');
  const welcomeEl = document.getElementById('welcomeText');

  if (currentUser) {
    const displayName = currentUser.displayName || currentUser.email.split('@')[0];
    const initial = currentUser.email[0].toUpperCase();

    userEmailEl.textContent = currentUser.email;
    userAvatarEl.textContent = initial;
    welcomeEl.textContent = `Welcome back, ${displayName}!`;
  } else {
    userEmailEl.textContent = 'Guest';
    userAvatarEl.textContent = 'G';
    welcomeEl.textContent = 'Welcome to Signix!';
  }

  // 2. Stats
  updateStreak();
  document.getElementById('statStreak').textContent = streak;
  document.getElementById('statMastered').textContent = completedCards.length;
  document.getElementById('statDue').textContent = revisionDeck.length;

  // 3. Progress calculation - adjust beginnerTotal as you add more signs
  const beginnerTotal = 7; // Greetings:6 + Family:4 + Numbers:2 + Time:2 = 14. Update this!
  const beginnerPct = beginnerTotal > 0? Math.round(completedCards.length / beginnerTotal * 100) : 0;

  document.getElementById('statProgress').textContent = beginnerPct + '%';
  document.getElementById('beginnerPct').textContent = beginnerPct + '%';
  document.getElementById('beginnerBar').style.width = beginnerPct + '%';

  // 4. Streak message
  const streakTrend = document.getElementById('streakTrend');
  if (streak > 0) {
    streakTrend.textContent = `${streak} day${streak > 1? 's' : ''} in a row!`;
  } else {
    streakTrend.textContent = 'Start today!';
  }

  // 5. Continue Learning - show last 3 completed
  renderContinueLearning();

  // 6. Revision Due
  renderRevisionList();
}

function renderContinueLearning() {
  const continueList = document.getElementById('continueList');

  if (completedCards.length === 0) {
    continueList.innerHTML = `
      <div class="empty-state">
        <h3>Start learning to see your progress here</h3>
        <a href="index.html" class="btn btn-primary mt-md">Start with Greetings</a>
      </div>
    `;
    return;
  }

  // Show last 3 completed cards
  const recentCards = completedCards.slice(-3).reverse();

  continueList.innerHTML = recentCards.map(cardId => {
    const title = cardId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return `
      <div class="continue-card">
        <div class="continue-thumb"></div>
        <div class="continue-info">
          <h4>${title}</h4>
          <p class="text-muted text-sm">Mastered • Practice again</p>
        </div>
        <a href="index.html" class="btn btn-secondary">Review</a>
      </div>
    `;
  }).join('');
}

function renderRevisionList() {
  const revisionList = document.getElementById('revisionList');

  if (revisionDeck.length === 0) {
    revisionList.innerHTML = `
      <div class="empty-state">
        <p>No cards due. Great work!</p>
      </div>
    `;
    return;
  }

  // Show first 5 due cards
  const dueCards = revisionDeck.slice(0, 5);

  revisionList.innerHTML = dueCards.map(card => `
    <div class="revision-item">
      <div>
        <strong>${card.title}</strong>
        <div class="text-muted text-sm">Due now</div>
      </div>
      <span class="badge-warning">DUE</span>
    </div>
  `).join('');
}

// ===================================
// EVENT LISTENERS
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  // Check auth state
  checkAuthState((user, data) => {
    currentUser = user;
    userData = data;

    if (user && data) {
      loadFirebaseData(data);
    }

    renderDashboard();
  });

  // Logout button
  const avatar = document.getElementById('userAvatar');
  if (avatar) {
    avatar.style.cursor = 'pointer';
    avatar.addEventListener('click', () => {
      if (confirm('Log out of Signix?')) {
        logoutUser();
      }
    });
  }
});

// ===================================
// EXPORT FOR TESTING
// ===================================
window.signixDebug = {
  completedCards,
  revisionDeck,
  streak,
  clearProgress: () => {
    localStorage.removeItem('signixCompleted');
    localStorage.removeItem('signixRevision');
    localStorage.removeItem('signixStreak');
    localStorage.removeItem('signixLastLogin');
    location.reload();
  }
};
