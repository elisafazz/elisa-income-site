import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllComparePairs,
  parseCompareParam,
  formatSlug,
  getStartingPrice,
} from "@/lib/tools";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { RelatedContent } from "@/components/RelatedContent";

type Props = {
  params: Promise<{ pair: string }>;
};

export async function generateStaticParams() {
  return getAllComparePairs().map((pair) => ({ pair }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const result = parseCompareParam(pair);
  if (!result) return {};
  const [a, b] = result;

  return {
    title: `${a.name} vs ${b.name} - Side-by-Side Comparison`,
    description: `${a.name} vs ${b.name}: full comparison of features, pricing, pros, cons, and which to pick for your use case.`,
    openGraph: {
      title: `${a.name} vs ${b.name}`,
      description: `Detailed comparison: ${a.name} vs ${b.name}`,
      type: "website",
    },
  };
}

export default async function ComparePage({ params }: Props) {
  const { pair } = await params;
  const result = parseCompareParam(pair);
  if (!result) notFound();
  const [toolA, toolB] = result;

  const hasAffiliateLinks = Boolean(toolA.affiliateUrl || toolB.affiliateUrl);

  // Build a combined feature set
  const allFeatures = [...new Set([...toolA.features, ...toolB.features])];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${toolA.name} vs ${toolB.name}`,
    description: `Side-by-side comparison of ${toolA.name} and ${toolB.name}`,
  };

  const pricingWinner =
    toolA.pricing.starter !== null && toolB.pricing.starter !== null
      ? toolA.pricing.starter < toolB.pricing.starter
        ? toolA
        : toolB.pricing.starter < toolA.pricing.starter
        ? toolB
        : null
      : null;

  const featureCountA = toolA.features.length;
  const featureCountB = toolB.features.length;
  const featureWinner = featureCountA > featureCountB ? toolA : featureCountB > featureCountA ? toolB : null;

  const faqEntries = [
    {
      q: `Which is better, ${toolA.name} or ${toolB.name}?`,
      a: toolA.rating > toolB.rating
        ? `${toolA.name} scores higher in our review (${toolA.rating}/5 vs ${toolB.rating}/5). However, ${toolB.name} may be a better fit depending on your specific needs and budget.`
        : toolB.rating > toolA.rating
        ? `${toolB.name} scores higher in our review (${toolB.rating}/5 vs ${toolA.rating}/5). However, ${toolA.name} may be a better fit depending on your specific needs and budget.`
        : `Both tools score ${toolA.rating}/5 in our review. The best choice depends on your specific use case, budget, and team size.`,
    },
    {
      q: `Is ${toolA.name} cheaper than ${toolB.name}?`,
      a: pricingWinner
        ? `Yes, ${pricingWinner.name} is cheaper at the Starter tier (${getStartingPrice(pricingWinner.pricing)}).`
        : `Pricing varies by plan. ${toolA.name} starts at ${getStartingPrice(toolA.pricing)} and ${toolB.name} starts at ${getStartingPrice(toolB.pricing)}.`,
    },
    {
      q: `What is the difference between ${toolA.name} and ${toolB.name}?`,
      a: `${toolA.name} focuses on ${toolA.features.slice(0, 2).join(" and ").toLowerCase()}, while ${toolB.name} emphasizes ${toolB.features.slice(0, 2).join(" and ").toLowerCase()}. ${toolA.name} is best for ${toolA.bestFor.map((r) => formatSlug(r) + "s").join(", ")}, while ${toolB.name} suits ${toolB.bestFor.map((r) => formatSlug(r) + "s").join(", ")}.`,
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
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/tools" className="hover:text-gray-900">
          Tools
        </Link>
        <span>/</span>
        <span>Compare</span>
        <span>/</span>
        <span className="text-gray-900">
          {toolA.name} vs {toolB.name}
        </span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        {toolA.name} vs {toolB.name}
      </h1>
      <p className="mt-3 text-lg text-gray-600">
        Full side-by-side comparison of features, pricing, and use cases to help
        you pick the right tool.
      </p>
      <p className="mt-3 text-base text-gray-700">
        <strong>Bottom line:</strong>{" "}
        {pricingWinner && featureWinner && pricingWinner.slug !== featureWinner.slug
          ? `${pricingWinner.name} wins on price (from ${getStartingPrice(pricingWinner.pricing)}), while ${featureWinner.name} offers more features (${featureWinner.features.length} vs ${pricingWinner.features.length}).`
          : pricingWinner
          ? `${pricingWinner.name} is both cheaper and ${pricingWinner.rating >= (pricingWinner === toolA ? toolB : toolA).rating ? "higher-rated" : "competitive"} - a strong pick for most teams.`
          : `Both tools are competitively priced. ${toolA.rating >= toolB.rating ? toolA.name : toolB.name} edges ahead with a ${Math.max(toolA.rating, toolB.rating)}/5 rating.`}
      </p>

      {hasAffiliateLinks && <AffiliateDisclosure />}

      {/* Quick summary cards */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {[toolA, toolB].map((tool) => (
          <div
            key={tool.slug}
            className="rounded-lg border border-gray-200 p-6"
          >
            <Link
              href={`/tools/${tool.slug}`}
              className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {tool.name}
            </Link>
            <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
            <div className="mt-3 flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">
                {tool.rating} / 5
              </span>
              <span className="text-sm text-gray-400">
                From {getStartingPrice(tool.pricing)}
              </span>
            </div>
            {tool.affiliateUrl && (
              <a
                href={tool.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Try {tool.name}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Pricing comparison */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900">
          Pricing Comparison
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left font-semibold text-gray-700">
                  Plan
                </th>
                <th className="py-3 text-center font-semibold text-gray-700">
                  {toolA.name}
                </th>
                <th className="py-3 text-center font-semibold text-gray-700">
                  {toolB.name}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 font-medium text-gray-600">Free</td>
                <td className="py-3 text-center">
                  {toolA.pricing.free ? (
                    <span className="text-green-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
                <td className="py-3 text-center">
                  {toolB.pricing.free ? (
                    <span className="text-green-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 font-medium text-gray-600">Starter</td>
                <td className="py-3 text-center text-gray-700">
                  {toolA.pricing.starter !== null
                    ? `$${toolA.pricing.starter}/mo`
                    : "-"}
                </td>
                <td className="py-3 text-center text-gray-700">
                  {toolB.pricing.starter !== null
                    ? `$${toolB.pricing.starter}/mo`
                    : "-"}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 font-medium text-gray-600">Pro</td>
                <td className="py-3 text-center text-gray-700">
                  {toolA.pricing.pro !== null
                    ? `$${toolA.pricing.pro}/mo`
                    : "-"}
                </td>
                <td className="py-3 text-center text-gray-700">
                  {toolB.pricing.pro !== null
                    ? `$${toolB.pricing.pro}/mo`
                    : "-"}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-600">Enterprise</td>
                <td className="py-3 text-center text-gray-700">
                  {toolA.pricing.enterprise !== null
                    ? `$${toolA.pricing.enterprise}/mo`
                    : "Custom"}
                </td>
                <td className="py-3 text-center text-gray-700">
                  {toolB.pricing.enterprise !== null
                    ? `$${toolB.pricing.enterprise}/mo`
                    : "Custom"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {toolA.pricing.starter !== null && toolB.pricing.starter !== null && (
          <p className="mt-3 text-sm text-gray-500">
            {toolA.pricing.starter < toolB.pricing.starter
              ? `${toolA.name} is cheaper at the Starter tier ($${toolA.pricing.starter}/mo vs $${toolB.pricing.starter}/mo).`
              : toolB.pricing.starter < toolA.pricing.starter
              ? `${toolB.name} is cheaper at the Starter tier ($${toolB.pricing.starter}/mo vs $${toolA.pricing.starter}/mo).`
              : `Both tools are the same price at the Starter tier ($${toolA.pricing.starter}/mo).`}
          </p>
        )}
      </section>

      {/* Feature matrix */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900">Feature Matrix</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left font-semibold text-gray-700">
                  Feature
                </th>
                <th className="py-3 text-center font-semibold text-gray-700">
                  {toolA.name}
                </th>
                <th className="py-3 text-center font-semibold text-gray-700">
                  {toolB.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature) => (
                <tr key={feature} className="border-b border-gray-100">
                  <td className="py-3 text-gray-600">{feature}</td>
                  <td className="py-3 text-center">
                    {toolA.features.includes(feature) ? (
                      <span className="font-medium text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {toolB.features.includes(feature) ? (
                      <span className="font-medium text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Winner sections */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900">
          When to Choose Each
        </h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {[toolA, toolB].map((tool) => (
            <div
              key={tool.slug}
              className="rounded-lg border border-gray-200 p-5"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Choose {tool.name} if you need...
              </p>
              <ul className="mt-3 space-y-2">
                {tool.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 font-bold text-green-600">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1">
                {tool.bestFor.map((role) => (
                  <span
                    key={role}
                    className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600"
                  >
                    {formatSlug(role)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate CTAs */}
      {hasAffiliateLinks && (
        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          {[toolA, toolB].map((tool) =>
            tool.affiliateUrl ? (
              <div
                key={tool.slug}
                className="rounded-lg border border-blue-200 bg-blue-50 p-5 text-center"
              >
                <p className="font-semibold text-gray-900">Try {tool.name}</p>
                {tool.affiliateProgram && (
                  <p className="mt-1 text-xs text-gray-500">
                    {tool.affiliateProgram}
                  </p>
                )}
                <a
                  href={tool.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-3 inline-block rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Get started
                </a>
              </div>
            ) : null
          )}
        </section>
      )}

      {/* Related comparisons */}
      <section className="mt-14 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-base font-semibold text-gray-900">
          Related Comparisons
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {toolA.alternatives
            .filter((s) => s !== toolB.slug)
            .map((s) => (
              <Link
                key={s}
                href={`/compare/${toolA.slug}-vs-${s}`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {toolA.name} vs {formatSlug(s)}
              </Link>
            ))}
          {toolB.alternatives
            .filter((s) => s !== toolA.slug)
            .map((s) => (
              <Link
                key={s}
                href={`/compare/${toolB.slug}-vs-${s}`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {toolB.name} vs {formatSlug(s)}
              </Link>
            ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 space-y-6">
          {faqEntries.map((faq) => (
            <div key={faq.q}>
              <h3 className="text-base font-semibold text-gray-900">{faq.q}</h3>
              <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <RelatedContent
        category={toolA.category}
        roles={[...new Set([...toolA.bestFor, ...toolB.bestFor])]}
      />

      <NewsletterCTA />
    </div>
  );
}
