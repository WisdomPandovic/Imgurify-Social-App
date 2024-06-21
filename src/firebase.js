// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4LLZVGIiz74wb79hZ4UnwwYtzG0x54gA",
  authDomain: "imgurify.firebaseapp.com",
  projectId: "imgurify",
  storageBucket: "imgurify.appspot.com",
  messagingSenderId: "471603031488",
  appId: "1:471603031488:web:33d08b1572969a24b96c25",
  measurementId: "G-Z9YRS82P16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };