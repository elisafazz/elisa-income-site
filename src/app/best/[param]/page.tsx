import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllBestForParams,
  parseBestForParam,
  formatSlug,
  getStartingPrice,
} from "@/lib/tools";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { NewsletterCTA } from "@/components/NewsletterCTA";

type Props = {
  params: Promise<{ param: string }>;
};

export async function generateStaticParams() {
  return getAllBestForParams().map((param) => ({ param }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { param } = await params;
  const result = parseBestForParam(param);
  if (!result) return {};

  const categoryLabel = formatSlug(result.category);
  const roleLabel = formatSlug(result.role);

  return {
    title: `Best ${categoryLabel} Tools for ${roleLabel}s`,
    description: `The ${result.tools.length} best ${categoryLabel} tools for ${roleLabel}s in 2026. Ranked by features, pricing, and real-world fit.`,
    openGraph: {
      title: `Best ${categoryLabel} Tools for ${roleLabel}s`,
      description: `Ranked list of ${categoryLabel} tools built for ${roleLabel}s - with pricing, pros, cons, and affiliate links.`,
      type: "website",
    },
  };
}

export default async function BestForPage({ params }: Props) {
  const { param } = await params;
  const result = parseBestForParam(param);
  if (!result) notFound();

  const { category, role, tools } = result;
  const categoryLabel = formatSlug(category);
  const roleLabel = formatSlug(role);
  const hasAffiliateLinks = tools.some((t) => Boolean(t.affiliateUrl));

  const topPick = tools[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best ${categoryLabel} Tools for ${roleLabel}s`,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `/tools/${tool.slug}`,
      description: tool.description,
    })),
  };

  const faqEntries = [
    {
      q: `What is the best ${categoryLabel.toLowerCase()} tool for ${roleLabel.toLowerCase()}s?`,
      a: topPick
        ? `Our top pick is ${topPick.name} (${topPick.rating}/5). ${topPick.description} It stands out for ${topPick.pros[0]?.toLowerCase() || "its overall quality"}.`
        : `We reviewed ${tools.length} tools in this category. See our ranked list above for the latest recommendations.`,
    },
    {
      q: `How much do ${categoryLabel.toLowerCase()} tools cost?`,
      a: `Pricing varies widely. ${tools.filter((t) => t.pricing.free).length} of the ${tools.length} tools we reviewed offer free tiers. Paid plans typically start at $${Math.min(...tools.map((t) => typeof t.pricing.starter === "number" ? t.pricing.starter : 999).filter((p) => p < 999))}/month.`,
    },
    {
      q: `How many ${categoryLabel.toLowerCase()} tools did you review for ${roleLabel.toLowerCase()}s?`,
      a: `We reviewed and ranked ${tools.length} ${categoryLabel.toLowerCase()} tools specifically for ${roleLabel.toLowerCase()}s, evaluating features, pricing, ease of use, and real-world fit.`,
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
        <Link
          href={`/tools#${category}`}
          className="hover:text-foreground capitalize"
        >
          {categoryLabel}
        </Link>
        <span>/</span>
        <span className="text-foreground">For {roleLabel}s</span>
      </nav>

      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
        Best {categoryLabel} Tools for {roleLabel}s
      </h1>
      <p className="mt-3 text-lg text-secondary">
        {tools.length} tools reviewed and ranked for {roleLabel}s. Updated April
        2026.
      </p>

      {topPick && (
        <div className="mt-4 rounded-lg border border-accent/20 bg-accent-muted p-4">
          <p className="text-sm font-semibold text-accent">Top pick</p>
          <p className="mt-1 text-base text-foreground">
            <Link href={`/tools/${topPick.slug}`} className="font-bold hover:text-accent transition-colors">
              {topPick.name}
            </Link>{" "}
            ({topPick.rating}/5, from {getStartingPrice(topPick.pricing)}) - {topPick.pros[0]?.toLowerCase() || topPick.description.toLowerCase()}.
          </p>
        </div>
      )}

      {hasAffiliateLinks && <AffiliateDisclosure />}

      {/* Ranked list */}
      <div className="mt-10 space-y-8">
        {tools.map((tool, index) => (
          <div
            key={tool.slug}
            className="rounded-lg border border-border p-6"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-xl font-bold text-foreground hover:text-accent transition-colors"
                    >
                      {tool.name}
                    </Link>
                    <p className="mt-1 text-sm text-secondary">
                      {tool.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-secondary">
                      {tool.rating} / 5
                    </p>
                    <p className="text-xs text-tertiary">
                      {getStartingPrice(tool.pricing)}
                    </p>
                  </div>
                </div>

                {/* Why it's good for this role */}
                <div className="mt-4">
                  <p className="text-sm font-semibold text-secondary">
                    Why it works for {roleLabel}s
                  </p>
                  <ul className="mt-2 space-y-1">
                    {tool.pros.map((pro) => (
                      <li
                        key={pro}
                        className="flex items-start gap-2 text-sm text-secondary"
                      >
                        <span className="mt-0.5 font-bold text-green-400">
                          +
                        </span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Caveats */}
                {tool.cons.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-secondary">
                      Watch out for
                    </p>
                    <ul className="mt-2 space-y-1">
                      {tool.cons.slice(0, 2).map((con) => (
                        <li
                          key={con}
                          className="flex items-start gap-2 text-sm text-secondary"
                        >
                          <span className="mt-0.5 font-bold text-red-400">
                            -
                          </span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pricing row */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex gap-2">
                    {tool.pricing.free && (
                      <span className="rounded bg-green-950 px-2 py-0.5 text-xs font-medium text-green-400">
                        Free tier
                      </span>
                    )}
                    {tool.pricing.starter !== null && (
                      <span className="rounded bg-surface-elevated px-2 py-0.5 text-xs text-secondary">
                        Starter ${tool.pricing.starter}/mo
                      </span>
                    )}
                    {tool.pricing.pro !== null && (
                      <span className="rounded bg-surface-elevated px-2 py-0.5 text-xs text-secondary">
                        Pro ${tool.pricing.pro}/mo
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 ml-auto">
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-sm text-accent hover:text-accent-hover"
                    >
                      Full review
                    </Link>
                    {tool.affiliateUrl && (
                      <a
                        href={tool.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
                      >
                        Try it
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compare section */}
      {tools.length >= 2 && (
        <section className="mt-14 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-foreground">
            Compare head-to-head
          </h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {tools.flatMap((toolA, i) =>
              tools.slice(i + 1).map((toolB) => (
                <Link
                  key={`${toolA.slug}-vs-${toolB.slug}`}
                  href={`/compare/${toolA.slug}-vs-${toolB.slug}`}
                  className="text-sm text-accent hover:text-accent-hover"
                >
                  {toolA.name} vs {toolB.name}
                </Link>
              ))
            )}
          </div>
        </section>
      )}

      {/* Related best-for pages */}
      <section className="mt-8 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-base font-semibold text-foreground">
          More {categoryLabel} guides
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {[
            ...new Set(tools.flatMap((t) => t.bestFor).filter((r) => r !== role)),
          ]
            .slice(0, 6)
            .map((r) => (
              <Link
                key={r}
                href={`/best/${category}-for-${r}`}
                className="text-sm text-accent hover:text-accent-hover"
              >
                Best {categoryLabel} for {formatSlug(r)}s
              </Link>
            ))}
        </div>
      </section>

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

      <NewsletterCTA />
    </div>
  );
}
