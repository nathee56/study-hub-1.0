import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBJ3XFzxtHr3A6mqktX4LQbxfqla02ZgQI",
    authDomain: "study1-536f9.firebaseapp.com",
    projectId: "study1-536f9",
    storageBucket: "study1-536f9.firebasestorage.app",
    messagingSenderId: "483838559339",
    appId: "1:483838559339:web:72e3a5db3dedf241291d2e",
    measurementId: "G-3GLJNK514S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
