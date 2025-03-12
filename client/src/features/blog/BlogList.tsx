import { Link } from "react-router-dom";
import SchemaMarkup from '../../components/SchemaMarkup';

const BlogList = () => {
  const posts = [
    { slug: "ai-in-media", title: "How AI is Changing Media Production" },
    { slug: "cloud-editing", title: "Cloud-Based Video Editing Revolution" },
  ];

  return (
    <div>
      <h1>MAIE Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
