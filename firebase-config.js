// ============================================================
// إعدادات Firebase
// هيّئ مشروع جديد على https://console.firebase.google.com
// ثم فعّل خدمتين:
//   1) Firestore Database  (Build → Firestore Database)
//   2) Authentication → Sign-in method → Email/Password  (فعّلها)
// بعد كده Authentication → Users → Add user، وحط إيميل وباسورد
// هما اللي هتدخل بيهم صفحة admin.html
// ثم انسخ بيانات إعداد الويب من:
// Project settings → General → Your apps → SDK setup
// والصقها بدل القيم الوهمية بالأسفل.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAk6BwjDaVDPs71dCMK1ewoLmREZQo4Aks",
  authDomain: "almohamy-a6655.firebaseapp.com",
  databaseURL: "https://almohamy-a6655-default-rtdb.firebaseio.com",
  projectId: "almohamy-a6655",
  storageBucket: "almohamy-a6655.firebasestorage.app",
  messagingSenderId: "745109095504",
  appId: "1:745109095504:web:b18e091758988fde337d55",
  measurementId: "G-6TQXW58R08",
};

try {
  const app = initializeApp(firebaseConfig);
  window.firebaseDB = getFirestore(app);
  window.firestoreFns = { collection, addDoc, doc, getDoc, setDoc };
  window.firebaseAuth = getAuth(app);
  window.authFns = { signInWithEmailAndPassword, onAuthStateChanged, signOut };
  window.dispatchEvent(new Event("firebase-ready"));
} catch (err) {
  console.warn("Firebase لم يتم تهيئته — راجع firebase-config.js", err);
}
