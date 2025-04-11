// Import Firebase SDK as ES Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Import Supabase Client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.27.0/+esm";

// Firebase config
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

// Initialize Supabase (if used later)
const supabase = createClient(
  "https://fwqpzgoprwvmvgmbivac.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cXB6Z29wcnd2bXZnbWJpdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4Mjk1NDEsImV4cCI6MjA0OTQwNTU0MX0.q9avx0jhYYVCch89S0GAtk2fJMhKbxxMHa6Qu7sktP4"
);

// Redirect if already logged in
if (localStorage.getItem("logIn") === "true") {
  window.location.href = "../../homepage.html";
}

// DOM Elements
const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let valid = true;
  emailError.textContent = "";
  passwordError.textContent = "";

  const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|io|co)$/i;

  // Email validation
  if (email.value.trim() === "") {
    emailError.textContent = "Email is required.";
    valid = false;
  } else if (
    !emailPattern.test(email.value.trim()) ||
    email.value.includes("\\") ||
    email.value.includes("//") ||
    /@[0-9]/.test(email.value)
  ) {
    emailError.textContent = "Email is invalid.";
    valid = false;
  }

  // Password validation
  if (password.value.trim() === "") {
    passwordError.textContent = "Password is required.";
    valid = false;
  } else if (password.value.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters.";
    valid = false;
  }

  // Login via Firebase if valid
  if (valid) {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed in:", user);
        localStorage.setItem("logIn", "true");
        window.location.href = "./homepage.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/wrong-password") {
          passwordError.textContent = "Incorrect password.";
        } else if (errorCode === "auth/user-not-found") {
          emailError.textContent = "User not found.";
        } else {
          emailError.textContent = "Enter a valid email or password.";
        }
      });
  }
});
