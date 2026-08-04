// ============================================================
// إعدادات Firebase
// هيّئ مشروع جديد على https://console.firebase.google.com
// ثم فعّل خدمة "Firestore Database" وانسخ بيانات إعداد الويب
// من: Project settings → General → Your apps → SDK setup
// والصقها بدل القيم الوهمية بالأسفل.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

try {
  const app = initializeApp(firebaseConfig);
  window.firebaseDB = getFirestore(app);
  window.firestoreFns = { collection, addDoc };
} catch (err) {
  console.warn("Firebase لم يتم تهيئته — راجع js/firebase-config.js", err);
}
