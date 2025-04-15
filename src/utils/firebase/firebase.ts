import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCH-qBb2d4gH6LAxlZWrdd6TK3howRlVL8",
  authDomain: "rapidamente-d32f3.firebaseapp.com",
  projectId: "rapidamente-d32f3",
  storageBucket: "rapidamente-d32f3.firebasestorage.app",
  messagingSenderId: "75324662841",
  appId: "1:75324662841:web:220d4980cb92a7392559e8",
};

const FIREBASE_APP = initializeApp(FIREBASE_CONFIG);

export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_PROVIDER = new GoogleAuthProvider();
