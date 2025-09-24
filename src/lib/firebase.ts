// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOId4970L2rk8l225osHO4NnlYLfghBWE",
  authDomain: "estrela-do-oriente-app.firebaseapp.com",
  projectId: "estrela-do-oriente-app",
  storageBucket: "estrela-do-oriente-app.firebasestorage.app",
  messagingSenderId: "783966550018",
  appId: "1:783966550018:web:89d7de9e2655bf342e8f1b",
  measurementId: "G-1MVH5M602K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only on client side)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
