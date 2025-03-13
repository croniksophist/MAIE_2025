import React, { useState } from "react";
import { TextField, Button, Rating, Box } from "@mui/material";
import axios from "axios";

// Define types for the plugin review
interface ReviewFormProps {
  pluginId: number;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ pluginId, onReviewSubmitted }) => {
  const [rating, setRating] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token"); // assuming JWT is stored in local storage
      if (!token) {
        setError("You need to be logged in to submit a review.");
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/plugins/${pluginId}/reviews`,
        {
          rating,
          review_text: reviewText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onReviewSubmitted(); // Refresh the reviews list after submission
      setRating(0);
      setReviewText("");
      setError(null);
    } catch (error: any) {
      setError("Error submitting review. Please try again later.");
    }
  };

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Rating
        name="plugin-rating"
        value={rating || 0}
        onChange={(_, newValue) => setRating(newValue)}
        precision={0.1}
      />
      <TextField
        fullWidth
        label="Write a Review"
        variant="outlined"
        multiline
        rows={4}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        sx={{ marginTop: 2 }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: 2 }}
      >
        Submit Review
      </Button>
    </Box>
  );
};

export default ReviewForm;
