// Import the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app);

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

// Function to check if username is already taken
async function isUsernameAvailable(username) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty; // true if no matching username found
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false;
  }
}

// Add submit event listener
registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission behavior
  let valid = true;

  // Clear previous error messages
  emailError.textContent = "";
  fullnameError.textContent = "";
  usernameError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";

    const emailPattern = /^[^\s@]+@[^0-9][^\s@]+\.[a-z]{2,}$/i;
    const emailPattern1 = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|io|co)$/i;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
    const usernamePattern = /^[a-z0-9_]+$/; // Only allows lowercase letters, numbers, and underscore
    const hasSpace = /\s/; // Check for whitespace characters
    const fullNamePattern = /^[a-zA-Z\s]+$/;
  
    // Full name validation
    if (fullname.value.trim() === "") {
      fullnameError.textContent = "Full name is required.";
      valid = false;
    } else if (fullname.value.trim().length < 3) {
      fullnameError.textContent = "Full name must have at least 3 characters.";
      valid = false;
    } else if (!fullNamePattern.test(fullname.value.trim())) {
      fullnameError.textContent = "Full name cannot contain special characters or numbers.";
      valid = false;
    }
     if (hasSpace.test(fullname.value.trim())) {
      fullnameError.textContent = "Full name cannot contain spaces.";
      valid = false
    }
  
  
    // Email validation
     if (email.value.trim() === "") {
      emailError.textContent = "Email is required.";
      valid = false;
    } else if (!emailPattern1.test(email.value.trim())) {
      emailError.textContent = "Email is invalid.";
      valid = false;
    } else if (!emailPattern1.test(email.value.trim())) {
      emailError.textContent = "Please enter a valid email.";
      valid = false;
    }
    else if (!emailPattern1.test(email.value.trim())){
      if(/@[0-9]/.test(email.value.trim())){
        emailError.textContent = "Email is invalid.";
        valid = false;
      }
    } 
  
      if (email.value.trim() === "") {
        emailError.textContent = "Email is required.";
        valid = false;
      } else if (!emailPattern1.test(email.value.trim())) {
        emailError.textContent = "Email is invalid.";
        valid = false;
      } else if (email.value.includes("\\")) { // Check for backslash
        emailError.textContent = "Email is invalid.";
        valid = false;
      } else if(email.value.includes("//")){
        emailError.textContent = "Email is invalid.";
        valid = false
      }
      else if (!emailPattern1.test(email.value.trim())) {
        emailError.textContent = "Please enter a valid email.";
        valid = false;
      } else if (/@[0-9]/.test(email.value.trim())) { // Ensure domain doesn't start with a number
        emailError.textContent = "Email is invalid.";
        valid = false;
      }
  
    // Username validation
    if (username.value.trim() === "") {
      usernameError.textContent = "Username is required.";
      valid = false;
    } else if (!usernamePattern.test(username.value.trim())) {
      usernameError.textContent = "Username can only contain lowercase letters, numbers, and underscores.";
      valid = false;
    }
    else if (/\s/.test(username.value)) {
      // Checks for any spaces within the username
      usernameError.textContent = "Username cannot contain spaces.";
      valid = false;
    }
    else if (username.value.trim().length < 4) {
      usernameError.textContent = "Username must have at least 4 characters.";
      valid = false;
    } else if (!(await isUsernameAvailable(username.value.trim()))) {
      usernameError.textContent = "Username is already taken.";
      valid = false;
    }
  
    // Password validation
    if (password.value.trim() === "") {
      passwordError.textContent = "Password is required.";
      valid = false;
    } else if (!passwordPattern.test(password.value.trim())) {
      passwordError.textContent = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
      valid = false;
    }
  
    // Confirm password validation
    if (password.value !== confirmPassword.value) {
      confirmPasswordError.textContent = "Passwords do not match.";
      valid = false;
    }

  // If form validation passes, create a new user
  if (valid) {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Save user details to Firestore
        await setDoc(doc(db, "users", user.uid), {
          username: username.value.trim(),
          email: email.value.trim(),
          fullname: fullname.value.trim()
        });

        console.log("User registered:", user);
        window.location.href = "./homepage.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during registration:", errorMessage);

        if (errorCode === 'auth/email-already-in-use') {
          emailError.textContent = "Email is already in use.";
        } else if (errorCode === 'auth/invalid-email') {
          emailError.textContent = "Invalid email format.";
        } else if (errorCode === 'auth/weak-password') {
          passwordError.textContent = "Password should be at least 6 characters.";
        } else {
          alert("An unexpected error occurred: " + errorMessage);
        }
      });
  }
});
