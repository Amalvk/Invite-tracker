// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcgQZsM4lPcYlypm2a7AlDyu7HOa0YvE8",
  authDomain: "invitationtracker-796cc.firebaseapp.com",
  projectId: "invitationtracker-796cc",
  storageBucket: "invitationtracker-796cc.firebasestorage.app",
  messagingSenderId: "147593181691",
  appId: "1:147593181691:web:69c089d4a519d49d1f335e",
  measurementId: "G-T2X5QN6MQ0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);
