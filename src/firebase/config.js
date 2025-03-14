import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getInstallations } from 'firebase/installations';

const firebaseConfig = {
  apiKey: "AIzaSyBvyMXD7zPkHrL1e41j3FMgLN7CBLU5X4I",
  authDomain: "ysm-web-9da30.firebaseapp.com",
  projectId: "ysm-web-9da30",
  storageBucket: "ysm-web-9da30.firebasestorage.app",
  messagingSenderId: "353437460229",
  appId: "1:353437460229:web:a3d97be4b2cc3e64c6396c",
  measurementId: "G-04BV2Y9346"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export const auth = getAuth(app);

// Initialize analytics only if online
let analytics = null;

// Check if online before initializing analytics
const initializeAnalytics = async () => {
  if (navigator.onLine) {
    try {
      const isAnalyticsSupported = await isSupported();
      if (isAnalyticsSupported) {
        analytics = getAnalytics(app);
        console.log('Analytics initialized successfully');
      } else {
        console.log('Analytics not supported in this environment');
      }
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  } else {
    console.log('Device is offline, skipping analytics initialization');
  }
};

// Initialize installations with error handling
const initializeInstallations = async () => {
  if (navigator.onLine) {
    try {
      const installations = getInstallations(app);
      console.log('Installations initialized successfully');
      return installations;
    } catch (error) {
      console.error('Failed to initialize installations:', error);
      return null;
    }
  } else {
    console.log('Device is offline, skipping installations initialization');
    return null;
  }
};

// Call initialization functions
initializeAnalytics();
initializeInstallations();

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.log('Persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // The current browser does not support persistence
    console.log('Persistence not supported by this browser');
  }
});

// Add online/offline event listeners
window.addEventListener('online', () => {
  console.log('App is online, reinitializing Firebase services');
  initializeAnalytics();
  initializeInstallations();
});

window.addEventListener('offline', () => {
  console.log('App is offline, some Firebase services will be unavailable');
});

console.log('Firebase initialized with config:', app);

export { app, analytics, db, storage }; 