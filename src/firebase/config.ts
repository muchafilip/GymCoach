// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "appfitnesstracker-3dd5c.firebaseapp.com",
    projectId: "appfitnesstracker-3dd5c",
    storageBucket: "appfitnesstracker-3dd5c.appspot.com",
    messagingSenderId: "134788685128",
    appId: "1:134788685128:web:df8d9a37f34a3d9978677d",
    measurementId: "G-HTM688GWRC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);