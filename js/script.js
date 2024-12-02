// Toggle settings menu visibility
function toggleMenu() {
    const settingsMenu = document.getElementById("settings-menu");
    if (settingsMenu) {
        settingsMenu.style.display = settingsMenu.style.display === "block" ? "none" : "block";
    } else {
        console.error("Element with ID 'settings-menu' not found.");
    }
}

// Close the settings menu when clicking outside of it
document.addEventListener("click", function (event) {
    const settingsMenu = document.getElementById("settings-menu");
    const profileIcon = document.querySelector(".nav-user-icon img");

    if (settingsMenu && profileIcon) {
        if (!settingsMenu.contains(event.target) && event.target !== profileIcon) {
            settingsMenu.style.display = "none";
        }
    } else {
        console.error("Required elements ('settings-menu' or profile icon) not found.");
    }
});

/* // Show logout alert
function showLogoutAlert() {
    const logoutAlert = document.getElementById("logout-alert");
    if (logoutAlert) {
        logoutAlert.style.display = "block";
    } else {
        console.error("Element with ID 'logout-alert' not found.");
    }
}

// Hide logout alert
function hideLogoutAlert() {
    const logoutAlert = document.getElementById("logout-alert");
    if (logoutAlert) {
        logoutAlert.style.display = "none";
    } else {
        console.error("Element with ID 'logout-alert' not found.");
    }
} */

// Logout and redirect to login page
function logout() {

    const settingsMenu = document.getElementById("settings-menu");
    if (settingsMenu) {
        settingsMenu.style.display = "none";
    }
    window.location.href = "./index.html"; // Replace 'index.html' with the correct path to your login page
}


// Show logout alert
function showLogoutAlert() {
    const logoutAlert = document.getElementById("logout-alert");
    if (logoutAlert) {
        logoutAlert.style.display = "block";
        
        // Create and display the overlay
        const overlay = document.createElement("div");
        overlay.setAttribute("class", "overlay");
        overlay.classList.add("overlay");
        document.body.appendChild(overlay);

        // Create the confirmation dialog
        const confirmationDialog = document.createElement("div");
        confirmationDialog.setAttribute("id", "confirmation-dialog");
        confirmationDialog.classList.add("confirmation-dialog");
        confirmationDialog.innerHTML = `
            <div class="confirmation-message">
                Are you sure you want to log out?
            </div>
            <button id="confirm-logout">Yes</button>
            <button id="cancel-logout">No</button>
        `;

        // Append the confirmation dialog to the body
        document.body.appendChild(confirmationDialog);

        // Event listener for the 'Yes' button to log out
        document.getElementById("confirm-logout").addEventListener("click", logout);

        // Event listener for the 'No' button to close the dialog
        document.getElementById("cancel-logout").addEventListener("click", hideLogoutAlert);
    } else {
        console.error("Element with ID 'logout-alert' not found.");
    }
}


/* import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"; 

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6fJyPKmyBrJizmkopfnlk2kb6cvs5cJM",
    authDomain: "my-media-285c9.firebaseapp.com",
    projectId: "my-media-285c9",
    storageBucket: "my-media-285c9.firebasestorage.app",
    messagingSenderId: "36523224799",
    appId: "1:36523224799:web:5929b507b73581c69bc36a",
    measurementId: "G-D26DKE6ZVG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app); */

// Hide logout alert and remove overlay and dialog
function hideLogoutAlert() {
    const logoutAlert = document.getElementById("logout-alert");
    const overlay = document.getElementById("overlay");
    const confirmationDialog = document.getElementById("confirmation-dialog");

    if (logoutAlert) {
        logoutAlert.style.display = "none";
    }
    if (overlay) {
        document.body.removeChild(overlay);
    }
    if (confirmationDialog) {
        document.body.removeChild(confirmationDialog);
    }
}



// Fetch data and populate the list
fetch("json/data.json")
    .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch JSON data");
        return response.json();
    })
    .then((data) => {
        const storyContainer = document.getElementById("story-container");

        if (!storyContainer || !Array.isArray(data.stories)) {
            console.error("'story-container' not found or invalid data format");
            return;
        }

        data.stories.forEach((story) => {
            const storyElement = document.createElement("div");
            storyElement.className = "story";

            // Set the first image in media as the background
            if (Array.isArray(story.media)) {
                const backgroundMedia = story.media.find((media) => media.type === "image");
                if (backgroundMedia && backgroundMedia.src) {
                    storyElement.style.backgroundImage = `url('${backgroundMedia.src}')`;
                    storyElement.style.backgroundSize = "cover";
                    storyElement.style.backgroundPosition = "center";
                }
            }

            // Add profile picture
            if (story.usar && story.usar.profilePicture) {
                const profileImg = document.createElement("img");
                profileImg.src = story.usar.profilePicture;
                profileImg.alt = "Profile Picture";
                profileImg.className = "profile-picture";
                storyElement.appendChild(profileImg);
            }

            // Add media items
            story.media.forEach((media) => {
                if (media.type === "image" && media.src) {
                    const img = document.createElement("img");
                    img.src = media.src;
                    img.alt = "Image";
                    img.className = "story-media";
                    img.style.display = "none"; // Hide since background image is already set

                    storyElement.appendChild(img);
                } else if (media.type === "video" && media.src) {
                    const iframe = document.createElement("iframe");
                    iframe.src = media.src.replace("watch?v=", "embed/"); // Ensure proper embed URL for YouTube
                    iframe.allowFullscreen = true;
                    iframe.style.display = "none"; // Initially hidden

                    // Click event on the story element to show the video
                    storyElement.addEventListener("click", () => {
                        iframe.style.display = "block"; // Show the video
                        iframe.requestFullscreen(); // Fullscreen the video
                    });

                    // Event to handle exiting fullscreen
                    document.addEventListener("fullscreenchange", () => {
                        if (!document.fullscreenElement) {
                            iframe.style.display = "none"; // Hide the video
                        }
                    });

                    storyElement.appendChild(iframe);
                }
            });

            storyContainer.appendChild(storyElement);
        });
    })
    .catch((error) => console.error("Error loading or parsing JSON:", error));


 

    // Function to handle like click
 
    function handleLikeClick(likeWrapper, likeCount, post) {
        const likeImg = likeWrapper.querySelector(".like-icon");
        const isLiked = likeWrapper.dataset.liked === "true";
    
        // Toggle like state
        likeWrapper.dataset.liked = isLiked ? "false" : "true";
    
        // Update like image and count
        if (isLiked) {
            likeImg.src = post.media.likeImg || "default-like-icon.png"; // Default image
            likeCount.textContent = ` ${post.media.like}`; // Reset to original like count
        } else {
            likeImg.src = "../assets/images/like-blue.png"; // Path to the new image
            likeCount.textContent = ` ${parseInt(post.media.like) + 1}`; // Increment like count
        }
    }
// Fetch data from post.json
fetch("json/post.json")
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch JSON data");
        return response.json();
    })
    .then((data) => {
        const postContainer = document.getElementById("post-container");

        if (!postContainer || !Array.isArray(data.posts)) {
            console.error("'post-container' not found or invalid data format");
            return;
        }

        data.posts.forEach((post) => {
            const postElement = document.createElement("div");
            postElement.className = "post";

            // User profile and name
            const userSection = document.createElement("div");
            userSection.className = "user-section";

            if (post.user.profilePicture) {
                const profileImg = document.createElement("img");
                profileImg.src = post.user.profilePicture;
                profileImg.alt = "User Profile Picture";
                profileImg.className = "profile-picture";
                userSection.appendChild(profileImg);
            }

            const userName = document.createElement("span");
            userName.className = "user-name";
            userName.textContent = post.user.name || "Anonymous";
            userSection.appendChild(userName);

            const dateTime = document.createElement("span");
            dateTime.className = "post-date-time";
            dateTime.textContent = `${post.user.dateTime.date || ""} ${post.user.dateTime.time || ""}`;
            userSection.appendChild(dateTime);

            postElement.appendChild(userSection);

            // Post content
            const contentSection = document.createElement("div");
            contentSection.className = "content-section";
            contentSection.textContent = post.user.content || "No content available.";
            postElement.appendChild(contentSection);

            // Post image
            if (post.user.postImage) {
                const postImg = document.createElement("img");
                postImg.src = post.user.postImage;
                postImg.alt = "Post Image";
                postImg.className = "post-image";
                postElement.appendChild(postImg);
                /* iframe .src = post.user.postImage; */
            }

            // Media stats
            const mediaStats = document.createElement("div");
            mediaStats.className = "media-stats";

            // Like
            const likeWrapper = document.createElement("div");
            likeWrapper.className = "like-wrapper";
            likeWrapper.dataset.liked = ""; // Initialize as not liked
            const likeImg = document.createElement("img");
            likeImg.src = post.media.likeImg || "default-like-icon.png";
            likeImg.alt = "Like";
            likeImg.className = "like-icon";
            likeWrapper.appendChild(likeImg);
            const likeCount = document.createElement("span");
            likeCount.className = "like-count";
            likeCount.textContent = ` ${post.media.like}`;
            likeWrapper.appendChild(likeCount);

            

            // Event listener for the like button
            likeWrapper.addEventListener("click", () => handleLikeClick(likeWrapper, likeCount, post));

            mediaStats.appendChild(likeWrapper);
            // Share
            const shareWrapper = document.createElement("div");
            shareWrapper.className = "share-wrapper";
            const shareImg = document.createElement("img");
            shareImg.src = post.media.shareImg || "default-share-icon.png";
            shareImg.alt = "Share";
            shareImg.className = "share-icon";
            shareWrapper.appendChild(shareImg);
            const shareCount = document.createElement("span");
            shareCount.className = "share-count";
            shareCount.textContent = ` ${post.media.share}`;
            shareWrapper.appendChild(shareCount);
            mediaStats.appendChild(shareWrapper);

            // Comment
            const commentWrapper = document.createElement("div");
            commentWrapper.className = "comment-wrapper";
            const commentImg = document.createElement("img");
            commentImg.src = post.media.commentImg || "default-comment-icon.png";
            commentImg.alt = "Comment";
            commentImg.className = "comment-icon";
            commentWrapper.appendChild(commentImg);
            const commentCount = document.createElement("span");
            commentCount.className = "comment-count";
            commentCount.textContent = ` ${post.media.comment}`;
            commentWrapper.appendChild(commentCount);
            mediaStats.appendChild(commentWrapper);

            // Append media stats
            postElement.appendChild(mediaStats);

            // Append the post to the container
            postContainer.appendChild(postElement);
        });
    })
    .catch((error) => console.error("Error loading or parsing JSON:", error));

fetch("/json/friends.json") // Replace with the correct path to your JSON file
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch JSON data");
        return response.json();
    })
    .then(data => {
        const search = document.getElementById("search");
        const dropdown = document.createElement("ul"); // Create a dropdown container
        dropdown.classList.add("dropdown");
        search.parentNode.appendChild(dropdown); // Append it below the search input

        // Retrieve friends list from fetched data
        const friends = data.friends || [];

        // Search input event
        search.addEventListener("input", () => {
            const searchQuery = search.value.toLowerCase().trim();
            dropdown.innerHTML = ""; // Clear previous dropdown entries

            if (searchQuery === "") {
                dropdown.style.display = "none"; // Hide dropdown if input is empty
                return;
            }

            // Filter friends based on the query
            const matchedFriends = friends.filter(friend =>
                friend.toLowerCase().includes(searchQuery)
            );

            if (matchedFriends.length > 0) {
                dropdown.style.display = "block"; // Show dropdown
                matchedFriends.forEach(friend => {
                    const listItem = document.createElement("li");
                    listItem.textContent = friend;
                    listItem.classList.add("dropdown-item");

                    // Add click event to select the friend
                    listItem.addEventListener("click", () => {
                        search.value = friend; // Set input value to selected friend
                        dropdown.style.display = "none"; // Hide dropdown
                    });

                    dropdown.appendChild(listItem); // Append to dropdown
                });
            } else {
                const noResultsItem = document.createElement("li");
                noResultsItem.textContent = "No friends found";
                noResultsItem.classList.add("dropdown-item");
                dropdown.appendChild(noResultsItem);
                dropdown.style.display = "block"; // Show dropdown even for no results
            }
        });

        // Hide dropdown when clicking outside the search bar
        document.addEventListener("click", (event) => {
            if (!search.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.style.display = "none";
            }
        });
    })
    .catch(error => console.error("Error loading or parsing JSON:", error));


    



