// Import Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Import Supabase from CDN
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

// Initialize Firebase and Supabase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const supabase = createClient(supabaseUrl, supabaseKey);
console.log(supabase);

  let currentUsername = null; // Declare globally to ensure accessibility

// DOM content loaded event
document.addEventListener("DOMContentLoaded", () => {
  fetchAllPosts();

  // setting menu
  const userIcon = document.getElementById("userIcon");
  if (userIcon) {
    userIcon.addEventListener("click", toggleMenu);
  }

  function toggleMenu() {
    const settingsMenu = document.getElementById("settings-menu");
    if (settingsMenu) {
      settingsMenu.style.display =
        settingsMenu.style.display === "block" ? "none" : "block";
    } else {
      console.error("Element with ID 'settings-menu' not found.");
    }
  }

  // Close settings menu when clicking outside
  document.addEventListener("click", function (event) {
    const settingsMenu = document.getElementById("settings-menu");
    const profileIcon = document.querySelector(".nav-user-icon img");

    if (
      settingsMenu &&
      profileIcon &&
      !settingsMenu.contains(event.target) &&
      event.target !== profileIcon
    ) {
      settingsMenu.style.display = "none";
    }
  });


 

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userId = user.uid;
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          currentUsername = userDoc.data().username || "Guest";
  
          // Fetch posts only after currentUsername is initialized
          fetchAllPosts();
        } else {
          console.error("No user document found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching username from Firestore:", error);
      }
    } else {
      console.log("No user is currently signed in.");
      currentUsername = null; // Reset username if no user
    }
  });
  
  // Clear form function
  function clearForm() {
    document.getElementById("post-content").value = "";
    document.getElementById("post-media").value = "";
    document.getElementById("imagePreview").src = "#";
    document.getElementById("imagePreview").style.display = "none";
  }



// Submit post to Supabase
async function submitPost() {
  const postContent = document.getElementById("post-content").value.trim();
  const postImageSrc = document.getElementById("imagePreview").src;

  // Check if both content and image are missing
  if (!postContent ){
    alert("Please write the content.");
    return; // Prevent form submission
  }
  if(!postImageSrc || postImageSrc === "#"){
    alert("Please select the image");
    return;
  }
  try {
    // Log the input before sending
    console.log("Submitting post with content:", postContent);
    console.log("Submitting post with imageSrc:", postImageSrc);

    // Insert into Supabase
    const { data, error } = await supabase
      .from("posts") // Ensure this matches your table name
      .insert([{ content: postContent, imageSrc: postImageSrc, author: currentUsername }]).select(); // Ensure column names match

    if (error) {
      console.error("Error storing post in Supabase:", error.message);
    } else {
      console.log("Post stored successfully in Supabase:", data);
    }
  } catch (err) {
    console.error("Error submitting post:", err.message);
  }

  // Clear the form after submission
  clearForm();

  // Fetch updated posts
  fetchAllPosts();
}

// Attach function to the window for global access
window.submitPost = submitPost;


  // Handle media upload
  const mediaInput = document.getElementById("post-media");
  const imagePreview = document.getElementById("imagePreview");

  mediaInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onloadend = function () {
        const mediaDataUrl = reader.result;
        imagePreview.src = mediaDataUrl;
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
      imagePreview.src = "";
      imagePreview.style.display = "none";
    }
  });

  // Add "Add Post" button
  const addPostButton = document.createElement("button");
  addPostButton.textContent = "Add Post";
  addPostButton.id = "add-post-button";
  addPostButton.style.position = "fixed";
  addPostButton.style.bottom = "20px";
  addPostButton.style.right = "20px";
  addPostButton.style.padding = "10px 20px";
  addPostButton.style.backgroundColor = "#007bff";
  addPostButton.style.color = "#fff";
  addPostButton.style.border = "none";
  addPostButton.style.borderRadius = "5px";
  addPostButton.style.cursor = "pointer";

  // Append the button to the body
  document.body.appendChild(addPostButton);

  // Show post form
  window.showPostForm = function () {
    const postForm = document.getElementById("post-form");
    if (postForm) {
      console.log("Showing post form.");
      postForm.style.display = "block";
    } else {
      console.error("Post form not found.");
    }
  };

  // Hide post form
  window.hidePostForm = function () {
    const postForm = document.getElementById("post-form");
    if (postForm) {
      console.log("Hiding post form.");
      postForm.style.display = "none";
      clearForm();
    } else {
      console.error("Post form not found.");
    }
  };

  // Attach event listener to the button
  addPostButton.addEventListener("click", function () {
    console.log("Add Post button clicked.");
    showPostForm();
  });

  // Submit post on button click
  document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submit-post");
    if (submitButton) {
      submitButton.addEventListener("click", submitPost);
    } else {
      console.error("Submit button not found.");
    }
  });

  window.showLogoutAlert = function () {
    const logoutAlert = document.getElementById("logout-alert");
    if (logoutAlert) {
      logoutAlert.style.display = "block";
    } else {
      console.error("Logout alert element not found.");
    }
  };

  window.hideLogoutAlert = function () {
    const logoutAlert = document.getElementById("logout-alert");
    if (logoutAlert) {
      logoutAlert.style.display = "none";
    } else {
      console.error("Logout alert element not found.");
    }
  };

  window.logout = function () {
    console.log("User logged out!");
    hideLogoutAlert();
    window.location.href = "../index.html"; // Redirect to the login page
  };
});


// Example: Fetching all data from the "posts" table
async function fetchAllPosts() {

  document.getElementById("post-form").style.display="none"
  let { data, error } = await supabase
    .from("posts") // Replace "posts" with your table name
    .select("*"); // Select all columns; you can specify column names if needed
    const postContainer = document.getElementById("post-container");
    postContainer.innerHTML=""
  if (error) {
    console.error("Error fetching posts:", error);
  } else {
  
    data=sortPostsByCreatedAt(data)
    function sortPostsByCreatedAt(posts, order = "desc") {
      return posts.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    
    data.forEach(post => {
        
    let dateTime=formatDateTime(post.created_at);
    
      

    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    const postHeader = `
      <div class="post-header" style="display: flex; align-items: center; margin-bottom: 10px;">
        <img src="assets/images/profile-pic.jpg" alt="Profile Picture" style="width: 40px; height: 40px; border-radius: 50%; cursor: pointer; margin-right: 10px;">
        <div class="userInfo">
          <span style="font-weight: bold;">${post.author}</span>
          <span style="font-size: 12px; color: #555;">${dateTime.date} ${dateTime.time}</span>
        </div>
         <div class="post-options" style="margin-left: auto; position: relative;">
            <button class="options-button" style="background: none; border: none; cursor: pointer; font-size: 20px;">⋮</button>
            <div class="options-menu" style="display: none; position: absolute; right: 0; background: white; border: 1px solid #ccc; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
              <button class="delete-post" style="padding: 10px; width: 100%; border: none; background: none; cursor: pointer;">Delete</button>
            </div>
          </div>
      </div>
    `;
    postDiv.innerHTML = postHeader;

    

      const postText = document.createElement("p");
      postText.textContent = post.content;
      postDiv.appendChild(postText);


      const postImage = document.createElement("img");
      postImage.src = post.imageSrc;
      postImage.alt = "Uploaded Image";
      postImage.style.maxWidth = "100%";
      postDiv.appendChild(postImage);

    // Buttons container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "start";
    buttonContainer.style.gap = "100px";
    buttonContainer.style.marginLeft = "10px";
    buttonContainer.style.marginTop = "20px";
    
    // Like button
    const likeDiv = document.createElement("div");
    likeDiv.classList.add("like-button");
    likeDiv.innerHTML = `
      <img class="like-img" src="../assets/images/like.png" alt="Like">
      <span class="like-count">0</span>
    `;
    
    let liked = false;
    let likeCount = 0; // Initialize like count
    
    likeDiv.addEventListener("click", () => {
      if (!liked) {
        liked = true;
        likeCount += 1; // Increment like count only once
        likeDiv.querySelector(".like-img").src = "../assets/images/like-blue.png"; // Change to blue like icon
        likeDiv.querySelector(".like-count").textContent = likeCount; // Update the like count
      } else {
        liked = false;
        likeCount -= 1; // Decrement like count
        likeDiv.querySelector(".like-img").src = "../assets/images/like.png"; // Change back to default like icon
        likeDiv.querySelector(".like-count").textContent = likeCount; // Update the like count
      }
    });
    


    // Comment button
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment-button");
    commentDiv.innerHTML = `
    <img class="comment-img" src="../assets/images/comments.png" alt="Comments">
    <span class="comment-count">0</span>
    `;
    
    // Share button
    const shareDiv = document.createElement("div");
    shareDiv.classList.add("share-button");
    shareDiv.innerHTML = `
    <img class="share-img" src="../assets/images/share.png" alt="Share">
    <span class="share-count">0</span>
    `;
    
    // Append buttons to the button container
    buttonContainer.appendChild(likeDiv);
    buttonContainer.appendChild(commentDiv);
    buttonContainer.appendChild(shareDiv);
    
    // Append the button container to the post
    postDiv.appendChild(buttonContainer);

      // Show/Hide the options menu when clicking the three dots button
      const optionsButton = postDiv.querySelector(".options-button");
      const optionsMenu = postDiv.querySelector(".options-menu");

      if (post.author !== currentUsername) {
        optionsButton.style.display = "none"
      }
      else{
      optionsButton.addEventListener("click", () => {
        const isVisible = optionsMenu.style.display === "block";
        optionsMenu.style.display = isVisible ? "none" : "block";
      });
      }
  
      // Event listener for delete button
      const deleteButton = postDiv.querySelector(".delete-post");

      deleteButton.addEventListener("click",async()=>{
      
        if (post.author !== currentUsername) {
          optionsButton.style.display = "none"
        }

        const confirmDelete = confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
          try {
            // Make DELETE request to Supabase
            const { error } = await supabase
              .from("posts") // Replace 'posts' with your actual table name
              .delete()
              .eq("id", post.id); // Match the post content
      
            if (error) {
              console.error("Error deleting post from Supabase:", error);
              alert("Failed to delete the post. Please try again.");
            } else {
              postDiv.remove(); // Remove the post from the DOM
              alert("Post deleted successfully.");
            }
          } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred. Please try again.");
          }
        }
      })
    
    postContainer.appendChild(postDiv);

  });


  }
}




function formatDateTime(inputDatetime) {
  // Parse the input as UTC
  const date = new Date(`${inputDatetime}Z`); // Append 'Z' to treat input as UTC

  // Format the date as dd/mm/yy (Indian style)
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  // Format the time as hh:mm AM/PM (Indian time)
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  // Return the formatted date and time
  return { date: formattedDate, time: formattedTime };
}

const notificationIcon = document.getElementById("notifications");
const dropdown = document.getElementById("notification-dropdown");

// Sample notifications (these can be fetched from Supabase or any other source)
const sampleNotifications = []; // This is an empty array, but you can add notifications here for testing

// Function to show notifications or "No notifications"
function showNotifications() {
  // Clear the dropdown
  dropdown.innerHTML = "";

  // Check if there are notifications
  if (sampleNotifications.length === 0) {
    const noNotificationMessage = document.createElement("div");
    noNotificationMessage.classList.add("notification-item");
    noNotificationMessage.textContent = "No notifications";
    dropdown.appendChild(noNotificationMessage);
  } else {
    // Display the notifications
    sampleNotifications.forEach((msg) => {
      const notificationItem = document.createElement("div");
      notificationItem.classList.add("notification-item");
      notificationItem.textContent = msg;
      dropdown.appendChild(notificationItem);
    });
  }
}

// Toggle dropdown visibility on icon click
notificationIcon.addEventListener("click", () => {
  dropdown.classList.toggle("hidden");
  showNotifications();
});

