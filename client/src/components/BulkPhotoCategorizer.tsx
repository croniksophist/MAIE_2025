import React, { useEffect, useState } from 'react';
import { fetchGooglePhotos } from '../services/googlePhotos';
import { analyzeImage } from '../services/photoAI';
import { fetchAWSBucketImages } from '../services/api'; // Custom service to get images from AWS S3
import { CircularProgress, Grid, Card, CardMedia, Typography, Box } from '@mui/material';

// Categorized photo structure
interface CategorizedPhoto {
  imageUrl: string;
  categories: string[];
}

const BulkPhotoCategorizer: React.FC = () => {
  const [googlePhotos, setGooglePhotos] = useState<any[]>([]);
  const [awsPhotos, setAwsPhotos] = useState<any[]>([]);
  const [categorizedPhotos, setCategorizedPhotos] = useState<CategorizedPhoto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      
      // Fetch photos from Google Photos
      const googlePhotosData = await fetchGooglePhotos("YOUR_GOOGLE_ACCESS_TOKEN");
      setGooglePhotos(googlePhotosData);

      // Fetch photos from AWS S3 Bucket (adjust as needed for your API)
      const awsPhotosData = await fetchAWSBucketImages();
      setAwsPhotos(awsPhotosData);

      setLoading(false);
    };

    fetchPhotos();
  }, []);

  const categorizePhotos = async (photos: any[]) => {
    setLoading(true);
    const categorized: CategorizedPhoto[] = [];

    for (const photo of photos) {
      const categories = await analyzeImage(photo.url); // Call the analyzeImage method
      if (categories) {
        categorized.push({
          imageUrl: photo.url,
          categories: categories.labelAnnotations.map((label: any) => label.description),
        });
      }
    }

    setCategorizedPhotos(categorized);
    setLoading(false);
  };

  const handleCategorizePhotos = () => {
    const allPhotos = [...googlePhotos, ...awsPhotos];
    categorizePhotos(allPhotos);
  };

  return (
    <Box>
      <Typography variant="h4">Bulk Photo Categorization</Typography>

      <Box my={2}>
        <button onClick={handleCategorizePhotos} disabled={loading}>
          {loading ? 'Categorizing...' : 'Categorize All Photos'}
        </button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {categorizedPhotos.map((photo, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardMedia component="img" alt={`Image ${index}`} image={photo.imageUrl} />
                <Box p={2}>
                  <Typography variant="h6">Categories</Typography>
                  <ul>
                    {photo.categories.map((category, idx) => (
                      <li key={idx}>{category}</li>
                    ))}
                  </ul>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BulkPhotoCategorizer;
