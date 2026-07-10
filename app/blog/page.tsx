import { Metadata } from "next";
import { BLOG_POSTS } from "./constants/constants";
import { BlogPostCard, FeaturedPostCard } from "@/components/blog/BlogPostCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read the latest news, styling tips, and updates from ClothingCo.",
};

const BlogPage = () => {
  const featuredPost =
    BLOG_POSTS.find((post) => post.isFeatured) || BLOG_POSTS[0];
  const standardPosts = BLOG_POSTS.filter((post) => !post.isFeatured);

  return (
    <main className="flex-1 px-[5vw] lg:px-[10vw] py-12 animate-appear flex flex-col gap-12">
      <header className="max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">The Blog</h2>
        <p className="text-lg text-stone-600 dark:text-stone-400">
          Style guides, company news, and insights directly from our design
          studio.
        </p>
      </header>

      {featuredPost && (
        <section aria-labelledby="featured-post-heading">
          <h3 id="featured-post-heading" className="sr-only">
            Featured Post
          </h3>
          <FeaturedPostCard post={featuredPost} />
        </section>
      )}

      <section aria-labelledby="latest-posts-heading">
        <h3 id="latest-posts-heading" className="sr-only">
          Latest Posts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
