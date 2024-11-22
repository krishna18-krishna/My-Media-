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

// Show logout alert
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
}

// Logout and redirect to login page
function logout() {

    const settingsMenu = document.getElementById("settings-menu");
    if (settingsMenu) {
        settingsMenu.style.display = "none";
    }
    window.location.href = "./index.html"; // Replace 'index.html' with the correct path to your login page
}


// Fetch data and populate the list
fetch("data.json")
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
