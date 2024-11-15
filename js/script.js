/* // Toggle profile menu visibility
function toggleMenu() {
    const menu = document.getElementById('profileMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Close menu if clicked outside
window.onclick = function(event) {
    const menu = document.getElementById('profileMenu');
    if (!event.target.closest('.profile')) {
        menu.style.display = 'none';
    }
}



document.getElementById("logout").onclick = function() {
    // Clear session or local storage here if necessary
    sessionStorage.clear();
    localStorage.clear();
    // Redirect to login page
    window.location.href = "../index.html";
}; */


// Toggle settings menu visibility
function toggleMenu() {
    const settingsMenu = document.getElementById("settings-menu");
    settingsMenu.style.display = settingsMenu.style.display === "block" ? "none" : "block";
}

// Close the settings menu when clicking outside of it
document.addEventListener("click", function(event) {
    const settingsMenu = document.getElementById("settings-menu");
    const profileIcon = document.querySelector(".nav-user-icon img");
    
    // Check if the click is outside the settings menu and the profile icon
    if (event.target !== settingsMenu && event.target !== profileIcon) {
        settingsMenu.style.display = "none";
    }
});


// Show logout alert
function showLogoutAlert() {
    const logoutAlert = document.getElementById("logout-alert");
    logoutAlert.style.display = "block";
}

// Hide logout alert
function hideLogoutAlert() {
    const logoutAlert = document.getElementById("logout-alert");
    logoutAlert.style.display = "none";
}

// Logout and redirect to login page
function logout() {
    // Redirect to the login page
    window.location.href = "./index.html";  // Replace 'login.html' with the correct path to your login page
}
