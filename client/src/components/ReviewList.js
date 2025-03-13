import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Paper } from '@mui/material';

const ReviewList = ({ pluginId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/plugin/reviews/${pluginId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    };
    
    fetchReviews();
  }, [pluginId]);

  return (
    <div>
      <h3>Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Paper key={review.id} style={{ padding: '10px', marginBottom: '10px' }}>
            <Typography variant="h6">Rating: {review.rating}/5</Typography>
            <Typography>{review.review_text}</Typography>
          </Paper>
        ))
      ) : (
        <Typography>No reviews yet.</Typography>
      )}
    </div>
  );
};

export default ReviewList;
