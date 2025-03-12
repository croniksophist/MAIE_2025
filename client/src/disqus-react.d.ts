// src/types/disqus-react.d.ts
declare module 'disqus-react' {
    export const DiscussionEmbed: React.FC<{ shortname: string, config: { url: string, identifier: string, title: string } }>;
  }
  