import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDE_ADBbxH4l1hNhZQWGnZ8kfThbdWWtW4",
  authDomain: "curriculo-interativo-ufsc.firebaseapp.com",
  projectId: "curriculo-interativo-ufsc",
  storageBucket: "curriculo-interativo-ufsc.firebasestorage.app",
  messagingSenderId: "729508325583",
  appId: "1:729508325583:web:84f2adea4c792f476f2fba",
  measurementId: "G-FC4CYSPE11",
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
