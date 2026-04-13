import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllTools,
  getToolBySlug,
  formatSlug,
  getStartingPrice,
} from "@/lib/tools";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { RelatedContent } from "@/components/RelatedContent";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: `${tool.name} Review - Pricing, Features & Alternatives`,
    description: `Honest review of ${tool.name}: pricing, key features, pros, cons, and best alternatives. Is it right for your workflow?`,
    openGraph: {
      title: `${tool.name} Review`,
      description: tool.description,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const allTools = getAllTools();
  const alternatives = tool.alternatives
    .map((s) => allTools.find((t) => t.slug === s))
    .filter(Boolean);

  const hasAffiliateLink = Boolean(tool.affiliateUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tool.name,
    description: tool.description,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 1,
    },
  };

  const faqEntries = [
    {
      q: `Is ${tool.name} free?`,
      a: tool.pricing.free
        ? `Yes, ${tool.name} offers a free tier. Paid plans start at ${getStartingPrice(tool.pricing)}.`
        : `No, ${tool.name} does not have a free tier. Plans start at ${getStartingPrice(tool.pricing)}.`,
    },
    {
      q: `What are ${tool.name}'s key features?`,
      a: `${tool.name}'s key features include ${tool.features.slice(0, 4).join(", ")}${tool.features.length > 4 ? `, and ${tool.features.length - 4} more` : ""}.`,
    },
    {
      q: `What are the best alternatives to ${tool.name}?`,
      a: alternatives.length > 0
        ? `The top alternatives to ${tool.name} are ${alternatives.filter(Boolean).map((a) => a!.name).join(", ")}.`
        : `There are no direct alternatives listed for ${tool.name} at this time.`,
    },
    {
      q: `Who is ${tool.name} best for?`,
      a: `${tool.name} is best suited for ${tool.bestFor.map((r) => formatSlug(r) + "s").join(", ")}.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-secondary">
        <Link href="/tools" className="hover:text-foreground">
          Tools
        </Link>
        <span>/</span>
        <span className="capitalize">{formatSlug(tool.category)}</span>
        <span>/</span>
        <span className="text-foreground">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-accent">
            {formatSlug(tool.category)}
          </span>
          <h1 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">
            {tool.name}
          </h1>
          <p className="mt-3 text-lg text-secondary">{tool.description}</p>
          <p className="mt-3 text-base text-secondary">
            {tool.name} scores {tool.rating}/5 in our review{tool.pricing.free ? " and offers a free tier" : `, with plans starting at ${getStartingPrice(tool.pricing)}`}.{" "}
            It is best suited for {tool.bestFor.map((r) => formatSlug(r) + "s").join(" and ")} who need {tool.features.slice(0, 2).join(" and ").toLowerCase()}.{" "}
            {tool.pros[0] ? `A standout strength: ${tool.pros[0].toLowerCase()}.` : ""}
          </p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">
                {tool.rating}
              </span>
              <span className="text-sm text-secondary">/ 5</span>
            </div>
            <span className="text-sm text-tertiary">
              Starting at {getStartingPrice(tool.pricing)}
            </span>
          </div>
        </div>
        {hasAffiliateLink && (
          <a
            href={tool.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="shrink-0 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Try {tool.name}
          </a>
        )}
      </div>

      {hasAffiliateLink && <AffiliateDisclosure />}

      {/* Pricing */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-foreground">Pricing</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {tool.pricing.free && (
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-sm font-medium text-secondary">Free</p>
              <p className="mt-1 text-2xl font-bold text-foreground">$0</p>
              <p className="mt-1 text-xs text-tertiary">Forever</p>
            </div>
          )}
          {tool.pricing.starter !== null && (
            <div className="rounded-lg border border-accent/20 bg-accent-muted p-4 text-center">
              <p className="text-sm font-medium text-accent">Starter</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                ${tool.pricing.starter}
              </p>
              <p className="mt-1 text-xs text-tertiary">per user/mo</p>
            </div>
          )}
          {tool.pricing.pro !== null && (
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-sm font-medium text-secondary">Pro</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                ${tool.pricing.pro}
              </p>
              <p className="mt-1 text-xs text-tertiary">per user/mo</p>
            </div>
          )}
          {tool.pricing.enterprise !== null ? (
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-sm font-medium text-secondary">Enterprise</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                ${tool.pricing.enterprise}
              </p>
              <p className="mt-1 text-xs text-tertiary">per user/mo</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-sm font-medium text-secondary">Enterprise</p>
              <p className="mt-1 text-lg font-bold text-foreground">Custom</p>
              <p className="mt-1 text-xs text-tertiary">Contact sales</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-foreground">Key Features</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tool.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-secondary"
            >
              {feature}
            </span>
          ))}
        </div>
      </section>

      {/* Best For */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-foreground">Best For</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tool.bestFor.map((role) => (
            <Link
              key={role}
              href={`/best/${tool.category}-for-${role}`}
              className="rounded-full border border-accent/20 bg-accent-muted px-3 py-1 text-sm text-accent hover:bg-blue-100 transition-colors"
            >
              {formatSlug(role)}
            </Link>
          ))}
        </div>
      </section>

      {/* Pros and Cons */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-foreground">Pros and Cons</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-green-800 bg-green-950 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-green-400">
              Pros
            </h3>
            <ul className="mt-3 space-y-2">
              {tool.pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2 text-sm text-secondary">
                  <span className="mt-0.5 text-green-400 font-bold">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-red-800 bg-red-950 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-red-400">
              Cons
            </h3>
            <ul className="mt-3 space-y-2">
              {tool.cons.map((con) => (
                <li key={con} className="flex items-start gap-2 text-sm text-secondary">
                  <span className="mt-0.5 text-red-400 font-bold">-</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Affiliate CTA */}
      {hasAffiliateLink && (
        <section className="mt-12 rounded-lg border border-accent/20 bg-accent-muted p-6 text-center">
          <p className="text-base font-semibold text-foreground">
            Ready to try {tool.name}?
          </p>
          <p className="mt-1 text-sm text-secondary">
            {tool.affiliateProgram
              ? `Affiliate note: ${tool.affiliateProgram}`
              : "Start with the free tier - no credit card required."}
          </p>
          <a
            href={tool.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-4 inline-block rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Get started with {tool.name}
          </a>
        </section>
      )}

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-foreground">
            Alternatives to {tool.name}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {alternatives.map((alt) => {
              if (!alt) return null;
              return (
                <Link
                  key={alt.slug}
                  href={`/tools/${alt.slug}`}
                  className="group rounded-lg border border-border p-4 hover:border-border-hover hover:shadow-sm transition-all"
                >
                  <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {alt.name}
                  </p>
                  <p className="mt-1 text-sm text-secondary line-clamp-2">
                    {alt.description}
                  </p>
                  <p className="mt-2 text-xs text-tertiary">
                    {getStartingPrice(alt.pricing)}
                  </p>
                </Link>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {alternatives.map((alt) => {
              if (!alt) return null;
              return (
                <Link
                  key={alt.slug}
                  href={`/compare/${tool.slug}-vs-${alt.slug}`}
                  className="text-sm text-accent hover:text-accent-hover"
                >
                  {tool.name} vs {alt.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 space-y-6">
          {faqEntries.map((faq) => (
            <div key={faq.q}>
              <h3 className="text-base font-semibold text-foreground">{faq.q}</h3>
              <p className="mt-2 text-sm text-secondary">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <RelatedContent
        category={tool.category}
        roles={tool.bestFor}
      />

      <NewsletterCTA />
    </div>
  );
}
