import { getAllPosts } from "@/lib/content";
import { Hero } from "@/components/Hero";
import { ArticleGrid } from "@/components/ArticleGrid";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export default function Home() {
  const posts = getAllPosts().slice(0, 6);

  return (
    <>
      <Hero />

      <div className="mx-auto max-w-5xl px-6 pb-16">
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Latest Articles
          </h2>
          <ArticleGrid posts={posts} />
          {posts.length > 0 && (
            <div className="mt-8 text-center">
              <a
                href="/blog"
                className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                View all articles
              </a>
            </div>
          )}
        </section>

        <section className="mt-16">
          <NewsletterSignup />
        </section>
      </div>
    </>
  );
}
