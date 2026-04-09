import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export default function Home() {
  const posts = getAllPosts().slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Find the right AI tools for your workflow
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Honest, in-depth comparisons of AI and SaaS tools. No vendor bias, no
          fluff - real reviews from someone who actually uses them.
        </p>
      </section>

      {posts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-lg border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
                  {post.category}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {post.description}
                </p>
                <time className="mt-3 block text-xs text-gray-400">
                  {post.date}
                </time>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all articles
            </Link>
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <section className="mt-16 text-center">
          <p className="text-gray-500">
            Articles coming soon. Subscribe to get notified.
          </p>
        </section>
      )}

      <section className="mt-16">
        <NewsletterSignup />
      </section>
    </div>
  );
}
