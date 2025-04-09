// Import Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Import Supabase service
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.27.0/+esm";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6fJyPKmyBrJizmkopfnlk2kb6cvs5cJM",
  authDomain: "my-media-285c9.firebaseapp.com",
  projectId: "my-media-285c9",
  storageBucket: "my-media-285c9.appspot.com",
  messagingSenderId: "36523224799",
  appId: "1:36523224799:web:5929b507b73581c69bc36a",
  measurementId: "G-D26DKE6ZVG",
};

// Supabase configuration
const supabaseUrl = "https://fwqpzgoprwvmvgmbivac.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cXB6Z29wcnd2bXZnbWJpdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4Mjk1NDEsImV4cCI6MjA0OTQwNTU0MX0.q9avx0jhYYVCch89S0GAtk2fJMhKbxxMHa6Qu7sktP4";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let profileId = null;
// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// DOM Elements
const usernameElement = document.getElementById("username");

// Function to fetch user details from Firestore by email
async function fetchUsername(email) {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data();
    } else {
      console.error("No user found with email:", email);
      return null;
    }
  } catch (error) {
    console.error(
      "Firestore permission error:",
      error.code,
      error.message,
      error
    );
    return null;
  }
}
let currentUsername; // Global username variable

// Log the initial state of the global variable
console.log("Initial username:", currentUsername);

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Authenticated user:", user.email);

    try {
      const userDetails = await fetchUsername(user.email);

      if (userDetails) {
        // Store the username in the global variable
        currentUsername = userDetails.username;

        // Update DOM elements with user details
        if (usernameElement) usernameElement.textContent = currentUsername;
        fetchProfile();

        // Fetch and display the user's posts with images
        // fetchPostImages(currentUsername);
      } else {
        console.error("User details not found");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  } else {
    // Handle when no user is signed in
    currentUsername = null; // Reset the global username variable
    if (usernameElement) usernameElement.textContent = "Not signed in";
  }

  // Log the updated state of the global variable
  console.log("Updated username:", currentUsername);
});



//chatbox to homepage 

const logo = document.getElementById("logo");

logo.addEventListener("click", ()=>{
    window.location.href = "../homepage.html"
})

const userIcon = document.getElementById("userIcon");

userIcon.addEventListener("click", ()=>{
    window.location.href = "../profile.html"
});

async function fetchProfile() {
    const defaultURL = "assets/images/profile-pic.jpg";
  
    if (!currentUsername) {
      console.warn("currentUsername is not set yet.");
      userIcon.src = defaultURL;
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from("profile_images")
        .select("profile_image_url")
        .eq("author_name", currentUsername)
        .single();
  
      if (error) {
        console.error("Error fetching profile image:", error.message);
        userIcon.src = defaultURL;
        return;
      }
  
      if (data && data.profile_image_url) {
        userIcon.src = data.profile_image_url;
      } else {
        console.warn("No profile image found for user:", currentUsername);
        userIcon.src = defaultURL;
      }
    } catch (err) {
      console.error("Unexpected error in fetchProfile:", err);
      userIcon.src = defaultURL;
    }
  }


