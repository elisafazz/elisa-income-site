import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "In-depth AI and SaaS tool comparisons, reviews, and guides. Updated weekly.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
      <p className="mt-2 text-gray-600">
        Honest tool comparisons, how-to guides, and reviews.
      </p>

      {posts.length === 0 && (
        <p className="mt-8 text-gray-500">
          First articles coming soon. Check back or subscribe to the newsletter.
        </p>
      )}

      <div className="mt-8 divide-y divide-gray-200">
        {posts.map((post) => (
          <article key={post.slug} className="py-6">
            <Link href={`/blog/${post.slug}`} className="group">
              <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
                {post.category}
              </span>
              <h2 className="mt-1 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-gray-600">{post.description}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                <time>{post.date}</time>
                {post.tags.length > 0 && (
                  <div className="flex gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-gray-100 px-2 py-0.5 text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
