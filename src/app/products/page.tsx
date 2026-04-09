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
      <h1 className="text-3xl font-bold text-gray-900">Products</h1>
      <p className="mt-2 text-gray-600">
        Templates, prompt packs, and guides to get more out of your AI tools.
      </p>

      {products.length === 0 && (
        <p className="mt-8 text-gray-500">
          First products launching soon. Subscribe to the newsletter to get
          notified.
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.slug}
            className="rounded-lg border border-gray-200 p-6 flex flex-col"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
              {product.type}
            </span>
            <h2 className="mt-2 text-lg font-semibold text-gray-900">
              {product.name}
            </h2>
            <p className="mt-2 flex-1 text-sm text-gray-600">
              {product.description}
            </p>
            {product.features.length > 0 && (
              <ul className="mt-3 space-y-1">
                {product.features.map((feature) => (
                  <li key={feature} className="text-sm text-gray-500">
                    - {feature}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                {product.price}
              </span>
              <a
                href={product.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Get it
              </a>
            </div>
            {product.platforms.length > 0 && (
              <div className="mt-2 flex gap-1">
                {product.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
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
