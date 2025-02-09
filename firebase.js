import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTgKJMCvE8AI1exwcIVMRkmXfNfbK4dKQ",
  authDomain: "upicryptoconnect.firebaseapp.com",
  projectId: "upicryptoconnect",
  storageBucket: "upicryptoconnect.firebasestorage.app",
  messagingSenderId: "774710864411",
  appId: "1:774710864411:web:af16a0536a12cf602fe6be",
  measurementId: "G-2KN3TBVHD4"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };
