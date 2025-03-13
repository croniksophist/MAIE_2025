import React, { useState } from 'react';
import { TextField, Button, Rating } from '@mui/material';
import axios from 'axios';

const ReviewForm = ({ pluginId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/plugin/reviews/', {
        rating,
        review_text: reviewText,
        plugin_id: pluginId,
        user_id: 1,  // Assuming you have the user ID
      });
      console.log('Review submitted', response.data);
    } catch (error) {
      console.error('Error submitting review', error);
    }
  };

  return (
    <div>
      <h3>Submit a Review</h3>
      <Rating
        name="plugin-rating"
        value={rating}
        onChange={(event, newValue) => setRating(newValue)}
      />
      <TextField
        label="Review"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        fullWidth
        multiline
        rows={4}
      />
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Submit Review
      </Button>
    </div>
  );
};

export default ReviewForm;
