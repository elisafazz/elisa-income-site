import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/content";
import { NewsletterCTA } from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Digital products to level up your AI and SaaS workflow - templates, prompt packs, guides, and more.",
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">Products</h1>
      <p className="mt-2 text-secondary">
        Templates, prompt packs, and guides to get more out of your AI tools.
      </p>

      {products.length === 0 && (
        <p className="mt-8 text-secondary">
          First products launching soon. Subscribe to the newsletter to get
          notified.
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group rounded-lg border border-border p-6 flex flex-col hover:border-border-hover hover:shadow-sm transition-all"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {product.type}
            </span>
            <h2 className="mt-2 text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
              {product.name}
            </h2>
            <p className="mt-2 flex-1 text-sm text-secondary">
              {product.description}
            </p>
            {product.features.length > 0 && (
              <ul className="mt-3 space-y-1">
                {product.features.slice(0, 3).map((feature) => (
                  <li key={feature} className="text-sm text-secondary">
                    - {feature}
                  </li>
                ))}
                {product.features.length > 3 && (
                  <li className="text-sm text-tertiary">
                    + {product.features.length - 3} more
                  </li>
                )}
              </ul>
            )}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-foreground">
                {product.price}
              </span>
              <span className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white group-hover:bg-accent-hover transition-colors">
                View details
              </span>
            </div>
            {product.platforms.length > 0 && (
              <div className="mt-2 flex gap-1">
                {product.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="rounded bg-surface-elevated px-2 py-0.5 text-xs text-secondary"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      <NewsletterCTA />
    </div>
  );
}
