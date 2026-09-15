// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-a967a.firebaseapp.com",
  projectId: "blog-app-a967a",
  storageBucket: "blog-app-a967a.firebasestorage.app",
  messagingSenderId: "906067211198",
  appId: "1:906067211198:web:df2446155cd42654e87fef"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore()

export default app;