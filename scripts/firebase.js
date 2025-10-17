// scripts/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { 
  getFirestore, collection, addDoc, getDocs, query 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// ⚙️ Firebase Config (from your Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCmQxci8kek6mMQSeyHlUFsgTd90gt6DRw",
  authDomain: "notora-86b2d.firebaseapp.com",
  projectId: "notora-86b2d",
  storageBucket: "notora-86b2d.firebasestorage.app",
  messagingSenderId: "197346651061",
  appId: "1:197346651061:web:c0dc05612eac8951ed47fc"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup, signOut, db, collection, addDoc, getDocs, query };
