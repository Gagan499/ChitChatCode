// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider,signInWithPopup, signOut} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const analytics = getAnalytics(app);

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in: ", user);
      return user;
    })
    .catch((error) => {
      console.error("Error signing in: ", error);
      throw error;
    });
};

export const signOutUser = () => {
  signOut(auth)
    .then(() => {
        console.log("User signed out");
    })
    .catch((error) => {
        console.error("Error signing out: ", error);
    });
};