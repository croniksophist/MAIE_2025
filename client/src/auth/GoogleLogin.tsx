import { useState, useEffect } from "react"; 
import { User } from "firebase/auth";
import { auth, loginWithGoogle, logout } from "./firebaseConfig";
import { onAuthStateChanged, getIdToken } from "firebase/auth";

// Type Guard function to narrow the type to 'User'
const isUser = (user: User | null): user is User => user !== null;

const GoogleLogin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const googleUser = await loginWithGoogle();
      if (googleUser) {
        const idToken = await getIdToken(googleUser);  // Get Firebase ID token
        
        // Send this ID token to your backend for validation
        const response = await fetch("http://127.0.0.1:8000/login", { // Make sure this matches the correct endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_token: idToken }),  // Send the token to FastAPI backend
        });

        const data = await response.json();
        
        if (response.ok) {
          console.log("Received JWT Token: ", data.access_token);  // JWT token from backend
          localStorage.setItem("auth_token", data.access_token);  // Store the JWT token
        } else {
          console.error("Login failed: ", data.detail);  // Handle failure (e.g., invalid token)
        }
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isUser(user) ? (
        <div>
          <p>Welcome, {user.displayName || "Guest"}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleGoogleLogin}>Login with Google</button>
      )}
    </div>
  );
};

export default GoogleLogin;
