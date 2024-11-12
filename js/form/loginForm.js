// Import the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6fJyPKmyBrJizmkopfnlk2kb6cvs5cJM",
  authDomain: "my-media-285c9.firebaseapp.com",
  projectId: "my-media-285c9",
  storageBucket: "my-media-285c9.appspot.com",
  messagingSenderId: "36523224799",
  appId: "1:36523224799:web:5929b507b73581c69bc36a",
  measurementId: "G-D26DKE6ZVG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Login form elements
const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

// Error message elements
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

// Add submit event listener
loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  let valid = true;

  // Clear previous error messages
  emailError.textContent = "";
  passwordError.textContent = "";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if email is empty
  if (email.value.trim() === "") {
    emailError.textContent = "Email is required";
    valid = false;
  }
  else if (!emailPattern.test(email.value.trim())) {
    emailError.textContent = "Email is invalid";
    valid = false;
  }

  // Check if password is empty
  if (password.value.trim() === "") {
    passwordError.textContent = "Password is required";
    valid = false;
  } else if (password.value.length < 8) { // Check password length
    passwordError.textContent = "Password must be at least 8 characters";
    valid = false;
  }

  if (valid) {
    // Firebase authentication
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        console.log("User:", user);
        window.location.href = "./homepage.html"; // Redirect to homepage
      })
      .catch((error) => {
        // Handle login errors
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          passwordError.textContent = "Incorrect password.";
        } else if (errorCode === 'auth/user-not-found') {
          emailError.textContent = "User not found.";
        } else {
          alert("Invalid Email and Password");
        }
      });
  }
});
