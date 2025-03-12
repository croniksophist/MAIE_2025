import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";  // Import the useAuth hook

const Profile: React.FC = () => {
  const { user, login } = useAuth();  // Use the useAuth hook to access user and login function
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user || { name: "", email: "" });
  const [updatedPassword, setUpdatedPassword] = useState(""); // Track updated password

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    // If password is updated, pass both email and password to login, otherwise just email
    if (updatedPassword) {
      login(updatedUser.email, updatedPassword); // Call login with updated email and password
    } else {
      login(updatedUser.email, ""); // You can choose to pass an empty string or leave out password entirely if not updated
    }

    setEditing(false);
  };

  return (
    <div>
      {!editing ? (
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={updatedUser.name}
            onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
          />
          <input
            type="email"
            value={updatedUser.email}
            onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
          />
          <input
            type="password"
            value={updatedPassword}
            onChange={(e) => setUpdatedPassword(e.target.value)} // Track password changes
            placeholder="Enter new password (leave empty to keep current)"
          />
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
