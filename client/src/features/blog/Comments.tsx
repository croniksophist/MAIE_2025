import { useEffect, useState } from "react";
import { db, auth } from "../../auth/firebaseConfig";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// TypeScript type for props
interface CommentsProps {
  postId: string;  // Ensuring postId is a string
}

interface Comment {
  id: string;
  text: string;
  user: string;
  userId: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);  // Ensure the comments state has the correct type
  const [newComment, setNewComment] = useState<string>("");
  const [user, setUser] = useState<any>(null); // Temporarily using `any` for `user`, could be more specific based on auth type

  // Fetch comments and handle authentication state changes
  useEffect(() => {
    // Listen to authentication state changes
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);  // Update user when auth state changes
    });

    // Query Firestore for comments on the specific post
    const q = query(collection(db, "comments", postId, "messages"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Update state with comments data from Firestore
      setComments(snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Comment)));
    });

    // Clean up the subscription when the component is unmounted or postId changes
    return () => unsubscribe();
  }, [postId]);

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (newComment.trim() && user) {
      // Add new comment to Firestore
      await addDoc(collection(db, "comments", postId, "messages"), {
        text: newComment,
        user: user.displayName,
        userId: user.uid,
        timestamp: new Date(),
      });
      setNewComment("");  // Reset new comment input
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      {user ? (
        <div>
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleCommentSubmit}>Post</button>
        </div>
      ) : (
        <p>You must log in to comment.</p>
      )}
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.user}:</strong> {comment.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
