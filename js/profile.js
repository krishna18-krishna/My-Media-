

// Import Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {
    getStorage,
    ref as storeRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";







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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firebase=getDatabase(app);
const storage=getStorage(app)

// DOM Elements
const usernameElement = document.getElementById("username");
const fullnameElement = document.getElementById("fullname"); // Element for fullname
const backButton = document.getElementById("back-button");

// Function to fetch user details from Firestore by email
async function fetchUsername(email) {
    try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const userId = userDoc.id;

            return { ...userData, id: userId };
        } else {
            console.log("No user found with the provided email");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDetails = await fetchUsername(user.email);
            if (userDetails) {
                // Display username
                
                usernameElement.textContent = userDetails.username || "No username found";
               
                // Display fullname
           
                 document.querySelector(".fullname").innerHTML = userDetails.fullname;
            

                console.log("User details fetched: ", userDetails);
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
        // No user is signed in
        if (usernameElement) usernameElement.textContent = "Not signed in";
        if (fullnameElement) fullnameElement.textContent = "Not signed in";
    }
});



// Event listener for back button
if (backButton) {
    backButton.addEventListener("click", () => {
        window.location.href = "./homepage.html"; // Replace with the actual path to your home page
    });
} else {
    console.error("Back button not found in DOM.");
}

export { fetchUsername };


const uploadButton = document.getElementById('uploadButton');
const imageInput = document.getElementById('fileInput');
const uploadStatus = document.getElementById('uploadStatus');
const uploadedImagePreview = document.getElementById('uploadedImagePreview');
const userID = localStorage.getItem("uid");

// Profile image element
const profileImagePreview = document.getElementById('profileImagePreview');

uploadButton.addEventListener('click', () => {
    imageInput.click(); // Open file dialog
});

imageInput.addEventListener('change', async () => {
    const file = imageInput.files[0];
    if (file) {
        const storageRef = storeRef(storage, `UserPosts/${file.name + new Date().toISOString() + Math.random()}`); 
        uploadStatus.textContent = 'Uploading...';
        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // Update the profile image preview
            profileImagePreview.src = downloadURL;

            // Optional: Add a preview of the uploaded image below the upload button
            uploadedImagePreview.innerHTML = `
                <p class="text-green-500">Image uploaded successfully!</p>
                <img src="${downloadURL}" alt="Uploaded Image" class="mt-4 max-w-full rounded-lg shadow-md">
            `;

            // Sanitize date function
            function sanitizingDate() {
                return new Date().toISOString().replace(/[-:.T]/g, '_');
            }

            // Firebase Realtime Database post data path
            const postPath = `socify/posts/${sanitizingDate()}_${userID}/`;
            const postData = {
                postLink: downloadURL,
                like: 0,
                comment: 0,
                uid: userID,
            };

            // Save post data to Firebase Realtime Database
            await set(ref(firebase, postPath), postData);

            uploadStatus.textContent = 'Upload complete.';
        } catch (error) {
            console.error('Error uploading image:', error);
            uploadStatus.textContent = 'Error uploading image. Please try again.';
        }
    } else {
        uploadStatus.textContent = 'Please select an image first.';
    }
});

