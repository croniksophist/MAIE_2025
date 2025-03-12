import { Helmet } from "react-helmet-async";

interface SchemaProps {
  type: string;
  title: string;
  description: string;
  url: string;
  author?: string;
  datePublished?: string;
  image?: string;
}

const SchemaMarkup: React.FC<SchemaProps> = ({
  type,
  title,
  description,
  url,
  author = "Media AI Exchange",
  datePublished = new Date().toISOString(),
  image = "/default-image.jpg",
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": type,
    "headline": title,
    "description": description,
    "url": url,
    "author": { "@type": "Person", "name": author },
    "publisher": { "@type": "Organization", "name": "Media AI Exchange" },
    "datePublished": datePublished,
    "image": image,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup;
