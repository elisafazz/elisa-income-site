import Link from "next/link";
import { getRelevantProducts } from "@/lib/product-matching";

interface ProductCTAProps {
  category: string;
  roles?: string[];
}

export function ProductCTA({ category, roles = [] }: ProductCTAProps) {
  const products = getRelevantProducts(category, roles);
  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="space-y-4">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group block rounded-lg border border-border p-5 hover:border-accent/30 hover:bg-surface/50 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="text-xs font-medium uppercase tracking-wide text-accent">
                  {product.type}
                </span>
                <p className="mt-1 font-semibold text-foreground group-hover:text-accent transition-colors">
                  {product.name}
                </p>
                <p className="mt-1 text-sm text-secondary line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="rounded-full bg-accent-muted px-3 py-1 text-sm font-semibold text-accent">
                  ${product.price}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
