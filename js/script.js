// Import Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs, // Ensure this is imported
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

let currentUsername = null; // Declare globally to ensure accessibility

// DOM content loaded event
document.addEventListener("DOMContentLoaded", () => {
  fetchAllPosts();

  // Setting menu
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

  // Firebase auth state change
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userId = user.uid;
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          currentUsername = userDoc.data().username || "Guest";
          await fetchAllPosts(); // Ensure posts are fetched first
        } else {
          console.error("No user document found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching username from Firestore:", error);
      }
    } else {
      console.log("No user is currently signed in.");
      currentUsername = null;
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

    if (!postContent && (postImageSrc || postImageSrc === "#")) {
      alert("Please write the content.");
      return;
    }

    try {
      console.log("Submitting post with content:", postContent);
      console.log("Submitting post with imageSrc:", postImageSrc);

      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            content: postContent,
            imageSrc: postImageSrc,
            author: currentUsername,
          },
        ])
        .select();

      if (error) {
        console.error("Error storing post in Supabase:", error.message);
      } else {
        console.log("Post stored successfully in Supabase:", data);
      }
    } catch (err) {
      console.error("Error submitting post:", err.message);
    }

    clearForm();
    hidePostForm();
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
  Object.assign(addPostButton.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  });

  document.body.appendChild(addPostButton);

  const overlay = document.querySelector(".overlay");
  const postForm = document.getElementById("post-form");

  // Show post form
  function showPostForm() {
    if (postForm && overlay) {
      console.log("Showing post form.");
      postForm.style.display = "block";
      Object.assign(overlay.style, {
        display: "block",
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: "999",
      });
    } else {
      console.error("Post form or overlay not found.");
    }
  }

  // Hide post form
  function hidePostForm() {
    const overlay = document.querySelector(".overlay");
    const postForm = document.getElementById("post-form");

    if (overlay && postForm) {
      overlay.style.display = "none";
      postForm.style.display = "none";
      clearForm(); // Ensure this function exists
    } else {
      console.error("Overlay or post form not found.");
    }
  }

  // Attach to the global window object
  window.hidePostForm = hidePostForm;

  // Attach event listeners
  addPostButton.addEventListener("click", () => {
    console.log("Add Post button clicked.");
    showPostForm();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const cancelButton = document.querySelector(
      "#post-form button:nth-of-type(2)"
    );
    if (cancelButton) {
      cancelButton.addEventListener("click", hidePostForm);
    } else {
      console.error("Cancel button not found in post form.");
    }
  });

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
    window.location.href = "../index.html";
  };
});

//Fetching all data from the "posts" table
async function fetchAllPosts() {
  document.getElementById("post-form").style.display = "none";
  let { data, error } = await supabase
    .from("posts") // Replace "posts" with your table name
    .select("*"); // Select all columns; you can specify column names if needed
  const postContainer = document.getElementById("post-container");
  postContainer.innerHTML = "";
  if (error) {
    console.error("Error fetching posts:", error);
  } else {
    data = sortPostsByCreatedAt(data);
    function sortPostsByCreatedAt(posts, order = "desc") {
      return posts.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    data.forEach((post) => {
      let dateTime = formatDateTime(post.created_at);

      const postDiv = document.createElement("div");
      postDiv.classList.add("post");

      const postHeader = `
  <div class="post-header" style="display: flex; align-items: center; margin-bottom: 10px;">
    <img src="assets/images/profile-pic.jpg" alt="Profile Picture" style="width: 40px; height: 40px; border-radius: 50%; cursor: pointer; margin-right: 10px;">
    <div class="userInfo">
      <span style="font-weight: bold;">${post.author}</span>
      <span style="font-size: 12px; color: #555;">${dateTime.date} ${dateTime.time}</span>
    </div>
    ${post.author !== currentUsername ? `
      <div id="follow-button">
        <button id="followButton">Follow</button>
      </div>
    ` : ''}
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
      postText.style.marginTop = "30px";
      postText.style.marginBottom = "30px";
      postText.style.marginLeft = "10px";
      postText.textContent = post.content;
      postDiv.appendChild(postText);

      const postImage = document.createElement("img");
      postImage.src = post.imageSrc;
      postImage.alt = "Uploaded Image";
      postImage.style.width = "600px";
      postDiv.appendChild(postImage);

      // Buttons container
      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.justifyContent = "start";
      buttonContainer.style.gap = "100px";
      buttonContainer.style.marginLeft = "10px";
      buttonContainer.style.marginTop = "10px";
      buttonContainer.style.marginBottom = "10px";

      // Like button
      const likeDiv = document.createElement("div");
      likeDiv.classList.add("like-button");
      likeDiv.innerHTML = `
  <img class="like-img" src="../assets/images/like.png" alt="Like">
  <span class="like-count">0</span>
`;

      let liked = false;
      let likeCount = 0; // Initialize like count
      const postId = post.id; // Replace with the post's UUID
      const authorName = currentUsername; // Replace with the user's name

      // Fetch the initial like count for the post
      async function fetchLikes() {
        try {
          // Fetch total likes for the post
          const { count, error } = await supabase
            .from("likes")
            .select("*", { count: "exact" })
            .eq("post_id", postId);

          if (error) {
            console.error("Error fetching total likes:", error);
            return;
          }

          likeCount = count || 0; // Use the count value from the query
          likeDiv.querySelector(".like-count").textContent = likeCount;

          // Check if the current user has liked the post
          liked = await checkIfLiked();
          updateLikeIcon();
        } catch (err) {
          console.error("Error fetching likes:", err);
        }
      }

      // Check if the user has already liked the post
      async function checkIfLiked() {
        const { data, error } = await supabase
          .from("likes")
          .select("*")
          .eq("post_id", postId)
          .eq("author_name", authorName);

        if (error) {
          console.error("Error checking like status:", error);
          return false;
        }

        return data.length > 0; // Return true if a record exists
      }

      // Handle like or unlike
      async function handleLike() {
        try {
          if (!liked) {
            // Upsert ensures no duplicate rows
            const { error: upsertError } = await supabase
              .from("likes")
              .upsert(
                { post_id: postId, author_name: authorName },
                { onConflict: ["post_id", "author_name"] }
              );

            if (upsertError) {
              console.error("Error liking post:", upsertError);
              return;
            }
            // Send a notification to the post author
            await sendNotification(author, `${authorName} liked your post.`);
          } else {
            // Remove the like
            const { error: deleteError } = await supabase
              .from("likes")
              .delete()
              .eq("post_id", postId)
              .eq("author_name", authorName);

            if (deleteError) {
              console.error("Error unliking post:", deleteError);
              return;
            }
          }

          // Update the like count in the UI
          likeDiv.querySelector(".like-count").textContent = likeCount;
          liked = !liked; // Toggle the liked state
          updateLikeIcon();
        } catch (error) {
          console.error("Error handling like:", error);
        }
      }

      // Update the like button icon
      function updateLikeIcon() {
        likeDiv.querySelector(".like-img").src = liked
          ? "../assets/images/like-blue.png"
          : "../assets/images/like.png";
      }

      async function sendNotification(toUser, message) {
        try {
          const { error } = await supabase.from("notifications").insert({
            recipient: toUser,
            message: message,
            read: false, // Mark notification as unread
            timestamp: new Date().toISOString(),
          });

          if (error) {
            console.error("Error sending notification:", error);
          }
        } catch (err) {
          console.error("Error in sendNotification:", err);
        }
      }

      // Add click event to the like button
      likeDiv.addEventListener("click", handleLike);

      // Fetch initial likes on page load
      fetchLikes();

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
        optionsButton.style.display = "none";
      } else {
        optionsButton.addEventListener("click", () => {
          const isVisible = optionsMenu.style.display === "block";
          optionsMenu.style.display = isVisible ? "none" : "block";
        });
      }

      // Event listener for delete button
      const deleteButton = postDiv.querySelector(".delete-post");

      deleteButton.addEventListener("click", async () => {
        const confirmDelete = confirm(
          "Are you sure you want to delete this post?"
        );
        if (confirmDelete) {
          try {
            // Make DELETE request to Supabase
            const { error } = await supabase
              .from("posts")
              .delete()
              .eq("id", post.id);

            if (error) {
              console.error("Error deleting post from Supabase:", error);
              alert("Failed to delete the post. Please try again.");
            } else {
              postDiv.remove();
              alert("Post deleted successfully.");
            }
          } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred. Please try again.");
          }
        }
      });

      postContainer.appendChild(postDiv);
    });
  }
}

function formatDateTime(inputDatetime) {
  const date = new Date(`${inputDatetime}Z`);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  return { date: formattedDate, time: formattedTime };
}

const notificationIcon = document.getElementById("notifications");
const dropdown = document.getElementById("notification-dropdown");

const sampleNotifications = [];

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

const chatBox = document.getElementById("chatBox");
chatBox.addEventListener("click", () => {
  window.location.href = "../chatBox.html";
});

//search box
const searchInput = document.getElementById("search");
const dropdown1 = document.getElementById("dropdown1");

// Event listener for search input
searchInput.addEventListener("input", async function () {
  const queryText = searchInput.value.toLowerCase();
  dropdown1.innerHTML = ""; // Clear previous results

  if (queryText) {
    try {
      // Query Firestore
      const usersRef = collection(db, "users"); // Replace 'users' with your collection name
      const q = query(
        usersRef,
        where("username", ">=", queryText),
        where("username", "<=", queryText + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        dropdown1.style.display = "block";
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          const item = document.createElement("div");
          item.classList.add("dropdown-item");
          item.textContent = user.username;
          item.addEventListener("click", function () {
            searchInput.value = user.username; // Set input value to clicked item
            dropdown1.style.display = "none"; // Hide dropdown
          });
          dropdown1.appendChild(item);
        });
      } else {
        // Show a single "Not found" message
        dropdown1.innerHTML = ""; // Ensure dropdown is cleared first
        const notFoundItem = document.createElement("div");
        notFoundItem.classList.add("dropdown-item");
        notFoundItem.textContent = "Not found";
        dropdown1.appendChild(notFoundItem);
        dropdown1.style.display = "block";
      }
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    }
  } else {
    dropdown1.style.display = "none";
  }
});

// Hide dropdown when clicking outside the search box
document.addEventListener("click", function (e) {
  if (!document.querySelector(".search-box").contains(e.target)) {
    dropdown1.style.display = "none";
  }
});
