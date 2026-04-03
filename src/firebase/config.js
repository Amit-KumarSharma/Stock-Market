import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase project's config
const firebaseConfig = {
  apiKey: "AIzaSyDH4bYQZPxy9hwU5_saKZad6WbUAaE42bE",
  authDomain: "amit-s-advisory-stock-signal.firebaseapp.com",
  projectId: "amit-s-advisory-stock-signal",
  storageBucket: "amit-s-advisory-stock-signal.firebasestorage.app",
  messagingSenderId: "687252907587",
  appId: "1:687252907587:web:e5f909cd8f865f503e16f6",
  measurementId: "G-JXLYZJW3XX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
