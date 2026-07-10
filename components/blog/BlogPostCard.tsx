import { BlogPost } from "@/app/blog/constants/constants";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const FeaturedPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <article className="p-8 md:p-12 rounded-2xl bg-gray-200 dark:bg-stone-800 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
      <div className="flex-1 flex flex-col gap-4">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
          Featured Article
        </span>
        <h3 className="text-3xl md:text-4xl font-bold">{post.title}</h3>
        <p className="text-lg text-stone-700 dark:text-stone-300 max-w-xl">
          {post.description}
        </p>
        <Link
          href={`/blog/${post.id}`}
          className="inline-flex items-center gap-2 mt-4 font-semibold text-stone-900 dark:text-white hover:text-stone-600 dark:hover:text-stone-300 transition-colors group w-max"
          aria-label={`Read the full featured story: ${post.title}`}
        >
          Read the full story
          <ArrowRight
            aria-hidden="true"
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
};

export const BlogPostCard = ({ post }: { post: BlogPost }) => {
  const stringDate = new Date(post.date).toISOString();

  return (
    <article className="p-6 rounded-xl bg-gray-200 dark:bg-stone-800 flex flex-col gap-4 transition-all hover:bg-gray-300 dark:hover:bg-stone-700 duration-300 group">
      <header className="flex justify-between items-center text-sm font-medium text-stone-500 dark:text-stone-400">
        <span className="uppercase tracking-wider text-xs">
          {post.category}
        </span>
        <time dateTime={stringDate}>{post.date}</time>
      </header>

      <h3 className="text-xl font-bold leading-tight">{post.title}</h3>

      <p className="text-stone-700 dark:text-stone-300 flex-1 text-sm leading-relaxed">
        {post.description}
      </p>

      <Link
        href={`/blog/${post.id}`}
        className="inline-flex items-center gap-1 font-semibold text-sm mt-2 hover:text-stone-600 dark:hover:text-stone-300 transition-colors w-max"
        aria-label={`Read article: ${post.title}`}
      >
        Read Article
        <ArrowRight
          aria-hidden="true"
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </article>
  );
};
