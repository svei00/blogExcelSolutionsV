// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: process.env.VITE_FIREBASE_API_KEY, // For React
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // For Vite
  authDomain: "excelsolutionsv-blog.firebaseapp.com",
  projectId: "excelsolutionsv-blog",
  storageBucket: "excelsolutionsv-blog.appspot.com",
  messagingSenderId: "370714568918",
  appId: "1:370714568918:web:87414f23cfce7c7a4f0177",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
