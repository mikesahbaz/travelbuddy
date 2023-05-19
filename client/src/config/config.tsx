// backend server config
const BACKEND_SERVER_URL = process.env.REACT_APP_BACKEND_SERVER_URL || 'http://localhost:3001';

// rapid api config
const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY || '';
const SKYSCANNER_API_URL = "https://skyscanner50.p.rapidapi.com/api/v1";
const SKYSCANNER_API_HOST = "skyscanner50.p.rapidapi.com";

// firebase config
const FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY || '';
const FIREBASE_AUTH_DOMAIN = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '';
const FIREBASE_PROJECT_ID = process.env.REACT_APP_FIREBASE_PROJECT_ID || '';
const FIREBASE_STORAGE_BUCKET = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '';
const FIREBASE_MESSAGING_SENDER_ID = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '';
const FIREBASE_APP_ID = process.env.REACT_APP_FIREBASE_APP_ID || '';

// google config
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY || '';

export const config = {
  backend: {
    serverURL: BACKEND_SERVER_URL,
  },
  rapid: {
    apiKey: RAPID_API_KEY,
  },
  skyscanner: {
    apiURL: SKYSCANNER_API_URL,
    apiHost: SKYSCANNER_API_HOST,
  },
  firebase: {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
  },
  googlePlaces: {
    apiKey: GOOGLE_PLACES_API_KEY,
  }
}
