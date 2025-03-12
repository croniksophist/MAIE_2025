import { useState, useEffect } from "react";
import { User } from "firebase/auth";  // Ensure you're importing from firebase/auth
import { auth, loginWithGoogle, logout } from "./firebaseConfig"; // Assuming these are correctly implemented
import { onAuthStateChanged } from "firebase/auth";

// Type Guard function to narrow the type to 'User'
const isUser = (user: User | null): user is User => user !== null;

const GoogleLogin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Adding loading state

  useEffect(() => {
    // Listen for authentication state changes (e.g., login or logout)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once the auth state is checked
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Add a loading state while checking auth state
  }

  return (
    <div>
      {isUser(user) ? (  // Using the type guard to check if 'user' is a 'User' and not null
        <div>
          <p>Welcome, {user.displayName || "Guest"}!</p>  {/* Now TypeScript knows 'user' is 'User' here */}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={loginWithGoogle}>Login with Google</button>
      )}
    </div>
  );
};

export default GoogleLogin;
