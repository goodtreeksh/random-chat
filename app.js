// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  deleteDoc,
  query,
  where,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoH8OQRC5l3oHDQm06Oyjcp9Fkkr_wTEg",
  authDomain: "sfdfsd-d769b.firebaseapp.com",
  projectId: "sfdfsd-d769b",
  storageBucket: "sfdfsd-d769b.firebasestorage.app",
  messagingSenderId: "1096658268599",
  appId: "1:1096658268599:web:3cf336cff5a4d45359f832",
  measurementId: "G-B9J518L0D7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
