import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="font-heading text-sm font-semibold text-foreground">
              AI Tool Breakdown
            </p>
            <p className="mt-2 text-sm text-secondary">
              Honest, in-depth AI and SaaS tool reviews. No vendor bias.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Content</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-secondary hover:text-accent transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-sm text-secondary hover:text-accent transition-colors"
                >
                  Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-secondary hover:text-accent transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="text-sm text-secondary hover:text-accent transition-colors"
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Legal</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-secondary hover:text-accent transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate-disclosure"
                  className="text-sm text-secondary hover:text-accent transition-colors"
                >
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-tertiary">
          {new Date().getFullYear()} AI Tool Breakdown. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
