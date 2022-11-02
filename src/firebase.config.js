// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_cxcpc0iOLguGGPFpXyEchxYd_hUSSGU",
  authDomain: "house-marketplace-app-fced2.firebaseapp.com",
  projectId: "house-marketplace-app-fced2",
  storageBucket: "house-marketplace-app-fced2.appspot.com",
  messagingSenderId: "614446684926",
  appId: "1:614446684926:web:26edebbbb37faad070a3af",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
