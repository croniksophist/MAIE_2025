import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import SchemaMarkup from '../../components/SchemaMarkup';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState({ title: "", description: "", content: "" });

  useEffect(() => {
    import(`../content/${slug}.md`)
      .then(async (file) => {
        const rawContent = await fetch(file.default).then((res) => res.text());
        const { data, content } = matter(rawContent);
        const processedContent = await remark().use(html).process(content);
        setPost({ ...data, content: processedContent.toString() });
      })
      .catch(() => console.error("Post not found"));
  }, [slug]);

  return (
    <div>
      <SchemaMarkup
        type="BlogPosting"
        title={post.title}
        description={post.description}
        url={window.location.href}
      />
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default BlogPost;
