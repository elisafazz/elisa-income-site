import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          AI Tool Breakdown
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/blog" className="hover:text-gray-900 transition-colors">
            Blog
          </Link>
          <Link
            href="/products"
            className="hover:text-gray-900 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="hover:text-gray-900 transition-colors"
          >
            About
          </Link>
          <Link
            href="/newsletter"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
          >
            Newsletter
          </Link>
        </div>
      </nav>
    </header>
  );
}
