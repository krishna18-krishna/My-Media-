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
      imageElement.alt = `Image by ${post.author}`;
      authorsPostsDiv.appendChild(imageElement);
    } else if (!post.imageSrc) {
      authorsPostsDiv.textContent = "No post added";
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

document.addEventListener("DOMContentLoaded", () => {
  const imageContainer = document.querySelector(".image-container");

  // Create an image element
  const imageElement = document.createElement("img");
  imageElement.classList.add("profile-image");
  let profilrImageSrc = "./assets/images/profile-pic.jpg";
  imageElement.src = profilrImageSrc;
  imageElement.alt = "Profile Picture";
  imageContainer.appendChild(imageElement);

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
      <div id="editProfileForm" style="
        display: block;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        text-align: center;
        z-index: 1000;
        width: 300px;
      ">
        <div>
          <img src="${profilrImageSrc}" id="previewImage" style="
            width: 100px;
            height: 100px;
            margin: 0 auto;
            border-radius: 50%;
            object-fit: cover;
          ">
          <button id="uploadImageButton" style="
            width: 40px;
            height: 40px;
            background-color: #00bfff;
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 24px;
            cursor: pointer;
          ">+</button>
          <input type="file" id="fileInput" style="display:none;" accept="image/*" />
        </div>
        <div style="margin-top: 20px;">
          <button id="submitButton" style="
            background-color: #00bfff;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            margin-right: 10px;
          ">SUBMIT</button>
          <button id="cancelButton" style="
            background-color: #00bfff;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
          ">Cancel</button>
        </div>
      </div>
    `;

  // Event listener to open the profile form
  editProfileButton.addEventListener("click", () => {
    overlay.style.display = "block";
    editProfileForm.style.display = "block";
  });

  // Close form and overlay on cancel button click
  editProfileForm
    .querySelector("#cancelButton")
    .addEventListener("click", () => {
      overlay.style.display = "none";
      editProfileForm.style.display = "none";
    });

  // Close form and overlay on clicking overlay
  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    editProfileForm.style.display = "none";
  });

  const uploadImageButton = editProfileForm.querySelector("#uploadImageButton");
  const fileInput = editProfileForm.querySelector("#fileInput");
  const previewImage = editProfileForm.querySelector("#previewImage");

  uploadImageButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result; // Preview the uploaded image
        imageElement.src = e.target.result; // Update the main profile image
      };
      reader.readAsDataURL(file); // Read the file as a base64 URL
    }
  });

  // Function to upload the image to Supabase storage and return the public URL
  const uploadImageToSupabase = async (file) => {
    const safeFileName = file.name.replace(/\s+/g, '_'); // Replace spaces with underscores
    const filePath = `${encodeURIComponent(safeFileName)}`; // Do not include bucket name in the path
    console.log(`Uploading to file path: ${filePath}`); // Log file path for debugging
  
    try {
      const { data, error } = await supabase.storage
        .from('profile_images') // Use the correct bucket name
        .upload(filePath, file);
  
      if (error) {
        console.error('Error uploading image:', error.message);
        alert('Error uploading image: ' + error.message);
        return null;
      }
  
      const publicUrl = supabase.storage.from('profile_images').getPublicUrl(filePath).publicURL;
      console.log('Uploaded image URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error during image upload:', error.message);
      return null;
    }
  };

  // Handle form submit to upload the image and save URL to the database
  editProfileForm
    .querySelector("#submitButton")
    .addEventListener("click", async () => {
      const file = fileInput.files[0];
      if (file) {
        const imageUrl = await uploadImageToSupabase(file);
        if (imageUrl) {
          console.log("Image URL:", imageUrl);
          // Save the image URL to the profile_images table in Supabase
          const { data, error } = await supabase
            .from("profile_images")
            .insert([
              { author_name: "User Name", profile_image_url: imageUrl },
            ]);

          if (error) {
            console.error(
              "Error inserting image URL into profile_images table:",
              error.message
            );
            alert("Error saving profile image to database.");
          } else {
            console.log("Profile image saved to database:", data);
            overlay.style.display = "none";
            editProfileForm.style.display = "none";
          }
        } else {
          console.log("Failed to upload image to Supabase.");
        }
      } else {
        alert("Please choose a file before submitting.");
      }
    });
});
