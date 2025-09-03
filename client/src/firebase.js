// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "homiees-c8337.firebaseapp.com",
  projectId: "homiees-c8337",
  storageBucket: "homiees-c8337.firebasestorage.app",
  messagingSenderId: "257199846913",
  appId: "1:257199846913:web:539d7fcd389d03fc79b200"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);