// scripts/login.js
import { app } from "./firebase.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  setPersistence, 
  browserLocalPersistence 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const loginBtn = document.getElementById("googleLogin");

// Login button click
loginBtn.addEventListener("click", () => {
  setPersistence(auth, browserLocalPersistence)
    .then(() => signInWithPopup(auth, provider))
    .then((result) => {
      const user = result.user;
      localStorage.setItem("userData", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      }));
      window.location.href = "home.html"; // redirect after login
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});
