import type { BlogPost } from "@/types/content";
import { BlogCard } from "@/components/cards/BlogCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="home-blog">
      <div className="home-source-container">
        <SectionHeading eyebrow="Blog & News" title="Dental Advice For Confident Patients" center className="home-blog-title home-blog-heading" />
        <div className="home-blog-grid">
          {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
        </div>
      </div>
    </section>
  );
}
