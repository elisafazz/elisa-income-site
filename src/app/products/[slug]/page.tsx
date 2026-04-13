import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/content";
import { NewsletterCTA } from "@/components/NewsletterCTA";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.name} - ${product.price}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-secondary">
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-accent">
            {product.type}
          </span>
          <h1 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-secondary">{product.description}</p>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-3">
          <span className="text-3xl font-bold text-foreground">
            {product.price}
          </span>
          <a
            href={product.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-background hover:bg-accent-hover transition-colors"
          >
            Buy on Gumroad
          </a>
        </div>
      </div>

      {/* Platforms */}
      {product.platforms.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {product.platforms.map((platform) => (
            <span
              key={platform}
              className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-secondary"
            >
              {platform}
            </span>
          ))}
        </div>
      )}

      {/* Features */}
      {product.features.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-foreground">
            What You Get
          </h2>
          <ul className="mt-4 space-y-3">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-secondary"
              >
                <span className="mt-0.5 font-bold text-accent">+</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA */}
      <section className="mt-12 rounded-lg border border-accent/20 bg-accent-muted p-6 text-center">
        <p className="text-base font-semibold text-foreground">
          Ready to get {product.name}?
        </p>
        <p className="mt-1 text-sm text-secondary">
          Instant download after purchase. No subscription required.
        </p>
        <a
          href={product.buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-background hover:bg-accent-hover transition-colors"
        >
          Buy on Gumroad - {product.price}
        </a>
      </section>

      {/* Disclosure */}
      <aside className="mt-8 text-xs text-tertiary">
        <p>
          All purchases are handled through Gumroad. Digital products are
          delivered instantly after payment. See our{" "}
          <a href="/affiliate-disclosure" className="underline">
            disclosure policy
          </a>
          .
        </p>
      </aside>

      <NewsletterCTA />
    </div>
  );
}
