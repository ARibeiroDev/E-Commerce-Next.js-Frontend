import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, User2Icon } from "lucide-react";
import { BLOG_POSTS, ContentBlock } from "../constants/constants";

type BlogPostParams = {
  id: string;
};

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    id: post.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<BlogPostParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => p.id === parseInt(id) || p.id === id);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

// Block renderer helper for strucctured content
const BlockRenderer = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case "paragraph":
      return <p className="leading-relaxed">{block.text}</p>;
    case "h3":
      return <h3 className="text-2xl font-bold mt-10 mb-4">{block.text}</h3>;
    case "h4":
      return <h4 className="text-2xl font-bold mt-8 mb-4">{block.text}</h4>;
    case "blockquote":
      return (
        <blockquote className="border-l-4 border-stone-800 dark:border-gray-100 pl-6 my-8 italic text-xl font-medium text-stone-600 dark:text-stone-300">
          &quot;{block.text}&quot;
        </blockquote>
      );
    case "image":
      return block.url ? (
        <figure className="relative w-full max-w-4xl m-auto aspect-video my-10 overflow-hidden rounded-xl">
          <Image
            src={block.url}
            alt={block.alt || "Blog content image"}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </figure>
      ) : (
        <figure className="w-full max-w-4xl aspect-video bg-gray-200 dark:bg-stone-800 rounded-xl flex items-center justify-center text-stone-400 dark:text-stone-600 my-8">
          <ImageIcon aria-hidden="true" size={32} />
        </figure>
      );
    default:
      return null;
  }
};

const BlogPostPage = async ({
  params,
}: {
  params: Promise<BlogPostParams>;
}) => {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => p.id.toString() === id);

  if (!post) {
    notFound();
  }

  const stringDate = new Date(post.date).toISOString();

  return (
    <main className="flex-1 px-[5vw] lg:px-[10vw] py-12 animate-appear flex flex-col gap-10">
      <nav aria-label="Breadcrumb">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-gray-100 transition-colors group"
        >
          <ArrowLeft
            aria-hidden="true"
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Blog
        </Link>
      </nav>

      <header className="flex flex-col gap-6">
        <div className="flex items-center gap-3 text-sm font-medium text-stone-500 dark:text-stone-400">
          <span className="uppercase tracking-widest">{post.category}</span>
          <span>•</span>
          <time dateTime={stringDate}>{post.date}</time>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          {post.title}
        </h2>
      </header>

      {post.featuredImage && (
        <figure className="relative w-full max-h-150 aspect-video md:aspect-21/9 rounded-2xl overflow-hidden">
          <Image
            src={post.featuredImage}
            fill
            alt={`Featured image for ${post.title}`}
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 80vw"
          />
          <figcaption className="sr-only">{post.description}</figcaption>
        </figure>
      )}

      <article className="max-w-3xl flex flex-col gap-4 text-lg">
        {post.content.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </article>

      <footer className="mt-12 pt-12 border-t border-gray-300 dark:border-stone-700 max-w-3xl">
        <div className="p-6 rounded-xl bg-gray-200 dark:bg-stone-800 flex items-center gap-6">
          <div
            className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300 dark:bg-stone-700 shrink-0"
            aria-hidden="true"
          >
            <User2Icon size={40} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Written By
            </span>
            <h3 className="text-lg font-bold mt-1">{post.author}</h3>
            {post.authorRole && (
              <p className="text-stone-600 dark:text-stone-400 text-sm">
                {post.authorRole} at ClothingCo.
              </p>
            )}
          </div>
        </div>
      </footer>
    </main>
  );
};

export default BlogPostPage;
