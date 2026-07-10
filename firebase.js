// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW1_AUSDZl5vyzH_l5SucrA4CISv2Sz8g",
  authDomain: "jopa-ff3d4.firebaseapp.com",
  projectId: "jopa-ff3d4",
  storageBucket: "jopa-ff3d4.firebasestorage.app",
  messagingSenderId: "481955111504",
  appId: "1:481955111504:web:6920b1440453fb2da0e755"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);