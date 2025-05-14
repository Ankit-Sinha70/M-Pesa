/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOD3cHi_sIZIZlEW2TQRXR1MJZEBRBPtw",
  authDomain: "maisha-pesa-2b963.firebaseapp.com",
  projectId: "maisha-pesa-2b963",
  storageBucket: "maisha-pesa-2b963.firebasestorage.app",
  messagingSenderId: "642561507074",
  appId: "1:642561507074:web:596244f844b5dccb450c1b",
  measurementId: "G-JG9SR8TGV4"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

// 👇 Add this export
export { firebaseConfig };
