import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
// import { getStorage, ref } from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxz3cIHBhKRT1bm3JQrATqA-DyjCF4CbY",
  authDomain: "netto-move.firebaseapp.com",
  projectId: "netto-move",
  storageBucket: "netto-move.appspot.com",
  messagingSenderId: "791792649023",
  appId: "1:791792649023:web:38868642321f1f04ecc98a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const users = collection(db, "Users");
const companies = collection(db, 'Companies');

export {
  app,
  db,
  users,
  companies,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  sendPasswordResetEmail
};
