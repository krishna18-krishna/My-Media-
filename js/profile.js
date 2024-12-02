/* // Import Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

// Your Firebase configuration object
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
const storage = getStorage(app);

export { auth, db, storage };


const username = document.getElementById("username"); */

// Import Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

// Your Firebase configuration object
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
const storage = getStorage(app);

const usernameElement = document.getElementById("username");

// Function to fetch the username from Firestore
async function getUsername() {
    const user = auth.currentUser; // Get the current authenticated user

    if (user) {
        try {
            // Get a reference to the user's document in the 'users' collection
            const userDocRef = doc(db, "users", user.uid);

            // Fetch the document
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                // Extract the username from the document
                const data = userDoc.data();
                usernameElement.textContent = data.username;  // Update the username in the DOM
            } else {
                console.log("No user document found");
                usernameElement.textContent = "Username not found";
            }
        } catch (error) {
            console.error("Error fetching username:", error);
            usernameElement.textContent = "Error fetching username";
        }
    } else {
        console.log("User not authenticated");
        usernameElement.textContent = "Not signed in";
    }
}

// Call the function to fetch and display the username
getUsername();
