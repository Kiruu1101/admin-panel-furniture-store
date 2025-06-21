import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";   // ✅ Realtime Database
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2-ocPCdM06nzOf8lvaKo3o4VG5SrBs3k",
  authDomain: "furniture-app-by-kiran.firebaseapp.com",
  databaseURL: "https://furniture-app-by-kiran-default-rtdb.firebaseio.com",
  projectId: "furniture-app-by-kiran",
  storageBucket: "furniture-app-by-kiran.appspot.com",
  messagingSenderId: "456788214237",
  appId: "1:456788214237:web:1c8b52bf6be2dabaa7b634",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);         // ✅ Realtime Database
export const auth = getAuth(app);           // Firebase Auth
export const storage = getStorage(app);     // Firebase Storage
