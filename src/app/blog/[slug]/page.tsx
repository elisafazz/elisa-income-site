import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { NewsletterSignup } from "@/components/NewsletterSignup";

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

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const hasAffiliateLinks = post.affiliatePrograms.length > 0;

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
        {/* Content will be rendered here once MDX or markdown rendering is added */}
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} />
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <NewsletterSignup />
      </div>
    </article>
  );
}

function markdownToHtml(markdown: string): string {
  // Simple markdown to HTML conversion for headings, paragraphs, bold, links, lists
  return markdown
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("### "))
        return `<h3>${processInline(trimmed.slice(4))}</h3>`;
      if (trimmed.startsWith("## "))
        return `<h2>${processInline(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("# "))
        return `<h1>${processInline(trimmed.slice(2))}</h1>`;
      if (trimmed.startsWith("- ")) {
        const items = trimmed
          .split("\n")
          .filter((l) => l.startsWith("- "))
          .map((l) => `<li>${processInline(l.slice(2))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${processInline(trimmed)}</p>`;
    })
    .join("\n");
}

function processInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
}
