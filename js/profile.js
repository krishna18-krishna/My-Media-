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
    query,
    where
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
    measurementId: "G-D26DKE6ZVG"
};

// Supabase configuration
const supabaseUrl = "https://fwqpzgoprwvmvgmbivac.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cXB6Z29wcnd2bXZnbWJpdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4Mjk1NDEsImV4cCI6MjA0OTQwNTU0MX0.q9avx0jhYYVCch89S0GAtk2fJMhKbxxMHa6Qu7sktP4";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// DOM Elements
const usernameElement = document.getElementById("username");
const fullnameElement = document.getElementById("fullname");
const backButton = document.getElementById("back-button");

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
        console.error("Firestore permission error:", error.code, error.message, error);
        return null;
    }
}
/* let username ;
// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Authenticated user:", user.email);

        try {
            const userDetails = await fetchUsername(user.email);

            if (userDetails) {
                // Safely update DOM elements if they exist
                if (usernameElement) usernameElement.textContent = userDetails.username || "No username found";
                if (fullnameElement) fullnameElement.textContent = userDetails.fullname || "No fullname available";

                console.log("User details fetched:", userDetails);
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
        // Handle when no user is signed in
        if (usernameElement) usernameElement.textContent = "Not signed in";
        if (fullnameElement) fullnameElement.textContent = "Not signed in";
    }
}); */


let userName ;
// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Authenticated user:", user.email);

        try {
            const userDetails = await fetchUsername(user.email);

            if (userDetails) {
                // Store the username
                const userName = userDetails.username;

                // Update DOM elements with user details if needed
                if (usernameElement) usernameElement.textContent = userName;
                if (fullnameElement) fullnameElement.textContent = userDetails.fullname || "No fullname available";

                console.log("User details fetched:", userDetails);

                // Fetch and display the user's posts with images
                fetchPostImages(userName);
            } else {
                console.error("User details not found");
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    } else {
        // Handle when no user is signed in
        if (usernameElement) usernameElement.textContent = "Not signed in";
        if (fullnameElement) fullnameElement.textContent = "Not signed in";
    }
});



 // Function to fetch posts with image URLs
 async function fetchPostImages(userName) {
    if (!userName) {
        console.error("No username provided. Cannot fetch posts.");
        return;
    }

    try {
        // Query the 'posts' table, filtering by the signed-in user's username
        const { data: posts, error } = await supabase
            .from("posts")
            .select("author, imageSrc")
            .eq("author", userName); // Filter posts by author

        if (error) {
            console.error("Supabase Query Error:", error);
            throw error;
        }

        renderPostImages(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        const authorsPostsDiv = document.querySelector(".authors-posts");
        if (authorsPostsDiv) {
            authorsPostsDiv.textContent = "Error loading posts.";
        }
    }
}

// Function to render only images in the DOM
function renderPostImages(posts) {
    const authorsPostsDiv = document.querySelector(".authors-posts");
    if (!authorsPostsDiv) return;

    // Clear any existing content
    authorsPostsDiv.innerHTML = "";

    if (!posts || posts.length === 0) {
        const noPostsMessage = document.createElement("div");
        noPostsMessage.classList.add("no-posts-message");
        noPostsMessage.textContent = "No post added";
        authorsPostsDiv.appendChild(noPostsMessage);
        return;
    }

    // Create and append images dynamically
    posts.forEach((post) => {
        if (post.imageSrc) {
            const imageElement = document.createElement("img");
            imageElement.classList.add("post-image");
            imageElement.src = post.imageSrc;
            imageElement.alt = `Image by ${post.author}`;
            authorsPostsDiv.appendChild(imageElement);
        }
        else if(!post.imageSrc){
            authorsPostsDiv.textContent = "No post add" 
        }
    });
}


// Event listener for back button
if (backButton) {
    backButton.addEventListener("click", () => {
        window.location.href = "./homepage.html"; // Replace with your actual home page path
    });
} else {
    console.error("Back button not found in DOM.");
}

export { fetchUsername };



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
