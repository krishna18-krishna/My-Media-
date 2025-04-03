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
        if (fullnameElement)
          fullnameElement.textContent =
            userDetails.fullname || "No fullname available";

        console.log("User details fetched:", userDetails);
        fetchProfile();

        // Fetch and display the user's posts with images
        fetchPostImages(currentUsername);
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
    if (fullnameElement) fullnameElement.textContent = "Not signed in";
  }

  // Log the updated state of the global variable
  console.log("Updated username:", currentUsername);
});

// Function to fetch posts with image URLs
async function fetchPostImages(currentUserName) {
  if (!currentUserName) {
    console.error("No username provided. Cannot fetch posts.");
    return;
  }

  try {
    // Query the 'posts' table, filtering by the signed-in user's username
    const { data: posts, error } = await supabase
      .from("posts")
      .select("author, imageSrc")
      .eq("author", currentUserName); // Filter posts by author

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
      imageElement.draggable="false";
      imageElement.alt = `Image by ${post.author}`;
      authorsPostsDiv.appendChild(imageElement);
    } else if (!post.imageSrc) {
      authorsPostsDiv.textContent = "No post added";
    }
  });
  PostCount();
}

// Event listener for back button
if (backButton) {
  backButton.addEventListener("click", () => {
    window.location.href = "../pages/homepage.html"; // Replace with your actual home page path
  });
} else {
  console.error("Back button not found in DOM.");
}

export { fetchUsername };

document.addEventListener("DOMContentLoaded", async () => {
  const imageContainer = document.querySelector(".image-container");

  // Create an image element
  const imageElement1 = document.createElement("img");
  imageElement1.classList.add("profile-image");

  // Set default image first
  imageElement1.src = "../assets/images/profile-pic.jpg";
  imageElement1.alt = "Profile Picture";
  imageContainer.appendChild(imageElement1);

  // Fetch the profile image from the database
  try {
    const { data, error } = await supabase
      .from("profile_images")
      .select("profile_image_url")
      .eq("author_name", currentUsername) // Ensure this matches the logged-in user's identifier
      .order("created_at", { ascending: false }) // Get the most recent image
      .limit(1);

    if (error) {
      console.error("Error fetching profile image:", error.message);
    } else if (data.length > 0) {
      console.log("Fetched profile image data:", data);
      const profileImageSrc = data[0].profile_image_url;

      // Update the image source if a profile image exists
      imageElement1.src = profileImageSrc;
    } else {
      console.log("No profile image found. Default image will be displayed.");
    }
  } catch (err) {
    console.error("Error fetching profile image:", err.message);
  }

  const editProfileButton = document.getElementById("editProfileButton");
  const overlay = document.createElement("div");
  document.body.appendChild(overlay);

  Object.assign(overlay.style, {
    display: "none",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: "999",
  });

  const editProfileForm = document.createElement("div");
  editProfileForm.style.display = "none";
  document.body.appendChild(editProfileForm);

  editProfileForm.innerHTML = `
        <div id="editProfileForm" style="display: block; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white;padding: 30px; border-radius: 15px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); text-align: center; z-index: 1000; width: 400px; height: 300px;">
          <div>
            <img src="${imageElement1.src}" id="previewImage"  class ="image-container" style=" width: 100px;height: 100px; margin: 0 auto; border-radius: 50%; object-fit: cover; " draggable="false">
            <button id="uploadImageButton" style="width: 40px; height: 40px; background-color: #00bfff; border: none; border-radius: 50%; color: white; font-size: 24px; cursor: pointer;">+</button>
            <input type="file" id="fileInput" style="display:none;" accept="image/*" />
          </div>
          <div style="margin-top: 80px;">
            <button id="submitButton" style="background-color: #00bfff; color: white; border: none; border-radius: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer; margin-right: 80px;">SUBMIT</button>
            <button id="cancelButton" style="background-color: #00bfff; color: white; border: none; border-radius: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer;">Cancel</button>
          </div>
        </div>
      `;

  // Show form when "Edit Profile" button is clicked
  editProfileButton.addEventListener("click", () => {
    overlay.style.display = "block";
    editProfileForm.style.display = "block";
  });

  // Cancel and close modal
  const closeModal = () => {
    overlay.style.display = "none";
    editProfileForm.style.display = "none";
  };
  editProfileForm
    .querySelector("#cancelButton")
    .addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  // Image upload functionality
  const uploadImageButton = editProfileForm.querySelector("#uploadImageButton");
  const fileInput = editProfileForm.querySelector("#fileInput");
  const previewImage = editProfileForm.querySelector("#previewImage");
  let selectedFile = null;

  uploadImageButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Directly set the preview image source
        previewImage.src = reader.result;
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
      selectedFile = file; // Save the selected file for submission
    } else {
      alert("Please upload a valid image file.");
      // Reset the preview image to the original profile image
      previewImage.src = imageElement1.src;
    }
  });

  // Submit profile image
  const submitButton = editProfileForm.querySelector("#submitButton");
  submitButton.addEventListener("click", async () => {
    if (!selectedFile) {
      alert("Please upload an image before submitting.");
      return;
    }

    // Read the image as a binary blob
    const reader = new FileReader();
    reader.onloadend = async function () {
      const imageBlob = reader.result; // This is the binary data

      if (profileId) {
        try {
          // Insert the image as binary data into the database
          const { data: dbData, error: dbError } = await supabase
            .from("profile_images")
            .update({ profile_image_url: previewImage.src }) // Update the profile_image_url column
            .eq("id", profileId);

          if (dbError) {
            console.error(
              "Error storing profile image in Supabase:",
              dbError.message
            );
            alert("Failed to save profile image. Please try again.");
          } else {
            console.log("Profile image uploaded successfully:", dbData);
            imageElement1.src = previewImage.src; // Display the updated profile image
            alert("Profile image updated successfully!");
            closeModal();
          }
        } catch (err) {
          console.error("Error submitting post:", err.message);
          alert("An error occurred. Please try again.");
        }
      } else {
        try {
          // Insert the image as binary data into the database
          const { data: dbData, error: dbError } = await supabase
            .from("profile_images")
            .insert([
              {
                author_name: currentUsername,
                image: imageBlob,
                image_format: selectedFile.type,
                profile_image_url: previewImage.src,
              },
            ]);

          if (dbError) {
            console.error(
              "Error storing profile image in Supabase:",
              dbError.message
            );
            alert("Failed to save profile image. Please try again.");
          } else {
            console.log("Profile image uploaded successfully:", dbData);
            imageElement1.src = previewImage.src; // Display the updated profile image
            alert("Profile image updated successfully!");
            closeModal();
          }
        } catch (err) {
          console.error("Error submitting post:", err.message);
          alert("An error occurred. Please try again.");
        }
      }
    };

    reader.readAsArrayBuffer(selectedFile); // Read the image as binary data
  });
});

async function fetchProfile() {
  // Replace 'currentUsername' with the name of the author you want to query
  const { data, error } = await supabase
    .from("profile_images")
    .select("*") // Fetch all columns, or specify specific ones like 'profile_image_url', 'image', etc.
    .eq("author_name", currentUsername); // Filter by author name

  if (error) {
    console.error("Error fetching data:", error.message);
  } else if (data.length > 0) {
    // Data found for the author
    console.log("Fetched profile data:", data[0]);

    // Example: Display the profile image in the UI
    const profileImageURL = data[0].profile_image_url;
    document.getElementById("previewImage").src = profileImageURL;
    document.querySelector(".profile-image").src = profileImageURL;
    profileId = data[0].id;
  } else {
    console.log("No profile data found for the specified author.");
  }
}


const detailsContainers = document.getElementById("details-containers")

// Function to fetch post count
async function PostCount() {
  try {
    const { count, error } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("author", currentUsername); // Replace "author_id_here" with the actual author ID

    if (error) {
      console.error("Error fetching post count:", error);
      return;
    }

    // Update the post count dynamically
    const postCountElement = detailsContainers.querySelector(".post-count");
    postCountElement.textContent = count || 0; // Fallback to 0 if count is null
    console.log("Post :"+count)
  } catch (err) {
    console.error("Unexpected error fetching post count:", err);
  }
}

// Fetch the post count
PostCount();