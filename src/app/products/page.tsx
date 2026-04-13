import type { Metadata } from "next";
import { getAllProducts } from "@/lib/content";

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
          <div
            key={product.slug}
            className="rounded-lg border border-border p-6 flex flex-col"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {product.type}
            </span>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              {product.name}
            </h2>
            <p className="mt-2 flex-1 text-sm text-secondary">
              {product.description}
            </p>
            {product.features.length > 0 && (
              <ul className="mt-3 space-y-1">
                {product.features.map((feature) => (
                  <li key={feature} className="text-sm text-secondary">
                    - {feature}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-foreground">
                {product.price}
              </span>
              <a
                href={product.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
              >
                Get it
              </a>
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
          </div>
        ))}
      </div>
    </div>
  );
}
