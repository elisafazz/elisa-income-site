import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { remark } from "remark";
import html from "remark-html";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

async function renderMarkdown(content: string): Promise<string> {
  const result = await remark().use(html, { sanitize: false }).process(content);
  return result.toString();
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const hasAffiliateLinks = post.affiliatePrograms.length > 0;
  const contentHtml = await renderMarkdown(post.content);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <header>
        <span className="text-xs font-medium uppercase tracking-wide text-accent">
          {post.category}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-lg text-secondary">{post.description}</p>
        <div className="mt-4 flex items-center gap-3 text-sm text-secondary">
          <span>{post.author}</span>
          <span>-</span>
          <time>{post.date}</time>
        </div>
      </header>

      {hasAffiliateLinks && <AffiliateDisclosure />}

      <div className="prose prose-dark mt-8 max-w-none prose-headings:font-semibold prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <NewsletterCTA />
      </div>
    </article>
  );
}
