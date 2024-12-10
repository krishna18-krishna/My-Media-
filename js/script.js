// Wait for the DOM to load fully
document.addEventListener("DOMContentLoaded", function () {
  // Show/hide settings menu
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

  // Show post creation form
  window.showPostForm = function () {
    const postForm = document.getElementById("post-form");
    if (postForm) {
      postForm.style.display = "block";
    } else {
      console.error("Post form not found.");
    }
  };

  // Hide post creation form
  window.hidePostForm = function () {
    const postForm = document.getElementById("post-form");
    if (postForm) {
      postForm.style.display = "none";
      clearForm(); // Clear the form when hiding
    } else {
      console.error("Post form not found.");
    }
  };

  // Handle media upload (images only for preview)
  const mediaInput = document.getElementById("post-media");
  const imagePreview = document.getElementById("imagePreview");

  mediaInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();

      reader.onloadend = function () {
        const mediaDataUrl = reader.result;

        // Save to localStorage
        localStorage.setItem("uploadedMedia", mediaDataUrl);

        // Display media preview
        imagePreview.src = mediaDataUrl;
        imagePreview.style.display = "block"; // Ensure it's visible
      };

      reader.readAsDataURL(file); // Convert file to Base64
    } else {
      alert("Please upload a valid image file.");
      imagePreview.src = ""; // Clear preview if invalid
      imagePreview.style.display = "none";
    }
  });

  // Submit post
  window.submitPost = function () {
    const postContent = document.getElementById("post-content").value.trim();
    const postImageSrc = imagePreview.src;

    if (!postContent && (!postImageSrc || postImageSrc === "#")) {
      alert("Please add some text or upload an image.");
      return;
    }

    const postContainer = document.getElementById("post-container");
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");
    postDiv.style.border = "1px solid #ccc";
    postDiv.style.borderRadius = "5px";
    postDiv.style.margin = "10px 0";
    postDiv.style.padding = "10px";

    // Add post header (Profile image, username, date & time)
    const postHeader = document.createElement("div");
    postHeader.classList.add("post-header");
    postHeader.style.display = "flex";
    postHeader.style.alignItems = "center";
    postHeader.style.marginBottom = "10px";

    const profileImage = document.createElement("img");
    profileImage.src = "assets/images/profile-pic.jpg"; // Replace with actual profile image URL
    profileImage.alt = "Profile Picture";
    profileImage.style.width = "40px";
    profileImage.style.height = "40px";
    profileImage.style.borderRadius = "50%";
    profileImage.style.marginRight = "10px";

    const userInfo = document.createElement("div");
    userInfo.style.display = "flex";
    userInfo.style.flexDirection = "column";

    const username = document.createElement("span");
    username.textContent = "John Doe"; // Replace with the actual username
    username.style.fontWeight = "bold";



    
    const timestamp = document.createElement("span");
    const now = new Date();

// Get the date in DD/MM/YY format
const day = String(now.getDate()).padStart(2, '0');
const month = String(now.getMonth() + 1).padStart(2, '0');
const year = String(now.getFullYear()).slice(-2);

// Get the time in 12-hour format
let hours = now.getHours();
const minutes = String(now.getMinutes()).padStart(2, '0');

// Determine AM or PM
const period = hours >= 12 ? 'PM' : 'AM';

// Convert to 12-hour format
hours = hours % 12 || 12; // Adjust hours for 12-hour format

// Format the timestamp
timestamp.textContent = `${day}/${month}/${year} ${hours}:${minutes} ${period}`;

    

    timestamp.style.fontSize = "12px";
    timestamp.style.color = "#555";

    userInfo.appendChild(username);
    userInfo.appendChild(timestamp);
    postHeader.appendChild(profileImage);
    postHeader.appendChild(userInfo);

    // Add post content
    if (postContent) {
      const postText = document.createElement("p");
      postText.textContent = postContent;
      postText.style.marginTop = "10px";
      postDiv.appendChild(postText);
    }

    // Add uploaded image
    if (postImageSrc && postImageSrc !== "#") {
      const postImage = document.createElement("img");
      postImage.src = postImageSrc;
      postImage.alt = "Uploaded Image";
      postImage.style.maxWidth = "100%";
      postImage.style.marginTop = "10px";
      postDiv.appendChild(postImage);
    }

    // Append header and body to the post
    postDiv.prepend(postHeader); // Ensure profile section is first
    postContainer.prepend(postDiv);

    // Clear form after posting
    clearForm();
    hidePostForm();
  };

  // Clear form fields
  function clearForm() {
    document.getElementById("post-content").value = "";
    mediaInput.value = "";
    imagePreview.src = "#";
    imagePreview.style.display = "none";
  }

  // Load media from localStorage on page load
  function loadMediaFromStorage() {
    const mediaDataUrl = localStorage.getItem("uploadedMedia");
    if (mediaDataUrl) {
      imagePreview.src = mediaDataUrl;
      imagePreview.style.display = "block"; // Display preview
    }
  }

  // Call the function on page load
  loadMediaFromStorage();

  // Add "Add Post" button at the bottom of the page
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

  // Attach the click event to show the post form
  addPostButton.addEventListener("click", function () {
    showPostForm();
  });

  // Show logout alert
  window.showLogoutAlert = function () {
    const logoutAlert = document.getElementById("logout-alert");
    if (logoutAlert) {
      logoutAlert.style.display = "block";
    } else {
      console.error("Logout alert element not found.");
    }
  };

  // Hide logout alert
  window.hideLogoutAlert = function () {
    const logoutAlert = document.getElementById("logout-alert");
    if (logoutAlert) {
      logoutAlert.style.display = "none";
    } else {
      console.error("Logout alert element not found.");
    }
  };

  // Logout action
  window.logout = function () {
    console.log("User logged out!");
    hideLogoutAlert();
    window.location.href = "../index.html"; // Redirect to the login page
  };
});


// media stars



