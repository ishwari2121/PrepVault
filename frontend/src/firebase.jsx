// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4vOthGQxlx_GewegjAk9sWIeOZJvXf84",
  authDomain: "prepvault-ebd15.firebaseapp.com",
  projectId: "prepvault-ebd15",
  storageBucket: "prepvault-ebd15.firebasestorage.app",
  messagingSenderId: "612618731337",
  appId: "1:612618731337:web:a3e5b37a2f71c872cbe498",
  measurementId: "G-RGV8D34YJ0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);