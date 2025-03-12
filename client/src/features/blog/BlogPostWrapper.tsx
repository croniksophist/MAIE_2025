// src/features/blog/BlogPostWrapper.tsx

import { useParams } from 'react-router-dom';
import BlogPost from './BlogPost'; // Path to your BlogPost component

const BlogPostWrapper = () => {
  const { slug } = useParams<{ slug: string }>(); // Get the slug from the URL
  
  if (!slug) return <div>Loading...</div>; // Handle the case where slug is not available

  // Assuming the title is fetched elsewhere or is part of the data
  const title = "Example Title"; // Replace this with actual title fetching logic

  return <BlogPost slug={slug} title={title} />;
};

export default BlogPostWrapper;
