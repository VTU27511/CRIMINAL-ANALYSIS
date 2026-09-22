import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "criminal-analysis-13de4.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "criminal-analysis-13de4",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "criminal-analysis-13de4.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "976901686065",
  appId: env.VITE_FIREBASE_APP_ID || "1:976901686065:web:1b079bc59ebf72c4c8e610"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let isFirebaseInitialized = false;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  isFirebaseInitialized = true;
  console.log("[Team Astra] Firebase Client successfully initialized for project:", firebaseConfig.projectId);
} catch (error) {
  console.warn("[Team Astra] Firebase direct initialization note:", error);
}

export { app, auth, db, storage, firebaseConfig, isFirebaseInitialized };
