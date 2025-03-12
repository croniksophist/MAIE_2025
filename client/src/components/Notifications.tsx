import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";  // Import the useAuth hook

const Notifications: React.FC = () => {
  const { notifications, addNotification } = useAuth();  // Access notifications and addNotification from AuthContext

  // Toggle the 'read' status of a notification
  const toggleRead = (index: number) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].read = !updatedNotifications[index].read;
    // Update the notification read status in the context if necessary
    // If you want to update this in the context, you would need to add a method in the context to do so
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((note) => ({
      ...note,
      read: true,
    }));
    // You can also update this in the context if you want to ensure it's global
    // Add an update function in AuthContext if needed
  };

  // Example: Simulating a situation where an error occurs (such as a failed smart contract connection)
  useEffect(() => {
    // Replace this with your actual error handling logic
    const errorSimulated = true;
    if (errorSimulated) {
      addNotification("Failed to connect to smart contract!", 'error');
    }
  }, [addNotification]);  // Only call this once when the component mounts

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>

      {notifications.length > 0 ? (
        <>
          <button className="mark-all-btn" onClick={markAllAsRead}>
            Mark All as Read
          </button>

          <ul className="notifications-list">
            {notifications.map((note, index) => (
              <li
                key={index}
                className={`notification-item ${note.read ? "read" : "unread"} notification-${note.type}`}
                onClick={() => toggleRead(index)}
              >
                <p className="notification-message">{note.message}</p>
                <small className="notification-timestamp">{note.timestamp}</small>
                {!note.read && <span className="notification-unread-indicator">•</span>}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default Notifications;
