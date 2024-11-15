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


/* //chatgpt// Function to check if username is already taken
async function isUsernameAvailable(username) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty; // true if no matching username found
}

// Add submit event listener
registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission behavior
  let valid = true;

  // Clear previous error messages
  emailError.textContent = "";
  fullnameError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
  usernameError.textContent = "";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate form fields
  if (email.value.trim() === "") {
    emailError.textContent = "Email is required";
    valid = false;
  } else if (!emailPattern.test(email.value.trim())) {
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
  } else {
    // Check if username is available
    const usernameAvailable = await isUsernameAvailable(username.value.trim());
    if (!usernameAvailable) {
      usernameError.textContent = "Username is already in use.";
      valid = false;
    }
  }
  
  if (password.value.trim() === "") {
    passwordError.textContent = "Password is required";
    valid = false;
  }
  
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.textContent = "Passwords do not match";
    valid = false;
  }

  // If form validation passes, create a new user
  if (valid) {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        // Registration successful
        const user = userCredential.user;

        // Save username in Firestore under a "users" collection
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          email: email.value,
          fullname: fullname.value,
          username: username.value
        });

        console.log("User registered:", user);
        window.location.href = "../../homepage.html";
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
}); */


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

  const emailPattern1 = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|io|co)$/i;
  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const usernamePattern = /^[a-z0-9._]+$/;

  // Check if each field is empty and set error messages if necessary
  if (email.value.trim() === "") {
      emailError.textContent = "Email is required";
      valid = false;
  }
  else if (!emailPattern.test(email.value.trim())) {
    emailError.textContent = "Email is invalid";
    valid = false;
  }
  else if (!emailPattern1.test(email.value.trim())) {
    emailError.textContent = "Please enter a valid email";
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
  else if (!usernamePattern.test(username.value.trim())) {
    usernameError.textContent = "Username can only contain letters(a-z), numbers(0-9), special characters like(_) and (.)";
    valid = false;  
  }
  if (password.value.trim() === "") {
      passwordError.textContent = "Password is required";
      valid = false;
  }
  else if (!passwordPattern.test(password.value.trim())) {
    passwordError.textContent = "Password must contain at least one uppercase letter, one lowercase letter, onenumber, and one special character";
    valid = false;
  }

  // Check if passwords match
  if (password.value !== confirmPassword.value) {
      confirmPasswordError.textContent = "Passwords do not match";
      valid = false;
  }
  else if (!passwordPattern.test(password.value.trim())) {
      confirmPassword.textContent = "Password must contain at least one uppercase letter, one lowercase letter, onenumber, and one special character";
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