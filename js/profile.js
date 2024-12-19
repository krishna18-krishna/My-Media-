// Import Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getAuth,

    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getDatabase, } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {
    getStorage,
    ref as storeRef,

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

//Import supabase service
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.27.0/+esm"; 

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

// Supabase configuration
const supabaseUrl = "https://fwqpzgoprwvmvgmbivac.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cXB6Z29wcnd2bXZnbWJpdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4Mjk1NDEsImV4cCI6MjA0OTQwNTU0MX0.q9avx0jhYYVCch89S0GAtk2fJMhKbxxMHa6Qu7sktP4";
console.log(supabaseUrl);
console.log(supabaseKey);



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const supabase = createClient(supabaseUrl, supabaseKey);
console.log(supabase);

// DOM Elements
const usernameElement = document.getElementById("username");
const fullnameElement = document.getElementById("fullname"); // Element for fullname
const backButton = document.getElementById("back-button");

// Function to fetch user details from Firestore by email
async function fetchUsername(email) {
    try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const userId = userDoc.id;

            return { ...userData, id: userId };
        } else {
            console.log("No user found with the provided email");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDetails = await fetchUsername(user.email);
            if (userDetails) {
                // Display username
                
                usernameElement.textContent = userDetails.username || "No username found";
               
                // Display fullname
           
                 document.querySelector(".fullname").innerHTML = userDetails.fullname;
            

                console.log("User details fetched: ", userDetails);
            } else {
                if (usernameElement) usernameElement.textContent = "User not found";
                if (fullnameElement) fullnameElement.textContent = "No fullname available";
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            if (usernameElement) usernameElement.textContent = "Error fetching user details";
            if (fullnameElement) fullnameElement.textContent = "Error loading fullname";
        }
    } else {
        // No user is signed in
        if (usernameElement) usernameElement.textContent = "Not signed in";
        if (fullnameElement) fullnameElement.textContent = "Not signed in";
    }
});



// Event listener for back button
if (backButton) {
    backButton.addEventListener("click", () => {
        window.location.href = "./homepage.html"; // Replace with the actual path to your home page
    });
} else {
    console.error("Back button not found in DOM.");
}

export { fetchUsername };

let userID = null;

// Fetch and console the authors' details
async function getAuthors() {
    try {
        const { data, error } = await supabase
            .from("Authors") // Replace "Authors" with your actual table name
            .select("*"); // Adjust the columns you want to retrieve, e.g., `.select("name, bio")`

        if (error) {
            console.error("Error fetching authors:", error);
            return;
        }

        if (data && data.length > 0) {
            console.log("Authors Data:", data);
        } else {
            console.log("No authors found.");
        }
    } catch (error) {
        console.error("Unexpected error fetching authors:", error);
    }
}

// Call the function
getAuthors();



const uploadButton = document.getElementById('uploadButton');
const imageInput = document.getElementById('fileInput');
const uploadStatus = document.getElementById('uploadStatus');
const profileImagePreview = document.getElementById('profileImagePreview');

/* // Supabase bucket name
const profile_image = 'profile-images';

// Handle the click event for the upload button
uploadButton.addEventListener('click', () => {
    imageInput.click(); // Open the file dialog
});

// Handle the file input change event
imageInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];

    if (!file) {
        uploadStatus.textContent = "No file selected.";
        return;
    }

    const userID = localStorage.getItem("id");
    if (!userID) {
        uploadStatus.textContent = "User ID not found.";
        return;
    }

    const fileName = `${userID}-${Date.now()}-${file.name}`; // Unique filename
    const filePath = `${userID}/${fileName}`;

    try {
        // Upload the file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(profile_image)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            throw error;
        }

        // Fetch the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
            .from(profile_image)
            .getPublicUrl(filePath);

        if (publicUrlData.publicUrl) {
            // Update the profile image preview
            uploadStatus.textContent = "Upload successful!";
            profileImagePreview.src = publicUrlData.publicUrl; // Display the uploaded image

            console.log("Image uploaded successfully. Public URL:", publicUrlData.publicUrl);
        } else {
            uploadStatus.textContent = "Failed to generate public URL.";
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        uploadStatus.textContent = "Error uploading file.";
    }
});

// Function to load the profile image
async function loadProfileImage(userId) {
    try {
        const filePath = `${userId}/profile-image.jpg`; // Replace with actual logic if stored in Firestore or Supabase table

        // Fetch the public URL
        const { data, error } = supabase.storage.from(profile_image).getPublicUrl(filePath);

        if (error || !data.publicUrl) {
            console.error("Error fetching profile image URL:", error);
            profileImagePreview.src = "default-profile.png"; // Fallback to a default image
        } else {
            profileImagePreview.src = data.publicUrl; // Display the profile image
        }
    } catch (error) {
        console.error("Error fetching profile image:", error);
        profileImagePreview.src = "default-profile.png"; // Fallback to a default image
    }
}

// Example usage: Call `loadProfileImage` with the logged-in user's ID
const loggedInUserId = localStorage.getItem("id");
if (loggedInUserId) {
    loadProfileImage(loggedInUserId);
} */
