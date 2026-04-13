import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">AI Tool Breakdown</p>
            <p className="mt-2 text-sm text-gray-500">
              Honest, in-depth AI and SaaS tool reviews. No vendor bias.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Content</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Legal</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate-disclosure"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          {new Date().getFullYear()} AI Tool Breakdown. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
