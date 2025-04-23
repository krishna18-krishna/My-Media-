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

let currentUsername; // Declare globally to ensure accessibility

// DOM content loaded event
document.addEventListener("DOMContentLoaded", () => {

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

 

  // Clear form function
  function clearForm() {
    document.getElementById("post-content").value = "";
    document.getElementById("post-media").value = "";
    document.getElementById("imagePreview").src = "#";
    document.getElementById("imagePreview").style.display = "none";
    document.getElementById("overlay").style.display = "none";
  }

  // Submit post to Supabase
  async function submitPost() {
    const postContent = document.getElementById("post-content").value.trim();
    const postImageSrc = document.getElementById("imagePreview").src;

    // console.log("Post image source:", postImageSrc);

    // Case 1: Content is written but no image is selected
    if (
      postContent &&
      (postImageSrc === "" ||
        postImageSrc.includes("default-placeholder-path") ||
        postImageSrc.includes("#"))
    ) {
      alert("Please upload an image to submit your post.");
      return;
    }

    try {
      // console.log("Submitting post with content:", postContent);
      // console.log("Submitting post with imageSrc:", postImageSrc);

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
        imagePreview.src = mediaDataUrl; // Set the valid image source
        // console.log("Image preview source set to:", mediaDataUrl);
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
      imagePreview.src = ""; // Clear the src if invalid
      imagePreview.style.display = "none";
    }
  });

  const addPostContainer = document.getElementById("add-post-container");
  // Add "Add Post" button
  const addPostButton = document.createElement("button");
  addPostButton.textContent = "Add Post";
  addPostButton.id = "add-post-button";

  // Object.assign(addPostButton.style, {
  //   padding: "10px 60px 10px 60px",
  //   backgroundColor: "#007bff",
  //   color: "#fff",
  //   border: "none",
  //   borderRadius: "5px",
  //   cursor: "pointer",
  // });
  function updateButtonText() {
    if (window.innerWidth <= 768 || window.innerWidth <= 1025) {
        addPostButton.textContent = "+";
    } else {
        addPostButton.textContent = "Add Post";
    }
}


window.addEventListener("load", updateButtonText);
window.addEventListener("resize", updateButtonText);

  addPostContainer.appendChild(addPostButton);

  const overlay = document.getElementById("overlay");
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
      clearForm();
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
    const overlay = document.getElementById("overlay")
    if (logoutAlert && overlay) {
      logoutAlert.style.display = "block";
      overlay.style.display = "block"
    } else {
      console.error("Logout alert element not found.");
    }
  };

  window.hideLogoutAlert = function () {
    const overlay = document.getElementById("overlay");
    const logoutAlert = document.getElementById("logout-alert");
    if (logoutAlert && overlay) {
      overlay.style.display = "none";
      logoutAlert.style.display = "none";
    } else {
      console.error("Logout alert element not found.");
    }
  };

  

  window.logout = function () {
    console.log("User logged out!");
    hideLogoutAlert();
    localStorage.setItem("logIn", "false");
    window.location.href = "/index.html";
  };
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
        console.log(currentUsername)
        fetchStoryProfile();
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
      fetchProfile();
      let dateTime = formatDateTime(post.created_at);

      const postDiv = document.createElement("div");
      postDiv.classList.add("post");

      const imageContainer = document.querySelector(".image-container");
      // console.log(post);
      const postHeader =document.createElement('div')
    
       postHeader.innerHTML = `
  <div class="post-header" style="display: flex; align-items: center; margin-bottom: 10px;">
    <img src="" id = "previewImage" class ="image-container" style="width: 40px; height: 40px; border-radius: 50%; cursor: pointer; margin-right: 10px;" draggable="false">
    <div class="userInfo">
      <span style="font-weight: bold;">${post.author}</span>
      <span style="font-size: 12px; color: #555;">${dateTime.date} ${
        dateTime.time
      }</span>
    </div>
    ${
      post.author !== currentUsername
        ? `
      <div id="follow-button">
        <button id="followButton" class="follow-button">Follow</button>
      </div>
    `
        : ""
    }
    <div class="post-options" style="margin-left: auto; position: relative;">
      <button class="options-button" style="background: none; border: none; cursor: pointer; font-size: 20px;">⋮</button>
      <div class="options-menu" style="display: none; position: absolute; right: 0; background: white; border: 1px solid #ccc; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <button class="delete-post" style="padding: 10px; width: 100%; border: none; background: none; cursor: pointer;">Delete</button>
      </div>
    </div>
  </div>
`;

      postDiv.appendChild (postHeader);
      // Create an image element
      const imageElement1 = postHeader.querySelector('img')

      // Set default image first
      imageElement1.src = "./assets/images/profile-pic.jpg";
      imageElement1.alt = "Profile Picture";

      async function fetchProfile() {
        const { data, error } = await supabase
          .from("profile_images")
          .select("profile_image_url")
          .eq("author_name", post.author);

        if (error) {
          console.error("Error fetching data:", error.message);
        } else if (data.length > 0) {
        
          // Data found for the author
          // console.log("Fetched profile data:", data[0]);
          const profileImageURL = data[0].profile_image_url;
          /* console.log("url",profileImageURL); */
          
          imageElement1.src = profileImageURL;
        } else {
          console.log("No profile data found for the specified author.");
        }
      }

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


      setTimeout(() => {
        const followButtons = postHeader.querySelectorAll(".follow-button");
      
        followButtons.forEach((button) => {
          button.addEventListener("click", () => {
            console.log("Follow button clicked for", post.author);
            button.style.display = "none";
          });
        });
      }, 0);

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
  <img class="like-img" src="/assets/images/like.png" alt="Like" draggable="false">
  <span class="like-count">0</span>
`;

      let liked = false;
      let likeCount = 0; // Initialize like count
      const postId = post.id; // Replace with the post's UUID
      const authorName = currentUsername; // Replace with the user's name

      // Fetch initial like data
      async function fetchLikes() {
        try {
          const {
            data: likes,
            count,
            error,
          } = await supabase
            .from("likes")
            .select("*", { count: "exact" })
            .eq("post_id", postId);

          if (error) {
            console.error("Error fetching likes:", error);
            return;
          }

          likeCount = count || 0;
          liked = likes.some((like) => like.author_name === authorName);

          updateUI();
        } catch (err) {
          console.error("Error fetching likes:", err);
        }
      }

      // Handle like or unlike action
      async function handleLike() {
        if (liked) {
          // Unlike
          await toggleLike("unlike");
        } else {
          // Like
          await toggleLike("like");
        }
      }

      // Toggle like/unlike
      async function toggleLike(action) {
        try {
          if (action === "like") {
            const { error } = await supabase
              .from("likes")
              .upsert(
                { post_id: postId, author_name: authorName },
                { onConflict: ["post_id", "author_name"] }
              );

            if (error) throw error;

            likeCount++;
          } else {
            const { error } = await supabase
              .from("likes")
              .delete()
              .eq("post_id", postId)
              .eq("author_name", authorName);

            if (error) throw error;

            likeCount--;
          }

          liked = !liked;
          updateUI();
        } catch (error) {
          console.error(
            `Error ${action === "like" ? "liking" : "unliking"} post:`,
            error
          );
        }
      }

      // Update UI
      function updateUI() {
        likeDiv.querySelector(".like-count").textContent = likeCount;
        likeDiv.querySelector(".like-img").src = liked
          ? "../assets/images/like-blue.png"
          : "../assets/images/like.png";
      }

      // Add click event with debouncing
      let isProcessing = false;
      likeDiv.addEventListener("click", async () => {
        if (isProcessing) return;
        isProcessing = true;

        await handleLike();

        isProcessing = false;
      });

      // Fetch initial likes on page load
      fetchLikes();

      // Comment button
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment-button");
      commentDiv.innerHTML = `
  <img class="comment-img" src="/assets/images/comments.png" alt="Comments" draggable="false">
  <span class="comment-count">0</span>
`;

      const commentBox = document.createElement("div");
      commentBox.classList.add("comment-box");
      commentBox.innerHTML = `
  <div class="comment-container">
      <!-- Header with close button -->
      <div class="comment-header">
        <div class="close-button" id="closeOverlayButton">×</div>
      </div>
      <div class="comments"></div>
      <!-- Footer with input and send button -->
      <div class="comment-footer">
        <!--<span class="emoji">😊</span>-->
        <input class="comment-input" id="commentInput" type="text" placeholder="Write your comment...." maxlength="500" />
        <div class="send-button" id="sendButton">➤</div>
      </div>
    </div>
  </div> 
`;

      fetchAndDisplayComments(post.id);
      // Display the comment box and overlay when comment button is clicked
      commentDiv.addEventListener("click", () => {
        const overlay = document.getElementById("overlay");
        if (overlay && commentBox) {
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
          buttonContainer.appendChild(commentBox);
        } else {
          console.error("Overlay not found");
        }
      });

      // Close the comment box when the close button is clicked
      commentBox.addEventListener("click", (event) => {
        const overlay = document.getElementById("overlay");
        if (event.target.id === "closeOverlayButton") {
          commentBox.style.display = "none"; // Hide the overlay
          overlay.style.display = "none";
        }
      });

      // Handle sending a new comment
      commentBox.addEventListener("click", async (event) => {
        if (event.target.id === "sendButton") {
          const commentInput = document.getElementById("commentInput");
          const comment = commentInput.value.trim();
          const postId = post.id; // Ensure you have the current post ID available
          const authorName = currentUsername; // Replace with the current author's username

          if (comment) {
            try {
              // Send the comment to the Supabase database
              const { data, error } = await supabase
                .from("comment")
                .insert([
                  {
                    post_id: postId,
                    author_name: authorName,
                    comment_content: comment,
                  },
                ])
                .select();

              if (error) {
                console.error(
                  "Error inserting comment into Supabase:",
                  error.message
                );
                alert("Failed to submit your comment. Please try again.");
              } else {
                // console.log("Comment stored successfully:", data);

                // Update the comment count after inserting the comment
                fetchCommentCount(postId); // Update the count

                // Clear the input field and update the UI
                commentInput.value = ""; /* 
                alert(`Comment sent: ${comment}`); */

                // Optionally fetch updated comments and display them
                fetchAndDisplayComments(postId);
              }
            } catch (err) {
              console.error("Error submitting comment:", err.message);
              alert("An error occurred. Please try again.");
            }
          } else {
            alert("Please write a comment before sending.");
          }
        }
      });

      // Fetch and display comments for the given post
      async function fetchAndDisplayComments(postId) {
        if (!postId) {
          console.error("Post ID is missing or invalid.");
          return;
        }

        try {
          // Query the database for comments specific to the post
          const { data, error } = await supabase
            .from("comment")
            .select("*")
            .eq("post_id", postId); // Filter by the specific post ID

          if (error) {
            console.error(
              "Error fetching comments from Supabase:",
              error.message
            );
          } else {
            // console.log("Comments fetched successfully:", data);

            // Select the `.comments` container inside the `commentBox`
            const commentsContainer = commentBox.querySelector(".comments");
            if (!commentsContainer) {
              console.error("Comments container not found.");
              return;
            }

            commentsContainer.innerHTML = ""; // Clear existing comments

            // Render the comments for the specific post
            if (data.length > 0) {
              data.forEach((comment) => {
                const commentElement = document.createElement("div");
                commentElement.classList.add("comment-item");
                const isAuthor = comment.author_name === currentUsername;
                commentElement.innerHTML = `
                <div class = "commment-content">
                  <strong>${comment.author_name}</strong> ${
                  comment.comment_content
                }
                </div>
                ${
                  isAuthor
                    ? `
                <div class="comment-actions">
                  <button class="menu-button">⋮</button>
                  <div class="dropdown-menu hidden">
                    <button class="delete-comment">Delete</button>
                  </div>
                </div>
              `
                    : ""
                }
          `;
                commentsContainer.appendChild(commentElement);
                // Add event listener to the three-dot menu
                if (isAuthor) {
                  const menuButton =
                    commentElement.querySelector(".menu-button");
                  const dropdownMenu =
                    commentElement.querySelector(".dropdown-menu");

                  menuButton.addEventListener("click", () => {
                    // Toggle the visibility of the dropdown menu
                    dropdownMenu.classList.toggle("hidden");
                  });

                  // Add event listener for the delete button
                  const deleteButton =
                    dropdownMenu.querySelector(".delete-comment");
                  deleteButton.addEventListener("click", async () => {
                    const commentId =comment.id;

                    if (!commentId) {
                      console.error("Comment ID is missing or undefined.");
                      return;
                    }

                    // console.log("Comment ID to delete:", commentId); // Debugging log
                    await deleteComment(commentId, postId);
                  });
                }
              });
            } else {
              // Display a message if no comments are found
              commentsContainer.innerHTML = `<p style= "align-content: center;">No comments yet</p>`;
            }
          }
        } catch (err) {
          console.error("Error fetching comments:", err.message);
        }
      }

      // delete comment

      async function deleteComment(commentId, postId) {
        try {
          const { error } = await supabase
            .from("comment")
            .delete()
            .eq("id", commentId); // Replace `id` with the actual column name if different

          if (error) {
            console.error("Error deleting comment:", error.message);
            alert("Failed to delete the comment. Please try again.");
          } else {
            console.log("Comment deleted successfully.");
            fetchAndDisplayComments(postId); // Refresh comments after deletion
          }
        } catch (err) {
          console.error("Error deleting comment:", err.message);
          alert("An error occurred while deleting the comment.");
        }
      }

      // Fetch the comment count for a given post and update the UI
      async function fetchCommentCount(postId) {
        try {
          // Query to fetch the count of comments for the given post_id
          const { count, error } = await supabase
            .from("comment")
            .select("*", { count: "exact" }) // Fetch count explicitly
            .eq("post_id", postId); // Replace with your post ID variable

          if (error) {
            console.error(
              "Error fetching comment count from Supabase:",
              error.message
            );
          } else {
            // Update the comment count in the UI
            const commentCountSpan = commentDiv.querySelector(".comment-count");
            if (commentCountSpan) {
              commentCountSpan.textContent = count; // Set the comment count
            }
          }
        } catch (err) {
          console.error("Error fetching comment count:", err.message);
        }
      }
      // When the page is loaded or when the post is displayed, fetch the comment count
      fetchCommentCount(post.id); // Replace `post.id` with the correct post ID

      // Share button
      const shareDiv = document.createElement("div");
      shareDiv.classList.add("share-button");
      shareDiv.innerHTML = `
    <img class="share-img" src="/assets/images/share.png" alt="Share" draggable="false">
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
        optionsButton.addEventListener("click", (event) => {
          const isVisible = optionsMenu.style.display === "block";
          optionsMenu.style.display = isVisible ? "none" : "block";
      
          // Prevent the click from propagating to the document
          event.stopPropagation();
        });
      
        // Add a global event listener to hide the options menu when clicking outside
        document.addEventListener("click", (event) => {
          // Check if the clicked element is outside the options menu or button
          if (!optionsMenu.contains(event.target) && event.target !== optionsButton) {
            optionsMenu.style.display = "none";
          }
        });

        // Add a global event listener to hide the options menu when clicking outside
        document.addEventListener("scroll", (event) => {
          // Check if the clicked element is outside the options menu or button
          if (!optionsMenu.contains(event.target) && event.target !== optionsButton) {
            optionsMenu.style.display = "none";
          }
        });
      }

      // Event listener for delete button
      const deleteButton = postDiv.querySelector(".delete-post");

      deleteButton.addEventListener("click", () => {
        // Create popup if it doesn't exist
        let popup = document.querySelector("#delete-popup");
        if (!popup) {
          popup = document.createElement("div");
          popup.id = "delete-popup";
          popup.className = "popup-overlay";
          popup.innerHTML = `
      <div class="popup">
        <p>Are you sure you want to delete this post?</p>
        <button id="confirm-delete" class="popup-button" style = "background-color: red;">Delete</button>
        <button id="cancel-delete" class="popup-button" style = "background-color: green;">Cancel</button>
      </div>
    `;
          document.body.appendChild(popup);
        }

        // Show the popup
        popup.style.display = "flex";

        // Handle confirm delete
        const confirmDeleteButton = popup.querySelector("#confirm-delete");
        const cancelDeleteButton = popup.querySelector("#cancel-delete");

        const confirmHandler = async () => {
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
            }
          } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred. Please try again.");
          } finally {
            // Hide and clean up popup
            popup.style.display = "none";
            confirmDeleteButton.removeEventListener("click", confirmHandler);
            cancelDeleteButton.removeEventListener("click", cancelHandler);
          }
        };
        const cancelHandler = () => {
          // Hide the popup
          popup.style.display = "none";
          confirmDeleteButton.removeEventListener("click", confirmHandler);
          cancelDeleteButton.removeEventListener("click", cancelHandler);
        };

        confirmDeleteButton.addEventListener("click", confirmHandler);
        cancelDeleteButton.addEventListener("click", cancelHandler);
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

document.addEventListener("scroll", () => {
  if (!dropdown.classList.contains("hidden")) {
    dropdown.classList.add("hidden");
    dropdown.display = "none";
  }
});

const chatBox = document.getElementById("chatBox");
chatBox.addEventListener("click", () => {
  window.location.href = "../chatBox.html";
});

//search box
const topBar = document.getElementById("search-box");
const searchInput = document.getElementById("search");
const dropdown1 = document.getElementById("dropdown1");
const cancelSearchButton = document.getElementById("crossButton");

const overlay = document.getElementById("overlay1");


searchInput.addEventListener("click", (e) => {
  overlay.style.display = "block";
  overlay.style.zIndex = "997";
  topBar.style.display = "bloch";
  topBar.style.display = "999";
  dropdown1.style.display = "block"; // Show the dropdown if necessary
  dropdown1.style.zIndex = "998"
  cancelSearchButton.style.display = "block"
  e.stopPropagation(); // Prevent click event from bubbling up
});

cancelSearchButton.addEventListener("click", (e) =>{
  overlay.style.display = "none"; // Hide the overlay
    dropdown1.style.display = "none"; // Optionally hide the dropdown
    cancelSearchButton.style.display = "none"
})
// Hide overlay when clicking outside of search or overlay
document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !overlay.contains(e.target)) {
    overlay.style.display = "none"; // Hide the overlay
    dropdown1.style.display = "none"; // Optionally hide the dropdown
  }
});
// Search input event
searchInput.addEventListener("input", async function () {
  const queryText = searchInput.value.toLowerCase().trim();
  dropdown1.innerHTML = ""; // Clear previous results

  if (queryText) {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", ">=", queryText),
        where("username", "<=", queryText + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        dropdown1.style.display = "block";

        // Use a Map to prevent duplicates
        const seenUsers = new Map();

        querySnapshot.forEach((doc) => {
          const user = doc.data();
          const normalizedUsername = user.username.trim().toLowerCase();

          if (!seenUsers.has(normalizedUsername)) {
            seenUsers.set(normalizedUsername, user);
          }
        });

        // Render each unique user from Map
        seenUsers.forEach((user) => {
          const item = document.createElement("div");
          item.classList.add("dropdown-item");
          item.style.cursor = "pointer";
          item.style.gap = "10px";

          const searchProfileImage = document.createElement("img");
          searchProfileImage.classList.add("search-profile-image");
          searchProfileImage.style.cursor = "pointer";
          searchProfileImage.src = "/assets/images/profile-pic.jpg"; // Default

          // Fetch profile image from Supabase
          (async function fetchProfile() {
            const { data, error } = await supabase
              .from("profile_images")
              .select("profile_image_url")
              .eq("author_name", user.username);

            if (!error && data.length > 0) {
              searchProfileImage.src = data[0].profile_image_url;
            }
          })();

          item.innerHTML = `<p>${user.username}</p>`;
          item.appendChild(searchProfileImage);

          item.addEventListener("click", function () {
            window.location.href = `/usersProfile.html?username=${user.username}`;
          });

          dropdown1.appendChild(item);
        });

      } else {
        dropdown1.innerHTML = "";
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


console.log(currentUsername);

// stories
const storyProfile = document.getElementById("story-Profile");

    // Default profile image
    storyProfile.src = "./assets/images/profile-pic.jpg";
    
    // Function to fetch the profile image from Supabase
    async function fetchStoryProfile() {
      try{
        const {data, error} = await supabase
        .from("profile_images")
          .select("profile_image_url")
          .eq("author_name", currentUsername || user.username);
          console.log(data);
          if (error) {
            console.error("Error fetching data:", error.message);
          } else if (data.length > 0) {
          
            // Data found for the author
            // console.log("Fetched profile data:", data[0]);
            const profileImageURL = data[0].profile_image_url;
            /* console.log("url",profileImageURL); */
            
            storyProfile.src = profileImageURL;
          } else {
            console.log("No profile data found for the specified author.");
          }
      }
      catch{
          console.error("Error fetching story profile: ", error);
      }
    }