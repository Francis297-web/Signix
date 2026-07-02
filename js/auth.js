// ===================================
// SIGNIX AUTH.JS
// Firebase Authentication Handler
// Used by: login.html, register.html, dashboard.html
// ===================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ===================================
// FIREBASE CONFIG - REPLACE WITH YOURS
// Get from: Firebase Console > Project Settings > General
// ===================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ===================================
// HELPER FUNCTIONS
// ===================================
function showAlert(elementId, message, isError = true) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = message;
  el.className = isError? 'alert alert-error' : 'alert alert-success';
  el.style.display = 'block';

  setTimeout(() => {
    el.style.display = 'none';
  }, 5000);
}

function hideAlert(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.style.display = 'none';
}

// ===================================
// REGISTER FUNCTION
// ===================================
export async function registerUser(fullName, email, password) {
  try {
    // 1. Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Update display name
    await updateProfile(user, {
      displayName: fullName
    });

    // 3. Create Firestore user document
    await setDoc(doc(db, 'users', user.uid), {
      fullName: fullName,
      email: email,
      createdAt: serverTimestamp(),
      completedCards: [],
      revisionDeck: [],
      streak: 0,
      role: 'learner'
    });

    return { success: true, user };

  } catch (error) {
    return { success: false, error: error.code };
  }
}

// ===================================
// LOGIN FUNCTION
// ===================================
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.code };
  }
}

// ===================================
// GOOGLE SIGN IN
// ===================================
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user doc exists, create if new
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        fullName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        completedCards: [],
        revisionDeck: [],
        streak: 0,
        role: 'learner'
      });
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.code };
  }
}

// ===================================
// LOGOUT FUNCTION
// ===================================
export async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// ===================================
// PASSWORD RESET
// ===================================
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.code };
  }
}

// ===================================
// AUTH STATE LISTENER
// Call this on dashboard.html, library.html, etc
// ===================================
export function checkAuthState(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User logged in - get Firestore data
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists()? userDoc.data() : null;
        callback(user, userData);
      } catch (e) {
        console.error('Error loading user data:', e);
        callback(user, null);
      }
    } else {
      // Not logged in
      callback(null, null);
    }
  });
}

// ===================================
// ERROR MESSAGE TRANSLATOR
// ===================================
export function getErrorMessage(code) {
  const errors = {
    'auth/email-already-in-use': 'An account with this email already exists. Try logging in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
    'auth/too-many-requests': 'Too many attempts. Try again later.'
  };
  return errors[code] || 'Something went wrong. Please try again.';
}
