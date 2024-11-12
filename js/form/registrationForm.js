// Import the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

// Registration form elements
const registrationForm = document.getElementById("registrationForm");
const email = document.getElementById("email");
const fullname = document.getElementById("fullname");
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

// Error message elements
const emailError = document.getElementById("emailError");
const fullnameError = document.getElementById("fullnameError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const usernameError = document.getElementById("usernameError");

// Add submit event listener
registrationForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission behavior
  let valid = true;

  // Clear previous error messages
  emailError.textContent = "";
  fullnameError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
  usernameError.textContent = "";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if each field is empty and set error messages if necessary
  if (email.value.trim() === "") {
      emailError.textContent = "Email is required";
      valid = false;
  }
  else if (!emailPattern.test(email.value.trim())) {
    emailError.textContent = "Email is invalid";
    valid = false;
  }
  
  if (fullname.value.trim() === "") {
      fullnameError.textContent = "Full name is required";
      valid = false;
  }
  if (username.value.trim() === "") {
      usernameError.textContent = "Username is required";
      valid = false;
  }
  if (password.value.trim() === "") {
      passwordError.textContent = "Password is required";
      valid = false;
  }

  // Check if passwords match
  if (password.value !== confirmPassword.value) {
      confirmPasswordError.textContent = "Passwords do not match";
      valid = false;
  }

  // If form validation passes, create a new user
  if (valid) {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Registration successful
        const user = userCredential.user;
        console.log("User:", user);
        window.location.href="../../homepage.html";
      })
      .catch((error) => {
        // Handle registration errors
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/email-already-in-use') {
          emailError.textContent = "Email is already in use.";
        } else if (errorCode === 'auth/invalid-email') {
          emailError.textContent = "Invalid email format.";
        } else if (errorCode === 'auth/weak-password') {
          passwordError.textContent = "Password should be at least 6 characters.";
        } else {
          alert(errorMessage);
        }
      });
  }
});