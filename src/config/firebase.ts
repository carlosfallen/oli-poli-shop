// FILE: src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCpoxCesQbohqMTAnJ67spGD8vSpSRq29Y",
  authDomain: "oli-poli-shop.firebaseapp.com",
  projectId: "oli-poli-shop",
  storageBucket: "oli-poli-shop.firebasestorage.app",
  messagingSenderId: "670166156792",
  appId: "1:670166156792:web:527bbd4ee31489f514c20d",
  measurementId: "G-L1CXZXB7HB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
