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
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

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

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Supabase configuration
const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch the currently logged-in user
const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Error fetching user:', error.message);
        return null;
    }
    return user;
};

// Fetch profile data from Supabase
const fetchProfile = async (userId) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
    }
    return data;
};

// Load user profile
const loadProfile = async () => {
    const user = await getCurrentUser();
    if (!user) return;
    
    const profile = await fetchProfile(user.id);
    if (!profile) return;
    
    document.getElementById('fullname').textContent = profile.full_name;
    document.getElementById('username').textContent = `@${profile.username}`;
    document.querySelector('.post-count').textContent = profile.post_count || 0;
    document.querySelector('.followers-count').textContent = profile.followers || 0;
    document.querySelector('.following-count').textContent = profile.following || 0;
    
    if (profile.profile_image) {
        document.querySelector('.image-container').style.backgroundImage = `url('${profile.profile_image}')`;
    }
};

// Follow button functionality
const followButton = document.getElementById('editProfileButton');
followButton.addEventListener('click', async () => {
    alert('Follow functionality coming soon!');
});

// Back button functionality
const backButton = document.getElementById('back-button');
if (backButton) {
    backButton.addEventListener('click', () => {
        window.history.back();
    });
}

// Initialize profile on page load
document.addEventListener('DOMContentLoaded', loadProfile);

// Firebase Authentication State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User signed in: ", user.email);
    } else {
        console.log("User signed out");
    }
});
