// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getDatabase, ref, push, set, get, child, remove
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgdcFJfXRPZb9b0mdg7BXZo8nvth2Fz-s",
  authDomain: "booking-event-de7c7.firebaseapp.com",
  databaseURL: "https://booking-event-de7c7-default-rtdb.firebaseio.com", // ← GANTI INI
  projectId: "booking-event-de7c7",
  storageBucket: "booking-event-de7c7.appspot.com",
  messagingSenderId: "525269781735",
  appId: "1:525269781735:web:3e353820dfed27c4d3a642"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export {
  db, ref, push, set, get, child, remove, // penting!
  auth, signInWithEmailAndPassword, signOut, onAuthStateChanged
};