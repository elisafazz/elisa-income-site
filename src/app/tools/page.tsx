import type { Metadata } from "next";
import Link from "next/link";
import { getAllTools, getAllCategories, formatSlug, getStartingPrice } from "@/lib/tools";

export const metadata: Metadata = {
  title: "AI and SaaS Tool Directory",
  description:
    "Browse honest reviews of the best AI and SaaS tools. Filter by category, compare pricing, and find the right tools for your workflow.",
  openGraph: {
    title: "AI and SaaS Tool Directory",
    description:
      "Honest reviews of AI and SaaS tools - filter by category and find what fits your workflow.",
    type: "website",
  },
};

export default function ToolsIndexPage() {
  const tools = getAllTools();
  const categories = getAllCategories();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI and SaaS Tool Directory",
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `/tools/${tool.slug}`,
      description: tool.description,
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        Tool Directory
      </h1>
      <p className="mt-3 text-lg text-gray-600">
        {tools.length} tools reviewed. Filter by category or browse the full list.
      </p>

      {/* Category filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        <span className="rounded-full border border-gray-900 bg-gray-900 px-4 py-1.5 text-sm font-medium text-white">
          All
        </span>
        {categories.map((cat) => (
          <a
            key={cat}
            href={`#${cat}`}
            className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            {formatSlug(cat)}
          </a>
        ))}
      </div>

      {/* Tools grouped by category */}
      {categories.map((cat) => {
        const catTools = tools.filter((t) => t.category === cat);
        return (
          <section key={cat} id={cat} className="mt-14">
            <h2 className="text-xl font-semibold text-gray-900">
              {formatSlug(cat)}
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {catTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group rounded-lg border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    <span className="ml-3 shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {tool.rating}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {tool.subcategories.slice(0, 2).map((sub) => (
                      <span
                        key={sub}
                        className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-500"
                      >
                        {formatSlug(sub)}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-medium text-blue-600">
                    {getStartingPrice(tool.pricing)}
                    {tool.pricing.free && tool.pricing.starter !== null
                      ? " (free tier available)"
                      : ""}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* Popular comparisons */}
      <section className="mt-16 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Popular Comparisons
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {tools.flatMap((tool) =>
            tool.alternatives.slice(0, 2).map((altSlug) => (
              <Link
                key={`${tool.slug}-vs-${altSlug}`}
                href={`/compare/${tool.slug}-vs-${altSlug}`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {tool.name} vs {formatSlug(altSlug)}
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
