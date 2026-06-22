import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoKsv78Lqrfwknq_Ii0NRruqFuwIX0fmI",
  authDomain: "cervejariadb-72a98.firebaseapp.com",
  projectId: "cervejariadb-72a98",
  storageBucket: "cervejariadb-72a98.firebasestorage.app",
  messagingSenderId: "283073314822",
  appId: "1:283073314822:web:24d73eac3552adbae34387"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);