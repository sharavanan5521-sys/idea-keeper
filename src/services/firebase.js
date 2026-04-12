//Import only the firebase services that we need
//This keeps the bundle size small -we dont import everything

import {initializeApp} from 'firebase/app';
import {getAuth , GoogleAuthProvider } from "firebase/auth"
import {getFirestore} from "firebase/firestore"

//Firebase config pulled from .env file
//vite exposes env variables with the VITE_ prefix
//all keys must start with VITE_ to be accessible in the code
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);