import { useEffect, useState } from "react";
import axios from "axios";
import SchemaMarkup from '../../components/SchemaMarkup';

// Define the structure of a Post
interface Post {
  id: number;
  attributes: {
    title: string;
    slug: string;
  };
}

// Define the structure of the API response
interface BlogResponse {
  data: Post[];
}

const BlogList = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios.get<BlogResponse>("http://localhost:1337/api/blogs")
      .then((res) => setPosts(res.data.data))  // Ensure data matches the Post type
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>MAIE Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/blog/${post.attributes.slug}`}>{post.attributes.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
