import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "./constants/constants";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read the latest news, styling tips, and updates from ClothingCo.",
};

const BlogPage = () => {
  return (
    <main className="flex-1 px-[5vw] lg:px-[10vw] py-12 animate-appear flex flex-col gap-12">
      <header className="max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">The Blog</h2>
        <p className="text-lg text-stone-600 dark:text-stone-400">
          Style guides, company news, and insights directly from our design
          studio.
        </p>
      </header>

      {/* Featured Post */}
      <section>
        <article className="p-8 md:p-12 rounded-2xl bg-gray-200 dark:bg-stone-800 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
          <div className="flex-1 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Featured Article
            </span>
            <h3 className="text-3xl md:text-4xl font-bold">
              The Fall/Winter 2026 Lookbook is Here
            </h3>
            <p className="text-lg text-stone-700 dark:text-stone-300 max-w-xl">
              Explore our new collection featuring heavy knits,
              weather-resistant outerwear, and the introduction of our new
              earth-tone color palette.
            </p>
            <Link
              href="/blog/fw26-lookbook"
              className="inline-flex items-center gap-2 mt-4 font-semibold text-stone-900 dark:text-white hover:text-stone-600 dark:hover:text-stone-300 transition-colors group w-max"
            >
              Read the full story
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </article>
      </section>

      {/* Standard Posts Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            className="p-6 rounded-xl bg-gray-200 dark:bg-stone-800 flex flex-col gap-4 transition-all hover:bg-gray-300 dark:hover:bg-stone-700 duration-300 group"
          >
            <div className="flex justify-between items-center text-sm font-medium text-stone-500 dark:text-stone-400">
              <span>{post.category}</span>
              <time>{post.date}</time>
            </div>
            <h3 className="text-xl font-bold leading-tight">{post.title}</h3>
            <p className="text-stone-700 dark:text-stone-300 flex-1 text-sm leading-relaxed">
              {post.description}
            </p>
            <Link
              href={`/blog/${post.id}`}
              className="inline-flex items-center gap-1 font-semibold text-sm mt-2 hover:text-stone-600 dark:hover:text-stone-300 transition-colors w-max"
            >
              Read Article
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
};

export default BlogPage;
