import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
} from "firebase/analytics";
import { getRemoteConfig, fetchAndActivate } from "firebase/remote-config";
import { getFirestore } from "firebase/firestore";

const STORAGE_KEY = "slides_aulas_firebase_config";

/**
 * Retrieves the current Firebase configuration from localStorage or .env
 */
export function getStoredFirebaseConfig() {
  const localSaved = localStorage.getItem(STORAGE_KEY);
  if (localSaved) {
    try {
      return JSON.parse(localSaved);
    } catch (e) {
      console.warn(
        "Failed to parse saved Firebase config from localStorage",
        e
      );
    }
  }

  return {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY || "",
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.VUE_APP_FIREBASE_APP_ID || "",
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID || "",
  };
}

/**
 * Saves user credentials to localStorage
 */
export function saveFirebaseConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

/**
 * Checks if Firebase configuration contains required keys
 */
export function isFirebaseConfigured(config = getStoredFirebaseConfig()) {
  return Boolean(config && config.apiKey && config.projectId && config.appId);
}

let firebaseApp = null;
let analyticsInstance = null;
let remoteConfigInstance = null;
let dbInstance = null;

/**
 * Initializes Firebase App instance safely
 */
export function initFirebase() {
  const config = getStoredFirebaseConfig();

  if (!isFirebaseConfigured(config)) {
    console.info(
      "[Firebase] Config keys not provided. Running with Local Fallback Provider."
    );
    return { app: null, analytics: null, remoteConfig: null, db: null };
  }

  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }

    // Initialize Analytics if supported
    isAnalyticsSupported()
      .then((supported) => {
        if (supported && firebaseApp) {
          analyticsInstance = getAnalytics(firebaseApp);
        }
      })
      .catch((err) =>
        console.warn(
          "[Firebase Analytics] Not supported in this environment",
          err
        )
      );

    // Initialize Remote Config
    remoteConfigInstance = getRemoteConfig(firebaseApp);
    remoteConfigInstance.settings.minimumFetchIntervalMillis = 3600000; // 1 hour default
    remoteConfigInstance.defaultConfig = {
      course_desenvolvimento_interfaces_enabled: true,
      course_desenvolvimento_interfaces_config: JSON.stringify({
        enabled: true,
        lockedLessons: [],
      }),
    };

    fetchAndActivate(remoteConfigInstance).catch((err) => {
      console.warn("[Firebase RemoteConfig] Using default configuration", err);
    });

    // Initialize Firestore
    dbInstance = getFirestore(firebaseApp);

    return {
      app: firebaseApp,
      analytics: analyticsInstance,
      remoteConfig: remoteConfigInstance,
      db: dbInstance,
    };
  } catch (error) {
    console.error("[Firebase] Initialization error:", error);
    return { app: null, analytics: null, remoteConfig: null, db: null };
  }
}

export { firebaseApp, analyticsInstance, remoteConfigInstance, dbInstance };
