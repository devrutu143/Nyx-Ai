
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// Your web app's Firebase configuration strictly applied from your provided SDK snippet
const firebaseConfig = {
  apiKey: "AIzaSyCqoSxJzEkP-cQJOgD61KDrByt2J8nQ_TM",
  authDomain: "sign-in-de1f7.firebaseapp.com",
  projectId: "sign-in-de1f7",
  storageBucket: "sign-in-de1f7.firebasestorage.app",
  messagingSenderId: "979770735071",
  appId: "1:979770735071:web:0a7fb1db27bf1f6d382c6a",
  measurementId: "G-VHPVDLKKHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional but included as per your SDK request)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Customizing Google Provider for an "in-app" experience
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  googleProvider, 
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  analytics
};
