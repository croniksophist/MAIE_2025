import { DiscussionEmbed } from "disqus-react";

interface BlogPostProps {
  slug: string;
  title: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ slug, title }) => {
  const disqusShortname = "your-disqus-shortname";
  const disqusConfig = {
    url: window.location.href,
    identifier: slug,
    title: title,
  };

  return (
    <div>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default BlogPost;
