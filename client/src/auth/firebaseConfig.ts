// src/auth/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// MAIE Firebase config
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app); // Initialize Firestore

// Authentication helper function to login with Google
const loginWithGoogle = async (): Promise<User | null> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider); // Open Google login popup
    return result.user; // Return the user object from the login result
  } catch (error) {
    console.error("Google login failed:", error); // Log any error
    return null; // Return null in case of an error
  }
};

// Function to logout
const logout = async (): Promise<void> => {
  try {
    await signOut(auth); // Sign out the user
  } catch (error) {
    console.error("Logout failed:", error); // Log any error during logout
  }
};

// Export the necessary elements for use in other parts of the app
export { auth, db, loginWithGoogle, logout };
